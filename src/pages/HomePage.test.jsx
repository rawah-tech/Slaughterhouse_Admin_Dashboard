import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { loadUser } from "../actions/userActions";
import { AlertProvider } from "../components/alerts/AlertProvider";
import HomePage from "./HomePage";

vi.mock("../actions/userActions", async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    loadUser: vi.fn(() => ({ type: "TEST_LOAD_USER" })),
  };
});

const application = (store) => (
  <Provider store={store}>
    <AlertProvider>
      <MemoryRouter initialEntries={["/"]}>
        <HomePage />
      </MemoryRouter>
    </AlertProvider>
  </Provider>
);

describe("HomePage session restoration", () => {
  it("dispatches loadUser only once for an application mount", () => {
    const store = createStore(() => ({
      auth: {
        loading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      },
    }));

    const view = render(application(store));
    view.rerender(application(store));

    expect(loadUser).toHaveBeenCalledTimes(1);
  });
});
