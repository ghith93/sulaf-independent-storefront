# RAWAA — Independent Storefront

Arabic-first, right-to-left editorial storefront for RAWAA hair serum. This repository is the independent preview and deployment project; the original `ghith93/Raawaa-store` repository is kept separate and must not be modified by this workflow.

## Current experience

- Premium editorial layout with Arabic RTL navigation and responsive mobile menu.
- Brand story, product detail, usage guidance, FAQ, and direct WhatsApp inquiry/order links.
- Product sizes and approved launch prices: 30 ml $19.90, 50 ml $21.90, 100 ml $27.90.
- SEO and social-sharing metadata, lazy-loaded supporting imagery, prioritized hero image, reduced-motion support, and automated static checks.
- Static GitHub Pages deployment; no paid services or checkout backend required.

## Preview

https://ghith93.github.io/sulaf-independent-storefront/

## Local checks

Requires Node.js; no dependency installation is needed.

```sh
node scripts/check-storefront.mjs
```

GitHub Actions runs checks and deploys the static site from `main`.

## Launch checklist

- Replace editorial reference photos with approved RAWAA campaign/product photography and official logo assets.
- Verify the WhatsApp destination on a real phone.
- Confirm formula/ingredient details, directions, claims, price, delivery coverage, shipping fees, returns, and privacy wording with the brand owner before publishing them.
- This static site sends orders to WhatsApp; it does not process payments or store orders in a database.
- The image assets currently load from Unsplash; self-host approved optimized images for more predictable performance and brand consistency.

## Open-source project references

These repositories were reviewed as architectural/design references, not copied into this lightweight static implementation:

- [ScrewFast](https://github.com/mearashadowfax/ScrewFast) — MIT-licensed Astro template.
- [Medusa Next.js Commerce](https://github.com/medusajs/nextjs-starter-medusa) — potential future option for a full commerce backend.
- [Saleor Storefront](https://github.com/saleor/storefront) — commerce architecture reference; check current license before reuse.
- [Spree Storefront](https://github.com/spree/storefront) — commerce architecture reference.

The repository's current name remains `sulaf-independent-storefront`; renaming it is a separate GitHub repository setting. The original `Raawaa-store` has not been modified.

## RAWAA pricing and launch offer experiment

The launch-pricing presentation on `feat/rawaa-launch-pricing-offers` is a staged proposal and is not deployed to the live site. The 100 ml SKU is the hero; the 50 ml price is intentionally close to make the larger format's incremental value immediately clear.

| Size | Display price | Strategic role |
|---|---:|---|
| 30 ml | $19.90 | Entry/trial size |
| 50 ml | $21.90 | Mid-size comparison option |
| 100 ml | $27.90 | Hero SKU: double the 50 ml quantity for only $6 more; lowest displayed price per ml |

Launch bundles (100 ml only), proposed for 30 October–12 November 2026:
- 2 × 100 ml: $49.90 (regular combined price $55.80; saving $5.90).
- 3 × 100 ml: $69.90 (regular combined price $83.70; saving $13.80).

Rules: bundle prices apply to 100 ml units only and do not stack with the 10% Sham Cash discount or other discounts. Delivery is free across Syria. Every order, regardless of size, includes one free 30 ml sample of a second RAWAA product. A WhatsApp message is an inquiry/order request, not an order confirmation. Do not advertise a countdown, stock limit, or scarcity claim unless it is real and operationally enforceable.

Current planning cost model: $4 manufacturing cost per main serum bottle, $1 for one 30 ml sample per order, and $4 delivery cost per order (absorbed by RAWAA). Indicative contribution before ads, payment fees, extra packing, returns, and operating costs: 30 ml order $10.90; 50 ml order $12.90; 100 ml order $18.90; 2 × 100 ml bundle $36.90; 3 × 100 ml bundle $52.90. These figures assume the $4 manufacturing cost applies to each main bottle and one sample is included per order. Validate payment fees and return/cancellation exposure before launch. The website is a static storefront and does not enforce stock, promo-code eligibility, offer expiry, or discount stacking in a backend; staff must apply these rules consistently when confirming orders. These prices and offer dates are a staged commercial proposal, not evidence of a published promotion.
