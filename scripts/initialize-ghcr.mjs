// One-time recovery of the package created by the first deployment attempt.
// Never delete private packages or releases other than that exact failed attempt.
import { appendFileSync } from 'node:fs';
const headers = {
  Authorization: `Bearer ${process.env.GH_TOKEN}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};
const endpoint = 'https://api.github.com/users/eowiin/packages/container/portfolio';
const response = await fetch(endpoint, { headers });
if (response.status === 404) process.exit(0);
if (!response.ok) throw new Error(`Read package: HTTP ${response.status}`);
const pkg = await response.json();
if (pkg.visibility === 'private') {
  appendFileSync(process.env.GITHUB_OUTPUT, 'existing=true\n');
  process.exit(0);
}
if (pkg.visibility !== 'public') throw new Error('Unexpected visibility');
const versionsResponse = await fetch(`${endpoint}/versions?per_page=100`, { headers });
if (!versionsResponse.ok) throw new Error(`Read versions: HTTP ${versionsResponse.status}`);
const versions = await versionsResponse.json();
const allowed = new Set(['sha-56d3b7632530c0ab75b2726d3d45219b7aaf264e', 'buildcache']);
if (versions.length >= 100 || versions.some(v => (v.metadata?.container?.tags ?? []).some(t => !allowed.has(t)))) {
  throw new Error('Other releases exist; refusing to delete this package');
}
const deleted = await fetch(endpoint, { headers, method: 'DELETE' });
if (!deleted.ok) throw new Error(`Delete accidental public package: HTTP ${deleted.status}`);
console.log('Removed the public package from the failed first deployment.');
