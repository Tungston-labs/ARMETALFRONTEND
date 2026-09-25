import API from "./api";

const quotationPath = "/finance/quotation";

export const listQuotationService = async (params = {}) => {
  const response = await API.get(`${quotationPath}/`, { params });
  return response.data;
};

export const createQuotationService = async (data) => {
  const response = await API.post(`${quotationPath}/`, data);
  return response.data;
};

export const getQuotationService = async (id) => {
  const response = await API.get(`${quotationPath}/${id}/`);
  return response.data;
};

export const getQuotationById = getQuotationService;

export const updateQuotationService = async (id, data, partial = false) => {
  const response = await API.request({
    method: partial ? "PATCH" : "PUT",
    url: `${quotationPath}/${id}/`,
    data,
  });
  return response.data;
};

export const patchQuotationService = async (id, data) => {
  const response = await API.patch(`${quotationPath}/${id}/`, data);
  return response.data;
};

export const deleteQuotationService = async (id) => {
  const response = await API.delete(`${quotationPath}/${id}/`);
  return response.data;
};

export const deleteQuotationById = deleteQuotationService;

export const convertQuotationService = async (id) => {
  const response = await API.post(`${quotationPath}/${id}/convert-so/`);
  return response.data;
};

export const convertQuotationToSalesOrder = convertQuotationService;

export const quotationKpiService = async (params = {}) => {
  const response = await API.get(`${quotationPath}/kpi/`, { params });
  return response.data;
};

export const getQuotationKPI = quotationKpiService;

export const getQuotationSummary = async (params = {}) => {
  const response = await API.get(`${quotationPath}/summary/`, { params });
  return response.data;
};
