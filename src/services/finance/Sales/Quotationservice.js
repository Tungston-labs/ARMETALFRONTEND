import API from "../../api";

// GET: /api/finance/quotation/
// params: page, search, status, customer, issue_date, valid_till, ordering, company
export const fetchQuotations = async (params = {}) => {
    const response = await API.get(
        "/finance/quotation/",
        { params }
    );

    return response.data;
};

// GET: /api/finance/quotation/{id}/
export const fetchQuotationById = async (id) => {
    const response = await API.get(
        `/finance/quotation/${id}/`
    );

    return response.data;
};

// POST: /api/finance/quotation/
export const createQuotation = async (quotationData) => {
    const response = await API.post(
        "/finance/quotation/",
        quotationData
    );

    return response.data;
};

// PUT: /api/finance/quotation/{id}/
export const updateQuotation = async (
    id,
    quotationData
) => {
    const response = await API.put(
        `/finance/quotation/${id}/`,
        quotationData
    );

    return response.data;
};

// PATCH: /api/finance/quotation/{id}/
export const patchQuotation = async (
    id,
    quotationData
) => {
    const response = await API.patch(
        `/finance/quotation/${id}/`,
        quotationData
    );

    return response.data;
};

// DELETE: /api/finance/quotation/{id}/
export const deleteQuotation = async (id) => {
    const response = await API.delete(
        `/finance/quotation/${id}/`
    );

    return response.data;
};

// GET: /api/finance/quotation/kpi/
// params: company (superadmin only)
export const fetchQuotationKpi = async (params = {}) => {
    const response = await API.get(
        "/finance/quotation/kpi/",
        { params }
    );

    return response.data;
};

// GET: /api/finance/quotation/summary/
// params: company (superadmin only)
export const fetchQuotationSummary = async (params = {}) => {
    const response = await API.get(
        "/finance/quotation/summary/",
        { params }
    );

    return response.data;
};

// POST: /api/finance/quotation/{id}/convert_so/
export const convertQuotationToSO = async (id, convertData = {}) => {
    const response = await API.post(
        `/finance/quotation/${id}/convert_so/`,
        convertData
    );

    return response.data;
};