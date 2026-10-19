import React, { useMemo, useState } from "react";

import {
    employeeColumns,
    employeeData,
} from "../../../../Components/ReusableTable/dummydata";

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

import {
    FiDownload,
    FiUsers,
    FiDollarSign,
    FiCreditCard,
    FiShoppingCart,
} from "react-icons/fi";

const CustomerReport = () => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [customer, setCustomer] = useState("all");
    const [category, setCategory] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);

    const rowsPerPage = 15;

    // Customer report statistics
    const customerStats = [
        {
            title: "Total Customers",
            count: "248",
            icon: <FiUsers />,
            backgroundColor: "#E8F0FF",
            iconColor: "#3B82F6",
        },
        {
            title: "Total Revenue",
            count: "SAR 485,600",
            icon: <FiDollarSign />,
            backgroundColor: "#E6F8EF",
            iconColor: "#16A34A",
        },
         {
            title: "Payments Received",
            count: "SAR 68,450",
            icon: <FiCreditCard />,
            backgroundColor: "#FFF3E0",
            iconColor: "#F59E0B",
        },
        {
            title: "Outstanding Receivables",
            count: "SAR 68,450",
            icon: <FiCreditCard />,
            backgroundColor: "#FFF3E0",
            iconColor: "#F59E0B",
        },
        {
            title: "Total Invoice",
            count: "1,284",
            icon: <FiShoppingCart />,
            backgroundColor: "#F3E8FF",
            iconColor: "#9333EA",
        },
    ];

    // Handle customer filter
    const handleCustomerChange = (value) => {
        setCustomer(value);
        setCurrentPage(1);
    };

    // Handle category filter
    const handleCategoryChange = (value) => {
        setCategory(value);
        setCurrentPage(1);
    };

    // Handle search
    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    // Handle status filter
    const handleStatusChange = (value) => {
        setStatus(value);
        setCurrentPage(1);
    };

    // Filter customer report data
    const filteredData = useMemo(() => {
        return employeeData.filter((item) => {
            const searchValue = search.trim().toLowerCase();

            const matchesSearch =
                !searchValue ||
                Object.values(item).some((value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .includes(searchValue)
                );

            const matchesStatus =
                !status ||
                String(item.status ?? "").toLowerCase() ===
                    status.toLowerCase();

            const customerName = String(
                item.customer ?? item.customerName ?? ""
            )
                .toLowerCase()
                .replace(/\s+/g, "_");

            const matchesCustomer =
                customer === "all" || customerName === customer;

            const itemCategory = String(item.category ?? "")
                .toLowerCase()
                .replace(/\s+/g, "_");

            const matchesCategory =
                category === "all" || itemCategory === category;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesCustomer &&
                matchesCategory
            );
        });
    }, [search, status, customer, category]);

    // Calculate pagination
    const totalPages = Math.max(
        1,
        Math.ceil(filteredData.length / rowsPerPage)
    );

    // Get current page data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * rowsPerPage;

        return filteredData.slice(
            startIndex,
            startIndex + rowsPerPage
        );
    }, [filteredData, currentPage]);

    return (
        <div style={{ padding: 20 }}>
            {/* Page Header */}
            <ReusableHeader
                title="Customer Reports"
                breadcrumbs={["Reports", "Customer Reports"]}
            >
                <ExportButton type="button">
                    <FiDownload />
                    Export Accounts
                </ExportButton>
            </ReusableHeader>

            {/* Customer Statistics Cards */}
            <StatsCards
                cards={customerStats}
                loading={false}
            />

            {/* Search and Filters */}
            <ReusableFilter
                search={search}
                onSearch={handleSearch}
                status={status}
                statuses={[
                    "Active",
                    "Inactive",
                    "Overdue",
                ]}
                onStatus={handleStatusChange}
                showSearch
                showStatus
                filters={[
                    {
                        key: "customer",
                        value: customer,
                        onChange: handleCustomerChange,
                        options: [
                            {
                                label: "All Customers",
                                value: "all",
                            },
                            {
                                label: "ABC Trading LLC",
                                value: "abc_trading",
                            },
                            {
                                label: "Al Noor Trading",
                                value: "al_noor",
                            },
                            {
                                label: "Gulf Supplies",
                                value: "gulf_supplies",
                            },
                            {
                                label: "Saudi Industrial Co.",
                                value: "saudi_industrial",
                            },
                        ],
                        placeholder: "All Customers",
                    },
                    {
                        key: "category",
                        value: category,
                        onChange: handleCategoryChange,
                        options: [
                            {
                                label: "All Categories",
                                value: "all",
                            },
                            {
                                label: "Products",
                                value: "products",
                            },
                            {
                                label: "Services",
                                value: "services",
                            },
                            {
                                label: "Subscriptions",
                                value: "subscriptions",
                            },
                            {
                                label: "Other",
                                value: "other",
                            },
                        ],
                        placeholder: "All Categories",
                    },
                ]}
            />

            {/* Report Table and Revenue Chart */}
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

                <SalesTrendChart />
            </MainReportLayout>
        </div>
    );
};

export default CustomerReport;