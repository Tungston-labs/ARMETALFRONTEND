import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    fetchDebitNotes,
    fetchDebitNoteById,
    createDebitNote,
    updateDebitNote,
    patchDebitNote,
    deleteDebitNote,
    fetchBillDebitDetails,
    exportDebitNotes,
    fetchDebitNoteKpi,
} from "../../../services/finance/purchases/debitNotesService";

/* =========================================================
   GET LIST
========================================================= */

export const getDebitNotes = createAsyncThunk(
    "debitNote/getDebitNotes",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchDebitNotes(params);
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

/* =========================================================
   GET SINGLE
========================================================= */

export const getDebitNoteById = createAsyncThunk(
    "debitNote/getDebitNoteById",
    async (id, { rejectWithValue }) => {
        try {
            return await fetchDebitNoteById(id);
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

/* =========================================================
   CREATE
========================================================= */

export const addDebitNote = createAsyncThunk(
    "debitNote/addDebitNote",
    async (payload, { rejectWithValue }) => {
        try {
            return await createDebitNote(payload);
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

/* =========================================================
   PUT
========================================================= */

export const editDebitNote = createAsyncThunk(
    "debitNote/editDebitNote",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return await updateDebitNote(id, data);
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

/* =========================================================
   PATCH
========================================================= */

export const patchExistingDebitNote = createAsyncThunk(
    "debitNote/patchDebitNote",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            return await patchDebitNote(id, data);
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

/* =========================================================
   DELETE
========================================================= */

export const removeDebitNote = createAsyncThunk(
    "debitNote/removeDebitNote",
    async (id, { rejectWithValue }) => {
        try {
            await deleteDebitNote(id);

            return id;
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

/* =========================================================
   BILL DETAILS
========================================================= */

export const getBillDebitDetails = createAsyncThunk(
    "debitNote/getBillDebitDetails",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchBillDebitDetails(params);
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

/* =========================================================
   KPI
========================================================= */

export const getDebitNoteKpi = createAsyncThunk(
    "debitNote/getDebitNoteKpi",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchDebitNoteKpi(params);
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

/* =========================================================
   EXPORT
========================================================= */

export const exportDebitNoteList = createAsyncThunk(
    "debitNote/exportDebitNotes",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await exportDebitNotes(params);
        } catch (error) {
            return rejectWithValue(getApiError(error));
        }
    }
);

/* =========================================================
   HELPERS
========================================================= */

const extractList = (payload) => {
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

const extractCount = (payload, fallback) => {
    if (typeof payload?.count === "number") {
        return payload.count;
    }

    if (typeof payload?.total_items === "number") {
        return payload.total_items;
    }

    if (typeof payload?.total === "number") {
        return payload.total;
    }

    if (typeof payload?.data?.count === "number") {
        return payload.data.count;
    }

    return fallback;
};

const formatError = (error) => {
    if (!error) {
        return "Something went wrong.";
    }

    if (typeof error === "string") {
        return error;
    }

    if (error.detail) {
        return error.detail;
    }

    if (typeof error === "object") {
        return Object.entries(error)
            .map(([field, value]) => {
                const message = Array.isArray(value)
                    ? value.join(", ")
                    : String(value);

                return `${field}: ${message}`;
            })
            .join(" | ");
    }

    return "Something went wrong.";
};

const getApiError = (error) =>
    formatError(error?.response?.data ?? error?.message);

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
    debitNotes: [],
    selectedDebitNote: null,

    totalItems: 0,

    kpi: {},

    billDetails: null,

    loading: false,
    detailsLoading: false,
    submitting: false,
    deleting: false,
    kpiLoading: false,
    billDetailsLoading: false,
    exporting: false,

    error: null,
    message: null,
};

/* =========================================================
   SLICE
========================================================= */

const debitNoteSlice = createSlice({
    name: "debitNote",
    initialState,

    reducers: {
        clearDebitNoteError: (state) => {
            state.error = null;
        },

        clearDebitNoteMessage: (state) => {
            state.message = null;
        },

        clearSelectedDebitNote: (state) => {
            state.selectedDebitNote = null;
        },

        clearBillDebitDetails: (state) => {
            state.billDetails = null;
        },
    },

    extraReducers: (builder) => {
        /* ================= LIST ================= */

        builder
            .addCase(getDebitNotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getDebitNotes.fulfilled, (state, action) => {
                state.loading = false;

                state.debitNotes = extractList(action.payload);

                state.totalItems = extractCount(
                    action.payload,
                    state.debitNotes.length
                );
            })

            .addCase(getDebitNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        /* ================= DETAILS ================= */

        builder
            .addCase(getDebitNoteById.pending, (state) => {
                state.detailsLoading = true;
                state.error = null;
            })

            .addCase(getDebitNoteById.fulfilled, (state, action) => {
                state.detailsLoading = false;
                state.selectedDebitNote = action.payload;
            })

            .addCase(getDebitNoteById.rejected, (state, action) => {
                state.detailsLoading = false;
                state.error = action.payload;
            });

        /* ================= CREATE ================= */

        builder
            .addCase(addDebitNote.pending, (state) => {
                state.submitting = true;
                state.error = null;
                state.message = null;
            })

            .addCase(addDebitNote.fulfilled, (state, action) => {
                state.submitting = false;

                state.message =
                    action.payload?.message ||
                    "Debit Note created successfully.";
            })

            .addCase(addDebitNote.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });

        /* ================= PUT ================= */

        builder
            .addCase(editDebitNote.pending, (state) => {
                state.submitting = true;
                state.error = null;
                state.message = null;
            })

            .addCase(editDebitNote.fulfilled, (state, action) => {
                state.submitting = false;

                state.selectedDebitNote = action.payload;

                state.message =
                    action.payload?.message ||
                    "Debit Note updated successfully.";
            })

            .addCase(editDebitNote.rejected, (state, action) => {
                state.submitting = false;
                state.error = action.payload;
            });

        /* ================= PATCH ================= */

        builder
            .addCase(patchExistingDebitNote.pending, (state) => {
                state.submitting = true;
                state.error = null;
            })

            .addCase(patchExistingDebitNote.fulfilled, (state, action) => {
                state.submitting = false;

                state.selectedDebitNote = action.payload;
            })

            .addCase(
                patchExistingDebitNote.rejected,
                (state, action) => {
                    state.submitting = false;
                    state.error = action.payload;
                }
            );

        /* ================= DELETE ================= */

        builder
            .addCase(removeDebitNote.pending, (state) => {
                state.deleting = true;
                state.error = null;
            })

            .addCase(removeDebitNote.fulfilled, (state, action) => {
                state.deleting = false;

                state.debitNotes = state.debitNotes.filter(
                    (item) => item.id !== action.payload
                );

                state.totalItems = Math.max(
                    0,
                    state.totalItems - 1
                );

                state.message =
                    "Debit Note deleted successfully.";
            })

            .addCase(removeDebitNote.rejected, (state, action) => {
                state.deleting = false;
                state.error = action.payload;
            });

        /* ================= KPI ================= */

        builder
            .addCase(getDebitNoteKpi.pending, (state) => {
                state.kpiLoading = true;
            })

            .addCase(getDebitNoteKpi.fulfilled, (state, action) => {
                state.kpiLoading = false;

                state.kpi =
                    action.payload?.data ||
                    action.payload ||
                    {};
            })

            .addCase(getDebitNoteKpi.rejected, (state, action) => {
                state.kpiLoading = false;
                state.error = action.payload;
            });

        /* ================= BILL DETAILS ================= */

        builder
            .addCase(getBillDebitDetails.pending, (state) => {
                state.billDetailsLoading = true;
            })

            .addCase(
                getBillDebitDetails.fulfilled,
                (state, action) => {
                    state.billDetailsLoading = false;
                    state.billDetails = action.payload;
                }
            )

            .addCase(
                getBillDebitDetails.rejected,
                (state, action) => {
                    state.billDetailsLoading = false;
                    state.error = action.payload;
                }
            );

        /* ================= EXPORT ================= */

        builder
            .addCase(exportDebitNoteList.pending, (state) => {
                state.exporting = true;
            })

            .addCase(exportDebitNoteList.fulfilled, (state) => {
                state.exporting = false;
            })

            .addCase(
                exportDebitNoteList.rejected,
                (state, action) => {
                    state.exporting = false;
                    state.error = action.payload;
                }
            );
    },
});

export const {
    clearDebitNoteError,
    clearDebitNoteMessage,
    clearSelectedDebitNote,
    clearBillDebitDetails,
} = debitNoteSlice.actions;

export default debitNoteSlice.reducer;