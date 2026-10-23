import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getPaymentReport } from "../../../services/finance/reports/paymentReportService";
import { extractPaymentRows, normalizePayment } from "../../../Pages/FinanceModule/REPORTS/PaymentReports/PaymentReportConfig";

export const fetchPaymentReport = createAsyncThunk(
  "paymentReport/fetchPaymentReport",
  async (params = {}, { rejectWithValue }) => {
    try {
      const payload = await getPaymentReport(params);
      const rawRows = extractPaymentRows(payload);
      return {
        rows: rawRows.map(normalizePayment),
        summary:
          payload?.summary ??
          payload?.data?.summary ??
          payload?.aggregates ??
          payload?.data?.aggregates ??
          null,
        pagination: {
          count:
            payload?.count ??
            payload?.total_count ??
            payload?.data?.count ??
            rawRows.length,
          next: payload?.next ?? payload?.data?.next ?? null,
          previous: payload?.previous ?? payload?.data?.previous ?? null,
        },
        raw: payload,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          error.message ||
          "Unable to load payment report.",
      );
    }
  },
);

const paymentReportSlice = createSlice({
  name: "paymentReport",
  initialState: {
    rows: [],
    summary: null,
    pagination: { count: 0, next: null, previous: null },
    loading: false,
    error: null,
    lastFetched: null,
  },
  reducers: {
    clearPaymentReportError(state) {
      state.error = null;
    },
    resetPaymentReport(state) {
      state.rows = [];
      state.summary = null;
      state.pagination = { count: 0, next: null, previous: null };
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentReport.fulfilled, (state, action) => {
        state.loading = false;
        state.rows = action.payload.rows;
        state.summary = action.payload.summary;
        state.pagination = action.payload.pagination;
        state.lastFetched = Date.now();
      })
      .addCase(fetchPaymentReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to load payment report.";
      });
  },
});

export const { clearPaymentReportError, resetPaymentReport } =
  paymentReportSlice.actions;
export default paymentReportSlice.reducer;
