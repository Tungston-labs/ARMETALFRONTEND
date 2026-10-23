// src/redux/slices/finance/accounts/expenseSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchExpenses,
  fetchExpenseById,
  createExpenseApi,
  updateExpenseApi,
  patchExpenseApi,
  markExpenseUnpaidApi,
  deleteExpenseApi,
  fetchActiveBankAccounts,
} from "../../../services/finance/accounts/Expenseservices";

/* ------------------------------ Thunks ------------------------------ */

const makeThunk = (type, apiCall) =>
  createAsyncThunk(type, async (arg, thunkAPI) => {
    try {
      return await apiCall(arg);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  });

export const getExpenses = makeThunk("expense/getExpenses", (params = {}) =>
  fetchExpenses(params)
);

export const getExpenseDetails = makeThunk("expense/getExpenseDetails", (id) =>
  fetchExpenseById(id)
);

export const createExpense = makeThunk("expense/createExpense", (payload) =>
  createExpenseApi(payload)
);

export const updateExpense = makeThunk(
  "expense/updateExpense",
  ({ id, data }) => updateExpenseApi(id, data)
);

export const patchExpense = makeThunk(
  "expense/patchExpense",
  ({ id, data }) => patchExpenseApi(id, data)
);

export const markExpenseUnpaid = makeThunk("expense/markExpenseUnpaid", (id) =>
  markExpenseUnpaidApi(id)
);

export const deleteExpense = makeThunk("expense/deleteExpense", (id) =>
  deleteExpenseApi(id)
);

export const getActiveBankAccounts = makeThunk(
  "expense/getActiveBankAccounts",
  () => fetchActiveBankAccounts()
);

/* ------------------------------- State ------------------------------- */

const emptyPagination = {
  count: 0,
  totalPages: 1,
  currentPage: 1,
  pageSize: 10,
  next: null,
  previous: null,
};

const initialState = {
  // Expense rows
  expenses: [],

  // KPI cards: { total_expense, this_month_expense, already_paid, still_pay, biggest_cost }
  dashboard: null,

  // API pagination (computed from DRF count / next / previous)
  pagination: { ...emptyPagination },

  // Single expense (details / edit modal)
  selectedExpense: null,

  // Dropdown: active bank accounts
  bankAccounts: [],

  loading: false, // list
  detailLoading: false,
  saving: false, // create / update / patch / delete
  bankAccountsLoading: false,

  error: null,
};

// Replace a row in the list after update / patch
const replaceExpense = (state, updated) => {
  const index = state.expenses.findIndex((e) => e.id === updated.id);

  if (index !== -1) state.expenses[index] = updated;

  if (state.selectedExpense?.id === updated.id) {
    state.selectedExpense = updated;
  }
};

/* ------------------------------- Slice ------------------------------- */

const expenseSlice = createSlice({
  name: "expense",

  initialState,

  reducers: {
    clearExpenses(state) {
      state.expenses = [];
      state.dashboard = null;
      state.pagination = { ...emptyPagination };
    },

    clearSelectedExpense(state) {
      state.selectedExpense = null;
    },

    clearExpenseError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ---------- List ---------- */
      .addCase(getExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getExpenses.fulfilled, (state, action) => {
        state.loading = false;

        const data = action.payload || {};
        const arg = action.meta.arg || {};

        // The API uses standard DRF pagination (count / next / previous),
        // so total pages are computed from count and the page params sent.
        const pageSize = Number(arg.page_size) || 10;
        const currentPage = Number(arg.page) || 1;
        const count = data.count || 0;

        state.expenses = data.results || [];
        state.dashboard = data.dashboard || null;

        state.pagination = {
          count,
          totalPages: Math.max(1, Math.ceil(count / pageSize)),
          currentPage,
          pageSize,
          next: data.next || null,
          previous: data.previous || null,
        };
      })

      .addCase(getExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load expenses";
      })

      /* ---------- Details ---------- */
      .addCase(getExpenseDetails.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })

      .addCase(getExpenseDetails.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedExpense = action.payload;
      })

      .addCase(getExpenseDetails.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload || "Failed to load expense details";
      })

      /* ---------- Create ---------- */
      .addCase(createExpense.pending, (state) => {
        state.saving = true;
        state.error = null;
      })

      .addCase(createExpense.fulfilled, (state, action) => {
        state.saving = false;
        state.expenses.unshift(action.payload);
        state.pagination.count += 1;
      })

      .addCase(createExpense.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to create expense";
      })

      /* ---------- Update (PUT) ---------- */
      .addCase(updateExpense.pending, (state) => {
        state.saving = true;
        state.error = null;
      })

      .addCase(updateExpense.fulfilled, (state, action) => {
        state.saving = false;
        replaceExpense(state, action.payload);
      })

      .addCase(updateExpense.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to update expense";
      })

      /* ---------- Partial update (PATCH) ---------- */
      .addCase(patchExpense.pending, (state) => {
        state.saving = true;
        state.error = null;
      })

      .addCase(patchExpense.fulfilled, (state, action) => {
        state.saving = false;
        replaceExpense(state, action.payload);
      })

      .addCase(patchExpense.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to update expense";
      })

      /* ---------- Mark unpaid ---------- */
      .addCase(markExpenseUnpaid.pending, (state) => {
        state.saving = true;
        state.error = null;
      })

      .addCase(markExpenseUnpaid.fulfilled, (state, action) => {
        state.saving = false;
        replaceExpense(state, action.payload);
      })

      .addCase(markExpenseUnpaid.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to mark expense as unpaid";
      })

      /* ---------- Delete ---------- */
      .addCase(deleteExpense.pending, (state) => {
        state.saving = true;
        state.error = null;
      })

      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.saving = false;
        state.expenses = state.expenses.filter((e) => e.id !== action.payload);
        state.pagination.count = Math.max(0, state.pagination.count - 1);

        if (state.selectedExpense?.id === action.payload) {
          state.selectedExpense = null;
        }
      })

      .addCase(deleteExpense.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || "Failed to delete expense";
      })

      /* ---------- Bank accounts dropdown ---------- */
      .addCase(getActiveBankAccounts.pending, (state) => {
        state.bankAccountsLoading = true;
      })

      .addCase(getActiveBankAccounts.fulfilled, (state, action) => {
        state.bankAccountsLoading = false;

        const data = action.payload;

        state.bankAccounts = Array.isArray(data) ? data : data?.results || [];
      })

      .addCase(getActiveBankAccounts.rejected, (state, action) => {
        state.bankAccountsLoading = false;
        state.error = action.payload || "Failed to load bank accounts";
      });
  },
});

export const { clearExpenses, clearSelectedExpense, clearExpenseError } =
  expenseSlice.actions;

export default expenseSlice.reducer;