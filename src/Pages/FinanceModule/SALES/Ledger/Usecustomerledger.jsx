import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getLedgerEntries,
    clearLedgerError,
} from "../../../../Redux/finance/Sales/Customerledgerslice";

// Reuse the existing customers slice (adjust path/filename to match yours)
import {
    getCustomers,
    selectCustomers,
} from "../../../../Redux/finance/Sales/customerSlice";

import {
    getCustomerLedgerColumns,
    customerLedgerStats,
} from "./Columns";

const ROWS_PER_PAGE = 10;
const SUMMARY_ROWS_PER_PAGE = 10;
const SEARCH_DEBOUNCE_MS = 400;

// Keep this in one place so the dropdown, the summary table and any
// other consumer all read the customer name the same way.
// Keep only the field your API actually returns.
const getCustomerName = (c) =>
    c?.name || c?.customer_name || c?.company_name || "";

const useCustomerLedger = () => {
    
    const dispatch = useDispatch();
    const {
        entries = [],
        totalItems = 0,
        loading = false,
        error = null,
    } = useSelector((state) => state.customerLedger) || {};
console.log("customers from store:", customers);

    // All customers (from the existing customer slice)
    const customers = useSelector(selectCustomers);

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

    // Local-only entries added via the modal (not persisted, purely for
    // immediate feedback in the table).
    const [localEntries, setLocalEntries] = useState([]);

    // Ledger pagination
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(totalItems / ROWS_PER_PAGE) || 1;

    // Summary-by-customer state
    const [customerSummarySearch, setCustomerSummarySearch] = useState("");
    const [customerSummaryCurrentPage, setCustomerSummaryCurrentPage] =
        useState(1);

    // ---- Load ALL customers once (for the dropdown + summary table) ----

    useEffect(() => {
        dispatch(getCustomers({ page_size: 1000 }));
    }, [dispatch]);

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
                customer: customer || undefined, // confirm param name: customer / customer_id
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
        customer,
        transactionType,
        startDate,
        endDate,
        currentPage,
    ]);

    // Clear any stale error when the page unmounts.
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

    // Local-only until a create endpoint exists.
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
        // Not sent to the API yet.
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

    const ledgerColumns = useMemo(() => getCustomerLedgerColumns(), []);

    // Real customer names for the "All Customers" dropdown
    const customerOptions = useMemo(
        () =>
            customers
                .map((c) => ({
                    label: getCustomerName(c),
                    value: c.id,
                }))
                .filter((opt) => opt.label),
        [customers]
    );

    // ---- Summary by Customer (built from the customer list) ----
    // Client-side search + pagination. Add balance/debit/credit columns
    // here once you have a summary endpoint that returns them.

    const filteredCustomerSummary = useMemo(() => {
        const term = customerSummarySearch.trim().toLowerCase();

        return customers
            .map((c) => ({
                id: c.id,
                customer_name: getCustomerName(c),
                email: c.email || "-",
                phone: c.phone || c.mobile || "-",
            }))
            .filter(
                (row) =>
                    !term || row.customer_name.toLowerCase().includes(term)
            );
    }, [customers, customerSummarySearch]);

    const customerSummaryTotalItems = filteredCustomerSummary.length;
    const customerSummaryTotalPages =
        Math.ceil(customerSummaryTotalItems / SUMMARY_ROWS_PER_PAGE) || 1;

    const customerSummaryData = useMemo(() => {
        const start = (customerSummaryCurrentPage - 1) * SUMMARY_ROWS_PER_PAGE;
        return filteredCustomerSummary.slice(
            start,
            start + SUMMARY_ROWS_PER_PAGE
        );
    }, [filteredCustomerSummary, customerSummaryCurrentPage]);

    // NOTE: match this shape to whatever ReusableTable expects
    // (same format as getCustomerLedgerColumns in ./Columns).
    const customerSummaryColumns = useMemo(
        () => [
            { key: "customer_name", label: "Customer" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
        ],
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

    return {
        // filter state
        search,
        status,
        transactionType,
        customer,
        startDate,
        endDate,

        // modal state
        isLedgerModalOpen,

        // ledger pagination
        currentPage,
        totalPages,
        setCurrentPage,

        // ledger data
        ledgerData,
        paginatedData: ledgerData,
        ledgerColumns,
        totalItems,
        cards,
        loading,
        error,

        // options
        statusOptions,
        transactionTypeOptions,
        customerOptions,

        // customer summary
        customerSummarySearch,
        handleCustomerSummarySearch,
        customerSummaryData,
        customerSummaryColumns,
        customerSummaryCurrentPage,
        customerSummaryTotalPages,
        customerSummaryTotalItems,
        setCustomerSummaryCurrentPage,

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