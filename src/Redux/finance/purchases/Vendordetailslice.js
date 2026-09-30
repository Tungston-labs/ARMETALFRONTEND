import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    fetchVendorOverview,
    fetchVendorPurchaseOrders,
} from "../../../services/finance/purchases/Vendordetailservice";

const errorOf = (error) => error.response?.data || error.message;

export const getVendorOverview = createAsyncThunk(
    "vendorDetail/getVendorOverview",
    async (vendorId, { rejectWithValue }) => {
        try {
            return await fetchVendorOverview(vendorId);
        } catch (error) {
            return rejectWithValue(errorOf(error));
        }
    }
);

// Usage: dispatch(getVendorPurchaseOrders({ vendorId, params: {} }))
export const getVendorPurchaseOrders = createAsyncThunk(
    "vendorDetail/getVendorPurchaseOrders",
    async ({ vendorId, params = {} }, { rejectWithValue }) => {
        try {
            return await fetchVendorPurchaseOrders(vendorId, params);
        } catch (error) {
            return rejectWithValue(errorOf(error));
        }
    }
);

const initialState = {
    vendor: null,
    overviewSummary: null,
    purchaseOrders: [],
    purchaseOrdersSummary: null,
   overviewError: null,
    purchaseOrdersError: null,
    overviewLoading: false,
    purchaseOrdersLoading: false,
    error: null,
};

const vendorDetailSlice = createSlice({
    name: "vendorDetail",
    initialState,
    reducers: {
        clearVendorDetail: () => initialState,
        clearVendorDetailError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // ---------- OVERVIEW ----------
            .addCase(getVendorOverview.pending, (state) => {
                state.overviewLoading = true;
                state.error = null;
            })
            .addCase(getVendorOverview.fulfilled, (state, action) => {
                state.overviewLoading = false;
                state.vendor = action.payload?.vendor || null;
                state.overviewSummary = action.payload?.summary || null;
            })
            .addCase(getVendorOverview.rejected, (state, action) => {
                state.overviewLoading = false;
                state.error = action.payload;
            })

            // ---------- PURCHASE ORDERS ----------
            .addCase(getVendorPurchaseOrders.pending, (state) => {
                state.purchaseOrdersLoading = true;
                state.error = null;
            })
            .addCase(getVendorPurchaseOrders.fulfilled, (state, action) => {
                state.purchaseOrdersLoading = false;
                state.purchaseOrders = action.payload?.purchase_orders || [];
                state.purchaseOrdersSummary = action.payload?.summary || null;
            })
            .addCase(getVendorPurchaseOrders.rejected, (state, action) => {
                state.purchaseOrdersLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearVendorDetail, clearVendorDetailError } =
    vendorDetailSlice.actions;

export const selectVendorDetail = (state) => state.vendorDetail;

export default vendorDetailSlice.reducer;