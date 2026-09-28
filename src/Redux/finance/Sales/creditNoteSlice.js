import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import creditNoteService from "../../../services/finance/Sales/creditNoteService";

/* =========================================================
   RESPONSE HELPERS
========================================================= */

const getResults = (response) => {
    if (Array.isArray(response)) {
        return response;
    }

    if (Array.isArray(response?.results)) {
        return response.results;
    }

    if (Array.isArray(response?.data)) {
        return response.data;
    }

    if (Array.isArray(response?.credit_notes)) {
        return response.credit_notes;
    }

    return [];
};

const getTotalItems = (response, results) => {
    return (
        response?.count ??
        response?.total ??
        response?.total_items ??
        response?.total_count ??
        results.length
    );
};

const getTotalPages = (response, totalItems, pageSize) => {
    if (response?.total_pages !== undefined) {
        return response.total_pages;
    }

    if (response?.totalPages !== undefined) {
        return response.totalPages;
    }

    if (response?.pages !== undefined) {
        return response.pages;
    }

    return Math.max(1, Math.ceil(totalItems / pageSize));
};

/* =========================================================
   ERROR
========================================================= */

const getErrorMessage = (error) => {
    return (
        error?.response?.data ||
        error?.message ||
        "Something went wrong while processing the credit note."
    );
};

/* =========================================================
   LIST
========================================================= */

export const fetchCreditNotes = createAsyncThunk(
    "creditNotes/fetchCreditNotes",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await creditNoteService.getAll(params);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    },
);

/* =========================================================
   DETAILS
========================================================= */

export const fetchCreditNoteById = createAsyncThunk(
    "creditNotes/fetchCreditNoteById",
    async (id, { rejectWithValue }) => {
        try {
            return await creditNoteService.getById(id);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    },
);

/* =========================================================
   INVOICE DETAILS
========================================================= */

export const fetchInvoiceCreditNoteDetails = createAsyncThunk(
    "creditNotes/fetchInvoiceCreditNoteDetails",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await creditNoteService.getInvoiceDetails(params);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    },
);

/* =========================================================
   CREATE
========================================================= */

export const addCreditNote = createAsyncThunk(
    "creditNotes/addCreditNote",
    async (payload, { rejectWithValue }) => {
        try {
            return await creditNoteService.create(payload);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    },
);

/* =========================================================
   PUT
========================================================= */

export const editCreditNote = createAsyncThunk(
    "creditNotes/editCreditNote",
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            return await creditNoteService.update(id, payload);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    },
);

/* =========================================================
   PATCH
========================================================= */

export const patchCreditNote = createAsyncThunk(
    "creditNotes/patchCreditNote",
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            return await creditNoteService.patch(id, payload);
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    },
);

/* =========================================================
   DELETE
========================================================= */

export const removeCreditNote = createAsyncThunk(
    "creditNotes/removeCreditNote",
    async (id, { rejectWithValue }) => {
        try {
            await creditNoteService.remove(id);

            return id;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    },
);

/* =========================================================
   KPI
========================================================= */

export const fetchCreditNoteKpi = createAsyncThunk(
    "creditNotes/fetchCreditNoteKpi",
    async (_, { rejectWithValue }) => {
        try {
            return await creditNoteService.getKpi();
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    },
);

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
    creditNotes: [],

    selectedCreditNote: null,

    invoiceDetails: null,
    invoiceDetailsLoading: false,
    invoiceDetailsError: null,

    kpi: {},

    totalItems: 0,
    totalPages: 1,

    loading: false,
    detailsLoading: false,
    submitting: false,

    error: null,
    submitError: null,
};

/* =========================================================
   SLICE
========================================================= */

const creditNoteSlice = createSlice({
    name: "creditNotes",

    initialState,

    reducers: {
        clearSelectedCreditNote: (state) => {
            state.selectedCreditNote = null;
        },

        clearInvoiceDetails: (state) => {
            state.invoiceDetails = null;
            state.invoiceDetailsError = null;
        },

        clearCreditNoteError: (state) => {
            state.error = null;
            state.submitError = null;
            state.invoiceDetailsError = null;
        },
    },

    extraReducers: (builder) => {
        builder

            /* =====================================================
               LIST
            ===================================================== */

            .addCase(fetchCreditNotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchCreditNotes.fulfilled, (state, action) => {
                state.loading = false;

                const response = action.payload || {};
                const results = getResults(response);

                state.creditNotes = results;

                state.totalItems = getTotalItems(
                    response,
                    results,
                );

                const pageSize =
                    response?.page_size ||
                    response?.pageSize ||
                    response?.per_page ||
                    10;

                state.totalPages = getTotalPages(
                    response,
                    state.totalItems,
                    pageSize,
                );
            })

            .addCase(fetchCreditNotes.rejected, (state, action) => {
                state.loading = false;

                state.error =
                    action.payload ||
                    "Failed to load credit notes.";
            })

            /* =====================================================
               DETAILS
            ===================================================== */

            .addCase(fetchCreditNoteById.pending, (state) => {
                state.detailsLoading = true;
                state.error = null;
            })

            .addCase(fetchCreditNoteById.fulfilled, (state, action) => {
                state.detailsLoading = false;
                state.selectedCreditNote = action.payload;
            })

            .addCase(fetchCreditNoteById.rejected, (state, action) => {
                state.detailsLoading = false;

                state.error =
                    action.payload ||
                    "Failed to load credit note details.";
            })

            /* =====================================================
               INVOICE DETAILS
            ===================================================== */

            .addCase(
                fetchInvoiceCreditNoteDetails.pending,
                (state) => {
                    state.invoiceDetailsLoading = true;
                    state.invoiceDetailsError = null;
                },
            )

            .addCase(
                fetchInvoiceCreditNoteDetails.fulfilled,
                (state, action) => {
                    state.invoiceDetailsLoading = false;
                    state.invoiceDetails = action.payload;
                },
            )

            .addCase(
                fetchInvoiceCreditNoteDetails.rejected,
                (state, action) => {
                    state.invoiceDetailsLoading = false;

                    state.invoiceDetailsError =
                        action.payload ||
                        "Failed to load invoice details.";
                },
            )

            /* =====================================================
               CREATE
            ===================================================== */

            .addCase(addCreditNote.pending, (state) => {
                state.submitting = true;
                state.submitError = null;
            })

            .addCase(addCreditNote.fulfilled, (state, action) => {
                state.submitting = false;

                if (action.payload) {
                    state.creditNotes = [
                        action.payload,
                        ...state.creditNotes,
                    ];
                }
            })

            .addCase(addCreditNote.rejected, (state, action) => {
                state.submitting = false;

                state.submitError =
                    action.payload ||
                    "Failed to create credit note.";
            })

            /* =====================================================
               PUT
            ===================================================== */

            .addCase(editCreditNote.pending, (state) => {
                state.submitting = true;
                state.submitError = null;
            })

            .addCase(editCreditNote.fulfilled, (state, action) => {
                state.submitting = false;

                const updated = action.payload;

                if (!updated?.id) {
                    return;
                }

                state.creditNotes = state.creditNotes.map(
                    (item) =>
                        String(item.id) === String(updated.id)
                            ? updated
                            : item,
                );

                state.selectedCreditNote = updated;
            })

            .addCase(editCreditNote.rejected, (state, action) => {
                state.submitting = false;

                state.submitError =
                    action.payload ||
                    "Failed to update credit note.";
            })

            /* =====================================================
               PATCH
            ===================================================== */

            .addCase(patchCreditNote.pending, (state) => {
                state.submitting = true;
                state.submitError = null;
            })

            .addCase(patchCreditNote.fulfilled, (state, action) => {
                state.submitting = false;

                const updated = action.payload;

                if (!updated?.id) {
                    return;
                }

                state.creditNotes = state.creditNotes.map(
                    (item) =>
                        String(item.id) === String(updated.id)
                            ? updated
                            : item,
                );

                state.selectedCreditNote = updated;
            })

            .addCase(patchCreditNote.rejected, (state, action) => {
                state.submitting = false;

                state.submitError =
                    action.payload ||
                    "Failed to update credit note.";
            })

            /* =====================================================
               DELETE
            ===================================================== */

            .addCase(removeCreditNote.pending, (state) => {
                state.submitError = null;
            })

            .addCase(removeCreditNote.fulfilled, (state, action) => {
                state.creditNotes = state.creditNotes.filter(
                    (item) =>
                        String(item.id) !==
                        String(action.payload),
                );

                state.totalItems = Math.max(
                    0,
                    state.totalItems - 1,
                );
            })

            .addCase(removeCreditNote.rejected, (state, action) => {
                state.submitError =
                    action.payload ||
                    "Failed to delete credit note.";
            })

            /* =====================================================
               KPI
            ===================================================== */

            .addCase(fetchCreditNoteKpi.fulfilled, (state, action) => {
                state.kpi = action.payload || {};
            })

            .addCase(fetchCreditNoteKpi.rejected, (state, action) => {
                state.error =
                    action.payload ||
                    "Failed to load credit note KPI.";
            });
    },
});

export const {
    clearSelectedCreditNote,
    clearInvoiceDetails,
    clearCreditNoteError,
} = creditNoteSlice.actions;

export default creditNoteSlice.reducer;