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
} from "../../../../Redux/finance/Product/ProductSlice";

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

 const loadProducts = useCallback(() => {
    const params = {
        page: currentPage,
        page_size: rowsPerPage,
    };

    if (search.trim()) params.search = search.trim();
    if (category) params.category = category;
    if (status) params.status = status.toLowerCase();    
    if (type) params.product_type = type.toLowerCase();    
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

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);
    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleCategory = (value) => {
        setCategory(value);
        setCurrentPage(1);
    };
    const handleStatus = (value) => {
        setStatus(value);
        setCurrentPage(1);
    };

    const handleType = (value) => {
        setType(value);
        setCurrentPage(1);
    };

    const handleStockStatus = (value) => {
        setStockStatus(value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

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