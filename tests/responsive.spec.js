const { test, expect } = require("@playwright/test");

test.describe("Responsive Navigation and Layout Tests", () => {
  test("Main navigation should be hidden on mobile, and toggle should show it", async ({
    page,
    isMobile,
  }) => {
    // Only run this test if we are testing on a mobile viewport (handled by Playwright projects)
    if (!isMobile) test.skip();

    await page.goto("/");

    const mobileMenuToggle = page.locator(".mobile-menu-toggle");
    const mainNav = page.locator('nav[aria-label="Main Navigation"] ul');

    // The toggle button should be visible on mobile
    await expect(mobileMenuToggle).toBeVisible();

    // The navigation menu should initially be hidden (display: none via active class toggle)
    await expect(mainNav).not.toBeVisible();

    // Click the toggle
    await mobileMenuToggle.click({ force: true });

    // The navigation menu should now be visible
    await expect(mainNav).toBeVisible();

    // Test the same on the AI page
    await page.goto("/ai/");
    await expect(page.locator(".mobile-menu-toggle")).toBeVisible();
  });

  test("Main navigation should be visible natively on desktop without toggle", async ({
    page,
    isMobile,
  }) => {
    if (isMobile) test.skip();

    await page.goto("/");

    const mobileMenuToggle = page.locator(".mobile-menu-toggle");
    const mainNav = page.locator('nav[aria-label="Main Navigation"] ul');

    // Toggle should be hidden on desktop
    await expect(mobileMenuToggle).not.toBeVisible();

    // Menu should be visible naturally
    await expect(mainNav).toBeVisible();
  });

  test("Timeline layout should not overflow on mobile", async ({
    page,
    isMobile,
  }) => {
    if (!isMobile) test.skip();

    await page.goto("/");

    // Check the first timeline item (odd) and second timeline item (even)
    const firstTimelineItem = page.locator(".timeline-item").nth(0);
    const secondTimelineItem = page.locator(".timeline-item").nth(1);

    // Assert that the timeline items have left: 0 to avoid being pushed offscreen on mobile
    await expect(firstTimelineItem).toHaveCSS("left", "0px");
    await expect(secondTimelineItem).toHaveCSS("left", "0px");

    // Check that width is essentially 100% (the actual width might depend on padding, but it should span the container)
    // This is implicitly tested by checking the left position and ensuring no overflow, but we can verify visibility.
    await expect(firstTimelineItem).toBeVisible();
    await expect(secondTimelineItem).toBeVisible();
  });

  test("AI Portfolio section is linked from main site and ordered correctly", async ({
    page,
    isMobile,
  }) => {
    await page.goto("/");

    // Look for the link to the AI Portfolio
    const aiLink = page.locator(
      'nav[aria-label="Main Navigation"] a[href="/ai/"]',
    );

    if (isMobile) {
      await page.locator(".mobile-menu-toggle").click({ force: true });
    }

    await expect(aiLink).toBeVisible();

    // Click it and verify it goes to the correct page
    // On mobile we'd need to open the menu first, so let's just go to the URL directly for the next checks
    await page.goto("/ai/");

    // Check the order: #ai-portfolio should appear before #contact
    // We can evaluate the DOM order
    const isOrderedCorrectly = await page.evaluate(() => {
      const aiPortfolio = document.getElementById("ai-portfolio");
      const contact = document.getElementById("contact");
      // compareDocumentPosition returns a bitmask.
      // 4 means Node.DOCUMENT_POSITION_FOLLOWING (contact follows aiPortfolio)
      return !!(
        aiPortfolio.compareDocumentPosition(contact) &
        Node.DOCUMENT_POSITION_FOLLOWING
      );
    });

    expect(isOrderedCorrectly).toBe(true);
  });
});
