/* QCC qfest booth -- the physics, with no DOM in sight.
 *
 * Every station's numbers come from here.  Keeping this file free of rendering
 * is what lets verify/test_booth_physics.py run it in a bare JS engine and
 * compare it, function by function, against verify/reference.py -- which is in
 * turn checked against the papers.  So the chain is:
 *
 *     papers  ->  verify/reference.py  ->  booth/physics.js  ->  the screen
 *
 * and no link in it is allowed to drift.
 *
 * Complex numbers are kept as plain {re, im} pairs; the state spaces here are
 * two and four dimensional, so nothing needs to be clever.
 */
(function (global) {
  "use strict";

  var Physics = {};

  // =====================================================================
  // Grover search
  // =====================================================================

  var grover = {};

  /* sin(theta) = sqrt(M/N); one iteration rotates the state by 2 theta. */
  grover.theta = function (nQubits, nMarked) {
    return Math.asin(Math.sqrt(nMarked / Math.pow(2, nQubits)));
  };

  /* Boyer/Brassard/Hoyer/Tapp closed form. */
  grover.success = function (nQubits, nMarked, iterations) {
    var t = grover.theta(nQubits, nMarked);
    return Math.pow(Math.sin((2 * iterations + 1) * t), 2);
  };

  grover.optimalIterations = function (nQubits, nMarked) {
    var t = grover.theta(nQubits, nMarked);
    return Math.max(0, Math.round((Math.PI / 2 - t) / (2 * t)));
  };

  /* At M/N >= 1/2 the amplitude never concentrates and the algorithm is dead. */
  grover.isDegenerate = function (nQubits, nMarked) {
    return nMarked / Math.pow(2, nQubits) >= 0.5;
  };

  grover.oracle = function (amplitudes, marked) {
    var out = amplitudes.slice();
    for (var i = 0; i < marked.length; i++) {
      if (marked[i] < out.length) out[marked[i]] = -out[marked[i]];
    }
    return out;
  };

  grover.mean = function (amplitudes) {
    var total = 0;
    for (var i = 0; i < amplitudes.length; i++) total += amplitudes[i];
    return total / amplitudes.length;
  };

  /* Inversion about the mean -- the step the booth animates. */
  grover.diffuser = function (amplitudes) {
    var mean = grover.mean(amplitudes);
    var out = new Array(amplitudes.length);
    for (var i = 0; i < amplitudes.length; i++) out[i] = 2 * mean - amplitudes[i];
    return out;
  };

  grover.uniform = function (nQubits) {
    var size = Math.pow(2, nQubits);
    var out = new Array(size);
    var value = 1 / Math.sqrt(size);
    for (var i = 0; i < size; i++) out[i] = value;
    return out;
  };

  /* Full state-vector run -- independent of the closed form above. */
  grover.amplitudes = function (nQubits, marked, iterations) {
    var psi = grover.uniform(nQubits);
    for (var k = 0; k < iterations; k++) {
      psi = grover.diffuser(grover.oracle(psi, marked));
    }
    return psi;
  };

  grover.successFromAmplitudes = function (amplitudes, marked) {
    var total = 0;
    for (var i = 0; i < marked.length; i++) {
      if (marked[i] < amplitudes.length) {
        total += amplitudes[marked[i]] * amplitudes[marked[i]];
      }
    }
    return total;
  };

  Physics.grover = grover;

  // =====================================================================
  // CHSH
  // =====================================================================

  var chsh = {};

  chsh.TSIRELSON = 2 * Math.SQRT2;
  chsh.CLASSICAL = 2;
  chsh.ANGLES = { a: 0, aPrime: Math.PI / 2, b: Math.PI / 4, bPrime: 3 * Math.PI / 4 };

  /* Joint probabilities for |Phi+> = (|00> + |11>)/sqrt2 measured along two
     directions in the x-z plane.  Written out as a real 4x4 calculation rather
     than the cos(a-b) shortcut, so the shortcut can be tested against it. */
  chsh.jointProbabilities = function (angleA, angleB, state) {
    var psi = state || chsh.bellPhiPlus();
    var probabilities = {};
    var signs = [1, -1];
    for (var i = 0; i < 2; i++) {
      for (var j = 0; j < 2; j++) {
        var pa = projector(angleA, signs[i]);
        var pb = projector(angleB, signs[j]);
        probabilities[signs[i] + "," + signs[j]] = expectationOfProduct(psi, pa, pb);
      }
    }
    return probabilities;
  };

  chsh.bellPhiPlus = function () {
    var v = 1 / Math.SQRT2;
    return [v, 0, 0, v];
  };

  chsh.productState = function (angleA, angleB) {
    var a = [Math.cos(angleA / 2), Math.sin(angleA / 2)];
    var b = [Math.cos(angleB / 2), Math.sin(angleB / 2)];
    return [a[0] * b[0], a[0] * b[1], a[1] * b[0], a[1] * b[1]];
  };

  /* (I + s * (cos Z + sin X)) / 2 */
  function projector(angle, sign) {
    var c = Math.cos(angle), s = Math.sin(angle);
    return [
      [(1 + sign * c) / 2, (sign * s) / 2],
      [(sign * s) / 2, (1 - sign * c) / 2]
    ];
  }

  /* <psi| A tensor B |psi> for a real two-qubit state. */
  function expectationOfProduct(psi, a, b) {
    var total = 0;
    for (var i0 = 0; i0 < 2; i0++) {
      for (var i1 = 0; i1 < 2; i1++) {
        for (var j0 = 0; j0 < 2; j0++) {
          for (var j1 = 0; j1 < 2; j1++) {
            total += psi[2 * i0 + i1] * a[i0][j0] * b[i1][j1] * psi[2 * j0 + j1];
          }
        }
      }
    }
    return total;
  }

  chsh.correlator = function (angleA, angleB, state) {
    var p = chsh.jointProbabilities(angleA, angleB, state);
    return p["1,1"] - p["1,-1"] - p["-1,1"] + p["-1,-1"];
  };

  chsh.S = function (a, aPrime, b, bPrime, state) {
    return chsh.correlator(a, b, state)
         - chsh.correlator(a, bPrime, state)
         + chsh.correlator(aPrime, b, state)
         + chsh.correlator(aPrime, bPrime, state);
  };

  /* The booth dial: rotate both of Bob's settings together. */
  chsh.SDetuned = function (delta, state) {
    return chsh.S(chsh.ANGLES.a, chsh.ANGLES.aPrime,
                  chsh.ANGLES.b + delta, chsh.ANGLES.bPrime + delta, state);
  };

  /* Sampled counts, so the station can show honest statistical noise. */
  chsh.sample = function (angleA, angleB, shots, state, random) {
    var rand = random || Math.random;
    var p = chsh.jointProbabilities(angleA, angleB, state);
    var keys = ["1,1", "1,-1", "-1,1", "-1,-1"];
    var counts = { "1,1": 0, "1,-1": 0, "-1,1": 0, "-1,-1": 0 };
    for (var s = 0; s < shots; s++) {
      var r = rand(), acc = 0;
      for (var k = 0; k < keys.length; k++) {
        acc += p[keys[k]];
        if (r <= acc) { counts[keys[k]]++; break; }
      }
    }
    return counts;
  };

  chsh.correlatorFromCounts = function (counts) {
    var total = counts["1,1"] + counts["1,-1"] + counts["-1,1"] + counts["-1,-1"];
    if (total === 0) return 0;
    return (counts["1,1"] - counts["1,-1"] - counts["-1,1"] + counts["-1,-1"]) / total;
  };

  Physics.chsh = chsh;

  // =====================================================================
  // Stern-Gerlach
  // =====================================================================

  var sg = {};

  /* Single-qubit states as [{re,im}, {re,im}]. */
  function cx(re, im) { return { re: re, im: im || 0 }; }
  function cMul(a, b) { return cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re); }
  function cConj(a) { return cx(a.re, -a.im); }
  function cAbs2(a) { return a.re * a.re + a.im * a.im; }

  sg.eigenstate = function (axis, sign) {
    var v = 1 / Math.SQRT2;
    if (axis === "Z") return sign > 0 ? [cx(1), cx(0)] : [cx(0), cx(1)];
    if (axis === "X") return sign > 0 ? [cx(v), cx(v)] : [cx(v), cx(-v)];
    if (axis === "Y") return sign > 0 ? [cx(v), cx(0, v)] : [cx(v), cx(0, -v)];
    throw new Error("unknown axis " + axis);
  };

  /* <ket|state>, the amplitude the Born rule squares. */
  function innerProduct(ket, state) {
    var re = 0, im = 0;
    for (var i = 0; i < 2; i++) {
      var term = cMul(cConj(ket[i]), state[i]);
      re += term.re; im += term.im;
    }
    return cx(re, im);
  }

  /* Projective measurement: probability and the collapsed state. */
  sg.measure = function (state, axis) {
    var out = {};
    [1, -1].forEach(function (sign) {
      var ket = sg.eigenstate(axis, sign);
      var amplitude = innerProduct(ket, state);
      var probability = cAbs2(amplitude);
      var collapsed = null;
      if (probability > 1e-15) {
        var scale = 1 / Math.sqrt(probability);
        collapsed = [
          cMul(ket[0], cx(amplitude.re * scale, amplitude.im * scale)),
          cMul(ket[1], cx(amplitude.re * scale, amplitude.im * scale))
        ];
      }
      out[sign] = { probability: probability, state: collapsed };
    });
    return out;
  };

  /* (|0> + e^{i phi}|1>)/sqrt2 -- the relative-phase knob. */
  sg.phaseState = function (phi) {
    var v = 1 / Math.SQRT2;
    return [cx(v, 0), cx(v * Math.cos(phi), v * Math.sin(phi))];
  };

  /* Run a beam through magnets.  Each stage is {axis, blocked} where `blocked`
     is +1, -1 or null (null = analyse only, block nothing).
     Returns {surviving, final:{1:p, -1:p}, state}. */
  sg.sequence = function (state, stages) {
    var psi = state;
    var surviving = 1;
    for (var i = 0; i < stages.length - 1; i++) {
      var stage = stages[i];
      if (stage.blocked === null || stage.blocked === undefined) continue;
      var kept = -stage.blocked;
      var result = sg.measure(psi, stage.axis)[kept];
      surviving *= result.probability;
      if (!result.state) return { surviving: 0, final: { 1: 0, "-1": 0 }, state: null };
      psi = result.state;
    }
    var lastAxis = stages[stages.length - 1].axis;
    var measured = sg.measure(psi, lastAxis);
    return {
      surviving: surviving,
      final: { 1: measured[1].probability, "-1": measured[-1].probability },
      state: psi
    };
  };

  sg.probabilities = function (state, axis) {
    var m = sg.measure(state, axis);
    return { 1: m[1].probability, "-1": m[-1].probability };
  };

  /* Bloch vector, for drawing the state on a sphere. */
  sg.blochVector = function (state) {
    var a = state[0], b = state[1];
    return {
      x: 2 * (a.re * b.re + a.im * b.im),
      y: 2 * (a.re * b.im - a.im * b.re),
      z: cAbs2(a) - cAbs2(b)
    };
  };

  Physics.sg = sg;

  // =====================================================================
  // VQE on H2
  // =====================================================================

  var h2 = {};

  /* E(theta) = offset + cosAmp cos(2 theta) + sinAmp sin(2 theta).
     Derived in verify/reference.py: the generator squares to the identity, so
     |phi(theta)> = cos(theta)|10> + sin(theta)|01> and every expectation value
     collapses to a single sinusoid in 2 theta.  No matrix exponential needed. */
  h2.energy = function (row, theta) {
    return row.offset + row.cosAmp * Math.cos(2 * theta) + row.sinAmp * Math.sin(2 * theta);
  };

  h2.groundEnergy = function (row) {
    return row.offset - Math.hypot(row.cosAmp, row.sinAmp);
  };

  h2.optimalTheta = function (row) {
    return Math.atan2(-row.sinAmp, -row.cosAmp) / 2;
  };

  h2.hartreeFockEnergy = function (row) {
    return h2.energy(row, 0);
  };

  /* The state a visitor is steering: real, two terms, easy to draw. */
  h2.ansatzState = function (theta) {
    return { hf: Math.cos(theta), excited: Math.sin(theta) };
  };

  h2.rowFor = function (rows, radius) {
    var best = rows[0], bestGap = Infinity;
    for (var i = 0; i < rows.length; i++) {
      var gap = Math.abs(rows[i].R - radius);
      if (gap < bestGap) { bestGap = gap; best = rows[i]; }
    }
    return best;
  };

  Physics.h2 = h2;


  // =====================================================================
  // Quantum phase estimation, on the same H2 Hamiltonian
  // =====================================================================

  var qpe = {};

  qpe.SHIFT = 2.0;      // Hartree; makes every tabulated ground energy positive
  qpe.SCALE = 2.5;      // Hartree per full turn of phase
  qpe.WINDOW = [-1.25, 0.25];

  qpe.timeStep = function () { return 2 * Math.PI / qpe.SCALE; };

  qpe.phaseOf = function (energy) { return (energy + qpe.SHIFT) / qpe.SCALE; };

  qpe.energyOf = function (phase) { return phase * qpe.SCALE - qpe.SHIFT; };

  /* Phase estimation is circular, so y = 0 also means phase 1.  With few bits
     the likeliest outcome can land on the far side of the wrap; pick the branch
     nearest the energy window we committed to when choosing SHIFT and SCALE. */
  qpe.unwrapEnergy = function (phase) {
    var best = null, bestDistance = Infinity;
    for (var turn = -1; turn <= 1; turn++) {
      var energy = qpe.energyOf(phase + turn);
      var distance = Math.max(qpe.WINDOW[0] - energy, 0, energy - qpe.WINDOW[1]);
      if (distance < bestDistance) { bestDistance = distance; best = energy; }
    }
    return best;
  };

  /* P(y) for an exact eigenstate input -- the Dirichlet kernel, N&C eq. 5.26. */
  qpe.distribution = function (phase, nBits) {
    var size = Math.pow(2, nBits);
    var out = new Array(size);
    for (var y = 0; y < size; y++) {
      var delta = phase - y / size;
      var wrapped = delta - Math.floor(delta);
      if (wrapped < 1e-12 || wrapped > 1 - 1e-12) { out[y] = 1; continue; }
      var numerator = Math.sin(size * Math.PI * delta);
      var denominator = size * Math.sin(Math.PI * delta);
      out[y] = Math.pow(numerator / denominator, 2);
    }
    return out;
  };

  qpe.phaseError = function (truePhase, estimatedPhase) {
    var difference = Math.abs(truePhase - estimatedPhase) % 1;
    return Math.min(difference, 1 - difference);
  };

  qpe.readout = function (phase, nBits) {
    var probabilities = qpe.distribution(phase, nBits);
    var best = 0;
    for (var y = 1; y < probabilities.length; y++) {
      if (probabilities[y] > probabilities[best]) best = y;
    }
    var estimatedPhase = best / Math.pow(2, nBits);
    return {
      outcome: best,
      estimatedPhase: estimatedPhase,
      estimatedEnergy: qpe.unwrapEnergy(estimatedPhase),
      probability: probabilities[best],
      probabilities: probabilities
    };
  };

  /* Best achievable error: half a bin, so it halves per extra qubit. */
  qpe.errorBound = function (nBits) { return qpe.SCALE / Math.pow(2, nBits + 1); };

  qpe.forRow = function (row, nBits) {
    var exact = h2.groundEnergy(row);
    var phase = qpe.phaseOf(exact);
    var result = qpe.readout(phase, nBits);
    result.exactEnergy = exact;
    result.phase = phase;
    result.error = Math.abs(result.estimatedEnergy - exact);
    result.phaseError = qpe.phaseError(phase, result.estimatedPhase);
    result.bound = qpe.errorBound(nBits);
    return result;
  };

  Physics.qpe = qpe;

  global.Physics = Physics;
  if (typeof module !== "undefined" && module.exports) module.exports = Physics;
})(typeof globalThis !== "undefined" ? globalThis : this);
