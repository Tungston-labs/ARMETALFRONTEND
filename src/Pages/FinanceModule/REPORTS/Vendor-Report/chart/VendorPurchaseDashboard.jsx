import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  DashboardContainer,
  ChartSection,
  SectionHeader,
  SectionTitle,
  Dropdown,
  PurchaseChartWrapper,
  PaymentContent,
  DoughnutWrapper,
  DoughnutCenter,
  PaymentLegend,
  LegendRow,
  LegendLeft,
  LegendDot,
  LegendLabel,
  LegendAmount,
  LegendDivider,
  CustomTooltipContainer,
  TooltipMonth,
  TooltipLabel,
  TooltipValue,
} from "./VendorPurchaseDashboard.styles";

const years = ["2026", "2025", "2024"];

const months = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

const formatSAR = (value) =>
  `SAR ${Number(value || 0).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;

// 8395 -> "8.4 K", 2500000 -> "2.5 M"
const formatCompact = (value) => {
  const n = Number(value || 0);
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)} M`;
  if (n >= 1_000) return `${+(n / 1_000).toFixed(1)} K`;
  return String(n);
};

const PurchaseTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <CustomTooltipContainer>
      <TooltipMonth>{item.name}</TooltipMonth>
      <TooltipLabel>Total Purchase</TooltipLabel>
      <TooltipValue>{formatSAR(item.amount)}</TooltipValue>
    </CustomTooltipContainer>
  );
};

const PaymentTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <CustomTooltipContainer>
      <TooltipMonth>{item.name}</TooltipMonth>
      <TooltipLabel>Vendor Payment</TooltipLabel>
      <TooltipValue>{formatSAR(item.value)}</TooltipValue>
    </CustomTooltipContainer>
  );
};

export default function VendorPurchaseDashboard({
  selectedYear,
  selectedMonth, // number 1-12
  onYearChange,
  onMonthChange,
}) {
  const { monthlyPurchaseTrend, vendorPaymentStatus } = useSelector(
    (state) => state.vendorReport.graphs
  );

  // { January: 0, ... } -> [{ name: "JAN", amount: 0 }, ...]
  const purchaseData = useMemo(
    () =>
      Object.entries(monthlyPurchaseTrend.data || {}).map(
        ([month, amount]) => ({
          name: month.slice(0, 3).toUpperCase(),
          amount,
        })
      ),
    [monthlyPurchaseTrend]
  );

  const paymentData = useMemo(
    () => [
      { name: "Paid", value: vendorPaymentStatus?.paidAmount || 0, color: "#43A85D" },
      {
        name: "Partially Paid",
        value: vendorPaymentStatus?.partiallyPaidAmount || 0,
        color: "#3454B9",
      },
      { name: "Unpaid", value: vendorPaymentStatus?.unpaidAmount || 0, color: "#FF800B" },
      { name: "Overdue", value: vendorPaymentStatus?.overdueAmount || 0, color: "#E63D32" },
    ],
    [vendorPaymentStatus]
  );

  const hasPaymentData = paymentData.some((item) => item.value > 0);

  // Grey ring when there is nothing to show
  const pieData = hasPaymentData
    ? paymentData
    : [{ name: "No data", value: 1, color: "#E5E7EB" }];

  return (
    <DashboardContainer>
      {/* Monthly Purchase Trend */}
      <ChartSection>
        <SectionHeader>
          <SectionTitle>Monthly Purchase Trend</SectionTitle>

          <Dropdown
            value={selectedYear}
            onChange={(event) => onYearChange(event.target.value)}
            aria-label="Select purchase year"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Dropdown>
        </SectionHeader>

        <PurchaseChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={purchaseData}
              margin={{ top: 22, right: 8, left: 0, bottom: 8 }}
              barCategoryGap="38%"
            >
              <CartesianGrid stroke="#e8e8e8" />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#555", fontSize: 11 }}
                dy={7}
              />

              <YAxis
                domain={[0, "auto"]}
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatCompact}
                tick={{ fill: "#555", fontSize: 11 }}
                width={48}
              />

              <Tooltip content={<PurchaseTooltip />} cursor={false} />

              <Bar
                dataKey="amount"
                fill="#0789F9"
                radius={[12, 12, 12, 12]}
                maxBarSize={25}
                label={{
                  position: "top",
                  formatter: (value) => (value > 0 ? formatCompact(value) : ""),
                  fill: "#444",
                  fontSize: 10,
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </PurchaseChartWrapper>
      </ChartSection>

      {/* Vendor Payment Status */}
      <ChartSection $last>
        <SectionHeader>
          <SectionTitle>Vendor Payment Status</SectionTitle>

          <Dropdown
            value={selectedMonth}
            onChange={(event) => onMonthChange(event.target.value)}
            aria-label="Select payment month"
          >
            {months.map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </Dropdown>
        </SectionHeader>

        <PaymentContent>
          <DoughnutWrapper>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="56%"
                  outerRadius="94%"
                  paddingAngle={hasPaymentData ? 5 : 0}
                  cornerRadius={6}
                  stroke="none"
                >
                  {pieData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>

                {hasPaymentData && <Tooltip content={<PaymentTooltip />} />}
              </PieChart>
            </ResponsiveContainer>

            <DoughnutCenter>
              <span>Outstanding</span>
              <strong>
                {formatSAR(vendorPaymentStatus?.totalOutstandingAmount)}
              </strong>
            </DoughnutCenter>
          </DoughnutWrapper>

          <PaymentLegend>
            {paymentData.map((item, index) => (
              <React.Fragment key={item.name}>
                <LegendRow>
                  <LegendLeft>
                    <LegendDot $color={item.color} />
                    <LegendLabel>{item.name}</LegendLabel>
                  </LegendLeft>

                  <LegendAmount>{formatSAR(item.value)}</LegendAmount>
                </LegendRow>

                {index < paymentData.length - 1 && <LegendDivider />}
              </React.Fragment>
            ))}
          </PaymentLegend>
        </PaymentContent>
      </ChartSection>
    </DashboardContainer>
  );
}