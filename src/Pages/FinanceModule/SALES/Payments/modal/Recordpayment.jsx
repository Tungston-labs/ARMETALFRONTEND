import React, { useEffect, useMemo, useState } from "react";
import { FiCreditCard } from "react-icons/fi";

import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  Title,
  Subtitle,
  FormGrid,
  FormGroup,
  NotesGroup,
  Label,
  Input,
  Select,
  ButtonWrapper,
  CancelButton,
  SaveButton,
} from "./Recordpayment.style";

const initialFormData = {
  customerId: "",
  customer: "",
  invoiceId: "",
  invoiceNo: "",
  invoiceAmount: "",
  alreadyPaid: "",
  outstandingAmount: "",
  paymentDate: new Date().toISOString().split("T")[0],
  paymentType: "Full Payment",
  paymentMethod: "Bank Transfer",
  amountReceived: "",
  referenceNumber: "",
  bankName: "",
  accountHolder: "",
  iban: "",
  notes: "",
};

const money = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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

  const invoiceCustName =
    invoice?.customer_name ||
    invoice?.customer_display_name ||
    (invoice?.customer && typeof invoice.customer === "object"
      ? invoice.customer.customer_name || invoice.customer.name
      : "");

  if (customerName && invoiceCustName) {
    return (
      String(invoiceCustName).trim().toLowerCase() ===
      String(customerName).trim().toLowerCase()
    );
  }

  return false;
};

const PaymentModal = ({
  isOpen,
  onClose,
  onSave,
  submitting = false,
  initialData = null,
  isViewOnly = false,
  error = null,
  customers = [],
  invoices = [],
  onCustomerChange,
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [validationError, setValidationError] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      const invoiceNo = initialData.invoice_no || initialData.invoice_number || "";
      let invTotal = initialData.invoice_amount ?? initialData.total_amount ?? "";
      let invPaid = initialData.already_paid ?? initialData.amount_paid ?? "";
      let invBal = initialData.outstanding_amount ?? initialData.balance_due ?? "";

      const rawInvoiceId =
        initialData.invoice_id ??
        initialData.invoice?.id ??
        (typeof initialData.invoice === "number" ? initialData.invoice : "");

      if (rawInvoiceId && (!invTotal || !invBal)) {
        const matched = invoices.find((i) => String(i.id) === String(rawInvoiceId));
        if (matched) {
          const t = matched.total_amount ?? matched.amount_to_be_paid ?? "";
          const p = matched.amount_paid ?? matched.paid_amount ?? "";
          const b = matched.balance ?? (Number(t || 0) - Number(p || 0));
          if (!invTotal) invTotal = t;
          if (!invPaid) invPaid = p;
          if (!invBal) invBal = b;
        }
      }

      const originalPaymentAmount = Number(
        initialData.amount_received ?? initialData.amount ?? 0
      );

      // In edit mode (unless view-only), adjust alreadyPaid and outstandingAmount
      // so this payment's own amount is not double-counted as already paid.
      if (!isViewOnly && originalPaymentAmount > 0) {
        if (invPaid !== "") {
          invPaid = Math.max(0, Number(invPaid) - originalPaymentAmount);
        }
        if (invTotal !== "" && invPaid !== "") {
          invBal = Math.max(0, Number(invTotal) - Number(invPaid));
        } else if (invBal !== "") {
          invBal = Number(invBal) + originalPaymentAmount;
        }
      }

      const pType =
        initialData.payment_type_display ||
        (initialData.payment_type === "full_payment"
          ? "Full Payment"
          : initialData.payment_type === "partial_payment"
          ? "Partial Payment"
          : initialData.payment_type === "advance_payment"
          ? "Advance Payment"
          : initialData.payment_type || "Full Payment");

      const pMethod =
        initialData.payment_method_display ||
        (initialData.payment_method === "bank_transfer"
          ? "Bank Transfer"
          : initialData.payment_method === "cheque"
          ? "Cheque"
          : initialData.payment_method === "online_payment"
          ? "Online Payment"
          : initialData.payment_method === "cash"
          ? "Cash"
          : initialData.payment_method || "Bank Transfer");

      setFormData({
        customerId:
          initialData.customer_id ??
          initialData.customer?.id ??
          (typeof initialData.customer === "number" ? initialData.customer : ""),
        customer:
          initialData.customer_name ||
          initialData.customer?.customer_name ||
          initialData.customer?.name ||
          (typeof initialData.customer === "string" ? initialData.customer : ""),
        invoiceId: rawInvoiceId,
        invoiceNo,
        invoiceAmount: invTotal,
        alreadyPaid: invPaid,
        outstandingAmount: invBal,
        paymentDate:
          initialData.payment_date || new Date().toISOString().split("T")[0],
        paymentType: pType,
        paymentMethod: pMethod,
        amountReceived: initialData.amount_received ?? initialData.amount ?? "",
        referenceNumber:
          initialData.transaction_id || initialData.reference_number || "",
        bankName: initialData.bank_name || "",
        accountHolder: initialData.accountHolder || initialData.account_holder || "",
        iban: initialData.iban || "",
        notes: initialData.notes || "",
      });

      setValidationError("");
      return;
    }

    setFormData({
      ...initialFormData,
      paymentDate: new Date().toISOString().split("T")[0],
    });
    setValidationError("");
  }, [isOpen, initialData, invoices, isViewOnly]);

  // Customer's invoices with outstanding balance
  const customerInvoices = useMemo(() => {
    const list = Array.isArray(invoices) ? invoices : [];

    return list.filter((invoice) => {
      if (!formData.customerId && !formData.customer) return false;

      if (
        !invoiceBelongsToCustomer(
          invoice,
          formData.customerId,
          formData.customer
        )
      ) {
        return false;
      }

      const isCurrentInvoice =
        Boolean(initialData) &&
        (String(invoice.id) === String(initialData.invoice_id) ||
          String(invoice.id) === String(initialData.invoice?.id) ||
          String(invoice.id) === String(initialData.invoice));

      const status = String(invoice.payment_status || invoice.status || "")
        .trim()
        .toLowerCase();
      const total = Number(invoice.total_amount ?? invoice.amount_to_be_paid ?? 0);
      const paid = Number(invoice.amount_paid ?? invoice.paid_amount ?? 0);
      const balance = Number(invoice.balance ?? (total - paid));

      const effectiveBalance = isCurrentInvoice && !isViewOnly
        ? balance + Number(initialData.amount_received ?? initialData.amount ?? 0)
        : balance;

      return (status !== "paid" || (isCurrentInvoice && !isViewOnly)) && effectiveBalance > 0;
    });
  }, [invoices, formData.customerId, formData.customer, initialData, isViewOnly]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };

      if (name === "customerId") {
        const selectedCustomer = customers.find(
          (c) => String(c.id) === String(value)
        );

        next.customer =
          selectedCustomer?.name ||
          selectedCustomer?.customer_name ||
          "";

        next.invoiceId = "";
        next.invoiceNo = "";
        next.invoiceAmount = "";
        next.alreadyPaid = "";
        next.outstandingAmount = "";
        if (next.paymentType === "Full Payment") {
          next.amountReceived = "";
        }
      }

      if (name === "paymentType") {
        if (value === "Full Payment" && prev.outstandingAmount !== "") {
          next.amountReceived = String(prev.outstandingAmount);
        }
      }

      if (name === "amountReceived") {
        const numVal = Number(value);
        const numOut = Number(prev.outstandingAmount);
        if (numOut > 0 && numVal >= numOut) {
          next.paymentType = "Full Payment";
        } else if (numOut > 0 && numVal > 0 && numVal < numOut) {
          next.paymentType = "Partial Payment";
        }
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
      (item) => String(item.id) === String(invoiceId)
    );

    const invTotal = invoice
      ? invoice.total_amount ?? invoice.amount_to_be_paid ?? ""
      : "";
    const rawPaid = invoice
      ? invoice.amount_paid ?? invoice.paid_amount ?? "0.00"
      : "";

    const isCurrentInvoice =
      Boolean(initialData) &&
      (String(invoiceId) === String(initialData.invoice_id) ||
        String(invoiceId) === String(initialData.invoice?.id) ||
        String(invoiceId) === String(initialData.invoice));

    const currentPaymentAmount = isCurrentInvoice && !isViewOnly
      ? Number(initialData.amount_received ?? initialData.amount ?? 0)
      : 0;

    const invPaid = isCurrentInvoice && !isViewOnly
      ? Math.max(0, Number(rawPaid || 0) - currentPaymentAmount)
      : rawPaid;

    const invBalance = invoice
      ? (invTotal !== "" && invPaid !== ""
          ? Math.max(0, Number(invTotal) - Number(invPaid))
          : invoice.balance ?? "")
      : "";

    setFormData((prev) => ({
      ...prev,
      invoiceId,
      invoiceNo: invoice?.invoice_number || "",
      invoiceAmount: invTotal,
      alreadyPaid: invPaid,
      outstandingAmount: invBalance,
      amountReceived:
        prev.paymentType === "Full Payment" && invBalance !== ""
          ? String(invBalance)
          : prev.amountReceived,
    }));

    setValidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customerId && !formData.customer.trim()) {
      setValidationError("Customer is required.");
      return;
    }

    if (!formData.invoiceId) {
      setValidationError("Please select an invoice.");
      return;
    }

    if (!formData.paymentDate) {
      setValidationError("Payment Date is required.");
      return;
    }

    if (!formData.amountReceived) {
      setValidationError("Amount is required.");
      return;
    }

    if (Number(formData.amountReceived) <= 0) {
      setValidationError("Amount Received must be greater than zero.");
      return;
    }

    if (
      formData.outstandingAmount !== "" &&
      Number(formData.amountReceived) > Number(formData.outstandingAmount)
    ) {
      setValidationError(
        `Amount Received cannot exceed the balance due (SAR ${money(formData.outstandingAmount)}).`
      );
      return;
    }

    setValidationError("");

    if (onSave) {
      await onSave(formData);
    }
  };

  const hasInvoiceInList = customerInvoices.some(
    (inv) => String(inv.id) === String(formData.invoiceId)
  );

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Title>
            {isViewOnly
              ? "Payment Details"
              : initialData
              ? "Edit Payment"
              : "Record Payment"}
          </Title>
          <Subtitle>
            Monitor customer collections, track payment transactions, manage outstanding balances.
          </Subtitle>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <fieldset
            disabled={isViewOnly}
            style={{ border: "none", padding: 0, margin: 0 }}
          >
          <FormGrid>
            {/* ROW 1 */}
            {/* 1. CUSTOMER */}
            <FormGroup>
              <Label>
                CUSTOMER <span>*</span>
              </Label>
              {customers.length > 0 ? (
                <Select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a customer</option>
                  {customers.map((cust) => (
                    <option key={cust.id} value={cust.id}>
                      {cust.name || cust.customer_name || `Customer #${cust.id}`}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input
                  type="text"
                  name="customer"
                  placeholder="Select a customer"
                  value={formData.customer}
                  onChange={handleChange}
                  required
                />
              )}
            </FormGroup>

            {/* 2. AGAINST INVOICE */}
            <FormGroup>
              <Label>
                AGAINST INVOICE <span>*</span>
              </Label>
              <Select
                name="invoiceId"
                value={formData.invoiceId}
                onChange={handleInvoiceSelect}
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
                    {formData.outstandingAmount !== ""
                      ? ` - SAR ${money(formData.outstandingAmount)}`
                      : ""}
                  </option>
                )}
                {customerInvoices.map((inv) => {
                  const total = Number(inv.total_amount ?? inv.amount_to_be_paid ?? 0);
                  const paid = Number(inv.amount_paid ?? inv.paid_amount ?? 0);
                  let bal = Number(inv.balance ?? (total - paid));
                  const isCurrentInvoice =
                    Boolean(initialData) &&
                    (String(inv.id) === String(initialData.invoice_id) ||
                      String(inv.id) === String(initialData.invoice?.id) ||
                      String(inv.id) === String(initialData.invoice));
                  if (isCurrentInvoice && !isViewOnly) {
                    bal += Number(initialData.amount_received ?? initialData.amount ?? 0);
                  }
                  return (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoice_number || `INV-${inv.id}`} - SAR {money(bal)}
                    </option>
                  );
                })}
              </Select>
            </FormGroup>

            {/* 3. INVOICE TOTAL */}
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

            {/* 4. ALREADY PAID */}
            <FormGroup>
              <Label>ALREADY PAID</Label>
              <Input
                type="text"
                placeholder="Already Paid"
                value={
                  formData.alreadyPaid === ""
                    ? ""
                    : `SAR ${money(formData.alreadyPaid)}`
                }
                readOnly
              />
            </FormGroup>

            {/* 5. BALANCE DUE */}
            <FormGroup>
              <Label>BALANCE DUE</Label>
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

            {/* ROW 2 */}
            {/* 1. PAYMENT DATE */}
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

            {/* 2. PAYMENT TYPE */}
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

            {/* 3. PAYMENT METHOD */}
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

            {/* 4. AMOUNT (SAR) */}
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

            {/* 5. REFERENCE / TXN NO.(OPTIONAL) */}
            <FormGroup>
              <Label>REFERENCE / TXN NO.(OPTIONAL)</Label>
              <Input
                type="text"
                name="referenceNumber"
                placeholder="enter transaction id"
                value={formData.referenceNumber}
                onChange={handleChange}
              />
            </FormGroup>

            {/* ROW 3 */}
            {/* 1. BANK NAME */}
            <FormGroup>
              <Label>BANK NAME</Label>
              <Input
                type="text"
                name="bankName"
                placeholder="Al Rajhi Bank"
                value={formData.bankName}
                onChange={handleChange}
              />
            </FormGroup>

            {/* 2. ACCOUNT HOLDER */}
            <FormGroup>
              <Label>ACCOUNT HOLDER</Label>
              <Input
                type="text"
                name="accountHolder"
                placeholder="Al Noor Trading LLC"
                value={formData.accountHolder}
                onChange={handleChange}
              />
            </FormGroup>

            {/* 3. IBAN */}
            <FormGroup>
              <Label>IBAN</Label>
              <Input
                type="text"
                name="iban"
                placeholder="SA03 8000 0000 6080 1016 7519"
                value={formData.iban}
                onChange={handleChange}
              />
            </FormGroup>

            {/* 4 & 5. NOTES */}
            <NotesGroup>
              <Label>NOTES</Label>
              <Input
                type="text"
                name="notes"
                placeholder="Enter notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </NotesGroup>
          </FormGrid>
          </fieldset>

          {(validationError || error) && (
            <div className="payment-error">
              {validationError ||
                (typeof error === "string"
                  ? error
                  : error?.detail ||
                    error?.message ||
                    JSON.stringify(error) ||
                    "Unable to save payment.")}
            </div>
          )}

          <ButtonWrapper>
            <CancelButton type="button" onClick={onClose} disabled={submitting}>
              {isViewOnly ? "CLOSE" : "CANCEL"}
            </CancelButton>

            {!isViewOnly && (
              <SaveButton type="submit" disabled={submitting}>
                <FiCreditCard size={16} />
                {submitting
                  ? "SAVING..."
                  : initialData
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
