import { readFileSync } from 'node:fs';

const mode = process.argv[2];
if (!['check', 'verify', 'cleanup'].includes(mode)) throw new Error('Unknown mode');
const token = process.env.GH_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;
if (!token || !repository) throw new Error('Missing GitHub credentials or repository');
const [owner, name] = repository.toLowerCase().split('/');
const headers = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};
async function api(path, method = 'GET') {
  const response = await fetch(`https://api.github.com${path}`, { method, headers });
  if (!response.ok) {
    const error = new Error(`GitHub API ${method} ${path}: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? null : response.json();
}
const account = await api(`/users/${owner}`);
const endpoint = `/${account.type === 'Organization' ? 'orgs' : 'users'}/${owner}/packages/container/${encodeURIComponent(name)}`;
try {
  const pkg = await api(endpoint);
  if (pkg.visibility !== 'private') {
    throw new Error('The GHCR package must be private. Publication and deployment stopped.');
  }
} catch (error) {
  if (mode === 'check' && error.status === 404) {
    throw new Error('A private GHCR package must exist before publishing application files. Create an empty package, verify Private visibility and grant this repository Actions access first.');
  }
  throw error;
}
console.log('GHCR package is private.');
if (mode === 'cleanup') {
  const lines = readFileSync(process.env.PROTECTED_IMAGES_FILE, 'utf8').trim().split('\n');
  const prefix = `PORTFOLIO_IMAGE=ghcr.io/${owner}/${name}@`;
  if (!lines.length || lines.some(line => !line.startsWith(prefix) || !/^sha256:[a-f0-9]{64}$/.test(line.slice(prefix.length)))) {
    throw new Error('Missing or invalid deployed image references; refusing cleanup');
  }
  const protectedDigests = new Set(lines.map(line => line.slice(prefix.length)));
  const versions = [];
  for (let page = 1; ; page++) {
    const batch = await api(`${endpoint}/versions?per_page=100&page=${page}`);
    versions.push(...batch);
    if (batch.length < 100) break;
  }
  // Never delete untagged manifests: they can be children of a multi-platform image.
  // Never delete cache or tags managed outside this workflow.
  const releases = versions.filter(version => {
    const tags = version.metadata?.container?.tags ?? [];
    return tags.length > 0 && tags.every(tag => /^sha-[a-f0-9]{40}$/.test(tag));
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  for (const version of releases.slice(10)) {
    if (!protectedDigests.has(version.name)) {
      await api(`${endpoint}/versions/${version.id}`, 'DELETE');
      console.log(`Removed old release ${version.name}`);
    }
  }
}
