import {
  createSlice,
  createAsyncThunk,
  isAnyOf,
} from "@reduxjs/toolkit";

import {
  fetchJournalEntries,
  fetchJournalEntryById,
  createJournalEntry,
  updateJournalEntry,
  postJournalEntryById,
  voidJournalEntryById,
  deleteJournalEntryById,
} from "../../../services/finance/accounts/Journalservice";

const getError = (error) => error.response?.data || error.message;

// ASSUMPTION: confirm the exact status value your backend uses for voided entries
const VOIDED_STATUS = "voided";

const getCount = (data) =>
  data?.pagination?.count ??
  data?.count ??
  (Array.isArray(data) ? data.length : data?.results?.length) ??
  0;


// ---------- Thunks ----------

// params: { search, status, source, date_from, date_to, ordering, page, company }
export const getJournalEntries = createAsyncThunk(
  "journalEntry/getJournalEntries",
  async (params = {}, thunkAPI) => {
    try {
      return await fetchJournalEntries(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  }
);

// Stats cards: there is no summary endpoint, so this uses the "count" of
// 5 filtered list requests. params: { date_from, date_to }
export const getJournalEntryCounts = createAsyncThunk(
  "journalEntry/getJournalEntryCounts",
  async (params = {}, thunkAPI) => {
    try {
      const [total, auto, manual, draft, voided] = await Promise.all([
        fetchJournalEntries({ ...params }),
        fetchJournalEntries({ ...params, source: "auto" }),
        fetchJournalEntries({ ...params, source: "manual" }),
        fetchJournalEntries({ ...params, status: "draft" }),
        fetchJournalEntries({ ...params, status: VOIDED_STATUS }),
      ]);

      return {
        total: getCount(total),
        auto: getCount(auto),
        manual: getCount(manual),
        draft: getCount(draft),
        voided: getCount(voided),
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  }
);

export const getJournalEntryById = createAsyncThunk(
  "journalEntry/getJournalEntryById",
  async (id, thunkAPI) => {
    try {
      return await fetchJournalEntryById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  }
);

// data: { entry_date, reference_number, description, lines: [...] }
export const addJournalEntry = createAsyncThunk(
  "journalEntry/addJournalEntry",
  async (data, thunkAPI) => {
    try {
      return await createJournalEntry(data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  }
);

// arg: { id, data }
export const editJournalEntry = createAsyncThunk(
  "journalEntry/editJournalEntry",
  async ({ id, data }, thunkAPI) => {
    try {
      return await updateJournalEntry(id, data);
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  }
);

export const postJournalEntry = createAsyncThunk(
  "journalEntry/postJournalEntry",
  async (id, thunkAPI) => {
    try {
      return await postJournalEntryById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  }
);

export const voidJournalEntry = createAsyncThunk(
  "journalEntry/voidJournalEntry",
  async (id, thunkAPI) => {
    try {
      return await voidJournalEntryById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  }
);

export const removeJournalEntry = createAsyncThunk(
  "journalEntry/removeJournalEntry",
  async (id, thunkAPI) => {
    try {
      await deleteJournalEntryById(id);
      return id; // the API returns no body, so pass the id on to the reducer
    } catch (error) {
      return thunkAPI.rejectWithValue(getError(error));
    }
  }
);


// ---------- State ----------

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

  // Single entry (view / edit screen)
  selectedEntry: null,

  // API pagination
  pagination: { ...emptyPagination },

  // Stats cards { total, auto, manual, draft, voided }
  counts: null,
  countsLoading: false,

  loading: false,        // list
  detailLoading: false,  // single entry
  saving: false,         // create / update / post / void / delete

  error: null,
};

// Replace an entry in the list (and the selected one) with the fresh copy
const replaceEntry = (state, entry) => {
  if (!entry?.id) return;

  const index = state.entries.findIndex((item) => item.id === entry.id);
  if (index !== -1) state.entries[index] = entry;

  if (state.selectedEntry?.id === entry.id) state.selectedEntry = entry;
};


// ---------- Slice ----------

const journalEntrySlice = createSlice({
  name: "journalEntry",

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

      // ---------- List ----------

      .addCase(getJournalEntries.pending, (state) => {

        state.loading = true;
        state.error = null;

      })


      .addCase(getJournalEntries.fulfilled, (state, action) => {

        state.loading = false;

        const data = action.payload || {};

        // Supports a plain array, DRF { count, next, previous, results },
        // or { results, pagination: {...} } like your receivable API
        const results = Array.isArray(data) ? data : data.results || [];
        const pagination = data.pagination || {};

        const count = pagination.count ?? data.count ?? results.length;
        const pageSize = pagination.page_size || state.pagination.pageSize || 10;

        state.entries = results;

        state.pagination = {
          count,
          totalPages:
            pagination.total_pages || Math.max(1, Math.ceil(count / pageSize)),
          currentPage:
            pagination.current_page || Number(action.meta.arg?.page) || 1,
          pageSize,
          next: pagination.next_page ?? data.next ?? null,
          previous: pagination.previous_page ?? data.previous ?? null,
        };

      })


      .addCase(getJournalEntries.rejected, (state, action) => {

        state.loading = false;

        state.error =
          action.payload || "Failed to load journal entries";

      })


      // ---------- Counts (stats cards) ----------

      .addCase(getJournalEntryCounts.pending, (state) => {

        state.countsLoading = true;

      })


      .addCase(getJournalEntryCounts.fulfilled, (state, action) => {

        state.countsLoading = false;
        state.counts = action.payload;

      })


      .addCase(getJournalEntryCounts.rejected, (state) => {

        state.countsLoading = false;

      })


      // ---------- Single entry ----------

      .addCase(getJournalEntryById.pending, (state) => {

        state.detailLoading = true;
        state.error = null;

      })


      .addCase(getJournalEntryById.fulfilled, (state, action) => {

        state.detailLoading = false;
        state.selectedEntry = action.payload || null;

      })


      .addCase(getJournalEntryById.rejected, (state, action) => {

        state.detailLoading = false;

        state.error =
          action.payload || "Failed to load journal entry";

      })


      // ---------- Create ----------

      .addCase(addJournalEntry.fulfilled, (state, action) => {

        state.saving = false;

        if (action.payload?.id) {
          state.entries.unshift(action.payload);
          state.pagination.count += 1;
        }

      })


      // ---------- Delete ----------

      .addCase(removeJournalEntry.fulfilled, (state, action) => {

        state.saving = false;

        state.entries = state.entries.filter(
          (entry) => entry.id !== action.payload
        );

        state.pagination.count = Math.max(0, state.pagination.count - 1);

        if (state.selectedEntry?.id === action.payload) {
          state.selectedEntry = null;
        }

      })


      // ---------- Update / Post / Void ----------

      .addMatcher(
        isAnyOf(
          editJournalEntry.fulfilled,
          postJournalEntry.fulfilled,
          voidJournalEntry.fulfilled
        ),
        (state, action) => {

          state.saving = false;

          // If the API returns the updated entry, swap it in.
          // If not, refetch the list/detail after the thunk resolves.
          replaceEntry(state, action.payload);

        }
      )


      // ---------- Shared saving flag + errors for write actions ----------

      .addMatcher(
        isAnyOf(
          addJournalEntry.pending,
          editJournalEntry.pending,
          postJournalEntry.pending,
          voidJournalEntry.pending,
          removeJournalEntry.pending
        ),
        (state) => {

          state.saving = true;
          state.error = null;

        }
      )


      .addMatcher(
        isAnyOf(
          addJournalEntry.rejected,
          editJournalEntry.rejected,
          postJournalEntry.rejected,
          voidJournalEntry.rejected,
          removeJournalEntry.rejected
        ),
        (state, action) => {

          state.saving = false;

          state.error =
            action.payload || "Journal entry action failed";

        }
      );

  },
});


export const {
  clearJournalEntries,
  clearSelectedJournalEntry,
  clearJournalError,
} = journalEntrySlice.actions;


export default journalEntrySlice.reducer;