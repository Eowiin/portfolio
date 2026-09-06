#!/usr/bin/env bash
set -euo pipefail
: "${VPS_HOST:?}" "${VPS_USER:?}" "${VPS_SSH_KEY:?}" "${VPS_KNOWN_HOSTS:?}"
: "${GHCR_TOKEN:?}" "${GHCR_USER:?}"
[[ "$GHCR_USER" =~ ^[a-zA-Z0-9][a-zA-Z0-9-]*$ ]]
: "${VPS_PATH:?}" "${PORTFOLIO_IMAGE:?}" "${RUNNER_TEMP:?}"
[[ "$VPS_HOST" =~ ^[a-zA-Z0-9][a-zA-Z0-9.-]*$ ]]
[[ "$VPS_USER" =~ ^[a-zA-Z_][a-zA-Z0-9_-]*$ ]]
[[ "${VPS_PORT:=22}" =~ ^[0-9]+$ ]]
[[ "$VPS_PATH" =~ ^/[a-zA-Z0-9_/-]+$ && "$VPS_PATH" != / ]]
[[ "$PORTFOLIO_IMAGE" =~ ^ghcr\.io/[a-z0-9._/-]+@sha256:[a-f0-9]{64}$ ]]
[[ "$GITHUB_SHA" =~ ^[a-f0-9]{40}$ && "$GITHUB_RUN_ID" =~ ^[0-9]+$ && "$GITHUB_RUN_ATTEMPT" =~ ^[0-9]+$ ]]

key="$RUNNER_TEMP/portfolio-ssh-key"
known="$RUNNER_TEMP/portfolio-known-hosts"
trap 'rm -f "$key" "$known"' EXIT
umask 077
printf '%s\n' "$VPS_SSH_KEY" > "$key"
printf '%s\n' "$VPS_KNOWN_HOSTS" > "$known"
ssh_options=(-i "$key" -p "$VPS_PORT" -o BatchMode=yes -o IdentitiesOnly=yes
  -o StrictHostKeyChecking=yes -o "UserKnownHostsFile=$known" -o ConnectTimeout=15)
target="$VPS_USER@$VPS_HOST"
release="$VPS_PATH/releases/$GITHUB_SHA-$GITHUB_RUN_ID-$GITHUB_RUN_ATTEMPT"
ssh "${ssh_options[@]}" "$target" "mkdir -p '$release'"
tar -cf - compose.yaml scripts/deploy.sh |
  ssh "${ssh_options[@]}" "$target" "tar -xf - -C '$release'"
printf '%s' "$GHCR_TOKEN" | ssh "${ssh_options[@]}" "$target" \
  "bash '$release/scripts/deploy.sh' '$VPS_PATH' '$release' '$PORTFOLIO_IMAGE' '$GHCR_USER'"
# Keep the live image and the immediately preceding release during registry cleanup.
ssh "${ssh_options[@]}" "$target" \
  "cat '$VPS_PATH/current/image.env'; if test -f '$VPS_PATH/previous/image.env'; then cat '$VPS_PATH/previous/image.env'; fi" \
  > "$RUNNER_TEMP/portfolio-protected-images"
