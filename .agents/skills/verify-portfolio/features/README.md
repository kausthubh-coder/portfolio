# Portfolio verification map

The maintained list of what a visitor can do on the site, and how to prove each one works. Read the matching file before driving a feature.

## Baseline

- Start the preview with `bun run shots -- --keep` and use the URL it prints. Never drive a server you didn't start.
- Desktop is 1280x800, mobile is 390x844.
- To skip the intro, set `sessionStorage["kausthubh:intro:v5"] = "1"` before loading `/`. To see it, clear that key.
- Theme is stored in `localStorage["kausthubh:theme"]`. Clear it to follow the system again.

## Proof

- A screenshot or snapshot of the state after the action, plus the value that proves it (a `dataset` attribute, a class, a URL).
- Say which entry point you used. A feature with several entry points isn't verified by one of them.

## Features

| File | Feature |
| --- | --- |
| [home-list.md](home-list.md) | the project list: hover, peek, keyboard, return flash |
| [project-page.md](project-page.md) | a project page: logo morph, screenshot strip, lightbox, next/previous |
| [theme.md](theme.md) | light and dark |
| [intro.md](intro.md) | the first-visit intro |
