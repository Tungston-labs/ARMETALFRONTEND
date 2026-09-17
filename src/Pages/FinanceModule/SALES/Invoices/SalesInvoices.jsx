import React from "react";

import {
    FiDownload,
} from "react-icons/fi";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";
import { useNavigate } from "react-router-dom";
import {
    DateRangeWrapper,
    DatePickerContainer,
    DateInput,
    DateSeparator,
    ExportButton,
} from "./SalesInvoices.styles";

import {
    salesInvoiceStats,
} from "./SalesInvoices.columns";

import useSalesInvoices from "./UseSalesInvoices";

const SalesInvoices = () => {
      const navigate = useNavigate();
    const {
        salesInvoiceColumns,
        paginatedData,
        totalRecords,
        totalPages,

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
    } = useSalesInvoices();

    const statsCards =
        salesInvoiceStats(salesOrderStats);

    return (
        <div style={{ padding: 20 }}>

            {/* HEADER */}

            <ReusableHeader
                title="Invoices"
                breadcrumbs={[
                    "Sales",
                    "Invoices",
                ]}
                buttonText="+ ADD NEW INVOICE"
                onButtonClick={() =>
                    navigate("/sales/invoices/add")
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
                            onChange={
                                handleStartDateChange
                            }
                            max={
                                endDate ||
                                undefined
                            }
                            aria-label="Start date"
                        />

                        <DateSeparator>
                            -
                        </DateSeparator>

                        <DateInput
                            type="date"
                            value={endDate}
                            onChange={
                                handleEndDateChange
                            }
                            min={
                                startDate ||
                                undefined
                            }
                            aria-label="End date"
                        />

                    </DatePickerContainer>
                </DateRangeWrapper>
            </ReusableHeader>

            {/* STATS */}

            <StatsCards
                cards={statsCards}
            />

            {/* FILTERS */}

            <ReusableFilter
                search={search}
                onSearch={handleSearch}
                searchPlaceholder="Search Invoice"
                showSearch

                status={status}
                statuses={[
                    "Completed",
                    "Pending",
                    "Cancelled",
                ]}
                onStatus={handleStatus}
                showStatus

                filters={[
                    {
                        key: "customer",
                        value: customer,
                        onChange:
                            handleCustomer,
                        options: [
                            {
                                label:
                                    "ABC Trading",
                                value:
                                    "ABC Trading",
                            },
                            {
                                label:
                                    "Riyadh Tech",
                                value:
                                    "Riyadh Tech",
                            },
                            {
                                label:
                                    "Al Noor Company",
                                value:
                                    "Al Noor Company",
                            },
                            {
                                label:
                                    "Saudi Solutions",
                                value:
                                    "Saudi Solutions",
                            },
                        ],
                        placeholder:
                            "All Customer",
                    },
                    {
                        key: "dueDate",
                        value: dueDate,
                        onChange:
                            handleDueDate,
                        options: [
                            {
                                label:
                                    "Due Today",
                                value:
                                    "due_today",
                            },
                            {
                                label:
                                    "Due This Week",
                                value:
                                    "due_week",
                            },
                            {
                                label:
                                    "Overdue",
                                value:
                                    "overdue",
                            },
                            {
                                label:
                                    "Due Later",
                                value:
                                    "due_later",
                            },
                        ],
                        placeholder:
                            "All Due Date",
                    },
                ]}

                showFilterButton
                filterButtonText="Filter"
                onFilterClick={() =>
                    console.log(
                        "Filter clicked"
                    )
                }
            />

            {/* TABLE */}

            <ReusableTable
                columns={
                    salesInvoiceColumns
                }
                data={paginatedData}
            />

            {/* PAGINATION */}

            <ReusablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalRecords={
                    totalRecords
                }
                onPageChange={
                    setCurrentPage
                }
            />

        </div>
    );
};

export default SalesInvoices;