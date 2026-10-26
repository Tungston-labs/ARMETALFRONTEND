import React from "react";
import {
    ExportButton,
    MainReportLayout,
    TableSide,
} from "./VendorReport.styles";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";
import VendorPurchaseDashboard from "./chart/VendorPurchaseDashboard";
import useVendorReport, { STATUS_OPTIONS, formatSAR } from "./Usevendorreport";
import vendorColumns from "./Vendorreportcolumns";
import {
    FiDownload,
    FiUsers,
    FiCreditCard,
    FiClock,
    FiFileText,
} from "react-icons/fi";

const VendorReport = () => {
    const {
        summary,
        tableData,
        vendorOptions,
        paymentTermOptions,
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
        vendor,
        paymentTerm,
        setSearch,
        handleStatusChange,
        handleVendorChange,
        handlePaymentTermChange,
    } = useVendorReport();

    // Vendor report statistics
    const vendorStats = [
        {
            title: "Total Vendors",
            count: String(summary.totalVendors),
            icon: <FiUsers />,
            backgroundColor: "#E8F0FF",
            iconColor: "#3B82F6",
        },
        {
            title: "Total Bills",
            count: String(summary.totalBills),
            icon: <FiFileText />,
            backgroundColor: "#F3E8FF",
            iconColor: "#9333EA",
        },
        {
            title: "Payments Made",
            count: formatSAR(summary.totalPayments),
            icon: <FiCreditCard />,
            backgroundColor: "#FFF3E0",
            iconColor: "#F59E0B",
        },
        {
            title: "Outstanding Payables",
            count: formatSAR(summary.outstandingPayables),
            icon: <FiClock />,
            backgroundColor: "#FDE8E8",
            iconColor: "#E63D32",
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="Vendor Reports"
                breadcrumbs={["Reports", "Vendor Reports"]}
            >
                <ExportButton type="button">
                    <FiDownload />
                    Export Accounts
                </ExportButton>
            </ReusableHeader>

            <StatsCards cards={vendorStats} loading={loading} />

            <ReusableFilter
                search={search}
                onSearch={setSearch}
                status={status}
                statuses={STATUS_OPTIONS}
                onStatus={handleStatusChange}
                showSearch
                showStatus
                filters={[
                    {
                        key: "vendor",
                        value: vendor,
                        onChange: handleVendorChange,
                        options: vendorOptions,
                        placeholder: "Select Vendor",
                    },
                    {
                        key: "paymentTerm",
                        value: paymentTerm,
                        onChange: handlePaymentTermChange,
                        options: paymentTermOptions,
                        placeholder: "Payment Term",
                    },
                ]}
            />

            {error && (
                <div style={{ color: "#E63D32", margin: "12px 0" }}>
                    {typeof error === "string"
                        ? error
                        : error.detail || "Failed to load vendor report"}
                </div>
            )}

            <MainReportLayout>
                <TableSide>
                    <ReusableTable
                        autoLayout
                        columns={vendorColumns}
                        data={tableData}
                        loading={loading}
                    />

                    <ReusablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </TableSide>

                <VendorPurchaseDashboard
                    selectedYear={selectedYear}
                    selectedMonth={selectedMonth}
                    onYearChange={handleYearChange}
                    onMonthChange={handleMonthChange}
                />
            </MainReportLayout>
        </div>
    );
};

export default VendorReport;