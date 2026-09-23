# DevOps & Release Engineer résumé PWA

An installable, responsive résumé that doubles as a small delivery-engineering portfolio project. The app itself demonstrates the workflow it describes:

- semantic HTML, responsive CSS, and browser JavaScript
- REST and JSON via a small Express release-signal API
- PWA manifest and service-worker cache for an installable/offline-ready app shell
- Playwright end-to-end checks (functional, accessibility, PWA, viewport, API/network) as executable quality gates
- GitHub Actions CI validation and a Bash release-artifact script
- a `render.yaml` Blueprint deploying to Render, triggered by CI only after quality gates pass
- a guided in-app tutorial with safe next exercises

## Live demo

- Résumé: https://resume-ui-6n6h.onrender.com
- Release-signal API: https://resume-api-3pl5.onrender.com

## Getting started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The UI runs on port `3000`; the JSON API runs on port `3001`.

The in-app tutorial at `http://localhost:3000/tutorial.html` is the recommended step-by-step path for learning each layer and extending it with confidence.

## Testing & quality gates

```bash
npm run lint       # syntax checks across UI and API
npm run test:e2e   # Playwright suite (functional, a11y, PWA, viewport, API)
npm run ci:check   # lint + test:e2e, the same gate CI runs
bash scripts/release/release.sh demo-1   # package a release artifact
```

## Project map

```text
apps/resume-ui/        Resume PWA, static server, manifest, service worker, tutorial
services/resume-api/   Express REST/JSON release-signal API
tests/e2e/             Playwright quality gates
.github/workflows/     CI workflow
scripts/release/       Bash packaging and release notes
scripts/render/        Build-time config generator for the resume-ui Render deploy
render.yaml            Render Blueprint (Infrastructure as Code) for both services
docs/runbook.md        Operational handoff and rollback guidance
```

## Deployment

Deployed to Render from `render.yaml` (see [docs/runbook.md](docs/runbook.md) for the one-time setup and full deployment process). Once set up, CI deploys automatically on every push to `main`, but only after lint and Playwright pass — deploys require two GitHub Actions secrets, `RENDER_DEPLOY_HOOK_RESUME_API` and `RENDER_DEPLOY_HOOK_RESUME_UI`, which are skipped (not failed) if unset.

## Tech stack

| Layer      | Tech                                  |
| ---------- | -------------------------------------- |
| UI         | Vanilla HTML/CSS/JS, PWA (manifest + service worker) |
| API        | Node.js, Express, CORS                |
| Testing    | Playwright, axe-core (accessibility)  |
| CI/CD      | GitHub Actions, Render Blueprint       |
