# Product

Updated: 2026-09-17

## What this is

A compact, kinetic personal site for Kausthubh N. It is a first impression, an index of favorite projects, and a way to get in touch. It is not a resume, and it does not pin Kausthubh to a role or a job title: the work is the pitch.

## Who it is for

Anyone who lands on it: people deciding whether to work with him, technical peers, friends, and curious strangers. They should get who he is and what he makes in a few seconds, and be able to go deep on a project if they want to.

## What is on it

- **Home:** identity, one line of voice, the project list (readable without hovering), a link to the stack + AI workflow page, and email.
- **Project pages** (Studi, Kriyan, Critly, Likh, Krida, Amy): status and links, real product screens, why it exists, what it does, and how it is built.
- **Stack + AI workflow:** the tools in daily use and the ones products get built with, with a last-updated date.
- **404:** on brand, with a way back.

There is no contact page and no phone number. Email and the social links are the contact surface.

## Personality

Precise, kinetic, human. Confident and spare, lowercase and a little unserious, with motion doing some of the talking. It should never read like a generic AI portfolio template.

## Anti-references

- Purple-blue gradients and generic AI-builder visuals.
- Beige, cream, sand, paper, or faux-editorial warmth by default.
- Glassmorphism, blurry glow blobs, decorative orbs, and bokeh.
- Over-rounded cards and identical icon-card grids.
- Repeating tiny uppercase section eyebrows.
- Gradient text.
- Monospace as the main shortcut for technical.
- A full-screen loader that hides content for too long.

## Design principles

- **Show the work quickly.** The first screen communicates identity and the projects without a marketing preamble.
- **Teach by showing.** If something is interactive, the page demonstrates it (the screenshot peek on hover) instead of relying on a hint nobody reads.
- **Make motion functional.** The intro orients the visitor and stays short. It plays on a first visit, never on the way back from another page.
- **Fun may decorate, never gate.** Hover and motion can add emphasis, but no content or link is reachable only by hovering.
- **Mostly static.** JavaScript only for interactive moments that earn it, inline and small.
- **Let logos behave like objects.** Project marks carry hover, focus, press, and page-transition states.
- **Stay honest.** Real screenshots, real status. No placeholder pages get published.

## Accessibility

- Target WCAG 2.2 AA for contrast, focus states, keyboard access, target size, and reduced motion.
- Every link has an accessible name; anything that navigates is a real link.
- Project interactions work by keyboard and touch, not hover only.
- The intro, roll call, and page transitions respect `prefers-reduced-motion`, and the intro can never leave the page hidden.
