import { test, expect } from '@playwright/test';

test('docs navigation respects motion preferences and keeps anchors visible', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/docs/getting-started');
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
  await page
    .locator('.docs-sidebar')
    .getByRole('link', { name: 'API overview' })
    .click();
  await expect(page).toHaveURL('/docs/api');
  await expect(page.locator('h1')).toBeVisible();
  expect(
    await page
      .locator('.docs-main')
      .evaluate(element => element.getAnimations().length)
  ).toBe(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'smooth');
  await page
    .locator('.docs-toc')
    .getByRole('link', { name: 'List challenges', exact: true })
    .click();
  await expect(page).toHaveURL('/docs/api#list-challenges');
  const heading = page.locator('h2#list-challenges');
  await expect
    .poll(() =>
      heading.evaluate(element =>
        Math.round(element.getBoundingClientRect().top)
      )
    )
    .toBeLessThan(250);
  expect(
    await heading.evaluate(element => element.getBoundingClientRect().top)
  ).toBeGreaterThanOrEqual(76);
  await expect(heading).toBeVisible();
});
