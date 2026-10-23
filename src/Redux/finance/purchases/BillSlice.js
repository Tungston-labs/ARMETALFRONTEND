import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getBills as getBillsService,
  getBillById as getBillByIdService,
  createBill as createBillService,
  updateBill as updateBillService,
  patchBill as patchBillService,
  deleteBill as deleteBillService,
  getBillKPI as getBillKPIService,
  getBillSummary as getBillSummaryService,
  exportBills as exportBillsService,
  getBillError,
} from "../../../services/finance/purchases/BillService";

/* =========================================================
   RESPONSE HELPERS
========================================================= */

const unwrapResponse = (payload) => {
  if (
    payload?.data &&
    typeof payload.data === "object" &&
    !Array.isArray(payload.data)
  ) {
    return payload.data;
  }

  return payload;
};

const getRows = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.results)) {
    return payload.data.results;
  }

  return [];
};

const getErrorMessage = (error, fallback) => {
  const payload = error?.payload ?? error;

  if (typeof payload === "string") {
    return payload;
  }

  if (payload?.detail) {
    return payload.detail;
  }

  if (payload?.message) {
    return payload.message;
  }

  if (payload?.error) {
    return payload.error;
  }

  return fallback;
};

/* =========================================================
   GET BILLS
========================================================= */

export const getBills = createAsyncThunk(
  "bill/getBills",

  async (params = {}, { rejectWithValue }) => {
    try {
      return await getBillsService(params);
    } catch (error) {
      return rejectWithValue(
        getBillError(error, "Failed to fetch purchase bills"),
      );
    }
  },
);

/* =========================================================
   GET BILL BY ID
========================================================= */

export const getBillById = createAsyncThunk(
  "bill/getBillById",

  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue("Bill ID is required");
      }

      return await getBillByIdService(id);
    } catch (error) {
      return rejectWithValue(
        getBillError(error, "Failed to fetch purchase bill"),
      );
    }
  },
);

/* =========================================================
   BILL KPI
========================================================= */

export const getBillKPI = createAsyncThunk(
  "bill/getBillKPI",

  async (params = {}, { rejectWithValue }) => {
    try {
      return await getBillKPIService(params);
    } catch (error) {
      return rejectWithValue(
        getBillError(error, "Failed to fetch bill KPI"),
      );
    }
  },
);

/* =========================================================
   BILL SUMMARY
   Existing Bill.jsx uses this name.
========================================================= */

export const getBillSummary = createAsyncThunk(
  "bill/getBillSummary",

  async (params = {}, { rejectWithValue }) => {
    try {
      return await getBillSummaryService(params);
    } catch (error) {
      return rejectWithValue(
        getBillError(error, "Failed to fetch bill KPI"),
      );
    }
  },
);

/* =========================================================
   CREATE BILL
========================================================= */

export const addBill = createAsyncThunk(
  "bill/addBill",

  async (billData, { rejectWithValue }) => {
    try {
      return await createBillService(billData);
    } catch (error) {
      return rejectWithValue(
        getBillError(error, "Failed to create purchase bill"),
      );
    }
  },
);

/* =========================================================
   FULL UPDATE
========================================================= */

export const editBill = createAsyncThunk(
  "bill/editBill",

  async ({ id, billData }, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue("Bill ID is required");
      }

      return await updateBillService(id, billData);
    } catch (error) {
      return rejectWithValue(
        getBillError(error, "Failed to update purchase bill"),
      );
    }
  },
);

/* =========================================================
   PARTIAL UPDATE
========================================================= */

export const patchBillById = createAsyncThunk(
  "bill/patchBill",

  async ({ id, billData }, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue("Bill ID is required");
      }

      return await patchBillService(id, billData);
    } catch (error) {
      return rejectWithValue(
        getBillError(error, "Failed to partially update purchase bill"),
      );
    }
  },
);

/* =========================================================
   DELETE BILL
========================================================= */

export const removeBill = createAsyncThunk(
  "bill/removeBill",

  async (id, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue("Bill ID is required");
      }

      await deleteBillService(id);

      return id;
    } catch (error) {
      return rejectWithValue(
        getBillError(error, "This Bill cannot be deleted."),
      );
    }
  },
);

/* =========================================================
   EXPORT
========================================================= */

export const exportBills = createAsyncThunk(
  "bill/exportBills",

  async (params = {}, { rejectWithValue }) => {
    try {
      return await exportBillsService(params);
    } catch (error) {
      return rejectWithValue(
        getBillError(error, "Failed to export bills"),
      );
    }
  },
);

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  bills: [],

  selectedBill: null,

  kpi: {
    total_bill_value: 0,
    total_payables: 0,
    total_debit_notes: 0,
    overdue_payables: 0,
    total_bills: 0,
  },

  pagination: {
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
  },

  loading: false,

  detailLoading: false,

  createLoading: false,

  updateLoading: false,

  deleteLoading: false,

  kpiLoading: false,

  exportLoading: false,

  purchaseOrderLoading: false,

  error: null,

  detailError: null,

  createError: null,

  updateError: null,

  deleteError: null,

  kpiError: null,

  exportError: null,
};

/* =========================================================
   SLICE
========================================================= */

const billSlice = createSlice({
  name: "bill",

  initialState,

  reducers: {
    clearBillError: (state) => {
      state.error = null;
    },

    clearBillDetailError: (state) => {
      state.detailError = null;
    },

    clearBillCreateError: (state) => {
      state.createError = null;
    },

    clearBillUpdateError: (state) => {
      state.updateError = null;
    },

    clearBillDeleteError: (state) => {
      state.deleteError = null;
    },

    clearBillKPIError: (state) => {
      state.kpiError = null;
    },

    clearBillExportError: (state) => {
      state.exportError = null;
    },

    clearSelectedBill: (state) => {
      state.selectedBill = null;
      state.detailError = null;
    },

    clearBills: (state) => {
      state.bills = [];

      state.pagination = {
        count: 0,
        next: null,
        previous: null,
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
      };
    },
  },

  extraReducers: (builder) => {
    /* =======================================================
       GET BILLS
    ======================================================= */

    builder
      .addCase(getBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getBills.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const payload = unwrapResponse(action.payload);

        state.bills = getRows(payload);

        const requestedPage =
          Number(action.meta?.arg?.page) || 1;

        const requestedPageSize =
          Number(action.meta?.arg?.page_size) || 10;

        const count =
          typeof payload?.count === "number"
            ? payload.count
            : state.bills.length;

        const pageSize =
          Number(payload?.page_size) ||
          requestedPageSize;

        const totalPages =
          Number(payload?.total_pages) ||
          Math.ceil(count / pageSize) ||
          1;

        state.pagination = {
          count,

          next: payload?.next ?? null,

          previous: payload?.previous ?? null,

          currentPage:
            Number(payload?.current_page) ||
            requestedPage,

          pageSize,

          totalPages,
        };
      })

      .addCase(getBills.rejected, (state, action) => {
        state.loading = false;

        state.error =
          getErrorMessage(
            action.payload,
            "Failed to fetch purchase bills",
          );

        state.bills = [];
      });

    /* =======================================================
       GET BILL BY ID
    ======================================================= */

    builder
      .addCase(getBillById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })

      .addCase(getBillById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detailError = null;

        state.selectedBill =
          unwrapResponse(action.payload) || null;
      })

      .addCase(getBillById.rejected, (state, action) => {
        state.detailLoading = false;

        state.detailError =
          getErrorMessage(
            action.payload,
            "Failed to fetch purchase bill",
          );

        state.selectedBill = null;
      });

    /* =======================================================
       BILL KPI
    ======================================================= */

    builder
      .addCase(getBillKPI.pending, (state) => {
        state.kpiLoading = true;
        state.kpiError = null;
      })

      .addCase(getBillKPI.fulfilled, (state, action) => {
        state.kpiLoading = false;
        state.kpiError = null;

        const payload =
          unwrapResponse(action.payload) || {};

        const source =
          payload?.kpi &&
          typeof payload.kpi === "object"
            ? payload.kpi
            : payload;

        state.kpi = {
          total_bill_value:
            source?.total_bill_value ??
            source?.total_value ??
            source?.bill_value ??
            0,

          total_payables:
            source?.total_payables ??
            source?.total_payable ??
            source?.payables ??
            0,

          total_debit_notes:
            source?.total_debit_notes ??
            source?.debit_notes ??
            0,

          overdue_payables:
            source?.overdue_payables ??
            source?.overdue_payable ??
            source?.overdue_amount ??
            0,

          total_bills:
            source?.total_bills ??
            source?.bill_count ??
            source?.total_bill ??
            0,
        };
      })

      .addCase(getBillKPI.rejected, (state, action) => {
        state.kpiLoading = false;

        state.kpiError =
          getErrorMessage(
            action.payload,
            "Failed to fetch bill KPI",
          );
      });

    /* =======================================================
       BILL SUMMARY
    ======================================================= */

    builder
      .addCase(getBillSummary.pending, (state) => {
        state.kpiLoading = true;
        state.kpiError = null;
      })

      .addCase(getBillSummary.fulfilled, (state, action) => {
        state.kpiLoading = false;
        state.kpiError = null;

        const payload =
          unwrapResponse(action.payload) || {};

        const source =
          payload?.kpi &&
          typeof payload.kpi === "object"
            ? payload.kpi
            : payload;

        state.kpi = {
          total_bill_value:
            source?.total_bill_value ??
            source?.total_value ??
            source?.bill_value ??
            0,

          total_payables:
            source?.total_payables ??
            source?.total_payable ??
            source?.payables ??
            0,

          total_debit_notes:
            source?.total_debit_notes ??
            source?.debit_notes ??
            0,

          overdue_payables:
            source?.overdue_payables ??
            source?.overdue_payable ??
            source?.overdue_amount ??
            0,

          total_bills:
            source?.total_bills ??
            source?.bill_count ??
            source?.total_bill ??
            0,
        };
      })

      .addCase(getBillSummary.rejected, (state, action) => {
        state.kpiLoading = false;

        state.kpiError =
          getErrorMessage(
            action.payload,
            "Failed to fetch bill KPI",
          );
      });

    /* =======================================================
       CREATE BILL
    ======================================================= */

    builder
      .addCase(addBill.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.error = null;
      })

      .addCase(addBill.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createError = null;

        state.selectedBill =
          unwrapResponse(action.payload) || null;
      })

      .addCase(addBill.rejected, (state, action) => {
        state.createLoading = false;

        state.createError =
          getErrorMessage(
            action.payload,
            "Failed to create purchase bill",
          );

        state.error = state.createError;
      });

    /* =======================================================
       FULL UPDATE
    ======================================================= */

    builder
      .addCase(editBill.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.error = null;
      })

      .addCase(editBill.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateError = null;

        const updatedBill =
          unwrapResponse(action.payload);

        state.selectedBill =
          updatedBill || state.selectedBill;

        if (updatedBill?.id) {
          const index = state.bills.findIndex(
            (bill) =>
              String(bill.id) ===
              String(updatedBill.id),
          );

          if (index !== -1) {
            state.bills[index] = updatedBill;
          }
        }
      })

      .addCase(editBill.rejected, (state, action) => {
        state.updateLoading = false;

        state.updateError =
          getErrorMessage(
            action.payload,
            "Failed to update purchase bill",
          );

        state.error = state.updateError;
      });

    /* =======================================================
       PARTIAL UPDATE
    ======================================================= */

    builder
      .addCase(patchBillById.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.error = null;
      })

      .addCase(
        patchBillById.fulfilled,
        (state, action) => {
          state.updateLoading = false;
          state.updateError = null;

          const updatedBill =
            unwrapResponse(action.payload);

          state.selectedBill =
            updatedBill || state.selectedBill;

          if (updatedBill?.id) {
            const index = state.bills.findIndex(
              (bill) =>
                String(bill.id) ===
                String(updatedBill.id),
            );

            if (index !== -1) {
              state.bills[index] = updatedBill;
            }
          }
        },
      )

      .addCase(
        patchBillById.rejected,
        (state, action) => {
          state.updateLoading = false;

          state.updateError =
            getErrorMessage(
              action.payload,
              "Failed to partially update purchase bill",
            );

          state.error = state.updateError;
        },
      );

    /* =======================================================
       DELETE BILL
    ======================================================= */

    builder
      .addCase(removeBill.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })

      .addCase(removeBill.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = null;

        state.bills = state.bills.filter(
          (bill) =>
            String(bill.id) !==
            String(action.payload),
        );

        if (state.pagination.count > 0) {
          state.pagination.count -= 1;
        }

        state.pagination.totalPages =
          Math.ceil(
            state.pagination.count /
              state.pagination.pageSize,
          ) || 1;

        if (
          state.selectedBill &&
          String(state.selectedBill.id) ===
            String(action.payload)
        ) {
          state.selectedBill = null;
        }
      })

      .addCase(removeBill.rejected, (state, action) => {
        state.deleteLoading = false;

        state.deleteError =
          getErrorMessage(
            action.payload,
            "This Bill cannot be deleted.",
          );

        state.error = state.deleteError;
      });

    /* =======================================================
       EXPORT
    ======================================================= */

    builder
      .addCase(exportBills.pending, (state) => {
        state.exportLoading = true;
        state.exportError = null;
      })

      .addCase(exportBills.fulfilled, (state) => {
        state.exportLoading = false;
        state.exportError = null;
      })

      .addCase(exportBills.rejected, (state, action) => {
        state.exportLoading = false;

        state.exportError =
          getErrorMessage(
            action.payload,
            "Failed to export bills",
          );
      });
  },
});

/* =========================================================
   SELECTORS
========================================================= */

export const selectBills = (state) =>
  state.bill?.bills || [];

export const selectSelectedBill = (state) =>
  state.bill?.selectedBill || null;

export const selectBillPagination = (state) =>
  state.bill?.pagination || {
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
  };

export const selectBillKPI = (state) =>
  state.bill?.kpi || {
    total_bill_value: 0,
    total_payables: 0,
    total_debit_notes: 0,
    overdue_payables: 0,
    total_bills: 0,
  };

export const selectBillLoading = (state) =>
  Boolean(state.bill?.loading);

export const selectBillDetailLoading = (state) =>
  Boolean(state.bill?.detailLoading);

export const selectBillCreateLoading = (state) =>
  Boolean(state.bill?.createLoading);

export const selectBillUpdateLoading = (state) =>
  Boolean(state.bill?.updateLoading);

export const selectBillDeleteLoading = (state) =>
  Boolean(state.bill?.deleteLoading);

export const selectBillKpiLoading = (state) =>
  Boolean(state.bill?.kpiLoading);

export const selectBillExportLoading = (state) =>
  Boolean(state.bill?.exportLoading);

export const selectBillError = (state) =>
  state.bill?.error || null;

export const selectBillDetailError = (state) =>
  state.bill?.detailError || null;

export const selectBillCreateError = (state) =>
  state.bill?.createError || null;

export const selectBillUpdateError = (state) =>
  state.bill?.updateError || null;

export const selectBillDeleteError = (state) =>
  state.bill?.deleteError || null;

export const selectBillKpiError = (state) =>
  state.bill?.kpiError || null;

export const selectBillExportError = (state) =>
  state.bill?.exportError || null;

/* =========================================================
   ACTIONS
========================================================= */

export const {
  clearBillError,
  clearBillDetailError,
  clearBillCreateError,
  clearBillUpdateError,
  clearBillDeleteError,
  clearBillKPIError,
  clearBillExportError,
  clearSelectedBill,
  clearBills,
} = billSlice.actions;

/* =========================================================
   REDUCER
========================================================= */

export default billSlice.reducer;