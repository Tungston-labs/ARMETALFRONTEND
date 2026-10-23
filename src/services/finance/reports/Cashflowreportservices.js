import API from "../../api";

// params: { date_from, date_to, search, bank_account_id }
export const fetchCashFlowReport = async (params = {}) => {
  const response = await API.get("/finance/reports/cash-flow/", { params });

  return response.data;
};