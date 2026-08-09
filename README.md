# Components USA (public archive)

Public historical archive of **Components USA, LLC** marketing layouts built by
[Full Stack Boston](https://fullstackboston.com).

This is **not** a live client site, website template, or starter kit. Do not
copy, resell, or redistribute it as a drop-in design for other businesses.

**Museum demo:** [components-usa.fullstackboston.com](https://components-usa.fullstackboston.com)
(`noindex`; archive banner; Firebase stubbed)

Layouts in this monorepo:

- `/` (prominent) — fuller marketing layout
- `/compact/` — compact marketing layout

Real Firebase Hosting project credentials were **removed** before publication.
`firebase.js` is a no-op stub in the archive.

## CI

Coverage and tests target **product JS in each site tree** (`firebase-config.js`,
`firebase-init.js`, `site-behavior.js`). Thin browser glue (`firebase.js`,
`main.js`) wires those modules to the page and vendor globals. Vendor jQuery
bundles are excluded.

```bash
npm ci
npm run lint:prod
npm run test:coverage   # ≥80% on site product modules
npm run build           # verifies both site trees
```

## Credits

- Full Stack Boston / [Jonaldo Alix](https://jonaldoalix.com) — product and customization
- Components USA branding and copy belong to Components USA, LLC (archived for portfolio context)
