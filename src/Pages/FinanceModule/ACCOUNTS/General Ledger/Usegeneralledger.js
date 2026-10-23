// Usegeneralledger.js  -> ALL functionality (redux, state, API calls, handlers)

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getLedgerEntries,
    getDashboardSummary,
    getCustomerWiseSummary,
} from "../../../../Redux/finance/accounts/Ledgerslice";

const ROWS_PER_PAGE = 10;

// Query-param names sent to the backend. Change here if your API uses different names.
const ACCOUNT_PARAM = "customer_code";
const SOURCE_PARAM = "source";

const getErrorMessage = (error) =>
    typeof error === "string"
        ? error
        : error?.detail || error?.message || (error ? "Something went wrong" : "");

const useGeneralLedger = () => {
    const dispatch = useDispatch();

    const {
        ledgerEntries,
        ledgerPagination,
        dashboardSummary,
        customerSummaries,
        loading,
        error,
    } = useSelector((state) => state.ledger);

    // ---------------- filters ----------------
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [account, setAccount] = useState("all");
    const [type, setType] = useState("all");
    const [source, setSource] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // debounce search so we don't hit the API on every keystroke;
    // page is reset together with the debounced value so only one request goes out
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search.trim());
            setCurrentPage(1);
        }, 400);
        return () => clearTimeout(t);
    }, [search]);

    // ---------------- API calls ----------------
    useEffect(() => {
        dispatch(getDashboardSummary());
        // customer list used to fill the "All Accounts" dropdown
        dispatch(getCustomerWiseSummary({ page: 1, page_size: 100 }));
    }, [dispatch]);

    useEffect(() => {
        const params = {
            page: currentPage,
            page_size: ROWS_PER_PAGE,
        };

        if (debouncedSearch) params.search = debouncedSearch;
        if (account !== "all") params[ACCOUNT_PARAM] = account;
        if (type !== "all") params.transaction_type = type;
        if (source !== "all") params[SOURCE_PARAM] = source;
        if (startDate) params.from_date = startDate;
        if (endDate) params.to_date = endDate;

        dispatch(getLedgerEntries(params));
    }, [dispatch, currentPage, debouncedSearch, account, type, source, startDate, endDate]);

    // ---------------- dropdown options ----------------
    const accountOptions = useMemo(
        () =>
            customerSummaries.map((c) => ({
                label: `${c.customer_name} (${c.customer_code})`,
                value: c.customer_code,
            })),
        [customerSummaries]
    );

    // ---------------- handlers ----------------
    // Every filter change also resets to page 1 in the same update
    const handleSearchChange = (e) =>
        setSearch(e?.target ? e.target.value : e);

    const handleAccountChange = (value) => {
        setAccount(value || "all");
        setCurrentPage(1);
    };

    const handleTypeChange = (value) => {
        setType(value || "all");
        setCurrentPage(1);
    };

    const handleSourceChange = (value) => {
        setSource(value || "all");
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
        console.log("Export General Ledger to Excel");
    };

    const handleExportPDF = () => {
        console.log("Export General Ledger to PDF");
    };

    return {
        // data
        ledgerEntries,
        dashboardSummary,
        accountOptions,
        totalPages: ledgerPagination.totalPages,
        isInitialLoading: loading && ledgerEntries.length === 0,
        errorMessage: getErrorMessage(error),

        // filter values
        search,
        account,
        type,
        source,
        startDate,
        endDate,
        currentPage,

        // handlers
        handleSearchChange,
        handleAccountChange,
        handleTypeChange,
        handleSourceChange,
        handleStartDateChange,
        handleEndDateChange,
        handleExportExcel,
        handleExportPDF,
        setCurrentPage,
    };
};

export default useGeneralLedger;