/* ---------------------------------------------------------------------------
 * QuEST@EEE — every page, opened in place.
 *
 * In the prototype a click never leaves the page. A link like `#/demo/grover`
 * raises a sheet (the reference site's page-change curtain, used for real
 * here) and renders that page's content from window.QUEST, which
 * build-content.mjs makes from src/content. A link inside a sheet draws the
 * next page up over it like a letter from its envelope; the one beneath
 * steps back with its top edge showing. Back, Escape or "Back to …" puts the
 * top letter down; the cross closes them all.
 *
 * In the Astro build these become real routes with the same markup, and the
 * curtain becomes a cross-document View Transition (PLAN.md §6, §10).
 *
 * Routes:   #/demo/<slug>      the live explorer for one station
 *           #/project/<slug>   #/event/<slug>   #/resource/<slug>   #/news/<slug>
 *           #/page/<name>      what-we-do, research, culture, people, journey,
 *                              stack, resources, events, calendar, projects,
 *                              join, links, contact
 * Plain anchors (#demos, #work …) still scroll the page as usual.
 * ------------------------------------------------------------------------- */

(function (global) {
  'use strict';

  const Q = global.QUEST;
  const Plots = global.QuestPlots;
  const P = global.Physics;
  if (!Q || !Plots || !P) return;

  const doc = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const sorted = (o) => Object.values(o).sort((a, b) => (a.order ?? 50) - (b.order ?? 50));
  const date = (iso) => new Intl.DateTimeFormat('en-SG', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Singapore' }).format(new Date(iso));
  const time = (iso) => new Intl.DateTimeFormat('en-SG', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Singapore' }).format(new Date(iso));
  const mail = (user, domain, subject, text) => `<a href="#" data-mailto data-user="${esc(user)}" data-domain="${esc(domain)}" data-subject="${esc(subject)}">${esc(text)}</a>`;

  /* ---- the site's paths, mapped onto this page ------------------------------ */
  const PATHS = {
    '/': '#main', '/demos': '#demos', '/projects': '#/page/projects', '/events': '#/page/events', '/events/calendar': '#/page/calendar', '/calendar': '#/page/calendar', '/news': '#/page/calendar',
    '/research': '#/page/research', '/join': '#/page/join', '/join/roles': '#/page/join',
    '/links': '#/page/links', '/contact': '#/page/contact', '/explore': '#explore',
    '/explore/what-we-do': '#/page/what-we-do', '/explore/quantum-stack': '#/page/stack',
    '/explore/resources': '#/page/resources', '/about': '#story', '/about/journey': '#/page/journey',
    '/about/culture': '#/page/culture', '/about/people': '#/page/people', '/about/network': '#network',
  };
  function route(url) {
    if (!url) return null;
    if (/^(https?:|mailto:)/.test(url)) return url;
    let m;
    if ((m = url.match(/^\/demos\/([\w-]+)/))) return `#/demo/${m[1]}`;
    if ((m = url.match(/^\/projects\/([\w-]+)/))) return `#/project/${m[1]}`;
    if ((m = url.match(/^\/events\/([\w-]+)/)) && m[1] !== 'calendar') return `#/event/${m[1]}`;
    if ((m = url.match(/^\/news\/([\w-]+)/))) return `#/news/${m[1]}`;
    return PATHS[url.replace(/\/$/, '') || '/'] || null;
  }
  const external = (url) => /^https?:/.test(url);
  const linkTo = (url, text, cls = 'text-link') => {
    const to = route(url);
    if (!to) return `<span>${esc(text)}</span>`;
    return `<a class="${cls}" href="${esc(to)}"${external(to) ? ' target="_blank" rel="noopener"' : ''}>${esc(text)}${external(to) ? ' <span aria-hidden="true">↗</span><span class="visually-hidden"> (opens in a new tab)</span>' : ''}</a>`;
  };

  /* Markdown bodies were written for the real site: repoint their links. */
  function settle(root) {
    $$('a[href]', root).forEach((a) => {
      const href = a.getAttribute('href');
      if (href.startsWith('#') && !href.startsWith('#/') && href.length > 1 && !$(href)) { a.replaceWith(...a.childNodes); return; }
      if (href.startsWith('/')) {
        const to = route(href);
        if (to) a.setAttribute('href', to); else a.replaceWith(...a.childNodes);
      } else if (external(href)) { a.target = '_blank'; a.rel = 'noopener'; }
    });
    $$('[data-mailto]', root).forEach((a) => {
      const { user, domain, subject } = a.dataset;
      a.href = `mailto:${user}@${domain}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
    });
  }

  /* A picture is never drawn wider than two thirds of its own pixels
     (--natural / 1.5), so a small file stays sharp instead of being enlarged. */
  const img = (m, sizes) => `<img src="${m.src}"${m.small !== m.src ? ` srcset="${m.small} 640w, ${m.src} ${m.width}w" sizes="${sizes}"` : ''} width="${m.width}" height="${m.height}" alt="${esc(m.alt)}" loading="lazy" decoding="async">`;
  const figure = (id, cls = '') => {
    const m = Q.media[id];
    if (!m) return '';
    return `<figure class="sheet-figure ${cls}" style="--natural:${m.width}px">${img(m, '(max-width: 720px) 100vw, 60vw')}<figcaption>${esc(m.caption || m.alt)}${m.credit ? ` <span>${m.usage === 'illustration' ? 'Figure' : 'Photo'}: ${esc(m.credit)}</span>` : ''}</figcaption></figure>`;
  };
  /* Two small pictures side by side rather than one enlarged. */
  const pair = (a, b) => `<div class="sheet-pair">${figure(a)}${figure(b)}</div>`;
  const thumb = (id) => {
    const m = Q.media[id];
    return m ? `<img class="row-thumb" src="${m.small}" width="${m.width}" height="${m.height}" alt="" loading="lazy" decoding="async">` : '';
  };

  /* Calendar days are Singapore days, whatever the visitor's clock says. */
  const SGT = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Singapore', year: 'numeric', month: '2-digit', day: '2-digit' });
  const dayKey = (d) => SGT.format(d);
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const isUpcoming = (e) => e.status === 'upcoming' && new Date(e.start) > new Date();
  const eventRow = (e) => {
    const ph = (e.photos || []).find((id) => Q.media[id]);
    return `<li><a href="#/event/${e.id}"${ph ? ' class="has-thumb"' : ''}>${ph ? thumb(ph) : ''}<strong>${esc(e.title)}</strong><span class="row-meta"><span>${date(e.start)}${e.end && dayKey(new Date(e.end)) !== dayKey(new Date(e.start)) ? ` to ${date(e.end)}` : ''}</span><span>${esc(e.venue)}</span></span></a></li>`;
  };

  const facts = (rows) => `<dl class="facts">${rows.filter(([, v]) => v).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('')}</dl>`;

  /* ======================================================================
     Pages
     ====================================================================== */

  const DEMO_STATION = { grover: 'grover', bell: 'chsh', 'stern-gerlach': 'sg', 'vqe-h2': 'vqe', 'h2-itqpe': 'itqpe' };

  /* The fifth demo is not a booth station, so it is not in src/content/demos.
     Its words are condensed from the tutorial's README and section 9 of its
     notebooks (Guppy testing/Q_propraming_tut); its numbers come from
     plots.js, which re-runs the notebook's method. */
  const TUTORIAL = {
    'h2-itqpe': {
      title: 'H₂ by information-theory phase estimation',
      crumb: 'Demo from the Qiskit and Guppy tutorial',
      hook: 'Each shot returns one bit. Two thousand of them, put through classical statistics, give the ground-state energy of a hydrogen molecule.',
      concept: 'A circuit whose output only means something after post-processing',
      html: `<p>Textbook phase estimation makes the circuit do the work: many helper qubits, a long chain of controlled gates and an inverse Fourier transform. This version keeps the circuit tiny, one helper qubit running a Hadamard test of U applied k times, and moves the work into statistics. One bit says almost nothing about the energy; a couple of thousand bits, collected at many different k, pin it down.</p>
        <p>For every candidate energy we ask how likely the recorded bits would be if that were the true value. That score is the likelihood Q; its logarithm, log Q, is plotted above. The highest point is the estimate and the width of the peak is the error bar.</p>`,
      steps: [
        ['Start', 'The molecule\'s qubit begins in the Hartree–Fock state |1⟩, a cheap classical guess that is about 98% ground state.'],
        ['Superpose', 'The helper qubit is put into |+⟩.'],
        ['Evolve', 'Controlled-U is applied k times, with U one Trotter step of the time evolution: four CNOTs and four rotations each.'],
        ['Shift', 'A phase Rz(β) on the helper, with β either 0 or π/2.'],
        ['Read', 'Measure the helper in the X basis: one bit.'],
      ],
      why: [
        ['The circuit\'s own target', 'One Trotter step and a 5-bit rounded angle, both from the paper, move the energy this circuit encodes to about −1.1403 Ha, 2.9 mHa below the exact value.'],
        ['The input state', 'Hartree–Fock is 98% ground state; the rest pulls single runs a few millihartree lower, with a run-to-run spread of about 6 mHa.'],
        ['Shot noise', 'About 2000 shots with k up to 12 gives roughly ±0.005 Ha on a perfect simulator. On the real machine noise cost information in every shot: the paper reports ±0.013 Ha.'],
      ],
      references: [
        { citation: 'K. Yamamoto et al., "Quantum error-corrected computation of molecular energies", PRX Quantum 7, 020319 (2026)' },
        { citation: 'Section 9 of the Qiskit and Guppy tutorial notebooks, which this demo re-runs' },
      ],
    },
  };

  /* The two-qubit circuit, drawn in the page's colours (circuit (3) of the paper). */
  const CIRCUIT = `<figure class="circuit" data-ui>
    <svg viewBox="0 0 640 150" role="img" aria-label="Circuit: the helper qubit gets H, controls U applied k times on the molecule qubit, then Rz of beta, H and a measurement. The molecule qubit starts with X to make the Hartree-Fock state.">
      <!-- quantum wires end at the measurement; after it the bit is classical: a double line -->
      <g class="c-wire"><path d="M70 45 H470" /><path d="M70 110 H526" /><path d="M526 42 H556 M526 48 H556" /></g>
      <text class="c-lbl" x="8" y="50">helper</text><text class="c-lbl" x="8" y="115">H₂</text>
      <g class="c-gate"><rect x="96" y="27" width="40" height="36" rx="6" /><text x="116" y="51">H</text></g>
      <g class="c-gate"><rect x="96" y="92" width="40" height="36" rx="6" /><text x="116" y="116">X</text></g>
      <path class="c-ctl" d="M205 45 V92" /><circle class="c-dot" cx="205" cy="45" r="6" />
      <g class="c-gate c-u"><rect x="170" y="92" width="70" height="36" rx="6" /><text x="205" y="116">U</text></g>
      <text class="c-k" x="248" y="98">× k</text>
      <g class="c-gate"><rect x="300" y="27" width="70" height="36" rx="6" /><text x="335" y="51">Rz(β)</text></g>
      <g class="c-gate"><rect x="400" y="27" width="40" height="36" rx="6" /><text x="420" y="51">H</text></g>
      <g class="c-gate"><rect x="470" y="25" width="56" height="40" rx="6" /><path class="c-meter" d="M482 54 A16 16 0 0 1 514 54 M498 54 L510 36" /></g>
      <text class="c-lbl" x="566" y="50">one bit</text>
    </svg>
    <figcaption>One shot. Repeat ten times at each of 219 random settings of k (1 to 12) and β (0 or π/2).</figcaption>
  </figure>`;
  /* The booth has no photographs of its own yet, so its page shows its four
     screens, running live. The MLDA programme's cover is a 465-pixel plot, so
     it is shown beside the programme's other figure rather than enlarged. */
  const BOOTH = 'qfest-booth';
  const BOARD = [['grover', 'grover', 'Grover search'], ['bell', 'chsh', 'Bell / CHSH'], ['stern-gerlach', 'sg', 'Stern–Gerlach'], ['vqe-h2', 'vqe', 'VQE on H₂']];
  const board = () => `<figure class="board"><ul>${BOARD.map(([slug, key, name]) => `<li><a href="#/demo/${slug}"><canvas data-board-canvas="${key}" aria-hidden="true"></canvas><span>${esc(name)}</span></a></li>`).join('')}</ul>
    <figcaption>The booth's four screens, running live. Open one to steer it.</figcaption></figure>`;
  const mountBoard = (root) => {
    /* the screens rest while another letter lies on top of this one */
    const panel = root.closest('.sheet-panel');
    const active = () => !panel || !panel.dataset.under;
    const anims = $$('[data-board-canvas]', root).map((c) => {
      const a = Plots.animate(c, c.dataset.boardCanvas, { compact: true, quiet: true, active });
      if (reduce) a.still(2); else a.play();
      return a;
    });
    return () => anims.forEach((a) => a.stop());
  };
  const COVER_WITH = { 'mlda-quantum-ml': 'vqe-loop' };

  const AREA = { algorithms: 'Algorithms', software: 'Software', research: 'Research', hardware: 'Hardware', photonics: 'Photonics', security: 'Security' };
  const STATUS = { open: 'Open to new members', active: 'Running', completed: 'Completed', paused: 'Paused' };

  const VIEWS = {
    demo(id) {
      if (TUTORIAL[id]) return tutorialDemo(id);
      const d = Q.demos[id];
      if (!d || !DEMO_STATION[id]) return null;
      return {
        crumb: `Demo: booth station ${['one', 'two', 'three', 'four'][d.station - 1]}`,
        title: d.title, name: d.title,
        body: `
          <p class="sheet-lede">${esc(d.hook)}</p>
          <div class="explorer" data-explorer="${DEMO_STATION[id]}">
            <p class="x-readout" aria-live="polite" data-readout></p>
            <canvas class="x-canvas" data-canvas role="img" aria-label="${esc(d.title)}, live"></canvas>
            <div class="x-controls" data-controls></div>
          </div>
          <div class="sheet-cols">
            <div>
              <h3>What it shows</h3>
              <p><strong>${esc(d.concept)}.</strong></p>
              ${d.html}
            </div>
            <div>
              <h3>Knobs at the booth</h3>
              <ul class="plain">${(d.knobs || []).map((k) => `<li><strong>${esc(k.label)}</strong>: ${esc(k.range)}</li>`).join('')}</ul>
              <h3>References</h3>
              <ul class="plain refs">${(d.references || []).map((r) => `<li>${r.url ? linkTo(r.url, r.citation) : esc(r.citation)}</li>`).join('')}</ul>
            </div>
          </div>
          <p class="sheet-next">Every number on this screen comes from <code>physics.js</code>, the file the booth's test suite checks against the original papers.</p>`,
        mount: (root) => mountExplorer($('[data-explorer]', root), DEMO_STATION[id]),
      };
    },

    project(id) {
      const p = Q.projects[id];
      if (!p) return null;
      return {
        crumb: `${AREA[p.area] || p.area} project`,
        title: p.title, name: 'the project',
        body: `
          <p class="sheet-lede">${esc(p.summary)}</p>
          ${facts([['Status', esc(STATUS[p.status] || p.status)], ['Level', esc(p.difficulty)], ['Started', esc(p.started)], ['Team', esc((p.team || []).join(', '))], ['Mentors', esc((p.mentors || []).join(', '))]])}
          ${p.cover ? (COVER_WITH[id] ? pair(p.cover, COVER_WITH[id]) : figure(p.cover)) : id === BOOTH ? board() : ''}
          <div class="prose">${p.html}</div>
          ${(p.outputs || []).length ? `<h3>Outputs</h3><ul class="plain">${p.outputs.map((o) => `<li>${linkTo(o.url, o.label)}</li>`).join('')}</ul>` : ''}
          ${p.status === 'open' ? `<p class="sheet-cta"><a class="pill pill-ink" href="#/page/join"><span class="pill-label">How to join a project</span><span class="pill-disc" aria-hidden="true">${ARROW}</span></a></p>` : ''}`,
        mount: id === BOOTH ? mountBoard : null,
      };
    },

    event(id) {
      const e = Q.events[id];
      if (!e) return null;
      const upcoming = isUpcoming(e);
      const photos = (e.photos || []).filter((ph) => Q.media[ph]);
      const [lead, ...rest] = photos;
      return {
        crumb: `${upcoming ? 'Upcoming' : 'Past'} event`,
        title: e.title, name: e.title,
        body: `
          <p class="sheet-lede">${date(e.start)}${e.end && date(e.end) !== date(e.start) ? ` to ${date(e.end)}` : `, ${time(e.start)}${e.end ? `–${time(e.end)}` : ''}`}<br>${esc(e.venue)}</p>
          ${lead ? figure(lead, 'sheet-lead') : ''}
          ${facts([['Format', esc(e.format)], ['Who it is for', esc(e.audience)], ['Speaker', esc(e.speaker)], ['With', esc((e.collaborators || []).join(', '))], ['Attendance', e.attendance ? esc(String(e.attendance)) : '']])}
          ${(e.learningOutcomes || []).length ? `<h3>What you leave with</h3><ul class="ticks">${e.learningOutcomes.map((o) => `<li>${esc(o)}</li>`).join('')}</ul>` : ''}
          <div class="prose">${e.html}</div>
          ${rest.length ? `<h3>${rest.length === 1 ? 'Another picture' : 'More pictures'} from the day${e.end && date(e.end) !== date(e.start) ? 's' : ''}</h3><div class="sheet-gallery">${rest.map((ph) => figure(ph)).join('')}</div>` : ''}
          ${upcoming && e.registerUrl ? `<p class="sheet-cta">${linkTo(e.registerUrl, 'Register')}</p>` : ''}
          <p class="sheet-next"><a class="text-link" href="#/page/calendar">See it on the calendar</a></p>`,
      };
    },

    resource(id) {
      const r = Q.resources[id];
      if (!r) return null;
      const TYPE = { notebook: 'Notebook', paper: 'Paper', slides: 'Slides', demo: 'Demo', tool: 'Tool' };
      const TRACK = { nothing: 'Starting from nothing', code: 'Code', physics: 'Physics', build: 'Build' };
      /* Published research is never presented as ours: it is labelled as the
         authors' work, on our reading list, in the crumb, the facts and a line
         of its own. */
      const published = r.source !== 'quest';
      return {
        crumb: published ? 'Reading list: published research by others' : `${TYPE[r.type] || 'Resource'} made by QuEST@EEE, ${TRACK[r.track] || r.track} track`,
        title: r.title, name: published ? 'the paper' : 'the resource',
        body: `
          <p class="sheet-lede">${esc(r.why)}</p>
          ${published ? '<p class="attribution">Written and published by its authors. It is on our reading list because one of our demos is built on it; it is not QuEST@EEE\'s work.</p>' : ''}
          ${facts([['Time it takes', esc(r.estimatedTime)], ['Whose it is', published ? 'Its authors: published research' : 'QuEST@EEE']])}
          <div class="prose">${r.html}</div>
          <p class="sheet-cta">${linkTo(r.url, r.type === 'paper' ? 'Read the paper' : 'Open it')}</p>
          <p><a class="text-link" href="#/page/resources">Every track</a></p>`,
      };
    },

    news(id) {
      const n = (Q.news || {})[id];
      if (!n) return null;
      const ev = n.event && Q.events[n.event];
      const pr = n.project && Q.projects[n.project];
      return {
        crumb: 'News', title: n.title, name: 'the news',
        body: `
          <p class="sheet-lede">${esc(n.summary)}</p>
          <p class="news-when">Posted ${date(n.date)}</p>
          ${n.image ? figure(n.image, 'sheet-lead') : ''}
          <div class="prose">${n.html}</div>
          ${ev ? `<p class="sheet-cta"><a class="pill pill-ink" href="#/event/${ev.id}"><span class="pill-label">${isUpcoming(ev) ? 'The event, and how to come' : 'The event, with all its photos'}</span><span class="pill-disc" aria-hidden="true">${ARROW}</span></a></p>` : ''}
          ${pr ? `<p class="sheet-cta"><a class="pill pill-ink" href="#/project/${pr.id}"><span class="pill-label">${pr.status === 'open' ? 'The project, and how to join it' : 'About the project'}</span><span class="pill-disc" aria-hidden="true">${ARROW}</span></a></p>` : ''}
          <p class="sheet-next"><a class="text-link" href="#/page/calendar">All the news, and the calendar</a></p>`,
      };
    },

    page(name) { return PAGES[name] ? PAGES[name]() : null; },
  };

  const ARROW = '<svg viewBox="0 0 24 24" width="16" height="16"><path d="M7 17 17 7M9 7h8v8" /></svg>';

  function tutorialDemo(id) {
    const d = TUTORIAL[id];
    const q = Plots.STATIONS.itqpe;
    return {
      crumb: d.crumb, title: d.title, name: 'the demo',
      body: `
        <p class="sheet-lede">${esc(d.hook)}</p>
        <div class="explorer" data-explorer="itqpe">
          <p class="x-readout" aria-live="polite" data-readout></p>
          <canvas class="x-canvas x-canvas-tall" data-canvas role="img" aria-label="Log Q against candidate energy for H₂, live"></canvas>
          <div class="x-controls" data-controls></div>
        </div>
        ${facts([
          ['Exact (full CI)', `${q.exact.toFixed(4)} Ha`],
          ["This circuit's target", `${q.target.toFixed(4)} Ha`],
          ['Paper, Quantinuum H2-2, error-corrected', `${q.paper.E.toFixed(3)} ± ${q.paper.err.toFixed(3)} Ha`],
          ['Chemical accuracy', '1.6 mHa'],
        ])}
        <div class="sheet-cols">
          <div><h3>What it shows</h3><p><strong>${esc(d.concept)}.</strong></p>${d.html}</div>
          <div><h3>One shot, step by step</h3><ol class="ladder">${d.steps.map(([a, b]) => `<li><strong>${esc(a)}</strong><span>${esc(b)}</span></li>`).join('')}</ol></div>
        </div>
        ${CIRCUIT}
        <h3>Why it does not land exactly on −1.1373</h3>
        <ul class="rows rows-static">${d.why.map(([a, b]) => `<li><div><strong>${esc(a)}</strong><span>${esc(b)}</span></div></li>`).join('')}</ul>
        <h3>References</h3>
        <ul class="plain refs">${d.references.map((r) => `<li>${esc(r.citation)}</li>`).join('')}</ul>
        <p class="sheet-next">The Hamiltonian, the circuit's angles, the settings and the log Q formula are the notebook's. With one system qubit the circuit is simulated exactly, with 2 × 2 matrices, in your browser.</p>`,
      mount: (root) => mountExplorer($('[data-explorer]', root), 'itqpe'),
    };
  }

  const PAGES = {
    'what-we-do': () => ({
      crumb: 'Explore', title: 'What we actually do', name: 'What we do',
      body: `<p class="sheet-lede">Four things, running at the same time. You are not required to do all of them, and most people start with one.</p>
        ${Q.pages.BLOCKS.map((b) => `<article class="block">${figure(b.photo)}<div><h3>${esc(b.title)}</h3><p>${esc(b.body)}</p><p>${linkTo(b.link.href, b.link.label)}</p></div></article>`).join('')}`,
    }),

    research: () => {
      const initiatives = sorted(Q.projects).filter((p) => ['research', 'algorithms'].includes(p.area));
      return {
        crumb: 'Research', title: 'From curious to a result somebody else can use', name: 'Research',
        body: `<p class="sheet-lede">Undergraduate research fails for one of two reasons: nobody says what the process is, or nobody checks in until the deadline. This is our answer to both.</p>
          <h3>The ladder</h3><p>Six rungs. You can enter at any of them.</p>
          <ol class="ladder">${Q.pages.LADDER.map((r) => `<li><strong>${esc(r.name)}</strong><span>${esc(r.what)}</span></li>`).join('')}</ol>
          <h3>How an initiative runs</h3><p>Weekly check-ins, monthly reports. Six stages, in this order.</p>
          <ol class="ladder">${Q.pages.PROCESS.map((s) => `<li><strong>${esc(s.step)}</strong><span>${esc(s.what)}</span></li>`).join('')}</ol>
          <h3>Current initiatives</h3>
          <ul class="rows">${initiatives.map((p) => `<li><a href="#/project/${p.id}"><strong>${esc(p.title)}</strong><span>${esc(p.summary)}</span></a></li>`).join('')}</ul>
          <h3>Mentorship and URECA</h3>
          <p>Members interested in taking a project into a URECA or a final-year project should write to the President, who will route it. The club is not a substitute for a supervisor, but it is a reasonable way to find one.</p>
          <p>${mail('TISORN001', 'e.ntu.edu.sg', 'QuEST@EEE — research and mentorship', 'Email the President')}</p>`,
      };
    },

    culture: () => ({
      crumb: 'About', title: 'What we believe', name: 'What we believe',
      body: `<p class="sheet-lede">A club's culture is whatever it actually rewards. These are the five things we try to reward.</p>
        <blockquote class="sheet-quote">You don't have to know what you want to become. You just have to be willing to explore.</blockquote>
        <ol class="ladder">${Q.pages.BELIEFS.map((b) => `<li><strong>${esc(b.title)}</strong><span>${esc(b.body)}</span></li>`).join('')}</ol>
        ${figure('entanglement-notes')}`,
    }),

    people: () => {
      const DEPT = { faculty: 'Faculty advisor', exco: 'Executive Committee', academics: 'Academics', 'projects-research': 'Projects & Research', 'business-outreach': 'Business & Outreach', publicity: 'Publicity', operations: 'Operations' };
      const groups = {};
      sorted(Q.people).filter((p) => p.active !== false).forEach((p) => { (groups[p.department] ||= []).push(p); });
      const initials = (name) => name.replace(/^Prof\.\s*/, '').split(/\s+/).map((w) => w[0]).slice(0, 2).join('');
      return {
        crumb: 'About', title: 'The people', name: 'The people',
        body: `<p class="sheet-lede">The committee that runs QuEST@EEE this year. Every address reaches a person.</p>
          ${Object.keys(DEPT).filter((k) => groups[k]).map((k) => `<h3>${DEPT[k]}</h3><ul class="people">${groups[k].map((p) => {
            const vacant = !p.user && p.department === 'operations';
            const face = p.photo && Q.media[p.photo]
              ? `<img src="${Q.media[p.photo].small}" alt="${esc(Q.media[p.photo].alt)}" width="96" height="96" loading="lazy">`
              : `<span class="mono-tile" aria-hidden="true">${esc(vacant ? '?' : initials(p.name))}</span>`;
            return `<li>${face}<div><strong>${esc(vacant ? 'Open position' : p.name)}${p.preferredName ? ` <span>(${esc(p.preferredName)})</span>` : ''}</strong><span>${esc(p.role)}</span>${p.user ? mail(p.user, p.domain, 'Hello from the website', 'Email') : vacant ? mail('TISORN001', 'e.ntu.edu.sg', 'Operations Lead', 'Interested? Write to the President') : ''}</div></li>`;
          }).join('')}</ul>`).join('')}
          ${figure('team-garden')}`,
      };
    },

    journey: () => ({
      crumb: 'About', title: 'How we got here', name: 'Our journey',
      body: `<ol class="timeline">${sorted(Q.milestones).map((m) => `<li><p class="tl-year">${esc(m.year)}</p><div><h3>${esc(m.title)}</h3><p>${esc(m.blurb)}</p>${(m.links || []).map((l) => `<p>${linkTo(l.url, l.label)}</p>`).join('')}</div>${m.photo ? figure(m.photo, m.photo === 'qcc-mark' ? 'tl-photo tl-mark' : 'tl-photo') : ''}</li>`).join('')}</ol>`,
    }),

    stack: () => {
      const BR = [['software', 'Software', 'What you write'], ['physics', 'Physics', 'What is actually happening'], ['hardware', 'Hardware', 'What it runs on'], ['applications', 'Applications', 'What it is for']];
      const all = sorted(Q.stack);
      return {
        crumb: 'Explore', title: 'The Quantum Stack', name: 'The Quantum Stack',
        body: `<p class="sheet-lede">Software, physics and hardware each answer a different question about the same machine. Most people arrive wanting one of them and discover they wanted another.</p>
          <div class="stack">${BR.map(([key, name, q]) => `<section><h3>${name}</h3><p class="stack-q">${q}</p><ul>${all.filter((n) => n.branch === key).map((n) => `<li><strong>${esc(n.title)}</strong><span>${esc(n.summary)}</span></li>`).join('')}</ul></section>`).join('')}</div>`,
      };
    },

    resources: () => {
      const TR = [['nothing', 'Starting from nothing'], ['code', 'Code'], ['physics', 'Physics'], ['build', 'Build']];
      const all = sorted(Q.resources);
      return {
        crumb: 'Explore', title: 'Four tracks, with real times', name: 'Resources',
        body: `<p class="sheet-lede">Every resource we have, in the order we would hand it to you, with how long it really takes.</p>
          <div class="slips">${TR.map(([key, name]) => {
            const items = all.filter((r) => r.track === key);
            return `<section class="slip slip-small"><p class="slip-title">${name}</p><ul>${items.map((r) => `<li><a href="#/resource/${r.id}">${esc(r.title)}</a><i aria-hidden="true"></i><span>${esc(r.estimatedTime)}</span></li>`).join('')}</ul></section>`;
          }).join('')}</div>`,
      };
    },

    events: () => {
      const now = new Date();
      const all = sorted(Q.events).sort((a, b) => new Date(b.start) - new Date(a.start));
      const up = all.filter((e) => e.status === 'upcoming' && new Date(e.start) > now);
      const past = all.filter((e) => !up.includes(e));
      return {
        crumb: 'Events', title: up.length ? "What's on" : 'Events', name: 'Events',
        body: `${up.length ? `<h3>Upcoming</h3><ul class="rows">${up.map(eventRow).join('')}</ul>` : `<p class="sheet-lede">Nothing is scheduled right now. New sessions are announced first in the ${linkTo(Q.links.telegram.url, 'Telegram community')}.</p>`}
          <p><a class="pill pill-ink" href="#/page/calendar"><span class="pill-label">Open the calendar</span><span class="pill-disc" aria-hidden="true">${ARROW}</span></a></p>
          <h3>The archive</h3><ul class="rows">${past.map(eventRow).join('')}</ul>`,
      };
    },

    calendar: () => {
      const events = Object.values(Q.events).filter((e) => e.status !== 'cancelled').sort((a, b) => new Date(a.start) - new Date(b.start));
      const up = events.filter(isUpcoming);
      const past = events.filter((e) => !isUpcoming(e)).reverse();
      const posts = Object.values(Q.news || {}).sort((a, b) => (b.pinned === true) - (a.pinned === true) || new Date(b.date) - new Date(a.date));
      const promo = up[0];
      const card = (n) => {
        const m = n.image && Q.media[n.image];
        return `<li><a class="news-card${m ? ' has-pic' : ''}" href="#/news/${n.id}">${m ? `<img src="${m.small}" width="${m.width}" height="${m.height}" alt="" loading="lazy" decoding="async">` : ''}<span class="news-body"><span class="news-date">${date(n.date)}${n.pinned ? ', pinned' : ''}</span><strong>${esc(n.title)}</strong><span class="news-sum">${esc(n.summary)}</span></span></a></li>`;
      };
      return {
        crumb: 'Events', title: 'The calendar', name: 'Calendar',
        body: `<p class="sheet-lede">Every session we have run, and the next ones as they are announced. Pick an event to read about it and see the pictures.</p>
          <h3 class="news-head">News</h3>
          ${promo ? `<a class="news-next" href="#/event/${promo.id}"><span class="news-date">Next session, ${date(promo.start)}</span><strong>${esc(promo.title)}</strong><span>${esc(promo.venue)}</span></a>` : ''}
          ${posts.length ? `<ul class="news">${posts.map(card).join('')}</ul>` : '<p>No news yet.</p>'}
          <h3>The month</h3>
          <div class="cal" data-cal></div>
          <h3>Coming up</h3>
          ${up.length ? `<ul class="rows">${up.map(eventRow).join('')}</ul>` : `<p>Nothing is scheduled yet. New sessions are announced first in the ${linkTo(Q.links.telegram.url, 'Telegram community')}.</p>`}
          <h3>Every past event</h3>
          <ul class="rows">${past.map(eventRow).join('')}</ul>`,
        mount: (root) => mountCalendar($('[data-cal]', root), events),
      };
    },

    projects: () => ({
      crumb: 'Projects', title: 'Work with a name on it', name: 'Projects',
      body: `<p class="sheet-lede">Every project has a deliverable at the end of it. Open ones take new members.</p>
        <ul class="rows">${sorted(Q.projects).map((p) => {
          const ph = p.cover && Q.media[p.cover] ? p.cover : null;
          return `<li><a href="#/project/${p.id}"${ph ? ' class="has-thumb"' : ''}>${ph ? thumb(ph) : ''}<strong>${esc(p.title)}</strong><span>${esc(STATUS[p.status])}. ${esc(p.summary)}</span></a></li>`;
        }).join('')}</ul>`,
    }),

    join: () => {
      const L = Q.links;
      const live = (l) => l && l.live !== false && (!l.expiresOn || new Date(l.expiresOn) > new Date());
      const open = sorted(Q.projects).filter((p) => p.status === 'open');
      return {
        crumb: 'Join', title: 'Four doors. Pick the one that sounds like you.', name: 'Join',
        body: `<p class="sheet-lede">Not knowing anything is a fine place to start; most of us did. Not knowing which door is also fine: take the first one.</p>
          <ul class="doors">
            <li><h3>I want to learn</h3><p>Join the Telegram group and come to a session. No form, no commitment, no prerequisite.</p><p>${linkTo(L.telegram.url, 'Join the group')}</p></li>
            <li><h3>I want to build</h3><p>${open.length ? `There ${open.length === 1 ? 'is' : 'are'} ${open.length} project${open.length === 1 ? '' : 's'} open to new members right now.` : 'Projects open to new members are listed as they open.'} Read what the work is, then write to the lead named on it.</p><p><a class="text-link" href="#/page/projects">Projects open to join</a></p></li>
            <li><h3>I want to research</h3><p>Mentored initiatives, URECA supervision, and the route from a literature review to an output. Write to the President with what you are interested in.</p><p>${mail('TISORN001', 'e.ntu.edu.sg', 'QuEST@EEE — research', 'Email the President')}</p></li>
            <li><h3>I want to contribute</h3><p>Run the workshops, shoot the posters, keep the site alive. Sub-committee recruitment opens each cycle; the form is live while a cycle is running.</p><p>${live(L.recruitment) ? linkTo(L.recruitment.url, 'Sub-committee recruitment form') : 'Recruitment is closed right now.'}</p></li>
          </ul>`,
      };
    },

    links: () => ({
      crumb: 'Links', title: 'Everything in one place', name: 'Links',
      body: `<ul class="rows">${sorted(Q.links).filter((l) => l.live !== false).map((l) => {
        const to = l.url.startsWith('mailto:') ? null : route(l.url);
        return `<li>${to
          ? `<a href="${esc(to)}"${external(to) ? ' target="_blank" rel="noopener"' : ''}><strong>${esc(l.label)}${external(to) ? ' <span aria-hidden="true">↗</span>' : ''}</strong><span>${esc(l.description || '')}</span></a>`
          : `<a href="#" data-mailto data-user="TISORN001" data-domain="e.ntu.edu.sg" data-subject="Hello from the website"><strong>${esc(l.label)}</strong><span>${esc(l.description || '')}</span></a>`}</li>`;
      }).join('')}</ul>`,
    }),

    contact: () => ({
      crumb: 'Contact', title: 'Who to ask about what', name: 'Contact',
      body: `<p class="sheet-lede">Every address reaches a person. If none of the rows fits, use the first one: the President's inbox catches everything.</p>
        <table class="routing"><thead><tr><th scope="col">If it is about</th><th scope="col">Write to</th></tr></thead><tbody>
        ${Q.routing.map((r) => `<tr><td>${esc(r.about)}</td><td>${mail(r.user, r.domain, 'QuEST@EEE', r.role)}</td></tr>`).join('')}
        </tbody></table>
        <p class="note">Addresses here are assembled in your browser rather than written into the page.</p>`,
    }),
  };

  /* ======================================================================
     The calendar
     ====================================================================== */

  const CHEVRON = (d) => `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="${d}" /></svg>`;
  const keyOf = (y, m, d) => new Date(Date.UTC(y, m, d)).toISOString().slice(0, 10);

  function mountCalendar(box, events) {
    if (!box) return null;
    /* every day each event covers, in Singapore time */
    const byDay = new Map();
    events.forEach((e) => {
      const a = dayKey(new Date(e.start)), b = dayKey(new Date(e.end || e.start));
      const [y, m, d] = a.split('-').map(Number);
      for (let i = 0, k = a; k <= b && i < 60; i++, k = keyOf(y, m - 1, d + i)) {
        if (!byDay.has(k)) byDay.set(k, []);
        byDay.get(k).push({ e, first: k === a, last: k === b });
      }
    });
    const today = dayKey(new Date());
    const monthOf = (k) => { const [y, m] = k.split('-').map(Number); return { y, m: m - 1 }; };
    /* open on the next event's month; with none coming, on the latest one's */
    const next = events.find(isUpcoming);
    const latest = [...events].reverse().find((e) => !isUpcoming(e));
    const startKey = next ? dayKey(new Date(next.start)) : latest ? dayKey(new Date(latest.start)) : today;
    let view = monthOf(startKey);
    const withEvents = [...new Set(events.map((e) => dayKey(new Date(e.start)).slice(0, 7)))].sort();

    const render = (focusSel) => {
      const { y, m } = view;
      const lead = (new Date(Date.UTC(y, m, 1)).getUTCDay() + 6) % 7;     /* Monday first */
      const days = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
      const cells = Math.ceil((lead + days) / 7) * 7;
      let rows = '', count = 0;
      for (let i = 0; i < cells; i++) {
        const k = keyOf(y, m, 1 - lead + i);
        const [, , dd] = k.split('-').map(Number);
        const out = Number(k.slice(5, 7)) - 1 !== m;
        const items = byDay.get(k) || [];
        if (!out) count += items.filter((it) => it.first).length;
        const chips = items.map(({ e, first, last }) => {
          const label = `${e.title}, ${date(e.start)}${e.end && dayKey(new Date(e.end)) !== dayKey(new Date(e.start)) ? ` to ${date(e.end)}` : ''}`;
          /* the first day, and the first day of each week, carry the name across
             the days the bar covers in that week; the rest continue the bar */
          const named = first || i % 7 === 0;
          let span = 1;
          if (named) { const end = dayKey(new Date(e.end || e.start)); while ((i + span) % 7 !== 0 && keyOf(y, m, 1 - lead + i + span) <= end) span++; }
          return `<a class="cal-chip${named ? '' : ' is-cont'}${first ? ' is-first' : ''}${last ? ' is-last' : ''}${isUpcoming(e) ? ' is-next' : ''}${named && span === 1 ? ' is-single' : ''}" href="#/event/${e.id}" aria-label="${esc(label)}"${named ? ` style="--span:${span}"` : ' tabindex="-1" aria-hidden="true"'}><span>${esc(e.title)}</span></a>`;
        }).join('');
        if (i % 7 === 0) rows += '<tr>';
        rows += `<td class="cal-day${out ? ' is-out' : ''}${k === today ? ' is-today' : ''}${items.length ? ' has-event' : ''}"><span class="cal-num">${dd}</span>${k === today ? '<span class="visually-hidden">today</span>' : ''}${chips}</td>`;
        if (i % 7 === 6) rows += '</tr>';
      }
      const title = `${MONTHS[m]} ${y}`;
      box.innerHTML = `
        <div class="cal-head">
          <p class="cal-month" aria-live="polite">${title}</p>
          <div class="cal-nav">
            <button type="button" class="cal-btn" data-cal-step="-1" aria-label="Previous month">${CHEVRON('M15 6l-6 6 6 6')}</button>
            <button type="button" class="cal-btn cal-today" data-cal-today>Today</button>
            <button type="button" class="cal-btn" data-cal-step="1" aria-label="Next month">${CHEVRON('M9 6l6 6-6 6')}</button>
          </div>
        </div>
        <div class="cal-jump" role="group" aria-label="Months with events">${withEvents.map((ym) => {
          const [jy, jm] = ym.split('-').map(Number);
          const on = jy === y && jm - 1 === m;
          return `<button type="button" class="cal-btn${on ? ' is-on' : ''}" data-cal-jump="${ym}" aria-pressed="${on}">${MONTHS[jm - 1].slice(0, 3)} ${jy}</button>`;
        }).join('')}</div>
        <table class="cal-grid">
          <caption class="visually-hidden">${title}: ${count ? `${count} event${count === 1 ? '' : 's'}` : 'no events'}</caption>
          <thead><tr>${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => `<th scope="col" abbr="${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i]}">${d}</th>`).join('')}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
        ${count ? '' : `<p class="cal-empty">Nothing in ${title}. New sessions are announced first on Telegram.</p>`}`;
      settle(box);
      if (focusSel) $(focusSel, box)?.focus();
    };
    box.addEventListener('click', (event) => {
      const step = event.target.closest('[data-cal-step]');
      const jump = event.target.closest('[data-cal-jump]');
      if (step) {
        const d = Number(step.dataset.calStep);
        const t = new Date(Date.UTC(view.y, view.m + d, 1));
        view = { y: t.getUTCFullYear(), m: t.getUTCMonth() };
        render(`[data-cal-step="${d}"]`);
      } else if (event.target.closest('[data-cal-today]')) {
        view = monthOf(today); render('[data-cal-today]');
      } else if (jump) {
        view = monthOf(`${jump.dataset.calJump}-01`); render(`[data-cal-jump="${jump.dataset.calJump}"]`);
      }
    });
    render();
    return null;
  }

  /* ======================================================================
     Explorers: controls around a live plot
     ====================================================================== */

  function slider(id, labelText, min, max, step, value, fmt) {
    return `<label class="x-knob" for="${id}"><span class="x-knob-label">${labelText} <output data-out="${id}">${fmt(value)}</output></span>
      <input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
  }

  function mountExplorer(root, station) {
    const st = Plots.STATIONS[station];
    const canvas = $('[data-canvas]', root);
    const readout = $('[data-readout]', root);
    const controls = $('[data-controls]', root);
    const s = st.defaults();
    let anim = 0;
    let hit = null;
    const render = () => {
      st.draw(canvas, s, { hit: (h) => { hit = h; } });
      readout.textContent = st.summary(s).text;
      $$('[data-out]', controls).forEach((o) => { o.textContent = FMT[o.dataset.out] ? FMT[o.dataset.out]() : o.textContent; });
    };
    const stop = () => { cancelAnimationFrame(anim); anim = 0; $$('[data-play]', controls).forEach((b) => b.setAttribute('aria-pressed', 'false')); };
    const FMT = {};
    const bind = (id, fn) => { const el = $(`#${id}`, controls); el.addEventListener('input', () => { stop(); fn(Number(el.value)); render(); }); return el; };

    if (station === 'grover') {
      FMT['g-n'] = () => `${2 ** s.n} boxes`;
      FMT['g-steps'] = () => `${s.steps}`;
      controls.innerHTML = `
        ${slider('g-n', 'Boxes', 2, 6, 1, s.n, () => `${2 ** s.n} boxes`)}
        ${slider('g-steps', 'Steps', 0, 12, 1, s.steps, () => `${s.steps}`)}
        <div class="x-knob"><span class="x-knob-label">Marked box <output data-marked>${s.marked[0] + 1}</output></span>
          <span class="x-steppers"><button type="button" class="x-btn" data-mk="-1" aria-label="Previous box">−</button><button type="button" class="x-btn" data-mk="1" aria-label="Next box">+</button></span></div>
        <button type="button" class="pill pill-ink x-play" data-play aria-pressed="false"><span class="pill-label">Run the search</span><span class="pill-disc" aria-hidden="true">${ARROW}</span></button>
        <p class="x-hint">Or click a bar to mark it. Push the steps past the best and watch success fall apart.</p>`;
      const nIn = bind('g-n', (v) => { s.n = v; s.marked = [Math.min(s.marked[0], 2 ** v - 1)]; markOut(); });
      const stepIn = bind('g-steps', (v) => { s.steps = v; });
      const markOut = () => { $('[data-marked]', controls).textContent = s.marked[0] + 1; };
      $$('[data-mk]', controls).forEach((b) => b.addEventListener('click', () => {
        stop(); const size = 2 ** s.n; s.marked = [(s.marked[0] + Number(b.dataset.mk) + size) % size]; markOut(); render();
      }));
      canvas.addEventListener('click', (e) => {
        if (!hit) return;
        const r = canvas.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top;
        if (y < hit.top || y > hit.bottom) return;
        const i = Math.floor((x - hit.padL) / hit.band);
        if (i >= 0 && i < hit.size) { stop(); s.marked = [i]; markOut(); render(); }
      });
      $('[data-play]', controls).addEventListener('click', (e) => {
        if (anim) { stop(); return; }
        e.currentTarget.setAttribute('aria-pressed', 'true');
        s.steps = 0; let last = 0;
        const best = P.grover.optimalIterations(s.n, 1);
        const end = Math.min(12, best * 2);
        const tick = (now) => {
          if (now - last > (reduce ? 0 : 520)) { last = now; stepIn.value = s.steps; render(); if (s.steps >= end) { stop(); return; } s.steps += 1; }
          anim = requestAnimationFrame(tick);
        };
        anim = requestAnimationFrame(tick);
      });
      void nIn;
    }

    if (station === 'chsh') {
      FMT['c-d'] = () => `${Math.round(s.delta * 180 / Math.PI)}°`;
      controls.innerHTML = `
        ${slider('c-d', 'Detector offset', 0, 90, 1, 0, () => '0°')}
        <button type="button" class="pill pill-ink x-play" data-play aria-pressed="false"><span class="pill-label">Sweep the dial</span><span class="pill-disc" aria-hidden="true">${ARROW}</span></button>
        <p class="x-hint">At zero offset the needle sits at 2√2, past anything a classical universe allows. Turn the detectors and watch it fall back through 2.</p>`;
      const dIn = bind('c-d', (v) => { s.delta = v * Math.PI / 180; });
      $('[data-play]', controls).addEventListener('click', (e) => {
        if (anim) { stop(); return; }
        e.currentTarget.setAttribute('aria-pressed', 'true');
        const t0 = performance.now();
        const tick = (now) => {
          const k = Math.min(1, (now - t0) / 6400);
          const sweep = k < 0.5 ? k * 2 : (1 - k) * 2;
          s.delta = sweep * Math.PI / 2; dIn.value = Math.round(sweep * 90); render();
          if (k >= 1 || reduce) { stop(); return; }
          anim = requestAnimationFrame(tick);
        };
        anim = requestAnimationFrame(tick);
      });
    }

    if (station === 'sg') {
      FMT['s-phi'] = () => `${s.phaseDeg}°`;
      controls.innerHTML = `
        <fieldset class="x-knob x-seg"><legend class="x-knob-label">Middle magnet</legend>
          ${['off', 'X', 'Y', 'Z'].map((a) => `<label><input type="radio" name="s-mid" value="${a}"${a === s.middle ? ' checked' : ''}><span>${a === 'off' ? 'None' : a}</span></label>`).join('')}
        </fieldset>
        ${slider('s-phi', 'Phase of the atoms going in', 0, 360, 5, 0, () => '0°')}
        <p class="x-hint">The first magnet blocks spin-down. With no middle magnet, none arrives at the end. Put an X magnet in the middle and the blocked state comes back.</p>`;
      $$('input[name="s-mid"]', controls).forEach((r) => r.addEventListener('change', () => { s.middle = r.value; render(); }));
      bind('s-phi', (v) => { s.phaseDeg = v; });
    }

    if (station === 'vqe') {
      const rows = Q.h2.rows;
      const rMin = rows[0].R, rMax = rows[rows.length - 1].R;
      FMT['v-t'] = () => `${Math.round(s.theta * 180 / Math.PI)}°`;
      FMT['v-r'] = () => `${Plots.STATIONS.vqe.summary(s).row.R.toFixed(2)} Å`;
      controls.innerHTML = `
        ${slider('v-t', 'θ, the one knob', -90, 90, 1, 0, () => '0°')}
        ${slider('v-r', 'Bond length', rMin, rMax, 0.05, s.R, () => `${s.R.toFixed(2)} Å`)}
        <button type="button" class="pill pill-ink x-play" data-play aria-pressed="false"><span class="pill-label">Let it settle</span><span class="pill-disc" aria-hidden="true">${ARROW}</span></button>
        <p class="x-hint">Turn θ until the energy stops falling. That lowest point is the molecule's ground state; the dashed line is the exact answer.</p>`;
      const tIn = bind('v-t', (v) => { s.theta = v * Math.PI / 180; });
      bind('v-r', (v) => { s.R = v; });
      $('[data-play]', controls).addEventListener('click', (e) => {
        if (anim) { stop(); return; }
        e.currentTarget.setAttribute('aria-pressed', 'true');
        const row = Plots.STATIONS.vqe.summary(s).row;
        const target = P.h2.optimalTheta(row);
        const tick = () => {
          s.theta += (target - s.theta) * (reduce ? 1 : 0.08);
          tIn.value = Math.round(s.theta * 180 / Math.PI); render();
          if (Math.abs(target - s.theta) < 0.002) { s.theta = target; render(); stop(); return; }
          anim = requestAnimationFrame(tick);
        };
        anim = requestAnimationFrame(tick);
      });
    }

    if (station === 'itqpe') {
      const q = Plots.STATIONS.itqpe;
      FMT['q-n'] = () => `${s.pairs * q.SHOTS}`;
      FMT['q-k'] = () => `${s.kmax}`;
      controls.innerHTML = `
        ${slider('q-n', 'Shots', 1, q.PAIRS, 1, s.pairs, () => `${s.pairs * q.SHOTS}`)}
        ${slider('q-k', 'Largest power of U, k', 1, 12, 1, s.kmax, () => `${s.kmax}`)}
        <label class="x-knob x-check"><input type="checkbox" data-real> <span class="x-knob-label">Real part only (β = 0 every time)</span></label>
        <span class="x-buttons">
          <button type="button" class="pill pill-ink x-play" data-play aria-pressed="false"><span class="pill-label">Collect the shots</span><span class="pill-disc" aria-hidden="true">${ARROW}</span></button>
          <button type="button" class="x-btn x-btn-wide" data-reseed>New random run</button>
        </span>
        <p class="x-hint">Slide the shots down to ten and many energies look equally good; add shots and one peak stands clear. Set k to 1 and the peak goes wide. Use the real part alone and a mirror peak appears at ${q.mirror.toFixed(3)} Ha.</p>`;
      const nIn = bind('q-n', (v) => { s.pairs = v; });
      bind('q-k', (v) => { s.kmax = v; });
      $('[data-real]', controls).addEventListener('change', (e) => { stop(); s.realOnly = e.target.checked; render(); });
      $('[data-reseed]', controls).addEventListener('click', () => { stop(); s.seed = (s.seed * 1103515245 + 12345) % 2147483647; render(); });
      $('[data-play]', controls).addEventListener('click', (e) => {
        if (anim) { stop(); return; }
        e.currentTarget.setAttribute('aria-pressed', 'true');
        s.pairs = 1; let last = 0;
        const tick = (now) => {
          if (now - last > 30) { last = now; s.pairs = Math.min(q.PAIRS, s.pairs + (reduce ? q.PAIRS : 3)); nIn.value = s.pairs; render(); }
          if (s.pairs >= q.PAIRS) { stop(); return; }
          anim = requestAnimationFrame(tick);
        };
        anim = requestAnimationFrame(tick);
      });
      /* Opening the demo plays it like a clip: the graph redraws as the shots
         come in, from ten to 2190, and the peak narrows onto the energy. */
      if (!reduce) requestAnimationFrame(() => $('[data-play]', controls).click());
    }

    render();
    const ro = new ResizeObserver(() => render());
    ro.observe(canvas);
    return () => { stop(); ro.disconnect(); };
  }

  /* ======================================================================
     The sheets: a stack of letters

     Each history entry this page makes carries its index (history.state.qn),
     so a hashchange can tell a new page from a step back or forward, and the
     stack on screen always matches the back button.
     ====================================================================== */

  const sheet = document.createElement('div');
  sheet.className = 'sheet';
  sheet.hidden = true;
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-modal', 'true');
  document.body.appendChild(sheet);

  const DOWN = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>';
  const CROSS = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>';
  const SHOWN = 3;            /* letters drawn at once; deeper ones wait, hidden */
  const stack = [];           /* [{ key, n, name, el, unmount, opener }] */
  let here = 0, closing = false, hideTimer = 0;

  if (!history.state || history.state.qn == null) history.replaceState({ ...(history.state || {}), qn: 0 }, '');
  here = history.state.qn;

  function parse() {
    const m = location.hash.match(/^#\/(demo|project|event|resource|news|page)\/([\w-]+)$/);
    return m ? { kind: m[1], id: m[2], key: `${m[1]}/${m[2]}` } : null;
  }

  const top = () => stack[stack.length - 1];
  const focusTop = () => { const t = top(); t && $('.sheet-title', t.el).focus({ preventScroll: true }); };

  /* Depth decides each letter's place: the top one lowest and flat, each one
     beneath stepped back, dimmed, its top edge showing, and inert. */
  function layout() {
    const from = Math.max(0, stack.length - SHOWN);
    stack.forEach((item, i) => {
      const under = stack.length - 1 - i;
      item.el.style.setProperty('--lift', `${Math.max(0, i - from) * 16}px`);
      /* the contents go inert, not the letter: its showing edge stays clickable */
      if (under) item.el.dataset.under = Math.min(under, SHOWN); else delete item.el.dataset.under;
      [...item.el.children].forEach((c) => { c.inert = !!under; });
    });
    const t = top();
    if (t) sheet.setAttribute('aria-labelledby', `sheet-title-${t.n}`);
  }

  function push(target, n) {
    const view = VIEWS[target.kind](target.id);
    if (!view) return false;
    const below = top();
    const name = view.name || view.crumb;
    const el = document.createElement('div');
    el.className = 'sheet-panel';
    el.dataset.kind = target.kind;
    el.innerHTML = `
      <div class="sheet-bar">
        <p class="sheet-crumb">${esc(view.crumb)}</p>
        <div class="sheet-actions">
          ${below ? `<button type="button" class="sheet-back" data-sheet-back aria-label="Back to ${esc(below.name)}"><span aria-hidden="true">Back to ${esc(below.name)}</span>${DOWN}</button>` : ''}
          <button type="button" class="icon-button sheet-close" data-sheet-close aria-label="${below ? 'Close every page' : 'Close'}">${CROSS}</button>
        </div>
      </div>
      <div class="sheet-scroll">
        <h2 class="sheet-title" id="sheet-title-${n}" tabindex="-1">${esc(view.title)}</h2>
        <div class="sheet-body">${view.body}</div>
      </div>`;
    const body = $('.sheet-body', el);
    settle(body);
    const item = { key: target.key, n, name, el, unmount: null, opener: document.activeElement };

    if (!below) {
      /* the first sheet: the reference's curtain, a convex edge that settles.
         A close still running is cancelled, or it would take this sheet too. */
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = 0; sheet.replaceChildren(); }
      sheet.hidden = false;
      doc.classList.add('has-sheet');
      sheet.removeAttribute('data-leaving');
      sheet.setAttribute('data-entering', '');
      requestAnimationFrame(() => requestAnimationFrame(() => sheet.removeAttribute('data-entering')));
    } else if (!reduce) {
      /* every one after it: a letter drawn up out of its envelope */
      el.setAttribute('data-letter', '');
      el.addEventListener('animationend', () => el.removeAttribute('data-letter'), { once: true });
    }
    stack.push(item);
    sheet.appendChild(el);
    if (view.mount) item.unmount = view.mount(body);
    layout();
    focusTop();
    return true;
  }

  /* Put the top letter down. */
  function pop() {
    const item = stack.pop();
    if (!item) return;
    item.unmount && item.unmount();
    if (reduce) item.el.remove();
    else {
      item.el.inert = true;
      item.el.setAttribute('data-leaving', '');
      setTimeout(() => item.el.remove(), 460);
    }
    layout();
    const t = top();
    if (t && item.opener && t.el.contains(item.opener)) item.opener.focus({ preventScroll: true });
    else focusTop();
  }

  /* Every letter at once, with the curtain. */
  function hideAll() {
    if (sheet.hidden) return;
    const opener = stack[0] && stack[0].opener;
    stack.splice(0).forEach((item) => { item.unmount && item.unmount(); });
    sheet.setAttribute('data-leaving', '');
    const done = () => {
      hideTimer = 0;
      sheet.hidden = true;
      sheet.removeAttribute('data-leaving');
      sheet.replaceChildren();
      doc.classList.remove('has-sheet');
    };
    if (reduce) done(); else hideTimer = setTimeout(done, 420);
    if (opener && document.contains(opener) && !sheet.contains(opener)) opener.focus({ preventScroll: true });
  }

  function sync() {
    const state = history.state;
    let n;
    if (state && state.qn != null) n = state.qn;
    else { n = here + 1; history.replaceState({ ...(state || {}), qn: n }, ''); }   /* a new entry */
    here = n;
    const target = parse();
    if (!target) { closing = false; hideAll(); return; }
    if (closing) {
      /* the visit began on a sheet's address: we walked back to it; now clear it */
      closing = false;
      history.replaceState({ qn: n }, '', location.pathname + location.search);
      hideAll();
      return;
    }
    while (stack.length && top().n > n) pop();
    const t = top();
    if (t && t.n === n) {
      if (t.key === target.key) { layout(); focusTop(); return; }
      pop();
    }
    if (!push(target, n) && !stack.length) hideAll();
  }

  function closeAll() {
    if (!stack.length) return;
    const first = stack[0].n;
    if (first > 0) { history.go(-(here - first + 1)); return; }
    if (here > 0) { closing = true; history.go(-here); return; }
    history.replaceState({ qn: 0 }, '', location.pathname + location.search);
    hideAll();
  }

  function back() {
    if (stack.length > 1) history.go(-(here - stack[stack.length - 2].n));
    else closeAll();
  }

  addEventListener('hashchange', sync);
  sheet.addEventListener('click', (e) => {
    if (e.target === sheet) { closeAll(); return; }
    if (e.target.closest('[data-sheet-close]')) { closeAll(); return; }
    if (e.target.closest('[data-sheet-back]')) { back(); return; }
    /* a letter beneath, clicked on its showing edge: go back to it */
    const under = e.target.closest('.sheet-panel[data-under]');
    if (under) {
      const item = stack.find((it) => it.el === under);
      if (item) history.go(-(here - item.n));
    }
  });
  document.addEventListener('keydown', (e) => {
    if (sheet.hidden || !stack.length) return;
    if (e.key === 'Escape') { e.preventDefault(); back(); }
    if (e.key === 'Tab') {
      const f = $$('a[href], button, input, .sheet-title', top().el).filter((el) => el.offsetParent !== null);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  sync();
  global.QuestSheets = { route, close: closeAll };
})(window);
