import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getCategories,
    addCategory,
    getParentCategories,
    getCategorySummary,
} from "../../../../Redux/finance/categorySlice";

export const useCategoriesList = () => {
    const dispatch = useDispatch();

    const {
        categories = [],
        parentCategories = [],
        summary,
        count = 0,
        totalPages = 1,
        loading,
        error,
    } = useSelector((state) => state.category);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [categoryType, setCategoryType] = useState("");
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const rowsPerPage = 10;

    // ==========================================
    // DEBOUNCE SEARCH
    // Avoids firing an API call on every keystroke.
    // ==========================================

    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 400);

        return () => clearTimeout(timer);
    }, [search]);

    // ==========================================
    // GET CATEGORIES
    // search / status / category_type are now sent to the
    // backend (it already supports all three as query params)
    // instead of being filtered client-side on a single page.
    // ==========================================

    useEffect(() => {
        const params = {
            page: currentPage,
            page_size: rowsPerPage,
        };

        if (debouncedSearch) params.search = debouncedSearch;
        if (status) params.status = status;
        if (categoryType) params.category_type = categoryType;

        dispatch(getCategories(params));
    }, [dispatch, currentPage, debouncedSearch, status, categoryType]);

    // ==========================================
    // GET PARENT CATEGORIES (for the modal dropdown)
    // ==========================================

    useEffect(() => {
        dispatch(getParentCategories());
    }, [dispatch]);

    // ==========================================
    // GET SUMMARY (real totals, not page-derived)
    // ==========================================

    useEffect(() => {
        dispatch(getCategorySummary());
    }, [dispatch]);

    // ==========================================
    // STATS
    // Sourced from the /summary/ endpoint so counts reflect
    // the whole table, not just the currently loaded page.
    // ==========================================

    const totalCount = summary?.total_categories ?? count;
    const activeCount = summary?.active_categories ?? 0;
    const inactiveCount = summary?.inactive_categories ?? 0;
    const parentCount = summary?.parent_categories ?? 0;
    const subCategoryCount = summary?.sub_categories ?? 0;

    // ==========================================
    // HANDLERS
    // ==========================================

    const handleAddCategory = () => setShowCategoryModal(true);

    const handleCloseCategoryModal = () => setShowCategoryModal(false);

    const refreshList = () => {
        const params = {
            page: currentPage,
            page_size: rowsPerPage,
        };

        if (debouncedSearch) params.search = debouncedSearch;
        if (status) params.status = status;
        if (categoryType) params.category_type = categoryType;

        dispatch(getCategories(params));
    };

    const handleSaveCategory = async (categoryData) => {
        // Intentionally NOT catching-and-swallowing here: if addCategory
        // rejects, we let it propagate to CategoryModal so it can show
        // submitError / map backend field errors onto the form. Swallowing
        // it here previously made failed creates fail silently.
        const result = await dispatch(addCategory(categoryData)).unwrap();

        setShowCategoryModal(false);

        // Refresh everything that could now be stale:
        // - the list (new row / new counts)
        // - parent options (the new category may itself be a valid parent)
        // - summary card totals
        refreshList();
        dispatch(getParentCategories());
        dispatch(getCategorySummary());

        return result;
    };

    const handlePageChange = (page) => setCurrentPage(page);

    const handleSearchChange = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleStatusChange = (value) => {
        setStatus(value);
        setCurrentPage(1);
    };

    const handleCategoryTypeChange = (value) => {
        setCategoryType(value);
        setCurrentPage(1);
    };

    return {
        // data
        categories,
        parentCategories,
        // kept as "filteredData" for backward compatibility with
        // CategoriesList.jsx — filtering now happens server-side,
        // so this is just the current page as returned by the API.
        filteredData: categories,
        count: totalCount,
        totalPages,
        currentPage,
        loading,
        error,

        // stats (from /summary/, table-wide — not page-derived)
        activeCount,
        inactiveCount,
        parentCount,
        subCategoryCount,

        // filter state
        search,
        status,
        categoryType,

        // modal state
        showCategoryModal,

        // handlers
        handleAddCategory,
        handleCloseCategoryModal,
        handleSaveCategory,
        handlePageChange,
        handleSearchChange,
        handleStatusChange,
        handleCategoryTypeChange,
    };
};