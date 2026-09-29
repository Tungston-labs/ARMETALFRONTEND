import React from "react";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";

import usePurchaseOrders from "./Usepurchaseorders";

const PurchaseOrders = () => {
    const {
        search,
        vendor,
        status,

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
        handleAddPurchaseOrder,
    } = usePurchaseOrders();

    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="Purchase Orders"
                breadcrumbs={["Purchase Orders"]}
                buttonText="+ ADD NEW PURCHASE ORDER"
                onButtonClick={handleAddPurchaseOrder}
            />

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