import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    fetchLedgerEntries,
    fetchCustomerLedgerEntries,
    fetchLedgerSummary,
    fetchDashboardSummary,
} from "../../../services/finance/Sales/Customerledgerservice";

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

// GET Ledger Summary (per-customer — kept for future use, not used on this page)
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

const initialState = {
    entries: [],
    customerEntries: [],
    summary: null,
    dashboardSummary: null,

    totalItems: 0,
    totalPages: 0,
    currentPage: 1,

    customerTotalItems: 0,
    customerTotalPages: 0,
    customerCurrentPage: 1,

    loading: false,
    customerLoading: false,
    summaryLoading: false,
    dashboardSummaryLoading: false,

    error: null,
};

const customerLedgerSlice = createSlice({
    name: "customerLedger",
    initialState,

    reducers: {
        clearLedgerError: (state) => {
            state.error = null;
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
            // GET LEDGER ENTRIES (ALL)
            .addCase(getLedgerEntries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLedgerEntries.fulfilled, (state, action) => {
                state.loading = false;
                state.entries =
                    action.payload?.results ||
                    action.payload?.data ||
                    action.payload ||
                    [];
                state.totalItems =
                    action.payload?.count || action.payload?.total_items || 0;
                state.totalPages = action.payload?.total_pages || 0;
                state.currentPage = action.payload?.current_page || 1;
            })
            .addCase(getLedgerEntries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // GET CUSTOMER LEDGER ENTRIES
            .addCase(getCustomerLedgerEntries.pending, (state) => {
                state.customerLoading = true;
                state.error = null;
            })
            .addCase(getCustomerLedgerEntries.fulfilled, (state, action) => {
                state.customerLoading = false;
                state.customerEntries =
                    action.payload?.results ||
                    action.payload?.data ||
                    action.payload ||
                    [];
                state.customerTotalItems =
                    action.payload?.count || action.payload?.total_items || 0;
                state.customerTotalPages = action.payload?.total_pages || 0;
                state.customerCurrentPage = action.payload?.current_page || 1;
            })
            .addCase(getCustomerLedgerEntries.rejected, (state, action) => {
                state.customerLoading = false;
                state.error = action.payload;
            })

            // GET LEDGER SUMMARY (per-customer)
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

            // GET DASHBOARD SUMMARY (aggregate stat cards)
            .addCase(getDashboardSummary.pending, (state) => {
                state.dashboardSummaryLoading = true;
                state.error = null;
            })
            .addCase(getDashboardSummary.fulfilled, (state, action) => {
                state.dashboardSummaryLoading = false;
                state.dashboardSummary =
                    action.payload?.data || action.payload;
            })
            .addCase(getDashboardSummary.rejected, (state, action) => {
                state.dashboardSummaryLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearLedgerError, clearCustomerLedgerEntries, clearLedgerSummary } =
    customerLedgerSlice.actions;

export default customerLedgerSlice.reducer;