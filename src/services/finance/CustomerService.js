import API from "../api";

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