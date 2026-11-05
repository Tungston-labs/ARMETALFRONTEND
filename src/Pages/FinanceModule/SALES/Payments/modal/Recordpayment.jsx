import React, { useEffect, useState } from "react";

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

const initialFormData = {
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

const PaymentModal = ({
  isOpen,
  onClose,
  onSave,
  submitting = false,
  initialData = null,
  error = null,
  customers = [],
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [validationError, setValidationError] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      const invoiceAmount = initialData.invoice_amount ?? "";

      const alreadyPaid =
        initialData.already_paid ?? initialData.amount_paid ?? "";

      setFormData({
        invoiceNo: initialData.invoice_no || initialData.invoice_ref || "",

        customerId:
          initialData.customer_id ??
          initialData.customer?.id ??
          initialData.customer ??
          "",

        customer:
          initialData.customer_name ||
          initialData.customer?.name ||
          initialData.customer ||
          "",

        invoiceAmount,

        alreadyPaid,

        outstandingAmount:
          initialData.outstanding_amount ?? initialData.balance_due ?? "",

        paymentDate: initialData.payment_date || "",

        paymentType: initialData.payment_type || "Full Payment",

        paymentMethod: initialData.payment_method || "Bank Transfer",

        amountReceived: initialData.amount_received ?? initialData.amount ?? "",

        referenceNumber:
          initialData.transaction_id || initialData.reference_number || "",

        notes: initialData.notes || "",
      });

      setValidationError("");
      return;
    }

    setFormData({ ...initialFormData });
    setValidationError("");
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };

      if (name === "customerId") {
        const selectedCustomer = customers.find(
          (customer) => String(customer.id) === String(value),
        );

        next.customer =
          selectedCustomer?.name || selectedCustomer?.customer_name || "";
      }

      // Calculate balance due automatically
      if (name === "invoiceAmount" || name === "alreadyPaid") {
        const invoiceTotal =
          Number(name === "invoiceAmount" ? value : prev.invoiceAmount) || 0;

        const paidAmount =
          Number(name === "alreadyPaid" ? value : prev.alreadyPaid) || 0;

        next.outstandingAmount = Math.max(invoiceTotal - paidAmount, 0).toFixed(
          2,
        );
      }

      return next;
    });

    setValidationError("");
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.invoiceNo.trim()) {
      setValidationError("Payment Category is required.");
      return;
    }

    if (!formData.customerId && !formData.customer.trim()) {
      setValidationError("Customer is required.");
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

    if (!formData.referenceNumber.trim()) {
      setValidationError("Transaction ID is required.");
      return;
    }

    setValidationError("");

    if (onSave) {
      await onSave(formData);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Title>Record Payment</Title>

          <Subtitle>
            Monitor customer collections, track payment transactions, manage
            outstanding balances.
          </Subtitle>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
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
                name="invoiceNo"
                value={formData.invoiceNo}
                onChange={handleChange}
                required
              >
                <option value="">INVOICE REF</option>

                {formData.invoiceNo &&
                  !["INVOICE REF"].includes(formData.invoiceNo) && (
                    <option value={formData.invoiceNo}>
                      {formData.invoiceNo}
                    </option>
                  )}

                <option value="INVOICE REF">INVOICE REF</option>
              </Select>
            </FormGroup>

            {/* Invoice Total */}
            <FormGroup>
              <Label>INVOICE TOTAL</Label>

              <Input
                type="text"
                name="invoiceAmount"
                placeholder="SAR 0.00"
                value={
                  formData.invoiceAmount === ""
                    ? ""
                    : `SAR ${Number(formData.invoiceAmount).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}`
                }
                readOnly
              />
            </FormGroup>

            {/* Already Paid */}
            <FormGroup>
              <Label>ALREADY PAID</Label>

              <Input
                type="text"
                name="alreadyPaid"
                placeholder="00.00 SAR"
                value={
                  formData.alreadyPaid === ""
                    ? "00.00 SAR"
                    : `${Number(formData.alreadyPaid).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} SAR`
                }
                readOnly
              />
            </FormGroup>

            {/* Balance Due */}
            <FormGroup>
              <Label>BALANCE DUE</Label>

              <Input
                type="text"
                name="outstandingAmount"
                value={
                  formData.outstandingAmount === ""
                    ? "SAR 0.00"
                    : `SAR ${Number(formData.outstandingAmount).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      )}`
                }
                readOnly
                $isBalance
              />
            </FormGroup>

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

            {/* Transaction ID */}
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
          </FormGrid>

          {(validationError || error) && (
            <div className="payment-error">
              {validationError ||
                (typeof error === "string" ? error : "Unable to save payment.")}
            </div>
          )}

          <ButtonWrapper>
            <CancelButton type="button" onClick={onClose} disabled={submitting}>
              CANCEL
            </CancelButton>

            <SaveButton type="submit" disabled={submitting}>
              <span>▣</span>

              {submitting ? "RECORDING..." : "RECORD PAYMENT"}
            </SaveButton>
          </ButtonWrapper>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default PaymentModal;
