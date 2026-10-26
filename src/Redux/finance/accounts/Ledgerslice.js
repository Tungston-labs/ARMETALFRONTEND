// redux/slices/ledgerSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchLedgerEntries,
  fetchCustomerLedger,
  fetchCustomerLedgerSummary,
  createLedgerEntry,
  fetchCustomerWiseSummary,
  fetchDashboardSummary,
} from "../../../services/finance/accounts/Ledgerservices";


// =====================================================
// GET ALL LEDGER ENTRIES
// =====================================================

export const getLedgerEntries = createAsyncThunk(
  "ledger/getLedgerEntries",
  async (params = {}, thunkAPI) => {
    try {
      return await fetchLedgerEntries(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// =====================================================
// GET CUSTOMER LEDGER
// usage: dispatch(getCustomerLedger({ customerId: 4, params: { from_date, to_date } }))
// =====================================================

export const getCustomerLedger = createAsyncThunk(
  "ledger/getCustomerLedger",
  async ({ customerId, params = {} }, thunkAPI) => {
    try {
      return await fetchCustomerLedger(customerId, params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// =====================================================
// GET CUSTOMER LEDGER SUMMARY
// usage: dispatch(getCustomerLedgerSummary({ customerId: 4, params: { from_date, to_date } }))
// =====================================================

export const getCustomerLedgerSummary = createAsyncThunk(
  "ledger/getCustomerLedgerSummary",
  async ({ customerId, params = {} }, thunkAPI) => {
    try {
      return await fetchCustomerLedgerSummary(customerId, params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// =====================================================
// CREATE LEDGER ENTRY
// =====================================================

export const addLedgerEntry = createAsyncThunk(
  "ledger/addLedgerEntry",
  async (ledgerData, thunkAPI) => {
    try {
      return await createLedgerEntry(ledgerData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// =====================================================
// GET CUSTOMER WISE SUMMARY
// =====================================================

export const getCustomerWiseSummary = createAsyncThunk(
  "ledger/getCustomerWiseSummary",
  async (params = {}, thunkAPI) => {
    try {
      return await fetchCustomerWiseSummary(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// =====================================================
// GET DASHBOARD SUMMARY
// =====================================================

export const getDashboardSummary = createAsyncThunk(
  "ledger/getDashboardSummary",
  async (_, thunkAPI) => {
    try {
      return await fetchDashboardSummary();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// =====================================================
// INITIAL STATE
// =====================================================

const emptyPagination = {
  count: 0,
  totalPages: 1,
  currentPage: 1,
  next: null,
  previous: null,
};

const initialState = {
  // All ledger entries
  ledgerEntries: [],
  ledgerPagination: { ...emptyPagination },

  // Single customer ledger
  customerLedger: [],
  customerLedgerPagination: { ...emptyPagination },

  // Customer wise summary table
  customerSummaries: [],
  customerSummariesPagination: { ...emptyPagination },

  // Single customer summary (opening / debit / credit / closing)
  customerSummary: null,

  // Dashboard cards
  dashboardSummary: null,

  loading: false,
  error: null,
  createSuccess: false,
};


// Converts API pagination payload -> state pagination object
// Payload shape: { total_items, total_pages, current_page, next, previous, results }
const mapPagination = (data = {}) => ({
  count: data.total_items || 0,
  totalPages: data.total_pages || 1,
  currentPage: data.current_page || 1,
  next: data.next || null,
  previous: data.previous || null,
});


// =====================================================
// SLICE
// =====================================================

const ledgerSlice = createSlice({
  name: "ledger",

  initialState,

  reducers: {

    clearLedgerEntries(state) {
      state.ledgerEntries = [];
      state.ledgerPagination = { ...emptyPagination };
    },

    clearCustomerLedger(state) {
      state.customerLedger = [];
      state.customerLedgerPagination = { ...emptyPagination };
      state.customerSummary = null;
    },

    clearLedgerError(state) {
      state.error = null;
    },

    resetCreateSuccess(state) {
      state.createSuccess = false;
    },

  },

  extraReducers: (builder) => {

    // =================================================
    // GET ALL LEDGER ENTRIES
    // =================================================

    builder

      .addCase(getLedgerEntries.pending, (state) => {

        state.loading = true;
        state.error = null;

      })

      .addCase(getLedgerEntries.fulfilled, (state, action) => {

        state.loading = false;

        const data = action.payload || {};

        state.ledgerEntries = data.results || [];
        state.ledgerPagination = mapPagination(data);

      })

      .addCase(getLedgerEntries.rejected, (state, action) => {

        state.loading = false;

        state.error =
          action.payload || "Failed to load ledger entries";

      });


    // =================================================
    // GET CUSTOMER LEDGER
    // =================================================

    builder

      .addCase(getCustomerLedger.pending, (state) => {

        state.loading = true;
        state.error = null;

      })

      .addCase(getCustomerLedger.fulfilled, (state, action) => {

        state.loading = false;

        const data = action.payload || {};

        state.customerLedger = data.results || [];
        state.customerLedgerPagination = mapPagination(data);

      })

      .addCase(getCustomerLedger.rejected, (state, action) => {

        state.loading = false;

        state.error =
          action.payload || "Failed to load customer ledger";

      });


    // =================================================
    // GET CUSTOMER LEDGER SUMMARY
    // Payload shape: { customer_id, customer_code, customer_name,
    //                  opening_balance, total_debit, total_credit, closing_balance }
    // =================================================

    builder

      .addCase(getCustomerLedgerSummary.pending, (state) => {

        state.error = null;

      })

      .addCase(getCustomerLedgerSummary.fulfilled, (state, action) => {

        state.customerSummary = action.payload || null;

      })

      .addCase(getCustomerLedgerSummary.rejected, (state, action) => {

        state.error = action.payload;

      });


    // =================================================
    // CREATE LEDGER ENTRY
    // Balances are calculated by the backend, so after success
    // re-fetch the ledger / summary instead of inserting locally.
    // =================================================

    builder

      .addCase(addLedgerEntry.pending, (state) => {

        state.loading = true;
        state.error = null;
        state.createSuccess = false;

      })

      .addCase(addLedgerEntry.fulfilled, (state) => {

        state.loading = false;
        state.createSuccess = true;

      })

      .addCase(addLedgerEntry.rejected, (state, action) => {

        state.loading = false;
        state.createSuccess = false;
        state.error = action.payload;

      });


    // =================================================
    // GET CUSTOMER WISE SUMMARY
    // Payload shape: { total_items, total_pages, current_page, next, previous, results }
    // NOTE: no loading/error handling on purpose. This is also used to fill
    // dropdowns, and must not affect the main table's loading / error state.
    // =================================================

    builder

      .addCase(getCustomerWiseSummary.fulfilled, (state, action) => {

        const data = action.payload || {};

        state.customerSummaries = data.results || [];
        state.customerSummariesPagination = mapPagination(data);

      });


    // =================================================
    // GET DASHBOARD SUMMARY
    // Payload shape: { total_receivable, total_invoice, total_collection,
    //                  total_credit, overdue_amount }
    // =================================================

    builder

      .addCase(getDashboardSummary.pending, (state) => {

        state.error = null;

      })

      .addCase(getDashboardSummary.fulfilled, (state, action) => {

        state.dashboardSummary = action.payload || null;

      })

      .addCase(getDashboardSummary.rejected, (state, action) => {

        state.error = action.payload;

      });

  },
});


export const {
  clearLedgerEntries,
  clearCustomerLedger,
  clearLedgerError,
  resetCreateSuccess,
} = ledgerSlice.actions;


export default ledgerSlice.reducer;