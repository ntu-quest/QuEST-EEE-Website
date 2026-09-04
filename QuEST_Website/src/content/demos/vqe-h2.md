---
title: "VQE on H₂"
station: 4
concept: "Variational ground-state energy, and phase estimation"
hook: "Turn a knob until the energy settles — that is a molecule's ground state."
order: 40
stackNodes: ["applications"]
motionFigure: "vqe_h2_well"
knobs:
  - { label: "Ansatz parameter θ", range: "−90° to 90°" }
  - { label: "Bond length", range: "0.2–2.85 Å" }
  - { label: "Phase-estimation bits", range: "1–10" }
references:
  - citation: "O'Malley et al., Phys. Rev. X 6 (2016) 031007 — the measured H₂ Hamiltonian"
    url: "https://arxiv.org/abs/1512.06860"
  - citation: "Peruzzo et al., Nat. Commun. 5 (2014) 4213 — VQE"
    url: "https://arxiv.org/abs/1304.3061"
---

This is a real hydrogen molecule, in a Hamiltonian measured on a real quantum computer in 2016.
Turn the knob until the energy stops falling. Where it stops is the answer — and classical
chemistry cannot get there on its own.
