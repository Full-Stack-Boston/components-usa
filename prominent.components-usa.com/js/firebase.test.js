import { describe, expect, it } from "vitest";
import {
  firebaseConfig,
  isValidFirebaseWebConfig,
} from "./firebase-config.js";
import { initFirebase } from "./firebase-init.js";

describe("prominent firebase-config", () => {
  it("exports a valid Components USA web config", () => {
    expect(isValidFirebaseWebConfig(firebaseConfig)).toBe(true);
    expect(firebaseConfig.projectId).toBe("components-usa-archive-demo");
    expect(firebaseConfig.appId).toContain("prominent-archive-demo");
  });

  it("rejects incomplete configs", () => {
    expect(isValidFirebaseWebConfig(null)).toBe(false);
    expect(isValidFirebaseWebConfig({ apiKey: "x" })).toBe(false);
  });
});

describe("prominent firebase-init", () => {
  it("initializes with injected SDK functions", () => {
    const result = initFirebase({
      initializeAppFn: (cfg) => ({ name: "app", cfg }),
      getAnalyticsFn: (app) => ({ app, ok: true }),
    });
    expect(result.app.name).toBe("app");
    expect(result.analytics.ok).toBe(true);
  });

  it("requires SDK functions", () => {
    expect(() => initFirebase({})).toThrow(/sdk functions/i);
  });

  it("throws on invalid config", () => {
    expect(() =>
      initFirebase({
        initializeAppFn: () => ({}),
        getAnalyticsFn: () => ({}),
        config: {},
      }),
    ).toThrow(/invalid/i);
  });
});
