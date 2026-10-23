import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPayables } from "../../../services/finance/accounts/Payableservices";

export const getPayables = createAsyncThunk(
  "payable/getPayables",
  async (params = {}, thunkAPI) => {
    try {
      return await fetchPayables(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
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

const emptyDashboard = {
  total_payable: "0.00",
  not_yet_due: "0.00",
  overdue_to_vendors: "0.00",
  due_in_next_14_days: "0.00",
  vendors_overdue_count: 0,
};

const initialState = {
  payables: [],
  dashboard: { ...emptyDashboard },
  pagination: { ...emptyPagination },
  loading: false,
  error: null,
};

const payableSlice = createSlice({
  name: "payable",
  initialState,
  reducers: {
    clearPayables(state) {
      state.payables = [];
      state.dashboard = { ...emptyDashboard };
      state.pagination = { ...emptyPagination };
    },
    clearPayableError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPayables.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPayables.fulfilled, (state, action) => {
        state.loading = false;

        const data = action.payload || {};
        const pagination = data.pagination || {};

        state.payables = data.results || [];
        state.dashboard = data.dashboard || { ...emptyDashboard };
        state.pagination = {
          count: pagination.count || 0,
          totalPages: pagination.total_pages || 1,
          currentPage: pagination.current_page || 1,
          pageSize: pagination.page_size || 10,
          next: pagination.next_page || null,
          previous: pagination.previous_page || null,
        };
      })
      .addCase(getPayables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load accounts payable";
      });
  },
});

export const { clearPayables, clearPayableError } = payableSlice.actions;

export default payableSlice.reducer;