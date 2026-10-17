# Updating the site without touching code

This is the whole job. If you can edit a text file and drag an image into a
folder, you can keep this site current — you do not need to know what Astro is.

**The one rule:** nothing on this site is deleted. A project that has finished
gets `status: completed`; a committee member who has handed over gets
`active: false`. Both stay in the repository. The site is the club's record of
itself, and every ExCo that deletes its predecessors' work makes the next one
start from nothing.

---

## Where everything lives

```
src/content/
├─ events/       one file per event
├─ news/         one file per news post (the calendar page)
├─ projects/     one file per project
├─ people/       one file per person
├─ media/        one file per photograph  ← alt text lives here
├─ links/        the link hub (footer, /join, /links)
├─ resources/    the reading lists
├─ milestones/   the timeline on /about/journey
├─ partners/     /about/network
├─ stack/        the Quantum Stack nodes
└─ demos/        the four station pages
media-src/   original photographs (drag them in here)
```

Every file looks the same: a block of settings between two `---` lines, then
whatever you want to write underneath in Markdown.

---

## Adding an event

1. Copy an existing file in `src/content/events/` and rename it. The filename
   becomes the web address: `quantum-from-scratch.md` → `/events/quantum-from-scratch`.
   Use lowercase, hyphens, no spaces.
2. Fill in the settings:

```markdown
---
title: "Quantum from Scratch"
series: workshop          # workshop · guest-lecture · showcase · industry-talk · hackathon · social
start: 2026-09-02T19:00:00+08:00
end: 2026-09-02T20:30:00+08:00
venue: "SS TR+68"
format: "Workshop — history, then linear algebra groundwork"
difficulty: intro         # intro · intermediate · advanced · all
audience: "Anyone. This is the session that assumes nothing."
status: upcoming          # upcoming · past · cancelled
registerUrl: "https://..."   # optional — remove the line if there is no form
photos: ["poster-quantum-from-scratch"]   # ids from src/content/media/
learningOutcomes:
  - "One line per thing somebody will walk out knowing"
---

Write the description here. Two or three paragraphs is plenty.
```

3. **After the event**, change `status: past` and add the photos. Do not delete it.

**An event shows under "Upcoming" only if `status: upcoming` AND the date is in
the future.** Both. That is deliberate: a site advertising last semester's
workshop does more damage than a site with nothing on it.

---

## Posting news

News sits at the top of the calendar page. Use it to promote an event before it
happens, or to say that its photos are up afterwards.

1. Copy a file in `src/content/news/` and rename it; the filename is its address.
2. Fill in the settings:

```markdown
---
title: "Quantum from Scratch is back on 2 March"
date: 2027-02-10              # the day you post it
summary: "One or two sentences. This is what shows on the card."
event: "quantum-from-scratch-2027"   # optional: the event it is about
image: "poster-quantum-from-scratch" # optional: an id from src/content/media/
pinned: true                  # optional: keeps it first
status: published             # published, draft (hidden) or archived
---

Write the post here.
```

A post about an event links to that event's page, so the date, venue and
register button only need to be written once, in the event's file.

---

## Adding a photograph

Two steps, and the second one is not optional.

1. Drop the original into `media-src/`. Any size — the build resizes it,
   converts it and makes a phone version. Give it a sensible name:
   `quest_team_garden.jpg`, not `IMG_4471.JPG`.

2. Create `src/content/media/<some-id>.md`:

```markdown
---
file: "quest_team_garden.jpg"    # must match the filename exactly
alt: "The QuEST@EEE committee standing together outside a campus building."
consent: granted                 # granted · pending · na
usage: gallery                   # hero · gallery · illustration · history · portrait
caption: "The committee."        # optional, shown under the photo
credit: "QuEST@EEE"              # optional
takenOn: "2026-08"               # optional
people: []                       # names, so a takedown request can be actioned
aspect: "3 / 2"
---
```

Then run `npm run images` once, and refer to the photo anywhere by its id.

### alt text

**The build fails without it.** That is on purpose. Write what is in the picture
for somebody who cannot see it — "Four panellists seated with microphones in
front of a screen reading Is Quantum Supremacy Real?", not "panel photo".

### consent

- `granted` — the people in it are fine with it being published.
- `pending` — **it will not appear anywhere on the site.** Use this the moment
  anyone asks, and while you are still checking. Nothing is deleted; it just
  stops rendering until you change the word.
- `na` — no identifiable people (a diagram, a poster, a screenshot).

If somebody asks to be removed from a photograph: set `consent: pending`, push,
done. It is off the site on the next deploy.

---

## Adding or updating a person

`src/content/people/<name>.md`:

```markdown
---
name: "Sahana Vamsee"
preferredName: "..."       # optional, shown in brackets
role: "Honorary General Secretary"
roleShort: "Secretary"     # used in captions and email subject lines
department: exco           # faculty · exco · academics · projects-research ·
                           # business-outreach · publicity · operations
email: "SAHANA012@e.ntu.edu.sg"
blurb: "One line on what they are working on this year."   # optional
photo: "portrait-sahana"   # optional — leave it out and a monogram tile appears
order: 12                  # lower numbers appear first
active: true
---
```

**Handover:** set `active: false` on the outgoing committee. Do not delete them.
Add the incoming ones with new files. Then update the routing table in
`src/lib/site.ts` — that is the one place the "who to email about what" list on
`/contact` comes from.

**Photographs of people:** leave `photo` out until there is a proper portrait
session — one background, one crop, all of them in one sitting. The monogram
tile holds exactly the same space, so nothing moves when you add the real ones.
Cropped Instagram photos read as a group chat; consistent portraits read as a
team.

---

## Adding a project

`src/content/projects/<slug>.md`. The settings that matter:

```markdown
---
title: "..."
summary: "160 characters maximum — the build will tell you if you go over."
area: algorithms      # algorithms · software · research · hardware · photonics · security
difficulty: intro     # intro · intermediate · advanced
status: open          # open · active · completed · paused
started: "2026"
team: ["..."]
mentors: ["..."]
repo: "https://github.com/..."   # optional
cover: "kmeans-output"           # a media id
outputs:
  - label: "..."
    url: "..."
---
```

`status: open` is load-bearing — those get visual priority and appear on
`/join`. Change it to `active` when the team is full.

Underneath, write the body with these headings, in this order:

```markdown
## The problem
## The approach
## What a new member does
## Outputs
```

"What a new member does" is the section people actually read. Be concrete.

---

## The link hub

`src/content/links/` drives the footer, `/join` and `/links` from one place.
Change a URL once and it changes everywhere.

Set `live: false` to hide a link without deleting it. Set `expiresOn` and it
disappears on its own — useful for a recruitment cycle.

---

## Publishing a change

```bash
npm install          # once
npm run images       # after adding a photograph
npm run dev          # look at it locally — http://localhost:4321
npm run build        # what the deploy runs
```

Then commit and push. The site rebuilds and deploys itself.

**Check both themes before you call it done.** The toggle is in the top-right of
every page. Light is the default; dark is designed, not inverted, and something
that looks fine in one can be unreadable in the other.

---

## If the build fails

It fails on purpose rather than shipping something broken. The error names the
file and the line. The usual causes:

| Message | What happened |
|---|---|
| `alt text is required on every image` | A media file has no `alt:` line. |
| `Project summary must be 160 characters or fewer` | Shorten the `summary`. |
| `Invalid enum value` | A setting has a value not on its list — check the spelling against the lists above. |
| `No optimised image for "x.jpg"` | The file is not in `media-src/`, or you have not run `npm run images`. |
| `No media entry "x"` | A `photos:` or `cover:` id has no file in `src/content/media/`. |

None of these can reach the live site, which is the point.

---

## Who to ask

Software Team, via the Projects & Research Lead (Software) — the address is on
`/contact`. If you are the Web Maintainer and you are reading this because you
have just taken over: ship one content change and one component change while the
outgoing maintainer is still answering messages. That is the handover.
