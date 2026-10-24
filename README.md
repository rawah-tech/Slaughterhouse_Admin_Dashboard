# Arabic Slaughterhouse Admin Dashboard

An Arabic, right-to-left portfolio application for administering a slaughterhouse platform. The frontend manages users, livestock products, orders, deliveries, offers, and business information through a separate REST API.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.4-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Interface](https://img.shields.io/badge/interface-Arabic_RTL-0A7E8C)](#arabic-and-rtl-interface)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE.md)

## Overview

This repository contains the administration frontend only. It presents operational data from a compatible backend in an Arabic RTL interface based on the open-source Volt React Dashboard design system.

The implemented workflows include:

- Dashboard counts, revenue totals, and order-status charts.
- Order review, status updates, and driver assignment.
- User creation, listing, role updates, and deletion for `user`, `admin`, and `driver` roles.
- Livestock product creation, image upload, weight and price maintenance, listing, updating, and deletion.
- Offer and business-contact-information management.
- Cookie/session sign-in restoration and administrator route guards.

This is a portfolio project, not a claim of production readiness. A backend, deployment configuration, and real service credentials are intentionally not included.

## Technology Stack

The versions below are pinned in `package.json` so the modernization remains controlled and reproducible.

| Technology | Version | Responsibility |
| --- | ---: | --- |
| React / React DOM | 18.3.1 | Component UI and concurrent-compatible root API |
| Vite / React plugin | 8.3.4 / 6.1.2 | Development server and production bundling |
| React Router DOM | 5.3.4 | Hash-based routing and v5-compatible redirect state |
| Redux / React Redux / Thunk | 4.2.0 / 8.0.2 / 2.4.1 | Application state and asynchronous actions |
| Axios | 1.20.0 | Centralized REST client with cookie support and timeouts |
| Themesberg React Bootstrap | 1.4.1 | Volt-compatible UI components |
| Bootstrap | 5.0.0-beta1 package / 5.0.2 RTL stylesheet | Existing Volt theme compatibility and document-level RTL styles |
| Chartist | 0.11.4 | Dashboard visualizations through a local React wrapper |
| Google Maps React API | 2.20.8 | Optional map rendering when a configured key is present |
| Sass | 1.105.2 | Dart Sass compiler replacing `node-sass` |
| Vitest / jsdom | 4.1.12 / 29.1.1 | Deterministic browser-like unit and integration tests |
| React Testing Library | 16.3.2 | User-focused component tests |

Create React App, `react-scripts`, `node-sass`, browser `form-data`, Yarn, template analytics, and incompatible legacy React wrappers were removed during the modernization.

## Requirements

- Node.js `>=22.12.0 <25`. Node.js 24 LTS is recommended.
- npm `>=10`; the generated npm lockfile is the only supported dependency lockfile.
- A separately running, contract-compatible REST backend for authentication and operational data.

No system-wide legacy Node installation is required.

## Setup

Install the locked dependencies:

```bash
npm ci
```

Copy the safe example values to a local environment file and edit them for your own development environment:

```bash
cp .env.example .env.local
```

On PowerShell, use:

```powershell
Copy-Item .env.example .env.local
```

The local environment file is ignored by Git. Never commit it.

Start the Vite development server:

```bash
npm run dev
```

`npm start` is an alias for the same command. Vite prints the local URL, normally `http://localhost:5173`.

## Environment Variables

`.env.example` contains placeholders only:

```dotenv
VITE_API_BASE_URL=http://localhost:4000
VITE_GOOGLE_MAPS_API_KEY=replace_with_a_restricted_browser_key
```

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Yes for live data | Absolute origin of the separate REST backend. It defaults to `http://localhost:4000` for local development. Existing `/api/v1` paths are preserved. |
| `VITE_GOOGLE_MAPS_API_KEY` | No | Restricted browser key used only for the optional order map. Without it, the application shows a controlled unavailable-map state. |

Vite exposes `VITE_*` values to browser code. A browser Maps key is therefore visible to users by design and must be restricted in Google Cloud to the required Google APIs and approved HTTP referrers.

> **Historical credential warning:** an older public commit contained a Google Maps key. The repository owner must revoke or rotate that historical key separately in Google Cloud. Removing it from the current tree does not invalidate a previously exposed credential, and this repository intentionally does not rewrite Git history.

## Available Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm start` | Alias for `npm run dev` |
| `npm run build` | Create the static production bundle in `dist/` |
| `npm run preview` | Preview the generated bundle locally |
| `npm test` | Run Vitest in watch mode |
| `npm run test:run` | Run the deterministic test suite once |

The build does not require a running backend or a Maps key. Operational data and authenticated workflows do.

## Architecture

```text
src/
|-- actions/             Redux thunks for existing REST endpoint groups
|-- api/                 Shared Axios client and safe API-error normalization
|-- components/          Navigation, data table, charts, maps, alerts, and shared UI
|-- config/              Validated Vite environment access
|-- constants/           Redux action types
|-- data/                Static presentation data
|-- pages/               Sign-in, dashboard, and administration views
|   |-- dashboard/       Dashboard overview
|   `-- examples/        Public error pages
|-- reducers/            Authentication and domain-specific Redux state
|-- scss/                Volt, Bootstrap, and RTL-aware application styles
|-- test/                Vitest setup and test support
|-- index.jsx            React 18 application root and providers
|-- routes.js            Shared route definitions
`-- store.js             Redux store and middleware configuration
```

### Redux and API data flow

1. A page dispatches a Redux Thunk action.
2. The action uses the shared Axios client from `src/api/client.js`.
3. The client sends the existing `/api/v1` path to `VITE_API_BASE_URL`, with a 15-second timeout and `withCredentials: true` for the existing cookie/session design.
4. A domain reducer records request, success, failure, or reset state.
5. Components render the resulting loading, data, and controlled error states.

The frontend does not invent JWT storage and does not persist authentication tokens in `localStorage`.

Administrator-created-user state is separate from session authentication state. Creating a user cannot replace the currently authenticated administrator in Redux. Because the preserved action still uses the existing `/api/v1/register` endpoint, the backend must also be verified not to rotate the administrator's cookie/session during that request.

## Authentication and Authorization Behavior

On initial application load, `loadUser()` runs once to restore the backend cookie/session. Protected content is withheld while that check is in progress.

- Unauthenticated visitors are redirected to sign-in, with the requested location preserved in React Router v5 location state.
- A successful sign-in returns the user to that preserved destination, or to `/dashboard/overview` when there is no saved destination.
- Routes marked as administrator-only require `user.role === "admin"`.
- An authenticated non-admin sees the access-denied view without entering a redirect loop.
- Logout clears local authentication state and returns to sign-in; backend or network failures are converted to controlled messages.

These guards are user-interface controls only. **The backend must authenticate every request and enforce administrator authorization.** Client-side routing is not a security boundary.

## Current Routes

The application retains `HashRouter`, so a dashboard URL has the form `http://localhost:5173/#/dashboard/overview`.

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Sign-in |
| `/dashboard/overview` | Admin | Metrics, charts, and recent orders |
| `/products` | Admin | Product table |
| `/register` | Admin | Create a user using state isolated from Redux authentication |
| `/upgrade` | Admin | User and role management |
| `/admin/user/:id` | Admin | Update a user |
| `/admin/product` | Admin | Create a product |
| `/admin/image` | Admin | Product image workflow |
| `/admin/products` | Admin | Product list and maintenance |
| `/admin/product/:id` | Admin | Update a product |
| `/admin/orders` | Admin | Order list |
| `/admin/order/:id` | Admin | Order details and status update |
| `/admin/delivery/:id` | Admin | Assign a driver |
| `/admin/offer` | Admin | Create an offer |
| `/admin/offers` | Admin | Offer list and maintenance |
| `/admin/offer/:id` | Admin | Update an offer |
| `/addInfo` | Admin | Add business information |
| `/infos` | Admin | Business-information list |
| `/admin/info/:id` | Admin | Update business information |
| `/examples/404` | Public | Not-found page |
| `/examples/500` | Public | Server-error page |

Route constants that are not mounted by the current router are not listed as application features.

## Backend API Requirement

The backend is not included. The frontend preserves the existing endpoint paths and response assumptions found in the source, including examples such as:

| Area | Existing path examples |
| --- | --- |
| Authentication | `/api/v1/login`, `/api/v1/logout`, `/api/v1/me` |
| Users | `/api/v1/admin/users`, `/api/v1/admin/user/:id` |
| Products | `/api/v1/admin/products`, `/api/v1/admin/product/:id` |
| Orders | `/api/v1/admin/orders`, `/api/v1/admin/order/:id` |
| Offers | `/api/v1/offers`, `/api/v1/admin/offer/:id` |
| Business information | `/api/v1/infos`, `/api/v1/admin/info/:id` |
| Deliveries | `/api/v1/admin/deliverys`, `/api/v1/admin/delivery/:id` |

The following preserved contracts require verification against the absent backend:

- Some offer and delivery paths use inconsistent capitalization or pluralization, and `deliverys` may be a backend-defined spelling.
- The legacy `getInfos()` action calls `/api/v1/OFFERs`, even though the administration list uses `/api/v1/admin/infos`.
- The standalone image page posts an image-only `testImage` payload to `/api/v1/admin/product/new`, which is also the product-creation endpoint.
- Administrator user creation reuses `/api/v1/register`; the frontend isolates Redux state, but only the backend can confirm that this request leaves the administrator's cookie/session unchanged.

Changing these endpoints without backend evidence would be guesswork, so their current paths are retained.

## Tests

The Vitest and React Testing Library suite is designed to run without a backend, real Maps key, or live network calls. It covers the high-risk behaviors introduced or repaired in this modernization:

- Protected-route loading, unauthenticated redirect state, administrator access, and non-admin denial.
- Authentication reducer request, restoration, success, failure, and logout transitions.
- Single-dispatch session restoration at the application root.
- Safe handling of structured, network, timeout, and unknown API failures.
- Separation of administrator user creation from the authenticated session.
- Default user role and password-confirmation validation.
- Sign-in phone/password submission, duplicate-submit prevention, and destination redirect behavior.
- Controlled missing-Maps-key behavior without loading Google scripts.

Run the suite once with:

```bash
npm run test:run
```

These are frontend tests with mocked API calls. They are not end-to-end verification against a live backend.

## Arabic and RTL Interface

RTL is configured at both document and component levels:

```html
<html lang="ar" dir="rtl">
```

```jsx
<ThemeProvider dir="rtl">
```

Arabic navigation, forms, tables, alerts, and administration workflows are retained. The Bootstrap 5.0.2 RTL stylesheet and the local Volt theme (built against the retained Bootstrap 5.0.0-beta1 package) remain part of the presentation layer.

## Security Notes

- Keep real credentials, API origins containing secrets, customer data, and unrestricted Maps keys out of Git.
- Cookie/session requests use `withCredentials`; the backend must configure CORS, cookies, CSRF defenses, authentication, and authorization correctly.
- API errors are normalized so a missing response, timeout, or unexpected payload does not cause a second frontend exception.
- Browser-side validation improves feedback but never replaces backend validation.
- The historical Maps key must be rotated or revoked even though no real key is present in the current source.
- No third-party Themesberg Google Tag Manager or Google Analytics code remains in the HTML entry point.

## Known Limitations

- The REST backend and its source are not included.
- Backend endpoint paths and response shapes cannot be fully runtime-verified in this repository alone.
- The backend session effect of administrator creation through `/api/v1/register` is not verifiable from this frontend repository.
- Frontend route guards do not replace backend administrator authorization.
- No deployment or hosting configuration is included or claimed.
- No real Google Maps key is included.
- Authenticated business-page and end-to-end behavior requires a compatible backend and is not claimed as verified here.
- The retained Volt/Bootstrap SCSS uses legacy Sass `@import` syntax and may emit deprecation warnings even when the build succeeds.

## Portfolio Highlights

- Controlled migration from Create React App 3 and React 16 to Vite and React 18.
- Session-restoring authentication with role-aware React Router v5 guards.
- Separate Redux state for public authentication and administrator-created users.
- Centralized environment validation, Axios configuration, and defensive API errors.
- Native browser `FormData` for uploads and plain objects for JSON forms.
- React 18-compatible local table, chart, alert, and Maps integration boundaries replacing incompatible wrappers.
- Deterministic tests for authorization, authentication, form, and failure paths.
- Arabic RTL behavior and the existing business workflows preserved.

## Attribution and License

The interface is adapted from the open-source [Volt React Dashboard](https://github.com/themesberg/volt-react-dashboard) by [Themesberg](https://themesberg.com/). Volt is distributed under the MIT License.

Application-specific workflows and Arabic administration features were developed by **Rawah Hassan**.

The original Themesberg copyright notice and MIT terms remain in [LICENSE.md](LICENSE.md) and in the retained source headers. They must be preserved when redistributing substantial portions of the template.

Repository: [rawah-tech/React-Dashboard](https://github.com/rawah-tech/React-Dashboard)
