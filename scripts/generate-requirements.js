#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const pkgPath = path.join(repoRoot, 'perfilate', 'package.json');
const lockPath = path.join(repoRoot, 'perfilate', 'package-lock.json');
const outPath = path.join(repoRoot, 'requirements.txt');

function safeReadJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    return null;
  }
}

const pkg = safeReadJson(pkgPath);
const lock = safeReadJson(lockPath);

if (!pkg) {
  console.error('Could not read package.json at', pkgPath);
  process.exit(2);
}

if (!lock) {
  console.error('package-lock.json not found. Run `npm install` inside the perfilate folder first to generate it.');
  process.exit(3);
}

const deps = Object.assign({}, pkg.dependencies || {});
const devDeps = Object.assign({}, pkg.devDependencies || {});

function resolveVersion(name) {
  // Prefer lock.dependencies[name].version
  if (lock.dependencies && lock.dependencies[name] && lock.dependencies[name].version) {
    return lock.dependencies[name].version;
  }
  // Fallback to packages mapping (lockfile v3)
  const pkgKey = 'node_modules/' + name;
  if (lock.packages && lock.packages[pkgKey] && lock.packages[pkgKey].version) {
    return lock.packages[pkgKey].version;
  }
  // Scoped packages: keys in packages may use the same pattern
  if (lock.packages) {
    // direct search for a package with matching name
    for (const k of Object.keys(lock.packages)) {
      if (k.endsWith('/node_modules/' + name) && lock.packages[k].version) {
        return lock.packages[k].version;
      }
    }
  }
  // Last resort: return the specifier in package.json
  return pkg.dependencies && pkg.dependencies[name] ? pkg.dependencies[name]
    : (pkg.devDependencies && pkg.devDependencies[name] ? pkg.devDependencies[name] : 'unknown');
}

const lines = [];
lines.push('# Generated requirements for perfilate');
lines.push('# Source: perfilate/package.json and perfilate/package-lock.json');
lines.push('# Generated: ' + new Date().toISOString());
lines.push('');

for (const name of Object.keys(deps)) {
  const ver = resolveVersion(name);
  lines.push(`${name}@${ver}`);
}

if (Object.keys(devDeps).length > 0) {
  lines.push('');
  lines.push('# Dev dependencies');
  for (const name of Object.keys(devDeps)) {
    const ver = resolveVersion(name);
    lines.push(`${name}@${ver}  (dev)`);
  }
}

fs.writeFileSync(outPath, lines.join('\n') + '\n', 'utf8');
console.log('Wrote', outPath);
