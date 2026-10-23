import API from "../../api";

// Base path: /api/finance/vendor
// (API already prefixes /api, same as your other services)

// GET: /finance/vendor/vendors/
// Params: page, page_size, search, client_status, vendor_type,
//         payment_term, ordering
export const fetchVendors = async (params = {}) => {
    const response = await API.get("/finance/vendor/vendors/", { params });
    return response.data;
};

// POST: /finance/vendor/vendors/
export const createVendor = async (vendorData) => {
    const response = await API.post("/finance/vendor/vendors/", vendorData);
    return response.data;
};

// GET: /finance/vendor/dashboard/
export const fetchVendorDashboard = async (params = {}) => {
    const response = await API.get("/finance/vendor/dashboard/", { params });
    return response.data;
};

// POST: /finance/vendor/vendors/{id}/upload-documents/
// formData must contain one or more "documents" file fields
export const uploadVendorDocuments = async (id, formData) => {
    const response = await API.post(
        `/finance/vendor/vendors/${id}/upload-documents/`,
        formData
    );
    return response.data;
};

// PATCH: /finance/vendor/vendors/{id}/
export const updateVendor = async (id, vendorData) => {
    const response = await API.patch(`/finance/vendor/vendors/${id}/`, vendorData);
    return response.data;
};

// DELETE: /finance/vendor/vendors/{id}/
export const deleteVendor = async (id) => {
    const response = await API.delete(`/finance/vendor/vendors/${id}/`);
    return response.data;
};