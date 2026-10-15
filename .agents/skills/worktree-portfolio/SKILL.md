---
name: worktree-portfolio
description: Make a checkout of the portfolio ready to work in, on its own port. Use at the start of every task in a new worktree, when deps, port or the skills link look wrong, before giving a helper agent its own checkout, and when removing a worktree.
---

# Worktree setup for the portfolio

## Setup and doctor

```
bun run setup    # installs what's missing, picks this checkout's port, links skills, then runs the doctor
bun run doctor   # checks only, and prints the fix for each failure
```

Setup is safe to rerun: about half a second when nothing is missing. It installs with `bun install --frozen-lockfile` only when `bun.lock` changed since the last install, writes `PORT=<n>` to `.env.local` (the main checkout gets Astro's 4321; a worktree gets 4400-5199 from a hash of its path, skipping ports other checkouts claimed or that answer on 127.0.0.1 or ::1), and junctions `.claude/skills` to `.agents/skills`.

A healthy doctor ends with one line:

```
portfolio ready: http://localhost:5033 · worktree · deps ok · no backend · 0 commits behind origin/main
```

Then `bun run dev` and `bun run preview` serve on that port. Run them through `bun run`: plain `astro dev` takes 4321, and `strictPort` makes it fail rather than drift onto another checkout's port. `bun run shots` picks its own free port, so it never collides.

When an agent runs `bun run dev`, Astro 7 detects it and starts the server in the background, one per checkout: the command returns at once, and running it again reports the server already up. From the same checkout, `bunx astro dev status`, `bunx astro dev logs` and `bunx astro dev stop` manage it.

There is no backend, database or secret. The site is static and the main checkout has no env files, so nothing is shared between checkouts and nothing is copied. `bun run shots` and `bun run peeks` need Google Chrome; `bun run peeks` also needs ffmpeg on PATH. The doctor reports both.

## The main checkout

`C:\Users\kaust\OneDrive\Documents\dev\kausthubh-portfolio`. Work only in worktrees and leave it alone; only `ship-portfolio` touches it, with a fast-forward pull.

## Helpers

One worktree per helper agent, never two agents in one checkout:

```
git -C C:\Users\kaust\OneDrive\Documents\dev\kausthubh-portfolio fetch origin
git -C C:\Users\kaust\OneDrive\Documents\dev\kausthubh-portfolio worktree add C:\Users\kaust\.t3\worktrees\kausthubh-portfolio\<name> -b <name> origin/main
cd C:\Users\kaust\.t3\worktrees\kausthubh-portfolio\<name>
bun run setup
```

Give the helper the path and its port from the doctor line.

## Cleanup

```
bun run remove -- <worktree path>              # only when its branch is merged into origin/main
bun run remove -- <worktree path> --unmerged   # only when I said to drop the work
```

Run it from another checkout. It refuses the main checkout, the checkout it runs in, and a worktree with uncommitted changes. It stops that checkout's own dev, preview, shots and peeks process trees by PID, deletes the `.claude/skills` junction without following it, removes the worktree and the folder git leaves behind on Windows, and deletes the local branch.

- Remove a worktree only when its work is merged or I say so, and never one another live thread is using: check `t3_thread_list` for threads in that worktree first.
- Stop only processes you started, by PID with `taskkill /T /PID <pid>`. Other worktrees' servers belong to other threads.
