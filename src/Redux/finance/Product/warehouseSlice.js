import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getWarehouses,
  createWarehouse,
  getWarehouseById,
  updateWarehouse as updateWarehouseApi,
  deleteWarehouse as deleteWarehouseApi,
  getWarehouseKpi,
} from "../../../services/warehouseService";

/* =========================================================
   FETCH WAREHOUSES
========================================================= */

export const fetchWarehouses = createAsyncThunk(
  "warehouse/fetchWarehouses",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await getWarehouses(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
        error?.message ||
        "Failed to fetch warehouses"
      );
    }
  }
);
/* =========================================================
   FETCH WAREHOUSE DETAIL
========================================================= */

export const fetchWarehouseById = createAsyncThunk(
  "warehouse/fetchWarehouseById",

  async (id, { rejectWithValue }) => {
    try {
      if (id === null || id === undefined || id === "") {
        return rejectWithValue("Warehouse ID is required");
      }

      const response = await getWarehouseById(id);

      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
          error?.message ||
          "Failed to fetch warehouse detail",
      );
    }
  },
);

/* =========================================================
   UPDATE WAREHOUSE
========================================================= */

export const updateWarehouse = createAsyncThunk(
  "warehouse/updateWarehouse",

  async ({ id, warehouseData }, { rejectWithValue }) => {
    try {
      if (id === null || id === undefined || id === "") {
        return rejectWithValue("Warehouse ID is required");
      }

      const response = await updateWarehouseApi(id, warehouseData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
          error?.message ||
          "Failed to update warehouse",
      );
    }
  },
);

/* =========================================================
   DELETE WAREHOUSE
========================================================= */

export const deleteWarehouse = createAsyncThunk(
  "warehouse/deleteWarehouse",

  async (id, { rejectWithValue }) => {
    try {
      if (id === null || id === undefined || id === "") {
        return rejectWithValue("Warehouse ID is required");
      }

      await deleteWarehouseApi(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
          error?.message ||
          "Failed to delete warehouse",
      );
    }
  },
);

/* =========================================================
   FETCH WAREHOUSE KPI
========================================================= */

export const fetchWarehouseKpi = createAsyncThunk(
  "warehouse/fetchWarehouseKpi",

  async (_, { rejectWithValue }) => {
    try {
      const response = await getWarehouseKpi();

      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
          error?.message ||
          "Failed to fetch warehouse KPI",
      );
    }
  },
);

/* =========================================================
   ADD WAREHOUSE
========================================================= */

export const addWarehouse = createAsyncThunk(
  "warehouse/addWarehouse",

  async (warehouseData, { rejectWithValue }) => {
    try {
      const response = await createWarehouse(warehouseData);

      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
          error?.message ||
          "Failed to create warehouse",
      );
    }
  },
);

/* =========================================================
   HELPERS
========================================================= */

/* Supports both { id, ... } and { data: { id, ... } } responses */
const unwrapObject = (response) =>
  response?.data &&
  typeof response.data === "object" &&
  !Array.isArray(response.data)
    ? response.data
    : response;

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  warehouses: [],
  total: 0,
  activeCount: 0,
  inactiveCount: 0,

  /* DETAIL */
  warehouseDetail: null,
  detailLoading: false,
  detailError: null,

  /* KPI */
  kpi: {
    currency: "SAR",
    total_warehouses: 0,
    total_stock_value: "0.00",
    active_warehouses: 0,
    inactive_warehouses: 0,
    average_capacity_used: 0,
    near_full_capacity: 0,
  },
  kpiLoading: false,
  kpiError: null,

  /* PAGINATION */
  currentPage: 1,
  pageSize: 20,
  totalPages: 1,

  /* LIST / MUTATION STATE */
  loading: false,
  creating: false,
  updating: false,
  deleting: false,

  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

/* =========================================================
   SLICE
========================================================= */

const warehouseSlice = createSlice({
  name: "warehouse",

  initialState,

  reducers: {
    clearWarehouseError: (state) => {
      state.error = null;
    },

    clearCreateWarehouseError: (state) => {
      state.createError = null;
    },

    clearUpdateWarehouseError: (state) => {
      state.updateError = null;
    },

    clearDeleteWarehouseError: (state) => {
      state.deleteError = null;
    },

    clearWarehouseDetail: (state) => {
      state.warehouseDetail = null;
      state.detailLoading = false;
      state.detailError = null;
    },

    clearWarehouses: (state) => {
      state.warehouses = [];
      state.total = 0;
      state.activeCount = 0;
      state.inactiveCount = 0;
      state.currentPage = 1;
      state.totalPages = 1;
    },
  },

  extraReducers: (builder) => {
    /* ================= FETCH WAREHOUSES ================= */

    builder
      .addCase(fetchWarehouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchWarehouses.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const payload = action.payload || {};

        if (Array.isArray(payload.results)) {
          state.warehouses = payload.results;
        } else if (Array.isArray(payload)) {
          state.warehouses = payload;
        } else {
          state.warehouses = [];
        }

        state.total =
          typeof payload.count === "number"
            ? payload.count
            : state.warehouses.length;

        state.currentPage = action.meta?.arg?.page || 1;
        state.pageSize = action.meta?.arg?.page_size || 20;
        state.totalPages = Math.ceil(state.total / state.pageSize) || 1;

        state.activeCount =
          typeof payload.active_count === "number"
            ? payload.active_count
            : state.warehouses.filter(
                (w) => String(w?.status || "").toLowerCase() === "active",
              ).length;

        state.inactiveCount =
          typeof payload.inactive_count === "number"
            ? payload.inactive_count
            : state.warehouses.filter(
                (w) => String(w?.status || "").toLowerCase() === "inactive",
              ).length;

        if (typeof payload.total_warehouses === "number") {
          state.kpi = {
            currency: payload.currency || state.kpi.currency || "SAR",
            total_warehouses: payload.total_warehouses ?? 0,
            total_stock_value: payload.total_stock_value ?? "0.00",
            active_warehouses: payload.active_warehouses ?? 0,
            inactive_warehouses: payload.inactive_warehouses ?? 0,
            average_capacity_used: payload.average_capacity_used ?? 0,
            near_full_capacity: payload.near_full_capacity ?? 0,
          };
        }
      })

      .addCase(fetchWarehouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch warehouses";
        state.warehouses = [];
      });

    /* ================= FETCH DETAIL ================= */

    builder
      .addCase(fetchWarehouseById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
        state.warehouseDetail = null;
      })

      .addCase(fetchWarehouseById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detailError = null;
        state.warehouseDetail = unwrapObject(action.payload) || null;
      })

      .addCase(fetchWarehouseById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError =
          action.payload || "Failed to fetch warehouse detail";
        state.warehouseDetail = null;
      });

    /* ================= UPDATE ================= */

    builder
      .addCase(updateWarehouse.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })

      .addCase(updateWarehouse.fulfilled, (state, action) => {
        state.updating = false;
        state.updateError = null;

        const updated = unwrapObject(action.payload);

        if (updated?.id !== undefined) {
          const index = state.warehouses.findIndex(
            (w) => String(w?.id) === String(updated.id),
          );

          if (index !== -1) {
            state.warehouses[index] = updated;
          }

          if (
            state.warehouseDetail?.id !== undefined &&
            String(state.warehouseDetail.id) === String(updated.id)
          ) {
            state.warehouseDetail = updated;
          }
        }
      })

      .addCase(updateWarehouse.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload || "Failed to update warehouse";
      });

    /* ================= DELETE ================= */

    builder
      .addCase(deleteWarehouse.pending, (state) => {
        state.deleting = true;
        state.deleteError = null;
      })

      .addCase(deleteWarehouse.fulfilled, (state, action) => {
        state.deleting = false;
        state.deleteError = null;

        state.warehouses = state.warehouses.filter(
          (w) => String(w?.id) !== String(action.payload),
        );

        state.total = Math.max(0, state.total - 1);
        state.warehouseDetail = null;
      })

      .addCase(deleteWarehouse.rejected, (state, action) => {
        state.deleting = false;
        state.deleteError = action.payload || "Failed to delete warehouse";
      });

    /* ================= FETCH KPI ================= */

    builder
      .addCase(fetchWarehouseKpi.pending, (state) => {
        state.kpiLoading = true;
        state.kpiError = null;
      })

      .addCase(fetchWarehouseKpi.fulfilled, (state, action) => {
        state.kpiLoading = false;
        state.kpiError = null;

        const payload = action.payload || {};

        state.kpi = {
          currency: payload.currency || state.kpi.currency || "SAR",
          total_warehouses:
            typeof payload.total_warehouses === "number"
              ? payload.total_warehouses
              : 0,
          total_stock_value: payload.total_stock_value ?? "0.00",
          active_warehouses:
            typeof payload.active_warehouses === "number"
              ? payload.active_warehouses
              : 0,
          inactive_warehouses:
            typeof payload.inactive_warehouses === "number"
              ? payload.inactive_warehouses
              : 0,
          average_capacity_used:
            typeof payload.average_capacity_used === "number"
              ? payload.average_capacity_used
              : 0,
          near_full_capacity:
            typeof payload.near_full_capacity === "number"
              ? payload.near_full_capacity
              : 0,
        };
      })

      .addCase(fetchWarehouseKpi.rejected, (state, action) => {
        state.kpiLoading = false;
        state.kpiError = action.payload || "Failed to fetch warehouse KPI";
      });

    /* ================= ADD ================= */

    builder
      .addCase(addWarehouse.pending, (state) => {
        state.creating = true;
        state.createError = null;
      })

      .addCase(addWarehouse.fulfilled, (state) => {
        state.creating = false;
        state.createError = null;
      })

      .addCase(addWarehouse.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.payload || "Failed to create warehouse";
      });
  },
});

/* =========================================================
   ACTIONS
========================================================= */

export const {
  clearWarehouseError,
  clearCreateWarehouseError,
  clearUpdateWarehouseError,
  clearDeleteWarehouseError,
  clearWarehouseDetail,
  clearWarehouses,
} = warehouseSlice.actions;

/* =========================================================
   REDUCER
========================================================= */

export default warehouseSlice.reducer;
