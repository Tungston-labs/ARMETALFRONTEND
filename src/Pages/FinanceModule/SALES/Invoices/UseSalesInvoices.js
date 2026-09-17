import { useMemo, useState } from "react";

import {
    salesInvoiceColumns,
    salesInvoiceData,
} from "./SalesInvoices.columns";

const getCurrentMonthRange = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    return {
        start: formatDate(firstDay),
        end: formatDate(lastDay),
    };
};

const useSalesInvoices = () => {
    const currentMonth = useMemo(
        () => getCurrentMonthRange(),
        []
    );

    // -----------------------------
    // STATE
    // -----------------------------

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [customer, setCustomer] = useState("");
    const [dueDate, setDueDate] = useState("");

    const [startDate, setStartDate] = useState(
        currentMonth.start
    );

    const [endDate, setEndDate] = useState(
        currentMonth.end
    );

    const [currentPage, setCurrentPage] = useState(1);

    const rowsPerPage = 10;

    // -----------------------------
    // FILTER DATA
    // -----------------------------

    const filteredData = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return salesInvoiceData.filter((row) => {
            const searchValue = search
                .trim()
                .toLowerCase();

            const rowText = Object.values(row)
                .filter(
                    (value) =>
                        value !== null &&
                        value !== undefined
                )
                .join(" ")
                .toLowerCase();

            // SEARCH
            const matchesSearch =
                !searchValue ||
                rowText.includes(searchValue);

            // STATUS
            const rowStatus = String(
                row.status || ""
            ).toLowerCase();

            const matchesStatus =
                !status ||
                rowStatus === status.toLowerCase();

            // CUSTOMER
            const rowCustomer = String(
                row.customer || ""
            ).toLowerCase();

            const matchesCustomer =
                !customer ||
                rowCustomer === customer.toLowerCase();

            // DUE DATE
            let matchesDueDate = true;

            if (dueDate) {
                const invoiceDueDate = new Date(
                    row.due_date
                );

                invoiceDueDate.setHours(0, 0, 0, 0);

                if (dueDate === "due_today") {
                    matchesDueDate =
                        invoiceDueDate.getTime() ===
                        today.getTime();
                }

                if (dueDate === "due_week") {
                    const weekEnd = new Date(today);

                    weekEnd.setDate(
                        today.getDate() + 7
                    );

                    matchesDueDate =
                        invoiceDueDate >= today &&
                        invoiceDueDate <= weekEnd;
                }

                if (dueDate === "overdue") {
                    matchesDueDate =
                        invoiceDueDate < today &&
                        rowStatus !== "completed";
                }

                if (dueDate === "due_later") {
                    const weekEnd = new Date(today);

                    weekEnd.setDate(
                        today.getDate() + 7
                    );

                    matchesDueDate =
                        invoiceDueDate > weekEnd;
                }
            }

            // DATE RANGE
            const matchesStartDate =
                !startDate ||
                row.invoice_date >= startDate;

            const matchesEndDate =
                !endDate ||
                row.invoice_date <= endDate;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesCustomer &&
                matchesDueDate &&
                matchesStartDate &&
                matchesEndDate
            );
        });
    }, [
        search,
        status,
        customer,
        dueDate,
        startDate,
        endDate,
    ]);

    // -----------------------------
    // PAGINATION
    // -----------------------------

    const totalRecords = filteredData.length;

    const totalPages = Math.max(
        1,
        Math.ceil(
            totalRecords / rowsPerPage
        )
    );

    const paginatedData = useMemo(() => {
        const start =
            (currentPage - 1) * rowsPerPage;

        return filteredData.slice(
            start,
            start + rowsPerPage
        );
    }, [
        filteredData,
        currentPage,
    ]);

    // -----------------------------
    // FILTER HANDLERS
    // -----------------------------

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleStatus = (value) => {
        setStatus(value);
        setCurrentPage(1);
    };

    const handleCustomer = (value) => {
        setCustomer(value);
        setCurrentPage(1);
    };

    const handleDueDate = (value) => {
        setDueDate(value);
        setCurrentPage(1);
    };

    // -----------------------------
    // DATE HANDLERS
    // -----------------------------

    const handleStartDateChange = (e) => {
        const value = e.target.value;

        if (!value) {
            setStartDate("");
            setCurrentPage(1);
            return;
        }

        setStartDate(value);
        setCurrentPage(1);

        if (endDate && value > endDate) {
            setEndDate(value);
        }
    };

    const handleEndDateChange = (e) => {
        const value = e.target.value;

        if (!value) {
            setEndDate("");
            setCurrentPage(1);
            return;
        }

        if (
            startDate &&
            value < startDate
        ) {
            return;
        }

        setEndDate(value);
        setCurrentPage(1);
    };

    // -----------------------------
    // EXPORT
    // -----------------------------

    const handleExport = () => {
        if (!filteredData.length) {
            console.log(
                "No data to export"
            );
            return;
        }

        const headers = salesInvoiceColumns
            .filter(
                (column) =>
                    column.accessor !==
                    "actions"
            )
            .map(
                (column) =>
                    column.header
            );

        const accessors = salesInvoiceColumns
            .filter(
                (column) =>
                    column.accessor !==
                    "actions"
            )
            .map(
                (column) =>
                    column.accessor
            );

        const csvRows = [
            headers.join(","),
            ...filteredData.map((row) =>
                accessors
                    .map((accessor) => {
                        const value =
                            row[accessor] ??
                            "";

                        return `"${String(
                            value
                        ).replace(
                            /"/g,
                            '""'
                        )}"`;
                    })
                    .join(",")
            ),
        ];

        const csvContent =
            csvRows.join("\n");

        const blob = new Blob(
            [csvContent],
            {
                type:
                    "text/csv;charset=utf-8;",
            }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;
        link.download =
            "sales-invoices.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    // -----------------------------
    // STATS
    // -----------------------------

    const getStatusCount = (
        targetStatus
    ) => {
        return filteredData.filter(
            (row) =>
                String(
                    row.status || ""
                ).toLowerCase() ===
                targetStatus.toLowerCase()
        ).length;
    };

    const totalAmount = filteredData.reduce(
        (total, row) => {
            const amount = Number(
                String(
                    row.total_amount
                )
                    .replace("SAR", "")
                    .replace(/,/g, "")
                    .trim()
            );

            return total + (
                Number.isNaN(amount)
                    ? 0
                    : amount
            );
        },
        0
    );

    const salesOrderStats = {
        totalOrders: totalRecords,

        totalAmount: ` ${totalAmount.toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }
        )}`,

        completedOrders:
            getStatusCount(
                "Completed"
            ),

        pendingOrders:
            getStatusCount(
                "Pending"
            ),

        cancelledOrders:
            getStatusCount(
                "Cancelled"
            ),
    };

    // -----------------------------
    // RETURN
    // -----------------------------

    return {
        salesInvoiceColumns,

        paginatedData,

        totalRecords,

        totalPages,

        rowsPerPage,

        search,

        status,

        customer,

        dueDate,

        startDate,

        endDate,

        currentPage,

        salesOrderStats,

        handleSearch,

        handleStatus,

        handleCustomer,

        handleDueDate,

        handleStartDateChange,

        handleEndDateChange,

        handleExport,

        setCurrentPage,
    };
};

export default useSalesInvoices;