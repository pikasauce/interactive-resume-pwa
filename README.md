# DevOps & Release Engineer résumé PWA

An installable, responsive résumé that is also a small delivery-engineering portfolio project. It is tailored to the DevOps & Release Engineer role in `job-files/` and only presents experience supported by the supplied résumé.

The app is intentionally small enough to explain in an interview, while showing the role's workflow in practice:

- semantic HTML, responsive CSS, and browser JavaScript
- REST and JSON via a small Express release-signal API
- PWA manifest and service-worker cache for an installable/offline-ready app shell
- Playwright end-to-end checks as executable quality gates
- GitHub Actions CI validation and a Bash release-artifact script
- a guided tutorial with safe next exercises

## Start here

```bash
npm run dev
```

Open `http://localhost:3000`. The UI is on port `3000`; the JSON API is on port `3001`.

```bash
npm run ci:check
bash scripts/release/release.sh demo-1
```

Read the in-app tutorial at `http://localhost:3000/tutorial.html`. It is the recommended step-by-step path for learning each layer and extending it with confidence.

## Project map

```text
apps/resume-ui/        Resume PWA, static server, manifest, service worker, tutorial
services/resume-api/   Express REST/JSON release-signal API
tests/e2e/             Playwright quality gates
.github/workflows/     CI workflow
scripts/release/       Bash packaging and release notes
docs/runbook.md        Operational handoff and rollback guidance
job-files/             Source job posting and original résumé (private inputs)
```

## Interview walkthrough

Start with the résumé, then open the “Delivery system” section. Explain that the app itself is the sample artifact: its UI reads a JSON release signal; Playwright verifies the candidate-facing flow; CI requires those checks; and the release script emits an artifact plus notes. The existing OVHcloud work is the operational foundation behind the project—CDS change management, release automation, Bash, APIs, documentation, containers, and reliability work.

Do not publish `job-files/` with a public demo unless you intend to expose the source résumé and job posting.
