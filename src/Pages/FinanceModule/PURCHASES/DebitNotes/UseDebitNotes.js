import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import { useNavigate } from "react-router-dom";

import {
    getDebitNotes,
    getDebitNoteKpi,
    removeDebitNote,
    exportDebitNoteList,
    clearDebitNoteError,
    clearDebitNoteMessage,
} from "../../../../Redux/finance/purchases/debitNoteSlice";

import {
    getDebitNoteColumns,
    debitNoteStats,
} from "./DebitNoteStats";

const ROWS_PER_PAGE = 10;

const SEARCH_DEBOUNCE_MS = 400;

const ADD_ROUTE = "/purchases/debit-notes/add";

/* =========================================================
   OPTIONS
========================================================= */

const STATUS_OPTIONS = [
    "Issued",
    "Pending",
    "Cancelled",
];

const REASON_OPTIONS = [
    {
        label: "Damaged Goods",
        value: "damaged_goods",
    },
    {
        label: "Short Delivery",
        value: "short_delivery",
    },
    {
        label: "Purchase Return",
        value: "purchase_return",
    },
    {
        label: "Billing Error",
        value: "billing_error",
    },
];

/* =========================================================
   ERROR
========================================================= */

const formatError = (error) => {
    if (!error) {
        return "";
    }

    if (typeof error === "string") {
        return error;
    }

    if (error.detail) {
        return error.detail;
    }

    return Object.entries(error)
        .map(([field, message]) => {
            return `${field}: ${
                Array.isArray(message)
                    ? message.join(", ")
                    : message
            }`;
        })
        .join(" | ");
};

/* =========================================================
   DOWNLOAD
========================================================= */

const downloadBlob = (blob) => {
    if (!(blob instanceof Blob)) {
        return;
    }

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "debit-notes.xlsx";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);
};

/* =========================================================
   HOOK
========================================================= */

const useDebitNotes = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const {
        debitNotes = [],
        totalItems = 0,
        loading = false,
        kpi = {},
        kpiLoading = false,
        error = null,
        deleting = false,
        exporting = false,
    } = useSelector(
        (state) => state.debitNote || {}
    );

    /* =====================================================
       FILTERS
    ===================================================== */

    const [search, setSearch] = useState("");

    const [debouncedSearch, setDebouncedSearch] =
        useState("");

    const [reason, setReason] = useState("");

    const [status, setStatus] = useState("");

    const [startDate, setStartDate] = useState("");

    const [endDate, setEndDate] = useState("");

    /* =====================================================
       PAGINATION
    ===================================================== */

    const [currentPage, setCurrentPage] =
        useState(1);

    const totalPages =
        Math.ceil(
            totalItems / ROWS_PER_PAGE
        ) || 1;

    /* =====================================================
       FETCH LIST
    ===================================================== */

    const fetchList = useCallback(() => {
        dispatch(
            getDebitNotes({
                search:
                    debouncedSearch ||
                    undefined,

                reason:
                    reason ||
                    undefined,

                status:
                    status ||
                    undefined,

                issue_date_after:
                    startDate ||
                    undefined,

                issue_date_before:
                    endDate ||
                    undefined,

                page: currentPage,

                page_size: ROWS_PER_PAGE,
            })
        );
    }, [
        dispatch,
        debouncedSearch,
        reason,
        status,
        startDate,
        endDate,
        currentPage,
    ]);

    /* =====================================================
       FETCH KPI
    ===================================================== */

    const fetchKpi = useCallback(() => {
        dispatch(
            getDebitNoteKpi({
                issue_date_after:
                    startDate ||
                    undefined,

                issue_date_before:
                    endDate ||
                    undefined,
            })
        );
    }, [
        dispatch,
        startDate,
        endDate,
    ]);

    /* =====================================================
       SEARCH DEBOUNCE
    ===================================================== */

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);

            setCurrentPage(1);
        }, SEARCH_DEBOUNCE_MS);

        return () =>
            clearTimeout(timer);
    }, [search]);

    /* =====================================================
       LIST
    ===================================================== */

    useEffect(() => {
        fetchList();
    }, [fetchList]);

    /* =====================================================
       KPI
    ===================================================== */

    useEffect(() => {
        fetchKpi();
    }, [fetchKpi]);

    /* =====================================================
       CLEANUP
    ===================================================== */

    useEffect(() => {
        return () => {
            dispatch(clearDebitNoteError());

            dispatch(clearDebitNoteMessage());
        };
    }, [dispatch]);

    /* =====================================================
       HANDLERS
    ===================================================== */

    const handleSearch = (value) => {
        setSearch(value);
    };

    const handleReasonChange = (value) => {
        setReason(value);

        setCurrentPage(1);
    };

    const handleStatusChange = (value) => {
        setStatus(value);

        setCurrentPage(1);
    };

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);

        setCurrentPage(1);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);

        setCurrentPage(1);
    };

    /* =====================================================
       ADD
    ===================================================== */

    const handleAddDebitNote = () => {
        dispatch(clearDebitNoteError());

        navigate(ADD_ROUTE);
    };

    /* =====================================================
       DELETE
    ===================================================== */

    const handleDeleteDebitNote = useCallback(
        async (row) => {
            const result = await dispatch(
                removeDebitNote(row.id)
            );

            if (
                !removeDebitNote.fulfilled.match(
                    result
                )
            ) {
                return;
            }

            if (
                debitNotes.length === 1 &&
                currentPage > 1
            ) {
                setCurrentPage(
                    (page) => page - 1
                );
            } else {
                fetchList();
            }

            fetchKpi();
        },
        [
            dispatch,
            debitNotes.length,
            currentPage,
            fetchList,
            fetchKpi,
        ]
    );

    /* =====================================================
       DOWNLOAD
    ===================================================== */

    const handleDownload = useCallback(
        async (row) => {
            const result = await dispatch(
                exportDebitNoteList({
                    id: row.id,
                })
            );

            if (
                exportDebitNoteList.fulfilled.match(
                    result
                )
            ) {
                downloadBlob(result.payload);
            }
        },
        [dispatch]
    );

    /* =====================================================
       EXPORT CURRENT LIST
    ===================================================== */

    const handleExport = useCallback(
        async () => {
            const result = await dispatch(
                exportDebitNoteList({
                    search:
                        debouncedSearch ||
                        undefined,

                    reason:
                        reason ||
                        undefined,

                    status:
                        status ||
                        undefined,

                    issue_date_after:
                        startDate ||
                        undefined,

                    issue_date_before:
                        endDate ||
                        undefined,
                })
            );

            if (
                exportDebitNoteList.fulfilled.match(
                    result
                )
            ) {
                downloadBlob(result.payload);
            }
        },
        [
            dispatch,
            debouncedSearch,
            reason,
            status,
            startDate,
            endDate,
        ]
    );

    /* =====================================================
       CARDS
    ===================================================== */

    const cards = useMemo(
        () => debitNoteStats(kpi),
        [kpi]
    );

    /* =====================================================
       COLUMNS
    ===================================================== */

    const columns = useMemo(
        () =>
            getDebitNoteColumns({
                onDelete:
                    handleDeleteDebitNote,

                onDownload:
                    handleDownload,
            }),
        [
            handleDeleteDebitNote,
            handleDownload,
        ]
    );

    /* =====================================================
       RETURN
    ===================================================== */

    return {
        search,

        reason,

        status,

        startDate,

        endDate,

        currentPage,

        totalPages,

        totalItems,

        setCurrentPage,

        cards,

        columns,

        paginatedData: debitNotes,

        loading,

        kpiLoading,

        deleting,

        exporting,

        errorMessage:
            formatError(error),

        reasonOptions:
            REASON_OPTIONS,

        statusOptions:
            STATUS_OPTIONS,

        handleSearch,

        handleReasonChange,

        handleStatusChange,

        handleStartDateChange,

        handleEndDateChange,

        handleAddDebitNote,

        handleExport,
    };
};

export default useDebitNotes;