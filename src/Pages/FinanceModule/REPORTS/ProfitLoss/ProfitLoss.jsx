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
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";

import useProfitLoss from "./Useprofitloss";

const formatAmount = (amount) =>
  Number(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const ProfitLoss = () => {
  const {
    kpis,
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
  } = useProfitLoss();

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

        <ExportButton type="button" onClick={handleExport} disabled={loading}>
          <FiDownload />
          Export
        </ExportButton>
      </ReusableHeader>

      {/* Statistics Cards */}
      <StatsCards loading={loading} cards={statsCards} />

      <ReusableFilter
        search={search}
        onSearch={handleSearch}
        searchPlaceholder="Search particular"
        showSearch
      />

      {/* Profit & Loss Statement */}
      <ProfitLossContainer>
        <StatementTitle>Profit &amp; Loss Statement</StatementTitle>

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
                  <td colSpan={4}>{errorMessage}</td>
                </DataRow>
              )}

              {!loading &&
                !error &&
                rows.map((item, index) => {
                  if (item.type === "section") {
                    return (
                      <SectionRow key={`${item.particular}-${index}`}>
                        <td colSpan={4}>{item.particular}</td>
                      </SectionRow>
                    );
                  }

                  const Row = item.type === "total" ? TotalRow : DataRow;

                  return (
                    <Row key={item.key || `${item.particular}-${index}`}>
                      <td>{item.particular}</td>
                      <td>{formatAmount(item.currentYear)}</td>
                      <td>{formatAmount(item.lastYear)}</td>
                      <td>{formatAmount(item.variance)}</td>
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

export default ProfitLoss;
