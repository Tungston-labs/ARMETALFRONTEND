import API from "../../api";

// Base path: /api/finance/purchase-order
// (API already prefixes /api, same as the vendors service)

// ==========================================
// PURCHASE ORDERS
// ==========================================

// GET: /finance/purchase-order/
// Params: search, vendor, status, receipt_status, bill_status,
//         page, page_size
export const fetchPurchaseOrders = async (params = {}) => {
    const response = await API.get("/finance/purchase-order/", { params });
    return response.data;
};

// GET: /finance/purchase-order/:id/   (includes item_details)
export const fetchPurchaseOrderById = async (id) => {
    const response = await API.get(`/finance/purchase-order/${id}/`);
    return response.data;
};

// POST: /finance/purchase-order/
export const createPurchaseOrder = async (data) => {
    const response = await API.post("/finance/purchase-order/", data);
    return response.data;
};

// PUT: /finance/purchase-order/:id/
// Full update: send every required field, not just the changed ones.
export const updatePurchaseOrder = async (id, data) => {
    const response = await API.put(`/finance/purchase-order/${id}/`, data);
    return response.data;
};

// DELETE: /finance/purchase-order/:id/
// NOTE: not in your API docs either. Same caveat as above.
export const deletePurchaseOrder = async (id) => {
    const response = await API.delete(`/finance/purchase-order/${id}/`);
    return response.data;
};

// ==========================================
// DASHBOARD
// ==========================================

// GET: /finance/purchase-order/dashboard/
export const fetchPurchaseOrderDashboard = async (params = {}) => {
    const response = await API.get("/finance/purchase-order/dashboard/", {
        params,
    });
    return response.data;
};

// ==========================================
// DROPDOWNS
// ==========================================

// GET: /finance/purchase-order/dropdowns/vendors/
export const fetchVendorDropdown = async (params = {}) => {
    const response = await API.get(
        "/finance/purchase-order/dropdowns/vendors/",
        { params }
    );
    return response.data;
};

// GET: /finance/purchase-order/dropdowns/warehouses/
export const fetchWarehouseDropdown = async (params = {}) => {
    const response = await API.get(
        "/finance/purchase-order/dropdowns/warehouses/",
        { params }
    );
    return response.data;
};

// GET: /finance/purchase-order/dropdowns/products/
// Params: search (name, code or SKU)
export const fetchProductDropdown = async (params = {}) => {
    const response = await API.get(
        "/finance/purchase-order/dropdowns/products/",
        { params }
    );
    return response.data;
};