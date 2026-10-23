import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { fetchCustomerReport } from "../../../services/finance/reports/Customerreportservices";

export const getCustomerReport = createAsyncThunk(
  "customerReport/getCustomerReport",
  async (params = {}, thunkAPI) => {
    try {
      return await fetchCustomerReport(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


const emptySummary = {
  totalCustomers: 0,
  totalRevenue: 0,
  paymentReceived: 0,
  outstandingPayable: 0,
  totalInvoices: 0,
};

const emptyCharts = {
  monthlyRevenue: {
    year: null,
    monthlyAmounts: {},
  },
  paymentStatus: null,
};

const emptyPagination = {
  count: 0,
  next: null,
  previous: null,
};

const initialState = {
  // Invoice rows
  report: [],

  // Dashboard cards
  summary: { ...emptySummary },

  // Charts
  charts: { ...emptyCharts },

  // API pagination
  pagination: { ...emptyPagination },

  loading: false,
  error: null,
};


const customerReportSlice = createSlice({
  name: "customerReport",

  initialState,

  reducers: {

    clearCustomerReport(state) {
      state.report = [];
      state.summary = { ...emptySummary };
      state.charts = { ...emptyCharts };
      state.pagination = { ...emptyPagination };
    },

    clearCustomerReportError(state) {
      state.error = null;
    },

  },

  extraReducers: (builder) => {

    builder

      .addCase(getCustomerReport.pending, (state) => {

        state.loading = true;
        state.error = null;

      })


      .addCase(getCustomerReport.fulfilled, (state, action) => {

        state.loading = false;

        const data = action.payload || {};
        const summary = data.summary || {};
        const charts = data.charts || {};
        const monthly = charts.monthly_revenue || {};
        const status = charts.payment_status || null;

        state.report = data.results || [];

        state.summary = {
          totalCustomers: summary.total_customers || 0,
          totalRevenue: summary.total_revenue || 0,
          paymentReceived: summary.payment_received || 0,
          outstandingPayable: summary.outstanding_payable || 0,
          totalInvoices: summary.total_invoices || 0,
        };

        state.charts = {
          monthlyRevenue: {
            year: monthly.year || null,
            monthlyAmounts: monthly.monthly_amounts || {},
          },
          paymentStatus: status && {
            month: status.month,
            monthName: status.month_name,
            year: status.year,
            paidAmount: status.paid_amount || 0,
            partiallyPaidAmount: status.partially_paid_amount || 0,
            unpaidAmount: status.unpaid_amount || 0,
            overdueAmount: status.overdue_amount || 0,
            totalOutstandingAmount: status.total_outstanding_amount || 0,
          },
        };

        state.pagination = {
          count: data.count || 0,
          next: data.next || null,
          previous: data.previous || null,
        };

      })


      .addCase(getCustomerReport.rejected, (state, action) => {

        state.loading = false;

        state.error =
          action.payload || "Failed to load customer report";

      });

  },
});


export const {
  clearCustomerReport,
  clearCustomerReportError,
} = customerReportSlice.actions;


export default customerReportSlice.reducer;