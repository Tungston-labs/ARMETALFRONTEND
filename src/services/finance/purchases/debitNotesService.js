import API from "../../api";

export const fetchDebitNotes = async (params = {}) => {
    const response = await API.get("/finance/debit-notes/", {
        params,
    });

    return response.data;
};

// GET: /finance/debit-notes/:id/
export const fetchDebitNoteById = async (id) => {
    const response = await API.get(`/finance/debit-notes/${id}/`);

    return response.data;
};

// POST: /finance/debit-notes/
export const createDebitNote = async (payload) => {
    const response = await API.post(
        "/finance/debit-notes/",
        payload
    );

    return response.data;
};

// PUT: /finance/debit-notes/:id/
export const updateDebitNote = async (id, payload) => {
    const response = await API.put(
        `/finance/debit-notes/${id}/`,
        payload
    );

    return response.data;
};

// PATCH: /finance/debit-notes/:id/
export const patchDebitNote = async (id, payload) => {
    const response = await API.patch(
        `/finance/debit-notes/${id}/`,
        payload
    );

    return response.data;
};

// DELETE: /finance/debit-notes/:id/
export const deleteDebitNote = async (id) => {
    const response = await API.delete(
        `/finance/debit-notes/${id}/`
    );

    return response.data;
};

// ==========================================
// BILL DETAILS
// ==========================================

// GET: /finance/debit-notes/bill-details/
// Params: bill_id
//
// Example:
// fetchBillDebitDetails({ bill_id: 323456 })
//
// Calls:
// /api/finance/debit-notes/bill-details/?bill_id=323456
export const fetchBillDebitDetails = async (params = {}) => {
    const response = await API.get(
        "/finance/debit-notes/bill-details/",
        {
            params,
        }
    );

    return response.data;
};

// ==========================================
// EXPORT
// ==========================================

// GET: /finance/debit-notes/export/
export const exportDebitNotes = async (params = {}) => {
    const response = await API.get(
        "/finance/debit-notes/export/",
        {
            params,
            responseType: "blob",
        }
    );

    return response.data;
};

// ==========================================
// KPI
// ==========================================

// GET: /finance/debit-notes/kpi/
export const fetchDebitNoteKpi = async (params = {}) => {
    const response = await API.get(
        "/finance/debit-notes/kpi/",
        {
            params,
        }
    );

    return response.data;
};