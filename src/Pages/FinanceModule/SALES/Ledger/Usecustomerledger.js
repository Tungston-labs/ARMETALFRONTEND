import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getLedgerEntries,
    getDashboardSummary,
    getCustomerWiseSummary,
    addLedgerEntry,
    clearLedgerError,
    clearLedgerMessage,
} from "../../../../Redux/finance/Sales/Customerledgerslice";

import {
    getCustomers,
    selectCustomers,
} from "../../../../Redux/finance/Sales/CustomerSlice";

import {
    getCustomerLedgerColumns,
    getCustomerSummaryColumns,
    dashboardSummaryStats,
} from "./Columns";

const ROWS_PER_PAGE = 10;
const SUMMARY_ROWS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 400;

// Reads the customer name from whichever field your API returns.
// Once you confirm the real field, keep just that one.
const getCustomerName = (c) =>
    c?.name || c?.customer_name || c?.company_name || "";

const useCustomerLedger = () => {
    const dispatch = useDispatch();

    const {
        entries = [],
        totalItems = 0,
        loading = false,
        createLoading = false,
        error = null,

        dashboardSummary = null,
        dashboardSummaryLoading = false,

        customerWiseSummary = [],
        customerWiseSummaryTotalItems = 0,
        customerWiseSummaryLoading = false,
    } = useSelector((state) => state.customerLedger) || {};

    // ALL CUSTOMERS (for the "All Customers" filter)
    const customers = useSelector(selectCustomers);

    // FILTERS (TABLE 1)
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [status, setStatus] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [customer, setCustomer] = useState("");

    // CUSTOMER SUMMARY (TABLE 2 — server-side)
    const [customerSummarySearch, setCustomerSummarySearch] = useState("");
    const [debouncedSummarySearch, setDebouncedSummarySearch] = useState("");
    const [customerSummaryCurrentPage, setCustomerSummaryCurrentPage] =
        useState(1);

    // DATE RANGE
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // MODAL
    const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);

    // PAGINATION (TABLE 1)
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(totalItems / ROWS_PER_PAGE) || 1;

    // ---- Fetch helpers (reused after creating an entry) ----

    const fetchLedger = useCallback(() => {
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

    const fetchDashboard = useCallback(() => {
        dispatch(
            getDashboardSummary({
                from_date: startDate || undefined,
                to_date: endDate || undefined,
            })
        );
    }, [dispatch, startDate, endDate]);

    const fetchCustomerSummary = useCallback(() => {
        dispatch(
            getCustomerWiseSummary({
                search: debouncedSummarySearch || undefined,
                from_date: startDate || undefined,
                to_date: endDate || undefined,
                page: customerSummaryCurrentPage,
                page_size: SUMMARY_ROWS_PER_PAGE,
            })
        );
    }, [
        dispatch,
        debouncedSummarySearch,
        startDate,
        endDate,
        customerSummaryCurrentPage,
    ]);

    // ---- Effects ----

    // All customers, once (for the dropdown)
    useEffect(() => {
        dispatch(getCustomers({ page_size: 1000 }));
    }, [dispatch]);

    // Debounce — table 1 search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1);
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [search]);

    // Debounce — table 2 search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSummarySearch(customerSummarySearch);
            setCustomerSummaryCurrentPage(1);
        }, SEARCH_DEBOUNCE_MS);
        return () => clearTimeout(timer);
    }, [customerSummarySearch]);

    // Table 1
    useEffect(() => {
        fetchLedger();
    }, [fetchLedger]);

    // Stat cards
    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    // Table 2
    useEffect(() => {
        fetchCustomerSummary();
    }, [fetchCustomerSummary]);

    // Clear error/message on unmount
    useEffect(() => {
        return () => {
            dispatch(clearLedgerError());
            dispatch(clearLedgerMessage());
        };
    }, [dispatch]);

    // ---- Handlers ----

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
        setCurrentPage(1);
        setCustomerSummaryCurrentPage(1);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
        setCurrentPage(1);
        setCustomerSummaryCurrentPage(1);
    };

    const handleAddLedger = () => setIsLedgerModalOpen(true);
    const handleCloseLedger = () => setIsLedgerModalOpen(false);

    // POST /finance/ledger/
    // newLedger must be: { customer, transaction_date, reference_number,
    //                      description, mode: "debit" | "credit", amount }
    const handleSaveLedger = async (newLedger) => {
        const result = await dispatch(addLedgerEntry(newLedger));

        if (addLedgerEntry.fulfilled.match(result)) {
            setIsLedgerModalOpen(false);

            // Jump to page 1 (the effect refetches if the page changed),
            // and explicitly refresh everything else.
            if (currentPage !== 1) {
                setCurrentPage(1);
            } else {
                fetchLedger();
            }
            fetchDashboard();
            fetchCustomerSummary();
        }
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
    };

    // ---- Derived data ----

    const ledgerData = entries;
    const ledgerColumns = useMemo(() => getCustomerLedgerColumns(), []);

    const cards = useMemo(
        () => dashboardSummaryStats(dashboardSummary || {}),
        [dashboardSummary]
    );

    // Summary by Customer — now straight from /finance/ledger/customer-summary/
    const customerSummaryData = customerWiseSummary;
    const customerSummaryTotalItems = customerWiseSummaryTotalItems;
    const customerSummaryTotalPages =
        Math.ceil(customerSummaryTotalItems / SUMMARY_ROWS_PER_PAGE) || 1;

    const customerSummaryColumns = useMemo(
        () => getCustomerSummaryColumns(),
        []
    );

    // Filter options
    const statusOptions = ["Paid", "Pending", "Partially Paid", "Overdue"];

    const transactionTypeOptions = [
        { label: "Opening Balance", value: "opening_balance" },
        { label: "Invoice", value: "invoice" },
        { label: "Payment", value: "payment" },
        { label: "Credit Note", value: "credit_note" },
        { label: "Debit Note", value: "debit_note" },
        { label: "Adjustment", value: "adjustment" },
    ];

    // Real customers for the "All Customers" filter (value = customer id)
    const customerOptions = useMemo(
        () =>
            (customers || []).map((c) => ({
                label: getCustomerName(c) || `Customer #${c.id}`,
                value: c.id,
            })),
        [customers]
    );

    return {
        search,
        status,
        transactionType,
        customer,
        startDate,
        endDate,

        customerSummarySearch,
        isLedgerModalOpen,

        currentPage,
        totalPages,
        totalItems,
        setCurrentPage,

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
        createLoading,
        dashboardSummaryLoading,
        customerSummaryLoading: customerWiseSummaryLoading,
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

        handleCustomerSummarySearch,
    };
};

export default useCustomerLedger;