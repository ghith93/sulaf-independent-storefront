import test from "node:test";
import assert from "node:assert/strict";
import worker from "./worker.js";

const origin = "https://ghith93.github.io";
const env = {
  OPENROUTER_API_KEY: "test-openrouter",
  GEMINI_API_KEY: "test-gemini",
  COHERE_API_KEY: "test-cohere",
  AI: { run: async () => ({ response: "SULAF_OK" }) }
};

function request(path, { method = "GET", body, ip = crypto.randomUUID(), requestOrigin = origin } = {}) {
  return new Request("https://sulaf.test" + path, {
    method,
    headers: {
      Origin: requestOrigin,
      "CF-Connecting-IP": ip,
      ...(body === undefined ? {} : { "Content-Type": "application/json" })
    },
    ...(body === undefined ? {} : { body: typeof body === "string" ? body : JSON.stringify(body) })
  });
}

async function jsonResponse(response) {
  return { status: response.status, body: await response.json() };
}

test("health reports configured provider paths and no secrets", async () => {
  const result = await jsonResponse(await worker.fetch(request("/health"), env));
  assert.equal(result.status, 200);
  assert.equal(result.body.ok, true);
  assert.equal(result.body.providers.cloudflare, true);
  assert.equal("OPENROUTER_API_KEY" in result.body, false);
});

test("rejects disallowed origins", async () => {
  const response = await worker.fetch(request("/health", { requestOrigin: "https://evil.example" }), env);
  assert.equal(response.status, 403);
});

test("rejects invalid JSON and malformed messages", async () => {
  const invalidJson = await worker.fetch(request("/chat", { method: "POST", body: "{" }), env);
  assert.equal(invalidJson.status, 400);
  assert.equal((await invalidJson.json()).error, "invalid_json");

  const invalidMessages = await worker.fetch(request("/chat", { method: "POST", body: { messages: [] } }), env);
  assert.equal(invalidMessages.status, 400);
  assert.equal((await invalidMessages.json()).error, "invalid_messages");
});

test("uses Cloudflare Workers AI with chat messages", async () => {
  let captured;
  const testEnv = { AI: { run: async (model, input) => {
    captured = { model, input };
    return { response: "SULAF_OK" };
  } } };
  const result = await jsonResponse(await worker.fetch(request("/chat", {
    method: "POST",
    body: { provider: "Cloudflare Workers AI", messages: [{ role: "user", content: "Reply SULAF_OK" }] }
  }), testEnv));
  assert.equal(result.status, 200);
  assert.equal(result.body.content, "SULAF_OK");
  assert.equal(captured.model, "@cf/meta/llama-3.1-8b-instruct-fast");
  assert.equal(captured.input.messages[0].role, "user");
});

test("falls back to Gemini when OpenRouter fails", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async (url) => {
    if (String(url).includes("openrouter.ai")) return new Response(JSON.stringify({ error: "test failure" }), { status: 503 });
    if (String(url).includes("generativelanguage.googleapis.com")) {
      return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: "GEMINI_OK" }] } }] }), { status: 200 });
    }
    throw new Error("Unexpected URL");
  };
  const result = await jsonResponse(await worker.fetch(request("/chat", {
    method: "POST",
    body: { provider: "auto", messages: [{ role: "user", content: "test" }] }
  }), env));
  assert.equal(result.status, 200);
  assert.equal(result.body.provider, "Gemini");
  assert.equal(result.body.content, "GEMINI_OK");
  assert.equal(result.body.fallback_used, true);
});

test("rate-limits a client after the configured request budget", async () => {
  const ip = crypto.randomUUID();
  let last;
  for (let i = 0; i < 13; i++) {
    last = await worker.fetch(request("/health", { ip }), env);
  }
  // Rate limiting is applied to POST /chat, not health checks.
  assert.equal(last.status, 200);
  for (let i = 0; i < 13; i++) {
    last = await worker.fetch(request("/chat", {
      method: "POST",
      ip,
      body: { provider: "Cloudflare Workers AI", messages: [{ role: "user", content: "test" }] }
    }), env);
  }
  assert.equal(last.status, 429);
  assert.equal((await last.json()).error, "rate_limited");
});
