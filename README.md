# QuEST@EEE

Quantum Engineering, Science & Technology at NTU's School of Electrical &
Electronic Engineering.

| Folder | What |
|---|---|
| `QuEST_Website/` | The club website (Astro). **Start with its [README](QuEST_Website/README.md).** |
| `QCC_qfest/` | The Quantum Fall Fest booth: demos, activity sheets, instructor notes. |
| `QCC_Old_Website/` | The old QCC site, kept as a record. |
| `QuEST_resource/` | Logos, posters, photographs and initiative material. |
| `.claude/skills/` | Claude Code skills that ship with this repo (see below). |

---

## Claude Code skills in this repo

> **If you cloned this repo and use [Claude Code](https://claude.com/claude-code),
> you already have these skills.** They live in `.claude/skills/`, and Claude Code
> picks them up automatically when you start it from the **root of this
> repository**. Nothing to install for the skills themselves; the one-time
> setup below is only for the tools two of them call.

| Skill | Use it for | Source |
|---|---|---|
| `design-taste-frontend` | Designing, redesigning or reviewing a public page so it doesn't look templated. Picks an art direction, finds real openly-licensed pictures, checks the page in a real browser and critiques its own screenshots. | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (MIT) |
| `image-to-code` | Generating design images first, then building the page to match them. | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill/tree/main/skills/image-to-code-skill) (MIT) |
| `web-design-guidelines` | Auditing UI code against 100+ rules: accessibility, focus states, forms, motion, typography, dark mode. | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) |
| `playwright-cli` | Driving a real browser from the terminal: click through the site, take screenshots, test flows. | [microsoft/playwright-cli](https://github.com/microsoft/playwright-cli) (Apache-2.0) |

**How to use them.** Describe the task and Claude loads the matching skill on
its own ("audit the accessibility of the events page", "screenshot /join at
phone width"). To force one, type its name as a slash command:

```
/web-design-guidelines QuEST_Website/src/pages/join.astro
```

### One-time setup

| Needed by | What |
|---|---|
| `design-taste-frontend` | Node 22+ and Chrome, Edge or Chromium. Network access to search the open image archives. No API keys. |
| `playwright-cli` | `npm install -g @playwright/cli@latest` |
| `web-design-guidelines` | Network access. It downloads the latest rules from GitHub on every run. |
| `image-to-code` | An image-generation tool. It was written for Codex; Claude Code can't generate images by itself, so without one it can only work from images you give it. |

### The club's brand rules win

The skills have their own house styles, and some of them contradict the
website's contract in `QuEST_Website/Planning files/CLAUDE.md`. Where they
disagree, **the club's rules apply.** The known clashes:

- **Monospace.** `design-taste-frontend` bans monospace outside code blocks. The
  site uses DM Mono for labels and data, on purpose.
- **Scroll animation.** `design-taste-frontend` requires entrance animations as
  sections scroll in. The site requires every section to be visible at rest, so
  shared links preview correctly.
- **Palette and type.** `design-taste-frontend` deals its own colours and fonts.
  Tell it to keep the brand's (`--keep palette,type`); the only colours are in
  `src/styles/tokens.css`.

Claude Code does not load `CLAUDE.md` automatically from `Planning files/`, so
point Claude at it at the start of any design session.

`design-taste-frontend` writes working files to `.taste-skill/` and
`playwright-cli` to `.playwright-cli/`. Both are git-ignored.

### Also worth knowing: awesome-design-md

[VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) is
not a skill but a library of `DESIGN.md` files: written design systems taken
from real sites (Vercel, Stripe, Linear, Claude and about eighty more). To use
one as a reference, open its page on [getdesign.md](https://getdesign.md),
download the `DESIGN.md`, and give it to Claude alongside the task. For this
site, borrow ideas from them; never a palette or a typeface.

### Updating the skills

The copies are pinned to the upstream versions they were taken from:

| Skill | Upstream commit |
|---|---|
| `design-taste-frontend`, `image-to-code` | `Leonxlnx/taste-skill@f624f37` (2026-10-14) |
| `web-design-guidelines` | `vercel-labs/agent-skills@063bee9` (2026-08-28) |
| `playwright-cli` | `microsoft/playwright-cli@b85c7a7` (2026-09-28), CLI 0.1.22 |

To update one, clone its repository, copy the skill folder over the one in
`.claude/skills/` (keep the folder name), and update the commit in this table.
Keep `playwright-cli`'s skill and the installed CLI on matching versions.
