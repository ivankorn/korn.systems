const { test, expect } = require("@playwright/test");

// Configure visual comparisons to allow a 2.5% pixel difference
expect.extend({
  toMatchSnapshot(received, ...args) {
    return expect(received).toMatchSnapshot(...args, {
      maxDiffPixelRatio: 0.025,
    });
  },
});

test.describe("Visual Regression Tests", () => {
  test("case studies carousel visual layout", async ({ page }, testInfo) => {
    // Increase pixel ratio tolerance for webkit-based browsers which render fonts and shapes differently
    const isWebkit =
      testInfo.project.name.toLowerCase().includes("webkit") ||
      testInfo.project.name.toLowerCase().includes("safari");
    const dynamicPixelRatio = isWebkit ? 0.05 : 0.035;

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
      #case-studies, #open-source { height: 800px !important; max-height: 800px !important; box-sizing: border-box !important; overflow: hidden !important; border: none !important; margin: 0 !important; padding: 0 !important; }
      .case-card { height: 450px !important; width: 400px !important; box-sizing: border-box !important; overflow: hidden !important; }
    `,
    });

    const caseStudiesSection = page.locator("#case-studies");
    await caseStudiesSection.scrollIntoViewIfNeeded();

    // First screenshot of the section layout (headers, buttons, track)
    await expect(caseStudiesSection).toHaveScreenshot(
      "case-studies-section-layout.png",
      { maxDiffPixelRatio: dynamicPixelRatio },
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
      await expect(cards.nth(i)).toHaveScreenshot(`case-study-card-${i}.png`, {
        maxDiffPixelRatio: dynamicPixelRatio,
      });
    }
  });

  test("open source carousel visual layout", async ({ page }, testInfo) => {
    // Increase pixel ratio tolerance for webkit-based browsers which render fonts and shapes differently
    const isWebkit =
      testInfo.project.name.toLowerCase().includes("webkit") ||
      testInfo.project.name.toLowerCase().includes("safari");
    const dynamicPixelRatio = isWebkit ? 0.05 : 0.035;

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
      #case-studies, #open-source { height: 800px !important; max-height: 800px !important; box-sizing: border-box !important; overflow: hidden !important; border: none !important; margin: 0 !important; padding: 0 !important; }
      .case-card { height: 450px !important; width: 400px !important; box-sizing: border-box !important; overflow: hidden !important; }
    `,
    });

    const osSection = page.locator("#open-source");
    await osSection.scrollIntoViewIfNeeded();

    await expect(osSection).toHaveScreenshot("open-source-section-layout.png", {
      maxDiffPixelRatio: dynamicPixelRatio,
      mask: [page.locator("header")],
    });

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
      await expect(cards.nth(i)).toHaveScreenshot(`open-source-card-${i}.png`, {
        maxDiffPixelRatio: dynamicPixelRatio,
      });
    }
  });

  test("ai page full visual layout", async ({ page }, testInfo) => {
    const isWebkit =
      testInfo.project.name.toLowerCase().includes("webkit") ||
      testInfo.project.name.toLowerCase().includes("safari");
    const dynamicPixelRatio = isWebkit ? 0.04 : 0.025;

    await page.goto("/ai/");
    await expect(page).toHaveScreenshot("ai-page-full.png", {
      fullPage: true,
      maxDiffPixelRatio: dynamicPixelRatio,
    });
  });
});
