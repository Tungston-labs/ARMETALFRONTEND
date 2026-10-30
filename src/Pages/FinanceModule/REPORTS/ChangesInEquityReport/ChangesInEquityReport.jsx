import React, { useMemo } from "react";
import { FiDownload } from "react-icons/fi";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import StatsCards from "../../../../Components/StatsCards/StatsCards";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import {
  DateInput,
  DatePickerContainer,
  DateRangeWrapper,
  DateSeparator,
  ExportButton,
  MainReportLayout,
  TableSide,
  ReportToolbar,
  ComponentTabs,
  ComponentTab,
  ReportNote,
} from "./ChangesInEquityReport.style";
import EquityComponentsTrend from "./chart/EquityChart";
import useChangesInEquityReport from "./useChangesInEquityReport";
import {
  buildEquityStatsCards,
  equityColumns,
  COMPONENT_TABS,
} from "./changesInEquityConfig";

const getErrorMessage = (error) =>
  typeof error === "string"
    ? error
    : error?.detail || error?.message || "Something went wrong";

const ChangesInEquityReport = ({ companyPk }) => {
  const {
    report,
    rows,
    summary,
    loading,
    error,
    exporting,
    exportError,
    startDate,
    endDate,
    selectedComponent,
    year,
    handleStartDateChange,
    handleEndDateChange,
    handleComponentChange,
    handleYearChange,
    handleExport,
  } = useChangesInEquityReport(companyPk);

  const cards = useMemo(() => buildEquityStatsCards(summary), [summary]);

  return (
    <div style={{ padding: 20, background: "#F4F7FF", minHeight: "100%" }}>
      <ReusableHeader
        title="Statement of Changes in Equity"
        breadcrumbs={["Reports", "Statement of changes in Equity"]}
      >
        <DateRangeWrapper>
          <DatePickerContainer>
            <DateInput
              type="date"
              aria-label="Start date"
              value={startDate}
              max={endDate || undefined}
              onChange={handleStartDateChange}
            />
            <DateSeparator>-</DateSeparator>
            <DateInput
              type="date"
              aria-label="End date"
              value={endDate}
              min={startDate || undefined}
              onChange={handleEndDateChange}
            />
          </DatePickerContainer>
        </DateRangeWrapper>
      </ReusableHeader>

      {(error || exportError) && (
        <p role="alert" style={{ color: "#DC2626", margin: "8px 0" }}>
          {getErrorMessage(error || exportError)}
        </p>
      )}

      <StatsCards cards={cards} loading={loading} />

      <ReportToolbar>
        <ComponentTabs role="tablist" aria-label="Equity component filter">
          {COMPONENT_TABS.map((tab) => (
            <ComponentTab
              key={tab.value}
              type="button"
              $active={selectedComponent === tab.value}
              onClick={() => handleComponentChange(tab.value)}
            >
              {tab.label}
            </ComponentTab>
          ))}
        </ComponentTabs>
        <ExportButton
          type="button"
          onClick={handleExport}
          disabled={exporting || loading}
        >
          <FiDownload /> {exporting ? "Exporting..." : "Export Report"}
        </ExportButton>
      </ReportToolbar>

      <MainReportLayout>
        <TableSide>
          <ReusableTable
            autoLayout
            columns={equityColumns}
            data={rows}
            loading={loading}
          />
          <ReportNote>
            <span>✓</span> Closing = Opening + movements
          </ReportNote>
        </TableSide>
        <EquityComponentsTrend
          components={report?.components}
          year={year}
          onYearChange={handleYearChange}
          loading={loading}
        />
      </MainReportLayout>
    </div>
  );
};

export default ChangesInEquityReport;
