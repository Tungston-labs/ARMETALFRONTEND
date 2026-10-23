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

const initialFormData = {
  vendorId: "",
  vendorName: "",

  billId: "",
  billNumber: "",

  billTotal: "",
  alreadyPaid: "",
  balanceDue: "",

  paymentDate: "",
  paymentType: "Full Payment",
  paymentMethod: "Bank Transfer",

  amount: "",

  referenceNumber: "",

  bankName: "",
  accountHolder: "",
  iban: "",

  notes: "",
};

const getVendorName = (vendor) =>
  vendor?.name ||
  vendor?.vendor_name ||
  vendor?.company_name ||
  vendor?.company ||
  `Vendor #${vendor?.id}`;

const getBillNumber = (bill) =>
  bill?.bill_number ||
  bill?.bill_no ||
  bill?.invoice_no ||
  `Bill #${bill?.id}`;

const getBillTotal = (bill) =>
  bill?.total_amount ??
  bill?.total ??
  bill?.bill_total ??
  bill?.amount ??
  "";

const getAlreadyPaid = (bill) =>
  bill?.already_paid ??
  bill?.paid_amount ??
  bill?.amount_paid ??
  bill?.paid ??
  0;

const getBalanceDue = (bill) =>
  bill?.balance_due ??
  bill?.remaining_amount ??
  bill?.outstanding_amount ??
  (
    Number(getBillTotal(bill) || 0) -
    Number(getAlreadyPaid(bill) || 0)
  );

const getVendorId = (bill) => {
  if (!bill) {
    return "";
  }

  if (typeof bill.vendor === "object") {
    return bill.vendor?.id ?? "";
  }

  return (
    bill.vendor_id ??
    bill.vendor ??
    ""
  );
};

const PaymentModal = ({
  isOpen,
  onClose,
  onSave,
  submitting = false,
  initialData = null,
  error = null,

  vendors = [],
  bills = [],
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [validationError, setValidationError] =
    useState("");

  /* =====================================================
     RESET FORM
  ===================================================== */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (initialData) {
      const vendor =
        typeof initialData.vendor === "object"
          ? initialData.vendor
          : null;

      const bill =
        typeof initialData.bill === "object"
          ? initialData.bill
          : null;

      setFormData({
        vendorId:
          initialData.vendor_id ??
          vendor?.id ??
          initialData.vendor ??
          "",

        vendorName:
          initialData.vendor_name ??
          vendor?.name ??
          "",

        billId:
          initialData.bill_id ??
          bill?.id ??
          initialData.bill ??
          "",

        billNumber:
          initialData.bill_number ??
          initialData.bill_no ??
          bill?.bill_number ??
          "",

        billTotal:
          initialData.bill_total ??
          initialData.bill_amount ??
          bill?.total_amount ??
          "",

        alreadyPaid:
          initialData.already_paid ??
          initialData.paid_amount ??
          "",

        balanceDue:
          initialData.balance_due ??
          initialData.outstanding_amount ??
          "",

        paymentDate:
          initialData.payment_date || "",

        paymentType:
          initialData.payment_type
            ? formatChoice(initialData.payment_type)
            : "Full Payment",

        paymentMethod:
          initialData.payment_method
            ? formatChoice(initialData.payment_method)
            : "Bank Transfer",

        amount:
          initialData.amount ??
          initialData.amount_received ??
          "",

        referenceNumber:
          initialData.reference_number || "",

        bankName:
          initialData.bank_name || "",

        accountHolder:
          initialData.account_holder || "",

        iban:
          initialData.iban || "",

        notes:
          initialData.notes || "",
      });

      setValidationError("");

      return;
    }

    setFormData({
      ...initialFormData,
      paymentDate: getToday(),
    });

    setValidationError("");
  }, [isOpen, initialData]);

  /* =====================================================
     VENDOR OPTIONS
  ===================================================== */

  const vendorOptions = useMemo(() => {
    return vendors.map((vendor) => ({
      id: vendor.id,
      name: getVendorName(vendor),
    }));
  }, [vendors]);

  /* =====================================================
     BILL OPTIONS
  ===================================================== */

  const billOptions = useMemo(() => {
    if (!formData.vendorId) {
      return bills;
    }

    return bills.filter((bill) => {
      const billVendorId = getVendorId(bill);

      return (
        !billVendorId ||
        String(billVendorId) ===
          String(formData.vendorId)
      );
    });
  }, [bills, formData.vendorId]);

  if (!isOpen) {
    return null;
  }

  /* =====================================================
     CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValidationError("");

    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };

      if (name === "vendorId") {
        const vendor = vendorOptions.find(
          (item) => String(item.id) === String(value),
        );

        next.vendorName = vendor?.name || "";

        next.billId = "";
        next.billNumber = "";
        next.billTotal = "";
        next.alreadyPaid = "";
        next.balanceDue = "";
      }

      if (name === "billId") {
        const selectedBill = bills.find(
          (bill) =>
            String(bill.id) === String(value),
        );

        if (selectedBill) {
          const vendorId =
            getVendorId(selectedBill);

          next.billNumber =
            getBillNumber(selectedBill);

          next.billTotal =
            getBillTotal(selectedBill);

          next.alreadyPaid =
            getAlreadyPaid(selectedBill);

          next.balanceDue =
            getBalanceDue(selectedBill);

          if (
            vendorId !== "" &&
            vendorId !== null &&
            vendorId !== undefined
          ) {
            next.vendorId = vendorId;

            const vendor = vendorOptions.find(
              (item) =>
                String(item.id) ===
                String(vendorId),
            );

            next.vendorName =
              vendor?.name ||
              selectedBill?.vendor_name ||
              "";
          }
        }
      }

      if (
        name === "amount" &&
        next.billTotal !== ""
      ) {
        const amount = Number(value);

        const balance = Number(
          next.balanceDue || 0,
        );

        if (
          Number.isFinite(amount) &&
          amount > balance &&
          balance > 0
        ) {
          next.amount = String(balance);
        }
      }

      return next;
    });
  };

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.vendorId) {
      setValidationError("Vendor is required.");
      return;
    }

    if (!formData.billId) {
      setValidationError("Against Bill is required.");
      return;
    }

    if (!formData.paymentDate) {
      setValidationError(
        "Payment Date is required.",
      );
      return;
    }

    if (!formData.amount) {
      setValidationError("Amount is required.");
      return;
    }

    const amount = Number(formData.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setValidationError(
        "Amount must be greater than zero.",
      );
      return;
    }

    const balanceDue = Number(
      formData.balanceDue || 0,
    );

    if (
      balanceDue > 0 &&
      amount > balanceDue
    ) {
      setValidationError(
        "Amount cannot be greater than Balance Due.",
      );
      return;
    }

    setValidationError("");

    if (onSave) {
      await onSave(formData);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader>
          <Title>Record Payment</Title>

          <Subtitle>
            Monitor customer collections, track
            payment transactions, manage
            outstanding balances.
          </Subtitle>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <FormGrid>
            {/* VENDOR */}

            <FormGroup>
              <Label>
                Vendor <span>*</span>
              </Label>

              <Select
                name="vendorId"
                value={formData.vendorId}
                onChange={handleChange}
              >
                <option value="">
                  Select Vendor
                </option>

                {vendorOptions.map((vendor) => (
                  <option
                    key={vendor.id}
                    value={vendor.id}
                  >
                    {vendor.name}
                  </option>
                ))}
              </Select>
            </FormGroup>

            {/* AGAINST BILL */}

            <FormGroup>
              <Label>
                Against Bill <span>*</span>
              </Label>

              <Select
                name="billId"
                value={formData.billId}
                onChange={handleChange}
                disabled={!formData.vendorId}
              >
                <option value="">
                  Select Bill
                </option>

                {billOptions.map((bill) => (
                  <option
                    key={bill.id}
                    value={bill.id}
                  >
                    {getBillNumber(bill)}{" "}
                    {getBillTotal(bill) !== ""
                      ? `- SAR ${Number(
                          getBillTotal(bill),
                        ).toLocaleString(
                          "en-US",
                          {
                            minimumFractionDigits: 2,
                          },
                        )}`
                      : ""}
                  </option>
                ))}
              </Select>
            </FormGroup>

            {/* BILL TOTAL */}

            <FormGroup>
              <Label>Bill Total</Label>

              <Input
                type="text"
                value={
                  formData.billTotal !== ""
                    ? `SAR ${Number(
                        formData.billTotal,
                      ).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}`
                    : ""
                }
                placeholder="SAR 0.00"
                readOnly
              />
            </FormGroup>

            {/* ALREADY PAID */}

            <FormGroup>
              <Label>Already Paid</Label>

              <Input
                type="text"
                value={
                  formData.alreadyPaid !== ""
                    ? `SAR ${Number(
                        formData.alreadyPaid,
                      ).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}`
                    : ""
                }
                placeholder="Already Paid"
                readOnly
              />
            </FormGroup>

            {/* BALANCE DUE */}

            <FormGroup>
              <Label>Balance Due</Label>

              <Input
                type="text"
                value={
                  formData.balanceDue !== ""
                    ? `SAR ${Number(
                        formData.balanceDue,
                      ).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}`
                    : ""
                }
                placeholder="SAR 0.00"
                readOnly
                style={{
                  color: "#ef4444",
                }}
              />
            </FormGroup>

            {/* PAYMENT DATE */}

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

            {/* PAYMENT TYPE */}

            <FormGroup>
              <Label>
                Payment Type <span>*</span>
              </Label>

              <Select
                name="paymentType"
                value={formData.paymentType}
                onChange={handleChange}
              >
                <option value="Full Payment">
                  Full Payment
                </option>

                <option value="Partial Payment">
                  Partial Payment
                </option>

                <option value="Advance Payment">
                  Advance Payment
                </option>
              </Select>
            </FormGroup>

            {/* PAYMENT METHOD */}

            <FormGroup>
              <Label>
                Payment Method <span>*</span>
              </Label>

              <Select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="Bank Transfer">
                  Bank Transfer
                </option>

                <option value="Cheque">
                  Cheque
                </option>

                <option value="Online Payment">
                  Online Payment
                </option>

                <option value="Cash">
                  Cash
                </option>
              </Select>
            </FormGroup>

            {/* AMOUNT */}

            <FormGroup>
              <Label>
                Amount (SAR) <span>*</span>
              </Label>

              <Input
                type="number"
                name="amount"
                min="0"
                step="0.01"
                placeholder="00.00 SAR"
                value={formData.amount}
                onChange={handleChange}
              />
            </FormGroup>

            {/* REFERENCE */}

            <FormGroup>
              <Label>
                Reference / Txn No.(Optional)
              </Label>

              <Input
                type="text"
                name="referenceNumber"
                placeholder=""
                value={
                  formData.referenceNumber
                }
                onChange={handleChange}
              />
            </FormGroup>

            {/* BANK NAME */}

            <FormGroup>
              <Label>Bank Name</Label>

              <Input
                type="text"
                name="bankName"
                placeholder="Al Rajhi Bank"
                value={formData.bankName}
                onChange={handleChange}
              />
            </FormGroup>

            {/* ACCOUNT HOLDER */}

            <FormGroup>
              <Label>Account Holder</Label>

              <Input
                type="text"
                name="accountHolder"
                placeholder=""
                value={formData.accountHolder}
                onChange={handleChange}
              />
            </FormGroup>

            {/* IBAN */}

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

            {/* NOTES */}

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
                (typeof error === "string"
                  ? error
                  : "Unable to save payment.")}
            </div>
          )}

          <ButtonWrapper>
            <CancelButton
              type="button"
              onClick={onClose}
              disabled={submitting}
            >
              CANCEL
            </CancelButton>

            <SaveButton
              type="submit"
              disabled={submitting}
            >
              <span>▣</span>

              {submitting
                ? "RECORDING..."
                : "RECORD PAYMENT"}
            </SaveButton>
          </ButtonWrapper>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatChoice = (value) =>
  String(value)
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");

export default PaymentModal;