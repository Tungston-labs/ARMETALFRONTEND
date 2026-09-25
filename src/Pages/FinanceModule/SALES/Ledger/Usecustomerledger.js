import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getLedgerEntries,
    getDashboardSummary,
    clearLedgerError,
} from "../../../../Redux/finance/Sales/Customerledgerslice";

import {
    getCustomerLedgerColumns,
    getCustomerSummaryColumns,
    dashboardSummaryStats,
} from "./Columns";

const ROWS_PER_PAGE = 10;
const SUMMARY_ROWS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 400;

const useCustomerLedger = () => {
    const dispatch = useDispatch();

    const {
        entries = [],
        totalItems = 0,
        totalPages = 1,
        currentPage: backendCurrentPage = 1,
        loading = false,
        error = null,

        dashboardSummary = null,
        dashboardSummaryLoading = false,
    } = useSelector((state) => state.customerLedger) || {};

    // FILTERS (TABLE 1)
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [status, setStatus] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [customer, setCustomer] = useState("");

    // CUSTOMER SUMMARY SEARCH (TABLE 2 — client-side)
    const [customerSummarySearch, setCustomerSummarySearch] = useState("");
    const [customerSummaryCurrentPage, setCustomerSummaryCurrentPage] =
        useState(1);

    // DATE RANGE
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // MODAL
    const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);

    // PAGINATION (TABLE 1)
    const [currentPage, setCurrentPage] = useState(1);

    // DEBOUNCE — table 1 search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1);
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [search]);

    // FETCH — TABLE 1 (ledger entries)
    useEffect(() => {
        dispatch(
            getLedgerEntries({
                search: debouncedSearch || undefined,
                status: status || undefined,
                customer: customer || undefined,
                transaction_type: transactionType || undefined,
                from_date: startDate || undefined,
                to_date: endDate || undefined,
                ordering: "-transaction_date",
                page: currentPage,
                page_size: ROWS_PER_PAGE,
            })
        );
    }, [
        dispatch,
        debouncedSearch,
        status,
        customer,
        transactionType,
        startDate,
        endDate,
        currentPage,
    ]);

    // FETCH — DASHBOARD SUMMARY (stat cards), scoped to same date range
    useEffect(() => {
        dispatch(
            getDashboardSummary({
                from_date: startDate || undefined,
                to_date: endDate || undefined,
            })
        );
    }, [dispatch, startDate, endDate]);

    // CLEAR ERROR ON UNMOUNT
    useEffect(() => {
        return () => {
            dispatch(clearLedgerError());
        };
    }, [dispatch]);

    // HANDLERS
    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
        setCurrentPage(1);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
        setCurrentPage(1);
    };

    const handleAddLedger = () => setIsLedgerModalOpen(true);
    const handleCloseLedger = () => setIsLedgerModalOpen(false);

    // NOTE: no create/POST endpoint exists yet in Customerledgerservice.js
    const handleSaveLedger = (_newLedger) => {
        setIsLedgerModalOpen(false);
    };

    const handleSearch = (value) => setSearch(value);

    const handleStatusChange = (value) => {
        setStatus(value);
        setCurrentPage(1);
    };

    const handleTransactionTypeChange = (value) => {
        setTransactionType(value);
        setCurrentPage(1);
    };

    const handleCustomerChange = (value) => {
        setCustomer(value);
        setCurrentPage(1);
    };

    const handleCustomerSummarySearch = (value) => {
        setCustomerSummarySearch(value);
        setCustomerSummaryCurrentPage(1);
    };

    // LEDGER DATA (TABLE 1)
    const ledgerData = entries;
    const ledgerColumns = useMemo(() => getCustomerLedgerColumns(), []);

    // STAT CARDS — from the real dashboard-summary endpoint
    const cards = useMemo(
        () => dashboardSummaryStats(dashboardSummary || {}),
        [dashboardSummary]
    );

    // ==========================================================
    // TABLE 2 — "Summary by Customer"
    // LIMITATION: there is currently no backend endpoint that
    // returns a list of all customers' balances. This aggregates
    // only the entries currently loaded for Table 1 (one page's
    // worth), so it is NOT a true all-time, all-customer summary.
    // Replace this block once such an endpoint exists.
    // ==========================================================

    const customerSummary = useMemo(() => {
        const summaryMap = {};

        (entries || []).forEach((row) => {
            const customerId = row.customer;
            if (!customerId) return;

            if (!summaryMap[customerId]) {
                summaryMap[customerId] = {
                    customer: customerId,
                    customer_name: row.customer_name || "-",
                    customer_id_code: row.customer_id_code || "-",
                    total_debit: 0,
                    total_credit: 0,
                    balance: 0,
                };
            }

            summaryMap[customerId].total_debit += Number(row.debit || 0);
            summaryMap[customerId].total_credit += Number(row.credit || 0);
            summaryMap[customerId].balance =
                summaryMap[customerId].total_debit -
                summaryMap[customerId].total_credit;
        });

        let list = Object.values(summaryMap);

        if (customerSummarySearch.trim()) {
            const q = customerSummarySearch.toLowerCase().trim();
            list = list.filter((item) => {
                const name = item.customer_name?.toLowerCase() || "";
                const code = item.customer_id_code?.toLowerCase() || "";
                return name.includes(q) || code.includes(q);
            });
        }

        return list;
    }, [entries, customerSummarySearch]);

    const customerSummaryTotalItems = customerSummary.length;

    const customerSummaryTotalPages =
        Math.ceil(customerSummaryTotalItems / SUMMARY_ROWS_PER_PAGE) || 1;

    const customerSummaryData = useMemo(() => {
        const start =
            (customerSummaryCurrentPage - 1) * SUMMARY_ROWS_PER_PAGE;
        return customerSummary.slice(start, start + SUMMARY_ROWS_PER_PAGE);
    }, [customerSummary, customerSummaryCurrentPage]);

    const customerSummaryColumns = useMemo(
        () => getCustomerSummaryColumns(),
        []
    );

    // FILTER OPTIONS
    const statusOptions = ["Paid", "Pending", "Partially Paid", "Overdue"];

    const transactionTypeOptions = [
        { label: "Opening Balance", value: "opening_balance" },
        { label: "Invoice", value: "invoice" },
        { label: "Payment", value: "payment" },
        { label: "Credit Note", value: "credit_note" },
        { label: "Debit Note", value: "debit_note" },
        { label: "Adjustment", value: "adjustment" },
    ];

    const customerOptions = [
        { label: "ABC Trading", value: "ABC Trading" },
        { label: "Riyadh Tech", value: "Riyadh Tech" },
        { label: "Al Noor Company", value: "Al Noor Company" },
        { label: "Saudi Solutions", value: "Saudi Solutions" },
    ];

    return {
        search,
        status,
        transactionType,
        customer,
        startDate,
        endDate,

        customerSummarySearch,
        isLedgerModalOpen,

        currentPage: backendCurrentPage,
        totalPages,
        totalItems,

        ledgerData,
        ledgerColumns,

        customerSummaryData,
        customerSummaryColumns,
        customerSummaryCurrentPage,
        customerSummaryTotalPages,
        customerSummaryTotalItems,
        setCustomerSummaryCurrentPage,

        cards,

        loading,
        dashboardSummaryLoading,
        error,

        statusOptions,
        transactionTypeOptions,
        customerOptions,

        setCurrentPage,

        handleStartDateChange,
        handleEndDateChange,
        handleAddLedger,
        handleCloseLedger,
        handleSaveLedger,

        handleSearch,
        handleStatusChange,
        handleTransactionTypeChange,
        handleCustomerChange,

        handleCustomerSummarySearch,
    };
};

export default useCustomerLedger;