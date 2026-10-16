import API from "../../api";

export const fetchPayables = async (params = {}) => {
  const response = await API.get("/finance/accounts-payable/", { params });

  return response.data;
};