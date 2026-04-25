#!/usr/bin/env python3
"""Parse src/PALSearch.jsx and emit phase2-pending.json."""
import re, json, sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src" / "PALSearch.jsx"

V26_PRIORITY_IDS = {7, 9, 17, 27, 37, 45, 48, 56, 59, 64, 73, 77, 80, 85, 86, 91}

text = SRC.read_text(encoding="utf-8")

# Find each entry start. Entries begin with `  { id: <num>, title: '...', ...`
# We split by top-level entry boundaries: lines starting with `  { id:`
# and ending at the matching `  }` or `  },` at depth-2.

# Approach: find each `{ id:` start position at column 2, then track brace depth.
entries = []
i = 0
N = len(text)

# Find the start of PAL_POLICIES array
arr_start = text.find("const PAL_POLICIES = [")
assert arr_start > 0, "PAL_POLICIES not found"
i = text.index("[", arr_start) + 1

while i < N:
    # Skip whitespace and comments and commas
    while i < N and text[i] in " \t\r\n,":
        i += 1
    if i < N and text[i] == "/" and i+1 < N and text[i+1] == "/":
        # line comment
        nl = text.find("\n", i)
        if nl == -1: break
        i = nl + 1
        continue
    if i >= N: break
    if text[i] == "]":
        break
    if text[i] != "{":
        # unexpected
        i += 1
        continue
    # parse object: track depth, account for strings
    depth = 0
    start = i
    in_str = False
    str_ch = None
    j = i
    while j < N:
        c = text[j]
        if in_str:
            if c == "\\":
                j += 2
                continue
            if c == str_ch:
                in_str = False
                str_ch = None
            j += 1
            continue
        if c in ("'", '"', "`"):
            in_str = True
            str_ch = c
            j += 1
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                j += 1
                break
        j += 1
    obj_text = text[start:j]
    entries.append((start, j, obj_text))
    i = j

print(f"Found {len(entries)} entries", file=sys.stderr)

def extract_field(obj_text, field):
    """Return raw substring value for a top-level field, or None."""
    # Find ` field: ` at top-level (depth 1 inside the obj)
    # Simpler: regex with lookbehind for `, ` or `{ ` or newline+spaces
    # We'll do a depth-aware scan.
    n = len(obj_text)
    depth = 0
    in_str = False
    str_ch = None
    k = 0
    while k < n:
        c = obj_text[k]
        if in_str:
            if c == "\\":
                k += 2
                continue
            if c == str_ch:
                in_str = False
            k += 1
            continue
        if c in ("'", '"', "`"):
            in_str = True
            str_ch = c
            k += 1
            continue
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
        if depth == 1:
            # Check if obj_text[k:] starts with field name as a key
            m = re.match(r"\s*(" + re.escape(field) + r")\s*:\s*", obj_text[k:])
            if m and (k == 0 or obj_text[k-1] in ",{ \n\t"):
                # Get value until top-level comma at depth 1
                vstart = k + m.end()
                v = vstart
                vdepth = 0
                vin_str = False
                vstr_ch = None
                while v < n:
                    cc = obj_text[v]
                    if vin_str:
                        if cc == "\\":
                            v += 2
                            continue
                        if cc == vstr_ch:
                            vin_str = False
                        v += 1
                        continue
                    if cc in ("'", '"', "`"):
                        vin_str = True
                        vstr_ch = cc
                        v += 1
                        continue
                    if cc in ("{", "[", "("):
                        vdepth += 1
                    elif cc in ("}", "]", ")"):
                        if vdepth == 0:
                            break
                        vdepth -= 1
                    elif cc == "," and vdepth == 0:
                        break
                    v += 1
                return obj_text[vstart:v].strip()
        k += 1
    return None

def parse_string_literal(s):
    if s is None: return None
    s = s.strip()
    if not s: return None
    if s[0] in ("'", '"', "`"):
        return s[1:-1].replace("\\'", "'").replace('\\"', '"')
    return s

items = []
for (start, end, obj_text) in entries:
    id_raw = extract_field(obj_text, "id")
    if id_raw is None:
        continue
    try:
        db_id = float(id_raw)
        if db_id == int(db_id):
            db_id = int(db_id)
    except ValueError:
        continue

    title = parse_string_literal(extract_field(obj_text, "title")) or ""
    url = parse_string_literal(extract_field(obj_text, "url")) or ""

    tabs_raw = extract_field(obj_text, "tabs")
    chapters_raw = extract_field(obj_text, "chapters")
    resources_raw = extract_field(obj_text, "resources")

    has_tabs = tabs_raw is not None
    has_chapters = chapters_raw is not None
    has_resources = resources_raw is not None

    # count chapters
    chapter_count = 0
    if has_chapters:
        # count `{ title:` patterns inside
        chapter_count = len(re.findall(r"\{\s*title\s*:", chapters_raw))

    resource_count = 0
    if has_resources:
        resource_count = len(re.findall(r"\{\s*title\s*:", resources_raw))

    # detect existing keyword tails: chapters with `—` (em-dash) in title indicate tails added
    chapters_have_tails = False
    if has_chapters:
        # find 'title: ...' substrings
        titles = re.findall(r"title\s*:\s*'([^']*)'", chapters_raw)
        if titles and any("—" in t and len(t.split("—")[-1].strip()) > 0 and "," in t for t in titles):
            chapters_have_tails = True

    # decide actions
    actions = []
    is_v26_priority = int(db_id) in V26_PRIORITY_IDS if isinstance(db_id, int) or float(db_id).is_integer() else False
    # treat decimal (e.g. 3.5) as not v26 priority

    if is_v26_priority and has_chapters and not chapters_have_tails:
        actions.append("needs_chapter_tails")
    elif has_chapters and not chapters_have_tails:
        # generic: only add tails if entry already has chapters; we'll add in v26 priority above
        pass

    # full chapters: no chapters at all and URL is policy-and-guidelines/guidance
    if not has_chapters:
        if "/policy-and-guidelines" in url or "/policy-and-guidance" in url or "/guidance" in url or "/policy" in url:
            actions.append("needs_full_chapters")

    if not has_resources:
        actions.append("needs_resources")

    if not has_tabs:
        actions.append("needs_tabs")

    # priority assignment
    if is_v26_priority:
        priority = 1
    elif not has_tabs and not has_chapters and not has_resources:
        priority = 2
    else:
        priority = 3

    items.append({
        "db_id": db_id,
        "title": title,
        "url": url,
        "current_state": {
            "has_tabs": has_tabs,
            "has_chapters": has_chapters,
            "has_resources": has_resources,
            "chapter_count": chapter_count,
            "resource_count": resource_count,
            "chapters_have_tails": chapters_have_tails,
        },
        "actions_needed": actions,
        "priority": priority,
        "attempts": 0,
        "status": "pending",
    })

items.sort(key=lambda x: (x["priority"], x["db_id"]))

queue = {
    "phase": "phase2",
    "created_at": datetime.now(timezone.utc).isoformat(),
    "total": len(items),
    "items": items,
}

(ROOT / ".work-queue" / "phase2-pending.json").write_text(json.dumps(queue, indent=2, ensure_ascii=False), encoding="utf-8")
(ROOT / ".work-queue" / "phase2-done.json").write_text(json.dumps({"items": []}, indent=2), encoding="utf-8")
(ROOT / ".work-queue" / "phase2-failed.json").write_text(json.dumps({"items": []}, indent=2), encoding="utf-8")

# Summary
p1 = sum(1 for x in items if x["priority"]==1)
p2 = sum(1 for x in items if x["priority"]==2)
p3 = sum(1 for x in items if x["priority"]==3)
print(f"Total: {len(items)} | P1: {p1} | P2: {p2} | P3: {p3}")
print("Top 5 P1:")
for x in items[:5]:
    print(f"  id={x['db_id']} title={x['title'][:50]!r} actions={x['actions_needed']}")
