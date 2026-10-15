import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchJournalEntries,
  fetchJournalEntryById,
  createJournalEntryApi,
  updateJournalEntryApi,
  postJournalEntryApi,
  voidJournalEntryApi,
  deleteJournalEntryApi,
} from "../../../services/finance/accounts/Journalservices";


/* ------------------------------ Thunks ------------------------------ */

export const getJournalEntries = createAsyncThunk(
  "journal/getJournalEntries",
  async (params = {}, thunkAPI) => {
    try {
      return await fetchJournalEntries(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getJournalEntry = createAsyncThunk(
  "journal/getJournalEntry",
  async (id, thunkAPI) => {
    try {
      return await fetchJournalEntryById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createJournalEntry = createAsyncThunk(
  "journal/createJournalEntry",
  async (payload, thunkAPI) => {
    try {
      return await createJournalEntryApi(payload);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateJournalEntry = createAsyncThunk(
  "journal/updateJournalEntry",
  async ({ id, data }, thunkAPI) => {
    try {
      return await updateJournalEntryApi(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const postJournalEntry = createAsyncThunk(
  "journal/postJournalEntry",
  async (id, thunkAPI) => {
    try {
      return await postJournalEntryApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const voidJournalEntry = createAsyncThunk(
  "journal/voidJournalEntry",
  async (id, thunkAPI) => {
    try {
      return await voidJournalEntryApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteJournalEntry = createAsyncThunk(
  "journal/deleteJournalEntry",
  async (id, thunkAPI) => {
    try {
      return await deleteJournalEntryApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


/* ------------------------------ State ------------------------------- */

const emptyPagination = {
  count: 0,
  totalPages: 1,
  currentPage: 1,
  pageSize: 10,
  next: null,
  previous: null,
};

const initialState = {
  // Journal entry rows
  entries: [],

  // Single entry (detail / edit screen)
  selectedEntry: null,

  // API pagination
  pagination: { ...emptyPagination },

  // List loading
  loading: false,

  // Create / update / post / void / delete in progress
  submitting: false,

  error: null,
};

// Merge a returned entry into the list + selectedEntry
const mergeEntry = (state, updated) => {
  if (!updated || !updated.id) return;

  const index = state.entries.findIndex((e) => e.id === updated.id);
  if (index !== -1) {
    state.entries[index] = { ...state.entries[index], ...updated };
  }

  if (state.selectedEntry && state.selectedEntry.id === updated.id) {
    state.selectedEntry = { ...state.selectedEntry, ...updated };
  }
};

// Shared handlers for the mutation thunks
const onSubmitPending = (state) => {
  state.submitting = true;
  state.error = null;
};

const onSubmitRejected = (state, action) => {
  state.submitting = false;
  state.error = action.payload || "Journal entry request failed";
};


/* ------------------------------ Slice ------------------------------- */

const journalSlice = createSlice({
  name: "journal",

  initialState,

  reducers: {
    clearJournalEntries(state) {
      state.entries = [];
      state.pagination = { ...emptyPagination };
    },

    clearSelectedJournalEntry(state) {
      state.selectedEntry = null;
    },

    clearJournalError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ---------- List ---------- */
      .addCase(getJournalEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getJournalEntries.fulfilled, (state, action) => {
        state.loading = false;

        const data = action.payload || {};

        // Supports a plain array, DRF {count,next,previous,results},
        // or your custom {results, pagination:{...}} response shape
        if (Array.isArray(data)) {
          state.entries = data;
          state.pagination = { ...emptyPagination, count: data.length };
          return;
        }

        const pagination = data.pagination || {};

        state.entries = data.results || [];

        state.pagination = {
          count: pagination.count ?? data.count ?? 0,
          totalPages: pagination.total_pages || 1,
          currentPage: pagination.current_page || 1,
          pageSize: pagination.page_size || 10,
          next: pagination.next_page ?? data.next ?? null,
          previous: pagination.previous_page ?? data.previous ?? null,
        };
      })

      .addCase(getJournalEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load journal entries";
      })

      /* ---------- Detail ---------- */
      .addCase(getJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getJournalEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEntry = action.payload;
      })

      .addCase(getJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load journal entry";
      })

      /* ---------- Create ---------- */
      .addCase(createJournalEntry.pending, onSubmitPending)

      .addCase(createJournalEntry.fulfilled, (state, action) => {
        state.submitting = false;
        state.entries.unshift(action.payload);
        state.pagination.count += 1;
        state.selectedEntry = action.payload;
      })

      .addCase(createJournalEntry.rejected, onSubmitRejected)

      /* ---------- Update ---------- */
      .addCase(updateJournalEntry.pending, onSubmitPending)

      .addCase(updateJournalEntry.fulfilled, (state, action) => {
        state.submitting = false;
        mergeEntry(state, action.payload);
      })

      .addCase(updateJournalEntry.rejected, onSubmitRejected)

      /* ---------- Post ---------- */
      .addCase(postJournalEntry.pending, onSubmitPending)

      .addCase(postJournalEntry.fulfilled, (state, action) => {
        state.submitting = false;
        mergeEntry(state, action.payload);
      })

      .addCase(postJournalEntry.rejected, onSubmitRejected)

      /* ---------- Void ---------- */
      .addCase(voidJournalEntry.pending, onSubmitPending)

      .addCase(voidJournalEntry.fulfilled, (state, action) => {
        state.submitting = false;
        mergeEntry(state, action.payload);
      })

      .addCase(voidJournalEntry.rejected, onSubmitRejected)

      /* ---------- Delete ---------- */
      .addCase(deleteJournalEntry.pending, onSubmitPending)

      .addCase(deleteJournalEntry.fulfilled, (state, action) => {
        state.submitting = false;
        state.entries = state.entries.filter((e) => e.id !== action.payload);
        state.pagination.count = Math.max(0, state.pagination.count - 1);

        if (state.selectedEntry && state.selectedEntry.id === action.payload) {
          state.selectedEntry = null;
        }
      })

      .addCase(deleteJournalEntry.rejected, onSubmitRejected);
  },
});


export const {
  clearJournalEntries,
  clearSelectedJournalEntry,
  clearJournalError,
} = journalSlice.actions;


export default journalSlice.reducer;