import React from "react";
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import {
  formatStatusLabel,
  formatCurrency,
  buildPaymentStats,
  PAYMENT_STATUS_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  getPaymentColumns,
} from "./PaymentColoumn";

describe("formatStatusLabel", () => {
  it("formats underscore-separated values", () => {
    expect(formatStatusLabel("full_payment")).toBe("Full Payment");
  });

  it("returns an empty string for an empty value", () => {
    expect(formatStatusLabel("")).toBe("");
  });

  it("handles multiple underscores", () => {
    expect(formatStatusLabel("online__payment")).toBe("Online Payment");
  });
});

describe("formatCurrency", () => {
  it("formats numeric amounts as SAR", () => {
    expect(formatCurrency(1500)).toBe("SAR 1,500");
  });

  it("returns a dash for null, undefined and empty values", () => {
    expect(formatCurrency(null)).toBe("-");
    expect(formatCurrency(undefined)).toBe("-");
    expect(formatCurrency("")).toBe("-");
  });

  it("returns the original value when it is not numeric", () => {
    expect(formatCurrency("invalid")).toBe("invalid");
  });
});

describe("buildPaymentStats", () => {
  it("builds all five KPI cards", () => {
    const stats = buildPaymentStats({
      totalCollections: 10000,
      thisMonthCollections: 5000,
      outstandingReceivables: 2000,
      overdueReceivables: 500,
      collectionRate: 85,
    });

    expect(stats).toHaveLength(5);

    expect(stats[0]).toMatchObject({
      title: "Total Collections",
      count: "SAR 10,000",
    });

    expect(stats[1]).toMatchObject({
      title: "This Month Collections",
      count: "SAR 5,000",
    });

    expect(stats[2]).toMatchObject({
      title: "Outstanding Receivables",
      count: "SAR 2,000",
    });

    expect(stats[3]).toMatchObject({
      title: "Overdue Receivables",
      count: "SAR 500",
    });

    expect(stats[4]).toMatchObject({
      title: "Collection Rate",
      count: "85%",
    });
  });

  it("uses fallback values when KPI data is missing", () => {
    const stats = buildPaymentStats();

    expect(stats).toHaveLength(5);
    expect(stats[0].count).toBe("-");
    expect(stats[4].count).toBe("0%");
  });
});

describe("Payment filter options", () => {
  it("contains the expected payment statuses", () => {
    expect(PAYMENT_STATUS_OPTIONS).toEqual([
      { label: "Completed", value: "completed" },
      { label: "Cancelled", value: "cancelled" },
      { label: "Pending", value: "pending" },
    ]);
  });

  it("contains the expected payment types", () => {
    expect(PAYMENT_TYPE_OPTIONS.map((item) => item.value)).toEqual([
      "full_payment",
      "partial_payment",
      "advance_payment",
    ]);
  });

  it("contains the expected payment methods", () => {
    expect(PAYMENT_METHOD_OPTIONS.map((item) => item.value)).toEqual([
      "bank_transfer",
      "cheque",
      "online_payment",
      "cash",
    ]);
  });
});

describe("getPaymentColumns", () => {
  const payment = {
    id: 1,
    receipt_no: "REC-001",
    customer_name: "ABC Trading",
    invoice_no: "INV-001",
    payment_date: "2026-11-06",
    payment_type: "full_payment",
    payment_method: "bank_transfer",
    amount: 1500,
    status: "completed",
  };

  it("returns the expected table columns", () => {
    const columns = getPaymentColumns({});

    expect(columns.map((column) => column.header)).toEqual([
      "Receipt No",
      "Customer",
      "Invoice No",
      "Payment Date",
      "Payment Type",
      "Payment Method",
      "Amount",
      "Status",
      "Action",
    ]);
  });

  it("renders the customer name from customer_name", () => {
    const columns = getPaymentColumns({});
    const customerColumn = columns.find(
      (column) => column.header === "Customer",
    );

    expect(customerColumn.render(payment)).toBe("ABC Trading");
  });

  it("supports a string customer value", () => {
    const columns = getPaymentColumns({});
    const customerColumn = columns.find(
      (column) => column.header === "Customer",
    );

    expect(
      customerColumn.render({ customer: "Al Noor Trading" }),
    ).toBe("Al Noor Trading");
  });

  it("supports a nested customer object", () => {
    const columns = getPaymentColumns({});
    const customerColumn = columns.find(
      (column) => column.header === "Customer",
    );

    expect(
      customerColumn.render({ customer: { name: "Mediora" } }),
    ).toBe("Mediora");
  });

  it("returns a dash when customer information is missing", () => {
    const columns = getPaymentColumns({});
    const customerColumn = columns.find(
      (column) => column.header === "Customer",
    );

    expect(customerColumn.render({})).toBe("-");
  });

  it("formats payment type and method", () => {
    const columns = getPaymentColumns({});

    expect(
      columns.find((column) => column.header === "Payment Type").render(payment),
    ).toBe("Full Payment");

    expect(
      columns.find((column) => column.header === "Payment Method").render(payment),
    ).toBe("Bank Transfer");
  });

  it("formats the payment amount", () => {
    const columns = getPaymentColumns({});
    const amountColumn = columns.find(
      (column) => column.header === "Amount",
    );

    expect(amountColumn.render(payment)).toBe("SAR 1,500");
  });

  it("supports alternative amount fields", () => {
    const columns = getPaymentColumns({});
    const amountColumn = columns.find(
      (column) => column.header === "Amount",
    );

    expect(amountColumn.render({ amount_received: 250 })).toBe("SAR 250");
    expect(amountColumn.render({ received_amount: 350 })).toBe("SAR 350");
  });

  it("renders the payment status", () => {
    const columns = getPaymentColumns({});
    const statusColumn = columns.find(
      (column) => column.header === "Status",
    );

    render(statusColumn.render(payment));

    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("supports payment_status as a fallback status", () => {
    const columns = getPaymentColumns({});
    const statusColumn = columns.find(
      (column) => column.header === "Status",
    );

    render(statusColumn.render({ payment_status: "pending" }));

    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("calls onInfo when the view payment button is clicked", () => {
    const onInfo = vi.fn();
    const columns = getPaymentColumns({ onInfo });
    const actionColumn = columns.find(
      (column) => column.header === "Action",
    );

    render(actionColumn.render(payment));

    fireEvent.click(
      screen.getByRole("button", { name: "View payment REC-001" }),
    );

    expect(onInfo).toHaveBeenCalledWith(payment);
  });

  it("does not fail when onInfo is not supplied", () => {
    const columns = getPaymentColumns({});
    const actionColumn = columns.find(
      (column) => column.header === "Action",
    );

    render(actionColumn.render(payment));

    expect(
      screen.getByRole("button", { name: "View payment REC-001" }),
    ).toBeInTheDocument();
  });
});