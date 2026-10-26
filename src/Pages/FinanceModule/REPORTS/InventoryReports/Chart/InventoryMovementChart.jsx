
import React, { useState } from "react";

import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  YearSelect,
  ChartSvg,
} from "./InventoryMovementChart.styles";

const inventoryTrend = {
  2026: [
    { month: "JAN", value: 2.1 },
    { month: "FEB", value: 2.9 },
    { month: "MAR", value: 2.4 },
    { month: "APR", value: 1.4 },
    { month: "MAY", value: 2.3 },
    { month: "JUN", value: 2.35 },
    { month: "JUL", value: 3.5 },
    { month: "AUG", value: 4.15 },
    { month: "SEP", value: 4.18 },
    { month: "OCT", value: 4.95 },
    { month: "NOV", value: 5.55 },
  ],
  2025: [
    { month: "JAN", value: 1.6 },
    { month: "FEB", value: 2.0 },
    { month: "MAR", value: 2.3 },
    { month: "APR", value: 1.8 },
    { month: "MAY", value: 2.7 },
    { month: "JUN", value: 3.1 },
    { month: "JUL", value: 3.4 },
    { month: "AUG", value: 3.8 },
    { month: "SEP", value: 4.0 },
    { month: "OCT", value: 4.4 },
    { month: "NOV", value: 4.7 },
  ],
  2024: [
    { month: "JAN", value: 1.2 },
    { month: "FEB", value: 1.5 },
    { month: "MAR", value: 1.9 },
    { month: "APR", value: 2.1 },
    { month: "MAY", value: 2.4 },
    { month: "JUN", value: 2.8 },
    { month: "JUL", value: 3.0 },
    { month: "AUG", value: 3.3 },
    { month: "SEP", value: 3.7 },
    { month: "OCT", value: 4.0 },
    { month: "NOV", value: 4.5 },
  ],
};

const WIDTH = 390;
const HEIGHT = 440;
const LEFT = 40;
const RIGHT = 8;
const TOP = 14;
const BOTTOM = 34;
const MIN_VALUE = 1;
const MAX_VALUE = 5.8;

const Y_TICKS = [
  { value: 5.8, label: "5.8M" },
  { value: 5.4, label: "5.4M" },
  { value: 5.2, label: "5.2M" },
  { value: 4.8, label: "4.8M" },
  { value: 4.4, label: "4.4M" },
  { value: 4.2, label: "4.2M" },
  { value: 3.8, label: "3.8M" },
  { value: 3.3, label: "3.3M" },
  { value: 2.8, label: "2.8M" },
  { value: 2.2, label: "2.2M" },
  { value: 1.6, label: "1.6M" },
  { value: 1, label: "1M" },
];

const InventoryMovementChart = () => {
  const [year, setYear] = useState("2026");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const data = inventoryTrend[year];

  const plotWidth = WIDTH - LEFT - RIGHT;
  const plotHeight = HEIGHT - TOP - BOTTOM;

  const x = (index) =>
    LEFT + (index / (data.length - 1)) * plotWidth;

  const y = (value) =>
    TOP +
    ((MAX_VALUE - value) / (MAX_VALUE - MIN_VALUE)) * plotHeight;

  const points = data
    .map((item, index) => `${x(index)},${y(item.value)}`)
    .join(" ");

  const activeItem =
    hoveredIndex === null ? null : data[hoveredIndex];

  const tooltipX =
    hoveredIndex === null
      ? 0
      : Math.max(
          LEFT,
          Math.min(x(hoveredIndex) - 48, WIDTH - 105)
        );

  const tooltipY =
    activeItem === null
      ? 0
      : Math.max(4, y(activeItem.value) - 64);

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Monthly Inventory Movement</ChartTitle>

        <YearSelect
          value={year}
          aria-label="Inventory report year"
          onChange={(event) => {
            setYear(event.target.value);
            setHoveredIndex(null);
          }}
        >
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </YearSelect>
      </ChartHeader>

      <ChartSvg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={`Monthly inventory movement for ${year}`}
      >
        {/* Horizontal grid lines and Y-axis labels */}
        {Y_TICKS.map((tick) => (
          <g key={tick.label}>
            <line
              x1={LEFT}
              y1={y(tick.value)}
              x2={WIDTH - RIGHT}
              y2={y(tick.value)}
              className="grid-line"
            />

            <text
              x={LEFT - 8}
              y={y(tick.value) + 3}
              textAnchor="end"
              className="axis-label"
            >
              {tick.label}
            </text>
          </g>
        ))}

        {/* Vertical grid lines */}
        {data.map((item, index) => (
          <line
            key={`grid-${item.month}`}
            x1={x(index)}
            y1={TOP}
            x2={x(index)}
            y2={HEIGHT - BOTTOM}
            className="grid-line"
          />
        ))}

        {/* Orange trend line */}
        <polyline
          points={points}
          fill="none"
          stroke="#ff7900"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Interactive points */}
        {data.map((item, index) => (
          <g
            key={item.month}
            tabIndex={0}
            role="button"
            aria-label={`${item.month}: SAR ${item.value} million`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(index)}
            onBlur={() => setHoveredIndex(null)}
          >
            <circle
              cx={x(index)}
              cy={y(item.value)}
              r="9"
              fill="transparent"
              style={{ cursor: "pointer" }}
            />

            <circle
              cx={x(index)}
              cy={y(item.value)}
              r="2"
              fill="#3154b5"
              pointerEvents="none"
            />
          </g>
        ))}

        {/* Tooltip */}
        {activeItem && (
          <g pointerEvents="none">
            <rect
              x={tooltipX}
              y={tooltipY}
              width="98"
              height="57"
              rx="6"
              fill="#fff"
              stroke="#e8e8e8"
            />

            <text
              x={tooltipX + 10}
              y={tooltipY + 16}
              className="tooltip-title"
            >
              {activeItem.month.charAt(0) +
                activeItem.month.slice(1).toLowerCase()}
            </text>

            <text
              x={tooltipX + 10}
              y={tooltipY + 32}
              className="tooltip-text"
            >
              Inventory Value
            </text>

            <text
              x={tooltipX + 10}
              y={tooltipY + 47}
              className="tooltip-text"
            >
              SAR {activeItem.value}M
            </text>
          </g>
        )}

        {/* Month labels */}
        {data.map((item, index) => (
          <text
            key={`month-${item.month}`}
            x={x(index)}
            y={HEIGHT - 12}
            textAnchor="middle"
            className="month-label"
          >
            {item.month}
          </text>
        ))}
      </ChartSvg>
    </ChartContainer>
  );
};

export default InventoryMovementChart;