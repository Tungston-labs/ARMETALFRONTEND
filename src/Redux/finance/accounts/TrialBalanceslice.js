import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchTrialBalance,
  fetchTrialBalanceDashboard,
} from "../../../services/finance/accounts/TrialBalanceservice";

export const getTrialBalance = createAsyncThunk(
  "trialBalance/getTrialBalance",
  async (params = {}, thunkAPI) => {
    try {
      return await fetchTrialBalance(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);

export const getTrialBalanceDashboard = createAsyncThunk(
  "trialBalance/getTrialBalanceDashboard",
  async (params = {}, thunkAPI) => {
    try {
      return await fetchTrialBalanceDashboard(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


const emptyTotals = {
  debit: "0.00",
  credit: "0.00",
  difference: "0.00",
  isBalanced: true,
  status: "",
};

const initialState = {
  // Account groups (assets, liabilities, revenue, equity, expense)
  groups: [],

  // Footer totals
  totals: { ...emptyTotals },

  // Date range returned by the API
  dateFrom: null,
  dateTo: null,

  // Dashboard cards
  dashboard: null,

  loading: false,
  dashboardLoading: false,

  error: null,
  dashboardError: null,
};


const trialBalanceSlice = createSlice({
  name: "trialBalance",

  initialState,

  reducers: {

    clearTrialBalance(state) {
      state.groups = [];
      state.totals = { ...emptyTotals };
      state.dateFrom = null;
      state.dateTo = null;
      state.dashboard = null;
    },

    clearTrialBalanceError(state) {
      state.error = null;
      state.dashboardError = null;
    },

  },

  extraReducers: (builder) => {

    builder

      // ---------- Trial balance list ----------

      .addCase(getTrialBalance.pending, (state) => {

        state.loading = true;
        state.error = null;

      })


      .addCase(getTrialBalance.fulfilled, (state, action) => {

        state.loading = false;

        const data = action.payload || {};

        state.groups = data.groups || [];
        state.dateFrom = data.date_from || null;
        state.dateTo = data.date_to || null;

        state.totals = {
          debit: data.grand_total_debit || "0.00",
          credit: data.grand_total_credit || "0.00",
          difference: data.difference || "0.00",
          isBalanced: Boolean(data.is_balanced),
          status: data.balance_status || "",
        };

      })


      .addCase(getTrialBalance.rejected, (state, action) => {

        state.loading = false;

        state.error =
          action.payload || "Failed to load trial balance";

      })


      // ---------- Dashboard ----------

      .addCase(getTrialBalanceDashboard.pending, (state) => {

        state.dashboardLoading = true;
        state.dashboardError = null;

      })


      .addCase(getTrialBalanceDashboard.fulfilled, (state, action) => {

        state.dashboardLoading = false;
        state.dashboard = action.payload || null;

      })


      .addCase(getTrialBalanceDashboard.rejected, (state, action) => {

        state.dashboardLoading = false;

        state.dashboardError =
          action.payload || "Failed to load trial balance dashboard";

      });

  },
});


export const {
  clearTrialBalance,
  clearTrialBalanceError,
} = trialBalanceSlice.actions;


export default trialBalanceSlice.reducer;