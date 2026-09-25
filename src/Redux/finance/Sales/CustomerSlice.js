import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    fetchCustomers,
    fetchCustomerById,
    createCustomer,
    updateCustomer,
    patchCustomer,
    deleteCustomer,
    fetchCustomerSummary,
    fetchCustomerOverview,
    uploadCustomerDocument,
    fetchCustomerQuotations,
    fetchCustomerPayments,
    fetchCustomerLedger,
    fetchCustomerCreditNotes,
    fetchCustomerOrdersSummary,
    fetchCustomerOrders,
    fetchCustomerInvoices,
    fetchCustomerInvoicesSummary
} from "../../../services/finance/Sales/CustomerService";

// GET Customers
export const getCustomers = createAsyncThunk(
    "customer/getCustomers",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchCustomers(params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
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
            return rejectWithValue(error.response?.data || error.message);
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
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// UPDATE Customer - PUT
export const editCustomer = createAsyncThunk(
    "customer/editCustomer",
    async ({ id, customerData }, { rejectWithValue }) => {
        try {
            return await updateCustomer(id, customerData);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// PATCH Customer
export const updateCustomerPartial = createAsyncThunk(
    "customer/updateCustomerPartial",
    async ({ id, customerData }, { rejectWithValue }) => {
        try {
            return await patchCustomer(id, customerData);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// DELETE Customer
export const removeCustomer = createAsyncThunk(
    "customer/removeCustomer",
    async (id, { rejectWithValue }) => {
        try {
            const response = await deleteCustomer(id);
            return { id, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
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
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// GET Customer Overview
export const getCustomerOverview = createAsyncThunk(
    "customer/getCustomerOverview",
    async (id, { rejectWithValue }) => {
        try {
            return await fetchCustomerOverview(id);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const uploadCustomerDocumentThunk = createAsyncThunk(
    "customer/uploadCustomerDocument",
    async ({ id, documentName, file }, { rejectWithValue }) => {
        console.log("Is real File instance inside thunk?", file instanceof File, file);

        try {
            const formData = new FormData();
            formData.append("document_name", documentName);
            formData.append("documents", file);

            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            return await uploadCustomerDocument(id, formData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);
// GET Customer Quotations
export const getCustomerQuotations = createAsyncThunk(
    "customer/getCustomerQuotations",
    async ({ id, params = {} }, { rejectWithValue }) => {
        try {
            return await fetchCustomerQuotations(id, params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const getCustomerPayments = createAsyncThunk(
    "customerLedger/getCustomerPayments",
    async ({ customerId, params = {} }, { rejectWithValue }) => {
        try {
            return await fetchCustomerPayments(customerId, params);
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);
// GET Customer Credit Notes
export const getCustomerCreditNotes = createAsyncThunk(
    "customer/getCustomerCreditNotes",
    async ({ customerId, params = {} }, { rejectWithValue }) => {
        try {
            return await fetchCustomerCreditNotes(customerId, params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
// GET Customer Ledger
export const getCustomerLedger = createAsyncThunk(
    "customer/getCustomerLedger",
    async ({ customerId, params = {} }, { rejectWithValue }) => {
        try {
            return await fetchCustomerLedger(customerId, params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
// GET Customer Orders
export const getCustomerOrders = createAsyncThunk(
    "customer/getCustomerOrders",
    async ({ customerId, params = {} }, { rejectWithValue }) => {
        try {
            return await fetchCustomerOrders(customerId, params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// GET Customer Orders Summary
export const getCustomerOrdersSummary = createAsyncThunk(
    "customer/getCustomerOrdersSummary",
    async (customerId, { rejectWithValue }) => {
        try {
            return await fetchCustomerOrdersSummary(customerId);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
// GET Customer Invoices
export const getCustomerInvoices = createAsyncThunk(
    "customer/getCustomerInvoices",
    async ({ customerId, params = {} }, { rejectWithValue }) => {
        try {
            return await fetchCustomerInvoices(customerId, params);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// GET Customer Invoices Summary
export const getCustomerInvoicesSummary = createAsyncThunk(
    "customer/getCustomerInvoicesSummary",
    async (customerId, { rejectWithValue }) => {
        try {
            return await fetchCustomerInvoicesSummary(customerId);
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
const initialState = {
    customers: [],
    selectedCustomer: null,
    summary: null,
    overview: null,
    quotations: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    quotationsCustomerHeader: null,
    quotationsKpiCards: null,
    loading: false,
    detailLoading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    summaryLoading: false,
    overviewLoading: false,
    uploadLoading: false,
    customerPayments: [],
    customerPaymentsTotalItems: 0,
    customerPaymentsTotalPages: 0,
    customerPaymentsCurrentPage: 1,
    customerPaymentsHeader: null,
    customerPaymentsKpis: null,
    customerPaymentsLoading: false,
    creditNotes: [],
    creditNotesTotalItems: 0,
    creditNotesTotalPages: 0,
    creditNotesCurrentPage: 1,
    creditNotesCustomerHeader: null,
    creditNotesKpis: null,
    creditNotesLoading: false,
    quotationsTotalItems: 0,
    quotationsTotalPages: 0,
    quotationsCurrentPage: 1,
    quotationsLoading: false,
       ledger: [],
    ledgerTotalItems: 0,
    ledgerTotalPages: 0,
    ledgerCurrentPage: 1,
    ledgerCustomerHeader: null,
    ledgerKpis: null,
    ledgerLoading: false,
    orders: [],
    ordersTotalItems: 0,
    ordersTotalPages: 0,
    ordersCurrentPage: 1,
    ordersLoading: false,
    ordersError: null,

    ordersSummary: null,
    ordersSummaryLoading: false,
    ordersSummaryError: null,
        invoices: [],
    invoicesTotalItems: 0,
    invoicesTotalPages: 0,
    invoicesCurrentPage: 1,
    invoicesLoading: false,
    invoicesError: null,

    invoicesSummary: null,
    invoicesSummaryLoading: false,
    invoicesSummaryError: null,
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
                state.customers = action.payload?.results || [];
                state.totalItems = action.payload?.total_items || 0;
                state.totalPages = action.payload?.total_pages || 0;
                state.currentPage = action.payload?.current_page || 1;
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
                state.selectedCustomer = action.payload?.data || action.payload;
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
                    action.payload?.message || "Customer created successfully.";

                const customer = action.payload?.data;
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
                    action.payload?.message || "Customer updated successfully.";

                const updatedCustomer = action.payload?.data;
                if (updatedCustomer) {
                    state.selectedCustomer = updatedCustomer;

                    const index = state.customers.findIndex(
                        (customer) => customer.id === updatedCustomer.id
                    );

                    if (index !== -1) {
                        state.customers[index] = updatedCustomer;
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

            .addCase(updateCustomerPartial.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })

            .addCase(updateCustomerPartial.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.successMessage =
                    action.payload?.message || "Customer updated successfully.";

                const updatedCustomer = action.payload?.data;
                if (updatedCustomer) {
                    state.selectedCustomer = updatedCustomer;

                    const index = state.customers.findIndex(
                        (customer) => customer.id === updatedCustomer.id
                    );

                    if (index !== -1) {
                        state.customers[index] = updatedCustomer;
                    }
                }
            })

            .addCase(updateCustomerPartial.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            })

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
                    action.payload?.message || "Customer deleted successfully.";

                state.customers = state.customers.filter(
                    (customer) => customer.id !== action.payload.id
                );

                state.totalItems = Math.max(0, state.totalItems - 1);

                if (state.selectedCustomer?.id === action.payload.id) {
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

            .addCase(getCustomerSummary.fulfilled, (state, action) => {
                state.summaryLoading = false;
                state.summary = action.payload?.data || action.payload;
            })

            .addCase(getCustomerSummary.rejected, (state, action) => {
                state.summaryLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // CUSTOMER OVERVIEW
            // ==========================================

            .addCase(getCustomerOverview.pending, (state) => {
                state.overviewLoading = true;
                state.error = null;
            })

            .addCase(getCustomerOverview.fulfilled, (state, action) => {
                state.overviewLoading = false;
                state.overview = action.payload?.data || action.payload;
            })

            .addCase(getCustomerOverview.rejected, (state, action) => {
                state.overviewLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // UPLOAD CUSTOMER DOCUMENT
            // ==========================================

            .addCase(uploadCustomerDocumentThunk.pending, (state) => {
                state.uploadLoading = true;
                state.error = null;
            })

            .addCase(uploadCustomerDocumentThunk.fulfilled, (state, action) => {
                state.uploadLoading = false;

                state.successMessage =
                    action.payload?.message ||
                    "Document(s) uploaded successfully.";

                const newDocuments = action.payload?.documents || [];

                // Merge by id instead of concatenating, so this stays correct
                // whether the backend returns only the newly created document(s)
                // or the full, current document list on every upload response.
                const mergeDocuments = (existing = []) => {
                    const byId = new Map(existing.map((doc) => [doc.id, doc]));
                    newDocuments.forEach((doc) => byId.set(doc.id, doc));
                    return Array.from(byId.values());
                };

                if (state.selectedCustomer) {
                    state.selectedCustomer.documents = mergeDocuments(
                        state.selectedCustomer.documents
                    );
                }

                if (state.overview) {
                    state.overview.documents = mergeDocuments(state.overview.documents);
                }
            })

            .addCase(uploadCustomerDocumentThunk.rejected, (state, action) => {
                state.uploadLoading = false;
                state.error = action.payload;
            })
            .addCase(getCustomerQuotations.pending, (state) => {
                state.quotationsLoading = true;
                state.error = null;
            })

            .addCase(getCustomerQuotations.fulfilled, (state, action) => {
                state.quotationsLoading = false;
                state.quotations = action.payload?.results || [];
                state.quotationsCustomerHeader = action.payload?.customer_header || null;
                state.quotationsKpiCards = action.payload?.kpi_cards || null;
                state.quotationsTotalItems = action.payload?.total_items || 0;
                state.quotationsTotalPages = action.payload?.total_pages || 0;
                state.quotationsCurrentPage = action.payload?.current_page || 1;
            })

            .addCase(getCustomerQuotations.rejected, (state, action) => {
                state.quotationsLoading = false;
                state.error = action.payload;
            })
            .addCase(getCustomerPayments.fulfilled, (state, action) => {
                state.customerPaymentsLoading = false;

                const data = action.payload || {};

                state.customerPayments = data.results || [];

                state.customerPaymentsTotalItems =
                    data.total_items || 0;

                state.customerPaymentsTotalPages =
                    data.total_pages || 0;

                state.customerPaymentsCurrentPage =
                    data.current_page || 1;

                state.customerPaymentsHeader =
                    data.customer_header || null;

                state.customerPaymentsKpis =
                    data.kpi_cards || null;
            })
              // ==========================================
            // GET CUSTOMER CREDIT NOTES
            // ==========================================

            .addCase(getCustomerCreditNotes.pending, (state) => {
                state.creditNotesLoading = true;
                state.error = null;
            })

            .addCase(getCustomerCreditNotes.fulfilled, (state, action) => {
                state.creditNotesLoading = false;
                const data = action.payload || {};
                state.creditNotes = data.results || [];
                state.creditNotesTotalItems = data.total_items || 0;
                state.creditNotesTotalPages = data.total_pages || 0;
                state.creditNotesCurrentPage = data.current_page || 1;
                state.creditNotesCustomerHeader = data.customer_header || null;
                state.creditNotesKpis = data.kpi_cards || null;
            })

            .addCase(getCustomerCreditNotes.rejected, (state, action) => {
                state.creditNotesLoading = false;
                state.error = action.payload;
            })
            // ==========================================
            // GET CUSTOMER LEDGER
            // ==========================================

            .addCase(getCustomerLedger.pending, (state) => {
                state.ledgerLoading = true;
                state.error = null;
            })

            .addCase(getCustomerLedger.fulfilled, (state, action) => {
                state.ledgerLoading = false;
                const data = action.payload || {};
                state.ledger = data.results || [];
                state.ledgerTotalItems = data.total_items || 0;
                state.ledgerTotalPages = data.total_pages || 0;
                state.ledgerCurrentPage = data.current_page || 1;
                state.ledgerCustomerHeader = data.customer_header || null;
                state.ledgerKpis = data.kpi_cards || null;
            })

            .addCase(getCustomerLedger.rejected, (state, action) => {
                state.ledgerLoading = false;
                state.error = action.payload;
            })
            // ==========================================
            // GET CUSTOMER ORDERS
            // ==========================================

            .addCase(getCustomerOrders.pending, (state) => {
                state.ordersLoading = true;
                state.ordersError = null;
            })

            .addCase(getCustomerOrders.fulfilled, (state, action) => {
                state.ordersLoading = false;
                const data = action.payload || {};
                state.orders = data.results || [];
                state.ordersTotalItems = data.total_items || 0;
                state.ordersTotalPages = data.total_pages || 0;
                state.ordersCurrentPage = data.current_page || 1;
            })

            .addCase(getCustomerOrders.rejected, (state, action) => {
                state.ordersLoading = false;
                state.ordersError = action.payload;
            })

            // ==========================================
            // GET CUSTOMER ORDERS SUMMARY
            // ==========================================

            .addCase(getCustomerOrdersSummary.pending, (state) => {
                state.ordersSummaryLoading = true;
                state.ordersSummaryError = null;
            })

            .addCase(getCustomerOrdersSummary.fulfilled, (state, action) => {
                state.ordersSummaryLoading = false;
                state.ordersSummary = action.payload?.data || null;
            })

            .addCase(getCustomerOrdersSummary.rejected, (state, action) => {
                state.ordersSummaryLoading = false;
                state.ordersSummaryError = action.payload;
            })
                        // ==========================================
            // GET CUSTOMER INVOICES
            // ==========================================

            .addCase(getCustomerInvoices.pending, (state) => {
                state.invoicesLoading = true;
                state.invoicesError = null;
            })

            .addCase(getCustomerInvoices.fulfilled, (state, action) => {
                state.invoicesLoading = false;
                const data = action.payload || {};
                state.invoices = data.results || [];
                state.invoicesTotalItems = data.total_items || 0;
                state.invoicesTotalPages = data.total_pages || 0;
                state.invoicesCurrentPage = data.current_page || 1;
            })

            .addCase(getCustomerInvoices.rejected, (state, action) => {
                state.invoicesLoading = false;
                state.invoicesError = action.payload;
            })

            // ==========================================
            // GET CUSTOMER INVOICES SUMMARY
            // ==========================================

            .addCase(getCustomerInvoicesSummary.pending, (state) => {
                state.invoicesSummaryLoading = true;
                state.invoicesSummaryError = null;
            })

            .addCase(getCustomerInvoicesSummary.fulfilled, (state, action) => {
                state.invoicesSummaryLoading = false;
                state.invoicesSummary = action.payload?.data || null;
            })

            .addCase(getCustomerInvoicesSummary.rejected, (state, action) => {
                state.invoicesSummaryLoading = false;
                state.invoicesSummaryError = action.payload;
            });

    },
});

export const {
    clearCustomerError,
    clearCustomerMessage,
    clearSelectedCustomer,
} = customerSlice.actions;

export default customerSlice.reducer;