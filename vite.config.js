import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: [
      "**/*.test.js",
      "tests/**/*.test.js",
    ],
    exclude: ["node_modules", "dist", "coverage"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // Product JS only — not vendor/jquery/plugins bundles or tests.
      include: [
        "prominent.components-usa.com/js/firebase-config.js",
        "prominent.components-usa.com/js/firebase-init.js",
        "prominent.components-usa.com/js/site-behavior.js",
        "compact.components-usa.com/js/firebase-config.js",
        "compact.components-usa.com/js/firebase-init.js",
        "compact.components-usa.com/js/site-behavior.js",
      ],
      thresholds: {
        // Hit 100% in suite; CI floor 95% so we do not silently slip.
        statements: 95,
        branches: 95,
        functions: 95,
        lines: 95,
      },
    },
  },
});
