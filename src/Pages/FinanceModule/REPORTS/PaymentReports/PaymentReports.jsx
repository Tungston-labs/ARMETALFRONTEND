import React from "react";
import { FiDownload, FiRefreshCw, FiSearch } from "react-icons/fi";
import ReusableHeader from "../../../../Components/ReusableTable/ReusableHeader";
import ReusablePagination from "../../../../Components/Pagination/ReusablePagination";
import PaymentTrendCharts from "./Chart/PaymentTrendCharts";
import usePaymentReport from "./usePaymentReport";
import { formatDate, formatSAR } from "./PaymentReportConfig";
import {
  ReportPage,
  KPIGrid,
  KPICard,
  KPIIcon,
  KPIInfo,
  KPIName,
  KPIValue,
  FilterBar,
  DateFilter,
  DateInput,
  FilterSelect,
  MainReportLayout,
  TableSide,
  TableWrapper,
  PaymentTable,
  TableHead,
  TableCell,
  StatusText,
  ExportButton,
  ChartsSide,
  SearchInputWrap,
  SearchInput,
  Notice,
  EmptyState,
} from "./PaymentReports.styles";

export default function PaymentReports() {
  const report = usePaymentReport();
  const { filters, updateFilter } = report;
  return (
    <ReportPage>
      <ReusableHeader
        title="Payment Reports"
        breadcrumbs={["Reports", "Payment Reports"]}
      >
        <ExportButton type="button" onClick={report.exportReport}>
          <FiDownload /> Export Report
        </ExportButton>
      </ReusableHeader>

      {report.error && (
        <Notice $error role="alert">
          {String(report.error)}{" "}
          <button type="button" onClick={report.refresh}>
            Retry
          </button>
        </Notice>
      )}
      {report.loading && <Notice role="status">Loading payment report…</Notice>}

      <KPIGrid>
        {report.kpis.map((item) => (
          <KPICard key={item.title}>
            <KPIIcon $background={item.background} $color={item.color}>
              {item.icon}
            </KPIIcon>
            <KPIInfo>
              <KPIName>{item.title}</KPIName>
              <KPIValue>{item.value}</KPIValue>
            </KPIInfo>
          </KPICard>
        ))}
      </KPIGrid>

      <FilterBar>
        <DateFilter>
          <DateInput
            aria-label="Start date"
            type="date"
            value={filters.startDate}
            max={filters.endDate || undefined}
            onChange={(e) => updateFilter("startDate", e.target.value)}
          />
          <span>–</span>
          <DateInput
            aria-label="End date"
            type="date"
            value={filters.endDate}
            min={filters.startDate || undefined}
            onChange={(e) => updateFilter("endDate", e.target.value)}
          />
        </DateFilter>
        <FilterSelect
          aria-label="Payment type"
          value={filters.paymentType}
          onChange={(e) => updateFilter("paymentType", e.target.value)}
        >
          <option value="all">All Payment Types</option>
          {report.paymentTypeOptions.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          aria-label="Payment method"
          value={filters.method}
          onChange={(e) => updateFilter("method", e.target.value)}
        >
          <option value="all">All Methods</option>
          {report.paymentMethodOptions.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          aria-label="Payment status"
          value={filters.status}
          onChange={(e) => updateFilter("status", e.target.value)}
        >
          <option value="all">All Statuses</option>
          {report.paymentStatusOptions.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          aria-label="Bank account"
          value={filters.bank}
          onChange={(e) => updateFilter("bank", e.target.value)}
        >
          <option value="all">All Banks</option>
          {report.banks.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </FilterSelect>
        <SearchInputWrap>
          <FiSearch />
          <SearchInput
            aria-label="Search payments"
            placeholder="Search payments…"
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
          />
        </SearchInputWrap>
        <ExportButton
          type="button"
          onClick={report.refresh}
          disabled={report.loading}
        >
          <FiRefreshCw /> Refresh
        </ExportButton>
      </FilterBar>

      <MainReportLayout>
        <TableSide>
          <TableWrapper>
            <PaymentTable>
              <TableHead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Customer / Vendor</th>
                  <th>Reference</th>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Bank Account</th>
                </tr>
              </TableHead>
              <tbody>
                {report.rows.map((item) => (
                  <tr key={item.id}>
                    <TableCell>{item.paymentId}</TableCell>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell>{item.type}</TableCell>
                    <TableCell>{item.customer}</TableCell>
                    <TableCell>{item.reference}</TableCell>
                    <TableCell>{item.method}</TableCell>
                    <TableCell>{formatSAR(item.amount)}</TableCell>
                    <TableCell>
                      <StatusText $status={item.status}>
                        {item.status}
                      </StatusText>
                    </TableCell>
                    <TableCell>{item.bank}</TableCell>
                  </tr>
                ))}
                {!report.loading && report.rows.length === 0 && (
                  <tr>
                    <td colSpan={9}>
                      <EmptyState>
                        No payments match the selected filters.
                      </EmptyState>
                    </td>
                  </tr>
                )}
              </tbody>
            </PaymentTable>
          </TableWrapper>
          <ReusablePagination
            currentPage={report.currentPage}
            totalPages={report.totalPages}
            onPageChange={report.setCurrentPage}
          />
        </TableSide>
        <ChartsSide>
          <PaymentTrendCharts rows={report.allRows} />
        </ChartsSide>
      </MainReportLayout>
    </ReportPage>
  );
}
