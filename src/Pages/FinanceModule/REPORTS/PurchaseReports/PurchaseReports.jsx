import React, { useMemo } from "react";
import { FiDownload } from "react-icons/fi";

import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusableFilter from "../../../../Components/ReusableTable/ReusableFilter";
import ReusableTable from "../../../../Components/ReusableTable/ReusableTable";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import StatsCards from "../../../../Components/StatsCards/StatsCards";

import PurchaseTrendChart from "./Chart/PurchaseTrendChart";
import usePurchaseReport from "./usePurchaseReport";
import {
  buildPurchaseStatsCards,
  purchaseColumns,
  purchaseStatusOptions,
  billStatusOptions,
  paymentStatusOptions,
} from "./PurchaseReportConfig";

import {
  DateInput,
  DatePickerContainer,
  DateRangeWrapper,
  DateSeparator,
  ExportButton,
  MainReportLayout,
  TableSide,
} from "./PurchaseReports.styles";

const getErrorMessage = (error) =>
  typeof error === "string"
    ? error
    : error?.detail || error?.message || "Something went wrong";

const PurchaseReports = () => {
  const {
    search,
    purchaseStatus,
    billStatus,
    paymentStatus,
    vendor,
    category,
    vendorOptions,
    categoryOptions,
    summary,
    rows,
    chart,
    currentPage,
    totalPages,
    setCurrentPage,
    loading,
    error,
    exporting,
    exportError,
    dateFrom,
    dateTo,
    handleSearch,
    handlePurchaseStatus,
    handleBillStatus,
    handlePaymentStatus,
    handleVendorChange,
    handleCategoryChange,
    handleDateFromChange,
    handleDateToChange,
    handleExport,
  } = usePurchaseReport();

  const statsCards = useMemo(() => buildPurchaseStatsCards(summary), [summary]);

  return (
    <div style={{ padding: 20 }}>
      <ReusableHeader
        title="Purchase Reports"
        breadcrumbs={["Reports", "Purchase Reports"]}
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
          disabled={exporting || rows.length === 0}
        >
          <FiDownload />
          {exporting ? "Exporting..." : "Export Report"}
        </ExportButton>
      </ReusableHeader>

      {(error || exportError) && (
        <p style={{ color: "#DC2626", margin: "8px 0" }} role="alert">
          {getErrorMessage(error || exportError)}
        </p>
      )}

      <StatsCards cards={statsCards} loading={loading} />

      <ReusableFilter
        search={search}
        onSearch={handleSearch}
        status={purchaseStatus}
        statuses={purchaseStatusOptions}
        onStatus={handlePurchaseStatus}
        showSearch
        showStatus
        filters={[
          {
            key: "vendor",
            value: vendor,
            onChange: handleVendorChange,
            options: vendorOptions,
            placeholder: "All Vendors",
          },
          {
            key: "category",
            value: category,
            onChange: handleCategoryChange,
            options: categoryOptions,
            placeholder: "All Categories",
          },
          {
            key: "billStatus",
            value: billStatus,
            onChange: handleBillStatus,
            options: billStatusOptions,
            placeholder: "All Bill Statuses",
          },
          {
            key: "paymentStatus",
            value: paymentStatus,
            onChange: handlePaymentStatus,
            options: paymentStatusOptions,
            placeholder: "All Payment Statuses",
          },
        ]}
      />

      <MainReportLayout>
        <TableSide>
          <ReusableTable
            autoLayout
            columns={purchaseColumns}
            data={rows}
            loading={loading}
          />

          <ReusablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </TableSide>

        <PurchaseTrendChart monthlyTrend={chart.months} loading={loading} />
      </MainReportLayout>
    </div>
  );
};

export default PurchaseReports;
