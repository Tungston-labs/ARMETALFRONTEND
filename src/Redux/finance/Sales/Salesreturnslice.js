import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    fetchSalesReturnsApi,
    fetchSalesReturnByIdApi,
    createSalesReturnApi,
    updateSalesReturnApi,
    patchSalesReturnApi,
    deleteSalesReturnApi,
    exportSalesReturnsApi,
    fetchEligibleInvoicesApi,
    fetchInvoiceForReturnApi,
    fetchSalesReturnKpiApi,
} from "../../../services/finance/Sales/salesReturnService.js";

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */

const getErrorMessage = (error) => {
    if (!error) {
        return "Something went wrong.";
    }

    if (typeof error === "string") {
        return error;
    }

    if (error.detail) {
        return error.detail;
    }

    if (error.message) {
        return error.message;
    }

    if (error.error) {
        return error.error;
    }

    if (typeof error === "object") {
        const firstKey = Object.keys(error)[0];

        if (firstKey) {
            const value = error[firstKey];

            if (Array.isArray(value)) {
                return value.join(", ");
            }

            if (typeof value === "string") {
                return value;
            }
        }
    }

    return "Something went wrong.";
};

const normalizeListResponse = (response) => {
    if (Array.isArray(response)) {
        return {
            results: response,
            count: response.length,
            next: null,
            previous: null,
        };
    }

    if (Array.isArray(response?.results)) {
        return {
            results: response.results,
            count: response.count ?? response.results.length,
            next: response.next ?? null,
            previous: response.previous ?? null,
        };
    }

    if (Array.isArray(response?.data)) {
        return {
            results: response.data,
            count: response.count ?? response.data.length,
            next: response.next ?? null,
            previous: response.previous ?? null,
        };
    }

    if (Array.isArray(response?.items)) {
        return {
            results: response.items,
            count: response.count ?? response.items.length,
            next: response.next ?? null,
            previous: response.previous ?? null,
        };
    }

    return {
        results: [],
        count: 0,
        next: null,
        previous: null,
    };
};

/* -------------------------------------------------------
   Thunks
------------------------------------------------------- */

export const getSalesReturns = createAsyncThunk(
    "salesReturns/getSalesReturns",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchSalesReturnsApi(params);
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const getSalesReturnById = createAsyncThunk(
    "salesReturns/getSalesReturnById",
    async (id, { rejectWithValue }) => {
        try {
            return await fetchSalesReturnByIdApi(id);
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const addSalesReturn = createAsyncThunk(
    "salesReturns/addSalesReturn",
    async (salesReturnData, { rejectWithValue }) => {
        try {
            return await createSalesReturnApi(salesReturnData);
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const editSalesReturn = createAsyncThunk(
    "salesReturns/editSalesReturn",
    async ({ id, salesReturnData }, { rejectWithValue }) => {
        try {
            return await updateSalesReturnApi({
                id,
                payload: salesReturnData,
            });
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const patchSalesReturn = createAsyncThunk(
    "salesReturns/patchSalesReturn",
    async ({ id, salesReturnData }, { rejectWithValue }) => {
        try {
            return await patchSalesReturnApi({
                id,
                payload: salesReturnData,
            });
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const removeSalesReturn = createAsyncThunk(
    "salesReturns/removeSalesReturn",
    async (id, { rejectWithValue }) => {
        try {
            await deleteSalesReturnApi(id);

            return id;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const exportSalesReturns = createAsyncThunk(
    "salesReturns/exportSalesReturns",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await exportSalesReturnsApi(params);
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const getInvoices = createAsyncThunk(
    "salesReturns/getInvoices",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchEligibleInvoicesApi(params);
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const getInvoiceById = createAsyncThunk(
    "salesReturns/getInvoiceById",
    async (invoiceId, { rejectWithValue }) => {
        try {
            return await fetchInvoiceForReturnApi(invoiceId);
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const getSalesReturnSummary = createAsyncThunk(
    "salesReturns/getSalesReturnSummary",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchSalesReturnKpiApi(params);
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

/* -------------------------------------------------------
   Initial State
------------------------------------------------------- */

const initialState = {
    salesReturns: [],
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        next: null,
        previous: null,
    },

    kpi: {},

    selectedSalesReturn: null,

    invoices: [],
    selectedInvoice: null,

    loading: false,
    detailLoading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    exportLoading: false,
    invoiceLoading: false,
    kpiLoading: false,

    error: null,
};

/* -------------------------------------------------------
   Slice
------------------------------------------------------- */

const salesReturnSlice = createSlice({
    name: "salesReturns",

    initialState,

    reducers: {
        clearSalesReturnError: (state) => {
            state.error = null;
        },

        clearSelectedSalesReturn: (state) => {
            state.selectedSalesReturn = null;
        },

        clearSelectedInvoice: (state) => {
            state.selectedInvoice = null;
        },

        resetSalesReturnFormData: (state) => {
            state.selectedSalesReturn = null;
            state.selectedInvoice = null;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            /* -------------------------------------------------
               LIST
            ------------------------------------------------- */

            .addCase(getSalesReturns.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getSalesReturns.fulfilled, (state, action) => {
                state.loading = false;

                const response = normalizeListResponse(action.payload);

                state.salesReturns = response.results;

                state.pagination = {
                    currentPage:
                        Number(action.meta?.arg?.page) ||
                        state.pagination.currentPage ||
                        1,

                    totalPages: Math.max(
                        1,
                        Math.ceil(
                            response.count /
                            Number(action.meta?.arg?.page_size || 10),
                        ),
                    ),

                    totalCount: response.count,

                    next: response.next,

                    previous: response.previous,
                };
            })

            .addCase(getSalesReturns.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Unable to load Sales Returns.";
                state.salesReturns = [];
            })

            /* -------------------------------------------------
               GET DETAIL
            ------------------------------------------------- */

            .addCase(getSalesReturnById.pending, (state) => {
                state.detailLoading = true;
                state.error = null;
            })

            .addCase(getSalesReturnById.fulfilled, (state, action) => {
                state.detailLoading = false;
                state.selectedSalesReturn =
                    action.payload?.data || action.payload;
            })

            .addCase(getSalesReturnById.rejected, (state, action) => {
                state.detailLoading = false;
                state.error = action.payload || "Unable to load Sales Return.";
            })

            /* -------------------------------------------------
               CREATE
            ------------------------------------------------- */

            .addCase(addSalesReturn.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })

            .addCase(addSalesReturn.fulfilled, (state, action) => {
                state.createLoading = false;

                const createdReturn = action.payload?.data || action.payload;

                if (createdReturn) {
                    state.selectedSalesReturn = createdReturn;

                    state.salesReturns.unshift(createdReturn);
                }
            })

            .addCase(addSalesReturn.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload || "Unable to create Sales Return.";
            })

            /* -------------------------------------------------
               UPDATE
            ------------------------------------------------- */

            .addCase(editSalesReturn.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })

            .addCase(editSalesReturn.fulfilled, (state, action) => {
                state.updateLoading = false;

                const updatedReturn = action.payload?.data || action.payload;

                if (!updatedReturn) {
                    return;
                }

                state.selectedSalesReturn = updatedReturn;

                const index = state.salesReturns.findIndex(
                    (item) => String(item.id) === String(updatedReturn.id),
                );

                if (index !== -1) {
                    state.salesReturns[index] = updatedReturn;
                }
            })

            .addCase(editSalesReturn.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload || "Unable to update Sales Return.";
            })

            /* -------------------------------------------------
               PATCH
            ------------------------------------------------- */

            .addCase(patchSalesReturn.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })

            .addCase(patchSalesReturn.fulfilled, (state, action) => {
                state.updateLoading = false;

                const updatedReturn = action.payload?.data || action.payload;

                if (!updatedReturn) {
                    return;
                }

                state.selectedSalesReturn = updatedReturn;

                const index = state.salesReturns.findIndex(
                    (item) => String(item.id) === String(updatedReturn.id),
                );

                if (index !== -1) {
                    state.salesReturns[index] = updatedReturn;
                }
            })

            .addCase(patchSalesReturn.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload || "Unable to update Sales Return.";
            })

            /* -------------------------------------------------
               DELETE
            ------------------------------------------------- */

            .addCase(removeSalesReturn.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })

            .addCase(removeSalesReturn.fulfilled, (state, action) => {
                state.deleteLoading = false;

                state.salesReturns = state.salesReturns.filter(
                    (item) => String(item.id) !== String(action.payload),
                );

                state.pagination.totalCount = Math.max(
                    0,
                    state.pagination.totalCount - 1,
                );
            })

            .addCase(removeSalesReturn.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload || "Unable to delete Sales Return.";
            })

            /* -------------------------------------------------
               EXPORT
            ------------------------------------------------- */

            .addCase(exportSalesReturns.pending, (state) => {
                state.exportLoading = true;
                state.error = null;
            })

            .addCase(exportSalesReturns.fulfilled, (state) => {
                state.exportLoading = false;
            })

            .addCase(exportSalesReturns.rejected, (state, action) => {
                state.exportLoading = false;
                state.error = action.payload || "Unable to export Sales Returns.";
            })

            /* -------------------------------------------------
               INVOICES
            ------------------------------------------------- */

            .addCase(getInvoices.pending, (state) => {
                state.invoiceLoading = true;
                state.error = null;
            })

            .addCase(getInvoices.fulfilled, (state, action) => {
                state.invoiceLoading = false;

                const response = normalizeListResponse(action.payload);

                state.invoices = response.results;
            })

            .addCase(getInvoices.rejected, (state, action) => {
                state.invoiceLoading = false;
                state.error = action.payload || "Unable to load invoices.";
                state.invoices = [];
            })

            /* -------------------------------------------------
               INVOICE DETAIL
            ------------------------------------------------- */

            .addCase(getInvoiceById.pending, (state) => {
                state.invoiceLoading = true;
                state.selectedInvoice = null;
                state.error = null;
            })

            .addCase(getInvoiceById.fulfilled, (state, action) => {
                state.invoiceLoading = false;

                state.selectedInvoice =
                    action.payload?.data || action.payload;
            })

            .addCase(getInvoiceById.rejected, (state, action) => {
                state.invoiceLoading = false;
                state.error = action.payload || "Unable to load invoice details.";
            })

            /* -------------------------------------------------
               KPI
            ------------------------------------------------- */

            .addCase(getSalesReturnSummary.pending, (state) => {
                state.kpiLoading = true;
            })

            .addCase(getSalesReturnSummary.fulfilled, (state, action) => {
                state.kpiLoading = false;

                state.kpi =
                    action.payload?.data ||
                    action.payload?.results ||
                    action.payload ||
                    {};
            })

            .addCase(getSalesReturnSummary.rejected, (state, action) => {
                state.kpiLoading = false;
                state.error =
                    action.payload || "Unable to load Sales Return KPI.";
            });
    },
});

export const {
    clearSalesReturnError,
    clearSelectedSalesReturn,
    clearSelectedInvoice,
    resetSalesReturnFormData,
} = salesReturnSlice.actions;

/* -------------------------------------------------------
   Selectors
------------------------------------------------------- */

export const selectSalesReturns = (state) =>
    state.salesReturns?.salesReturns || [];

export const selectSalesReturnPagination = (state) =>
    state.salesReturns?.pagination || initialState.pagination;

export const selectSalesReturnKPI = (state) =>
    state.salesReturns?.kpi || {};

export const selectSalesReturnLoading = (state) =>
    state.salesReturns?.loading || false;

export const selectSalesReturnDetailLoading = (state) =>
    state.salesReturns?.detailLoading || false;

export const selectSalesReturnCreateLoading = (state) =>
    state.salesReturns?.createLoading || false;

export const selectSalesReturnUpdateLoading = (state) =>
    state.salesReturns?.updateLoading || false;

export const selectSalesReturnDeleteLoading = (state) =>
    state.salesReturns?.deleteLoading || false;

export const selectSalesReturnExportLoading = (state) =>
    state.salesReturns?.exportLoading || false;

export const selectSalesReturnError = (state) =>
    state.salesReturns?.error || null;

export const selectSelectedSalesReturn = (state) =>
    state.salesReturns?.selectedSalesReturn || null;

export const selectInvoices = (state) =>
    state.salesReturns?.invoices || [];

export const selectSelectedInvoice = (state) =>
    state.salesReturns?.selectedInvoice || null;

export const selectSalesReturnInvoiceLoading = (state) =>
    state.salesReturns?.invoiceLoading || false;

export const selectSalesReturnKpiLoading = (state) =>
    state.salesReturns?.kpiLoading || false;

export default salesReturnSlice.reducer;