
import React, { useState } from "react";

import {
  ChartsPanel,
  TrendSection,
  ChartHeader,
  ChartTitle,
  Select,
  LineChartSvg,
  BarChartSvg,
  ChartDivider,
  ChartTooltip,
} from "./PaymentTrendCharts.styles";

const trendData = {
  2026: [
    { month: "JAN", value: 16 },
    { month: "FEB", value: 24 },
    { month: "MAR", value: 19 },
    { month: "APR", value: 7 },
    { month: "MAY", value: 17 },
    { month: "JUN", value: 17.3 },
    { month: "JUL", value: 15 },
    { month: "AUG", value: 15 },
  ],
  2025: [
    { month: "JAN", value: 12 },
    { month: "FEB", value: 17 },
    { month: "MAR", value: 20 },
    { month: "APR", value: 15 },
    { month: "MAY", value: 18 },
    { month: "JUN", value: 22 },
    { month: "JUL", value: 19 },
    { month: "AUG", value: 24 },
  ],
  2024: [
    { month: "JAN", value: 8 },
    { month: "FEB", value: 12 },
    { month: "MAR", value: 16 },
    { month: "APR", value: 13 },
    { month: "MAY", value: 15 },
    { month: "JUN", value: 18 },
    { month: "JUL", value: 20 },
    { month: "AUG", value: 22 },
  ],
};

const comparisonData = {
  JAN: [
    { month: "JAN", receipts: 7.8, vendor: 5.8 },
    { month: "FEB", receipts: 7.4, vendor: 4.6 },
    { month: "MAR", receipts: 6.4, vendor: 5.6 },
    { month: "APR", receipts: 3.1, vendor: 2.1 },
    { month: "MAY", receipts: 8.7, vendor: 5.7 },
    { month: "JUN", receipts: 6.8, vendor: 4.6 },
    { month: "JUL", receipts: 4.2, vendor: 3.7 },
  ],
  FEB: [
    { month: "JAN", receipts: 6.3, vendor: 4.1 },
    { month: "FEB", receipts: 7.1, vendor: 5.2 },
    { month: "MAR", receipts: 8.2, vendor: 5.6 },
    { month: "APR", receipts: 4.3, vendor: 2.8 },
    { month: "MAY", receipts: 7.5, vendor: 5.0 },
    { month: "JUN", receipts: 6.1, vendor: 4.4 },
    { month: "JUL", receipts: 5.1, vendor: 3.3 },
  ],
  MAR: [
    { month: "JAN", receipts: 5.5, vendor: 4.3 },
    { month: "FEB", receipts: 6.7, vendor: 4.8 },
    { month: "MAR", receipts: 7.6, vendor: 5.4 },
    { month: "APR", receipts: 4.0, vendor: 2.5 },
    { month: "MAY", receipts: 8.2, vendor: 5.8 },
    { month: "JUN", receipts: 6.5, vendor: 4.2 },
    { month: "JUL", receipts: 4.8, vendor: 3.4 },
  ],
  APR: [
    { month: "JAN", receipts: 7.1, vendor: 4.7 },
    { month: "FEB", receipts: 6.4, vendor: 4.1 },
    { month: "MAR", receipts: 8.0, vendor: 5.5 },
    { month: "APR", receipts: 3.5, vendor: 2.2 },
    { month: "MAY", receipts: 7.8, vendor: 5.0 },
    { month: "JUN", receipts: 6.7, vendor: 4.6 },
    { month: "JUL", receipts: 5.0, vendor: 3.7 },
  ],
  MAY: [
    { month: "JAN", receipts: 6.5, vendor: 4.5 },
    { month: "FEB", receipts: 7.2, vendor: 4.7 },
    { month: "MAR", receipts: 6.9, vendor: 5.1 },
    { month: "APR", receipts: 4.0, vendor: 2.7 },
    { month: "MAY", receipts: 8.5, vendor: 5.9 },
    { month: "JUN", receipts: 7.1, vendor: 4.8 },
    { month: "JUL", receipts: 4.6, vendor: 3.4 },
  ],
  JUN: [
    { month: "JAN", receipts: 7.0, vendor: 4.8 },
    { month: "FEB", receipts: 6.9, vendor: 4.4 },
    { month: "MAR", receipts: 7.7, vendor: 5.2 },
    { month: "APR", receipts: 3.8, vendor: 2.4 },
    { month: "MAY", receipts: 8.3, vendor: 5.7 },
    { month: "JUN", receipts: 6.8, vendor: 4.6 },
    { month: "JUL", receipts: 4.9, vendor: 3.6 },
  ],
  JUL: [
    { month: "JAN", receipts: 7.5, vendor: 5.0 },
    { month: "FEB", receipts: 6.7, vendor: 4.4 },
    { month: "MAR", receipts: 7.8, vendor: 5.3 },
    { month: "APR", receipts: 3.6, vendor: 2.5 },
    { month: "MAY", receipts: 8.4, vendor: 5.8 },
    { month: "JUN", receipts: 6.9, vendor: 4.5 },
    { month: "JUL", receipts: 4.8, vendor: 3.5 },
  ],
};

const LINE = {
  width: 390,
  height: 190,
  left: 45,
  right: 8,
  top: 16,
  bottom: 29,
};

const BAR = {
  width: 390,
  height: 205,
  left: 45,
  right: 8,
  top: 16,
  bottom: 29,
};

const lineTicks = [0, 5, 10, 15, 20, 25];
const barTicks = [0, 2, 4, 6, 8, 10];

const PaymentTrendCharts = () => {
  const [year, setYear] = useState("2026");
  const [comparisonMonth, setComparisonMonth] = useState("JAN");
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  const data = trendData[year];
  const bars = comparisonData[comparisonMonth];

  const linePlotWidth = LINE.width - LINE.left - LINE.right;
  const linePlotHeight = LINE.height - LINE.top - LINE.bottom;

  const lineX = (index) =>
    LINE.left + (index / (data.length - 1)) * linePlotWidth;

  const lineY = (value) =>
    LINE.top + ((25 - value) / 25) * linePlotHeight;

  const linePoints = data
    .map((item, index) => `${lineX(index)},${lineY(item.value)}`)
    .join(" ");

  const activePoint =
    hoveredPoint === null ? null : data[hoveredPoint];

  const activeBar =
    hoveredBar === null ? null : bars[hoveredBar.index];

  const barPlotWidth = BAR.width - BAR.left - BAR.right;
  const barPlotHeight = BAR.height - BAR.top - BAR.bottom;
  const groupWidth = barPlotWidth / bars.length;
  const barWidth = Math.min(14, groupWidth * 0.34);

  const barY = (value) =>
    BAR.top + ((10 - value) / 10) * barPlotHeight;

  return (
    <ChartsPanel>
      {/* Monthly Payment Trend */}
      <TrendSection>
        <ChartHeader>
          <ChartTitle>Monthly Payment Trend</ChartTitle>

          <Select
            aria-label="Payment trend year"
            value={year}
            onChange={(event) => {
              setYear(event.target.value);
              setHoveredPoint(null);
            }}
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </Select>
        </ChartHeader>

        <LineChartSvg
          viewBox={`0 0 ${LINE.width} ${LINE.height}`}
          role="img"
          aria-label={`Monthly payment trend for ${year}, in millions`}
        >
          {lineTicks.map((tick) => {
            const y =
              LINE.top + ((25 - tick) / 25) * linePlotHeight;

            return (
              <g key={tick}>
                <line
                  x1={LINE.left}
                  y1={y}
                  x2={LINE.width - LINE.right}
                  y2={y}
                  className="grid-line"
                />
                <text
                  x={LINE.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="axis-label"
                >
                  {tick === 0 ? "0" : `${tick} M`}
                </text>
              </g>
            );
          })}

          {data.map((item, index) => (
            <line
              key={`grid-${item.month}`}
              x1={lineX(index)}
              y1={LINE.top}
              x2={lineX(index)}
              y2={LINE.height - LINE.bottom}
              className="grid-line"
            />
          ))}

          <polyline
            points={linePoints}
            fill="none"
            stroke="#ff7900"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {data.map((item, index) => (
            <g
              key={item.month}
              tabIndex={0}
              role="button"
              aria-label={`${item.month}, total payment ${item.value} million SAR`}
              onMouseEnter={() => setHoveredPoint(index)}
              onMouseLeave={() => setHoveredPoint(null)}
              onFocus={() => setHoveredPoint(index)}
              onBlur={() => setHoveredPoint(null)}
              style={{ cursor: "pointer" }}
            >
              <circle
                cx={lineX(index)}
                cy={lineY(item.value)}
                r="9"
                fill="transparent"
              />
              <circle
                cx={lineX(index)}
                cy={lineY(item.value)}
                r={hoveredPoint === index ? 3 : 2}
                fill="#ff7900"
              />
            </g>
          ))}

          {activePoint && (
            <g pointerEvents="none">
              <rect
                x={Math.min(
                  Math.max(lineX(hoveredPoint) - 48, LINE.left),
                  LINE.width - 100
                )}
                y={Math.max(lineY(activePoint.value) - 57, 3)}
                width="90"
                height="52"
                rx="6"
                fill="#fff"
                stroke="#eee"
              />

              <text
                x={Math.min(
                  Math.max(lineX(hoveredPoint) - 39, LINE.left + 9),
                  LINE.width - 91
                )}
                y={Math.max(lineY(activePoint.value) - 41, 19)}
                className="tooltip-title"
              >
                {activePoint.month.charAt(0) +
                  activePoint.month.slice(1).toLowerCase()}
              </text>

              <text
                x={Math.min(
                  Math.max(lineX(hoveredPoint) - 39, LINE.left + 9),
                  LINE.width - 91
                )}
                y={Math.max(lineY(activePoint.value) - 25, 35)}
                className="tooltip-text"
              >
                Total Payment
              </text>

              <text
                x={Math.min(
                  Math.max(lineX(hoveredPoint) - 39, LINE.left + 9),
                  LINE.width - 91
                )}
                y={Math.max(lineY(activePoint.value) - 10, 50)}
                className="tooltip-text"
              >
                SAR {activePoint.value} M
              </text>
            </g>
          )}

          {data.map((item, index) => (
            <text
              key={`label-${item.month}`}
              x={lineX(index)}
              y={LINE.height - 8}
              textAnchor="middle"
              className="axis-label month-label"
            >
              {item.month}
            </text>
          ))}
        </LineChartSvg>
      </TrendSection>

      <ChartDivider />

      {/* Receipts vs Vendor Payments */}
      <TrendSection>
        <ChartHeader>
          <ChartTitle>Receipts vs Vendor Payments</ChartTitle>

          <Select
            aria-label="Comparison month"
            value={comparisonMonth}
            onChange={(event) => {
              setComparisonMonth(event.target.value);
              setHoveredBar(null);
            }}
          >
            {Object.keys(comparisonData).map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </Select>
        </ChartHeader>

        <BarChartSvg
          viewBox={`0 0 ${BAR.width} ${BAR.height}`}
          role="img"
          aria-label={`Receipts versus vendor payments, ${comparisonMonth} comparison`}
        >
          {barTicks.map((tick) => {
            const y =
              BAR.top + ((10 - tick) / 10) * barPlotHeight;

            return (
              <g key={tick}>
                <line
                  x1={BAR.left}
                  y1={y}
                  x2={BAR.width - BAR.right}
                  y2={y}
                  className="grid-line"
                />
                <text
                  x={BAR.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="axis-label"
                >
                  {tick === 0 ? "0" : `${tick} M`}
                </text>
              </g>
            );
          })}

          {bars.map((item, index) => {
            const center =
              BAR.left + groupWidth * (index + 0.5);

            const receiptX = center - barWidth - 1;
            const vendorX = center + 1;

            const receiptY = barY(item.receipts);
            const vendorY = barY(item.vendor);

            return (
              <g key={item.month}>
                <rect
                  x={receiptX}
                  y={receiptY}
                  width={barWidth}
                  height={BAR.height - BAR.bottom - receiptY}
                  rx="3"
                  fill="#3453bd"
                  tabIndex={0}
                  role="button"
                  aria-label={`${item.month} receipts: ${item.receipts} million SAR`}
                  onMouseEnter={() =>
                    setHoveredBar({ index, type: "receipts" })
                  }
                  onMouseLeave={() => setHoveredBar(null)}
                  onFocus={() =>
                    setHoveredBar({ index, type: "receipts" })
                  }
                  onBlur={() => setHoveredBar(null)}
                  style={{ cursor: "pointer" }}
                />

                <rect
                  x={vendorX}
                  y={vendorY}
                  width={barWidth}
                  height={BAR.height - BAR.bottom - vendorY}
                  rx="3"
                  fill="#ff850c"
                  tabIndex={0}
                  role="button"
                  aria-label={`${item.month} vendor payments: ${item.vendor} million SAR`}
                  onMouseEnter={() =>
                    setHoveredBar({ index, type: "vendor" })
                  }
                  onMouseLeave={() => setHoveredBar(null)}
                  onFocus={() =>
                    setHoveredBar({ index, type: "vendor" })
                  }
                  onBlur={() => setHoveredBar(null)}
                  style={{ cursor: "pointer" }}
                />

                {index === 0 && (
                  <>
                    <text
                      x={receiptX + barWidth / 2}
                      y={receiptY - 5}
                      textAnchor="middle"
                      className="bar-value"
                    >
                      {item.receipts.toFixed(1)}M
                    </text>
                    <text
                      x={vendorX + barWidth / 2}
                      y={vendorY - 5}
                      textAnchor="middle"
                      className="bar-value"
                    >
                      {item.vendor.toFixed(1)}M
                    </text>
                  </>
                )}

                <text
                  x={center}
                  y={BAR.height - 8}
                  textAnchor="middle"
                  className="axis-label month-label"
                >
                  {item.month}
                </text>
              </g>
            );
          })}

          {activeBar && (
            <g pointerEvents="none">
              <rect
                x={Math.min(
                  Math.max(
                    BAR.left +
                      groupWidth * (hoveredBar.index + 0.5) -
                      52,
                    BAR.left
                  ),
                  BAR.width - 108
                )}
                y="5"
                width="100"
                height="43"
                rx="5"
                fill="#fff"
                stroke="#e8e8e8"
              />
              <text
                x={Math.min(
                  Math.max(
                    BAR.left +
                      groupWidth * (hoveredBar.index + 0.5) -
                      44,
                    BAR.left + 8
                  ),
                  BAR.width - 100
                )}
                y="21"
                className="tooltip-title"
              >
                {activeBar.month}
              </text>
              <text
                x={Math.min(
                  Math.max(
                    BAR.left +
                      groupWidth * (hoveredBar.index + 0.5) -
                      44,
                    BAR.left + 8
                  ),
                  BAR.width - 100
                )}
                y="36"
                className="tooltip-text"
              >
                {hoveredBar.type === "receipts"
                  ? `Receipts: ${activeBar.receipts}M`
                  : `Vendor: ${activeBar.vendor}M`}
              </text>
            </g>
          )}
        </BarChartSvg>
      </TrendSection>
    </ChartsPanel>
  );
};

export default PaymentTrendCharts;