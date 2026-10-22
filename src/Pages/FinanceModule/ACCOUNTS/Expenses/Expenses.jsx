import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";

import { ExportButton } from "./Expenses.styles";

import { TbFileInvoice, TbArrowUp, TbArrowDown } from "react-icons/tb";
import { MdOutlineInventory2, MdOutlineAccountBalance } from "react-icons/md";
import { FiDownload } from "react-icons/fi";

import AddExpenseModal from "./modal/AddExpenseModal";

import {
    getExpenses,
    createExpense,
    markExpenseUnpaid,
    deleteExpense,
    clearExpenseError,
} from "../../../../Redux/finance/accounts/Expenseslice";

const PAGE_SIZE = 10;

const CATEGORY_OPTIONS = [
    { label: "All Categories", value: "all" },
    { label: "Rent", value: "rent" },
    { label: "Utilities", value: "utilities" },
    { label: "Travel", value: "travel" },
    { label: "Office Expense", value: "office" },
    { label: "Salary", value: "salary" },
];

const Expenses = () => {
    const dispatch = useDispatch();

    const { expenses, dashboard, pagination, loading, error } = useSelector(
        (state) => state.expense
    );

    /* ------------------------- Local UI state ------------------------- */
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [status, setStatus] = useState("All Status");
    const [category, setCategory] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

    // Debounce the search box so we don't hit the API on every keystroke
    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    /* -------------------------- Query params -------------------------- */
    const params = useMemo(() => {
        const s = String(status).toLowerCase();

        return {
            search: debouncedSearch,
            category: category === "all" ? "" : category,
            status: s.startsWith("all") ? "" : s, // "paid" | "unpaid"
            page: currentPage,
            page_size: PAGE_SIZE,
        };
    }, [debouncedSearch, category, status, currentPage]);

    const loadExpenses = useCallback(() => {
        dispatch(getExpenses(params));
    }, [dispatch, params]);

    useEffect(() => {
        loadExpenses();
    }, [loadExpenses]);

    useEffect(() => () => dispatch(clearExpenseError()), [dispatch]);

    /* ---------------------------- Handlers ---------------------------- */
    const handleSearchChange = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleStatusChange = (value) => {
        setStatus(value);
        setCurrentPage(1);
    };

    const handleCategoryChange = (value) => {
        setCategory(value);
        setCurrentPage(1);
    };

    const handleExportExcel = () => {
        console.log("Export Expenses to Excel");
    };

    // Modal calls this with the API-ready payload. If it throws, the modal
    // shows the error and stays open.
    const handleSubmitExpense = async (payload) => {
        await dispatch(createExpense(payload)).unwrap();

        setIsAddExpenseOpen(false);

        // Reload so KPI cards + pagination reflect the new record
        if (currentPage !== 1) setCurrentPage(1);
        else loadExpenses();
    };

    const handleMarkUnpaid = async (id) => {
        try {
            await dispatch(markExpenseUnpaid(id)).unwrap();
            loadExpenses();
        } catch (e) {
            console.error(e);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this expense?")) return;

        try {
            await dispatch(deleteExpense(id)).unwrap();
            loadExpenses();
        } catch (e) {
            console.error(e);
        }
    };

    /* ----------------------------- KPI cards ----------------------------- */
    // NOTE: adjust the dashboard keys to match what your API returns.
    const statsCards = [
        {
            count: dashboard?.total_expenses ?? 0,
            title: "Total Expenses",
            icon: <TbFileInvoice />,
            backgroundColor: "#E7F8EC",
            iconColor: "#00A63C",
        },
        {
            count: dashboard?.total_entries ?? pagination.count ?? 0,
            title: "Total Expense Entries",
            icon: <MdOutlineInventory2 />,
            backgroundColor: "#F1E8FF",
            iconColor: "#923CFF",
        },
        {
            count: dashboard?.pending_expenses ?? 0,
            title: "Pending Expenses",
            icon: <MdOutlineAccountBalance />,
            backgroundColor: "#E7F8EC",
            iconColor: "#00A63C",
        },
        {
            count: dashboard?.paid_expenses ?? 0,
            title: "Paid Expenses",
            icon: <TbArrowUp />,
            backgroundColor: "#FFF1E5",
            iconColor: "#FF7200",
        },
        {
            count: dashboard?.expense_categories ?? 0,
            title: "Expense Categories",
            icon: <TbArrowDown />,
            backgroundColor: "#FFE8E8",
            iconColor: "#FF3131",
        },
    ];

    /* ------------------------------ Columns ------------------------------ */
    // NOTE: match the shape (key/label/render vs accessor/header) to what
    // your ReusableTable expects, same as employeeColumns.
    const expenseColumns = useMemo(
        () => [
            { key: "expense_date", label: "Date" },
            { key: "category", label: "Category" },
            { key: "paid_to", label: "Paid To" },
            { key: "paid_method", label: "Method" },
            {
                key: "amount",
                label: "Amount",
                render: (row) => Number(row.amount).toLocaleString(),
            },
            { key: "status", label: "Status" },
            { key: "description", label: "Description" },
            {
                key: "actions",
                label: "Actions",
                render: (row) => (
                    <div style={{ display: "flex", gap: 8 }}>
                        {row.status === "paid" && (
                            <button
                                type="button"
                                onClick={() => handleMarkUnpaid(row.id)}
                            >
                                Mark Unpaid
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => handleDelete(row.id)}
                        >
                            Delete
                        </button>
                    </div>
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [loadExpenses]
    );

    return (
        <div style={{ padding: 20 }}>
            {/* Header */}
            <ReusableHeader
                title="Expenses"
                breadcrumbs={["Accounting", "Expenses"]}
                buttonText="+ ADD NEW EXPENSE"
                onButtonClick={() => setIsAddExpenseOpen(true)}
            >
                <ExportButton type="button" onClick={handleExportExcel}>
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
                searchPlaceholder="Search Paid To or Description"
                showSearch
                status={status}
                statuses={["All Status", "Paid", "Unpaid"]}
                onStatus={handleStatusChange}
                showStatus
                filters={[
                    {
                        key: "category",
                        value: category,
                        onChange: handleCategoryChange,
                        options: CATEGORY_OPTIONS,
                        placeholder: "Category",
                    },
                ]}
            />

            {/* Error */}
            {error && (
                <p style={{ color: "#e03131", margin: "8px 0" }}>
                    {typeof error === "string"
                        ? error
                        : error.detail || "Something went wrong"}
                </p>
            )}

            {/* Table */}
            <ReusableTable
                columns={expenseColumns}
                data={expenses}
                loading={loading}
            />

            {/* Pagination */}
            <ReusablePagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
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