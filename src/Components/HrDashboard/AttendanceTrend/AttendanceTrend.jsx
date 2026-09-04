import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

import Card from "../Common/Card";
import CardHeader from "../Common/CardHeader";

import {
  Container,
  ChartContainer,
} from "./AttendanceTrend.styles";

const AttendanceTrend = ({ data = [] }) => {
  return (
    <Card>
      <CardHeader title="Weekly Attendance Trend" />

      <Container>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 15,
                right: 10,
                left: -15,
                bottom: 0,
              }}
            >
              <CartesianGrid
                vertical={false}
                stroke="#E5E7EB"
              />

              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickFormatter={(day) => day.slice(0, 3)}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                domain={[0, "auto"]}
              />

              <Tooltip />

              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
              />

              <ReferenceLine
                x="Thursday"
                stroke="#9CA3AF"
                strokeDasharray="5 5"
              />

              <Line
                type="monotone"
                dataKey="present"
                name="Present"
                stroke="#16A34A"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />

              <Line
                type="monotone"
                dataKey="absent"
                name="Absent"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />

              <Line
                type="monotone"
                dataKey="late"
                name="Late"
                stroke="#FF2D0A"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Container>
    </Card>
  );
};

export default AttendanceTrend;