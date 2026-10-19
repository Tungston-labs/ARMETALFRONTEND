import React from "react";
import {
  Page,
  ContentCard,
  FilterSection,
  SearchBox,
  SearchIcon,
  SearchInput,
  SelectWrapper,
  Select,
  SelectArrow,
  AccountSection,
  SectionHeader,
  SectionTitleWrapper,
  SectionIcon,
  SectionTitle,
  SectionCount,
  SectionTotal,
  TableWrapper,
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  ExportButton,
  BalanceSummary,
  BalanceStatus,
  BalanceTitle,
  BalanceDescription,
  BalanceTotals,
  BalanceItem,
  BalanceLabel,
  BalanceAmount,
} from "./TrialBalance.styles";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import StatsCards from "../../../../Components/StatsCards/StatsCards";
import { CiSearch } from "react-icons/ci";
import { GoVerified } from "react-icons/go";
import { MdAccountBalance } from "react-icons/md";
import { FiCalendar, FiDownload } from "react-icons/fi";
import useTrialBalance, { TYPE_OPTIONS } from "./Usetrialbalance";
import { trialBalanceColumns } from "./TrialBalanceColumns";


const STAT_CARD_STYLES = {
  asset: { icon: <MdAccountBalance />, backgroundColor: "#E8F5E9", iconColor: "#2E7D32" },
  liability: { icon: <FiCalendar />, backgroundColor: "#EDE7F6", iconColor: "#6A1B9A" },
  equity: { icon: <GoVerified />, backgroundColor: "#E0F7EF", iconColor: "#00A86B" },
  revenue: { icon: <FiCalendar />, backgroundColor: "#FFF3E0", iconColor: "#EF6C00" },
  expense: { icon: <FiCalendar />, backgroundColor: "#FDECEA", iconColor: "#D32F2F" },
};

const messageStyle = { padding: "28px 34px", fontFamily: "'Poppins', sans-serif", fontSize: 14 };

const TrialBalance = () => {
  const {
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    sections,
    summary,
    stats,
    loading,
    errorText,
    handleExportExcel,
    handleExportPdf,
  } = useTrialBalance();

  const statsCards = stats.map((stat) => ({
    title: stat.title,
    count: stat.value,
    ...STAT_CARD_STYLES[stat.type],
    onClick: () => setTypeFilter(stat.type),
  }));

  return (
    <Page>
      <ReusableHeader
        title="Trial Balance"
        breadcrumbs={["Accounting", "Trial Balance"]}
      >
        <ExportButton type="button" onClick={handleExportExcel}>
          <FiDownload /> EXPORT EXCEL
        </ExportButton>
        <ExportButton type="button" onClick={handleExportPdf}>
          <FiDownload /> EXPORT PDF
        </ExportButton>
      </ReusableHeader>

      <StatsCards cards={statsCards} />

      {summary.ready && (
        <BalanceSummary>
          <BalanceStatus>
            <BalanceTitle>
              <span>{summary.isBalanced ? "✓" : "✕"}</span>{" "}
              {summary.isBalanced ? "Books Are Balanced" : "Books Are Not Balanced"}
            </BalanceTitle>
            <BalanceDescription>
              {summary.isBalanced
                ? "Total Debit equals Total Credit — no accounting errors detected"
                : "Total Debit does not equal Total Credit — please review your entries"}
            </BalanceDescription>
          </BalanceStatus>

          <BalanceTotals>
            <BalanceItem>
              <BalanceLabel>TOTAL DEBIT</BalanceLabel>
              <BalanceAmount>{summary.debitText}</BalanceAmount>
            </BalanceItem>

            <BalanceItem>
              <BalanceLabel>TOTAL CREDIT</BalanceLabel>
              <BalanceAmount>{summary.creditText}</BalanceAmount>
            </BalanceItem>

            <BalanceItem>
              <BalanceLabel>DIFFERENCE</BalanceLabel>
              <BalanceAmount>{summary.differenceText}</BalanceAmount>
            </BalanceItem>
          </BalanceTotals>
        </BalanceSummary>
      )}

      <ContentCard>
        {/* Filters */}
        <FilterSection>
          <SearchBox>
            <SearchIcon>
              <CiSearch />
            </SearchIcon>

            <SearchInput
              type="text"
              placeholder="Search Account"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </SearchBox>

          <SelectWrapper>
            <Select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <option value="All">All Type</option>
              {TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <SelectArrow>⌄</SelectArrow>
          </SelectWrapper>

          {/* <SelectWrapper>
            <Select
              as="input"
              type="date"
              aria-label="From date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
            />
          </SelectWrapper>

          <SelectWrapper>
            <Select
              as="input"
              type="date"
              aria-label="To date"
              value={dateTo}
              onChange={(event) => setDateTo(event.target.value)}
            />
          </SelectWrapper> */}
        </FilterSection>

        {/* States */}
        {errorText && (
          <div style={{ ...messageStyle, color: "#e01b1b" }}>{errorText}</div>
        )}

        {loading && sections.length === 0 && !errorText && (
          <div style={messageStyle}>Loading trial balance...</div>
        )}

        {!loading && !errorText && sections.length === 0 && (
          <div style={messageStyle}>No accounts found.</div>
        )}

        {/* Account groups */}
        {sections.map(({ type, label, items, className, color, normalBalance, totalText }) => (
          <AccountSection key={type}>
            <SectionHeader className={className}>
              <SectionTitleWrapper>
                <SectionIcon $color={color}>
                  <MdAccountBalance />
                </SectionIcon>
                <div>
                  <SectionTitle>{label.toUpperCase()}</SectionTitle>
                  <SectionCount>Normal balance: {normalBalance}</SectionCount>
                </div>
              </SectionTitleWrapper>

              <SectionTotal>{totalText}</SectionTotal>
            </SectionHeader>

            <TableWrapper>
              <Table>
                <TableHead>
                  <TableRow>
                    {trialBalanceColumns.map((column) => (
                      <TableHeader key={column.key}>{column.label}</TableHeader>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {items.map((account) => (
                    <TableRow key={`${type}-${account.id}`}>
                      {trialBalanceColumns.map((column) => (
                        <TableCell key={column.key}>
                          {column.render(account)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableWrapper>
          </AccountSection>
        ))}
      </ContentCard>
    </Page>
  );
};

export default TrialBalance;