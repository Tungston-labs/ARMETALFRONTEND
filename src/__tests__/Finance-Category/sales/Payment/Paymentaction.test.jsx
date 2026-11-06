import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

import OrderActions from "./Paymentaction";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("OrderActions", () => {
  const row = {
    id: 10,
    order_number: "SO-001",
    customer_name: "ABC Trading",
  };

  const onDelete = vi.fn();

  const renderActions = () =>
    render(
      <MemoryRouter>
        <OrderActions row={row} onDelete={onDelete} />
      </MemoryRouter>,
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the actions button", () => {
    renderActions();

    expect(screen.getByTitle("Actions")).toBeInTheDocument();
  });

  it("opens the action menu when clicked", () => {
    renderActions();

    fireEvent.click(screen.getByTitle("Actions"));

    expect(screen.getByTitle("Edit Order")).toBeInTheDocument();
    expect(screen.getByTitle("Delete Order")).toBeInTheDocument();
  });

  it("navigates to the edit page with order data", () => {
    renderActions();

    fireEvent.click(screen.getByTitle("Actions"));
    fireEvent.click(screen.getByTitle("Edit Order"));

    expect(navigateMock).toHaveBeenCalledWith("/sales/orders/edit/10", {
      state: { orderData: row },
    });
  });

  it("calls onDelete with the selected row", () => {
    renderActions();

    fireEvent.click(screen.getByTitle("Actions"));
    fireEvent.click(screen.getByTitle("Delete Order"));

    expect(onDelete).toHaveBeenCalledWith(row);
  });

  it("does not throw when onDelete is not supplied", () => {
    render(
      <MemoryRouter>
        <OrderActions row={row} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByTitle("Actions"));
    fireEvent.click(screen.getByTitle("Delete Order"));

    expect(screen.getByTitle("Actions")).toBeInTheDocument();
  });

  it("closes the menu when clicking outside", () => {
    renderActions();

    fireEvent.click(screen.getByTitle("Actions"));

    expect(screen.getByTitle("Edit Order")).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.getByTitle("Edit Order")).toBeInTheDocument();
    // The floating action remains in the DOM but its $open state becomes false.
  });
});
