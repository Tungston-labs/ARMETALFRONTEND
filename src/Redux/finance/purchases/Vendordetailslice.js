import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    fetchVendorOverview,
    fetchVendorPurchaseOrders,
    fetchVendorLedger,
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

// Usage: dispatch(getVendorLedger({ vendorId, params: { search: "REC" } }))
export const getVendorLedger = createAsyncThunk(
    "vendorDetail/getVendorLedger",
    async ({ vendorId, params = {} }, { rejectWithValue }) => {
        try {
            return await fetchVendorLedger(vendorId, params);
        } catch (error) {
            return rejectWithValue(errorOf(error));
        }
    }
);

const initialState = {
    vendor: null,

    overviewSummary: null,
    overviewLoading: false,
    overviewError: null,

    purchaseOrders: [],
    purchaseOrdersSummary: null,
    purchaseOrdersLoading: false,
    purchaseOrdersError: null,

    ledger: [],
    ledgerCards: null,
    ledgerFilters: null,
    ledgerLoading: false,
    ledgerError: null,
};

const vendorDetailSlice = createSlice({
    name: "vendorDetail",
    initialState,
    reducers: {
        clearVendorDetail: () => initialState,
        clearVendorDetailError: (state) => {
            state.overviewError = null;
            state.purchaseOrdersError = null;
            state.ledgerError = null;
        },
        // call on unmount so the next vendor never sees stale ledger data
        clearVendorLedger: (state) => {
            state.ledger = [];
            state.ledgerCards = null;
            state.ledgerFilters = null;
            state.ledgerError = null;
            state.ledgerLoading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // ---------- OVERVIEW ----------
            .addCase(getVendorOverview.pending, (state) => {
                state.overviewLoading = true;
                state.overviewError = null;
            })
            .addCase(getVendorOverview.fulfilled, (state, action) => {
                state.overviewLoading = false;
                state.vendor = action.payload?.vendor || null;
                state.overviewSummary = action.payload?.summary || null;
            })
            .addCase(getVendorOverview.rejected, (state, action) => {
                state.overviewLoading = false;
                state.overviewError = action.payload;
            })

            // ---------- PURCHASE ORDERS ----------
            .addCase(getVendorPurchaseOrders.pending, (state) => {
                state.purchaseOrdersLoading = true;
                state.purchaseOrdersError = null;
            })
            .addCase(getVendorPurchaseOrders.fulfilled, (state, action) => {
                state.purchaseOrdersLoading = false;
                state.purchaseOrders = action.payload?.purchase_orders || [];
                state.purchaseOrdersSummary = action.payload?.summary || null;
            })
            .addCase(getVendorPurchaseOrders.rejected, (state, action) => {
                state.purchaseOrdersLoading = false;
                state.purchaseOrdersError = action.payload;
            })

            // ---------- LEDGER ----------
            .addCase(getVendorLedger.pending, (state) => {
                state.ledgerLoading = true;
                state.ledgerError = null;
            })
            .addCase(getVendorLedger.fulfilled, (state, action) => {
                state.ledgerLoading = false;
                state.ledger = action.payload?.data || [];
                state.ledgerCards = action.payload?.cards || null;
                state.ledgerFilters = action.payload?.filters || null;
                // NOTE: no longer writes state.vendor here. The ledger response only
                // has id / vendor_id / name, which would leave Overview half-empty.
            })
            .addCase(getVendorLedger.rejected, (state, action) => {
                state.ledgerLoading = false;
                state.ledgerError = action.payload;
            });
    },
});

export const { clearVendorDetail, clearVendorDetailError, clearVendorLedger } =
    vendorDetailSlice.actions;

export const selectVendorDetail = (state) => state.vendorDetail;

export default vendorDetailSlice.reducer;