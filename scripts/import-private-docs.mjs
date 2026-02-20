#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptFile = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptFile);
const repoRoot = path.resolve(scriptDir, '..');
const contentRootAbs = path.join(repoRoot, 'src', 'content', 'docs');
const publicRootAbs = path.join(repoRoot, 'public');
const sidebarLabelsAbs = path.join(repoRoot, 'src', 'generated', 'sidebar-labels.json');

const mappings = [
  {
    id: 'flowdence-policies-readme',
    kind: 'file',
    sourceRel: 'flowdence-main/flowdence-policies/README.md',
    destRel: 'docs/index.md',
    sectionRoot: 'docs',
    assetConfig: null,
  },
  {
    id: 'flowdence-policies',
    kind: 'dir',
    sourceDirRel: 'flowdence-main/flowdence-policies',
    destDirRel: 'docs/flowdence-policies',
    sectionRoot: 'docs',
    excludeRelative: new Set(['README.md']),
    assetConfig: null,
  },
  {
    id: 'approvalflow-product-specific-policies',
    kind: 'dir',
    sourceDirRel: 'flowdence-main/product-specific-policies/ApprovalFlow for Confluence',
    destDirRel: 'docs/product-specific-policies/approvalflow',
    sectionRoot: 'docs',
    excludeRelative: new Set(),
    assetConfig: null,
  },
  {
    id: 'mulesight-product-specific-policies',
    kind: 'dir',
    sourceDirRel: 'flowdence-main/product-specific-policies/MuleSight for Confluence',
    destDirRel: 'docs/product-specific-policies/mulesight',
    sectionRoot: 'docs',
    excludeRelative: new Set(),
    assetConfig: null,
  },
  {
    id: 'approvalflow-overview',
    kind: 'file',
    sourceRel: 'flowdence-product-docs/ApprovalFlow for Confluence/overview.md',
    destRel: 'approvalflow/docs/index.md',
    sectionRoot: 'approvalflow/docs',
    assetConfig: {
      sourceAssetsRel: 'flowdence-product-docs/ApprovalFlow for Confluence/assets',
      publicAssetsRoute: 'approvalflow/docs/assets',
    },
  },
  {
    id: 'approvalflow-docs',
    kind: 'dir',
    sourceDirRel: 'flowdence-product-docs/ApprovalFlow for Confluence',
    destDirRel: 'approvalflow/docs',
    sectionRoot: 'approvalflow/docs',
    excludeRelative: new Set(['overview.md']),
    assetConfig: {
      sourceAssetsRel: 'flowdence-product-docs/ApprovalFlow for Confluence/assets',
      publicAssetsRoute: 'approvalflow/docs/assets',
    },
  },
  {
    id: 'mulesight-overview',
    kind: 'file',
    sourceRel: 'flowdence-product-docs/MuleSight for Confluence/overview.md',
    destRel: 'mulesight/docs/index.md',
    sectionRoot: 'mulesight/docs',
    assetConfig: {
      sourceAssetsRel: 'flowdence-product-docs/MuleSight for Confluence/assets',
      publicAssetsRoute: 'mulesight/docs/assets',
    },
  },
  {
    id: 'mulesight-docs',
    kind: 'dir',
    sourceDirRel: 'flowdence-product-docs/MuleSight for Confluence',
    destDirRel: 'mulesight/docs',
    sectionRoot: 'mulesight/docs',
    excludeRelative: new Set(['overview.md']),
    assetConfig: {
      sourceAssetsRel: 'flowdence-product-docs/MuleSight for Confluence/assets',
      publicAssetsRoute: 'mulesight/docs/assets',
    },
  },
];

const cleanTargets = [
  path.join(contentRootAbs, 'docs'),
  path.join(contentRootAbs, 'approvalflow'),
  path.join(contentRootAbs, 'mulesight'),
  path.join(contentRootAbs, 'guides'),
  path.join(contentRootAbs, 'reference'),
  path.join(publicRootAbs, 'approvalflow'),
  path.join(publicRootAbs, 'mulesight'),
  path.join(publicRootAbs, 'docs'),
];
const imageExtensions = new Set(['.avif', '.gif', '.jpg', '.jpeg', '.png', '.svg', '.webp']);

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.privateRoot) {
    printUsage();
    process.exit(1);
  }

  const privateRootAbs = path.resolve(args.privateRoot);
  const privateRootExists = await pathExists(privateRootAbs);
  if (!privateRootExists) {
    throw new Error(`Private docs root does not exist: ${privateRootAbs}`);
  }

  if (args.clean) {
    await cleanGeneratedTargets(args.dryRun);
  }

  await ensureDir(contentRootAbs, args.dryRun);
  await ensureDir(publicRootAbs, args.dryRun);

  const assetCopyMap = new Map();
  const referencedAssets = new Set();
  const errors = [];
  let importedFiles = 0;

  for (const mapping of mappings) {
    const resolvedMapping = resolveMapping(privateRootAbs, mapping);
    const files = await resolveSourceFiles(resolvedMapping);

    for (const entry of files) {
      const sourceText = await fs.readFile(entry.sourceAbs, 'utf8');
      const normalized = normalizeMarkdown({
        sourceText,
        sourceAbs: entry.sourceAbs,
        destRel: entry.destRel,
        sectionRoot: resolvedMapping.sectionRoot,
        assetConfig: resolvedMapping.assetConfig,
        privateRootAbs,
        referencedAssets,
        assetCopyMap,
        errors,
      });

      const destAbs = path.join(contentRootAbs, toSystemPath(entry.destRel));
      importedFiles += 1;

      if (!args.dryRun) {
        await ensureDir(path.dirname(destAbs));
        await fs.writeFile(destAbs, normalized, 'utf8');
      }
    }
  }

  if (errors.length > 0) {
    const header = `Import failed with ${errors.length} error(s):`;
    throw new Error(`${header}\n- ${errors.join('\n- ')}`);
  }

  let copiedAssets = 0;
  if (!args.dryRun) {
    for (const item of assetCopyMap.values()) {
      await ensureDir(path.dirname(item.destAbs));
      await fs.copyFile(item.sourceAbs, item.destAbs);
      copiedAssets += 1;
    }
  }

  const sidebarLabels = buildSidebarLabels();
  if (!args.dryRun) {
    await writeSidebarLabels(sidebarLabels);
  }

  const modeLabel = args.dryRun ? 'DRY RUN' : 'IMPORT COMPLETE';
  console.log(`[${modeLabel}] Imported markdown files: ${importedFiles}`);
  console.log(`[${modeLabel}] Referenced assets: ${referencedAssets.size}`);
  if (!args.dryRun) {
    console.log(`[${modeLabel}] Copied assets: ${copiedAssets}`);
    console.log(`[${modeLabel}] Sidebar labels written: src/generated/sidebar-labels.json`);
  }
}

function parseArgs(argv) {
  const args = {
    privateRoot: null,
    clean: false,
    dryRun: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--private-root') {
      args.privateRoot = argv[i + 1] || null;
      i += 1;
      continue;
    }
    if (token === '--clean') {
      args.clean = true;
      continue;
    }
    if (token === '--dry-run') {
      args.dryRun = true;
      continue;
    }
    throw new Error(`Unknown argument: ${token}`);
  }

  return args;
}

function printUsage() {
  console.log([
    'Usage:',
    '  node scripts/import-private-docs.mjs --private-root <path> [--clean] [--dry-run]',
  ].join('\n'));
}

function resolveMapping(privateRootAbs, mapping) {
  const resolved = {
    ...mapping,
    sectionRoot: toPosixPath(mapping.sectionRoot),
  };

  if (mapping.kind === 'file') {
    resolved.sourceAbs = path.join(privateRootAbs, toSystemPath(mapping.sourceRel));
    resolved.destRel = toPosixPath(mapping.destRel);
  } else {
    resolved.sourceDirAbs = path.join(privateRootAbs, toSystemPath(mapping.sourceDirRel));
    resolved.destDirRel = toPosixPath(mapping.destDirRel);
  }

  if (mapping.assetConfig) {
    resolved.assetConfig = {
      sourceAssetsAbs: path.join(privateRootAbs, toSystemPath(mapping.assetConfig.sourceAssetsRel)),
      publicAssetsRoute: toPosixPath(mapping.assetConfig.publicAssetsRoute),
    };
  }

  return resolved;
}

async function resolveSourceFiles(mapping) {
  if (mapping.kind === 'file') {
    const exists = await pathExists(mapping.sourceAbs);
    if (!exists) {
      throw new Error(`Missing source file for mapping ${mapping.id}: ${mapping.sourceAbs}`);
    }

    return [
      {
        sourceAbs: mapping.sourceAbs,
        destRel: mapping.destRel,
      },
    ];
  }

  const exists = await pathExists(mapping.sourceDirAbs);
  if (!exists) {
    throw new Error(`Missing source directory for mapping ${mapping.id}: ${mapping.sourceDirAbs}`);
  }

  const markdownFiles = await walkMarkdown(mapping.sourceDirAbs);
  const results = [];

  for (const sourceAbs of markdownFiles) {
    const rel = toPosixPath(path.relative(mapping.sourceDirAbs, sourceAbs));
    if (mapping.excludeRelative.has(rel)) {
      continue;
    }

    const destRel = path.posix.join(mapping.destDirRel, rel);
    results.push({ sourceAbs, destRel });
  }

  return results;
}

function normalizeMarkdown({
  sourceText,
  sourceAbs,
  destRel,
  sectionRoot,
  assetConfig,
  privateRootAbs,
  referencedAssets,
  assetCopyMap,
  errors,
}) {
  const text = sourceText.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
  const body = stripFrontmatter(text);
  const { title, bodyForOutput } = deriveTitleAndBody(body, destRel);
  const rewrittenBody = rewriteAssetLinks({
    body: bodyForOutput,
    sourceAbs,
    destRel,
    sectionRoot,
    assetConfig,
    privateRootAbs,
    referencedAssets,
    assetCopyMap,
    errors,
  });

  const escapedTitle = escapeDoubleQuotedYaml(title);
  return `---\ntitle: "${escapedTitle}"\n---\n\n${rewrittenBody}`;
}

function stripFrontmatter(text) {
  if (!text.startsWith('---\n')) {
    return text;
  }

  const endIndex = text.indexOf('\n---\n', 4);
  if (endIndex === -1) {
    return text;
  }

  return text.slice(endIndex + '\n---\n'.length);
}

function deriveTitleAndBody(body, destRel) {
  const leadingHeadingMatch = body.match(/^\s*#\s+(.+?)\s*\n+/);
  if (leadingHeadingMatch) {
    return {
      title: normalizeTitle(leadingHeadingMatch[1]),
      bodyForOutput: body.slice(leadingHeadingMatch[0].length),
    };
  }

  const headingMatch = body.match(/^#\s+(.+)$/m);
  if (headingMatch) {
    return {
      title: normalizeTitle(headingMatch[1]),
      bodyForOutput: body,
    };
  }

  const rel = toPosixPath(destRel);
  const fileBase = path.posix.basename(rel, path.posix.extname(rel));
  if (fileBase.toLowerCase() === 'index') {
    const parent = path.posix.basename(path.posix.dirname(rel));
    return {
      title: normalizeTitle(parent || 'Documentation'),
      bodyForOutput: body,
    };
  }

  return {
    title: normalizeTitle(fileBase),
    bodyForOutput: body,
  };
}

function normalizeTitle(value) {
  return value
    .replace(/`/g, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function rewriteAssetLinks({
  body,
  sourceAbs,
  destRel,
  sectionRoot,
  assetConfig,
  privateRootAbs,
  referencedAssets,
  assetCopyMap,
  errors,
}) {
  if (!assetConfig) {
    return body;
  }

  const routeDepth = computeRouteDepth(destRel, sectionRoot);
  const upwardPrefix = '../'.repeat(routeDepth);

  const linkPattern = /(!?\[[^\]]*\]\()([^)]+)(\))/g;

  return body.replace(linkPattern, (fullMatch, leading, rawTarget, trailing) => {
    const target = rawTarget.trim();
    if (!target) {
      return fullMatch;
    }

    if (isExternalTarget(target)) {
      return fullMatch;
    }

    const { pathPart, suffixPart } = splitTarget(target);
    const cleanedPath = unwrapLinkPath(pathPart);
    const resolvedSource = path.resolve(path.dirname(sourceAbs), decodePath(cleanedPath));

    if (!isPathInside(resolvedSource, assetConfig.sourceAssetsAbs)) {
      return fullMatch;
    }

    const assetRel = toPosixPath(path.relative(assetConfig.sourceAssetsAbs, resolvedSource));

    if (assetRel.startsWith('..')) {
      errors.push(`Unable to resolve asset link: ${toPosixPath(path.relative(privateRootAbs, sourceAbs))} -> ${target}`);
      return fullMatch;
    }

    if (shouldSkipAsset(assetRel)) {
      errors.push(`Disallowed asset reference (staging/system file): ${toPosixPath(path.relative(privateRootAbs, sourceAbs))} -> ${target}`);
      return fullMatch;
    }

    if (!existsSync(resolvedSource)) {
      errors.push(`Missing referenced asset: ${toPosixPath(path.relative(privateRootAbs, sourceAbs))} -> ${target}`);
      return fullMatch;
    }

    const assetRoute = path.posix.join(assetConfig.publicAssetsRoute, assetRel);
    referencedAssets.add(assetRoute);

    const contentDestAbs = path.join(contentRootAbs, toSystemPath(assetRoute));
    const publicDestAbs = path.join(publicRootAbs, toSystemPath(assetRoute));

    assetCopyMap.set(contentDestAbs, {
      sourceAbs: resolvedSource,
      destAbs: contentDestAbs,
    });
    assetCopyMap.set(publicDestAbs, {
      sourceAbs: resolvedSource,
      destAbs: publicDestAbs,
    });

    const extension = path.posix.extname(assetRel).toLowerCase();
    if (imageExtensions.has(extension)) {
      // Keep source-relative image paths so Astro can resolve and optimize them.
      return fullMatch;
    }

    const rewrittenTarget = `${upwardPrefix}assets/${assetRel}${suffixPart}`;
    return `${leading}${rewrittenTarget}${trailing}`;
  });
}

function computeRouteDepth(destRel, sectionRoot) {
  const relToSection = path.posix.relative(toPosixPath(sectionRoot), toPosixPath(destRel));
  if (relToSection.startsWith('..')) {
    throw new Error(`Destination ${destRel} is outside section root ${sectionRoot}`);
  }

  const parts = relToSection.split('/').filter(Boolean);
  if (parts.length === 0) {
    return 0;
  }

  const fileName = parts[parts.length - 1];
  const stem = fileName.replace(/\.md$/i, '');
  const dirCount = parts.length - 1;
  return dirCount + (stem.toLowerCase() === 'index' ? 0 : 1);
}

function isExternalTarget(target) {
  if (target.startsWith('#')) {
    return true;
  }
  return /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(target);
}

function splitTarget(target) {
  const match = target.match(/^([^?#]*)([?#].*)?$/);
  if (!match) {
    return { pathPart: target, suffixPart: '' };
  }

  return {
    pathPart: match[1],
    suffixPart: match[2] || '',
  };
}

function unwrapLinkPath(linkPath) {
  if (linkPath.startsWith('<') && linkPath.endsWith('>')) {
    return linkPath.slice(1, -1);
  }
  return linkPath;
}

function decodePath(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function shouldSkipAsset(assetRel) {
  const posixRel = toPosixPath(assetRel);
  if (posixRel.includes('/_staging/') || posixRel.startsWith('_staging/')) {
    return true;
  }
  return path.posix.basename(posixRel) === '.DS_Store';
}

function escapeDoubleQuotedYaml(value) {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function buildSidebarLabels() {
  const flowdencePolicies = getRequiredDirMapping('flowdence-policies');
  const approvalflowProductPolicies = getRequiredDirMapping('approvalflow-product-specific-policies');
  const mulesightProductPolicies = getRequiredDirMapping('mulesight-product-specific-policies');
  const approvalflowDocs = getRequiredDirMapping('approvalflow-docs');
  const mulesightDocs = getRequiredDirMapping('mulesight-docs');

  return {
    flowdence: 'Flowdence',
    flowdencePolicies: posixBaseName(flowdencePolicies.sourceDirRel),
    productSpecificPolicies: posixBaseName(path.posix.dirname(approvalflowProductPolicies.sourceDirRel)),
    approvalflow: posixBaseName(approvalflowDocs.sourceDirRel),
    mulesight: posixBaseName(mulesightDocs.sourceDirRel),
    approvalflowPolicies: posixBaseName(approvalflowProductPolicies.sourceDirRel),
    mulesightPolicies: posixBaseName(mulesightProductPolicies.sourceDirRel),
  };
}

function getRequiredDirMapping(id) {
  const mapping = mappings.find((item) => item.id === id && item.kind === 'dir');
  if (!mapping) {
    throw new Error(`Missing required mapping: ${id}`);
  }
  return mapping;
}

function posixBaseName(value) {
  return path.posix.basename(toPosixPath(value).replace(/\/+$/, ''));
}

async function writeSidebarLabels(labels) {
  await ensureDir(path.dirname(sidebarLabelsAbs));
  const data = `${JSON.stringify(labels, null, 2)}\n`;
  await fs.writeFile(sidebarLabelsAbs, data, 'utf8');
}

async function cleanGeneratedTargets(dryRun) {
  for (const target of cleanTargets) {
    if (!dryRun) {
      await fs.rm(target, { recursive: true, force: true });
    }
  }
}

async function walkMarkdown(rootDirAbs) {
  const found = [];

  async function walk(currentAbs) {
    const entries = await fs.readdir(currentAbs, { withFileTypes: true });
    for (const entry of entries) {
      const nextAbs = path.join(currentAbs, entry.name);
      if (entry.isDirectory()) {
        await walk(nextAbs);
        continue;
      }
      if (!entry.isFile()) {
        continue;
      }
      if (!entry.name.toLowerCase().endsWith('.md')) {
        continue;
      }
      found.push(nextAbs);
    }
  }

  await walk(rootDirAbs);
  found.sort((a, b) => a.localeCompare(b));
  return found;
}

function isPathInside(candidateAbs, parentAbs) {
  const rel = path.relative(parentAbs, candidateAbs);
  if (rel === '') {
    return true;
  }
  return !rel.startsWith('..') && !path.isAbsolute(rel);
}

async function ensureDir(dirAbs, dryRun = false) {
  if (dryRun) {
    return;
  }
  await fs.mkdir(dirAbs, { recursive: true });
}

async function pathExists(absPath) {
  try {
    await fs.access(absPath);
    return true;
  } catch {
    return false;
  }
}

function toPosixPath(value) {
  return value.split(path.sep).join('/');
}

function toSystemPath(value) {
  return value.split('/').join(path.sep);
}
