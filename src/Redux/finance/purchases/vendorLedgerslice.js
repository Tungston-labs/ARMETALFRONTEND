import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  listVendorLedgerService,
  getVendorLedgerService,
  createVendorLedgerService,
  updateVendorLedgerService,
  patchVendorLedgerService,
  deleteVendorLedgerService,
  getVendorLedgerSummaryService,
} from "../../../services/finance/purchases/vendorLedgerservice";

const getErrorPayload = (err) =>
  err.response?.data ||
  (err.response
    ? err.message
    : "Unable to connect to the server. Please check your connection and try again.");

// ======================================================
// ACTIONS
// ======================================================
export const getVendorLedgers = createAsyncThunk(
  "vendorLedger/list",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await listVendorLedgerService(params);
    } catch (err) {
      return rejectWithValue(getErrorPayload(err));
    }
  }
);

export const getVendorLedgerById = createAsyncThunk(
  "vendorLedger/getById",
  async (id, { rejectWithValue }) => {
    try {
      return await getVendorLedgerService(id);
    } catch (err) {
      return rejectWithValue(getErrorPayload(err));
    }
  }
);

export const createVendorLedger = createAsyncThunk(
  "vendorLedger/create",
  async (data, { rejectWithValue }) => {
    try {
      return await createVendorLedgerService(data);
    } catch (err) {
      return rejectWithValue(getErrorPayload(err));
    }
  }
);

export const updateVendorLedger = createAsyncThunk(
  "vendorLedger/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateVendorLedgerService(id, data);
    } catch (err) {
      return rejectWithValue(getErrorPayload(err));
    }
  }
);

export const patchVendorLedger = createAsyncThunk(
  "vendorLedger/patch",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await patchVendorLedgerService(id, data);
    } catch (err) {
      return rejectWithValue(getErrorPayload(err));
    }
  }
);

export const deleteVendorLedger = createAsyncThunk(
  "vendorLedger/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteVendorLedgerService(id);
      return id;
    } catch (err) {
      return rejectWithValue(getErrorPayload(err));
    }
  }
  );
  // Usage: dispatch(getVendorLedgerSummary({ search, status, date_from, date_to }))
export const getVendorLedgerSummary = createAsyncThunk(
  "vendorLedger/summary",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getVendorLedgerSummaryService(params);
    } catch (err) {
      return rejectWithValue(getErrorPayload(err));
    }
  }

);

// ======================================================
// SLICE
// ======================================================
const initialState = {
  list: [],
  selected: null,
  pagination: {
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    next: null,
    previous: null,
  },
    summary: [],
  summaryCards: null,
  summaryFilters: null,
  summaryLoading: false,
  summaryError: null,
  loading: false, // list / detail loading (table spinner)
  saving: false, // create / update / delete in progress
  error: null,
};

const replaceInList = (state, updated) => {
  const index = state.list.findIndex((item) => item.id === updated.id);
  if (index !== -1) {
    state.list[index] = { ...state.list[index], ...updated };
  }
  if (state.selected?.id === updated.id) {
    state.selected = { ...state.selected, ...updated };
  }
};

const vendorLedgerSlice = createSlice({
  name: "vendorLedger",
  initialState,
  reducers: {
    clearVendorLedgerError: (state) => {
      state.error = null;
    },
    clearSelectedLedger: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // LIST
      .addCase(getVendorLedgers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVendorLedgers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.list = action.payload.results || [];
        state.pagination = {
          totalItems: action.payload.total_items ?? 0,
          totalPages: action.payload.total_pages ?? 1,
          currentPage: action.payload.current_page ?? 1,
          next: action.payload.next,
          previous: action.payload.previous,
        };
      })
      .addCase(getVendorLedgers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GET ONE
      .addCase(getVendorLedgerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getVendorLedgerById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.selected = action.payload;
      })
      .addCase(getVendorLedgerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE (the page refetches the list after success)
      .addCase(createVendorLedger.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createVendorLedger.fulfilled, (state) => {
        state.saving = false;
        state.error = null;
      })
      .addCase(createVendorLedger.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      // UPDATE (PUT)
      .addCase(updateVendorLedger.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(updateVendorLedger.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        replaceInList(state, action.payload);
      })
      .addCase(updateVendorLedger.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      // PATCH
      .addCase(patchVendorLedger.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(patchVendorLedger.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        replaceInList(state, action.payload);
      })
      .addCase(patchVendorLedger.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteVendorLedger.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(deleteVendorLedger.fulfilled, (state, action) => {
        state.saving = false;
        state.error = null;
        state.list = state.list.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteVendorLedger.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })
       // SUMMARY
      .addCase(getVendorLedgerSummary.pending, (state) => {
        state.summaryLoading = true;
        state.summaryError = null;
      })
      .addCase(getVendorLedgerSummary.fulfilled, (state, action) => {
        state.summaryLoading = false;
        state.summary = action.payload?.data || [];
        state.summaryCards = action.payload?.cards || null;
        state.summaryFilters = action.payload?.filters || null;
      })
      .addCase(getVendorLedgerSummary.rejected, (state, action) => {
        state.summaryLoading = false;
        state.summaryError = action.payload;
      });
  },
});

export const { clearVendorLedgerError, clearSelectedLedger } =
  vendorLedgerSlice.actions;
export default vendorLedgerSlice.reducer;