import React, { useEffect, useMemo, useState } from "react";
import {
    FiDollarSign,
    FiArrowDownCircle,
    FiArrowUpCircle,
    FiFileText,
} from "react-icons/fi";

import {
    employeeColumns,
    employeeData,
} from "../../../../Components/ReusableTable/dummydata";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";
import {
    DateInput,
    DatePickerContainer,
    DateRangeWrapper,
    DateSeparator,
} from "./VendorLedger.styles";

const ROWS_PER_PAGE = 10;

// Row fields used by the filters. Change these to match your real ledger data.
const VENDOR_FIELD = "vendor_id";
const TYPE_FIELD = "transaction_type";
const DATE_FIELD = "date";

// Vendor dropdown
const VENDOR_OPTIONS = [
    { label: "ABC Trading LLC", value: "1" },
    { label: "XYZ Supplies", value: "2" },
    { label: "Global Suppliers", value: "3" },
];

const TRANSACTION_TYPE_OPTIONS = [
    { label: "Purchase", value: "purchase" },
    { label: "Payment", value: "payment" },
    { label: "Credit Note", value: "credit_note" },
    { label: "Debit Note", value: "debit_note" },
];

const VendorLedger = () => {
    // TODO: replace employeeData with the real vendor ledger data / API
    const data = employeeData;

    // Filters
    const [search, setSearch] = useState("");
    const [vendor, setVendor] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // ---- Filtering (client-side) ----

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();

        return data.filter((row) => {
            if (vendor && String(row[VENDOR_FIELD]) !== String(vendor)) return false;
            if (transactionType && row[TYPE_FIELD] !== transactionType) return false;

            // Search across every value in the row
            if (
                term &&
                !Object.values(row).join(" ").toLowerCase().includes(term)
            )
                return false;

            // Date range (inclusive), compared as YYYY-MM-DD strings
            if (startDate || endDate) {
                const d = row[DATE_FIELD] ? String(row[DATE_FIELD]).slice(0, 10) : "";
                if (!d) return false;
                if (startDate && d < startDate) return false;
                if (endDate && d > endDate) return false;
            }
            return true;
        });
    }, [data, search, vendor, transactionType, startDate, endDate]);

    // ---- Pagination ----

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / ROWS_PER_PAGE) || 1;

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * ROWS_PER_PAGE;
        return filtered.slice(start, start + ROWS_PER_PAGE);
    }, [filtered, currentPage]);

    // Keep the page valid if rows shrink
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [currentPage, totalPages]);

    // ---- Handlers (each resets to page 1) ----

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };
    const handleVendorChange = (value) => {
        setVendor(value);
        setCurrentPage(1);
    };
    const handleTransactionTypeChange = (value) => {
        setTransactionType(value);
        setCurrentPage(1);
    };
    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        setCurrentPage(1);
    };
    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
        setCurrentPage(1);
    };

    // ---- Stats ----

    const statsCards = [
        {
            title: "Total Payables",
            count: "0.00",
            icon: <FiDollarSign />,
            backgroundColor: "#EEF2FF",
            iconColor: "#4F46E5",
        },
        {
            title: "Total Purchases",
            count: "0.00",
            icon: <FiArrowDownCircle />,
            backgroundColor: "#FFF7ED",
            iconColor: "#F59E0B",
        },
        {
            title: "Total Payments",
            count: "0.00",
            icon: <FiArrowUpCircle />,
            backgroundColor: "#ECFDF5",
            iconColor: "#10B981",
        },
        {
            title: "Total Transactions",
            count: totalItems,
            icon: <FiFileText />,
            backgroundColor: "#FEF2F2",
            iconColor: "#EF4444",
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="Vendor Ledger"
                breadcrumbs={["Vendor Ledger"]}
                buttonText="+ ADD NEW VENDOR LEDGER"
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

            {/* Stats Cards */}
            <StatsCards cards={statsCards} />

            {/* Filters */}
            <ReusableFilter
                search={search}
                onSearch={handleSearch}
                showSearch
                filters={[
                    {
                        key: "vendor",
                        value: vendor,
                        onChange: handleVendorChange,
                        options: VENDOR_OPTIONS,
                        placeholder: "All Vendor",
                    },
                    {
                        key: "transactionType",
                        value: transactionType,
                        onChange: handleTransactionTypeChange,
                        options: TRANSACTION_TYPE_OPTIONS,
                        placeholder: "All Transaction Type",
                    },
                ]}
            />

            {/* Table */}
            <ReusableTable columns={employeeColumns} data={paginatedData} />

            {/* Pagination */}
            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalRecords={totalItems}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default VendorLedger;