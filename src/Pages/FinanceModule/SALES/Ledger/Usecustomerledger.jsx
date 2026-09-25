import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getLedgerEntries,
    clearLedgerError,
} from "../../../../Redux/finance/Sales/Customerledgerslice";

import {
    getCustomerLedgerColumns,
    customerLedgerStats,
} from "./Columns";

const ROWS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 400;
const useCustomerLedger = () => {
    const dispatch = useDispatch();

    const {
        entries = [],
        totalItems = 0,
        loading = false,
        error = null,
    } = useSelector((state) => state.customerLedger) || {};

    // Filters
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [status, setStatus] = useState("");
    const [transactionType, setTransactionType] = useState("");
    const [customer, setCustomer] = useState("");

    // Date range
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Modal
    const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);

    // Local-only entries added via the modal (see note 3 above — not
    // persisted, purely for immediate feedback in the table).
    const [localEntries, setLocalEntries] = useState([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages =
        Math.ceil(totalItems / ROWS_PER_PAGE) || 1;

    // ---- Debounce the search box before it hits the API ----

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1);
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [search]);

    // ---- Fetch ledger entries whenever a server-side filter changes ----

    useEffect(() => {
        dispatch(
            getLedgerEntries({
                search: debouncedSearch || undefined,
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
        transactionType,
        startDate,
        endDate,
        currentPage,
    ]);

    // Clear any stale error once the filters change and a new request
    // has gone out.
    useEffect(() => {
        return () => {
            dispatch(clearLedgerError());
        };
    }, [dispatch]);

    // ---- Handlers ----

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
        setCurrentPage(1);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
        setCurrentPage(1);
    };

    const handleAddLedger = () => {
        setIsLedgerModalOpen(true);
    };

    const handleCloseLedger = () => {
        setIsLedgerModalOpen(false);
    };

    // See note 3 — this is local-only until a create endpoint exists.
    const handleSaveLedger = (newLedger) => {
        const newEntry = {
            ...newLedger,
            id: `local-${Date.now()}`,
        };

        setLocalEntries((prev) => [newEntry, ...prev]);

        setIsLedgerModalOpen(false);
        setCurrentPage(1);
    };

    const handleSearch = (value) => {
        setSearch(value);
    };

    const handleStatusChange = (value) => {
        // Not sent to the API — see note 1.
        setStatus(value);
        setCurrentPage(1);
    };

    const handleTransactionTypeChange = (value) => {
        setTransactionType(value);
        setCurrentPage(1);
    };

    const handleCustomerChange = (value) => {
        // Not sent to the API yet — see note 2.
        setCustomer(value);
        setCurrentPage(1);
    };

    // ---- Derived data ----

    const ledgerData = useMemo(
        () => [...localEntries, ...(entries || [])],
        [localEntries, entries]
    );
    const cards = useMemo(() => {
        const totalDebit = entries.reduce(
            (sum, row) => sum + Number(row.debit || 0),
            0
        );

        const totalCredit = entries.reduce(
            (sum, row) => sum + Number(row.credit || 0),
            0
        );

        return customerLedgerStats({
            total_debit: totalDebit,
            total_credit: totalCredit,
            closing_balance: totalDebit - totalCredit,
            entry_count: entries.length,
        });
    }, [entries]);

    const ledgerColumns = useMemo(
        () => getCustomerLedgerColumns(),
        []
    );

    const statusOptions = ["Paid", "Pending", "Partially Paid", "Overdue"];
    const transactionTypeOptions = [
        { label: "Opening Balance", value: "opening_balance" },
        { label: "Invoice", value: "invoice" },
        { label: "Payment", value: "payment" },
        { label: "Credit Note", value: "credit_note" },
        { label: "Debit Note", value: "debit_note" },
        { label: "Adjustment", value: "adjustment" },
    ];

    // Placeholder until a real customer-lookup endpoint is wired up
    // (see note 2).
    const customerOptions = [
        { label: "ABC Trading", value: "ABC Trading" },
        { label: "Riyadh Tech", value: "Riyadh Tech" },
        { label: "Al Noor Company", value: "Al Noor Company" },
        { label: "Saudi Solutions", value: "Saudi Solutions" },
    ];

    return {
        // filter state + setters
        search,
        status,
        transactionType,
        customer,
        startDate,
        endDate,

        // modal state
        isLedgerModalOpen,

        // pagination
        currentPage,
        totalPages,
        setCurrentPage,

        // data
        ledgerData,
        paginatedData: ledgerData,
        ledgerColumns,
        totalItems,
        cards,
        loading,
        error,

        // static options
        statusOptions,
        transactionTypeOptions,
        customerOptions,

        // handlers
        handleStartDateChange,
        handleEndDateChange,
        handleAddLedger,
        handleCloseLedger,
        handleSaveLedger,
        handleSearch,
        handleStatusChange,
        handleTransactionTypeChange,
        handleCustomerChange,
    };
};

export default useCustomerLedger;