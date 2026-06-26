const { test, expect } = require("@playwright/test");

test.describe("Portfolio Content & Structure", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("about section contains correct stats", async ({ page }) => {
    const stats = page.locator("#about .stat-card");
    await expect(stats).toHaveCount(4);
    await expect(stats.nth(0)).toContainText("20+");
    await expect(stats.nth(1)).toContainText("15+");
    await expect(stats.nth(2)).toContainText("500+");
    await expect(stats.nth(3)).toContainText("30%+");
  });

  test("expertise section contains expected specializations", async ({
    page,
  }) => {
    const cards = page.locator("#expertise .expertise-card");
    await expect(cards).toHaveCount(4);
    await expect(cards.nth(0).locator("h3")).toContainText("Cloud Solutions");
    await expect(cards.nth(1).locator("h3")).toContainText(
      "DevSecOps & GitOps",
    );
    await expect(cards.nth(2).locator("h3")).toContainText("Kubernetes");
    await expect(cards.nth(3).locator("h3")).toContainText("MLOps");
  });

  test("case studies cards contain correct metadata, headings, and skill tags", async ({
    page,
  }) => {
    const casesTrack = page.locator("#cases-track .case-card");

    const expectedCasesData = [
      {
        meta: ["METRO Digital", "GCP / NoSQL"],
        heading: "GCP & NoSQL Database Migration",
        tags: ["GCP", "Kustomize", "NoSQL"],
      },
      {
        meta: ["METRO Digital", "GitOps / K8s"],
        heading: "GitOps & ArgoCD Migration",
        tags: ["ArgoCD", "GitOps", "Terraform"],
      },
      {
        meta: ["METRO Digital", "Networking"],
        heading: "Web Routing Architecture",
        tags: ["Gateway API", "GCP PSC", "Networking"],
      },
      {
        meta: ["METRO Digital", "Security"],
        heading: "Enterprise Secrets Management",
        tags: ["Secret Manager", "SOPS", "Security"],
      },
      {
        meta: ["METRO Digital", "CI/CD Automation"],
        heading: "Dynamic CI Pipelines & Helm",
        tags: ["Jenkins", "Helm", "CI/CD"],
      },
      {
        meta: ["Voyc AI", "AWS / EKS"],
        heading: "AI-Powered Scaling Architecture",
        tags: ["OpenTofu", "Karpenter", "GPU Instances"],
      },
      {
        meta: ["Consulting", "GCP / Python"],
        heading: "Cloud Architecture & ETL",
        tags: ["Apache Airflow", "ETL", "BigQuery"],
      },
      {
        meta: ["American Robotics", "AWS / Jenkins"],
        heading: "DevOps Transformation",
        tags: ["AWS EKS", "Terragrunt", "ArgoCD"],
      },
      {
        meta: ["Media Company", "Hybrid Cloud"],
        heading: "Next Gen TV Platform",
        tags: ["Hybrid Cloud", "Azure DevOps", "Kafka"],
      },
      {
        meta: ["Smart City", "GCP / GKE"],
        heading: "Intelligent Traffic Platform",
        tags: ["Smart City", "GKE", "IoT"],
      },
      {
        meta: ["E-Commerce", "K8s / Ansible"],
        heading: "Platform Migration & Architecture",
        tags: ["Kubernetes", "Ansible", "Helm"],
      },
      {
        meta: ["Global Logistics", "CI/CD"],
        heading: "Legacy Systems Modernization",
        tags: ["CI/CD", "Modernization", "Microservices"],
      },
    ];

    for (let i = 0; i < expectedCasesData.length; i++) {
      const card = casesTrack.nth(i);

      // Check Metadata
      const metaSpans = card.locator(".case-meta span");
      await expect(metaSpans).toHaveCount(2);
      await expect(metaSpans.nth(0)).toHaveText(expectedCasesData[i].meta[0]);
      await expect(metaSpans.nth(1)).toHaveText(expectedCasesData[i].meta[1]);

      // Check Heading
      await expect(card.locator("h3")).toHaveText(expectedCasesData[i].heading);

      // Check Tags
      const tags = card.locator(".tag-list .tag");
      await expect(tags).toHaveCount(expectedCasesData[i].tags.length);
      for (let j = 0; j < expectedCasesData[i].tags.length; j++) {
        await expect(tags.nth(j)).toHaveText(expectedCasesData[i].tags[j]);
      }
    }
  });

  test("open source contributions contain correct metadata, headings, tags, and links", async ({
    page,
  }) => {
    const osTrack = page.locator("#os-track .case-card");
    await expect(osTrack).toHaveCount(6);

    const expectedOSData = [
      {
        meta: ["Owner & Author", "Portfolio Codebase"],
        heading: "korn.systems Website",
        tags: ["HTML/CSS/JS", "GitHub Actions", "Playwright"],
        hasLink: false,
      },
      {
        meta: ["Owner & Author", "Terraform Registry"],
        heading: "terraform-spaceship-github-pages",
        tags: ["Terraform", "Spaceship", "GitHub Pages"],
        hasLink: false,
      },
      {
        meta: ["Contributor", "AI Coding Agents"],
        heading: "terraform-skill",
        tags: ["AI Agents", "Terraform", "LLM"],
        hasLink: true,
      },
      {
        meta: ["Contributor", "AI Coding Agents"],
        heading: "agent-plugins",
        tags: ["AI Agents", "LSP", "LLM"],
        hasLink: true,
      },
      {
        meta: ["Google CFT", "Open Source"],
        heading: "Cloud Foundation Toolkit",
        tags: ["Google Org", "Automation"],
        hasLink: true,
      },
      {
        meta: ["Google CFT", "Open Source"],
        heading: "Terraform Google Modules",
        tags: ["Terraform Modules", "Go Tests"],
        hasLink: true,
      },
    ];

    for (let i = 0; i < expectedOSData.length; i++) {
      const card = osTrack.nth(i);

      // Check Metadata
      const metaSpans = card.locator(".case-meta span");
      await expect(metaSpans).toHaveCount(2);
      await expect(metaSpans.nth(0)).toHaveText(expectedOSData[i].meta[0]);
      await expect(metaSpans.nth(1)).toHaveText(expectedOSData[i].meta[1]);

      // Check Heading
      await expect(card.locator("h3")).toHaveText(expectedOSData[i].heading);

      // Check Tags
      const tags = card.locator(".tag-list .tag");
      await expect(tags).toHaveCount(expectedOSData[i].tags.length);
      for (let j = 0; j < expectedOSData[i].tags.length; j++) {
        await expect(tags.nth(j)).toHaveText(expectedOSData[i].tags[j]);
      }

      // Check Links
      if (expectedOSData[i].hasLink) {
        const link = card.locator(".case-links a");
        await expect(link).toBeAttached();
        await expect(link).toContainText("View GitHub");
        await expect(link.locator("i.fa-github")).toBeAttached();
      }
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

  test("contains tech consultation block with correct wording and attributes", async ({
    page,
  }) => {
    await page.goto("/ai/");
    const consultationSection = page.locator(
      "section:has-text('Book a 30-Min Tech Consultation')",
    );
    await expect(consultationSection).toBeVisible();

    await expect(consultationSection.locator("h3")).toContainText(
      "Book a 30-Min Tech Consultation",
    );
    await expect(
      consultationSection
        .locator("p")
        .filter({ hasText: "Schedule a focused" }),
    ).toBeVisible();

    const scheduleBtn = consultationSection.locator("a.open-booking");
    await expect(scheduleBtn).toBeVisible();
    await expect(scheduleBtn).toContainText("Schedule meeting");
    await expect(scheduleBtn).toHaveAttribute("href", "#");
    await expect(scheduleBtn).toHaveAttribute(
      "onclick",
      "openCalendarModal(event)",
    );
  });
});
