import {
    createSlice,
    createAsyncThunk,
} from "@reduxjs/toolkit";

import {
    fetchSalesOrders,
    fetchSalesOrderSummary,
    fetchCompanies,
    fetchCustomers,
    fetchWarehouses,
    fetchAvailableQuotations,
    fetchQuotationById,
    fetchSalesOrderById,
    createSalesOrder,
    updateSalesOrder,
    patchSalesOrder,
    deleteSalesOrder,
    updateItemDelivery,
} from "../../../services/finance/Sales/Salesorderservices";

/* =========================
   GET SALES ORDERS
   (list + pagination,
   supports search/filter/ordering
   query params)
========================= */

export const getSalesOrders = createAsyncThunk(
    "salesOrder/getSalesOrders",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchSalesOrders(params);
        } catch (error) {
            return rejectWithValue(
                error.response?.data ||
                error.message
            );
        }
    }
);

/* =========================
   GET SALES ORDER SUMMARY / KPI
========================= */

export const getSalesOrderSummary =
    createAsyncThunk(
        "salesOrder/getSalesOrderSummary",
        async (
            params = {},
            { rejectWithValue }
        ) => {
            try {
                return await fetchSalesOrderSummary(
                    params
                );
            } catch (error) {
                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );
            }
        }
    );

/* =========================
   GET SALES ORDER BY ID
========================= */

export const getSalesOrderById = createAsyncThunk(
    "salesOrder/getSalesOrderById",
    async (id, { rejectWithValue }) => {
        try {
            return await fetchSalesOrderById(id);
        } catch (error) {
            return rejectWithValue(
                error.response?.data ||
                error.message
            );
        }
    }
);

/* =========================
   GET COMPANIES (lookup)
========================= */

export const getCompanies = createAsyncThunk(
    "salesOrder/getCompanies",
    async (_, { rejectWithValue }) => {
        try {
            return await fetchCompanies();
        } catch (error) {
            return rejectWithValue(
                error.response?.data ||
                error.message
            );
        }
    }
);

/* =========================
   GET CUSTOMERS (lookup)
========================= */

export const getCustomers = createAsyncThunk(
    "salesOrder/getCustomers",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchCustomers(params);
        } catch (error) {
            return rejectWithValue(
                error.response?.data ||
                error.message
            );
        }
    }
);

/* =========================
   GET WAREHOUSES (lookup)
========================= */

export const getWarehouses = createAsyncThunk(
    "salesOrder/getWarehouses",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchWarehouses(params);
        } catch (error) {
            return rejectWithValue(
                error.response?.data ||
                error.message
            );
        }
    }
);

/* =========================
   GET AVAILABLE QUOTATIONS
   (quotations that can be
   converted to Sales Orders)
========================= */

export const getAvailableQuotations =
    createAsyncThunk(
        "salesOrder/getAvailableQuotations",
        async (
            params = {},
            { rejectWithValue }
        ) => {
            try {
                return await fetchAvailableQuotations(
                    params
                );
            } catch (error) {
                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );
            }
        }
    );

/* =========================
   GET QUOTATION BY ID
   (used to auto-populate the
   Sales Order form)
========================= */

export const getQuotationById = createAsyncThunk(
    "salesOrder/getQuotationById",
    async (id, { rejectWithValue }) => {
        try {
            return await fetchQuotationById(id);
        } catch (error) {
            return rejectWithValue(
                error.response?.data ||
                error.message
            );
        }
    }
);

/* =========================
   CREATE SALES ORDER
========================= */

export const addSalesOrder = createAsyncThunk(
    "salesOrder/addSalesOrder",
    async (salesOrderData, { rejectWithValue }) => {
        try {
            return await createSalesOrder(
                salesOrderData
            );
        } catch (error) {
            return rejectWithValue(
                error.response?.data ||
                error.message
            );
        }
    }
);

/* =========================
   UPDATE SALES ORDER (PUT)
========================= */

export const editSalesOrder = createAsyncThunk(
    "salesOrder/editSalesOrder",
    async (
        { id, salesOrderData },
        { rejectWithValue }
    ) => {
        try {
            return await updateSalesOrder(
                id,
                salesOrderData
            );
        } catch (error) {
            return rejectWithValue(
                error.response?.data ||
                error.message
            );
        }
    }
);

/* =========================
   PATCH SALES ORDER
========================= */

export const updateSalesOrderPartial =
    createAsyncThunk(
        "salesOrder/updateSalesOrderPartial",
        async (
            { id, salesOrderData },
            { rejectWithValue }
        ) => {
            try {
                return await patchSalesOrder(
                    id,
                    salesOrderData
                );
            } catch (error) {
                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );
            }
        }
    );

/* =========================
   DELETE SALES ORDER
========================= */

export const removeSalesOrder = createAsyncThunk(
    "salesOrder/removeSalesOrder",
    async (id, { rejectWithValue }) => {
        try {
            await deleteSalesOrder(id);

            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data ||
                error.message
            );
        }
    }
);

/* =========================
   UPDATE ITEM DELIVERED QUANTITY
========================= */

export const updateItemDeliveryQty =
    createAsyncThunk(
        "salesOrder/updateItemDeliveryQty",
        async (
            { orderId, itemId, deliveredQuantity },
            { rejectWithValue }
        ) => {
            try {
                const data = await updateItemDelivery(
                    orderId,
                    itemId,
                    deliveredQuantity
                );

                return { orderId, itemId, data };
            } catch (error) {
                return rejectWithValue(
                    error.response?.data ||
                    error.message
                );
            }
        }
    );

/* =========================
   INITIAL STATE
========================= */

const initialState = {
    salesOrders: [],
    selectedSalesOrder: null,

    pagination: {
        count: 0,
        totalPages: 0,
        currentPage: 1,
        next: null,
        previous: null,
    },

    kpi: {
        total_orders: 0,
        pending_orders: 0,
        confirmed_orders: 0,
        processing_orders: 0,
        rejected_orders: 0,
        total_order_value: 0,
    },

    companies: [],
    customers: [],
    warehouses: [],
    availableQuotations: [],
    selectedQuotation: null,

    loading: false,
    summaryLoading: false,
    orderLoading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,
    companiesLoading: false,
    customersLoading: false,
    warehousesLoading: false,
    quotationsLoading: false,
    quotationLoading: false,
    deliveryLoading: false,

    error: null,
    summaryError: null,
    orderError: null,
    createError: null,
    updateError: null,
    deleteError: null,
    quotationError: null,
    deliveryError: null,
};

/* =========================
   SLICE
========================= */

const salesOrderSlice = createSlice({
    name: "salesOrder",
    initialState,

    reducers: {
        clearSalesOrderError: (state) => {
            state.error = null;
            state.createError = null;
            state.updateError = null;
            state.deleteError = null;
            state.quotationError = null;
            state.deliveryError = null;
        },

        clearSelectedSalesOrder: (state) => {
            state.selectedSalesOrder = null;
        },

        clearSelectedQuotation: (state) => {
            state.selectedQuotation = null;
        },
    },

    extraReducers: (builder) => {
        builder

            /* =========================
               GET SALES ORDERS
            ========================= */

            .addCase(
                getSalesOrders.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                getSalesOrders.fulfilled,
                (state, action) => {
                    state.loading = false;

                    const payload =
                        action.payload || {};

                    /*
                     * Backend response shape:
                     * {
                     *   count,
                     *   next,
                     *   previous,
                     *   results: [...]
                     * }
                     */

                    state.salesOrders =
                        payload.results || [];

                    state.pagination = {
                        count: payload.count || 0,

                        totalPages: Math.ceil(
                            (payload.count || 0) / 10
                        ),

                        currentPage:
                            state.pagination
                                .currentPage || 1,

                        next: payload.next || null,

                        previous:
                            payload.previous || null,
                    };
                }
            )

            .addCase(
                getSalesOrders.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch sales orders";
                }
            )

            /* =========================
               GET SALES ORDER SUMMARY
            ========================= */

            .addCase(
                getSalesOrderSummary.pending,
                (state) => {
                    state.summaryLoading = true;
                    state.summaryError = null;
                }
            )

            .addCase(
                getSalesOrderSummary.fulfilled,
                (state, action) => {
                    state.summaryLoading = false;

                    state.kpi = {
                        ...state.kpi,
                        ...(action.payload || {}),
                    };
                }
            )

            .addCase(
                getSalesOrderSummary.rejected,
                (state, action) => {
                    state.summaryLoading = false;

                    state.summaryError =
                        action.payload ||
                        "Failed to fetch summary";
                }
            )

            /* =========================
               GET SALES ORDER BY ID
            ========================= */

            .addCase(
                getSalesOrderById.pending,
                (state) => {
                    state.orderLoading = true;
                    state.orderError = null;
                }
            )

            .addCase(
                getSalesOrderById.fulfilled,
                (state, action) => {
                    state.orderLoading = false;

                    state.selectedSalesOrder =
                        action.payload;
                }
            )

            .addCase(
                getSalesOrderById.rejected,
                (state, action) => {
                    state.orderLoading = false;

                    state.orderError =
                        action.payload ||
                        "Failed to fetch sales order";
                }
            )

            /* =========================
               GET COMPANIES
            ========================= */

            .addCase(
                getCompanies.pending,
                (state) => {
                    state.companiesLoading = true;
                }
            )

            .addCase(
                getCompanies.fulfilled,
                (state, action) => {
                    state.companiesLoading = false;

                    state.companies =
                        action.payload?.results ||
                        action.payload ||
                        [];
                }
            )

            .addCase(
                getCompanies.rejected,
                (state) => {
                    state.companiesLoading = false;
                }
            )

            /* =========================
               GET CUSTOMERS
            ========================= */

            .addCase(
                getCustomers.pending,
                (state) => {
                    state.customersLoading = true;
                }
            )

            .addCase(
                getCustomers.fulfilled,
                (state, action) => {
                    state.customersLoading = false;

                    state.customers =
                        action.payload?.results ||
                        action.payload ||
                        [];
                }
            )

            .addCase(
                getCustomers.rejected,
                (state) => {
                    state.customersLoading = false;
                }
            )

            /* =========================
               GET WAREHOUSES
            ========================= */

            .addCase(
                getWarehouses.pending,
                (state) => {
                    state.warehousesLoading = true;
                }
            )

            .addCase(
                getWarehouses.fulfilled,
                (state, action) => {
                    state.warehousesLoading = false;

                    state.warehouses =
                        action.payload?.results ||
                        action.payload ||
                        [];
                }
            )

            .addCase(
                getWarehouses.rejected,
                (state) => {
                    state.warehousesLoading = false;
                }
            )

            /* =========================
               GET AVAILABLE QUOTATIONS
            ========================= */

            .addCase(
                getAvailableQuotations.pending,
                (state) => {
                    state.quotationsLoading = true;
                }
            )

            .addCase(
                getAvailableQuotations.fulfilled,
                (state, action) => {
                    state.quotationsLoading = false;

                    state.availableQuotations =
                        action.payload?.results ||
                        action.payload ||
                        [];
                }
            )

            .addCase(
                getAvailableQuotations.rejected,
                (state) => {
                    state.quotationsLoading = false;
                }
            )

            /* =========================
               GET QUOTATION BY ID
            ========================= */

            .addCase(
                getQuotationById.pending,
                (state) => {
                    state.quotationLoading = true;
                    state.quotationError = null;
                }
            )

            .addCase(
                getQuotationById.fulfilled,
                (state, action) => {
                    state.quotationLoading = false;

                    state.selectedQuotation =
                        action.payload;
                }
            )

            .addCase(
                getQuotationById.rejected,
                (state, action) => {
                    state.quotationLoading = false;

                    state.quotationError =
                        action.payload ||
                        "Failed to fetch quotation";
                }
            )

            /* =========================
               CREATE
            ========================= */

            .addCase(
                addSalesOrder.pending,
                (state) => {
                    state.createLoading = true;
                    state.createError = null;
                }
            )

            .addCase(
                addSalesOrder.fulfilled,
                (state, action) => {
                    state.createLoading = false;

                    state.salesOrders.unshift(
                        action.payload
                    );

                    state.selectedSalesOrder =
                        action.payload;
                }
            )

            .addCase(
                addSalesOrder.rejected,
                (state, action) => {
                    state.createLoading = false;

                    state.createError =
                        action.payload ||
                        "Failed to create sales order";
                }
            )

            /* =========================
               UPDATE (PUT)
            ========================= */

            .addCase(
                editSalesOrder.pending,
                (state) => {
                    state.updateLoading = true;
                    state.updateError = null;
                }
            )

            .addCase(
                editSalesOrder.fulfilled,
                (state, action) => {
                    state.updateLoading = false;

                    const index =
                        state.salesOrders.findIndex(
                            (item) =>
                                item.id ===
                                action.payload.id
                        );

                    if (index !== -1) {
                        state.salesOrders[index] =
                            action.payload;
                    }

                    state.selectedSalesOrder =
                        action.payload;
                }
            )

            .addCase(
                editSalesOrder.rejected,
                (state, action) => {
                    state.updateLoading = false;

                    state.updateError =
                        action.payload ||
                        "Failed to update sales order";
                }
            )

            /* =========================
               PATCH
            ========================= */

            .addCase(
                updateSalesOrderPartial.pending,
                (state) => {
                    state.updateLoading = true;
                    state.updateError = null;
                }
            )

            .addCase(
                updateSalesOrderPartial.fulfilled,
                (state, action) => {
                    state.updateLoading = false;

                    const index =
                        state.salesOrders.findIndex(
                            (item) =>
                                item.id ===
                                action.payload.id
                        );

                    if (index !== -1) {
                        state.salesOrders[index] =
                            action.payload;
                    }

                    state.selectedSalesOrder =
                        action.payload;
                }
            )

            .addCase(
                updateSalesOrderPartial.rejected,
                (state, action) => {
                    state.updateLoading = false;

                    state.updateError =
                        action.payload ||
                        "Failed to update sales order";
                }
            )

            /* =========================
               DELETE
            ========================= */

            .addCase(
                removeSalesOrder.pending,
                (state) => {
                    state.deleteLoading = true;
                    state.deleteError = null;
                }
            )

            .addCase(
                removeSalesOrder.fulfilled,
                (state, action) => {
                    state.deleteLoading = false;

                    state.salesOrders =
                        state.salesOrders.filter(
                            (item) =>
                                item.id !==
                                action.payload
                        );

                    if (
                        state.selectedSalesOrder
                            ?.id === action.payload
                    ) {
                        state.selectedSalesOrder =
                            null;
                    }
                }
            )

            .addCase(
                removeSalesOrder.rejected,
                (state, action) => {
                    state.deleteLoading = false;

                    state.deleteError =
                        action.payload ||
                        "Failed to delete sales order";
                }
            )

            /* =========================
               UPDATE ITEM DELIVERY
            ========================= */

            .addCase(
                updateItemDeliveryQty.pending,
                (state) => {
                    state.deliveryLoading = true;
                    state.deliveryError = null;
                }
            )

            .addCase(
                updateItemDeliveryQty.fulfilled,
                (state, action) => {
                    state.deliveryLoading = false;

                    const { orderId, data } =
                        action.payload;

                    if (
                        state.selectedSalesOrder
                            ?.id === orderId &&
                        data?.id
                    ) {
                        const itemIndex =
                            state.selectedSalesOrder.items?.findIndex(
                                (item) =>
                                    item.id ===
                                    data.id
                            );

                        if (
                            itemIndex !== -1 &&
                            itemIndex !== undefined
                        ) {
                            state.selectedSalesOrder.items[
                                itemIndex
                            ] = {
                                ...state
                                    .selectedSalesOrder
                                    .items[
                                    itemIndex
                                ],
                                ...data,
                            };
                        }
                    }
                }
            )

            .addCase(
                updateItemDeliveryQty.rejected,
                (state, action) => {
                    state.deliveryLoading = false;

                    state.deliveryError =
                        action.payload ||
                        "Failed to update delivered quantity";
                }
            );
    },
});

export const {
    clearSalesOrderError,
    clearSelectedSalesOrder,
    clearSelectedQuotation,
} = salesOrderSlice.actions;

/* =========================
   SELECTORS
========================= */

export const selectSalesOrders = (state) =>
    state.salesOrder.salesOrders;

export const selectSalesOrderPagination = (
    state
) => state.salesOrder.pagination;

export const selectSalesOrderKPI = (state) =>
    state.salesOrder.kpi;

export const selectSelectedSalesOrder = (
    state
) => state.salesOrder.selectedSalesOrder;

export const selectCompanies = (state) =>
    state.salesOrder.companies;

export const selectCustomers = (state) =>
    state.salesOrder.customers;

export const selectWarehouses = (state) =>
    state.salesOrder.warehouses;

export const selectAvailableQuotations = (
    state
) => state.salesOrder.availableQuotations;

export const selectSelectedQuotation = (
    state
) => state.salesOrder.selectedQuotation;

export const selectSalesOrderLoading = (
    state
) => state.salesOrder.loading;

export const selectSalesOrderDetailLoading = (
    state
) => state.salesOrder.orderLoading;

export const selectSalesOrderCreateLoading = (
    state
) => state.salesOrder.createLoading;

export const selectSalesOrderUpdateLoading = (
    state
) => state.salesOrder.updateLoading;

export const selectSalesOrderDeleteLoading = (
    state
) => state.salesOrder.deleteLoading;

export const selectSalesOrderError = (state) =>
    state.salesOrder.error;

export default salesOrderSlice.reducer;