import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    getPayments,
    getPaymentById,
    createPayment as createPaymentApi,
    updatePayment as updatePaymentApi,
    patchPayment as patchPaymentApi,
    deletePayment as deletePaymentApi,
    getPaymentKPI,
    exportPayments as exportPaymentsApi,
} from "../../../services/finance/Sales/paymentService.js";

/* =========================================================
   HELPERS
========================================================= */

const getErrorMessage = (error, fallback) => {
    return (
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        fallback
    );
};

const normalizeListResponse = (response) => {
    if (Array.isArray(response)) {
        return {
            results: response,
            count: response.length,
            next: null,
            previous: null,
            currentPage: 1,
            totalPages: 1,
            pageSize: response.length || 10,
        };
    }

    const results = Array.isArray(response?.results)
        ? response.results
        : Array.isArray(response?.data)
            ? response.data
            : [];

    const count = Number(
        response?.count ??
        response?.total_items ??
        response?.total ??
        results.length,
    );

    const currentPage = Number(
        response?.current_page ??
        response?.currentPage ??
        response?.page ??
        1,
    );

    const pageSize = Number(
        response?.page_size ??
        response?.pageSize ??
        response?.per_page ??
        10,
    );

    const totalPages = Number(
        response?.total_pages ??
        response?.totalPages ??
        Math.max(1, Math.ceil(count / pageSize)),
    );

    return {
        results,
        count,
        next: response?.next ?? null,
        previous: response?.previous ?? null,
        currentPage,
        totalPages,
        pageSize,
    };
};

const normalizeKPI = (response) => {
    const data =
        response?.data ||
        response?.kpi ||
        response?.metrics ||
        response ||
        {};

    return {
        totalCollections:
            data.total_collections ??
            data.totalCollections ??
            data.total_collection ??
            0,

        thisMonthCollections:
            data.this_month_collections ??
            data.thisMonthCollections ??
            data.month_collections ??
            0,

        outstandingReceivables:
            data.outstanding_receivables ??
            data.outstandingReceivables ??
            data.outstanding_amount ??
            0,

        overdueReceivables:
            data.overdue_receivables ??
            data.overdueReceivables ??
            data.overdue_amount ??
            0,

        collectionRate:
            data.collection_rate ??
            data.collectionRate ??
            0,
    };
};

/* =========================================================
   GET PAYMENTS
========================================================= */

export const fetchPayments = createAsyncThunk(
    "payments/fetchPayments",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await getPayments(params);
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(error, "Failed to fetch payments"),
            );
        }
    },
);

/* =========================================================
   GET PAYMENT BY ID
========================================================= */

export const fetchPaymentById = createAsyncThunk(
    "payments/fetchPaymentById",
    async (id, { rejectWithValue }) => {
        try {
            return await getPaymentById(id);
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(error, "Failed to fetch payment"),
            );
        }
    },
);

/* =========================================================
   CREATE PAYMENT
========================================================= */

export const createPayment = createAsyncThunk(
    "payments/createPayment",
    async (payload, { rejectWithValue }) => {
        try {
            return await createPaymentApi(payload);
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(error, "Failed to create payment"),
            );
        }
    },
);

/* =========================================================
   UPDATE PAYMENT
========================================================= */

export const updatePayment = createAsyncThunk(
    "payments/updatePayment",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return await updatePaymentApi({ id, data });
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(error, "Failed to update payment"),
            );
        }
    },
);

/* =========================================================
   PATCH PAYMENT
========================================================= */

export const patchPayment = createAsyncThunk(
    "payments/patchPayment",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return await patchPaymentApi({ id, data });
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(error, "Failed to update payment"),
            );
        }
    },
);

/* =========================================================
   DELETE PAYMENT
========================================================= */

export const deletePayment = createAsyncThunk(
    "payments/deletePayment",
    async (id, { rejectWithValue }) => {
        try {
            return await deletePaymentApi(id);
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(error, "Failed to delete payment"),
            );
        }
    },
);

/* =========================================================
   PAYMENT KPI
========================================================= */

export const fetchPaymentKPI = createAsyncThunk(
    "payments/fetchPaymentKPI",
    async (_, { rejectWithValue }) => {
        try {
            return await getPaymentKPI();
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(error, "Failed to fetch payment KPI"),
            );
        }
    },
);

/* =========================================================
   EXPORT PAYMENTS
========================================================= */

export const exportPayments = createAsyncThunk(
    "payments/exportPayments",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await exportPaymentsApi(params);

            const contentDisposition =
                response.headers?.["content-disposition"];

            let filename = "payments.xlsx";

            if (contentDisposition) {
                const match = contentDisposition.match(
                    /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
                );

                if (match?.[1]) {
                    filename = match[1].replace(/['"]/g, "");
                }
            }

            const blobUrl = window.URL.createObjectURL(response.data);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(blobUrl);

            return filename;
        } catch (error) {
            return rejectWithValue(
                getErrorMessage(error, "Failed to export payments"),
            );
        }
    },
);

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
    payments: [],

    selectedPayment: null,

    kpi: {
        totalCollections: 0,
        thisMonthCollections: 0,
        outstandingReceivables: 0,
        overdueReceivables: 0,
        collectionRate: 0,
    },

    pagination: {
        count: 0,
        next: null,
        previous: null,
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
    },

    loading: false,
    listLoading: false,
    detailsLoading: false,
    kpiLoading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    exportLoading: false,

    error: null,
    successMessage: null,
};

/* =========================================================
   SLICE
========================================================= */

const paymentSlice = createSlice({
    name: "payments",
    initialState,

    reducers: {
        clearPaymentError: (state) => {
            state.error = null;
        },

        clearPaymentSuccess: (state) => {
            state.successMessage = null;
        },

        clearSelectedPayment: (state) => {
            state.selectedPayment = null;
        },
    },

    extraReducers: (builder) => {
        builder

            /* ================= LIST ================= */

            .addCase(fetchPayments.pending, (state) => {
                state.listLoading = true;
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchPayments.fulfilled, (state, action) => {
                const normalized = normalizeListResponse(action.payload);

                state.payments = normalized.results;

                state.pagination = {
                    count: normalized.count,
                    next: normalized.next,
                    previous: normalized.previous,
                    currentPage: normalized.currentPage,
                    totalPages: normalized.totalPages,
                    pageSize: normalized.pageSize,
                };

                state.listLoading = false;
                state.loading = false;
            })

            .addCase(fetchPayments.rejected, (state, action) => {
                state.listLoading = false;
                state.loading = false;
                state.error =
                    action.payload || "Failed to fetch payments";
            })

            /* ================= DETAILS ================= */

            .addCase(fetchPaymentById.pending, (state) => {
                state.detailsLoading = true;
                state.error = null;
            })

            .addCase(fetchPaymentById.fulfilled, (state, action) => {
                state.selectedPayment = action.payload;
                state.detailsLoading = false;
            })

            .addCase(fetchPaymentById.rejected, (state, action) => {
                state.detailsLoading = false;
                state.error =
                    action.payload || "Failed to fetch payment";
            })

            /* ================= CREATE ================= */

            .addCase(createPayment.pending, (state) => {
                state.createLoading = true;
                state.error = null;
                state.successMessage = null;
            })

            .addCase(createPayment.fulfilled, (state, action) => {
                state.createLoading = false;
                state.successMessage = "Payment recorded successfully";

                if (action.payload) {
                    state.selectedPayment = action.payload;
                }
            })

            .addCase(createPayment.rejected, (state, action) => {
                state.createLoading = false;
                state.error =
                    action.payload || "Failed to create payment";
            })

            /* ================= UPDATE ================= */

            .addCase(updatePayment.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
                state.successMessage = null;
            })

            .addCase(updatePayment.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.successMessage = "Payment updated successfully";
                state.selectedPayment = action.payload;
            })

            .addCase(updatePayment.rejected, (state, action) => {
                state.updateLoading = false;
                state.error =
                    action.payload || "Failed to update payment";
            })

            /* ================= PATCH ================= */

            .addCase(patchPayment.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
                state.successMessage = null;
            })

            .addCase(patchPayment.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.successMessage = "Payment updated successfully";
                state.selectedPayment = action.payload;
            })

            .addCase(patchPayment.rejected, (state, action) => {
                state.updateLoading = false;
                state.error =
                    action.payload || "Failed to update payment";
            })

            /* ================= DELETE ================= */

            .addCase(deletePayment.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })

            .addCase(deletePayment.fulfilled, (state, action) => {
                state.deleteLoading = false;

                state.payments = state.payments.filter(
                    (payment) => payment.id !== action.payload.id,
                );

                state.successMessage = "Payment deleted successfully";
            })

            .addCase(deletePayment.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error =
                    action.payload || "Failed to delete payment";
            })

            /* ================= KPI ================= */

            .addCase(fetchPaymentKPI.pending, (state) => {
                state.kpiLoading = true;
                state.error = null;
            })

            .addCase(fetchPaymentKPI.fulfilled, (state, action) => {
                state.kpi = normalizeKPI(action.payload);
                state.kpiLoading = false;
            })

            .addCase(fetchPaymentKPI.rejected, (state, action) => {
                state.kpiLoading = false;
                state.error =
                    action.payload || "Failed to fetch payment KPI";
            })

            /* ================= EXPORT ================= */

            .addCase(exportPayments.pending, (state) => {
                state.exportLoading = true;
                state.error = null;
            })

            .addCase(exportPayments.fulfilled, (state) => {
                state.exportLoading = false;
            })

            .addCase(exportPayments.rejected, (state, action) => {
                state.exportLoading = false;
                state.error =
                    action.payload || "Failed to export payments";
            });
    },
});

export const {
    clearPaymentError,
    clearPaymentSuccess,
    clearSelectedPayment,
} = paymentSlice.actions;

/* =========================================================
   SELECTORS
========================================================= */

export const selectPayments = (state) =>
    state.payments?.payments || [];

export const selectSelectedPayment = (state) =>
    state.payments?.selectedPayment || null;

export const selectPaymentKPI = (state) =>
    state.payments?.kpi || initialState.kpi;

export const selectPaymentPagination = (state) =>
    state.payments?.pagination || initialState.pagination;

export const selectPaymentLoading = (state) =>
    state.payments?.listLoading || false;

export const selectPaymentListLoading = (state) =>
    state.payments?.listLoading || false;

export const selectPaymentDetailsLoading = (state) =>
    state.payments?.detailsLoading || false;

export const selectPaymentCreateLoading = (state) =>
    state.payments?.createLoading || false;

export const selectPaymentUpdateLoading = (state) =>
    state.payments?.updateLoading || false;

export const selectPaymentDeleteLoading = (state) =>
    state.payments?.deleteLoading || false;

export const selectPaymentKpiLoading = (state) =>
    state.payments?.kpiLoading || false;

export const selectPaymentExportLoading = (state) =>
    state.payments?.exportLoading || false;

export const selectPaymentError = (state) =>
    state.payments?.error || null;

export const selectPaymentSuccessMessage = (state) =>
    state.payments?.successMessage || null;

export default paymentSlice.reducer;