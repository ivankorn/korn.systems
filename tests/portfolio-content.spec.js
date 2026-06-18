const { test, expect } = require("@playwright/test");

test.describe("Portfolio Content & Structure", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("contains exactly 12 case studies with correct headers", async ({
    page,
  }) => {
    const casesTrack = page.locator("#cases-track .case-card");
    await expect(casesTrack).toHaveCount(12);

    const expectedHeaders = [
      "GCP & NoSQL Database Migration",
      "GitOps & ArgoCD Migration",
      "Web Routing Architecture",
      "Enterprise Secrets Management",
      "Dynamic CI Pipelines & Helm",
      "AI-Powered Scaling Architecture",
      "Cloud Architecture & ETL",
      "DevOps Transformation",
      "Next Gen TV Platform",
      "Intelligent Traffic Platform",
      "Platform Migration & Architecture",
      "Legacy Systems Modernization",
    ];

    for (let i = 0; i < expectedHeaders.length; i++) {
      await expect(casesTrack.nth(i).locator("h3")).toContainText(
        expectedHeaders[i],
      );
    }
  });

  test("contains exactly 6 open source contributions with correct headers", async ({
    page,
  }) => {
    const osTrack = page.locator("#os-track .case-card");
    await expect(osTrack).toHaveCount(6);

    const expectedHeaders = [
      "korn.systems Website",
      "terraform-spaceship-github-pages",
      "terraform-skill",
      "agent-plugins",
      "Cloud Foundation Toolkit",
      "Terraform Google Modules",
    ];

    for (let i = 0; i < expectedHeaders.length; i++) {
      await expect(osTrack.nth(i).locator("h3")).toContainText(
        expectedHeaders[i],
      );
    }
  });

  test("timeline contains correct number of experience items", async ({
    page,
  }) => {
    const timelineItems = page.locator("#experience .timeline-item");
    // On main, there are 7 timeline items (Item 0 to Item 6)
    await expect(timelineItems).toHaveCount(7);
  });

  test("ROI calculator elements are present", async ({ page }) => {
    await expect(page.locator("#cloud-spend")).toBeVisible();
    await expect(page.locator("#team-size")).toBeVisible();
    await expect(page.locator("#deploy-freq")).toBeVisible();
    await expect(page.locator("#annual-savings")).toBeVisible();
  });
});

test.describe("AI Page Content", () => {
  test("contains correct AI content structure", async ({ page }) => {
    await page.goto("/ai/");
    await expect(page.locator("h1")).toContainText(
      "Engineering AI-Powered Solutions",
    );
    await expect(page.locator("#ai-portfolio .case-card")).toHaveCount(1);
    await expect(page.locator("#ai-portfolio .case-card h3")).toContainText(
      "AI-Powered Calls Assistant",
    );
  });
});
