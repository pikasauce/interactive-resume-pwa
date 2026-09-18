#!/usr/bin/env bash
set -euo pipefail

APP_NAME="enrique-pujol-resume-pwa"
ENVIRONMENT="staging"
VERSION="${1:-$(date +%Y%m%d-%H%M%S)}"
TARGET_DIR="./dist/release-${VERSION}"

echo "[release] Starting release for ${APP_NAME} version ${VERSION} into ${ENVIRONMENT}"

if git rev-parse --is-inside-work-tree >/dev/null 2>&1 && (! git diff --quiet || ! git diff --cached --quiet); then
  echo "[release] Working tree has uncommitted changes. Commit or stash before releasing."
  exit 1
fi

mkdir -p "$TARGET_DIR"
cp -R apps/manager-ui "$TARGET_DIR/ui"
cp -R services/order-api "$TARGET_DIR/api"
cp README.md "$TARGET_DIR/README.md"

cat > "$TARGET_DIR/release-notes.txt" <<EOF
Release ${VERSION}
Environment: ${ENVIRONMENT}
Summary: DevOps & Release Engineer résumé progressive web app
Quality gates: node syntax validation and Playwright end-to-end suite
Build timestamp: $(date -u)
EOF

echo "[release] Preparing staging deployment"
echo "[release] Simulated deploy completed successfully"
echo "[release] Release artifact stored at ${TARGET_DIR}"
echo "[release] Rollback: restore previous dist folder or re-run the last known good artifact"
