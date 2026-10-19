// services/finance/reports/SalesReportService.js
import API from "../../api";

const ENDPOINT = "/finance/sales-report/";

// Remove empty values so they never reach the query string
const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) =>
        value !== "" && value !== null && value !== undefined && value !== "all"
    )
  );

const getFilename = (headers) => {
  const disposition = headers?.["content-disposition"] || "";
  const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  return match ? decodeURIComponent(match[1]) : "sales-report.csv";
};

// params: { date_from, date_to, customer, category, status, year, page }
export const fetchSalesReport = async (params = {}) => {
  const response = await API.get(ENDPOINT, { params: cleanParams(params) });

  return response.data;
};

// Same filters as the table, without page / year
export const exportSalesReportCsv = async (params = {}) => {
  // eslint-disable-next-line no-unused-vars
  const { page, year, ...filters } = params;

  const response = await API.get(ENDPOINT, {
    params: { ...cleanParams(filters), export: "excel" },
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

  window.URL.revokeObjectURL(url);
};