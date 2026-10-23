export const formatCurrency = (amount, currencyCode = "INR") => {
  const value = Number(amount) || 0;

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
    }).format(value);
  } catch (err) {

    console.error("Invalid currency code:", currencyCode, err);
    return `${currencyCode} ${value.toFixed(2)}`;
  }
};