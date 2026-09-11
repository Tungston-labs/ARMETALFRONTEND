import React, { useMemo, useState, useEffect } from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    PiPackage,
} from "react-icons/pi";

import {
    LuPackageCheck,
    LuPackageMinus,
    LuPackageX,
    LuWalletMinimal,
} from "react-icons/lu";

import { getProductColumns } from "./columns.jsx";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards.jsx";

import AddProductModal from "./modal/AddProductModal";
import DeleteConfirmModal from "./modal/DeleteConfirmModal";

import {
    addProduct,
    editProduct,
    removeProduct,
    getProducts,
    selectProductCreateLoading,
    selectProductUpdateLoading,
    selectProductDeleteLoading,
} from "../../../../Redux/finance/ProductSlice";

import { getCategories } from "../../../../Redux/finance/categorySlice";
import { getWarehouses } from "../../../../services/warehouseService";

import { useProductList } from "./productHooks";

const ProductList = () => {
    const dispatch = useDispatch();

    const [warehouses, setWarehouses] = useState([]);
    const [showProductModal, setShowProductModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const createLoading = useSelector(
        selectProductCreateLoading
    );

    const updateLoading = useSelector(
        selectProductUpdateLoading
    );

    const deleteLoading = useSelector(
        selectProductDeleteLoading
    );

    const categoryOptions = useSelector(
        (state) => state.category?.categories || []
    );

    useEffect(() => {
        dispatch(
            getCategories({
                page: 1,
                page_size: 100,
            })
        );

        getWarehouses({
            page: 1,
            page_size: 100,
        })
            .then((response) => {
                const rows = Array.isArray(response)
                    ? response
                    : (response?.results || response?.data?.results || response?.data || []);

                setWarehouses(Array.isArray(rows) ? rows : []);
            })
            .catch((error) => {
                console.error("Failed to load product warehouse options:", error);
                setWarehouses([]);
            });

        // NOTE: KPI is no longer fetched separately here.
        // The product list endpoint (getProducts, called
        // inside useProductList) already returns the KPI
        // fields in the same response, so a dedicated
        // kpi/ request is unnecessary.
    }, [dispatch]);

    const {
        search,
        category,
        status,
        type,
        stockStatus,
        currentPage,
        paginatedData,
        totalPages,
        loading,
        kpi,
        handleSearch,
        handleCategory,
        handleStatus,
        handleType,
        handleStockStatus,
        handlePageChange,
    } = useProductList();

    const refreshList = () => {
        dispatch(
            getProducts({
                page: currentPage,
                page_size: 10,
                search: search.trim(),
            })
        );
        // Single call refreshes both the table
        // and the stats cards (kpi comes from
        // the same response).
    };

    const handleOpenAddModal = () => {
        setEditingProduct(null);
        setShowProductModal(true);
    };

    const handleCloseProductModal = () => {
        setShowProductModal(false);
        setEditingProduct(null);
    };

    const handleSaveProduct = async (data) => {
        try {
            if (editingProduct) {
                await dispatch(
                    editProduct({
                        id: editingProduct.id,
                        productData: data,
                    })
                ).unwrap();
            } else {
                await dispatch(
                    addProduct(data)
                ).unwrap();
            }

            refreshList();
            handleCloseProductModal();
        } catch (error) {
            console.error(
                editingProduct
                    ? "Update product failed:"
                    : "Create product failed:",
                error
            );
        }
    };

    const handleEdit = (row) => {
        setEditingProduct(row);
        setShowProductModal(true);
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
            await dispatch(
                removeProduct(deleteTarget.id)
            ).unwrap();

            refreshList();
        } catch (error) {
            console.error(
                "Delete product failed:",
                error
            );
        } finally {
            setDeleteTarget(null);
        }
    };

    const columns = useMemo(
        () =>
            getProductColumns({
                onEdit: handleEdit,
                onDelete: handleDeleteClick,
            }),
        []
    );

    const statsCards = [
        {
            title: "Total Products",
            count: kpi?.total_products || 0,
            icon: <PiPackage />,
            backgroundColor: "#E8F1FF",
            iconColor: "#2563EB",
        },
        {
            title: "Active Products",
            count: kpi?.active_products || 0,
            icon: <LuPackageCheck />,
            backgroundColor: "#E8F8EF",
            iconColor: "#16A34A",
        },
        {
            title: "Inactive Products",
            count: kpi?.inactive_products || 0,
            icon: <LuPackageMinus />,
            backgroundColor: "#FFF4E5",
            iconColor: "#EA580C",
        },
        {
            title: "Out of Stock",
            count: kpi?.out_of_stock || 0,
            icon: <LuPackageX />,
            backgroundColor: "#FFF1F2",
            iconColor: "#DC2626",
        },
        {
            title: "Total Categories",
            count: kpi?.total_categories || 0,
            icon: <LuWalletMinimal />,
            backgroundColor: "#F3F0FF",
            iconColor: "#7C3AED",
        },
    ];

    return (
        <>
            <div style={{ padding: 20 }}>

                <ReusableHeader
                    title="Product List"
                    breadcrumbs={[
                        "Products",
                        "Product List",
                    ]}
                    buttonText="ADD NEW PRODUCT"
                    onButtonClick={handleOpenAddModal}
                />

                <StatsCards
                    cards={statsCards}
                    loading={loading}
                />

                <ReusableFilter
                    search={search}
                    onSearch={handleSearch}
                    searchPlaceholder="Search Product/Service"
                    showSearch

                    status={status}
                    statuses={[
                        "Active",
                        "Inactive",
                    ]}
                    onStatus={handleStatus}
                    showStatus

                    filters={[
                        {
                            key: "category",
                            value: category,
                            onChange: handleCategory,
                            options:
                                categoryOptions.map(
                                    (c) => ({
                                        label:
                                            c.category_name,
                                        value: c.id,
                                    })
                                ),
                            placeholder:
                                "All Category",
                        },
                        {
                            key: "type",
                            value: type,
                            onChange: handleType,
                            options: [
                                "Product",
                                "Service",
                            ],
                            placeholder:
                                "All Type",
                        },
                        {
                            key: "stockStatus",
                            value: stockStatus,
                            onChange:
                                handleStockStatus,
                            options: [
                                "In Stock",
                                "Low Stock",
                                "Out of Stock",
                            ],
                            placeholder:
                                "Stock Status",
                        },
                    ]}
                />

                <ReusableTable
                    columns={columns}
                    data={paginatedData}
                    loading={loading}
                />

                <ReusablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>

            <AddProductModal
                isOpen={showProductModal}
                onClose={handleCloseProductModal}
                onSave={handleSaveProduct}
                loading={
                    editingProduct
                        ? updateLoading
                        : createLoading
                }
                warehouses={warehouses}
                initialData={editingProduct}
                mode={
                    editingProduct
                        ? "edit"
                        : "add"
                }
            />

            <DeleteConfirmModal
                isOpen={!!deleteTarget}
                title="Delete Product"
                message={
                    deleteTarget
                        ? `Are you sure you want to delete "${deleteTarget.product_name}"? This action cannot be undone.`
                        : ""
                }
                loading={deleteLoading}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
};

export default ProductList;