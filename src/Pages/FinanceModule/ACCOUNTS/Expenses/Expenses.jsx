import React, { useMemo, useState } from "react";

import {
    employeeColumns,
    employeeData,
} from "../../../../Components/ReusableTable/dummydata";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";

import {
    ExportButton,
} from "./Expenses.styles";

import {
    TbFileInvoice,
    TbArrowUp,
    TbArrowDown,
} from "react-icons/tb";

import {
    MdOutlineInventory2,
    MdOutlineAccountBalance,
} from "react-icons/md";

import { FiDownload } from "react-icons/fi";

import AddExpenseModal from "./modal/AddExpenseModal";

const Expenses = () => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [accountType, setAccountType] = useState("all");
    const [parentAccount, setParentAccount] = useState("all");
    const [user, setUser] = useState("all");

    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

    const rowsPerPage = 10;

    const [currentPage, setCurrentPage] = useState(1);

    const statsCards = [
        {
            count: "3,684",
            title: "Total Expenses",
            icon: <TbFileInvoice />,
            backgroundColor: "#E7F8EC",
            iconColor: "#00A63C",
        },
        {
            count: "1,240",
            title: "Total Expense Entries",
            icon: <MdOutlineInventory2 />,
            backgroundColor: "#F1E8FF",
            iconColor: "#923CFF",
        },
        {
            count: "986",
            title: "Pending Expenses",
            icon: <MdOutlineAccountBalance />,
            backgroundColor: "#E7F8EC",
            iconColor: "#00A63C",
        },
        {
            count: "842",
            title: "Paid Expenses",
            icon: <TbArrowUp />,
            backgroundColor: "#FFF1E5",
            iconColor: "#FF7200",
        },
        {
            count: "616",
            title: "Expense Categories",
            icon: <TbArrowDown />,
            backgroundColor: "#FFE8E8",
            iconColor: "#FF3131",
        },
    ];

    const totalPages = Math.ceil(
        employeeData.length / rowsPerPage
    );

    const handleSearchChange = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleStatusChange = (value) => {
        setStatus(value);
        setCurrentPage(1);
    };

    const handleAccountTypeChange = (value) => {
        setAccountType(value);
        setCurrentPage(1);
    };

    const handleParentAccountChange = (value) => {
        setParentAccount(value);
        setCurrentPage(1);
    };

    const handleUserChange = (value) => {
        setUser(value);
        setCurrentPage(1);
    };

    const handleExportExcel = () => {
        console.log("Export Expenses to Excel");
    };

    const handleSubmitExpense = (data) => {
        console.log("Expense Data:", data);

        setIsAddExpenseOpen(false);
    };

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;

        return employeeData.slice(
            start,
            start + rowsPerPage
        );
    }, [currentPage]);

    return (
        <div style={{ padding: 20 }}>

            {/* Header */}
            <ReusableHeader
                title="Expenses"
                breadcrumbs={[
                    "Accounting",
                    "Expenses",
                ]}
                buttonText="+ ADD NEW EXPENSE"
                onButtonClick={() => setIsAddExpenseOpen(true)}
            >
                <ExportButton
                    type="button"
                    onClick={handleExportExcel}
                >
                    <FiDownload />
                    Export
                </ExportButton>
            </ReusableHeader>

            {/* Stats */}
            <StatsCards cards={statsCards} />

            {/* Filters */}
            <ReusableFilter
                search={search}
                onSearch={handleSearchChange}
                searchPlaceholder="Search Account or Description"
                showSearch

                status={status}
                statuses={[
                    "All Status",
                    "Active",
                    "Inactive",
                ]}
                onStatus={handleStatusChange}
                showStatus

                filters={[
                    {
                        key: "accountType",
                        value: accountType,
                        onChange: handleAccountTypeChange,
                        options: [
                            {
                                label: "All Account Types",
                                value: "all",
                            },
                            {
                                label: "Asset",
                                value: "asset",
                            },
                            {
                                label: "Liability",
                                value: "liability",
                            },
                            {
                                label: "Income",
                                value: "income",
                            },
                            {
                                label: "Expense",
                                value: "expense",
                            },
                        ],
                        placeholder: "Account Type",
                    },

                    {
                        key: "parentAccount",
                        value: parentAccount,
                        onChange: handleParentAccountChange,
                        options: [
                            {
                                label: "All Parent Accounts",
                                value: "all",
                            },
                            {
                                label: "Operating Expenses",
                                value: "operating_expenses",
                            },
                            {
                                label: "Administrative Expenses",
                                value: "administrative_expenses",
                            },
                            {
                                label: "Financial Expenses",
                                value: "financial_expenses",
                            },
                            {
                                label: "Other Expenses",
                                value: "other_expenses",
                            },
                        ],
                        placeholder: "Parent Account",
                    },

                    {
                        key: "user",
                        value: user,
                        onChange: handleUserChange,
                        options: [
                            {
                                label: "All Users",
                                value: "all",
                            },
                            {
                                label: "Admin",
                                value: "admin",
                            },
                            {
                                label: "Accountant",
                                value: "accountant",
                            },
                            {
                                label: "Finance Manager",
                                value: "finance_manager",
                            },
                            {
                                label: "Super Admin",
                                value: "super_admin",
                            },
                        ],
                        placeholder: "All Users",
                    },
                ]}
            />

            {/* Table */}
            <ReusableTable
                columns={employeeColumns}
                data={paginatedData}
            />

            {/* Pagination */}
            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* Add Expense Modal */}
            <AddExpenseModal
                isOpen={isAddExpenseOpen}
                onClose={() => setIsAddExpenseOpen(false)}
                onSubmit={handleSubmitExpense}
            />

        </div>
    );
};

export default Expenses;