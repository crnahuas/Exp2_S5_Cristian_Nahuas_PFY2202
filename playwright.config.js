import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  expect: { timeout: 10000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4176",
    viewport: { width: 1440, height: 1000 },
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
      testIgnore: "**/development.spec.js",
    },
    {
      name: "firefox",
      use: { browserName: "firefox" },
      testIgnore: "**/development.spec.js",
    },
    {
      name: "webkit",
      use: { browserName: "webkit" },
      testIgnore: "**/development.spec.js",
    },
    {
      name: "desarrollo",
      testMatch: "**/development.spec.js",
      use: { browserName: "chromium", baseURL: "http://127.0.0.1:5175" },
    },
  ],
  webServer: [
    {
      command: "npm run dev -- --strictPort",
      url: "http://127.0.0.1:5175",
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "npm run preview -- --port 4176 --strictPort",
      url: "http://127.0.0.1:4176",
      reuseExistingServer: !process.env.CI,
    },
    {
      command:
        "npm run preview -- --port 4177 --base /Exp2_S5_Cristian_Nahuas_PFY2202/ --strictPort",
      url: "http://127.0.0.1:4177/Exp2_S5_Cristian_Nahuas_PFY2202/",
      reuseExistingServer: !process.env.CI,
    },
  ],
});
