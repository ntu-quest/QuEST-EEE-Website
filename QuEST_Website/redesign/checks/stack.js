/* ---------------------------------------------------------------------------
 * The letter stack against the browser's history.
 *
 *   playwright-cli --raw run-code --filename=redesign/checks/stack.js
 *   (with `npm run redesign` serving the page)
 *
 * Opens Projects, then a project, then a demo (three letters deep); puts them
 * down with Escape and "Back to …"; closes everything with the cross; then
 * walks the browser's forward and back buttons. At each step the letters on
 * screen must match the address bar. Anything under "problems" needs fixing.
 * ------------------------------------------------------------------------- */
async page => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:4400/redesign/?check=' + Date.now(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const state = () => page.evaluate(() => ({
    hash: location.hash,
    letters: [...document.querySelectorAll('.sheet-panel:not([data-leaving])')].map((p) => p.querySelector('.sheet-title').textContent.trim().slice(0, 30)),
  }));
  const steps = [];
  const problems = [];
  const expect = async (name, hash, depth) => {
    const s = await state(); steps.push({ step: name, ...s });
    if (s.hash !== hash) problems.push(`${name}: address ${s.hash || '(none)'}, expected ${hash || '(none)'}`);
    if (s.letters.length !== depth) problems.push(`${name}: ${s.letters.length} letter(s), expected ${depth}`);
  };
  await page.evaluate(() => { location.hash = '#/page/projects'; }); await page.waitForTimeout(900);
  await expect('open Projects', '#/page/projects', 1);
  await page.click('.sheet-panel:not([data-under]) a[href="#/project/qfest-booth"]'); await page.waitForTimeout(1100);
  await expect('open a project', '#/project/qfest-booth', 2);
  await page.click('.sheet-panel:not([data-under]) a[href="#/demo/grover"]'); await page.waitForTimeout(1100);
  await expect('open a demo', '#/demo/grover', 3);
  await page.keyboard.press('Escape'); await page.waitForTimeout(700);
  await expect('Escape', '#/project/qfest-booth', 2);
  await page.click('.sheet-panel:not([data-under]) [data-sheet-back]'); await page.waitForTimeout(700);
  await expect('Back to …', '#/page/projects', 1);
  await page.click('.sheet-panel:not([data-under]) a[href="#/project/mlda-quantum-ml"]'); await page.waitForTimeout(1100);
  await page.click('.sheet-panel:not([data-under]) [data-sheet-close]'); await page.waitForTimeout(800);
  await expect('the cross', '', 0);
  await page.goForward(); await page.waitForTimeout(900);
  await expect('browser forward', '#/page/projects', 1);
  await page.goForward(); await page.waitForTimeout(1000);
  await expect('browser forward again', '#/project/mlda-quantum-ml', 2);
  await page.goBack(); await page.waitForTimeout(800);
  await expect('browser back', '#/page/projects', 1);
  return JSON.stringify({ consoleErrors: errors, problems, steps }, null, 1);
}
