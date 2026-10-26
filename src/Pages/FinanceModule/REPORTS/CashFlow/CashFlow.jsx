import React from "react";
import {
    DollarSign,
    TrendingUp,
    Wallet,
    ChartNoAxesCombined,
} from "lucide-react";
import { FiDownload } from "react-icons/fi";

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
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";

import useCashFlow from "./Usecashflow";

const formatAmount = (amount) =>
    Number(amount || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

const getNetClass = (item) =>
    Number(item.cashOut || 0) > 0
        ? "negative"
        : Number(item.cashIn || 0) > 0
        ? "positive"
        : "";

const CashFlow = () => {
    const {
        summary,
        currency,
        loading,
        error,
        errorMessage,
        search,
        dateFrom,
        dateTo,
        currentPage,
        totalPages,
        totalRecords,
        rows,
        handleSearch,
        handleDateFromChange,
        handleDateToChange,
        handleExport,
        setCurrentPage,
    } = useCashFlow();

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

            <StatsCards loading={loading} cards={statsCards} />

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
                                    <td colSpan={4}>{errorMessage}</td>
                                </DataRow>
                            )}

                            {!loading &&
                                !error &&
                                rows.map((item, index) => {
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
                                            key={
                                                item.key ||
                                                `${item.particular}-${index}`
                                            }
                                        >
                                            <td>{item.particular}</td>
                                            <td>{formatAmount(item.cashIn)}</td>
                                            <td>{formatAmount(item.cashOut)}</td>
                                            <td className={getNetClass(item)}>
                                                {formatAmount(item.netAmount)}
                                            </td>
                                        </Row>
                                    );
                                })}

                            {!loading && !error && rows.length === 0 && (
                                <DataRow>
                                    <td colSpan={4}>No records found.</td>
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
                    totalRecords={totalRecords}
                    onPageChange={setCurrentPage}
                />
            </ProfitLossContainer>
        </div>
    );
};

export default CashFlow;