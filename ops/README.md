# RAWAA Operations System

This directory is an isolated workspace for the RAWAA operating system. It does not replace or modify the published storefront.

## Scope
- Operating procedures and decision log
- Agent roles, task contracts, and review gates
- Project memory stored as non-sensitive Markdown
- Automation specifications and health checks

## Non-goals
- No customer records, credentials, API keys, product formulas, supplier prices, or private business data in this public repository.
- No automatic production deployment, payments, destructive changes, or external customer messaging.
- No claim of device control: DroidRunner being connected to GitHub does not create a ChatGPT-to-device control channel.

## Initial operating rules
1. Work on feature branches; never commit operational experiments directly to `main`.
2. Preserve the storefront root, its assets, and its existing deployment workflow.
3. Every automation must have a documented trigger, permissions, inputs, outputs, and rollback.
4. Use least-privilege GitHub permissions and repository secrets for credentials.
5. Require human approval before destructive actions or production changes.

See [architecture](architecture.md), [agent contracts](agents/README.md), and [memory policy](memory/README.md).
