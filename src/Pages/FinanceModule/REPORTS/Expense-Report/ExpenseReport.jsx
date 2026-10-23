import React, { useMemo, useState } from "react";
import {
    FiDownload,
    FiDollarSign,
    FiClock,
    FiCheckCircle,
    FiTrendingUp,
} from "react-icons/fi";

import {
    employeeColumns,
    employeeData,
} from "../../../../Components/ReusableTable/dummydata";

import {
    DateInput,
    DatePickerContainer,
    DateRangeWrapper,
    DateSeparator,
    ExportButton,
    MainReportLayout,
    TableSide,
} from "./ExpenseReport.styles";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";
import ExpenseReimbursementTrends from "./chart/ExpenseReimbursementTrends";

const ExpenseReport = () => {
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("all");
    const [employee, setEmployee] = useState("all");
    const [expenseCategory, setExpenseCategory] = useState("all");
    const [paymentStatus, setPaymentStatus] = useState("all");
    const [approvalStatus, setApprovalStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const rowsPerPage = 15;

    const handleFilterChange = (setter) => (value) => {
        setter(value);
        setCurrentPage(1);
    };

    const statsCards = [
        {
            title: "Total Expenses",
            count: "SAR 125,000",
            icon: <FiDollarSign size={22} />,
            backgroundColor: "#E5EDFF",
            iconColor: "#2563EB",
        },
        {
            title: "Pending Payments",
            count: "SAR 18,500",
            icon: <FiClock size={22} />,
            backgroundColor: "#FFF3D6",
            iconColor: "#D97706",
        },
        {
            title: "Approved Expenses",
            count: "SAR 86,500",
            icon: <FiCheckCircle size={22} />,
            backgroundColor: "#DCFCE7",
            iconColor: "#16A34A",
        },
        {
            title: "Reimbursement Rate",
            count: "92%",
            icon: <FiTrendingUp size={22} />,
            backgroundColor: "#F3E8FF",
            iconColor: "#9333EA",
        },
    ];

    const filteredData = useMemo(() => {
        return employeeData.filter((item) => {
            const matchesSearch = Object.values(item).some((value) =>
                String(value ?? "")
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );

            const matchesDepartment =
                department === "all" ||
                String(item.department ?? "").toLowerCase() ===
                department.toLowerCase();

            const matchesEmployee =
                employee === "all" ||
                String(item.employee ?? item.employeeName ?? "")
                    .toLowerCase() === employee.toLowerCase();

            const matchesCategory =
                expenseCategory === "all" ||
                String(item.expenseCategory ?? item.category ?? "")
                    .toLowerCase() === expenseCategory.toLowerCase();

            const matchesPaymentStatus =
                paymentStatus === "all" ||
                String(item.paymentStatus ?? "")
                    .toLowerCase() === paymentStatus.toLowerCase();

            const matchesApprovalStatus =
                approvalStatus === "all" ||
                String(item.approvalStatus ?? "")
                    .toLowerCase() === approvalStatus.toLowerCase();

            return (
                matchesSearch &&
                matchesDepartment &&
                matchesEmployee &&
                matchesCategory &&
                matchesPaymentStatus &&
                matchesApprovalStatus
            );
        });
    }, [
        search,
        department,
        employee,
        expenseCategory,
        paymentStatus,
        approvalStatus,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredData.length / rowsPerPage)
    );
    const handleExport = () => {
        if (!filteredData.length) return;

        const keys = Object.keys(filteredData[0]);
        const csv = [keys, ...filteredData.map((row) => keys.map((k) => row[k]))]
            .map((row) =>
                row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
            )
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "expense-report.csv";
        link.click();
        URL.revokeObjectURL(url);
    };
    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return filteredData.slice(start, start + rowsPerPage);
    }, [filteredData, currentPage]);

    React.useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="Payables"
                breadcrumbs={["Accounting", "Payables"]}
            >
                <DateRangeWrapper>
                    <DatePickerContainer>
                        <DateInput
                            type="date"
                            aria-label="Start date"
                        // value={dateFrom}
                        // max={dateTo || undefined}
                        // onChange={onDateFromChange}
                        />

                        <DateSeparator>-</DateSeparator>

                        <DateInput
                            type="date"
                            aria-label="End date"
                        // value={dateTo}
                        // min={dateFrom || undefined}
                        // onChange={onDateToChange}
                        />
                    </DatePickerContainer>
                </DateRangeWrapper>

                <ExportButton type="button" onClick={handleExport}>
                    <FiDownload />
                    Export Report
                </ExportButton>
            </ReusableHeader>

            <StatsCards loading={false} cards={statsCards} />
            <ReusableFilter
                search={search}
                onSearch={handleFilterChange(setSearch)}
                showSearch
                filters={[
                    {
                        key: "department",
                        value: department,
                        onChange: handleFilterChange(setDepartment),
                        options: [
                            { label: "All Departments", value: "all" },
                            { label: "HR", value: "HR" },
                            { label: "Finance", value: "Finance" },
                            { label: "Development", value: "Development" },
                            { label: "Marketing", value: "Marketing" },
                        ],
                    },
                    {
                        key: "employee",
                        value: employee,
                        onChange: handleFilterChange(setEmployee),
                        options: [
                            { label: "All Employees", value: "all" },
                            ...Array.from(
                                new Set(
                                    employeeData
                                        .map((item) =>
                                            item.employee ?? item.employeeName
                                        )
                                        .filter(Boolean)
                                )
                            ).map((name) => ({
                                label: name,
                                value: name,
                            })),
                        ],
                    },
                    {
                        key: "expenseCategory",
                        value: expenseCategory,
                        onChange: handleFilterChange(setExpenseCategory),
                        options: [
                            { label: "All Expense Categories", value: "all" },
                            { label: "Travel", value: "Travel" },
                            { label: "Accommodation", value: "Accommodation" },
                            { label: "Meals", value: "Meals" },
                            { label: "Office Supplies", value: "Office Supplies" },
                            { label: "Transportation", value: "Transportation" },
                            { label: "Other", value: "Other" },
                        ],
                    },
                    {
                        key: "paymentStatus",
                        value: paymentStatus,
                        onChange: handleFilterChange(setPaymentStatus),
                        options: [
                            { label: "All Payment Statuses", value: "all" },
                            { label: "Paid", value: "paid" },
                            { label: "Pending", value: "pending" },
                            { label: "Failed", value: "failed" },
                        ],
                    },
                    {
                        key: "approvalStatus",
                        value: approvalStatus,
                        onChange: handleFilterChange(setApprovalStatus),
                        options: [
                            { label: "All Approval Statuses", value: "all" },
                            { label: "Approved", value: "approved" },
                            { label: "Pending", value: "pending" },
                            { label: "Rejected", value: "rejected" },
                        ],
                    },
                ]}
            />


            <MainReportLayout>
                <TableSide>
                    <ReusableTable
                        autoLayout
                        columns={employeeColumns}
                        data={paginatedData}
                    />

                    <ReusablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </TableSide>

                <ExpenseReimbursementTrends />
            </MainReportLayout>
        </div>
    );
};

export default ExpenseReport;