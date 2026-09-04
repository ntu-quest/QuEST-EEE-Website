/* ---------------------------------------------------------------------------
 * The demo page shell: outline scroll-spy, the control dock, deep-linkable
 * state, and booth mode. None of the physics lives here.
 * ------------------------------------------------------------------------- */

const page = document.querySelector<HTMLElement>('.demo-page');
if (page) {
  /* ---- outline rail scroll-spy ------------------------------------------ */
  const links = new Map<string, HTMLAnchorElement>();
  document.querySelectorAll<HTMLAnchorElement>('[data-rail]').forEach((link) => {
    links.set(link.dataset.rail!, link);
  });
  const sections = [...links.keys()]
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => Boolean(el));

  const mark = (id: string) => {
    links.forEach((link, key) => {
      if (key === id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  if (sections.length) {
    mark(sections[0].id);
    const seen = new Set<string>();
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) seen.add(entry.target.id);
        else seen.delete(entry.target.id);
      });
      /* The topmost visible section wins, so scrolling up marks the section
         you are moving into rather than the one you are leaving. */
      const current = sections.find((section) => seen.has(section.id));
      if (current) mark(current.id);
    }, { rootMargin: '-72px 0px -55% 0px', threshold: 0 });
    sections.forEach((section) => spy.observe(section));
  }

  /* ---- the control dock -------------------------------------------------- */
  const toggle = document.querySelector<HTMLButtonElement>('.dock-toggle');
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    /* The canvases size themselves from their box; the dock changing height
       moves it. */
    window.dispatchEvent(new Event('resize'));
  });

  /* Collapsed by default on a short viewport, where an open dock would cover
     the plot it controls. */
  if (window.innerHeight < 620) toggle?.setAttribute('aria-expanded', 'false');

  /* ---- deep-linkable state ----------------------------------------------- */
  /* /demos/grover?n=4&steps=9 — the query maps onto the booth's own input ids,
     so a link restores exactly what the sender was looking at. */
  const params = new URLSearchParams(window.location.search);
  const ALIASES: Record<string, string> = {
    n: 'qubits', steps: 'steps', marked: 'marked-count',
    angle: 'delta', shots: 'shots', phase: 'phase',
    theta: 'theta', bond: 'bond', bits: 'bits',
  };

  let restored = false;
  for (const [key, value] of params) {
    const id = ALIASES[key] ?? key;
    const input = document.getElementById(id);
    if (input instanceof HTMLInputElement) {
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      restored = true;
    }
  }

  /* Writing the state back into the URL makes the address bar shareable
     without adding a history entry per slider tick. */
  const publish = () => {
    const next = new URLSearchParams(window.location.search);
    document.querySelectorAll<HTMLInputElement>('.dock input[type="range"]').forEach((input) => {
      const alias = Object.entries(ALIASES).find(([, id]) => id === input.id)?.[0];
      if (alias) next.set(alias, input.value);
    });
    const query = next.toString();
    history.replaceState(null, '', query ? `?${query}${window.location.hash}` : window.location.pathname);
  };
  let pending = 0;
  document.querySelectorAll<HTMLInputElement>('.dock input[type="range"]').forEach((input) => {
    input.addEventListener('change', () => {
      clearTimeout(pending);
      pending = window.setTimeout(publish, 250);
    });
  });
  if (restored) publish();

  /* ---- booth mode -------------------------------------------------------- */
  if (params.get('kiosk') === '1') {
    document.body.classList.add('kiosk');
    /* Back to the starting state after two minutes untouched, so a station
       left mid-experiment is ready for the next person. */
    let idle = 0;
    const reset = () => {
      clearTimeout(idle);
      idle = window.setTimeout(() => window.location.reload(), 120_000);
    };
    ['pointerdown', 'keydown', 'input', 'touchstart'].forEach((event) => {
      document.addEventListener(event, reset, { passive: true });
    });
    reset();
  }
}
