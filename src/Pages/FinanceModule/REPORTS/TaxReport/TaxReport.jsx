import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FiDownload,
    FiDollarSign,
    FiClock,
    FiCheckCircle,
    FiTrendingUp,
} from "react-icons/fi";

import {
    DateInput,
    DatePickerContainer,
    DateRangeWrapper,
    DateSeparator,
    ExportButton,
    MainReportLayout,
    TableSide,
} from "./TaxReport.styles";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";
import TaxCollectionCharts from "./Chart/TaxCollectionCharts";
import {
    getTaxReport,
    clearTaxReportError,
} from "../../../../Redux/finance/reports/Taxreportslice";

const PAGE_SIZE = 10;

const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const formatSar = (value) => `SAR ${formatAmount(value)}`;

const labelFor = (options = [], value) =>
    options.find((o) => String(o.value) === String(value))?.label || value || "";

const getErrorMessage = (error) => {
    if (typeof error === "string") return error;
    if (error?.detail) return error.detail;

    // DRF field errors: { start_date: ["Enter a valid date."] }
    if (error && typeof error === "object") {
        const text = Object.values(error)
            .map((msg) => (Array.isArray(msg) ? msg.join(" ") : String(msg)))
            .join(" | ");
        if (text) return text;
    }

    return error?.message || "Failed to load tax report";
};

const TaxReport = () => {
    const dispatch = useDispatch();

    const { cards, filters, monthlyTax, report, pagination, loading, error } =
        useSelector((state) => state.taxReport);

    // "" means "All": ReusableFilter adds that first option itself
    const [search, setSearch] = useState("");
    const [taxType, setTaxType] = useState("");
    const [customer, setCustomer] = useState("");
    const [vendor, setVendor] = useState("");
    const [invoiceType, setInvoiceType] = useState("");
    const [taxStatus, setTaxStatus] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [chartYear, setChartYear] = useState(new Date().getFullYear());
    const [currentPage, setCurrentPage] = useState(1);

    /* -------------------------- Query params -------------------------- */
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
                // DRF returns 404 "Invalid page" if the page no longer exists
                if (params.page > 1) setCurrentPage(1);
            });
    }, [dispatch, params]);

    useEffect(() => {
        loadReport();
    }, [loadReport]);

    useEffect(() => () => dispatch(clearTaxReportError()), [dispatch]);

    /* ---------------------------- Handlers ---------------------------- */
    // Changing any filter goes back to page 1
    const handleFilterChange = (setter) => (value) => {
        setter(value);
        setCurrentPage(1);
    };

    const handleDateFromChange = (e) => handleFilterChange(setDateFrom)(e.target.value);
    const handleDateToChange = (e) => handleFilterChange(setDateTo)(e.target.value);

    /* ----------------------------- KPI cards ----------------------------- */
    const statsCards = [
        {
            title: "Total Tax Collected",
            count: formatSar(cards.totalTaxCollected),
            icon: <FiDollarSign size={22} />,
            backgroundColor: "#E5EDFF",
            iconColor: "#2563EB",
        },
        {
            title: "Input Tax Credit",
            count: formatSar(cards.inputTaxCredit),
            icon: <FiCheckCircle size={22} />,
            backgroundColor: "#DCFCE7",
            iconColor: "#16A34A",
        },
        {
            title: "Net Tax Payable",
            count: formatSar(cards.netTaxPayable),
            icon: <FiClock size={22} />,
            backgroundColor: "#FFF3D6",
            iconColor: "#D97706",
        },
        {
            title: "Taxable Sales",
            count: formatSar(cards.taxableSales),
            icon: <FiTrendingUp size={22} />,
            backgroundColor: "#F3E8FF",
            iconColor: "#9333EA",
        },
    ];

    /* ------------------------------ Table ------------------------------ */
    // The search box filters the rows on the current page only. The API has
    // no search parameter, so use the dropdowns and dates to filter the
    // whole report.
    const visibleRows = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return report;

        return report.filter((row) =>
            Object.values(row).some((value) =>
                String(value ?? "").toLowerCase().includes(term)
            )
        );
    }, [report, search]);

    // ReusableTable expects `accessor` and `header`
    const taxColumns = useMemo(
        () => [
            { accessor: "documentNumber", header: "Document No" },
            { accessor: "date", header: "Date" },
            {
                accessor: "type",
                header: "Type",
                render: (row) => labelFor(filters.invoiceTypes, row.type),
            },
            { accessor: "customerVendor", header: "Customer / Vendor" },
            {
                accessor: "taxableAmount",
                header: "Taxable Amount (SAR)",
                render: (row) => formatAmount(row.taxableAmount),
            },
            {
                accessor: "taxAmount",
                header: "Tax Amount (SAR)",
                render: (row) => formatAmount(row.taxAmount),
            },
            { accessor: "taxType", header: "Tax Type" },
            {
                accessor: "status",
                header: "Status",
                render: (row) => labelFor(filters.taxStatuses, row.status),
            },
        ],
        [filters.invoiceTypes, filters.taxStatuses]
    );
    const handleExport = () => {
        if (!report.length) return;

        const header = [
            "Document No",
            "Date",
            "Type",
            "Customer / Vendor",
            "Taxable Amount",
            "Tax Amount",
            "Tax Type",
            "Status",
        ];

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

        const escapeCsvCell = (cell) =>
            `"${String(cell ?? "").replace(/"/g, '""')}"`;

        const csv = [header, ...rows]
            .map((row) => row.map(escapeCsvCell).join(","))
            .join("\n");

        const blob = new Blob(["\uFEFF", csv], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "tax-report.csv";
        document.body.appendChild(link);
        link.click();
        link.remove();

        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="Tax Report"
                breadcrumbs={["Reports", "Tax Report"]}
            >
                <DateRangeWrapper>
                    <DatePickerContainer>
                        <DateInput
                            type="date"
                            aria-label="Start date"
                            value={dateFrom}
                            max={dateTo || undefined}
                            onChange={handleDateFromChange}
                        />

                        <DateSeparator>-</DateSeparator>

                        <DateInput
                            type="date"
                            aria-label="End date"
                            value={dateTo}
                            min={dateFrom || undefined}
                            onChange={handleDateToChange}
                        />
                    </DatePickerContainer>
                </DateRangeWrapper>

                <ExportButton
                    type="button"
                    onClick={handleExport}
                    disabled={loading || !report.length}
                >
                    <FiDownload />
                    Export Report
                </ExportButton>
            </ReusableHeader>

            <StatsCards loading={loading} cards={statsCards} />

            <ReusableFilter
                search={search}
                onSearch={setSearch}
                searchPlaceholder="Search this page"
                showSearch
                filters={[
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
                ]}
            />

            {error && (
                <p style={{ color: "#e03131", margin: "8px 0" }}>
                    {getErrorMessage(error)}
                </p>
            )}

            <MainReportLayout>
                <TableSide>
                    <ReusableTable
                        autoLayout
                        columns={taxColumns}
                        data={visibleRows}
                        loading={loading}
                    />

                    <ReusablePagination
                        currentPage={currentPage}
                        totalPages={pagination.totalPages}
                        totalRecords={pagination.count}
                        onPageChange={setCurrentPage}
                    />
                </TableSide>

                <TaxCollectionCharts
                    monthlyTax={monthlyTax}
                    year={chartYear}
                    onYearChange={setChartYear}
                    loading={loading}
                />
            </MainReportLayout>
        </div>
    );
};

export default TaxReport;