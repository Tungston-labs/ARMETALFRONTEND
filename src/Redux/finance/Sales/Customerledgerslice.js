import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    fetchLedgerEntries,
    createLedgerEntry,
    fetchCustomerLedgerEntries,
    fetchLedgerSummary,
    fetchDashboardSummary,
    fetchCustomerWiseSummary,
} from "../../../services/finance/Sales/Customerledgerservice";

// Normalises list responses: { results: [] } | { data: [] } | []
const extractList = (payload) =>
    payload?.results || payload?.data || (Array.isArray(payload) ? payload : []);

const extractTotalItems = (payload) =>
    payload?.count || payload?.total_items || 0;

// ==========================================
// THUNKS
// ==========================================

// GET Ledger Entries (all)
export const getLedgerEntries = createAsyncThunk(
    "customerLedger/getLedgerEntries",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchLedgerEntries(params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// POST Create Ledger Entry (manual debit / credit)
export const addLedgerEntry = createAsyncThunk(
    "customerLedger/addLedgerEntry",
    async (payload, { rejectWithValue }) => {
        try {
            return await createLedgerEntry(payload);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// GET Ledger Entries For A Single Customer
export const getCustomerLedgerEntries = createAsyncThunk(
    "customerLedger/getCustomerLedgerEntries",
    async ({ customerId, params = {} }, { rejectWithValue }) => {
        try {
            return await fetchCustomerLedgerEntries(customerId, params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// GET Ledger Summary (single customer, needs customer_id)
export const getLedgerSummary = createAsyncThunk(
    "customerLedger/getLedgerSummary",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchLedgerSummary(params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// GET Dashboard Summary (aggregate stats — powers the stat cards)
export const getDashboardSummary = createAsyncThunk(
    "customerLedger/getDashboardSummary",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchDashboardSummary(params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// GET Customer-wise Summary (powers the "Summary by Customer" table)
export const getCustomerWiseSummary = createAsyncThunk(
    "customerLedger/getCustomerWiseSummary",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchCustomerWiseSummary(params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// ==========================================
// STATE
// ==========================================

const initialState = {
    entries: [],
    customerEntries: [],
    summary: null,
    dashboardSummary: null,

    customerWiseSummary: [],
    customerWiseSummaryTotalItems: 0,
    customerWiseSummaryTotalPages: 0,
    customerWiseSummaryCurrentPage: 1,

    totalItems: 0,
    totalPages: 0,
    currentPage: 1,

    customerTotalItems: 0,
    customerTotalPages: 0,
    customerCurrentPage: 1,

    loading: false,
    createLoading: false,
    customerLoading: false,
    summaryLoading: false,
    dashboardSummaryLoading: false,
    customerWiseSummaryLoading: false,

    error: null,
    successMessage: null,
};

const customerLedgerSlice = createSlice({
    name: "customerLedger",
    initialState,

    reducers: {
        clearLedgerError: (state) => {
            state.error = null;
        },
        clearLedgerMessage: (state) => {
            state.successMessage = null;
        },
        clearCustomerLedgerEntries: (state) => {
            state.customerEntries = [];
            state.customerTotalItems = 0;
            state.customerTotalPages = 0;
            state.customerCurrentPage = 1;
        },
        clearLedgerSummary: (state) => {
            state.summary = null;
        },
    },

    extraReducers: (builder) => {
        builder
            // ---------- GET LEDGER ENTRIES (ALL) ----------
            .addCase(getLedgerEntries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLedgerEntries.fulfilled, (state, action) => {
                state.loading = false;
                state.entries = extractList(action.payload);
                state.totalItems = extractTotalItems(action.payload);
                state.totalPages = action.payload?.total_pages || 0;
                state.currentPage = action.payload?.current_page || 1;
            })
            .addCase(getLedgerEntries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ---------- CREATE LEDGER ENTRY ----------
            .addCase(addLedgerEntry.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })
            .addCase(addLedgerEntry.fulfilled, (state, action) => {
                state.createLoading = false;
                state.successMessage =
                    action.payload?.message ||
                    "Ledger entry created successfully.";
            })
            .addCase(addLedgerEntry.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload;
            })

            // ---------- GET CUSTOMER LEDGER ENTRIES ----------
            .addCase(getCustomerLedgerEntries.pending, (state) => {
                state.customerLoading = true;
                state.error = null;
            })
            .addCase(getCustomerLedgerEntries.fulfilled, (state, action) => {
                state.customerLoading = false;
                state.customerEntries = extractList(action.payload);
                state.customerTotalItems = extractTotalItems(action.payload);
                state.customerTotalPages = action.payload?.total_pages || 0;
                state.customerCurrentPage = action.payload?.current_page || 1;
            })
            .addCase(getCustomerLedgerEntries.rejected, (state, action) => {
                state.customerLoading = false;
                state.error = action.payload;
            })

            // ---------- GET LEDGER SUMMARY (single customer) ----------
            .addCase(getLedgerSummary.pending, (state) => {
                state.summaryLoading = true;
                state.error = null;
            })
            .addCase(getLedgerSummary.fulfilled, (state, action) => {
                state.summaryLoading = false;
                state.summary = action.payload?.data || action.payload;
            })
            .addCase(getLedgerSummary.rejected, (state, action) => {
                state.summaryLoading = false;
                state.error = action.payload;
            })

            // ---------- GET DASHBOARD SUMMARY (stat cards) ----------
            .addCase(getDashboardSummary.pending, (state) => {
                state.dashboardSummaryLoading = true;
                state.error = null;
            })
            .addCase(getDashboardSummary.fulfilled, (state, action) => {
                state.dashboardSummaryLoading = false;
                state.dashboardSummary = action.payload?.data || action.payload;
            })
            .addCase(getDashboardSummary.rejected, (state, action) => {
                state.dashboardSummaryLoading = false;
                state.error = action.payload;
            })

            // ---------- GET CUSTOMER-WISE SUMMARY ----------
            .addCase(getCustomerWiseSummary.pending, (state) => {
                state.customerWiseSummaryLoading = true;
                state.error = null;
            })
            .addCase(getCustomerWiseSummary.fulfilled, (state, action) => {
                state.customerWiseSummaryLoading = false;
                state.customerWiseSummary = extractList(action.payload);
                state.customerWiseSummaryTotalItems =
                    extractTotalItems(action.payload) ||
                    state.customerWiseSummary.length;
                state.customerWiseSummaryTotalPages =
                    action.payload?.total_pages || 1;
                state.customerWiseSummaryCurrentPage =
                    action.payload?.current_page || 1;
            })
            .addCase(getCustomerWiseSummary.rejected, (state, action) => {
                state.customerWiseSummaryLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearLedgerError,
    clearLedgerMessage,
    clearCustomerLedgerEntries,
    clearLedgerSummary,
} = customerLedgerSlice.actions;

export default customerLedgerSlice.reducer;