

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  fetchAccounts,
  createAccount,
  fetchAccountById,
  updateAccount,
  patchAccount,
  deleteAccount,
  fetchAccountKpi,
} from "../../../services/finance/accounts/Accountingservices";


const ACCOUNT_TYPES = ["asset", "liability", "equity", "revenue", "expense"];


// =====================================================
// HELPERS
// =====================================================

const emptySections = () =>
  Object.fromEntries(ACCOUNT_TYPES.map((t) => [t, []]));

const emptyTotals = () =>
  Object.fromEntries(ACCOUNT_TYPES.map((t) => [t, "0.00"]));

const recalcTotals = (state) => {
  ACCOUNT_TYPES.forEach((type) => {
    state.totals[type] = (state.sections[type] || [])
      .reduce((sum, acc) => sum + Number(acc.balance || 0), 0)
      .toFixed(2);
  });
};

const recalcCount = (state) => {
  state.count = Object.values(state.sections).reduce(
    (n, list) => n + list.length,
    0
  );
};

const removeFromSections = (state, id) => {
  ACCOUNT_TYPES.forEach((type) => {
    state.sections[type] = (state.sections[type] || []).filter(
      (acc) => acc.id !== id
    );
  });
};

const insertIntoSections = (state, account) => {
  const type = account.account_type;

  if (!state.sections[type]) state.sections[type] = [];

  state.sections[type].push(account);

  state.sections[type].sort((a, b) =>
    String(a.account_code).localeCompare(String(b.account_code))
  );
};

// Used for PUT / PATCH (account_type may change, so remove + re-insert)
const replaceInSections = (state, account) => {
  removeFromSections(state, account.id);
  insertIntoSections(state, account);
  recalcTotals(state);
  recalcCount(state);
};


// =====================================================
// GET ALL ACCOUNTS
// =====================================================

export const getAccounts = createAsyncThunk(
  "accounting/getAccounts",
  async (params = {}, thunkAPI) => {
    try {
      return await fetchAccounts(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// =====================================================
// CREATE ACCOUNT
// =====================================================

export const addAccount = createAsyncThunk(
  "accounting/addAccount",
  async (accountData, thunkAPI) => {
    try {
      return await createAccount(accountData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// =====================================================
// GET ACCOUNT BY ID
// =====================================================

export const getAccountById = createAsyncThunk(
  "accounting/getAccountById",
  async (id, thunkAPI) => {
    try {
      return await fetchAccountById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// =====================================================
// PUT
// =====================================================

export const editAccount = createAsyncThunk(
  "accounting/editAccount",
  async ({ id, accountData }, thunkAPI) => {
    try {
      return await updateAccount(id, accountData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// =====================================================
// PATCH
// =====================================================

export const updateAccountPartially = createAsyncThunk(
  "accounting/updateAccountPartially",
  async ({ id, accountData }, thunkAPI) => {
    try {
      return await patchAccount(id, accountData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// =====================================================
// DELETE
// =====================================================

export const removeAccount = createAsyncThunk(
  "accounting/removeAccount",
  async (id, thunkAPI) => {
    try {
      await deleteAccount(id);

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// =====================================================
// GET KPI
// =====================================================

export const getAccountKpi = createAsyncThunk(
  "accounting/getAccountKpi",
  async (_, thunkAPI) => {
    try {
      return await fetchAccountKpi();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message
      );
    }
  }
);


// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  sections: emptySections(),
  totals: emptyTotals(),
  count: 0,

  selectedAccount: null,
  kpi: null,

  filters: {
    search: "",
    account_type: "",
    status: "",
  },

  loading: false,
  error: null,
};


// =====================================================
// SLICE
// =====================================================

const accountingSlice = createSlice({
  name: "accounting",

  initialState,

  reducers: {

    setAccountFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },

    resetAccountFilters(state) {
      state.filters = initialState.filters;
    },

    clearAccounts(state) {
      state.sections = emptySections();
      state.totals = emptyTotals();
      state.count = 0;
    },

    clearSelectedAccount(state) {
      state.selectedAccount = null;
    },

    clearAccountError(state) {
      state.error = null;
    },

  },

  extraReducers: (builder) => {

    // =================================================
    // GET ALL
    // Payload shape: { count, totals, sections }
    // =================================================

    builder

      .addCase(getAccounts.pending, (state) => {

        state.loading = true;
        state.error = null;

      })

      .addCase(getAccounts.fulfilled, (state, action) => {

        state.loading = false;

        const data = action.payload || {};

        state.count = data.count || 0;
        state.totals = { ...emptyTotals(), ...data.totals };
        state.sections = { ...emptySections(), ...data.sections };

      })

      .addCase(getAccounts.rejected, (state, action) => {

        state.loading = false;

        state.error =
          action.payload || "Failed to load accounts";

      });


    // =================================================
    // CREATE
    // Payload shape: {...account}
    // =================================================

    builder

      .addCase(addAccount.pending, (state) => {

        state.loading = true;
        state.error = null;

      })

      .addCase(addAccount.fulfilled, (state, action) => {

        state.loading = false;

        if (action.payload) {

          insertIntoSections(state, action.payload);
          recalcTotals(state);
          recalcCount(state);

        }

      })

      .addCase(addAccount.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload;

      });


    // =================================================
    // GET BY ID
    // =================================================

    builder

      .addCase(getAccountById.pending, (state) => {

        state.loading = true;
        state.error = null;

      })

      .addCase(getAccountById.fulfilled, (state, action) => {

        state.loading = false;

        state.selectedAccount = action.payload;

      })

      .addCase(getAccountById.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload;

      });


    // =================================================
    // PUT
    // =================================================

    builder

      .addCase(editAccount.pending, (state) => {

        state.loading = true;
        state.error = null;

      })

      .addCase(editAccount.fulfilled, (state, action) => {

        state.loading = false;

        replaceInSections(state, action.payload);

        state.selectedAccount = action.payload;

      })

      .addCase(editAccount.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload;

      });


    // =================================================
    // PATCH
    // =================================================

    builder

      .addCase(updateAccountPartially.pending, (state) => {

        state.loading = true;
        state.error = null;

      })

      .addCase(updateAccountPartially.fulfilled, (state, action) => {

        state.loading = false;

        replaceInSections(state, action.payload);

        state.selectedAccount = action.payload;

      })

      .addCase(updateAccountPartially.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload;

      });


    // =================================================
    // DELETE
    // =================================================

    builder

      .addCase(removeAccount.pending, (state) => {

        state.loading = true;
        state.error = null;

      })

      .addCase(removeAccount.fulfilled, (state, action) => {

        state.loading = false;

        removeFromSections(state, action.payload);
        recalcTotals(state);
        recalcCount(state);

        if (state.selectedAccount?.id === action.payload) {

          state.selectedAccount = null;

        }

      })

      .addCase(removeAccount.rejected, (state, action) => {

        state.loading = false;

        state.error = action.payload;

      });


    // =================================================
    // KPI
    // =================================================

    builder

      .addCase(getAccountKpi.pending, (state) => {

        state.error = null;

      })

      .addCase(getAccountKpi.fulfilled, (state, action) => {

        state.kpi = action.payload || null;

      })

      .addCase(getAccountKpi.rejected, (state, action) => {

        state.error = action.payload;

      });

  },
});


export const {
  setAccountFilters,
  resetAccountFilters,
  clearAccounts,
  clearSelectedAccount,
  clearAccountError,
} = accountingSlice.actions;


export default accountingSlice.reducer;