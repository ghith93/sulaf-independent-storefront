# RAWAA — Independent Storefront

A lightweight, Arabic-first, right-to-left storefront for the RAWAA hair-care brand. This repository is now dedicated to the RAWAA storefront; the previous Sulaf application files have been removed from the current `main` tree.

## Current scope

- Responsive Arabic RTL brand and product landing page.
- Quiet-luxury editorial styling and CSS-drawn concept bottle artwork.
- RAWAA hair serum, 50 ml, listed at $12.
- Direct WhatsApp order link; no checkout backend or payment processing.
- SEO metadata, mobile navigation, reduced-motion support, and static checks.

## Preview and checks

Open `index.html` in a browser or serve this directory with any static HTTP server. No package installation or paid service is required for a local preview.

Run the static checks with:

```sh
node scripts/check-storefront.mjs
```

The GitHub Actions workflow runs the static checks on pushes to `main` and pull requests targeting `main`.

## Before public launch

- Replace the CSS-drawn bottle with approved RAWAA product photography and the official logo.
- Confirm the WhatsApp number, product claims, price, shipping policy, and usage instructions.
- Verify the order link in a real mobile browser.
- Configure hosting for this repository independently. Do not connect deployment to `ghith93/Raawaa-store` or change that repository.

## Separation from the existing RAWAA project

The existing `ghith93/Raawaa-store` repository and its deployed website have not been modified. This storefront is maintained in this separate repository. The repository's current GitHub name remains `sulaf-independent-storefront` because repository renaming is not available through the connected GitHub actions; change the repository name in GitHub settings if desired.

## Open-source references

- [ScrewFast](https://github.com/mearashadowfax/ScrewFast) — MIT-licensed Astro template reviewed for quality patterns.
- [Medusa Next.js Commerce](https://github.com/medusajs/nextjs-starter-medusa) — a possible future option if full cart and checkout functionality is required.
- [Saleor Storefront](https://github.com/saleor/storefront) — a future commerce architecture reference; verify its current license before reuse.
- [Spree Storefront](https://github.com/spree/storefront) — MIT-licensed storefront reference for future checkout needs.

No source files from these projects have been copied into this storefront.
