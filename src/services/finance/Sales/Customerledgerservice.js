import API from "../../api";

// GET: /api/finance/ledger/
export const fetchLedgerEntries = async (params = {}) => {
    const response = await API.get("/finance/ledger/", { params });
    return response.data;
};

// POST: /api/finance/ledger/
// Body: { customer, transaction_date, reference_number, description, mode: "debit" | "credit", amount }
export const createLedgerEntry = async (payload) => {
    const response = await API.post("/finance/ledger/", payload);
    return response.data;
};

// GET: /api/finance/ledger/customer/{customer_id}/
export const fetchCustomerLedgerEntries = async (customerId, params = {}) => {
    const response = await API.get(
        `/finance/ledger/customer/${customerId}/`,
        { params }
    );
    return response.data;
};

// GET: /api/finance/ledger/summary/?customer_id=4  (single-customer summary)
export const fetchLedgerSummary = async (params = {}) => {
    const response = await API.get("/finance/ledger/summary/", { params });
    return response.data;
};

// GET: /api/finance/ledger/dashboard-summary/  (aggregate stats for the cards)
export const fetchDashboardSummary = async (params = {}) => {
    const response = await API.get("/finance/ledger/dashboard-summary/", {
        params,
    });
    return response.data;
};

// GET: /api/finance/ledger/customer-summary/  (customer-wise summary table)
export const fetchCustomerWiseSummary = async (params = {}) => {
    const response = await API.get("/finance/ledger/customer-summary/", {
        params,
    });
    return response.data;
};