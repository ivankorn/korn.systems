const { test, expect } = require("@playwright/test");

test.describe("Menu Navigation and Routing Tests", () => {
  const anchors = [
    { name: "About", hash: "#about" },
    { name: "Expertise", hash: "#expertise" },
    { name: "Case Studies", hash: "#case-studies" },
    { name: "DevOps ROI", hash: "#roi-calc" },
    { name: "Experience", hash: "#experience" },
    { name: "Contact", hash: "#contact" },
  ];

  test.beforeEach(async ({ page }) => {
    // Disable smooth scrolling to prevent flaky anchor jumps in headless Firefox
    await page.addInitScript(() => {
      const style = document.createElement("style");
      style.textContent = "* { scroll-behavior: auto !important; }";
      document.addEventListener("DOMContentLoaded", () =>
        document.head.appendChild(style),
      );
    });
  });

  test.describe("Cross-Page Navigation (from /ai/ to index.html anchors)", () => {
    anchors.forEach(({ name, hash }) => {
      test(`Navigates to ${name} (${hash}) and correctly scrolls post-render`, async ({
        page,
        isMobile,
      }) => {
        // Start on the AI page
        await page.goto("/ai/");

        // If mobile, open the menu first
        if (isMobile) {
          await page.locator(".mobile-menu-toggle").click();
          await expect(
            page.locator('nav[aria-label="Main Navigation"] ul'),
          ).toHaveClass(/active/);
        }

        // Find the link with the specific name
        const link = page.locator(
          `nav[aria-label="Main Navigation"] ul a:text-is("${name}")`,
        );
        await link.click();

        // The browser should navigate to index.html and hash
        await page.waitForURL(`**/${hash}`);

        // Wait for dynamic content and smooth scrolling to settle
        await page.waitForTimeout(1500);

        // Assert that the target section is within the viewport bounds
        const targetSection = page.locator(hash);

        // Assert that the target section is within the viewport bounds
        await expect(async () => {
          await expect(targetSection).toBeInViewport({ ratio: 0.05 });
        }).toPass({ timeout: 5000 });

        // If mobile, ensure the menu is closed
        if (isMobile) {
          await expect(
            page.locator('nav[aria-label="Main Navigation"] ul'),
          ).not.toHaveClass(/active/);
        }
      });
    });
  });

  test.describe("Same-Page Navigation (from index.html to anchors)", () => {
    anchors.forEach(({ name, hash }) => {
      test(`Navigates to ${name} (${hash}) without losing scroll position`, async ({
        page,
        isMobile,
      }) => {
        // Start on the main page
        await page.goto("/");

        // Wait for dynamic content to load
        await page
          .waitForSelector(".case-card", { state: "visible", timeout: 5000 })
          .catch(() => {});

        if (isMobile) {
          await page.locator(".mobile-menu-toggle").click();
          await expect(
            page.locator('nav[aria-label="Main Navigation"] ul'),
          ).toHaveClass(/active/);
        }

        // Find the link with the specific name
        const link = page.locator(
          `nav[aria-label="Main Navigation"] ul a:text-is("${name}")`,
        );
        await link.click();

        // The browser should just change the hash and scroll
        await page.waitForURL(`**/${hash}`);
        await page.waitForTimeout(300); // Wait for smooth scrolling

        // Assert that the target section is within the viewport bounds
        const targetSection = page.locator(hash);
        await expect(targetSection).toBeInViewport({ ratio: 0.1 });

        // If mobile, ensure the menu is closed
        if (isMobile) {
          await expect(
            page.locator('nav[aria-label="Main Navigation"] ul'),
          ).not.toHaveClass(/active/);
        }
      });
    });
  });

  test.describe("AI Portfolio Navigation", () => {
    test("Navigates from index.html to AI Portfolio", async ({
      page,
      isMobile,
    }) => {
      await page.goto("/");

      if (isMobile) {
        await page.locator(".mobile-menu-toggle").click();
        await expect(
          page.locator('nav[aria-label="Main Navigation"] ul'),
        ).toHaveClass(/active/);
      }

      const link = page.locator(
        `nav[aria-label="Main Navigation"] ul a:text-is("AI Portfolio")`,
      );
      await link.click();

      await page.waitForURL("**/ai/");

      // Ensure we landed on the AI page
      await expect(page).toHaveTitle(/AI/);
    });

    test("Navigates from /ai/ to AI Portfolio (same page)", async ({
      page,
      isMobile,
    }) => {
      await page.goto("/ai/");

      if (isMobile) {
        await page.locator(".mobile-menu-toggle").click();
        await expect(
          page.locator('nav[aria-label="Main Navigation"] ul'),
        ).toHaveClass(/active/);
      }

      const link = page.locator(
        `nav[aria-label="Main Navigation"] ul a:text-is("AI Portfolio")`,
      );
      await link.click();

      await page.waitForURL("**/ai/");

      // Ensure we are still on the AI page
      await expect(page).toHaveTitle(/AI/);
    });
  });
});
