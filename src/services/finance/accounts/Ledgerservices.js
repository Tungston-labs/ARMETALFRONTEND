// services/finance/Ledger/ledgerServices.js

import API from "../../api";

// =====================================================
// GET ALL LEDGER ENTRIES
// params: { page, page_size, search, ordering, transaction_type, from_date, to_date }
// Returns paginated: { total_items, total_pages, current_page, next, previous, results }
// =====================================================
export const fetchLedgerEntries = async (params = {}) => {
  const response = await API.get("/finance/ledger/", { params });

  return response.data;
};

// =====================================================
// GET CUSTOMER LEDGER
// params: { from_date, to_date, transaction_type, search, page, page_size, ordering }
// Returns paginated
// =====================================================
export const fetchCustomerLedger = async (customerId, params = {}) => {
  const response = await API.get(
    `/finance/ledger/customer/${customerId}/`,
    { params }
  );

  return response.data;
};

// =====================================================
// GET CUSTOMER LEDGER SUMMARY
// params: { from_date, to_date }
// Backend returns: { message, data: { customer_id, customer_code, customer_name,
//                    opening_balance, total_debit, total_credit, closing_balance } }
// =====================================================
export const fetchCustomerLedgerSummary = async (customerId, params = {}) => {
  const response = await API.get("/finance/ledger/summary/", {
    params: { customer_id: customerId, ...params },
  });

  return response.data.data;
};

// =====================================================
// CREATE LEDGER ENTRY (manual debit / credit)
// body: { customer, transaction_date, reference_number, description, mode, amount }
// mode: "debit" | "credit"
// =====================================================
export const createLedgerEntry = async (ledgerData) => {
  const response = await API.post("/finance/ledger/", ledgerData);

  return response.data.data || response.data;
};

// =====================================================
// CUSTOMER WISE SUMMARY
// Returns paginated: results = [{ customer_code, customer_name, total_invoice,
//                    total_payment, credit_note, overdue, outstanding }]
// =====================================================
export const fetchCustomerWiseSummary = async (params = {}) => {
  const response = await API.get("/finance/ledger/customer-summary/", { params });

  return response.data;
};

// =====================================================
// DASHBOARD SUMMARY (cards)
// Backend returns: { message, data: { total_receivable, total_invoice,
//                    total_collection, total_credit, overdue_amount } }
// =====================================================
export const fetchDashboardSummary = async () => {
  const response = await API.get("/finance/ledger/dashboard-summary/");

  return response.data.data;
};