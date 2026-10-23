import API from "../../api";

// GET: /api/finance/invoice/sales-orders/
export const fetchSalesOrdersForInvoice = async () => {
    const response = await API.get(
        "/finance/invoice/sales-orders/"
    );

    return response.data;
};

// GET: /api/finance/invoice/sales-orders/{id}/
export const fetchSalesOrderDetailForInvoice = async (salesOrderId) => {
    const response = await API.get(
        `/finance/invoice/sales-orders/${salesOrderId}/`
    );

    return response.data;
};

// POST: /api/finance/invoice/
export const createInvoice = async (invoiceData) => {
    const response = await API.post(
        "/finance/invoice/",
        invoiceData
    );

    return response.data;
};

// GET: /api/finance/invoice/
export const fetchInvoices = async (params = {}) => {
    const response = await API.get(
        "/finance/invoice/",
        { params }
    );

    return response.data;
};

// GET: /api/finance/invoice/{id}/
export const fetchInvoiceById = async (id) => {
    const response = await API.get(
        `/finance/invoice/${id}/`
    );

    return response.data;
};

// PUT: /api/finance/invoice/{id}/
export const updateInvoice = async (
    id,
    invoiceData
) => {
    const response = await API.put(
        `/finance/invoice/${id}/`,
        invoiceData
    );

    return response.data;
};

// PATCH: /api/finance/invoice/{id}/
export const patchInvoice = async (
    id,
    invoiceData
) => {
    const response = await API.patch(
        `/finance/invoice/${id}/`,
        invoiceData
    );

    return response.data;
};

// DELETE: /api/finance/invoice/{id}/
export const deleteInvoice = async (id) => {
    const response = await API.delete(
        `/finance/invoice/${id}/`
    );

    return response.data;
};

// GET: /api/finance/invoice/{id}/download/
export const downloadInvoicePDF = async (id) => {
    const response = await API.get(
        `/finance/invoice/${id}/download/`,
        { responseType: "blob" }
    );

    return response.data;
};

// POST: /api/finance/invoice/{id}/send/
export const sendInvoiceEmail = async (id) => {
    const response = await API.post(
        `/finance/invoice/${id}/send/`
    );

    return response.data;
};

// GET: /api/finance/invoice/company-details/
export const fetchInvoiceCompanyDetails = async () => {
    const response = await API.get(
        "/finance/invoice/company-details/"
    );

    return response.data;
};

// GET: /api/finance/invoice/products/
export const fetchInvoiceProducts = async () => {
    const response = await API.get(
        "/finance/invoice/products/"
    );

    return response.data;
};

// GET: /api/finance/invoice/customers/
export const fetchInvoiceCustomers = async () => {
    const response = await API.get(
        "/finance/invoice/customers/"
    );

    return response.data;
};

// GET: /api/finance/invoice/summary/
export const fetchInvoiceSummary = async (params = {}) => {
    const response = await API.get(
        "/finance/invoice/summary/",
        { params }
    );

    return response.data;
};