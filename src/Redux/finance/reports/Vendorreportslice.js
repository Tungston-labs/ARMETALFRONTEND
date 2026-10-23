import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { fetchVendorReport } from "../../../services/finance/reports/Vendorreportservices";

export const getVendorReport = createAsyncThunk(
  "vendorReport/getVendorReport",
  async (params = {}, thunkAPI) => {
    try {
      return await fetchVendorReport(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


const emptyKpis = {
  totalVendors: 0,
  totalBills: 0,
  totalPayments: 0,
  outstandingPayables: 0,
};

const emptyGraphs = {
  monthlyPurchaseTrend: {
    year: null,
    data: {},
  },
  vendorPaymentStatus: null,
};

const emptyPagination = {
  count: 0,
  totalPages: 1,
  currentPage: 1,
  pageSize: 10,
  next: null,
  previous: null,
};

const initialState = {
  // Vendor rows
  report: [],

  // KPI cards
  kpis: { ...emptyKpis },

  // Charts
  graphs: { ...emptyGraphs },

  // Filters echoed back by the API
  appliedFilters: null,

  // API pagination
  pagination: { ...emptyPagination },

  loading: false,
  error: null,
};


const vendorReportSlice = createSlice({
  name: "vendorReport",

  initialState,

  reducers: {

    clearVendorReport(state) {
      state.report = [];
      state.kpis = { ...emptyKpis };
      state.graphs = { ...emptyGraphs };
      state.appliedFilters = null;
      state.pagination = { ...emptyPagination };
    },

    clearVendorReportError(state) {
      state.error = null;
    },

  },

  extraReducers: (builder) => {

    builder

      .addCase(getVendorReport.pending, (state) => {

        state.loading = true;
        state.error = null;

      })


      .addCase(getVendorReport.fulfilled, (state, action) => {

        state.loading = false;

        const data = action.payload || {};
        const kpis = data.kpis || {};
        const graphs = data.graphs || {};
        const trend = graphs.monthly_purchase_trend || {};
        const paymentStatus = graphs.vendor_payment_status || null;
        const pagination = data.pagination || {};

        state.report = data.results || [];

        state.appliedFilters = data.filters || null;

        state.kpis = {
          totalVendors: kpis.total_vendors || 0,
          totalBills: kpis.total_bills || 0,
          totalPayments: kpis.total_payments || 0,
          outstandingPayables: kpis.outstanding_payables || 0,
        };

        state.graphs = {
          monthlyPurchaseTrend: {
            year: trend.year || null,
            data: trend.data || {},
          },
          vendorPaymentStatus: paymentStatus && {
            year: paymentStatus.year,
            month: paymentStatus.month,
            paidAmount: paymentStatus.data?.paid_amount || 0,
            partiallyPaidAmount:
              paymentStatus.data?.partially_paid_amount || 0,
            unpaidAmount: paymentStatus.data?.unpaid_amount || 0,
            overdueAmount: paymentStatus.data?.overdue_amount || 0,
            totalOutstandingAmount:
              paymentStatus.data?.total_outstanding_amount || 0,
          },
        };

        state.pagination = {
          count: pagination.count || 0,
          totalPages: pagination.total_pages || 1,
          currentPage: pagination.current_page || 1,
          pageSize: pagination.page_size || 10,
          next: pagination.next_page || null,
          previous: pagination.previous_page || null,
        };

      })


      .addCase(getVendorReport.rejected, (state, action) => {

        state.loading = false;

        state.error =
          action.payload || "Failed to load vendor report";

      });

  },
});


export const {
  clearVendorReport,
  clearVendorReportError,
} = vendorReportSlice.actions;


export default vendorReportSlice.reducer;