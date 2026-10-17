# QuEST@EEE — website restructure plan

**Status:** design proposal plus a working, single-page prototype. Nothing in `src/` has changed yet.
**Reference:** [mkvision.studio](https://mkvision.studio/), studied for how it moves, not just how it looks.

To see it, from `QuEST_Website/`:

```bash
python3 -m http.server 4400
# open http://localhost:4400/redesign/
```

Every click works inside the page: demos open a live explorer, spines and menu items open their page in
a sheet that rises over the site, Back or Escape closes it. Move the pointer over the hero, then scroll
slowly.

| File | What it is |
|---|---|
| `index.html` | The homepage |
| `redesign.css` | Tokens, both themes, every component |
| `redesign.js` | The motion: field, thread, ink-in, peek, menu, marquee, ket |
| `plots.js` | The five demos drawn live, from `booth-src/physics.js` |
| `sheets.js` | Every other page, opened in place, plus the demo explorers |
| `build-content.mjs` | Builds `data/content.js` from `src/content/` (run it after content changes) |
| `assets/` | Thomas Young's 1803 drawing and the 1927 Solvay photograph (both public domain), with credit records |

---

## 1. What we are keeping

All functionality stays: every route, the content collections and schemas, the booth demos and their
physics, the offline build, deep-linkable demo state and `?kiosk=1`, the filter bar's URL links, the theme
toggle, the anti-scraping `mailto:` assembly, consent filtering of photographs, `expiresOn` on links, and
the rule that nothing is invented. The redesign changes **presentation and interaction**, never the
content model. The prototype reads its content straight from `src/content/`, so it cannot drift.

Fonts stay (Manrope, Lora, DM Mono). The logo files stay, untouched.

---

## 2. What the reference does, and how it moves

I recorded the reference in a real browser (first load, slow scroll, hovers, the menu, a page change) and
read its scripts for the mechanics.

| On the reference | How it works | Ours |
|---|---|---|
| Preloader: logo assembles, % ring counts to 100 | First visit, blocks scroll | **Not taken**: it delays content and costs Lighthouse. The mark rises in with the headline instead. |
| Hero slash; the cursor pulls liquid drops off it | WebGL, metaballs on springs | **Young's field**: source A fixed, source B leaning gently toward your pointer, and a screen on the right shows the fringes landing. |
| The slash stretches into a tube down the page, landing as the showreel | Spline draw-head tied to scroll | **The thread**: the bright fringe leaves the screen as a wave that dies away as it falls, lands as one dot, and the dot opens into **the demo reel**, which cycles through all five demos. A note at its top left always says what is playing (name, station, live reading); tabs underneath switch demo, and the active one fills as its turn runs out. |
| Words ink in as you scroll | Word spans, progress-driven | Same, on the intro lead (starts at a contrast that already passes AA). |
| Velocity marquee | Speed rises with scroll velocity | *Explore · Build · Question · Become* |
| Pinned horizontal project rail | Vertical scroll slides a track sideways | **The timeline**: scroll down and the line travels from 1900 through quantum mechanics, then quantum information and computing, until the club's own era slides in on the dark ground (see §7a) |
| Video window following the cursor over services | Spring, tilt from velocity | The **peek window**: each demo's own plot, live, following the pointer |
| Page-change curtain with a convex edge | Intercepts links | **Every page opens as a sheet** that rises with a convex top edge and settles flat. In Astro this becomes a cross-document View Transition. |
| Menu panel out of its button, items stagger | clip-path from the corner | Same, every route on the site. Explore, Demos, About and Join carry a chevron and open a **dropdown** of their pages (one open at a time, the first item is the section's own page, the open one is named in the accent); Projects, Research and Events are plain links. |
| Footer slash leans to the cursor, kicks on click | Spring | A **ket ⟩** on the same spring |
| Button fill grows from the pointer | `--mx/--my` origin | Same (solid circle, no gradient) |

---

### 2a. A second reference: rigetti.com

Shared as a quantum site that looks professional. Studied in a browser at 1440px: computed type, the nav's
hover, the scroll, and each section's composition.

| What Rigetti does | What we took | What we left, and why |
|---|---|---|
| One giant hero line (130px); everything else restrained (h2 36px, h3 22px, body 16px) | The type scale came down a step: hero 144px max, section heads 68px, a single mid size (42px) for every second-level head, lead 30px. Body stays 20px (asked for earlier) | — |
| "Rigetti Right Now": the machine's live figures as a spec table on a navy card that overlaps a picture | **QuEST right now**: a real table (club, work, calendar) on the dark card, overlapping the acads photograph from the right, every value read from the site's content as the page loads | Their monospace values and labels: the design inspector fails monospace outside code, so values are Manrope with tabular figures |
| Hairline rules between rows | In the table (a real table) and between the menu's rows (asked for) | Elsewhere: the house rules separate with space and tone |
| Nav links with an underline that draws in | The top row's three shortcuts | — |
| Offset composition: a colour panel and an image overlapping, one large rounded corner | The table card (56px on one corner), and the two photographs of the "why" section set at different heights in their columns | — |
| Outlined, uppercase mono buttons | — | The pill is our one button shape |
| Logo walls, a newsletter footer | — | We have no logos to show honestly beyond the partners table, and no newsletter |

## 3. The idea

> **Thomas Young's two-source experiment, which the club's interference field already renders,**
> becomes **the hero and the thread down the page**: source B leans toward your pointer, the screen shows where the
> waves land, and the bright fringe carries you into the demos.

Young's own 1803 engraving sits in the intro: *"The field at the top of this page is this drawing, made
to move."*

---

## 4. Colour: "Readout", toned down

A trapped-ion qubit is read out bright or dark; the page alternates paper chapters and dark chapters. The
accent is that fluorescence, but **greyed toward the slate of the mark's EST** after review: the first
neon cyan was too loud.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--wash` / `--paper` | `#F4F4F7` / `#FBFBFD` | `#101219` / `#181B24` | page ground / sheets and menu |
| `--panel` / `--panel-2` | `#E5E5EC` / `#D9D9E2` | `#262B37` / `#323847` | one tone step / two |
| `--sheet-bg` / `--sheet-panel` | paper / panel | `#1F232D` / `#2C313E` | a sheet, and cards inside it |
| `--ink` / `--ink-soft` | `#15151F` / `#4B4B5D` | `#ECEDF2` / `#B5B9C9` | text |
| `--void` | `#100E24` | `#29255A` | the demos chapter and the club's era (violet) |
| `--slate` | `#172429` | `#20383F` | the figures chapter; footer and menu in dark |
| `--archive` | `#E6E6E9` | `#22252C` | the history half of the timeline (grey) |
| `--signal` | `#A6D0D5` | same | grey ice-teal: discs, the Join band, the thread on dark |
| `--signal-strong` | `#71AAB0` | `#8FBFC4` | the thread and fringes on paper |
| `--signal-ink` | `#2C656B` | `#98C8CD` | links |
| `--violet` / `--violet-field` | `#4B3F94` / `#433A85` | `#8F7FE8` / `#2B2458` | the mark's indigo |

**Dark mode is lifted grey-blues, one visible step apart, not one black.** After review ("many structures
are almost equally black/blue") every dark ground was raised and separated: page `#101219`, panels and
pills `#262B37` (1.32:1 against the page), violet chapters `#29255A`, slate `#20383F`, grey archive
`#22252C`, menu `#22383F`. **A sheet is brighter than the page behind it**, the inverse of light mode
where the page is darkened behind a paper sheet: the scrim darkens the page to near black and the sheet
is `#1F232D`, with its own cards one step brighter again (`#2C313E`).

**The history half of the timeline is an archive:** neutral greys (`--archive` `#E6E6E9`, text `#2B2B30` / `#45454B`, 11.3:1 and 7.6:1), a grey axis, greyscale photographs and pencil-style decade notes. The club's era keeps the full colour, so the change of colour marks where the club begins.

**Light mode shows the light-mode mark:** the menu and the footer are paper in the light theme, so the
light artwork appears at full size there; slate in the dark theme with the pale artwork.

**Contrast, measured:** ink/wash 16.5 · ink-soft/wash 7.8 · signal-ink/wash 6.0 · ink on signal 10.9 ·
on-void/void 16.7 · on-void-soft/slate 7.5. Dark, after the lift: ink-soft/wash 9.6 · ink-soft/panel 7.3 ·
ink-soft/sheet card 6.7 · on-void-soft/void-2 5.7 · archive text 8.4 · signal-ink/sheet 8.6. Every text
pairing clears AA. Signal fill on paper is 1.52:1, so a button on paper is ink with a signal disc.

**Chart colours** were run through the dataviz palette validator (lightness band, chroma floor, CVD
separation, contrast), and all checks pass in both modes: teal `#008B9B` and violet `#644FB1` on paper,
`#27A4B4` and `#8673D9` on dark. Teal is the data, violet is the one thing you are looking for (the marked
box, the current point). Text in charts is always ink, and reference lines are labelled in words.

**Booth compatibility:** the booth canvases read `--accent`, `--ice`, `--amp` and friends from
`tokens.css`. Those names and values do not change; the new tokens are added alongside.

---

## 5. The demos: live plots instead of videos

The six matplotlib GIFs (`QCC_qfest/assets/make_gifs.py`) were dark, off-theme and fixed in colour. They
are replaced by **plots drawn live in the page**, from the same numbers:

- `make_gifs.py` computes every frame from `verify/reference.py`; `booth-src/physics.js` is the same
  physics in JavaScript, checked function by function against that reference by the booth's test suite.
  `plots.js` calls `physics.js` and only draws. No physics is reimplemented.
- Each plot reads its colours from CSS, so it follows the theme and the chapter it sits in.
- **The reel** plays each demo for the length of its own loop (7 s, 6.4 s, 5.2 s, 6.4 s, 9.5 s), then moves on; pointer or focus holds it; the caption and the "Open the explorer" link follow whichever demo is showing; under reduced motion the tabs switch still frames.
- Each plot has a **loop** choreographed like the GIF it replaces (Grover holds each step 0–6, CHSH sweeps
  the dial, VQE rocks the knob through the minimum, Stern–Gerlach swaps the middle magnet in and out). The
  loops play in the demo reel and in the peek window; they idle off-screen and stop under reduced motion.
- Each demo opens an **explorer**: the plot plus the booth's own knobs (boxes, steps and the marked box for
  Grover; detector offset for CHSH; middle magnet and phase for Stern–Gerlach; θ and bond length for VQE),
  the hook, what it shows, and its references.

**How the plots look:** text scales with the plot (13px on a small one, about 17px on the reel); a 1px grid at every labelled value, bright enough to read on the dark chapters; reference lines named in words; Grover's bars are 72% of their slot, thick and close together, wider than the dataviz guide's 24px cap on purpose so sixteen boxes read as one row of states.

Checked against the GIFs: Grover 96% at 3 steps; CHSH S = 2.828; Stern–Gerlach 12.5% spin-down with an X
magnet in the middle; VQE −0.9576 Ha at 2.00 Å, Hartree–Fock −0.7929 Ha.

### The fifth demo: H₂ by information-theory phase estimation

From section 9 of the Qiskit and Guppy tutorial (`Quantum/Guppy testing/Q_propraming_tut`), which reproduces
the two-qubit logical circuit of K. Yamamoto et al., *Quantum error-corrected computation of molecular
energies*, PRX Quantum **7**, 020319 (2026).

- Same Hamiltonian (h₁, h₂, h₃) = (0.79605, −0.18092, −0.32096) Ha, same Trotter step (t = π/8h₁, h₂t =
  −π/32), same settings (219 random pairs, k from 1 to 12, β of 0 or π/2, ten shots each) and the same
  log Q from the paper's Eqs. 5–6. With one system qubit the circuit is simulated exactly with 2 × 2
  matrices.
- **Its "video" is the graph updating as shots grow:** log Q against candidate energy, redrawn from 10 to
  2190 shots, the peak narrowing onto the energy, with the raw bits filling in beneath. It plays when the
  demo opens and in the peek window.
- Reproduces the notebook's behaviour: exact −1.1373 Ha; this circuit's target −1.1403 Ha; full runs land
  a few millihartree below the target with an error bar of about ±0.005 Ha; k capped at 1 widens the peak
  to ±0.016 Ha; the real part alone puts an equal peak at the mirror energy, +0.50 Ha.
- Labelled as coming from the tutorial, not the booth: it is not in the offline bundle or the booth's test
  suite, and the page says so.

---

## 6. Type and composition

Fonts unchanged. Body text is now **20px** (18px on phones); captions and UI 16px. Manrope for display and
UI; Lora for running text and the one italic accent word per screen (the reference's signature, done in the
club's own faces); DM Mono for data only. 2√2 is set in MathML, so the radical is drawn properly. One grid,
one pair of margins, an axis at 42%, no hairlines, no shadows at rest, no gradients, one radius (20px), one
button shape (the pill).

**The logo.** Large in the hero (up to 240px), in the menu and in the footer (up to 190px), always in the
right artwork for the ground beneath it. The small mark in the top row appears once the hero's mark has
scrolled away, on its own pill so it never sits over running text.

---

## 7. Page by page

Routes are unchanged. In the prototype each opens as a sheet; in Astro each is a real page with the same
markup and a View Transition.

| Route | Restructure |
|---|---|
| Shell | Top row (mark, five shortcuts with a drawn-in underline: Demos, Events, Calendar, Projects, People; they sit just left of the buttons and hand over to the menu below 1080px, theme, **Join QuEST**, **Menu**); full menu as a narrower drawer of rows at 28px with a partition between each, and **one highlight that slides to whichever row the pointer or keyboard is on**; Explore, Demos, About and Join open dropdowns marked with a chevron (on Demos the chevron sits inside the "5 live" badge, so the badge is the control), their pages in two columns of smaller rows; footer with the full mark, contact as the headline and the ket; back-to-top. The top row reads the ground beneath it and switches artwork and buttons; Menu's hover is a light tint of its own ink. The browser tab carries the mark's bra-ket and Qu†: the light-mode artwork on a white tile in light mode, the dark-mode artwork on the dark ground in dark mode (`redesign/assets/favicon-{light,dark}.svg`), following the system setting and the site's own toggle. |
| Sheets | The first opens with the reference's curtain. **A link inside a sheet draws the next page up like a letter from its envelope** (it rises tilted back, overshoots a little, lies flat); the one beneath steps back, dims, and shows its top edge. "Back to …", Escape, the browser's Back or a click on that edge puts the top letter down; the cross closes every letter. Each history entry carries its index, so the stack always matches the back and forward buttons. |
| `/` | Hero → intro + Young → demos (thread lands, live reel whose **title block** names the demo large, says what it shows and carries the live reading, five demos with the peek window, which now names what it shows) → **Why quantum, and why now** (a short history leading to the timeline, then three reasons in the club's own words: it is engineering now, the uses are real and so are the doubts, anyone can start) → "Start from nothing" slip → an acads session (the quantum Fourier transform, taught by a member) → **QuEST right now**, overlapping it → marquee → **timeline** → story → committee photo → partners table → Join band → footer. Upcoming events slot in after the demos when one exists. |
| `/demos` | The demos chapter as a page: the five rows with live peeks, the offline bundle download. The field stays as the header. |
| `/demos/[slug]` | The explorer layout above the existing booth page body: live plot, knobs, readout. Physics untouched; the booth test suite must still pass. |
| `/projects`, `/projects/[slug]` | Rows with the cover as a thumbnail; project pages with facts, cover, write-up and outputs. The booth (the **EEE clubs booth for freshmen**, not Fall Fest) has no photographs, so its page shows its four screens running live; the MLDA programme's 465-pixel plot sits beside the programme's VQE figure instead of being enlarged. |
| `/events`, `/events/[slug]` | Upcoming first; past as the archive, each row with its first photograph, and a button to the calendar. **Event pages read like a post**: date and place, the lead photograph, the facts, what you leave with, the write-up, then "More pictures from the day", and a link to the calendar. They still work standalone from a poster QR code. Quantum from Scratch carries the five acads photographs and its poster; Fall Fest carries the panel, the whiteboard session and a talk. |
| `/events/calendar` (new) | **The calendar**, opened as a letter from the top row, the menu (Events, then "Calendar and news"), the "The calendar" heading in *QuEST right now*, the Events page and every event page. **News** first: the next session as a violet block whenever one is upcoming, then the posts as cards (pinned first, then newest), each opening as its own letter that links on to its event. Then **the month**: a real table, Monday first, Singapore days, today marked, previous / Today / next, a button for every month that has an event; each event a bar across the days it covers, named on its first day and at the start of each week, linking to its page. Opens on the next event's month, or the latest event's when nothing is coming. Then "Coming up" and "Every past event" as rows with photos. |
| `/news/[slug]` (new) | A post: summary, posted date, its picture, the text, and a button to the event it promotes or reports. |
| `/explore/*` | What we do (four blocks with photos), the Quantum Stack (four branches), Resources (one slip per track, real times). |
| `/research` | The ladder, the six stages, current initiatives, mentorship. |
| `/about/*` | Story; the journey as the same sideways timeline; culture (the five beliefs); people (grouped, monogram tiles until the portrait session, vacant Operations Lead shown as an opening); network as the partners table. |
| `/join`, `/links`, `/contact` | Four doors; every link; the routing table with runtime mailto. |
| `404` | Drag the ket. |

### 7a. The timeline, and how published work is credited

- **Four eras of history, then ours.** Quantum mechanics (1900–1939), testing the strangeness (1964–1982),
  information and computing (1982–2019), now (2022–2026), then *Our story* (2024 onwards): QCC's founding
  (with the **former QCC mark**, shown pale and labelled as former, beside a QCC-era poster), the freshmen
  booth, the MLDA programme, Fall Fest, the rename, Quantum × Philosophy, Quantum from Scratch, and
  "The next entry is yours", which leads to Join. Entries with photographs show two side by side, each
  drawn no larger than its file allows, so nothing small is blown up.
- **How it moves.** The stage pins while vertical scroll slides the track left; a big live year follows
  the entry under the 22% line; the title shrinks away once you start travelling; a progress bar runs from
  1900 to *Us*; a sideways trackpad swipe also moves through time; keyboard focus scrolls the focused
  entry into view. When the club's era reaches the middle of the view, the whole stage turns to the dark
  ground. On phones and under reduced motion it is a native sideways scroller with snap points.
- **Published work is never presented as ours.** Every paper sits in the history half under its authors'
  names and year ("Lov Grover finds a faster way to search"); the link says whose it is ("Grover's
  paper"); the paper's own sheet is headed *Reading list · published research by others* and says it is
  on our reading list because a demo builds on it, not our work. The club's own work only appears in the
  club's era. The old "Everything we've made" shelf, which mixed both, is gone.
- **Every history entry links to where the club meets it**: Stern–Gerlach to station three, Bell and
  CHSH to station two, Grover to station one, Peruzzo and O'Malley to station four, Feynman to the
  Quantum from Scratch workshop, the Solvay argument to Quantum × Philosophy, Sycamore to the Fall Fest
  panel, Yamamoto et al. to the fifth demo, Dirac's notation to the brackets in our mark.

---

## 8. Interaction system and budget

| Module | Where | Reduced motion | Phone |
|---|---|---|---|
| Field + screen | hero, `/demos` header; source B leans under a third of the way toward the pointer, eases over ~2 s, never faster than 60 px/s, drifts home when the pointer leaves | one still frame | still frame |
| Thread + reel | home | skipped; reel open | skipped; reel open |
| Live plots (loops) | reel, peek window | still frame | still frame |
| Explorers | demo pages | instant, no animation | full controls |
| Ink-in, entrances, counters | home, sheets | final state | runs |
| Timeline travel | home | sideways scroller | sideways scroller |
| Peek window, magnetic pills, ket | home | off | off |
| Menu, sheets, letters | everywhere | instant, no tilt | full-screen; "Back to" shrinks to its chevron |

**Budget, honestly:** the prototype loads everything on one page: about 98 KB of script plus 50 KB of
content (≈22 KB of script minified and gzipped, plus 16 KB of content gzipped). That is over the 30 KB
homepage budget. In Astro the sheets are real pages, so the homepage ships only `redesign.js` and the
plot loops (~57 KB raw, ~13 KB gzipped, before minification), and each explorer loads only on its own
demo page. Hitting 30 KB raw on the homepage means minifying and splitting the plot loops so only Grover
loads up front.

---

## 9. Contract changes that need a decision

These change `Planning files/CLAUDE.md`, and are the President's and Software lead's call.

1. **#7, "every section visible at rest".** Proposed: *nothing a reader needs is hidden at rest without a
   fallback; entrance motion hangs off `html.js`, fires once, is skipped under reduced motion.*
2. **Interactivity.** Keep one interactive *background* (the field). Add an allow-list of foreground
   interactions (§8).
3. **The logo below 96px.** The top-row mark is 52px (44px on phones), at your request to use the real
   logo there. The contract forbids the gradient mark below 96px because "EST" weakens. Either accept it in
   the header only, or commission the flat one-colour mark the contract already asks for.
4. **Colour roles.** New tokens added (§4); "indigo = navigates" retired for chrome.
5. **Videos retired** in favour of live plots (§5). `make_gifs.py` stays for the booth's printed signage.

---

## 10. Things to confirm before launch

- **"180+ members".** On the current site; the contract asks for it to be confirmed.
- **Faculty advisors.** `CLAUDE.md` names Asst Prof Chang Jin and A/P Wong Liang Jie; the site's People and
  Research pages name Prof. Mile Gu. The prototype follows the site.
- **"5 live demos".** Four booth stations plus the tutorial's H₂ demo. If the tutorial should not count, the
  chip and the menu badge go back to 4.
- **The tutorial's credit line.** The page says "the Qiskit and Guppy tutorial". Say whose it is, and
  whether to link the notebooks.
- **"@quest_eee"** as the footer's display line.
- **Photo captions corrected this round.** The whiteboard photo (`workshop-whiteboard`) is Quantum Fall Fest
  Singapore 2025, not an NTU EEE session; the three acads photos had alt texts that did not match them and
  were rewritten from the pictures. All five acads photos are attached to Quantum from Scratch as asked;
  two of them show a quantum Fourier transform slide, so the Academics Lead should confirm they belong to
  that session rather than a later one.
- **The QID26 group photograph** is `consent: pending` in `src/content/media/qid26-group.md`. The prototype
  shows it in the "why" section because the President asked for it; set it to `granted` once the Publicity
  Lead has confirmed, before it ships.
- **"QuEST right now"** counts the committee (people with an address, faculty excluded), open projects,
  partners and our own resources from the content, and dates the last and next session from the events;
  "180+ members" and "5 days" are the two fixed figures, both already on the site.
- **A new content type, News** (`src/content/news/`, schema in `src/content.config.ts`, how-to in
  `CONTENT.md`). It carries `status` like every other type. The two posts there now were written only
  from their events' own pages, as a start; edit or replace them. The Astro site has no `/news` or
  `/events/calendar` page yet: both exist only in the prototype until they are built (§11).
- **The booth's address** stays `/projects/qfest-booth` so existing links keep working; only its title and
  text changed. Rename the slug if the old name matters.
- **The tab icon** is cut from the full-colour mark. The contract still asks for a flat one-colour mark for
  small sizes (BUILD_BRIEF §4.4); this is a stand-in until it exists.
- **Photographs** used are all `consent: granted` (or diagrams marked `na`). The new committee photograph (`DSC02096`) is from the same balcony shoot as `team-balcony`; it lives only in `redesign/assets/` for now. Before it ships, put the original in `media-src/`, give it its own media entry, and have the Publicity Lead confirm consent.
- **The history entries.** Every date and attribution is standard and well documented, but the Academics
  Lead should proofread the twenty-one entries before launch. Nothing there should be the club's word alone.

---

## 11. Build order

One PR per step, preview deploy on each.

| Phase | PRs |
|---|---|
| 0. Foundations | Tokens (booth tokens untouched) · type scale · `src/scripts/motion/` · `html.js` flag |
| 1. Shell | Top row + menu · footer · back-to-top · View Transition curtain |
| 2. Plots | `plots.js` as a module beside `physics.js`; retire the videos from `MotionFigure` |
| 3. Home | Port the prototype section by section, fed by the existing collections |
| 4. Demos | `/demos` index · explorer layout on the four booth pages · the H₂ page |
| 5. Work | Projects and events |
| 6. Explore and About | What we do · stack · resources · journey · culture · people · network |
| 7. Conversion | Join · links · contact · 404 |
| 8. QA | Lighthouse ≥95 · JS budget · both-theme contrast · keyboard · reduced motion · booth test suite |

---

## 12. What was checked, and what was not

**Checked:**

- **Design skill's inspector** (1440, 768 and 390px): 0 fails. The warnings that remain are deliberate:
  - the italic accent word (requested);
  - ten type sizes, the extras being the giant set pieces;
  - "no video" (replaced by live plots, as requested);
  - the browser's default math font for 2√2;
  - the pinned timeline holding its heading on screen (the point of a pinned timeline);
  - the phone timeline scrolling sideways (the requested swipe).
- **Source lint:** clean.
- **Links:** every one crawled in a real browser. All 28 sheet routes linked from the page open with the
  right title, all 7 section anchors exist, all 56 links inside sheets resolve, the offline zip downloads,
  and every email link is assembled at runtime.
- **Interactions:** the explorers, peek window, menu and sheets were driven in light and dark at desktop and
  phone sizes. The letter stack was driven three deep and back: Escape, "Back to …", a click on a lower
  letter's edge, the cross, and the browser's back and forward buttons each leave the stack matching the
  address. No console errors.
- **Numbers:** every demo's figures checked against the GIFs and the notebook (§5).
- **Palettes:** contrast computed for every text pairing; chart palette validated.

**Not checked yet:** Lighthouse, screen readers, Safari and Firefox, and a full keyboard pass through the
explorers.

---

## Sources

- [mkvision.studio](https://mkvision.studio/)
- [IBM Carbon, data visualisation colour palettes](https://carbondesignsystem.com/data-visualization/color-palettes/)
- [Phase portraits of complex functions (viscomplexr)](https://archive.linux.duke.edu/cran/web/packages/viscomplexr/vignettes/viscomplexr-vignette.html)
- [Free-space multi-user quantum network (405 nm pump)](https://arxiv.org/pdf/2511.00466)
- [Nadlinger, "Single Atom in an Ion Trap" (Discover)](https://www.discovermagazine.com/photographed-the-glow-from-a-single-hovering-strontium-atom-1440)
- [Thomas Young's interference drawing, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Young_Diffraction.png)
- [The 1927 Solvay Conference photograph, Benjamin Couprie, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Solvay_conference_1927.jpg)
- K. Yamamoto et al., *Quantum error-corrected computation of molecular energies*, PRX Quantum 7, 020319 (2026), via the tutorial's section 9
