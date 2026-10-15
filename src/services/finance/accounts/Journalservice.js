import API from "../../api";

const BASE_URL = "/finance/journal/";

// params: date_from, date_to, source, status, search, ordering, page, company
export const fetchJournalEntries = async (params = {}) => {
  const response = await API.get(BASE_URL, { params });

  return response.data;
};

export const fetchJournalEntryById = async (id) => {
  const response = await API.get(`${BASE_URL}${id}/`);

  return response.data;
};

export const createJournalEntryApi = async (payload) => {
  const response = await API.post(BASE_URL, payload);

  return response.data;
};

export const updateJournalEntryApi = async (id, payload) => {
  const response = await API.patch(`${BASE_URL}${id}/`, payload);

  return response.data;
};

export const postJournalEntryApi = async (id) => {
  const response = await API.post(`${BASE_URL}${id}/post/`);

  return response.data;
};

export const voidJournalEntryApi = async (id) => {
  const response = await API.post(`${BASE_URL}${id}/void/`);

  return response.data;
};

export const deleteJournalEntryApi = async (id) => {
  await API.delete(`${BASE_URL}${id}/`);

  return id;
};