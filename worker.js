const MAX_BODY_CHARS = 4000;
const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 12;
const rateBuckets = new Map();

function json(data, status = 200, origin = "") {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": origin || "https://ghith93.github.io",
      "access-control-allow-methods": "GET, POST, OPTIONS",
      "access-control-allow-headers": "Content-Type",
      "vary": "Origin"
    }
  });
}

function allowedOrigin(origin) {
  if (!origin) return "https://ghith93.github.io";
  if (origin === "https://ghith93.github.io" || /^https:\/\/[a-z0-9-]+\.pages\.dev$/.test(origin)) return origin;
  return "";
}

function isRateLimited(ip) {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || now - bucket.start > WINDOW_MS) {
    rateBuckets.set(ip, { start: now, count: 1 });
    if (rateBuckets.size > 2000) {
      for (const [key, value] of rateBuckets) if (now - value.start > WINDOW_MS) rateBuckets.delete(key);
    }
    return false;
  }
  bucket.count += 1;
  return bucket.count > MAX_REQUESTS_PER_WINDOW;
}

async function callProvider(name, env, messages) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18_000);
  try {
    let response;
    let content = "";
    if (name === "Gemini") {
      if (!env.GEMINI_API_KEY) throw new Error("not_configured");
      const prompt = messages.map(m => (m.role === "assistant" ? "Assistant: " : "User: ") + m.content).join("\n\n");
      response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=" + encodeURIComponent(env.GEMINI_API_KEY), {
        method: "POST", signal: controller.signal,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { maxOutputTokens: 700 } })
      });
      const data = await response.json();
      if (!response.ok) throw new Error("upstream_" + response.status);
      content = data.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || "";
    } else if (name === "OpenRouter") {
      if (!env.OPENROUTER_API_KEY) throw new Error("not_configured");
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST", signal: controller.signal,
        headers: { "authorization": "Bearer " + env.OPENROUTER_API_KEY, "content-type": "application/json", "HTTP-Referer": "https://github.com/ghith93/sulaf-independent-storefront", "X-Title": "Sulaf AI Router" },
        body: JSON.stringify({ model: "openrouter/free", messages, max_tokens: 700 })
      });
      const data = await response.json();
      if (!response.ok) throw new Error("upstream_" + response.status);
      content = data.choices?.[0]?.message?.content || "";
    } else if (name === "Cohere") {
      if (!env.COHERE_API_KEY) throw new Error("not_configured");
      response = await fetch("https://api.cohere.com/v2/chat", {
        method: "POST", signal: controller.signal,
        headers: { "authorization": "Bearer " + env.COHERE_API_KEY, "content-type": "application/json" },
        body: JSON.stringify({ model: "command-r7b-12-2024", messages, max_tokens: 700 })
      });
      const data = await response.json();
      if (!response.ok) throw new Error("upstream_" + response.status);
      content = data.message?.content?.map(p => p.text || "").join("") || data.text || "";
    } else if (name === "Cloudflare Workers AI") {
      if (!env.AI) throw new Error("not_configured");
      const prompt = messages.map(m => (m.role === "assistant" ? "Assistant: " : "User: ") + m.content).join("\n\n");
      const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", { prompt, max_tokens: 700 });
      content = result.response || "";
    }
    if (!content.trim()) throw new Error("empty_response");
    return { provider: name, content };
  } finally {
    clearTimeout(timeout);
  }
}

export default {
  async fetch(request, env) {
    const origin = allowedOrigin(request.headers.get("Origin") || "");
    if (!origin) return new Response("Origin not allowed", { status: 403 });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: {
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "GET, POST, OPTIONS",
      "access-control-allow-headers": "Content-Type",
      "access-control-max-age": "86400",
      "vary": "Origin"
    }});
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/health") {
      return json({ ok: true, service: "Sulaf AI Router", providers: {
        gemini: Boolean(env.GEMINI_API_KEY),
        openrouter: Boolean(env.OPENROUTER_API_KEY),
        cohere: Boolean(env.COHERE_API_KEY),
        cloudflare: Boolean(env.AI)
      }}, 200, origin);
    }
    if (request.method !== "POST" || url.pathname !== "/chat") return json({ error: "not_found" }, 404, origin);
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (isRateLimited(ip)) return json({ error: "rate_limited", message: "Too many requests; wait one minute." }, 429, origin);
    let body;
    try { body = await request.json(); } catch { return json({ error: "invalid_json" }, 400, origin); }
    if (!Array.isArray(body.messages) || body.messages.length < 1 || body.messages.length > 12) {
      return json({ error: "invalid_messages", message: "Send 1–12 messages." }, 400, origin);
    }
    const messages = [];
    for (const item of body.messages) {
      if (!item || !["user", "assistant"].includes(item.role) || typeof item.content !== "string" || !item.content.trim()) {
        return json({ error: "invalid_message" }, 400, origin);
      }
      if (item.content.length > MAX_BODY_CHARS) return json({ error: "message_too_long" }, 413, origin);
      messages.push({ role: item.role, content: item.content.trim() });
    }
    const requested = typeof body.provider === "string" ? body.provider : "auto";
    const order = requested === "auto"
      ? ["OpenRouter", "Gemini", "Cloudflare Workers AI", "Cohere"]
      : [requested];
    const errors = [];
    for (const provider of order) {
      try {
        const result = await callProvider(provider, env, messages);
        return json({ ok: true, provider: result.provider, content: result.content, fallback_used: errors.length > 0 }, 200, origin);
      } catch (error) {
        const message = String(error?.message || "");
        errors.push({ provider, reason: message.startsWith("upstream_") ? message : message === "not_configured" ? "not_configured" : "request_failed" });
      }
    }
    return json({ ok: false, error: "all_providers_failed", providers: errors }, 503, origin);
  }
};
