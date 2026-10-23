
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import getWarehouseColumns from "../../Pages/inventory/WarehouseColumns";

describe("getWarehouseColumns", () => {
  let navigate;

  beforeEach(() => {
    navigate = vi.fn();
    vi.clearAllMocks();
  });

  const getColumns = () => getWarehouseColumns({ navigate });

  const getColumn = (accessor) => {
    const column = getColumns().find(
      (item) => item.accessor === accessor
    );

    expect(column).toBeDefined();

    return column;
  };

  /* =========================================================
     BASIC COLUMN STRUCTURE
  ========================================================= */

  it("returns all warehouse columns", () => {
    const columns = getColumns();

    expect(columns).toHaveLength(9);

    expect(columns.map((column) => column.header)).toEqual([
      "Code",
      "Warehouse Name",
      "Type",
      "Location",
      "Manager",
      "Total Products",
      "Stock Quantity",
      "Inventory Value",
      "Status",
    ]);
  });

  /* =========================================================
     CODE
  ========================================================= */

  it("configures the Code column correctly", () => {
    const column = getColumn("code");

    expect(column.header).toBe("Code");
    expect(column.accessor).toBe("code");
  });

  /* =========================================================
     WAREHOUSE NAME
  ========================================================= */

  it("renders warehouse name from warehouse_name", () => {
    const column = getColumn("warehouse_name");

    const row = {
      id: 7,
      warehouse_name: "Main Warehouse",
    };

    render(column.cell(row));

    expect(
      screen.getByRole("button", {
        name: "Main Warehouse",
      })
    ).toBeInTheDocument();
  });

  it("uses name when warehouse_name is missing", () => {
    const column = getColumn("warehouse_name");

    const row = {
      id: 8,
      name: "Secondary Warehouse",
    };

    render(column.cell(row));

    expect(
      screen.getByRole("button", {
        name: "Secondary Warehouse",
      })
    ).toBeInTheDocument();
  });

  it("uses dash when warehouse name is missing", () => {
    const column = getColumn("warehouse_name");

    const row = {
      id: 9,
    };

    render(column.cell(row));

    expect(
      screen.getByRole("button", {
        name: "-",
      })
    ).toBeInTheDocument();
  });

  it("navigates to warehouse details using database ID", () => {
    const column = getColumn("warehouse_name");

    const row = {
      id: 7,
      warehouse_name: "Main Warehouse",
    };

    render(column.cell(row));

    fireEvent.click(
      screen.getByRole("button", {
        name: "Main Warehouse",
      })
    );

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith("/warehouse/7");
  });

  it("encodes warehouse ID when navigating from warehouse name", () => {
    const column = getColumn("warehouse_name");

    const row = {
      id: "WH 7",
      warehouse_name: "Encoded Warehouse",
    };

    render(column.cell(row));

    fireEvent.click(
      screen.getByRole("button", {
        name: "Encoded Warehouse",
      })
    );

    expect(navigate).toHaveBeenCalledWith("/warehouse/WH%207");
  });

  it("does not navigate when warehouse ID is missing from warehouse name", () => {
    const column = getColumn("warehouse_name");

    const row = {
      warehouse_name: "No ID Warehouse",
    };

    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(column.cell(row));

    fireEvent.click(
      screen.getByRole("button", {
        name: "No ID Warehouse",
      })
    );

    expect(navigate).not.toHaveBeenCalled();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Warehouse ID is missing:",
      row
    );

    consoleSpy.mockRestore();
  });

  it("does not navigate when warehouse ID is null", () => {
    const column = getColumn("warehouse_name");

    const row = {
      id: null,
      warehouse_name: "Null ID Warehouse",
    };

    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(column.cell(row));

    fireEvent.click(
      screen.getByRole("button", {
        name: "Null ID Warehouse",
      })
    );

    expect(navigate).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it("does not navigate when warehouse ID is an empty string", () => {
    const column = getColumn("warehouse_name");

    const row = {
      id: "",
      warehouse_name: "Empty ID Warehouse",
    };

    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(column.cell(row));

    fireEvent.click(
      screen.getByRole("button", {
        name: "Empty ID Warehouse",
      })
    );

    expect(navigate).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  /* =========================================================
     TYPE
  ========================================================= */

  it("formats warehouse type with first letter uppercase", () => {
    const column = getColumn("warehouse_type");

    render(
      column.cell({
        warehouse_type: "central",
      })
    );

    expect(screen.getByText("Central")).toBeInTheDocument();
  });

  it("returns dash when warehouse type is missing", () => {
    const column = getColumn("warehouse_type");

    const { container } = render(
      column.cell({
        warehouse_type: null,
      })
    );

    expect(container.textContent).toBe("-");
  });

  it("handles uppercase warehouse type", () => {
    const column = getColumn("warehouse_type");

    render(
      column.cell({
        warehouse_type: "COLD STORAGE",
      })
    );

    expect(
      screen.getByText("COLD STORAGE")
    ).toBeInTheDocument();
  });

  /* =========================================================
     LOCATION
  ========================================================= */

  it("renders city", () => {
    const column = getColumn("city");

    render(
      column.cell({
        city: "Riyadh",
      })
    );

    expect(screen.getByText("Riyadh")).toBeInTheDocument();
  });

  it("renders dash when city is missing", () => {
    const column = getColumn("city");

    const { container } = render(
      column.cell({
        city: null,
      })
    );

    expect(container.textContent).toBe("-");
  });

  it("renders dash when city is empty", () => {
    const column = getColumn("city");

    const { container } = render(
      column.cell({
        city: "",
      })
    );

    expect(container.textContent).toBe("-");
  });

  /* =========================================================
     MANAGER
  ========================================================= */

  it("uses manager_name when available", () => {
    const column = getColumn("manager_name");

    render(
      column.cell({
        manager_name: "Ahmed Ali",
        manager: {
          name: "Other Manager",
        },
      })
    );

    expect(screen.getByText("Ahmed Ali")).toBeInTheDocument();
  });

  it("uses manager.name when manager_name is unavailable", () => {
    const column = getColumn("manager_name");

    render(
      column.cell({
        manager: {
          name: "Ahmed Ali",
        },
      })
    );

    expect(screen.getByText("Ahmed Ali")).toBeInTheDocument();
  });

  it("uses manager.full_name when manager.name is unavailable", () => {
    const column = getColumn("manager_name");

    render(
      column.cell({
        manager: {
          full_name: "Ahmed Mohammed",
        },
      })
    );

    expect(
      screen.getByText("Ahmed Mohammed")
    ).toBeInTheDocument();
  });

  it("uses manager.username when name and full_name are unavailable", () => {
    const column = getColumn("manager_name");

    render(
      column.cell({
        manager: {
          username: "ahmed123",
        },
      })
    );

    expect(screen.getByText("ahmed123")).toBeInTheDocument();
  });

  it("returns dash when manager is a number", () => {
    const column = getColumn("manager_name");

    const { container } = render(
      column.cell({
        manager: 15,
      })
    );

    expect(container.textContent).toBe("-");
  });

  it("returns dash when manager is a numeric string", () => {
    const column = getColumn("manager_name");

    const { container } = render(
      column.cell({
        manager: "15",
      })
    );

    expect(container.textContent).toBe("-");
  });

  it("uses manager string when manager is a non-numeric string", () => {
    const column = getColumn("manager_name");

    render(
      column.cell({
        manager: "Ahmed Manager",
      })
    );

    expect(
      screen.getByText("Ahmed Manager")
    ).toBeInTheDocument();
  });

  it("returns dash when manager is missing", () => {
    const column = getColumn("manager_name");

    const { container } = render(
      column.cell({})
    );

    expect(container.textContent).toBe("-");
  });

  it("returns dash when manager is null", () => {
    const column = getColumn("manager_name");

    const { container } = render(
      column.cell({
        manager: null,
      })
    );

    expect(container.textContent).toBe("-");
  });

  /* =========================================================
     TOTAL PRODUCTS
  ========================================================= */

  it("formats total products with comma separators", () => {
    const column = getColumn("total_products");

    render(
      column.cell({
        total_products: 1234567,
      })
    );

    expect(
      screen.getByText("1,234,567")
    ).toBeInTheDocument();
  });

  it("formats total products when value is a numeric string", () => {
    const column = getColumn("total_products");

    render(
      column.cell({
        total_products: "12345",
      })
    );

    expect(
      screen.getByText("12,345")
    ).toBeInTheDocument();
  });

  it("returns dash when total products is missing", () => {
    const column = getColumn("total_products");

    const { container } = render(
      column.cell({
        total_products: null,
      })
    );

    expect(container.textContent).toBe("-");
  });

  it("returns original value for invalid total products", () => {
    const column = getColumn("total_products");

    render(
      column.cell({
        total_products: "abc",
      })
    );

    expect(screen.getByText("abc")).toBeInTheDocument();
  });

  /* =========================================================
     STOCK QUANTITY
  ========================================================= */

  it("formats stock quantity with comma separators", () => {
    const column = getColumn("stock_quantity");

    render(
      column.cell({
        stock_quantity: 987654,
      })
    );

    expect(
      screen.getByText("987,654")
    ).toBeInTheDocument();
  });

  it("returns dash when stock quantity is missing", () => {
    const column = getColumn("stock_quantity");

    const { container } = render(
      column.cell({
        stock_quantity: undefined,
      })
    );

    expect(container.textContent).toBe("-");
  });

  it("returns original value for invalid stock quantity", () => {
    const column = getColumn("stock_quantity");

    render(
      column.cell({
        stock_quantity: "invalid",
      })
    );

    expect(
      screen.getByText("invalid")
    ).toBeInTheDocument();
  });

  /* =========================================================
     INVENTORY VALUE
  ========================================================= */

  it("formats inventory value with SAR", () => {
    const column = getColumn("inventory_value");

    render(
      column.cell({
        inventory_value: 123456.78,
      })
    );

    expect(
      screen.getByText("SAR 123,456.78")
    ).toBeInTheDocument();
  });

  it("formats numeric string inventory value with SAR", () => {
    const column = getColumn("inventory_value");

    render(
      column.cell({
        inventory_value: "50000",
      })
    );

    expect(
      screen.getByText("SAR 50,000")
    ).toBeInTheDocument();
  });

  it("keeps existing SAR currency string unchanged", () => {
    const column = getColumn("inventory_value");

    render(
      column.cell({
        inventory_value: "SAR 25,000",
      })
    );

    expect(
      screen.getByText("SAR 25,000")
    ).toBeInTheDocument();
  });

  it("keeps lowercase sar currency string unchanged", () => {
    const column = getColumn("inventory_value");

    render(
      column.cell({
        inventory_value: "sar 25,000",
      })
    );

    expect(
      screen.getByText("sar 25,000")
    ).toBeInTheDocument();
  });

  it("returns dash when inventory value is missing", () => {
    const column = getColumn("inventory_value");

    const { container } = render(
      column.cell({
        inventory_value: null,
      })
    );

    expect(container.textContent).toBe("-");
  });

  it("returns original value for invalid inventory value", () => {
    const column = getColumn("inventory_value");

    render(
      column.cell({
        inventory_value: "Not Available",
      })
    );

    expect(
      screen.getByText("Not Available")
    ).toBeInTheDocument();
  });

  /* =========================================================
     STATUS
  ========================================================= */

  it("formats status with first letter uppercase", () => {
    const column = getColumn("status");

    render(
      column.cell({
        status: "active",
      })
    );

    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("returns dash when status is missing", () => {
    const column = getColumn("status");

    const { container } = render(
      column.cell({
        status: null,
      })
    );

    expect(container.textContent).toBe("-");
  });

  it("handles uppercase status", () => {
    const column = getColumn("status");

    render(
      column.cell({
        status: "ACTIVE",
      })
    );

    expect(
      screen.getByText("ACTIVE")
    ).toBeInTheDocument();
  });

  /* =========================================================
     ACTION
  ========================================================= */

  it("renders view warehouse action button", () => {
    const column = getColumn("action");

    render(
      column.cell({
        id: 7,
        warehouse_name: "Main Warehouse",
      })
    );

    const button = screen.getByRole("button", {
      name: "View Main Warehouse",
    });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute(
      "title",
      "View warehouse"
    );
  });

  it("uses warehouse as default action label", () => {
    const column = getColumn("action");

    render(
      column.cell({
        id: 7,
      })
    );

    expect(
      screen.getByRole("button", {
        name: "View warehouse",
      })
    ).toBeInTheDocument();
  });

  it("navigates to warehouse details from action button", () => {
    const column = getColumn("action");

    render(
      column.cell({
        id: 25,
        warehouse_name: "Central Warehouse",
      })
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "View Central Warehouse",
      })
    );

    expect(navigate).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(
      "/warehouse/25"
    );
  });

  it("encodes warehouse ID from action button", () => {
    const column = getColumn("action");

    render(
      column.cell({
        id: "WH 25",
        warehouse_name: "Encoded Warehouse",
      })
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "View Encoded Warehouse",
      })
    );

    expect(navigate).toHaveBeenCalledWith(
      "/warehouse/WH%2025"
    );
  });

  it("does not navigate from action button when ID is missing", () => {
    const column = getColumn("action");

    const row = {
      warehouse_name: "No ID Warehouse",
    };

    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(column.cell(row));

    fireEvent.click(
      screen.getByRole("button", {
        name: "View No ID Warehouse",
      })
    );

    expect(navigate).not.toHaveBeenCalled();

    expect(consoleSpy).toHaveBeenCalledWith(
      "Warehouse ID is missing:",
      row
    );

    consoleSpy.mockRestore();
  });

  it("does not navigate from action button when ID is null", () => {
    const column = getColumn("action");

    const row = {
      id: null,
      warehouse_name: "Null Warehouse",
    };

    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(column.cell(row));

    fireEvent.click(
      screen.getByRole("button", {
        name: "View Null Warehouse",
      })
    );

    expect(navigate).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  /* =========================================================
     COMPLETE ROW
  ========================================================= */

  it("renders all warehouse cells correctly for a complete row", () => {
    const columns = getColumns();

    const row = {
      id: 7,
      code: "WH001",
      warehouse_name: "Main Warehouse",
      warehouse_type: "central",
      city: "Riyadh",
      manager_name: "Ahmed Ali",
      total_products: 1250,
      stock_quantity: 45000,
      inventory_value: 1250000,
      status: "active",
    };

    expect(columns[0].accessor).toBe("code");

    render(columns[1].cell(row));
    expect(
      screen.getByRole("button", {
        name: "Main Warehouse",
      })
    ).toBeInTheDocument();

    render(columns[2].cell(row));
    expect(screen.getByText("Central")).toBeInTheDocument();

    render(columns[3].cell(row));
    expect(screen.getByText("Riyadh")).toBeInTheDocument();

    render(columns[4].cell(row));
    expect(screen.getByText("Ahmed Ali")).toBeInTheDocument();

    render(columns[5].cell(row));
    expect(screen.getByText("1,250")).toBeInTheDocument();

    render(columns[6].cell(row));
    expect(screen.getByText("45,000")).toBeInTheDocument();

    render(columns[7].cell(row));
    expect(
      screen.getByText("SAR 1,250,000")
    ).toBeInTheDocument();

    render(columns[8].cell(row));
    expect(screen.getByText("Active")).toBeInTheDocument();
  });
});

