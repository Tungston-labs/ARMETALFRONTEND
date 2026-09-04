import React from "react";
import { useSelector } from "react-redux";
import { FaCalendarAlt } from "react-icons/fa";
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
  RevenueContainer,
  RevenueHeader,
  RevenueTitle,
  MonthButton,
  ChartContainer,
} from "./RevenueOverview.Styles";

const RevenueOverview = () => {
  const { overview } = useSelector((state) => state.superAdmin);
  const revenueData = overview?.revenue_overview || [];

  const maxRevenue = revenueData.length > 0
    ? Math.max(...revenueData.map((r) => r.revenue), 5000)
    : 5000;

  const formatINR = (value) => {
    if (value === 0) return "0";
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${Number(value).toFixed(0)}`;
  };

  const formatTooltip = (value) => {
    if (value >= 100000) return [`₹${(value / 100000).toFixed(2)}L`, "Revenue"];
    if (value >= 1000) return [`₹${(value / 1000).toFixed(2)}K`, "Revenue"];
    return [`₹${Number(value).toFixed(2)}`, "Revenue"];
  };

  return (
    <RevenueContainer>
      <RevenueHeader>
        <RevenueTitle>Revenue Overview</RevenueTitle>

        <MonthButton>
          <FaCalendarAlt />
          THIS MONTH
        </MonthButton>
      </RevenueHeader>

      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={revenueData}
            margin={{
              top: 5,
              right: 5,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid
              horizontal={true}
              vertical={false}
              stroke="#dedede"
            />

            <XAxis
              dataKey="month"
              tick={{
                fontSize: 10,
                fill: "#666",
              }}
              axisLine={{
                stroke: "#888",
              }}
              tickLine={false}
            />

            <YAxis
              domain={[0, maxRevenue]}
              tickFormatter={formatINR}
              tick={{
                fontSize: 10,
                fill: "#666",
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              formatter={formatTooltip}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                fontSize: "11px",
              }}
            />

            <Line
              type="linear"
              dataKey="revenue"
              stroke="#f47c20"
              strokeWidth={2}
              dot={{
                r: 3,
                fill: "#ffffff",
                stroke: "#f47c20",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 5,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </RevenueContainer>
  );
};

export default RevenueOverview;