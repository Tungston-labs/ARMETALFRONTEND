import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
    fetchSalesOrdersForInvoice,
    fetchSalesOrderDetailForInvoice,
    createInvoice,
    fetchInvoices,
    fetchInvoiceById,
    updateInvoice,
    patchInvoice,
    deleteInvoice,
    downloadInvoicePDF,
    sendInvoiceEmail,
    fetchInvoiceCompanyDetails,
    fetchInvoiceProducts,
    fetchInvoiceCustomers,
    fetchInvoiceSummary,
} from "../../../services/finance/Sales/InvoiceService";

// GET Sales Orders Available For Invoice
export const getInvoiceSalesOrders = createAsyncThunk(
    "invoice/getInvoiceSalesOrders",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchSalesOrdersForInvoice(params);
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// GET Sales Order Detail For Invoice
export const getInvoiceSalesOrderById = createAsyncThunk(
    "invoice/getInvoiceSalesOrderById",
    async (id, { rejectWithValue }) => {
        try {
            return await fetchSalesOrderDetailForInvoice(id);
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// GET Invoices
export const getInvoices = createAsyncThunk(
    "invoice/getInvoices",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchInvoices(params);
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// GET Invoice By ID
export const getInvoiceById = createAsyncThunk(
    "invoice/getInvoiceById",
    async (id, { rejectWithValue }) => {
        try {
            return await fetchInvoiceById(id);
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// CREATE Invoice
export const addInvoice = createAsyncThunk(
    "invoice/addInvoice",
    async (invoiceData, { rejectWithValue }) => {
        try {
            return await createInvoice(invoiceData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// UPDATE Invoice - PUT
export const editInvoice = createAsyncThunk(
    "invoice/editInvoice",
    async ({ id, invoiceData }, { rejectWithValue }) => {
        try {
            return await updateInvoice(
                id,
                invoiceData
            );
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// PATCH Invoice
export const updateInvoicePartial = createAsyncThunk(
    "invoice/updateInvoicePartial",
    async ({ id, invoiceData }, { rejectWithValue }) => {
        try {
            return await patchInvoice(
                id,
                invoiceData
            );
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// DELETE Invoice
export const removeInvoice = createAsyncThunk(
    "invoice/removeInvoice",
    async (id, { rejectWithValue }) => {
        try {
            console.log("Deleting invoice ID:", id);

            const response = await deleteInvoice(id);

            console.log("Delete API response:", response);

            return {
                id,
                response,
            };
        } catch (error) {
            console.error(
                "Delete invoice API error:",
                error.response?.data || error.message
            );

            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// DOWNLOAD Invoice PDF
export const downloadInvoice = createAsyncThunk(
    "invoice/downloadInvoice",
    async (id, { rejectWithValue }) => {
        try {
            const blobData = await downloadInvoicePDF(id);

            const url = window.URL.createObjectURL(
                new Blob([blobData])
            );

            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `invoice-${id}.pdf`
            );

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);

            return { id };
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// SEND Invoice Email
export const sendInvoice = createAsyncThunk(
    "invoice/sendInvoice",
    async (id, { rejectWithValue }) => {
        try {
            const response = await sendInvoiceEmail(id);

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

// GET Invoice Company Details
export const getInvoiceCompanyDetails = createAsyncThunk(
    "invoice/getInvoiceCompanyDetails",
    async (_, { rejectWithValue }) => {
        try {
            return await fetchInvoiceCompanyDetails();
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// GET Invoice Products Dropdown
export const getInvoiceProducts = createAsyncThunk(
    "invoice/getInvoiceProducts",
    async (_, { rejectWithValue }) => {
        try {
            return await fetchInvoiceProducts();
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

// GET Invoice Customers Dropdown
export const getInvoiceCustomers = createAsyncThunk(
    "invoice/getInvoiceCustomers",
    async (_, { rejectWithValue }) => {
        try {
            return await fetchInvoiceCustomers();
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);


export const getInvoiceSummary = createAsyncThunk(
    "invoice/getInvoiceSummary",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchInvoiceSummary(params);
        } catch (error) {
            return rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
);

const initialState = {
    invoices: [],
    selectedInvoice: null,
    summary: null,

    salesOrders: [],
    selectedSalesOrder: null,

    companyDetails: null,
    products: [],
    customers: [],

    totalItems: 0,
    totalPages: 0,
    currentPage: 1,

    loading: false,
    detailLoading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    summaryLoading: false,
    salesOrderLoading: false,
    salesOrderDetailLoading: false,
    downloadLoading: false,
    sendLoading: false,
    lookupLoading: false,

    error: null,
    successMessage: null,
};

const invoiceSlice = createSlice({
    name: "invoice",

    initialState,

    reducers: {
        clearInvoiceError: (state) => {
            state.error = null;
        },

        clearInvoiceMessage: (state) => {
            state.successMessage = null;
        },

        clearSelectedInvoice: (state) => {
            state.selectedInvoice = null;
        },

        clearSelectedSalesOrder: (state) => {
            state.selectedSalesOrder = null;
        },
    },

    extraReducers: (builder) => {
        builder

            // ==========================================
            // GET INVOICE SALES ORDERS
            // ==========================================

            .addCase(getInvoiceSalesOrders.pending, (state) => {
                state.salesOrderLoading = true;
                state.error = null;
            })

            .addCase(getInvoiceSalesOrders.fulfilled, (state, action) => {
                state.salesOrderLoading = false;

                state.salesOrders =
                    action.payload?.results ||
                    action.payload?.data ||
                    action.payload ||
                    [];
            })

            .addCase(getInvoiceSalesOrders.rejected, (state, action) => {
                state.salesOrderLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // GET INVOICE SALES ORDER BY ID
            // ==========================================

            .addCase(getInvoiceSalesOrderById.pending, (state) => {
                state.salesOrderDetailLoading = true;
                state.error = null;
            })

            .addCase(getInvoiceSalesOrderById.fulfilled, (state, action) => {
                state.salesOrderDetailLoading = false;

                state.selectedSalesOrder =
                    action.payload?.data ||
                    action.payload;
            })

            .addCase(getInvoiceSalesOrderById.rejected, (state, action) => {
                state.salesOrderDetailLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // GET INVOICES
            // ==========================================

            .addCase(getInvoices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getInvoices.fulfilled, (state, action) => {
                state.loading = false;

                state.invoices =
                    action.payload?.results || [];

                state.totalItems =
                    action.payload?.total_items || 0;

                state.totalPages =
                    action.payload?.total_pages || 0;

                state.currentPage =
                    action.payload?.current_page || 1;
            })

            .addCase(getInvoices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ==========================================
            // GET INVOICE BY ID
            // ==========================================

            .addCase(getInvoiceById.pending, (state) => {
                state.detailLoading = true;
                state.error = null;
            })

            .addCase(getInvoiceById.fulfilled, (state, action) => {
                state.detailLoading = false;

                state.selectedInvoice =
                    action.payload?.data ||
                    action.payload;
            })

            .addCase(getInvoiceById.rejected, (state, action) => {
                state.detailLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // CREATE INVOICE
            // ==========================================

            .addCase(addInvoice.pending, (state) => {
                state.createLoading = true;
                state.error = null;
            })

            .addCase(addInvoice.fulfilled, (state, action) => {
                state.createLoading = false;

                state.successMessage =
                    action.payload?.message ||
                    "Invoice created successfully.";

                const invoice =
                    action.payload?.data;

                if (invoice) {
                    state.invoices.unshift(invoice);
                    state.selectedInvoice = invoice;
                    state.totalItems += 1;
                }
            })

            .addCase(addInvoice.rejected, (state, action) => {
                state.createLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // UPDATE INVOICE - PUT
            // ==========================================

            .addCase(editInvoice.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })

            .addCase(editInvoice.fulfilled, (state, action) => {
                state.updateLoading = false;

                state.successMessage =
                    action.payload?.message ||
                    "Invoice updated successfully.";

                const updatedInvoice =
                    action.payload?.data;

                if (updatedInvoice) {
                    state.selectedInvoice =
                        updatedInvoice;

                    const index =
                        state.invoices.findIndex(
                            (invoice) =>
                                invoice.id ===
                                updatedInvoice.id
                        );

                    if (index !== -1) {
                        state.invoices[index] =
                            updatedInvoice;
                    }
                }
            })

            .addCase(editInvoice.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // PATCH INVOICE
            // ==========================================

            .addCase(
                updateInvoicePartial.pending,
                (state) => {
                    state.updateLoading = true;
                    state.error = null;
                }
            )

            .addCase(
                updateInvoicePartial.fulfilled,
                (state, action) => {
                    state.updateLoading = false;

                    state.successMessage =
                        action.payload?.message ||
                        "Invoice updated successfully.";

                    const updatedInvoice =
                        action.payload?.data;

                    if (updatedInvoice) {
                        state.selectedInvoice =
                            updatedInvoice;

                        const index =
                            state.invoices.findIndex(
                                (invoice) =>
                                    invoice.id ===
                                    updatedInvoice.id
                            );

                        if (index !== -1) {
                            state.invoices[index] =
                                updatedInvoice;
                        }
                    }
                }
            )

            .addCase(
                updateInvoicePartial.rejected,
                (state, action) => {
                    state.updateLoading = false;
                    state.error = action.payload;
                }
            )

            // ==========================================
            // DELETE INVOICE
            // ==========================================

            .addCase(removeInvoice.pending, (state) => {
                state.deleteLoading = true;
                state.error = null;
            })

            .addCase(removeInvoice.fulfilled, (state, action) => {
                state.deleteLoading = false;

                state.successMessage =
                    action.payload?.response?.message ||
                    "Invoice deleted successfully.";

                state.invoices =
                    state.invoices.filter(
                        (invoice) =>
                            invoice.id !== action.payload.id
                    );

                state.totalItems =
                    Math.max(0, state.totalItems - 1);

                if (
                    state.selectedInvoice?.id ===
                    action.payload.id
                ) {
                    state.selectedInvoice = null;
                }
            })

            .addCase(removeInvoice.rejected, (state, action) => {
                state.deleteLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // DOWNLOAD INVOICE PDF
            // ==========================================

            .addCase(downloadInvoice.pending, (state) => {
                state.downloadLoading = true;
                state.error = null;
            })

            .addCase(downloadInvoice.fulfilled, (state) => {
                state.downloadLoading = false;
            })

            .addCase(downloadInvoice.rejected, (state, action) => {
                state.downloadLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // SEND INVOICE EMAIL
            // ==========================================

            .addCase(sendInvoice.pending, (state) => {
                state.sendLoading = true;
                state.error = null;
            })

            .addCase(sendInvoice.fulfilled, (state, action) => {
                state.sendLoading = false;

                state.successMessage =
                    action.payload?.message ||
                    "Invoice emailed successfully.";
            })

            .addCase(sendInvoice.rejected, (state, action) => {
                state.sendLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // INVOICE COMPANY DETAILS
            // ==========================================

            .addCase(getInvoiceCompanyDetails.pending, (state) => {
                state.lookupLoading = true;
                state.error = null;
            })

            .addCase(getInvoiceCompanyDetails.fulfilled, (state, action) => {
                state.lookupLoading = false;

                state.companyDetails =
                    action.payload?.data ||
                    action.payload;
            })

            .addCase(getInvoiceCompanyDetails.rejected, (state, action) => {
                state.lookupLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // INVOICE PRODUCTS DROPDOWN
            // ==========================================

            .addCase(getInvoiceProducts.pending, (state) => {
                state.lookupLoading = true;
                state.error = null;
            })

            .addCase(getInvoiceProducts.fulfilled, (state, action) => {
                state.lookupLoading = false;

                state.products =
                    action.payload?.results ||
                    action.payload?.data ||
                    action.payload ||
                    [];
            })

            .addCase(getInvoiceProducts.rejected, (state, action) => {
                state.lookupLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // INVOICE CUSTOMERS DROPDOWN
            // ==========================================

            .addCase(getInvoiceCustomers.pending, (state) => {
                state.lookupLoading = true;
                state.error = null;
            })

            .addCase(getInvoiceCustomers.fulfilled, (state, action) => {
                state.lookupLoading = false;

                state.customers =
                    action.payload?.results ||
                    action.payload?.data ||
                    action.payload ||
                    [];
            })

            .addCase(getInvoiceCustomers.rejected, (state, action) => {
                state.lookupLoading = false;
                state.error = action.payload;
            })

            // ==========================================
            // INVOICE SUMMARY
            // ==========================================

            .addCase(getInvoiceSummary.pending, (state) => {
                state.summaryLoading = true;
                state.error = null;
            })

            .addCase(
                getInvoiceSummary.fulfilled,
                (state, action) => {
                    state.summaryLoading = false;

                    state.summary =
                        action.payload?.data ||
                        action.payload;
                }
            )

            .addCase(
                getInvoiceSummary.rejected,
                (state, action) => {
                    state.summaryLoading = false;
                    state.error = action.payload;
                }
            );
    },
});

export const {
    clearInvoiceError,
    clearInvoiceMessage,
    clearSelectedInvoice,
    clearSelectedSalesOrder,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;