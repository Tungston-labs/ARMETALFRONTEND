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
    ClosingBalanceRow,
    ClosingBalanceLabel,
    ClosingBalanceAmount,
} from "./CashFlow.style";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import StatsCards from "../../../../Components/StatsCards/StatsCards";
import { FiDownload } from "react-icons/fi";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";

// NOTE: adjust this path to where you saved the slice in your project
import {
    getCashFlowReport,
    clearCashFlowReportError,
} from "../../../../Redux/finance/reports/Cashflowreportslice";

// API amounts are strings like "1000.00"
const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const getErrorMessage = (error) =>
    typeof error === "string"
        ? error
        : error?.detail || error?.message || "Failed to load cash flow report";

const CashFlow = () => {
    const dispatch = useDispatch();

    const { summary, sections, totals, currency, loading, error } = useSelector(
        (state) => state.cashFlowReport
    );

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const rowsPerPage = 10;

    // Fetch on mount and whenever the date range changes.
    // Empty dates => backend returns the default (current month to date).
    useEffect(() => {
        const params = {};
        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;

        const request = dispatch(getCashFlowReport(params));
        return () => request.abort();
    }, [dispatch, dateFrom, dateTo]);

    const statsCards = [
        {
            title: "Opening Balance",
            count: formatAmount(summary.openingBalance),
            icon: <DollarSign size={22} />,
            backgroundColor: "#E4F8EC",
            iconColor: "#16A34A",
        },
        {
            title: "Cash Inflow",
            count: formatAmount(summary.cashInflow),
            icon: <Wallet size={22} />,
            backgroundColor: "#FCE7E7",
            iconColor: "#DC2626",
        },
        {
            title: "Cash Outflow",
            count: formatAmount(summary.cashOutflow),
            icon: <TrendingUp size={22} />,
            backgroundColor: "#E5EDFF",
            iconColor: "#2563EB",
        },
        {
            title: "Net Cash Flow",
            count: formatAmount(summary.netCashFlow),
            icon: <TrendingUp size={22} />,
            backgroundColor: "#E5EDFF",
            iconColor: "#2563EB",
        },
        {
            title: "Closing Balance",
            count: formatAmount(summary.closingBalance),
            icon: <ChartNoAxesCombined size={22} />,
            backgroundColor: "#F3E8FF",
            iconColor: "#9333EA",
        },
    ];

    // Flatten the API sections into the row format the table already uses:
    // { type: "section" | "total" | undefined, particular, cashIn, cashOut, netAmount }
    const cashFlowData = useMemo(() => {
        const rows = [];

        [sections.operating, sections.investing, sections.financing].forEach(
            (section) => {
                rows.push({
                    type: "section",
                    particular: section.label.toUpperCase(),
                });

                section.rows.forEach((row) =>
                    rows.push({
                        key: `${section.label}-${row.id}`,
                        particular: row.particular,
                        cashIn: row.cashIn,
                        cashOut: row.cashOut,
                        netAmount: row.netAmount,
                    })
                );

                rows.push({
                    type: "total",
                    particular: `Net Cash from ${section.label}`,
                    cashIn: section.cashIn,
                    cashOut: section.cashOut,
                    netAmount: section.netAmount,
                });
            }
        );

        rows.push({
            type: "total",
            particular: "Net Cash Flow",
            cashIn: totals.cashIn,
            cashOut: totals.cashOut,
            netAmount: totals.netCashFlow,
        });

        return rows;
    }, [sections, totals]);

    const filteredData = useMemo(() => {
        return cashFlowData.filter((item) =>
            item.particular
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [cashFlowData, search]);

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
        if (error) dispatch(clearCashFlowReportError());
    };

    const handleDateToChange = (e) => {
        setDateTo(e.target.value);
        setCurrentPage(1);
        if (error) dispatch(clearCashFlowReportError());
    };

    const handleExport = () => {
        const header = [
            "Particular",
            `Cash In (${currency})`,
            `Cash Out (${currency})`,
            `Net Amount (${currency})`,
        ];

        const rows = cashFlowData.map((item) => {
            if (item.type === "section") {
                return [item.particular, "", "", ""];
            }
            return [item.particular, item.cashIn, item.cashOut, item.netAmount];
        });

        rows.push(["Opening Cash Balance", "", "", summary.openingBalance]);
        rows.push(["Closing Cash Balance", "", "", summary.closingBalance]);

        const csv = [header, ...rows]
            .map((row) =>
                row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")
            )
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "cash-flow-statement.csv";
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
                title="Cash Flow"
                breadcrumbs={["Reports", "Cash Flow"]}
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
                searchPlaceholder="Search Account"
                showSearch
            />

            <ProfitLossContainer>
                <StatementTableWrapper>
                    <StatementTable>
                        <thead>
                            <TableHeader>
                                <th>PARTICULAR</th>
                                <th>Cash In ({currency})</th>
                                <th>Cash Out ({currency})</th>
                                <th>Net Amount ({currency})</th>
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
                                                {formatAmount(item.cashIn)}
                                            </td>
                                            <td>
                                                {formatAmount(item.cashOut)}
                                            </td>
                                            <td
                                                className={
                                                    Number(item.cashOut || 0) > 0
                                                        ? "negative"
                                                        : Number(item.cashIn || 0) > 0
                                                            ? "positive"
                                                            : ""
                                                }
                                            >
                                                {formatAmount(item.netAmount)}
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

                <ClosingBalanceRow>
                    <ClosingBalanceLabel>
                        Closing Cash Balance
                    </ClosingBalanceLabel>

                    <ClosingBalanceAmount>
                        {formatAmount(summary.closingBalance)} {currency}
                    </ClosingBalanceAmount>
                </ClosingBalanceRow>

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

export default CashFlow;