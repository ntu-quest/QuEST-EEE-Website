---
title: "The Fall Fest booth — four verified physics stations"
summary: "Four interactive quantum demos that run offline in a browser, backed by a Python test suite that checks every number against the original papers."
area: software
difficulty: intermediate
status: active
started: "2025"
featured: true
order: 20
cover: "vqe-loop"
outputs:
  - label: "Try the demos"
    url: "/demos"
---

## The problem

A showcase booth has ninety seconds to make quantum mechanics land with someone walking past, and
it has to do it on a laptop with no network. Slideware does not survive that; nor does anything
that needs a CDN.

## The approach

Four stations, each built around one moment a visitor can cause themselves:

| Station | What you do | The moment |
|---|---|---|
| Grover search | Mark a box, turn the step dial | Push past the optimum and success collapses from 96% to 2% |
| Bell / CHSH | Turn one detector angle | The needle crosses 2, which no classical universe can do |
| Stern–Gerlach | Add magnets to the beam line | The beam you blocked comes back |
| VQE on H₂ | Turn one knob until the energy settles | You have found a molecule's ground state |

Everything is plain HTML, CSS and JavaScript with no dependencies and no network access. The whole
folder copies onto a USB stick and runs by double-clicking a file.

## What makes it unusual

**Nothing appears on a booth screen unless a test asserts it.** The physics is written once in
Python, checked against the original papers, and exported to the JavaScript the pages run:

```
papers  →  verify/reference.py  →  booth/physics.js  →  the screen
                              ↘   activity_sheet/solutions/
```

The maths is typeset by a small TeX-subset renderer written for this project that emits native
MathML — KaTeX and MathJax both need a CDN or font files that `file://` pages load unreliably.
The renderer marks any command it does not know in red rather than failing silently, and a test
renders **every equation the booth ships** to prove none of them do.

## What a new member does

Take one station and deepen it, or write the next activity sheet. The workshop notebooks
(PennyLane and NumPy, with solution keys) live in the same repository and are checked by the same
suite.
