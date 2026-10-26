// Recievables.jsx  -> ONLY UI (all logic comes from the hook)

import React, { useMemo } from "react";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";

import {
    ExportButton,
    DateRangeWrapper,
    DatePickerContainer,
    DateInput,
    DateSeparator,
} from "./Recievables.styles";

import { TbFileInvoice, TbArrowUp, TbArrowDown } from "react-icons/tb";
import { MdOutlineInventory2, MdOutlineAccountBalance } from "react-icons/md";
import { FiDownload } from "react-icons/fi";

import useRecievables from "./Userecievables";

const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

// ---------------- status badge ----------------
const STATUS_STYLES = {
    paid: { color: "#00A63C", background: "#E7F8EC" },
    partially_paid: { color: "#FF7200", background: "#FFF1E5" },
    overdue: { color: "#FF3131", background: "#FFE8E8" },
};

const formatStatus = (status = "") =>
    status
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

const StatusBadge = ({ status }) => {
    const style = STATUS_STYLES[status] || { color: "#555", background: "#EEE" };

    return (
        <span
            style={{
                ...style,
                padding: "4px 10px",
                borderRadius: 12,
                fontSize: 12,
                fontWeight: 600,
                whiteSpace: "nowrap",
            }}
        >
            {formatStatus(status)}
        </span>
    );
};

// ---------------- table columns ----------------
const receivableColumns = [
    { accessor: "invoice_number", header: "Invoice No." },
    { accessor: "customer_name", header: "Customer" },
    { accessor: "invoice_date", header: "Invoice Date", width: "120px" },
    { accessor: "due_date", header: "Due Date", width: "120px" },
    { accessor: "amount", header: "Amount", sortable: false },
    { accessor: "paid_amount", header: "Paid", sortable: false },
    { accessor: "outstanding_amount", header: "Outstanding", sortable: false },
    {
        accessor: "status",
        header: "Status",
        render: (row) => <StatusBadge status={row.status} />,
    },
];

const Recievables = () => {
    const {
        receivables,
        dashboard,
        customerOptions,
        statuses,
        totalPages,
        loading,
        errorMessage,
        search,
        customer,
        status,
        startDate,
        endDate,
        currentPage,
        handleSearchChange,
        handleCustomerChange,
        handleStatusChange,
        handleStartDateChange,
        handleEndDateChange,
        handleExportExcel,
        setCurrentPage,
    } = useRecievables();

    const statsCards = [
        {
            count: formatAmount(dashboard?.total_receivable),
            title: "Total Receivable",
            icon: <TbFileInvoice />,
            backgroundColor: "#E7F8EC",
            iconColor: "#00A63C",
        },
        {
            count: formatAmount(dashboard?.not_yet_due),
            title: "Not yet Due",
            icon: <MdOutlineInventory2 />,
            backgroundColor: "#F1E8FF",
            iconColor: "#923CFF",
        },
        {
            count: formatAmount(dashboard?.overdue_amount),
            title: "Overdue",
            icon: <MdOutlineAccountBalance />,
            backgroundColor: "#E7F8EC",
            iconColor: "#00A63C",
        },
        {
            count: formatAmount(dashboard?.over_60_days_late),
            title: "Over 60 days late",
            icon: <TbArrowUp />,
            backgroundColor: "#FFF1E5",
            iconColor: "#FF7200",
        },
        {
            count: dashboard?.overdue_customers ?? 0,
            title: "Customers Overdue",
            icon: <TbArrowDown />,
            backgroundColor: "#FFE8E8",
            iconColor: "#FF3131",
        },
    ];

    const tableData = useMemo(
        () =>
            receivables.map((row) => ({
                ...row,
                amount: formatAmount(row.amount),
                paid_amount: formatAmount(row.paid_amount),
                outstanding_amount: formatAmount(row.outstanding_amount),
            })),
        [receivables]
    );

    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="Receivables"
                breadcrumbs={["Accounting", "Receivables"]}
            >
                <DateRangeWrapper>
                    <DatePickerContainer>
                        <DateInput
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            max={endDate || undefined}
                            aria-label="Start date"
                        />

                        <DateSeparator>-</DateSeparator>

                        <DateInput
                            type="date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            min={startDate || undefined}
                            aria-label="End date"
                        />
                    </DatePickerContainer>
                </DateRangeWrapper>

                <ExportButton type="button" onClick={handleExportExcel}>
                    <FiDownload />
                    Export
                </ExportButton>
            </ReusableHeader>

            <StatsCards cards={statsCards} />

            <ReusableFilter
                search={search}
                onSearch={handleSearchChange}
                searchPlaceholder="Search Invoice or Customer"
                showSearch
                status={status}
                statuses={statuses}
                onStatus={handleStatusChange}
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

            {errorMessage && (
                <div style={{ color: "#FF3131", margin: "10px 0" }}>{errorMessage}</div>
            )}

            <ReusableTable
                columns={receivableColumns}
                data={tableData}
                loading={loading}
                emptyMessage="No invoices found"
            />

            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default Recievables;