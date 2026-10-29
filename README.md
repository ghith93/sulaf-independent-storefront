# RAWAA — Independent Storefront

Arabic-first, right-to-left editorial storefront for RAWAA hair serum. This repository is the independent preview and deployment project; the original `ghith93/Raawaa-store` repository is kept separate and must not be modified by this workflow.

## Current experience

- Premium editorial layout with Arabic RTL navigation and responsive mobile menu.
- Brand story, product detail, usage guidance, FAQ, and direct WhatsApp inquiry/order links.
- Product details: hair serum, 50 ml, listed at $12.
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
