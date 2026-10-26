import API from "../../api";

// POST: /api/finance/recurring/create/
export const createRecurringService = async (payload) => {
    const response = await API.post(
        `/finance/recurring/create/`,
        payload
    );

    return response.data;
};

// GET: /api/finance/recurring/services/
export const fetchRecurringServices = async (params = {}) => {
    const response = await API.get(
        `/finance/recurring/services/`,
        { params }
    );

    return response.data;
};

// GET: /api/finance/recurring/services/{id}/
export const fetchRecurringServiceById = async (id) => {
    const response = await API.get(
        `/finance/recurring/services/${id}/`
    );

    return response.data;
};

// PUT: /api/finance/recurring/services/{id}/
export const updateRecurringService = async (id, payload) => {
    const response = await API.put(
        `/finance/recurring/services/${id}/`,
        payload
    );

    return response.data;
};

// PATCH: /api/finance/recurring/services/{id}/
// NOTE: also used to upload product_icon / screenshot after creation,
// in which case `payload` should be a FormData instance.
export const patchRecurringService = async (id, payload) => {
    const isFormData =
        typeof FormData !== "undefined" && payload instanceof FormData;

    const response = await API.patch(
        `/finance/recurring/services/${id}/`,
        payload,
        isFormData
            ? { headers: { "Content-Type": "multipart/form-data" } }
            : undefined
    );

    return response.data;
};

// DELETE: /api/finance/recurring/services/{id}/
export const deleteRecurringService = async (id) => {
    const response = await API.delete(
        `/finance/recurring/services/${id}/`
    );

    return response.data;
};

// GET: /api/finance/recurring/billing/
export const fetchRecurringBilling = async (params = {}) => {
    const response = await API.get(
        `/finance/recurring/billing/`,
        { params }
    );

    return response.data;
};

// GET: /api/finance/recurring/billing/{id}/
export const fetchRecurringBillingById = async (id) => {
    const response = await API.get(
        `/finance/recurring/billing/${id}/`
    );

    return response.data;
};

// PUT: /api/finance/recurring/billing/{id}/
export const updateRecurringBilling = async (id, payload) => {
    const response = await API.put(
        `/finance/recurring/billing/${id}/`,
        payload
    );

    return response.data;
};

// PATCH: /api/finance/recurring/billing/{id}/
export const patchRecurringBilling = async (id, payload) => {
    const response = await API.patch(
        `/finance/recurring/billing/${id}/`,
        payload
    );

    return response.data;
};

// DELETE: /api/finance/recurring/billing/{id}/
export const deleteRecurringBilling = async (id) => {
    const response = await API.delete(
        `/finance/recurring/billing/${id}/`
    );

    return response.data;
};

// GET: /api/finance/recurring/billing/dashboard/
export const fetchRecurringBillingDashboard = async () => {
    const response = await API.get(
        `/finance/recurring/billing/dashboard/`
    );

    return response.data;
};

// GET: /api/finance/recurring/summary/
export const fetchRecurringSummary = async () => {
    const response = await API.get(
        `/finance/recurring/summary/`
    );

    return response.data;
};

// GET: /api/finance/customer/
export const fetchCustomersList = async (params = {}) => {
    const response = await API.get(
        `/finance/customer/`,
        { params: { page_size: 1000, ...params } }
    );

    return response.data;
};

// GET: /api/finance/category/
export const fetchCategoriesList = async (params = {}) => {
    const response = await API.get(
        `/finance/category/`,
        { params: { page_size: 1000, ...params } }
    );

    return response.data;
};

// GET: /api/finance/product/
export const fetchProductsList = async (params = {}) => {
    const response = await API.get(
        `/finance/product/`,
        { params: { page_size: 1000, ...params } }
    );

    return response.data;
};