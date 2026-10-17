/* ---------------------------------------------------------------------------
 * Every link on the redesign, followed in a real browser.
 *
 *   npm run redesign                      (in one terminal: serves the page)
 *   playwright-cli open about:blank
 *   playwright-cli --raw run-code --filename=redesign/checks/links.js
 *
 * Opens every letter linked from the page and checks it shows a title, checks
 * every section anchor exists, then opens every letter linked from inside the
 * letters. Prints a summary; anything under "problems" needs fixing.
 * ------------------------------------------------------------------------- */
async page => {
  const URL = 'http://localhost:4400/redesign/';
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(URL + '?check=' + Date.now(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const topTitle = () => page.evaluate(() => {
    const s = document.querySelector('.sheet');
    const p = [...document.querySelectorAll('.sheet-panel:not([data-leaving])')].pop();
    return s && !s.hidden && p ? p.querySelector('.sheet-title').textContent.trim() : null;
  });
  const hrefs = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')))]);
  const problems = [];
  const letters = [], anchors = [];
  for (const h of hrefs) {
    if (h.startsWith('#/')) {
      await page.evaluate((x) => { location.hash = x; }, h); await page.waitForTimeout(300);
      const t = await topTitle();
      letters.push(`${h} -> ${t}`);
      if (!t) problems.push(`letter did not open: ${h}`);
    } else if (h.startsWith('#') && h.length > 1) {
      const ok = await page.evaluate((x) => !!document.querySelector(x), h);
      anchors.push(h);
      if (!ok) problems.push(`missing anchor: ${h}`);
    }
  }
  /* the links inside every letter */
  const inner = new Set();
  for (const l of letters) {
    const h = l.split(' -> ')[0];
    await page.evaluate((x) => { location.hash = x; }, h); await page.waitForTimeout(200);
    (await page.evaluate(() => [...document.querySelectorAll('.sheet a[href]')].map((a) => a.getAttribute('href')))).forEach((x) => inner.add(x));
  }
  for (const h of inner) {
    if (h.startsWith('#/')) {
      await page.evaluate((x) => { location.hash = x; }, h); await page.waitForTimeout(200);
      if (!(await topTitle())) problems.push(`inner letter did not open: ${h}`);
    } else if (h.startsWith('#') && h.length > 1) {
      if (!(await page.evaluate((x) => !!document.querySelector(x), h))) problems.push(`inner anchor missing: ${h}`);
    } else if (h.startsWith('/')) problems.push(`site-absolute link left in a letter: ${h}`);
  }
  const unassembled = await page.evaluate(() => [...document.querySelectorAll('[data-mailto]')].filter((a) => !a.getAttribute('href').startsWith('mailto:')).length);
  if (unassembled) problems.push(`${unassembled} email link(s) not assembled`);
  return JSON.stringify({ letters: letters.length, anchors: anchors.length, innerLinks: inner.size, consoleErrors: errors, problems }, null, 1);
}
