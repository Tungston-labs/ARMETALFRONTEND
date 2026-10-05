import API from "../../api";

const VENDOR_BASE = "/finance/vendor";
const VENDOR_LEDGER_BASE = "/finance/vendor-ledger/vendor";

// Drop empty filters so they aren't sent as ?search=&type=
const cleanParams = (params = {}) =>
    Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== "" && v != null)
    );

// GET: /finance/vendor/:id/overview/
export const fetchVendorOverview = async (vendorId) => {
    const response = await API.get(`${VENDOR_BASE}/${vendorId}/overview/`);
    return response.data;
};

// GET: /finance/vendor/:id/purchase-orders/
export const fetchVendorPurchaseOrders = async (vendorId, params = {}) => {
    const response = await API.get(`${VENDOR_BASE}/${vendorId}/purchase-orders/`, {
        params: cleanParams(params),
    });
    return response.data;
};

// GET: /finance/vendor-ledger/vendor/:id/
// params are passed through as-is (see the note on param names below)
export const fetchVendorLedger = async (vendorId, params = {}) => {
    const response = await API.get(`${VENDOR_LEDGER_BASE}/${vendorId}/`, {
        params: cleanParams(params),
    });
    return response.data;
};