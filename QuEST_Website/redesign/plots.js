/* ---------------------------------------------------------------------------
 * QuEST@EEE — the four booth stations, drawn live in the page's own theme.
 *
 * These replace the matplotlib GIFs (QCC_qfest/assets/make_gifs.py). The
 * numbers come from the same place the GIFs' did: booth-src/physics.js, which
 * verify/test_booth_physics.py checks function by function against
 * verify/reference.py. Only the drawing is new. Nothing here does physics.
 *
 * Each station exports two things:
 *   draw(canvas, state)    one frame for a given state (explorers, stills)
 *   loop(t)                the state at time t, choreographed like the GIF it
 *                          replaces (grover holds each step; chsh sweeps the
 *                          dial; vqe rocks the knob through the minimum)
 *
 * Colours are read from CSS custom properties on the canvas itself, so a
 * chart inside a dark chapter takes the dark chart tokens without being told:
 *   --chart-series   the data (validated with the dataviz palette checker)
 *   --chart-mark     the one thing you are looking for: the marked box, the
 *                    current point
 *   --chart-ink / --chart-soft / --chart-grid / --chart-surface
 * Text is always ink, never a series colour; reference lines are labelled in
 * words, so nothing is carried by colour alone.
 * ------------------------------------------------------------------------- */

(function (global) {
  'use strict';

  const P = global.Physics;
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  const palette = (el) => {
    const cs = getComputedStyle(el);
    const v = (n, f) => cs.getPropertyValue(n).trim() || f;
    return {
      series: v('--chart-series', '#008B9B'), mark: v('--chart-mark', '#644FB1'),
      ink: v('--chart-ink', '#15151F'), soft: v('--chart-soft', '#4B4B5D'),
      grid: v('--chart-grid', '#DCDCE4'), surface: v('--chart-surface', '#F4F4F7'),
    };
  };

  /* Text grows with the plot: 13px on a small one, up to ~17px on the reel. */
  let K = 1;

  function frame(canvas) {
    const dpr = Math.min(2, global.devicePixelRatio || 1);
    const w = canvas.clientWidth || 320, h = canvas.clientHeight || 220;
    K = clamp(w / 860, 1, 1.32);
    const W = Math.round(w * dpr), H = Math.round(h * dpr);
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    return { ctx, w, h };
  }

  const font = (px, weight = 600) => `${weight} ${px}px Manrope, "Helvetica Neue", Arial, sans-serif`;

  function label(ctx, s, x, y, color, px = 13, align = 'left', baseline = 'alphabetic', weight = 600) {
    ctx.font = font(Math.round(px * K), weight); ctx.fillStyle = color;
    ctx.textAlign = align; ctx.textBaseline = baseline;
    ctx.fillText(s, x, y);
  }

  function rule(ctx, x0, x1, y, color, width = 1) {
    ctx.strokeStyle = color; ctx.lineWidth = width;
    ctx.beginPath(); ctx.moveTo(x0, Math.round(y) + 0.5); ctx.lineTo(x1, Math.round(y) + 0.5); ctx.stroke();
  }

  /* Gridlines: 1px, solid, one step off the surface, quieter than any mark. */
  function gridH(ctx, x0, x1, y, c) { rule(ctx, x0, x1, y, c.grid); }
  function gridV(ctx, x, y0, y1, c) {
    ctx.strokeStyle = c.grid; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(Math.round(x) + 0.5, y0); ctx.lineTo(Math.round(x) + 0.5, y1); ctx.stroke();
  }
  const yTitle = (ctx, text, y, c) => { ctx.save(); ctx.translate(16 * K, y); ctx.rotate(-Math.PI / 2); label(ctx, text, 0, 0, c.soft, 13, 'center', 'middle'); ctx.restore(); };

  /* A bar grows from its baseline, square there, with a 4px rounded data end. */
  function bar(ctx, x, base, width, height) {
    if (Math.abs(height) < 0.5) return;
    const up = height > 0, top = base - height, r = Math.min(4, Math.abs(height), width / 2);
    const s = up ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(x, base);
    ctx.lineTo(x, top + s * r);
    ctx.quadraticCurveTo(x, top, x + r, top);
    ctx.lineTo(x + width - r, top);
    ctx.quadraticCurveTo(x + width, top, x + width, top + s * r);
    ctx.lineTo(x + width, base);
    ctx.closePath();
    ctx.fill();
  }

  /* Markers carry a 2px ring in the surface colour, so they read over a line. */
  function dot(ctx, x, y, r, fill, ring) {
    ctx.beginPath(); ctx.arc(x, y, r + 2, 0, TAU); ctx.fillStyle = ring; ctx.fill();
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = fill; ctx.fill();
  }

  function line(ctx, points, color, width = 2) {
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    ctx.beginPath();
    points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
  }

  const pct = (v) => `${Math.round(v * 100)}%`;

  /* ======================================================================
     Grover search
     ====================================================================== */
  const grover = {
    defaults: () => ({ n: 4, marked: [9], steps: 0, maxSteps: 12 }),

    /* Same arc as the GIF: 0..6 steps, each held for half a second. Stopping
       at 6 is deliberate (see make_gifs.py): by 8 it climbs back to 84%. */
    loop(t) { return { n: 4, marked: [9], steps: Math.floor(t * 2) % 7, maxSteps: 6 }; },

    summary(s) {
      const p = P.grover.success(s.n, s.marked.length, s.steps);
      const best = P.grover.optimalIterations(s.n, s.marked.length);
      const note = s.steps < best ? 'closing in' : s.steps === best ? 'best possible' : 'overshot, getting worse';
      return { p, best, note, text: `P(found) = ${pct(p)} after ${s.steps} step${s.steps === 1 ? '' : 's'}: ${note}` };
    },

    draw(canvas, s, opts = {}) {
      const { ctx, w, h } = frame(canvas);
      const c = palette(canvas);
      const size = 2 ** s.n;
      const amps = P.grover.amplitudes(s.n, s.marked, s.steps);
      const compact = opts.compact || w < 420;
      const padL = compact ? 12 : 70 * K, padR = compact ? 12 : 20, padT = compact ? 12 : 18;
      const split = compact ? 0.6 : 0.62;
      const topH = (h - padT) * split - 18;
      const base = padT + topH / 2;
      const plotW = w - padL - padR;
      const band = plotW / size;
      /* Thick bars, close together: 72% of each slot, so sixteen boxes read as
         one row of states rather than scattered ticks. (Wider than the dataviz
         guide's 24px cap, on purpose; the 2px+ gap still separates them.) */
      const bw = Math.max(3, Math.min(band - 3, band * 0.72));

      /* the amplitude scale: a light grid at ±1 and ±½, the axis at zero */
      const A = (a) => base - a * (topH / 2);
      for (const a of [1, 0.5, -0.5, -1]) gridH(ctx, padL, w - padR, A(a), c);
      rule(ctx, padL, w - padR, base, c.soft);
      if (!compact) {
        for (const [a, t] of [[1, '+1'], [0.5, '+½'], [0, '0'], [-0.5, '−½'], [-1, '−1']]) label(ctx, t, padL - 12, A(a), c.soft, 13, 'right', 'middle');
        yTitle(ctx, 'amplitude', base, c);
      }
      for (let i = 0; i < size; i++) {
        ctx.fillStyle = s.marked.includes(i) ? c.mark : c.series;
        bar(ctx, padL + i * band + (band - bw) / 2, base, bw, amps[i] * (topH / 2));
      }
      opts.hit && opts.hit({ padL, band, top: padT, bottom: padT + topH, size });

      /* P(found) against steps, with the current step marked */
      const y0 = padT + topH + (compact ? 22 : 40 * K), y1 = h - (compact ? 10 : 50 * K);
      const max = s.maxSteps;
      const X = (k) => padL + (k / max) * plotW;
      const Y = (p) => y1 - p * (y1 - y0);
      for (const q of [0.25, 0.5, 0.75, 1]) gridH(ctx, padL, w - padR, Y(q), c);
      for (let k = 0; k <= max; k++) gridV(ctx, X(k), y0, y1, c);
      rule(ctx, padL, w - padR, y1, c.soft);
      const pts = [];
      for (let k = 0; k <= max; k++) pts.push([X(k), Y(P.grover.success(s.n, s.marked.length, k))]);
      line(ctx, pts, c.series, 2);
      const p = P.grover.success(s.n, s.marked.length, s.steps);
      dot(ctx, X(s.steps), Y(p), 5, c.mark, c.surface);
      if (!compact) {
        for (const [q, t] of [[1, '100%'], [0.5, '50%'], [0, '0']]) label(ctx, t, padL - 12, Y(q), c.soft, 13, 'right', 'middle');
        for (let k = 0; k <= max; k += max > 8 ? 2 : 1) label(ctx, String(k), X(k), y1 + 20 * K, c.soft, 13, 'center');
        label(ctx, 'search steps', (padL + w - padR) / 2, h - 4, c.soft, 13, 'center');
        yTitle(ctx, 'P(found)', (y0 + y1) / 2, c);
        const best = P.grover.optimalIterations(s.n, s.marked.length);
        label(ctx, `best at ${best}`, X(best), Y(P.grover.success(s.n, s.marked.length, best)) - 14 * K, c.ink, 14, 'center', 'alphabetic', 700);
      }
    },
  };

  /* ======================================================================
     Bell / CHSH
     ====================================================================== */
  const bellState = P.chsh.bellPhiPlus();
  const S = (delta) => Math.abs(P.chsh.SDetuned(delta, bellState));

  const chsh = {
    defaults: () => ({ delta: 0 }),

    /* The GIF's sweep: down through the classical bound and back, 6.4 s. */
    loop(t) { const ph = (t / 6.4) % 1; const sweep = ph < 0.5 ? ph * 2 : (1 - ph) * 2; return { delta: sweep * Math.PI / 2 }; },

    summary(s) {
      const v = S(s.delta);
      const beats = v > P.chsh.CLASSICAL + 1e-4;
      return { S: v, beats, text: `S = ${v.toFixed(3)}, ${beats ? 'beyond the classical limit' : 'within the classical limit'}` };
    },

    draw(canvas, s, opts = {}) {
      const { ctx, w, h } = frame(canvas);
      const c = palette(canvas);
      const v = S(s.delta);
      const compact = opts.compact || w < 520;

      /* the dial: 0 to 3, with the two bounds marked in words */
      const dialW = compact ? w : w * 0.42;
      /* compact: leave room either side for the bound labels */
      const cx = dialW / 2, r = Math.min(compact ? dialW / 2 - 42 : dialW * 0.42, h * (compact ? 0.5 : 0.62));
      const cy = (compact ? h * 0.66 : h * 0.72);
      const ang = (val) => Math.PI + (val / 3) * Math.PI;
      ctx.lineCap = 'butt';
      ctx.strokeStyle = c.grid; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, TAU); ctx.stroke();
      ctx.strokeStyle = c.series; ctx.lineWidth = 10;
      ctx.beginPath(); ctx.arc(cx, cy, r, ang(2), ang(P.chsh.TSIRELSON)); ctx.stroke();
      for (const [val, text] of [[2, compact ? '2' : '2 classical'], [P.chsh.TSIRELSON, compact ? '2√2' : '2√2 quantum']]) {
        const a = ang(val);
        ctx.strokeStyle = c.ink; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * (r - 14), cy + Math.sin(a) * (r - 14));
        ctx.lineTo(cx + Math.cos(a) * (r + 12), cy + Math.sin(a) * (r + 12)); ctx.stroke();
        label(ctx, text, cx + Math.cos(a) * (r + 18), cy + Math.sin(a) * (r + 18), c.ink, 13, a < Math.PI * 1.5 ? 'right' : 'left', 'bottom');
      }
      const a = ang(clamp(v, 0, 3));
      ctx.strokeStyle = c.mark; ctx.lineWidth = 4; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * (r - 6), cy + Math.sin(a) * (r - 6)); ctx.stroke();
      dot(ctx, cx, cy, 6, c.mark, c.surface);
      label(ctx, v.toFixed(2), cx, cy + (compact ? 26 : 30), c.ink, compact ? 20 : 28, 'center', 'alphabetic', 800);

      if (compact) return;

      /* S against the detector offset, with the two bounds as labelled rules */
      const x0 = dialW + 60 * K, x1 = w - 16, y0 = 24, y1 = h - 50 * K;
      const X = (deg) => x0 + (deg / 90) * (x1 - x0);
      const Y = (val) => y1 - (val / 3) * (y1 - y0);
      for (const val of [0.5, 1, 1.5, 2.5, 3]) gridH(ctx, x0, x1, Y(val), c);
      for (let d = 0; d <= 90; d += 15) gridV(ctx, X(d), y0, y1, c);
      rule(ctx, x0, x1, y1, c.soft);
      rule(ctx, x0, x1, Y(2), c.soft);
      rule(ctx, x0, x1, Y(P.chsh.TSIRELSON), c.soft);
      label(ctx, 'classical limit, 2', x1, Y(2) - 8, c.ink, 14, 'right', 'alphabetic', 700);
      label(ctx, 'quantum ceiling, 2√2', x1, Y(P.chsh.TSIRELSON) - 8, c.ink, 14, 'right', 'alphabetic', 700);
      const pts = [];
      for (let d = 0; d <= 90; d += 1) pts.push([X(d), Y(S(d * Math.PI / 180))]);
      line(ctx, pts, c.series, 2);
      dot(ctx, X(s.delta * 180 / Math.PI), Y(v), 5, c.mark, c.surface);
      for (const d of [0, 30, 60, 90]) label(ctx, `${d}°`, X(d), y1 + 20 * K, c.soft, 13, 'center');
      for (const val of [0, 1, 2, 3]) label(ctx, String(val), x0 - 10, Y(val), c.soft, 13, 'right', 'middle');
      label(ctx, 'detector offset', (x0 + x1) / 2, h - 4, c.soft, 13, 'center');
    },
  };

  /* ======================================================================
     Stern–Gerlach: three magnets on one beam line
     ====================================================================== */
  const sg = {
    defaults: () => ({ middle: 'X', phaseDeg: 0 }),

    /* Swap the middle magnet in and out: the blocked beam comes back. */
    loop(t) { return { middle: Math.floor(t / 2.6) % 2 ? 'X' : 'off', phaseDeg: 0 }; },

    stages(s) {
      const st = [{ axis: 'Z', blocked: -1 }];
      if (s.middle !== 'off') st.push({ axis: s.middle, blocked: -1 });
      st.push({ axis: 'Z', blocked: null });
      return st;
    },

    result(s) { return P.sg.sequence(P.sg.phaseState(s.phaseDeg * Math.PI / 180), sg.stages(s)); },

    summary(s) {
      const r = sg.result(s);
      const down = r.surviving * r.final[-1];
      return {
        r, down,
        text: down > 1e-6
          ? `${(down * 100).toFixed(1)}% of the atoms arrive spin-down, the state the first magnet blocked`
          : 'nothing arrives spin-down: the first magnet blocked it',
      };
    },

    draw(canvas, s, opts = {}) {
      const { ctx, w, h } = frame(canvas);
      const c = palette(canvas);
      const compact = opts.compact || w < 480;
      const mid = h * 0.5, spread = h * (compact ? 0.2 : 0.22);
      const slots = s.middle === 'off' ? [0.24, null, 0.74] : [0.22, 0.5, 0.78];
      const X = (f) => 16 + f * (w - 32);
      const mw = compact ? 30 : 44, mh = spread * 2 + 30;

      /* the beam: thickness and strength follow the probability it carries */
      const beam = (xa, ya, xb, yb, p) => {
        if (p < 1e-4) return;
        ctx.globalAlpha = 0.35 + 0.65 * Math.min(1, p * 1.6);
        line(ctx, [[xa, ya], [xb, yb]], c.series, 2 + 6 * p);
        ctx.globalAlpha = 1;
      };
      const magnet = (x, axis, blocks) => {
        ctx.fillStyle = c.grid;
        ctx.fillRect(x - mw / 2, mid - mh / 2, mw, mh);
        label(ctx, axis, x, mid + 5, c.ink, compact ? 15 : 18, 'center', 'middle', 800);
        if (blocks) { ctx.fillStyle = c.ink; ctx.fillRect(x + mw / 2 + 8, mid + spread - 10, 6, 20); }
      };

      const p0 = 1;
      const xs = X(0.02), m1 = X(slots[0]);
      beam(xs, mid, m1 - mw / 2, mid, p0);
      /* after magnet 1: up continues, down is stopped */
      const r1 = P.sg.measure(P.sg.phaseState(s.phaseDeg * Math.PI / 180), 'Z');
      const pUp = r1[1].probability, pDn = r1[-1].probability;
      beam(m1 + mw / 2, mid, m1 + mw / 2 + 18, mid - spread, pUp);
      beam(m1 + mw / 2, mid, m1 + mw / 2 + 8, mid + spread * 0.6, pDn);

      let carried = pUp, state = r1[1].state, xNext;
      if (s.middle !== 'off') {
        const m2 = X(slots[1]);
        beam(m1 + mw / 2 + 18, mid - spread, m2 - mw / 2, mid, carried);
        const r2 = P.sg.measure(state, s.middle);
        beam(m2 + mw / 2, mid, m2 + mw / 2 + 18, mid - spread, carried * r2[1].probability);
        beam(m2 + mw / 2, mid, m2 + mw / 2 + 8, mid + spread * 0.6, carried * r2[-1].probability);
        carried *= r2[1].probability; state = r2[1].state;
        magnet(m2, s.middle, true);
        xNext = m2 + mw / 2 + 18;
      } else {
        xNext = m1 + mw / 2 + 18;
      }
      const m3 = X(slots[2]);
      beam(xNext, mid - spread, m3 - mw / 2, mid, carried);
      const r3 = P.sg.measure(state, 'Z');
      const up = carried * r3[1].probability, dn = carried * r3[-1].probability;
      const xe = w - 18;
      beam(m3 + mw / 2, mid, xe, mid - spread, up);
      beam(m3 + mw / 2, mid, xe, mid + spread, dn);
      magnet(m1, 'Z', true);
      magnet(m3, 'Z', false);

      /* the screen: one spot per outcome, sized by what arrives */
      ctx.fillStyle = c.grid; ctx.fillRect(xe - 2, mid - spread - 26, 6, spread * 2 + 52);
      dot(ctx, xe, mid - spread, 4 + 12 * up, c.series, c.surface);
      if (dn > 1e-4) dot(ctx, xe, mid + spread, 4 + 12 * dn, c.mark, c.surface);
      if (!compact) {
        label(ctx, `up ${(up * 100).toFixed(1)}%`, xe - 14, mid - spread - 22, c.ink, 13, 'right');
        label(ctx, `down ${(dn * 100).toFixed(1)}%`, xe - 14, mid + spread + 32, c.ink, 13, 'right');
        label(ctx, 'blocked', m1 + mw / 2 + 18, mid + spread + 30, c.soft, 13, 'left');
        label(ctx, 'atoms in', xs, mid - 14, c.soft, 13, 'left');
      }
    },
  };

  /* ======================================================================
     VQE on H2
     ====================================================================== */
  const h2rows = () => (global.QUEST && global.QUEST.h2 && global.QUEST.h2.rows) || [];
  const rowFor = (R) => P.h2.rowFor(h2rows(), R);

  const vqe = {
    defaults: () => ({ R: 2.0, theta: 0 }),

    /* The GIF's knob: rocking through the minimum at a stretched bond. */
    loop(t) {
      const row = rowFor(2.0);
      return { R: 2.0, theta: P.h2.optimalTheta(row) + (46 * Math.PI / 180) * Math.sin(TAU * t / 6.4) };
    },

    summary(s) {
      const row = rowFor(s.R);
      const E = P.h2.energy(row, s.theta), exact = P.h2.groundEnergy(row);
      const gap = (E - exact) * 1000;
      const solved = gap < 1.6;      /* chemical accuracy, 1.6 mHa */
      return {
        E, exact, gap, solved, row,
        text: `E = ${E.toFixed(4)} Ha for H₂ at ${row.R.toFixed(2)} Å: ${solved ? 'solved, within chemical accuracy' : `${gap.toFixed(0)} mHa to go`}`,
      };
    },

    draw(canvas, s, opts = {}) {
      const { ctx, w, h } = frame(canvas);
      const c = palette(canvas);
      const compact = opts.compact || w < 420;
      const row = rowFor(s.R);
      const E = (th) => P.h2.energy(row, th);
      const exact = P.h2.groundEnergy(row), hf = P.h2.hartreeFockEnergy(row);
      let lo = Infinity, hi = -Infinity;
      for (let d = -90; d <= 90; d += 2) { const e = E(d * Math.PI / 180); lo = Math.min(lo, e); hi = Math.max(hi, e); }
      const pad = (hi - lo) * 0.12; lo -= pad; hi += pad;
      const x0 = compact ? 12 : 76 * K, x1 = w - (compact ? 12 : 16), y0 = compact ? 12 : 20, y1 = h - (compact ? 12 : 52 * K);
      const X = (deg) => x0 + ((deg + 90) / 180) * (x1 - x0);
      const Y = (e) => y1 - ((e - lo) / (hi - lo)) * (y1 - y0);
      /* a light grid every 0.1 Ha and every 45° */
      const ticks = [];
      for (let e = Math.ceil(lo * 10) / 10; e <= hi; e += 0.1) ticks.push(Math.round(e * 10) / 10);
      ticks.forEach((e) => gridH(ctx, x0, x1, Y(e), c));
      for (const d of [-90, -45, 0, 45, 90]) gridV(ctx, X(d), y0, y1, c);
      rule(ctx, x0, x1, y1, c.soft);
      rule(ctx, x0, x1, Y(exact), c.ink);
      rule(ctx, x0, x1, Y(hf), c.soft);
      const pts = [];
      for (let d = -90; d <= 90; d += 1) pts.push([X(d), Y(E(d * Math.PI / 180))]);
      line(ctx, pts, c.series, 2);
      const deg = s.theta * 180 / Math.PI;
      dot(ctx, X(deg), Y(E(s.theta)), 5, c.mark, c.surface);
      if (!compact) {
        label(ctx, `true ground state ${exact.toFixed(4)} Ha`, x1 - 8, Y(exact) + 20 * K, c.ink, 14, 'right', 'alphabetic', 700);
        label(ctx, `Hartree–Fock, where classical chemistry stops: ${hf.toFixed(4)} Ha`, x1 - 8, Y(hf) - 8, c.soft, 13, 'right');
        for (const d of [-90, -45, 0, 45, 90]) label(ctx, `${d}°`, X(d), y1 + 20 * K, c.soft, 13, 'center');
        label(ctx, 'θ, the one knob', (x0 + x1) / 2, h - 4, c.soft, 13, 'center');
        yTitle(ctx, 'energy (Ha)', (y0 + y1) / 2, c);
        const step = ticks.length > 8 ? 2 : 1;
        ticks.forEach((e, i) => { if (i % step === 0) label(ctx, e.toFixed(1), x0 - 10, Y(e), c.soft, 13, 'right', 'middle'); });
      }
    },
  };

  /* ======================================================================
     H2 by information-theory phase estimation
     ----------------------------------------------------------------------
     Section 9 of the Qiskit / Guppy tutorial (Guppy testing/Q_propraming_tut),
     which reproduces the two-qubit logical circuit of K. Yamamoto et al.,
     "Quantum error-corrected computation of molecular energies",
     PRX Quantum 7, 020319 (2026). Constants and post-processing are the
     notebook's; with one system qubit the circuit is simulated exactly with
     2x2 matrices instead of Aer. Random draws use a seeded generator, so a run
     is repeatable but its numbers differ from the notebook's NumPy seed, as
     any two runs do (the notebook puts the run-to-run spread at ~6 mHa).
     ====================================================================== */
  const itqpe = (() => {
    const h1 = 0.79605, h2 = -0.18092, h3 = -0.32096;          /* Eq. (1), hartree */
    const T = Math.PI / (8 * h1);                              /* e^{-i h1 Z t} is a T gate */
    const H1T = Math.PI / 8, H2T = -Math.PI / 32;              /* h2 t rounded to 5 bits of pi */
    const PAIRS = 219, SHOTS = 10;                             /* N_s = 2190, as in the notebook */

    const cx = (re, im = 0) => ({ re, im });
    const mul = (a, b) => cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
    const add = (a, b) => cx(a.re + b.re, a.im + b.im);
    const mm = (A, B) => [add(mul(A[0], B[0]), mul(A[1], B[2])), add(mul(A[0], B[1]), mul(A[1], B[3])),
                          add(mul(A[2], B[0]), mul(A[3], B[2])), add(mul(A[2], B[1]), mul(A[3], B[3]))];
    const expZ = (th) => [cx(Math.cos(th), -Math.sin(th)), cx(0), cx(0), cx(Math.cos(th), Math.sin(th))];
    const expX = (th) => [cx(Math.cos(th)), cx(0, -Math.sin(th)), cx(0, -Math.sin(th)), cx(Math.cos(th))];

    /* One Trotter step, U = e^{-i h2 X t} e^{-i h1 Z t}, and its powers. */
    const U = mm(expX(H2T), expZ(H1T));
    const powers = [[cx(1), cx(0), cx(0), cx(1)]];
    for (let k = 1; k <= 12; k++) powers.push(mm(U, powers[k - 1]));

    /* Ancilla P(0) after controlled-U^k on |1>, Rz(beta), H: (1 + Re e^{i beta} <1|U^k|1>) / 2 */
    const p0 = (k, beta) => { const a = powers[k][3]; return (1 + Math.cos(beta) * a.re - Math.sin(beta) * a.im) / 2; };

    const exact = h3 - Math.hypot(h1, h2);                    /* FCI: -1.13731 */
    const target = (() => {                                   /* what a perfect run converges to */
      const tr = add(U[0], U[3]), det = add(mul(U[0], U[3]), mul(cx(-1), mul(U[1], U[2])));
      const disc = add(mul(tr, tr), mul(cx(-4), det));
      const r = Math.hypot(disc.re, disc.im);
      const sq = cx(Math.sqrt((r + disc.re) / 2), Math.sign(disc.im || 1) * Math.sqrt(Math.max(0, (r - disc.re) / 2)));
      let best = null, weight = -1;
      for (const s of [1, -1]) {
        const lam = cx((tr.re + s * sq.re) / 2, (tr.im + s * sq.im) / 2);
        const v0 = U[1], v1 = add(lam, mul(cx(-1), U[0]));
        const w = (v1.re ** 2 + v1.im ** 2) / (v0.re ** 2 + v0.im ** 2 + v1.re ** 2 + v1.im ** 2);
        if (w > weight) { weight = w; best = lam; }
      }
      return h3 - Math.atan2(best.im, best.re) / T;
    })();
    const mirror = 2 * h3 - exact;                            /* where the real part alone also peaks */
    const energyOf = (phi) => h3 - phi / T;
    const phiOf = (E) => (h3 - E) * T;

    const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

    const FULL = 9000, WIN = 700, HALF = 0.07;
    const full = new Float64Array(FULL).map((_, i) => -Math.PI + (2 * Math.PI * i) / FULL);
    const win = new Float64Array(WIN).map((_, i) => phiOf(exact - HALF + (2 * HALF * i) / (WIN - 1)));

    const term = (k, beta, n0, phi) => {
      const c = Math.cos(k * phi + beta);
      return n0 * Math.log(Math.max(1e-12, (1 + c) / 2)) + (SHOTS - n0) * Math.log(Math.max(1e-12, (1 - c) / 2));
    };

    /* Settings and their shots for one run; log Q kept cumulatively. */
    let cache = null;
    function run(s) {
      const key = `${s.seed}|${s.kmax}|${s.realOnly}`;
      if (!cache || cache.key !== key || s.pairs < cache.n) {
        const r = rng(s.seed);
        const set = [];
        for (let i = 0; i < PAIRS; i++) {
          const k = 1 + Math.floor(r() * s.kmax);
          const beta = s.realOnly ? 0 : (r() < 0.5 ? 0 : Math.PI / 2);
          let zeros = 0;
          for (let j = 0; j < SHOTS; j++) if (r() < p0(k, beta)) zeros++;
          set.push({ k, beta, zeros });
        }
        cache = { key, set, n: 0, full: new Float64Array(FULL), win: new Float64Array(WIN) };
      }
      for (; cache.n < s.pairs; cache.n++) {
        const { k, beta, zeros } = cache.set[cache.n];
        for (let i = 0; i < FULL; i++) cache.full[i] += term(k, beta, zeros, full[i]);
        for (let i = 0; i < WIN; i++) cache.win[i] += term(k, beta, zeros, win[i]);
      }
      return cache;
    }

    /* The estimate: the highest point of log Q, refined, and the width of the peak. */
    function estimate(s) {
      const c = run(s);
      let at = 0;
      for (let i = 1; i < FULL; i++) if (c.full[i] > c.full[at]) at = i;
      const centre = full[at], span = (2 * Math.PI / FULL) * 40, N = 800;
      const phis = [], lq = [];
      let max = -Infinity;
      for (let i = 0; i < N; i++) {
        const phi = centre - span / 2 + (span * i) / (N - 1);
        let v = 0;
        for (let j = 0; j < s.pairs; j++) { const p = c.set[j]; v += term(p.k, p.beta, p.zeros, phi); }
        phis.push(phi); lq.push(v); if (v > max) max = v;
      }
      let wsum = 0, mean = 0, best = 0;
      lq.forEach((v, i) => { if (v === max) best = i; });
      const Ehat = energyOf(phis[best]);
      let second = 0;
      lq.forEach((v, i) => { const w = Math.exp(v - max); wsum += w; second += w * (energyOf(phis[i]) - Ehat) ** 2; mean += w; });
      const fullMax = Math.max(max, c.full[at]);
      return { E: Ehat, err: Math.sqrt(second / wsum), max: fullMax, c };
    }

    return {
      PAIRS, SHOTS, exact, target, mirror, paper: { E: -1.136, err: 0.013 },
      defaults: () => ({ seed: 2026, kmax: 12, realOnly: false, pairs: PAIRS }),

      /* The "video": evidence accumulating, 30 settings a second, then a hold. */
      loop(t) { const cyc = t % 9.5; return { seed: 2026, kmax: 12, realOnly: false, pairs: Math.min(PAIRS, 1 + Math.floor(cyc * 30)) }; },

      summary(s) {
        const e = estimate(s);
        return { ...e, text: `E = ${e.E.toFixed(4)} ± ${e.err.toFixed(4)} Ha from ${s.pairs * SHOTS} shots (exact ${exact.toFixed(4)} Ha)` };
      },

      draw(canvas, s, opts = {}) {
        const { ctx, w, h } = frame(canvas);
        const c = palette(canvas);
        const compact = opts.compact || w < 520;
        const e = estimate(s);
        const data = e.c;

        /* the peak, zoomed onto the chemistry: log Q − max over candidate energies */
        const x0 = compact ? 12 : 76 * K, x1 = w - (compact ? 12 : 16), y0 = compact ? 30 : 22;
        const y1 = compact ? h - 64 : h * 0.6 - 52;
        const lo = exact - HALF, hi = exact + HALF, FLOOR = -15;
        const X = (E) => x0 + ((E - lo) / (hi - lo)) * (x1 - x0);
        const Y = (v) => y0 + (Math.max(FLOOR, Math.min(0.5, v)) / FLOOR) * (y1 - y0);
        for (const v of [0, -5, -10]) gridH(ctx, x0, x1, Y(v), c);
        for (let t = -1.2; t <= -1.07; t += 0.025) gridV(ctx, X(t), y0, y1, c);
        rule(ctx, x0, x1, y1, c.soft);
        if (e.E > lo && e.E < hi) {
          ctx.globalAlpha = 0.12; ctx.fillStyle = c.series;
          ctx.fillRect(X(e.E - e.err), y0, Math.max(2, X(e.E + e.err) - X(e.E - e.err)), y1 - y0);
          ctx.globalAlpha = 1;
        }
        const vrule = (E, color) => { ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(Math.round(X(E)) + 0.5, y0); ctx.lineTo(Math.round(X(E)) + 0.5, y1); ctx.stroke(); };
        vrule(exact, c.ink);
        vrule(target, c.soft);
        const pts = [];
        for (let i = 0; i < WIN; i++) pts.push([X(energyOf(win[i])), Y(data.win[i] - e.max)]);
        line(ctx, pts, c.series, 2);
        if (e.E > lo && e.E < hi) dot(ctx, X(e.E), Y(0), 5, c.mark, c.surface);
        if (!compact) {
          label(ctx, `exact ${exact.toFixed(4)}`, X(exact) + 8, y1 - 10, c.ink, 14, 'left', 'alphabetic', 700);
          label(ctx, `this circuit's target ${target.toFixed(4)}`, X(target) - 8, y1 - 10, c.soft, 13, 'right');
          for (const t of [-1.2, -1.15, -1.1]) label(ctx, t.toFixed(2), X(t), y1 + 20 * K, c.soft, 13, 'center');
          label(ctx, 'candidate energy (Ha)', x1, y1 + 20 * K, c.soft, 13, 'right');
          for (const v of [0, -5, -10, -15]) label(ctx, String(v), x0 - 10, Y(v), c.soft, 13, 'right', 'middle');
          yTitle(ctx, 'log Q − max', (y0 + y1) / 2, c);
        }

        /* the raw bits: one column per setting, ten shots each, filled = 0 */
        const bitsX0 = compact ? x0 : w * 0.56, bitsX1 = x1, bitsY0 = compact ? h - 50 : h * 0.6 + 26, bitsY1 = compact ? h - 10 : h - 34;
        const cell = Math.max(3, Math.min(8, Math.floor((bitsY1 - bitsY0) / SHOTS) - 1));
        const cols = Math.min(s.pairs, Math.floor((bitsX1 - bitsX0) / (cell + 1)));
        for (let j = 0; j < cols; j++) {
          const p = data.set[s.pairs - cols + j];
          for (let b = 0; b < SHOTS; b++) {
            ctx.fillStyle = b < p.zeros ? c.series : c.grid;
            ctx.fillRect(bitsX0 + j * (cell + 1), bitsY1 - (b + 1) * (cell + 1), cell, cell);
          }
        }
        if (compact && opts.quiet) return;
        if (compact) {
          /* the small view still says what is growing */
          label(ctx, `${s.pairs * SHOTS} shots`, x0, y0 + 2, c.ink, 15, 'left', 'top', 800);
          if (e.E > lo && e.E < hi) label(ctx, `E = ${e.E.toFixed(3)} Ha`, x1, y0 + 2, c.ink, 15, 'right', 'top', 700);
          return;
        }
        label(ctx, 'the raw bits, latest settings: filled is a 0', bitsX0, bitsY0 - 10, c.soft, 13);

        /* every candidate: many peaks; real part alone also leaves a mirror */
        const fx0 = x0, fx1 = w * 0.5, fy0 = h * 0.6 + 26, fy1 = h - 34;
        let fmin = Infinity; for (let i = 0; i < FULL; i++) fmin = Math.min(fmin, data.full[i]);
        const fX = (i) => fx0 + (i / (FULL - 1)) * (fx1 - fx0);
        const fY = (v) => fy0 + ((e.max - v) / Math.max(1e-9, e.max - fmin)) * (fy1 - fy0);
        rule(ctx, fx0, fx1, fy1, c.grid);
        const fpts = [];
        for (let i = 0; i < FULL; i += 6) fpts.push([fX(i), fY(data.full[i])]);
        line(ctx, fpts, c.series, 1.5);
        const fE = (E) => fx0 + ((phiOf(E) + Math.PI) / (2 * Math.PI)) * (fx1 - fx0);
        ctx.strokeStyle = c.ink; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(Math.round(fE(exact)) + 0.5, fy0); ctx.lineTo(Math.round(fE(exact)) + 0.5, fy1); ctx.stroke();
        label(ctx, 'every candidate energy, −6.7 to 6.0 Ha', fx0, fy0 - 10, c.soft, 13);
        if (s.realOnly) label(ctx, `mirror ${mirror.toFixed(3)}`, fE(mirror), fy1 + 18, c.ink, 13, 'center');
        label(ctx, 'exact', fE(exact), fy1 + 18, c.ink, 13, 'center');
      },
    };
  })();

  /* ---- a looping renderer for the reel and the peek window ----------------
     `which` may change between frames (the peek window follows the pointer). */
  const STATIONS = { grover, chsh, sg, vqe, itqpe };

  function animate(canvas, which, opts = {}) {
    let raf = 0, visible = true, start = performance.now(), current = null;
    const pick = () => (typeof which === 'function' ? which() : which);
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden || (opts.active && !opts.active())) return;
      const name = pick();
      if (name !== current) { current = name; start = now; }
      const st = STATIONS[name];
      if (!st) return;
      const s = st.loop((now - start) / 1000);
      st.draw(canvas, s, opts);
      opts.onState && opts.onState(s, st.summary(s));
    };
    if ('IntersectionObserver' in global) {
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
    }
    return {
      play() { if (!raf) raf = requestAnimationFrame(tick); },
      stop() { cancelAnimationFrame(raf); raf = 0; },
      still(at = 0) {
        const st = STATIONS[pick()]; const s = st.loop(at);
        st.draw(canvas, s, opts); opts.onState && opts.onState(s, st.summary(s));
      },
    };
  }

  global.QuestPlots = { STATIONS, animate };
})(window);
