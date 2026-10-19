import API from "../../api";

// GET /finance/trial-balance/dashboard/?date_from=&date_to=
export const fetchTrialBalanceDashboard = async (params = {}) => {
  const response = await API.get("/finance/trial-balance/dashboard/", {
    params,
  });

  return response.data;
};

// GET /finance/trial-balance/?search=&type=&date_from=&date_to=&page=&page_size=
export const fetchTrialBalance = async (params = {}) => {
  const response = await API.get("/finance/trial-balance/", { params });

  return response.data;
};