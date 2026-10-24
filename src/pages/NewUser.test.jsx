import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { combineReducers, createStore } from "redux";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { newUser } from "../actions/userActions";
import { AlertProvider } from "../components/alerts/AlertProvider";
import { adminUserCreationReducer, authReducer } from "../reducers/userReducers";
import NewUser from "./NewUser";

vi.mock("../actions/userActions", () => ({
  newUser: vi.fn((payload) => ({ type: "TEST_CREATE_USER", payload })),
}));

const renderForm = () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      newUser: adminUserCreationReducer,
    }),
    {
      auth: {
        loading: false,
        isAuthenticated: true,
        user: { id: "admin-1", role: "admin" },
        error: null,
      },
      newUser: {
        loading: false,
        success: false,
        createdUser: null,
        error: null,
      },
    }
  );

  return render(
    <Provider store={store}>
      <AlertProvider>
        <NewUser />
      </AlertProvider>
    </Provider>
  );
};

const fillRequiredFields = async (user, password, confirmation) => {
  await user.type(screen.getByLabelText("الاسم"), "New User");
  await user.type(screen.getByLabelText("البريد الإلكتروني"), "new@example.com");
  await user.type(screen.getByLabelText("رقم الهاتف"), "0500123456");
  await user.type(screen.getByLabelText("كلمة السر"), password);
  await user.type(screen.getByLabelText("تأكيد كلمة السر"), confirmation);
};

describe("NewUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("defaults the created account role to user", () => {
    renderForm();

    expect(screen.getByLabelText("نوع المستخدم")).toHaveValue("user");
  });

  it("blocks submission when password confirmation does not match", async () => {
    const user = userEvent.setup();
    renderForm();
    await fillRequiredFields(user, "secret-123", "different-456");

    await user.click(screen.getByRole("button", { name: "حفظ" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "كلمتا السر غير متطابقتين."
    );
    expect(newUser).not.toHaveBeenCalled();
  });

  it("submits a plain user object with the default role", async () => {
    const user = userEvent.setup();
    renderForm();
    await fillRequiredFields(user, "secret-123", "secret-123");

    await user.click(screen.getByRole("button", { name: "حفظ" }));

    expect(newUser).toHaveBeenCalledWith({
      name: "New User",
      email: "new@example.com",
      phone: "0500123456",
      phone2: "",
      role: "user",
      password: "secret-123",
      confPassword: "secret-123",
    });
  });
});
