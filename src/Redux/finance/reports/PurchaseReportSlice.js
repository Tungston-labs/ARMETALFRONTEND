import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import purchaseReportService from "../../../services/finance/reports/PurchaseReportService";

export const fetchPurchaseReport = createAsyncThunk(
  "purchaseReport/fetchPurchaseReport",
  async (_, { rejectWithValue }) => {
    try {
      return await purchaseReportService.getPurchaseReport();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Failed to load purchase report.",
      );
    }
  },
);

const initialState = {
  summary: {
    totalPurchases: 0,
    totalPO: 0,
    paymentsMade: 0,
    purchaseReturns: 0,
    outstandingPayables: 0,
  },
  purchaseOrders: [],
  monthlyTrend: [],
  loading: false,
  error: null,
  lastFetched: null,
};

const purchaseReportSlice = createSlice({
  name: "purchaseReport",
  initialState,
  reducers: {
    clearPurchaseReportError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPurchaseReport.fulfilled, (state, action) => {
        state.loading = false;
        state.summary = action.payload.summary;
        state.purchaseOrders = action.payload.purchaseOrders;
        state.monthlyTrend = action.payload.monthlyTrend;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchPurchaseReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to fetch purchase report.";
      });
  },
});

export const { clearPurchaseReportError } = purchaseReportSlice.actions;

export default purchaseReportSlice.reducer;
