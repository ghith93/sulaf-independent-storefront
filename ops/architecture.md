# RAWAA Autonomous Operations — Initial Architecture

## Current baseline
The repository is a public, static RAWAA storefront deployed with GitHub Pages. The storefront remains the production surface. The operations system is kept under `ops/` and must not interfere with the site build or deployment.

## Proposed layers
1. **Source of truth:** this Git repository for public procedures, task definitions, non-sensitive decisions, and automation code.
2. **Event automation:** GitHub Actions for bounded, event-driven or scheduled jobs. Actions are not a persistent server.
3. **Agent execution:** a replaceable agent runtime. DroidRunner may run GitHub Actions jobs on the Android device if its installed runner is configured and online; it is not itself proof of a ChatGPT remote-control bridge.
4. **Memory:** curated Markdown records and dated decision logs. No secrets or personal/customer data.
5. **External services:** add only after verifying free-tier limits, terms, authentication, and a working end-to-end test.

## Deployment boundaries
- Storefront deployment remains unchanged.
- Operations workflows must not deploy the website.
- New workflows start with read-only permissions and manual dispatch.
- Any workflow that writes to the repository must be scoped to a dedicated branch and reviewed.
- No public workflow may print secrets, expose customer data, or execute untrusted pull-request code with write permissions.

## First milestones
- M0: isolate operations workspace (this change).
- M1: document roles, task format, memory, and approval policy.
- M2: add read-only repository health checks.
- M3: validate Android runner execution with a harmless manual workflow.
- M4: evaluate a secure, supported bridge for remote orchestration; do not assume ChatGPT can reach a private device directly.
