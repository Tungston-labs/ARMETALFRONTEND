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

import AddExpenseModal, {
    EXPENSE_CATEGORIES,
    PAYMENT_METHODS,
} from "./modal/AddExpenseModal";

import {
    getExpenses,
    createExpense,
    markExpenseUnpaid,
    deleteExpense,
    clearExpenseError,
} from "../../../../Redux/finance/accounts/Expenseslice";

const PAGE_SIZE = 10;

const CATEGORY_OPTIONS = EXPENSE_CATEGORIES;

const labelFor = (options, value) =>
    options.find((o) => o.value === value)?.label || value || "";

const formatMoney = (value) =>
    Number(value || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const getErrorMessage = (error) =>
    typeof error === "string"
        ? error
        : error?.detail || error?.message || "Something went wrong";

// API shape: biggest_cost is null when there are no expenses, otherwise
// { category, category_label, amount }
const getBiggestCost = (biggestCost) => {
    if (!biggestCost) return { amount: "-", label: "Biggest Cost" };

    if (typeof biggestCost === "object") {
        const amount = biggestCost.amount ?? biggestCost.total ?? biggestCost.value;
        const name =
            biggestCost.category_label ??
            biggestCost.category ??
            biggestCost.name ??
            "";

        return {
            amount: amount !== undefined ? formatMoney(amount) : "-",
            label: name ? `Biggest Cost (${name})` : "Biggest Cost",
        };
    }

    return { amount: formatMoney(biggestCost), label: "Biggest Cost" };
};

const Expenses = () => {
    const dispatch = useDispatch();

    // The store must register the reducer under the key "expense"
    const expenseState = useSelector((state) => state.expense);

    const {
        expenses = [],
        dashboard = {},
        pagination = {
            currentPage: 1,
            totalPages: 1,
            count: 0,
        },
        loading = false,
        error = null,
    } = expenseState || {};

    /* ------------------------- Local UI state ------------------------- */
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [status, setStatus] = useState("");     // "" = all
    const [category, setCategory] = useState("");  // "" = all
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    /* -------------------------- Query params -------------------------- */
    const params = useMemo(
        () => ({
            search: debouncedSearch,
            category, // "" or a category value
            status: String(status).toLowerCase(), // "" | "paid" | "unpaid"
            page: currentPage,
            page_size: PAGE_SIZE,
        }),
        [debouncedSearch, category, status, currentPage]
    );

    const loadExpenses = useCallback(() => {
        dispatch(getExpenses(params))
            .unwrap()
            .catch(() => {
                if (params.page > 1) setCurrentPage(1);
            });
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

    // Exports the rows currently loaded (the current page and filters)
    const handleExportExcel = () => {
        const header = [
            "Expense ID",
            "Date",
            "Category",
            "Paid To",
            "Method",
            "Paid From Account",
            "Amount",
            "Status",
            "Description",
        ];

        const rows = expenses.map((row) => [
            row.expense_id,
            row.expense_date,
            labelFor(EXPENSE_CATEGORIES, row.category),
            row.paid_to,
            labelFor(PAYMENT_METHODS, row.paid_method),
            row.paid_from_account_name || "Cash",
            row.amount,
            row.status,
            row.description,
        ]);

        const csv = [header, ...rows]
            .map((row) =>
                row
                    .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
                    .join(",")
            )
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "expenses.csv";
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleSubmitExpense = async (payload) => {
        await dispatch(createExpense(payload)).unwrap();

        setIsAddExpenseOpen(false);
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

            if (expenses.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                loadExpenses();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const biggestCost = getBiggestCost(dashboard?.biggest_cost);

    const statsCards = [
        {
            count: formatMoney(dashboard?.total_expense),
            title: "Total Expenses",
            icon: <TbFileInvoice />,
            backgroundColor: "#E7F8EC",
            iconColor: "#00A63C",
        },
        {
            count: formatMoney(dashboard?.this_month_expense),
            title: "This Month Expense",
            icon: <MdOutlineInventory2 />,
            backgroundColor: "#F1E8FF",
            iconColor: "#923CFF",
        },
        {
            count: formatMoney(dashboard?.already_paid),
            title: "Already Paid",
            icon: <TbArrowUp />,
            backgroundColor: "#E7F8EC",
            iconColor: "#00A63C",
        },
        {
            count: formatMoney(dashboard?.still_pay),
            title: "Still To Pay",
            icon: <TbArrowDown />,
            backgroundColor: "#FFF1E5",
            iconColor: "#FF7200",
        },
        {
            count: biggestCost.amount,
            title: biggestCost.label,
            icon: <MdOutlineAccountBalance />,
            backgroundColor: "#FFE8E8",
            iconColor: "#FF3131",
        },
    ];

    const expenseColumns = useMemo(
        () => [
            { accessor: "expense_id", header: "Expense ID" },
            { accessor: "expense_date", header: "Date" },
            {
                accessor: "category",
                header: "Category",
                render: (row) => labelFor(EXPENSE_CATEGORIES, row.category),
            },
            {
                accessor: "paid_to",
                header: "Paid to & note",
                render: (row) => (
                    <div>
                        <div>{row.paid_to}</div>
                        {row.description && (
                            <div style={{ fontSize: 12, color: "#6b7280" }}>
                                {row.description}
                            </div>
                        )}
                    </div>
                ),
            },
            {
                accessor: "paid_method",
                header: "Method",
                render: (row) => labelFor(PAYMENT_METHODS, row.paid_method),
            },
            {
                accessor: "paid_from_account_name",
                header: "Paid From",
                // cash expenses have no bank account
                render: (row) => row.paid_from_account_name || "Cash",
            },
            {
                accessor: "amount",
                header: "Amount",
                render: (row) => formatMoney(row.amount),
            },
            { accessor: "status", header: "Status" },
            // Uncomment to bring back the row actions
            // {
            //     accessor: "actions",
            //     header: "Actions",
            //     sortable: false,
            //     render: (row) => (
            //         <div style={{ display: "flex", gap: 8 }}>
            //             {row.status === "paid" && (
            //                 <button
            //                     type="button"
            //                     onClick={() => handleMarkUnpaid(row.id)}
            //                 >
            //                     Mark Unpaid
            //                 </button>
            //             )}
            //             <button
            //                 type="button"
            //                 onClick={() => handleDelete(row.id)}
            //             >
            //                 Delete
            //             </button>
            //         </div>
            //     ),
            // },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [loadExpenses, expenses.length, currentPage]
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
            <StatsCards loading={loading} cards={statsCards} />

            {/* Filters */}
            <ReusableFilter
                search={search}
                onSearch={handleSearchChange}
                searchPlaceholder="Search Paid To or Description"
                showSearch
                status={status}
                statuses={["Paid", "Unpaid"]}
                onStatus={handleStatusChange}
                showStatus
                filters={[
                    {
                        key: "category",
                        value: category,
                        onChange: handleCategoryChange,
                        options: CATEGORY_OPTIONS,
                        placeholder: "All Categories",
                    },
                ]}
            />

           
            <ReusableTable
                columns={expenseColumns}
                data={expenses}
                loading={loading}
                autoLayout
            />

            {/* Pagination */}
            <ReusablePagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                totalRecords={pagination.count}
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