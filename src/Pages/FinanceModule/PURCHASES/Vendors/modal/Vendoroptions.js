// Dropdown options shared by the filters and the Add Vendor modal.
// Only the values seen in your API examples are certain
// (equipment, telecom, 30_days, AED, active/inactive) — add the rest
// to match what your backend accepts.

// Filter dropdown (plain strings; lower-cased before sending to the API)
export const STATUS_OPTIONS = ["Active", "Inactive"];

// Modal dropdown ({ label, value })
export const CLIENT_STATUS_OPTIONS = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
];

export const VENDOR_TYPE_OPTIONS = [
    { label: "Equipment", value: "equipment" },
    { label: "Telecom", value: "telecom" },
];

export const PAYMENT_TERM_OPTIONS = [
    { label: "15 Days", value: "15_days" },
    { label: "30 Days", value: "30_days" },
    { label: "45 Days", value: "45_days" },
    { label: "60 Days", value: "60_days" },
];

export const CURRENCY_OPTIONS = [
    { label: "AED", value: "AED" },
    { label: "SAR", value: "SAR" },
    { label: "USD", value: "USD" },
    { label: "INR", value: "INR" },
];