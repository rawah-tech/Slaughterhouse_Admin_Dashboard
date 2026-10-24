import { describe, expect, it } from "vitest";

import {
  DEFAULT_ERROR_MESSAGE,
  NETWORK_ERROR_MESSAGE,
  TIMEOUT_ERROR_MESSAGE,
  getApiErrorMessage,
} from "./errors";

describe("getApiErrorMessage", () => {
  it("uses a structured backend message", () => {
    expect(
      getApiErrorMessage({ response: { data: { message: "Invalid request" } } })
    ).toBe("Invalid request");
  });

  it("handles a network failure without dereferencing a missing response", () => {
    expect(getApiErrorMessage({ request: {} })).toBe(NETWORK_ERROR_MESSAGE);
  });

  it("handles request timeouts", () => {
    expect(getApiErrorMessage({ code: "ECONNABORTED", request: {} })).toBe(
      TIMEOUT_ERROR_MESSAGE
    );
  });

  it("uses a safe fallback for an unknown value", () => {
    expect(getApiErrorMessage(null)).toBe(DEFAULT_ERROR_MESSAGE);
  });
});
