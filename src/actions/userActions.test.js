import { beforeEach, describe, expect, it, vi } from "vitest";

import apiClient from "../api/client";
import { NETWORK_ERROR_MESSAGE } from "../api/errors";
import {
  LOAD_USER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
} from "../constants/userConstants";
import { loadUser } from "./userActions";

vi.mock("../api/client", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("loadUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("restores the authenticated user from the session endpoint", async () => {
    const user = { id: "admin-1", role: "admin" };
    apiClient.get.mockResolvedValue({ data: { user } });
    const dispatch = vi.fn();

    await loadUser()(dispatch);

    expect(apiClient.get).toHaveBeenCalledWith("/api/v1/me");
    expect(dispatch.mock.calls).toEqual([
      [{ type: LOAD_USER_REQUEST }],
      [{ type: LOAD_USER_SUCCESS, payload: user }],
    ]);
  });

  it("turns a response-less network failure into a safe failure action", async () => {
    apiClient.get.mockRejectedValue({ request: {} });
    const dispatch = vi.fn();

    await expect(loadUser()(dispatch)).resolves.toBeNull();

    expect(dispatch.mock.calls).toEqual([
      [{ type: LOAD_USER_REQUEST }],
      [{ type: LOAD_USER_FAIL, payload: NETWORK_ERROR_MESSAGE }],
    ]);
  });
});
