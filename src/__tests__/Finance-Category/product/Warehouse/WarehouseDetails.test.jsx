import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import WarehouseDetails from "./WarehouseDetails";
import {
  fetchWarehouseById,
  clearWarehouseDetail,
} from "../../../../Redux/warehouseSlice";

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useParams: vi.fn(),
}));

vi.mock("../../../../Redux/warehouseSlice", () => ({
  fetchWarehouseById: vi.fn((id) => ({
    type: "warehouse/fetchById",
    payload: id,
  })),
  clearWarehouseDetail: vi.fn(() => ({ type: "warehouse/clearDetail" })),
}));

vi.mock("../../../../Components/WarehouseDetails/WarehouseInfoCard", () => ({
  default: (props) => (
    <div data-testid="warehouse-info-card">
      <span>{props.warehouseName}</span>
      <span>{props.companyName}</span>
      <span>{props.addressLine1}</span>
      <span>{props.addressLine2}</span>
      <span>{props.city}</span>
    </div>
  ),
}));

vi.mock("../../../../Components/WarehouseDetails/WarehouseContactCard", () => ({
  default: (props) => (
    <div data-testid="warehouse-contact-card">
      <span>{props.manager}</span>
      <span>{props.phoneNumber}</span>
      <span>{props.email}</span>
      <span>{props.storageCapacity}</span>
    </div>
  ),
}));

vi.mock("../../../../Components/ReusableTable/ReusableHeader", () => ({
  default: ({ title, children }) => (
    <header>
      <h1>{title}</h1>
      {children}
    </header>
  ),
}));

vi.mock("../../../../Components/ReusableTable/ReusableHeader.styles", () => ({
  HeaderButton: ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

vi.mock("../../../../Components/StatsCards/StatsCards", () => ({
  default: ({ cards, loading }) => (
    <div data-testid="stats-cards" data-loading={String(loading)}>
      {cards.map((card) => (
        <div key={card.title}>
          <span>{card.title}</span>
          <span>{card.count}</span>
        </div>
      ))}
    </div>
  ),
}));

vi.mock("./WarehouseDetails.styles", () => ({
  Page: ({ children }) => <main>{children}</main>,
  DetailsGrid: ({ children }) => <section>{children}</section>,
}));

describe("WarehouseDetails", () => {
  let dispatchMock;
  let warehouseState;

  beforeEach(() => {
    vi.clearAllMocks();

    dispatchMock = vi.fn((action) => action);
    useDispatch.mockReturnValue(dispatchMock);

    warehouseState = {
      warehouseDetail: null,
      detailLoading: false,
      detailError: null,
    };

    useSelector.mockImplementation((selector) =>
      selector({ warehouse: warehouseState }),
    );

    useParams.mockReturnValue({ id: "10" });
  });

  it("renders the warehouse details page", () => {
    render(<WarehouseDetails />);

    expect(screen.getByText("Warehouse")).toBeInTheDocument();
    expect(screen.getByTestId("stats-cards")).toBeInTheDocument();
  });

  it("fetches warehouse details when a valid ID exists", () => {
    render(<WarehouseDetails />);

    expect(fetchWarehouseById).toHaveBeenCalledWith("10");
    expect(dispatchMock).toHaveBeenCalledWith({
      type: "warehouse/fetchById",
      payload: "10",
    });
  });

  it("clears warehouse details when the component unmounts", () => {
    const { unmount } = render(<WarehouseDetails />);

    unmount();

    expect(clearWarehouseDetail).toHaveBeenCalled();
    expect(dispatchMock).toHaveBeenCalledWith({
      type: "warehouse/clearDetail",
    });
  });

  it("does not fetch details when the ID is missing", () => {
    useParams.mockReturnValue({ id: "" });

    render(<WarehouseDetails />);

    expect(fetchWarehouseById).not.toHaveBeenCalled();
    expect(screen.getByText("Invalid warehouse ID.")).toBeInTheDocument();
  });

  it("renders warehouse information from the Redux state", () => {
    warehouseState.warehouseDetail = {
      warehouse_name: "Main Warehouse",
      operating_since: "2025-01-10",
      warehouse_type: "Storage",
      total_products: 120,
      stock_quantity: 500,
      low_stock_products: 5,
      out_of_stock_products: 2,
      manager_name: "Ajay",
      phone_number: "9876543210",
      email: "warehouse@example.com",
      storage_capacity: "1000 Units",
      company_name: "Armetal",
      address_line_1: "Industrial Area",
      address_line_2: "Building 5",
      city: "Kochi",
    };

    render(<WarehouseDetails />);

    expect(
      screen.getByRole("heading", {
        name: "Main Warehouse - 2025-01-10",
      }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("warehouse-info-card")).toHaveTextContent(
      "Main Warehouse",
    );
    expect(screen.getByTestId("warehouse-info-card")).toHaveTextContent(
      "Armetal",
    );
    expect(screen.getByTestId("warehouse-contact-card")).toHaveTextContent(
      "Ajay",
    );
    expect(screen.getByTestId("warehouse-contact-card")).toHaveTextContent(
      "9876543210",
    );
  });

  it("uses manager object values when manager_name is missing", () => {
    warehouseState.warehouseDetail = {
      warehouse_name: "Central Warehouse",
      manager: { full_name: "John Manager" },
    };

    render(<WarehouseDetails />);

    expect(screen.getByTestId("warehouse-contact-card")).toHaveTextContent(
      "John Manager",
    );
  });

  it("uses fallback values when warehouse fields are missing", () => {
    warehouseState.warehouseDetail = {};

    render(<WarehouseDetails />);

    expect(screen.getByTestId("warehouse-info-card")).toHaveTextContent(
      "Warehouse",
    );
    expect(screen.getByTestId("warehouse-contact-card")).toHaveTextContent("-");
  });

  it("renders the API error when warehouse details are not available", () => {
    warehouseState.detailError = {
      detail: "Warehouse not found",
    };

    render(<WarehouseDetails />);

    expect(screen.getByText("Warehouse not found")).toBeInTheDocument();
  });

  it("renders a string API error", () => {
    warehouseState.detailError = "Unable to load warehouse";

    render(<WarehouseDetails />);

    expect(screen.getByText("Unable to load warehouse")).toBeInTheDocument();
  });

  it("renders a generic error when the API error has no message", () => {
    warehouseState.detailError = {};

    render(<WarehouseDetails />);

    expect(screen.getByText("Warehouse not found.")).toBeInTheDocument();
  });

  it("shows an additional error when details exist alongside an API error", () => {
    warehouseState.warehouseDetail = {
      warehouse_name: "Main Warehouse",
    };
    warehouseState.detailError = "Refresh failed";

    render(<WarehouseDetails />);

    expect(screen.getByText("Refresh failed")).toBeInTheDocument();
    expect(screen.getByText("Main Warehouse")).toBeInTheDocument();
  });

  it("renders the KPI cards with warehouse values", () => {
    warehouseState.warehouseDetail = {
      warehouse_type: "Distribution",
      total_products: 25,
      stock_quantity: 300,
      low_stock_products: 3,
      out_of_stock_products: 1,
    };

    render(<WarehouseDetails />);

    const stats = screen.getByTestId("stats-cards");

    expect(stats).toHaveTextContent("Warehouses Type");
    expect(stats).toHaveTextContent("Distribution");
    expect(stats).toHaveTextContent("Total Products");
    expect(stats).toHaveTextContent("25");
    expect(stats).toHaveTextContent("Total Stock Quantity");
    expect(stats).toHaveTextContent("300");
    expect(stats).toHaveTextContent("Low Stock Products");
    expect(stats).toHaveTextContent("Out of Stock Products");
  });

  it("opens the delete confirmation dialog when DELETE is clicked", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<WarehouseDetails />);

    screen.getByRole("button", { name: /delete/i }).click();

    expect(confirmSpy).toHaveBeenCalledWith(
      'Are you sure you want to delete "Warehouse"?',
    );

    confirmSpy.mockRestore();
  });

  it("does not proceed with delete when confirmation is cancelled", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<WarehouseDetails />);

    screen.getByRole("button", { name: /delete/i }).click();

    expect(logSpy).not.toHaveBeenCalledWith(
      "Delete warehouse:",
      expect.anything(),
    );

    confirmSpy.mockRestore();
    logSpy.mockRestore();
  });

  it("logs the warehouse when edit is clicked", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    warehouseState.warehouseDetail = {
      warehouse_name: "Main Warehouse",
    };

    render(<WarehouseDetails />);

    screen.getByRole("button", { name: /edit/i }).click();

    expect(logSpy).toHaveBeenCalledWith(
      "Edit warehouse:",
      warehouseState.warehouseDetail,
    );

    logSpy.mockRestore();
  });
});
