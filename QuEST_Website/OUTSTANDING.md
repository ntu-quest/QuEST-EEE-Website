# What is missing, and where it goes

"Never invent content" is a non-negotiable in `CLAUDE.md`. Where something did
not exist, the block does not render — no lorem, no plausible-looking numbers,
no invented blurbs. This is the list of every such gap, with the exact file to
edit. Nothing here blocks the site going live.

Ordered by how much each one is costing you.

---

## 1. Blocking publication

### The `QC_club_Demo` licence
**Blocks:** all four demo pages, which are the strongest thing on the site.
MIT for the code, CC BY 4.0 for the text. Ten minutes' work. Until it exists,
publishing the ported demos publishes someone's unlicensed work.
→ Add `LICENSE` to the booth repository. Then, if you want the demos hidden in
the meantime, set `published: false` in `src/content/demos/*.md` — the route
disappears and the homepage strip empties itself.

### Photo consent — two files
Both are in the repository, both are set to `consent: pending`, and **neither
renders anywhere on the site** until that word changes.

| File | Why it is held | Where it would appear |
|---|---|---|
| `fallfest_2.JPG` | ~30 identifiable people at CQT. The best photograph you own. | `/about`, `/about/network`, the Fall Fest event page |
| `mile_gu.jpg` | A portrait, permission not recorded | `/about/journey` |

→ `src/content/media/fallfest-cqt-group.md` and `mile-gu-portrait.md`, change
`consent: pending` to `granted`.

*Already handled:* `workshop_image_1` had a video-call grid with names attached
to faces in the top-right. It is cropped to the Bloch sphere alone and ships as
`workshop_bloch_sphere.jpg` — no faces, no names.

---

## 2. Costing you recruitment

### One line per committee member
Nine people currently show a name, a role and an email. The card renders the
line the moment it exists; without it, it renders nothing rather than filler.

→ `blurb:` in each `src/content/people/*.md`. Ten to fifteen words on what they
are working on **this year**. Not a bio.

### The ExCo portrait session
Every person shows a monogram tile that occupies exactly the box a photograph
will occupy, so nothing moves when the photos arrive. One session, one
background, one crop, all ten — consistent portraits read as a team; cropped
Instagram photos read as a group chat.

→ Drop the files in `media-src/`, add a `src/content/media/` entry each,
then set `photo:` on the person. `CONTENT.md` has the steps.

### Two more projects
`/projects` has three real entries. The plan asks for four or more. Two
candidates are already evidenced in the repository but I could not write them
honestly:

- **Quantum reservoir computing / anomaly detection.** There is a finished
  pipeline diagram (`quantum_reservoir_pipeline.png`, held at
  `consent: pending`) showing data encoding → quantum reservoir → feature
  readout → ridge regression → anomaly detection. I have the picture and no
  idea who ran it, when, or how it ended.
- **Hardware.** There is a Projects & Research Lead for hardware and no hardware
  project on the site.

→ Copy any file in `src/content/projects/` and fill it in.

### A recruitment cycle
`/join/roles` shows the MS Form when a cycle is open and an honest "no cycle is
open right now — join the group and you'll see the next one first" when it is
not. Right now it shows the form unconditionally because the link has no expiry.
→ Set `expiresOn:` in `src/content/links/recruitment.md` to the cycle's closing
date and it manages itself from then on.

---

## 3. Assumptions I made that you should confirm

I built these rather than stopping, because stopping would have cost you more
than a wrong guess. Each is one line to correct.

| Assumption | Why | Where |
|---|---|---|
| **Quantum from Scratch ran on 2 Sept 2026** | The poster says "Sept 2" with no year; it was photographed on 4 Sept 2026. | `src/content/events/quantum-from-scratch.md` |
| **The MLDA×QCC programme is `completed`** | The old site filed it under "Our Past Initiatives" but also said "we currently have two teams working on…". | `src/content/projects/mlda-quantum-ml.md` |
| **"180+ members" and "Running since 2025"** | Your instruction. The 180 figure is from the QCC seminar poster; the old site said 165. | `src/pages/index.astro` and `src/pages/about/index.astro`, the `PROOF` arrays |
| **Faculty advisors have no bios** | Asst Prof Chang Jin and A/P Wong Liang Jie are named on `/research`; nothing more is claimed about either. | `src/content/people/chang-jin.md`, `wong-liang-jie.md` |
| **Four photographs held back** | `qid26_group`, `collab_workshop_board`, `gia_lai_quantum_year`, `pitch_stage` — real photographs I could not caption truthfully because I do not know what the events were. All at `consent: pending`. | `src/content/media/` |

---

## 4. Decisions the plan says only the ExCo can make

From `BUILD_BRIEF.md` §4. Not blocking, but each one has a deadline attached to
somebody else's calendar.

1. **Vercel Team, or the GitHub organisation, or both** — see `DEPLOY.md`. The
   thing that matters is that the account is not a person's.
2. **Web Maintainer + a second deploy key.** Two named people, minuted, before
   the first deploy. The Web Maintainer is not the person who wrote the code.
3. **A flat one-colour mark.** The gradient mark cannot be a 32px favicon; "EST"
   is its weakest element and dies first. The tab currently carries the bra-ket
   alone, drawn in the accent, in `public/brand/favicon.svg`. That is a stopgap.
4. **A mailing list provider.** Every capture CTA on the site currently points
   at Telegram because Telegram exists and a mailing list does not.
5. **Rename the LinkedIn page and the Linktree bio.** Both still say "NTU
   Quantum Computing Club". The URL in `src/content/links/linkedin.md` is kept
   until someone confirms the rename went through.
6. **An NTU subdomain.** Ask the staff advisor in parallel with shipping; a
   custom domain is a redirect away and changes nothing in the repository.
7. **Amend the Structure Framework** so it lists two Projects & Research Leads.
   The site publishes reality — hardware and software — and the site should
   never contradict the club's own constitution.

---

## 5. Phase 2 and later, deliberately not built

- **`/research/outputs`** — opens once three real outputs exist. A page of
  headings with nothing under them is the empty-shell failure the plan names.
- **The interactive Quantum Stack** — ships static, becomes interactive in
  Phase 2. The nested-list version is already in the DOM and always will be.
- **`/members`** — Phase 3, gated. Does not start until Phases 0–2 are live,
  maintained, and someone other than the original author has shipped a change.
  Scope it as a URECA project: backend, auth model, data-protection review.
- **The full five-track reading list.** `/explore/resources` currently lists
  only club material and papers the club's own demos already cite, and says so
  on the page. Content Dev and the Reading Coordinators own the rest.
