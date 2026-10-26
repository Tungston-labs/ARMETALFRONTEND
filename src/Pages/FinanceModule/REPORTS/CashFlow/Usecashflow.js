import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getCashFlowReport,
    clearCashFlowReportError,
} from "../../../../Redux/finance/reports/Cashflowreportslice";

const ROWS_PER_PAGE = 10;

const getErrorMessage = (error) =>
    typeof error === "string"
        ? error
        : error?.detail || error?.message || "Failed to load cash flow report";

// Flattens sections + totals into the row list the table renders
const buildCashFlowRows = (sections, totals) => {
    const rows = [];

    [sections.operating, sections.investing, sections.financing].forEach(
        (section) => {
            rows.push({
                type: "section",
                particular: section.label.toUpperCase(),
            });

            section.rows.forEach((row) =>
                rows.push({
                    key: `${section.label}-${row.id}`,
                    particular: row.particular,
                    cashIn: row.cashIn,
                    cashOut: row.cashOut,
                    netAmount: row.netAmount,
                })
            );

            rows.push({
                type: "total",
                particular: `Net Cash from ${section.label}`,
                cashIn: section.cashIn,
                cashOut: section.cashOut,
                netAmount: section.netAmount,
            });
        }
    );

    rows.push({
        type: "total",
        particular: "Net Cash Flow",
        cashIn: totals.cashIn,
        cashOut: totals.cashOut,
        netAmount: totals.netCashFlow,
    });

    return rows;
};

const downloadCsv = ({ rows, summary, currency }) => {
    const header = [
        "Particular",
        `Cash In (${currency})`,
        `Cash Out (${currency})`,
        `Net Amount (${currency})`,
    ];

    const body = rows.map((item) =>
        item.type === "section"
            ? [item.particular, "", "", ""]
            : [item.particular, item.cashIn, item.cashOut, item.netAmount]
    );

    body.push(["Opening Cash Balance", "", "", summary.openingBalance]);
    body.push(["Closing Cash Balance", "", "", summary.closingBalance]);

    const csv = [header, ...body]
        .map((row) =>
            row
                .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
                .join(",")
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cash-flow-statement.csv";
    link.click();
    URL.revokeObjectURL(url);
};

const useCashFlow = () => {
    const dispatch = useDispatch();

    const { summary, sections, totals, currency, loading, error } = useSelector(
        (state) => state.cashFlowReport
    );

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    // Fetch report whenever the date range changes
    useEffect(() => {
        const params = {};
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;

        const request = dispatch(getCashFlowReport(params));
        return () => request.abort();
    }, [dispatch, dateFrom, dateTo]);

    const cashFlowData = useMemo(
        () => buildCashFlowRows(sections, totals),
        [sections, totals]
    );

    const filteredData = useMemo(
        () =>
            cashFlowData.filter((item) =>
                item.particular.toLowerCase().includes(search.toLowerCase())
            ),
        [cashFlowData, search]
    );

    const totalPages = Math.max(
        1,
        Math.ceil(filteredData.length / ROWS_PER_PAGE)
    );

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * ROWS_PER_PAGE;
        return filteredData.slice(start, start + ROWS_PER_PAGE);
    }, [filteredData, currentPage]);

    // Keep current page in range when the filtered list shrinks
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [currentPage, totalPages]);

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleDateFromChange = (e) => {
        setDateFrom(e.target.value);
        setCurrentPage(1);
        if (error) dispatch(clearCashFlowReportError());
    };

    const handleDateToChange = (e) => {
        setDateTo(e.target.value);
        setCurrentPage(1);
        if (error) dispatch(clearCashFlowReportError());
    };

    const handleExport = () =>
        downloadCsv({ rows: cashFlowData, summary, currency });

    return {
        summary,
        currency,
        loading,
        error,
        errorMessage: error ? getErrorMessage(error) : "",
        search,
        dateFrom,
        dateTo,
        currentPage,
        totalPages,
        totalRecords: filteredData.length,
        rows: paginatedData,
        handleSearch,
        handleDateFromChange,
        handleDateToChange,
        handleExport,
        setCurrentPage,
    };
};

export default useCashFlow