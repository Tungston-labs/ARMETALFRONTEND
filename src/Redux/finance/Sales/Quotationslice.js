import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    fetchQuotations,
    fetchQuotationById,
    createQuotation,
    updateQuotation,
    patchQuotation,
    deleteQuotation,
    fetchQuotationKpi,
    fetchQuotationSummary,
    convertQuotationToSO
} from "../../../services/finance/Sales/Quotationservice";

// GET Quotations
export const getQuotations = createAsyncThunk(
    "quotation/getQuotations",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchQuotations(params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// GET Quotation By ID
export const getQuotationById = createAsyncThunk(
    "quotation/getQuotationById",
    async (id, { rejectWithValue }) => {
        try {
            return await fetchQuotationById(id);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// CREATE Quotation
export const addQuotation = createAsyncThunk(
    "quotation/addQuotation",
    async (quotationData, { rejectWithValue }) => {
        try {
            return await createQuotation(quotationData);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// UPDATE Quotation - PUT
export const editQuotation = createAsyncThunk(
    "quotation/editQuotation",
    async ({ id, quotationData }, { rejectWithValue }) => {
        try {
            return await updateQuotation(id, quotationData);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// PATCH Quotation
export const updateQuotationPartial = createAsyncThunk(
    "quotation/updateQuotationPartial",
    async ({ id, quotationData }, { rejectWithValue }) => {
        try {
            return await patchQuotation(id, quotationData);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// DELETE Quotation
export const removeQuotation = createAsyncThunk(
    "quotation/removeQuotation",
    async (id, { rejectWithValue }) => {
        try {
            const response = await deleteQuotation(id);
            return { id, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// GET Quotation KPI
export const getQuotationKpi = createAsyncThunk(
    "quotation/getQuotationKpi",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchQuotationKpi(params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// GET Quotation Summary
export const getQuotationSummary = createAsyncThunk(
    "quotation/getQuotationSummary",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchQuotationSummary(params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// CONVERT Quotation To Sales Order
export const convertQuotationToSalesOrder = createAsyncThunk(
    "quotation/convertQuotationToSalesOrder",
    async ({ id, convertData = {} }, { rejectWithValue }) => {
        try {
            const response = await convertQuotationToSO(id, convertData);
            return { id, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    quotations: [],
    selectedQuotation: null,
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,

    // aggregates returned with the list response
    totalQuotations: 0,
    totalQuotationValue: 0,
    totalNegotiationAmount: 0,
    approvedQuotes: 0,
    rejectedQuotes: 0,
    pendingQuotes: 0,

    kpi: null,
    summary: null,

    loading: false,
    detailLoading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    kpiLoading: false,
    summaryLoading: false,
    convertLoading: false,

    error: null,
    successMessage: null,
};

// Replace a quotation in the list and in selectedQuotation
const replaceQuotation = (state, updated) => {
    if (!updated) return;

    state.selectedQuotation = updated;

    const index = state.quotations.findIndex(
        (quotation) => quotation.id === updated.id
    );

    if (index !== -1) {
        state.quotations[index] = updated;
    }
};

const quotationSlice = createSlice({
    name: "quotation",

    initialState,

    reducers: {
        clearQuotationError: (state) => {
            state.error = null;
        },

        clearQuotationMessage: (state) => {
            state.successMessage = null;
        },

        clearSelectedQuotation: (state) => {
            state.selectedQuotation = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // ==========================================
            // GET QUOTATIONS
            // ==========================================

            .addCase(getQuotations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getQuotations.fulfilled, (state, action) => {
                state.loading = false;
                const data = action.payload || {};
                state.quotations = data.results || [];
                state.totalItems = data.total_items || 0;
                state.totalPages = data.total_pages || 0;
                state.currentPage = data.current_page || 1;

                state.totalQuotations = data.total_quotations || 0;
                state.totalQuotationValue = data.total_quotation_value || 0;
                state.totalNegotiationAmount = data.negotiation_amount || 0;
                state.approvedQuotes = data.approved_quotes || 0;
                state.rejectedQuotes = data.rejected_quotes || 0;
                state.pendingQuotes = data.pending_quotes || 0;
            })

            .addCase(getQuotations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ==========================================
            // GET QUOTATION BY ID
            // ==========================================

            .addCase(getQuotationById.pending, (state) => {
                state.detailLoading = true;
                state.error = null;
            })

            .addCase(getQuotationById.fulfilled, (state, action) => {
                state.detailLoading = false;
                state.selectedQuotation = action.payload?.data || action.payload;
            })

            .addCase(getQuotationById.rejected, (state, action) => {
                state.detailLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // CREATE QUOTATION
            // ==========================================

            .addCase(addQuotation.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })

            .addCase(addQuotation.fulfilled, (state, action) => {
                state.createLoading = false;
                state.successMessage =
                    action.payload?.message || "Quotation created successfully.";

                // API returns the quotation object directly (or wrapped in data)
                const quotation = action.payload?.data || action.payload;
                if (quotation?.id) {
                    state.selectedQuotation = quotation;
                    state.quotations.unshift(quotation);
                    state.totalItems += 1;
                    state.totalQuotations += 1;
                    if (quotation.status === "pending") {
                        state.pendingQuotes += 1;
                    }
                }
            })

            .addCase(addQuotation.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // UPDATE QUOTATION - PUT
            // ==========================================

            .addCase(editQuotation.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })

            .addCase(editQuotation.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.successMessage =
                    action.payload?.message || "Quotation updated successfully.";

                replaceQuotation(state, action.payload?.data || action.payload);
            })

            .addCase(editQuotation.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // PATCH QUOTATION
            // ==========================================

            .addCase(updateQuotationPartial.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })

            .addCase(updateQuotationPartial.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.successMessage =
                    action.payload?.message || "Quotation updated successfully.";

                replaceQuotation(state, action.payload?.data || action.payload);
            })

            .addCase(updateQuotationPartial.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // DELETE QUOTATION
            // ==========================================

            .addCase(removeQuotation.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })

            .addCase(removeQuotation.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.successMessage =
                    action.payload?.message || "Quotation deleted successfully.";

                state.quotations = state.quotations.filter(
                    (quotation) => quotation.id !== action.payload.id
                );

                state.totalItems = Math.max(0, state.totalItems - 1);
                state.totalQuotations = Math.max(0, state.totalQuotations - 1);

                if (state.selectedQuotation?.id === action.payload.id) {
                    state.selectedQuotation = null;
                }
            })

            .addCase(removeQuotation.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // QUOTATION KPI
            // ==========================================

            .addCase(getQuotationKpi.pending, (state) => {
                state.kpiLoading = true;
                state.error = null;
            })

            .addCase(getQuotationKpi.fulfilled, (state, action) => {
                state.kpiLoading = false;
                state.kpi = action.payload?.data || action.payload;
            })

            .addCase(getQuotationKpi.rejected, (state, action) => {
                state.kpiLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // QUOTATION SUMMARY
            // ==========================================

            .addCase(getQuotationSummary.pending, (state) => {
                state.summaryLoading = true;
                state.error = null;
            })

            .addCase(getQuotationSummary.fulfilled, (state, action) => {
                state.summaryLoading = false;
                state.summary = action.payload?.data || action.payload;
            })

            .addCase(getQuotationSummary.rejected, (state, action) => {
                state.summaryLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // CONVERT QUOTATION TO SALES ORDER
            // ==========================================

            .addCase(convertQuotationToSalesOrder.pending, (state) => {
                state.convertLoading = true;
                state.error = null;
            })

            .addCase(convertQuotationToSalesOrder.fulfilled, (state, action) => {
                state.convertLoading = false;
                state.successMessage =
                    action.payload?.message ||
                    "Quotation converted to sales order successfully.";

                // Mark the quotation as converted locally
                const id = action.payload.id;

                const quotation = state.quotations.find((q) => q.id === id);
                if (quotation) {
                    if (quotation.status === "pending" && state.pendingQuotes > 0) {
                        state.pendingQuotes -= 1;
                    }
                    quotation.status = "converted";
                }

                if (state.selectedQuotation?.id === id) {
                    state.selectedQuotation.status = "converted";
                }
            })

            .addCase(convertQuotationToSalesOrder.rejected, (state, action) => {
                state.convertLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearQuotationError,
    clearQuotationMessage,
    clearSelectedQuotation,
} = quotationSlice.actions;

// Selectors
export const selectQuotations = (state) =>
    state.quotation?.quotations || [];

export const selectSelectedQuotation = (state) =>
    state.quotation?.selectedQuotation || null;

export const selectQuotationLoading = (state) =>
    state.quotation?.loading || false;

export const selectQuotationDetailLoading = (state) =>
    state.quotation?.detailLoading || false;

export const selectQuotationCreateLoading = (state) =>
    state.quotation?.createLoading || false;

export const selectQuotationUpdateLoading = (state) =>
    state.quotation?.updateLoading || false;

export const selectQuotationDeleteLoading = (state) =>
    state.quotation?.deleteLoading || false;

export const selectQuotationKpi = (state) =>
    state.quotation?.kpi || null;

export const selectQuotationKpiLoading = (state) =>
    state.quotation?.kpiLoading || false;

export const selectQuotationSummary = (state) =>
    state.quotation?.summary || null;

export const selectQuotationSummaryLoading = (state) =>
    state.quotation?.summaryLoading || false;

export const selectQuotationConvertLoading = (state) =>
    state.quotation?.convertLoading || false;

export const selectQuotationError = (state) =>
    state.quotation?.error || null;

export default quotationSlice.reducer;