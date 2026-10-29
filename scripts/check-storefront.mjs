import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../styles.css", import.meta.url), "utf8");
const js = readFileSync(new URL("../app.js", import.meta.url), "utf8");
const sitemap = readFileSync(new URL("../sitemap.xml", import.meta.url), "utf8");
const robots = readFileSync(new URL("../robots.txt", import.meta.url), "utf8");

assert.match(html, /<html lang="ar" dir="rtl">/, "Arabic RTL document metadata is required");
assert.match(html, /<meta name="description"/, "SEO description is required");
assert.match(html, /<meta property="og:title"/, "Social sharing title is required");
assert.match(html, /<title>رواء/, "RAWAA page title is required");
assert.match(html, /application\/ld\+json/, "Structured product data is required");
assert.match(html, /href="favicon\.svg"/, "Favicon must be linked");
assert.match(html, /سيروم رواء/, "Product copy is required");
assert.match(html, /50\s*مل/, "Product size must be visible in Arabic");
assert.match(html, /\$19\.90/, "30 ml price must be visible");
assert.match(html, /\$21\.90/, "50 ml hero price must be visible");
assert.match(html, /\$27\.90/, "100 ml value price must be visible");
assert.match(html, /\$39\.90/, "Two-unit launch bundle must be visible");
assert.match(html, /\$54\.90/, "Three-unit launch bundle must be visible");
assert.match(html, /وفّري \$3\.90/, "Two-unit savings must be transparent");
assert.match(html, /وفّري \$10\.80/, "Three-unit savings must be transparent");
assert.match(html, /لا يُجمع مع أي خصم آخر/, "Offer stacking terms must be explicit");
assert.match(html, /https:\/\/wa\.me\/963997310856/, "WhatsApp order URL must be present");

const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]));
for (const match of html.matchAll(/href="#([^"]+)"/g)) {
  assert.ok(ids.has(match[1]), `Anchor target #${match[1]} must exist`);
}
for (const section of ["product", "story", "ritual", "faq"]) {
  assert.ok(ids.has(section), `Missing ${section} section`);
}

const images = [...html.matchAll(/<img\b[^>]*>/g)].map((match) => match[0]);
assert.ok(images.length > 0, "At least one storefront image is required");
for (const image of images) {
  assert.match(image, /\balt="[^"]*"/, "Every image must have an alt attribute");
}
assert.match(html, /<details>/, "Accessible native FAQ disclosures are required");
assert.match(html, /loading="lazy"/, "Below-the-fold images should lazy-load");
assert.match(html, /fetchpriority="high"/, "Hero image should be prioritized");
assert.match(css, /@media\s*\(max-width:\s*620px\)/, "Mobile responsive styles are required");
assert.match(css, /prefers-reduced-motion/, "Reduced-motion preference must be respected");
assert.match(js, /aria-expanded/, "Accessible mobile navigation state is required");
assert.match(js, /navigation\.classList\.remove\("open"\)/, "Mobile navigation should close after choosing a link");
assert.match(sitemap, /https:\/\/ghith93\.github\.io\/sulaf-independent-storefront\//, "Sitemap must point to the deployed site");
assert.match(robots, /Sitemap:/, "Robots file must advertise the sitemap");
assert.doesNotMatch(html, /YOUR_SUBDOMAIN|TODO_INSERT/, "No placeholder deployment URL should remain in HTML");

console.log("RAWAA static storefront checks passed.");
