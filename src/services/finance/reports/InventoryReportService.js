// services/finance/reports/InventoryReportService.js
import API from "../../api";

const ENDPOINT = "/finance/reports/inventory/";

// Remove empty and default filter values.
const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) =>
        value !== "" &&
        value !== null &&
        value !== undefined &&
        value !== "all",
    ),
  );

const getFilename = (headers) => {
  const disposition = headers?.["content-disposition"] || "";

  const encodedMatch = disposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);

  if (encodedMatch) {
    try {
      return decodeURIComponent(encodedMatch[1].trim().replace(/^"|"$/g, ""));
    } catch {
      // Fall through to the regular filename.
    }
  }

  const match = disposition.match(/filename\s*=\s*"?([^";]+)"?/i);

  return match?.[1]?.trim() || "inventory-report.csv";
};

// Supported parameters must match your Django view.
// Example: { page: 1, page_size: 10, status: "low_stock" }
export const fetchInventoryReport = async (params = {}) => {
  const response = await API.get(ENDPOINT, {
    params: cleanParams(params),
  });

  return response.data;
};

// Export filtered inventory records as CSV.
// The backend must support export=csv for this function to work.
export const exportInventoryReportCsv = async (params = {}) => {
  const { page, page_size, ...filters } = params;

  const response = await API.get(ENDPOINT, {
    params: {
      ...cleanParams(filters),
      export: "csv",
    },
    responseType: "blob",
  });

  return {
    blob: response.data,
    filename: getFilename(response.headers),
  };
};

export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Revoke after the browser has had a chance to start the download.
  window.setTimeout(() => {
    window.URL.revokeObjectURL(url);
  }, 1000);
};

export default {
  fetchInventoryReport,
  exportInventoryReportCsv,
  downloadBlob,
};
