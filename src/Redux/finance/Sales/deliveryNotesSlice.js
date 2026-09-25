import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getDeliveryNotes,
  createDeliveryNote,
  getDeliveryNoteById,
  updateDeliveryNote,
  patchDeliveryNote,
  deleteDeliveryNote,
  getDeliveryNoteKpi,
} from "../../../services/finance/Sales/deliveryNotesService";

/* =========================================================
   THUNKS
========================================================= */

export const fetchDeliveryNotes = createAsyncThunk(
  "deliveryNotes/fetchDeliveryNotes",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getDeliveryNotes(params);
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          error.message ||
          "Failed to fetch delivery notes",
      );
    }
  },
);

export const fetchDeliveryNoteById = createAsyncThunk(
  "deliveryNotes/fetchDeliveryNoteById",
  async (id, { rejectWithValue }) => {
    try {
      return await getDeliveryNoteById(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          error.message ||
          "Failed to fetch delivery note",
      );
    }
  },
);

export const addDeliveryNote = createAsyncThunk(
  "deliveryNotes/addDeliveryNote",
  async (payload, { rejectWithValue }) => {
    try {
      return await createDeliveryNote(payload);
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          error.message ||
          "Failed to create delivery note",
      );
    }
  },
);

export const editDeliveryNote = createAsyncThunk(
  "deliveryNotes/editDeliveryNote",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await updateDeliveryNote(id, payload);
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          error.message ||
          "Failed to update delivery note",
      );
    }
  },
);

export const patchExistingDeliveryNote = createAsyncThunk(
  "deliveryNotes/patchExistingDeliveryNote",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await patchDeliveryNote(id, payload);
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          error.message ||
          "Failed to update delivery note",
      );
    }
  },
);

export const removeDeliveryNote = createAsyncThunk(
  "deliveryNotes/removeDeliveryNote",
  async (id, { rejectWithValue }) => {
    try {
      await deleteDeliveryNote(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          error.message ||
          "Failed to delete delivery note",
      );
    }
  },
);

export const fetchDeliveryNoteKpi = createAsyncThunk(
  "deliveryNotes/fetchDeliveryNoteKpi",
  async (_, { rejectWithValue }) => {
    try {
      return await getDeliveryNoteKpi();
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          error.message ||
          "Failed to fetch delivery note KPI",
      );
    }
  },
);

/* =========================================================
   HELPERS
========================================================= */

const getResults = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.data?.results)) {
    return payload.data.results;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
};

const getTotalItems = (payload, results) => {
  return (
    payload?.count ??
    payload?.total_items ??
    payload?.data?.count ??
    payload?.data?.total_items ??
    results.length
  );
};

const getTotalPages = (payload, totalItems, pageSize = 10) => {
  return (
    payload?.total_pages ??
    payload?.data?.total_pages ??
    Math.max(1, Math.ceil(totalItems / pageSize))
  );
};

/*
  Converts the API Delivery Note response into the
  fields expected by the listing table.

  Your create API is returning fields like:

  deliveryNoteNumber
  salesOrderReference
  deliveryDate
  deliveryStatus
  orderedValue
  billTo
  from
  items
*/

const normalizeDeliveryNote = (row) => {
  const billTo =
    row?.billTo ||
    row?.bill_to ||
    {};

  const warehouse =
    row?.warehouse ||
    row?.warehouseDetails ||
    {};

  const customer =
    typeof billTo === "object"
      ? billTo.client ||
        billTo.name ||
        billTo.company ||
        ""
      : billTo || row?.customer || "";

  const warehouseName =
    typeof warehouse === "object"
      ? warehouse.name ||
        warehouse.warehouseName ||
        warehouse.warehouse_name ||
        ""
      : warehouse || row?.warehouseName || "";

  return {
    ...row,

    /*
      Keep original API fields
    */
    id: row?.id,

    deliveryNoteNumber:
      row?.deliveryNoteNumber ??
      row?.delivery_note_number ??
      row?.order_number ??
      "",

    salesOrderReference:
      row?.salesOrderReference ??
      row?.sales_order_reference ??
      row?.so_number ??
      "",

    deliveryDate:
      row?.deliveryDate ??
      row?.delivery_date ??
      "",

    deliveryStatus:
      row?.deliveryStatus ??
      row?.delivery_status ??
      row?.status ??
      "",

    deliveryValue:
      row?.deliveryValue ??
      row?.delivery_value ??
      row?.amount ??
      row?.total_amount ??
      row?.orderedValue ??
      "",

    invoiceStatus:
      row?.invoiceStatus ??
      row?.invoice_status ??
      "",

    customer,

    warehouse: warehouseName,

    /*
      Compatibility fields for your current table
    */
    order_number:
      row?.deliveryNoteNumber ??
      row?.delivery_note_number ??
      row?.order_number ??
      "",

    order_date:
      row?.order_date ??
      row?.deliveryDate ??
      row?.delivery_date ??
      "",

    customer_name: customer,

    amount:
      row?.deliveryValue ??
      row?.delivery_value ??
      row?.amount ??
      row?.total_amount ??
      row?.orderedValue ??
      "",

    status:
      row?.deliveryStatus ??
      row?.delivery_status ??
      row?.status ??
      "",

    delivery_date:
      row?.deliveryDate ??
      row?.delivery_date ??
      "",

    delivery_value:
      row?.deliveryValue ??
      row?.delivery_value ??
      row?.amount ??
      row?.total_amount ??
      row?.orderedValue ??
      "",

    delivery_status:
      row?.deliveryStatus ??
      row?.delivery_status ??
      row?.status ??
      "",

    invoice_status:
      row?.invoiceStatus ??
      row?.invoice_status ??
      "",
  };
};

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  deliveryNotes: [],
  selectedDeliveryNote: null,

  kpi: {},

  totalItems: 0,
  totalPages: 1,
  currentPage: 1,

  loading: false,
  detailsLoading: false,
  submitting: false,
  deleting: false,
  kpiLoading: false,

  error: null,
  detailsError: null,
  submitError: null,
  deleteError: null,
  kpiError: null,
};

/* =========================================================
   SLICE
========================================================= */

const deliveryNotesSlice = createSlice({
  name: "deliveryNotes",

  initialState,

  reducers: {
    clearSelectedDeliveryNote: (state) => {
      state.selectedDeliveryNote = null;
      state.detailsError = null;
    },

    clearDeliveryNoteErrors: (state) => {
      state.error = null;
      state.detailsError = null;
      state.submitError = null;
      state.deleteError = null;
      state.kpiError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* =====================================================
         LIST
      ===================================================== */

      .addCase(fetchDeliveryNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchDeliveryNotes.fulfilled, (state, action) => {
        state.loading = false;

        const results = getResults(action.payload);

        const pageSize =
          action.meta.arg?.page_size || 10;

        const totalItems = getTotalItems(
          action.payload,
          results,
        );

        state.deliveryNotes = results.map(
          normalizeDeliveryNote,
        );

        state.totalItems = totalItems;

        state.totalPages = getTotalPages(
          action.payload,
          totalItems,
          pageSize,
        );

        state.currentPage =
          action.meta.arg?.page || 1;
      })

      .addCase(fetchDeliveryNotes.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload ||
          "Failed to fetch delivery notes";
      })

      /* =====================================================
         GET BY ID
      ===================================================== */

      .addCase(fetchDeliveryNoteById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })

      .addCase(
        fetchDeliveryNoteById.fulfilled,
        (state, action) => {
          state.detailsLoading = false;

          state.selectedDeliveryNote =
            action.payload?.data ||
            action.payload;
        },
      )

      .addCase(
        fetchDeliveryNoteById.rejected,
        (state, action) => {
          state.detailsLoading = false;

          state.detailsError =
            action.payload ||
            "Failed to fetch delivery note";
        },
      )

      /* =====================================================
         CREATE
      ===================================================== */

      .addCase(addDeliveryNote.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
      })

      .addCase(addDeliveryNote.fulfilled, (state, action) => {
        state.submitting = false;

        const created =
          action.payload?.data ||
          action.payload;

        if (created) {
          const normalized =
            normalizeDeliveryNote(created);

          state.deliveryNotes.unshift(normalized);

          state.totalItems += 1;
        }
      })

      .addCase(addDeliveryNote.rejected, (state, action) => {
        state.submitting = false;

        state.submitError =
          action.payload ||
          "Failed to create delivery note";
      })

      /* =====================================================
         PUT UPDATE
      ===================================================== */

      .addCase(editDeliveryNote.pending, (state) => {
        state.submitting = true;
        state.submitError = null;
      })

      .addCase(editDeliveryNote.fulfilled, (state, action) => {
        state.submitting = false;

        const updated =
          action.payload?.data ||
          action.payload;

        if (updated?.id) {
          const normalized =
            normalizeDeliveryNote(updated);

          state.deliveryNotes =
            state.deliveryNotes.map((item) =>
              String(item.id) ===
              String(updated.id)
                ? normalized
                : item,
            );

          state.selectedDeliveryNote =
            updated;
        }
      })

      .addCase(editDeliveryNote.rejected, (state, action) => {
        state.submitting = false;

        state.submitError =
          action.payload ||
          "Failed to update delivery note";
      })

      /* =====================================================
         PATCH UPDATE
      ===================================================== */

      .addCase(
        patchExistingDeliveryNote.pending,
        (state) => {
          state.submitting = true;
          state.submitError = null;
        },
      )

      .addCase(
        patchExistingDeliveryNote.fulfilled,
        (state, action) => {
          state.submitting = false;

          const updated =
            action.payload?.data ||
            action.payload;

          if (updated?.id) {
            const normalized =
              normalizeDeliveryNote(updated);

            state.deliveryNotes =
              state.deliveryNotes.map((item) =>
                String(item.id) ===
                String(updated.id)
                  ? normalized
                  : item,
              );

            state.selectedDeliveryNote =
              updated;
          }
        },
      )

      .addCase(
        patchExistingDeliveryNote.rejected,
        (state, action) => {
          state.submitting = false;

          state.submitError =
            action.payload ||
            "Failed to update delivery note";
        },
      )

      /* =====================================================
         DELETE
      ===================================================== */

      .addCase(
        removeDeliveryNote.pending,
        (state) => {
          state.deleting = true;
          state.deleteError = null;
        },
      )

      .addCase(
        removeDeliveryNote.fulfilled,
        (state, action) => {
          state.deleting = false;

          state.deliveryNotes =
            state.deliveryNotes.filter(
              (item) =>
                String(item.id) !==
                String(action.payload),
            );

          state.totalItems = Math.max(
            0,
            state.totalItems - 1,
          );
        },
      )

      .addCase(
        removeDeliveryNote.rejected,
        (state, action) => {
          state.deleting = false;

          state.deleteError =
            action.payload ||
            "Failed to delete delivery note";
        },
      )

      /* =====================================================
         KPI
      ===================================================== */

      .addCase(
        fetchDeliveryNoteKpi.pending,
        (state) => {
          state.kpiLoading = true;
          state.kpiError = null;
        },
      )

      .addCase(
        fetchDeliveryNoteKpi.fulfilled,
        (state, action) => {
          state.kpiLoading = false;

          state.kpi =
            action.payload?.data ||
            action.payload ||
            {};
        },
      )

      .addCase(
        fetchDeliveryNoteKpi.rejected,
        (state, action) => {
          state.kpiLoading = false;

          state.kpiError =
            action.payload ||
            "Failed to fetch delivery note KPI";
        },
      );
  },
});

export const {
  clearSelectedDeliveryNote,
  clearDeliveryNoteErrors,
} = deliveryNotesSlice.actions;

export default deliveryNotesSlice.reducer;