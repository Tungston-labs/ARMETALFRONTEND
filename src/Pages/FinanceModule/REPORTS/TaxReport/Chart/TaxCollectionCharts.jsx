import React, { useMemo } from "react";
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
  Legend,
  LegendItem,
  LegendColor,
} from "./TaxCollectionCharts.styles";

// Current year and the two before it
const buildYearOptions = () => {
  const current = new Date().getFullYear();
  return [current, current - 1, current - 2];
};

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// 1,500 -> "1.5K", 2,000,000 -> "2M"
const formatAxis = (value) => {
  const n = Number(value || 0);
  if (n >= 1000000) return `${+(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${+(n / 1000).toFixed(1)}K`;
  return `${n}`;
};

const capitalize = (month = "") =>
  month.charAt(0) + month.slice(1).toLowerCase();

const MonthlyTaxTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const { month, output } = payload[0].payload;

  return (
    <CustomTooltipContainer>
      <TooltipMonth>{capitalize(month)}</TooltipMonth>
      <TooltipLabel>Tax Collected</TooltipLabel>
      <TooltipValue>SAR {formatMoney(output)}</TooltipValue>
    </CustomTooltipContainer>
  );
};

const ComparisonTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const { month, output, input } = payload[0].payload;

  return (
    <CustomTooltipContainer>
      <TooltipMonth>{capitalize(month)}</TooltipMonth>
      <TooltipLabel>Output Tax: SAR {formatMoney(output)}</TooltipLabel>
      <TooltipValue>Input Tax: SAR {formatMoney(input)}</TooltipValue>
    </CustomTooltipContainer>
  );
};

/**
 * Props (from the Tax Report page / Redux):
 *  - monthlyTax:   { year, data: [{ month, monthName, outputTax, inputTax }] }
 *  - year:         selected chart year (sent to the API as chart_year)
 *  - onYearChange: called with the new year; the page refetches the report
 *  - loading:      true while the report is loading
 */
const TaxCollectionCharts = ({
  monthlyTax = { year: null, data: [] },
  year,
  onYearChange,
  loading = false,
}) => {
  const years = useMemo(buildYearOptions, []);

  // One series with all 12 months, used by both charts
  const chartData = useMemo(
    () =>
      (monthlyTax.data || []).map((item) => ({
        month: (item.monthName || "").toUpperCase(),
        output: item.outputTax,
        input: item.inputTax,
      })),
    [monthlyTax.data]
  );

  return (
    <DashboardContainer>
      {/* Monthly Tax Collection (output tax collected per month) */}
      <ChartSection>
        <SectionHeader>
          <SectionTitle>Monthly Tax Collection</SectionTitle>

          <Dropdown
            aria-label="Select tax collection year"
            value={year}
            onChange={(event) => onYearChange?.(Number(event.target.value))}
            disabled={loading}
          >
            {years.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Dropdown>
        </SectionHeader>

        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 8 }}
            >
              <CartesianGrid stroke="#e8e8e8" vertical horizontal />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#555", fontSize: 12 }}
                dy={8}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatAxis}
                tick={{ fill: "#555", fontSize: 12 }}
                width={55}
              />

              <Tooltip content={<MonthlyTaxTooltip />} cursor={false} />

              <Line
                type="monotone"
                dataKey="output"
                stroke="#FF7900"
                strokeWidth={2}
                dot={{ r: 3, fill: "#3454B9", stroke: "#3454B9" }}
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

      {/* Output Tax vs Input Tax (same year, all months) */}
      <ChartSection $last>
        <SectionHeader>
          <SectionTitle>
            Output Tax vs Input Tax{year ? ` (${year})` : ""}
          </SectionTitle>
        </SectionHeader>

        <ChartWrapper>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 8 }}
            >
              <CartesianGrid stroke="#e8e8e8" vertical horizontal />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#555", fontSize: 12 }}
                dy={8}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatAxis}
                tick={{ fill: "#555", fontSize: 12 }}
                width={58}
              />

              <Tooltip content={<ComparisonTooltip />} cursor={false} />

              <Line
                type="linear"
                dataKey="output"
                name="Output Tax"
                stroke="#3154c5"
                strokeWidth={2}
                dot={{ r: 3, fill: "#3154c5" }}
                activeDot={{ r: 4 }}
              />

              <Line
                type="linear"
                dataKey="input"
                name="Input Tax"
                stroke="#FF7900"
                strokeWidth={2}
                dot={{ r: 3, fill: "#FF7900" }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <Legend>
          <LegendItem>
            <LegendColor $color="#3154c5" />
            Output Tax
          </LegendItem>

          <LegendItem>
            <LegendColor $color="#FF7900" />
            Input Tax
          </LegendItem>
        </Legend>
      </ChartSection>
    </DashboardContainer>
  );
};

export default TaxCollectionCharts;