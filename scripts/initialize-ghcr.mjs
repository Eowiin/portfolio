// Initialize only an absent package; never delete or overwrite a public one.
import { appendFileSync } from 'node:fs';
const token = process.env.GH_TOKEN;
if (!token) throw new Error('Configure the production secret GHCR_BOOTSTRAP_TOKEN with a classic PAT granting write:packages.');
const headers = {
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};
const endpoint = 'https://api.github.com/users/eowiin/packages/container/portfolio';
const response = await fetch(endpoint, { headers });
if (response.status === 404) process.exit(0);
if (!response.ok) throw new Error(`Read package: HTTP ${response.status}`);
const pkg = await response.json();
if (pkg.visibility !== 'private') {
  throw new Error('Existing package is not private; refusing initialization.');
}
appendFileSync(process.env.GITHUB_OUTPUT, 'existing=true\n');
