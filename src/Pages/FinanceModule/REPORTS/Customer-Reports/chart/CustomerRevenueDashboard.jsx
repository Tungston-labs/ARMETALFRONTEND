import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
  RevenueChartWrapper,
  PaymentContent,
  DoughnutWrapper,
  DoughnutCenter,
  PaymentLegend,
  LegendRow,
  LegendLabel,
  LegendDot,
  LegendAmount,
  LegendLeft,
} from "./CustomerRevenueDashboard.styles";

const years = ["2026", "2025", "2024"];

const months = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

const formatSAR = (value) =>
  `SAR ${Number(value || 0).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  })}`;

const formatCompact = (value) => {
  const n = Number(value || 0);
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)} M`;
  if (n >= 1_000) return `${+(n / 1_000).toFixed(1)} K`;
  return String(n);
};

const RevenueTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: "10px 16px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
        color: "#34345f",
      }}
    >
      <div style={{ marginBottom: 6 }}>{label}</div>
      <div style={{ marginBottom: 5 }}>Customer Revenue</div>
      <strong>{formatSAR(payload[0].value)}</strong>
    </div>
  );
};

export default function CustomerRevenueDashboard({
  selectedYear,
  selectedMonth,
  onYearChange,
  onMonthChange,
}) {
  const { monthlyRevenue, paymentStatus } = useSelector(
    (state) => state.customerReport.charts
  );

  const revenueData = useMemo(
    () =>
      Object.entries(monthlyRevenue.monthlyAmounts || {}).map(
        ([month, amount]) => ({
          month: month.slice(0, 3).toUpperCase(),
          revenue: amount,
        })
      ),
    [monthlyRevenue]
  );

  const paymentData = useMemo(
    () => [
      { name: "Paid", value: paymentStatus?.paidAmount || 0, color: "#43A85D" },
      {
        name: "Partially Paid",
        value: paymentStatus?.partiallyPaidAmount || 0,
        color: "#3454B9",
      },
      { name: "Unpaid", value: paymentStatus?.unpaidAmount || 0, color: "#FF800B" },
      { name: "Overdue", value: paymentStatus?.overdueAmount || 0, color: "#E63D32" },
    ],
    [paymentStatus]
  );

  const hasPaymentData = paymentData.some((item) => item.value > 0);

  const pieData = hasPaymentData
    ? paymentData
    : [{ name: "No data", value: 1, color: "#E5E7EB" }];

  return (
    <DashboardContainer>
      <ChartSection>
        <SectionHeader>
          <SectionTitle>Monthly Customer Revenue Trend</SectionTitle>

          <Dropdown
            value={selectedYear}
            onChange={(event) => onYearChange(event.target.value)}
            aria-label="Select revenue year"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Dropdown>
        </SectionHeader>

        <RevenueChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={revenueData}
              margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
            >
              <CartesianGrid stroke="#e8e8e8" vertical horizontal />

              <XAxis
                dataKey="month"
                axisLine={{ stroke: "#e5e5e5" }}
                tickLine={false}
                tick={{ fill: "#222", fontSize: 14 }}
                dy={8}
              />

              <YAxis
                domain={[0, "auto"]}
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatCompact}
                tick={{ fill: "#222", fontSize: 14 }}
                width={58}
              />

              <Tooltip content={<RevenueTooltip />} cursor={false} />

              <Line
                type="linear"
                dataKey="revenue"
                stroke="#FF7900"
                strokeWidth={2}
                dot={{
                  r: 3,
                  fill: "#FF7900",
                  stroke: "#FF7900",
                }}
                activeDot={{
                  r: 5,
                  fill: "#FF7900",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </RevenueChartWrapper>
      </ChartSection>

      <ChartSection $paymentSection>
        <SectionHeader>
          <SectionTitle>Customer Payment Status</SectionTitle>

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
                  innerRadius="54%"
                  outerRadius="94%"
                  paddingAngle={hasPaymentData ? 3 : 0}
                  cornerRadius={7}
                  stroke="none"
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>

                {hasPaymentData && (
                  <Tooltip
                    formatter={(value, name) => [formatSAR(value), name]}
                  />
                )}
              </PieChart>
            </ResponsiveContainer>

            <DoughnutCenter>
              <span>Outstanding</span>
              <strong>
                {formatSAR(paymentStatus?.totalOutstandingAmount)}
              </strong>
            </DoughnutCenter>
          </DoughnutWrapper>

          <PaymentLegend>
            {paymentData.map((item) => (
              <LegendRow key={item.name}>
                <LegendLeft>
                  <LegendDot $color={item.color} />
                  <LegendLabel>{item.name}</LegendLabel>
                </LegendLeft>

                <LegendAmount>{formatSAR(item.value)}</LegendAmount>
              </LegendRow>
            ))}
          </PaymentLegend>
        </PaymentContent>
      </ChartSection>
    </DashboardContainer>
  );
}