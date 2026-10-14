// services/finance/Accounting/accountingServices.js
import API from "../../api";

// =====================================================
// GET ALL (chart of accounts, grouped by type)
// Supports params: search, account_type, status
// Backend returns: { count, totals, sections: { asset, liability, equity, revenue, expense } }
// This shape is flat (no "message"/"data" wrapper), so return as-is.
// =====================================================
export const fetchAccounts = async (params = {}) => {
  const response = await API.get("/finance/accounting/", { params });
  return response.data;
};

// =====================================================
// SEARCH BY ACCOUNT NAME OR CODE
// GET /finance/accounting/?search=bank   |   ?search=1200
// =====================================================
export const searchAccounts = async (search) => {
  const response = await API.get("/finance/accounting/", {
    params: { search },
  });

  return response.data;
};

// =====================================================
// FILTER BY ACCOUNT TYPE
// accountType: asset | liability | equity | revenue | expense
// GET /finance/accounting/?account_type=asset
// =====================================================
export const fetchAccountsByType = async (accountType, extraParams = {}) => {
  const response = await API.get("/finance/accounting/", {
    params: { account_type: accountType, ...extraParams },
  });

  return response.data;
};

// =====================================================
// FILTER BY STATUS
// status: active | inactive
// GET /finance/accounting/?status=active
// =====================================================
export const fetchAccountsByStatus = async (status, extraParams = {}) => {
  const response = await API.get("/finance/accounting/", {
    params: { status, ...extraParams },
  });

  return response.data;
};

// =====================================================
// COMBINED FILTER (search + type + status)
// GET /finance/accounting/?account_type=asset&status=active&search=bank
// Empty values are skipped, so you can pass any combination.
// =====================================================
export const fetchFilteredAccounts = async ({
  search = "",
  accountType = "",
  status = "",
} = {}) => {
  const params = {};

  if (search) params.search = search;
  if (accountType) params.account_type = accountType;
  if (status) params.status = status;

  const response = await API.get("/finance/accounting/", { params });

  return response.data;
};

// =====================================================
// CREATE
// Backend returns: {...account} (flat, no wrapper)
// =====================================================
export const createAccount = async (accountData) => {
  const response = await API.post(
    "/finance/accounting/",
    accountData
  );

  return response.data;
};

// =====================================================
// GET BY ID
// Backend returns: {...account}
// =====================================================
export const fetchAccountById = async (id) => {
  const response = await API.get(
    `/finance/accounting/${id}/`
  );

  return response.data;
};

// =====================================================
// PUT
// Backend returns: {...account}
// =====================================================
export const updateAccount = async (id, accountData) => {
  const response = await API.put(
    `/finance/accounting/${id}/`,
    accountData
  );

  return response.data;
};

// =====================================================
// PATCH
// Backend returns: {...account}
// =====================================================
export const patchAccount = async (id, accountData) => {
  const response = await API.patch(
    `/finance/accounting/${id}/`,
    accountData
  );

  return response.data;
};

// =====================================================
// DELETE
// Backend returns: empty (204) or { message }
// =====================================================
export const deleteAccount = async (id) => {
  const response = await API.delete(
    `/finance/accounting/${id}/`
  );

  return response.data;
};

// =====================================================
// GET KPI
// Backend returns: {
//   total_accounts, active_accounts, asset_accounts,
//   liability_accounts, equity_accounts
// }
// =====================================================
export const fetchAccountKpi = async () => {
  const response = await API.get(
    "/finance/accounting/kpi/"
  );

  return response.data;
};