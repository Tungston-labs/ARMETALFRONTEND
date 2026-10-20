import React from "react";

import {
    ExportButton,
    MainReportLayout,
    TableSide,
} from "./CustomerReport.styles";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";
import SalesTrendChart from "./chart/CustomerRevenueDashboard";
import useCustomerReport, { STATUS_OPTIONS, formatSAR } from "./Usecustomerreport";
import customerColumns from "./Customerreportcolumns";

import {
    FiDownload,
    FiUsers,
    FiDollarSign,
    FiCreditCard,
    FiClock,
    FiShoppingCart,
} from "react-icons/fi";

const CustomerReport = () => {
    const {
        summary,
        tableData,
        customerOptions,
        loading,
        error,
        currentPage,
        totalPages,
        setCurrentPage,
        selectedYear,
        selectedMonth,
        handleYearChange,
        handleMonthChange,
        search,
        status,
        customer,
        setSearch,
        setStatus,
        setCustomer,
    } = useCustomerReport();

    // Customer report statistics
    const customerStats = [
        {
            title: "Total Customers",
            count: String(summary.totalCustomers),
            icon: <FiUsers />,
            backgroundColor: "#E8F0FF",
            iconColor: "#3B82F6",
        },
        {
            title: "Total Revenue",
            count: formatSAR(summary.totalRevenue),
            icon: <FiDollarSign />,
            backgroundColor: "#E6F8EF",
            iconColor: "#16A34A",
        },
        {
            title: "Payments Received",
            count: formatSAR(summary.paymentReceived),
            icon: <FiCreditCard />,
            backgroundColor: "#FFF3E0",
            iconColor: "#F59E0B",
        },
        {
            title: "Outstanding Receivables",
            count: formatSAR(summary.outstandingPayable),
            icon: <FiClock />,
            backgroundColor: "#FDE8E8",
            iconColor: "#E63D32",
        },
        {
            title: "Total Invoice",
            count: String(summary.totalInvoices),
            icon: <FiShoppingCart />,
            backgroundColor: "#F3E8FF",
            iconColor: "#9333EA",
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="Customer Reports"
                breadcrumbs={["Reports", "Customer Reports"]}
            >
                <ExportButton type="button">
                    <FiDownload />
                    Export Accounts
                </ExportButton>
            </ReusableHeader>

            <StatsCards cards={customerStats} loading={loading} />

            <ReusableFilter
                search={search}
                onSearch={setSearch}
                status={status}
                statuses={STATUS_OPTIONS}
                onStatus={setStatus}
                showSearch
                showStatus
                filters={[
                    {
                        key: "customer",
                        value: customer,
                        onChange: setCustomer,
                        options: customerOptions,
                        placeholder: "Select Customer",
                    },
                ]}
            />

            {error && (
                <div style={{ color: "#E63D32", margin: "12px 0" }}>
                    {typeof error === "string"
                        ? error
                        : error.detail || "Failed to load customer report"}
                </div>
            )}

            <MainReportLayout>
                <TableSide>
                    <ReusableTable
                        autoLayout
                        columns={customerColumns}
                        data={tableData}
                        loading={loading}
                    />

                    <ReusablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </TableSide>

                <SalesTrendChart
                    selectedYear={selectedYear}
                    selectedMonth={selectedMonth}
                    onYearChange={handleYearChange}
                    onMonthChange={handleMonthChange}
                />
            </MainReportLayout>
        </div>
    );
};

export default CustomerReport;