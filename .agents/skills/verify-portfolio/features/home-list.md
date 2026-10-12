# Home project list

The home page lists every project as a row: logo, name, one-liner and status. You can read all of it without interacting. Hovering a row colours its logo, tilts it, and shows a screenshot that trails the cursor.

## Sub-features

- `list-read` every row shows its name, one-liner and status as visible text.
- `list-hover` the hovered row gets a surface, its logo goes from grey to colour and tilts, and the other rows dim.
- `list-peek` on desktop with a mouse, a screenshot card follows the cursor over the list.
- `list-keys` `j`/`k` (anywhere) and the arrow keys (inside the list) move focus between rows.
- `list-return` coming back from a project page flashes that project's row once.
- `copy-email` the copy button in "say hi" puts the email on the clipboard and briefly reads "copied".
- `cards` the two "how I build" cards (workflow, skills library) deal out their art on hover or focus.

## How to get to it (user POV)

- Open `/` and point at a row, or press `j`.
- Open a project and use back home, or the browser back button.

## Driving it with the T3 preview tools

Preconditions: preview running at 1280x800, intro done (`document.documentElement.dataset.introState === "done"`).

- **Read.** Snapshot `/`. The accessibility tree shows one link per project, named "<Name> <one-liner> <status>".
- **Hover.** `preview_hover` on `a.work-row[data-slug="kriyan"]`, then hover again a few pixels away so `pointermove` fires. The snapshot shows the peek card next to the cursor, and `document.querySelector("[data-peek-card]").classList.contains("is-on")` is true.
- **Keys.** Press `j` twice. `document.activeElement.dataset.slug` is the second project, and its row has a focus ring.
- **Return.** Click the Kriyan row, then run `document.querySelector(".back-link").click()` on the project page. Within 500 ms, `document.querySelector(".is-returning").dataset.slug === "kriyan"` on home.
- **Copy.** Click `[data-copy-email]`. The button gets `is-copied` for 1.6 s.

## Gotchas

- The rows carry `data-peek` (the image URL); the card is `[data-peek-card]`. Querying `[data-peek]` finds the first row, not the card.
- The peek waits 320 ms for the pointer to rest before it opens, then follows instantly between rows. Hover twice with a pause.
- The peek only runs with `(hover: hover) and (pointer: fine)`, at 900 px or wider, and without reduced motion. It's absent at 390 by design.
- Playwright's Alt+Left doesn't trigger back in the T3 preview. Click the back link instead.
