---
name: ship-portfolio
description: Take verified portfolio work to production at kausthubh.dev and leave main, the main checkout and the worktree list clean. Use only when I say ship, deploy, release, or merge and deploy.
---

# Ship the portfolio

One surface: the static site at https://kausthubh.dev. Vercel's Git integration (project `kausthubh-portfolio` under `kausthubh-coders-projects`) deploys every push to `main` and builds a preview for every PR. Nothing else ships: no backend, no package, no release.

The repo (`kausthubh-coder/portfolio`) is public, so work lands through a PR with a merge commit. My "ship" is the go to merge once the Vercel check passes. `<main>` below is `C:\Users\kaust\OneDrive\Documents\dev\kausthubh-portfolio`.

**Rules.** Production needs my go in this conversation. Stop at the first failure. Never force-push, never skip checks, never raise a budget in `scripts/shots.mjs` to pass. Write the rollback (end of this file) into your notes before step 2.

## 1. Ready

1. `git fetch origin`, then `git status --short` prints nothing. If `git rev-list --count HEAD..origin/main` isn't 0, `git merge origin/main` and resolve.
2. `bun run shots` exits 0. It is the full check: `astro check`, the build, then every route at 1280 and 390 in light and dark, failing on console errors, 404s and sideways scroll. Look at the shots of every page the change touches.
3. Every changed interaction was driven with `verify-portfolio`, and you have its evidence (the shots run folder, plus anything you drove by hand).
4. List what's going out: `git log --oneline origin/main..HEAD` and `git diff --stat origin/main...HEAD`.

## 2. Land

```
git push -u origin <branch>
gh pr create --fill --base main
gh pr checks <pr> --watch --fail-fast      # Vercel's preview build; give up after 15 minutes
```

Open the preview URL from the checks and load the changed pages. Then merge:

```
gh pr merge <pr> --merge
```

Leave out `--delete-branch`: gh would try to switch this worktree to `main`, which the main checkout already has. Step 5 deletes the branch.

## 3. Deploy

Vercel deploys the merge commit on its own. Watch its status, at most 10 minutes:

```
gh pr view <pr> --json mergeCommit -q .mergeCommit.oid
gh api repos/kausthubh-coder/portfolio/commits/<sha>/status -q '.statuses[] | select(.context=="Vercel") | .state'
```

Done at `success`; stop at `failure` or `error`.

## 4. Check production

Read only:

- `curl -s -o /dev/null -w "%{http_code}" https://kausthubh.dev/<changed page>` returns 200, and `curl -s` of that page contains a string from the change.
- For a re-rendered clip or new image: `curl -sI https://kausthubh.dev/peeks/<slug>.mp4` returns 200 and its `Content-Length` matches the local file. Browsers cache `/peeks/*` for a day (`vercel.json`), so a returning visitor can see the old clip until then; say so in the report.

## 5. Update the main checkout and clean up

- If `git -C <main> status --short` prints nothing and it's on `main`: `git -C <main> pull --ff-only`, then `bun run setup` in `<main>`. If it's dirty or on another branch, leave it and tell me.
- `git push origin --delete <branch>`.
- This thread can't remove its own worktree: list it for removal. Other worktrees whose branches are merged and that no live thread uses (check `t3_thread_list`) can go with `bun run remove -- <path>`, as `worktree-portfolio` says.

## 6. Report

A few lines: the PR, the merge commit, the production URL and what you checked there, the evidence from step 1, and anything skipped or left (the main checkout, worktrees to remove, the clip cache).

## Rollback

Promote the previous production deployment in the Vercel dashboard (kausthubh-portfolio, Deployments) to restore the site at once. Then `gh pr revert <pr>`, check and merge that PR the same way, so `main` matches what's live.
