import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { fetchReceivables } from "../../../services/finance/accounts/Receivableservices";

export const getReceivables = createAsyncThunk(
  "receivable/getReceivables",
  async (params = {}, thunkAPI) => {
    try {
      return await fetchReceivables(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


const emptyPagination = {
  count: 0,
  totalPages: 1,
  currentPage: 1,
  pageSize: 10,
  next: null,
  previous: null,
};

const initialState = {
  // Invoice rows
  receivables: [],

  // Dashboard cards
  dashboard: null,

  // API pagination
  pagination: { ...emptyPagination },

  loading: false,
  error: null,
};


const receivableSlice = createSlice({
  name: "receivable",

  initialState,

  reducers: {

    clearReceivables(state) {
      state.receivables = [];
      state.dashboard = null;
      state.pagination = { ...emptyPagination };
    },

    clearReceivableError(state) {
      state.error = null;
    },

  },

  extraReducers: (builder) => {

    builder

      .addCase(getReceivables.pending, (state) => {

        state.loading = true;
        state.error = null;

      })


      .addCase(getReceivables.fulfilled, (state, action) => {

        state.loading = false;

        const data = action.payload || {};
        const pagination = data.pagination || {};

        state.receivables = data.results || [];
        state.dashboard = data.dashboard || null;

        state.pagination = {
          count: pagination.count || 0,
          totalPages: pagination.total_pages || 1,
          currentPage: pagination.current_page || 1,
          pageSize: pagination.page_size || 10,
          next: pagination.next_page || null,
          previous: pagination.previous_page || null,
        };

      })


      .addCase(getReceivables.rejected, (state, action) => {

        state.loading = false;

        state.error =
          action.payload || "Failed to load accounts receivable";

      });

  },
});


export const {
  clearReceivables,
  clearReceivableError,
} = receivableSlice.actions;


export default receivableSlice.reducer;