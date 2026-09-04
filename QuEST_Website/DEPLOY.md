# Deploying

The build is a plain static site — a folder of HTML in `dist/`. It will run on
anything. Two hosts are wired up: **Vercel** (`vercel.json`) and **GitHub Pages**
(`.github/workflows/deploy.yml`). Pick one; leaving both configured costs
nothing and means you can move in an afternoon.

---

## Before you pick a host: the one thing that actually matters

> The old site sits on Vercel **under a personal account**. When that person
> graduates, the site goes with them. That is the single failure this whole
> rebuild exists to prevent, and it is a governance problem, not a hosting one.

Both hosts below are fine. What is not fine is either of them owned by a
student's personal login. Whichever you choose:

1. **The repository lives in a club-owned GitHub organisation.** Not a personal
   account, not a fork.
2. **The hosting account is a team, not a person.** On Vercel that means a
   **Team** (the Hobby tier is personal by definition and cannot own a project
   jointly). On GitHub Pages the org already owns it.
3. **Two named people have deploy access,** minuted, before the first deploy.
   One of them is the Web Maintainer, who is *not* the person who wrote the code.
4. **Credentials live in the club password store,** never in someone's browser.

If you can only do one of these this week, do the first.

---

## Option A — Vercel (what you asked for)

Zero config beyond the `vercel.json` already in the repo.

### First deploy

1. Create a **Vercel Team** for the club (Vercel dashboard → *Add New* → *Team*).
   Invite the second deploy owner immediately.
2. *Add New* → *Project* → import the club org's repository.
3. Vercel detects Astro. Leave every field as it comes:

   | Field | Value |
   |---|---|
   | Framework Preset | Astro |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm ci` |
   | Node version | 22 or later (`.nvmrc` says 24) |

4. Deploy. You get `quest-eee.vercel.app` (or whatever the project is named).

Nothing else is needed. The build runs `scripts/images.mjs` and
`scripts/booth.mjs` first, and both are written to work on a bare CI image —
see *Why the build cannot break on Vercel* below.

### What `vercel.json` sets

- `cleanUrls` — `/about/people` rather than `/about/people/index.html`.
- Cache headers: a year on `_astro/` (fingerprinted), a week on images and
  video, a day on the booth runtime.
- `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`,
  `X-Frame-Options`. `interest-cohort=()` opts out of ad topic tracking, which
  is the site keeping the promise in BLUEPRINT §02: no tracking beyond a
  privacy-preserving page count, and therefore no cookie banner.

### Preview deploys

Every pull request gets its own URL automatically. That is the workflow the
plan asks for — *a reviewer sees the page, not the diff.* Canonical tags and
the sitemap follow the deployment URL on their own (see `astro.config.mjs`), so
a preview never claims to be production.

### A custom domain later

Vercel → Project → *Domains*. Add it, point the DNS, done — nothing in the
repository changes. If the domain differs from Vercel's, set `SITE_URL` in the
project's environment variables so canonical tags and the sitemap use it:

```
SITE_URL = https://quest.ntu.edu.sg
```

Ask the staff advisor about an NTU subdomain in parallel with shipping on the
free one. Do not wait for it.

### Turning analytics on, if you want it

Vercel Web Analytics is cookie-free and needs no consent banner, which keeps
the *Responsibility* promise. Enable it in the dashboard and add
`@vercel/analytics`. It is genuinely optional — "or none" is a valid answer.

---

## Option B — GitHub Pages

Already wired: `.github/workflows/deploy.yml` builds on every push to `main`
and on every pull request, and deploys `main` to Pages.

1. Repository → *Settings* → *Pages* → Source: **GitHub Actions**.
2. Push to `main`.

Ships at `https://<org>.github.io/<repo>`. If the repo is named
`<org>.github.io` the site is at the root and nothing else is needed; otherwise
set `base` in `astro.config.mjs` to `/<repo>`.

**Pages dies with the repository, not with a person's account** — which is why
the blueprint recommends it. Vercel is fine too *provided the team-ownership
point above is done properly*.

---

## Why the build cannot break on Vercel

Two build steps use files and tools that are not on a CI image. Both degrade to
a no-op rather than failing:

| Step | Needs | On CI |
|---|---|---|
| Image optimisation | `media-src/` (the 5–10 MB originals) | Not committed — CLAUDE.md forbids committing an image over 500 KB. The **optimised output in `public/images/` is committed**, so the step logs that it is skipping and the build uses it. |
| GIF → video | `ffmpeg`, and the six GIFs from the booth repository | Neither is present. The **converted video in `public/video/` is committed**, so the step is skipped. |
| Offline bundle zip | *nothing* | It used to shell out to `zip`; `scripts/zip.mjs` now writes the archive in pure Node, so there is no external tool to be missing. |

Both generated folders are committed deliberately — they total about 8 MB, every
file is under 180 KB, and it means a content-only PR from a non-developer builds
green without anyone installing sharp or ffmpeg.

**When you add a photograph** you run `npm run images` locally and commit what
it writes, alongside the new file in `src/content/media/`. `CONTENT.md` says so.

---

## Checks that run before anything ships

The content schemas fail the build rather than shipping something broken:

- a photograph with no `alt` text
- a project summary over 160 characters
- a `photos:` or `cover:` id with no media file behind it
- any enum value that is not on its list
- a media file with no optimised image

So a malformed content PR goes red on the preview build and never reaches the
live site. That is the whole point of putting the schemas in
`src/content.config.ts`.

---

## Rolling back

**Vercel:** Deployments → find the last good one → *Promote to Production*.
Instant, and it does not touch git.

**Pages:** revert the commit and push. Slower, and it rewrites history for
everyone, which is one more reason to keep the Vercel path warm even if Pages
is primary.
