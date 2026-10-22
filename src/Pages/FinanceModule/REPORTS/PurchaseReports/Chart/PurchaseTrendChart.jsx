
import React, { useState } from "react";

import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  YearSelect,
  ChartBody,
  ChartSvg,
  ChartTooltip,
  TooltipTitle,
  TooltipValue,
  ChartLegend,
} from "./PurchaseTrendChart.styles";

const monthlyData = {
  2026: [
    { month: "JAN", value: 2.4 },
    { month: "FEB", value: 3.1 },
    { month: "MAR", value: 2.8 },
    { month: "APR", value: 1.7 },
    { month: "MAY", value: 2.3 },
    { month: "JUN", value: 2.6 },
    { month: "JUL", value: 4.3 },
    { month: "AUG", value: 4.9 },
  ],
  2025: [
    { month: "JAN", value: 1.8 },
    { month: "FEB", value: 2.2 },
    { month: "MAR", value: 2.6 },
    { month: "APR", value: 2.1 },
    { month: "MAY", value: 3.0 },
    { month: "JUN", value: 3.4 },
    { month: "JUL", value: 4.0 },
    { month: "AUG", value: 4.5 },
  ],
  2024: [
    { month: "JAN", value: 1.4 },
    { month: "FEB", value: 1.9 },
    { month: "MAR", value: 2.2 },
    { month: "APR", value: 1.8 },
    { month: "MAY", value: 2.5 },
    { month: "JUN", value: 3.0 },
    { month: "JUL", value: 3.5 },
    { month: "AUG", value: 3.9 },
  ],
};

const CHART = {
  width: 440,
  height: 420,
  left: 55,
  right: 10,
  top: 20,
  bottom: 47,
  min: 1,
  max: 5.8,
};

const yTicks = [1, 1.6, 2.2, 2.8, 3.4, 4, 4.6, 5.2, 5.8];

const formatMillions = (value) =>
  `${Number.isInteger(value) ? value : value.toFixed(1)}M`;

const formatSAR = (value) =>
  `SAR ${(value * 1_000_000).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  })}`;

const PurchaseTrendChart = () => {
  const [year, setYear] = useState("2026");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const data = monthlyData[year];

  const plotWidth = CHART.width - CHART.left - CHART.right;
  const plotHeight = CHART.height - CHART.top - CHART.bottom;

  const getX = (index) =>
    CHART.left + (index / (data.length - 1)) * plotWidth;

  const getY = (value) =>
    CHART.top +
    ((CHART.max - value) / (CHART.max - CHART.min)) * plotHeight;

  const points = data
    .map((item, index) => `${getX(index)},${getY(item.value)}`)
    .join(" ");

  const activeItem =
    hoveredIndex !== null ? data[hoveredIndex] : null;

  const activeX =
    hoveredIndex !== null ? getX(hoveredIndex) : 0;

  const activeY =
    hoveredIndex !== null ? getY(data[hoveredIndex].value) : 0;

  const tooltipX = Math.min(
    Math.max(activeX - 75, CHART.left + 4),
    CHART.width - 135
  );

  const tooltipY = Math.max(activeY - 75, CHART.top + 4);

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Monthly Purchase Trend</ChartTitle>

        <YearSelect
          aria-label="Select chart year"
          value={year}
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

      <ChartBody>
        <ChartSvg
          viewBox={`0 0 ${CHART.width} ${CHART.height}`}
          role="img"
          aria-label={`Monthly purchase trend for ${year}, in millions of SAR`}
        >
          {/* Horizontal grid lines and Y-axis labels */}
          {yTicks.map((tick) => {
            const y = getY(tick);

            return (
              <g key={tick}>
                <line
                  x1={CHART.left}
                  y1={y}
                  x2={CHART.width - CHART.right}
                  y2={y}
                  stroke="#ededed"
                  strokeWidth="1"
                />

                <text
                  x={CHART.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="axis-label"
                >
                  {formatMillions(tick)}
                </text>
              </g>
            );
          })}

          {/* Vertical grid lines */}
          {data.map((item, index) => {
            const x = getX(index);

            return (
              <line
                key={`grid-${item.month}`}
                x1={x}
                y1={CHART.top}
                x2={x}
                y2={CHART.height - CHART.bottom}
                stroke="#ededed"
                strokeWidth="1"
              />
            );
          })}

          {/* Monthly trend line */}
          <polyline
            points={points}
            fill="none"
            stroke="#ff7900"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {data.map((item, index) => (
            <g
              key={item.month}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
              tabIndex={0}
              role="button"
              aria-label={`${item.month}: ${formatSAR(item.value)}`}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={getX(index)}
                cy={getY(item.value)}
                r="10"
                fill="transparent"
              />

              <circle
                cx={getX(index)}
                cy={getY(item.value)}
                r={hoveredIndex === index ? 3.2 : 2}
                fill="#3154b5"
              />
            </g>
          ))}

          {/* Hover tooltip */}
          {activeItem && (
            <g pointerEvents="none">
              <rect
                x={tooltipX}
                y={tooltipY}
                width="126"
                height="64"
                rx="7"
                fill="#fff"
                stroke="#eeeeee"
              />

              <text
                x={tooltipX + 10}
                y={tooltipY + 17}
                className="tooltip-month"
              >
                {activeItem.month.charAt(0) +
                  activeItem.month.slice(1).toLowerCase()}
              </text>

              <text
                x={tooltipX + 10}
                y={tooltipY + 34}
                className="tooltip-label"
              >
                Purchase Value
              </text>

              <text
                x={tooltipX + 10}
                y={tooltipY + 51}
                className="tooltip-value"
              >
                {formatSAR(activeItem.value)}
              </text>
            </g>
          )}

          {/* X-axis month labels */}
          {data.map((item, index) => (
            <text
              key={`month-${item.month}`}
              x={getX(index)}
              y={CHART.height - 18}
              textAnchor="middle"
              className="axis-label month-label"
            >
              {item.month}
            </text>
          ))}
        </ChartSvg>
      </ChartBody>

      <ChartLegend>
        <span />
        Monthly purchase value
      </ChartLegend>
    </ChartContainer>
  );
};

export default PurchaseTrendChart;