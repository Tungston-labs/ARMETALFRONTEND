// Userecievables.js  -> ALL functionality (redux, state, API calls, handlers)

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getReceivables } from "../../../../Redux/finance/accounts/Receivableslice";

const ROWS_PER_PAGE = 10;

// Labels shown in the status filter. Add more if your backend has other statuses.
const STATUS_LABELS = ["Paid", "Partially Paid", "Overdue"];

// "Partially Paid" -> "partially_paid" (value the API expects)
const toApiStatus = (label) => {
    if (!label || label.toLowerCase() === "all") return "";
    return label.toLowerCase().trim().replace(/\s+/g, "_");
};

const getErrorMessage = (error) =>
    typeof error === "string"
        ? error
        : error?.detail || error?.message || (error ? "Something went wrong" : "");

const useRecievables = () => {
    const dispatch = useDispatch();

    const {
        receivables,
        dashboard,
        pagination,
        loading,
        error,
    } = useSelector((state) => state.receivable);

    // ---------------- filters ----------------
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [customer, setCustomer] = useState("all");
    const [status, setStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // known customers (id -> name), collected from loaded invoices so the
    // dropdown keeps its options after a customer is selected
    const [customerMap, setCustomerMap] = useState({});

    // debounce search; page is reset together so only one request goes out
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search.trim());
            setCurrentPage(1);
        }, 400);
        return () => clearTimeout(t);
    }, [search]);

    // ---------------- API call ----------------
    useEffect(() => {
        const params = {
            page: currentPage,
            page_size: ROWS_PER_PAGE,
        };

        const apiStatus = toApiStatus(status);

        if (debouncedSearch) params.search = debouncedSearch;
        if (apiStatus) params.status = apiStatus;
        if (customer !== "all") params.customer_id = customer;
        if (startDate) params.date_from = startDate;
        if (endDate) params.date_to = endDate;

        dispatch(getReceivables(params));
    }, [dispatch, currentPage, debouncedSearch, status, customer, startDate, endDate]);

    // ---------------- customer dropdown ----------------
    useEffect(() => {
        if (!receivables.length) return;

        setCustomerMap((prev) => {
            const next = { ...prev };
            receivables.forEach((r) => {
                next[r.customer_id] = r.customer_name;
            });
            return next;
        });
    }, [receivables]);

    const customerOptions = useMemo(
        () => [
            { label: "All Customers", value: "all" },
            ...Object.entries(customerMap).map(([id, name]) => ({
                label: name,
                value: id,
            })),
        ],
        [customerMap]
    );

    // ---------------- handlers ----------------
    // Every filter change also resets to page 1 in the same update
    const handleSearchChange = (e) =>
        setSearch(e?.target ? e.target.value : e);

    const handleCustomerChange = (value) => {
        setCustomer(value || "all");
        setCurrentPage(1);
    };

    const handleStatusChange = (value) => {
        setStatus(value || "");
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

    const handleExportExcel = () => {
        console.log("Export Receivables to Excel");
    };

    return {
        // data
        receivables,
        dashboard,
        customerOptions,
        statuses: STATUS_LABELS,
        totalPages: pagination.totalPages,
        loading,
        errorMessage: getErrorMessage(error),

        // filter values
        search,
        customer,
        status,
        startDate,
        endDate,
        currentPage,

        // handlers
        handleSearchChange,
        handleCustomerChange,
        handleStatusChange,
        handleStartDateChange,
        handleEndDateChange,
        handleExportExcel,
        setCurrentPage,
    };
};

export default useRecievables;