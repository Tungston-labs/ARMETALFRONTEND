import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import balanceSheetService from "../../../services/finance/reports/BalanceSheetService";

const initialState = {
  report: null,
  loading: false,
  error: null,
};

export const fetchBalanceSheet = createAsyncThunk(
  "balanceSheet/fetchBalanceSheet",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await balanceSheetService.getBalanceSheet(params);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load balance sheet.",
      );
    }
  },
);

const balanceSheetSlice = createSlice({
  name: "balanceSheet",
  initialState,
  reducers: {
    clearBalanceSheetError(state) {
      state.error = null;
    },
    clearBalanceSheet(state) {
      state.report = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalanceSheet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBalanceSheet.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
        state.error = null;
      })
      .addCase(fetchBalanceSheet.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to load balance sheet.";
      });
  },
});

export const { clearBalanceSheetError, clearBalanceSheet } =
  balanceSheetSlice.actions;

export default balanceSheetSlice.reducer;
