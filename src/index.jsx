// =========================================================
// * Volt React Dashboard
// =========================================================

// * Product Page: https://themesberg.com/product/dashboard/volt-react
// * Copyright 2021 Themesberg (https://www.themesberg.com)
// * Official Repository: https://github.com/themesberg/volt-react-dashboard
// * License: MIT License (https://themesberg.com/licensing)

// * Designed and coded by https://themesberg.com

// =========================================================

// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. Please contact us to request a removal.

import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";

// core styles
import "./scss/volt.scss";

import HomePage from "./pages/HomePage";
import ScrollToTop from "./components/ScrollToTop";

import { ThemeProvider } from "@themesberg/react-bootstrap";

import { Provider } from "react-redux";
import store from "./store";

import { AlertProvider } from "./components/alerts/AlertProvider";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Application root element was not found.");
}

createRoot(rootElement).render(
  <HashRouter>
    <ScrollToTop />
    <ThemeProvider dir="rtl">
      <Provider store={store}>
        <AlertProvider>
          <HomePage />
        </AlertProvider>
      </Provider>
    </ThemeProvider>
  </HashRouter>
);
