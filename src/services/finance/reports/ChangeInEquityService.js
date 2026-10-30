import api from "../../api";

const BASE_URL = "/finance/reports/changes-in-equity/";

const buildParams = (filters = {}) => {
  const params = {};
  if (filters.company_pk) params.company_pk = filters.company_pk;
  if (filters.start_date) params.start_date = filters.start_date;
  if (filters.end_date) params.end_date = filters.end_date;
  if (filters.year) params.year = filters.year;
  return params;
};

export const fetchChangesInEquityReport = async (filters) => {
  const response = await api.get(BASE_URL, { params: buildParams(filters) });
  return response.data;
};

export const exportChangesInEquityReport = async (filters) => {
  const response = await api.get(`${BASE_URL}export/`, {
    params: buildParams(filters),
    responseType: "blob",
  });
  return response;
};
