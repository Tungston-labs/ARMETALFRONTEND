import React from "react";

import { FiDownload } from "react-icons/fi";

import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import StatsCards from "../../../../Components/StatsCards/StatsCards";

import CustomerModal from "./modal/CustomerModal";
import { useCustomerList } from "./Usecustomerlist ";
import { getCustomerColumns } from "./Customerlist.columns";

import {
    ExportButton,
    DateRangeWrapper,
    DatePickerContainer,
    DateInput,
    DateSeparator,
} from "./CustomerList.styles";

const CustomerList = () => {
    const {
        customers,
        totalPages,
        loading,
        selectedCustomer,
        cards,
        totalRecords,
        openMenuId,
        toggleActionsMenu,
        handleCreateInvoice,
        handleViewLedger,
        handleViewOverview,

        search,
        setSearch,
        page,
        setPage,
        startDate,
        endDate,

        isCustomerModalOpen,
        modalMode,
        editingCustomer,

        handleAddCustomer,
        handleEditCustomer,
        handleDeleteCustomer,
        handleSaveCustomer,
        handleCloseCustomerModal,
        handleExport,
        handleStartDateChange,
        handleEndDateChange,
    } = useCustomerList();

    const customerColumns = getCustomerColumns({
        openMenuId,
        toggleActionsMenu,
        handleViewOverview,
        handleCreateInvoice,
        handleViewLedger,
        handleEditCustomer,
        handleDeleteCustomer,
    });

    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="Customer List"
                breadcrumbs={["Sales", "Customer"]}
                buttonText="+ NEW CUSTOMER"
                onButtonClick={handleAddCustomer}
            >
                <ExportButton type="button" onClick={handleExport}>
                    <FiDownload />
                    <span>Export</span>
                </ExportButton>

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

            <StatsCards cards={cards} loading={loading} />

            <ReusableFilter
                search={search}
                onSearch={(value) => {
                    setSearch(value);
                    setPage(1);
                }}
                showSearch
                searchPlaceholder="Search Customer"
            />

            <ReusableTable
                columns={customerColumns}
                data={customers}
                loading={loading}
            />

            <ReusablePagination
                currentPage={page}
                totalPages={totalPages}
                totalRecords={totalRecords || 0}
                onPageChange={setPage}
            />

            <CustomerModal
                isOpen={isCustomerModalOpen}
                onClose={handleCloseCustomerModal}
                mode={modalMode}
                customer={selectedCustomer || editingCustomer}
                onSave={handleSaveCustomer}
            />
        </div>
    );
};

export default CustomerList;