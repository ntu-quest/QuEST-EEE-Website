# QuEST@EEE — website

The website for **QuEST@EEE**, Quantum Engineering, Science & Technology at NTU's
School of Electrical & Electronic Engineering.

Astro + Tailwind + MDX content collections → static build. Zero JavaScript by
default; islands only where the plan says so.

## Local setup

```bash
npm install
npm run prepare:content   # optimise images, extract the demos, zip the bundle
npm run dev               # http://localhost:4321
npm run build             # static output to dist/
```

`npm run build` runs `prepare:content` first, so CI needs nothing extra.
`ffmpeg` is required for the GIF → video step; without it that step is skipped
with a warning and everything else still builds.

## What is where

| Path | What |
|---|---|
| `CLAUDE.md` (repo root, in `Planning files/`) | The contract. Non-negotiables, tokens, type scale, routes, real content. |
| `CONTENT.md` | **How to add an event without touching code.** Start here. |
| `src/styles/tokens.css` | The only place a colour is defined. |
| `src/content/` | All content, as Markdown with typed frontmatter. |
| `src/content.config.ts` | The schemas. A malformed file fails the build. |
| `src/scripts/field.ts` | The interference background. Homepage hero and `/demos` only. |
| `booth-src/` | The booth build, verbatim. **The single source for all four demos.** Never edit it to suit the website — edit it in the booth repository and copy across, or the offline build and the site will drift. |
| `public/demos/`, `public/demo-wire/`, `src/generated/` | All generated from `booth-src/` by `scripts/booth.mjs`. Not committed. |
| `media-src/` | Original photographs. Never ships. |
| `scripts/` | The image pipeline, the demo extractor, the offline zip. |

## The rules that are not negotiable

1. **Manrope + Lora + DM Mono.** Never Inter.
2. **Colours only from `tokens.css`.** No hex literal anywhere else.
3. **Light is the default.** Dark is designed, not inverted.
4. **The logo files are named by MODE, not ink.** `quest-logo-light.png` is the
   light-mode artwork and is drawn dark. Swapping them kills both.
5. **No gradients in the interface.** The mark keeps its own; the interference
   field is a rendered physical quantity.
6. **Nothing below 12px.**
7. **Every section visible at rest** — no scroll-triggered reveals, so a shared
   link previews correctly.
8. **Never invent content.** If it does not exist, the block does not ship.

## Deploying

GitHub Pages, from a club-owned **organisation** — not a personal account. The
old site sits on Vercel under a personal account, which is exactly the risk this
repository exists to remove. Two named people hold deploy access.
