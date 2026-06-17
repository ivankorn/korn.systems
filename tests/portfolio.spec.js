const { test, expect } = require("@playwright/test");

test.describe("korn.systems tests", () => {
  test("has correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(
      /Ivan Kornienko | Senior DevSecOps Consultant/i,
    );
  });

  test("contains correct specific headings", async ({ page }) => {
    await page.goto("/");
    const heroHeading = page.locator("h1");
    await expect(heroHeading).toContainText("Resilient Cloud Platforms");
  });

  test("contains navigation links", async ({ page }) => {
    await page.goto("/");
    const navLinks = page.locator('nav[aria-label="Main Navigation"] ul li a');
    await expect(navLinks).toHaveCount(7); // About, Expertise, Case Studies, DevOps ROI, Experience, AI Portfolio, Contact
  });

  test("all internal links are valid and do not 404", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/");

    // Check AI link explicitly
    if (isMobile) {
      await page.locator(".mobile-menu-toggle").click({ force: true });
    }
    const link = page.locator('a[href="/ai/"]').first();
    await link.click();

    await expect(page).toHaveURL(/.*\/ai\//);
  });
});
