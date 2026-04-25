#!/usr/bin/env bash
#
# Rewrite all commit author / committer fields in this repo to drop the
# personal Gmail and use the Vurctne brand identity instead.
#
# Why: the local history was built before the repo had a contact policy.
# All 7 commits are authored by `wang.zili.ivan@gmail.com` (personal). We
# want history to read as `Vurctne <contact@vurctne.com>` once the repo
# becomes public.
#
# When to run: ONCE, before adding a remote and pushing for the first time.
# Safe to run because there is no remote yet — no force-push, no upstream
# divergence to worry about.
#
# What this changes:
#   - Author email and committer email on EVERY commit
#   - Commit hashes (history is rewritten, so SHAs all change)
#
# What this does NOT change:
#   - File contents
#   - Commit messages
#   - Commit timestamps
#
# Verify after: `git log --format='%h %ae %an %s'` should show only the
# Vurctne identity.
#
# ─── Run from this directory ─────────────────────────────────────────────

set -euo pipefail

cd "$(dirname "$0")"

OLD_EMAIL="wang.zili.ivan@gmail.com"
NEW_NAME="Vurctne"
NEW_EMAIL="contact@vurctne.com"

# Sanity check: confirm we're in the right repo
if ! git log --format='%ae' 2>/dev/null | grep -qi "$OLD_EMAIL"; then
  echo "ERROR: did not find any commits by $OLD_EMAIL — not safe to run."
  echo "Verify you're in the refined PAL Search repo and try again."
  exit 1
fi

# Sanity check: confirm no remote is set (we want this rewrite to happen
# BEFORE any push, never after)
if git remote get-url origin >/dev/null 2>&1; then
  echo "ERROR: a remote is already configured."
  echo "If history has already been pushed, rewriting will require"
  echo "force-push and will break anyone who pulled it. Aborting."
  exit 1
fi

echo "Rewriting all commits authored by $OLD_EMAIL"
echo "  →  $NEW_NAME <$NEW_EMAIL>"
echo

# git filter-branch is the canonical built-in. Newer Git installs ship
# git-filter-repo as a more robust alternative, but filter-branch ships
# with everything and works fine for a 7-commit repo.
git filter-branch --env-filter "
  if [ \"\$GIT_AUTHOR_EMAIL\" = '$OLD_EMAIL' ]; then
    export GIT_AUTHOR_NAME='$NEW_NAME'
    export GIT_AUTHOR_EMAIL='$NEW_EMAIL'
  fi
  if [ \"\$GIT_COMMITTER_EMAIL\" = '$OLD_EMAIL' ]; then
    export GIT_COMMITTER_NAME='$NEW_NAME'
    export GIT_COMMITTER_EMAIL='$NEW_EMAIL'
  fi
" --tag-name-filter cat -- --all

echo
echo "Done. Verify with:"
echo "    git log --format='%h %ae %an %s'"
echo
echo "If output looks right, you can delete the backup refs:"
echo "    rm -rf .git/refs/original/"
echo "    git reflog expire --expire=now --all"
echo "    git gc --prune=now --aggressive"
