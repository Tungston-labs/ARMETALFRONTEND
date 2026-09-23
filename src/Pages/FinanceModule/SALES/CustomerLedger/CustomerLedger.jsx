import React from "react";

import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";

import StatsCards from "../../../../Components/StatsCards/StatsCards";
import AddLedgerModal from "./modal/AddLedgerModal";

import {
    DateInput,
    DatePickerContainer,
    DateRangeWrapper,
    DateSeparator,
} from "./CustomerLedger.styles";
import useCustomerLedger from "./Usecustomerledger";

const CustomerLedger = () => {
    const {
        search,
        status,
        transactionType,
        customer,
        startDate,
        endDate,
        isLedgerModalOpen,
        currentPage,
        totalPages,
        setCurrentPage,
        ledgerData,
        ledgerColumns,
        totalItems,
        cards,
        loading,
        error,
        statusOptions,
        transactionTypeOptions,
        customerOptions,
        handleStartDateChange,
        handleEndDateChange,
        handleAddLedger,
        handleCloseLedger,
        handleSaveLedger,
        handleSearch,
        handleStatusChange,
        handleTransactionTypeChange,
        handleCustomerChange,
    } = useCustomerLedger();

    return (
        <div style={{ padding: 20 }}>
            {/* Header */}
            <ReusableHeader
                title="Customer Ledger"
                breadcrumbs={["Sales", "Customer Ledger"]}
                buttonText="+ NEW JOURNAL ENTRY"
                onButtonClick={handleAddLedger}
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

            {error && (
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
                    {typeof error === "string"
                        ? error
                        : "Something went wrong loading the ledger."}
                </div>
            )}

            {/* Stats Cards */}
            <StatsCards cards={cards} loading={loading} />

            {/* Filters */}
            <ReusableFilter
                search={search}
                onSearch={handleSearch}
                searchPlaceholder="Search Ledger"
                showSearch
                status={status}
                statuses={statusOptions}
                onStatus={handleStatusChange}
                showStatus
                filters={[
                    {
                        key: "transactionType",
                        value: transactionType,
                        onChange: handleTransactionTypeChange,
                        options: transactionTypeOptions,
                        placeholder: "All Transaction Types",
                    },
                    {
                        key: "customer",
                        value: customer,
                        onChange: handleCustomerChange,
                        options: customerOptions,
                        placeholder: "All Customers",
                    },
                ]}
            />

            <ReusableTable
                columns={ledgerColumns}
                data={ledgerData}
                loading={loading}
            />

            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalRecords={totalItems}
                onPageChange={setCurrentPage}
            />

            <AddLedgerModal
                isOpen={isLedgerModalOpen}
                onClose={handleCloseLedger}
                onSave={handleSaveLedger}
            />
        </div>
    );
};

export default CustomerLedger;