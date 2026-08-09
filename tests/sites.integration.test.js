import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { firebaseConfig as prominentConfig } from "../prominent.components-usa.com/js/firebase-config.js";
import { firebaseConfig as compactConfig } from "../compact.components-usa.com/js/firebase-config.js";

const sites = [
  {
    id: "prominent",
    dir: "prominent.components-usa.com",
    config: prominentConfig,
  },
  {
    id: "compact",
    dir: "compact.components-usa.com",
    config: compactConfig,
  },
];

describe("site pages (real trees)", () => {
  it("ships required files for both layouts", () => {
    for (const site of sites) {
      for (const rel of [
        "index.html",
        "404.html",
        "js/main.js",
        "js/firebase.js",
        "js/firebase-config.js",
        "js/firebase-init.js",
        "js/site-behavior.js",
      ]) {
        expect(existsSync(join(site.dir, rel)), `${site.id}:${rel}`).toBe(true);
      }
    }
  });

  it("keeps Components USA branding and FSB authorship in index HTML", () => {
    for (const site of sites) {
      const html = readFileSync(join(site.dir, "index.html"), "utf8");
      expect(html).toMatch(/Components USA/i);
      expect(html).toMatch(/Full Stack Boston/i);
      expect(html).toMatch(/js\/firebase\.js/);
      expect(html).toMatch(/js\/main\.js/);
    }
  });

  it("uses distinct Firebase appIds per layout", () => {
    expect(prominentConfig.appId).not.toBe(compactConfig.appId);
    expect(prominentConfig.projectId).toBe(compactConfig.projectId);
  });
});
