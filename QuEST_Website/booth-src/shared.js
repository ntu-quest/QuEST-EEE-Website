/* QCC qfest booth -- shared runtime.
 *
 * Classic script, no modules and no fetch: those are blocked when a page is
 * opened straight off the filesystem, and every station has to survive being
 * double-clicked from a USB stick.
 *
 * Provides the four things every station needs:
 *   Booth.canvas(el)     HiDPI-correct 2d context that survives resize
 *   Booth.knob(id, fn)   slider wiring with a live value readout
 *   Booth.attract(cfg)   idle loop, so a screen is never dead
 *   Booth.reset(fn)      one obvious way back to the starting state
 */
(function (global) {
  "use strict";

  var Booth = {};

  // ------------------------------------------------------------ canvas

  /* Returns {ctx, width, height, repaint} in CSS pixels, redrawing on resize.
     Booth screens get plugged into whatever projector is available, so the
     canvas has to re-derive its backing store rather than trust a fixed size. */
  Booth.canvas = function (element, draw) {
    var ctx = element.getContext("2d");
    var state = { ctx: ctx, width: 0, height: 0 };
    var lastWidth = -1;

    function resize() {
      var ratio = global.devicePixelRatio || 1;
      var rect = element.getBoundingClientRect();
      var cssWidth = Math.round(rect.width);
      // A canvas inside a hidden panel measures zero. Painting into a 1px
      // backing store and then unhiding it is what left the phase-estimation
      // graph blank: the page looked fine, the canvas was one pixel wide.
      if (cssWidth < 2) return;
      var cssHeight = Math.max(1, Math.round(parseFloat(element.dataset.height || 320)));
      element.style.height = cssHeight + "px";
      element.width = Math.round(cssWidth * ratio);
      element.height = Math.round(cssHeight * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      state.width = cssWidth;
      state.height = cssHeight;
      lastWidth = cssWidth;
      if (draw) draw(state);
    }

    state.repaint = function () {
      // catches the first paint after a hidden panel is revealed
      var width = Math.round(element.getBoundingClientRect().width);
      if (width >= 2 && width !== lastWidth) { resize(); return; }
      if (draw) draw(state);
    };
    state.resize = resize;

    global.addEventListener("resize", resize);
    // Fires when the element's own box changes, including when an ancestor
    // stops being hidden -- which no window resize event would ever report.
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(function () { resize(); }).observe(element);
    }
    // fonts and layout settle a tick after parse; re-measure once
    global.requestAnimationFrame(resize);
    resize();
    canvases.push(state);
    return state;
  };

  /* Crisp 1px lines: canvas strokes straddle the coordinate, so nudge by a half. */
  Booth.crisp = function (v) { return Math.round(v) + 0.5; };

  Booth.css = function (name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  };

  // ------------------------------------------------------------- theming

  var palettes = [];
  var canvases = [];

  /* Canvas code caches its colours once at start-up, so a theme change would
     otherwise leave every plot painted in the old palette. Declaring the
     palette here lets Booth re-read the tokens and repaint on a switch.
        var C = Booth.palette({ ink: "--ink", marked: "--marked" });  */
  Booth.palette = function (map) {
    var out = {};
    function refresh() {
      Object.keys(map).forEach(function (key) { out[key] = Booth.css(map[key]); });
    }
    refresh();
    palettes.push(refresh);
    return out;
  };

  Booth.THEME_KEY = "qcc-booth-theme";

  Booth.getTheme = function () {
    return document.documentElement.getAttribute("data-theme") === "light"
      ? "light" : "dark";
  };

  Booth.setTheme = function (theme) {
    var light = theme === "light";
    if (light) document.documentElement.setAttribute("data-theme", "light");
    else document.documentElement.removeAttribute("data-theme");
    // file:// pages get a null origin and some browsers refuse storage there
    try { global.localStorage.setItem(Booth.THEME_KEY, theme); } catch (error) { }
    var button = document.getElementById("theme-toggle");
    if (button) {
      button.textContent = light ? "Dark" : "Light";
      button.setAttribute("aria-pressed", String(light));
    }
    palettes.forEach(function (refresh) { refresh(); });
    canvases.forEach(function (view) { if (view.resize) view.resize(); });
  };

  Booth.initTheme = function () {
    var stored = null;
    try { stored = global.localStorage.getItem(Booth.THEME_KEY); } catch (error) { }
    Booth.setTheme(stored === "light" ? "light" : "dark");
    var button = document.getElementById("theme-toggle");
    if (button) {
      button.addEventListener("click", function () {
        Booth._touch();
        Booth.setTheme(Booth.getTheme() === "light" ? "dark" : "light");
      });
    }
  };

  // ------------------------------------------------------------- knobs

  /* Wires <input type="range"> to a callback and a formatted readout.
     `format` receives the numeric value and returns display text. */
  Booth.knob = function (id, onChange, format) {
    var input = document.getElementById(id);
    var output = document.getElementById(id + "-value");
    if (!input) throw new Error("no knob #" + id);

    function emit(fromUser) {
      var value = parseFloat(input.value);
      if (output && format) output.textContent = format(value);
      else if (output) output.textContent = String(value);
      if (onChange) onChange(value, fromUser);
    }

    input.addEventListener("input", function () {
      Booth._touch();
      emit(true);
    });

    var api = {
      element: input,
      get: function () { return parseFloat(input.value); },
      set: function (value, silent) {
        input.value = value;
        if (!silent) emit(false);
        else if (output && format) output.textContent = format(parseFloat(input.value));
      },
      emit: emit
    };
    emit(false);
    return api;
  };

  // ----------------------------------------------------------- attract

  /* Idle attract loop.
     After `idleMs` without interaction the station animates its own knob so a
     passer-by sees motion; any touch stops it immediately and hands control
     back.  A booth screen sitting still reads as broken. */
  var attractState = { timer: null, raf: null, running: false, config: null };

  Booth.attract = function (config) {
    attractState.config = Object.assign({
      idleMs: 45000,
      periodMs: 9000,
      onFrame: null,
      onStop: null,
      note: null
    }, config);
    Booth._touch();
  };

  Booth._touch = function () {
    var cfg = attractState.config;
    if (!cfg) return;
    if (attractState.running) stopAttract();
    if (attractState.timer) clearTimeout(attractState.timer);
    attractState.timer = setTimeout(startAttract, cfg.idleMs);
  };

  function startAttract() {
    var cfg = attractState.config;
    if (!cfg || !cfg.onFrame) return;
    if (global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    attractState.running = true;
    if (cfg.note) cfg.note.hidden = false;
    var started = performance.now();
    (function frame(now) {
      if (!attractState.running) return;
      var phase = ((now - started) % cfg.periodMs) / cfg.periodMs;
      cfg.onFrame(phase);
      attractState.raf = global.requestAnimationFrame(frame);
    })(started);
  }

  function stopAttract() {
    var cfg = attractState.config;
    attractState.running = false;
    if (attractState.raf) global.cancelAnimationFrame(attractState.raf);
    if (cfg && cfg.note) cfg.note.hidden = true;
    if (cfg && cfg.onStop) cfg.onStop();
  }

  ["pointerdown", "keydown", "wheel", "touchstart"].forEach(function (event) {
    global.addEventListener(event, function () { Booth._touch(); }, { passive: true });
  });

  // ------------------------------------------------------------- reset

  Booth.reset = function (id, handler) {
    var button = document.getElementById(id);
    if (!button) return;
    button.addEventListener("click", function () {
      Booth._touch();
      handler();
    });
  };

  // ------------------------------------------------------------- misc

  /* Smooth interpolation for animated transitions between states. */
  Booth.ease = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };

  Booth.lerp = function (a, b, t) { return a + (b - a) * t; };

  /* Animates a value from `from` to `to` over `ms`, calling step(value). */
  Booth.animate = function (from, to, ms, step, done) {
    var started = null;
    function frame(now) {
      if (started === null) started = now;
      var t = Math.min(1, (now - started) / ms);
      step(Booth.lerp(from, to, Booth.ease(t)), t);
      if (t < 1) global.requestAnimationFrame(frame);
      else if (done) done();
    }
    global.requestAnimationFrame(frame);
  };

  Booth.fmt = function (value, digits) {
    return value.toFixed(digits === undefined ? 2 : digits);
  };

  /* Overlay hover targets on a circuit diagram.
     The rectangles come from booth/circuits/hotspots.js, which is generated
     alongside the SVGs by assets/make_circuits.py, so a hotspot cannot drift
     off its gate when the drawing changes. Buttons rather than divs, so the
     explanations are reachable by keyboard and read out by a screen reader. */
  Booth.circuits = function (root) {
    var data = global.QCC_CIRCUITS || {};
    var figures = (root || document).querySelectorAll("figure.circuit[data-circuit]");
    Array.prototype.forEach.call(figures, function (figure) {
      var spots = data[figure.getAttribute("data-circuit")];
      var stage = figure.querySelector(".circuit-stage");
      var tip = figure.querySelector(".circuit-tip");
      if (!spots || !stage) return;
      var idle = tip ? tip.textContent : "";

      spots.forEach(function (spot) {
        var button = document.createElement("button");
        button.type = "button";
        button.className = "circuit-hot";
        button.style.left = spot.x + "%";
        button.style.top = spot.y + "%";
        button.style.width = spot.w + "%";
        button.style.height = spot.h + "%";
        button.setAttribute("aria-label", spot.label + ": " + spot.tip);

        function show() {
          if (tip) { tip.textContent = spot.label + " — " + spot.tip; tip.className = "circuit-tip live"; }
          button.classList.add("on");
        }
        function hide() {
          if (tip) { tip.textContent = idle; tip.className = "circuit-tip"; }
          button.classList.remove("on");
        }
        button.addEventListener("mouseenter", show);
        button.addEventListener("mouseleave", hide);
        button.addEventListener("focus", show);
        button.addEventListener("blur", hide);
        button.addEventListener("click", function (event) { event.preventDefault(); show(); });
        stage.appendChild(button);
      });
    });
    return figures.length;
  };

  /* Guard against a station being opened without its generated data. */
  Booth.requireConstants = function () {
    if (!global.QCC) {
      document.body.innerHTML =
        '<div style="padding:40px;font-family:system-ui;color:#E8ECF7;background:#0B0E1A">' +
        "<h1>Missing generated data</h1><p>booth/data/constants.js did not load. " +
        "Run <code>python verify/export_constants.py</code> and keep the whole " +
        "<code>booth/</code> folder together.</p></div>";
      throw new Error("QCC constants missing");
    }
    return global.QCC;
  };

  global.Booth = Booth;
})(window);
