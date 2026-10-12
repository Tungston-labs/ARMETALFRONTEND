
import React, { useState } from "react";
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

const revenueData = [
  { month: "JAN", revenue: 6.2 },
  { month: "FEB", revenue: 9.6 },
  { month: "MAR", revenue: 7.8 },
  { month: "APR", revenue: 2.8 },
  { month: "MAY", revenue: 6.9 },
  { month: "JUN", revenue: 7.0 },
  { month: "JUL", revenue: 5.2 },
  { month: "AUG", revenue: 4.4 },
];

const paymentData = [
  { name: "Paid", value: 30.4, color: "#43A85D" },
  { name: "Partially Paid", value: 8.1, color: "#3454B9" },
  { name: "Unpaid", value: 4.3, color: "#FF800B" },
  { name: "Overdue", value: 1.8, color: "#E63D32" },
];

const years = ["2026", "2025", "2024"];

const months = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

const formatRevenue = (value) => `${value} M`;

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
      <strong>SAR {Number(payload[0].value).toFixed(1)} M</strong>
    </div>
  );
};

export default function CustomerRevenueDashboard() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("JAN");

  return (
    <DashboardContainer>
      {/* Monthly Customer Revenue Trend */}
      <ChartSection>
        <SectionHeader>
          <SectionTitle>Monthly Customer Revenue Trend</SectionTitle>

          <Dropdown
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
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
              <CartesianGrid
                stroke="#e8e8e8"
                vertical
                horizontal
              />

              <XAxis
                dataKey="month"
                axisLine={{ stroke: "#e5e5e5" }}
                tickLine={false}
                tick={{ fill: "#222", fontSize: 14 }}
                dy={8}
              />

              <YAxis
                domain={[0, 10]}
                ticks={[0, 2, 4, 6, 8, 10]}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatRevenue}
                tick={{ fill: "#222", fontSize: 14 }}
                width={58}
              />

              <Tooltip
                content={<RevenueTooltip />}
                cursor={false}
              />

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

      {/* Customer Payment Status */}
      <ChartSection $paymentSection>
        <SectionHeader>
          <SectionTitle>Customer Payment Status</SectionTitle>

          <Dropdown
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            aria-label="Select payment month"
          >
            {months.map((month) => (
              <option key={month} value={month}>
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
                  data={paymentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="54%"
                  outerRadius="94%"
                  paddingAngle={3}
                  cornerRadius={7}
                  stroke="none"
                >
                  {paymentData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.color}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [
                    `${value} M SAR`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>

            <DoughnutCenter>
              <span>Outstanding</span>
              <strong>SAR 5.2 M</strong>
            </DoughnutCenter>
          </DoughnutWrapper>

          <PaymentLegend>
            {paymentData.map((item) => (
              <LegendRow key={item.name}>
                <LegendLeft>
                  <LegendDot $color={item.color} />
                  <LegendLabel>{item.name}</LegendLabel>
                </LegendLeft>

                <LegendAmount>
                  {item.value.toFixed(1)}M SAR
                </LegendAmount>
              </LegendRow>
            ))}
          </PaymentLegend>
        </PaymentContent>
      </ChartSection>
    </DashboardContainer>
  );
}


