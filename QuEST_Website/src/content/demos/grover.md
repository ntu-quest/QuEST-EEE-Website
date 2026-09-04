---
title: "Grover search"
station: 1
concept: "Amplitude amplification"
hook: "Push past the optimum and success collapses from 96% to 2%."
order: 10
stackNodes: ["algorithms"]
motionFigure: "grover_amplitudes"
knobs:
  - { label: "Boxes", range: "2–6 qubits" }
  - { label: "Steps", range: "0–12" }
  - { label: "Marked boxes", range: "1 or more" }
references:
  - citation: "Grover, Proc. 28th ACM STOC (1996) 212"
    url: "https://arxiv.org/abs/quant-ph/9605043"
  - citation: "Boyer, Brassard, Høyer, Tapp, Fortschr. Phys. 46 (1998) 493 — the closed form"
    url: "https://arxiv.org/abs/quant-ph/9605034"
  - citation: "Nielsen & Chuang §6.1.3 — the rotation picture"
---

A classical search opens boxes one at a time. This one nudges every box at once. Turn the dial to
search faster — then keep turning, and watch the answer fall apart.
