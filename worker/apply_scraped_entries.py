#!/usr/bin/env python3
"""Apply scraped entries from .work-queue/scrape-merged-entries.json into src/PALSearch.jsx."""
import json
import re
import sys
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JSX_PATH = os.path.join(ROOT, 'src', 'PALSearch.jsx')
MERGED_PATH = os.path.join(ROOT, '.work-queue', 'scrape-merged-entries.json')

ID_RE = re.compile(r'\{\s*id:\s*[0-9]+(?:\.[0-9]+)?')


def js_escape_string(s):
    if s is None:
        return ''
    s = str(s)
    s = s.replace('\\', '\\\\')
    s = s.replace("'", "\\'")
    s = s.replace('\n', ' ').replace('\r', ' ').replace('\t', ' ')
    s = re.sub(r'\s+', ' ', s).strip()
    return s


def js_string(s):
    return "'" + js_escape_string(s) + "'"


def js_array_strings(arr):
    return '[' + ', '.join(js_string(x) for x in (arr or [])) + ']'


def render_id(eid):
    if isinstance(eid, float) and eid == int(eid):
        return str(int(eid))
    return str(eid)


def normalize_tabs(tabs, parent_url):
    if isinstance(tabs, list):
        d = {}
        for label in tabs:
            ll = str(label).strip().lower()
            if 'overview' in ll:
                d['overview'] = label
            elif 'policy' in ll:
                d['policy-and-guidelines'] = label
            elif 'guidance' in ll:
                d['guidance'] = label
            elif 'resource' in ll:
                d['resources'] = label
        tabs = d
    return tabs or {}


def render_entry(e):
    eid = render_id(e['id'])
    title = js_string(e.get('title', ''))
    category = js_string(e.get('category', ''))
    tags = js_array_strings(e.get('tags', []))
    summary = js_string(e.get('summary', ''))
    parent_url = e.get('url', '') or ''
    url = js_string(parent_url)
    popular = 'true' if e.get('popular') else 'false'

    head = (
        "  { id: " + eid + ", title: " + title + ", category: " + category +
        ", tags: " + tags + ", summary: " + summary + ", url: " + url +
        ", popular: " + popular
    )

    has_tabs = bool(e.get('tabs'))
    has_chapters = bool(e.get('chapters'))
    has_resources = bool(e.get('resources'))

    if not (has_tabs or has_chapters or has_resources):
        return head + ' }'

    head += ','
    parts = [head]
    inner = []

    if has_tabs:
        tabs = normalize_tabs(e['tabs'], parent_url)
        key_map = {
            'overview': 'overview',
            'policy-and-guidelines': 'policyAndGuidelines',
            'policyAndGuidelines': 'policyAndGuidelines',
            'guidance': 'guidance',
            'resources': 'resources',
            'policy': 'policyAndGuidelines',
        }
        base = re.sub(r'/(overview|policy-and-guidelines|policy|guidance|resources)/?$', '', parent_url)
        suf_map = {
            'overview': '/overview',
            'policyAndGuidelines': '/policy-and-guidelines',
            'guidance': '/guidance',
            'resources': '/resources',
        }
        tab_pairs = []
        for k, v in tabs.items():
            jk = key_map.get(k, k.replace('-', ''))
            if isinstance(v, str) and v.startswith('http'):
                url_val = v
            else:
                url_val = base + suf_map.get(jk, '')
            tab_pairs.append(jk + ': ' + js_string(url_val))
        if tab_pairs:
            inner.append('    tabs: { ' + ', '.join(tab_pairs) + ' }')

    if has_chapters:
        ch_lines = []
        for c in e['chapters']:
            if not isinstance(c, dict):
                continue
            t = js_string(c.get('title', ''))
            u = js_string(c.get('url', parent_url))
            ch_lines.append('      { title: ' + t + ', url: ' + u + ' }')
        if ch_lines:
            inner.append('    chapters: [\n' + ',\n'.join(ch_lines) + '\n    ]')

    if has_resources:
        r_lines = []
        for r in e['resources']:
            if not isinstance(r, dict):
                continue
            bits = ['title: ' + js_string(r.get('title', ''))]
            note = r.get('note', '')
            if note:
                bits.append('note: ' + js_string(note))
            u = r.get('url', '')
            if u:
                bits.append('url: ' + js_string(u))
            r_lines.append('      { ' + ', '.join(bits) + ' }')
        if r_lines:
            inner.append('    resources: [\n' + ',\n'.join(r_lines) + '\n    ]')

    parts.append(',\n'.join(inner))
    parts.append('  }')
    return '\n'.join(parts)


def main():
    with open(MERGED_PATH) as f:
        merged = json.load(f)
    entries = merged['entries']
    print('Loaded ' + str(len(entries)) + ' entries to apply')

    with open(JSX_PATH) as f:
        jsx = f.read()

    before_count = len(ID_RE.findall(jsx))
    print('Current id-count in JSX: ' + str(before_count))

    start_match = re.search(r'const\s+PAL_POLICIES\s*=\s*\[', jsx)
    if not start_match:
        print('ERROR: cannot find PAL_POLICIES array start')
        sys.exit(1)
    start_idx = start_match.end()

    rest = jsx[start_idx:]
    close_match = re.search(r'\n\];', rest)
    if not close_match:
        print('ERROR: cannot find PAL_POLICIES array close')
        sys.exit(1)
    close_idx = start_idx + close_match.start()

    j = close_idx - 1
    while j >= start_idx and jsx[j] in ' \t\n\r':
        j -= 1
    last_char = jsx[j]
    print('Last non-ws char before ];: ' + repr(last_char) + ' at pos ' + str(j))

    rendered = [render_entry(e) for e in entries]
    if last_char == ',':
        new_block = '\n' + ',\n'.join(rendered) + '\n'
    else:
        new_block = ',\n' + ',\n'.join(rendered) + '\n'

    new_jsx = jsx[:close_idx] + new_block + jsx[close_idx:]

    after_count = len(ID_RE.findall(new_jsx))
    print('After id-count: ' + str(after_count) + ' (delta ' + str(after_count - before_count) + ', expected ' + str(len(entries)) + ')')

    if after_count - before_count != len(entries):
        print('WARNING: count mismatch')

    with open(JSX_PATH, 'w') as f:
        f.write(new_jsx)
    print('Wrote ' + JSX_PATH)


if __name__ == '__main__':
    main()
