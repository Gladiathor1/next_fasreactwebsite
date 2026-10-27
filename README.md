# Fabric & Sewing — Storefront

A full e-commerce storefront for a fabric and sewing-supplies shop, built with **Next.js** and **React**. It is a headless front end for a **Magento** back end: product data comes from Magento's GraphQL API, while cart, checkout and customer accounts use Magento's REST API.

## Features

- **Catalogue** — homepage banners and product carousels (featured, new arrivals, popular, special offers), category pages with filters, search, and product detail pages with image galleries and related products
- **Product tools** — quick view, wishlist, product comparison
- **Cart & checkout** — cart drawer, shipping-method selection, address autocomplete with Google Places, card payments via Authorize.Net
- **Customer accounts** — sign up, log in, forgot/reset password, edit account, address book, order history with printable orders
- **Content pages** — about, FAQ, fabric glossary, shipping & returns, privacy, terms, contact, affiliate sign-up, site map
- **SEO & analytics** — `next-seo`, Google Tag Manager
- Optimised images, Sass styles, infinite scrolling, toasts and loaders

## Tech stack

- Next.js 9, React 16
- Redux + redux-thunk, next-redux-wrapper
- Axios (Magento REST) and GraphQL queries
- Formik, react-credit-card-input, credit-card-type
- Sass, Bootstrap, react-slick / owl-carousel
- Google App Engine (deployment)

## Project structure

```
pages/        Routes (home, [product], category/[category], cart, checkout, customer/*, content pages)
components/   Layout, homepage sections, product details, cart, checkout, account, modals
store/        Redux actions, reducers and GraphQL queries
services/     REST (api.js) and GraphQL (graphql.js) clients
utils/        Helpers (e.g. add-to-cart)
assets/       Styles, fonts and images
server.js     Custom Express server for Next.js
app.yaml      Google App Engine config
```

## Getting started

### Configuration

The Magento base URL, GraphQL endpoint, API token settings, Authorize.Net keys and Google API key are read from the `env` block in `next.config.js`. Replace them with your own values — ideally loaded from environment variables rather than committed.

### Run locally

```bash
npm install
PORT=3000 npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production

```bash
npm run build
PORT=3000 npm start
```

### Deploy to Google App Engine

```bash
npm run deploy
```

This builds the app and deploys it with `gcloud app deploy` using `app.yaml`. Change the GCP project ID in the `deploy` script first.
