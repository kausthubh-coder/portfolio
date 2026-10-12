# AGENTS.md

Kausthubh's personal site. Static Astro, Bun, deployed on Vercel from `main`. The README is the map; read it first.

## Commands

- `bun run build`: astro check (types and the project schema), then build.
- `bun run shots`: build, serve, and screenshot every route at 1280 and 390, light and dark. It fails on console errors, 404s or sideways scroll. Run it before saying a change is done, and look at the shots it names.
- Driving interactions (hover peek, theme toggle, transitions, keyboard): `.agents/skills/verify-portfolio/SKILL.md`.

## Where to change things

- Project content: `src/content/projects/<slug>.yaml`, images in `src/content/projects/<slug>/`. Nothing else needs editing to add one.
- Styles: `src/styles/global.css`. Use the tokens at the top (`--t-*` sizes, `--w-*` weights, `--s-*` spacing). Don't add new raw sizes or colours.

## Rules

- Never give Kausthubh a job title or role, anywhere.
- Keep the home intro animation.
- No placeholder or "coming soon" pages. Unreleased things get a line inside a real page, not their own page.
- Copy is plain and lowercase, in Kausthubh's voice, not marketing polish.
- Greys only. The project logos are the only colour, and they only show it on hover or focus.
- Back must feel like back: the return transition reverses the forward one.
- Krida: never mention its stream source.
- Don't commit, push or deploy unless asked.
