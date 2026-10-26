const toNumberOrNull = (value) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
};

const normalizeChoice = (value) => {
  if (!value) {
    return "";
  }

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
};

export const normalizePurchasePaymentPayload = (formData = {}) => {
  const vendorId =
    formData.vendorId ??
    formData.vendor_id ??
    formData.vendor;

  const billId =
    formData.billId ??
    formData.bill_id ??
    formData.bill;

  return {
    vendor:
      vendorId === "" ||
        vendorId === null ||
        vendorId === undefined
        ? null
        : Number(vendorId),

    vendor_id:
      vendorId === "" ||
        vendorId === null ||
        vendorId === undefined
        ? null
        : Number(vendorId),

    bill:
      billId === "" ||
        billId === null ||
        billId === undefined
        ? null
        : Number(billId),

    bill_id:
      billId === "" ||
        billId === null ||
        billId === undefined
        ? null
        : Number(billId),

    payment_date: formData.paymentDate || null,

    payment_type: normalizeChoice(formData.paymentType),

    payment_method: normalizeChoice(formData.paymentMethod),

    amount:
      toNumberOrNull(formData.amount) ??
      toNumberOrNull(formData.amountReceived),

    amount_received:
      toNumberOrNull(formData.amount) ??
      toNumberOrNull(formData.amountReceived),

    bill_total: toNumberOrNull(formData.billTotal),

    already_paid: toNumberOrNull(formData.alreadyPaid),

    balance_due: toNumberOrNull(formData.balanceDue),

    reference_number:
      String(formData.referenceNumber || "").trim(),

    bank_name:
      String(formData.bankName || "").trim(),

    account_holder:
      String(formData.accountHolder || "").trim(),

    iban:
      String(formData.iban || "").trim(),

    notes:
      String(formData.notes || "").trim(),
  };
};