import React, { useMemo, useState } from "react";
import {
    FiShoppingCart,
    FiDollarSign,
    FiCheckCircle,
    FiClock,
    FiXCircle,
    FiDownload,
} from "react-icons/fi";

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
    DateRangeWrapper,
    DatePickerContainer,
    DateInput,
    DateSeparator,
    ExportButton,
} from "./SalesInvoices.styles";

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

const SalesInvoices = () => {
    const currentMonth = getCurrentMonthRange();

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

    const rowsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const salesOrderStats = [
        {
            title: "Total Orders",
            count: employeeData.length,
            icon: <FiShoppingCart />,
            backgroundColor: "#E8F1FF",
            iconColor: "#3478F6",
        },
        {
            title: "Total Amount",
            count: "SAR 0.00",
            icon: <FiDollarSign />,
            backgroundColor: "#FFF4E5",
            iconColor: "#F59E0B",
        },
        {
            title: "Completed Orders",
            count: 0,
            icon: <FiCheckCircle />,
            backgroundColor: "#E8F8EF",
            iconColor: "#22A06B",
        },
        {
            title: "Pending Orders",
            count: 0,
            icon: <FiClock />,
            backgroundColor: "#FFF4E5",
            iconColor: "#F59E0B",
        },
        {
            title: "Cancelled Orders",
            count: 0,
            icon: <FiXCircle />,
            backgroundColor: "#FDECEC",
            iconColor: "#E5484D",
        },
    ];

    const totalPages = Math.ceil(
        employeeData.length / rowsPerPage
    );

    const paginatedData = useMemo(() => {
        const start =
            (currentPage - 1) * rowsPerPage;

        return employeeData.slice(
            start,
            start + rowsPerPage
        );
    }, [currentPage]);

    const handleStartDateChange = (e) => {
        const value = e.target.value;

        if (!value) {
            setStartDate("");
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
            return;
        }

        if (startDate && value < startDate) {
            return;
        }

        setEndDate(value);
        setCurrentPage(1);
    };

    const handleExport = () => {
        console.log("Export Sales Orders", {
            startDate,
            endDate,
            search,
            status,
            customer,
        });

        // Add Excel/PDF export logic here
    };

    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="Invoices"
                breadcrumbs={[
                    "Sales",
                    "Invoices",
                ]}
                buttonText="+ ADD NEW INVOICE"
                onButtonClick={() =>
                    console.log("Add Sales invoice")
                }
            >
                <ExportButton
                    type="button"
                    onClick={handleExport}
                >
                    <FiDownload />
                    <span>Export</span>
                </ExportButton>
                <DateRangeWrapper>
                    <DatePickerContainer>
                        <DateInput
                            type="date"
                            value={startDate}
                            onChange={handleStartDateChange}
                            max={endDate || undefined}
                            aria-label="Start date"
                        />

                        <DateSeparator>
                            -
                        </DateSeparator>

                        <DateInput
                            type="date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            min={startDate || undefined}
                            aria-label="End date"
                        />
                    </DatePickerContainer>


                </DateRangeWrapper>
            </ReusableHeader>

            <StatsCards
                cards={salesOrderStats}
            />

            <ReusableFilter
                search={search}
                onSearch={(value) => {
                    setSearch(value);
                    setCurrentPage(1);
                }}
                searchPlaceholder="Search Order"
                showSearch

                status={status}
                statuses={[
                    "Completed",
                    "Pending",
                    "Cancelled",
                ]}
                onStatus={(value) => {
                    setStatus(value);
                    setCurrentPage(1);
                }}
                showStatus

                filters={[
                    {
                        key: "customer",
                        value: customer,
                        onChange: (value) => {
                            setCustomer(value);
                            setCurrentPage(1);
                        },
                        options: [
                            {
                                label: "ABC Trading",
                                value: "ABC Trading",
                            },
                            {
                                label: "Riyadh Tech",
                                value: "Riyadh Tech",
                            },
                            {
                                label: "Al Noor Company",
                                value: "Al Noor Company",
                            },
                            {
                                label: "Saudi Solutions",
                                value: "Saudi Solutions",
                            },
                        ],
                        placeholder: "All Customer",
                    },
                    {
                        key: "dueDate",
                        value: dueDate,
                        onChange: (value) => {
                            setDueDate(value);
                            setCurrentPage(1);
                        },
                        options: [
                            {
                                label: "Due Today",
                                value: "due_today",
                            },
                            {
                                label: "Due This Week",
                                value: "due_week",
                            },
                            {
                                label: "Overdue",
                                value: "overdue",
                            },
                            {
                                label: "Due Later",
                                value: "due_later",
                            },
                        ],
                        placeholder: "All Due Date",
                    },
                ]}

                showFilterButton
                filterButtonText="Filter"
                onFilterClick={() => {
                    console.log("Filter clicked");
                }}
            />

            <ReusableTable
                columns={employeeColumns}
                data={paginatedData}
            />

            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default SalesInvoices;