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
    await expect(page.locator('.docs-diagram svg')).toBeVisible();
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
          json: [
            {
              slug: 'shell',
              title: 'Build a shell',
              summary: 'A command interpreter',
              skills: ['Parsing'],
              difficulty: 'Beginner',
              category: 'CLI',
              estimatedTime: '2 hours',
              hasSolution: false,
            },
          ],
        })
  );
  await page.goto('/');
  const trigger = page.getByRole('button', {
    name: 'Search challenges',
    exact: true,
  });
  await trigger.click();
  await expect(page.getByText('Challenges could not be loaded.')).toBeVisible();
  fail = false;
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('link', { name: /Build a shell/ })).toBeVisible();
  await page
    .getByRole('textbox', { name: 'Search challenges' })
    .fill('no matching challenge');
  await expect(
    page.getByText('No challenges match. Try another search.')
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
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
