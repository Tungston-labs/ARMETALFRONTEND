import React, { useMemo } from "react";

import {
    DateInput,
    DatePickerContainer,
    DateRangeWrapper,
    DateSeparator,
    ExportButton,
    MainReportLayout,
    TableSide,
} from "./SalesReports.styles";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import SalesTrendChart from "./Chart/SalesTrendChart";
import StatsCards from "../../../../Components/StatsCards/StatsCards";

import { FiDownload } from "react-icons/fi";

import useSalesReport from "./Usesalesreport";
import {
    buildStatsCards,
    salesColumns,
    statusOptions,
} from "./Salesreportconfig";

const getErrorMessage = (error) =>
    typeof error === "string"
        ? error
        : error?.detail || error?.message || "Something went wrong";

const SalesReports = () => {
    const {
        search,
        status,
        customer,
        year,
        rows,
        customerOptions,
        summary,
        chart,
        currentPage,
        totalPages,
        setCurrentPage,
        loading,
        error,
        exporting,
        exportError,
        dateFrom,
        dateTo,
        handleDateFromChange,
        handleDateToChange,

        handleSearch,
        handleStatus,
        handleCustomerChange,
        handleYearChange,
        handleExport,
    } = useSalesReport();

    const statsCards = useMemo(() => buildStatsCards(summary), [summary]);

    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="Sales Reports"
                breadcrumbs={["Reports", "Sales Reports"]}
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
                    disabled={exporting}
                >
                    <FiDownload /> {exporting ? "Exporting..." : "Export Report"}
                </ExportButton>
            </ReusableHeader>

            {(error || exportError) && (
                <p style={{ color: "#DC2626", margin: "8px 0" }}>
                    {getErrorMessage(error || exportError)}
                </p>
            )}

            <StatsCards cards={statsCards} loading={loading} />

            <ReusableFilter
                search={search}
                onSearch={handleSearch}
                status={status}
                statuses={statusOptions}
                onStatus={handleStatus}
                showSearch
                showStatus
                filters={[
                    {
                        key: "customer",
                        value: customer,
                        onChange: handleCustomerChange,
                        options: customerOptions,
                        placeholder: "All Customers",
                    },
                ]}
            />

            <MainReportLayout>
                <TableSide>
                    <ReusableTable
                        autoLayout
                        columns={salesColumns}
                        data={rows}
                        loading={loading}
                    />

                    <ReusablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </TableSide>

                <SalesTrendChart
                    data={chart.months}
                    year={year}
                    onYearChange={handleYearChange}
                    loading={loading}
                />
            </MainReportLayout>
        </div>
    );
};

export default SalesReports;