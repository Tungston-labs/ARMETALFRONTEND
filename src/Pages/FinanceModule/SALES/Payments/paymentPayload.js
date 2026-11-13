const toNumberOrNull = (value) =>
  value === "" || value === null || value === undefined
    ? null
    : Number(value);

const toSnake = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");

export const normalizePaymentPayload = (formData = {}) => {
  const rawCustomerId =
    formData.customerId ?? formData.customer_id ?? formData.customer;

  const parsedCustomerId =
    rawCustomerId === "" ||
    rawCustomerId === null ||
    rawCustomerId === undefined
      ? null
      : Number(rawCustomerId);

  const customerName = String(
    formData.customerName || formData.customer || "",
  ).trim();

  const customerValue =
    Number.isFinite(parsedCustomerId) && parsedCustomerId !== null
      ? parsedCustomerId
      : customerName || null;

  const paymentCategory = toSnake(formData.paymentCategory); // invoice_ref | opening_balance
  const isInvoice = paymentCategory === "invoice_ref";

  return {
    customer: customerValue,
    customer_id: Number.isFinite(parsedCustomerId) ? parsedCustomerId : null,
    customer_name: customerName,

    payment_category: paymentCategory,
    invoice: isInvoice ? toNumberOrNull(formData.invoiceId) : null,
    invoice_no: isInvoice ? formData.invoiceNo || "" : "",

    invoice_amount: toNumberOrNull(formData.invoiceAmount),
    outstanding_amount: toNumberOrNull(formData.outstandingAmount),
    payment_date: formData.paymentDate,
    payment_type: toSnake(formData.paymentType),
    payment_method: toSnake(formData.paymentMethod),
    amount_received: toNumberOrNull(formData.amountReceived),
    reference_number: formData.referenceNumber || "",
    notes: formData.notes || "",
  };
};