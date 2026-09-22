# Release Runbook

## Overview

This project demonstrates a lightweight release and QA workflow for the résumé PWA and its release-signal API. The goal is to deliver a small application safely while keeping the process repeatable and documented.

## Environments

- Local: used for development and validation (`npm run dev`)
- Production: two Render services deployed from `render.yaml` —
  `resume-ui` (Static Site) and `resume-api` (Web Service)

## Configuring the resume-ui → resume-api connection

`apps/resume-ui/app.js` reads the resume-api URL from `window.API_BASE_URL`,
which is set by `apps/resume-ui/config.js`. Locally, `config.js` is committed
with a `http://localhost:3001` default and `npm run dev` needs no extra
configuration. When resume-ui is deployed separately from resume-api (e.g. to
Render), `scripts/render/generate-resume-ui-config.js` regenerates
`config.js` at build time from the `API_BASE_URL` environment variable set on
the resume-ui service, so it can be pointed at the deployed resume-api's URL.

## Deployment process

One-time setup, done once via the Render dashboard (not automated, requires
a Render account with repo access):

1. Create a new Blueprint in Render pointing at this repository; it reads
   `render.yaml` and creates the `resume-ui` and `resume-api` services.
2. Set `resume-ui`'s `API_BASE_URL` env var to `resume-api`'s live Render
   URL (`https://resume-api-<slug>.onrender.com`), which triggers a
   `resume-ui` rebuild so `config.js` picks it up.
3. Copy each service's Deploy Hook URL (Settings → Deploy Hook) and store
   them as GitHub Actions secrets: `RENDER_DEPLOY_HOOK_RESUME_API` and
   `RENDER_DEPLOY_HOOK_RESUME_UI`.

After that, every push to `main`:

1. Runs lint, Playwright e2e, and the release-artifact script in CI.
2. Only if all of that passes, CI calls both Render Deploy Hooks, which
   triggers Render to rebuild and deploy `resume-ui` and `resume-api` from
   the latest `main`. (`autoDeployTrigger: off` in `render.yaml` means
   Render itself never deploys on push — CI's quality gates are what
   trigger a deploy.)
3. Confirm the résumé app loads at the `resume-ui` URL, the release signal
   reports `ready`, and `resume-api`'s `/health` endpoint responds.

Note: `apps/resume-ui/server.js` (the plain Node `http` server) is only
used for local dev via `npm run dev` — in production, `resume-ui` is a
static site served directly by Render's CDN, not that server.

## Rollback

If a deploy is unhealthy:

1. In the Render dashboard, open the affected service's Deploys tab and
   click "Redeploy" on the last known-good deploy.
2. Confirm the app is healthy through smoke checks (résumé loads, release
   signal `ready`, `/health` responds).
3. Review the failing CI run's logs and the generated release notes to
   identify the cause before pushing a fix.

## Quality gate expectations

Before a release, the team should verify:

- résumé app and tutorial load correctly
- release signal renders from the REST/JSON API
- the backend health endpoint responds normally
- tests pass in CI
- deployment script executes cleanly

## Operational notes

This project is intentionally compact, but it mirrors the real release process: build, validate, automate, release, document, and support rollback.
