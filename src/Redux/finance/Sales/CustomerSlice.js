import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    fetchCustomers,
    fetchCustomerById,
    createCustomer,
    updateCustomer,
    patchCustomer,
    deleteCustomer,
    fetchCustomerSummary,
} from "../../../services/finance/Sales/CustomerService";

// GET Customers
export const getCustomers = createAsyncThunk(
    "customer/getCustomers",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchCustomers(params);
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// GET Customer By ID
export const getCustomerById = createAsyncThunk(
    "customer/getCustomerById",
    async (id, { rejectWithValue }) => {
        try {
            return await fetchCustomerById(id);
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// CREATE Customer
export const addCustomer = createAsyncThunk(
    "customer/addCustomer",
    async (customerData, { rejectWithValue }) => {
        try {
            return await createCustomer(customerData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// UPDATE Customer - PUT
export const editCustomer = createAsyncThunk(
    "customer/editCustomer",
    async ({ id, customerData }, { rejectWithValue }) => {
        try {
            return await updateCustomer(
                id,
                customerData
            );
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// PATCH Customer
export const updateCustomerPartial = createAsyncThunk(
    "customer/updateCustomerPartial",
    async ({ id, customerData }, { rejectWithValue }) => {
        try {
            return await patchCustomer(
                id,
                customerData
            );
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// DELETE Customer
export const removeCustomer = createAsyncThunk(
    "customer/removeCustomer",
    async (id, { rejectWithValue }) => {
        try {
            const response = await deleteCustomer(id);

            return {
                id,
                ...response,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// GET Customer Summary
export const getCustomerSummary = createAsyncThunk(
    "customer/getCustomerSummary",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchCustomerSummary(params);
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

const initialState = {
    customers: [],
    selectedCustomer: null,
    summary: null,

    totalItems: 0,
    totalPages: 0,
    currentPage: 1,

    loading: false,
    detailLoading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    summaryLoading: false,

    error: null,
    successMessage: null,
};

const customerSlice = createSlice({
    name: "customer",

    initialState,

    reducers: {
        clearCustomerError: (state) => {
            state.error = null;
        },

        clearCustomerMessage: (state) => {
            state.successMessage = null;
        },

        clearSelectedCustomer: (state) => {
            state.selectedCustomer = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // ==========================================
            // GET CUSTOMERS
            // ==========================================

            .addCase(getCustomers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getCustomers.fulfilled, (state, action) => {
                state.loading = false;

                state.customers =
                    action.payload?.results || [];

                state.totalItems =
                    action.payload?.total_items || 0;

                state.totalPages =
                    action.payload?.total_pages || 0;

                state.currentPage =
                    action.payload?.current_page || 1;
            })

            .addCase(getCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ==========================================
            // GET CUSTOMER BY ID
            // ==========================================

            .addCase(getCustomerById.pending, (state) => {
                state.detailLoading = true;
                state.error = null;
            })

            .addCase(getCustomerById.fulfilled, (state, action) => {
                state.detailLoading = false;

                state.selectedCustomer =
                    action.payload?.data ||
                    action.payload;
            })

            .addCase(getCustomerById.rejected, (state, action) => {
                state.detailLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // CREATE CUSTOMER
            // ==========================================

            .addCase(addCustomer.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })

            .addCase(addCustomer.fulfilled, (state, action) => {
                state.createLoading = false;

                state.successMessage =
                    action.payload?.message ||
                    "Customer created successfully.";

                const customer =
                    action.payload?.data;

                if (customer) {
                    state.customers.unshift(customer);
                    state.totalItems += 1;
                }
            })

            .addCase(addCustomer.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // UPDATE CUSTOMER - PUT
            // ==========================================

            .addCase(editCustomer.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })

            .addCase(editCustomer.fulfilled, (state, action) => {
                state.updateLoading = false;

                state.successMessage =
                    action.payload?.message ||
                    "Customer updated successfully.";

                const updatedCustomer =
                    action.payload?.data;

                if (updatedCustomer) {
                    state.selectedCustomer =
                        updatedCustomer;

                    const index =
                        state.customers.findIndex(
                            (customer) =>
                                customer.id ===
                                updatedCustomer.id
                        );

                    if (index !== -1) {
                        state.customers[index] =
                            updatedCustomer;
                    }
                }
            })

            .addCase(editCustomer.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // PATCH CUSTOMER
            // ==========================================

            .addCase(
                updateCustomerPartial.pending,
                (state) => {
                    state.updateLoading = true;
                    state.error = null;
                }
            )

            .addCase(
                updateCustomerPartial.fulfilled,
                (state, action) => {
                    state.updateLoading = false;

                    state.successMessage =
                        action.payload?.message ||
                        "Customer updated successfully.";

                    const updatedCustomer =
                        action.payload?.data;

                    if (updatedCustomer) {
                        state.selectedCustomer =
                            updatedCustomer;

                        const index =
                            state.customers.findIndex(
                                (customer) =>
                                    customer.id ===
                                    updatedCustomer.id
                            );

                        if (index !== -1) {
                            state.customers[index] =
                                updatedCustomer;
                        }
                    }
                }
            )

            .addCase(
                updateCustomerPartial.rejected,
                (state, action) => {
                    state.updateLoading = false;
                    state.error = action.payload;
                }
            )

            // ==========================================
            // DELETE CUSTOMER
            // ==========================================

            .addCase(removeCustomer.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })

            .addCase(removeCustomer.fulfilled, (state, action) => {
                state.deleteLoading = false;

                state.successMessage =
                    action.payload?.message ||
                    "Customer deleted successfully.";

                state.customers =
                    state.customers.filter(
                        (customer) =>
                            customer.id !== action.payload.id
                    );

                state.totalItems =
                    Math.max(0, state.totalItems - 1);

                if (
                    state.selectedCustomer?.id ===
                    action.payload.id
                ) {
                    state.selectedCustomer = null;
                }
            })

            .addCase(removeCustomer.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // CUSTOMER SUMMARY
            // ==========================================

            .addCase(getCustomerSummary.pending, (state) => {
                state.summaryLoading = true;
                state.error = null;
            })

            .addCase(
                getCustomerSummary.fulfilled,
                (state, action) => {
                    state.summaryLoading = false;

                    state.summary =
                        action.payload?.data ||
                        action.payload;
                }
            )

            .addCase(
                getCustomerSummary.rejected,
                (state, action) => {
                    state.summaryLoading = false;
                    state.error = action.payload;
                }
            );
    },
});

export const {
    clearCustomerError,
    clearCustomerMessage,
    clearSelectedCustomer,
} = customerSlice.actions;

// Selectors
export const selectCustomers = (state) =>
    state.customer?.customers || [];

export const selectSelectedCustomer = (state) =>
    state.customer?.selectedCustomer || null;

export const selectCustomerLoading = (state) =>
    state.customer?.loading || false;

export const selectCustomerDetailLoading = (state) =>
    state.customer?.detailLoading || false;

export const selectCustomerCreateLoading = (state) =>
    state.customer?.createLoading || false;

export const selectCustomerUpdateLoading = (state) =>
    state.customer?.updateLoading || false;

export const selectCustomerDeleteLoading = (state) =>
    state.customer?.deleteLoading || false;

export const selectCustomerSummary = (state) =>
    state.customer?.summary || null;

export const selectCustomerSummaryLoading = (state) =>
    state.customer?.summaryLoading || false;

export const selectCustomerError = (state) =>
    state.customer?.error || null;

export default customerSlice.reducer;