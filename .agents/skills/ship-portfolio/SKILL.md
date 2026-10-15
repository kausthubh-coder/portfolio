---
name: ship-portfolio
description: Take verified portfolio work to production at kausthubh.dev and leave main, the main checkout and the worktree list clean. Use only when I say ship, deploy, release, or merge and deploy.
---

# Ship the portfolio

One surface: the static site at https://kausthubh.dev. Vercel's Git integration (project `kausthubh-portfolio` under `kausthubh-coders-projects`) deploys every push to `main` and builds a preview for every PR. Nothing else ships: no backend, no package, no release.

The repo (`kausthubh-coder/portfolio`) is my personal site, so work lands as a fast-forward push to `main`; a PR is the fallback when that push is refused. `<main>` below is `C:\Users\kaust\OneDrive\Documents\dev\kausthubh-portfolio`. In a cloud session there is no `<main>`, and `gh pr` doesn't work: use the `gh api` lines.

**Rules.**
- Production needs my go in this conversation. "Ship" is that go for every step below, including cleanup: don't stop to ask between steps.
- When a step fails because of this change (a failing check, a broken build, a deploy error), fix it, rerun the checks and carry on. Stop and tell me only when the cause is outside the change or the fix needs my decision.
- Never end the turn while a build or deploy you started is queued or running. Watch it to `success`, `failure` or `error`.
- Never force-push, never skip checks, never raise a budget in `scripts/shots.mjs` to pass.
- Write the rollback (end of this file) into your notes before step 2.

## 1. Ready

1. `git fetch origin`, then `git status --short` prints nothing. If `git rev-list --count HEAD..origin/main` isn't 0, `git merge origin/main` and resolve.
2. `bun run shots` exits 0. It is the full check: `astro check`, the build, then every route at 1280 and 390 in light and dark, failing on console errors, 404s and sideways scroll. Look at the shots of every page the change touches.
3. Every changed interaction was driven with `verify-portfolio`, and you have its evidence (the shots run folder, plus anything you drove by hand).
4. List what's going out: `git log --oneline origin/main..HEAD` and `git diff --stat origin/main...HEAD`.

## 2. Land

Fast-forward `main` to this branch:

```
git push origin HEAD:main
```

If the push is refused (branch protection, not a network error), land through a PR with a merge commit:

```
git push -u origin <branch>
gh pr create --fill --base main            # cloud: gh api repos/kausthubh-coder/portfolio/pulls -f head=<branch> -f base=main -f title=<title> -f body=<body>
gh pr checks <pr> --watch --fail-fast      # cloud: gh api repos/kausthubh-coder/portfolio/commits/<branch head sha>/status -q '.statuses[] | select(.context=="Vercel") | .state'
gh pr merge <pr> --merge                   # cloud: gh api -X PUT repos/kausthubh-coder/portfolio/pulls/<pr>/merge -f merge_method=merge
```

Wait for the Vercel preview check (at most 15 minutes), open its preview URL and load the changed pages before merging. Leave out `--delete-branch`: gh would try to switch this worktree to `main`, which the main checkout already has. Step 5 deletes the branch.

## 3. Deploy

Vercel deploys the new `main` on its own. Watch its status until it's done, at most 10 minutes:

```
git rev-parse HEAD                         # the pushed commit; after a PR: gh api repos/kausthubh-coder/portfolio/pulls/<pr> -q .merge_commit_sha
gh api repos/kausthubh-coder/portfolio/commits/<sha>/status -q '.statuses[] | select(.context=="Vercel") | .state'
```

Done at `success`. At `failure` or `error`, read the build log in the status's `target_url`; if this change caused it, fix it, rerun step 1 and land again.

## 4. Check production

Read only:

- `curl -s -o /dev/null -w "%{http_code}" https://kausthubh.dev/<changed page>` returns 200, and `curl -s` of that page contains a string from the change.
- For a re-rendered clip or new image: `curl -sI https://kausthubh.dev/peeks/<slug>.mp4` returns 200 and its `Content-Length` matches the local file. Browsers cache `/peeks/*` for a day (`vercel.json`), so a returning visitor can see the old clip until then; say so in the report.

## 5. Update the main checkout and clean up

- In a cloud session there's no main checkout: list "pull `<main>`" for my machine. Otherwise, if `git -C <main> status --short` prints nothing and it's on `main`: `git -C <main> pull --ff-only`, then `bun run setup` in `<main>`. If it's dirty or on another branch, leave it and tell me.
- `git push origin --delete <branch>`.
- This thread can't remove its own worktree: list it for removal. Other worktrees whose branches are merged and that no live thread uses (check `t3_thread_list`) can go with `bun run remove -- <path>`, as `worktree-portfolio` says.

## 6. Report

A few lines: how it landed (direct push or the PR), the commit on `main`, the production URL and what you checked there, the evidence from step 1, and anything skipped or left (the main checkout, worktrees to remove, the clip cache).

## Rollback

Promote the previous production deployment in the Vercel dashboard (kausthubh-portfolio, Deployments) to restore the site at once. Then revert the commits on a branch (`git revert <sha>`), check it, and land it the same way, so `main` matches what's live.
