
import API from "../../api";

export const fetchReceivables = async (params = {}) => {
  const response = await API.get("/finance/account-receivable/", { params });

  return response.data;
};