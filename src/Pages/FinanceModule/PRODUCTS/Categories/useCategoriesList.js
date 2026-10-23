import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getCategories,
    addCategory,
    editCategory,
    removeCategory,
    getParentCategories,
    getCategorySummary,
} from "../../../../Redux/finance/Product/categorySlice";

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

    // edit / delete state
    const [editingCategory, setEditingCategory] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const rowsPerPage = 10;

    // ==========================================
    // DEBOUNCE SEARCH
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
    // GET PARENT CATEGORIES
    // ==========================================

    useEffect(() => {
        dispatch(getParentCategories());
    }, [dispatch]);

    // ==========================================
    // GET SUMMARY
    // ==========================================

    useEffect(() => {
        dispatch(getCategorySummary());
    }, [dispatch]);

    // ==========================================
    // STATS
    // ==========================================

    const totalCount = summary?.total_categories ?? count;
    const activeCount = summary?.active_categories ?? 0;
    const inactiveCount = summary?.inactive_categories ?? 0;
    const parentCount = summary?.parent_categories ?? 0;
    const subCategoryCount = summary?.sub_categories ?? 0;

    // ==========================================
    // HANDLERS
    // ==========================================

    const handleAddCategory = () => {
        setEditingCategory(null);
        setShowCategoryModal(true);
    };

    const handleCloseCategoryModal = () => {
        setShowCategoryModal(false);
        setEditingCategory(null);
    };

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
        // Same intent as before: don't swallow errors here so
        // CategoryModal can surface submitError / field errors.
        const result = editingCategory
            ? await dispatch(
                  editCategory({
                      id: editingCategory.id,
                      categoryData,
                  })
              ).unwrap()
            : await dispatch(addCategory(categoryData)).unwrap();

        setShowCategoryModal(false);
        setEditingCategory(null);

        refreshList();
        dispatch(getParentCategories());
        dispatch(getCategorySummary());

        return result;
    };

    const handleEdit = (row) => {
        setEditingCategory(row);
        setShowCategoryModal(true);
    };

    const handleDeleteClick = (row) => {
        setDeleteTarget(row);
    };

    const handleCancelDelete = () => {
        setDeleteTarget(null);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;

        try {
            setDeleteLoading(true);
            await dispatch(removeCategory(deleteTarget.id)).unwrap();

            refreshList();
            dispatch(getParentCategories());
            dispatch(getCategorySummary());
        } catch (error) {
            console.error("Delete category failed:", error);
        } finally {
            setDeleteLoading(false);
            setDeleteTarget(null);
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

    const handleCategory = (value) => {
        setCategoryType(value);
        setCurrentPage(1);
    };

    return {
        // data
        categories,
        parentCategories,
        filteredData: categories,
        count: totalCount,
        totalPages,
        currentPage,
        loading,
        error,

        // stats
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
        editingCategory,

        // delete state
        deleteTarget,
        deleteLoading,

        // handlers
        handleAddCategory,
        handleCloseCategoryModal,
        handleSaveCategory,
        handlePageChange,
        handleSearchChange,
        handleStatusChange,
        handleCategory,
        handleEdit,
        handleDeleteClick,
        handleCancelDelete,
        handleConfirmDelete,
    };
};