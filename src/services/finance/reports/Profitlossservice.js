import API from "../../api";

export const fetchProfitLossReport = async (params = {}) => {
  const response = await API.get("/finance/reports/profit-loss/", { params });

  return response.data;
};