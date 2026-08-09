import { describe, expect, it } from "vitest";
import {
  firebaseConfig,
  isValidFirebaseWebConfig,
} from "./firebase-config.js";
import { initFirebase } from "./firebase-init.js";

describe("compact firebase-config", () => {
  it("exports a valid Components USA web config", () => {
    expect(isValidFirebaseWebConfig(firebaseConfig)).toBe(true);
    expect(firebaseConfig.projectId).toBe("components-usa-archive-demo");
    expect(firebaseConfig.appId).toContain("compact-archive-demo");
  });
});

describe("compact firebase-init", () => {
  it("initializes with injected SDK functions", () => {
    const result = initFirebase({
      initializeAppFn: (cfg) => ({ cfg }),
      getAnalyticsFn: (app) => ({ measured: true, app }),
    });
    expect(result.analytics.measured).toBe(true);
  });

  it("throws on invalid config", () => {
    expect(() =>
      initFirebase({
        initializeAppFn: () => ({}),
        getAnalyticsFn: () => ({}),
        config: { apiKey: "only" },
      }),
    ).toThrow(/invalid/i);
  });
});
