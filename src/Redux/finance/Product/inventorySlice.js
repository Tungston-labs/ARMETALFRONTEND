import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import inventoryService from "../../../services/finance/Product/inventoryService";

/*
|--------------------------------------------------------------------------
| ERROR HELPER
|--------------------------------------------------------------------------
*/

const getThunkError = (
  error,
  fallbackMessage,
) => {
  const data = error?.response?.data;

  if (!data) {
    return (
      error?.message ||
      fallbackMessage
    );
  }

  if (typeof data === "string") {
    return data;
  }

  if (data.detail) {
    return data.detail;
  }

  if (data.message) {
    return data.message;
  }

  if (data.error) {
    return data.error;
  }

  if (data.non_field_errors) {
    if (Array.isArray(data.non_field_errors)) {
      return data.non_field_errors.join(", ");
    }

    return String(data.non_field_errors);
  }

  /*
  |--------------------------------------------------------------------------
  | DRF FIELD ERRORS
  |--------------------------------------------------------------------------
  */

  const fieldErrors = [];

  Object.entries(data).forEach(
    ([field, value]) => {
      if (Array.isArray(value)) {
        value.forEach((message) => {
          if (
            typeof message === "string"
          ) {
            fieldErrors.push(
              `${field}: ${message}`,
            );
          }
        });
      } else if (
        typeof value === "string"
      ) {
        fieldErrors.push(
          `${field}: ${value}`,
        );
      }
    },
  );

  if (fieldErrors.length > 0) {
    return fieldErrors.join(", ");
  }

  return fallbackMessage;
};

/*
|--------------------------------------------------------------------------
| FETCH INVENTORY
|--------------------------------------------------------------------------
*/

export const fetchInventory =
  createAsyncThunk(
    "inventory/fetchInventory",
    async (
      params = {},
      { rejectWithValue },
    ) => {
      try {
        return await inventoryService.getInventory(
          params,
        );
      } catch (error) {
        console.error(
          "Inventory API Error:",
          error?.response?.data ||
          error,
        );

        return rejectWithValue(
          getThunkError(
            error,
            "Failed to fetch inventory",
          ),
        );
      }
    },
  );

/*
|--------------------------------------------------------------------------
| FETCH INVENTORY KPI
|--------------------------------------------------------------------------
*/

export const fetchInventoryKPI =
  createAsyncThunk(
    "inventory/fetchInventoryKPI",
    async (
      _,
      { rejectWithValue },
    ) => {
      try {
        return await inventoryService.getInventoryKPI();
      } catch (error) {
        console.error(
          "Inventory KPI API Error:",
          error?.response?.data ||
          error,
        );

        return rejectWithValue(
          getThunkError(
            error,
            "Failed to fetch inventory KPI",
          ),
        );
      }
    },
  );

/*
|--------------------------------------------------------------------------
| LIST STOCK ADJUSTMENTS
|--------------------------------------------------------------------------
*/

export const fetchInventoryAdjustments =
  createAsyncThunk(
    "inventory/fetchInventoryAdjustments",
    async (
      params = {},
      { rejectWithValue },
    ) => {
      try {
        return await inventoryService.listAdjustments(
          params,
        );
      } catch (error) {
        console.error(
          "Inventory Adjustments List API Error:",
          error?.response?.data ||
          error,
        );

        return rejectWithValue(
          getThunkError(
            error,
            "Failed to fetch inventory adjustments",
          ),
        );
      }
    },
  );

/*
|--------------------------------------------------------------------------
| CREATE STOCK ADJUSTMENT
|--------------------------------------------------------------------------
*/

export const createInventoryAdjustment =
  createAsyncThunk(
    "inventory/createInventoryAdjustment",
    async (
      payload = {},
      { rejectWithValue },
    ) => {
      try {
        return await inventoryService.createAdjustment(
          payload,
        );
      } catch (error) {
        console.error(
          "Create Inventory Adjustment API Error:",
          error?.response?.data ||
          error,
        );

        return rejectWithValue(
          getThunkError(
            error,
            "Failed to create inventory adjustment",
          ),
        );
      }
    },
  );

/*
|--------------------------------------------------------------------------
| GET STOCK ADJUSTMENT DETAILS
|--------------------------------------------------------------------------
*/

export const fetchInventoryAdjustmentById =
  createAsyncThunk(
    "inventory/fetchInventoryAdjustmentById",
    async (
      id,
      { rejectWithValue },
    ) => {
      try {
        return await inventoryService.getAdjustmentById(
          id,
        );
      } catch (error) {
        console.error(
          "Inventory Adjustment Detail API Error:",
          error?.response?.data ||
          error,
        );

        return rejectWithValue(
          getThunkError(
            error,
            "Failed to fetch inventory adjustment details",
          ),
        );
      }
    },
  );

/*
|--------------------------------------------------------------------------
| UPDATE STOCK ADJUSTMENT
|--------------------------------------------------------------------------
*/

export const updateInventoryAdjustment =
  createAsyncThunk(
    "inventory/updateInventoryAdjustment",
    async (
      {
        id,
        payload = {},
        partial = false,
      },
      { rejectWithValue },
    ) => {
      try {
        if (!id) {
          throw new Error(
            "Stock adjustment ID is required",
          );
        }

        if (partial) {
          return await inventoryService.patchAdjustment(
            id,
            payload,
          );
        }

        return await inventoryService.updateAdjustment(
          id,
          payload,
        );
      } catch (error) {
        console.error(
          "Update Inventory Adjustment API Error:",
          error?.response?.data ||
          error,
        );

        return rejectWithValue(
          getThunkError(
            error,
            "Failed to update inventory adjustment",
          ),
        );
      }
    },
  );

/*
|--------------------------------------------------------------------------
| DELETE STOCK ADJUSTMENT
|--------------------------------------------------------------------------
*/

export const deleteInventoryAdjustment =
  createAsyncThunk(
    "inventory/deleteInventoryAdjustment",
    async (
      id,
      { rejectWithValue },
    ) => {
      try {
        if (!id) {
          throw new Error(
            "Stock adjustment ID is required",
          );
        }

        await inventoryService.deleteAdjustment(
          id,
        );

        return id;
      } catch (error) {
        console.error(
          "Delete Inventory Adjustment API Error:",
          error?.response?.data ||
          error,
        );

        return rejectWithValue(
          getThunkError(
            error,
            "Failed to delete inventory adjustment",
          ),
        );
      }
    },
  );

/*
|--------------------------------------------------------------------------
| INITIAL STATE
|--------------------------------------------------------------------------
*/

const initialState = {
  inventory: [],

  adjustments: [],

  selectedAdjustment: null,

  kpi: {},

  totalItems: 0,

  totalPages: 0,

  currentPage: 1,

  next: null,

  previous: null,

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

/*
|--------------------------------------------------------------------------
| INVENTORY SLICE
|--------------------------------------------------------------------------
*/

const inventorySlice = createSlice({
  name: "inventory",

  initialState,

  reducers: {
    clearInventoryError: (
      state,
    ) => {
      state.error = null;
    },

    clearAdjustmentError: (
      state,
    ) => {
      state.adjustmentError = null;
    },

    clearSelectedAdjustment: (
      state,
    ) => {
      state.selectedAdjustment = null;
    },

    clearInventory: (
      state,
    ) => {
      state.inventory = [];

      state.adjustments = [];

      state.selectedAdjustment =
        null;

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

      state.loading = false;

      state.adjustmentLoading = false;

      state.kpiLoading = false;

      state.error = null;

      state.adjustmentError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /*
      |--------------------------------------------------------------------------
      | INVENTORY LIST - PENDING
      |--------------------------------------------------------------------------
      */

      .addCase(
        fetchInventory.pending,
        (state) => {
          state.loading = true;

          state.error = null;
        },
      )

      /*
      |--------------------------------------------------------------------------
      | INVENTORY LIST - SUCCESS
      |--------------------------------------------------------------------------
      */

      .addCase(
        fetchInventory.fulfilled,
        (
          state,
          action,
        ) => {
          state.loading = false;

          state.error = null;

          const data =
            action.payload || {};

          /*
          |--------------------------------------------------------------------------
          | RESULTS
          |--------------------------------------------------------------------------
          */

          const results =
            Array.isArray(
              data.results,
            )
              ? data.results
              : Array.isArray(
                data.data,
              )
                ? data.data
                : Array.isArray(
                  data,
                )
                  ? data
                  : [];

          state.inventory =
            results;

          /*
          |--------------------------------------------------------------------------
          | PAGINATION
          |--------------------------------------------------------------------------
          */

          state.totalItems =
            Number(
              data.total_items ??
              data.count ??
              results.length ??
              0,
            );

          state.totalPages =
            Number(
              data.total_pages ??
              data.totalPages ??
              0,
            );

          state.currentPage =
            Number(
              data.current_page ??
              data.currentPage ??
              1,
            );

          state.next =
            data.next || null;

          state.previous =
            data.previous || null;

          /*
          |--------------------------------------------------------------------------
          | INVENTORY KPI VALUES
          |--------------------------------------------------------------------------
          */

          state.totalStockItems =
            Number(
              data.total_stock_items ??
              data.totalStockItems ??
              0,
            );

          state.inStock =
            Number(
              data.in_stock ??
              data.inStock ??
              0,
            );

          state.lowStock =
            Number(
              data.low_stock ??
              data.lowStock ??
              0,
            );

          state.outOfStock =
            Number(
              data.out_of_stock ??
              data.outOfStock ??
              0,
            );

          state.totalInventoryValue =
            Number(
              data.total_inventory_value ??
              data.totalInventoryValue ??
              0,
            );
        },
      )

      /*
      |--------------------------------------------------------------------------
      | INVENTORY LIST - ERROR
      |--------------------------------------------------------------------------
      */

      .addCase(
        fetchInventory.rejected,
        (
          state,
          action,
        ) => {
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
        },
      )

      /*
      |--------------------------------------------------------------------------
      | KPI - PENDING
      |--------------------------------------------------------------------------
      */

      .addCase(
        fetchInventoryKPI.pending,
        (state) => {
          state.kpiLoading =
            true;
        },
      )

      /*
      |--------------------------------------------------------------------------
      | KPI - SUCCESS
      |--------------------------------------------------------------------------
      */

      .addCase(
        fetchInventoryKPI.fulfilled,
        (
          state,
          action,
        ) => {
          state.kpiLoading =
            false;

          state.kpi =
            action.payload?.data ||
            action.payload ||
            {};
        },
      )

      /*
      |--------------------------------------------------------------------------
      | KPI - ERROR
      |--------------------------------------------------------------------------
      */

      .addCase(
        fetchInventoryKPI.rejected,
        (
          state,
          action,
        ) => {
          state.kpiLoading =
            false;

          state.error =
            action.payload ||
            action.error?.message ||
            "Failed to fetch inventory KPI";
        },
      )

      /*
      |--------------------------------------------------------------------------
      | ADJUSTMENT LIST - PENDING
      |--------------------------------------------------------------------------
      */

      .addCase(
        fetchInventoryAdjustments.pending,
        (state) => {
          state.adjustmentLoading =
            true;

          state.adjustmentError =
            null;
        },
      )

      /*
      |--------------------------------------------------------------------------
      | ADJUSTMENT LIST - SUCCESS
      |--------------------------------------------------------------------------
      */

      .addCase(
        fetchInventoryAdjustments.fulfilled,
        (
          state,
          action,
        ) => {
          state.adjustmentLoading =
            false;

          state.adjustmentError =
            null;

          const payload =
            action.payload || {};

          state.adjustments =
            Array.isArray(
              payload.results,
            )
              ? payload.results
              : Array.isArray(
                payload.data,
              )
                ? payload.data
                : Array.isArray(
                  payload,
                )
                  ? payload
                  : [];
        },
      )

      /*
      |--------------------------------------------------------------------------
      | ADJUSTMENT LIST - ERROR
      |--------------------------------------------------------------------------
      */

      .addCase(
        fetchInventoryAdjustments.rejected,
        (
          state,
          action,
        ) => {
          state.adjustmentLoading =
            false;

          state.adjustmentError =
            action.payload ||
            action.error?.message ||
            "Failed to fetch inventory adjustments";
        },
      )

      /*
      |--------------------------------------------------------------------------
      | CREATE ADJUSTMENT - PENDING
      |--------------------------------------------------------------------------
      */

      .addCase(
        createInventoryAdjustment.pending,
        (state) => {
          state.adjustmentLoading =
            true;

          state.adjustmentError =
            null;
        },
      )

      /*
      |--------------------------------------------------------------------------
      | CREATE ADJUSTMENT - SUCCESS
      |--------------------------------------------------------------------------
      */

      .addCase(
        createInventoryAdjustment.fulfilled,
        (
          state,
          action,
        ) => {
          state.adjustmentLoading =
            false;

          state.adjustmentError =
            null;

          const created =
            action.payload?.data ||
            action.payload;

          if (
            created &&
            typeof created ===
            "object"
          ) {
            state.adjustments = [
              created,
              ...state.adjustments,
            ];
          }
        },
      )

      /*
      |--------------------------------------------------------------------------
      | CREATE ADJUSTMENT - ERROR
      |--------------------------------------------------------------------------
      */

      .addCase(
        createInventoryAdjustment.rejected,
        (
          state,
          action,
        ) => {
          state.adjustmentLoading =
            false;

          state.adjustmentError =
            action.payload ||
            action.error?.message ||
            "Failed to create inventory adjustment";
        },
      )

      /*
      |--------------------------------------------------------------------------
      | GET ADJUSTMENT DETAILS - PENDING
      |--------------------------------------------------------------------------
      */

      .addCase(
        fetchInventoryAdjustmentById.pending,
        (state) => {
          state.adjustmentLoading =
            true;

          state.adjustmentError =
            null;

          state.selectedAdjustment =
            null;
        },
      )

      /*
      |--------------------------------------------------------------------------
      | GET ADJUSTMENT DETAILS - SUCCESS
      |--------------------------------------------------------------------------
      */

      .addCase(
        fetchInventoryAdjustmentById.fulfilled,
        (
          state,
          action,
        ) => {
          state.adjustmentLoading =
            false;

          state.adjustmentError =
            null;

          state.selectedAdjustment =
            action.payload?.data ||
            action.payload ||
            null;
        },
      )

      /*
      |--------------------------------------------------------------------------
      | GET ADJUSTMENT DETAILS - ERROR
      |--------------------------------------------------------------------------
      */

      .addCase(
        fetchInventoryAdjustmentById.rejected,
        (
          state,
          action,
        ) => {
          state.adjustmentLoading =
            false;

          state.adjustmentError =
            action.payload ||
            action.error?.message ||
            "Failed to fetch inventory adjustment details";
        },
      )

      /*
      |--------------------------------------------------------------------------
      | UPDATE ADJUSTMENT - PENDING
      |--------------------------------------------------------------------------
      */

      .addCase(
        updateInventoryAdjustment.pending,
        (state) => {
          state.adjustmentLoading =
            true;

          state.adjustmentError =
            null;
        },
      )

      /*
      |--------------------------------------------------------------------------
      | UPDATE ADJUSTMENT - SUCCESS
      |--------------------------------------------------------------------------
      */

      .addCase(
        updateInventoryAdjustment.fulfilled,
        (
          state,
          action,
        ) => {
          state.adjustmentLoading =
            false;

          state.adjustmentError =
            null;

          const updated =
            action.payload?.data ||
            action.payload;

          if (
            updated &&
            typeof updated ===
            "object" &&
            updated.id
          ) {
            state.adjustments =
              state.adjustments.map(
                (item) =>
                  String(
                    item.id,
                  ) ===
                    String(
                      updated.id,
                    )
                    ? updated
                    : item,
              );

            state.selectedAdjustment =
              updated;
          }
        },
      )

      /*
      |--------------------------------------------------------------------------
      | UPDATE ADJUSTMENT - ERROR
      |--------------------------------------------------------------------------
      */

      .addCase(
        updateInventoryAdjustment.rejected,
        (
          state,
          action,
        ) => {
          state.adjustmentLoading =
            false;

          state.adjustmentError =
            action.payload ||
            action.error?.message ||
            "Failed to update inventory adjustment";
        },
      )

      /*
      |--------------------------------------------------------------------------
      | DELETE ADJUSTMENT - PENDING
      |--------------------------------------------------------------------------
      */

      .addCase(
        deleteInventoryAdjustment.pending,
        (state) => {
          state.adjustmentLoading =
            true;

          state.adjustmentError =
            null;
        },
      )

      /*
      |--------------------------------------------------------------------------
      | DELETE ADJUSTMENT - SUCCESS
      |--------------------------------------------------------------------------
      */

      .addCase(
        deleteInventoryAdjustment.fulfilled,
        (
          state,
          action,
        ) => {
          state.adjustmentLoading =
            false;

          state.adjustmentError =
            null;

          const deletedId =
            action.payload;

          state.adjustments =
            state.adjustments.filter(
              (item) =>
                String(
                  item.id,
                ) !==
                String(
                  deletedId,
                ),
            );

          if (
            state.selectedAdjustment &&
            String(
              state.selectedAdjustment.id,
            ) ===
            String(
              deletedId,
            )
          ) {
            state.selectedAdjustment =
              null;
          }
        },
      )

      /*
      |--------------------------------------------------------------------------
      | DELETE ADJUSTMENT - ERROR
      |--------------------------------------------------------------------------
      */

      .addCase(
        deleteInventoryAdjustment.rejected,
        (
          state,
          action,
        ) => {
          state.adjustmentLoading =
            false;

          state.adjustmentError =
            action.payload ||
            action.error?.message ||
            "Failed to delete inventory adjustment";
        },
      );
  },
});

/*
|--------------------------------------------------------------------------
| ACTIONS
|--------------------------------------------------------------------------
*/

export const {
  clearInventoryError,
  clearAdjustmentError,
  clearSelectedAdjustment,
  clearInventory,
} = inventorySlice.actions;

/*
|--------------------------------------------------------------------------
| REDUCER
|--------------------------------------------------------------------------
*/

export default inventorySlice.reducer;