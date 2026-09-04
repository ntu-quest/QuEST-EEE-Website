/* ---------------------------------------------------------------------------
 * The interference field — CLAUDE.md §Interactivity, BLUEPRINT §11.
 *
 * Two coherent sources emit into a plane. Where crests meet the field is
 * bright; where a crest meets a trough it cancels. The pointer is the second
 * source. It is the club's own subject matter rendered as a physical quantity,
 * which is the only reason it is allowed to exist — don't mistake delight for
 * decoration.
 *
 * ONE INTERACTIVE BACKGROUND, ONE PLACE, ONE INTENSITY. Homepage hero and the
 * /demos index header only. A second ambient effect anywhere on the site means
 * both get deleted.
 *
 * The eight behaviours that must survive any change to this file:
 *   1. First frame drawn synchronously on load — a screenshot, a link preview
 *      and a reader who never moves the pointer all see the finished design.
 *   2. Colour read from --accent and --ice at <=10% alpha, so it follows the
 *      theme without knowing anything about it.
 *   3. Rendered at ~1/6 display resolution into one ImageData and scaled up.
 *      The softness is the aesthetic, not an artefact.
 *   4. 30 fps cap.
 *   5. Paused off-screen by IntersectionObserver and on document.hidden.
 *   6. Pointer drives the second source with an eased lag, so it reads as a
 *      field rather than a cursor trail.
 *   7. prefers-reduced-motion: reduce -> one frame, no loop ever started. The
 *      still frame is the design, not a degraded version.
 *   8. Same for low power: under 720px, hardwareConcurrency <= 4, or saveData.
 * ------------------------------------------------------------------------- */

type RGB = [number, number, number];

const SCALE = 6;          /* display pixels per buffer pixel */
const FRAME_MS = 33;      /* 30 fps */
const ALPHA = 26;         /* out of 255 — the <=10% contrast ceiling, on paper */
const ALPHA_DARK = 16;    /* the same ceiling measured on a near-black ground */
const EASE = 0.06;

function parse(value: string): RGB {
  const v = value.trim();
  if (v.startsWith('#')) {
    const hex = v.length === 4
      ? `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`
      : v;
    return [
      parseInt(hex.slice(1, 3), 16),
      parseInt(hex.slice(3, 5), 16),
      parseInt(hex.slice(5, 7), 16),
    ];
  }
  const parts = v.match(/[\d.]+/g);
  return parts ? [Number(parts[0]), Number(parts[1]), Number(parts[2])] : [75, 63, 148];
}

export function mountField(host: HTMLElement) {
  const canvas = host.querySelector('canvas');
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const small = window.matchMedia('(max-width: 719px)');

  const lowPower = () => {
    const cores = navigator.hardwareConcurrency || 8;
    const save = (navigator as { connection?: { saveData?: boolean } }).connection?.saveData;
    return cores <= 4 || Boolean(save) || small.matches;
  };
  const shouldAnimate = () => !reduce.matches && !lowPower();

  let W = 0, H = 0;
  let image: ImageData | null = null;
  let buffer: Uint8ClampedArray | null = null;
  let phase = 0;
  /* Where the pointer is, and where the source has eased to. */
  let targetX = 0.72, targetY = 0.3;
  let sourceX = 0.72, sourceY = 0.3;
  let running = false;
  let raf = 0;
  let timer = 0;

  const wavelength = Number(host.dataset.wavelength || 18);

  function draw() {
    if (!image || !buffer) return;
    const styles = getComputedStyle(document.documentElement);
    const a = parse(styles.getPropertyValue('--accent'));
    const b = parse(styles.getPropertyValue('--ice'));

    /* 10% alpha of a pale colour on a near-black ground reads far stronger
       than 10% of a deep colour on paper — same number, different contrast.
       The ceiling is a contrast ceiling, not an alpha one, so the dark theme
       gets the lower value. */
    const ground = parse(styles.getPropertyValue('--wash'));
    const dark = (ground[0] + ground[1] + ground[2]) / 3 < 128;
    const alpha = dark ? ALPHA_DARK : ALPHA;

    const k = (2 * Math.PI) / wavelength;
    /* The first source is anchored to the lower left, near where the hero's
       primary action sits, so the fringes belong to the layout. */
    const s1x = W * 0.24, s1y = H * 0.72;
    const s2x = W * sourceX, s2y = H * sourceY;

    let i = 0;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const dx1 = x - s1x, dy1 = y - s1y;
        const dx2 = x - s2x, dy2 = y - s2y;
        const d1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
        const v = Math.sin(k * d1 - phase) + Math.sin(k * d2 - phase);
        const intensity = v * v * 0.25;            /* 0..1 */
        const mix = d2 < d1 ? 1 : 0;               /* hue by nearer source */
        buffer[i] = a[0] + (b[0] - a[0]) * mix;
        buffer[i + 1] = a[1] + (b[1] - a[1]) * mix;
        buffer[i + 2] = a[2] + (b[2] - a[2]) * mix;
        buffer[i + 3] = intensity * alpha;
        i += 4;
      }
    }
    ctx!.putImageData(image, 0, 0);
  }

  function resize() {
    const rect = host.getBoundingClientRect();
    if (!rect.width) return;
    W = Math.max(60, Math.round(rect.width / SCALE));
    H = Math.max(40, Math.round(rect.height / SCALE));
    canvas!.width = W;
    canvas!.height = H;
    image = ctx!.createImageData(W, H);
    buffer = image.data;
    draw();
  }

  function frame() {
    sourceX += (targetX - sourceX) * EASE;
    sourceY += (targetY - sourceY) * EASE;
    phase += 0.05;
    draw();
    timer = window.setTimeout(() => { raf = requestAnimationFrame(frame); }, FRAME_MS);
  }

  function start() {
    if (running || !shouldAnimate()) return;
    running = true;
    frame();
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
    clearTimeout(timer);
  }

  host.addEventListener('pointermove', (event) => {
    const rect = host.getBoundingClientRect();
    targetX = (event.clientX - rect.left) / rect.width;
    targetY = (event.clientY - rect.top) / rect.height;
    /* With motion off the field still answers — it just answers once, in
       place, rather than easing. Reduced motion is a still version, never a
       disabled feature. */
    if (!shouldAnimate()) { sourceX = targetX; sourceY = targetY; draw(); }
  }, { passive: true });

  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  reduce.addEventListener('change', () => { stop(); draw(); start(); });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', draw);
  window.addEventListener('quest:themechange', draw);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(
      (entries) => (entries[0].isIntersecting ? start() : stop()),
      { threshold: 0 },
    ).observe(host);
  }

  resize();   /* draws the first frame synchronously */
  start();
}
