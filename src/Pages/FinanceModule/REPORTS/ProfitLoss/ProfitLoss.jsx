import React, { useMemo, useState } from "react";
import {
    DollarSign,
    TrendingUp,
    Wallet,
    ChartNoAxesCombined,
} from "lucide-react";

import {
    ProfitLossContainer,
    StatementTitle,
    StatementTableWrapper,
    StatementTable,
    TableHeader,
    SectionRow,
    DataRow,
    TotalRow,
    DateRangeWrapper,
    DatePickerContainer,
    DateInput,
    DateSeparator,
    ExportButton,
} from "./ProfitLoss.styles";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import StatsCards from "../../../../Components/StatsCards/StatsCards";
import { FiDownload } from "react-icons/fi";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";

const profitLossData = [
    { type: "section", particular: "REVENUE" },
    {
        particular: "Product Sales",
        currentYear: 18500000,
        lastYear: 16450000,
    },
    {
        particular: "Service Revenue",
        currentYear: 8750000,
        lastYear: 7950000,
    },
    {
        particular: "Maintenance Contracts",
        currentYear: 1800000,
        lastYear: 1550000,
    },
    {
        particular: "Other Income",
        currentYear: 1450000,
        lastYear: 1250000,
    },
    {
        type: "total",
        particular: "Total Revenue",
        currentYear: 28500000,
        lastYear: 25200000,
    },
    {
        type: "section",
        particular: "COST OF GOODS SOLD",
    },
    {
        particular: "Direct Materials & Inventory",
        currentYear: 12400000,
        lastYear: 11450000,
    },
    {
        particular: "Direct Labor",
        currentYear: 2650000,
        lastYear: 2350000,
    },
    {
        particular: "Project Costs",
        currentYear: 1750000,
        lastYear: 1600000,
    },
    {
        type: "total",
        particular: "Total Cost of Goods Sold",
        currentYear: 16800000,
        lastYear: 15400000,
    },
    {
        type: "total",
        particular: "Gross Profit",
        currentYear: 11700000,
        lastYear: 9800000,
    },
];
const taxTypeOptions = ["GST", "VAT", "TDS", "Income Tax"];
const customerOptions = ["Customer A", "Customer B", "Customer C"];
const vendorOptions = ["Vendor A", "Vendor B", "Vendor C"];
const invoiceTypeOptions = ["Sales Invoice", "Purchase Invoice", "Credit Note", "Debit Note"];
const taxStatusOptions = ["Paid", "Pending", "Overdue", "Exempt"];
const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-US");

const ProfitLoss = () => {
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("");
    const [status, setStatus] = useState("");
    const [month, setMonth] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [taxType, setTaxType] = useState("");
    const [customer, setCustomer] = useState("");
    const [vendor, setVendor] = useState("");
    const [invoiceType, setInvoiceType] = useState("");
    const [taxStatus, setTaxStatus] = useState("");
    const rowsPerPage = 10;

    const totalRevenue =
        profitLossData.find(
            (item) => item.particular === "Total Revenue"
        )?.currentYear || 0;

    const totalExpenses =
        profitLossData.find(
            (item) => item.particular === "Total Cost of Goods Sold"
        )?.currentYear || 0;

    const grossProfit =
        profitLossData.find(
            (item) => item.particular === "Gross Profit"
        )?.currentYear || 0;

    const netProfit = 8250000;

    const statsCards = [
        {
            title: "Total Revenue",
            count: formatAmount(totalRevenue),
            icon: <DollarSign size={22} />,
            backgroundColor: "#E4F8EC",
            iconColor: "#16A34A",
        },
        {
            title: "Cost of Good Sold",
            count: formatAmount(totalExpenses),
            icon: <Wallet size={22} />,
            backgroundColor: "#FCE7E7",
            iconColor: "#DC2626",
        },
        {
            title: "Gross Profit",
            count: formatAmount(grossProfit),
            icon: <TrendingUp size={22} />,
            backgroundColor: "#E5EDFF",
            iconColor: "#2563EB",
        },
        {
            title: "Operating Expenses",
            count: formatAmount(grossProfit),
            icon: <TrendingUp size={22} />,
            backgroundColor: "#E5EDFF",
            iconColor: "#2563EB",
        },
        {
            title: "Net Profit",
            count: formatAmount(netProfit),
            icon: <ChartNoAxesCombined size={22} />,
            backgroundColor: "#F3E8FF",
            iconColor: "#9333EA",
        },
    ];

    const filteredData = useMemo(() => {
        return profitLossData.filter((item) =>
            item.particular
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [search]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredData.length / rowsPerPage)
    );

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return filteredData.slice(start, start + rowsPerPage);
    }, [filteredData, currentPage]);

    const handleSearch = (value) => {
        setSearch(value);
        setCurrentPage(1);
    };

    const handleDepartment = (value) => {
        setDepartment(value);
        setCurrentPage(1);
    };

    const handleStatus = (value) => {
        setStatus(value);
        setCurrentPage(1);
    };

    const handleMonth = (value) => {
        setMonth(value);
        setCurrentPage(1);
    };
    const createFilterHandler = (setter) => (value) => {
        setter(value);
        setCurrentPage(1);
    };
    const handleExport = () => {
        const header = ["Particular", "Current Year", "Last Year", "Variance"];

        const rows = profitLossData.map((item) => {
            if (item.type === "section") {
                return [item.particular, "", "", ""];
            }
            const variance = (item.currentYear || 0) - (item.lastYear || 0);
            return [item.particular, item.currentYear, item.lastYear, variance];
        });

        const csv = [header, ...rows]
            .map((row) =>
                row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
            )
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "profit-loss-statement.csv";
        link.click();
        URL.revokeObjectURL(url);
    };
    // Keep pagination valid if the search reduces the number of pages.
    React.useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    return (
        <div style={{ padding: 20 }}>
            <ReusableHeader
                title="Profit & Loss Report"
                breadcrumbs={["Reports", "Profit & Loss Report"]}
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
                    Export
                </ExportButton>
            </ReusableHeader>
            {/* Statistics Cards */}
            <StatsCards
                loading={false}
                cards={statsCards}
            />
            <ReusableFilter
                search={search}
                onSearch={handleSearch}
                searchPlaceholder="Search particular"
                showSearch
                filters={[
                    {
                        key: "taxType",
                        value: taxType,
                        onChange: createFilterHandler(setTaxType),
                        options: taxTypeOptions,
                        placeholder: "All Tax Types",
                    },
                    {
                        key: "customer",
                        value: customer,
                        onChange: createFilterHandler(setCustomer),
                        options: customerOptions,
                        placeholder: "All Customers",
                    },
                    {
                        key: "vendor",
                        value: vendor,
                        onChange: createFilterHandler(setVendor),
                        options: vendorOptions,
                        placeholder: "All Vendors",
                    },
                    {
                        key: "invoiceType",
                        value: invoiceType,
                        onChange: createFilterHandler(setInvoiceType),
                        options: invoiceTypeOptions,
                        placeholder: "All Invoice Types",
                    },
                    {
                        key: "taxStatus",
                        value: taxStatus,
                        onChange: createFilterHandler(setTaxStatus),
                        options: taxStatusOptions,
                        placeholder: "All Tax Status",
                    },
                ]}
            />



            {/* Profit & Loss Statement */}
            <ProfitLossContainer>
                <StatementTitle>
                    Profit &amp; Loss Statement
                </StatementTitle>

                <StatementTableWrapper>
                    <StatementTable>
                        <thead>
                            <TableHeader>
                                <th>PARTICULAR</th>
                                <th>CURRENT YEAR</th>
                                <th>LAST YEAR</th>
                                <th>VARIANCE</th>
                            </TableHeader>
                        </thead>

                        <tbody>
                            {paginatedData.map((item, index) => {
                                if (item.type === "section") {
                                    return (
                                        <SectionRow
                                            key={`${item.particular}-${index}`}
                                        >
                                            <td colSpan={4}>
                                                {item.particular}
                                            </td>
                                        </SectionRow>
                                    );
                                }

                                const variance =
                                    (item.currentYear || 0) -
                                    (item.lastYear || 0);

                                const Row =
                                    item.type === "total"
                                        ? TotalRow
                                        : DataRow;

                                return (
                                    <Row
                                        key={`${item.particular}-${index}`}
                                    >
                                        <td>{item.particular}</td>
                                        <td>
                                            {formatAmount(item.currentYear)}
                                        </td>
                                        <td>
                                            {formatAmount(item.lastYear)}
                                        </td>
                                        <td>
                                            {formatAmount(variance)}
                                        </td>
                                    </Row>
                                );
                            })}

                            {paginatedData.length === 0 && (
                                <DataRow>
                                    <td colSpan={4}>
                                        No records found.
                                    </td>
                                </DataRow>
                            )}
                        </tbody>
                    </StatementTable>
                </StatementTableWrapper>

              <ReusablePagination
    currentPage={currentPage}
    totalPages={totalPages}
    totalRecords={filteredData.length}
    onPageChange={setCurrentPage}
/>
            </ProfitLossContainer>
        </div>
    );
};

export default ProfitLoss;