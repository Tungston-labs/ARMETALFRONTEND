import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import Card from "../Common/Card";
import CardHeader from "../Common/CardHeader";
import Dropdown from "../Common/Dropdown";

import {
  Container,
  ChartContainer,
  LegendContainer,
  LegendItem,
  Dot,
  TooltipBox,
  TooltipTitle,
  TooltipValue,
  TooltipRow,
  TooltipLabel,
} from "./PayrollChart.styles";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <TooltipBox>
        {label && <TooltipTitle color="#1f2937">{label}</TooltipTitle>}

        {payload.map((item) => (
          <TooltipRow key={item.dataKey}>
            <TooltipLabel color={item.fill}>{item.name}</TooltipLabel>
            <TooltipValue>{item.value.toLocaleString()}</TooltipValue>
          </TooltipRow>
        ))}
      </TooltipBox>
    );
  }

  return null;
};

const transformChartData = (apiData) => {
  if (!apiData?.monthly_data) return [];

  return apiData.monthly_data.map((m) => ({
    month: m.month_name.slice(0, 3),
    salary: m.paid_salary,
    incentive: m.incentive,
    deduction: m.deduction,
  }));
};

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear - 5; y <= currentYear + 5; y++) {
    years.push(y);
  }
  return years;
};

const PayrollChart = ({ apiData, selectedYear, onYearChange }) => {
  const chartData = transformChartData(apiData);
  const yearOptions = getYearOptions();

  return (
    <Card>
      <Container>
        <CardHeader
          title="Payroll Summary"
          control={
            <>
              <LegendContainer>
                <LegendItem>
                  <Dot color="#3657C8" />
                  Salary
                </LegendItem>

                <LegendItem>
                  <Dot color="#E58D2B" />
                  Incentive
                </LegendItem>

                <LegendItem>
                  <Dot color="#F44336" />
                  Deduction
                </LegendItem>
              </LegendContainer>

              {/* <Dropdown
                label={String(selectedYear)}
                options={yearOptions.map((y) => ({ label: String(y), value: y }))}
                onSelect={(option) => onYearChange(option.value)}
              /> */}
            </>
          }
        />

        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
         <BarChart data={chartData} barCategoryGap="30%">
  <CartesianGrid
    stroke="#ECECEC"
    vertical={false}
  />

  <XAxis
    dataKey="month"
    tickLine={false}
    axisLine={false}
  />

  <YAxis
    tickLine={false}
    axisLine={false}
    domain={[0, "auto"]}
    tickFormatter={(value) => {
      if (value === 0) return "0";
      if (value < 100000) return `${value / 1000}K`;
      return `${value / 100000}L`;
    }}
  />

  <Tooltip
    cursor={false}
    content={<CustomTooltip />}
  />

  {/* BOTTOM */}
  <Bar
    dataKey="deduction"
    stackId="payroll"
    fill="#F44336"
    name="Deduction"
  />

  {/* MIDDLE */}
  <Bar
    dataKey="incentive"
    stackId="payroll"
    fill="#E58D2B"
    name="Incentive"
  />

  {/* TOP */}
  <Bar
    dataKey="salary"
    stackId="payroll"
    fill="#3657C8"
    name="Salary"
    radius={[6, 6, 0, 0]}
  />
</BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Container>
    </Card>
  );
};

export default PayrollChart;