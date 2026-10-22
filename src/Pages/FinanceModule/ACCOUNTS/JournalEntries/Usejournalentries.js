// FUNCTIONALITY PAGE: all state, API calls and handlers for the Journal Entries list.
// No JSX in this file.

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Adjust this path to where your slice lives
import {
    getJournalEntries,
    getJournalEntryCounts,
    postJournalEntry,
    voidJournalEntry,
    removeJournalEntry,
} from "../../../../Redux/finance/accounts/Journalslice";

// Turns a string / DRF error object into one readable string
const getErrorText = (error) => {
    if (!error) return "";
    if (typeof error === "string") return error;
    if (error.detail) return error.detail;

    return Object.entries(error)
        .map(
            ([field, message]) =>
                `${field}: ${typeof message === "string" ? message : JSON.stringify(message)}`
        )
        .join(" | ");
};

const useJournalEntries = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        entries,
        pagination,
        loading,
        saving,
        error,
        counts,
        countsLoading,
    } = useSelector((state) => state.journalEntry);

    // ---------- Filters ----------

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [status, setStatus] = useState("");
    const [source, setSource] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Wait 400ms after typing before calling the API
    useEffect(() => {
        const id = setTimeout(() => {
            setDebouncedSearch(search.trim());
            setCurrentPage(1);
        }, 400);

        return () => clearTimeout(id);
    }, [search]);

    // Query params for the list API
    const params = useMemo(() => {
        const query = { page: currentPage };

        if (debouncedSearch) query.search = debouncedSearch;
        if (status) query.status = status.toLowerCase();
        if (source !== "all") query.source = source;
        if (startDate) query.date_from = startDate;
        if (endDate) query.date_to = endDate;

        return query;
    }, [currentPage, debouncedSearch, status, source, startDate, endDate]);

    // ---------- Data loading ----------

    useEffect(() => {
        dispatch(getJournalEntries(params));
    }, [dispatch, params]);

    // Stats cards (date range only, not search/status/source)
    const loadCounts = useCallback(() => {
        const base = {};
        if (startDate) base.date_from = startDate;
        if (endDate) base.date_to = endDate;

        dispatch(getJournalEntryCounts(base));
    }, [dispatch, startDate, endDate]);

    useEffect(() => {
        loadCounts();
    }, [loadCounts]);

    const refresh = () => {
        dispatch(getJournalEntries(params));
        loadCounts();
    };

    // ---------- Row actions ----------

    const runAction = async (thunk, confirmText) => {
        if (!window.confirm(confirmText)) return;

        try {
            await dispatch(thunk).unwrap();
            refresh(); // refetch so list + cards always match the backend
        } catch (err) {
            alert(getErrorText(err));
        }
    };

    const handlePost = (entry) =>
        runAction(postJournalEntry(entry.id), "Post this journal entry?");

    const handleVoid = (entry) =>
        runAction(voidJournalEntry(entry.id), "Void this posted journal entry?");

    const handleDelete = (entry) =>
        runAction(removeJournalEntry(entry.id), "Delete this draft entry?");

    // ---------- Filter handlers ----------

    const handleStatusChange = (value) => {
        setStatus(value || "");
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

    // ---------- Navigation / misc ----------

    const handleNewJournalEntry = () => {
        navigate("/accounts/journal-entries/add");
    };

    const handleImportJournal = () => {
        console.log("Import Journal Entries");
    };

    return {
        // data
        entries,
        pagination,
        counts,
        loading,
        countsLoading,
        saving,
        errorText: getErrorText(error),

        // filter values
        search,
        status,
        source,
        startDate,
        endDate,

        // filter setters / handlers
        setSearch,
        setCurrentPage,
        handleStatusChange,
        handleSourceChange,
        handleStartDateChange,
        handleEndDateChange,

        // actions
        handlePost,
        handleVoid,
        handleDelete,
        handleNewJournalEntry,
        handleImportJournal,
    };
};

export default useJournalEntries;