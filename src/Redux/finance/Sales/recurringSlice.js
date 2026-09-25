import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    createRecurringService,
    fetchRecurringServices,
    fetchRecurringServiceById,
    updateRecurringService,
    patchRecurringService,
    deleteRecurringService,
    fetchRecurringBilling,
    fetchRecurringBillingById,
    updateRecurringBilling,
    patchRecurringBilling,
    deleteRecurringBilling,
    fetchRecurringBillingDashboard,
    fetchRecurringSummary,
} from "../../../services/finance/Sales/RecurringService";

// CREATE Recurring Service (service + pricing plans + billing)
export const addRecurringService = createAsyncThunk(
    "recurring/addRecurringService",
    async (payload, { rejectWithValue }) => {
        try {
            return await createRecurringService(payload);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// GET Recurring Services (list)
export const getRecurringServices = createAsyncThunk(
    "recurring/getRecurringServices",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchRecurringServices(params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// GET Recurring Service By ID
export const getRecurringServiceById = createAsyncThunk(
    "recurring/getRecurringServiceById",
    async (id, { rejectWithValue }) => {
        try {
            return await fetchRecurringServiceById(id);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// UPDATE Recurring Service - PUT
export const editRecurringService = createAsyncThunk(
    "recurring/editRecurringService",
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            return await updateRecurringService(id, payload);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// PATCH Recurring Service
export const updateRecurringServicePartial = createAsyncThunk(
    "recurring/updateRecurringServicePartial",
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            return await patchRecurringService(id, payload);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// DELETE Recurring Service
export const removeRecurringService = createAsyncThunk(
    "recurring/removeRecurringService",
    async (id, { rejectWithValue }) => {
        try {
            const response = await deleteRecurringService(id);
            return { id, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// GET Recurring Billing (list)
export const getRecurringBilling = createAsyncThunk(
    "recurring/getRecurringBilling",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchRecurringBilling(params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// GET Recurring Billing By ID
export const getRecurringBillingById = createAsyncThunk(
    "recurring/getRecurringBillingById",
    async (id, { rejectWithValue }) => {
        try {
            return await fetchRecurringBillingById(id);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// UPDATE Recurring Billing - PUT
export const editRecurringBilling = createAsyncThunk(
    "recurring/editRecurringBilling",
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            return await updateRecurringBilling(id, payload);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// PATCH Recurring Billing
export const updateRecurringBillingPartial = createAsyncThunk(
    "recurring/updateRecurringBillingPartial",
    async ({ id, payload }, { rejectWithValue }) => {
        try {
            return await patchRecurringBilling(id, payload);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// DELETE Recurring Billing
export const removeRecurringBilling = createAsyncThunk(
    "recurring/removeRecurringBilling",
    async (id, { rejectWithValue }) => {
        try {
            const response = await deleteRecurringBilling(id);
            return { id, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// GET Recurring Billing Dashboard
export const getRecurringBillingDashboard = createAsyncThunk(
    "recurring/getRecurringBillingDashboard",
    async (_, { rejectWithValue }) => {
        try {
            return await fetchRecurringBillingDashboard();
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// GET Recurring Summary
export const getRecurringSummary = createAsyncThunk(
    "recurring/getRecurringSummary",
    async (_, { rejectWithValue }) => {
        try {
            return await fetchRecurringSummary();
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    // CREATE
    createLoading: false,
    createError: null,
    successMessage: null,

    // SERVICES LIST
    services: [],
    servicesTotalItems: 0,
    servicesTotalPages: 0,
    servicesCurrentPage: 1,
    servicesLoading: false,
    servicesError: null,

    // SELECTED SERVICE
    selectedService: null,
    serviceDetailLoading: false,
    serviceDetailError: null,

    updateLoading: false,
    updateError: null,

    deleteLoading: false,
    deleteError: null,

    // BILLING LIST
    billing: [],
    billingTotalItems: 0,
    billingTotalPages: 0,
    billingCurrentPage: 1,
    billingLoading: false,
    billingError: null,

    // SELECTED BILLING
    selectedBilling: null,
    billingDetailLoading: false,
    billingDetailError: null,

    billingUpdateLoading: false,
    billingUpdateError: null,

    billingDeleteLoading: false,
    billingDeleteError: null,

    // DASHBOARD
    billingDashboard: null,
    billingDashboardLoading: false,
    billingDashboardError: null,

    // SUMMARY
    summary: null,
    summaryLoading: false,
    summaryError: null,
};

const recurringSlice = createSlice({
    name: "recurring",

    initialState,

    reducers: {
        clearRecurringMessage: (state) => {
            state.successMessage = null;
        },

        clearSelectedService: (state) => {
            state.selectedService = null;
        },

        clearSelectedBilling: (state) => {
            state.selectedBilling = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // ==========================================
            // CREATE RECURRING SERVICE
            // ==========================================

            .addCase(addRecurringService.pending, (state) => {
                state.createLoading = true;
                state.createError = null;
            })

            .addCase(addRecurringService.fulfilled, (state, action) => {
                state.createLoading = false;
                state.successMessage =
                    action.payload?.message ||
                    "Recurring service created successfully.";

                const service = action.payload?.data?.service;
                if (service) {
                    state.services.unshift(service);
                    state.servicesTotalItems += 1;
                }

                const billing = action.payload?.data?.billing;
                if (billing) {
                    state.billing.unshift(billing);
                    state.billingTotalItems += 1;
                }
            })

            .addCase(addRecurringService.rejected, (state, action) => {
                state.createLoading = false;
                state.createError = action.payload;
            })

            // ==========================================
            // GET RECURRING SERVICES
            // ==========================================

            .addCase(getRecurringServices.pending, (state) => {
                state.servicesLoading = true;
                state.servicesError = null;
            })

            .addCase(getRecurringServices.fulfilled, (state, action) => {
                state.servicesLoading = false;
                const data = action.payload || {};
                state.services = data.results || [];
                state.servicesTotalItems = data.total_items || 0;
                state.servicesTotalPages = data.total_pages || 0;
                state.servicesCurrentPage = data.current_page || 1;
            })

            .addCase(getRecurringServices.rejected, (state, action) => {
                state.servicesLoading = false;
                state.servicesError = action.payload;
            })

            // ==========================================
            // GET RECURRING SERVICE BY ID
            // ==========================================

            .addCase(getRecurringServiceById.pending, (state) => {
                state.serviceDetailLoading = true;
                state.serviceDetailError = null;
            })

            .addCase(getRecurringServiceById.fulfilled, (state, action) => {
                state.serviceDetailLoading = false;
                state.selectedService = action.payload?.data || action.payload;
            })

            .addCase(getRecurringServiceById.rejected, (state, action) => {
                state.serviceDetailLoading = false;
                state.serviceDetailError = action.payload;
            })

            // ==========================================
            // UPDATE RECURRING SERVICE (PUT / PATCH)
            // ==========================================

            .addCase(editRecurringService.pending, (state) => {
                state.updateLoading = true;
                state.updateError = null;
            })

            .addCase(editRecurringService.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.successMessage =
                    action.payload?.message || "Recurring service updated successfully.";

                const updated = action.payload?.data;
                if (updated) {
                    state.selectedService = updated;
                    const index = state.services.findIndex((s) => s.id === updated.id);
                    if (index !== -1) state.services[index] = updated;
                }
            })

            .addCase(editRecurringService.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateError = action.payload;
            })

            .addCase(updateRecurringServicePartial.pending, (state) => {
                state.updateLoading = true;
                state.updateError = null;
            })

            .addCase(updateRecurringServicePartial.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.successMessage =
                    action.payload?.message || "Recurring service updated successfully.";

                const updated = action.payload?.data;
                if (updated) {
                    state.selectedService = updated;
                    const index = state.services.findIndex((s) => s.id === updated.id);
                    if (index !== -1) state.services[index] = updated;
                }
            })

            .addCase(updateRecurringServicePartial.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateError = action.payload;
            })

            // ==========================================
            // DELETE RECURRING SERVICE
            // ==========================================

            .addCase(removeRecurringService.pending, (state) => {
                state.deleteLoading = true;
                state.deleteError = null;
            })

            .addCase(removeRecurringService.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.successMessage =
                    action.payload?.message || "Recurring service deleted successfully.";
                state.services = state.services.filter((s) => s.id !== action.payload.id);
                state.servicesTotalItems = Math.max(0, state.servicesTotalItems - 1);
                if (state.selectedService?.id === action.payload.id) {
                    state.selectedService = null;
                }
            })

            .addCase(removeRecurringService.rejected, (state, action) => {
                state.deleteLoading = false;
                state.deleteError = action.payload;
            })

            // ==========================================
            // GET RECURRING BILLING (LIST)
            // ==========================================

            .addCase(getRecurringBilling.pending, (state) => {
                state.billingLoading = true;
                state.billingError = null;
            })

            .addCase(getRecurringBilling.fulfilled, (state, action) => {
                state.billingLoading = false;
                const data = action.payload || {};
                state.billing = data.results || [];
                state.billingTotalItems = data.total_items || 0;
                state.billingTotalPages = data.total_pages || 0;
                state.billingCurrentPage = data.current_page || 1;
            })

            .addCase(getRecurringBilling.rejected, (state, action) => {
                state.billingLoading = false;
                state.billingError = action.payload;
            })

            // ==========================================
            // GET RECURRING BILLING BY ID
            // ==========================================

            .addCase(getRecurringBillingById.pending, (state) => {
                state.billingDetailLoading = true;
                state.billingDetailError = null;
            })

            .addCase(getRecurringBillingById.fulfilled, (state, action) => {
                state.billingDetailLoading = false;
                state.selectedBilling = action.payload?.data || action.payload;
            })

            .addCase(getRecurringBillingById.rejected, (state, action) => {
                state.billingDetailLoading = false;
                state.billingDetailError = action.payload;
            })

            // ==========================================
            // UPDATE RECURRING BILLING (PUT / PATCH)
            // ==========================================

            .addCase(editRecurringBilling.pending, (state) => {
                state.billingUpdateLoading = true;
                state.billingUpdateError = null;
            })

            .addCase(editRecurringBilling.fulfilled, (state, action) => {
                state.billingUpdateLoading = false;
                state.successMessage =
                    action.payload?.message || "Billing updated successfully.";

                const updated = action.payload?.data;
                if (updated) {
                    state.selectedBilling = updated;
                    const index = state.billing.findIndex((b) => b.id === updated.id);
                    if (index !== -1) state.billing[index] = updated;
                }
            })

            .addCase(editRecurringBilling.rejected, (state, action) => {
                state.billingUpdateLoading = false;
                state.billingUpdateError = action.payload;
            })

            .addCase(updateRecurringBillingPartial.pending, (state) => {
                state.billingUpdateLoading = true;
                state.billingUpdateError = null;
            })

            .addCase(updateRecurringBillingPartial.fulfilled, (state, action) => {
                state.billingUpdateLoading = false;
                state.successMessage =
                    action.payload?.message || "Billing updated successfully.";

                const updated = action.payload?.data;
                if (updated) {
                    state.selectedBilling = updated;
                    const index = state.billing.findIndex((b) => b.id === updated.id);
                    if (index !== -1) state.billing[index] = updated;
                }
            })

            .addCase(updateRecurringBillingPartial.rejected, (state, action) => {
                state.billingUpdateLoading = false;
                state.billingUpdateError = action.payload;
            })

            // ==========================================
            // DELETE RECURRING BILLING
            // ==========================================

            .addCase(removeRecurringBilling.pending, (state) => {
                state.billingDeleteLoading = true;
                state.billingDeleteError = null;
            })

            .addCase(removeRecurringBilling.fulfilled, (state, action) => {
                state.billingDeleteLoading = false;
                state.successMessage =
                    action.payload?.message || "Billing deleted successfully.";
                state.billing = state.billing.filter((b) => b.id !== action.payload.id);
                state.billingTotalItems = Math.max(0, state.billingTotalItems - 1);
                if (state.selectedBilling?.id === action.payload.id) {
                    state.selectedBilling = null;
                }
            })

            .addCase(removeRecurringBilling.rejected, (state, action) => {
                state.billingDeleteLoading = false;
                state.billingDeleteError = action.payload;
            })

            // ==========================================
            // BILLING DASHBOARD
            // ==========================================

            .addCase(getRecurringBillingDashboard.pending, (state) => {
                state.billingDashboardLoading = true;
                state.billingDashboardError = null;
            })

            .addCase(getRecurringBillingDashboard.fulfilled, (state, action) => {
                state.billingDashboardLoading = false;
                state.billingDashboard = action.payload?.data || action.payload;
            })

            .addCase(getRecurringBillingDashboard.rejected, (state, action) => {
                state.billingDashboardLoading = false;
                state.billingDashboardError = action.payload;
            })

            // ==========================================
            // RECURRING SUMMARY
            // ==========================================

            .addCase(getRecurringSummary.pending, (state) => {
                state.summaryLoading = true;
                state.summaryError = null;
            })

            .addCase(getRecurringSummary.fulfilled, (state, action) => {
                state.summaryLoading = false;
                state.summary = action.payload?.data || action.payload;
            })

            .addCase(getRecurringSummary.rejected, (state, action) => {
                state.summaryLoading = false;
                state.summaryError = action.payload;
            });
    },
});

export const {
    clearRecurringMessage,
    clearSelectedService,
    clearSelectedBilling,
} = recurringSlice.actions;

export default recurringSlice.reducer;