import { describe, it, expect } from "vitest";
import { normalizePaymentPayload } from "./paymentPayload";

describe("normalizePaymentPayload", () => {
  it("normalizes a complete payment form", () => {
    const result = normalizePaymentPayload({
      customerId: "12",
      customerName: "ABC Trading",
      invoiceNo: "INV-001",
      invoiceAmount: "1500",
      outstandingAmount: "500",
      paymentDate: "2026-11-06",
      paymentType: "Full Payment",
      paymentMethod: "Bank Transfer",
      amountReceived: "1000",
      referenceNumber: "REF-123",
      notes: "First payment",
    });

    expect(result).toEqual({
      customer: 12,
      customer_id: 12,
      customer_name: "ABC Trading",
      invoice_no: "INV-001",
      invoice_amount: 1500,
      outstanding_amount: 500,
      payment_date: "2026-11-06",
      payment_type: "full_payment",
      payment_method: "bank_transfer",
      amount_received: 1000,
      reference_number: "REF-123",
      notes: "First payment",
    });
  });

  it("supports customer_id as the customer identifier", () => {
    const result = normalizePaymentPayload({
      customer_id: "25",
      paymentType: "Partial Payment",
      paymentMethod: "Online Payment",
    });

    expect(result.customer).toBe(25);
    expect(result.customer_id).toBe(25);
    expect(result.payment_type).toBe("partial_payment");
    expect(result.payment_method).toBe("online_payment");
  });

  it("uses the customer name when no numeric customer ID is supplied", () => {
    const result = normalizePaymentPayload({
      customer: "  Al Noor Trading  ",
    });

    expect(result.customer).toBe("Al Noor Trading");
    expect(result.customer_id).toBeNull();
    expect(result.customer_name).toBe("Al Noor Trading");
  });

  it("returns null for empty numeric fields", () => {
    const result = normalizePaymentPayload({
      customerId: "",
      invoiceAmount: "",
      outstandingAmount: "",
      amountReceived: "",
    });

    expect(result.customer).toBeNull();
    expect(result.customer_id).toBeNull();
    expect(result.invoice_amount).toBeNull();
    expect(result.outstanding_amount).toBeNull();
    expect(result.amount_received).toBeNull();
  });

  it("converts payment type and method to lowercase underscore format", () => {
    const result = normalizePaymentPayload({
      paymentType: "Advance Payment",
      paymentMethod: "Bank Transfer",
    });

    expect(result.payment_type).toBe("advance_payment");
    expect(result.payment_method).toBe("bank_transfer");
  });

  it("uses empty strings for missing reference number and notes", () => {
    const result = normalizePaymentPayload({});

    expect(result.reference_number).toBe("");
    expect(result.notes).toBe("");
  });
});
