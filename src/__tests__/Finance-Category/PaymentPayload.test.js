import { describe, expect, it } from "vitest";

import { normalizePaymentPayload } from "../../Pages/FinanceModule/SALES/Payments/paymentPayload";

describe("normalizePaymentPayload", () => {
  it("prefers the customer id for API payloads and keeps the name for compatibility", () => {
    const payload = normalizePaymentPayload({
      invoiceNo: "INV-1001",
      customerId: "7",
      customer: "Acme Labs",
      invoiceAmount: "500",
      outstandingAmount: "100",
      paymentDate: "2026-09-22",
      paymentType: "Full Payment",
      paymentMethod: "Bank Transfer",
      amountReceived: "400",
      referenceNumber: "REF-01",
      notes: "Payment received",
    });

    expect(payload.customer).toBe(7);
    expect(payload.customer_id).toBe(7);
    expect(payload.customer_name).toBe("Acme Labs");
    expect(payload.amount_received).toBe(400);
  });

  it("falls back to the typed customer name when no customer id is selected", () => {
    const payload = normalizePaymentPayload({
      invoiceNo: "INV-1002",
      customer: "Northwind Co",
      invoiceAmount: "650",
      paymentDate: "2026-09-22",
      paymentType: "Partial Payment",
      paymentMethod: "Cash",
      amountReceived: "250",
    });

    expect(payload.customer).toBe("Northwind Co");
    expect(payload.customer_id).toBeNull();
    expect(payload.customer_name).toBe("Northwind Co");
  });
});
