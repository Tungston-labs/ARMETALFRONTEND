import React, { useMemo } from "react";
import { FiCheckCircle, FiDownload } from "react-icons/fi";

import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import { HeaderButton } from "../../../../Components/ReusableTable/ReusableHeader.styles";
import StatsCards from "../../../../Components/StatsCards/StatsCards";

import CategoryModal from "./modal/CategoryModal";
import DeleteConfirmModal from "./modal/DeleteConfirmModal"; // adjust path if you keep a shared one
import { getCategoryColumns } from "./columns";
import { useCategoriesList } from "./useCategoriesList";
import { PiPackage } from "react-icons/pi";

const CategoriesList = () => {
    const {
        parentCategories,
        filteredData,
        totalPages,
        currentPage,
        loading,
        error,
        search,
        status,
        categoryType,
        showCategoryModal,
        editingCategory,
        deleteTarget,
        deleteLoading,
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
        categories,
        count,
        activeCount,
        inactiveCount,
        parentCount,
        subCategoryCount,
    } = useCategoriesList();

    const statsCards = [
        {
            icon: <PiPackage size={20} />,
            title: "Total Categories",
            count,
            backgroundColor: "#EEF2FF",
            iconColor: "#4F46E5",
        },
        {
            icon: <FiCheckCircle size={20} />,
            title: "Active Categories",
            count: activeCount,
            backgroundColor: "#ECFDF5",
            iconColor: "#10B981",
        },
        {
            icon: <PiPackage size={20} />,
            title: "Products Assigned",
            count: inactiveCount,
            backgroundColor: "#FEF2F2",
            iconColor: "#EF4444",
        },
        {
            icon: <PiPackage size={20} />,
            title: "Empty Categories",
            count: parentCount,
            backgroundColor: "#FFF7ED",
            iconColor: "#F97316",
        },
        {
            icon: <PiPackage size={20} />,
            title: "Largest Category",
            count: subCategoryCount,
            backgroundColor: "#F5F3FF",
            iconColor: "#8B5CF6",
        },
    ];

    const columns = useMemo(
        () =>
            getCategoryColumns({
                onEdit: handleEdit,
                onDelete: handleDeleteClick,
            }),
        [handleEdit, handleDeleteClick]
    );

    return (
        <div style={{ padding: 20 }}>

            {/* HEADER */}

            <ReusableHeader title="Categories" breadcrumbs={["Categories"]}>
                <HeaderButton $variant="excel">
                    <FiDownload />
                    EXPORT EXCEL
                </HeaderButton>

                <HeaderButton onClick={handleAddCategory}>
                    + ADD CATEGORY
                </HeaderButton>
            </ReusableHeader>

            {/* STATS */}
            <StatsCards cards={statsCards} loading={loading} />

            {/* FILTER */}
            <ReusableFilter
                search={search}
                onSearch={handleSearchChange}
                searchPlaceholder="Search Category Code"
                status={status}
                statuses={["active", "inactive"]}
                onStatus={handleStatusChange}
                showSearch
                showStatus
                filters={[
                    {
                        key: "categoryType",
                        value: categoryType,
                        onChange: handleCategory,
                        options: [
                            { label: "Product", value: "product" },
                            { label: "Service", value: "service" },
                        ],
                        placeholder: "Category Type",
                    },
                ]}
            />

            {/* ERROR */}

            {error && (
                <div style={{ color: "red", marginBottom: 10 }}>
                    {typeof error === "string"
                        ? error
                        : error?.message || error?.detail || "Failed to load categories"}
                </div>
            )}

            {/* TABLE */}

            <ReusableTable
                columns={columns}
                data={filteredData}
                loading={loading}
            />

            {/* PAGINATION */}

            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* ADD / EDIT MODAL */}

            <CategoryModal
                isOpen={showCategoryModal}
                onClose={handleCloseCategoryModal}
                onSave={handleSaveCategory}
                categories={categories}
                parentCategories={parentCategories}
                initialData={editingCategory}
                mode={editingCategory ? "edit" : "add"}
            />

            {/* DELETE MODAL */}

            <DeleteConfirmModal
                isOpen={!!deleteTarget}
                title="Delete Category"
                message={
                    deleteTarget
                        ? `Are you sure you want to delete "${deleteTarget.category_name}"? This action cannot be undone.`
                        : ""
                }
                loading={deleteLoading}
                onCancel={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            />

        </div>
    );
};

export default CategoriesList;