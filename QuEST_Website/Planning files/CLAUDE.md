# CLAUDE.md — QuEST@EEE website

Read this before writing any code. It is the contract for this repo; `docs/BLUEPRINT.md` is the reasoning behind it.

---

## What we are building

The website for **QuEST@EEE** — Quantum Engineering, Science & Technology, the NTU EEE quantum interest club (formerly the NTU Quantum Computing Club). It replaces `Raspberryfruitcake/QCC_Old_Website`, a single dark page in Inter.

**The test every decision is measured against:** a visitor should think *"these people actually do things"* — not *"these people are interested in quantum."* That is why the interactive demos, real photographs and dated events are on the critical path, and the manifesto is not.

**Stack:** Astro + Tailwind + MDX content collections → static build → GitHub Pages. Zero JS by default; islands only where §Interactivity says so.

---

## Non-negotiables

Break any of these and the work has to be redone.

1. **Fonts are Manrope (display) + Lora (body) + DM Mono (utility).** Never Inter, never Space Grotesk, never bare `system-ui` as a visible face. Google Fonts, variable where available, `display=swap`, preconnected, Latin subset, real fallback stacks.
2. **Colours are only ever CSS custom properties from `src/styles/tokens.css`.** No hex literal anywhere else in the codebase. Both themes defined at token level.
3. **Light mode is the default.** Dark is designed, not inverted. Every colour is defined in bare `:root` first, then redefined under `@media (prefers-color-scheme: dark)` guarded as `:root:not([data-theme="light"])`, then again under `:root[data-theme="dark"]`.
4. **The logo is used large and swapped by theme.** See §Brand — the filenames are a trap.
5. **No gradients in the interface.** The mark keeps its own gradient; the interference field is a rendered physical quantity. Everything else is solid colour.
6. **Nothing below 12px.** Body 18px desktop, 17px minimum mobile.
7. **Every section is visible at rest.** No scroll-triggered reveals, nothing parked at `opacity: 0` waiting on an observer — a shared link must preview correctly.
8. **Never invent content.** No lorem, no placeholder projects, no invented numbers. If content does not exist, the block does not ship. Ask.

### The banned list (the club's own, keep it enforced)

Glowing blue qubits · Bloch spheres as decoration · circuit diagrams as wallpaper · particle-field animations · "the future is quantum" · atom-orbital logos · gradient meshes · dark-mode-only pages.

Review test: *would this element still be here if the club were about photonics manufacturing rather than quantum?* If yes it is doing work. If no it is costume.

---

## Brand

### The mark

`⟨Qu|EST@EEE⟩` — a bra-ket enclosing a Q with a dagger (Hermitian conjugate). Two files in `public/brand/`, copied from `QC_club_Demo/assets/`.

> **THE FILENAME TRAP — read twice.** The files are named by **mode**, not by ink.
> - `quest-logo-light.png` = the **light-mode** artwork, drawn dark violet. Use on LIGHT grounds.
> - `quest-logo-dark.png` = the **dark-mode** artwork, drawn pale ice. Use on DARK grounds.
>
> Swap them and both marks lose contrast. Put this comment above every `<picture>` element that uses them.

Both files are padded to one shared 1114×624 canvas by `make_logos.py`, so a fixed CSS `height` renders an identical mark either way. **Never re-export one file independently** — regenerate both through that script or the mark will change size when the theme flips.

```html
<!-- quest-logo-light.png is the LIGHT-MODE artwork (drawn dark). Do not swap. -->
<picture>
  <source srcset="/brand/quest-logo-dark.png"  media="(prefers-color-scheme: dark)">
  <img src="/brand/quest-logo-light.png" alt="QuEST@EEE" height="180" width="321">
</picture>
```
The `[data-theme]` override must beat `prefers-color-scheme` in both directions — if `<picture>` cannot do that cleanly, use two `<img>` elements toggled by CSS with the tokens pattern, never JS.

**Sizes:** hero 140–200px tall desktop, 96–120px mobile; nav 40–48px. **Never below 96px** for the gradient mark — "EST" is its weakest element and dies first at small sizes. A flat single-colour mark is needed for the favicon, OG image and print; if `public/brand/quest-mark-flat.svg` is missing, ask rather than deriving one.

Clear space of at least the bracket's height on every side. Never on a photograph, never recoloured, never rotated. In running text the wordmark is "QuEST@EEE" set in Manrope — never the image.

### tokens.css

Names follow `QC_club_Demo/booth/shared.css` so the site and the offline booth build share one system.

```css
:root{
  --wash:#FAFAFC;      /* page ground */
  --panel:#F1F0F7;     /* cards, table heads */
  --panel-2:#E6E4F0;
  --ink:#14131C;       /* violet-black */
  --ink-soft:#3B3850;
  --ink-faint:#6A6880;
  --rule:#DCDAE8;
  --accent:#4B3F94;    /* indigo — anything that navigates */
  --accent-soft:#E7E4F6;
  --ice:#1C7386;       /* anything that responds: demos, the field */
  --ice-soft:#DCEFF3;
  --marked:#A8481F;    /* state only: open-to-join, deadline, warning */
  --marked-soft:#F4E4DC;
  --radius:4px;
  --elevation:0 1px 2px rgb(20 19 28 / .06);
}
@media (prefers-color-scheme:dark){
  :root:not([data-theme="light"]){
    --wash:#0C0B12; --panel:#15141D; --panel-2:#1E1C29;
    --ink:#EDECF4; --ink-soft:#C2BFD6; --ink-faint:#8B88A2;
    --rule:#2A2838;
    --accent:#A79BEE; --accent-soft:#221F38;
    --ice:#6FC5D8;    --ice-soft:#152A31;
    --marked:#E0906B; --marked-soft:#2E1F18;
  }
}
:root[data-theme="dark"]{ /* same overrides again */ }
```

Every value is sampled from the mark (indigo 240°, violet 270–280°, ice cyan 180°). The neutrals carry a faint violet bias — do not replace them with pure greys.

### Type scale

One scale, no improvisation. If a size is not on it, it does not get used.

`78 / 46 / 32 / 25 / 20 / 18 / 16 / 14 / 12.5 / 11`

| Role | Face | Weights | Used for |
|---|---|---|---|
| Display | Manrope | 600–800, tracking −0.03em at ≥46px | Headlines, statements, nav, buttons, monogram initials |
| Body | Lora | 400/500 | Running text, long-form, quotes |
| Utility | DM Mono | 400/500 | Labels, routes, dates, data, readouts, code |

Measure near 65 characters. `text-wrap: balance` on every heading. Uppercase labels get 0.14–0.18em tracking. `font-variant-numeric: tabular-nums` wherever digits line up.

---

## Routes

```
/                       /demos                    /about
/explore                  /demos/grover             /about/journey
  /explore/what-we-do     /demos/bell               /about/culture
  /explore/quantum-stack  /demos/stern-gerlach      /about/people
  /explore/resources      /demos/vqe-h2             /about/network
/projects               /research                 /join
  /projects/[slug]        /research/[slug]          /join/roles
/events                   /research/outputs  (P2)   /join/[cycle]
  /events/[slug]        /contact                  /links
```
`/members` is Phase 3 and gated — do not scaffold it.

**Nav:** `⟨QuEST@EEE⟩ | Explore ▾ | Demos | Projects | Research | Events | About ▾ | [Join QuEST]`
The Join button is persistent at every breakpoint, is the only filled element in the bar, and stays visible in the collapsed mobile header rather than hiding inside the hamburger.

---

## Content collections

Content lives in Markdown with typed frontmatter — never in components. A non-developer must be able to add an event by adding a file. Enforce these in `src/content/config.ts`; a malformed file fails the build.

```ts
project  { title, slug, summary(≤160), area:'algorithms'|'software'|'research'|'hardware'|'photonics'|'security',
           difficulty:'intro'|'intermediate'|'advanced', status:'open'|'active'|'completed'|'paused',
           team[], mentors[], started, repo?, outputs[{label,url}], cover?, featured }
event    { title, slug, series:'workshop'|'guest-lecture'|'showcase'|'industry-talk'|'hackathon'|'social',
           start, end?, venue, format, difficulty, audience, learningOutcomes[], registerUrl?, capacity?,
           photos[], recap?, status }
person   { name, preferredName?, role, roleShort, department, team?, year, photo?, email, blurb, links{}, active }
demo     { title, slug, station:1|2|3|4, concept, hook, stackNodes[], knobs[{label,range}], sections[],
           references[{citation,url}], offlineBundle, workshop? }
link     { label, description, url, icon, order, surfaces[], live, expiresOn? }
media    { file, alt /* REQUIRED — build fails without it */, credit, takenOn, consent:'granted'|'pending'|'na',
           people[], usage:'hero'|'gallery'|'illustration'|'history' }
resource { title, track, order, type, source:'quest'|'external', url, estimatedTime, why }
milestone{ year, title, blurb, photo?, links[] }
```

Two rules: every type carries `active` or `status` and the site filters on it — **nothing is deleted at handover**, so the site becomes the club's institutional memory. And `media.alt` is required at schema level.

---

## Real content (use this, do not invent alternatives)

### ExCo — AY2026

| Position | Name | Department | Email |
|---|---|---|---|
| President | Tisorn Na Phattalung (Mon) | exco | TISORN001@e.ntu.edu.sg |
| Deputy President | Thanmaya Bharadwaj | exco | E230088@e.ntu.edu.sg |
| Honorary General Secretary | Sahana Vamsee | exco | SAHANA012@e.ntu.edu.sg |
| Treasurer | Thyme Pataradilok | exco | THYME001@e.ntu.edu.sg |
| Academics Lead | Wongwaran Upawong (Thank) | academics | WONGWARA001@e.ntu.edu.sg |
| Projects & Research Lead — Hardware | Nguyen Ba Linh | projects-research | BALINH001@e.ntu.edu.sg |
| Projects & Research Lead — Software | Rudranshi Singh | projects-research | SING0027@e.ntu.edu.sg |
| Publicity Lead | Chanoknon Kongkanta (Jerry) | publicity | chanokno001@e.ntu.edu.sg |
| Business & Outreach Lead | Aniket Majee | business-outreach | ANIKET003@e.ntu.edu.sg |
| Operations Lead | **vacant — show the opening** | operations | — |

Faculty advisors: **Asst Prof Chang Jin** and **A/P Wong Liang Jie**.

**Email rules:** ExCo addresses are published deliberately; sub-committee addresses are never published. Assemble every `mailto:` at runtime from data attributes (anti-scraping) and prefill the subject line. `blurb` is missing for everyone — ask the club, do not write one.

### Links

| label | url |
|---|---|
| Club community (Telegram) | `https://t.me/+F4ofanIj4lJmNmY1` |
| Sub-comm recruitment (MS Form) | `https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=SJPOFSq-K0aPwOF2WpsgSiV5At9MDQJHiOrqqCiAoTFUMlZRRzBKQktPREMwRjZLOUhNM0hKWFQxMy4u` |
| Instagram | `https://www.instagram.com/quest_eee` |
| LinkedIn | `https://www.linkedin.com/company/ntu-quantum-computing-club/` |
| Email | mailto: President |
| Demos & code | `/demos` + the club GitHub org |
| Workshop registration | none right now — the row renders only when an event has a future date and a `registerUrl` |

> `t.me/c/2405182988/1` is an **internal message link** and does not work for the public. Never use it.
> The LinkedIn page is still named "NTU Quantum Computing Club" — a human is renaming it; keep the URL until they confirm.

**Icons:** single-weight line icons, 20px, `stroke: currentColor`, inline SVG. No icon font, no CDN, no emoji. Instagram / LinkedIn / Telegram / GitHub must use each platform's **official mark from its own brand page** — do not hand-draw approximations. Every icon has a text label beside it.

### Proof figures for the homepage

"Singapore's first undergraduate, student-run quantum-centric club" · member count (confirm the current number) · workshops run · universities in the network. The old site's "8+ months of active initiatives" is stale — do not carry it across; ask for a figure that ages well.

---

## Assets

Copy into `public/`, do not hotlink.

| From | File | Use |
|---|---|---|
| `QC_club_Demo/assets/` | `quest-logo-light.png`, `quest-logo-dark.png` | `public/brand/` |
| `QCC_Old_Website/assets/` | `workshop_image_2.jpeg` | **Homepage hero.** Students teaching at a whiteboard |
| | `fallfest_2.JPG` | The CQT group shot — `/about`, `/about/network` |
| | `fallfest_3.jpg` | Panel discussion — events gallery, talks series |
| | `workshop_image_3.jpeg` | Handwritten entanglement notes — section texture, `/explore/resources`, 404 |
| | `mlda_qcc_2.png` | QML clustering output — project evidence for the MLDA×QCC entry |
| | `mlda_qcc_1.png` | VQE loop diagram — illustration on the VQE demo + project |
| | `fallfest_1.JPG` | Speaker at a lectern — events gallery |
| | `ntuqcc.jpg` | **HISTORY ONLY.** The former QCC mark. `/about/journey` as the "before" — never nav, favicon or OG |
| | `mile_gu.jpg` | Guest-speaker portrait — **blocked pending permission** |
| | `workshop_image_1.jpeg` | Bloch-sphere slide — **crop the video-call participant thumbnails out before use** |
| `QC_club_Demo/assets/` | 6 physics GIFs | Convert to muted looping MP4/WebM with a poster frame. **Illustration beside the matching demo, never wallpaper** |

**Image pipeline:** three files are 3936×2624 at 1–7 MB. Resize to 2000px max, export AVIF with a WebP fallback, emit a 640px variant for phones, target under 180 KB each, explicit width/height, lazy below the fold, eager for the hero. `fallfest_2` shows ~25 identifiable people — do not publish until `consent: granted`.

---

## Interactivity

Only these hydrate. Everything else is static HTML.

1. **The interference field** — `src/scripts/field.ts`, **homepage hero and `/demos` header only**. Two-source interference on a canvas at ~1/6 display resolution scaled up; the pointer drives the second source with an eased lag. Colours read from `--accent` and `--ice` at ≤10% alpha so it follows the theme. 30 fps cap, `IntersectionObserver` pause, pause on `document.hidden`. First frame drawn **synchronously on load**. Under 2 KB. `aria-hidden`.
   Static single frame, no loop started at all, when: `prefers-reduced-motion: reduce`, viewport < 720px, `navigator.hardwareConcurrency <= 4`, or `navigator.connection.saveData`.
   **One interactive background, one place, one intensity.** A second ambient effect anywhere on the site means both get deleted.
2. **The four demo pages** — see below.
3. **The Quantum Stack diagram** — static SVG in Phase 1, interactive in Phase 2. The nested-list fallback is always in the DOM, never `display:none`.
4. **Nav toggle, theme toggle, filter bar.** Filters are real URL links (`?area=qml`) and work with JS disabled.

### The demo pages

Source: `QC_club_Demo/booth/` — `grover.html`, `bell.html`, `stern-gerlach.html`, `vqe-h2.html`, sharing `physics.js`, `mathfmt.js`, `shared.js`, `shared.css`.

- **Port the shell, share the logic.** Copy `physics.js`, `mathfmt.js` and `shared.css` in as static assets unchanged; rebuild only the page frame in Astro; mount the demo markup as one hydrated island. **Do not iframe. Do not decompose into components. Never fork the physics** — the offline booth build must keep working from a USB stick with no wifi.
- **Flatten** the `<details>` "Show the maths" into the page, in document order, with a **sticky outline rail** generated from the article's own headings (scroll-spy). Below 900px it becomes a sticky chip strip.
- **Pin the controls too.** A knob panel docked to the bottom of the viewport, sticky the whole way down. Without this, a reader mid-derivation has scrolled the knobs away and the plot stops answering — this is the single most important detail on these pages.
- **Section order** (same for all four): hook · readout · primary canvas · geometric view · whole picture · controls · the maths · the circuit · references · take it further.
- **Deep-linkable state:** `/demos/grover?n=4&steps=9&marked=6`. **Booth mode:** `?kiosk=1` hides nav, enlarges type, resets after 2 min idle. Offline zip downloadable from `/demos`.
- **Build Grover first** — three canvases, three knobs, a full derivation, a circuit SVG. The other three are subsets.
- Every canvas gets an adjacent `aria-live="polite"` text readout. "Tap a bar to mark it" needs a keyboard path (listbox, arrows, Enter). Keep the references block visible.
- **`QC_club_Demo` has no LICENSE file.** Do not publish the demos until a human adds one (MIT code / CC BY 4.0 text).

---

## Quality gates — CI fails the build

| Gate | Threshold |
|---|---|
| Contrast | WCAG AA (4.5:1 body, 3:1 large text and UI edges) in **both** themes |
| Lighthouse mobile | ≥95 performance, accessibility, best practices |
| JS budget | <200 KB any page; <30 KB the homepage |
| Images | <180 KB each, explicit dimensions, AVIF + WebP |
| Alt text | Required by schema — a missing `alt` fails the build |
| Keyboard | Every interactive element reachable with a visible focus ring; skip-to-content link present |
| Reduced motion | Honoured everywhere as a *still version*, never a disabled feature |
| Colour independence | No meaning by colour alone — "open to join" is a word as well as a hue |

---

## Working rules

- **One PR per component group or page.** Preview deploy on every PR so a reviewer sees the page, not the diff.
- **Write `CONTENT.md` before the second page exists** — how to add an event without touching code. The failure mode for club sites is not bad code, it is one person who knows how to update it.
- **Never write to `public/demos/`** except by copying the booth bundle verbatim.
- **Never commit an image over 500 KB.**
- **Ask, do not guess,** when: content does not exist, a photo has no consent record, a number cannot be verified, or a decision from `docs/BLUEPRINT.md` §19 is still open.

## Commands

```
npm install
npm run dev        # local
npm run build      # static output to dist/
npm run preview
npm run check      # astro check + lint + a11y
```

## Reference

`docs/BLUEPRINT.md` — the full 19-section plan and the reasoning behind every rule here. Consult it for: audience strategy (§03), the page-by-page section blocks (§06), the demo spec in full (§07), migration detail (§09), and the twelve open decisions (§19).
