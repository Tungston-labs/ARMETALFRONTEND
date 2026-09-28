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

  /* =====================================================
       RESET FORM WHEN MODAL OPENS
    ===================================================== */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (initialData) {
      setFormData({
        invoiceNo: initialData.invoice_no || "",
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
        invoiceAmount: initialData.invoice_amount ?? "",
        outstandingAmount: initialData.outstanding_amount ?? "",
        paymentDate: initialData.payment_date || "",
        paymentType: initialData.payment_type || "Full Payment",
        paymentMethod: initialData.payment_method || "Bank Transfer",
        amountReceived: initialData.amount_received ?? initialData.amount ?? "",
        referenceNumber: initialData.reference_number || "",
        notes: initialData.notes || "",
      });

      return;
    }

    setFormData({
      ...initialFormData,
    });

    setValidationError("");
  }, [isOpen, initialData]);

  if (!isOpen) {
    return null;
  }

  /* =====================================================
       INPUT CHANGE
    ===================================================== */

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
          selectedCustomer?.name ||
          selectedCustomer?.customer_name ||
          "";
      }

      return next;
    });

    setValidationError("");
  };

  /* =====================================================
       SUBMIT
    ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.invoiceNo.trim()) {
      setValidationError("Invoice No is required.");
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
            <FormGroup>
              <Label>
                Invoice No <span>*</span>
              </Label>

              <Input
                type="text"
                name="invoiceNo"
                placeholder="CLT0012563"
                value={formData.invoiceNo}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                Customer <span>*</span>
              </Label>

              {customers.length > 0 ? (
                <Select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                >
                  <option value="">Select a customer</option>

                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name || customer.customer_name || `Customer #${customer.id}`}
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
                />
              )}
            </FormGroup>

            <FormGroup>
              <Label>Invoice Amount (SAR)</Label>

              <Input
                type="number"
                name="invoiceAmount"
                placeholder="00.00 SAR"
                value={formData.invoiceAmount}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Outstanding Amount (SAR)</Label>

              <Input
                type="number"
                name="outstandingAmount"
                placeholder="00.00 SAR"
                value={formData.outstandingAmount}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                Payment Date <span>*</span>
              </Label>

              <Input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>
                Payment Type <span>*</span>
              </Label>

              <Select
                name="paymentType"
                value={formData.paymentType}
                onChange={handleChange}
              >
                <option value="Full Payment">Full Payment</option>

                <option value="Partial Payment">Partial Payment</option>

                <option value="Advance Payment">Advance Payment</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>
                Payment Method <span>*</span>
              </Label>

              <Select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="Bank Transfer">Bank Transfer</option>

                <option value="Cheque">Cheque</option>

                <option value="Online Payment">Online Payment</option>

                <option value="Cash">Cash</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>
                Amount Received <span>*</span>
              </Label>

              <Input
                type="number"
                name="amountReceived"
                placeholder="00.00 SAR"
                value={formData.amountReceived}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Reference Number</Label>

              <Input
                type="text"
                name="referenceNumber"
                placeholder="Enter Number"
                value={formData.referenceNumber}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup>
              <Label>Notes</Label>

              <Input
                type="text"
                name="notes"
                placeholder=""
                value={formData.notes}
                onChange={handleChange}
              />
            </FormGroup>
          </FormGrid>

          {(validationError || error) && (
            <div
              style={{
                color: "#dc2626",
                marginTop: "10px",
                fontSize: "13px",
              }}
            >
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

              {submitting ? "SAVING..." : "SAVE PAYMENT"}
            </SaveButton>
          </ButtonWrapper>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default PaymentModal;
