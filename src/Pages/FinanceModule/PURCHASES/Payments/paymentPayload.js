const toNumberOrNull = (value) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
};

// "Full Payment" -> "full_payment"
const normalizeChoice = (value) => {
  if (!value) {
    return "";
  }

  return String(value).trim().toLowerCase().replace(/\s+/g, "_");
};

/**
 * Maps the modal form data to the backend contract:
 * POST /api/finance/vendor/payments/
 */
export const normalizePurchasePaymentPayload = (formData = {}) => {
  const amount = toNumberOrNull(formData.amount);

  return {
    vendor: toNumberOrNull(formData.vendorId),
    bill: toNumberOrNull(formData.billId),

    payment_date: formData.paymentDate || null,
    payment_type: normalizeChoice(formData.paymentType),
    payment_method: normalizeChoice(formData.paymentMethod),

    amount_paid: amount === null ? null : amount.toFixed(2),

    reference_number: String(formData.referenceNumber || "").trim(),

    // only keep these three if your serializer exposes them
    bank_name: String(formData.bankName || "").trim(),
    account_holder: String(formData.accountHolder || "").trim(),
    iban: String(formData.iban || "").trim(),

    notes: String(formData.notes || "").trim(),

    status: "completed",
  };
};