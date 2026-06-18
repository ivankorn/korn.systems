const { test, expect } = require('@playwright/test');

// Configure visual comparisons to allow a 2.5% pixel difference
expect.extend({
  toMatchSnapshot(received, ...args) {
    return expect(received).toMatchSnapshot(...args, { maxDiffPixelRatio: 0.025 });
  },
});

test.describe('Visual Regression Tests', () => {
  test('case studies carousel visual layout', async ({ page }) => {
    await page.goto('/');
    const caseStudiesSection = page.locator('#case-studies');
    await caseStudiesSection.scrollIntoViewIfNeeded();
    await expect(caseStudiesSection).toHaveScreenshot('case-studies-section.png', { maxDiffPixelRatio: 0.025 });
  });

  test('open source carousel visual layout', async ({ page }) => {
    await page.goto('/');
    const osSection = page.locator('#open-source');
    await osSection.scrollIntoViewIfNeeded();
    await expect(osSection).toHaveScreenshot('open-source-section.png', { maxDiffPixelRatio: 0.025 });
  });

  test('ai page full visual layout', async ({ page }) => {
    await page.goto('/ai/');
    await expect(page).toHaveScreenshot('ai-page-full.png', { fullPage: true, maxDiffPixelRatio: 0.025 });
  });
});
