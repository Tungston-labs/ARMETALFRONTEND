import API from "../../api";

// GET: /api/finance/customer/
export const fetchCustomers = async (params = {}) => {
    const response = await API.get(
        "/finance/customer/",
        { params }
    );

    return response.data;
};

// GET: /api/finance/customer/{id}/
export const fetchCustomerById = async (id) => {
    const response = await API.get(
        `/finance/customer/${id}/`
    );

    return response.data;
};

// POST: /api/finance/customer/
export const createCustomer = async (customerData) => {
    const response = await API.post(
        "/finance/customer/",
        customerData
    );

    return response.data;
};

// PUT: /api/finance/customer/{id}/
export const updateCustomer = async (
    id,
    customerData
) => {
    const response = await API.put(
        `/finance/customer/${id}/`,
        customerData
    );

    return response.data;
};

// PATCH: /api/finance/customer/{id}/
export const patchCustomer = async (
    id,
    customerData
) => {
    const response = await API.patch(
        `/finance/customer/${id}/`,
        customerData
    );

    return response.data;
};

// DELETE: /api/finance/customer/{id}/
export const deleteCustomer = async (id) => {
    const response = await API.delete(
        `/finance/customer/${id}/`
    );

    return response.data;
};

// GET: /api/finance/customer/summary/
export const fetchCustomerSummary = async (params = {}) => {
    const response = await API.get(
        "/finance/customer/summary/",
        { params }
    );

    return response.data;
};

export const fetchCustomerOverview = async (id) => {
    const response = await API.get(
        `/finance/customer/${id}/overview/`
    );

    return response.data;
};
// POST: /api/finance/customer/{id}/upload_document/
export const uploadCustomerDocument = async (id, formData) => {
    const response = await API.post(
        `/finance/customer/${id}/upload_document/`,
        formData
    );

    return response.data;
};

// GET: /api/finance/customer/{id}/quotations/
export const fetchCustomerQuotations = async (id, params = {}) => {
    const response = await API.get(
        `/finance/customer/${id}/quotations/`,
        { params }
    );

    return response.data;
};
// GET: /api/finance/customer/{customer_id}/payments/
export const fetchCustomerPayments = async (
    customerId,
    params = {}
) => {
    const response = await API.get(
        `/finance/customer/${customerId}/payments/`,
        { params }
    );

    return response.data;
};
// GET: /api/finance/customer/{customer_id}/ledger/
export const fetchCustomerLedger = async (customerId, params = {}) => {
    const response = await API.get(
        `/finance/customer/${customerId}/ledger/`,
        { params }
    );

    return response.data;
};
// GET: /api/finance/customer/{customer_id}/credit_notes/
export const fetchCustomerCreditNotes = async (
    customerId,
    params = {}
) => {
    const response = await API.get(
        `/finance/customer/${customerId}/credit_notes/`,
        { params }
    );

    return response.data;
};
// GET: /api/finance/sales-order/customer/{customer_id}/orders/
export const fetchCustomerOrders = async (customerId, params = {}) => {
    const response = await API.get(
        `/finance/sales-order/customer/${customerId}/orders/`,
        { params }
    );

    return response.data;
};

// GET: /api/finance/sales-order/customer/{customer_id}/orders/summary/
export const fetchCustomerOrdersSummary = async (customerId) => {
    const response = await API.get(
        `/finance/sales-order/customer/${customerId}/orders/summary/`
    );

    return response.data;
};

// GET: /api/finance/invoice/customer/{customer_id}/invoices/
export const fetchCustomerInvoices = async (customerId, params = {}) => {
    const response = await API.get(
        `/finance/invoice/customer/${customerId}/invoices/`,
        { params }
    );

    return response.data;
};

// GET: /api/finance/invoice/customer/{customer_id}/invoices/summary/
export const fetchCustomerInvoicesSummary = async (customerId) => {
    const response = await API.get(
        `/finance/invoice/customer/${customerId}/invoices/summary/`
    );

    return response.data;
};