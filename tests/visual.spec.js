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
  test("case studies carousel visual layout", async ({ page }) => {
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
      { maxDiffPixelRatio: 0.035 },
    );

    // Test every single item visually
    const cards = page.locator("#cases-track .case-card");
    const count = await cards.count();
    const nextBtn = page.locator("#case-studies .carousel-btn.next");

    for (let i = 0; i < count; i++) {
      // Ensure the card is fully in view by directly setting scrollLeft to avoid Safari snap hangs
      await page.evaluate((index) => {
        const track = document.querySelector("#cases-track");
        const cards = track.querySelectorAll(".case-card");
        track.scrollLeft = cards[index].offsetLeft;
      }, i);
      await page.waitForTimeout(200);

      const box = await cards.nth(i).boundingBox();
      await expect(page).toHaveScreenshot(`case-study-card-${i}.png`, {
        clip: {
          x: Math.max(0, Math.round(box.x)),
          y: Math.max(0, Math.round(box.y)),
          width: 400,
          height: 450,
        },
        maxDiffPixelRatio: 0.025,
      });
    }
  });

  test("open source carousel visual layout", async ({ page }) => {
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
      maxDiffPixelRatio: 0.035,
    });

    const cards = page.locator("#os-track .case-card");
    const count = await cards.count();

    for (let i = 0; i < count; i++) {
      await page.evaluate((index) => {
        const track = document.querySelector("#os-track");
        const cards = track.querySelectorAll(".case-card");
        track.scrollLeft = cards[index].offsetLeft;
      }, i);
      await page.waitForTimeout(200);

      const box = await cards.nth(i).boundingBox();
      await expect(page).toHaveScreenshot(`open-source-card-${i}.png`, {
        clip: {
          x: Math.max(0, Math.round(box.x)),
          y: Math.max(0, Math.round(box.y)),
          width: 400,
          height: 450,
        },
        maxDiffPixelRatio: 0.025,
      });
    }
  });

  test("ai page full visual layout", async ({ page }) => {
    await page.goto("/ai/");
    await expect(page).toHaveScreenshot("ai-page-full.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.025,
    });
  });
});
