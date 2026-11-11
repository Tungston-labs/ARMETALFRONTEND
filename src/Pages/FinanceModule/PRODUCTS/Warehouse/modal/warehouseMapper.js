import { COUNTRY_OPTIONS, getStateByName } from "../../../../../utils/countryData";

const capitalize = (v) =>
  v ? String(v).charAt(0).toUpperCase() + String(v).slice(1) : "";

/* Modal form -> API payload (field names match the Warehouse model) */
export const buildWarehousePayload = (form) => ({
  code: form.warehouseCode || "", // blank = backend generates it
  warehouse_name: form.warehouseName,
  warehouse_type: String(form.warehouseType || "main").toLowerCase(),
  manager: form.manager || "",
  status: String(form.status || "active").toLowerCase(),
  operating_since: form.operatingSince || null,
  country: form.country || "",
  city: form.city || "",
  address_line_1: form.addressLine1 || "",
  address_line_2: form.addressLine2 || "",
  postal_code: form.postalCode || "",
  phone_number: form.phoneNumber || "",
  email: form.email || "",
  storage_capacity:
    form.storageCapacity === "" || form.storageCapacity == null
      ? ""
      : String(form.storageCapacity),
  notes: form.notes || "",
});

/* API record -> modal form values */
export const mapWarehouseToForm = (d = {}) => {
  const country = COUNTRY_OPTIONS.find(
    (c) => c.name === d.country || c.code === d.country,
  );
  const countryCode = country?.code || "";
  const stateObj = countryCode ? getStateByName(countryCode, d.state) : null;

  return {
    warehouseCode: d.code || d.warehouse_code || "",
    warehouseName: d.warehouse_name || "",
    warehouseType: d.warehouse_type || "main",
    manager: d.manager_name || (typeof d.manager === "string" ? d.manager : ""),
    status: capitalize(d.status) || "Active",
    operatingSince: String(d.operating_since || "").slice(0, 10),
    country: countryCode,
    state: stateObj?.isoCode || d.state || "",
    city: d.city || "",
    addressLine1: d.address_line_1 || "",
    addressLine2: d.address_line_2 || "",
    postalCode: d.postal_code || "",
    phoneNumber: d.phone_number || "",
    email: d.email || "",
    storageCapacity: d.storage_capacity ?? "",
    notes: d.notes || "",
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