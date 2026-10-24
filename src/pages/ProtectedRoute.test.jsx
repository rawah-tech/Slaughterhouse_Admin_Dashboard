import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { MemoryRouter, Route, Switch } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import ProtectedRoute from "./ProtectedRoute";

vi.mock("../components/Sidebar", () => ({
  default: () => <aside>Sidebar</aside>,
}));

vi.mock("../components/Navbar", () => ({
  default: () => <nav>Navbar</nav>,
}));

const ProtectedContent = () => <h1>Protected content</h1>;

const renderRoute = (auth, initialEntry = "/admin/secret?tab=details") => {
  const store = createStore(() => ({ auth }));

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Switch>
          <ProtectedRoute
            exact
            path="/admin/secret"
            isAdmin
            component={ProtectedContent}
          />
          <Route
            exact
            path="/"
            render={({ location }) => (
              <div>
                Sign in
                <span data-testid="requested-path">
                  {location.state?.from?.pathname}
                  {location.state?.from?.search}
                </span>
              </div>
            )}
          />
        </Switch>
      </MemoryRouter>
    </Provider>
  );
};

describe("ProtectedRoute", () => {
  it("shows a loader while session restoration is running", () => {
    renderRoute({ loading: true, isAuthenticated: false, user: null });

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
    expect(screen.queryByText("Sign in")).not.toBeInTheDocument();
  });

  it("redirects an unauthenticated visitor to sign-in", () => {
    renderRoute({ loading: false, isAuthenticated: false, user: null });

    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  it("preserves the requested pathname and search in router state", () => {
    renderRoute({ loading: false, isAuthenticated: false, user: null });

    expect(screen.getByTestId("requested-path")).toHaveTextContent(
      "/admin/secret?tab=details"
    );
  });

  it("renders protected layout and content for an administrator", () => {
    renderRoute({
      loading: false,
      isAuthenticated: true,
      user: { id: "admin-1", role: "admin" },
    });

    expect(screen.getByText("Sidebar")).toBeInTheDocument();
    expect(screen.getByText("Navbar")).toBeInTheDocument();
    expect(screen.getByText("Protected content")).toBeInTheDocument();
  });

  it("shows access denied to an authenticated non-admin", () => {
    renderRoute({
      loading: false,
      isAuthenticated: true,
      user: { id: "user-1", role: "user" },
    });

    expect(
      screen.getByRole("heading", { name: "غير مصرح لك بالوصول" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });
});
