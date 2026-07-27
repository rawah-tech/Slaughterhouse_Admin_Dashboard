# React Slaughterhouse Admin Dashboard

An Arabic, right-to-left administration dashboard for managing the commercial operations of a slaughterhouse platform. The application provides a central interface for monitoring business metrics and managing orders, users, livestock products, offers, contact information, and delivery assignments.

[![React](https://img.shields.io/badge/React-16.13-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Redux](https://img.shields.io/badge/Redux-4.2-764ABC?logo=redux&logoColor=white)](https://redux.js.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.0_beta-7952B3?logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![Language](https://img.shields.io/badge/interface-Arabic_RTL-0A7E8C)](#arabic-and-rtl-interface)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE.md)

## Overview

This project is the administrative frontend for a slaughterhouse and livestock-ordering system. It communicates with a separate REST API, stores server responses in Redux, and presents the data through an Arabic RTL interface based on the Volt React Dashboard design system.

The dashboard is intended for administrative workflows such as:

- Monitoring total users, products, orders, and revenue.
- Reviewing customer orders and updating order status.
- Assigning drivers to orders.
- Creating and maintaining user accounts and roles.
- Managing livestock products, weights, prices, and images.
- Managing promotional offers.
- Maintaining business contact and bank-account information.

## Main Features

### Dashboard and Reporting

- Displays total customer, product, and order counts.
- Displays aggregated order revenue.
- Presents an order-status chart.
- Includes the latest order-management table on the dashboard.

### Order Management

- Lists orders with their date, address, value, phone number, and status.
- Displays customer, address, phone, and ordered-item details.
- Shows livestock-specific order details such as head, offal, weight, quantity, and price.
- Updates order status.
- Deletes orders.
- Assigns a driver to an order.

### User and Role Management

- Creates users from the administration interface.
- Lists existing users.
- Updates user information.
- Deletes users.
- Supports `user`, `admin`, and `driver` roles.
- Includes login and logout actions connected to the REST API.

### Product Management

- Creates, lists, updates, and deletes products.
- Supports livestock categories including cattle, sheep, and camels.
- Stores head and offal percentages.
- Manages small, medium, and large weight options with corresponding prices.
- Supports product-image uploads.

### Offers and Business Information

- Creates, lists, updates, and deletes promotional offers.
- Manages business email, phone number, and bank-account information.
- Provides success and error feedback through application alerts.

## Technology Stack

| Technology | Responsibility |
| --- | --- |
| React 16 | Component-based user interface |
| React Router 5 | Hash-based client-side routing |
| Redux | Centralized application state |
| Redux Thunk | Asynchronous REST API operations |
| Axios | HTTP communication with the backend |
| Themesberg React Bootstrap | Reusable interface components |
| Bootstrap 5 beta and SCSS | Responsive layout and custom styling |
| Chartist | Dashboard charts |
| Font Awesome | Interface icons |
| React Alert | Success and error notifications |
| Google Maps libraries | Mapping and address-related components |

## Application Architecture

```text
src/
├── actions/          # Async Axios requests and Redux actions
├── components/       # Navigation, widgets, charts, maps, and shared UI
├── constants/        # Redux action-type constants
├── data/             # Static chart, table, and presentation data
├── pages/            # Login, dashboard, and administration screens
│   ├── dashboard/    # Dashboard overview
│   └── examples/     # Login and error pages
├── reducers/         # Domain-specific Redux reducers
├── scss/             # Volt and Bootstrap theme styles
├── client-config.js  # Client-side map configuration
├── index.js          # React entry point and application providers
├── routes.js         # Central route definitions
└── store.js          # Redux store and middleware configuration
```

### Data Flow

1. A page dispatches a Redux Thunk action.
2. The action sends an Axios request to an `/api/v1` endpoint.
3. Create React App forwards the request to the backend configured in `package.json`.
4. The corresponding reducer updates the Redux store.
5. Connected React components render the updated state and display feedback.

## Important Routes

| Route | Purpose |
| --- | --- |
| `/` | Administrator login |
| `/dashboard/overview` | KPIs, revenue, charts, and order overview |
| `/admin/orders` | Order list |
| `/admin/order/:id` | Order details and status update |
| `/admin/delivery/:id` | Driver assignment |
| `/register` | Create a user |
| `/upgrade` | User and role management |
| `/admin/user/:id` | Update a user |
| `/admin/product` | Create a product |
| `/admin/products` | Product list |
| `/admin/product/:id` | Update a product |
| `/admin/offer` | Create an offer |
| `/admin/offers` | Offer list |
| `/admin/offer/:id` | Update an offer |
| `/addInfo` | Add business contact information |
| `/infos` | Contact-information list |
| `/admin/info/:id` | Update contact information |

Because the application uses `HashRouter`, browser URLs appear in the form:

```text
http://localhost:3000/#/dashboard/overview
```

## Backend API Requirement

This repository contains only the React frontend. It expects a compatible backend service to run at:

```text
http://localhost:4000
```

The development proxy is defined in `package.json`, and the frontend calls REST endpoints under `/api/v1`.

The expected API groups include:

| Area | Example endpoints |
| --- | --- |
| Authentication | `/api/v1/login`, `/api/v1/logout`, `/api/v1/me` |
| Users | `/api/v1/admin/users`, `/api/v1/admin/user/:id` |
| Products | `/api/v1/admin/products`, `/api/v1/admin/product/:id` |
| Orders | `/api/v1/admin/orders`, `/api/v1/admin/order/:id` |
| Offers | `/api/v1/offers`, `/api/v1/admin/offer/:id` |
| Contact information | `/api/v1/infos`, `/api/v1/admin/info/:id` |
| Deliveries | `/api/v1/admin/deliverys`, `/api/v1/admin/delivery/:id` |

The frontend cannot authenticate or load operational data unless the matching backend is available.

## Getting Started

### Prerequisites

This is a legacy React project whose dependency versions target:

- Node.js `14.x`—Node.js `14.21.3` is recommended.
- npm `6.x`.
- A compatible backend running on port `4000`.

The included `node-sass@4.14.1` dependency is not compatible with current Node.js releases. Using Node.js 16 or later can cause installation failures.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rawah-tech/React-Dashboard.git
   cd React-Dashboard
   ```

2. Select a compatible Node.js version:

   ```bash
   nvm install 14.21.3
   nvm use 14.21.3
   ```

3. Install the locked dependencies:

   ```bash
   npm ci
   ```

4. Start the required backend service on port `4000`.

5. Start the React development server:

   ```bash
   npm start
   ```

6. Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Starts the development server |
| `npm run build` | Creates an optimized production build |
| `npm run build-local` | Creates a build using a relative public URL |
| `npm test` | Starts the Create React App test runner |
| `npm run deploy` | Runs the legacy GitHub Pages deployment command; additional setup is required |

No project-specific automated tests are currently included.

## Arabic and RTL Interface

The application is configured with:

```jsx
<ThemeProvider dir="rtl">
```

Its primary navigation, forms, tables, and management workflows use Arabic labels. The interface is therefore designed primarily for Arabic-speaking administrators.

## Security and Configuration Notes

- `src/client-config.js` currently contains a client-side Google Maps API key. Treat the existing key as exposed, rotate or revoke it, apply appropriate API and domain restrictions, and move future configuration to an environment variable before deployment.
- The current `ProtectedRoute` component renders administrative pages after loading but does not enforce `isAuthenticated`, the supplied `isAdmin` flag, or role checks. Proper authentication and authorization guards must be implemented before production use.
- The repository does not contain the backend or its authorization rules.
- Do not store production credentials or unrestricted API keys in source control.

## Legacy Project Status

This repository represents an older React implementation and is best treated as a learning or portfolio project. It has not yet been modernized for current production use.

Current constraints include:

- React 16 and Create React App 3.
- Deprecated `node-sass` and other legacy dependencies.
- No included backend service or sample API data.
- No project-specific automated tests.
- A GitHub Pages script that references `gh-pages`, which is not currently declared as a dependency.
- Legacy package metadata inherited from the original Volt template.

## Recommended Modernization

- Upgrade to React 18 or later and migrate from Create React App to Vite.
- Replace `node-sass` with modern Dart Sass.
- Migrate Redux logic to Redux Toolkit.
- Implement real authentication and role-based route guards.
- Move all external-service configuration to environment variables.
- Add a `.gitignore` that excludes `node_modules`, builds, logs, and local environment files.
- Add loading, empty, and consistent error states.
- Add unit, integration, and end-to-end tests.
- Add an `.env.example` and document the backend contract.
- Add continuous integration for linting, tests, and production builds.
- Review Arabic copy, accessibility, and mobile responsiveness.

## Credits

The interface is adapted from the open-source [Volt React Dashboard](https://github.com/themesberg/volt-react-dashboard) by [Themesberg](https://themesberg.com/). The original template is distributed under the MIT License.

Application-specific workflows and Arabic administration features were developed by **Rawah Hassan**.

## Author

**Rawah Hassan**

- GitHub: [@rawah-tech](https://github.com/rawah-tech)
- Repository: [React-Dashboard](https://github.com/rawah-tech/React-Dashboard)

## License

This repository includes the [MIT License](LICENSE.md) from the original Volt React Dashboard project. Preserve the required copyright and license notice when redistributing substantial portions of the template.

