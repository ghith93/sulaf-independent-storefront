import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
const js = readFileSync(new URL("../app.js", import.meta.url), "utf8");

assert.match(html, /<html lang="ar" dir="rtl">/, "Arabic RTL document metadata is required");
assert.match(html, /<meta name="description"/, "SEO description is required");
assert.match(html, /<title>رواء/, "RAWAA page title is required");
assert.match(html, /سيروم رواء/, "Product copy is required");
assert.match(html, /50\s*مل/, "Product size must be visible in Arabic");
assert.match(html, /\$12/, "Approved price must be visible");
assert.match(html, /https:\/\/wa\.me\/963997310856/, "WhatsApp order URL must be present");
assert.match(html, /id="product"/, "Product section anchor is required");
assert.match(html, /id="philosophy"/, "Brand story section anchor is required");
assert.match(css, /@media\s*\(max-width:\s*600px\)/, "Mobile responsive styles are required");
assert.match(css, /prefers-reduced-motion/, "Reduced-motion preference must be respected");
assert.match(js, /aria-expanded/, "Accessible mobile navigation state is required");
assert.doesNotMatch(html, /YOUR_SUBDOMAIN|TODO_INSERT/, "No placeholder deployment URL should remain in HTML");

console.log("RAWAA static storefront checks passed.");
