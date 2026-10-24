import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Map from "./Map";

describe("Map configuration fallback", () => {
  it("renders a controlled unavailable state when no Maps key is configured", () => {
    render(<Map center={{ lat: 24.7136, lng: 46.6753 }} />);

    expect(screen.getByRole("status")).toHaveTextContent(
      "الخريطة غير متاحة"
    );
    expect(
      document.querySelector('script[src*="maps.googleapis.com"]')
    ).not.toBeInTheDocument();
  });
});
