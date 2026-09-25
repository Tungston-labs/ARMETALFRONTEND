export const normalizePaymentPayload = (formData = {}) => {
  const rawCustomerId =
    formData.customerId ??
    formData.customer_id ??
    formData.customer;

  const parsedCustomerId =
    rawCustomerId === "" || rawCustomerId === null || rawCustomerId === undefined
      ? null
      : Number(rawCustomerId);

  const customerName = String(
    formData.customerName || formData.customer || "",
  ).trim();

  const customerValue =
    Number.isFinite(parsedCustomerId) && parsedCustomerId !== null
      ? parsedCustomerId
      : customerName || null;

  return {
    customer: customerValue,
    customer_id: Number.isFinite(parsedCustomerId) ? parsedCustomerId : null,
    customer_name: customerName,
    invoice_no: formData.invoiceNo,
    invoice_amount:
      formData.invoiceAmount === "" ? null : Number(formData.invoiceAmount),
    outstanding_amount:
      formData.outstandingAmount === "" ? null : Number(formData.outstandingAmount),
    payment_date: formData.paymentDate,
    payment_type: String(formData.paymentType)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_"),
    payment_method: String(formData.paymentMethod)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_"),
    amount_received:
      formData.amountReceived === "" ? null : Number(formData.amountReceived),
    reference_number: formData.referenceNumber || "",
    notes: formData.notes || "",
  };
};
