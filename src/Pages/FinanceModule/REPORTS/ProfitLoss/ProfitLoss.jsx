import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

// NOTE: adjust this path to where you saved the slice in your project
import {
    getProfitLossReport,
    clearProfitLossReportError,
} from "../../../../Redux/finance/reports/Profitlossreportslice";

// API amounts are strings like "1000.00"
const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const getErrorMessage = (error) =>
    typeof error === "string"
        ? error
        : error?.detail || error?.message || "Failed to load profit & loss report";

const ProfitLoss = () => {
    const dispatch = useDispatch();

    const { kpis, sections, loading, error } = useSelector(
        (state) => state.profitLossReport
    );

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const rowsPerPage = 10;

    // Fetch on mount and whenever the date range changes.
    // Empty dates => backend returns the default year-to-date report.
    useEffect(() => {
        const params = {};
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;

        const request = dispatch(getProfitLossReport(params));
        return () => request.abort();
    }, [dispatch, dateFrom, dateTo]);

    const statsCards = [
        {
            title: "Total Revenue",
            count: formatAmount(kpis.totalRevenue),
            icon: <DollarSign size={22} />,
            backgroundColor: "#E4F8EC",
            iconColor: "#16A34A",
        },
        {
            title: "Cost of Good Sold",
            count: formatAmount(kpis.costOfGoodsSold),
            icon: <Wallet size={22} />,
            backgroundColor: "#FCE7E7",
            iconColor: "#DC2626",
        },
        {
            title: "Gross Profit",
            count: formatAmount(kpis.grossProfit),
            icon: <TrendingUp size={22} />,
            backgroundColor: "#E5EDFF",
            iconColor: "#2563EB",
        },
        {
            title: "Operating Expenses",
            count: formatAmount(kpis.operatingExpenses),
            icon: <TrendingUp size={22} />,
            backgroundColor: "#E5EDFF",
            iconColor: "#2563EB",
        },
        {
            title: "Net Profit",
            count: formatAmount(kpis.netProfit),
            icon: <ChartNoAxesCombined size={22} />,
            backgroundColor: "#F3E8FF",
            iconColor: "#9333EA",
        },
    ];

    // Flatten the API sections into the same row format the table already uses:
    // { type: "section" | "total" | undefined, particular, currentYear, lastYear, variance }
    const profitLossData = useMemo(() => {
        const rows = [];

        const addSection = (title, section, totalLabel) => {
            rows.push({ type: "section", particular: title });

            section.rows.forEach((row) =>
                rows.push({
                    key: `${title}-${row.accountId ?? row.particular}`,
                    particular: row.particular,
                    currentYear: row.currentYear,
                    lastYear: row.lastYear,
                    variance: row.variance,
                })
            );

            rows.push({
                type: "total",
                particular: totalLabel,
                currentYear: section.total,
                lastYear: section.lastYearTotal,
                variance: section.variance,
            });
        };

        const addResult = (label, result) =>
            rows.push({
                type: "total",
                particular: label,
                currentYear: result.currentYear,
                lastYear: result.lastYear,
                variance: result.variance,
            });

        addSection("REVENUE", sections.revenue, "Total Revenue");
        addSection(
            "COST OF GOODS SOLD",
            sections.costOfGoodsSold,
            "Total Cost of Goods Sold"
        );
        addResult("Gross Profit", sections.grossProfit);
        addSection(
            "OPERATING EXPENSES",
            sections.operatingExpenses,
            "Total Operating Expenses"
        );

        // Only show Other Expenses when there is something in it
        if (sections.otherExpenses.rows.length > 0) {
            addSection(
                "OTHER EXPENSES",
                sections.otherExpenses,
                "Total Other Expenses"
            );
        }

        addResult("Net Profit", sections.netProfit);

        return rows;
    }, [sections]);

    const filteredData = useMemo(() => {
        return profitLossData.filter((item) =>
            item.particular
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [profitLossData, search]);

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

    const handleDateFromChange = (e) => {
        setDateFrom(e.target.value);
        setCurrentPage(1);
        if (error) dispatch(clearProfitLossReportError());
    };

    const handleDateToChange = (e) => {
        setDateTo(e.target.value);
        setCurrentPage(1);
        if (error) dispatch(clearProfitLossReportError());
    };

    const handleExport = () => {
        const header = ["Particular", "Current Year", "Last Year", "Variance"];

        const rows = profitLossData.map((item) => {
            if (item.type === "section") {
                return [item.particular, "", "", ""];
            }
            return [
                item.particular,
                item.currentYear,
                item.lastYear,
                item.variance,
            ];
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
    useEffect(() => {
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
                            value={dateFrom}
                            max={dateTo || undefined}
                            onChange={handleDateFromChange}
                        />

                        <DateSeparator>-</DateSeparator>

                        <DateInput
                            type="date"
                            aria-label="End date"
                            value={dateTo}
                            min={dateFrom || undefined}
                            onChange={handleDateToChange}
                        />
                    </DatePickerContainer>
                </DateRangeWrapper>

                <ExportButton
                    type="button"
                    onClick={handleExport}
                    disabled={loading}
                >
                    <FiDownload />
                    Export
                </ExportButton>
            </ReusableHeader>

            {/* Statistics Cards */}
            <StatsCards
                loading={loading}
                cards={statsCards}
            />

            <ReusableFilter
                search={search}
                onSearch={handleSearch}
                searchPlaceholder="Search particular"
                showSearch
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
                            {loading && (
                                <DataRow>
                                    <td colSpan={4}>Loading...</td>
                                </DataRow>
                            )}

                            {!loading && error && (
                                <DataRow>
                                    <td colSpan={4}>
                                        {getErrorMessage(error)}
                                    </td>
                                </DataRow>
                            )}

                            {!loading &&
                                !error &&
                                paginatedData.map((item, index) => {
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

                                    const Row =
                                        item.type === "total"
                                            ? TotalRow
                                            : DataRow;

                                    return (
                                        <Row
                                            key={item.key || `${item.particular}-${index}`}
                                        >
                                            <td>{item.particular}</td>
                                            <td>
                                                {formatAmount(item.currentYear)}
                                            </td>
                                            <td>
                                                {formatAmount(item.lastYear)}
                                            </td>
                                            <td>
                                                {formatAmount(item.variance)}
                                            </td>
                                        </Row>
                                    );
                                })}

                            {!loading &&
                                !error &&
                                paginatedData.length === 0 && (
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