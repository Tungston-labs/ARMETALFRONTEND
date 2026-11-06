import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  InventoryInfoButton,
  StockStatus,
} from "./InventoryInfo.styles";

describe("InventoryInfoButton", () => {
  it("should render the information button", () => {
    render(
      <InventoryInfoButton>
        Info
      </InventoryInfoButton>
    );

    expect(
      screen.getByRole("button")
    ).toBeInTheDocument();
  });

  it("should display its child content", () => {
    render(
      <InventoryInfoButton>
        ?
      </InventoryInfoButton>
    );

    expect(
      screen.getByRole("button")
    ).toHaveTextContent("?");
  });

  it("should support custom accessibility labels", () => {
    render(
      <InventoryInfoButton aria-label="Inventory information">
        i
      </InventoryInfoButton>
    );

    expect(
      screen.getByRole("button", {
        name: "Inventory information",
      })
    ).toBeInTheDocument();
  });
});

describe("StockStatus", () => {
  it("should render in-stock status", () => {
    render(
      <StockStatus className="in-stock">
        In Stock
      </StockStatus>
    );

    expect(
      screen.getByText("In Stock")
    ).toHaveClass("in-stock");
  });

  it("should render low-stock status", () => {
    render(
      <StockStatus className="low-stock">
        Low Stock
      </StockStatus>
    );

    expect(
      screen.getByText("Low Stock")
    ).toHaveClass("low-stock");
  });

  it("should render out-of-stock status", () => {
    render(
      <StockStatus className="out-of-stock">
        Out of Stock
      </StockStatus>
    );

    expect(
      screen.getByText("Out of Stock")
    ).toHaveClass("out-of-stock");
  });

  it("should render an empty status", () => {
    const { container } = render(
      <StockStatus />
    );

    expect(
      container.querySelector("span")
    ).toBeInTheDocument();
  });
});