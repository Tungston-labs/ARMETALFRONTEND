import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    fetchPurchaseOrders,
    fetchPurchaseOrderById,
    createPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    fetchPurchaseOrderDashboard,
    fetchVendorDropdown,
    fetchWarehouseDropdown,
    fetchProductDropdown,
} from "../../../services/finance/purchases/Purchaseordersservice";

const toList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.results)) return payload.results;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
};

const errorOf = (error) => error.response?.data || error.message;


export const getPurchaseOrders = createAsyncThunk(
    "purchaseOrder/getPurchaseOrders",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchPurchaseOrders(params);
        } catch (error) {
            return rejectWithValue(errorOf(error));
        }
    }
);

// GET one (with item_details)
export const getPurchaseOrderById = createAsyncThunk(
    "purchaseOrder/getPurchaseOrderById",
    async (id, { rejectWithValue }) => {
        try {
            return await fetchPurchaseOrderById(id);
        } catch (error) {
            return rejectWithValue(errorOf(error));
        }
    }
);

// CREATE
export const addPurchaseOrder = createAsyncThunk(
    "purchaseOrder/addPurchaseOrder",
    async (data, { rejectWithValue }) => {
        try {
            return await createPurchaseOrder(data);
        } catch (error) {
            return rejectWithValue(errorOf(error));
        }
    }
);

// UPDATE (endpoint not in the docs, see service)
// Usage: dispatch(editPurchaseOrder({ id, data }))
export const editPurchaseOrder = createAsyncThunk(
    "purchaseOrder/editPurchaseOrder",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return await updatePurchaseOrder(id, data);
        } catch (error) {
            return rejectWithValue(errorOf(error));
        }
    }
);

// DELETE (endpoint not in the docs, see service)
export const removePurchaseOrder = createAsyncThunk(
    "purchaseOrder/removePurchaseOrder",
    async (id, { rejectWithValue }) => {
        try {
            await deletePurchaseOrder(id);
            return id;
        } catch (error) {
            return rejectWithValue(errorOf(error));
        }
    }
);

// DASHBOARD (stat cards)
export const getPurchaseOrderDashboard = createAsyncThunk(
    "purchaseOrder/getPurchaseOrderDashboard",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchPurchaseOrderDashboard(params);
        } catch (error) {
            return rejectWithValue(errorOf(error));
        }
    }
);

// DROPDOWNS
export const getVendorOptions = createAsyncThunk(
    "purchaseOrder/getVendorOptions",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchVendorDropdown(params);
        } catch (error) {
            return rejectWithValue(errorOf(error));
        }
    }
);

export const getWarehouseOptions = createAsyncThunk(
    "purchaseOrder/getWarehouseOptions",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchWarehouseDropdown(params);
        } catch (error) {
            return rejectWithValue(errorOf(error));
        }
    }
);

// Usage: dispatch(getProductOptions({ search: "cable" }))
export const getProductOptions = createAsyncThunk(
    "purchaseOrder/getProductOptions",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchProductDropdown(params);
        } catch (error) {
            return rejectWithValue(errorOf(error));
        }
    }
);

// ==========================================
// STATE
// ==========================================

const initialState = {
    purchaseOrders: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,

    selectedPurchaseOrder: null,
    dashboard: null,

    vendorOptions: [],
    warehouseOptions: [],
    productOptions: [],

    loading: false,
    detailLoading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    dashboardLoading: false,
    vendorOptionsLoading: false,
    warehouseOptionsLoading: false,
    productOptionsLoading: false,

    error: null,
    successMessage: null,
};

const purchaseOrderSlice = createSlice({
    name: "purchaseOrder",
    initialState,

    reducers: {
        clearPurchaseOrderError: (state) => {
            state.error = null;
        },
        clearPurchaseOrderMessage: (state) => {
            state.successMessage = null;
        },
        clearSelectedPurchaseOrder: (state) => {
            state.selectedPurchaseOrder = null;
        },
    },

    extraReducers: (builder) => {
        builder
            // ---------- LIST ----------
            .addCase(getPurchaseOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPurchaseOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.purchaseOrders = action.payload?.results || [];
                state.totalItems = action.payload?.total_items || 0;
                state.totalPages = action.payload?.total_pages || 0;
                state.currentPage = action.payload?.current_page || 1;
            })
            .addCase(getPurchaseOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ---------- DETAIL ----------
            .addCase(getPurchaseOrderById.pending, (state) => {
                state.detailLoading = true;
                state.error = null;
            })
            .addCase(getPurchaseOrderById.fulfilled, (state, action) => {
                state.detailLoading = false;
                state.selectedPurchaseOrder = action.payload;
            })
            .addCase(getPurchaseOrderById.rejected, (state, action) => {
                state.detailLoading = false;
                state.error = action.payload;
            })

            // ---------- CREATE ----------
            // The create response has no vendor_name / warehouse_name, so it is
            // not pushed into the list. Refetch the list after a save instead.
            .addCase(addPurchaseOrder.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })
            .addCase(addPurchaseOrder.fulfilled, (state, action) => {
                state.createLoading = false;
                state.selectedPurchaseOrder = action.payload;
                state.successMessage = `Purchase order ${
                    action.payload?.po_number || ""
                } created successfully.`.replace("  ", " ");
            })
            .addCase(addPurchaseOrder.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload;
            })

            // ---------- UPDATE ----------
            .addCase(editPurchaseOrder.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(editPurchaseOrder.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.successMessage = "Purchase order updated successfully.";

                const updated = action.payload;
                state.selectedPurchaseOrder = updated;

                // Merge so list-only fields (vendor_name...) are kept
                if (updated?.id) {
                    state.purchaseOrders = state.purchaseOrders.map((po) =>
                        po.id === updated.id ? { ...po, ...updated } : po
                    );
                }
            })
            .addCase(editPurchaseOrder.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            })

            // ---------- DELETE ----------
            .addCase(removePurchaseOrder.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })
            .addCase(removePurchaseOrder.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.successMessage = "Purchase order deleted successfully.";
                state.purchaseOrders = state.purchaseOrders.filter(
                    (po) => po.id !== action.payload
                );
                state.totalItems = Math.max(0, state.totalItems - 1);
            })
            .addCase(removePurchaseOrder.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload;
            })

            // ---------- DASHBOARD ----------
            // Does not clear state.error, so a refetch can't wipe an error
            // the page is currently showing.
            .addCase(getPurchaseOrderDashboard.pending, (state) => {
                state.dashboardLoading = true;
            })
            .addCase(getPurchaseOrderDashboard.fulfilled, (state, action) => {
                state.dashboardLoading = false;
                state.dashboard = action.payload?.data || action.payload;
            })
            .addCase(getPurchaseOrderDashboard.rejected, (state, action) => {
                state.dashboardLoading = false;
                state.error = action.payload;
            })

            // ---------- DROPDOWNS ----------
            .addCase(getVendorOptions.pending, (state) => {
                state.vendorOptionsLoading = true;
            })
            .addCase(getVendorOptions.fulfilled, (state, action) => {
                state.vendorOptionsLoading = false;
                state.vendorOptions = toList(action.payload);
            })
            .addCase(getVendorOptions.rejected, (state) => {
                state.vendorOptionsLoading = false;
            })

            .addCase(getWarehouseOptions.pending, (state) => {
                state.warehouseOptionsLoading = true;
            })
            .addCase(getWarehouseOptions.fulfilled, (state, action) => {
                state.warehouseOptionsLoading = false;
                state.warehouseOptions = toList(action.payload);
            })
            .addCase(getWarehouseOptions.rejected, (state) => {
                state.warehouseOptionsLoading = false;
            })

            .addCase(getProductOptions.pending, (state) => {
                state.productOptionsLoading = true;
            })
            .addCase(getProductOptions.fulfilled, (state, action) => {
                state.productOptionsLoading = false;
                state.productOptions = toList(action.payload);
            })
            .addCase(getProductOptions.rejected, (state) => {
                state.productOptionsLoading = false;
            });
    },
});

export const {
    clearPurchaseOrderError,
    clearPurchaseOrderMessage,
    clearSelectedPurchaseOrder,
} = purchaseOrderSlice.actions;

// ==========================================
// SELECTORS
// ==========================================

export const selectPurchaseOrders = (state) =>
    state.purchaseOrder?.purchaseOrders || [];
export const selectPurchaseOrderLoading = (state) =>
    state.purchaseOrder?.loading || false;
export const selectSelectedPurchaseOrder = (state) =>
    state.purchaseOrder?.selectedPurchaseOrder || null;
export const selectPurchaseOrderDashboard = (state) =>
    state.purchaseOrder?.dashboard || null;
export const selectPurchaseOrderError = (state) =>
    state.purchaseOrder?.error || null;
export const selectVendorOptions = (state) =>
    state.purchaseOrder?.vendorOptions || [];
export const selectWarehouseOptions = (state) =>
    state.purchaseOrder?.warehouseOptions || [];
export const selectProductOptions = (state) =>
    state.purchaseOrder?.productOptions || [];

export default purchaseOrderSlice.reducer;