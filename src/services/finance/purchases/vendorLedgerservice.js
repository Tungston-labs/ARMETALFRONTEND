import API from "../../api";
const BASE_URL = "/finance/vendor-ledger/";

// Remove empty filters so they are not sent as ?search=&status=...
const cleanParams = (params = {}) =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== "" && value !== null && value !== undefined
    )
  );

// If the entry has a File attachment, send multipart/form-data.
// Otherwise send normal JSON.
const buildBody = (data = {}) => {
  if (data.attachment instanceof File) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });
    return formData;
  }

  // don't send attachment: null / undefined in JSON
  const { attachment, ...rest } = data;
  return rest;
};

// LIST (with search, filters, pagination)
export const listVendorLedgerService = async ({
  page = 1,
  pageSize = 20,
  search = "",
  vendor = "",
  transaction_type = "",
  status = "",
  date_from = "",
  date_to = "",
} = {}) => {
  const response = await API.get(BASE_URL, {
    params: cleanParams({
      page,
      page_size: pageSize,
      search,
      vendor,
      transaction_type,
      status,
        date_from,
      date_to,
    }),
  });
  return response.data;
};

// GET ONE
export const getVendorLedgerService = async (id) => {
  const response = await API.get(`${BASE_URL}${id}/`);
  return response.data;
};

// CREATE
export const createVendorLedgerService = async (data) => {
  const response = await API.post(BASE_URL, buildBody(data));
  return response.data;
};

// FULL UPDATE (PUT)
export const updateVendorLedgerService = async (id, data) => {
  const response = await API.put(`${BASE_URL}${id}/`, buildBody(data));
  return response.data;
};

// PARTIAL UPDATE (PATCH)
export const patchVendorLedgerService = async (id, data) => {
  const response = await API.patch(`${BASE_URL}${id}/`, buildBody(data));
  return response.data;
};

// DELETE
export const deleteVendorLedgerService = async (id) => {
  await API.delete(`${BASE_URL}${id}/`);
  return id;
};

export const getVendorLedgerSummaryService = async ({
  search = "",
  transaction_type = "",
  status = "",
  date_from = "",
  date_to = "",
} = {}) => {
  const response = await API.get(`${BASE_URL}summary/`, {
    params: cleanParams({ search, transaction_type, status, date_from, date_to }),
  });
  return response.data;
};