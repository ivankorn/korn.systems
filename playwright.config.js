const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
  use: {
    trace: "on-first-retry",
    baseURL: "http://localhost:3000",
  },
  webServer: {
    command: "npx -y serve . -p 3000",
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },

  projects: process.env.CI
    ? [
        {
          name: "chromium",
          use: {
            ...devices["Desktop Chrome"],
            viewport: { width: 1440, height: 900 },
          },
        },
        {
          name: "Mobile Chrome",
          use: { ...devices["Pixel 10"] },
        },
      ]
    : [
        {
          name: "chromium",
          use: {
            ...devices["Desktop Chrome"],
            viewport: { width: 1440, height: 900 },
          },
        },
        {
          name: "firefox",
          use: {
            ...devices["Desktop Firefox"],
            viewport: { width: 1440, height: 900 },
          },
        },
        {
          name: "webkit",
          use: {
            ...devices["Desktop Safari"],
            viewport: { width: 1440, height: 900 },
          },
        },
        {
          name: "Mobile Chrome",
          use: { ...devices["Pixel 10"] },
        },
        {
          name: "Mobile Safari",
          use: { ...devices["iPhone 17"] },
        },
      ],
});
