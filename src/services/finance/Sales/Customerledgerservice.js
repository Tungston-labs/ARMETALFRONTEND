import API from "../../api";

// GET: /api/finance/ledger/
export const fetchLedgerEntries = async (params = {}) => {
    const response = await API.get("/finance/ledger/", { params });
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

// GET: /api/finance/ledger/summary/  (per-customer, requires customer_id — not used on this page)
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
