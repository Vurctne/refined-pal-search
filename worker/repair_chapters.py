"""Phase 2.C remediation: rebuild chapter arrays from bundle + tails.

Fixes the Patch-Jsx merge bug where 54 entries had all chapters concatenated
into a single { title, href } object, plus 8 entries that had partial chapter
coverage. Reads the snippets bundle (chapter title/url) and tails output
(per-chapter keyword tail) and rewrites only the `chapters: [...]` array of
each affected entry.

Usage (from project root):
    python worker/repair_chapters.py
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BUNDLE = ROOT / ".work-queue" / "snippets-bundle-for-tails.json"
TAILS = ROOT / ".work-queue" / "tails-output.json"
DIAG = ROOT / ".work-queue" / "diag" / "diagnostic.json"
JSX = ROOT / "src" / "PALSearch.jsx"


def escape_js_string(s: str) -> tuple[str, int]:
    """Escape backslash and single-quote for a JS single-quoted string."""
    out = s.replace("\\", "\\\\")
    n = out.count("'")
    out = out.replace("'", "\\'")
    return out, n


def find_entry_block(src: str, entry_id: int) -> tuple[int, int] | None:
    """Locate `{ id: <entry_id>, ... }` block; return (open_brace_idx, close_brace_idx_exclusive).

    We require an integer id (not 3.5 etc): the next char after the digits
    must be a comma, not a dot.
    """
    pattern = re.compile(rf"\bid:\s*{entry_id}(?=[,\s])")
    for m in pattern.finditer(src):
        # Step backward to find the opening `{`
        i = m.start() - 1
        # Skip whitespace
        while i >= 0 and src[i] in " \t":
            i -= 1
        # Now we expect `{`
        if i < 0 or src[i] != "{":
            continue
        open_idx = i
        # Now brace-count forward
        depth = 0
        j = open_idx
        # Use simple brace counting that ignores braces inside strings
        in_str = False
        str_quote = ""
        while j < len(src):
            c = src[j]
            if in_str:
                if c == "\\":
                    j += 2
                    continue
                if c == str_quote:
                    in_str = False
            else:
                if c in ("'", '"', "`"):
                    in_str = True
                    str_quote = c
                elif c == "{":
                    depth += 1
                elif c == "}":
                    depth -= 1
                    if depth == 0:
                        return open_idx, j + 1
            j += 1
        return None
    return None


def find_chapters_block(src: str, start: int, end: int) -> tuple[int, int, int] | None:
    """Find the `chapters: [` ... `]` block inside [start, end).

    Returns (chapters_keyword_start, close_bracket_inclusive_end, indent_col)
    where indent_col is the column where `chapters` starts on its line.
    """
    needle = "chapters:"
    pos = src.find(needle, start, end)
    if pos == -1:
        return None
    # Find the `[` after `chapters:`
    bracket_open = src.find("[", pos, end)
    if bracket_open == -1:
        return None
    # Determine indent: walk back to start of line
    line_start = src.rfind("\n", 0, pos) + 1
    indent_col = pos - line_start
    # Match the closing `]` with depth/string awareness
    depth = 0
    in_str = False
    str_quote = ""
    j = bracket_open
    while j < end:
        c = src[j]
        if in_str:
            if c == "\\":
                j += 2
                continue
            if c == str_quote:
                in_str = False
        else:
            if c in ("'", '"', "`"):
                in_str = True
                str_quote = c
            elif c == "[":
                depth += 1
            elif c == "]":
                depth -= 1
                if depth == 0:
                    return pos, j + 1, indent_col
        j += 1
    return None


def build_new_chapters_block(
    indent_col: int,
    chapters: list[dict],
    tails_for_entry: dict,
) -> tuple[str, int]:
    """Build the replacement `chapters: [ ... ]` block; return (text, escapes_count)."""
    base = " " * indent_col
    item_indent = " " * (indent_col + 2)
    escapes = 0
    lines = ["chapters: ["]
    for i, ch in enumerate(chapters):
        ch_idx = ch.get("chapter_idx")
        title = ch.get("chapter_title", "").strip()
        url = ch.get("chapter_url", "").strip()
        tail = (tails_for_entry or {}).get(str(ch_idx), "").strip()
        full_title = f"{title} — {tail}" if tail else title
        title_esc, n1 = escape_js_string(full_title)
        url_esc, n2 = escape_js_string(url)
        escapes += n1 + n2
        comma = "," if i < len(chapters) - 1 else ""
        lines.append(
            f"{item_indent}{{ title: '{title_esc}', url: '{url_esc}' }}{comma}"
        )
    lines.append(f"{base}]")
    # Join with newlines; first line must NOT have leading indent (it replaces
    # the slice that already includes the base indent in the surrounding text).
    return "\n".join([lines[0]] + [l for l in lines[1:]]), escapes


def main() -> int:
    bundle = json.loads(BUNDLE.read_text(encoding="utf-8"))
    tails = json.loads(TAILS.read_text(encoding="utf-8"))
    diag = json.loads(DIAG.read_text(encoding="utf-8"))

    by_entry_bundle = bundle["by_entry"]
    by_entry_tails = tails["by_entry"]

    # Targets: all buggy + all partial entries with int IDs
    buggy = set(diag["buggy_ids"])
    partial = []
    for r in diag["results"]:
        eid, expected, actual, is_buggy = r
        if not is_buggy and expected > 0 and actual < expected:
            partial.append(eid)
    targets = sorted(set(int(x) for x in buggy) | set(int(x) for x in partial))

    src = JSX.read_text(encoding="utf-8")

    id_count_before = len(re.findall(r"^\s+\{ id: ", src, re.MULTILINE))
    chapter_obj_before = src.count("{ title:")

    repaired = 0
    chapters_added = 0
    total_escapes = 0
    skipped_no_bundle = []
    skipped_no_chapters = []
    skipped_no_block = []

    # Process targets in REVERSE order so earlier replacements don't shift
    # indices of later targets. We use string replacement on the slice, but
    # since we build a fresh `src` for each iteration, we must handle position
    # shifts. Easiest: rebuild from scratch each iteration.
    for entry_id in sorted(targets, reverse=True):
        bundle_entry = by_entry_bundle.get(str(entry_id))
        if bundle_entry is None:
            skipped_no_bundle.append(entry_id)
            continue
        chapters = bundle_entry.get("chapters") or []
        if not chapters:
            skipped_no_chapters.append(entry_id)
            continue
        block = find_entry_block(src, entry_id)
        if block is None:
            skipped_no_block.append(entry_id)
            continue
        e_start, e_end = block
        chap = find_chapters_block(src, e_start, e_end)
        if chap is None:
            skipped_no_block.append(entry_id)
            continue
        c_start, c_end, indent_col = chap
        tails_for_entry = by_entry_tails.get(str(entry_id), {})
        new_block, escapes = build_new_chapters_block(
            indent_col, chapters, tails_for_entry
        )
        src = src[:c_start] + new_block + src[c_end:]
        repaired += 1
        chapters_added += len(chapters)
        total_escapes += escapes

    JSX.write_text(src, encoding="utf-8")

    id_count_after = len(re.findall(r"^\s+\{ id: ", src, re.MULTILINE))
    chapter_obj_after = src.count("{ title:")

    print(f"Targets considered: {len(targets)}")
    print(f"Entries repaired:   {repaired}")
    print(f"Chapters added:     {chapters_added}")
    print(f"Single-quote escapes: {total_escapes}")
    print(f"id-line count:      {id_count_before} -> {id_count_after}")
    print(f"chapter object count: {chapter_obj_before} -> {chapter_obj_after}")
    if skipped_no_bundle:
        print(f"Skipped (no bundle entry): {skipped_no_bundle}")
    if skipped_no_chapters:
        print(f"Skipped (no chapters in bundle): {skipped_no_chapters}")
    if skipped_no_block:
        print(f"Skipped (no chapters block in JSX): {skipped_no_block}")
    if id_count_before != id_count_after:
        print("ERROR: entry count changed!", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
