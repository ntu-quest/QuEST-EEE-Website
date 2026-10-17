/* ---------------------------------------------------------------------------
 * QuEST@EEE — redesign prototype interactions
 *
 * Every interaction the reference site uses, rebuilt on the club's own
 * material and none of its code:
 *
 *   reference                        here
 *   -------------------------------  ------------------------------------------
 *   liquid drops off the hero slash  Young's field: source B leans toward the pointer, and
 *                                    the screen on the right shows the fringes
 *   slash stretches into a tube      the bright fringe is carried down the page
 *                                    as a wave that dies to one dot ...
 *   ... which opens the showreel     ... which opens the demo reel
 *   words that ink in on scroll      the intro lead, from soft ink (already AA)
 *   video window following cursor    each demo's own render, on a spring
 *   cursor bubble over projects      "Open" over the shelf of spines
 *   velocity marquee                 Explore, Build, Question, Become
 *   menu opening from its button     the same, with every route on the site
 *   footer slash leaning to cursor   a ket, on a spring
 *
 * Rules every module keeps (CLAUDE.md §Interactivity, amended in PLAN.md §8):
 *   - the page is complete with this file missing; entrance states hang off
 *     html.js and nothing waits on an observer to become readable;
 *   - prefers-reduced-motion gets the still version: the field draws one
 *     frame, the thread is skipped, the reel is open, words are inked;
 *   - transform and opacity only; one rAF per module, idle when off-screen.
 * ------------------------------------------------------------------------- */

(() => {
  const doc = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const narrow = () => innerWidth < 720;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const easeInOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const cssVar = (name) => getComputedStyle(doc).getPropertyValue(name).trim();

  /* One scroll listener feeds every module that needs it, once per frame. */
  const onScroll = [];
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { ticking = false; onScroll.forEach((f) => f()); });
  }, { passive: true });

  /* ---- mailto, assembled at runtime (anti-scraping, as on the live site) -- */
  $$('[data-mailto]').forEach((a) => {
    const { user, domain, subject } = a.dataset;
    a.href = `mailto:${user}@${domain}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
  });

  /* ---- theme ---------------------------------------------------------------- */
  const themeButton = $('[data-theme-toggle]');
  const isDark = () => doc.dataset.theme
    ? doc.dataset.theme === 'dark'
    : matchMedia('(prefers-color-scheme: dark)').matches;
  const themeListeners = [];
  if (themeButton) {
    themeButton.setAttribute('aria-pressed', String(isDark()));
    themeButton.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      doc.dataset.theme = next;
      try { localStorage.setItem('quest-theme', next); } catch (error) { /* storage blocked */ }
      themeButton.setAttribute('aria-pressed', String(next === 'dark'));
      themeListeners.forEach((f) => f());
    });
  }

  /* the tab's icon wears the theme too: the white tile in light, the dark tile in dark */
  const favSvg = $('link[data-favicon]'), favPng = $('link[data-favicon-png]');
  const setFavicon = () => {
    const dark = isDark();
    if (favSvg) favSvg.href = `assets/favicon-${dark ? 'dark' : 'light'}.svg?v=3`;
    if (favPng) favPng.href = `assets/favicon${dark ? '-dark' : ''}-32.png?v=3`;
  };
  setFavicon();
  themeListeners.push(setFavicon);
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (!doc.dataset.theme) setFavicon(); });

  /* ---- top row: hide the shortcuts after the hero, read the ground below -- */
  const top = $('[data-top]');
  const fab = $('[data-to-top-fab]');
  const heroLogo = $('.hero-logo');
  /* The ground under the row decides logo and buttons, whatever the theme:
     walk up from the point beneath the row to the first painted background. */
  const groundIsDark = () => {
    const el = document.elementFromPoint(Math.round(innerWidth * 0.3), 44);
    for (let n = el; n; n = n.parentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      const m = bg.match(/[\d.]+/g);
      if (m && (m.length < 4 || Number(m[3]) > 0.5)) {
        const [r, g, b] = m.slice(0, 3).map(Number);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b < 110;
      }
    }
    return isDark();
  };
  const updateTop = () => {
    const y = scrollY;
    const logoGone = heroLogo ? heroLogo.getBoundingClientRect().bottom < 80 : y > innerHeight * 0.3;
    top.classList.toggle('show-brand', logoGone);
    top.classList.toggle('is-scrolled', y > innerHeight * 0.55);
    const dark = groundIsDark();
    top.classList.toggle('on-dark', dark);
    top.classList.toggle('on-light', !dark);
    if (fab) fab.classList.toggle('is-shown', y > innerHeight * 1.1);
  };
  themeListeners.push(() => requestAnimationFrame(updateTop));
  onScroll.push(updateTop);
  updateTop();

  $$('[data-to-top]').forEach((a) => a.addEventListener('click', (event) => {
    event.preventDefault();
    scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }));

  /* ---- menu: opens from its button, traps focus, Esc closes ---------------- */
  const menu = $('[data-menu]');
  const menuOpen = $('[data-menu-open]');
  const menuClose = $('[data-menu-close]');
  if (menu && menuOpen) {
    const focusables = () => $$('a, button', menu);
    const open = () => {
      menu.hidden = false;
      menu.removeAttribute('data-closing');
      menu.setAttribute('data-open', '');
      menuOpen.setAttribute('aria-expanded', 'true');
      doc.style.overflow = 'hidden';
      requestAnimationFrame(() => focusables()[1]?.focus());
    };
    const close = () => {
      menu.removeAttribute('data-open');
      menu.setAttribute('data-closing', '');
      menuOpen.setAttribute('aria-expanded', 'false');
      doc.style.overflow = '';
      setTimeout(() => { menu.hidden = true; menu.removeAttribute('data-closing'); }, reduce ? 0 : 260);
      menuOpen.focus();
    };
    menuOpen.addEventListener('click', open);
    /* Dropdowns: one open at a time; opening the menu starts them closed. */
    const parents = $$('.menu-parent', menu);
    const collapse = () => parents.forEach((b) => { b.setAttribute('aria-expanded', 'false'); $('#' + b.getAttribute('aria-controls')).hidden = true; });
    /* One highlight slides to whichever row the pointer or the keyboard is on,
       so moving down the menu reads as one partition lighting at a time. */
    const nav = $('.menu-nav', menu), hl = $('[data-menu-hl]', menu);
    const ROW = '.menu-list > li > a, .menu-parent, .menu-sub a';
    /* Layout offsets, not the on-screen box: the rows slide in when the menu
       opens, and the highlight belongs where a row comes to rest, not where
       it happens to be mid-slide. */
    const restingBox = (el) => {
      let x = 0, y = 0, p = el;
      while (p && p !== nav) { x += p.offsetLeft; y += p.offsetTop; p = p.offsetParent; }
      return { x, y, w: el.offsetWidth, h: el.offsetHeight };
    };
    const place = (el) => {
      if (!nav || !hl || !el) return;
      const r = restingBox(el);
      const first = !nav.classList.contains('has-hl');
      if (first) hl.style.transition = 'none';
      hl.style.setProperty('--hx', `${r.x}px`);
      hl.style.setProperty('--hy', `${r.y}px`);
      hl.style.setProperty('--hw', `${r.w}px`);
      hl.style.setProperty('--hh', `${r.h}px`);
      nav.classList.add('has-hl');
      if (first) { void hl.offsetWidth; hl.style.transition = ''; }
    };
    if (nav && hl) {
      nav.addEventListener('pointerover', (event) => { const el = event.target.closest(ROW); if (el && nav.contains(el)) place(el); });
      nav.addEventListener('pointerleave', () => nav.classList.remove('has-hl'));
      nav.addEventListener('focusin', (event) => { const el = event.target.closest(ROW); if (el) place(el); });
      nav.addEventListener('focusout', (event) => { if (!nav.contains(event.relatedTarget)) nav.classList.remove('has-hl'); });
    }
    parents.forEach((btn) => btn.addEventListener('click', () => {
      const wasOpen = btn.getAttribute('aria-expanded') === 'true';
      collapse();
      if (!wasOpen) {
        btn.setAttribute('aria-expanded', 'true');
        $('#' + btn.getAttribute('aria-controls')).hidden = false;
      }
      if (nav && nav.classList.contains('has-hl')) place(btn);   /* rows moved: follow the button */
    }));
    menuOpen.addEventListener('click', collapse);
    $$('a[href^="#"]', menu).forEach((a) => a.addEventListener('click', () => {
      menu.removeAttribute('data-open');
      menuOpen.setAttribute('aria-expanded', 'false');
      doc.style.overflow = '';
      menu.hidden = true;
    }));
    menuClose?.addEventListener('click', close);
    menu.addEventListener('click', (event) => { if (event.target === menu) close(); });
    document.addEventListener('keydown', (event) => {
      if (menu.hidden) return;
      if (event.key === 'Escape') close();
      if (event.key === 'Tab') {
        const f = focusables();
        const first = f[0], last = f[f.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---- pills: the fill grows from where the pointer came in; Join leans --- */
  if (fine) {
    $$('.pill').forEach((pill) => {
      pill.addEventListener('pointerenter', (event) => {
        const r = pill.getBoundingClientRect();
        pill.style.setProperty('--mx', `${((event.clientX - r.left) / r.width) * 100}%`);
        pill.style.setProperty('--my', `${((event.clientY - r.top) / r.height) * 100}%`);
      });
    });
    if (!reduce) $$('[data-magnet]').forEach((pill) => {
      pill.addEventListener('pointermove', (event) => {
        const r = pill.getBoundingClientRect();
        const dx = event.clientX - (r.left + r.width / 2);
        const dy = event.clientY - (r.top + r.height / 2);
        pill.style.transform = `translate(${dx * 0.16}px, ${dy * 0.3}px)`;
      });
      pill.addEventListener('pointerleave', () => { pill.style.transform = ''; });
    });
  }

  /* ---- the counter chip in the hero row ------------------------------------ */
  const chip = $('[data-chip]');
  if (chip && !reduce) {
    const facts = [['5', 'live demos'], ['180+', 'members'], ['5', 'days of Quantum Fall Fest']];
    const figure = $('[data-chip-figure]', chip);
    const label = $('[data-chip-label]', chip);
    let index = 0;
    setInterval(() => {
      if (document.hidden || scrollY > innerHeight) return;
      chip.classList.add('is-swapping');
      setTimeout(() => {
        index = (index + 1) % facts.length;
        [figure.textContent, label.textContent] = facts[index];
        chip.classList.add('is-entering');
        chip.classList.remove('is-swapping');
        void chip.offsetWidth;   /* commit the below-the-line state before rising */
        chip.classList.remove('is-entering');
      }, 320);
    }, 2800);
  }

  /* ---- Young's field and its screen ----------------------------------------
   * Two coherent sources. A is fixed; B leans toward the pointer without
   * chasing it: it goes under a third of the way, eases there over seconds
   * and never faster than a slow walk, so the colour shifts gently instead
   * of flickering. When the pointer leaves, B drifts home.
   * The field is coloured by phase, the mark's violet to the fluorescence
   * cyan, which is how complex amplitudes are drawn (a cyclic hue map), and
   * its alpha follows |psi|, so the nodal lines stay dark while the colour
   * flows outward. The screen shows |psi|^2 down one column: the fringes.
   * ------------------------------------------------------------------------- */
  const hero = $('[data-hero]');
  const fieldCanvas = $('[data-field]');
  const screenBox = $('[data-screen]');
  const screenCanvas = $('[data-screen-canvas]');
  if (hero && fieldCanvas && screenCanvas) {
    const SCALE = 6, FRAME_MS = 33, ROWS = 320;
    const PULL = 0.3, REACH = 0.16, SETTLE_S = 1.8, MAX_SPEED = 60, FLOW = 2.0;
    const lowPower = reduce || narrow() || (navigator.hardwareConcurrency || 8) <= 4
      || (navigator.connection && navigator.connection.saveData);
    const ctx = fieldCanvas.getContext('2d');
    const sctx = screenCanvas.getContext('2d');
    let W = 0, H = 0, w = 0, h = 0, img = null, colA = [75, 63, 148], colB = [47, 224, 230], alphaMax = 30;
    let screenX = 0, screenTop = 0, screenH = 0;
    const A = { x: 0, y: 0 }, B = { x: 0, y: 0 }, home = { x: 0, y: 0 }, target = { x: 0, y: 0 };
    const hex = (v) => { const n = parseInt(v.replace('#', ''), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };

    const readColours = () => {
      colA = hex(cssVar('--field-a') || '#4B3F94');
      colB = hex(cssVar('--field-b') || '#71AAB0');
      alphaMax = isDark() ? 22 : 30;
    };
    const size = () => {
      const r = hero.getBoundingClientRect();
      W = r.width; H = r.height;
      w = Math.max(2, Math.round(W / SCALE)); h = Math.max(2, Math.round(H / SCALE));
      fieldCanvas.width = w; fieldCanvas.height = h;
      img = ctx.createImageData(w, h);
      const s = screenBox.getBoundingClientRect();
      screenX = s.left - r.left + s.width / 2; screenTop = s.top - r.top; screenH = s.height;
      screenCanvas.width = 1; screenCanvas.height = ROWS;
      A.x = W * 0.06; A.y = H * 0.36;
      home.x = W * 0.06; home.y = H * 0.66;
      if (!target.moved) { target.x = home.x; target.y = home.y; B.x = home.x; B.y = home.y; }
    };
    const lambda = () => Math.max(26, W * 0.03);

    const amp = (x, y, t, k) => {
      const r1 = Math.hypot(x - A.x, y - A.y), r2 = Math.hypot(x - B.x, y - B.y);
      const a1 = 1 / Math.sqrt(r1 / 40 + 1), a2 = 1 / Math.sqrt(r2 / 40 + 1);
      const p1 = k * r1 - t, p2 = k * r2 - t;
      return [a1 * Math.cos(p1) + a2 * Math.cos(p2), a1 * Math.sin(p1) + a2 * Math.sin(p2)];
    };

    const draw = (now) => {
      const t = reduce ? 0 : now / 1000 * FLOW;
      const k = (2 * Math.PI) / lambda();
      const d = img.data;
      let i = 0;
      for (let py = 0; py < h; py++) {
        const y = (py + 0.5) * SCALE;
        for (let px = 0; px < w; px++) {
          const [re, im] = amp((px + 0.5) * SCALE, y, t, k);
          const mag = Math.sqrt(re * re + im * im);
          const mix = mag > 0 ? (1 + re / mag) / 2 : 0;
          d[i] = colA[0] + (colB[0] - colA[0]) * mix;
          d[i + 1] = colA[1] + (colB[1] - colA[1]) * mix;
          d[i + 2] = colA[2] + (colB[2] - colA[2]) * mix;
          d[i + 3] = clamp(mag * 1.15) * alphaMax;
          i += 4;
        }
      }
      ctx.putImageData(img, 0, 0);

      /* the screen: time-averaged intensity down one column, normalised */
      const rows = new Float32Array(ROWS);
      let max = 0;
      for (let r = 0; r < ROWS; r++) {
        const [re, im] = amp(screenX, screenTop + ((r + 0.5) / ROWS) * screenH, 0, k);
        rows[r] = re * re + im * im;
        if (rows[r] > max) max = rows[r];
      }
      sctx.clearRect(0, 0, 1, ROWS);
      const sc = cssVar('--signal-strong') || '#71AAB0';
      sctx.fillStyle = sc;
      for (let r = 0; r < ROWS; r++) {
        /* squared again so bright fringes read as bands, not a soft wash */
        sctx.globalAlpha = Math.pow(rows[r] / (max || 1), 3.2);
        sctx.fillRect(0, r, 1, 1);
      }
      sctx.globalAlpha = 1;
    };

    readColours(); size(); draw(performance.now());   /* first frame, synchronously */
    themeListeners.push(() => { readColours(); draw(performance.now()); });
    addEventListener('resize', () => { size(); draw(performance.now()); });

    if (!lowPower) {
      hero.classList.add('is-live');   /* the note under the screen is only true now */
      let visible = true, last = 0;
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(hero);
      /* the goal is a fraction of the way from home toward the pointer, and
         never more than REACH of the hero away from home */
      hero.addEventListener('pointermove', (event) => {
        const r = hero.getBoundingClientRect();
        const dx = (event.clientX - r.left - home.x) * PULL, dy = (event.clientY - r.top - home.y) * PULL;
        target.x = home.x + Math.max(-W * REACH, Math.min(W * REACH, dx));
        target.y = home.y + Math.max(-H * REACH, Math.min(H * REACH, dy));
        target.moved = true;
      });
      hero.addEventListener('pointerleave', () => { target.x = home.x; target.y = home.y; });
      const loop = (now) => {
        requestAnimationFrame(loop);
        if (!visible || document.hidden || now - last < FRAME_MS) return;
        const dt = Math.min(0.1, (now - (last || now)) / 1000);
        last = now;
        /* exponential approach over ~SETTLE_S seconds, capped at MAX_SPEED px/s */
        const f = 1 - Math.exp(-dt / SETTLE_S);
        let vx = (target.x - B.x) * f, vy = (target.y - B.y) * f;
        const step = Math.hypot(vx, vy), cap = MAX_SPEED * dt;
        if (step > cap) { vx *= cap / step; vy *= cap / step; }
        B.x += vx; B.y += vy;
        draw(now);
      };
      requestAnimationFrame(loop);
    }
  }

  /* ---- the thread, and the reel it opens -----------------------------------
   * The bright fringe is carried down the page by the scroll: a wave whose
   * swing dies away as it falls, until it lands as a single dot on the reel.
   * Keep scrolling and the dot opens into the frame. Measurement, in short.
   * ------------------------------------------------------------------------- */
  const thread = $('[data-thread]');
  const threadPath = $('[data-thread-path]');
  const reel = $('[data-reel]');
  const reelFrame = $('[data-reel-frame]');
  const reelCanvas = $('[data-reel-canvas]');
  const reelReadout = $('[data-reel-readout]');
  const Plots = window.QuestPlots;

  /* ---- the reel: every demo in turn, and always a note saying which ----
     Each plays for the length of its own loop; the active tab fills as its
     turn runs out. Pointer or focus on the reel holds the turn. A tab jumps
     straight to its demo. Under reduced motion the tabs switch still frames. */
  const REEL = [
    { key: 'grover', slug: 'grover', title: 'Grover search', station: 'Station one: amplitude amplification', secs: 7,
      caption: 'Each step pumps amplitude into the marked box, until you push past the optimum.' },
    { key: 'chsh', slug: 'bell', title: 'Bell / CHSH', station: 'Station two: correlation without a classical explanation', secs: 6.4,
      caption: 'The detectors turn and the score falls back through 2, the most any classical explanation allows.' },
    { key: 'sg', slug: 'stern-gerlach', title: 'Stern–Gerlach', station: 'Station three: measurement as a physical operation', secs: 5.2,
      caption: 'A magnet slides into the middle of the beam, and the spin-down atoms the first magnet blocked come back.' },
    { key: 'vqe', slug: 'vqe-h2', title: 'VQE on H₂', station: 'Station four: variational ground-state energy', secs: 6.4,
      caption: "The knob rocks through the minimum: the lowest point is the molecule's ground-state energy." },
    { key: 'itqpe', slug: 'h2-itqpe', title: 'H₂ by phase estimation', station: 'From the tutorial: information-theory phase estimation', secs: 9.5,
      caption: 'Shots arrive one bit at a time, and the peak narrows onto the energy as they add up.' },
  ];
  const reelTabs = $$('[data-reel-tab]');
  const reelTitle = $('[data-reel-title]'), reelStation = $('[data-reel-station]');
  const reelCaption = $('[data-reel-caption]'), reelLink = $('[data-reel-link]');
  let reelIndex = 0, reelElapsed = 0, reelHeld = false, reelSeen = false;
  const reelAnim = reelCanvas && Plots ? Plots.animate(reelCanvas, () => REEL[reelIndex].key, {
    quiet: true,   /* the block above the plot already says what it shows */
    onState: (s, sum) => { if (reelReadout) reelReadout.textContent = sum.text; },
  }) : null;
  const showReel = (i) => {
    reelIndex = (i + REEL.length) % REEL.length;
    reelElapsed = 0;
    const d = REEL[reelIndex];
    reelTitle.textContent = d.title;
    reelStation.textContent = d.station;
    reelCaption.textContent = d.caption;
    reelLink.href = reelFrame.href = `#/demo/${d.slug}`;
    reelFrame.setAttribute('aria-label', `Open the ${d.title} explorer`);
    reelTabs.forEach((t, k) => { t.setAttribute('aria-pressed', String(k === reelIndex)); t.style.setProperty('--t', '0'); });
    if (reduce && reelAnim) reelAnim.still(1.6);
  };
  if (reelAnim) {
    reelTabs.forEach((t, k) => t.addEventListener('click', () => showReel(k)));
    const reelBox = $('[data-reel]');
    reelBox.addEventListener('pointerenter', () => { reelHeld = true; });
    reelBox.addEventListener('pointerleave', () => { reelHeld = false; });
    reelBox.addEventListener('focusin', () => { reelHeld = true; });
    reelBox.addEventListener('focusout', () => { reelHeld = false; });
    new IntersectionObserver(([e]) => { reelSeen = e.isIntersecting; }).observe(reelFrame);
    showReel(0);
    if (reduce) reelAnim.still(1.6);
    else {
      reelAnim.play();
      let last = performance.now();
      const cycle = (now) => {
        requestAnimationFrame(cycle);
        const dt = (now - last) / 1000; last = now;
        if (!reelSeen || document.hidden || reelHeld) return;
        reelElapsed += dt;
        const d = REEL[reelIndex];
        reelTabs[reelIndex].style.setProperty('--t', Math.min(1, reelElapsed / d.secs).toFixed(3));
        if (reelElapsed >= d.secs) showReel(reelIndex + 1);
      };
      requestAnimationFrame(cycle);
    }
  }
  const main = $('#main');
  const young = $('.young');
  if (thread && threadPath && reel && screenBox && !reduce) {
    let S = null, E = null, stroke = 40, length = 0, endDoc = 0, startDoc = 0;
    const layout = () => {
      if (narrow()) { reel.removeAttribute('data-clip'); return; }
      reel.setAttribute('data-clip', '');
      const m = main.getBoundingClientRect();
      const s = screenBox.getBoundingClientRect();
      const v = reelFrame.getBoundingClientRect();
      const yb = young ? young.getBoundingClientRect().bottom - m.top : 0;
      stroke = s.width * 0.56;
      /* it leaves from the foot of the screen, so the fringes stay readable */
      S = { x: s.left - m.left + s.width / 2, y: s.bottom - m.top + stroke / 2 };
      E = { x: v.left - m.left + v.width / 2, y: v.top - m.top + stroke / 2 };
      const span = E.y - S.y;
      const cycles = span / (innerHeight * 0.95);
      const swing = Math.min(m.width * 0.075, 120);
      const cross = clamp((yb - S.y) / span, 0.5, 0.97);
      let d = '';
      for (let i = 0; i <= 220; i++) {
        const t = i / 220;
        const base = S.x + (E.x - S.x) * easeInOut(smooth(cross, 1, t));
        const x = base + swing * Math.pow(1 - t, 1.25) * Math.sin(2 * Math.PI * cycles * t);
        d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${(S.y + span * t).toFixed(1)}`;
      }
      thread.setAttribute('width', m.width);
      thread.setAttribute('height', E.y + stroke);
      thread.setAttribute('viewBox', `0 0 ${m.width} ${E.y + stroke}`);
      threadPath.setAttribute('d', d);
      threadPath.style.strokeWidth = stroke;
      length = threadPath.getTotalLength();
      threadPath.style.strokeDasharray = `${length} ${length}`;
      startDoc = S.y + m.top + scrollY;
      endDoc = E.y + m.top + scrollY;
      update();
    };
    const update = () => {
      if (narrow() || !S) return;
      /* undrawn at the top of the page; fully drawn when its end reaches 60%
         of the viewport, so the head runs just ahead of the reader's eye */
      const landAt = Math.max(1, endDoc - innerHeight * 0.6);
      const p = clamp(scrollY / landAt);
      threadPath.style.strokeDashoffset = String(length * (1 - p));
      /* once the head has landed, the dot opens into the frame */
      const q = easeInOut(clamp((scrollY - landAt) / (innerHeight * 0.38)));
      const r = reelFrame.getBoundingClientRect();
      const side = (r.width - stroke) / 2 * (1 - q);
      reel.style.setProperty('--cs', `${side}px`);
      reel.style.setProperty('--ct', '0px');
      reel.style.setProperty('--cb', `${(r.height - stroke) * (1 - q)}px`);
      reel.style.setProperty('--cr', `${stroke / 2 + (20 - stroke / 2) * q}px`);
      reel.style.setProperty('--ink-o', String(1 - smooth(0.15, 0.6, q)));
      /* the words arrive once the frame is open, never clipped by it */
      reel.classList.toggle('is-open', q > 0.995);
      thread.style.opacity = q > 0.98 ? '0' : '1';

    };
    onScroll.push(update);
    addEventListener('resize', layout);
    addEventListener('load', layout);
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(layout);
    if ('ResizeObserver' in window) new ResizeObserver(() => layout()).observe(main);
    layout();
  }

  /* ---- the lead inks in, word by word, as it is read ------------------------ */
  const lead = $('[data-ink]');
  if (lead) {
    const walker = document.createTreeWalker(lead, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        const span = document.createElement('span');
        span.className = 'w'; span.textContent = part;
        frag.appendChild(span);
      });
      node.replaceWith(frag);
    });
    const words = $$('.w', lead);
    let lastCount = -1;
    const ink = () => {
      const r = lead.getBoundingClientRect();
      const p = clamp((innerHeight * 0.88 - r.top) / (r.height + innerHeight * 0.38));
      const count = reduce ? words.length : Math.round(clamp(p * 1.12) * words.length);
      if (count === lastCount) return;
      lastCount = count;
      words.forEach((w, i) => w.classList.toggle('on', i < count));
    };
    onScroll.push(ink);
    ink();
  }

  /* ---- entrances, once ------------------------------------------------------ */
  const reveals = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ---- QuEST right now: the table reads the site's own content ------------- */
  const Q = window.QUEST;
  const nowBox = $('[data-now]');
  if (Q && nowBox) {
    const set = (key, n, unit = '') => {
      const a = $(`[data-now="${key}"]`, nowBox); if (!a) return;
      const c = $('[data-count]', a);
      if (c) { c.dataset.count = String(n); c.textContent = String(n); }
      if (unit && a.lastChild.nodeType === 3) a.lastChild.textContent = ` ${unit}`;
    };
    const people = Object.values(Q.people || {}).filter((p) => p.active !== false && p.department !== 'faculty' && p.user);
    const open = Object.values(Q.projects || {}).filter((p) => p.status === 'open').length;
    set('committee', people.length);
    set('open', open, open === 1 ? 'project' : 'projects');
    set('partners', Object.keys(Q.partners || {}).length);
    set('ours', Object.values(Q.resources || {}).filter((r) => r.source === 'quest').length, 'resources');
    const dd = (iso) => new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit', timeZone: 'Asia/Singapore' }).format(new Date(iso)).replace(/\//g, '.');
    const now = new Date();
    const events = Object.values(Q.events || {}).sort((a, b) => new Date(a.start) - new Date(b.start));
    const past = events.filter((e) => new Date(e.start) <= now).pop();
    const next = events.find((e) => e.status === 'upcoming' && new Date(e.start) > now);
    const last = $('[data-now="last"]', nowBox), nxt = $('[data-now="next"]', nowBox);
    if (past && last) { last.textContent = dd(past.start); last.href = `#/event/${past.id}`; last.setAttribute('aria-label', `Last session: ${past.title}, ${dd(past.start)}`); }
    if (next && nxt) { nxt.textContent = dd(next.start); nxt.href = `#/event/${next.id}`; nxt.removeAttribute('target'); nxt.setAttribute('aria-label', `Next session: ${next.title}, ${dd(next.start)}`); }
  }

  /* the story's highlighter, and the figures that count up once */
  const story = $('[data-story]');
  const counters = $$('[data-count]');
  if ('IntersectionObserver' in window && !reduce) {
    if (story) {
      const so = new IntersectionObserver(([e]) => { if (e.isIntersecting) { story.classList.add('is-in'); so.disconnect(); } }, { threshold: 0.35 });
      so.observe(story);
    }
    const co = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      co.unobserve(e.target);
      const el = e.target;
      const to = parseFloat(el.dataset.count), from = parseFloat(el.dataset.from || '0');
      const places = parseInt(el.dataset.places || '0', 10);
      const final = el.textContent;
      const t0 = performance.now(), dur = 1400;
      const step = (now) => {
        const k = clamp((now - t0) / dur);
        const v = from + (to - from) * (1 - Math.pow(1 - k, 3));
        el.textContent = k < 1 ? v.toFixed(places) : final;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }), { threshold: 0.6 });
    counters.forEach((el) => co.observe(el));
  } else if (story) {
    story.classList.add('is-in');
  }

  /* ---- the peek window over the demo list ---------------------------------- */
  const lab = $('[data-lab]');
  const list = $('[data-demo-list]');
  const peek = $('[data-peek]');
  if (fine && !reduce && lab && list && peek) {
    let peekName = 'grover';
    const peekAnim = Plots ? Plots.animate($('[data-peek-canvas]', peek), () => peekName, { compact: true }) : null;
    let x = 0, y = 0, tx = 0, ty = 0, lastX = 0, inside = false, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.14; y += (ty - y) * 0.14;
      const vx = x - lastX; lastX = x;
      peek.style.setProperty('--wx', `${x.toFixed(1)}px`);
      peek.style.setProperty('--wy', `${y.toFixed(1)}px`);
      peek.style.setProperty('--wr', `${clamp(vx * 0.35, -9, 9).toFixed(2)}deg`);
      peek.style.setProperty('--ws', inside ? '1' : '0.6');
      raf = inside || Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    const peekTitle = $('[data-peek-title]', peek);
    const show = (key, name) => { peekName = key; if (peekTitle) peekTitle.textContent = name; peekAnim && peekAnim.play(); };
    $$('[data-demo]', list).forEach((a) => a.addEventListener('pointerenter', () => show(a.dataset.demo, $('.demo-name', a).textContent)));
    list.addEventListener('pointermove', (event) => {
      const r = lab.getBoundingClientRect();
      tx = Math.min(event.clientX - r.left + 40, r.width - peek.offsetWidth * 0.7);
      ty = event.clientY - r.top - peek.offsetHeight / 2;
      if (!inside) { inside = true; x = tx; y = ty; lastX = x; lab.classList.add('has-peek'); }
      if (!raf) raf = requestAnimationFrame(loop);
    });
    list.addEventListener('pointerleave', () => {
      inside = false; lab.classList.remove('has-peek');
      peekAnim && peekAnim.stop();
    });
  }

  /* ---- the bubble over the shelf --------------------------------------------- */
  const bubble = $('[data-bubble]');
  if (fine && !reduce && bubble) {
    const label = $('[data-bubble-label]', bubble);
    let bx = -200, by = -200, tx = -200, ty = -200, on = false, raf = 0;
    const follow = () => {
      bx += (tx - bx) * 0.22; by += (ty - by) * 0.22;
      bubble.style.setProperty('--x', `${bx}px`);
      bubble.style.setProperty('--y', `${by}px`);
      raf = on || Math.abs(tx - bx) + Math.abs(ty - by) > 0.5 ? requestAnimationFrame(follow) : 0;
    };
    $$('[data-cursor]').forEach((el) => {
      el.addEventListener('pointerenter', (event) => {
        label.textContent = el.dataset.cursor; on = true;
        tx = bx = event.clientX; ty = by = event.clientY;
        bubble.style.setProperty('--s', '1');
        if (!raf) raf = requestAnimationFrame(follow);
      });
      el.addEventListener('pointermove', (event) => { tx = event.clientX; ty = event.clientY; });
      el.addEventListener('pointerleave', () => { on = false; bubble.style.setProperty('--s', '0'); });
    });
  }

  /* ---- the timeline: scroll down, travel through history -----------------
   * The section is made as tall as the track is wide, so the stage can stay
   * pinned while the vertical scroll slides the track left. The big year
   * follows the entry under the 22% line; when the club's era reaches the
   * middle of the view, the stage turns to the dark ground. A sideways swipe
   * on a trackpad moves through time too, and keyboard focus scrolls the
   * focused entry into view. On phones and under reduced motion it is a plain
   * horizontal scroller instead.
   * ------------------------------------------------------------------------- */
  const hist = $('[data-history]');
  if (hist) {
    const viewport = $('[data-history-viewport]', hist);
    const track = $('[data-history-track]', hist);
    const yearOut = $('[data-history-year]', hist);
    const bar = $('[data-history-bar]', hist);
    const club = $('[data-club-era]', hist);
    const entries = $$('.ev', hist);
    const SPEED = 1.35;          /* track pixels per pixel of scroll */
    let dist = 0, native = true, lastYear = '';

    const read = () => {
      const v = viewport.getBoundingClientRect();
      const probe = v.left + v.width * 0.22;
      let best = entries[0], gap = Infinity;
      for (const ev of entries) {
        const d = Math.abs(ev.getBoundingClientRect().left + 14 - probe);
        if (d < gap) { gap = d; best = ev; }
      }
      const label = $('.ev-year', best).textContent;
      if (label !== lastYear) { lastYear = label; yearOut.textContent = label; }
      const isClub = club.getBoundingClientRect().left < v.left + v.width * 0.5;
      if (isClub !== hist.classList.contains('is-club')) {
        hist.classList.toggle('is-club', isClub);
        /* the ground fades over 600ms; let the top row re-read it after */
        setTimeout(updateTop, 650);
      }
    };
    const update = () => {
      if (native) return;
      const r = hist.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(1, dist / SPEED));
      track.style.transform = `translate3d(${(-p * dist).toFixed(1)}px, 0, 0)`;
      bar.style.setProperty('--p', p.toFixed(4));
      hist.classList.toggle('is-moving', p > 0.03);
      read();
    };
    const layout = () => {
      native = reduce || narrow();
      hist.classList.toggle('is-native', native);
      if (native) { hist.style.height = ''; track.style.transform = ''; read(); return; }
      dist = Math.max(0, track.scrollWidth - viewport.clientWidth);
      hist.style.height = `${Math.round(innerHeight + dist / SPEED)}px`;
      update();
    };
    onScroll.push(update);
    viewport.addEventListener('scroll', () => {
      if (!native) return;
      bar.style.setProperty('--p', (viewport.scrollLeft / Math.max(1, viewport.scrollWidth - viewport.clientWidth)).toFixed(4));
      read();
    }, { passive: true });
    hist.addEventListener('wheel', (event) => {
      if (native || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      scrollBy({ top: event.deltaX / SPEED, behavior: 'instant' });
    }, { passive: false });
    track.addEventListener('focusin', (event) => {
      const item = event.target.closest('li');
      if (!item) return;
      if (native) { item.scrollIntoView({ inline: 'center', block: 'nearest' }); return; }
      const x = item.getBoundingClientRect().left - track.getBoundingClientRect().left;
      const p = clamp((x - viewport.clientWidth * 0.3) / Math.max(1, dist));
      scrollTo({ top: hist.getBoundingClientRect().top + scrollY + (p * dist) / SPEED, behavior: 'instant' });
    });
    addEventListener('resize', layout);
    addEventListener('load', layout);
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(layout);
    layout();
  }

  /* ---- marquee: drifts, and runs faster while the page is being scrolled --- */
  const marquee = $('[data-marquee]');
  const track = $('[data-marquee-track]');
  if (marquee && track && !reduce) {
    let offset = 0, vel = 0, lastY = scrollY, visible = false;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(marquee);
    const loop = () => {
      requestAnimationFrame(loop);
      const dy = scrollY - lastY; lastY = scrollY;
      vel = vel * 0.92 + Math.abs(dy) * 0.08;
      if (!visible || document.hidden) return;
      offset -= 0.6 + vel * 0.9;
      const half = track.scrollWidth / 2;
      if (-offset >= half) offset += half;
      track.style.transform = `translate3d(${offset.toFixed(1)}px, 0, 0)`;
    };
    requestAnimationFrame(loop);
  }

  /* ---- the ket in the footer leans toward the pointer ------------------------ */
  const foot = $('[data-foot]');
  const ket = $('[data-ket]');
  if (fine && !reduce && foot && ket) {
    let tx = 0, ty = 0, tr = 0, x = 0, y = 0, r = 0, vx = 0, vy = 0, vr = 0, raf = 0;
    const loop = () => {
      vx = (vx + (tx - x) * 0.08) * 0.82; vy = (vy + (ty - y) * 0.08) * 0.82; vr = (vr + (tr - r) * 0.08) * 0.8;
      x += vx; y += vy; r += vr;
      ket.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${r.toFixed(2)}deg)`;
      raf = Math.abs(vx) + Math.abs(vy) + Math.abs(vr) + Math.abs(tx - x) + Math.abs(tr - r) > 0.05 ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    foot.addEventListener('pointermove', (event) => {
      const b = ket.getBoundingClientRect();
      const dx = event.clientX - (b.left + b.width / 2 - x);
      const dy = event.clientY - (b.top + b.height / 2 - y);
      tx = clamp(dx * 0.12, -70, 70); ty = clamp(dy * 0.1, -44, 44); tr = clamp((dx / innerWidth) * 30, -16, 16);
      kick();
    });
    foot.addEventListener('pointerleave', () => { tx = ty = tr = 0; kick(); });
    foot.addEventListener('pointerdown', () => { vr += 9; vy -= 14; kick(); });
  }
})();
