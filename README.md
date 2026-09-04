# Cape Aloe Co.

Premium South African Aloe Ferox ecommerce storefront for Cape Aloe Co., rooted in Albertinia, Western Cape.

## Stack

- React + Vite
- Plain CSS design system for a lightweight storefront
- React Context for cart state
- Lucide React icons
- Supabase Edge Functions for the server-side Yoco checkout boundary
- Supabase/Postgres order and webhook event storage
- GitHub Actions for lint, production build and GitHub Pages deployment

## Run locally

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run lint
npm run build
```

## Commerce architecture

The browser sends only product IDs and quantities to the `cape-aloe-create-checkout` Supabase Edge Function. The server owns the product catalogue and prices, creates a pending order, and creates the hosted Yoco checkout using the secret Yoco credential stored in Supabase.

The Yoco webhook is handled by `cape-aloe-yoco-webhook`. Its signature is verified server-side before webhook events are stored and order status is changed. A browser return URL is deliberately not treated as proof of payment.

No Yoco secret is shipped in the Vite frontend.

## Launch notes

- Product images currently use remote Unsplash placeholders and should be replaced with Cape Aloe Co. product photography.
- Testimonials are demonstration content and must be replaced with genuine customer reviews before launch.
- Scientific/marketing claims such as “20x stronger” should be substantiated before publication and advertising.
- Contact email is a placeholder until the brand's real mailbox is confirmed.
- Confirm and register the production Yoco webhook URL in the Yoco merchant dashboard before taking live orders.
- Confirm the final production domain and configure `CAPE_ALOE_SITE_URL` in Supabase before switching from the GitHub Pages URL.
- The current storefront promises free courier shipping over R500; any below-threshold delivery fee should be explicitly defined and displayed before production launch.
- Add final POPIA/privacy, terms, shipping and returns information using the brand's real business details before launch.
