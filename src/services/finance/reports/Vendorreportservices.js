import API from "../../api";

export const fetchVendorReport = async (params = {}) => {
  const response = await API.get("/finance/reports/vendor/", { params });

  return response.data;
};