# QuEST@EEE — Website Blueprint v2.0

**Date:** 3 September 2026 · **Owner:** Software Team (Infrastructure)
**Replaces:** `Raspberryfruitcake/QCC_Old_Website` (Inter, dark-only, one page)
**Type:** Manrope · Lora · DM Mono

A full restructure of the club site: what replaces the old repo, what every page is for, how the mark and the photographs are used in both themes, and the order it ships in. The published version of this document (with the logo lockups, the photo inventory and a live interference background) is the "QuEST@EEE Website Blueprint" artifact.

---

## 01 — What this is built from, and what v2.0 changes

Three repositories and two design references. The new site is a restructure of the old one, not a rewrite from nothing — the old site already holds real photographs, real numbers and three real initiatives that should survive the move.

| Source | What it contributes |
|---|---|
| `Raspberryfruitcake/QCC_Old_Website` | Ten photographs, three written initiatives, the proof figures ("Singapore's first undergraduate student-run quantum club", 165 members), the People and Contact content — and a clear list of what not to repeat: Inter, dark-only, decorative circuitry, one long page. |
| `tisorn25484911/QC_club_Demo` | The **QuEST mark** in matched light and dark variants, six generated physics GIFs, four working booth demos, a tested CSS token system. |
| The site draft & Structure Framework | Voice, the exploration philosophy, the anti-cliché list, the ExCo and sub-comm structure, the membership lifecycle. |
| Apple HIG — *Design principles* | The eight-principle spine in §02, and the sentence that governs the background in §11: *don't mistake delight for decoration*. |
| Bike Bear — *Web design* | The commercial layer: a site must deliver information, capture data, convert leads and express brand values; UI, journey and navigation "intuitive, seamless and connected"; design systems and landing pages as deliverables. |

### What v2.0 changes

| Change | Why |
|---|---|
| **The palette now comes from the mark.** Earlier drafts invented a deep green. The mark is indigo, violet and ice — sampled in §10 — so the accent is indigo. | A brand colour that contradicts the logo is not a brand colour. This was the worst call in v1. |
| **Typography: Manrope, Lora and DM Mono.** Not Inter — what the old site uses and what every second site uses. | Inter is the correct safe default and therefore the wrong distinctive choice. Manrope holds up at the very large display sizes this design needs; Lora gives long-form pages a reading voice; DM Mono carries data and routes. |
| **The mark is used large, and swapped by theme.** A hero lockup at 140–200px tall, not a 28px favicon in a corner. | The strongest single asset the club owns, and it currently appears nowhere on the website. |
| **Type scale raised across the board.** 18px body, headlines to 78px, nothing below 12px. | Read on a phone, in a lecture theatre, by someone not looking hard. |
| **One interactive background** (§11) — a physical interference field the visitor can steer, not a particle field. | It is the club's own subject matter, and it is the difference between atmosphere and decoration. |
| **The old decorative circuit hero is cut.** | Circuit diagrams as wallpaper, a glow filter and a vignette are three items from the club's own banned list, already on its own website. |
| **Light mode is the default;** dark is designed, not assumed. | The old site is dark-only. A light site is what prints, what a professor opens, and what survives a bright room. |

---

## 02 — Design principles

Apple's *Design principles* give the spine, restated as things checkable on a student club's website. The four commercial jobs from the Bike Bear reference sit underneath, because a club site still has to recruit.

| # | Principle | For this site |
|---|---|---|
| 01 | **Purpose** — make something meaningful | Every page names its job before it is built. If a page cannot state its purpose in a sentence, it does not ship. |
| 02 | **Agency** — let people do things their own way | No forced funnel. Someone who already codes reaches a project in one click without reading beginner copy. Every interaction is reversible. |
| 03 | **Responsibility** — act in people's best interest | No tracking beyond a privacy-preserving page count. No cookie banner because there are no cookies. Faces and emails only with consent and a removal path. Member data off a public site. |
| 04 | **Familiarity** — build on what people know | Conventional nav, links and forms. Spend novelty on the background and the demos; none on where the menu is. |
| 05 | **Flexibility** — adapt to diverse contexts | Phone first, because Instagram is the front door. Keyboard, screen reader and reduced motion designed in, not retrofitted. Every canvas has a text equivalent. |
| 06 | **Simplicity** — be clear and direct | *Simplicity isn't minimalism.* Keep the useful close and let the rest fall away — eight homepage sections, not fifteen; hierarchy by type scale, not by boxes. |
| 07 | **Craft** — care about every detail | The mark does not shift size when the theme changes. Photographs share a crop. Numbers are tabular. Most visible to the professor you are trying to impress. |
| 08 | **Delight** — make it human, not decorative | Name the feeling: **invitation**, not awe. The field responds to you; the demos answer you. *Don't mistake delight for decoration* — if an effect carries no meaning, it goes. |

### The four jobs, underneath

Every page takes at least one; none takes all four.

- **Inform** — answer the question the visitor arrived with, above the fold, before any manifesto.
- **Capture** — get an email or a Telegram join. The site's real asset is a list you can reach in October.
- **Convert** — move someone one rung up the ladder in §05. Name the *next* rung, not the last one.
- **Express** — prove the club is real. Proof beats adjectives.

### Eight rules that follow

1. **The 3 / 30 / 3 test.** 3 seconds: what QuEST is. 30: what they'd do here. 3 minutes: found their thing and acted.
2. **One primary action per screen.** Two equal buttons is zero primary buttons.
3. **Navigation is the journey, not the org chart.**
4. **Tokens before pages.** §10 is built first.
5. **Every campaign gets a landing page** with one goal and no nav, reachable by a poster QR.
6. **Mobile is the target, not the fallback.** Both diagrams become responsive SVG with a list fallback.
7. **Proof within one scroll of every claim.**
8. **Boring where it counts.** Bold in voice, photography and the field; conventional in nav, forms and links.

---

## 03 — Five audiences, five different first clicks

| Audience | Arrives from | Needs to know | Success | Landing |
|---|---|---|---|---|
| The curious newcomer (EEE Y1–Y2) | Instagram, poster QR, a friend | That not knowing anything is fine | Joins Telegram or a workshop | `/` |
| The strong technical student | Search, GitHub, word of mouth | That there is real work here | Applies to a project or sub-comm | `/demos`, `/projects` |
| Faculty & EUSO | An email you sent | That the club is credible and organised | A talk, a URECA project, mentorship | `/research`, `/about` |
| External partners (NUS · SMU · SUTD · SQYC · industry) | A collaboration thread | Reach, track record, who to contact | Co-runs or sponsors an event | `/about/network` |
| Existing members | Telegram, bookmark | What's on, where the slides are | Turns up; finds the material | `/events`, `/explore/resources` |

**Metrics worth tracking:** Telegram/mailing-list joins per week by source link · recruitment-form starts vs completions · sign-ups originating on the site vs Instagram · repeat visitors to `/demos` and `/explore/resources`.

---

## 04 — Sitemap and navigation

Six top-level items plus a persistent Join button. Nothing more than three clicks from home. The old site had four in-page anchors on one scroll; this is the structural change that lets content grow without the page growing.

**Primary nav:** `⟨QuEST@EEE⟩ | Explore ▾ | Demos | Projects | Research | Events | About ▾ | [Join QuEST]`

- Explore ▾ — What We Do · The Quantum Stack · Resources
- About ▾ — Who We Are · Our Journey · Our Culture · People · Network

**Demos is top-level, not inside Explore.** It is the one page a first-time visitor can *use* rather than read, and it is what a poster QR code should point at.

```
/                          Home
/explore                   Hub — three cards, no content of its own
  /explore/what-we-do      Workshops · projects · research · talks · community
  /explore/quantum-stack   The interactive map. Signature page.
  /explore/resources       Router: "I know nothing" / "I can code" / ...
/demos                     Four booth demos + the offline bundle
  /demos/grover            Station 1 · search
  /demos/bell              Station 2 · correlation (CHSH)
  /demos/stern-gerlach     Station 3 · measurement
  /demos/vqe-h2            Station 4 · chemistry (+ phase estimation)
/projects                  Filterable index
  /projects/[slug]
/research                  Ladder + current initiatives
  /research/[slug]
  /research/outputs        Phase 2 — needs 3 real entries first
/events                    Upcoming (default) + past gallery
  /events/[slug]           Doubles as the sign-up landing page
/about                     Who we are
  /about/journey           Informal community → Fall Fest → SQYC → QuEST@EEE
  /about/culture           The manifesto. Nietzsche lives here.
  /about/people            Grouped by department, not by rank
  /about/network           NTU · NUS · SMU · SUTD · SQYC · industry
/join                      Four doors
  /join/roles              Departments & sub-comms, from the Structure Framework
  /join/[cycle]            Campaign landing page
/contact                   Routing table — who to email about what
/links                     Link hub. Replaces the Linktree; built for the IG bio
—— gated, Phase 3 ——
/members                   Membership network. Auth required. See §18.
```

**Navigation rule:** the Join button is persistent at every breakpoint and is the only filled element in the nav bar. On mobile it stays visible in the collapsed header rather than hiding in the hamburger.

---

## 05 — The journey spine

| Rung | | Route |
|---|---|---|
| 1 Curious | Has heard the word, knows nothing else | `/` → `/explore` |
| 2 Learn | Attends a workshop or a guest lecture | `/events` |
| 3 Build | Pushes a slider, then opens the notebook | `/demos` → `/explore/resources` |
| 4 Project | Joins a named project with a named deliverable | `/projects` |
| 5 Research | Literature → implementation → analysis → output | `/research` |
| 6 Contribute | Runs the workshop, mentors the next intake | `/join/roles` |

**Design consequence:** this is why the site needs an entry-point router rather than a single funnel — Apple's *Agency* principle in practice. Someone entering at rung 4 should never be made to read rung 1 copy.

---

## 06 — Page-by-page section blocks

### `/` Home *(Inform · Convert · Express)*

1. **Hero** — the mark at 140–200px tall, then "Don't follow the path. Explore it." One photograph: `workshop_image_2`, students at a whiteboard. The interference field (§11) behind, at low contrast. Primary *Join QuEST*; secondary text link *Try a demo →*.
2. **Statement** — "You don't have to know what you want to become. You just have to be willing to explore." Manrope 800, alone on the paper ground. The only pure-typography moment.
3. **What is QuEST — four cards** — Learn / Build / Research / Explore. Survives from the old Mission section, which had three; Explore is the addition that carries the rebrand.
4. **Proof strip** — real figures only, migrated and re-checked.
5. **Try it — demo strip** — *new.* Four live cards to `/demos`. The fastest possible answer to "are these people real".
6. **The Quantum Stack — preview** — static, links to the interactive version.
7. **Projects — three cards.**
8. **Next up** — the next two dated events. Empty → the block does not render.
9. **Journey — compressed** — four milestones on one line, with the old QCC mark shown as history.
10. **Closing CTA band** — "Explore. Build. Question. Become."

*Cut from the homepage:* culture manifesto, full network map, People, resources router, full timeline, the second philosophy section. All exist as pages.

### `/explore/quantum-stack` *(Inform · Express)*
Three branches — Software, Physics, Hardware — converging on Applications. Thesis line → interactive SVG map (each node names the projects, workshops, resources **and the demo** that show it) → accessible nested-list fallback always in the DOM. *Scope warning: the most expensive component on the site. Ship static at launch, interactive in Phase 2.*

### `/projects` *(Express · Convert)*
Header → URL-driven filter row (works without JS) → card grid where "open to join" gets visual priority → detail page (problem · approach · what a new member does · skills · team · mentor · repo · outputs). Seed from real work, including two the old site already evidences: the **MLDA@EEE × QCC quantum ML programme** and the VQE material.

### `/research` *(Express · Convert)*
Header → the six-rung ladder → how an initiative works (Problem → Literature → Implementation → Experiment → Analysis → Output, weekly check-ins, monthly reports) → current initiatives → mentorship & URECA → outputs *(Phase 2, three entries minimum)*.

### `/events` *(Inform · Capture · Convert)*
Upcoming → grouped by the two named series (monthly guest lectures; Sem 1 foundations, Sem 2 advanced) → photo-led past gallery → event detail as a standalone QR landing page with a "can't make it — get announcements" capture.

> **EUSO process:** publicity reaches the staff advisor **at least 3 working days before dissemination** with the poster and a sign-off, and events need **≥10 participants excluding the committee**. Build the event page and its short link into that submission, not after it.

### `/explore/resources` *(Inform · Express)*
Five entry points → per-track ordered path of 5–8 items with honest time estimates → club material index → reading list with a one-line "why this one" per paper.

### `/about/people` *(Express)*
Grouped by what they build, Top 4 as a small leadership row. Faculty advisors first. Full spec in §08.

---

## 07 — The booth demos, rebuilt as a section of the site

| Route | Station | The hook | Knobs |
|---|---|---|---|
| `/demos/grover` | **Grover search** | Push past the optimum and success collapses from 96% to 2% | Boxes (2–6 qubits) · Steps (0–12) · Marked boxes |
| `/demos/bell` | **Bell / CHSH** | The needle crosses 2, which no classical universe can do | Detector angle |
| `/demos/stern-gerlach` | **Stern–Gerlach** | The beam you blocked comes back | Magnets on the beam line |
| `/demos/vqe-h2` | **VQE on H₂** | Turn a knob until the energy settles — that is a molecule's ground state | Ansatz parameter · phase-estimation mode |

> **The constraint that shapes everything.** The booth build must keep working from a USB stick with no wifi. **One source of truth, two outputs:** `physics.js` and `mathfmt.js` stay shared and unmodified; only the page shell differs. Never fork the physics.

### Integration

| Option | Cost | What it gives up |
|---|---|---|
| A · iframe the booth files | An afternoon | The outline rail, deep links, search indexing, mobile layout, theme sync, analytics. A stopgap. |
| **B · port the shell, share the logic** *(recommended)* | ~1 week for Grover, ~2 days each after | Nothing that matters. Controls and canvases are plain DOM; the shell is written once for all four. |
| C · rewrite as components | Weeks | Time you don't have, and the offline build, which would drift immediately. |

### The flat page, and the problem with flattening it

Flattening the derivations out of `<details>` is right for reading and search, and it breaks the demo: once the page is four screens long the reader scrolls the knobs away and the plot stops answering.

> **Design fix — the one thing to get right.** **Pin the controls, not just the outline.** On desktop the knob panel docks to the bottom of the viewport all the way down the page. On mobile it becomes a collapsed bar with a drag handle. This is the difference between a demo and a textbook with a picture in it.

**Canonical section order (one outline shape for all four):** 1 hook · 2 readout · 3 primary canvas · 4 the geometric view · 5 the whole picture · 6 controls · 7 the maths · 8 the circuit · 9 references · 10 take it further. The rail is generated from the article's headings with scroll-spy, so it cannot drift. Below 900px it collapses to a sticky chip strip.

**Four upgrades the web version should earn:** deep-linkable state (`/demos/grover?n=4&steps=9&marked=6`) · booth mode (`?kiosk=1`) · the offline bundle downloadable from `/demos` · each demo linked to its notebook and its Quantum Stack node.

> **Blocks publication:** `QC_club_Demo` has no licence file. MIT for the code, CC BY 4.0 for the text.

---

## 08 — Introducing the team, and everything the Linktree does

### The ExCo, as site content

| Position | Name | Department | Email |
|---|---|---|---|
| President | Tisorn Na Phattalung *(Mon)* | ExCo · Top 4 | TISORN001@e.ntu.edu.sg |
| Deputy President | Thanmaya Bharadwaj | ExCo · Top 4 | E230088@e.ntu.edu.sg |
| Honorary General Secretary | Sahana Vamsee | ExCo · Top 4 | SAHANA012@e.ntu.edu.sg |
| Treasurer | Thyme Pataradilok | ExCo · Top 4 | THYME001@e.ntu.edu.sg |
| Academics Lead | Wongwaran Upawong *(Thank)* | Academics | WONGWARA001@e.ntu.edu.sg |
| Projects & Research — Hardware | Nguyen Ba Linh | Projects & Research | BALINH001@e.ntu.edu.sg |
| Projects & Research — Software | Rudranshi Singh | Projects & Research | SING0027@e.ntu.edu.sg |
| Publicity Lead | Chanoknon Kongkanta *(Jerry)* | Publicity | chanokno001@e.ntu.edu.sg |
| Business & Outreach Lead | Aniket Majee | Business & Outreach | ANIKET003@e.ntu.edu.sg |
| **Operations Lead** | **Open** — show the vacancy; "we're looking for someone to run logistics" is a recruitment ad in the place people already are | | |

> **Two mismatches to resolve.** (1) The Structure Framework defines one Projects & Research Lead; the ExCo has split it Hardware / Software — publish reality and amend the framework. (2) "Secretary" vs "Honorary General Secretary" — use the formal title on the page, the short one in captions, store both.

### Photos: the placeholder that is not a broken image

Until the shoot, every person gets a **monogram tile** — initials in Manrope, centred in exactly the box a photograph will occupy.

- **Tint, not colour-coding.** Four faint washes from the brand hues, assigned deterministically from the name.
- **One code path.** `person.photo` empty renders the monogram automatically.
- **Accessibility.** Tile is `aria-hidden`; the name is real text beside it. A photograph gets alt text of the form "Portrait of Sahana Vamsee, Honorary General Secretary".
- **When you shoot:** one session, one background, one crop for all ten. Consistent portraits read as a team; cropped Instagram photos read as a group chat.
- **One line each** on what they're working on this year.

### Emails: publish, but deliberately

Nine ExCo addresses are a deliberate exception; it does not extend to sub-committee members.

1. **Obfuscate the `mailto:`** — assemble at runtime from data attributes.
2. **Prefill the subject** — `?subject=QuEST%20—%20joining%20a%20project`.
3. **Ask about role aliases** — `quest-academics@` survives handover; a personal address does not.

### The link hub

One data file drives the footer, the Join page and a standalone `/links` page built to be the Instagram bio destination.

| Link | Destination | Icon | Appears on |
|---|---|---|---|
| **Club community** (Telegram) | `https://t.me/+F4ofanIj4lJmNmY1` | paper plane | /join · /links · footer |
| **Sub-comm recruitment** (MS Form) | `https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=SJPOFSq-K0aPwOF2WpsgSiV5At9MDQJHiOrqqCiAoTFUMlZRRzBKQktPREMwRjZLOUhNM0hKWFQxMy4u` | clipboard | /join/roles · /links *(while a cycle is open)* |
| **Instagram** | `https://www.instagram.com/quest_eee` | official IG mark | footer · /links |
| **LinkedIn** | `https://www.linkedin.com/company/ntu-quantum-computing-club/` | official LI mark | footer · /links |
| **Email us** | mailto: President (general inbox) | envelope | everywhere |
| **Demos & code** (GitHub) | `/demos` · the club org, once it exists | code brackets | /links · footer |
| **Workshop registration** | *(none now — appears automatically when an event has a `registerUrl` and a future date)* | calendar | top of /links & /join when live |

> **Three fixes the Linktree exposed.** (1) `t.me/c/2405182988/1` is an internal message link that resolves only for existing members — use the invite link `t.me/+F4ofanIj4lJmNmY1` and check it never expires. (2) The LinkedIn page is still "NTU Quantum Computing Club". (3) The Linktree bio still says QCC@NTU.

**Icon rules:** single-weight line icons at 20px, `stroke: currentColor`, inline SVG. No icon font, no CDN, no emoji. Instagram, LinkedIn, Telegram and GitHub use each platform's official mark from its own brand page. An icon never carries meaning alone.

### `/join` — four doors, and who gets the email

| Door | Goes to |
|---|---|
| I want to learn | Telegram invite + mailing list. No form, no commitment. |
| I want to build | `/projects` filtered to "open to join" — then the relevant Projects Lead. |
| I want to research | The President, subject prefilled. |
| I want to contribute | The recruitment form while a cycle is open; the interest capture when closed. |

| If your question is about… | Email |
|---|---|
| Anything at all, or you don't know who to ask | President — `TISORN001` |
| Workshops, the lecture series, learning materials | Academics Lead — `WONGWARA001` |
| Hardware projects, lab work, the booth | Projects (Hardware) — `BALINH001` |
| Software projects, the demos, this website | Projects (Software) — `SING0027` |
| Collaboration, sponsorship, industry, other universities | Business & Outreach — `ANIKET003` |
| Press, socials, posters, using our logo | Publicity — `chanokno001` |
| Reimbursements, budgets, payments | Treasurer — `THYME001` |
| Membership records, minutes, documents | Hon. Gen. Secretary — `SAHANA012` |

> **Why mailto and not a contact form.** A form needs a backend, spam handling and someone who checks it. A `mailto:` lands in an inbox already being read, and the routing table does the triage.

---

## 09 — What survives from the old site, and what does not

The old site is one dark page in Inter with four anchors. Its markup is not worth keeping. Its photographs, its three initiatives and its three proof figures are — and they are the fastest content wins available.

### The photo library, and what each one is for

| File | Size | Use |
|---|---|---|
| `fallfest_2.JPG` | 3936×2624 · 6.8 MB | **The best asset in the repository.** ~25 students at CQT. `/about` and `/about/network`. |
| `workshop_image_2.jpeg` | 3936×2624 · 1.1 MB | Students teaching students at a whiteboard. **The homepage hero** — "these people actually do things" in one frame. |
| `fallfest_3.jpg` | 1280×960 | Panel: "Is Quantum Supremacy Real?" — `/events` past gallery and the talks series. |
| `workshop_image_3.jpeg` | 1240×788 | Handwritten entanglement derivation. The literal "laboratory notebook" texture — section dividers, `/explore/resources`, the 404 page. |
| `mlda_qcc_2.png` | 465×464 | A finished output from the MLDA×QCC quantum ML programme. Project evidence, not decoration. |
| `ntuqcc.jpg` | 640×640 | **Historical only.** The former QCC mark belongs on `/about/journey` as the "before" — never in the nav, favicon or OG image. |
| `fallfest_1.JPG` | 3936×2624 · 5.2 MB | Speaker at a lectern — events gallery. |
| `mile_gu.jpg` | 733×733 | Guest-speaker portrait — permission needed, or link to his faculty page instead. |
| `mlda_qcc_1.png` | 1772×505 | VQE loop diagram — illustration on the VQE demo and its project page. |
| `workshop_image_1.jpeg` | 1678×943 | Bloch-sphere teaching slide — see the consent flag below. |

> **Before any of these are published.**
> **Weight.** Two files are 3936×2624 at 5–7 MB; as-is they'd be the slowest thing on the site by an order of magnitude. Resize to 2000px max, export AVIF with a WebP fallback, serve a 640px variant to phones, target under 180 KB each.
> **Faces.** `fallfest_2` shows ~25 identifiable people; `workshop_image_1` includes a video-call grid with names attached to faces. Get consent for the group photo and crop the participant thumbnails out of the slide image entirely. `fallfest_3` shows a slide containing third-party portraits — check before republishing.
> **Attribution.** Record who took each photograph in the image's frontmatter now, while anyone still remembers.

### The GIF library nobody is using

`QC_club_Demo/assets/` holds six generated physics animations — `bloch_hadamard`, `bloch_phase`, `chsh_dial`, `grover_amplitudes`, `matrix_transform_3d`, `qpe_comb` — from the club's own `make_gifs.py`. Better than any stock illustration because they are correct and they are yours.

- **Convert every one to muted looping MP4/WebM.** `vqe_h2_well.gif` is 693 KB and `chsh_dial.gif` is 601 KB; as video they are a fraction of that.
- **Illustration, not wallpaper.** A Bloch sphere beside an explanation of a Bloch sphere is content; a Bloch sphere behind a paragraph about community is what the club's own banned list forbids.
- **Pair each with its demo:** `grover_amplitudes` → `/demos/grover`, `chsh_dial` → `/demos/bell`, `vqe_h2_well` → `/demos/vqe-h2`, the Bloch pair → the beginner resources track.
- Every one gets `prefers-reduced-motion` handling: first frame as a static poster, play on request.

### Content that must survive the move

| From the old site | Goes to | Treatment |
|---|---|---|
| The three proof figures | Homepage proof strip | Keep "Singapore's first…" and the member count; **recompute "8+ months"** — written last year it now reads as a club that stopped. Prefer a figure that ages well ("running since 2025"). |
| Foundational Workshops | `/events` series + `/explore/resources` | Becomes the workshop series with real dates, not a paragraph. |
| Quantum FallFest Singapore 2025 | `/events/past` + `/about/journey` | The strongest track-record item. Photo-led, with the CQT group shot. |
| MLDA@EEE × QCC quantum ML programme | `/projects` | A project entry with its clustering figure as the output; also evidence for `/about/network`. |
| Mission: Learn / Build / Research | Homepage four cards | Add **Explore** as the fourth — that addition is the rebrand in one card. |
| Club Supervisor + Student Leadership | `/about/people` | Replaced by the current ExCo (§08) and the two faculty advisors. |
| Contact: email + Telegram | `/contact`, `/links` | Becomes the routing table and the link hub. |

### What does not survive

- **Inter** — the correct safe default and therefore the wrong distinctive choice.
- **Dark-only** — both themes, light as default.
- **The decorative circuit hero** — an inline circuit SVG with a dot grid, a Gaussian glow filter and a vignette. Three items from the club's own banned list, on the club's own site.
- **"Democratizing and Demystifying quantum computing at NTU."** Two abstract verbs before the reader knows what the club is. The draft's own line is stronger.
- **The single-page anchor structure.**
- **The QCC name and mark** as current identity — history, and labelled as history.

> **Repository.** Start a new repo under a club-owned GitHub **organisation** rather than forking from a personal account, and copy the ten assets across. Keep the old repo public and archived — it is part of the journey.

---

## 10 — The mark, the palette and the type

The mark is `⟨Qu|EST@EEE⟩` — a bra-ket enclosing a Q with a dagger. Dirac notation and a Hermitian conjugate, drawn as a monogram. It is a better piece of design than the site it is missing from, and the whole identity should be derived from it rather than invented alongside it.

### Two files, two modes, one size

- `quest-logo-light.png` — the **light-mode** artwork, drawn dark (deep violet · slate · ice). Use on LIGHT grounds.
- `quest-logo-dark.png` — the **dark-mode** artwork, drawn pale (ice · periwinkle · indigo). Use on DARK grounds.

> **The trap in the filenames.** They are named by **mode**, not by ink. Swap them and both marks lose their contrast — the dark-mode mark's pale "EST" washes out on paper, and the light-mode mark's deep-violet "Qu" disappears into ink. Put that sentence in a comment above the `<picture>` element.
>
> Even used correctly, **"EST" is the weakest element in the light-mode mark** — pale, outlined, and the first part to disappear as the mark shrinks or is printed. So: never render the gradient mark below about 96px, and make the flat one-colour version a priority rather than a nicety.

`make_logos.py` already crops both to their real artwork and pads them onto one shared 1114×624 canvas, so a fixed `height` renders an identical mark either way. **Do not re-export either file independently** — if the mark changes, regenerate both through that script.

**Usage rules**

- **Large.** Hero lockup 140–200px tall on desktop, 96–120px on mobile. Nav 40–48px.
- **Theme swap** via `<picture>` with `prefers-color-scheme` plus a `[data-theme]` override, so an explicit toggle beats the OS setting in both directions.
- **Clear space** of at least the bracket's height on every side. Never on a photograph, never on a gradient, never rotated or recoloured.
- **Commission a flat single-colour version** for the favicon, OG image, small nav sizes and one-colour print.
- **The wordmark in running text** is "QuEST@EEE" in Manrope — never the image.

### Palette, sampled from the mark

Dominant hues in the artwork: indigo 240°, violet 270–280°, ice cyan 180°. Neutrals carry a faint violet bias so a grey reads as chosen rather than inherited.

| Token | Light | Dark | Role |
|---|---|---|---|
| Paper | `#FAFAFC` | `#0C0B12` | page ground |
| Sheet | `#F1F0F7` | `#15141D` | panels, table heads |
| Ink | `#14131C` | `#EDECF4` | violet-black text |
| Muted | `#6A6880` | `#8B88A2` | labels, captions |
| **Indigo (accent)** | `#4B3F94` | `#A79BEE` | links, primary action |
| **Ice (2nd accent)** | `#1C7386` | `#6FC5D8` | demos, anything interactive |
| Signal | `#A8481F` | `#E0906B` | state only |

The two brand hues mirror the mark's own two-colour structure — indigo for anything that navigates, ice for anything that responds.

> **Reconciling the gradient.** The mark is a metallic gradient; the earlier draft banned gradients. Both can be true: **the mark keeps its gradient, the interface stays flat.** One exception — the interference field in §11, which is a rendered physical quantity rather than a decorative fill.

Adopt the booth's existing token *names* — `--ink`, `--ink-soft`, `--ink-faint`, `--panel`, `--panel-2`, `--wash`, `--rule`, `--elevation`, `--radius`, `--marked` — since `shared.css` is tested code already driving four pages. Map the values above onto those names, add `--accent` and `--ice`, and `shared.css` becomes the site's `tokens.css`.

### Typography

From the Figma type recommendations, with one deliberate rejection: **not Inter**, which tops that list, is what the old site uses, and is what half the web uses.

| Role | Face | Why this one | Scale |
|---|---|---|---|
| Display | **Manrope** 600–800, tracking −0.03em at large sizes | A variable geometric-humanist sans that stays crisp at 78px and legible at 14px; the Figma list calls it friendly and welcoming and notes it works for headings, body and logos. One variable file. | 78 / 46 / 25 / 18 |
| Body | **Lora** 400/500 | A serif with calligraphic influence and strong serifs; gives the manifesto, the culture page and the demo derivations a reading voice a UI sans cannot. Prevents the site reading as a product landing page. | 18 / 16 |
| Utility | **DM Mono** 400/500 | The one role the Figma list does not cover — routes, physics readouts, dates, code. Sits quietly next to Manrope's geometry. | 14 / 12.5 / 11 |

**Type rules**

- **Nothing below 12px anywhere,** body at 18px, 17px minimum on mobile.
- **Measure near 65 characters** for running text; tables and diagrams go wide inside their own scroll container.
- **One scale, no improvisation:** 78 / 46 / 32 / 25 / 20 / 18 / 16 / 14 / 12.5 / 11.
- `text-wrap: balance` on every heading; uppercase labels at 0.14–0.18em tracking; tabular numerals wherever digits line up.
- **Two families plus one mono,** variable where available, `display=swap`, preconnected, Latin subset, with real fallback stacks.

---

## 11 — The interactive background

Two coherent sources emit into a plane; where crests meet, the field is bright; where a crest meets a trough, it cancels. The pointer is the second source. The λ control changes fringe spacing.

### Why interference and not particles

| | |
|---|---|
| **It means something** | Superposition and interference are the actual subject. The fringes are the same phenomenon the Bell and Grover demos are about — a quiet first lesson, not a screensaver. |
| **It answers** | Apple's *Agency* principle at its smallest scale: the page responds to you within the first second, before you click anything. |
| **It is quiet** | Rendered at a fraction of display resolution into a small buffer and scaled up, so it is cheap on a phone. Never above 10% contrast; text always wins. |
| **It is honest** | *Don't mistake delight for decoration.* The field earns its place because it is the club's subject and it is interactive — and it is cut automatically whenever it would cost the reader anything. |

### Specification

| Aspect | Rule |
|---|---|
| Where | Homepage hero and the `/demos` index header **only**. Never behind running text, never on `/about`, `/join`, an event page or a form. |
| Render | A canvas at ~1/6 display resolution (≈200×120 buffer) scaled up; the resulting softness is the aesthetic. One `ImageData` write per frame. |
| Colour | The indigo and ice tokens at ≤10% alpha over the page ground, read from the CSS custom properties so it follows the theme. No third colour, no gradient stops, no glow. |
| Motion | Capped at 30 fps; phase advances slowly enough to read as still at a glance. Paused by `IntersectionObserver` off-screen and on `document.hidden`. |
| Interaction | Pointer drives the second source, eased with a lag so it feels like a field rather than a cursor trail. Touch: follows a tap. The field is `aria-hidden` — no keyboard interaction required. |
| Reduced motion | `prefers-reduced-motion: reduce` → draw one frame and stop; no loop is ever started. The still frame is the design, not a degraded version. |
| Low power | Skip the loop below 720px, on `hardwareConcurrency ≤ 4`, or when `saveData` is set. Static frame in all three cases. |
| At rest | First frame drawn synchronously on load. A screenshot, a link preview and a reader who never moves the pointer all see the finished design. |
| Budget | Under 2 KB of JavaScript. |

> **Two variants worth prototyping.** (1) Anchor the two sources to the two hero buttons, so the fringes shift as the layout responds — the field becomes a property of the page rather than an overlay. (2) Drive the field from the club's own `physics.js`: one Grover iteration every few seconds, amplitudes as the field. Ties the background to the demos; riskier, because it can read as a loading animation.

> **The line not to cross.** One interactive background, in one place, at one intensity. The moment a second animated effect appears elsewhere, both become decoration and the argument in this section stops being true.

---

## 12 — Component library

Twenty-five components cover the entire site.

| Component | Used on | Notes | Phase |
|---|---|---|---|
| SiteHeader / MobileNav | all | Mark at 40–48px, persistent Join button, two dropdowns | 0 |
| Logo | all | `<picture>` theme swap, fixed height, filename warning in a comment | 0 |
| Hero | /, section fronts | Mark + headline + one primary action. Sized to content, never 100vh | 0 |
| Field | /, /demos | The §11 canvas. Static first frame, then optional animation | 1 |
| StatementBlock | /, /about/culture | Manrope 800 on plain ground. Three instances site-wide | 0 |
| CardGrid + Card | most pages | One card object, five variants | 0 |
| CTABand | foot of every page | Names the next rung | 0 |
| Footer | all | Nav repeat, link hub data, contact, NTU EEE attribution | 0 |
| MonogramAvatar | /about/people, /join | Initials tile in the photo's exact box | 0 |
| LinkRow / LinkList | /links, /join, footer | One data source for all three surfaces | 0 |
| IconSet | everywhere | Inline SVG, 20px, currentColor | 0 |
| ObfuscatedMailto | people, /join, /contact | Runtime assembly; prefilled subject | 0 |
| ContactRouter | /join, /contact | "If your question is about… email…" | 0 |
| Figure | everywhere | AVIF/WebP, fixed aspect ratio, caption, credit, no layout shift | 1 |
| MotionFigure | demos, resources | Converted GIFs as muted looping video with a poster | 1 |
| ProofStrip | / | 3–4 real figures, tabular numerals, no icons | 1 |
| ProjectCard / ProjectDetail | /projects | Status badge is load-bearing | 1 |
| EventCard / EventDetail | /events | Detail doubles as a QR landing page | 1 |
| FilterBar | /projects, /events | URL-driven, shareable, works without JS | 1 |
| PersonCard / DeptGroup | /about/people | Degrades to the monogram | 1 |
| Timeline | /about/journey | Horizontal desktop, vertical mobile, same data | 1 |
| DemoShell / DemoOutline / ControlDock | /demos/[slug] | Outline rail + article + sticky knob panel | 1 |
| CanvasFigure | /demos/[slug] | Canvas + caption + live-region readout | 1 |
| StackDiagram / NetworkMap | /explore, /about | Static SVG P1, interactive P2; list fallback always in the DOM | 1→2 |
| ResourceRouter | /explore/resources | Anchored tracks, not modals | 2 |
| EmptyState | index pages | Never a blank grid | 1 |

---

## 13 — Content model

Content lives in Markdown with typed frontmatter, not in code.

**project** — `title, slug, summary (≤160), area[algorithms|software|research|hardware|photonics|security], difficulty, status[open|active|completed|paused], team[], mentors[], started, repo, outputs[{label,url}], cover, featured`

**event** — `title, slug, series[workshop|guest-lecture|showcase|industry-talk|hackathon|social], start, end, venue, format, difficulty, audience, learningOutcomes[], registerUrl, capacity, photos[], recap, status`

**person** — `name, preferredName, role, roleShort, department[academics|projects-research|business-outreach|publicity|operations|exco], team, year, photo (empty renders the monogram), email, blurb (10–15 words), links[github|linkedin], active`

**demo** — `title, slug, station(1–4), concept, hook, stackNodes[], knobs[{label,range}], sections[] (what the outline rail renders), references[{citation,url}], offlineBundle, workshop`

**link** — `label, description, url, icon[telegram|form|instagram|linkedin|email|github|calendar], order, surfaces[links|join|footer], live, expiresOn`

**media** — `file, alt (required — the build fails without it), credit, takenOn, consent[granted|pending|na], people[] (for takedown requests), usage[hero|gallery|illustration|history]`

**resource** — `title, track, order, type, source[quest|external], url, estimatedTime, why`
**milestone** — `year, title, blurb, photo, links[]`

> **Two rules.** Every type carries `active` or `status` and the site filters on it — nothing is deleted at handover, so the site becomes the club's institutional memory. And `media.alt` is required at the schema level: a missing alt text fails the build rather than shipping.

---

## 14 — Motion, accessibility and performance

| Area | Rule | Checked by |
|---|---|---|
| Motion | Hover/focus transitions only, 120–180ms. No scroll-triggered reveals — every section visible at rest so a shared link previews correctly. The §11 field is the only ambient motion. | Review |
| Reduced motion | Honoured everywhere: field draws one frame, video shows its poster, demo stepping redraws instantly. Never a disabled feature — always a still version. | Manual, both settings |
| Contrast | WCAG AA: 4.5:1 body, 3:1 large text and UI edges, in **both** themes. | axe / Lighthouse |
| Keyboard | Everything reachable and visibly focused. Demo bars are a listbox with arrow keys. Keep the old site's skip-to-content link. | Tab through, no mouse |
| Screen reader | Real heading order, alt on every photograph, live-region readouts beside every canvas, list fallbacks for diagrams. | VoiceOver spot check |
| Colour independence | No meaning by colour alone — "open to join" is a word as well as a hue. | Greyscale screenshot |
| Images | AVIF + WebP fallback, explicit width/height, 640px phone variant, under 180 KB each, lazy below the fold. | Build script |
| JavaScript | Under 200 KB any page; under 30 KB on the homepage. | Bundle report |
| Lighthouse | ≥95 mobile on performance, accessibility, best practices. | CI on every PR |
| Fonts | Two families plus one mono, variable, `display=swap`, preconnected, Latin subset, real fallback stacks. | Review |

---

## 15 — Stack, repo and workflow

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro** + Tailwind + MDX content collections | Content-heavy and mostly static: zero JS by default, and the stack diagram, the field and each demo become single islands. Typed collections enforce §13 at build time. |
| Hosting | **GitHub Pages** or Vercel, free tier | No budget line, no renewal to forget. Pages dies with the repo, not with someone's personal account — the old site is on Vercel under a personal account, which is exactly the risk. |
| Repo | A club **GitHub organisation**, new repo, assets copied over | Survives graduation. Set the org up before the first commit. |
| Forms | NTU Microsoft Forms, embedded | No backend, no data-protection surface. |
| Mailing list | One provider, chosen once (Buttondown / MailerLite free tier) | The Capture job needs somewhere to capture *to*. |
| Analytics | Plausible or Umami, or none | Cookie-free, so no consent banner. Consistent with *Responsibility*. |
| Domain | `quest-eee.github.io` first; ask about an NTU subdomain | Ship on the free domain; a custom domain is a redirect away. |

```
quest-website/
├─ src/
│  ├─ components/        the 25 components in §12, one file each
│  ├─ layouts/           Base, Page, Detail, Demo, Bare (for /links)
│  ├─ pages/             routes exactly as §04
│  ├─ content/
│  │  ├─ projects/ events/ people/ demos/ links/ resources/ media/
│  │  └─ config.ts       the §13 schemas, enforced at build
│  ├─ scripts/field.ts   §11 — under 2 KB
│  └─ styles/tokens.css  §10 — the only place colours are defined
├─ public/
│  ├─ brand/             quest-logo-light.png · quest-logo-dark.png · flat mark · favicon
│  ├─ demos/             the offline booth bundle, verbatim
│  └─ images/            AVIF + WebP, named by slug
├─ CONTENT.md            how to add an event without touching code — write this first
└─ README.md             local setup in five commands
```

- Content changes go in as pull requests; Publicity reviews copy, Software Team reviews code. Preview deploys mean a reviewer sees the page, not the diff.
- **Write `CONTENT.md` before the second page exists.** The failure mode is not bad code — it is one person who knows how to update it.
- Name a **Web Maintainer** distinct from the person who builds it, and hand over during the year rather than at the end.

---

## 16 — Content inventory and owners

| Asset | Owner | Needed by | Notes |
|---|---|---|---|
| Brand pack: both logo files + flat one-colour mark + favicon + OG image | Publicity | Phase 0 | The two PNGs exist; the flat version and OG image do not |
| ExCo roster + one line each | HGS | Phase 0 | Names, roles and emails exist — only the one-liners are missing |
| Link hub data + rebranded bio copy | Publicity | Phase 0 | Also rename the LinkedIn page and the Linktree bio |
| Hero + homepage copy | President / Publicity | Phase 0 | Mostly written in the draft — needs trimming, not writing |
| Old-site photo migration: resize, convert, alt text, credits, consent | Publicity | Phase 1 | Ten files, half a day, unblocks the whole visual design |
| GIF → video conversion (6 files) | Software Team | Phase 1 | One ffmpeg command each; cuts ~2 MB of page weight |
| Demo ports (4 pages) + outline & control dock | Software Team | Phase 1 | Engineering time, not writing time. Grover first |
| Licence file on `QC_club_Demo` | Software Team / President | Phase 1 | Ten minutes; blocks publishing the demos |
| 4–6 project entries | Projects & Research Lead | Phase 1 | Two already evidenced by the old site |
| ExCo portrait session (10 shots, one background, one crop) | Publicity | Phase 1 | Monograms hold the layout until then |
| Event entries + Fall Fest gallery | Operations + Publicity | Phase 1 | The archives are the strongest proof the club has |
| Workshop series outline | Academics Lead / Curriculum | Phase 1 | Sem 1 foundations, Sem 2 advanced |
| Resource tracks (5 × 5–8 items) | Content Dev + Reading Coordinators | Phase 2 | The *why* line on each item is the whole value |
| Journey milestones | President | Phase 2 | Five entries; the old QCC mark opens it |
| Network partner logos + permission | Business & Outreach | Phase 2 | Never display a mark without asking |
| Faculty advisor bios | President | Phase 1 | Check the wording with each advisor |

> **Freshness SLA.** Events updated within 3 days of scheduling. Projects reviewed monthly. People updated within 2 weeks of each handover. "Upcoming events" showing last semester's date does more damage than having no site.

---

## 17 — Build phasing

**Phase 0 — Foundation · 2 weeks · by late Sep 2026**

- GitHub org, new repo, Astro scaffold, deploy pipeline, `tokens.css` from §10, both logo files in place, ten Phase-0 components.
- Live pages: `/`, `/about/people`, `/join`, `/links`, `/contact`. Nothing else.
- Mark large in the hero, monogram avatars for all nine ExCo, Telegram *invite* link live, mailing list wired.
- `CONTENT.md` written. Web Maintainer named. Second deploy key issued.
- **Exit test:** a stranger on a phone learns what QuEST is and signs up in under a minute — and the Instagram bio can point at `/links` instead of the Linktree.

**Phase 1 — Proof · 4 weeks · before Qiskit Fall Fest, Oct–Nov 2026**

- **All four demo pages** — the highest-value item in the phase. Grover as the template.
- Photo migration complete; GIFs converted; the interference field shipped.
- `/projects` (4+ real entries), `/events`, `/about`, `/explore/what-we-do`, static Quantum Stack.
- Each Fall Fest session gets an event page with its own short link for posters.
- **Exit test:** the site can be sent to a professor or partner university with no covering explanation.

**Phase 2 — Depth · Dec 2026 – Feb 2027**

- `/research`, `/explore/resources`, `/about/journey`, `/about/network`, `/about/culture`.
- Quantum Stack becomes interactive; `/research/outputs` opens once three real outputs exist.
- **Exit test:** a member visits the site for something they need, not because they were sent a link.

**Phase 3 — Network · AY2027 · gated**

- The membership platform: authenticated member area, cross-university directory, infrastructure booking.
- A URECA project rather than an ExCo side task — backend, auth model, data-protection review.
- **Gate:** does not start until Phases 0–2 are live, maintained, and someone other than the original author has shipped a change.

---

## 18 — Risks, governance and handover

| Risk | Looks like | Mitigation |
|---|---|---|
| **Abandonment** — what happened to the old site | Last event dated Nov 2026, viewed in March | Named Web Maintainer; freshness SLA §16; mid-year handover; Markdown content |
| **Personal-account hosting** | The site disappears when someone graduates | Org-owned repo and hosting from day one; two deploy keys; credentials in a club store |
| **Empty-shell launch** | Headings with nothing under them | Three-real-entries rule; `EmptyState` for the honest cases |
| **Photo consent and takedown** | A group photo of 25, one of whom wants out | `media.consent` and `media.people` in the schema, removal path in the footer, thumbnails cropped from the slide image |
| **Member data on a public site** | A directory readable by anyone | Current active committee only; anything more goes behind auth in Phase 3, staff advisor consulted |
| **Brand drift** | Three versions of the mark, a fourth accent colour | One brand folder, one `tokens.css`, logo regenerated only through `make_logos.py` |
| **Publicity process** | A page goes live before the staff advisor has seen it | Public launches follow the same 3-working-day publicity submission as posters |
| **The background becomes decoration** | A second animated effect appears elsewhere | §11 is a one-place rule. Review any new ambient motion against it, or delete both |
| **Scope creep into a product** | The membership platform delays the site a semester | Phase 3 gated (§17), scoped as a URECA project |

**Handover checklist — every ExCo transition**

- Org ownership and deploy access to two incoming members, outgoing pair reachable for a month.
- People entries marked `active: false`, not deleted; new ExCo added; email routing updated.
- Domain, mailing list and analytics logins in the club password store, never a personal one.
- The incoming Web Maintainer ships one content change and one component change before the outgoing one stops answering.

---

## 19 — Twelve decisions the ExCo owes the build

| Decision | Recommendation |
|---|---|
| New repo under a club org, or fork the old one? | New repo under a club organisation; copy the ten assets; archive `QCC_Old_Website` rather than deleting it. |
| Domain — NTU subdomain, custom, or GitHub Pages? | Ship on GitHub Pages now; ask the staff advisor about an NTU subdomain in parallel. |
| Confirm the type pairing? | Manrope + Lora + DM Mono. The only real alternative is dropping Lora and running Manrope alone — cleaner, but the site loses its reading voice. |
| Confirm indigo as the accent? | Yes — sampled from the mark. Ice is the second accent for anything interactive. Write both into `tokens.css` once and stop revisiting. |
| Commission a flat one-colour mark? | Yes. The gradient mark cannot be a 32px favicon or a one-colour print. |
| Interference field, or one of the §11 variants? | Build the interference field for Phase 1; prototype the Grover-driven variant afterwards and adopt it only if it does not read as a loading spinner. |
| Photo consent for the CQT group shot and the Zoom slide? | Ask the group before publishing; crop the participant thumbnails out of the slide image regardless. |
| Where does the mailing list live? | Pick one free provider this week. Every CTA depends on it existing. |
| Web Maintainer and second deploy key? | Two named people in the Software Team, minuted, before the first commit. |
| Demos — iframe, or port? | Port (§07). Iframing ships a week sooner and costs the outline, deep links, mobile and search. |
| Licence on `QC_club_Demo`? | MIT for the code, CC BY 4.0 for the text, before the demos go public. |
| Two Projects & Research Leads — amend the framework, or merge the roles? | Amend the document to match reality. The site should never contradict the club's own constitution. |

---

**One last thing.** The strongest line in the draft is the test set for the whole site: a visitor should think *"these people actually do things"* rather than *"these people are interested in quantum"*. Everything here is downstream of that sentence — which is why the demos, the photographs and the dated events are on the critical path, and the manifesto is not.

---

*QuEST@EEE Website Blueprint v2.0 · 3 September 2026 · built from the site draft, the QuEST Structure & Operational Framework (Jul 2026), `Raspberryfruitcake/QCC_Old_Website` and `tisorn25484911/QC_club_Demo`, with design principles from Apple's Human Interface Guidelines and Bike Bear's stated web-design approach, and typography from the Figma type recommendations. Process references follow the EEE Undergraduate Students Office briefing of 30 Jul 2026; reconfirm anything time-critical with the staff advisor.*
