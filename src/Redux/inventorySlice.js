import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import inventoryService from "../services/inventoryService";

// =====================================================
// FETCH INVENTORY
// =====================================================

export const fetchInventory = createAsyncThunk(
  "inventory/fetchInventory",

  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await inventoryService.getInventory(params);

      return response;
    } catch (error) {
      console.error("Inventory API Error:", error);

      return rejectWithValue(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to fetch inventory",
      );
    }
  },
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  inventory: [],

  // API pagination
  totalItems: 0,
  totalPages: 0,
  currentPage: 1,

  next: null,
  previous: null,

  // Dashboard/statistics from API
  totalStockItems: 0,
  inStock: 0,
  lowStock: 0,
  outOfStock: 0,
  totalInventoryValue: 0,

  loading: false,
  error: null,
};

// =====================================================
// INVENTORY SLICE
// =====================================================

const inventorySlice = createSlice({
  name: "inventory",

  initialState,

  reducers: {
    clearInventoryError: (state) => {
      state.error = null;
    },

    clearInventory: (state) => {
      state.inventory = [];

      state.totalItems = 0;
      state.totalPages = 0;
      state.currentPage = 1;

      state.next = null;
      state.previous = null;

      state.totalStockItems = 0;
      state.inStock = 0;
      state.lowStock = 0;
      state.outOfStock = 0;
      state.totalInventoryValue = 0;

      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================================
      // PENDING
      // =================================================

      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // =================================================
      // SUCCESS
      // =================================================

      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const data = action.payload || {};

        // API results
        state.inventory = Array.isArray(data.results)
          ? data.results
          : [];

        // API pagination
        state.totalItems = Number(data.total_items || 0);

        state.totalPages = Number(data.total_pages || 0);

        state.currentPage = Number(data.current_page || 1);

        state.next = data.next || null;

        state.previous = data.previous || null;

        // API inventory statistics
        state.totalStockItems = Number(
          data.total_stock_items || 0,
        );

        state.inStock = Number(data.in_stock || 0);

        state.lowStock = Number(data.low_stock || 0);

        state.outOfStock = Number(
          data.out_of_stock || 0,
        );

        state.totalInventoryValue = Number(
          data.total_inventory_value || 0,
        );
      })

      // =================================================
      // ERROR
      // =================================================

      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload ||
          action.error?.message ||
          "Failed to fetch inventory";

        state.inventory = [];

        state.totalItems = 0;
        state.totalPages = 0;
        state.currentPage = 1;

        state.next = null;
        state.previous = null;
      });
  },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
  clearInventoryError,
  clearInventory,
} = inventorySlice.actions;

// =====================================================
// REDUCER
// =====================================================

export default inventorySlice.reducer;