#!/usr/bin/env python3
"""Apply V26-style keyword tails to chapter titles in src/PALSearch.jsx.

Reads .work-queue/tails-output.json and replaces each chapter title with
"<original_title> -- <tail_string>" (em-dash U+2014 with surrounding spaces).

Locates entries by `id: <EntryId>` using the same brace-counting parser as
worker/Patch-Jsx.ps1, then within each entry walks its `chapters: [...]`
array and rewrites the chapter at index (chapter_idx - 1) (1-based).

Skips:
  * chapters whose title already contains an em-dash
  * empty tail strings

Usage:
  python3 worker/apply_tails.py [--dry-run]
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from pathlib import Path

EM_DASH = '—'

REPO_ROOT = Path(__file__).resolve().parent.parent
TAILS_PATH = REPO_ROOT / '.work-queue' / 'phase3-tails-output.json'
JSX_PATH = REPO_ROOT / 'src' / 'PALSearch.jsx'


def js_escape(s: str) -> str:
    """Escape a string for safe inclusion in a single-quoted JS literal."""
    # Backslash first, then single quote.
    return s.replace('\\', '\\\\').replace("'", "\\'")


def find_entry_span(content: str, entry_id: str) -> tuple[int, int] | None:
    """Return (start, end_inclusive) of entry block { id: <entry_id> ... }.

    Brace-counts forward from the opening `{`, skipping braces inside string
    literals (' ", `).
    """
    if '.' in entry_id:
        id_pat = re.escape(entry_id)
    else:
        id_pat = re.escape(entry_id)
    m = re.search(r'\{\s*id:\s*' + id_pat + r'\b', content)
    if not m:
        return None
    start = m.start()
    depth = 0
    i = start
    in_str = False
    str_ch = None
    n = len(content)
    while i < n:
        ch = content[i]
        if in_str:
            if ch == '\\':
                i += 2
                continue
            if ch == str_ch:
                in_str = False
            i += 1
            continue
        if ch in ("'", '"', '`'):
            in_str = True
            str_ch = ch
            i += 1
            continue
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                return start, i
        i += 1
    return None


# Regex to match a single chapter object literal:
#   { title: '...' / "..." / `...`, ... }
# This matches the title portion specifically.
TITLE_RE = re.compile(
    r"title:\s*(?P<q>['\"`])(?P<body>(?:\\.|(?!(?P=q)).)*)(?P=q)",
    re.DOTALL,
)


def find_chapters_block(entry_text: str) -> tuple[int, int] | None:
    """Find the `chapters: [` ... `]` span (returns positions of `[` and `]`)."""
    m = re.search(r'\bchapters\s*:\s*\[', entry_text)
    if not m:
        return None
    bracket_start = m.end() - 1  # position of `[`
    depth = 0
    i = bracket_start
    in_str = False
    str_ch = None
    n = len(entry_text)
    while i < n:
        ch = entry_text[i]
        if in_str:
            if ch == '\\':
                i += 2
                continue
            if ch == str_ch:
                in_str = False
            i += 1
            continue
        if ch in ("'", '"', '`'):
            in_str = True
            str_ch = ch
            i += 1
            continue
        if ch == '[':
            depth += 1
        elif ch == ']':
            depth -= 1
            if depth == 0:
                return bracket_start, i
        i += 1
    return None


def list_chapter_title_matches(chapters_block: str) -> list[re.Match]:
    """Return one match per chapter title, in order. We assume one title per
    chapter object (the standard structure), and within `chapters: [...]`."""
    return list(TITLE_RE.finditer(chapters_block))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true',
                    help='Don\'t write file; print 5 sample diffs.')
    args = ap.parse_args()

    if not TAILS_PATH.exists():
        print(f'tails file not found: {TAILS_PATH}', file=sys.stderr)
        return 2
    if not JSX_PATH.exists():
        print(f'jsx file not found: {JSX_PATH}', file=sys.stderr)
        return 2

    tails = json.loads(TAILS_PATH.read_text(encoding='utf-8'))
    by_entry = tails.get('by_entry', {})

    content = JSX_PATH.read_text(encoding='utf-8')
    original_id_count_pattern = re.compile(r'\bid:\s*\d+(?:\.\d+)?\b')
    before_id_count = len(original_id_count_pattern.findall(content))

    # Snapshot per-entry id counts for verification (only those we touch).
    def id_count_for(c: str, eid: str) -> int:
        return len(re.findall(r'\bid:\s*' + re.escape(eid) + r'\b', c))

    applied = 0
    skipped_already = 0
    skipped_empty = 0
    missing_entry = 0
    missing_chapter = 0
    sample_diffs: list[str] = []

    # We must rebuild content cumulatively. Process entries by descending span
    # position so earlier edits don't shift the indices we're using; or we can
    # process in any order if we re-find spans each iteration. We'll re-find
    # each entry block per-entry to be safe.

    for entry_id, ch_map in by_entry.items():
        # Verify single occurrence of this id
        before = id_count_for(content, entry_id)
        if before == 0:
            missing_entry += 1
            print(f'[warn] entry not found in JSX: id={entry_id}', file=sys.stderr)
            continue

        span = find_entry_span(content, entry_id)
        if span is None:
            missing_entry += 1
            print(f'[warn] entry span not found: id={entry_id}', file=sys.stderr)
            continue
        ent_start, ent_end = span
        entry_text = content[ent_start:ent_end + 1]

        chap_span = find_chapters_block(entry_text)
        if chap_span is None:
            print(f'[warn] no chapters block in entry id={entry_id}', file=sys.stderr)
            missing_chapter += len(ch_map)
            continue
        cb_start, cb_end = chap_span
        chapters_block = entry_text[cb_start:cb_end + 1]

        title_matches = list_chapter_title_matches(chapters_block)

        # Sort chapter ops by descending chapter idx so we apply edits to
        # chapters_block from end to beginning (preserves earlier offsets).
        ops = sorted(
            ((int(cidx), tail) for cidx, tail in ch_map.items()),
            key=lambda x: x[0],
            reverse=True,
        )

        new_chapters_block = chapters_block
        for cidx, tail in ops:
            if not tail or not tail.strip():
                skipped_empty += 1
                continue
            zero_idx = cidx - 1
            if zero_idx < 0 or zero_idx >= len(title_matches):
                missing_chapter += 1
                print(f'[warn] chapter idx out of range: entry={entry_id} '
                      f'idx={cidx} (have {len(title_matches)})',
                      file=sys.stderr)
                continue
            tm = title_matches[zero_idx]
            current_body = tm.group('body')
            # Decode JS escapes for em-dash detection -- we only care about
            # whether the literal U+2014 appears unescaped in the title body.
            if EM_DASH in current_body:
                skipped_already += 1
                continue

            # Build new title body. Preserve quote char.
            quote = tm.group('q')
            # Unescape only quote escapes and backslashes for new body construction.
            # The current body already has correctly escaped chars; we just need
            # to append " -- <tail>". Since the tail may itself contain single
            # quotes / backslashes, we need to escape those for the chosen quote.
            new_tail_escaped = tail
            if quote == "'":
                new_tail_escaped = (
                    new_tail_escaped.replace('\\', '\\\\')
                    .replace("'", "\\'")
                )
            elif quote == '"':
                new_tail_escaped = (
                    new_tail_escaped.replace('\\', '\\\\')
                    .replace('"', '\\"')
                )
            elif quote == '`':
                new_tail_escaped = (
                    new_tail_escaped.replace('\\', '\\\\')
                    .replace('`', '\\`')
                )

            new_body = current_body + ' ' + EM_DASH + ' ' + new_tail_escaped

            # Replace this title match within new_chapters_block.
            # We must locate the exact same substring -- since we walk in
            # reverse order, indexes from `title_matches` are still valid for
            # the *current* state of new_chapters_block IFF earlier reverse
            # ops didn't change them. But the matches were taken before any
            # mutation. To be safe, do a literal replace of the original
            # whole-match string with the new whole-match string, restricted
            # to one occurrence at the matched offset.
            old_full = tm.group(0)
            new_full = f"title: {quote}{new_body}{quote}"

            # Replace at the precise offset to avoid hitting duplicates.
            offset = tm.start()
            # Re-find offset in the (possibly already-mutated) block: this is
            # the offset in the ORIGINAL chapters_block. Translate to current
            # new_chapters_block by scanning. Since we process chapters in
            # descending order, the current new_chapters_block matches the
            # original up to `offset` (later edits are after offset).
            assert new_chapters_block[offset:offset + len(old_full)] == old_full, (
                f'offset mismatch entry={entry_id} cidx={cidx}'
            )
            new_chapters_block = (
                new_chapters_block[:offset]
                + new_full
                + new_chapters_block[offset + len(old_full):]
            )

            applied += 1

            if len(sample_diffs) < 5:
                sample_diffs.append(
                    f'entry={entry_id} ch={cidx}\n'
                    f'  OLD: {old_full[:120]}\n'
                    f'  NEW: {new_full[:200]}'
                )

        if new_chapters_block == chapters_block:
            continue

        new_entry_text = (
            entry_text[:cb_start] + new_chapters_block + entry_text[cb_end + 1:]
        )
        content = content[:ent_start] + new_entry_text + content[ent_end + 1:]

        # Sanity-check id count for this entry
        after = id_count_for(content, entry_id)
        if after != before:
            print(f'[error] id count changed for entry {entry_id}: '
                  f'{before} -> {after}', file=sys.stderr)
            return 3

    after_id_count = len(original_id_count_pattern.findall(content))
    if after_id_count != before_id_count:
        print(f'[error] total id count changed: {before_id_count} -> '
              f'{after_id_count}', file=sys.stderr)
        return 3

    print('=== APPLY TAILS REPORT ===')
    print(f'tails applied:        {applied}')
    print(f'skipped (already):    {skipped_already}')
    print(f'skipped (empty):      {skipped_empty}')
    print(f'missing entries:      {missing_entry}')
    print(f'missing chapters:     {missing_chapter}')
    print(f'id count before/after: {before_id_count} / {after_id_count}')

    if args.dry_run:
        print('\n--- SAMPLE DIFFS (dry-run, file NOT written) ---')
        for d in sample_diffs:
            print(d)
            print()
        return 0

    JSX_PATH.write_text(content, encoding='utf-8')
    print(f'\nwrote: {JSX_PATH}')
    print('\n--- SAMPLE DIFFS ---')
    for d in sample_diffs:
        print(d)
        print()
    return 0


if __name__ == '__main__':
    sys.exit(main())
