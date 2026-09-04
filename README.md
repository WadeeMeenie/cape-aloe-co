# Cape Aloe Co.

Premium South African Aloe Ferox ecommerce storefront for Cape Aloe Co., rooted in Albertinia, Western Cape.

## Stack

- React + Vite
- Plain CSS design system for a lightweight storefront
- React Context for cart state
- Lucide React icons
- GitHub Actions for lint + production build verification

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

The storefront intentionally does not contain payment secrets. The cart's checkout action is a frontend boundary ready to call a backend `/api/checkout` endpoint. The backend should validate product IDs/prices server-side and create the PayFast transaction/session securely.

Yoco and SnapScan can be added behind the same provider boundary later without coupling payment credentials to the browser.

## Launch notes

- Product images currently use remote Unsplash placeholders and should be replaced with Cape Aloe Co. product photography.
- Testimonials are demonstration content and must be replaced with genuine customer reviews before launch.
- Scientific/marketing claims such as “20x stronger” should be substantiated before publication and advertising.
- Contact email is a placeholder until the brand's real mailbox is confirmed.
