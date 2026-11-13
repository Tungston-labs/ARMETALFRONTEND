import { COUNTRY_OPTIONS } from "../../../../../utils/countryData";

const capitalize = (v) =>
  v ? String(v).charAt(0).toUpperCase() + String(v).slice(1) : "";

const WAREHOUSE_TYPE_KEYS = new Set([
  "main",
  "distribution",
  "regional",
  "service",
  "spare_parts",
  "other",
]);

const normalizeWarehouseType = (value) => {
  const raw = String(value || "main")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
  return WAREHOUSE_TYPE_KEYS.has(raw) ? raw : "main";
};

/* Modal form -> API payload (field names match the Warehouse model) */
export const buildWarehousePayload = (form) => ({
  code: (form.warehouseCode || "").trim(), // blank = backend auto-generates
  warehouse_name: (form.warehouseName || "").trim(),
  warehouse_type: normalizeWarehouseType(form.warehouseType),
  manager: (form.manager || "").trim(),
  status: String(form.status || "active").trim().toLowerCase(),
  operating_since: form.operatingSince ? form.operatingSince : null,
  country: (form.country || "").trim(),
  city: (form.city || "").trim(),
  address_line_1: (form.addressLine1 || "").trim(),
  address_line_2: (form.addressLine2 || "").trim(),
  postal_code: (form.postalCode || "").trim(),
  phone_number: (form.phoneNumber || "").trim(),
  email: (form.email || "").trim(),
  storage_capacity:
    form.storageCapacity === "" || form.storageCapacity == null
      ? ""
      : String(form.storageCapacity).trim(),
  notes: (form.notes || "").trim(),
});

/* API record -> modal form values */
export const mapWarehouseToForm = (d = {}) => {
  const country = COUNTRY_OPTIONS.find(
    (c) =>
      c.name.toLowerCase() === String(d.country || "").trim().toLowerCase() ||
      c.code.toLowerCase() === String(d.country || "").trim().toLowerCase(),
  );

  return {
    warehouseCode: d.code || d.warehouse_code || "",
    warehouseName: d.warehouse_name || "",
    warehouseType: normalizeWarehouseType(d.warehouse_type),
    manager:
      (typeof d.manager === "string" ? d.manager : "") || d.manager_name || "",
    status: String(d.status || "active").toLowerCase() === "inactive"
      ? "inactive"
      : "active",
    operatingSince: String(d.operating_since || "").slice(0, 10),
    country: country?.code || d.country || "",
    city: d.city || "",
    addressLine1: d.address_line_1 || "",
    addressLine2: d.address_line_2 || "",
    postalCode: d.postal_code || "",
    phoneNumber: d.phone_number || "",
    email: d.email || "",
    storageCapacity: d.storage_capacity ?? "",
    notes: d.notes || "",
    _statusLabel: capitalize(d.status),
  };
};

export const formatApiError = (err) => {
  if (!err) return "";
  if (typeof err === "string") return err;
  if (err.detail) return err.detail;
  return Object.entries(err)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
    .join(" | ");
};
