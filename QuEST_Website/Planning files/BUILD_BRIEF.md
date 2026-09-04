# QuEST@EEE website — build session brief

The folder is already set up. This is how to start the build session against it.

---

## 1. Before you type anything — a 60-second check

The build session will behave badly if any of these are missing, and it will not always tell you. Confirm from the repo root:

```bash
ls CLAUDE.md docs/BLUEPRINT.md          # the contract + the plan
ls public/brand/                        # quest-logo-light.png, quest-logo-dark.png
ls public/demos/                        # grover.html, bell.html, stern-gerlach.html,
                                        # vqe-h2.html, physics.js, mathfmt.js, shared.js, shared.css
ls public/images-src/ 2>/dev/null || ls public/images/   # the ten old-site photographs
git remote -v                           # a club ORG, not a personal account
```

- **`CLAUDE.md` at the repo root is the one that matters most.** Claude Code reads it automatically at the start of every session, so the rules survive context resets and you never re-explain them.
- If the logo files or the booth bundle live somewhere else in your setup, that's fine — the prompt below asks the session to find and report them rather than assuming.
- If `git remote` points at a personal account, fix that now. The old site sits on Vercel under a personal account, and that is precisely the failure mode the whole plan exists to avoid.

---

## 2. What each file does

| File | Role |
|---|---|
| `CLAUDE.md` | The **contract**. Read automatically every session. Non-negotiables, tokens, type scale, routes, schemas, the real ExCo and link data, asset map, quality gates. Keep it short enough to stay read. |
| `docs/BLUEPRINT.md` | The **reasoning**. 19 sections. Consulted for the *why*, the page-by-page blocks, the migration detail, the open decisions. |
| `CONTENT.md` | Written **during** Phase 0 — how a non-developer adds an event. Not optional. |
| `public/demos/` | The booth bundle, verbatim. Copied and shared, never rewritten. |
| `public/images-src/` | Unoptimised originals. The build writes optimised output to `public/images/`; `images-src/` never ships. |
| `docs/BLUEPRINT.html` | The **same plan, rendered** — self-contained, opens in any browser, no login. Carries what Markdown can't: the two logo lockups on their correct grounds, the photo inventory as thumbnails, and the interference field running. Look at it yourself; the build session reads the `.md`. |
| `docs/reference/interference-field.js` | A **commented reference implementation** of the §11 background. A starting point to port to `src/scripts/field.ts`, not a file to drop in. The header comment lists the eight behaviours that must survive the port. |

---

## 3. Give it the work one phase at a time

Do **not** ask for the whole site in one prompt. Four chunks, each ending in something deployable.

### Phase 0 — Foundation (~2 weeks)
Scaffold Astro + Tailwind + MDX. Write `src/styles/tokens.css` from CLAUDE.md exactly. Wire the three Google Fonts. Build SiteHeader/MobileNav, Logo, Hero, StatementBlock, CardGrid+Card, CTABand, Footer, MonogramAvatar, LinkRow/LinkList, IconSet, ObfuscatedMailto, ContactRouter. Ship `/`, `/about/people`, `/join`, `/links`, `/contact`. Deploy to GitHub Pages. Write `CONTENT.md`.

**Acceptance:** a stranger on a phone learns what QuEST is and signs up in under a minute, and the Instagram bio can point at `/links` instead of the Linktree. Both themes correct. Lighthouse ≥95.

### Phase 1 — Proof (~4 weeks, before Qiskit Fall Fest)
Port the four demo pages — Grover first, as the template — with the outline rail and the sticky control dock. Build the image pipeline and migrate the ten photographs. Convert the six GIFs to video. Ship the interference field. Build `/projects` (4+ real entries), `/events`, `/about`, `/explore/what-we-do`, and the static Quantum Stack.

**Acceptance:** the site can be sent to a professor or a partner university with no covering explanation.

### Phase 2 — Depth (Dec–Feb)
`/research`, `/explore/resources`, `/about/journey`, `/about/culture`, `/about/network`. Quantum Stack becomes interactive. `/research/outputs` opens once three real outputs exist.

### Phase 3 — Membership network (AY2027, gated)
Does not start until Phases 0–2 are live, maintained, and someone other than the original author has shipped a change. Scope it as a URECA project — backend, auth model, data-protection review.

---

## 4. Decisions only you can make

A build session will otherwise guess, plausibly, which is worse than stopping.

1. **Domain** — ship on `quest-eee.github.io`; ask the staff advisor about an NTU subdomain in parallel.
2. **Mailing-list provider** — pick one this week. Every capture CTA depends on it existing.
3. **Web Maintainer + second deploy key** — two named people, minuted, before the first commit.
4. **A flat one-colour mark** — for the favicon, OG image and print. The gradient mark cannot do those jobs.
5. **Photo consent** — the CQT group shot (~25 identifiable people) and the Zoom slide in `workshop_image_1`.
6. **LICENSE on `QC_club_Demo`** — MIT code, CC BY 4.0 text. Blocks publishing the demos.
7. **The current member count** and a replacement for the stale "8+ months" figure.
8. **One line per ExCo member** on what they're working on this year.
9. **Which four projects** launch on `/projects`, with honest statuses.
10. **Two Projects & Research Leads** — amend the Structure Framework so the site does not contradict the club's constitution.
11. **Rename the LinkedIn page and the Linktree bio** — both still say "NTU Quantum Computing Club".

---

## 5. Things that go wrong, and the correction

| Symptom | What happened | Fix |
|---|---|---|
| The mark vanishes in one theme | The two logo files were swapped | They are named by **mode**, not ink. `quest-logo-light.png` is the light-mode artwork and is drawn dark. |
| The mark changes size when the theme flips | One file was re-exported alone | Regenerate both through `make_logos.py`. |
| A demo's plot stops responding halfway down the page | The control dock was not made sticky | Pin the knobs, not just the outline rail. |
| The site looks like every other AI-built site | Inter, or `system-ui`, or a purple gradient hero crept in | Manrope + Lora + DM Mono, tokens only, no gradients outside the mark and the field. |
| Homepage is 3 MB | The 3936×2624 originals shipped | Image pipeline: 2000px max, AVIF + WebP, 640px phone variant, <180 KB. |
| A section is blank in a shared link preview | Scroll-triggered reveal | Everything visible at rest. |
| A project or number appears that you've never seen | It filled a gap rather than stopping | "Never invent content" is in CLAUDE.md — point at it and have the block removed. |

---

## 6. The kickoff prompt

Paste this as the first message, from inside the repo:

---

> I'm building the website for QuEST@EEE, the NTU EEE quantum interest club. I'm the club President. **Everything is already set up in this folder — do not clone anything, do not download anything, do not re-fetch any source repository.**
>
> Start by taking stock, and report back before writing any code:
>
> 1. Read `CLAUDE.md`. It is the contract for this repo and it is not negotiable.
> 2. Read `docs/BLUEPRINT.md` for the reasoning and the page-by-page specification. `docs/BLUEPRINT.html` is the same document rendered — you don't need to parse it, but it's there if you want to see the logo lockups or the background prototype.
> 3. Inventory what's actually here and tell me the real paths you found for: the two logo PNGs, the booth demo bundle (`grover.html`, `bell.html`, `stern-gerlach.html`, `vqe-h2.html` plus `physics.js`, `mathfmt.js`, `shared.js`, `shared.css`), and the old-site photographs. Say plainly if any of them are missing or somewhere other than CLAUDE.md expects — don't work around it silently.
> 4. Tell me what the git remote is, and whether any tooling is already scaffolded.
>
> Then give me a **Phase 0 plan only**: Astro + Tailwind + MDX content collections, `src/styles/tokens.css` written exactly as CLAUDE.md specifies, the three fonts wired, the Phase-0 components, and five pages — `/`, `/about/people`, `/join`, `/links`, `/contact` — deployed to GitHub Pages, with `CONTENT.md` written as you go. Nothing beyond that scope.
>
> How we work:
> - Plan first, show me the plan, wait for my go-ahead before building.
> - One commit or PR per component group. I want to look at rendered pages, not diffs.
> - **Never invent content.** If a project, a number, a photo caption or a person's blurb doesn't exist, stop and ask me. Do not fill the gap with something plausible.
> - Check both light and dark themes on every page before calling anything done.
> - When you hit one of the open decisions in BLUEPRINT §19, tell me — don't choose for me.
> - British English throughout.

---

## 7. About the published artifact

The blueprint also exists as a page on claude.ai. **Do not paste that URL into a build session.** It sits behind your login, a session on your machine generally cannot fetch it, and everything in it that a builder needs is already in `docs/BLUEPRINT.md` — the artifact is the same document with pictures.

The two things the Markdown cannot carry are already extracted for you: `docs/BLUEPRINT.html` (the rendered page, self-contained, opens offline) and `docs/reference/interference-field.js` (the background prototype, commented). Nothing else is lost.

---

## 8. Prompts for the later phases

Once Phase 0 is deployed, start a fresh session (CLAUDE.md reloads automatically) and open with one of these:

**Phase 1, demos:**
> Phase 0 is live. Now port the booth demos from `public/demos/` into `/demos/[slug]` pages, following CLAUDE.md §Interactivity and BLUEPRINT §07. Build **Grover first** as the template — three canvases, three knobs, the full derivation, the circuit SVG — then we review it before you batch the other three. Copy `physics.js` and `mathfmt.js` in unchanged; never fork the physics; the offline booth build must keep working from a USB stick. Flatten the maths out of `<details>`, generate the outline rail from the article's own headings, and make the control dock sticky — that last one is the whole point, so show me it working mid-page.

**Phase 1, images:**
> Build the image pipeline and migrate the ten photographs from `public/images-src/` per CLAUDE.md §Assets. `workshop_image_2` is the homepage hero. `ntuqcc.jpg` is history only — never nav, favicon or OG. Do not publish `fallfest_2` (consent pending) or `workshop_image_1` (crop the video-call participant thumbnails out first). Also convert the six physics GIFs to muted looping video with poster frames.

**Phase 1, the field:**
> Build the interference background per CLAUDE.md §Interactivity and BLUEPRINT §11, starting from `docs/reference/interference-field.js` — port it to TypeScript as `src/scripts/field.ts` and mount it as an island; the eight behaviours in that file's header comment are the spec and must all survive. Homepage hero and the `/demos` header only. Show me it running in both themes, then show me it with `prefers-reduced-motion: reduce` forced on — I want to see the static frame, not a slowed-down loop.
