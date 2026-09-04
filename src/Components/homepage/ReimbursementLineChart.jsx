import React from "react";
import styled from "styled-components";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useNavigate } from "react-router-dom";
import { BsArrowUpRightCircleFill } from "react-icons/bs";

import {
  ChartWrapper,
  ChartTitle,
  ChartContainer,
  IconButton,
} from "./ReimbursementSummary.Styles";


const MonthTickText = styled.text`
  fill: #475569;
  font-weight: 600;
  letter-spacing: 0.2px;
  font-size: 15px;

  @media (max-width: 1440px) {
    font-size: 10px;
  }
`;

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "white",
          padding: "8px 12px",
          border: "1px solid #ddd",
          borderRadius: "5px",
        }}
      >
        <p><strong>{label}</strong></p>
        <p>Amount: <strong>{payload[0].value}</strong></p>
      </div>
    );
  }
  return null;
};

const ReimbursementLineChart = ({ data }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/reimbursement");
  };
  const currentYear = new Date().getFullYear();

 
  const dataMap = {};
  if (data) {
    Object.entries(data).forEach(([yearMonth, count]) => {
      const [year, month] = yearMonth.split("-");
      if (parseInt(year, 10) === currentYear) {
        dataMap[parseInt(month, 10)] = count;
      }
    });
  }

  const chartData = monthNames.map((name, index) => ({
    month: name,
    count: dataMap[index + 1] || 0, 
  }));

  const allZero = chartData.every((item) => item.count === 0);
  // if (!data || allZero) {
  //   return <p style={{ textAlign: "center" }}>No data found for {currentYear}</p>;
  // }

  const CustomMonthTick = ({ x, y, payload }) => (
    <MonthTickText x={x} y={y + 10} textAnchor="middle">
      {payload.value}
    </MonthTickText>
  );

  return (
    <ChartWrapper>
      <ChartTitle>
        <span>Reimbursement Summary - {currentYear}</span>
        <IconButton onClick={handleNavigate}>
          <BsArrowUpRightCircleFill />
        </IconButton>
      </ChartTitle>

      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" interval={0} tick={<CustomMonthTick />} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ChartWrapper>
  );
};


export default ReimbursementLineChart;
