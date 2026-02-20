# Flowdence Docs (Public)

This repository hosts the public static docs site built with Astro + Starlight.

Canonical source markdown remains in:
- `/Users/rganatra/Documents/Projects/personal/atlassian-root/projects/main/flowdence-docs-private`

This repo imports that source, validates links/assets, and publishes static output for GitHub Pages.

## Stack

- Astro + Starlight
- Node.js (recommended: `>=20`)
- npm
- `gh-pages` CLI for manual branch deploys

## Required public routes

After build/deploy, these paths are available:
- `/docs`
- `/approvalflow/docs`
- `/mulesight/docs`

## Import contract (private -> public)

| Private source | Public destination |
|---|---|
| `flowdence-main/flowdence-policies/README.md` | `src/content/docs/docs/index.md` |
| `flowdence-main/flowdence-policies/**/*.md` (except `README.md`) | `src/content/docs/docs/flowdence-policies/**/*.md` |
| `flowdence-main/product-specific-policies/ApprovalFlow for Confluence/**/*.md` | `src/content/docs/docs/product-specific-policies/approvalflow/**/*.md` |
| `flowdence-main/product-specific-policies/MuleSight for Confluence/**/*.md` | `src/content/docs/docs/product-specific-policies/mulesight/**/*.md` |
| `flowdence-product-docs/ApprovalFlow for Confluence/overview.md` | `src/content/docs/approvalflow/docs/index.md` |
| `flowdence-product-docs/ApprovalFlow for Confluence/**/*.md` (except `overview.md`) | `src/content/docs/approvalflow/docs/**/*.md` |
| `flowdence-product-docs/MuleSight for Confluence/overview.md` | `src/content/docs/mulesight/docs/index.md` |
| `flowdence-product-docs/MuleSight for Confluence/**/*.md` (except `overview.md`) | `src/content/docs/mulesight/docs/**/*.md` |

## Asset handling

- Only assets referenced by markdown links/images are copied.
- `_staging` and `.DS_Store` are excluded.
- Referenced assets are copied to:
  - `src/content/docs/.../assets` (for Astro image resolution/optimization)
  - `public/.../assets` (for static video/file links like `.webm`)

## Sidebar labels from source folders

- `docs:import` also writes `src/generated/sidebar-labels.json`.
- Product labels are derived from private source folder names (for example `MuleSight for Confluence`).
- Update source folder names in private docs and re-run `npm run docs:import`; no manual sidebar label edits are needed in `astro.config.mjs`.

## Commands

### 1) Import private markdown + assets

```bash
npm run docs:import
```

Equivalent command:

```bash
node ./scripts/import-private-docs.mjs --private-root ../flowdence-docs-private --clean
```

Optional dry run:

```bash
npm run docs:import:dry
```

### 2) Validate local links/assets

```bash
npm run docs:validate
```

### 3) Build static output

```bash
npm run build
```

### 4) Local dev

```bash
npm run dev
```

## Hosting configuration (env-driven)

`astro.config.mjs` reads:

- `DOCS_SITE_URL`
- `DOCS_BASE_PATH`

Defaults are set for GitHub **project pages**:
- `DOCS_SITE_URL=https://flowdence.github.io`
- `DOCS_BASE_PATH=/flowdence-docs/`

## GitHub Pages setup (recommended: GitHub Actions)

Branch-based Pages deployment runs Jekyll and can drop Astro `_astro/*` assets. That causes the unstyled docs view.

Use Actions-based deployment instead:

1. In GitHub, open repository settings for `flowdence-docs`.
2. Go to **Pages**.
3. Set source to **GitHub Actions**.
4. Save.
5. Ensure workflow file exists:
   - `.github/workflows/deploy-pages.yml`

Deploy flow:

1. Import + validate locally:

```bash
npm run docs:import && npm run docs:validate
```

2. Commit and push `main`.
3. GitHub Actions builds Astro and deploys `dist` directly to Pages.

## Optional manual branch deploy (legacy)

You can still publish `dist` to `gh-pages` manually:

```bash
DOCS_SITE_URL="https://flowdence.github.io" \
DOCS_BASE_PATH="/flowdence-docs/" \
npm run docs:import && npm run docs:validate && npm run build && npm run deploy:ghpages
```

If you use this legacy flow, branch-mode Pages may still run Jekyll and break Astro styles/scripts.

## Future custom-domain switch (later)

When moving off project-pages base paths (for example to `docs.flowdence.io`):

1. Set:
   - `DOCS_SITE_URL=https://docs.flowdence.io`
   - `DOCS_BASE_PATH=/`
2. Rebuild and redeploy.
3. Add DNS + `CNAME` workflow at that time.

## Notes

- Private repo is the canonical authoring source.
- This repo is the public publish target.
- CI/CD is intentionally deferred; this setup is manual-first.
