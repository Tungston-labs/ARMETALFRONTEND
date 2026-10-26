import React from "react";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";

import AddNewVendor from "./modal/AddVendorModal";
import useVendors from "./Usevendors";
import { formatApiError } from "./Vendorpayload";
import {
    DateInput,
    DatePickerContainer,
    DateRangeWrapper,
    DateSeparator,
} from "./Vendors.styles";

const Vendors = () => {
    const {
        search,
        status,
        vendorType,
        paymentTerm,
        startDate,
        endDate,

        isVendorModalOpen,
        editingVendor,
        currentPage,
        totalPages,
        totalItems,
        setCurrentPage,

        cards,
        columns,
        paginatedData,

        loading,
        isSaving,
        dashboardLoading,
        error,

        statusOptions,
        vendorTypeOptions,
        paymentTermOptions,

        handleSearch,
        handleStatusChange,
        handleVendorType,
        handlePaymentTerm,
        handleStartDateChange,
        handleEndDateChange,
        handleAddVendor,
        handleCloseVendor,
        handleSaveVendor,
        handleViewVendor,
    } = useVendors();

    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="Vendors"
                breadcrumbs={["Vendors"]}
                buttonText="+ ADD NEW VENDOR"
                onButtonClick={handleAddVendor}
            >
                <DateRangeWrapper>
                    <DatePickerContainer>
                        <DateInput
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            max={endDate || undefined}
                            aria-label="Start date"
                        />

                        <DateSeparator>-</DateSeparator>

                        <DateInput
                            type="date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            min={startDate || undefined}
                            aria-label="End date"
                        />
                    </DatePickerContainer>
                </DateRangeWrapper>
            </ReusableHeader>

            {/* Page-level error; while the modal is open the error shows inside it */}
            {error && !isVendorModalOpen && (
                <div
                    style={{
                        margin: "12px 0",
                        padding: "10px 14px",
                        borderRadius: 6,
                        background: "#FDEEEE",
                        color: "#B00020",
                        fontSize: 14,
                    }}
                >
                    {formatApiError(error)}
                </div>
            )}

            <StatsCards cards={cards} loading={dashboardLoading} />

            <ReusableFilter
                search={search}
                onSearch={handleSearch}
                searchPlaceholder="Search Vendor"
                showSearch
                status={status}
                statuses={statusOptions}
                onStatus={handleStatusChange}
                showStatus
                filters={[
                    {
                        key: "vendorType",
                        value: vendorType,
                        onChange: handleVendorType,
                        options: vendorTypeOptions,
                        placeholder: "All Vendor Types",
                    },
                    {
                        key: "paymentTerm",
                        value: paymentTerm,
                        onChange: handlePaymentTerm,
                        options: paymentTermOptions,
                        placeholder: "All Payment Terms",
                    },
                ]}
            />

            <ReusableTable
                columns={columns}
                data={paginatedData}
                loading={loading}
                    onRowClick={handleViewVendor}
            />

            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalRecords={totalItems}
                onPageChange={setCurrentPage}
            />

            <AddNewVendor
                isOpen={isVendorModalOpen}
                vendor={editingVendor}
                onClose={handleCloseVendor}
                onSave={handleSaveVendor}
                saving={isSaving}
                error={error}
            />
        </div>
    );
};

export default Vendors;