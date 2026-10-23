import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  DashboardContainer,
  ChartSection,
  SectionHeader,
  SectionTitle,
  Dropdown,
  ChartWrapper,
  CustomTooltipContainer,
  TooltipMonth,
  TooltipLabel,
  TooltipValue,
} from "./ExpenseReimbursementTrends.styles";

const expenseDataByYear = {
  2026: [
    { month: "JAN", expense: 21 },
    { month: "FEB", expense: 10 },
    { month: "MAR", expense: 16 },
    { month: "APR", expense: 4.2 },
    { month: "MAY", expense: 9 },
    { month: "JUN", expense: 23 },
    { month: "JUL", expense: 8.5 },
    { month: "AUG", expense: 17 },
  ],
  2025: [
    { month: "JAN", expense: 15 },
    { month: "FEB", expense: 8 },
    { month: "MAR", expense: 19 },
    { month: "APR", expense: 6 },
    { month: "MAY", expense: 12 },
    { month: "JUN", expense: 20 },
    { month: "JUL", expense: 11 },
    { month: "AUG", expense: 18 },
  ],
  2024: [
    { month: "JAN", expense: 12 },
    { month: "FEB", expense: 7 },
    { month: "MAR", expense: 14 },
    { month: "APR", expense: 5 },
    { month: "MAY", expense: 10 },
    { month: "JUN", expense: 17 },
    { month: "JUL", expense: 9 },
    { month: "AUG", expense: 13 },
  ],
};

const reimbursementDataByMonth = {
  JAN: [
    { month: "JAN", reimbursement: 380 },
    { month: "FEB", reimbursement: 720 },
    { month: "MAR", reimbursement: 520 },
    { month: "APR", reimbursement: 65 },
    { month: "MAY", reimbursement: 430 },
    { month: "JUN", reimbursement: 455 },
    { month: "JUL", reimbursement: 980 },
    { month: "AUG", reimbursement: 750 },
  ],
  FEB: [
    { month: "JAN", reimbursement: 450 },
    { month: "FEB", reimbursement: 680 },
    { month: "MAR", reimbursement: 410 },
    { month: "APR", reimbursement: 120 },
    { month: "MAY", reimbursement: 500 },
    { month: "JUN", reimbursement: 600 },
    { month: "JUL", reimbursement: 800 },
    { month: "AUG", reimbursement: 720 },
  ],
  MAR: [
    { month: "JAN", reimbursement: 300 },
    { month: "FEB", reimbursement: 640 },
    { month: "MAR", reimbursement: 480 },
    { month: "APR", reimbursement: 90 },
    { month: "MAY", reimbursement: 390 },
    { month: "JUN", reimbursement: 540 },
    { month: "JUL", reimbursement: 900 },
    { month: "AUG", reimbursement: 700 },
  ],
};

const years = ["2026", "2025", "2024"];

const months = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

const formatExpenseAxis = (value) => `${value} M`;

const formatReimbursementAxis = (value) => {
  if (value === 0) return "0";
  return value >= 1000
    ? `${value / 1000} M`
    : `${value} K`;
};

const ExpenseTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const { month, expense } = payload[0].payload;

  return (
    <CustomTooltipContainer>
      <TooltipMonth>
        {month.charAt(0) + month.slice(1).toLowerCase()}
      </TooltipMonth>

      <TooltipLabel>Total Expense</TooltipLabel>

      <TooltipValue>
        SAR {Number(expense).toFixed(1)} M
      </TooltipValue>
    </CustomTooltipContainer>
  );
};

const ReimbursementTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const { month, reimbursement } = payload[0].payload;

  return (
    <CustomTooltipContainer>
      <TooltipMonth>
        {month.charAt(0) + month.slice(1).toLowerCase()}
      </TooltipMonth>

      <TooltipLabel>Reimbursement</TooltipLabel>

      <TooltipValue>
        SAR {reimbursement}K
      </TooltipValue>
    </CustomTooltipContainer>
  );
};

export default function ExpenseReimbursementTrends() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("JAN");

  const expenseData = expenseDataByYear[selectedYear];
  const reimbursementData =
    reimbursementDataByMonth[selectedMonth] ??
    reimbursementDataByMonth.JAN;

  return (
    <DashboardContainer>
      {/* Monthly Expense Trend */}
      <ChartSection>
        <SectionHeader>
          <SectionTitle>Monthly Expense Trend</SectionTitle>

          <Dropdown
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
            aria-label="Select expense year"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Dropdown>
        </SectionHeader>

        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={expenseData}
              margin={{ top: 10, right: 10, left: 0, bottom: 8 }}
            >
              <CartesianGrid
                stroke="#e8e8e8"
                vertical
                horizontal
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#555", fontSize: 12 }}
                dy={8}
              />

              <YAxis
                domain={[0, 25]}
                ticks={[0, 5, 10, 15, 20, 25]}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatExpenseAxis}
                tick={{ fill: "#555", fontSize: 12 }}
                width={55}
              />

              <Tooltip
                content={<ExpenseTooltip />}
                cursor={false}
              />

              <Line
                type="monotone"
                dataKey="expense"
                stroke="#FF7900"
                strokeWidth={2}
                dot={{
                  r: 3,
                  fill: "#3454B9",
                  stroke: "#3454B9",
                }}
                activeDot={{
                  r: 4,
                  fill: "#3454B9",
                  stroke: "#fff",
                  strokeWidth: 1,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </ChartSection>

      {/* Reimbursement Trend */}
      <ChartSection $last>
        <SectionHeader>
          <SectionTitle>Reimbursement Trend</SectionTitle>

          <Dropdown
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
            aria-label="Select reimbursement month"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </Dropdown>
        </SectionHeader>

        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={reimbursementData}
              margin={{ top: 10, right: 10, left: 0, bottom: 8 }}
            >
              <CartesianGrid
                stroke="#e8e8e8"
                vertical
                horizontal
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#555", fontSize: 12 }}
                dy={8}
              />

              <YAxis
                domain={[0, 1000]}
                ticks={[0, 200, 400, 600, 800, 1000]}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatReimbursementAxis}
                tick={{ fill: "#555", fontSize: 12 }}
                width={58}
              />

              <Tooltip
                content={<ReimbursementTooltip />}
                cursor={false}
              />

              <Line
                type="linear"
                dataKey="reimbursement"
                stroke="#FF7900"
                strokeWidth={2}
                dot={{
                  r: 3,
                  fill: "#3454B9",
                  stroke: "#3454B9",
                }}
                activeDot={{
                  r: 4,
                  fill: "#3454B9",
                  stroke: "#fff",
                  strokeWidth: 1,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>
      </ChartSection>
    </DashboardContainer>
  );
}