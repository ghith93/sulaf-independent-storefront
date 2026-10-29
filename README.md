# Sulaf — Arabic AI interface and multi-provider router

This repository now includes a lightweight Arabic web interface and a Cloudflare Worker gateway. It is a small alternative to running the full LiteLLM proxy; it does not install or run LiteLLM itself.

## Components
- `index.html`, `styles.css`, `app.js`: responsive Arabic interface.
- `worker.js`: server-side provider router with fallback.
- `wrangler.toml`: Cloudflare Worker configuration.
- `.github/workflows/deploy-ai-router.yml`: deploy workflow.
- `.github/workflows/ai-provider-smoke.yml`: API smoke tests.

## Provider order
Automatic mode tries OpenRouter, Gemini, Cloudflare Workers AI, then Cohere. Groq and Mistral are excluded for now because recent smoke tests returned HTTP 403 and HTTP 429 respectively.

## Deployment requirements
The GitHub repository needs the Cloudflare secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. The Cloudflare token must allow Worker script deployment and Worker secret management. Provider keys are copied from GitHub Actions secrets into Cloudflare Worker secrets by the deploy workflow; they are not placed in browser JavaScript.

Optional provider secrets: `GEMINI_API_KEY`, `OPENROUTER_API_KEY`, and `COHERE_API_KEY`. Cloudflare Workers AI uses the Worker AI binding.

## Current deployment note
The first deployment attempt failed because the Cloudflare API token does not have access to the Worker secrets resource. Update its permissions in Cloudflare, then rerun **Deploy Sulaf AI Router** in GitHub Actions. Until that workflow succeeds, the browser UI cannot send live AI requests. After deployment, set `API_BASE` in `app.js` to the Worker URL shown in the deployment log.

## Important limits
- GitHub Actions is for automation and tests, not a persistent API server.
- Free model quotas and service limits can change.
- The current in-memory rate limit is only a basic safeguard, not distributed production-grade protection. Add Cloudflare Rate Limiting or authentication before wider public use.
- Never put provider API keys in client-side files or share them in chat.
