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

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function main() {
  const errors = [];

  const markdownFiles = await walkMarkdown(contentRootAbs);
  for (const fileAbs of markdownFiles) {
    const content = await fs.readFile(fileAbs, 'utf8');
    validateLinksInFile(fileAbs, content, errors);
  }

  const publicFiles = await walkFiles(publicRootAbs);
  for (const fileAbs of publicFiles) {
    const rel = toPosixPath(path.relative(publicRootAbs, fileAbs));
    if (rel.includes('/_staging/') || rel.startsWith('_staging/')) {
      errors.push(`Disallowed staging artifact in public assets: ${rel}`);
    }
    if (path.basename(fileAbs) === '.DS_Store') {
      errors.push(`Disallowed system file in public assets: ${rel}`);
    }
  }

  if (errors.length > 0) {
    console.error(`Validation failed with ${errors.length} error(s):`);
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`Validation passed for ${markdownFiles.length} markdown files.`);
}

function validateLinksInFile(fileAbs, content, errors) {
  const text = content.replace(/\r\n/g, '\n');
  const linkPattern = /(!?\[[^\]]*\]\()([^)]+)(\))/g;
  let match;

  while ((match = linkPattern.exec(text)) !== null) {
    const rawTarget = match[2].trim();
    if (!rawTarget) {
      continue;
    }
    if (isExternalTarget(rawTarget)) {
      continue;
    }

    const { pathPart } = splitTarget(rawTarget);
    const cleaned = unwrapLinkPath(pathPart);
    const decoded = decodePath(cleaned);

    if (validateSourceRelative(fileAbs, decoded)) {
      continue;
    }

    if (validatePublicRouteRelative(fileAbs, decoded)) {
      continue;
    }

    const relFile = toPosixPath(path.relative(repoRoot, fileAbs));
    errors.push(`${relFile} -> broken local link: ${rawTarget}`);
  }
}

function validateSourceRelative(fileAbs, decodedTarget) {
  const candidate = path.resolve(path.dirname(fileAbs), decodedTarget);
  if (existsSync(candidate)) {
    return true;
  }

  if (existsSync(`${candidate}.md`) || existsSync(`${candidate}.mdx`)) {
    return true;
  }

  if (existsSync(path.join(candidate, 'index.md')) || existsSync(path.join(candidate, 'index.mdx'))) {
    return true;
  }

  return false;
}

function validatePublicRouteRelative(fileAbs, decodedTarget) {
  const routeDir = routeDirectoryForFile(fileAbs);
  const resolvedRoute = decodedTarget.startsWith('/')
    ? path.posix.normalize(decodedTarget)
    : path.posix.normalize(path.posix.join(routeDir, decodedTarget));

  const routeWithoutLeadingSlash = resolvedRoute.replace(/^\/+/, '');
  const publicCandidate = path.join(publicRootAbs, toSystemPath(routeWithoutLeadingSlash));

  return existsSync(publicCandidate);
}

function routeDirectoryForFile(fileAbs) {
  const rel = toPosixPath(path.relative(contentRootAbs, fileAbs));
  const parts = rel.split('/').filter(Boolean);
  const file = parts.pop() || '';
  const stem = file.replace(/\.(md|mdx)$/i, '');
  if (stem && stem.toLowerCase() !== 'index') {
    parts.push(stem);
  }
  return `/${parts.join('/')}`;
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

async function walkMarkdown(rootDirAbs) {
  if (!existsSync(rootDirAbs)) {
    return [];
  }

  const files = [];

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
      if (entry.name.toLowerCase().endsWith('.md') || entry.name.toLowerCase().endsWith('.mdx')) {
        files.push(nextAbs);
      }
    }
  }

  await walk(rootDirAbs);
  files.sort((a, b) => a.localeCompare(b));
  return files;
}

async function walkFiles(rootDirAbs) {
  if (!existsSync(rootDirAbs)) {
    return [];
  }

  const files = [];

  async function walk(currentAbs) {
    const entries = await fs.readdir(currentAbs, { withFileTypes: true });
    for (const entry of entries) {
      const nextAbs = path.join(currentAbs, entry.name);
      if (entry.isDirectory()) {
        await walk(nextAbs);
        continue;
      }
      if (entry.isFile()) {
        files.push(nextAbs);
      }
    }
  }

  await walk(rootDirAbs);
  files.sort((a, b) => a.localeCompare(b));
  return files;
}

function toPosixPath(value) {
  return value.split(path.sep).join('/');
}

function toSystemPath(value) {
  return value.split('/').join(path.sep);
}
