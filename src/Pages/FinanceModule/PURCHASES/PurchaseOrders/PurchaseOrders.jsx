import React from "react";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";

import usePurchaseOrders from "./Usepurchaseorders";
import {
    DateInput,
    DatePickerContainer,
    DateRangeWrapper,
    DateSeparator,
} from "./PurchaseOrders.styles";

const PurchaseOrders = () => {
    const {
        search,
        vendor,
        status,
        startDate,
        endDate,

        currentPage,
        totalPages,
        totalItems,
        setCurrentPage,

        cards,
        columns,
        paginatedData,
        loading,

        vendorOptions,
        statusOptions,

        handleSearch,
        handleVendorChange,
        handleStatusChange,
        handleStartDateChange,
        handleEndDateChange,
        handleAddPurchaseOrder,
    } = usePurchaseOrders();

    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="Purchase Orders"
                breadcrumbs={["Purchase Orders"]}
                buttonText="+ ADD NEW PURCHASE ORDER"
                onButtonClick={handleAddPurchaseOrder}
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

            <StatsCards cards={cards} />

            <ReusableFilter
                search={search}
                onSearch={handleSearch}
                searchPlaceholder="Search PO number or vendor"
                showSearch
                status={status}
                statuses={statusOptions}
                onStatus={handleStatusChange}
                showStatus
                filters={[
                    {
                        key: "vendor",
                        value: vendor,
                        onChange: handleVendorChange,
                        options: vendorOptions,
                        placeholder: "All Vendors",
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
                totalRecords={totalItems}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default PurchaseOrders;