import { defineConfig } from "vitest/config";

// Unit + component tests (Developer C: src/features/**, Section A: src/lib/**, src/components/**).
// Browser tests in e2e/ run with `npm run test:e2e` (Playwright).
export default defineConfig({
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: false,
  },
});
