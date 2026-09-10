import React from "react";
import { FiFolder, FiCheckCircle, FiXCircle, FiLayers, FiDownload } from "react-icons/fi";

import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import { HeaderButton } from "../../../../Components/ReusableTable/ReusableHeader.styles";
import StatsCards from "../../../../Components/StatsCards/StatsCards"; // adjust path to actual location

import CategoryModal from "./modal/CategoryModal";
import { categoryColumns } from "./columns";
import { useCategoriesList } from "./useCategoriesList";

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
        showCategoryModal,
        handleAddCategory,
        handleCloseCategoryModal,
        handleSaveCategory,
        handlePageChange,
        handleSearchChange,
        handleStatusChange,
        categories,
        count,
        activeCount,
        inactiveCount,
        parentCount,
        subCategoryCount,
    } = useCategoriesList();

    // ==========================================
    // STATS CARDS CONFIG
    // Sourced from the backend /summary/ endpoint (real,
    // table-wide totals) rather than derived from a single
    // loaded page. Each card now shows a distinct stat.
    // ==========================================

    const statsCards = [
        {
            icon: <FiFolder size={20} />,
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
            icon: <FiXCircle size={20} />,
            title: "Inactive Categories",
            count: inactiveCount,
            backgroundColor: "#FEF2F2",
            iconColor: "#EF4444",
        },
        {
            icon: <FiLayers size={20} />,
            title: "Parent Categories",
            count: parentCount,
            backgroundColor: "#FFF7ED",
            iconColor: "#F97316",
        },
        {
            icon: <FiLayers size={20} />,
            title: "Sub Categories",
            count: subCategoryCount,
            backgroundColor: "#F5F3FF",
            iconColor: "#8B5CF6",
        },
    ];

    return (
        <div style={{ padding: 20 }}>

            {/* HEADER */}

            <ReusableHeader
                title="Categories"
                breadcrumbs={["Categories"]}
            >
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
                status={status}
                statuses={["active", "inactive"]}
                onStatus={handleStatusChange}
                showSearch
                showStatus
                rightButton={
                    <HeaderButton $variant="orange">
                        Apply Filters
                    </HeaderButton>
                }
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
                columns={categoryColumns}
                data={filteredData}
                loading={loading}
            />

            {/* PAGINATION */}

            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            {/* MODAL */}

            <CategoryModal
                isOpen={showCategoryModal}
                onClose={handleCloseCategoryModal}
                onSave={handleSaveCategory}
                categories={categories}
                parentCategories={parentCategories}
            />

        </div>
    );
};

export default CategoriesList;