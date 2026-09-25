import React from "react";

import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";

import StatsCards from "../../../../Components/StatsCards/StatsCards";
import AddLedgerModal from "./modal/AddNewLedger";

import {
    DateInput,
    DatePickerContainer,
    DateRangeWrapper,
    DateSeparator,
    SummaryHeader,
    SummarySearch,
    SummaryTitle,
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

        // Customer summary
        // Customer summary
        customerSummarySearch,
        handleCustomerSummarySearch,
        customerSummaryData,
        customerSummaryColumns,
        customerSummaryCurrentPage,
        customerSummaryTotalPages,
        customerSummaryTotalItems,
        setCustomerSummaryCurrentPage,

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

            {/* Error */}
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

            {/* Stats */}
            <StatsCards cards={cards} loading={loading} />

            {/* =====================================================
                TABLE 1 - CUSTOMER LEDGER
            ====================================================== */}

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

            {/* =====================================================
                TABLE 2 - SUMMARY BY CUSTOMER
            ====================================================== */}

            <SummaryHeader>
                <SummaryTitle>
                    Summary by Customer
                </SummaryTitle>

                <SummarySearch
                    type="text"
                    value={customerSummarySearch}
                    onChange={(e) =>
                        handleCustomerSummarySearch(e.target.value)
                    }
                    placeholder="Search Customer"
                />
            </SummaryHeader>

            <ReusableTable
                columns={customerSummaryColumns}
                data={customerSummaryData}
                loading={loading}
            />

            <ReusablePagination
                currentPage={customerSummaryCurrentPage}
                totalPages={customerSummaryTotalPages}
                totalRecords={customerSummaryTotalItems}
                onPageChange={setCustomerSummaryCurrentPage}
            />

            {/* Modal */}
            <AddLedgerModal
                isOpen={isLedgerModalOpen}
                onClose={handleCloseLedger}
                onSave={handleSaveLedger}
            />
        </div>
    );
};

export default CustomerLedger;