// @ts-check
import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const site = process.env.DOCS_SITE_URL || 'https://flowdence.github.io';
const base = normalizeBase(process.env.DOCS_BASE_PATH || '/flowdence-docs/');
const sidebarLabels = loadSidebarLabels();

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
			sidebar: [
				{
					label: sidebarLabels.flowdence,
					items: [
						{ slug: 'docs' },
						{
							label: sidebarLabels.flowdencePolicies,
							autogenerate: { directory: 'docs/flowdence-policies' },
						},
						{
							label: sidebarLabels.productSpecificPolicies,
							items: [
								{
									label: sidebarLabels.approvalflowPolicies,
									autogenerate: { directory: 'docs/product-specific-policies/approvalflow' },
								},
								{
									label: sidebarLabels.mulesightPolicies,
									autogenerate: { directory: 'docs/product-specific-policies/mulesight' },
								},
							],
						},
					],
				},
				{
					label: sidebarLabels.approvalflow,
					autogenerate: { directory: 'approvalflow/docs' },
				},
				{
					label: sidebarLabels.mulesight,
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

function loadSidebarLabels() {
	const defaults = {
		flowdence: 'Flowdence',
		flowdencePolicies: 'flowdence-policies',
		productSpecificPolicies: 'product-specific-policies',
		approvalflow: 'ApprovalFlow',
		mulesight: 'MuleSight',
		approvalflowPolicies: 'approvalflow',
		mulesightPolicies: 'mulesight',
	};

	try {
		const fileUrl = new URL('./src/generated/sidebar-labels.json', import.meta.url);
		const parsed = JSON.parse(readFileSync(fileUrl, 'utf8'));
		return {
			flowdence: validLabel(parsed.flowdence, defaults.flowdence),
			flowdencePolicies: validLabel(parsed.flowdencePolicies, defaults.flowdencePolicies),
			productSpecificPolicies: validLabel(parsed.productSpecificPolicies, defaults.productSpecificPolicies),
			approvalflow: validLabel(parsed.approvalflow, defaults.approvalflow),
			mulesight: validLabel(parsed.mulesight, defaults.mulesight),
			approvalflowPolicies: validLabel(parsed.approvalflowPolicies, defaults.approvalflowPolicies),
			mulesightPolicies: validLabel(parsed.mulesightPolicies, defaults.mulesightPolicies),
		};
	} catch {
		return defaults;
	}
}

function validLabel(value, fallback) {
	if (typeof value !== 'string') {
		return fallback;
	}
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : fallback;
}
