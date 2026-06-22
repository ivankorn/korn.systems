const { test, expect } = require("@playwright/test");

test.describe("Carousel Interaction Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("case studies carousel should scroll when next and prev buttons are clicked", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const originalScrollBy = Element.prototype.scrollBy;
      Element.prototype.scrollBy = function (options) {
        if (typeof options === "object") {
          options.behavior = "auto";
        }
        return originalScrollBy.call(this, options);
      };
    });
    await page.addStyleTag({
      content: "* { scroll-behavior: auto !important; }",
    });
    const track = page.locator("#cases-track");
    const nextBtn = page.locator("#case-studies .carousel-btn.next");
    const prevBtn = page.locator("#case-studies .carousel-btn.prev");

    await expect(page.locator("#cases-track .case-card").first()).toBeVisible();
    await track.scrollIntoViewIfNeeded();

    // Initial scroll position
    const initialScroll = await track.evaluate((node) => node.scrollLeft);

    // Click next
    await nextBtn.click();

    // Wait for smooth scrolling animation to finish
    await page.waitForTimeout(500);

    const scrolledLeft = await track.evaluate((node) => node.scrollLeft);
    expect(scrolledLeft).toBeGreaterThan(initialScroll);

    // Click prev
    await prevBtn.click();
    await page.waitForTimeout(500);

    const backScroll = await track.evaluate((node) => node.scrollLeft);
    expect(backScroll).toBeLessThan(scrolledLeft);
  });

  test("open source carousel should scroll when next and prev buttons are clicked", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      const originalScrollBy = Element.prototype.scrollBy;
      Element.prototype.scrollBy = function (options) {
        if (typeof options === "object") {
          options.behavior = "auto";
        }
        return originalScrollBy.call(this, options);
      };
    });
    await page.addStyleTag({
      content: "* { scroll-behavior: auto !important; }",
    });
    const track = page.locator("#os-track");
    const nextBtn = page.locator("#open-source .carousel-btn.next");
    const prevBtn = page.locator("#open-source .carousel-btn.prev");

    await expect(page.locator("#os-track .case-card").first()).toBeVisible();
    await track.scrollIntoViewIfNeeded();

    // Initial scroll position
    const initialScroll = await track.evaluate((node) => node.scrollLeft);

    // Click next
    await nextBtn.click();

    // Wait for smooth scrolling animation to finish
    await page.waitForTimeout(500);

    const scrolledLeft = await track.evaluate((node) => node.scrollLeft);
    expect(scrolledLeft).toBeGreaterThan(initialScroll);

    // Click prev
    await prevBtn.click();
    await page.waitForTimeout(500);

    const backScroll = await track.evaluate((node) => node.scrollLeft);
    expect(backScroll).toBeLessThan(scrolledLeft);
  });
});
