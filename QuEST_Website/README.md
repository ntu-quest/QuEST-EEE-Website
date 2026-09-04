# QuEST@EEE — website

The website for **QuEST@EEE**, Quantum Engineering, Science & Technology at NTU's
School of Electrical & Electronic Engineering.

**If you are on the Publicity team, this file is written for you.** It assumes
you have never opened a code editor and do not intend to start. Everything you
need to do is editing text files and dragging images into a folder. The
developer setup is at the bottom.

> **Owner:** Publicity Lead — Chanoknon Kongkanta (Jerry), `chanokno001@e.ntu.edu.sg`

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
| `qid26-group` | nobody could tell me what QID26 was — needs a caption |
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
      32px favicon or a one-colour print. The tab carries the bra-ket alone as a
      stopgap. This is a real design job and it is yours.
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

# For developers

Astro + Tailwind + MDX content collections → static build. Zero JavaScript by
default; islands only where the plan says so.

```bash
npm install
npm run prepare:content   # optimise images, extract the demos, zip the bundle
npm run dev               # http://localhost:4321
npm run build             # static output to dist/
```

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
