# AGENTS.md

Kausthubh's personal site. Static Astro, Bun, deployed on Vercel from `main`. The README is the map; read it first.

## Commands

- `bun run setup`: make this checkout ready (deps, its own port, the skills link), then the doctor. `bun run doctor` checks only. `bun run remove -- <path>` removes a merged worktree.
- Every task in a new worktree starts with `worktree-portfolio`. Ship only with `ship-portfolio`, when Kausthubh says so.
- `bun run build`: astro check (types and the project schema), then build.
- `bun run shots`: build, serve, and screenshot every route at 1280 and 390, light and dark. It fails on console errors, 404s or sideways scroll. Run it before saying a change is done, and look at the shots it names.
- Driving interactions (hover peek, theme toggle, transitions, keyboard): `.agents/skills/verify-portfolio/SKILL.md`.

## Where to change things

- Project content: `src/content/projects/<slug>.yaml`, images in `src/content/projects/<slug>/`. Nothing else needs editing to add one.
- Styles: `src/styles/global.css`. Use the tokens at the top (`--t-*` sizes, `--w-*` weights, `--s-*` spacing). Don't add new raw sizes or colours.

## Cloud sessions

A cloud VM (Claude Code on the web, Codex Cloud) is Linux with a bare clone. The SessionStart hook in `.claude/settings.json` runs `node scripts/cloud.mjs` (Codex: set the environment's setup script to `CLOUD=1 node scripts/cloud.mjs`). It loads Kausthubh's global skills and rules, runs setup, and makes sure a browser exists. It does nothing outside the cloud. Its last line says ready or what failed; rerun it if you're unsure.

- Works here: setup and the doctor, `bun run build`, `bun run shots` (headless, on the VM's Playwright Chromium; `scripts/browser.mjs` picks Google Chrome when it's installed, so local runs keep Chrome), `bun run og`, and shipping with `ship-portfolio`. Driving interactions works with Playwright against `bun run shots -- --keep`.
- `gh pr` doesn't work here; `gh api` does. `ship-portfolio` gives both.
- Only on Kausthubh's machine: T3 tools and the T3 preview, the main checkout (`ship-portfolio` step 5), `bun run remove`'s Windows cleanup, and anything in a signed-in browser such as the Vercel dashboard rollback. List those in the report.
- Env vars: none. The site has no secrets.

## Rules

- Never give Kausthubh a job title or role, anywhere.
- Keep the home intro animation.
- No placeholder or "coming soon" pages. Unreleased things get a line inside a real page, not their own page.
- Copy is plain and lowercase, in Kausthubh's voice, not marketing polish.
- Greys only. The project logos are the only colour, and they only show it on hover or focus.
- Back must feel like back: the return transition reverses the forward one.
- Krida: never mention its stream source.
- Don't commit, push or deploy unless asked.
