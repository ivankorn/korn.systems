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
    await page.goto("/");
    const caseStudiesSection = page.locator("#case-studies");
    await caseStudiesSection.scrollIntoViewIfNeeded();

    const track = page.locator('#cases-track');
    const nextBtn = page.locator('#case-studies .carousel-btn.next');

    // First screenshot
    await expect(caseStudiesSection).toHaveScreenshot(
      "case-studies-section-0.png",
      { maxDiffPixelRatio: 0.025 },
    );

    let scrollIndex = 1;
    let prevScrollLeft = -1;
    
    // Scroll and take screenshots until the end
    while (scrollIndex < 15) {
      let currentScroll = await track.evaluate(node => node.scrollLeft);
      if (currentScroll === prevScrollLeft) break; 
      
      prevScrollLeft = currentScroll;
      await nextBtn.click();
      await page.waitForTimeout(500); // wait for smooth scroll animation
      
      let newScroll = await track.evaluate(node => node.scrollLeft);
      if (newScroll === currentScroll) break; // Didn't scroll further

      await expect(caseStudiesSection).toHaveScreenshot(
        `case-studies-section-${scrollIndex}.png`,
        { maxDiffPixelRatio: 0.025 },
      );
      scrollIndex++;
    }
  });

  test("open source carousel visual layout", async ({ page }) => {
    await page.goto("/");
    const osSection = page.locator("#open-source");
    await osSection.scrollIntoViewIfNeeded();

    const track = page.locator('#os-track');
    const nextBtn = page.locator('#open-source .carousel-btn.next');

    await expect(osSection).toHaveScreenshot(
      "open-source-section-0.png", 
      { maxDiffPixelRatio: 0.025 }
    );

    let scrollIndex = 1;
    let prevScrollLeft = -1;

    while (scrollIndex < 10) {
      let currentScroll = await track.evaluate(node => node.scrollLeft);
      if (currentScroll === prevScrollLeft) break; 
      
      prevScrollLeft = currentScroll;
      await nextBtn.click();
      await page.waitForTimeout(500); 
      
      let newScroll = await track.evaluate(node => node.scrollLeft);
      if (newScroll === currentScroll) break;

      await expect(osSection).toHaveScreenshot(
        `open-source-section-${scrollIndex}.png`,
        { maxDiffPixelRatio: 0.025 },
      );
      scrollIndex++;
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
