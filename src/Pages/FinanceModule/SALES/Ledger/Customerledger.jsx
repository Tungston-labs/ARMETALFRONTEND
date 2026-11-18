import React, { useState } from "react";

import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";

import StatsCards from "../../../../Components/StatsCards/StatsCards";
// import AddLedgerModal from "./modal/AddNewLedger";

import {
    DateInput,
    DatePickerContainer,
    DateRangeWrapper,
    DateSeparator,
    ExportButton,
    // SummaryHeader,
    // SummarySearch,
    // SummaryTitle,
} from "./CustomerLedger.styles";

import useCustomerLedger from "./Usecustomerledger";
import { FiDownload } from "react-icons/fi";

const CustomerLedger = () => {
    const {
        search,
        status,
        startDate,
        endDate,

        currentPage,
        totalPages,
        setCurrentPage,

        ledgerData,
        ledgerColumns,

        totalItems,

        cards,
        loading,
        dashboardSummaryLoading,
        error,

        statusOptions,

        handleStartDateChange,
        handleEndDateChange,
        handleSearch,
        handleStatusChange,
    } = useCustomerLedger();

    /* =====================================================
       EXPORT (CSV of the rows currently shown)
    ====================================================== */

    const [exportLoading, setExportLoading] = useState(false);

    const handleExport = () => {
        const rows = Array.isArray(ledgerData) ? ledgerData : [];

        if (!rows.length) {
            window.alert("No ledger data to export.");
            return;
        }

        setExportLoading(true);

        try {
            // Only data columns: skip the Action column and non-text headers
            const cols = (ledgerColumns || []).filter(
                (col) =>
                    col?.accessor &&
                    col.accessor !== "actions" &&
                    typeof col.header === "string",
            );

            const escape = (value) =>
                `"${String(value ?? "").replace(/"/g, '""')}"`;

            const csv = [
                cols.map((col) => escape(col.header)).join(","),
                ...rows.map((row) =>
                    cols.map((col) => escape(row?.[col.accessor])).join(","),
                ),
            ].join("\n");

            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "customer-ledger.csv";
            link.click();

            URL.revokeObjectURL(url);
        } finally {
            setExportLoading(false);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="Customer Ledger"
                breadcrumbs={["Sales", "Customer Ledger"]}
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
                <ExportButton
                    type="button"
                    onClick={handleExport}
                    disabled={exportLoading}
                >
                    <FiDownload />

                    <span>{exportLoading ? "EXPORTING..." : "EXPORT"}</span>
                </ExportButton>
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
                        : "Something went wrong. Please check your input and try again."}
                </div>
            )}

            {/* Stats */}
            <StatsCards cards={cards} loading={dashboardSummaryLoading} />

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
        </div>
    );
};

export default CustomerLedger;