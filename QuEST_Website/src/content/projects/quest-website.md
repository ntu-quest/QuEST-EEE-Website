---
title: "This website"
summary: "The club's own site: a static Astro build, content in Markdown so a non-developer can update it, and the booth demos ported in."
area: software
difficulty: intro
status: open
started: "2026"
featured: false
order: 30
---

## The problem

The club's previous site was a single dark page hosted under a personal account. That is the
failure mode for every student club site: it goes stale the moment the person who built it stops
answering, and it disappears when they graduate.

## The approach

A static build with **every piece of content in Markdown**, so adding an event means adding a
file — see `CONTENT.md`. Typed frontmatter means a malformed entry fails the build rather than
shipping broken. Nothing is deleted at handover; entries are marked inactive and stay as the
club's record of itself.

## What a new member does

Add an event, fix a caption, or take one component. You do not need to know Astro to change the
content — that is the point of the split.

**We are looking for a Web Maintainer** distinct from whoever wrote the code, with the handover
happening during the year rather than at the end of it.
