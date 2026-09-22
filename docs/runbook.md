# Release Runbook

## Overview

This project demonstrates a lightweight release and QA workflow for the résumé PWA and its release-signal API. The goal is to deliver a small application safely while keeping the process repeatable and documented.

## Environments

- Local: used for development and validation
- Staging: used for the simulated release flow

## Configuring the resume-ui → resume-api connection

`apps/resume-ui/app.js` reads the resume-api URL from `window.API_BASE_URL`,
which is set by `apps/resume-ui/config.js`. Locally, `config.js` is committed
with a `http://localhost:3001` default and `npm run dev` needs no extra
configuration. When resume-ui is deployed separately from resume-api (e.g. to
Render), `scripts/render/generate-resume-ui-config.js` regenerates
`config.js` at build time from the `API_BASE_URL` environment variable set on
the resume-ui service, so it can be pointed at the deployed resume-api's URL.

## Deployment process

1. Ensure the working tree is clean.
2. Run validation locally:
   ```bash
   npm install
   npm run lint
   npm run test:e2e
   ```
3. Create a release artifact:
   ```bash
   bash scripts/release/release.sh
   ```
4. Validate that the artifact exists in the generated dist folder.
5. Deploy the artifact to the staging environment.
6. Confirm the résumé app loads, the release signal reports `ready`, and the API health endpoint responds.

## Rollback

If deployment or validation fails:

1. Restore the previous known-good artifact.
2. Redeploy the last working version.
3. Confirm the app is healthy through smoke checks.
4. Review the release notes and identify the cause before retrying.

## Quality gate expectations

Before a release, the team should verify:

- résumé app and tutorial load correctly
- release signal renders from the REST/JSON API
- the backend health endpoint responds normally
- tests pass in CI
- deployment script executes cleanly

## Operational notes

This project is intentionally compact, but it mirrors the real release process: build, validate, automate, release, document, and support rollback.
