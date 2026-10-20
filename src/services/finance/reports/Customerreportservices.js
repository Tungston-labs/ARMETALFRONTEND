import API from "../../api";

export const fetchCustomerReport = async (params = {}) => {
  const response = await API.get("/finance/reports/customer/", { params });

  return response.data;
};