import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { MemoryRouter, Route, Switch } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { login } from "../../actions/userActions";
import { AlertProvider } from "../../components/alerts/AlertProvider";
import Signin from "./Signin";

vi.mock("../../actions/userActions", () => ({
  login: vi.fn((phone, password) => ({
    type: "TEST_LOGIN",
    payload: { phone, password },
  })),
}));

const renderSignin = (auth, initialEntry = "/") => {
  const store = createStore((state = { auth }, action) => {
    if (action.type === "TEST_LOGIN") {
      return { auth: { ...state.auth, loading: true } };
    }

    return state;
  });

  return render(
    <Provider store={store}>
      <AlertProvider>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Switch>
            <Route exact path="/" component={Signin} />
            <Route path="/admin/orders" render={() => <h1>Requested orders</h1>} />
            <Route
              path="/dashboard/overview"
              render={() => <h1>Dashboard overview</h1>}
            />
          </Switch>
        </MemoryRouter>
      </AlertProvider>
    </Provider>
  );
};

describe("Signin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("submits phone and password without coercing the phone number", async () => {
    const user = userEvent.setup();
    renderSignin({
      loading: false,
      isAuthenticated: false,
      user: null,
      error: null,
    });

    await user.type(screen.getByLabelText("رقم الهاتف"), "+9710500123456");
    await user.type(screen.getByLabelText("كلمة السر"), "secret-123");
    await user.click(screen.getByRole("button", { name: "تسجيل الدخول" }));

    expect(login).toHaveBeenCalledWith("+9710500123456", "secret-123");
  });

  it("does not submit while an authentication request is loading", async () => {
    const user = userEvent.setup();
    renderSignin({
      loading: true,
      isAuthenticated: false,
      user: null,
      error: null,
    });

    const button = screen.getByRole("button", { name: "جارٍ تسجيل الدخول..." });
    expect(button).toBeDisabled();
    await user.click(button);
    await user.click(button);
    expect(login).not.toHaveBeenCalled();
  });

  it("suppresses a second submission after the first request starts", async () => {
    const user = userEvent.setup();
    renderSignin({
      loading: false,
      isAuthenticated: false,
      user: null,
      error: null,
    });

    await user.type(screen.getByLabelText("رقم الهاتف"), "0500123456");
    await user.type(screen.getByLabelText("كلمة السر"), "secret-123");
    const button = screen.getByRole("button", { name: "تسجيل الدخول" });

    await user.dblClick(button);

    expect(login).toHaveBeenCalledTimes(1);
  });

  it("redirects an authenticated user to the preserved destination", async () => {
    renderSignin(
      {
        loading: false,
        isAuthenticated: true,
        user: { id: "admin-1", role: "admin" },
        error: null,
      },
      {
        pathname: "/",
        state: { from: { pathname: "/admin/orders" } },
      }
    );

    expect(await screen.findByText("Requested orders")).toBeInTheDocument();
  });

  it("falls back to the dashboard when no destination was preserved", async () => {
    renderSignin({
      loading: false,
      isAuthenticated: true,
      user: { id: "admin-1", role: "admin" },
      error: null,
    });

    expect(await screen.findByText("Dashboard overview")).toBeInTheDocument();
  });
});
