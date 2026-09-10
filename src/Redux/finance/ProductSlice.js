import {
    createSlice,
    createAsyncThunk,
} from "@reduxjs/toolkit";

import {
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    patchProduct,
    deleteProduct,
} from "../../services/finance/productServices";

/* =========================
   GET PRODUCTS
   (also carries KPI + pagination
   fields in the same response)
========================= */

export const getProducts = createAsyncThunk(
    "product/getProducts",
    async (params = {}, { rejectWithValue }) => {
        try {
            return await fetchProducts(params);
        } catch (error) {
            return rejectWithValue(
                error.response?.data ||
                error.message
            );
        }
    }
);

/* =========================
   GET PRODUCT BY ID
========================= */

export const getProductById = createAsyncThunk(
    "product/getProductById",
    async (id, { rejectWithValue }) => {
        try {
            return await fetchProductById(id);
        } catch (error) {
            return rejectWithValue(
                error.response?.data ||
                error.message
            );
        }
    }
);

/* =========================
   CREATE PRODUCT
========================= */

export const addProduct = createAsyncThunk(
    "product/addProduct",
    async (productData, { rejectWithValue }) => {
        try {
            return await createProduct(productData);
        } catch (error) {
            return rejectWithValue(
                error.response?.data ||
                error.message
            );
        }
    }
);

/* =========================
   UPDATE PRODUCT
========================= */

export const editProduct = createAsyncThunk(
    "product/editProduct",
    async (
        { id, productData },
        { rejectWithValue }
    ) => {
        try {
            return await updateProduct(
                id,
                productData
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
   PATCH PRODUCT
========================= */

export const updateProductPartial =
    createAsyncThunk(
        "product/updateProductPartial",
        async (
            { id, productData },
            { rejectWithValue }
        ) => {
            try {
                return await patchProduct(
                    id,
                    productData
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
   DELETE PRODUCT
========================= */

export const removeProduct = createAsyncThunk(
    "product/removeProduct",
    async (id, { rejectWithValue }) => {
        try {
            await deleteProduct(id);

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
   INITIAL STATE
========================= */

const initialState = {
    products: [],
    selectedProduct: null,

    pagination: {
        count: 0,
        totalPages: 0,
        currentPage: 1,
        next: null,
        previous: null,
    },

    kpi: {
        total_products: 0,
        active_products: 0,
        low_stock: 0,
        out_of_stock: 0,
        total_categories: 0,
    },

    loading: false,
    productLoading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,

    error: null,
    productError: null,
    createError: null,
    updateError: null,
    deleteError: null,
};

/* =========================
   SLICE
========================= */

const productSlice = createSlice({
    name: "product",
    initialState,

    reducers: {
        clearProductError: (state) => {
            state.error = null;
            state.createError = null;
            state.updateError = null;
            state.deleteError = null;
        },

        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
        },
    },

    extraReducers: (builder) => {
        builder

            /* =========================
               GET PRODUCTS
               (list + pagination + KPI,
               all from one response)
            ========================= */

            .addCase(
                getProducts.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                getProducts.fulfilled,
                (state, action) => {
                    state.loading = false;

                    const payload =
                        action.payload || {};

                    /*
                     * Backend response shape:
                     * {
                     *   total_items,
                     *   total_pages,
                     *   current_page,
                     *   next,
                     *   previous,
                     *   results: [...],
                     *   total_products,
                     *   active_products,
                     *   low_stock,
                     *   out_of_stock,
                     *   total_categories
                     * }
                     */

                    state.products =
                        payload.results || [];

                    state.pagination = {
                        count:
                            payload.total_items || 0,

                        totalPages:
                            payload.total_pages || 0,

                        currentPage:
                            payload.current_page || 1,

                        next:
                            payload.next || null,

                        previous:
                            payload.previous || null,
                    };

                    state.kpi = {
                        total_products:
                            payload.total_products ?? 0,

                        active_products:
                            payload.active_products ?? 0,

                        low_stock:
                            payload.low_stock ?? 0,

                        out_of_stock:
                            payload.out_of_stock ?? 0,

                        total_categories:
                            payload.total_categories ?? 0,
                    };
                }
            )

            .addCase(
                getProducts.rejected,
                (state, action) => {
                    state.loading = false;

                    state.error =
                        action.payload ||
                        "Failed to fetch products";
                }
            )

            /* =========================
               GET PRODUCT BY ID
            ========================= */

            .addCase(
                getProductById.pending,
                (state) => {
                    state.productLoading = true;
                    state.productError = null;
                }
            )

            .addCase(
                getProductById.fulfilled,
                (state, action) => {
                    state.productLoading = false;

                    state.selectedProduct =
                        action.payload;
                }
            )

            .addCase(
                getProductById.rejected,
                (state, action) => {
                    state.productLoading = false;

                    state.productError =
                        action.payload ||
                        "Failed to fetch product";
                }
            )

            /* =========================
               CREATE
            ========================= */

            .addCase(
                addProduct.pending,
                (state) => {
                    state.createLoading = true;
                    state.createError = null;
                }
            )

            .addCase(
                addProduct.fulfilled,
                (state, action) => {
                    state.createLoading = false;

                    state.products.unshift(
                        action.payload
                    );
                }
            )

            .addCase(
                addProduct.rejected,
                (state, action) => {
                    state.createLoading = false;

                    state.createError =
                        action.payload ||
                        "Failed to create product";
                }
            )

            /* =========================
               UPDATE
            ========================= */

            .addCase(
                editProduct.pending,
                (state) => {
                    state.updateLoading = true;
                    state.updateError = null;
                }
            )

            .addCase(
                editProduct.fulfilled,
                (state, action) => {
                    state.updateLoading = false;

                    const index =
                        state.products.findIndex(
                            (item) =>
                                item.id ===
                                action.payload.id
                        );

                    if (index !== -1) {
                        state.products[index] =
                            action.payload;
                    }

                    state.selectedProduct =
                        action.payload;
                }
            )

            .addCase(
                editProduct.rejected,
                (state, action) => {
                    state.updateLoading = false;

                    state.updateError =
                        action.payload ||
                        "Failed to update product";
                }
            )

            /* =========================
               PATCH
            ========================= */

            .addCase(
                updateProductPartial.fulfilled,
                (state, action) => {
                    const index =
                        state.products.findIndex(
                            (item) =>
                                item.id ===
                                action.payload.id
                        );

                    if (index !== -1) {
                        state.products[index] =
                            action.payload;
                    }

                    state.selectedProduct =
                        action.payload;
                }
            )

            /* =========================
               DELETE
            ========================= */

            .addCase(
                removeProduct.pending,
                (state) => {
                    state.deleteLoading = true;
                    state.deleteError = null;
                }
            )

            .addCase(
                removeProduct.fulfilled,
                (state, action) => {
                    state.deleteLoading = false;

                    state.products =
                        state.products.filter(
                            (item) =>
                                item.id !==
                                action.payload
                        );
                }
            )

            .addCase(
                removeProduct.rejected,
                (state, action) => {
                    state.deleteLoading = false;

                    state.deleteError =
                        action.payload ||
                        "Failed to delete product";
                }
            );
    },
});

export const {
    clearProductError,
    clearSelectedProduct,
} = productSlice.actions;

/* =========================
   SELECTORS
========================= */

export const selectProducts = (state) =>
    state.product.products;

export const selectProductPagination = (state) =>
    state.product.pagination;

export const selectProductKPI = (state) =>
    state.product.kpi;

export const selectSelectedProduct = (state) =>
    state.product.selectedProduct;

export const selectProductLoading = (state) =>
    state.product.loading;

export const selectProductDetailsLoading = (
    state
) => state.product.productLoading;

export const selectProductCreateLoading = (
    state
) => state.product.createLoading;

export const selectProductUpdateLoading = (
    state
) => state.product.updateLoading;

export const selectProductDeleteLoading = (
    state
) => state.product.deleteLoading;

export const selectProductError = (state) =>
    state.product.error;

export default productSlice.reducer;