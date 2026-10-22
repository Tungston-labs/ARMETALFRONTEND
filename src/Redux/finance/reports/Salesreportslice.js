// redux/finance/salesReportSlice.js  (adjust the path to match your project)
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchSalesReport,
  exportSalesReportCsv,
  downloadBlob,
} from "../../../services/finance/reports/Salesreportservice";

const PAGE_SIZE = 10;

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const emptyChart = (year = new Date().getFullYear()) => ({
  year,
  months: MONTH_LABELS.map((label, index) => ({
    month: index + 1,
    label,
    revenue: 0,
  })),
});

const emptySummary = {
  total_sales_revenue: 0,
  total_invoices: 0,
  products_sold: 0,
  payments_received: 0,
  outstanding_receivables: 0,
};

const emptyPagination = {
  count: 0,
  totalPages: 1,
  currentPage: 1,
  pageSize: PAGE_SIZE,
  next: null,
  previous: null,
};


export const getSalesReport = createAsyncThunk(
  "salesReport/getSalesReport",
  async (params = {}, thunkAPI) => {
    try {
      return await fetchSalesReport(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


export const exportSalesReport = createAsyncThunk(
  "salesReport/exportSalesReport",
  async (params = {}, thunkAPI) => {
    try {
      const { blob, filename } = await exportSalesReportCsv(params);
      downloadBlob(blob, filename);
      return true;
    } catch (error) {
      // blob error bodies can't be read directly, so use a simple message
      return thunkAPI.rejectWithValue(
        error.response?.status
          ? `Export failed (${error.response.status})`
          : error.message
      );
    }
  }
);


const initialState = {
  // Invoice rows
  invoices: [],

  // Summary cards
  summary: { ...emptySummary },

  // 12-month chart for the selected year
  chart: emptyChart(),

  // API pagination
  pagination: { ...emptyPagination },

  loading: false,
  error: null,

  exporting: false,
  exportError: null,

  // used to ignore stale responses
  currentRequestId: null,
};


const salesReportSlice = createSlice({
  name: "salesReport",

  initialState,

  reducers: {

    clearSalesReport(state) {
      state.invoices = [];
      state.summary = { ...emptySummary };
      state.chart = emptyChart();
      state.pagination = { ...emptyPagination };
    },

    clearSalesReportError(state) {
      state.error = null;
      state.exportError = null;
    },

  },

  extraReducers: (builder) => {

    builder

      // ---------- Report ----------
      .addCase(getSalesReport.pending, (state, action) => {

        state.loading = true;
        state.error = null;
        state.currentRequestId = action.meta.requestId;

      })


      .addCase(getSalesReport.fulfilled, (state, action) => {

        // Ignore the response if a newer request has started
        if (action.meta.requestId !== state.currentRequestId) return;

        state.loading = false;

        const data = action.payload || {};
        const requestedPage = Number(action.meta.arg?.page) || 1;
        const count = data.count || 0;

        state.invoices = data.results || [];
        state.summary = data.summary || { ...emptySummary };
        state.chart = data.chart || emptyChart(action.meta.arg?.year);

        state.pagination = {
          count,
          totalPages: Math.max(1, Math.ceil(count / PAGE_SIZE)),
          currentPage: requestedPage,
          pageSize: PAGE_SIZE,
          next: data.next || null,
          previous: data.previous || null,
        };

      })


      .addCase(getSalesReport.rejected, (state, action) => {

        if (action.meta.requestId !== state.currentRequestId) return;

        state.loading = false;

        state.error =
          action.payload || "Failed to load sales report";

      })


      // ---------- Export ----------
      .addCase(exportSalesReport.pending, (state) => {

        state.exporting = true;
        state.exportError = null;

      })


      .addCase(exportSalesReport.fulfilled, (state) => {

        state.exporting = false;

      })


      .addCase(exportSalesReport.rejected, (state, action) => {

        state.exporting = false;

        state.exportError =
          action.payload || "Failed to export sales report";

      });

  },
});


export const {
  clearSalesReport,
  clearSalesReportError,
} = salesReportSlice.actions;


export default salesReportSlice.reducer;