# RAWAA Independent Storefront (on Sulaf infrastructure)

This branch is an independent Arabic-first storefront prototype for RAWAA. It does not modify the existing `ghith93/Raawaa-store` repository or its deployed website.

## Current scope

- Responsive Arabic RTL brand and product landing page.
- Quiet-luxury editorial styling and CSS-drawn product concept art.
- Product detail for the 50 ml serum at $12.
- Direct WhatsApp order link; no checkout backend or payment processing.
- SEO metadata, mobile navigation, reduced-motion support, and static checks.

## Open-source projects reviewed

- [ScrewFast](https://github.com/mearashadowfax/ScrewFast) — MIT-licensed Astro template with landing pages, product pages, multilingual support, SEO metadata, security headers, and CI. Its architecture informed the site-quality checklist; the template source was not copied.
- [Medusa Next.js Commerce](https://github.com/medusajs/nextjs-starter-medusa) — free/open-source commerce starter with product catalogs, cart, checkout, and account flows. Consider only if RAWAA later needs a full commerce backend.
- [Saleor Storefront](https://github.com/saleor/storefront) — open-source Next.js storefront and checkout architecture; useful for a future catalog and order lifecycle. Check the current license before reusing code.
- [Spree Storefront](https://github.com/spree/storefront) — MIT-licensed Next.js storefront with payment integrations and multi-region support; a possible future direction if online checkout becomes necessary.

No source files from these projects have been copied into this prototype. Their publicly documented patterns were reviewed to inform design and quality checks. Re-check upstream licenses and dependencies before vendoring code.

## Run and validate

Open `index.html` in a browser or serve the directory with any static HTTP server. No package installation or paid service is required to preview the current page.

Run the checks with:

```sh
node scripts/check-storefront.mjs
```

## Before public launch

- Replace the CSS-drawn bottle with approved RAWAA product photography and the official logo.
- Confirm WhatsApp number, product claims, price, shipping policy, and instructions.
- Verify the order link in a real mobile browser.
- Configure separate hosting for this branch; do not change the old store to test this prototype.

## Repository context

This repository also contains Sulaf AI router and automation infrastructure. The RAWAA storefront branch reuses this repository as a separate working location, not as a requirement to deploy or expose the AI router.
