import API from "../api";

// GET: /api/finance/product/
export const fetchProducts = async (params = {}) => {
    const response = await API.get(
        "/finance/product/",
        { params }
    );

    return response.data;
};

// GET: /api/finance/product/kpi/
export const fetchProductKPI = async () => {
    const response = await API.get(
        "/finance/product/kpi/"
    );

    return response.data;
};

// GET: /api/finance/product/{id}/
export const fetchProductById = async (id) => {
    const response = await API.get(
        `/finance/product/${id}/`
    );

    return response.data;
};

// POST: /api/finance/product/
export const createProduct = async (productData) => {
    const response = await API.post(
        "/finance/product/",
        productData
    );

    return response.data;
};

// PUT: /api/finance/product/{id}/
export const updateProduct = async (
    id,
    productData
) => {
    const response = await API.put(
        `/finance/product/${id}/`,
        productData
    );

    return response.data;
};

// PATCH: /api/finance/product/{id}/
export const patchProduct = async (
    id,
    productData
) => {
    const response = await API.patch(
        `/finance/product/${id}/`,
        productData
    );

    return response.data;
};

// DELETE: /api/finance/product/{id}/
export const deleteProduct = async (id) => {
    const response = await API.delete(
        `/finance/product/${id}/`
    );

    return response.data;
};