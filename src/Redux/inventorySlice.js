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
// FETCH INVENTORY KPI
// =====================================================

export const fetchInventoryKPI = createAsyncThunk(
  "inventory/fetchInventoryKPI",
  async (_, { rejectWithValue }) => {
    try {
      return await inventoryService.getInventoryKPI();
    } catch (error) {
      console.error("Inventory KPI API Error:", error);
      return rejectWithValue(
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to fetch inventory KPI",
      );
    }
  },
);

// =====================================================
// LIST ADJUSTMENTS
// =====================================================

export const fetchInventoryAdjustments = createAsyncThunk(
  "inventory/fetchInventoryAdjustments",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await inventoryService.listAdjustments(params);
    } catch (error) {
      console.error("Inventory adjustments list API Error:", error);
      return rejectWithValue(
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to fetch inventory adjustments",
      );
    }
  },
);

// =====================================================
// CREATE ADJUSTMENT
// =====================================================

export const createInventoryAdjustment = createAsyncThunk(
  "inventory/createInventoryAdjustment",
  async (payload = {}, { rejectWithValue }) => {
    try {
      return await inventoryService.createAdjustment(payload);
    } catch (error) {
      console.error("Create inventory adjustment API Error:", error);
      return rejectWithValue(
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to create inventory adjustment",
      );
    }
  },
);

// =====================================================
// GET ADJUSTMENT DETAILS
// =====================================================

export const fetchInventoryAdjustmentById = createAsyncThunk(
  "inventory/fetchInventoryAdjustmentById",
  async (id, { rejectWithValue }) => {
    try {
      return await inventoryService.getAdjustmentById(id);
    } catch (error) {
      console.error("Inventory adjustment detail API Error:", error);
      return rejectWithValue(
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to fetch inventory adjustment details",
      );
    }
  },
);

// =====================================================
// UPDATE ADJUSTMENT
// =====================================================

export const updateInventoryAdjustment = createAsyncThunk(
  "inventory/updateInventoryAdjustment",
  async ({ id, payload = {}, partial = false }, { rejectWithValue }) => {
    try {
      if (partial) {
        return await inventoryService.patchAdjustment(id, payload);
      }

      return await inventoryService.updateAdjustment(id, payload);
    } catch (error) {
      console.error("Update inventory adjustment API Error:", error);
      return rejectWithValue(
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update inventory adjustment",
      );
    }
  },
);

// =====================================================
// DELETE ADJUSTMENT
// =====================================================

export const deleteInventoryAdjustment = createAsyncThunk(
  "inventory/deleteInventoryAdjustment",
  async (id, { rejectWithValue }) => {
    try {
      await inventoryService.deleteAdjustment(id);
      return id;
    } catch (error) {
      console.error("Delete inventory adjustment API Error:", error);
      return rejectWithValue(
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to delete inventory adjustment",
      );
    }
  },
);

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  inventory: [],
  adjustments: [],
  selectedAdjustment: null,
  kpi: {},

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
  adjustmentLoading: false,
  kpiLoading: false,
  error: null,
  adjustmentError: null,
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
      state.adjustments = [];
      state.selectedAdjustment = null;
      state.kpi = {};

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
      state.adjustmentError = null;
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
          : Array.isArray(data.data)
            ? data.data
            : [];

        // API pagination
        state.totalItems = Number(data.total_items || data.count || 0);
        state.totalPages = Number(data.total_pages || data.totalPages || 0);
        state.currentPage = Number(data.current_page || data.currentPage || 1);

        state.next = data.next || null;
        state.previous = data.previous || null;

        // API inventory statistics
        state.totalStockItems = Number(data.total_stock_items || data.totalStockItems || 0);
        state.inStock = Number(data.in_stock || data.inStock || 0);
        state.lowStock = Number(data.low_stock || data.lowStock || 0);
        state.outOfStock = Number(data.out_of_stock || data.outOfStock || 0);
        state.totalInventoryValue = Number(data.total_inventory_value || data.totalInventoryValue || 0);
      })

      // =================================================
      // ERROR
      // =================================================

      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Failed to fetch inventory";
        state.inventory = [];
        state.totalItems = 0;
        state.totalPages = 0;
        state.currentPage = 1;
        state.next = null;
        state.previous = null;
      })

      // =================================================
      // KPI
      // =================================================

      .addCase(fetchInventoryKPI.pending, (state) => {
        state.kpiLoading = true;
      })
      .addCase(fetchInventoryKPI.fulfilled, (state, action) => {
        state.kpiLoading = false;
        state.kpi = action.payload?.data || action.payload || {};
      })
      .addCase(fetchInventoryKPI.rejected, (state, action) => {
        state.kpiLoading = false;
        state.error = action.payload || action.error?.message || "Failed to fetch inventory KPI";
      })

      // =================================================
      // ADJUSTMENTS
      // =================================================

      .addCase(fetchInventoryAdjustments.pending, (state) => {
        state.adjustmentLoading = true;
        state.adjustmentError = null;
      })
      .addCase(fetchInventoryAdjustments.fulfilled, (state, action) => {
        state.adjustmentLoading = false;
        state.adjustmentError = null;
        const payload = action.payload || {};
        state.adjustments = Array.isArray(payload.results)
          ? payload.results
          : Array.isArray(payload.data)
            ? payload.data
            : Array.isArray(payload)
              ? payload
              : [];
      })
      .addCase(fetchInventoryAdjustments.rejected, (state, action) => {
        state.adjustmentLoading = false;
        state.adjustmentError = action.payload || action.error?.message || "Failed to fetch inventory adjustments";
      })

      .addCase(createInventoryAdjustment.pending, (state) => {
        state.adjustmentLoading = true;
        state.adjustmentError = null;
      })
      .addCase(createInventoryAdjustment.fulfilled, (state) => {
        state.adjustmentLoading = false;
        state.adjustmentError = null;
      })
      .addCase(createInventoryAdjustment.rejected, (state, action) => {
        state.adjustmentLoading = false;
        state.adjustmentError = action.payload || action.error?.message || "Failed to create inventory adjustment";
      })

      .addCase(fetchInventoryAdjustmentById.pending, (state) => {
        state.adjustmentLoading = true;
        state.adjustmentError = null;
      })
      .addCase(fetchInventoryAdjustmentById.fulfilled, (state, action) => {
        state.adjustmentLoading = false;
        state.selectedAdjustment = action.payload?.data || action.payload || null;
      })
      .addCase(fetchInventoryAdjustmentById.rejected, (state, action) => {
        state.adjustmentLoading = false;
        state.adjustmentError = action.payload || action.error?.message || "Failed to fetch inventory adjustment";
      })

      .addCase(updateInventoryAdjustment.pending, (state) => {
        state.adjustmentLoading = true;
        state.adjustmentError = null;
      })
      .addCase(updateInventoryAdjustment.fulfilled, (state) => {
        state.adjustmentLoading = false;
        state.adjustmentError = null;
      })
      .addCase(updateInventoryAdjustment.rejected, (state, action) => {
        state.adjustmentLoading = false;
        state.adjustmentError = action.payload || action.error?.message || "Failed to update inventory adjustment";
      })

      .addCase(deleteInventoryAdjustment.pending, (state) => {
        state.adjustmentLoading = true;
        state.adjustmentError = null;
      })
      .addCase(deleteInventoryAdjustment.fulfilled, (state, action) => {
        state.adjustmentLoading = false;
        state.adjustmentError = null;
        const deletedId = action.payload;
        state.adjustments = state.adjustments.filter((item) => String(item.id) !== String(deletedId));
      })
      .addCase(deleteInventoryAdjustment.rejected, (state, action) => {
        state.adjustmentLoading = false;
        state.adjustmentError = action.payload || action.error?.message || "Failed to delete inventory adjustment";
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