import API from "../../api";

const BASE = "/finance/journal/";

// GET /finance/journal/?search=&status=&source=&date_from=&date_to=&ordering=&page=&company=
export const fetchJournalEntries = async (params = {}) => {
  const response = await API.get(BASE, { params });

  return response.data;
};

// GET /finance/journal/:id/
export const fetchJournalEntryById = async (id) => {
  const response = await API.get(`${BASE}${id}/`);

  return response.data;
};

// POST /finance/journal/   (creates a draft)
export const createJournalEntry = async (data) => {
  const response = await API.post(BASE, data);

  return response.data;
};

// PATCH /finance/journal/:id/   (draft entries only)
export const updateJournalEntry = async (id, data) => {
  const response = await API.patch(`${BASE}${id}/`, data);

  return response.data;
};

// POST /finance/journal/:id/post/
export const postJournalEntryById = async (id) => {
  const response = await API.post(`${BASE}${id}/post/`);

  return response.data;
};

// POST /finance/journal/:id/void/   (posted entries only)
export const voidJournalEntryById = async (id) => {
  const response = await API.post(`${BASE}${id}/void/`);

  return response.data;
};

// DELETE /finance/journal/:id/   (draft entries only)
export const deleteJournalEntryById = async (id) => {
  const response = await API.delete(`${BASE}${id}/`);

  return response.data;
};