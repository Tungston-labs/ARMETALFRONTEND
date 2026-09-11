import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getWarehouses,
  createWarehouse,
  getWarehouseById,
  getWarehouseKpi,
} from "../services/warehouseService";

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
        "Failed to fetch warehouses",
      );
    }
  },
);

/* =========================================================
   FETCH WAREHOUSE DETAIL
========================================================= */

export const fetchWarehouseById = createAsyncThunk(
  "warehouse/fetchWarehouseById",

  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue(
          "Warehouse ID is required",
        );
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
      const response =
        await createWarehouse(warehouseData);

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
   INITIAL STATE
========================================================= */

const initialState = {
  warehouses: [],

  total: 0,

  activeCount: 0,

  inactiveCount: 0,

  /* =======================================================
     DETAIL STATE
  ======================================================= */

  warehouseDetail: null,

  detailLoading: false,

  detailError: null,

  /* =======================================================
     KPI STATE
  ======================================================= */

  kpi: {
    total_warehouses: 0,
    active_warehouses: 0,
    inactive_warehouses: 0,
  },

  kpiLoading: false,

  kpiError: null,

  /* =======================================================
     PAGINATION
  ======================================================= */

  currentPage: 1,

  pageSize: 20,

  totalPages: 1,

  /* =======================================================
     LIST STATE
  ======================================================= */

  loading: false,

  creating: false,

  error: null,

  createError: null,
};

/* =========================================================
   SLICE
========================================================= */

const warehouseSlice = createSlice({
  name: "warehouse",

  initialState,

  reducers: {
    /* =====================================================
       CLEAR LIST ERROR
    ===================================================== */

    clearWarehouseError: (state) => {
      state.error = null;
    },

    /* =====================================================
       CLEAR CREATE ERROR
    ===================================================== */

    clearCreateWarehouseError: (state) => {
      state.createError = null;
    },

    /* =====================================================
       CLEAR DETAIL
    ===================================================== */

    clearWarehouseDetail: (state) => {
      state.warehouseDetail = null;
      state.detailLoading = false;
      state.detailError = null;
    },

    /* =====================================================
       CLEAR ALL WAREHOUSES
    ===================================================== */

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
    /* =====================================================
       FETCH WAREHOUSES
    ===================================================== */

    builder
      .addCase(
        fetchWarehouses.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      .addCase(
        fetchWarehouses.fulfilled,
        (state, action) => {
          state.loading = false;
          state.error = null;

          const payload = action.payload || {};

          /* -----------------------------------------------
             SUPPORT PAGINATED RESPONSE
          ------------------------------------------------ */

          if (Array.isArray(payload.results)) {
            state.warehouses =
              payload.results;
          }

          /* -----------------------------------------------
             SUPPORT ARRAY RESPONSE
          ------------------------------------------------ */

          else if (Array.isArray(payload)) {
            state.warehouses = payload;
          }

          /* -----------------------------------------------
             EMPTY RESPONSE
          ------------------------------------------------ */

          else {
            state.warehouses = [];
          }

          /* -----------------------------------------------
             TOTAL
          ------------------------------------------------ */

          state.total =
            typeof payload.count === "number"
              ? payload.count
              : state.warehouses.length;

          /* -----------------------------------------------
             PAGINATION
          ------------------------------------------------ */

          state.currentPage =
            action.meta?.arg?.page || 1;

          state.pageSize =
            action.meta?.arg?.page_size || 20;

          state.totalPages =
            Math.ceil(
              state.total /
              state.pageSize,
            ) || 1;

          /* -----------------------------------------------
             ACTIVE COUNT
          ------------------------------------------------ */

          state.activeCount =
            typeof payload.active_count ===
              "number"
              ? payload.active_count
              : state.warehouses.filter(
                (warehouse) =>
                  String(
                    warehouse?.status ||
                    "",
                  ).toLowerCase() ===
                  "active",
              ).length;

          /* -----------------------------------------------
             INACTIVE COUNT
          ------------------------------------------------ */

          state.inactiveCount =
            typeof payload.inactive_count ===
              "number"
              ? payload.inactive_count
              : state.warehouses.filter(
                (warehouse) =>
                  String(
                    warehouse?.status ||
                    "",
                  ).toLowerCase() ===
                  "inactive",
              ).length;
        },
      )

      .addCase(
        fetchWarehouses.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            "Failed to fetch warehouses";

          state.warehouses = [];
        },
      );

    /* =====================================================
       FETCH WAREHOUSE DETAIL
    ===================================================== */

    builder
      .addCase(
        fetchWarehouseById.pending,
        (state) => {
          state.detailLoading = true;

          state.detailError = null;

          state.warehouseDetail = null;
        },
      )

      .addCase(
        fetchWarehouseById.fulfilled,
        (state, action) => {
          state.detailLoading = false;

          state.detailError = null;

          /*
           * Store the complete API response.
           *
           * This allows the details page to display
           * every field returned by the backend.
           */

          const response =
            action.payload;

          /*
           * Supports:
           *
           * {
           *   id: 1,
           *   warehouse_name: "Main Warehouse"
           * }
           *
           * and also:
           *
           * {
           *   data: {
           *     id: 1,
           *     warehouse_name: "Main Warehouse"
           *   }
           * }
           */

          state.warehouseDetail =
            response?.data &&
              typeof response.data ===
              "object" &&
              !Array.isArray(
                response.data,
              )
              ? response.data
              : response || null;
        },
      )

      .addCase(
        fetchWarehouseById.rejected,
        (state, action) => {
          state.detailLoading = false;

          state.detailError =
            action.payload ||
            "Failed to fetch warehouse detail";

          state.warehouseDetail = null;
        },
      );

    /* =====================================================
       FETCH KPI
    ===================================================== */

    builder
      .addCase(
        fetchWarehouseKpi.pending,
        (state) => {
          state.kpiLoading = true;

          state.kpiError = null;
        },
      )

      .addCase(
        fetchWarehouseKpi.fulfilled,
        (state, action) => {
          state.kpiLoading = false;

          state.kpiError = null;

          const payload =
            action.payload || {};

          state.kpi = {
            total_warehouses:
              typeof payload.total_warehouses ===
                "number"
                ? payload.total_warehouses
                : 0,

            active_warehouses:
              typeof payload.active_warehouses ===
                "number"
                ? payload.active_warehouses
                : 0,

            inactive_warehouses:
              typeof payload.inactive_warehouses ===
                "number"
                ? payload.inactive_warehouses
                : 0,
          };
        },
      )

      .addCase(
        fetchWarehouseKpi.rejected,
        (state, action) => {
          state.kpiLoading = false;

          state.kpiError =
            action.payload ||
            "Failed to fetch warehouse KPI";
        },
      );

    /* =====================================================
       ADD WAREHOUSE
    ===================================================== */

    builder
      .addCase(
        addWarehouse.pending,
        (state) => {
          state.creating = true;

          state.createError = null;
        },
      )

      .addCase(
        addWarehouse.fulfilled,
        (state) => {
          state.creating = false;

          state.createError = null;
        },
      )

      .addCase(
        addWarehouse.rejected,
        (state, action) => {
          state.creating = false;

          state.createError =
            action.payload ||
            "Failed to create warehouse";
        },
      );
  },
});

/* =========================================================
   ACTIONS
========================================================= */

export const {
  clearWarehouseError,
  clearCreateWarehouseError,
  clearWarehouseDetail,
  clearWarehouses,
} = warehouseSlice.actions;

/* =========================================================
   REDUCER
========================================================= */

export default warehouseSlice.reducer;