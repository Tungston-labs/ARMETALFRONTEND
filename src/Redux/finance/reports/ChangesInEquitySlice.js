import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchChangesInEquityReport,
  exportChangesInEquityReport,
} from "../../../services/finance/reports/ChangeInEquityService";

const initialState = {
  report: null,
  loading: false,
  error: null,
  exporting: false,
  exportError: null,
};

const errorMessage = (error) =>
  error?.response?.data?.detail ||
  error?.response?.data?.message ||
  error?.message ||
  "Unable to load the changes in equity report.";

export const getChangesInEquityReport = createAsyncThunk(
  "changesInEquityReport/fetch",
  async (filters, { rejectWithValue }) => {
    try {
      return await fetchChangesInEquityReport(filters);
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const exportChangesInEquityReportFile = createAsyncThunk(
  "changesInEquityReport/export",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await exportChangesInEquityReport(filters);
      return {
        blob: response.data,
        filename:
          response.headers?.["content-disposition"]?.match(
            /filename="?([^"]+)"?/,
          )?.[1] || "changes-in-equity-report.xlsx",
      };
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

const changesInEquityReportSlice = createSlice({
  name: "changesInEquityReport",
  initialState,
  reducers: {
    clearChangesInEquityReportError(state) {
      state.error = null;
      state.exportError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChangesInEquityReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChangesInEquityReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(getChangesInEquityReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(exportChangesInEquityReportFile.pending, (state) => {
        state.exporting = true;
        state.exportError = null;
      })
      .addCase(exportChangesInEquityReportFile.fulfilled, (state) => {
        state.exporting = false;
      })
      .addCase(exportChangesInEquityReportFile.rejected, (state, action) => {
        state.exporting = false;
        state.exportError = action.payload || action.error.message;
      });
  },
});

export const { clearChangesInEquityReportError } =
  changesInEquityReportSlice.actions;

export const selectChangesInEquityReport = (state) =>
  state.changesInEquityReport;

export default changesInEquityReportSlice.reducer;
