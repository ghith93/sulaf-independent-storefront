# Provider smoke test: checks API connectivity without exposing secrets.
#!/usr/bin/env python3
"""Low-cost provider smoke tests. Never print tokens or full provider responses."""
import json
import os
import sys
import urllib.error
import urllib.request

PROMPT = "Reply with exactly: OK"
TIMEOUT = 25
results = []

def request_json(name, url, token, body=None, headers=None, method=None):
    data = json.dumps(body).encode("utf-8") if body is not None else None
    request_headers = {"Authorization": f"Bearer {token}", "Accept": "application/json"}
    if data is not None:
        request_headers["Content-Type"] = "application/json"
    if headers:
        request_headers.update(headers)
    req = urllib.request.Request(url, data=data, headers=request_headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as response:
            payload = json.loads(response.read().decode("utf-8"))
            return response.status, payload
    except urllib.error.HTTPError as exc:
        # Print only short provider error details, never request headers or tokens.
        try:
            payload = json.loads(exc.read().decode("utf-8"))
            err = payload.get("error", {}) if isinstance(payload, dict) else {}
            if isinstance(err, dict):
                safe = {}
                if isinstance(err.get("code"), (str, int)):
                    safe["code"] = str(err["code"])[:80]
                if isinstance(err.get("type"), str):
                    safe["type"] = err["type"][:80]
                if isinstance(err.get("message"), str):
                    safe["message"] = err["message"][:180]
                return exc.code, {"error": safe}
        except Exception:
            pass
        return exc.code, {}
    except Exception:
        return 0, {}

def record(name, configured, ok, detail):
    state = "PASS" if ok else ("SKIP" if not configured else "FAIL")
    results.append((name, state, detail))
    print(f"{name}: {state} — {detail}")

def chat(name, env_name, url, model, extra_headers=None, body_extra=None):
    token = os.getenv(env_name, "").strip()
    if not token:
        record(name, False, False, f"secret {env_name} is not configured")
        return
    body = {"model": model, "messages": [{"role": "user", "content": PROMPT}], "max_tokens": 12, "stream": False}
    if body_extra:
        body.update(body_extra)
    status, payload = request_json(name, url, token, body, extra_headers)
    ok = status == 200 and isinstance(payload, dict) and (
        bool(payload.get("choices")) or bool(payload.get("id")) or bool(payload.get("message"))
    )
    detail = f"HTTP {status}" if status else "network/TLS/timeout error"
    if ok:
        detail = f"HTTP {status}; inference response received"
    elif status in (401, 403):
        err = payload.get("error", {}) if isinstance(payload, dict) else {}
        code = err.get("code") if isinstance(err, dict) else None
        msg = err.get("message") if isinstance(err, dict) else None
        detail += "; check key and permissions"
        if code:
            detail += f"; provider_code={str(code)[:80]}"
        if msg:
            detail += f"; provider_message={str(msg)[:180]}"
    elif status == 429:
        detail += "; rate limit/quota reached"
    elif status in (400, 404, 422):
        detail += "; model or request may be unavailable"
    record(name, True, ok, detail)

# Google Gemini native REST API
token = os.getenv("GEMINI_API_KEY", "").strip()
if not token:
    record("Gemini", False, False, "secret GEMINI_API_KEY is not configured")
else:
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=" + token
    status, payload = request_json("Gemini", url, "unused", {"contents": [{"parts": [{"text": PROMPT}]}], "generationConfig": {"maxOutputTokens": 12}}, {"Authorization": ""})
    ok = status == 200 and bool(payload.get("candidates"))
    detail = f"HTTP {status}" if status else "network/TLS/timeout error"
    if ok: detail = f"HTTP {status}; inference response received"
    elif status == 429: detail += "; rate limit/quota reached"
    elif status in (400, 401, 403): detail += "; check key, model access, or API enablement"
    record("Gemini", True, ok, detail)

# OpenAI-compatible endpoints
chat("Groq", "GROQ_API_KEY", "https://api.groq.com/openai/v1/chat/completions", "llama-3.1-8b-instant")
chat("OpenRouter", "OPENROUTER_API_KEY", "https://openrouter.ai/api/v1/chat/completions", "openrouter/free",
     {"HTTP-Referer": "https://github.com/ghith93/sulaf-independent-storefront", "X-Title": "Sulaf Provider Smoke Test"})
chat("Mistral", "MISTRAL_API_KEY", "https://api.mistral.ai/v1/chat/completions", "mistral-small-latest")
chat("NVIDIA", "NVIDIA_API_KEY", "https://integrate.api.nvidia.com/v1/chat/completions", "meta/llama-3.3-70b-instruct")

# Cloudflare Workers AI native REST API
token = os.getenv("CLOUDFLARE_API_TOKEN", "").strip()
account = os.getenv("CLOUDFLARE_ACCOUNT_ID", "").strip()
if not token or not account:
    missing = "CLOUDFLARE_API_TOKEN and/or CLOUDFLARE_ACCOUNT_ID"
    record("Cloudflare Workers AI", False, False, f"missing {missing}")
else:
    url = f"https://api.cloudflare.com/client/v4/accounts/{account}/ai/run/@cf/meta/llama-3.1-8b-instruct"
    status, payload = request_json("Cloudflare Workers AI", url, token, {"prompt": PROMPT, "max_tokens": 12})
    ok = status == 200 and payload.get("success") is True and bool(payload.get("result"))
    detail = f"HTTP {status}" if status else "network/TLS/timeout error"
    if ok: detail = f"HTTP {status}; inference response received"
    elif status in (401, 403): detail += "; check token permissions and account ID"
    elif status == 429: detail += "; rate limit/quota reached"
    record("Cloudflare Workers AI", True, ok, detail)

# Cohere v2 chat endpoint
token = os.getenv("COHERE_API_KEY", "").strip()
if not token:
    record("Cohere", False, False, "secret COHERE_API_KEY is not configured")
else:
    status, payload = request_json("Cohere", "https://api.cohere.com/v2/chat", token,
        {"model": "command-r7b-12-2024", "messages": [{"role": "user", "content": PROMPT}], "max_tokens": 12},
        {"Authorization": f"Bearer {token}"})
    ok = status == 200 and bool(payload.get("message") or payload.get("text"))
    detail = f"HTTP {status}" if status else "network/TLS/timeout error"
    if ok: detail = f"HTTP {status}; inference response received"
    elif status == 429: detail += "; rate limit/quota reached"
    record("Cohere", True, ok, detail)

print("\nSummary: " + ", ".join(f"{name}={state}" for name, state, _ in results))
failures = sum(state == "FAIL" for _, state, _ in results)
passes = sum(state == "PASS" for _, state, _ in results)
if passes == 0:
    print("No configured provider completed an inference test; configure at least one working provider.")
    sys.exit(1)
if failures:
    print(f"WARNING: {failures} provider(s) failed, but {passes} provider(s) are operational. Continue using the passing providers and troubleshoot failed providers separately.")
