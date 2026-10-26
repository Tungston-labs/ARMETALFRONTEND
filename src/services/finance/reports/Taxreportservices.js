import API from "../../api";

// params: {
//   start_date, end_date, chart_year,
//   invoice_type, customer, vendor, tax_type, tax_status,
//   page, page_size
// }
export const fetchTaxReport = async (params = {}) => {
  // Don't send empty filters to the API
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== "" && v !== null && v !== undefined
    )
  );

  const response = await API.get("/finance/reports/tax/", { params: cleaned });

  return response.data;
};