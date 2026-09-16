import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    getProducts,

    selectProducts,
    selectProductPagination,
    selectProductLoading,
    selectProductKPI,
} from "../../../../Redux/finance/ProductSlice";

const rowsPerPage = 10;

export const useProductList = () => {
    const dispatch = useDispatch();

    const products =
        useSelector(selectProducts);

    const pagination =
        useSelector(selectProductPagination);

    const loading =
        useSelector(selectProductLoading);

    const kpi =
        useSelector(selectProductKPI);

    const [search, setSearch] =
        useState("");

    const [category, setCategory] =
        useState("");

    const [status, setStatus] =
        useState("");

    const [type, setType] =
        useState("");

    const [stockStatus, setStockStatus] =
        useState("");

    const [currentPage, setCurrentPage] =
        useState(1);

    /* =========================
       FETCH PRODUCTS
       (this single call also
       returns KPI + pagination)
    ========================= */

 const loadProducts = useCallback(() => {
    const params = {
        page: currentPage,
        page_size: rowsPerPage,
    };

    if (search.trim()) params.search = search.trim();
    if (category) params.category = category;
    if (status) params.status = status.toLowerCase();       // "Active" -> "active"
    if (type) params.product_type = type.toLowerCase();     // "Product" -> "product"

    // Only send once the backend supports it:
    // if (stockStatus) {
    //     params.stock_status = stockStatus
    //         .toLowerCase()
    //         .replace(/\s+/g, "_");                        // "Out of Stock" -> "out_of_stock"
    // }

    dispatch(getProducts(params));
}, [
    dispatch,
    currentPage,
    search,
    category,
    status,
    type,
    stockStatus,
]);
    /* =========================
       INITIAL LOAD / REFETCH
    ========================= */

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    /* =========================
       SEARCH
    ========================= */

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    /* =========================
       CATEGORY
    ========================= */

    const handleCategory = (value) => {
        setCategory(value);
        setCurrentPage(1);
    };

    /* =========================
       STATUS
    ========================= */

    const handleStatus = (value) => {
        setStatus(value);
        setCurrentPage(1);
    };

    /* =========================
       TYPE
    ========================= */

    const handleType = (value) => {
        setType(value);
        setCurrentPage(1);
    };

    /* =========================
       STOCK STATUS
    ========================= */

    const handleStockStatus = (value) => {
        setStockStatus(value);
        setCurrentPage(1);
    };

    /* =========================
       PAGE
    ========================= */

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    /* =========================
       TOTAL PAGES
       (comes straight from the
       backend response now)
    ========================= */

    const totalPages =
        pagination?.totalPages || 0;

    return {
        search,
        category,
        status,
        type,
        stockStatus,

        currentPage,

        products,

        paginatedData: products,

        totalPages,

        loading,
        kpi,

        handleSearch,
        handleCategory,
        handleStatus,
        handleType,
        handleStockStatus,
        handlePageChange,

        loadProducts,
    };
};