import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [320, 390, 768, 1440]) {
  test(`homepage and navigation at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Less watching.'
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
    await page.evaluate(() => window.scrollTo(0, 700));
    await expect
      .poll(() =>
        page
          .locator('.site-header')
          .evaluate(element => Math.round(element.getBoundingClientRect().top))
      )
      .toBe(0);
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    if (width <= 780) {
      const menu = page.getByRole('button', { name: 'Menu', exact: true });
      await menu.click();
      await expect(
        page.getByRole('dialog', { name: 'What’s next?' })
      ).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(menu).toBeFocused();
      await menu.click();
      await page
        .getByRole('dialog')
        .getByRole('link', { name: /Documentation/ })
        .click();
    } else {
      await page
        .getByRole('navigation', { name: 'Main navigation' })
        .getByRole('link', { name: 'Documentation' })
        .click();
    }
    await expect(page).toHaveURL('/docs');
    await expect(
      page.getByRole('heading', { name: 'Overview', exact: true })
    ).toHaveCount(1);
    await expect(page.locator('.docs-diagram svg').first()).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
  });
}

test('docs links, diagrams and accessible page structure', async ({ page }) => {
  for (const route of [
    '/',
    '/docs',
    '/docs/getting-started',
    '/docs/solutions',
    '/docs/architecture',
    '/docs/api',
    '/docs/local-development',
    '/docs/contributing',
    '/docs/troubleshooting',
  ]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    for (const diagram of await page.locator('.docs-diagram').all())
      await expect(diagram.locator('svg')).toBeVisible();
    if (route === '/docs/getting-started')
      await expect(
        page.locator('.docs-code .hljs-keyword').first()
      ).toBeVisible();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    expect(
      results.violations,
      `${route}: ${JSON.stringify(results.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })))}`
    ).toEqual([]);
  }
  expect((await page.goto('/docs/not-a-guide'))?.status()).toBe(404);
});

test('search reports failure, recovers, filters and restores focus', async ({
  page,
}) => {
  let fail = true;
  await page.route('**/api/challenges', route =>
    fail
      ? route.fulfill({ status: 500, json: { error: 'Unavailable' } })
      : route.fulfill({
          json: Array.from({ length: 12 }, (_, index) => ({
            slug: `shell-${index}`,
            title: `Build a shell ${index}`,
            summary: 'A command interpreter',
            skills: ['Parsing'],
            difficulty: 'Beginner',
            category: 'CLI',
            estimatedTime: '2 hours',
            hasSolution: false,
          })),
        })
  );
  await page.goto('/');
  const trigger = page.getByRole('button', {
    name: 'Search challenges',
    exact: true,
  });
  await trigger.focus();
  await page.evaluate(() => window.scrollTo(0, 700));
  const scrollPosition = await page.evaluate(() => window.scrollY);
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.mouse.move(2, 2);
  await page.mouse.wheel(0, 800);
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBe(scrollPosition);
  await expect(page.getByRole('combobox')).toBeFocused();
  await expect(page.getByText('Challenges could not be loaded.')).toBeVisible();
  fail = false;
  await page.getByRole('button', { name: 'Try again' }).click();
  const options = page.getByRole('option');
  await expect(options).toHaveCount(12);
  const input = page.getByRole('combobox');
  await input.focus();
  await input.press('ArrowUp');
  await expect(options.last()).toHaveAttribute('aria-selected', 'true');
  await expect(input).toHaveAttribute(
    'aria-activedescendant',
    'challenge-option-11'
  );
  await expect(options.last()).toBeInViewport();
  await options.nth(10).hover();
  await expect(options.nth(10)).toHaveAttribute('aria-selected', 'true');
  await input.press('ArrowDown');
  await expect(options.last()).toHaveAttribute('aria-selected', 'true');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole('button', { name: 'Advanced', exact: true }).click();
  await expect(options).toHaveCount(0);
  await expect(page.getByText('0 results', { exact: true })).toBeVisible();
  await expect(input).toBeFocused();
  await page.getByRole('button', { name: 'Beginner', exact: true }).click();
  await expect(options).toHaveCount(12);
  await expect(options.first()).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByText('12 results', { exact: true })).toBeVisible();
  await page
    .getByRole('combobox', { name: 'Search challenges' })
    .fill('no matching challenge');
  await expect(
    page.getByText('No challenges match. Try another search.')
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollPosition);
});

test('published challenge, solution and ZIP work against PostgreSQL', async ({
  page,
  request,
}) => {
  const slug = 'browser-test-word-counter';
  const response = await request.get('/api/challenges');
  expect(response.ok()).toBe(true);
  expect(await response.json()).toEqual(
    expect.arrayContaining([expect.objectContaining({ slug })])
  );
  await page.goto('/challenges');
  await page
    .getByRole('link', { name: /Test fixture: Word counter/ })
    .first()
    .click();
  await expect(page).toHaveURL(`/challenge/${slug}`);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Word counter'
  );
  await page.getByRole('button', { name: 'Show Preview' }).click();
  const file = page.getByRole('button', { name: 'counter.py Source 3 lines' });
  await file.click();
  await expect(file).toHaveAttribute('aria-pressed', 'true');
  await expect(
    page.getByText('def count_words', { exact: false }).last()
  ).toBeVisible();
  const solution = await request.get(`/api/challenges/${slug}/solution`);
  expect(solution.ok()).toBe(true);
  expect((await solution.json()).files[0].filename).toBe('counter.py');
  const archive = await request.get(
    `/api/challenges/${slug}/solution/download`
  );
  expect(archive.ok()).toBe(true);
  expect((await archive.body()).subarray(0, 2).toString()).toBe('PK');
  expect(
    (await request.get('/api/challenges/not-a-challenge/solution')).status()
  ).toBe(404);
});

test('challenge content remains readable without animation or JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4318/challenge/browser-test-word-counter');
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  expect(
    await heading.evaluate(element => {
      for (
        let node: Element | null = element;
        node;
        node = node.parentElement
      ) {
        if (getComputedStyle(node).opacity === '0') return false;
      }
      return true;
    })
  ).toBe(true);
  await context.close();
});

test('homepage guides visitors into filtered challenges', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Help me choose', exact: true }).click();
  await expect(page).toHaveURL('/#choose-challenge');
  await page
    .locator('.discovery-card[href="/challenges?difficulty=Beginner"]')
    .click();
  await expect(page).toHaveURL('/challenges?difficulty=Beginner');
  await expect(
    page.getByRole('link', { name: /Test fixture: Word counter/ }).first()
  ).toBeVisible();
  await page.goBack();
  await page
    .locator('.discovery-card[href="/challenges?difficulty=Advanced"]')
    .click();
  await expect(page).toHaveURL('/challenges?difficulty=Advanced');
  await expect(
    page.getByText('No challenges found', { exact: true })
  ).toBeVisible();
  await page.getByRole('button', { name: 'Clear all filters' }).click();
  await expect(page).toHaveURL('/challenges');
  await expect(
    page.getByRole('link', { name: /Test fixture: Word counter/ }).first()
  ).toBeVisible();
  await page.goto('/');
  await page
    .getByRole('link', { name: 'Browse command-line projects', exact: true })
    .click();
  await expect(page).toHaveURL('/challenges?category=Command%20Line');
  await expect(
    page.getByRole('button', { name: 'Command Line', exact: true })
  ).toBeVisible();
});
