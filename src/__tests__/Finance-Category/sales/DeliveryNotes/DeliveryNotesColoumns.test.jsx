import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

vi.mock("./Action/DeliveryAction", () => ({
  default: ({ row, onDelete }) => (
    <button onClick={() => onDelete?.(row)}>Delete {row.id}</button>
  ),
}));

import { salesOrderColumns, salesOrderStats } from "./DeliveryNotesColoumns";

describe("salesOrderColumns", () => {
  const columns = salesOrderColumns(vi.fn());

  const renderColumn = (header, row) => {
    const column = columns.find((item) => item.header === header);
    return render(<>{column.render(row)}</>);
  };

  it("returns all expected columns", () => {
    expect(columns.map((column) => column.header)).toEqual([
      "DN No",
      "SO Ref",
      "Customer",
      "Delivery Date",
      "Delivery Value",
      "Delivery Status",
      "Invoice Status",
      "Action",
    ]);
  });

  it("renders delivery note number with fallback", () => {
    const column = columns.find((item) => item.header === "DN No");

    expect(column.render({ deliveryNoteNumber: "DN-001" })).toBe("DN-001");
    expect(column.render({ delivery_note_number: "DN-002" })).toBe("DN-002");
    expect(column.render({})).toBe("-");
  });

  it("renders sales order reference with fallback", () => {
    const column = columns.find((item) => item.header === "SO Ref");

    expect(column.render({ salesOrderReference: "SO-001" })).toBe("SO-001");
    expect(column.render({ sales_order_reference: "SO-002" })).toBe("SO-002");
    expect(column.render({})).toBe("-");
  });

  it("renders customer name from an object", () => {
    const column = columns.find((item) => item.header === "Customer");

    expect(column.render({ customer: { name: "ABC Trading" } })).toBe(
      "ABC Trading",
    );

    expect(column.render({ customer: { customer_name: "Riyadh Tech" } })).toBe(
      "Riyadh Tech",
    );
  });

  it("renders customer name from a string or fallback field", () => {
    const column = columns.find((item) => item.header === "Customer");

    expect(column.render({ customer: "ABC Trading" })).toBe("ABC Trading");
    expect(column.render({ customer_name: "Al Noor" })).toBe("Al Noor");
    expect(column.render({})).toBe("-");
  });

  it("formats valid delivery dates", () => {
    const column = columns.find((item) => item.header === "Delivery Date");

    expect(column.render({ deliveryDate: "2026-10-15" })).toBe(
      new Date("2026-10-15").toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    );
  });

  it("returns a dash for an empty date and the original value for an invalid date", () => {
    const column = columns.find((item) => item.header === "Delivery Date");

    expect(column.render({})).toBe("-");
    expect(column.render({ delivery_date: "invalid-date" })).toBe(
      "invalid-date",
    );
  });

  it("formats delivery value with SAR", () => {
    const column = columns.find((item) => item.header === "Delivery Value");

    expect(column.render({ deliveryValue: 1500 })).toBe("SAR 1500");
    expect(column.render({ delivery_value: "SAR 2000" })).toBe("SAR 2000");
    expect(column.render({ amount: "500" })).toBe("SAR 500");
    expect(column.render({})).toBe("-");
  });

  it("renders delivery and invoice statuses", () => {
    const deliveryColumn = columns.find(
      (item) => item.header === "Delivery Status",
    );
    const invoiceColumn = columns.find(
      (item) => item.header === "Invoice Status",
    );

    expect(deliveryColumn.render({ delivery_status: "delivered" })).toBe(
      "delivered",
    );

    expect(invoiceColumn.render({ invoice_status: "Invoiced" })).toBe(
      "Invoiced",
    );

    expect(deliveryColumn.render({})).toBe("-");
    expect(invoiceColumn.render({})).toBe("-");
  });

  it("renders the action component", () => {
    const column = columns.find((item) => item.header === "Action");

    render(column.render({ id: 5 }));

    expect(
      screen.getByRole("button", { name: "Delete 5" }),
    ).toBeInTheDocument();
  });

  it("marks the action column as not sortable", () => {
    const column = columns.find((item) => item.header === "Action");

    expect(column.sortable).toBe(false);
  });
});

describe("salesOrderStats", () => {
  it("creates the five delivery statistics cards", () => {
    const stats = salesOrderStats({
      totalDeliveries: 10,
      pendingDeliveries: 2,
      partiallyDelivered: 3,
      delivered: 5,
      deliveryValue: "SAR 12,000",
    });

    expect(stats).toHaveLength(5);

    expect(stats.map((item) => item.title)).toEqual([
      "Total Deliveries",
      "Pending Deliveries",
      "Partially Delivered",
      "Delivered",
      "Delivery Value",
    ]);

    expect(stats.map((item) => item.count)).toEqual([
      10,
      2,
      3,
      5,
      "SAR 12,000",
    ]);
  });
});
