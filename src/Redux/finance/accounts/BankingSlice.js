import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  bankAccountService,
  loanService,
  transactionService,
} from "../../../services/finance/accounts/bankingService";


export const extractList = (response) => {
  const body = response?.data;

  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.results)) return body.results;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.data?.results)) return body.data.results;

  return [];
};

const makeThunks = (name, service) => ({
  fetch: createAsyncThunk(
    `banking/${name}/fetch`,
    async (params = {}, { rejectWithValue }) => {
      try {
        const response = await service.getAll(params);

        return {
          items: extractList(response),
          response: response.data,
        };
      } catch (error) {
        return rejectWithValue(
          error.response?.data || error.message || "Unable to fetch records",
        );
      }
    },
  ),

  fetchOne: createAsyncThunk(
    `banking/${name}/fetchOne`,
    async (id, { rejectWithValue }) => {
      try {
        const response = await service.getById(id);
        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data || error.message || "Unable to fetch record",
        );
      }
    },
  ),

  create: createAsyncThunk(
    `banking/${name}/create`,
    async (payload, { rejectWithValue }) => {
      try {
        const response = await service.create(payload);
        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data || error.message || "Unable to create record",
        );
      }
    },
  ),

  update: createAsyncThunk(
    `banking/${name}/update`,
    async ({ id, data }, { rejectWithValue }) => {
      try {
        const response = await service.update(id, data);
        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data || error.message || "Unable to update record",
        );
      }
    },
  ),

  patch: createAsyncThunk(
    `banking/${name}/patch`,
    async ({ id, data }, { rejectWithValue }) => {
      try {
        const response = await service.patch(id, data);
        return response.data;
      } catch (error) {
        return rejectWithValue(
          error.response?.data || error.message || "Unable to update record",
        );
      }
    },
  ),

  remove: createAsyncThunk(
    `banking/${name}/remove`,
    async (id, { rejectWithValue }) => {
      try {
        await service.remove(id);
        return id;
      } catch (error) {
        return rejectWithValue(
          error.response?.data || error.message || "Unable to delete record",
        );
      }
    },
  ),
});

export const accountActions = makeThunks("accounts", bankAccountService);

export const loanActions = makeThunks("loans", loanService);

export const transactionActions = makeThunks(
  "transactions",
  transactionService,
);

const initialResourceState = {
  list: [],
  selected: null,
  pagination: {
    count: 0,
    next: null,
    previous: null,
  },
  loading: false,
  saving: false,
  deleting: false,
  error: null,
};

const initialState = {
  accounts: { ...initialResourceState },
  loans: { ...initialResourceState },
  transactions: { ...initialResourceState },
};

const resources = [
  { key: "accounts", actions: accountActions },
  { key: "loans", actions: loanActions },
  { key: "transactions", actions: transactionActions },
];

const bankingSlice = createSlice({
  name: "banking",
  initialState,
  reducers: {
    clearBankingError(state, action) {
      const resource = action.payload;

      if (state[resource]) {
        state[resource].error = null;
      }
    },

    clearSelectedRecord(state, action) {
      const resource = action.payload;

      if (state[resource]) {
        state[resource].selected = null;
      }
    },
  },

  extraReducers: (builder) => {
    resources.forEach(({ key, actions }) => {
      builder
        // Fetch all
        .addCase(actions.fetch.pending, (state) => {
          state[key].loading = true;
          state[key].error = null;
        })
        .addCase(actions.fetch.fulfilled, (state, action) => {
          state[key].loading = false;
          state[key].list = action.payload.items;

          const body = action.payload.response;

          state[key].pagination = {
            count: body?.count ?? body?.total ?? action.payload.items.length,
            next: body?.next ?? null,
            previous: body?.previous ?? null,
          };
        })
        .addCase(actions.fetch.rejected, (state, action) => {
          state[key].loading = false;
          state[key].error = action.payload || action.error.message;
        })

        // Fetch one
        .addCase(actions.fetchOne.pending, (state) => {
          state[key].loading = true;
          state[key].error = null;
        })
        .addCase(actions.fetchOne.fulfilled, (state, action) => {
          state[key].loading = false;
          state[key].selected = action.payload;
        })
        .addCase(actions.fetchOne.rejected, (state, action) => {
          state[key].loading = false;
          state[key].error = action.payload || action.error.message;
        })

        // Create
        .addCase(actions.create.pending, (state) => {
          state[key].saving = true;
          state[key].error = null;
        })
        .addCase(actions.create.fulfilled, (state, action) => {
          state[key].saving = false;

          const record = action.payload;
          if (record?.id != null) {
            state[key].list.unshift(record);
          }
        })
        .addCase(actions.create.rejected, (state, action) => {
          state[key].saving = false;
          state[key].error = action.payload || action.error.message;
        })

        // Full update
        .addCase(actions.update.pending, (state) => {
          state[key].saving = true;
          state[key].error = null;
        })
        .addCase(actions.update.fulfilled, (state, action) => {
          state[key].saving = false;

          const record = action.payload;
          const index = state[key].list.findIndex(
            (item) => item.id === record?.id,
          );

          if (index !== -1) {
            state[key].list[index] = record;
          }

          if (state[key].selected?.id === record?.id) {
            state[key].selected = record;
          }
        })
        .addCase(actions.update.rejected, (state, action) => {
          state[key].saving = false;
          state[key].error = action.payload || action.error.message;
        })

        // Partial update
        .addCase(actions.patch.pending, (state) => {
          state[key].saving = true;
          state[key].error = null;
        })
        .addCase(actions.patch.fulfilled, (state, action) => {
          state[key].saving = false;

          const record = action.payload;
          const index = state[key].list.findIndex(
            (item) => item.id === record?.id,
          );

          if (index !== -1) {
            state[key].list[index] = {
              ...state[key].list[index],
              ...record,
            };
          }

          if (state[key].selected?.id === record?.id) {
            state[key].selected = {
              ...state[key].selected,
              ...record,
            };
          }
        })
        .addCase(actions.patch.rejected, (state, action) => {
          state[key].saving = false;
          state[key].error = action.payload || action.error.message;
        })

        // Delete
        .addCase(actions.remove.pending, (state) => {
          state[key].deleting = true;
          state[key].error = null;
        })
        .addCase(actions.remove.fulfilled, (state, action) => {
          state[key].deleting = false;
          state[key].list = state[key].list.filter(
            (item) => item.id !== action.payload,
          );

          if (state[key].selected?.id === action.payload) {
            state[key].selected = null;
          }
        })
        .addCase(actions.remove.rejected, (state, action) => {
          state[key].deleting = false;
          state[key].error = action.payload || action.error.message;
        });
    });
  },
});

export const { clearBankingError, clearSelectedRecord } = bankingSlice.actions;

export default bankingSlice.reducer;
