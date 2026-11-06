import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import getWarehouseColumns from "./warehouseColumns";

describe("getWarehouseColumns", () => {
  const navigate = vi.fn();
  const onEdit = vi.fn();
  const onDelete = vi.fn();

  const getColumns = () =>
    getWarehouseColumns({ navigate, onEdit, onDelete });

  it("returns all expected warehouse columns", () => {
    const columns = getColumns();

    expect(columns.map((column) => column.header)).toEqual([
      "Code",
      "Warehouse Name",
      "Warehouse Type",
      "Location",
      "Manager",
      "Total Products",
      "Stock Quantity",
      "Inventory Value",
      "Status",
      "Actions",
    ]);
  });

  it("renders warehouse code", () => {
    const columns = getColumns();
    const codeColumn = columns.find((column) => column.accessor === "code");

    expect(codeColumn.cell({ code: "WH-001" })).toBe("WH-001");
  });

  it("uses a fallback for missing warehouse code", () => {
    const columns = getColumns();
    const codeColumn = columns.find((column) => column.accessor === "code");

    expect(codeColumn.cell({})).toBe("-");
  });

  it("renders warehouse name", () => {
    const columns = getColumns();
    const nameColumn = columns.find(
      (column) => column.accessor === "warehouse_name",
    );

    render(nameColumn.cell({ id: 1, warehouse_name: "Main Warehouse" }));

    expect(screen.getByText("Main Warehouse")).toBeInTheDocument();
  });

  it("navigates to warehouse details when warehouse name is clicked", () => {
    const columns = getColumns();
    const nameColumn = columns.find(
      (column) => column.accessor === "warehouse_name",
    );

    render(nameColumn.cell({ id: 25, warehouse_name: "Main Warehouse" }));

    fireEvent.click(screen.getByText("Main Warehouse"));

    expect(navigate).toHaveBeenCalledWith("/warehouse/25");
  });

  it("encodes the warehouse ID before navigation", () => {
    const columns = getColumns();
    const nameColumn = columns.find(
      (column) => column.accessor === "warehouse_name",
    );

    render(nameColumn.cell({ id: "WH/25", warehouse_name: "Warehouse" }));

    fireEvent.click(screen.getByText("Warehouse"));

    expect(navigate).toHaveBeenCalledWith("/warehouse/WH%2F25");
  });

  it("does not navigate when warehouse ID is missing", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const columns = getColumns();
    const nameColumn = columns.find(
      (column) => column.accessor === "warehouse_name",
    );

    render(nameColumn.cell({ warehouse_name: "Warehouse" }));

    fireEvent.click(screen.getByText("Warehouse"));

    expect(navigate).not.toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith(
      "Warehouse ID is missing:",
      expect.any(Object),
    );

    errorSpy.mockRestore();
  });

  it("formats warehouse location using city and country", () => {
    const columns = getColumns();
    const locationColumn = columns.find(
      (column) => column.accessor === "city",
    );

    expect(
      locationColumn.cell({ city: "Kochi", country: "India" }),
    ).toBe("Kochi, India");
  });

  it("returns only city when country is missing", () => {
    const columns = getColumns();
    const locationColumn = columns.find(
      (column) => column.accessor === "city",
    );

    expect(locationColumn.cell({ city: "Kochi" })).toBe("Kochi");
  });

  it("returns only country when city is missing", () => {
    const columns = getColumns();
    const locationColumn = columns.find(
      (column) => column.accessor === "city",
    );

    expect(locationColumn.cell({ country: "India" })).toBe("India");
  });

  it("returns a dash when location is missing", () => {
    const columns = getColumns();
    const locationColumn = columns.find(
      (column) => column.accessor === "city",
    );

    expect(locationColumn.cell({})).toBe("-");
  });

  it("supports manager_name", () => {
    const columns = getColumns();
    const managerColumn = columns.find(
      (column) => column.accessor === "manager",
    );

    expect(managerColumn.cell({ manager_name: "Ajay" })).toBe("Ajay");
  });

  it("supports manager object name", () => {
    const columns = getColumns();
    const managerColumn = columns.find(
      (column) => column.accessor === "manager",
    );

    expect(managerColumn.cell({ manager: { name: "John" } })).toBe("John");
  });

  it("supports manager object full_name", () => {
    const columns = getColumns();
    const managerColumn = columns.find(
      (column) => column.accessor === "manager",
    );

    expect(managerColumn.cell({ manager: { full_name: "John Smith" } })).toBe(
      "John Smith",
    );
  });

  it("supports manager username", () => {
    const columns = getColumns();
    const managerColumn = columns.find(
      (column) => column.accessor === "manager",
    );

    expect(managerColumn.cell({ manager: { username: "john" } })).toBe("john");
  });

  it("supports a string manager value", () => {
    const columns = getColumns();
    const managerColumn = columns.find(
      (column) => column.accessor === "manager",
    );

    expect(managerColumn.cell({ manager: "Ajay" })).toBe("Ajay");
  });

  it("uses a dash when manager is missing", () => {
    const columns = getColumns();
    const managerColumn = columns.find(
      (column) => column.accessor === "manager",
    );

    expect(managerColumn.cell({})).toBe("-");
  });

  it.each([
    [1000, "1,000"],
    [0, "0"],
    [null, "-"],
    [undefined, "-"],
    ["", "-"],
    ["not-a-number", "not-a-number"],
  ])("formats total products value %s", (value, expected) => {
    const columns = getColumns();
    const productsColumn = columns.find(
      (column) => column.accessor === "total_products",
    );

    expect(productsColumn.cell({ total_products: value })).toBe(expected);
  });

  it.each([
    [2500, "2,500"],
    [0, "0"],
    [null, "-"],
    [undefined, "-"],
    ["", "-"],
  ])("formats stock quantity value %s", (value, expected) => {
    const columns = getColumns();
    const stockColumn = columns.find(
      (column) => column.accessor === "stock_quantity",
    );

    expect(stockColumn.cell({ stock_quantity: value })).toBe(expected);
  });

  it.each([
    [15000, "₹15,000"],
    [0, "₹0"],
    [null, "-"],
    [undefined, "-"],
    ["", "-"],
    ["invalid", "invalid"],
  ])("formats inventory value %s", (value, expected) => {
    const columns = getColumns();
    const valueColumn = columns.find(
      (column) => column.accessor === "inventory_value",
    );

    expect(valueColumn.cell({ inventory_value: value })).toBe(expected);
  });

  it("renders the active status", () => {
    const columns = getColumns();
    const statusColumn = columns.find(
      (column) => column.accessor === "status",
    );

    render(statusColumn.cell({ status: "Active" }));

    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders inactive status", () => {
    const columns = getColumns();
    const statusColumn = columns.find(
      (column) => column.accessor === "status",
    );

    render(statusColumn.cell({ status: "Inactive" }));

    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("uses a dash when status is missing", () => {
    const columns = getColumns();
    const statusColumn = columns.find(
      (column) => column.accessor === "status",
    );

    render(statusColumn.cell({}));

    expect(screen.getByText("-")).toBeInTheDocument();
  });

  it("calls onEdit with the selected warehouse row", () => {
    const columns = getColumns();
    const actionsColumn = columns.find(
      (column) => column.accessor === "actions",
    );
    const row = { id: 1, warehouse_name: "Main Warehouse" };

    render(actionsColumn.cell(row));

    fireEvent.click(screen.getByTitle("Edit warehouse"));

    expect(onEdit).toHaveBeenCalledWith(row);
  });

  it("calls onDelete with the selected warehouse row", () => {
    const columns = getColumns();
    const actionsColumn = columns.find(
      (column) => column.accessor === "actions",
    );
    const row = { id: 1, warehouse_name: "Main Warehouse" };

    render(actionsColumn.cell(row));

    fireEvent.click(screen.getByText("Delete"));

    expect(onDelete).toHaveBeenCalledWith(row);
  });

  it("does not call onEdit when warehouse ID is missing", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const columns = getColumns();
    const actionsColumn = columns.find(
      (column) => column.accessor === "actions",
    );

    render(actionsColumn.cell({ warehouse_name: "Warehouse" }));

    fireEvent.click(screen.getByTitle("Edit warehouse"));

    expect(onEdit).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it("does not call onDelete when warehouse ID is missing", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const columns = getColumns();
    const actionsColumn = columns.find(
      (column) => column.accessor === "actions",
    );

    render(actionsColumn.cell({ warehouse_name: "Warehouse" }));

    // The delete button is rendered only when onDelete is a function.
    fireEvent.click(screen.getByText("Delete"));

    expect(onDelete).not.toHaveBeenCalled();

    errorSpy.mockRestore();
  });

  it("does not render delete button when onDelete is not supplied", () => {
    const columns = getWarehouseColumns({ navigate, onEdit });
    const actionsColumn = columns.find(
      (column) => column.accessor === "actions",
    );

    render(actionsColumn.cell({ id: 1 }));

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("does not call edit when onEdit is missing", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const columns = getWarehouseColumns({ navigate });
    const actionsColumn = columns.find(
      (column) => column.accessor === "actions",
    );

    render(actionsColumn.cell({ id: 1 }));

    fireEvent.click(screen.getByTitle("Edit warehouse"));

    expect(errorSpy).toHaveBeenCalledWith("onEdit function is missing.");

    errorSpy.mockRestore();
  });
});