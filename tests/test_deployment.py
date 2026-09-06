"""Exercise release switching and registry retention without a VPS or GitHub token."""
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest

REPO = Path(__file__).resolve().parents[1]
IMAGE = 'ghcr.io/eowiin/portfolio@sha256:'


class DeploymentTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        (self.root / '.env').write_text('PORTFOLIO_PORT=3001\n')
        self.old = self.release('old', 'a')
        self.new = self.release('new', 'b')
        (self.root / 'current').symlink_to(self.old)
        binary = self.root / 'bin'
        binary.mkdir()
        docker = binary / 'docker'
        docker.write_text('''#!/usr/bin/env python3
import os, sys
with open(os.environ['CALLS'], 'a') as log:
    log.write(' '.join(sys.argv[1:]) + '\\n')
new = '/releases/new/' in ' '.join(sys.argv)
fail = os.environ.get('FAIL', '')
sys.exit(1 if new and fail and fail in sys.argv else 0)
''')
        docker.chmod(0o755)
        self.env = {**os.environ, 'PATH': f'{binary}:{os.environ["PATH"]}',
                    'CALLS': str(self.root / 'calls')}

    def release(self, name, digit):
        directory = self.root / 'releases' / name
        directory.mkdir(parents=True)
        (directory / 'compose.yaml').write_text('services: {}\n')
        (directory / 'image.env').write_text(f'PORTFOLIO_IMAGE={IMAGE}{digit * 64}\n')
        return directory

    def deploy(self, failure=''):
        return subprocess.run(['bash', str(REPO / 'scripts/deploy.sh'),
                               str(self.root), str(self.new), IMAGE + 'b' * 64],
                              env={**self.env, 'FAIL': failure}, capture_output=True)

    def test_success_and_manual_rollback(self):
        self.assertEqual(self.deploy().returncode, 0)
        self.assertEqual((self.root / 'current').resolve(), self.new)
        self.assertEqual((self.root / 'previous').resolve(), self.old)
        result = subprocess.run(['bash', str(REPO / 'scripts/deploy.sh'),
                                 str(self.root), str(self.old), IMAGE + 'a' * 64],
                                env=self.env, capture_output=True)
        self.assertEqual(result.returncode, 0)
        self.assertEqual((self.root / 'current').resolve(), self.old)
        self.assertEqual((self.root / 'previous').resolve(), self.new)

    def test_pull_failure_does_not_replace_service(self):
        self.assertNotEqual(self.deploy('pull').returncode, 0)
        self.assertEqual((self.root / 'current').resolve(), self.old)
        self.assertNotIn(' up ', (self.root / 'calls').read_text())

    def test_health_failure_restores_previous_compose(self):
        self.assertNotEqual(self.deploy('up').returncode, 0)
        self.assertEqual((self.root / 'current').resolve(), self.old)
        calls = (self.root / 'calls').read_text().splitlines()
        self.assertIn(str(self.old / 'compose.yaml'), calls[-1])
        self.assertIn('--no-build --wait', calls[-1])

    def test_first_deploy_failure_has_no_current(self):
        (self.root / 'current').unlink()
        self.assertNotEqual(self.deploy('up').returncode, 0)
        self.assertFalse((self.root / 'current').exists())


class RegistryTests(unittest.TestCase):
    def run_registry(self, mode, visibility='private', versions=None):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            mock = root / 'mock.mjs'
            mock.write_text('''globalThis.fetch = async (url, options) => {
  const data = JSON.parse(process.env.FIXTURE);
  if (options.method === 'DELETE') {
    console.log('DELETE ' + url.split('/').at(-1));
    return new Response(null, {status: 204});
  }
  if (url.endsWith('/users/eowiin')) return Response.json({type: 'User'});
  if (url.includes('/versions?')) return Response.json(data.versions);
  if (data.visibility === 'missing') return new Response(null, {status: 404});
  return Response.json({visibility: data.visibility});
};
''')
            protected = root / 'protected'
            protected.write_text(f'PORTFOLIO_IMAGE={IMAGE}{"a" * 64}\n')
            return subprocess.run(['node', '--import', str(mock),
                                   str(REPO / 'scripts/ghcr.mjs'), mode],
                                  env={**os.environ, 'GH_TOKEN': 'test-only',
                                       'GITHUB_REPOSITORY': 'Eowiin/portfolio',
                                       'PROTECTED_IMAGES_FILE': str(protected),
                                       'FIXTURE': json.dumps({'visibility': visibility,
                                                              'versions': versions or []})},
                                  capture_output=True, text=True)

    def test_public_package_rejected(self):
        self.assertNotEqual(self.run_registry('check', 'public').returncode, 0)

    def test_first_publication_allowed_but_verified_afterwards(self):
        self.assertEqual(self.run_registry('check', 'missing').returncode, 0)
        self.assertNotEqual(self.run_registry('verify', 'missing').returncode, 0)
        self.assertEqual(self.run_registry('verify').returncode, 0)

    def test_retention_preserves_live_recent_cache_and_child_manifests(self):
        versions = [{'id': n, 'name': 'sha256:' + (f'{n:064x}' if n != 1 else 'a' * 64),
                     'created_at': f'2026-01-{n:02d}T00:00:00Z',
                     'metadata': {'container': {'tags': ['sha-' + f'{n:040x}']}}}
                    for n in range(1, 13)]
        versions += [dict(versions[0], id=20, metadata={'container': {'tags': []}}),
                     dict(versions[0], id=21, metadata={'container': {'tags': ['buildcache']}})]
        result = self.run_registry('cleanup', versions=versions)
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual([line for line in result.stdout.splitlines() if line.startswith('DELETE')],
                         ['DELETE 2'])


if __name__ == '__main__':
    unittest.main()
