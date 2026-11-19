import React, { useEffect, useMemo, useState } from "react";

import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  Title,
  Subtitle,
  FormGrid,
  FormGroup,
  Label,
  Input,
  Select,
  ButtonWrapper,
  CancelButton,
  SaveButton,
} from "./Recordpayment.style";

const CATEGORY_INVOICE = "INVOICE REF";
const CATEGORY_OPENING = "OPENING BALANCE";

const initialFormData = {
  paymentCategory: "",
  invoiceId: "",
  invoiceNo: "",
  customerId: "",
  customer: "",
  invoiceAmount: "",
  alreadyPaid: "",
  outstandingAmount: "",
  paymentDate: "",
  paymentType: "Full Payment",
  paymentMethod: "Bank Transfer",
  amountReceived: "",
  referenceNumber: "",
  notes: "",
};

const money = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const getOpeningBalance = (customer) =>
  customer?.opening_balance ?? customer?.opening_balance_amount ?? "";

const invoiceBelongsToCustomer = (invoice, customerId, customerName) => {
  const invoiceCustomerId =
    invoice?.customer?.id ??
    invoice?.customer_id ??
    (typeof invoice?.customer === "number" ||
    /^\d+$/.test(String(invoice?.customer ?? ""))
      ? invoice.customer
      : null);

  if (invoiceCustomerId != null && customerId) {
    return String(invoiceCustomerId) === String(customerId);
  }

  if (customerName && invoice?.customer_name) {
    return (
      String(invoice.customer_name).trim().toLowerCase() ===
      String(customerName).trim().toLowerCase()
    );
  }

  return false;
};

// Turns an existing payment row into form state
const buildFormFromPayment = (p) => {
  const invoiceNo = p.invoice_no || p.invoice_ref || "";

  return {
    paymentCategory:
      p.payment_category === "opening_balance"
        ? CATEGORY_OPENING
        : invoiceNo
          ? CATEGORY_INVOICE
          : "",
    invoiceId:
      p.invoice_id ??
      p.invoice?.id ??
      (typeof p.invoice === "number" ? p.invoice : ""),
    invoiceNo,
    customerId: p.customer_id ?? p.customer?.id ?? p.customer ?? "",
    customer: p.customer_name || p.customer?.name || p.customer || "",
    invoiceAmount: p.invoice_amount ?? "",
    alreadyPaid: p.already_paid ?? p.amount_paid ?? "",
    outstandingAmount: p.outstanding_amount ?? p.balance_due ?? "",
    paymentDate: String(p.payment_date || "").slice(0, 10),
    paymentType: p.payment_type || "Full Payment",
    paymentMethod: p.payment_method || "Bank Transfer",
    amountReceived: p.amount_received ?? p.amount ?? "",
    referenceNumber: p.transaction_id || p.reference_number || "",
    notes: p.notes || "",
  };
};

const PaymentModal = ({
  isOpen,
  mode = "create", // "create" | "edit" | "view"
  onClose,
  onSave,
  submitting = false,
  initialData = null,
  error = null,
  customers = [],
  invoices = [],
  onCustomerChange,
}) => {
  const isView = mode === "view";
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState(initialFormData);
  const [validationError, setValidationError] = useState("");

  // Reset / pre-fill form when modal opens
  useEffect(() => {
    if (!isOpen) return;

    setFormData(
      initialData ? buildFormFromPayment(initialData) : { ...initialFormData },
    );
    setValidationError("");
  }, [isOpen, initialData]);

  // When opening an existing payment, load that customer's invoices
  useEffect(() => {
    if (!isOpen || !initialData) return;

    const cid =
      initialData.customer_id ??
      initialData.customer?.id ??
      initialData.customer;

    if (cid && /^\d+$/.test(String(cid))) onCustomerChange?.(cid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData]);

  // Invoices of the selected customer that still have a balance.
  // Must stay above the `if (!isOpen) return null` line (hooks rule).
  const customerInvoices = useMemo(() => {
    const list = Array.isArray(invoices) ? invoices : [];

    return list.filter((invoice) => {
      if (
        !invoiceBelongsToCustomer(invoice, formData.customerId, formData.customer)
      ) {
        return false;
      }

      const status = String(invoice.payment_status || invoice.status || "")
        .trim()
        .toLowerCase();
      const balance = Number(invoice.balance ?? 0);

      return status !== "paid" && balance > 0;
    });
  }, [invoices, formData.customerId, formData.customer]);

  if (!isOpen) return null;

  const isInvoiceCategory = formData.paymentCategory === CATEGORY_INVOICE;
  const isOpeningCategory = formData.paymentCategory === CATEGORY_OPENING;
  const isCash = formData.paymentMethod === "Cash";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "paymentMethod" && value === "Cash") {
        next.referenceNumber = "";
      }

      if (name === "customerId") {
        const selectedCustomer = customers.find(
          (customer) => String(customer.id) === String(value),
        );

        next.customer =
          selectedCustomer?.name || selectedCustomer?.customer_name || "";

        next.invoiceId = "";
        next.invoiceNo = "";
        next.invoiceAmount = "";
        next.alreadyPaid = "";
        next.outstandingAmount =
          prev.paymentCategory === CATEGORY_OPENING
            ? getOpeningBalance(selectedCustomer)
            : "";
      }

      if (name === "paymentCategory") {
        next.invoiceId = "";
        next.invoiceNo = "";
        next.invoiceAmount = "";
        next.alreadyPaid = "";

        const selectedCustomer = customers.find(
          (customer) => String(customer.id) === String(prev.customerId),
        );

        next.outstandingAmount =
          value === CATEGORY_OPENING ? getOpeningBalance(selectedCustomer) : "";
      }

      return next;
    });

    if (name === "customerId") {
      onCustomerChange?.(value);
    }

    setValidationError("");
  };

  const handleInvoiceSelect = (e) => {
    const invoiceId = e.target.value;

    const invoice = customerInvoices.find(
      (item) => String(item.id) === String(invoiceId),
    );

    setFormData((prev) => ({
      ...prev,
      invoiceId,
      invoiceNo: invoice?.invoice_number || "",
      invoiceAmount: invoice?.amount_to_be_paid ?? "",
      alreadyPaid: invoice?.paid_amount ?? "",
      outstandingAmount: invoice?.balance ?? "",
    }));

    setValidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isView) return;

    if (!formData.paymentCategory) {
      setValidationError("Payment Category is required.");
      return;
    }

    if (!formData.customerId && !formData.customer.trim()) {
      setValidationError("Customer is required.");
      return;
    }

    if (isInvoiceCategory && !formData.invoiceId) {
      setValidationError("Please select an invoice.");
      return;
    }

    if (!formData.paymentDate) {
      setValidationError("Payment Date is required.");
      return;
    }

    if (!formData.amountReceived) {
      setValidationError("Amount Received is required.");
      return;
    }

    if (Number(formData.amountReceived) <= 0) {
      setValidationError("Amount Received must be greater than zero.");
      return;
    }

    // In edit mode the original amount was already counted against the balance,
    // so add it back to get the real maximum.
    // If your API's balance_due already EXCLUDES this payment, keep this as is.
    // If it already INCLUDES it, set originalAmount to 0.
    const originalAmount = isEditMode
      ? Number(initialData?.amount_received ?? initialData?.amount ?? 0)
      : 0;

    if (
      formData.outstandingAmount !== "" &&
      Number(formData.amountReceived) >
        Number(formData.outstandingAmount) + originalAmount
    ) {
      setValidationError("Amount Received cannot exceed the balance due.");
      return;
    }

    if (!isCash && !formData.referenceNumber.trim()) {
      setValidationError("Transaction ID is required.");
      return;
    }

    setValidationError("");

    if (onSave) {
      await onSave(formData);
    }
  };

  const hasInvoiceInList = customerInvoices.some(
    (invoice) => String(invoice.id) === String(formData.invoiceId),
  );

  const title = isView
    ? "View Payment"
    : isEditMode
      ? "Edit Payment"
      : "Record Payment";

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Title>{title}</Title>

          <Subtitle>
            Monitor customer collections, track payment transactions, manage
            outstanding balances.
          </Subtitle>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          {/* A disabled fieldset disables every field inside it (view mode) */}
          <fieldset
            disabled={isView}
            style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
          >
            <FormGrid>
              {/* Customer */}
              <FormGroup>
                <Label>
                  CUSTOMER <span>*</span>
                </Label>

                {customers.length > 0 ? (
                  <Select
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleChange}
                    disabled={isEditMode}
                    required
                  >
                    <option value="">Select a customer</option>

                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name ||
                          customer.customer_name ||
                          `Customer #${customer.id}`}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    type="text"
                    name="customer"
                    placeholder="Enter client name"
                    value={formData.customer}
                    onChange={handleChange}
                    readOnly={isEditMode}
                    required
                  />
                )}
              </FormGroup>

              {/* Payment Category */}
              <FormGroup>
                <Label>
                  PAYMENT CATEGORY <span>*</span>
                </Label>

                <Select
                  name="paymentCategory"
                  value={formData.paymentCategory}
                  onChange={handleChange}
                  disabled={isEditMode}
                  required
                >
                  <option value="">Select Payment Category</option>
                  <option value={CATEGORY_INVOICE}>Invoice Ref</option>
                  <option value={CATEGORY_OPENING}>Opening Balance</option>
                </Select>
              </FormGroup>

              {/* Invoice (only for Invoice Ref) */}
              {isInvoiceCategory && (
                <FormGroup>
                  <Label>
                    INVOICE <span>*</span>
                  </Label>

                  <Select
                    name="invoiceId"
                    value={formData.invoiceId}
                    onChange={handleInvoiceSelect}
                    disabled={isEditMode}
                    required
                  >
                    <option value="">
                      {formData.customerId || formData.customer
                        ? customerInvoices.length
                          ? "Select Invoice"
                          : "No pending invoices"
                        : "Select a customer first"}
                    </option>

                    {formData.invoiceId && !hasInvoiceInList && (
                      <option value={formData.invoiceId}>
                        {formData.invoiceNo || `Invoice #${formData.invoiceId}`}
                      </option>
                    )}

                    {customerInvoices.map((invoice) => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.invoice_number} (balance SAR{" "}
                        {money(invoice.balance)})
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              )}

              {/* Invoice Total + Already Paid */}
              {isInvoiceCategory && (
                <>
                  <FormGroup>
                    <Label>INVOICE TOTAL</Label>
                    <Input
                      type="text"
                      placeholder="SAR 0.00"
                      value={
                        formData.invoiceAmount === ""
                          ? ""
                          : `SAR ${money(formData.invoiceAmount)}`
                      }
                      readOnly
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>ALREADY PAID</Label>
                    <Input
                      type="text"
                      placeholder="SAR 0.00"
                      value={
                        formData.alreadyPaid === ""
                          ? ""
                          : `SAR ${money(formData.alreadyPaid)}`
                      }
                      readOnly
                    />
                  </FormGroup>
                </>
              )}

              {/* Balance Due / Opening Balance */}
              {(isInvoiceCategory || isOpeningCategory) && (
                <FormGroup>
                  <Label>
                    {isInvoiceCategory ? "BALANCE DUE" : "OPENING BALANCE"}
                  </Label>
                  <Input
                    type="text"
                    placeholder="SAR 0.00"
                    value={
                      formData.outstandingAmount === ""
                        ? ""
                        : `SAR ${money(formData.outstandingAmount)}`
                    }
                    readOnly
                    $isBalance
                  />
                </FormGroup>
              )}

              {/* Payment Date */}
              <FormGroup>
                <Label>
                  PAYMENT DATE <span>*</span>
                </Label>
                <Input
                  type="date"
                  name="paymentDate"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              {/* Payment Type */}
              <FormGroup>
                <Label>
                  PAYMENT TYPE <span>*</span>
                </Label>
                <Select
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleChange}
                  required
                >
                  <option value="Full Payment">Full Payment</option>
                  <option value="Partial Payment">Partial Payment</option>
                  <option value="Advance Payment">Advance Payment</option>
                </Select>
              </FormGroup>

              {/* Payment Method */}
              <FormGroup>
                <Label>
                  PAYMENT METHOD <span>*</span>
                </Label>
                <Select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  required
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Online Payment">Online Payment</option>
                  <option value="Cash">Cash</option>
                </Select>
              </FormGroup>

              {/* Amount Received */}
              <FormGroup>
                <Label>
                  AMOUNT (SAR) <span>*</span>
                </Label>
                <Input
                  type="number"
                  name="amountReceived"
                  placeholder="00.00 SAR"
                  value={formData.amountReceived}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                />
              </FormGroup>

              {/* Transaction ID (not for cash) */}
              {!isCash && (
                <FormGroup>
                  <Label>
                    TRANSACTION ID <span>*</span>
                  </Label>
                  <Input
                    type="text"
                    name="referenceNumber"
                    placeholder="enter transaction id"
                    value={formData.referenceNumber}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>
              )}

              {/* Notes */}
              <FormGroup>
                <Label>NOTES</Label>
                <Input
                  name="notes"
                  placeholder="Enter notes"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </FormGroup>
            </FormGrid>
          </fieldset>

          {(validationError || error) && (
            <div className="payment-error">
              {validationError ||
                (typeof error === "string" ? error : "Unable to save payment.")}
            </div>
          )}

          <ButtonWrapper>
            <CancelButton type="button" onClick={onClose} disabled={submitting}>
              {isView ? "CLOSE" : "CANCEL"}
            </CancelButton>

            {!isView && (
              <SaveButton type="submit" disabled={submitting}>
                <span>▣</span>
                {submitting
                  ? "SAVING..."
                  : isEditMode
                    ? "UPDATE PAYMENT"
                    : "RECORD PAYMENT"}
              </SaveButton>
            )}
          </ButtonWrapper>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default PaymentModal;