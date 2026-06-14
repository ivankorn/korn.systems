const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('korn.systems tests', () => {
  let fileUrl;

  test.beforeAll(() => {
    const indexPath = path.resolve(__dirname, '../index.html');
    fileUrl = `file://${indexPath}`;
  });

  test('has correct title', async ({ page }) => {
    await page.goto(fileUrl);
    await expect(page).toHaveTitle(/Ivan Kornienko | Senior DevSecOps Consultant/i);
  });

  test('contains correct specific headings', async ({ page }) => {
    await page.goto(fileUrl);
    const heroHeading = page.locator('h1');
    await expect(heroHeading).toContainText('Resilient Cloud Platforms');
  });

  test('contains navigation links', async ({ page }) => {
    await page.goto(fileUrl);
    const navLinks = page.locator('nav[aria-label="Main Navigation"] ul li a');
    await expect(navLinks).toHaveCount(6); // About, Expertise, Case Studies, DevOps ROI, Experience, Contact
  });

  test('all internal links are valid and do not 404', async ({ page }) => {
    await page.goto(fileUrl);
    const hrefs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a'))
        .map(a => a.getAttribute('href'))
        .filter(href => href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:'));
    });
    
    // Deduplicate
    const uniqueHrefs = [...new Set(hrefs)];

    for (const href of uniqueHrefs) {
      await page.goto(fileUrl);
      const link = page.locator(`a[href="${href}"]`).first();
      await link.click({ force: true });
      // For file:// URLs, Playwright will throw an error automatically if the file does not exist (ERR_FILE_NOT_FOUND)
      // So reaching here means the file exists or the page loaded.
    }
  });
});
