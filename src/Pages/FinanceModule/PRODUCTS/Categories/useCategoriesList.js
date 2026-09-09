import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getCategories,
    addCategory,
    getParentCategories,
} from "../../../../Redux/finance/categorySlice";

export const useCategoriesList = () => {
    const dispatch = useDispatch();

    const {
        categories = [],
        parentCategories = [],
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
    // GET CATEGORIES
    // ==========================================

    useEffect(() => {
        dispatch(
            getCategories({
                page: currentPage,
                page_size: rowsPerPage,
            })
        );
    }, [dispatch, currentPage]);

    useEffect(() => {
        dispatch(getParentCategories());
    }, [dispatch]);

    // ==========================================
    // FILTER
    // ==========================================

    const filteredData = categories.filter((category) => {
        const searchValue = search.trim().toLowerCase();

        const matchesSearch =
            !searchValue ||
            category.category_name?.toLowerCase().includes(searchValue) ||
            category.code?.toLowerCase().includes(searchValue);

        const matchesStatus = !status || category.status === status;
        const matchesType = !categoryType || category.category_type === categoryType;

        return matchesSearch && matchesStatus && matchesType;
    });

    // ==========================================
    // STATS
    // ==========================================
    // NOTE: activeCount / inactiveCount / productCount are derived from
    // the currently loaded page only (categories), since the API doesn't
    // return status breakdowns. totalCount uses the real server-side total.

    const activeCount = categories.filter((c) => c.status === "active").length;
    const inactiveCount = categories.filter((c) => c.status === "inactive").length;
    const productCount = categories.filter((c) => c.category_type === "product").length;

    // ==========================================
    // HANDLERS
    // ==========================================

    const handleAddCategory = () => setShowCategoryModal(true);

    const handleCloseCategoryModal = () => setShowCategoryModal(false);

    const handleSaveCategory = async (categoryData) => {
        try {
            await dispatch(addCategory(categoryData)).unwrap();

            setShowCategoryModal(false);

            // Refresh list
            dispatch(
                getCategories({
                    page: currentPage,
                    page_size: rowsPerPage,
                })
            );
        } catch (error) {
            console.error("Failed to create category:", error);
        }
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

    // ==========================================
    // DEBUG
    // ==========================================

    console.log("Categories:", categories);
    console.log("Filtered Categories:", filteredData);
    console.log("Count:", count);
    console.log("Total Pages:", totalPages);

    return {
        // data
        categories,
        parentCategories,
        filteredData,
        count,
        totalPages,
        currentPage,
        loading,
        error,

        // stats
        activeCount,
        inactiveCount,
        productCount,

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
    };
};