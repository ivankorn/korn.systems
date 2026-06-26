const { test, expect } = require("@playwright/test");

test.describe("Visual Regression Tests", () => {
  test("index page sections visual layout", async ({ page }, testInfo) => {
    await page.goto("/");
    await page.addStyleTag({
      content: `
      * { scroll-behavior: auto !important; }
      * { scroll-behavior: auto !important; }
      .pulse-dot, .network-flow, .ambient-glow-1, .ambient-glow-2, .terminal-window { animation: none !important; display: none !important; }
    `,
    });

    const sections = [
      "header",
      "hero",
      "about",
      "expertise",
      "roi-calc",
      "experience",
      "contact",
    ];

    for (const sectionId of sections) {
      const section = page.locator(`#${sectionId}`);
      await section.scrollIntoViewIfNeeded();

      // Take screenshot of the section layout
      await expect(section).toHaveScreenshot(
        `${sectionId}-section-layout.png`,
        {},
      );

      // Hide header permanently after capturing it, so it doesn't overlap other sections
      if (sectionId === "header") {
        await page.evaluate(() => {
          const h = document.querySelector("header");
          if (h) h.remove();
        });
      }
    }
  });

  test("case studies carousel visual layout", async ({
    page,
    isMobile,
  }, testInfo) => {
    await page.addInitScript(() => {
      const originalScrollBy = Element.prototype.scrollBy;
      Element.prototype.scrollBy = function (options) {
        if (typeof options === "object") {
          options.behavior = "auto";
        }
        return originalScrollBy.call(this, options);
      };
    });
    await page.goto("/");
    await page.addStyleTag({
      content: `
      * { scroll-behavior: auto !important; }
      * { scroll-behavior: auto !important; }
      * { scroll-behavior: auto !important; }
      #case-studies, #open-source { box-sizing: border-box !important; overflow: hidden !important; border: none !important; margin: 0 !important; }
      .case-card { box-sizing: border-box !important; overflow: hidden !important; }
      .pulse-dot, .network-flow, .ambient-glow-1, .ambient-glow-2 { animation: none !important; display: none !important; }
      header { display: none !important; }
    `,
    });

    await page.evaluate(() => {
      const h = document.querySelector("header");
      if (h) h.remove();
    });

    const caseStudiesSection = page.locator("#case-studies");
    await caseStudiesSection.scrollIntoViewIfNeeded();

    // First screenshot of the section layout (headers, buttons, track)
    await expect(caseStudiesSection).toHaveScreenshot(
      "case-studies-section-layout.png",
      {},
    );

    // Test every single item visually
    const cards = page.locator("#cases-track .case-card");
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      // Ensure the card is fully in view by directly setting scrollLeft to avoid Safari snap hangs
      await page.evaluate((index) => {
        const track = document.querySelector("#cases-track");
        const cards = track.querySelectorAll(".case-card");
        const card = cards[index];
        const trackRect = track.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        track.scrollBy({
          left: cardRect.left - trackRect.left,
          behavior: "instant",
        });

        // Force integer Y coordinate to avoid 451px fractional screenshot rounding
        const y = card.getBoundingClientRect().y;
        if (y % 1 !== 0) {
          window.scrollBy(0, y % 1);
        }
      }, i);
      await expect(cards.nth(i)).toHaveScreenshot(`case-study-card-${i}.png`);
    }
  });

  test("open source carousel visual layout", async ({
    page,
    isMobile,
  }, testInfo) => {
    await page.addInitScript(() => {
      const originalScrollBy = Element.prototype.scrollBy;
      Element.prototype.scrollBy = function (options) {
        if (typeof options === "object") {
          options.behavior = "auto";
        }
        return originalScrollBy.call(this, options);
      };
    });
    await page.goto("/");
    await page.addStyleTag({
      content: `
      * { scroll-behavior: auto !important; }
      * { scroll-behavior: auto !important; }
      #case-studies, #open-source { box-sizing: border-box !important; overflow: hidden !important; border: none !important; margin: 0 !important; }
      .case-card { box-sizing: border-box !important; overflow: hidden !important; }
      .pulse-dot, .network-flow, .ambient-glow-1, .ambient-glow-2 { animation: none !important; display: none !important; }
      header { display: none !important; }
    `,
    });

    await page.evaluate(() => {
      const h = document.querySelector("header");
      if (h) h.remove();
    });

    const osSection = page.locator("#open-source");
    await osSection.scrollIntoViewIfNeeded();

    await expect(osSection).toHaveScreenshot("open-source-section-layout.png");

    const cards = page.locator("#os-track .case-card");
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      await page.evaluate((index) => {
        const track = document.querySelector("#os-track");
        const cards = track.querySelectorAll(".case-card");
        const card = cards[index];
        const trackRect = track.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        track.scrollBy({
          left: cardRect.left - trackRect.left,
          behavior: "instant",
        });

        // Force integer Y coordinate to avoid 451px fractional screenshot rounding
        const y = card.getBoundingClientRect().y;
        if (y % 1 !== 0) {
          window.scrollBy(0, y % 1);
        }
      }, i);
      await expect(cards.nth(i)).toHaveScreenshot(`open-source-card-${i}.png`);
    }
  });

  test("ai page full visual layout", async ({ page }, testInfo) => {
    await page.goto("/ai/");
    await page.addStyleTag({
      content: `
      * { scroll-behavior: auto !important; }
      * { scroll-behavior: auto !important; }
      .pulse-dot, .network-flow, .ambient-glow-1, .ambient-glow-2 { animation: none !important; display: none !important; }
    `,
    });
    await expect(page).toHaveScreenshot("ai-page-full.png", {
      fullPage: true,
    });
  });

  test("mobile menu open layout", async ({ page, isMobile }, testInfo) => {
    // Only run this test for mobile viewports
    if (!isMobile) return;
    // Test on main page
    await page.goto("/");
    await page.addStyleTag({
      content: `
      * { scroll-behavior: auto !important; }
      * { scroll-behavior: auto !important; }
      .pulse-dot, .network-flow, .ambient-glow-1, .ambient-glow-2 { animation: none !important; display: none !important; }
    `,
    });

    await page.locator(".mobile-menu-toggle").click();
    await expect(
      page.locator('nav[aria-label="Main Navigation"] ul'),
    ).toHaveClass(/active/);

    await expect(page).toHaveScreenshot("mobile-menu-open-index.png");

    // Test on AI page
    await page.goto("/ai/");
    await page.addStyleTag({
      content: `
      * { scroll-behavior: auto !important; }
      * { scroll-behavior: auto !important; }
      .pulse-dot, .network-flow, .ambient-glow-1, .ambient-glow-2 { animation: none !important; display: none !important; }
    `,
    });

    await page.locator(".mobile-menu-toggle").click();
    await expect(
      page.locator('nav[aria-label="Main Navigation"] ul'),
    ).toHaveClass(/active/);

    await expect(page).toHaveScreenshot("mobile-menu-open-ai.png");
  });

  test.describe("Post-Click Navigation Visual Tests", () => {
    const anchors = [
      { name: "About", hash: "#about" },
      { name: "Expertise", hash: "#expertise" },
      { name: "Case Studies", hash: "#case-studies" },
      { name: "DevOps ROI", hash: "#roi-calc" },
      { name: "Experience", hash: "#experience" },
      { name: "Contact", hash: "#contact" },
    ];

    anchors.forEach(({ name, hash }) => {
      test(`from index.html to ${name} visual layout`, async ({
        page,
        isMobile,
      }, testInfo) => {
        await page.goto("/");
        await page.addStyleTag({
          content: `
      * { scroll-behavior: auto !important; }
          * { scroll-behavior: auto !important; }
          .pulse-dot, .network-flow, .ambient-glow-1, .ambient-glow-2 { animation: none !important; display: none !important; }
        `,
        });

        await page
          .waitForSelector(".case-card", { state: "visible", timeout: 5000 })
          .catch(() => {});

        if (isMobile) {
          await page.locator(".mobile-menu-toggle").click();
          await expect(
            page.locator('nav[aria-label="Main Navigation"] ul'),
          ).toHaveClass(/active/);
        }

        const link = page.locator(
          `nav[aria-label="Main Navigation"] ul a:text-is("${name}")`,
        );
        await link.click();

        await page.waitForURL(`**/${hash}`);
        await page.waitForTimeout(300);

        await page.addStyleTag({
          content: `
          header { display: none !important; } * { scroll-behavior: auto !important; }
          ::-webkit-scrollbar { display: none !important; }
          body, html { scrollbar-width: none !important; -ms-overflow-style: none !important; overflow-x: hidden !important; }`,
        });

        await expect(page).toHaveScreenshot(
          `post-click-index-${name.replace(/\s+/g, "-").toLowerCase()}.png`,
          {},
        );
      });

      test(`from /ai/ to ${name} visual layout`, async ({
        page,
        isMobile,
      }, testInfo) => {
        await page.goto("/ai/");
        await page.addStyleTag({
          content: `
      * { scroll-behavior: auto !important; }
          * { scroll-behavior: auto !important; }
          .pulse-dot, .network-flow, .ambient-glow-1, .ambient-glow-2 { animation: none !important; display: none !important; }
        `,
        });

        if (isMobile) {
          await page.locator(".mobile-menu-toggle").click();
          await expect(
            page.locator('nav[aria-label="Main Navigation"] ul'),
          ).toHaveClass(/active/);
        }

        const link = page.locator(
          `nav[aria-label="Main Navigation"] ul a:text-is("${name}")`,
        );
        await link.click();

        await page.waitForURL(`**/${hash}`);
        await page.waitForTimeout(500);

        await page.addStyleTag({
          content: `
          header { display: none !important; } * { scroll-behavior: auto !important; }
          ::-webkit-scrollbar { display: none !important; }
          body, html { scrollbar-width: none !important; -ms-overflow-style: none !important; overflow-x: hidden !important; }`,
        });

        await expect(page).toHaveScreenshot(
          `post-click-ai-${name.replace(/\s+/g, "-").toLowerCase()}.png`,
          {},
        );
      });
    });

    test(`from index.html to AI Portfolio visual layout`, async ({
      page,
      isMobile,
    }, testInfo) => {
      await page.goto("/");
      await page.addStyleTag({
        content: `
      * { scroll-behavior: auto !important; }
        * { scroll-behavior: auto !important; }
        .pulse-dot, .network-flow, .ambient-glow-1, .ambient-glow-2 { animation: none !important; display: none !important; }
      `,
      });

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
      await page.waitForTimeout(300);

      await page.addStyleTag({
        content: `
          header { display: none !important; } * { scroll-behavior: auto !important; }
        ::-webkit-scrollbar { display: none !important; }
        body, html { scrollbar-width: none !important; -ms-overflow-style: none !important; overflow-x: hidden !important; }`,
      });

      await expect(page).toHaveScreenshot(`post-click-index-ai-portfolio.png`);
    });
  });
});
