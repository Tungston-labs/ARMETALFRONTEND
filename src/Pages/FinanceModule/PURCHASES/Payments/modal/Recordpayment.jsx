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
import { FiSave } from "react-icons/fi";

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

/* =========================================================
   GENERIC HELPERS
========================================================= */

const isEmpty = (v) => v === undefined || v === null || v === "";

// first non-empty value
const pick = (...values) => values.find((v) => !isEmpty(v)) ?? "";

const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatChoice = (value) =>
  String(value)
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatMoney = (value) => {
  if (isEmpty(value)) return "";
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return `SAR ${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// DRF errors can be strings or { field: ["msg"] } objects
const formatError = (err) => {
  if (!err) return "";
  if (typeof err === "string") return err;
  if (err.detail || err.message) return err.detail || err.message;
  return Object.entries(err)
    .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(", ") : val}`)
    .join(" | ");
};

/* =========================================================
   VENDOR / BILL HELPERS
========================================================= */

const getVendorName = (vendor) =>
  vendor?.name ||
  vendor?.vendor_name ||
  vendor?.company_name ||
  vendor?.company ||
  `Vendor #${vendor?.id}`;

const getBillNumber = (bill) =>
  bill?.bill_number || bill?.bill_no || bill?.invoice_no || `Bill #${bill?.id}`;

const getBillTotal = (bill) =>
  bill?.total_amount ?? bill?.total ?? bill?.bill_total ?? bill?.amount ?? "";

const getAlreadyPaid = (bill) =>
  bill?.amount_paid ??
  bill?.already_paid ??
  bill?.paid_amount ??
  bill?.paid ??
  0;

const getBalanceDue = (bill) => {
  const direct = pick(
    bill?.balance,
    bill?.balance_due,
    bill?.remaining_amount,
    bill?.outstanding_amount,
  );

  if (direct !== "") return direct;

  const total = Number(getBillTotal(bill) || 0);
  const paid = Number(getAlreadyPaid(bill) || 0);
  const diff = total - paid;
  return diff >= 0 ? diff : 0;
};

// Returns the vendor ID of a bill (handles object / vendor_id / numeric vendor)
const getVendorId = (bill) => {
  if (!bill) return "";

  if (bill.vendor && typeof bill.vendor === "object") {
    return bill.vendor.id ?? "";
  }

  if (!isEmpty(bill.vendor_id)) return bill.vendor_id;

  // bill.vendor can be a numeric id; ignore it if it is a name string
  if (!isEmpty(bill.vendor) && !Number.isNaN(Number(bill.vendor))) {
    return bill.vendor;
  }

  return "";
};

// Merge vendor from the list + vendor embedded in the bill (if any)
const resolveVendor = (bill, vendors) => {
  if (!bill) return null;

  const id = getVendorId(bill);

  let fromList = !isEmpty(id)
    ? vendors.find((v) => String(v.id) === String(id))
    : null;

  // fallback: match by name when the bill only carries a vendor name
  if (!fromList) {
    const billVendorName = pick(
      bill.vendor_name,
      typeof bill.vendor === "string" ? bill.vendor : "",
    );

    if (billVendorName) {
      fromList = vendors.find(
        (v) =>
          String(getVendorName(v)).toLowerCase() ===
          String(billVendorName).toLowerCase(),
      );
    }
  }

  const embedded =
    bill.vendor && typeof bill.vendor === "object" ? bill.vendor : null;

  if (!fromList && !embedded) return null;

  return { ...(fromList || {}), ...(embedded || {}) };
};

const getBankDetails = (vendor, bill) => ({
  bankName: pick(
    vendor?.bank_name,
    vendor?.bank,
    bill?.bank_name,
    bill?.vendor_bank_name,
  ),
  accountHolder: pick(
    vendor?.account_holder,
    vendor?.account_name,
    vendor?.bank_account_name,
    bill?.account_holder,
    vendor?.name,
    vendor?.vendor_name,
    vendor?.company_name,
    bill?.vendor_name,
  ),
  iban: pick(
    vendor?.iban,
    vendor?.iban_number,
    vendor?.bank_iban,
    bill?.iban,
    bill?.vendor_iban,
  ),
});

/* =========================================================
   COMPONENT
========================================================= */

const PaymentModal = ({
  isOpen,
  onClose,
  onSave,
  submitting = false,
  initialData = null,
  error = null,

  vendors = [],
  bills = [],
  mode = "create", // "create" | "view"
}) => {
  const isView = mode === "view";
  const [formData, setFormData] = useState(initialFormData);
  const [validationError, setValidationError] = useState("");

  /* -------------------- RESET FORM -------------------- */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (initialData) {
      const vendor =
        typeof initialData.vendor === "object" ? initialData.vendor : null;

      const bill =
        typeof initialData.bill === "object" ? initialData.bill : null;

      setFormData({
        vendorId: initialData.vendor_id ?? vendor?.id ?? initialData.vendor ?? "",
        vendorName: initialData.vendor_name ?? vendor?.name ?? "",

        billId: initialData.bill_id ?? bill?.id ?? initialData.bill ?? "",
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
          bill?.amount_paid ??
          "",

        balanceDue:
          initialData.balance_due ??
          initialData.balance ??
          initialData.outstanding_amount ??
          bill?.balance ??
          "",

        paymentDate: initialData.payment_date || "",

        paymentType: initialData.payment_type
          ? formatChoice(initialData.payment_type)
          : "Full Payment",

        paymentMethod: initialData.payment_method
          ? formatChoice(initialData.payment_method)
          : "Bank Transfer",

        amount:
          initialData.amount_paid ??
          initialData.amount ??
          initialData.amount_received ??
          "",

        referenceNumber: initialData.reference_number || "",

        bankName: initialData.bank_name || vendor?.bank_name || "",
        accountHolder: initialData.account_holder || vendor?.name || "",
        iban: initialData.iban || vendor?.iban || "",

        notes: initialData.notes || "",
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

  /* -------------------- OPTIONS -------------------- */

  const vendorOptions = useMemo(
    () =>
      vendors.map((vendor) => ({
        id: vendor.id,
        name: getVendorName(vendor),
      })),
    [vendors],
  );

  // bills of the selected vendor (or all), hiding fully paid bills
  const billOptions = useMemo(() => {
    return bills.filter((bill) => {
      const billVendorId = getVendorId(bill);

      const matchesVendor =
        !formData.vendorId ||
        !billVendorId ||
        String(billVendorId) === String(formData.vendorId);

      const hasBalance = Number(getBalanceDue(bill)) > 0;

      // keep the currently selected bill visible even if balance is 0
      const isSelected = String(bill.id) === String(formData.billId);

      return matchesVendor && (hasBalance || isSelected);
    });
  }, [bills, formData.vendorId, formData.billId]);

  if (!isOpen) {
    return null;
  }

  /* -------------------- CHANGE -------------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValidationError("");

    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };

      /* ---------- VENDOR CHANGED ---------- */
      if (name === "vendorId") {
        const vendor = vendors.find((item) => String(item.id) === String(value));

        next.vendorName = vendor ? getVendorName(vendor) : "";

        next.billId = "";
        next.billNumber = "";
        next.billTotal = "";
        next.alreadyPaid = "";
        next.balanceDue = "";
        next.amount = "";

        const bank = getBankDetails(vendor, null);
        next.bankName = bank.bankName;
        next.accountHolder = bank.accountHolder;
        next.iban = bank.iban;
      }

      /* ---------- BILL CHANGED ---------- */
      if (name === "billId") {
        const selectedBill = bills.find(
          (bill) => String(bill.id) === String(value),
        );

        if (!selectedBill) {
          next.billNumber = "";
          next.billTotal = "";
          next.alreadyPaid = "";
          next.balanceDue = "";
          next.amount = "";
        } else {
          const vendor = resolveVendor(selectedBill, vendors);
          const balanceDue = getBalanceDue(selectedBill);
          const bank = getBankDetails(vendor, selectedBill);

          next.billNumber = getBillNumber(selectedBill);
          next.billTotal = getBillTotal(selectedBill);
          next.alreadyPaid = getAlreadyPaid(selectedBill);
          next.balanceDue = balanceDue;

          // vendor is auto-selected from the bill
          next.vendorId = pick(
            vendor?.id,
            getVendorId(selectedBill),
            prev.vendorId,
          );

          next.vendorName = vendor
            ? getVendorName(vendor)
            : pick(
                selectedBill.vendor_name,
                typeof selectedBill.vendor === "string"
                  ? selectedBill.vendor
                  : "",
                prev.vendorName,
              );

          // bank details always overwritten so they match THIS bill's vendor
          next.bankName = bank.bankName;
          next.accountHolder = bank.accountHolder;
          next.iban = bank.iban;

          next.amount =
            next.paymentType === "Full Payment" && !isEmpty(balanceDue)
              ? String(balanceDue)
              : "";
        }
      }

      /* ---------- PAYMENT TYPE CHANGED ---------- */
      if (name === "paymentType") {
        if (value === "Full Payment" && !isEmpty(next.balanceDue)) {
          next.amount = String(next.balanceDue);
        }

        if (value === "Partial Payment" || value === "Advance Payment") {
          // let the user type their own amount
          if (Number(next.amount) === Number(next.balanceDue)) {
            next.amount = "";
          }
        }
      }

      /* ---------- AMOUNT CHANGED ---------- */
      if (name === "amount" && value !== "") {
        const amt = Number(value);
        const bal = Number(next.balanceDue || 0);

        if (
          next.paymentType !== "Advance Payment" &&
          bal > 0 &&
          Number.isFinite(amt)
        ) {
          if (amt > bal) {
            next.amount = String(bal);
          }

          next.paymentType =
            Number(next.amount) < bal ? "Partial Payment" : "Full Payment";
        }
      }

      return next;
    });
  };

  /* -------------------- SUBMIT -------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isView) return;

    if (!formData.vendorId) {
      setValidationError("Vendor is required.");
      return;
    }

    if (!formData.billId) {
      setValidationError("Against Bill is required.");
      return;
    }

    if (!formData.paymentDate) {
      setValidationError("Payment Date is required.");
      return;
    }

    if (!formData.amount) {
      setValidationError("Amount is required.");
      return;
    }

    const amount = Number(formData.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      setValidationError("Amount must be greater than zero.");
      return;
    }

    const balanceDue = Number(formData.balanceDue || 0);

    if (
      formData.paymentType !== "Advance Payment" &&
      balanceDue > 0 &&
      amount > balanceDue
    ) {
      setValidationError("Amount cannot be greater than Balance Due.");
      return;
    }

    setValidationError("");

    if (onSave) {
      await onSave(formData);
    }
  };

  const shownError = isView ? "" : validationError || formatError(error);

  // view mode: fall back to the bill / vendor lists when the payment
  // response does not include these values
  const viewBill = isView
    ? bills.find((b) => String(b.id) === String(formData.billId))
    : null;

  const viewVendor = isView
    ? vendors.find((v) => String(v.id) === String(formData.vendorId))
    : null;

  const shown = {
    vendorName: pick(
      formData.vendorName,
      viewVendor ? getVendorName(viewVendor) : "",
    ),
    billNumber: pick(
      formData.billNumber,
      viewBill ? getBillNumber(viewBill) : "",
    ),
    billTotal: pick(formData.billTotal, viewBill ? getBillTotal(viewBill) : ""),
    alreadyPaid: pick(
      formData.alreadyPaid,
      viewBill ? getAlreadyPaid(viewBill) : "",
    ),
    balanceDue: pick(
      formData.balanceDue,
      viewBill ? getBalanceDue(viewBill) : "",
    ),
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Title>{isView ? "Payment Details" : "Record Payment"}</Title>

          <Subtitle>
            {isView
              ? "Details of the payment made to the vendor."
              : "Record a payment made to a vendor against a purchase bill."}
          </Subtitle>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <FormGrid>
            {/* VENDOR */}
            <FormGroup>
              <Label>
                Vendor <span>*</span>
              </Label>

              {isView ? (
                <Input type="text" value={shown.vendorName} readOnly />
              ) : (
                <Select
                  name="vendorId"
                  value={formData.vendorId}
                  onChange={handleChange}
                >
                  <option value="">Select Vendor</option>

                  {vendorOptions.map((vendor) => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </Select>
              )}
            </FormGroup>

            {/* AGAINST BILL */}
            <FormGroup>
              <Label>
                Against Bill <span>*</span>
              </Label>

              {isView ? (
                <Input type="text" value={shown.billNumber} readOnly />
              ) : (
                <Select
                  name="billId"
                  value={formData.billId}
                  onChange={handleChange}
                >
                  <option value="">Select Bill</option>

                  {billOptions.map((bill) => (
                    <option key={bill.id} value={bill.id}>
                      {getBillNumber(bill)}
                      {formatMoney(getBillTotal(bill))
                        ? ` - ${formatMoney(getBillTotal(bill))}`
                        : ""}
                    </option>
                  ))}
                </Select>
              )}
            </FormGroup>

            {/* BILL TOTAL */}
            <FormGroup>
              <Label>Bill Total</Label>

              <Input
                type="text"
                value={formatMoney(shown.billTotal)}
                placeholder="SAR 0.00"
                readOnly
              />
            </FormGroup>

            {/* ALREADY PAID */}
            <FormGroup>
              <Label>Already Paid</Label>

              <Input
                type="text"
                value={formatMoney(shown.alreadyPaid)}
                placeholder="SAR 0.00"
                readOnly
              />
            </FormGroup>

            {/* BALANCE DUE */}
            <FormGroup>
              <Label>Balance Due</Label>

              <Input
                type="text"
                value={formatMoney(shown.balanceDue)}
                placeholder="SAR 0.00"
                readOnly
                style={{ color: "#ef4444" }}
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
                disabled={isView}
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
                disabled={isView}
              >
                <option value="Full Payment">Full Payment</option>
                <option value="Partial Payment">Partial Payment</option>
                <option value="Advance Payment">Advance Payment</option>
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
                disabled={isView}
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
                <option value="Online Payment">Online Payment</option>
                <option value="Cash">Cash</option>
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
                readOnly={isView}
              />
            </FormGroup>

            {/* REFERENCE */}
            <FormGroup>
              <Label>Reference / Txn No.(Optional)</Label>

              <Input
                type="text"
                name="referenceNumber"
                value={formData.referenceNumber}
                onChange={handleChange}
                readOnly={isView}
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
                readOnly={isView}
              />
            </FormGroup>

            {/* ACCOUNT HOLDER */}
            <FormGroup>
              <Label>Account Holder</Label>

              <Input
                type="text"
                name="accountHolder"
                value={formData.accountHolder}
                onChange={handleChange}
                readOnly={isView}
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
                readOnly={isView}
              />
            </FormGroup>

            {/* NOTES */}
            <FormGroup>
              <Label>Notes</Label>

              <Input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                readOnly={isView}
              />
            </FormGroup>
            {isView && (
              <>
                <FormGroup>
                  <Label>Payment No</Label>

                  <Input
                    type="text"
                    value={
                      initialData?.payment_no ||
                      initialData?.payment_number ||
                      initialData?.id ||
                      ""
                    }
                    readOnly
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Status</Label>

                  <Input
                    type="text"
                    value={
                      initialData?.status ? formatChoice(initialData.status) : ""
                    }
                    readOnly
                  />
                </FormGroup>
              </>
            )}
          </FormGrid>

          {shownError && (
            <div
              style={{
                color: "#dc2626",
                marginTop: "10px",
                fontSize: "13px",
              }}
            >
              {shownError}
            </div>
          )}

          <ButtonWrapper>
            <CancelButton type="button" onClick={onClose} disabled={submitting}>
              {isView ? "CLOSE" : "CANCEL"}
            </CancelButton>

            {!isView && (
              <SaveButton type="submit" disabled={submitting}>
                <FiSave size={15} />

                {submitting ? "RECORDING..." : "RECORD PAYMENT"}
              </SaveButton>
            )}
          </ButtonWrapper>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default PaymentModal;