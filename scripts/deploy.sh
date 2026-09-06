#!/usr/bin/env bash
set -euo pipefail

# Usage: bash deploy.sh ROOT RELEASE IMAGE [GHCR_USER] (token on stdin)
root=${1:?Deployment root required}
release=${2:?Release directory required}
image=${3:?Image digest required}
registry_user=${4:-}
[[ "$root" = /* && "$release" = "$root"/releases/* ]] || exit 1
[[ "$image" =~ ^ghcr\.io/[a-z0-9._/-]+@sha256:[a-f0-9]{64}$ ]] || exit 1
[[ -f "$root/.env" && -f "$release/compose.yaml" ]] || {
  echo 'Missing VPS .env or release compose.yaml' >&2; exit 1;
}
exec 9>"$root/.deploy.lock"
flock -w 300 9

# CI uses its short-lived token; never overwrite the VPS Docker credentials.
if [[ -n "$registry_user" ]]; then
  [[ "$registry_user" =~ ^[a-zA-Z0-9][a-zA-Z0-9-]*$ ]] || exit 1
  registry_auth=$(mktemp -d "$root/.registry-auth.XXXXXX")
  trap 'rm -rf -- "$registry_auth"' EXIT
  export DOCKER_CONFIG="$registry_auth"
  docker login ghcr.io --username "$registry_user" --password-stdin
fi

compose() {
  local directory=$1
  shift
  docker compose --project-name ethan-portfolio \
    --env-file "$root/.env" --env-file "$directory/image.env" \
    -f "$directory/compose.yaml" "$@"
}

previous=$(readlink -f "$root/current" || true)
printf 'PORTFOLIO_IMAGE=%s\n' "$image" > "$release/image.env"
# A failed pull never changes the running service.
if [[ -n "$registry_user" ]] || ! docker image inspect "$image" >/dev/null 2>&1; then
  compose "$release" pull
fi
if ! compose "$release" up -d --no-build --wait --wait-timeout 120; then
  echo 'Deployment failed.' >&2
  if [[ -n "$previous" && -f "$previous/image.env" ]]; then
    echo 'Restoring the previous release.' >&2
    compose "$previous" up -d --no-build --wait --wait-timeout 120
  fi
  exit 1
fi
if [[ -n "$previous" && -f "$previous/image.env" && "$previous" != "$release" ]]; then
  ln -sfn "$previous" "$root/previous.next"
  mv -Tf "$root/previous.next" "$root/previous"
fi
ln -sfn "$release" "$root/current.next"
mv -Tf "$root/current.next" "$root/current"
echo "Deployed $image"
