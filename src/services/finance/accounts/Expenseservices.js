// src/services/finance/accounts/Expenseservices.js
import API from "../../api";

// List + KPI cards + pagination
// params: { search, category, status, date_from, date_to, page, page_size }
export const fetchExpenses = async (params = {}) => {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== "" && v !== null && v !== undefined
    )
  );

  const response = await API.get("/finance/expenses/", { params: cleaned });

  return response.data;
};

export const fetchExpenseById = async (id) => {
  const response = await API.get(`/finance/expenses/${id}/`);

  return response.data;
};

export const createExpenseApi = async (payload) => {
  const response = await API.post("/finance/expenses/", payload);

  return response.data;
};

// Full update (PUT)
export const updateExpenseApi = async (id, payload) => {
  const response = await API.put(`/finance/expenses/${id}/`, payload);

  return response.data;
};

// Partial update (PATCH)
export const patchExpenseApi = async (id, payload) => {
  const response = await API.patch(`/finance/expenses/${id}/`, payload);

  return response.data;
};

export const markExpenseUnpaidApi = async (id) => {
  const response = await API.patch(`/finance/expenses/${id}/`, {
    status: "unpaid",
  });

  return response.data;
};

export const deleteExpenseApi = async (id) => {
  await API.delete(`/finance/expenses/${id}/`);

  return id;
};

// Dropdown: active bank accounts
export const fetchActiveBankAccounts = async () => {
  const response = await API.get("/finance/banking/accounts/", {
    params: { status: "active", page_size: 100 },
  });

  return response.data;
};