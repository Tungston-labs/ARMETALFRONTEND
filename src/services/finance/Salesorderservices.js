import API from "../api";

// GET: /api/finance/sales-order/
export const fetchSalesOrders = async (params = {}) => {
    const response = await API.get(
        "/finance/sales-order/",
        { params }
    );

    return response.data;
};

// GET: /api/finance/sales-order/summary/
export const fetchSalesOrderSummary = async (
    params = {}
) => {
    const response = await API.get(
        "/finance/sales-order/summary/",
        { params }
    );

    return response.data;
};

// GET: /api/finance/sales-order/companies/
export const fetchCompanies = async () => {
    const response = await API.get(
        "/finance/sales-order/companies/"
    );

    return response.data;
};

// GET: /api/finance/sales-order/customers/
export const fetchCustomers = async (
    params = {}
) => {
    const response = await API.get(
        "/finance/sales-order/customers/",
        { params }
    );

    return response.data;
};

// GET: /api/finance/sales-order/warehouses/
export const fetchWarehouses = async (
    params = {}
) => {
    const response = await API.get(
        "/finance/sales-order/warehouses/",
        { params }
    );

    return response.data;
};

// GET: /api/finance/sales-order/quotations/
export const fetchAvailableQuotations = async (
    params = {}
) => {
    const response = await API.get(
        "/finance/sales-order/quotations/",
        { params }
    );

    return response.data;
};

// GET: /api/finance/sales-order/quotations/{id}/
export const fetchQuotationById = async (id) => {
    const response = await API.get(
        `/finance/sales-order/quotations/${id}/`
    );

    return response.data;
};

// GET: /api/finance/sales-order/{id}/
export const fetchSalesOrderById = async (id) => {
    const response = await API.get(
        `/finance/sales-order/${id}/`
    );

    return response.data;
};

// POST: /api/finance/sales-order/
export const createSalesOrder = async (
    salesOrderData
) => {
    const response = await API.post(
        "/finance/sales-order/",
        salesOrderData
    );

    return response.data;
};

// PUT: /api/finance/sales-order/{id}/
export const updateSalesOrder = async (
    id,
    salesOrderData
) => {
    const response = await API.put(
        `/finance/sales-order/${id}/`,
        salesOrderData
    );

    return response.data;
};

// PATCH: /api/finance/sales-order/{id}/
export const patchSalesOrder = async (
    id,
    salesOrderData
) => {
    const response = await API.patch(
        `/finance/sales-order/${id}/`,
        salesOrderData
    );

    return response.data;
};

// DELETE: /api/finance/sales-order/{id}/
export const deleteSalesOrder = async (id) => {
    const response = await API.delete(
        `/finance/sales-order/${id}/`
    );

    return response.data;
};

// PATCH: /api/finance/sales-order/{orderId}/items/{itemId}/delivery/
export const updateItemDelivery = async (
    orderId,
    itemId,
    deliveredQuantity
) => {
    const response = await API.patch(
        `/finance/sales-order/${orderId}/items/${itemId}/delivery/`,
        { delivered_quantity: deliveredQuantity }
    );

    return response.data;
};