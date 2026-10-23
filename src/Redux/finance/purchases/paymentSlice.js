import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getPurchasePayments,
  getPurchasePaymentById,
  createPurchasePayment,
  updatePurchasePayment,
  patchPurchasePayment,
  deletePurchasePayment,
  exportPurchasePayments,
  getPurchasePaymentKPI,
} from "../../../services/finance/purchases/paymentService";

/* =========================================================
   FETCH PAYMENTS
========================================================= */

export const fetchPurchasePayments = createAsyncThunk(
  "purchasePayments/fetchPayments",
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getPurchasePayments(params);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || error?.message || "Failed to fetch payments",
      );
    }
  },
);

/* =========================================================
   FETCH PAYMENT BY ID
========================================================= */

export const fetchPurchasePaymentById = createAsyncThunk(
  "purchasePayments/fetchPaymentById",
  async (id, { rejectWithValue }) => {
    try {
      return await getPurchasePaymentById(id);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
          error?.message ||
          "Failed to fetch payment",
      );
    }
  },
);

/* =========================================================
   CREATE PAYMENT
========================================================= */

export const createPurchasePaymentThunk = createAsyncThunk(
  "purchasePayments/createPayment",
  async (payload, { rejectWithValue }) => {
    try {
      return await createPurchasePayment(payload);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
          error?.message ||
          "Failed to create payment",
      );
    }
  },
);

/* =========================================================
   UPDATE PAYMENT
========================================================= */

export const updatePurchasePaymentThunk = createAsyncThunk(
  "purchasePayments/updatePayment",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await updatePurchasePayment({
        id,
        payload,
      });
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
          error?.message ||
          "Failed to update payment",
      );
    }
  },
);

/* =========================================================
   PATCH PAYMENT
========================================================= */

export const patchPurchasePaymentThunk = createAsyncThunk(
  "purchasePayments/patchPayment",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      return await patchPurchasePayment({
        id,
        payload,
      });
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
          error?.message ||
          "Failed to update payment",
      );
    }
  },
);

/* =========================================================
   DELETE PAYMENT
========================================================= */

export const deletePurchasePaymentThunk = createAsyncThunk(
  "purchasePayments/deletePayment",
  async (id, { rejectWithValue }) => {
    try {
      await deletePurchasePayment(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
          error?.message ||
          "Failed to delete payment",
      );
    }
  },
);

/* =========================================================
   EXPORT
========================================================= */

export const exportPurchasePaymentsThunk = createAsyncThunk(
  "purchasePayments/exportPayments",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await exportPurchasePayments(params);

      const contentType =
        response.headers?.["content-type"] ||
        "application/octet-stream";

      const blob = new Blob([response.data], {
        type: contentType,
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "purchase-payments.xlsx";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
          error?.message ||
          "Failed to export payments",
      );
    }
  },
);

/* =========================================================
   KPI
========================================================= */

export const fetchPurchasePaymentKPI = createAsyncThunk(
  "purchasePayments/fetchKPI",
  async (_, { rejectWithValue }) => {
    try {
      return await getPurchasePaymentKPI();
    } catch (error) {
      return rejectWithValue(
        error?.response?.data ||
          error?.message ||
          "Failed to fetch payment KPI",
      );
    }
  },
);

/* =========================================================
   HELPERS
========================================================= */

const normalizeListResponse = (response) => {
  if (Array.isArray(response)) {
    return {
      results: response,
      count: response.length,
      total: response.length,
    };
  }

  if (Array.isArray(response?.results)) {
    return {
      results: response.results,
      count: response.count ?? response.results.length,
      total: response.total ?? response.count ?? response.results.length,
      next: response.next,
      previous: response.previous,
    };
  }

  if (Array.isArray(response?.data)) {
    return {
      results: response.data,
      count: response.count ?? response.data.length,
      total: response.total ?? response.count ?? response.data.length,
      next: response.next,
      previous: response.previous,
    };
  }

  if (Array.isArray(response?.data?.results)) {
    return {
      results: response.data.results,
      count:
        response.data.count ?? response.count ?? response.data.results.length,
      total:
        response.data.total ??
        response.data.count ??
        response.count ??
        response.data.results.length,
      next: response.data.next ?? response.next,
      previous: response.data.previous ?? response.previous,
    };
  }

  return {
    results: [],
    count: 0,
    total: 0,
    next: null,
    previous: null,
  };
};

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  payments: [],
  selectedPayment: null,

  pagination: {
    count: 0,
    total: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    next: null,
    previous: null,
  },

  kpi: {
    totalPaymentsMade: 0,
    totalPaidOut: 0,
    paidThisMonth: 0,
    pendingClearance: 0,
    failedPayments: 0,
  },

  loading: false,
  detailsLoading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  exportLoading: false,
  kpiLoading: false,

  error: null,
};

/* =========================================================
   SLICE
========================================================= */

const purchasePaymentSlice = createSlice({
  name: "purchasePayments",
  initialState,

  reducers: {
    clearPurchasePaymentError: (state) => {
      state.error = null;
    },

    clearSelectedPurchasePayment: (state) => {
      state.selectedPayment = null;
    },

    resetPurchasePayments: () => initialState,
  },

  extraReducers: (builder) => {
    /* -----------------------------------------------------
       LIST
    ----------------------------------------------------- */

    builder
      .addCase(fetchPurchasePayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchPurchasePayments.fulfilled, (state, action) => {
        state.loading = false;

        const normalized = normalizeListResponse(action.payload);

        state.payments = normalized.results;

        const currentPage =
          Number(action.meta?.arg?.page) ||
          state.pagination.currentPage ||
          1;

        const pageSize =
          Number(action.meta?.arg?.page_size) ||
          state.pagination.pageSize ||
          10;

        const count = Number(normalized.count || 0);

        state.pagination = {
          count,
          total: Number(normalized.total || count),
          currentPage,
          pageSize,
          totalPages: Math.max(1, Math.ceil(count / pageSize)),
          next: normalized.next,
          previous: normalized.previous,
        };
      })

      .addCase(fetchPurchasePayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch payments";
      });

    /* -----------------------------------------------------
       DETAILS
    ----------------------------------------------------- */

    builder
      .addCase(fetchPurchasePaymentById.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })

      .addCase(fetchPurchasePaymentById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedPayment = action.payload?.data ?? action.payload;
      })

      .addCase(fetchPurchasePaymentById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload || "Failed to fetch payment";
      });

    /* -----------------------------------------------------
       CREATE
    ----------------------------------------------------- */

    builder
      .addCase(createPurchasePaymentThunk.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })

      .addCase(createPurchasePaymentThunk.fulfilled, (state, action) => {
        state.createLoading = false;

        const created = action.payload?.data ?? action.payload;

        if (created) {
          state.payments = [created, ...state.payments];
        }
      })

      .addCase(createPurchasePaymentThunk.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload || "Failed to create payment";
      });

    /* -----------------------------------------------------
       UPDATE
    ----------------------------------------------------- */

    builder
      .addCase(updatePurchasePaymentThunk.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })

      .addCase(updatePurchasePaymentThunk.fulfilled, (state, action) => {
        state.updateLoading = false;

        const updated = action.payload?.data ?? action.payload;

        if (!updated?.id) {
          return;
        }

        state.payments = state.payments.map((payment) =>
          String(payment.id) === String(updated.id)
            ? updated
            : payment,
        );

        if (
          state.selectedPayment &&
          String(state.selectedPayment.id) === String(updated.id)
        ) {
          state.selectedPayment = updated;
        }
      })

      .addCase(updatePurchasePaymentThunk.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload || "Failed to update payment";
      });

    /* -----------------------------------------------------
       PATCH
    ----------------------------------------------------- */

    builder
      .addCase(patchPurchasePaymentThunk.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })

      .addCase(patchPurchasePaymentThunk.fulfilled, (state, action) => {
        state.updateLoading = false;

        const updated = action.payload?.data ?? action.payload;

        if (!updated?.id) {
          return;
        }

        state.payments = state.payments.map((payment) =>
          String(payment.id) === String(updated.id)
            ? updated
            : payment,
        );
      })

      .addCase(patchPurchasePaymentThunk.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload || "Failed to update payment";
      });

    /* -----------------------------------------------------
       DELETE
    ----------------------------------------------------- */

    builder
      .addCase(deletePurchasePaymentThunk.pending, (state) => {
        state.deleteLoading = true;
        state.error = null;
      })

      .addCase(deletePurchasePaymentThunk.fulfilled, (state, action) => {
        state.deleteLoading = false;

        state.payments = state.payments.filter(
          (payment) =>
            String(payment.id) !== String(action.payload),
        );
      })

      .addCase(deletePurchasePaymentThunk.rejected, (state, action) => {
        state.deleteLoading = false;
        state.error = action.payload || "Failed to delete payment";
      });

    /* -----------------------------------------------------
       EXPORT
    ----------------------------------------------------- */

    builder
      .addCase(exportPurchasePaymentsThunk.pending, (state) => {
        state.exportLoading = true;
        state.error = null;
      })

      .addCase(exportPurchasePaymentsThunk.fulfilled, (state) => {
        state.exportLoading = false;
      })

      .addCase(exportPurchasePaymentsThunk.rejected, (state, action) => {
        state.exportLoading = false;
        state.error = action.payload || "Failed to export payments";
      });

    /* -----------------------------------------------------
       KPI
    ----------------------------------------------------- */

    builder
      .addCase(fetchPurchasePaymentKPI.pending, (state) => {
        state.kpiLoading = true;
      })

      .addCase(fetchPurchasePaymentKPI.fulfilled, (state, action) => {
        state.kpiLoading = false;

        const response = action.payload?.data ?? action.payload ?? {};

        state.kpi = {
          totalPaymentsMade:
            response.total_payments_made ??
            response.totalPaymentsMade ??
            response.total_payments ??
            response.total ??
            0,

          totalPaidOut:
            response.total_paid_out ??
            response.totalPaidOut ??
            response.total_amount ??
            response.total_paid ??
            0,

          paidThisMonth:
            response.paid_this_month ??
            response.paidThisMonth ??
            response.this_month ??
            response.monthly_paid ??
            0,

          pendingClearance:
            response.pending_clearance ??
            response.pendingClearance ??
            response.pending ??
            0,

          failedPayments:
            response.failed_payments ??
            response.failedPayments ??
            response.failed ??
            0,
        };
      })

      .addCase(fetchPurchasePaymentKPI.rejected, (state, action) => {
        state.kpiLoading = false;
        state.error = action.payload || "Failed to fetch KPI";
      });
  },
});

/* =========================================================
   ACTIONS
========================================================= */

export const {
  clearPurchasePaymentError,
  clearSelectedPurchasePayment,
  resetPurchasePayments,
} = purchasePaymentSlice.actions;

/* =========================================================
   SELECTORS
========================================================= */

export const selectPurchasePayments = (state) =>
  state.purchasePayments?.payments || [];

export const selectPurchasePaymentPagination = (state) =>
  state.purchasePayments?.pagination || {
    count: 0,
    total: 0,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
  };

export const selectPurchasePaymentKPI = (state) =>
  state.purchasePayments?.kpi || {};

export const selectSelectedPurchasePayment = (state) =>
  state.purchasePayments?.selectedPayment || null;

export const selectPurchasePaymentLoading = (state) =>
  state.purchasePayments?.loading || false;

export const selectPurchasePaymentDetailsLoading = (state) =>
  state.purchasePayments?.detailsLoading || false;

export const selectPurchasePaymentCreateLoading = (state) =>
  state.purchasePayments?.createLoading || false;

export const selectPurchasePaymentUpdateLoading = (state) =>
  state.purchasePayments?.updateLoading || false;

export const selectPurchasePaymentDeleteLoading = (state) =>
  state.purchasePayments?.deleteLoading || false;

export const selectPurchasePaymentExportLoading = (state) =>
  state.purchasePayments?.exportLoading || false;

export const selectPurchasePaymentError = (state) =>
  state.purchasePayments?.error || null;

export const selectPurchasePaymentKpiLoading = (state) =>
  state.purchasePayments?.kpiLoading || false;

export default purchasePaymentSlice.reducer;