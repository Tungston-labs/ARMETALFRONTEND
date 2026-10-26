import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FiDollarSign,
    FiArrowDownCircle,
    FiArrowUpCircle,
    FiFileText,
} from "react-icons/fi";

import { getVendorLedgers } from "../../../../Redux/finance/purchases/vendorLedgerslice";
import { getVendorLedgerColumns, formatAmount } from "./Vendorledgercolumns";

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

// TODO: replace with your real vendor list (API / Redux) when you have one
const VENDOR_OPTIONS = [
    { label: "ABC Trading LLC", value: "1" },
    { label: "XYZ Supplies", value: "2" },
    { label: "Global Suppliers", value: "3" },
];

// Values match the backend's transaction_type filter
const TRANSACTION_TYPE_OPTIONS = [
    { label: "Bill", value: "bill" },
    { label: "Payment", value: "payment" },
    { label: "Opening Balance", value: "opening_balance" },
    { label: "Manual Entry", value: "manual" },
    { label: "Credit Note", value: "credit_note" },
    { label: "Debit Note", value: "debit_note" },
];

const STATUS_OPTIONS = [
    { label: "Open", value: "open" },
    { label: "Partial", value: "partial" },
    { label: "Settled", value: "settled" },
    { label: "Cancelled", value: "cancelled" },
];

const VendorLedger = () => {
    const dispatch = useDispatch();

    // Errors are shown by the global error handler
    const { list, pagination, loading } = useSelector(
        (state) => state.vendorLedger
    );

    // Filters
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [vendor, setVendor] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [status, setStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // ---- Search debounce (also resets to page 1) ----

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search.trim());
            setCurrentPage(1);
        }, 300);

        return () => clearTimeout(handler);
    }, [search]);

    // ---- Fetch (server-side filtering + pagination) ----

    useEffect(() => {
        dispatch(
            getVendorLedgers({
                page: currentPage,
                pageSize: ROWS_PER_PAGE,
                search: debouncedSearch,
                vendor,
                transaction_type: transactionType,
                status,
                date_from: startDate,
                date_to: endDate,
            })
        );
    }, [
        dispatch,
        currentPage,
        debouncedSearch,
        vendor,
        transactionType,
        status,
        startDate,
        endDate,
    ]);

    // Keep the page valid if the number of pages shrinks
    useEffect(() => {
        if (pagination.totalPages && currentPage > pagination.totalPages) {
            setCurrentPage(pagination.totalPages);
        }
    }, [pagination.totalPages, currentPage]);

    // ---- Handlers (each resets to page 1) ----

    const handleVendorChange = (value) => {
        setVendor(value);
        setCurrentPage(1);
    };
    const handleTransactionTypeChange = (value) => {
        setTransactionType(value);
        setCurrentPage(1);
    };
    const handleStatusChange = (value) => {
        setStatus(value);
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

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > (pagination.totalPages || 1)) return;
        setCurrentPage(newPage);
    };

    // ---- Columns ----

    const columns = useMemo(
        () => getVendorLedgerColumns({ page: currentPage, pageSize: ROWS_PER_PAGE }),
        [currentPage]
    );

    // ---- Total row (debit / credit / balance of the rows on this page) ----

    const totalRow = useMemo(() => {
        const debit = list.reduce((sum, r) => sum + Number(r.debit_amount || 0), 0);
        const credit = list.reduce((sum, r) => sum + Number(r.credit_amount || 0), 0);

        return {
            debit: formatAmount(debit),
            credit: formatAmount(credit),
            // Net balance = debit - credit. Flip to (credit - debit) if you
            // want the payable (amount owed to the vendor) shown as positive.
            balance: formatAmount(debit - credit),
        };
    }, [list]);

    // ---- Stats ----
    // The list API doesn't return payables / purchases / payments totals yet,
    // so those three stay at 0.00 until the backend adds them.

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
            count: pagination.totalItems ?? 0,
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
                onSearch={setSearch}
                showSearch
                searchPlaceholder="Search Vendor / Reference / Description"
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
                    {
                        key: "status",
                        value: status,
                        onChange: handleStatusChange,
                        options: STATUS_OPTIONS,
                        placeholder: "All Status",
                    },
                ]}
            />

            {/* Table */}
            <ReusableTable
                autoLayout
                columns={columns}
                data={list}
                loading={loading}
                totalRow={list.length > 0 ? totalRow : undefined}
                totalRowLabel="TOTAL"
            />

            {/* Pagination */}
            <ReusablePagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                totalRecords={pagination.totalItems}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default VendorLedger;