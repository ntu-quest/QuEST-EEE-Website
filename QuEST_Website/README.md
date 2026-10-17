# QuEST@EEE — website

The website for **QuEST@EEE**, Quantum Engineering, Science & Technology at NTU's
School of Electrical & Electronic Engineering.

**If you are on the Publicity team, this file is written for you.** It assumes
you have never opened a code editor and do not intend to start. Everything you
need to do is editing text files and dragging images into a folder. The
developer setup is at the bottom.

> **Owner:** Publicity Lead — Chanoknon Kongkanta (Jerry), `chanokno001@e.ntu.edu.sg`

**Two versions of the site live in this folder, and they share one set of content.**
The live site is the Astro build (`src/`). The redesign is a working prototype
in `redesign/`, which reads the same files in `src/content/`. Add an event once
and it appears in both. The redesign has its own hand-over:
[how to use it](#using-the-redesign), [the everyday jobs](#the-everyday-jobs),
and [how to develop it](#developing-the-redesign).

---

## What exists, and what you are inheriting

The site is **built and working**. 29 pages, light and dark themes, every route
the plan asked for. It is a draft only in the sense that some of the content it
was designed to hold does not exist yet — and most of that content is yours.

Already done, so you do not redo it:

- All 29 photographs optimised, captioned, alt-texted and consent-tagged.
- The four interactive demo pages, the Quantum Stack, three events, three projects.
- The link hub — change a URL in one file and the footer, `/join` and `/links`
  all update together.
- `/links`, built specifically to replace the Linktree as the Instagram bio
  destination.

**Your job is not to build. It is to fill, keep fresh, and protect the brand.**

---

## The five things worth doing first

In order of what each one costs you by not existing.

### 1. Point the Instagram bio at `/links`

The Linktree still says "QCC@NTU". `/links` is already built to replace it —
logo, tagline, every link, and a registration row that appears automatically
whenever an event has a future date and a sign-up form, then removes itself
afterwards. Five minutes, and it retires a stale asset.

### 2. Rename the LinkedIn page

Still "NTU Quantum Computing Club". The site links to it anyway, because the URL
works and pretending otherwise would break the link. Once the rename goes
through, tell the Software Team so `src/content/links/linkedin.md` can drop the
apology in its description.

### 3. The ExCo portrait session

**Ten people currently show a monogram tile** — initials on a coloured square,
sized to exactly the box a photograph will occupy, so nothing on the page moves
when the real ones arrive.

When you shoot: **one session, one background, one crop, all ten.** Consistent
portraits read as a team; cropped Instagram photos read as a group chat. Square,
head and shoulders, plain background, even light. This is the biggest visual
upgrade available to the site and it costs one afternoon.

### 4. One line per committee member

Nobody has one. The card renders it the moment it exists and renders nothing
until then — no filler, by design.

Ten to fifteen words on **what they are working on this year**. Not a bio:

> ✗ "Second-year EEE student passionate about quantum computing and machine learning."
> ✓ "Running the Semester 1 foundations track and rebuilding the workshop notebooks."

The second tells a visitor what the club does. The first is on every club
website in Singapore.

### 5. Clear the CQT group photo

`fallfest_2` — around thirty students at the Centre for Quantum Technologies.
**The best photograph the club owns**, and currently invisible because consent
was never recorded. One message in the Telegram group with the photo attached
and "any objection to this going on the website?" is enough. Then change one
word (see *Consent* below) and it appears on `/about` and `/about/network`.

---

## Brand rules you are the guardian of

You are the person most likely to be asked to break these. The full contract is
`CLAUDE.md`; these are the ones that touch your job.

### The logo — read this twice

Two files, and **they are named by mode, not by ink**:

| File | What it looks like | Use it on |
|---|---|---|
| `quest-logo-light.png` | drawn **dark violet** | **light** backgrounds |
| `quest-logo-dark.png` | drawn **pale ice** | **dark** backgrounds |

Swap them and both marks vanish — the pale one washes out on paper, the dark one
disappears into black. The website handles this automatically. **You need to
know it for posters, slides and merchandise.**

- **Never below 96px tall.** "EST" is its weakest element and dies first. Below
  that, set the wordmark **QuEST@EEE** in Manrope instead.
- Clear space of at least the bracket's height on every side.
- Never on a photograph, never on a gradient, never rotated, recoloured or
  stretched.
- Hero size 140–200px desktop, 96–120px mobile.
- **If it ever needs regenerating, regenerate both files as a pair** through
  `make_logos.py`. Re-export one alone and the mark changes size when the theme
  flips.

### The old QCC mark is history, and only history

`ntuqcc.jpg` — the Bloch sphere inside a bra-ket — appears on `/about/journey`
labelled as the "before". **Never in the navigation, never as the favicon, never
on an OG image, never on anything current.** It is a record, not an identity.

### Colour and type

| | |
|---|---|
| Indigo `#4B3F94` | anything that **navigates** — links, buttons |
| Ice `#1C7386` | anything that **responds** — demos, the interactive background |
| Signal `#A8481F` | **state only** — open to join, a deadline, a warning |

Never use the signal colour decoratively. It means something.

**Manrope** (headings), **Lora** (body), **DM Mono** (labels and data). Not
Inter — that is what the old site used and what half the web uses. If a poster
needs to match the site, those three are the palette.

### The banned list — the club's own

> Glowing blue qubits · Bloch spheres as decoration · circuit diagrams as
> wallpaper · particle-field animations · "the future is quantum" ·
> atom-orbital logos · gradient meshes · dark-mode-only designs

The test, for a poster or a page: **would this element still be here if the club
were about photonics manufacturing rather than quantum?** If yes it is doing
work. If no it is costume.

A Bloch sphere *beside an explanation of a Bloch sphere* is content. A Bloch
sphere behind a paragraph about community is on the list.

---

## Doing the work

Step-by-step detail is in **`CONTENT.md`**. This is the short version of the
three jobs you will do most.

### Add an event

Copy any file in `src/content/events/`, rename it, edit the fields. The filename
becomes the web address. After it runs, change `status: past` and add the photo
ids — **do not delete it**, the archive is the strongest proof the club has.

> An event shows under "Upcoming" only if `status: upcoming` **and** the date is
> in the future. Both. A site advertising last semester's workshop does more
> damage than a site with nothing on it.

### Add a photograph

1. Drop the original into `media-src/`. Any size. Name it sensibly —
   `quest_team_garden.jpg`, not `IMG_4471.JPG`.
2. Make a file in `src/content/media/` describing it (template in `CONTENT.md`).
3. Run `npm run images` once.

**Alt text is required and the site refuses to build without it.** Deliberately.
Write what is in the picture for somebody who cannot see it:

> ✗ "panel photo"
> ✓ "Four panellists seated with microphones in front of a screen reading *Is
>    Quantum Supremacy Real?*"

**Record who took it** in the `credit` field now, while somebody still remembers.

### Consent, and the takedown path

Every photograph carries one of three words:

| | |
|---|---|
| `granted` | the people in it are fine with it being published |
| `pending` | **it renders nowhere on the site.** Nothing is deleted; it just stops appearing |
| `na` | no identifiable people — a diagram, a poster, a screenshot |

**If anyone asks to be removed:** change `granted` to `pending`, push. Off the
site on the next deploy. That is the whole process, and the footer of every page
tells people to email you to start it.

**Currently held at `pending`** — six files, invisible until somebody resolves
them. Four of them need one sentence from a person who was there:

| File | What is needed |
|---|---|
| `fallfest-cqt-group` | consent from ~30 people (see item 5 above) |
| `qid26-group` | consent only. Captioned from its sign (organised by the National Quantum Office Singapore and Quantinuum); the redesign shows it because the President asked |
| `collab-workshop-board` | which event was this? |
| `gia-lai-quantum-year` | what was QuEST's role? |
| `pitch-stage` | which event — and it shows third-party portraits on screen |
| `quantum-reservoir-pipeline` | which project produced it, and did it finish? |

> **Already handled:** the Bloch-sphere teaching slide had a video-call grid with
> names attached to faces in the corner. It ships cropped to the diagram alone.
> Do not re-import the uncropped original.

### Change a link

`src/content/links/` — one file per link, driving the footer, `/join` and
`/links` together. Change it once.

`live: false` hides a link without deleting it. `expiresOn` removes it on a date
— **use this for the recruitment form** so the site stops advertising a closed
cycle on its own.

### Look at it before anyone else does

```bash
npm run dev     # http://localhost:4321
```

Edit a file, save, the browser updates itself.

**Check both themes before calling anything done.** The toggle is top-right on
every page. Light is the default; dark is designed, not inverted, and something
that reads fine in one can be unreadable in the other.

If the site refuses to build, it is protecting you — the error names the file
and the line. Usually a missing `alt`, a summary over 160 characters, or a photo
id that does not exist. `CONTENT.md` has the table.

---

## The EUSO process, and where the site fits

Publicity material reaches the staff advisor **at least three working days
before it goes out**, with the poster and a sign-off. Events need **ten or more
participants excluding the committee**.

The website is part of that submission, not an afterthought:

1. Write the event page **first**. It exists at a real URL the moment you commit.
2. Put **that URL** in the poster's QR code. Event pages are built to work as
   standalone landing pages — they make sense with no nav and no context, which
   is exactly what somebody scanning a poster in a corridor gets.
3. Submit the poster and the page together.
4. Afterwards: `status: past`, add the photos, and the page becomes the record.

The QR code then never points at a page that does not exist yet, and the
write-up is half done before the event happens.

---

## Freshness — the thing that actually kills club websites

The failure mode is never bad code. It is one person who knows how to update it,
and then that person graduates.

| What | How often |
|---|---|
| Events | within **3 days** of being scheduled |
| Projects | reviewed **monthly** |
| People | within **2 weeks** of any handover |

At handover: mark the outgoing committee `active: false`, do **not** delete
them, add the incoming ones, and check the routing table on `/contact` still
points at people who read that inbox.

---

## Still outstanding

`OUTSTANDING.md` has the full list across all departments. The Publicity slice:

- [ ] Instagram bio → `/links`
- [ ] Rename the LinkedIn page
- [ ] ExCo portrait session, ten shots
- [ ] One line per committee member
- [ ] Consent for the CQT group photo
- [ ] Captions for the four unidentified photographs
- [ ] **A flat, one-colour version of the mark.** The gradient mark cannot be a
      32px favicon or a one-colour print. The live site's tab carries the bra-ket
      alone as a stopgap; the redesign's tab carries a crop of the full mark on a
      white or dark tile, also a stopgap. This is a real design job and it is yours.
- [ ] **An OG image** — the picture that appears when a link is shared in
      Telegram or WhatsApp. Currently falls back to the whiteboard photograph,
      which is decent but not designed.

---

## Who to ask

| About | Who |
|---|---|
| The site breaking, or anything technical | Projects & Research Lead (Software) — Rudranshi Singh |
| What content should say | President — Tisorn Na Phattalung |
| Whether a photograph can be published | You. That is the Publicity Lead's call. |

If you are reading this because you have just taken over Publicity: make one
change to the site — a caption, a link, an event — **while the outgoing lead is
still answering messages.** Not after. That is the handover.

---
---

# The redesign: using it, and taking it forward

`redesign/` is the next version of the site, built as a working prototype. It is
one long page, and **every other page opens over it as a "letter"**: a link
inside a letter draws the next one up over it, and the one beneath steps back
with its top edge showing. It reads its content from `src/content/`, the same
files as the live site, so the everyday jobs below are the same files you
already edit. `redesign/PLAN.md` has every design decision and the reasons.

## Using the redesign

### Open it on your own computer

You need **Node 22 or newer** and **Python 3** (already on a Mac). The first
time, in a fresh clone:

```bash
cd QuEST_Website
npm install                # the libraries, including the content builder's
npm run prepare:content    # makes the offline demo zip the page links to
```

Every time after that:

```bash
npm run redesign           # rebuilds the content, then serves the folder
```

Then open **http://localhost:4400/redesign/** and leave the terminal open
(Ctrl+C stops it). `npm run redesign` is the two steps
`node redesign/build-content.mjs` (re-run after any change in `src/content/`) and
`python3 -m http.server 4400`, run from `QuEST_Website/`. It has to be served
from there, not from `redesign/`: the page loads the photographs from
`../public/` and the demos' physics from `../booth-src/`. If it says "Address
already in use", the server is already running; just open the link.

`npm install` may warn that it held back install scripts (for `sharp` and
`fsevents`). That is newer npm being careful and is fine: `sharp` ships ready-made.
If `npm run images` ever fails with a `sharp` error, run
`npm install-scripts approve sharp` and install again.

After changing anything, reload with **Cmd+Shift+R** (Ctrl+Shift+R on Windows).
A plain reload can show the old files, and the tab icon is the most stubborn.

### A tour, for anyone checking a change

| Where | What it is |
|---|---|
| Top row | The mark (once you scroll), Demos, Events, Calendar, Projects, People, the light/dark switch, **Join QuEST**, and **Menu**. Below 1080px wide the five shortcuts move into the menu. |
| Menu | Every page, as rows. Explore, Demos, Events, About and Join open a list of their pages; a highlight follows the pointer from row to row. |
| The page, top to bottom | The hero (Young's two-source interference: source B leans toward your pointer), what we do, **the demos** (a reel that plays each one, then five rows), why quantum and why now, the "Start from nothing" track, a session photograph with **QuEST right now** over it, the timeline from Planck to the club, our story, the committee, partners, Join. |
| Letters | Every page (an event, a project, a demo, the calendar) opens as a letter. Put the top one down with **Back to …**, Escape, the browser's back button, or a click on the edge of the letter beneath. The cross closes them all. Each letter has its own address, such as `#/page/calendar` or `#/event/quantum-from-scratch`, so it can be shared. |
| Calendar | News first, then the month (Monday first, Singapore dates, today marked), then every event as a list. Open it from the top row, the menu, the Events page, or "The calendar" in the *QuEST right now* table. |
| Light and dark | Both are designed. Check both before calling anything done. |

## The everyday jobs

Each of these is a text file. After saving, run
`node redesign/build-content.mjs` and reload, and the redesign shows it; the live
site picks the same file up on its next build. Templates for every field are in
`CONTENT.md`.

### Plan an event that is coming up

Add a file to `src/content/events/` with `status: upcoming`, a future `start`,
and the `registerUrl` if there is a form. That one file puts the event in:

- the **calendar**, on its days, and the month it opens on;
- **News**, as the "Next session" block at the top of the calendar page;
- "Coming up" on the calendar and "Upcoming" on the Events page;
- **Next session** in the *QuEST right now* table;
- the live site's `/events`, and the registration row on `/links`.

An event counts as coming up only while `status: upcoming` **and** its date is in
the future, so nothing advertises a session that has already happened.

### After the event

Set `status: past`, then add the photographs (see *Add a photograph* above;
consent first). The first photo in `photos` becomes the large picture at the top
of the event's page; the rest go under "More pictures from the day". Its date
becomes **Last session** in *QuEST right now*. Do not delete the file.

### Post news: promote an event, or write about a new project

News is the club's blog. Add a file to `src/content/news/`:

```markdown
---
title: "Help us build this website"
date: 2027-01-12                   # the day you post it
summary: "One or two sentences. This is what the card shows."
project: "quest-website"           # the project's filename (or event: "..." for an event)
image: "acads-laptops"             # optional: an id from src/content/media/
pinned: true                       # optional: keeps it first
status: published                  # published, draft (hidden) or archived
---

The post itself. Write it like the start of a conversation: what the work is,
who it is for, and what a new member would actually do.
```

`project:` and `event:` must name a file that exists, or the live site refuses
to build. It appears as a card under **News** on the calendar page and opens as its own
letter, with a button to the event or project it names, so dates, venues and
team details are only ever written once. `status: draft` keeps a post hidden
while you write it.

### Add a new project, with its own page

Add a file to `src/content/projects/` (the template and the four headings are in
`CONTENT.md`). It appears under **Projects**, under **Research** if its `area` is
`research` or `algorithms`, and with `status: open` it counts toward **Open to
join** in *QuEST right now* and gets a "how to join" button. Then post a news
item with `project:` set to its filename to announce it.

### What updates itself, and what does not

| Updates itself from the content | Written by hand in `redesign/index.html` |
|---|---|
| The calendar, News, the Events and Projects pages, every letter | The timeline's club entries ("Our story"), the history entries before them, and their photographs |
| *QuEST right now*: committee, open projects, partners, resources, last and next session | *QuEST right now*: "180+" members, "5" live demos and Fall Fest's "5 days" |
| The people page, links, resources, the Quantum Stack | The five demo rows and the reel's captions (also `REEL` in `redesign.js`) |

When a milestone happens, add it to `src/content/milestones/` **and** to the
`club-era` list in `redesign/index.html`, until the timeline is moved onto the
content (see *Taking it to the live site*).

## Developing the redesign

### The files

| File | What is in it |
|---|---|
| `redesign/index.html` | The page itself, section by section, with a comment above each. |
| `redesign/redesign.css` | Every style. The colour tokens are at the top: light first, then dark, written twice (the system setting and the switch). No colour anywhere else. |
| `redesign/redesign.js` | The page's behaviour: theme and tab icon, top row, menu and its highlight, the hero field, the thread and the demo reel, entrances, *QuEST right now*, the timeline, the marquee. One module per heading. |
| `redesign/sheets.js` | The letters: the address router, every page (`VIEWS` and `PAGES`), the calendar, the demo explorers, and the letter stack. |
| `redesign/plots.js` | The live plots, drawn from `booth-src/physics.js`, the same file the booth's tests check. The fifth demo (H₂ by phase estimation) is here too. |
| `redesign/build-content.mjs` | Reads `src/content/` into `redesign/data/content.js`, leaving out any photograph whose consent is `pending`. |
| `redesign/data/content.js` | Generated. Never edit it; edit the content and rebuild. |
| `redesign/assets/` | The tab icons, the committee photograph and Young's engraving. |
| `redesign/checks/` | The two browser checks: every link and letter, and the letter stack against the back button. |
| `redesign/PLAN.md` | The design, the reasons, the open decisions, and the build order. |

### Adding a page

Add an entry to `PAGES` in `redesign/sheets.js` with a `crumb`, a `title`, a
short `name` (it becomes "Back to …" on the letter above) and a `body`, then link
to `#/page/<its-name>` and add it to the menu in `index.html`. A new kind of page
with its own address (as `#/news/...` was added) needs three things: the kind in
`parse()`, an entry in `VIEWS`, and the matching live-site path in `PATHS`.

### Rules that hold on every change

1. **Colours only from the tokens** at the top of `redesign.css`, in both
   themes. Check light, dark, and a phone width (390px).
2. **The logo trap:** `quest-logo-light.png` is drawn dark, for light grounds.
3. **Consent:** a `pending` photograph never ships. The one exception today is
   the QID26 group photo, written straight into `index.html` because the
   President asked for it; set it to `granted` once confirmed, before launch.
4. **Never invent content.** Every number in *QuEST right now* and every date in
   the calendar comes from a file.
5. **No " · " separators** in anything a visitor reads. Use words, a colon, a
   comma, or space.
6. **Writing:** short sentences, the club's own words, nothing from the banned
   list in this file.

### Checks before calling a change done

From `QuEST_Website/`:

```bash
node ../.claude/skills/design-taste-frontend/scripts/lint.mjs redesign
node ../.claude/skills/design-taste-frontend/scripts/inspect.mjs redesign/index.html
```

The lint should report nothing. The inspector should report **0 FAIL** and these
four warnings, which are deliberate: the italic "scratch." in the headline, no
video (the live plots replace it), the timeline holding its heading for three
screens, and the timeline scrolling sideways on a phone.

Then the two browser checks in `redesign/checks/`, with `npm run redesign`
serving the page (they use `playwright-cli`; setup is in the
[root README](../README.md#one-time-setup)):

```bash
playwright-cli open about:blank
playwright-cli --raw run-code --filename=redesign/checks/links.js   # every link and letter
playwright-cli --raw run-code --filename=redesign/checks/stack.js   # letters against the back button
```

Each prints a summary; anything listed under `problems` needs fixing. Last, open
every letter you touched, in both themes and at phone width (390px).

### Where the redesign departs from the rules below

The rules under *For developers* are the live site's contract (`CLAUDE.md`). The
redesign knowingly breaks four of them, each waiting on a decision recorded in
`redesign/PLAN.md` §9. Do not "fix" these back without that decision:

- **Entrance motion.** Sections rise in as they scroll into view; the contract
  says every section is visible at rest. The fallback keeps everything visible
  without script and under reduced motion.
- **Interactivity.** The contract allows one interactive background. The
  redesign adds the reel, the explorers, the peek window and the letters.
- **The logo below 96px.** The top row carries the real mark at under 50px.
- **Monospace.** The redesign sets data in Manrope with tabular figures, because
  the design checker fails monospace outside code; the live site uses DM Mono.

### Where the work stands

Done in the prototype: every page as a letter, the five live demos, the
timeline, *QuEST right now*, the calendar with news, both themes, phone layouts,
and the checks above all passing.

Still to do, roughly in order:

1. **Decide the four rule changes** above (`PLAN.md` §9), with the President
   and the Software lead.
2. **Confirm the content flagged in `PLAN.md` §10**: "180+ members", consent for
   the QID26 photograph, and whether the two quantum Fourier transform photos
   belong to Quantum from Scratch. Replace the two starting news posts with real
   ones.
3. **Move the timeline onto content**: the club's entries and the history
   entries are written by hand in `index.html`; they should come from
   `src/content/milestones/` (and a history collection).
4. **Port to Astro**, one step at a time, following `PLAN.md` §11. The calendar
   and news become real pages (`/events/calendar`, `/news/[slug]`), and each
   letter becomes a page reached with a View Transition.
5. **Bring the script down to budget.** The prototype loads about 130 KB of
   script and 54 KB of content on one page (before minifying); the plan's
   homepage budget is 30 KB. Splitting it per page during the port does most of
   this.
6. **Commission the flat one-colour mark** for the tab icon and small sizes.

### Working on it with Claude Code

Start Claude Code from the repository root, so it picks up the skills in
`.claude/skills/`, and point it at three files first: `Planning files/CLAUDE.md`
(the contract), `redesign/PLAN.md` (the design and its reasons) and this README.
Ask it to run the checks above before it calls a change done.

### Taking it to the live site

The redesign is not deployed. `redesign/PLAN.md` §11 is the build order for
moving it into Astro: the letters become real pages with View Transitions, the
calendar becomes `/events/calendar`, news becomes `/news/[slug]`, and the
timeline's hand-written entries move onto `src/content/milestones/`. §9 lists
the changes to `CLAUDE.md` it needs the President's and the Software lead's
agreement on first.

---
---

# For developers

Astro + Tailwind + MDX content collections → static build. Zero JavaScript by
default; islands only where the plan says so.

```bash
npm install
npm run prepare:content   # optimise images, extract the demos, zip the bundle
npm run dev               # http://localhost:4321
npm run build             # static output to dist/
```

Using Claude Code? The repository ships design, accessibility-audit and browser
skills in `.claude/skills/`. Start Claude Code from the repository root, and see
the [root README](../README.md#claude-code-skills-in-this-repo) for setup.

`npm run build` runs `prepare:content` first, so CI needs nothing extra.
`ffmpeg` is needed only for the GIF → video step; without it that step is
skipped and everything else still builds, because the converted video is
committed.

## What is where

| Path | What |
|---|---|
| `CLAUDE.md` (in `Planning files/`) | The contract. Non-negotiables, tokens, type scale, routes, real content. |
| `CONTENT.md` | How to add an event without touching code. |
| `DEPLOY.md` | Vercel and GitHub Pages, and the governance that matters more than either. |
| `OUTSTANDING.md` | Everything deliberately left out rather than invented, with the file to edit. |
| `src/styles/tokens.css` | The only place a colour is defined. |
| `src/content/` | All content, as Markdown with typed frontmatter. |
| `src/content.config.ts` | The schemas. A malformed file fails the build. |
| `src/scripts/field.ts` | The interference background. Homepage hero and `/demos` only. |
| `booth-src/` | The booth build, verbatim. **The single source for all four demos.** Never edit it to suit the website — edit it in the booth repository and copy across, or the offline build and the site will drift. |
| `public/demos/`, `public/demo-wire/`, `src/generated/` | All generated from `booth-src/` by `scripts/booth.mjs`. Not committed. |
| `public/images/`, `public/video/` | Optimised output. **Committed**, so CI needs neither the heavy originals nor ffmpeg. |
| `media-src/` | Original photographs. Not committed, never ships. |
| `scripts/` | The image pipeline, the demo extractor, the offline zip. |
| `redesign/` | The redesign: a working prototype of the whole site and its `PLAN.md`. Not built or deployed yet. See [Developing the redesign](#developing-the-redesign). |

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

See `DEPLOY.md`. Vercel and GitHub Pages are both wired up. The thing that
matters more than the choice: the repository belongs in a club-owned **GitHub
organisation** and the hosting account is a **team, not a person**. The old site
sits on Vercel under a personal account, which is exactly the risk this
repository exists to remove. Two named people hold deploy access.
