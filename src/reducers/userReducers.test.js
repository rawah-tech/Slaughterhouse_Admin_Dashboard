import { combineReducers, createStore } from "redux";
import { describe, expect, it } from "vitest";

import {
  ADMIN_CREATE_USER_REQUEST,
  ADMIN_CREATE_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOGIN_FAIL,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_FAIL,
  LOGOUT_SUCCESS,
} from "../constants/userConstants";
import { adminUserCreationReducer, authReducer } from "./userReducers";

describe("authReducer", () => {
  it("starts in session-restoration mode", () => {
    expect(authReducer(undefined, { type: "@@init" })).toEqual({
      user: null,
      isAuthenticated: false,
      loading: true,
      error: null,
    });
  });

  it("handles login loading, success, and failure", () => {
    const requestState = authReducer(undefined, { type: LOGIN_REQUEST });
    expect(requestState).toMatchObject({ loading: true, isAuthenticated: false });

    const administrator = { id: "admin-1", role: "admin" };
    expect(
      authReducer(requestState, { type: LOGIN_SUCCESS, payload: administrator })
    ).toMatchObject({
      loading: false,
      isAuthenticated: true,
      user: administrator,
      error: null,
    });

    expect(
      authReducer(requestState, { type: LOGIN_FAIL, payload: "Denied" })
    ).toMatchObject({
      loading: false,
      isAuthenticated: false,
      user: null,
      error: "Denied",
    });
  });

  it("restores and rejects a backend session explicitly", () => {
    const checking = authReducer(undefined, { type: LOAD_USER_REQUEST });
    expect(checking.loading).toBe(true);

    const user = { id: "admin-1", role: "admin" };
    expect(
      authReducer(checking, { type: LOAD_USER_SUCCESS, payload: user })
    ).toMatchObject({ loading: false, isAuthenticated: true, user });

    expect(
      authReducer(checking, { type: LOAD_USER_FAIL, payload: "No session" })
    ).toMatchObject({
      loading: false,
      isAuthenticated: false,
      user: null,
      error: "No session",
    });
  });

  it("clears local identity for successful and failed logout requests", () => {
    const authenticated = {
      loading: false,
      isAuthenticated: true,
      user: { id: "admin-1", role: "admin" },
      error: null,
    };

    expect(authReducer(authenticated, { type: LOGOUT_SUCCESS })).toEqual({
      loading: false,
      isAuthenticated: false,
      user: null,
      error: null,
    });

    expect(
      authReducer(authenticated, { type: LOGOUT_FAIL, payload: "Offline" })
    ).toEqual({
      loading: false,
      isAuthenticated: false,
      user: null,
      error: "Offline",
    });
  });
});

describe("administrator user creation", () => {
  it("does not replace the authenticated administrator", () => {
    const rootReducer = combineReducers({
      auth: authReducer,
      newUser: adminUserCreationReducer,
    });
    const administrator = { id: "admin-1", role: "admin" };
    const store = createStore(rootReducer, {
      auth: {
        loading: false,
        isAuthenticated: true,
        user: administrator,
        error: null,
      },
      newUser: adminUserCreationReducer(undefined, { type: "@@init" }),
    });

    store.dispatch({ type: ADMIN_CREATE_USER_REQUEST });
    store.dispatch({
      type: ADMIN_CREATE_USER_SUCCESS,
      payload: { id: "new-user", role: "user" },
    });

    expect(store.getState().auth.user).toEqual(administrator);
    expect(store.getState().newUser).toMatchObject({
      loading: false,
      success: true,
      createdUser: { id: "new-user", role: "user" },
    });
  });
});
