import React, { useMemo } from "react";
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
import useTax, {
    formatAmount,
    formatSar,
    getErrorMessage,
    labelFor,
} from "./Usetax";
import { formatDate } from "../../../../utils/Formatdate";

const TaxReport = () => {
    const {
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
    } = useTax();

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
    const taxColumns = useMemo(
        () => [
            { accessor: "documentNumber", header: "Document No" },
           {
    accessor: "date",
    header: "Date",
    render: (row) => formatDate(row.date),
},
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
                filters={filterConfig}
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