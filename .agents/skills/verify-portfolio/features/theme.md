# Light and dark

The site follows the system colour scheme until the visitor presses the toggle in the footer. The choice is saved and applied before first paint on every page. The switch wipes the new palette in as a circle from the button.

## Sub-features

- `theme-system` with nothing saved, `prefers-color-scheme` decides.
- `theme-toggle` the button flips the theme, saves it, and updates its own label.
- `theme-persist` a saved theme applies on load with no flash.

## How to get to it (user POV)

- The round sun/moon button at the bottom of home, every project page, and the workflow page.

## Driving it with the T3 preview tools

Preconditions: `localStorage.removeItem("kausthubh:theme")`, then reload.

- **Toggle.** Click `[data-theme-toggle]`. `document.documentElement.dataset.theme` flips, `localStorage["kausthubh:theme"]` matches it, and the button's `aria-label` names the other theme.
- **Persist.** Navigate to another page. `getComputedStyle(document.body).backgroundColor` is `oklch(0.17 0 0)` for dark or `oklch(0.995 0 0)` for light, from the first frame.
- **System.** `bun run shots` covers both schemes through `colorScheme`, with nothing saved.

## Gotchas

- The T3 preview's default profile keeps localStorage for the origin. Clear the key after testing.
- During the theme wipe every element's `view-transition-name` is dropped, so the page moves as one plane. A new named element doesn't need any handling for this.
