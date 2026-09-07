import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from "recharts";

import Card from "../Common/Card";
import CardHeader from "../Common/CardHeader";

const ResourceAllocation = ({ data }) => {
  return (
    <Card>
      <CardHeader title="Project Resource Allocation" />

      <div style={{ width: "100%", height: 350, padding: "0 10px 15px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#D9DCE3"
            />

            <XAxis
              dataKey="name"
              tick={{
                fontSize: 12,
                fill: "#374151",
              }}
              tickLine={false}
              axisLine={{ stroke: "#6B7280" }}
            />

            <YAxis
              domain={[0, 20]}
              ticks={[0, 3, 7, 10, 13, 17, 20]}
              tickFormatter={(value) =>
                value < 10 ? `0${value}` : value
              }
              tick={{
                fontSize: 12,
                fill: "#374151",
              }}
              tickLine={false}
              axisLine={{ stroke: "#6B7280" }}
            />

            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              barSize={46}
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.value > 0 ? "#3F5CCF" : "transparent"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ResourceAllocation;