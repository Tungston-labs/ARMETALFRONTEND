import API from "../../api";

// GET: /api/finance/ledger/
export const fetchLedgerEntries = async (params = {}) => {
    const response = await API.get(
        "/finance/ledger/",
        { params }
    );

    return response.data;
};

// GET: /api/finance/ledger/customer/{customer_id}/
export const fetchCustomerLedgerEntries = async (
    customerId,
    params = {}
) => {
    const response = await API.get(
        `/finance/ledger/customer/${customerId}/`,
        { params }
    );

    return response.data;
};

// GET: /api/finance/ledger/summary/
export const fetchLedgerSummary = async (params = {}) => {
    const response = await API.get(
        "/finance/ledger/summary/",
        { params }
    );

    return response.data;
};