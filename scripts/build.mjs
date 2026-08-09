import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { firebaseConfig as prominentConfig } from "../prominent.components-usa.com/js/firebase-config.js";
import { firebaseConfig as compactConfig } from "../compact.components-usa.com/js/firebase-config.js";
import { isValidFirebaseWebConfig as prominentValid } from "../prominent.components-usa.com/js/firebase-config.js";
import { isValidFirebaseWebConfig as compactValid } from "../compact.components-usa.com/js/firebase-config.js";

const root = process.cwd();
const outDir = join(root, "dist");

const sites = [
  {
    id: "prominent",
    dir: "prominent.components-usa.com",
    config: prominentConfig,
    valid: prominentValid,
  },
  {
    id: "compact",
    dir: "compact.components-usa.com",
    config: compactConfig,
    valid: compactValid,
  },
];

function requireFile(path) {
  if (!existsSync(path)) throw new Error(`Missing required file: ${path}`);
}

const manifest = { builtAt: new Date().toISOString(), sites: [] };

for (const site of sites) {
  const siteRoot = join(root, site.dir);
  for (const rel of [
    "index.html",
    "js/main.js",
    "js/firebase.js",
    "js/firebase-config.js",
    "js/firebase-init.js",
    "js/site-behavior.js",
  ]) {
    requireFile(join(siteRoot, rel));
  }

  const html = readFileSync(join(siteRoot, "index.html"), "utf8");
  if (!/Components USA/i.test(html)) {
    throw new Error(`${site.id} index.html missing Components USA branding`);
  }
  if (!site.valid(site.config)) {
    throw new Error(`${site.id} firebase config invalid`);
  }

  manifest.sites.push({
    id: site.id,
    dir: site.dir,
    projectId: site.config.projectId,
    appId: site.config.appId,
  });
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`Wrote ${join(outDir, "manifest.json")} for ${manifest.sites.length} sites`);
