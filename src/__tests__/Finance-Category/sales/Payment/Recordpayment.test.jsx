import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import PaymentModal from "./Recordpayment";

describe("PaymentModal", () => {
  const onClose = vi.fn();
  const onSave = vi.fn();

  const customers = [
    { id: 1, name: "ABC Trading" },
    { id: 2, customer_name: "Al Noor Trading" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    onSave.mockResolvedValue(undefined);
  });

  const renderModal = (props = {}) =>
    render(
      <PaymentModal
        isOpen
        onClose={onClose}
        onSave={onSave}
        customers={customers}
        {...props}
      />,
    );

  it("does not render when closed", () => {
    render(
      <PaymentModal
        isOpen={false}
        onClose={onClose}
        onSave={onSave}
      />,
    );

    expect(screen.queryByText("Record Payment")).not.toBeInTheDocument();
  });

  it("renders the payment form when open", () => {
    renderModal();

    expect(screen.getByText("Record Payment")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("CLT0012563")).toBeInTheDocument();
    expect(screen.getByText("SAVE PAYMENT")).toBeInTheDocument();
    expect(screen.getByText("CANCEL")).toBeInTheDocument();
  });

  it("shows customer options when customers are available", () => {
    renderModal();

    expect(screen.getByRole("option", { name: "ABC Trading" })).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Al Noor Trading" }),
    ).toBeInTheDocument();
  });

  it("uses a text input when no customers are available", () => {
    renderModal({ customers: [] });

    expect(
      screen.getByPlaceholderText("Enter client name"),
    ).toBeInTheDocument();
  });

  it("shows validation error when invoice number is missing", async () => {
    renderModal();

    fireEvent.click(screen.getByText("SAVE PAYMENT"));

    expect(
      await screen.findByText("Invoice No is required."),
    ).toBeInTheDocument();

    expect(onSave).not.toHaveBeenCalled();
  });

  it("shows validation error when customer is missing", async () => {
    renderModal({ customers: [] });

    fireEvent.change(screen.getByPlaceholderText("CLT0012563"), {
      target: { value: "INV-001" },
    });

    fireEvent.click(screen.getByText("SAVE PAYMENT"));

    expect(
      await screen.findByText("Customer is required."),
    ).toBeInTheDocument();

    expect(onSave).not.toHaveBeenCalled();
  });

  it("shows validation error when payment date is missing", async () => {
    renderModal();

    fireEvent.change(screen.getByPlaceholderText("CLT0012563"), {
      target: { value: "INV-001" },
    });

    fireEvent.change(screen.getByRole("combobox", { name: "" }), {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByText("SAVE PAYMENT"));

    expect(
      await screen.findByText("Payment Date is required."),
    ).toBeInTheDocument();
  });

  it("shows validation error when amount received is missing", async () => {
    renderModal();

    fireEvent.change(screen.getByPlaceholderText("CLT0012563"), {
      target: { value: "INV-001" },
    });

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "1" },
    });

    fireEvent.change(screen.getByLabelText(""), {
      target: { value: "2026-11-06" },
    }).catch?.(() => {});

    const dateInput = document.querySelector('input[name="paymentDate"]');

    fireEvent.change(dateInput, {
      target: { value: "2026-11-06" },
    });

    fireEvent.click(screen.getByText("SAVE PAYMENT"));

    expect(
      await screen.findByText("Amount Received is required."),
    ).toBeInTheDocument();
  });

  it("submits valid payment form data", async () => {
    renderModal();

    fireEvent.change(screen.getByPlaceholderText("CLT0012563"), {
      target: { value: "INV-001" },
    });

    fireEvent.change(document.querySelector('select[name="customerId"]'), {
      target: { value: "1" },
    });

    fireEvent.change(document.querySelector('input[name="paymentDate"]'), {
      target: { value: "2026-11-06" },
    });

    fireEvent.change(screen.getByPlaceholderText("00.00 SAR"), {
      target: { value: "1500" },
    });

    fireEvent.click(screen.getByText("SAVE PAYMENT"));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          invoiceNo: "INV-001",
          customerId: "1",
          customer: "ABC Trading",
          paymentDate: "2026-11-06",
          amountReceived: "1500",
        }),
      );
    });
  });

  it("updates customer name when a customer is selected", () => {
    renderModal();

    fireEvent.change(document.querySelector('select[name="customerId"]'), {
      target: { value: "2" },
    });

    expect(document.querySelector('select[name="customerId"]')).toHaveValue("2");
  });

  it("calls onClose when cancel is clicked", () => {
    renderModal();

    fireEvent.click(screen.getByText("CANCEL"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("displays the supplied API error", () => {
    renderModal({ error: "Payment could not be saved." });

    expect(
      screen.getByText("Payment could not be saved."),
    ).toBeInTheDocument();
  });

  it("shows a fallback message for a non-string API error", () => {
    renderModal({ error: { message: "Server error" } });

    expect(
      screen.getByText("Unable to save payment."),
    ).toBeInTheDocument();
  });

  it("disables the buttons and shows saving text while submitting", () => {
    renderModal({ submitting: true });

    expect(screen.getByText("SAVING...")).toBeInTheDocument();
    expect(screen.getByText("CANCEL")).toBeDisabled();
    expect(screen.getByText("SAVING...")).toBeDisabled();
  });

  it("loads initial payment data when editing", () => {
    renderModal({
      initialData: {
        invoice_no: "INV-EDIT-01",
        customer_id: 1,
        customer_name: "ABC Trading",
        payment_date: "2026-11-05",
        amount_received: 750,
        payment_type: "partial_payment",
        payment_method: "cash",
      },
    });

    expect(screen.getByDisplayValue("INV-EDIT-01")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2026-11-05")).toBeInTheDocument();
    expect(screen.getByDisplayValue("750")).toBeInTheDocument();
  });
});