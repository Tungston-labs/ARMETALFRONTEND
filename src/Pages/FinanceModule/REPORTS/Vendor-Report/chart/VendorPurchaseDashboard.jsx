import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
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

const purchaseDataByYear = {
  2026: [
    { name: "Current", amount: 1200, color: "#0789F9" },
    { name: "1-15", amount: 300, color: "#F04438" },
    { name: "15-31", amount: 220, color: "#D946EF" },
    { name: "31-45", amount: 180, color: "#374151" },
    { name: "45-60", amount: 90, color: "#EABF32" },
    { name: "60-90", amount: 50, color: "#17C7C7" },
    { name: "90+", amount: 45, color: "#35B52A" },
  ],
  2025: [
    { name: "Current", amount: 1000, color: "#0789F9" },
    { name: "1-15", amount: 350, color: "#F04438" },
    { name: "15-31", amount: 250, color: "#D946EF" },
    { name: "31-45", amount: 150, color: "#374151" },
    { name: "45-60", amount: 120, color: "#EABF32" },
    { name: "60-90", amount: 75, color: "#17C7C7" },
    { name: "90+", amount: 60, color: "#35B52A" },
  ],
  2024: [
    { name: "Current", amount: 900, color: "#0789F9" },
    { name: "1-15", amount: 280, color: "#F04438" },
    { name: "15-31", amount: 200, color: "#D946EF" },
    { name: "31-45", amount: 160, color: "#374151" },
    { name: "45-60", amount: 100, color: "#EABF32" },
    { name: "60-90", amount: 65, color: "#17C7C7" },
    { name: "90+", amount: 40, color: "#35B52A" },
  ],
};

const paymentDataByMonth = {
  JAN: [
    { name: "Paid", value: 30.4, color: "#43A85D" },
    { name: "Partially Paid", value: 8.1, color: "#3454B9" },
    { name: "Unpaid", value: 4.3, color: "#FF800B" },
    { name: "Overdue", value: 1.8, color: "#E63D32" },
  ],
  FEB: [
    { name: "Paid", value: 28.4, color: "#43A85D" },
    { name: "Partially Paid", value: 7.1, color: "#3454B9" },
    { name: "Unpaid", value: 5.3, color: "#FF800B" },
    { name: "Overdue", value: 2.8, color: "#E63D32" },
  ],
  MAR: [
    { name: "Paid", value: 32.4, color: "#43A85D" },
    { name: "Partially Paid", value: 6.1, color: "#3454B9" },
    { name: "Unpaid", value: 3.3, color: "#FF800B" },
    { name: "Overdue", value: 1.8, color: "#E63D32" },
  ],
};

const years = ["2026", "2025", "2024"];

const months = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

const formatPurchaseAxis = (value) => {
  if (value === 0) return "0";
  if (value >= 1000) return `${value / 1000} M`;
  return `${value}K`;
};

const PurchaseTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <CustomTooltipContainer>
      <TooltipMonth>{item.name}</TooltipMonth>
      <TooltipLabel>Total Purchase</TooltipLabel>
      <TooltipValue>
        {item.amount >= 1000
          ? `SAR ${(item.amount / 1000).toFixed(1)} M`
          : `SAR ${item.amount}K`}
      </TooltipValue>
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
      <TooltipValue>{item.value.toFixed(1)}M SAR</TooltipValue>
    </CustomTooltipContainer>
  );
};

export default function VendorPurchaseDashboard() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("JAN");

  const purchaseData = purchaseDataByYear[selectedYear];
  const paymentData =
    paymentDataByMonth[selectedMonth] || paymentDataByMonth.JAN;

  const outstandingAmount = 5.2;

  return (
    <DashboardContainer>
      {/* Monthly Purchase Trend */}
      <ChartSection>
        <SectionHeader>
          <SectionTitle>Monthly Purchase Trend</SectionTitle>

          <Dropdown
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
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
                domain={[0, 2500]}
                ticks={[0, 500, 1000, 1500, 2000, 2500]}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatPurchaseAxis}
                tick={{ fill: "#555", fontSize: 11 }}
                width={48}
              />

              <Tooltip
                content={<PurchaseTooltip />}
                cursor={false}
              />

              <Bar
                dataKey="amount"
                radius={[12, 12, 12, 12]}
                maxBarSize={25}
                label={{
                  position: "top",
                  formatter: (value) =>
                    value >= 1000
                      ? `${(value / 1000).toFixed(1)}M`
                      : `${value}K`,
                  fill: "#444",
                  fontSize: 10,
                }}
              >
                {purchaseData.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Bar>
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
                  innerRadius="56%"
                  outerRadius="94%"
                  paddingAngle={5}
                  cornerRadius={6}
                  stroke="none"
                >
                  {paymentData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>

                <Tooltip content={<PaymentTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <DoughnutCenter>
              <span>Outstanding</span>
              <strong>SAR {outstandingAmount.toFixed(1)} M</strong>
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

                  <LegendAmount>
                    {item.value.toFixed(1)}M SAR
                  </LegendAmount>
                </LegendRow>

                {index < paymentData.length - 1 && (
                  <LegendDivider />
                )}
              </React.Fragment>
            ))}
          </PaymentLegend>
        </PaymentContent>
      </ChartSection>
    </DashboardContainer>
  );
}