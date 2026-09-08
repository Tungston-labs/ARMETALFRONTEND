import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";

import Card from "../Common/Card";
import CardHeader from "../Common/CardHeader";
import Dropdown from "../Common/Dropdown";

import {
  Wrapper,
  ChartWrapper,
  CenterCircle,
  CenterDot,
  CenterLabel,
  CenterValue,
  DetailRow,
  DetailName,
  DetailSub,
  DetailAmount,
} from "./ReimbursementChart.styles";

// ===============================
// Active Sector
// ===============================

const ActiveSector = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
  } = props;

  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius + 7}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      cornerRadius={10}
    />
  );
};


// ===============================
// Idle Sector
// ===============================

const IdleSector = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    fillOpacity,
  } = props;

  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      fillOpacity={fillOpacity}
      cornerRadius={10}
    />
  );
};


// ===============================
// Component
// ===============================

const ReimbursementChart = ({ data = [] }) => {
  const [activeIndex, setActiveIndex] = useState(null);


  // ===============================
  // Calculate total
  // ===============================

  const total = useMemo(
    () =>
      data.reduce(
        (sum, item) => sum + Number(item.value || 0),
        0
      ),
    [data]
  );


  // ===============================
  // Prepare chart data
  // ===============================

  const chartData = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        value: Number(item.value || 0),
        count: Number(item.value || 0),
        amount: Number(item.amount || 0),
        pct:
          total > 0
            ? Math.round(
                (Number(item.value || 0) / total) * 100
              )
            : 0,
      })),
    [data, total]
  );


  // ===============================
  // Active item
  // ===============================

  const active =
    activeIndex !== null
      ? chartData[activeIndex]
      : null;

  const shown = active || chartData[0];


  return (
    <Card>

      <CardHeader
        title="Reimbursement Status"
      />


      <Wrapper>

        {/* ===============================
            Pie Chart
        =============================== */}

        <ChartWrapper>

          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>

              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                startAngle={90}
                endAngle={450}
                innerRadius={62}
                outerRadius={92}
                paddingAngle={3}
                stroke="none"
                cornerRadius={10}
                activeIndex={activeIndex}
                activeShape={ActiveSector}
                inactiveShape={IdleSector}
                onMouseEnter={(_, index) =>
                  setActiveIndex(index)
                }
                onMouseLeave={() =>
                  setActiveIndex(null)
                }
                animationDuration={500}
              >

                {chartData.map((item, index) => (
                  <Cell
                    key={item.name}
                    fill={item.color}
                    fillOpacity={
                      activeIndex === null ||
                      activeIndex === index
                        ? 1
                        : 0.35
                    }
                    style={{
                      transition:
                        "fill-opacity 200ms ease",
                      cursor: "pointer",
                    }}
                  />
                ))}

              </Pie>

            </PieChart>
          </ResponsiveContainer>


          {/* ===============================
              Center Content
          =============================== */}

          <CenterCircle>

            {active ? (
              <>
                <CenterDot color={active.color} />

                <CenterLabel>
                  {active.name}
                </CenterLabel>

                <CenterValue small>
                  {active.pct}%
                </CenterValue>
              </>
            ) : (
              <>
                <CenterLabel muted>
                  Total
                </CenterLabel>

                <CenterValue>
                  {total}
                </CenterValue>
              </>
            )}

          </CenterCircle>

        </ChartWrapper>


        {/* ===============================
            Selected Details
        =============================== */}

        {shown && (
          <DetailRow>

            <div>
              <DetailName color={shown.color}>
                {shown.name} · {shown.count}
              </DetailName>

              <DetailSub>
                {shown.pct}% of total requests
              </DetailSub>
            </div>

            <DetailAmount>
            {shown.count}
            </DetailAmount>

          </DetailRow>
        )}

      </Wrapper>

    </Card>
  );
};


export default ReimbursementChart;