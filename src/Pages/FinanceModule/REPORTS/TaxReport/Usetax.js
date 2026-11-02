import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getTaxReport,
    clearTaxReportError,
} from "../../../../Redux/finance/reports/Taxreportslice";

const PAGE_SIZE = 10;

export const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

export const formatSar = (value) => `SAR ${formatAmount(value)}`;

export const labelFor = (options = [], value) =>
    options.find((o) => String(o.value) === String(value))?.label || value || "";

export const getErrorMessage = (error) => {
    if (typeof error === "string") return error;
    if (error?.detail) return error.detail;

    if (error && typeof error === "object") {
        const text = Object.values(error)
            .map((msg) => (Array.isArray(msg) ? msg.join(" ") : String(msg)))
            .join(" | ");
        if (text) return text;
    }

    return error?.message || "Failed to load tax report";
};

const CSV_FILE_NAME = "tax-report.csv";
const CSV_HEADER = [
    "Document No",
    "Date",
    "Type",
    "Customer / Vendor",
    "Taxable Amount",
    "Tax Amount",
    "Tax Type",
    "Status",
];

const escapeCsvCell = (cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`;

const useTax = () => {
    const dispatch = useDispatch();

    const { cards, filters, monthlyTax, report, pagination, loading, error } =
        useSelector((state) => state.taxReport);

    const [search, setSearch] = useState("");
    const [taxType, setTaxType] = useState("");
    const [customer, setCustomer] = useState("");
    const [vendor] = useState("");
    const [invoiceType, setInvoiceType] = useState("");
    const [taxStatus, setTaxStatus] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [chartYear, setChartYear] = useState(new Date().getFullYear());
    const [currentPage, setCurrentPage] = useState(1);

    const params = useMemo(
        () => ({
            start_date: dateFrom,
            end_date: dateTo,
            tax_type: taxType,
            invoice_type: invoiceType,
            customer,
            vendor,
            tax_status: taxStatus,
            chart_year: chartYear,
            page: currentPage,
            page_size: PAGE_SIZE,
        }),
        [
            dateFrom,
            dateTo,
            taxType,
            invoiceType,
            customer,
            vendor,
            taxStatus,
            chartYear,
            currentPage,
        ]
    );

    const loadReport = useCallback(() => {
        dispatch(getTaxReport(params))
            .unwrap()
            .catch(() => {

                if (params.page > 1) setCurrentPage(1);
            });
    }, [dispatch, params]);

    useEffect(() => {
        loadReport();
    }, [loadReport]);

    useEffect(() => () => dispatch(clearTaxReportError()), [dispatch]);

    const handleFilterChange = (setter) => (value) => {
        setter(value);
        setCurrentPage(1);
    };

    const handleDateFromChange = (e) => handleFilterChange(setDateFrom)(e.target.value);
    const handleDateToChange = (e) => handleFilterChange(setDateTo)(e.target.value);

    const handleExport = () => {
        if (!report.length) return;

        const rows = report.map((row) => [
            row.documentNumber,
            row.date,
            labelFor(filters.invoiceTypes, row.type),
            row.customerVendor,
            row.taxableAmount,
            row.taxAmount,
            row.taxType,
            labelFor(filters.taxStatuses, row.status),
        ]);

        const csv = [CSV_HEADER, ...rows]
            .map((row) => row.map(escapeCsvCell).join(","))
            .join("\n");

        const blob = new Blob(["\uFEFF", csv], {
            type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = CSV_FILE_NAME;
        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    };

    const visibleRows = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return report;

        return report.filter((row) =>
            Object.values(row).some((value) =>
                String(value ?? "").toLowerCase().includes(term)
            )
        );
    }, [report, search]);

    const filterConfig = [
        {
            key: "taxType",
            value: taxType,
            onChange: handleFilterChange(setTaxType),
            placeholder: "All Tax Types",
            options: filters.taxTypes,
        },
        {
            key: "customer",
            value: customer,
            onChange: handleFilterChange(setCustomer),
            placeholder: "All Customers",
            options: filters.customers,
        },
        {
            key: "invoiceType",
            value: invoiceType,
            onChange: handleFilterChange(setInvoiceType),
            placeholder: "All Invoice Types",
            options: filters.invoiceTypes,
        },
        {
            key: "taxStatus",
            value: taxStatus,
            onChange: handleFilterChange(setTaxStatus),
            placeholder: "All Tax Statuses",
            options: filters.taxStatuses,
        },
    ];

    return {
        cards,
        filters,
        monthlyTax,
        report,
        visibleRows,
        pagination,
        loading,
        error,
        search,
        dateFrom,
        dateTo,
        chartYear,
        currentPage,
        filterConfig,
        setSearch,
        setChartYear,
        setCurrentPage,
        handleDateFromChange,
        handleDateToChange,
        handleExport,
    };
};

export default useTax;