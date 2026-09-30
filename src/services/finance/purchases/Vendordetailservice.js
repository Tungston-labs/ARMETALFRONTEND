import API from "../../api";

// From your REST file: {{baseUrl}} = http://localhost:8000/api/finance/vendor
// API already adds the /api prefix, so this is the rest of the path.
const VENDOR_BASE = "/finance/vendor";

// GET: /finance/vendor/:id/overview/
export const fetchVendorOverview = async (vendorId) => {
    const response = await API.get(`${VENDOR_BASE}/${vendorId}/overview/`);
    return response.data;
};

// GET: /finance/vendor/:id/purchase-orders/
export const fetchVendorPurchaseOrders = async (vendorId, params = {}) => {
    const response = await API.get(`${VENDOR_BASE}/${vendorId}/purchase-orders/`, {
        params,
    });
    return response.data;
};