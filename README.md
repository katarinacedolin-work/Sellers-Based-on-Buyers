# Campus Connect Prototype

A front-end-only prototype of the Campus Connect student marketplace. All data flows through `shared/api.js`, which runs against an in-memory mock today and is shaped so each method can become one real request later.

## Run it

From this directory:

```bash
python -m http.server 4173
```

Then open `http://localhost:4173` for the buyer marketplace or `http://localhost:4173/seller.html` for the Seller Hub.

## Architecture

```
api.js  →  store.js (data cache + UI state)  →  views  →  actions  →  app.js shell
```

- **`shared/api.js`** — the only place that knows where data comes from. Every method is async and returns plain JSON copies. Swap the bodies for `fetch` when the middleware is ready; keep the names, arguments and return shapes.
- **`shared/mock-data.js`** — seed for the mock. Delete once the API talks to a real service.
- **`shared/store.js`** — `data` (API cache) and `state` (UI). Views read `data`; writes go through `api` then `load`/`refresh`.
- **`shared/ui.js`** — registries (`VIEWS`, `ACTIONS`, `FORMS`, `NAV_PARENTS`, `NOTIFICATION_TARGETS`) plus toasts, modals and booking UI.
- **`shared/app.js`** — shell: render, header chrome, click/submit routing, page start.
- **`buyer/`** — marketplace views and actions (`index.html`).
- **`seller/`** — Seller Hub views and actions (`seller.html`). Reuses buyer views for “preview as buyer”.

Buyer and seller pages share the same stack. Switching modes hands the mock database to the other page through `sessionStorage`, so a booking made as a buyer shows up in the Seller Hub.

## What is implemented

**Buyer:** Home, Book/Shop/Search, listing detail with booking or quantity, demo checkout, orders (including ticket QR), sellers and stores, school services, jobs, housing, tickets, chore board (offer → auto-approve → pay), inbox, You, settings, quick sell.

**Seller Hub:** Dashboard, listings manager and editor, new listing, orders list/week and detail, ticket scan, analytics, inbox, notifications, profile (availability, calendar connect, verification), weekly hours, store editor, reviews, payouts. Preview any listing/store/profile as a buyer.

All content is local demo data. No backend, payment processor, database, authentication provider or external integrations are connected.
