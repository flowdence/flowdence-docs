// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const site = process.env.DOCS_SITE_URL || 'https://flowdence.github.io';
const base = normalizeBase(process.env.DOCS_BASE_PATH || '/flowdence-docs/');

export default defineConfig({
	site,
	base,
	build: {
		// Keep asset output Jekyll-safe for branch-based GitHub Pages.
		assets: 'assets',
	},
	trailingSlash: 'always',
	integrations: [
		starlight({
			title: 'Flowdence Docs',
			description: 'Flowdence company, policy, and product documentation.',
			customCss: ['./src/styles/sidebar-visibility.css'],
			head: [
				{
					tag: 'script',
					content: `
(() => {
  const path = window.location.pathname;
  let section = 'root';
  if (path.includes('/approvalflow/docs/')) {
    section = 'approvalflow';
  } else if (path.includes('/mulesight/docs/')) {
    section = 'mulesight';
  } else if (path.includes('/docs/')) {
    section = 'flowdence';
  }
  document.documentElement.dataset.docsSection = section;
})();
`,
				},
			],
			sidebar: [
				{
					label: 'Flowdence',
					autogenerate: { directory: 'docs' },
				},
				{
					label: 'ApprovalFlow',
					autogenerate: { directory: 'approvalflow/docs' },
				},
				{
					label: 'MuleSight',
					autogenerate: { directory: 'mulesight/docs' },
				},
			],
		}),
	],
});

function normalizeBase(value) {
	let basePath = value.trim();
	if (!basePath.startsWith('/')) {
		basePath = `/${basePath}`;
	}
	if (!basePath.endsWith('/')) {
		basePath = `${basePath}/`;
	}
	return basePath;
}
