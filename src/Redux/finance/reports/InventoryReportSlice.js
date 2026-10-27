// services/finance/reports/InventoryReportSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  fetchInventoryReport,
  exportInventoryReportCsv,
  downloadBlob,
} from "../../../services/finance/reports/InventoryReportService";

const initialState = {
  report: {
    total_items: 0,
    total_pages: 0,
    current_page: 1,
    next: null,
    previous: null,
    results: [],
    total_stock_items: 0,
    in_stock: 0,
    low_stock: 0,
    out_of_stock: 0,
    total_inventory_value: 0,
  },
  loading: false,
  exporting: false,
  error: null,
  exportError: null,
};

export const fetchInventoryReportThunk = createAsyncThunk(
  "inventoryReport/fetch",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await fetchInventoryReport(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          detail: error.message || "Unable to load inventory report.",
        }
      );
    }
  }
);

export const exportInventoryReportThunk = createAsyncThunk(
  "inventoryReport/export",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { blob, filename } =
        await exportInventoryReportCsv(params);

      downloadBlob(blob, filename);

      return filename;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          detail: error.message || "Unable to export inventory report.",
        }
      );
    }
  }
);

const inventoryReportSlice = createSlice({
  name: "inventoryReport",
  initialState,
  reducers: {
    clearInventoryReportError(state) {
      state.error = null;
    },
    clearInventoryExportError(state) {
      state.exportError = null;
    },
    resetInventoryReport() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryReportThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryReportThunk.fulfilled, (state, action) => {
        state.loading = false;

        const response = action.payload || {};

        state.report = {
          ...initialState.report,
          ...response,
          results: Array.isArray(response.results)
            ? response.results
            : [],
        };
      })
      .addCase(fetchInventoryReportThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || action.error.message || "Request failed.";
      })
      .addCase(exportInventoryReportThunk.pending, (state) => {
        state.exporting = true;
        state.exportError = null;
      })
      .addCase(exportInventoryReportThunk.fulfilled, (state) => {
        state.exporting = false;
      })
      .addCase(exportInventoryReportThunk.rejected, (state, action) => {
        state.exporting = false;
        state.exportError =
          action.payload || action.error.message || "Export failed.";
      });
  },
});

export const {
  clearInventoryReportError,
  clearInventoryExportError,
  resetInventoryReport,
} = inventoryReportSlice.actions;

export default inventoryReportSlice.reducer;
