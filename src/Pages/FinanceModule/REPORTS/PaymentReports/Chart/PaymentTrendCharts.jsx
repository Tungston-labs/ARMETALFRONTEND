import React, { useMemo, useState } from "react";
import {
  ChartsPanel,
  TrendSection,
  ChartHeader,
  ChartTitle,
  Select,
  LineChartSvg,
  BarChartSvg,
  ChartDivider,
} from "./PaymentTrendCharts.styles";

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
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

export default function PaymentTrendCharts({ rows = [] }) {
  const availableYears = useMemo(
    () =>
      [...new Set(rows.map((r) => r.date?.slice(0, 4)).filter(Boolean))]
        .sort()
        .reverse(),
    [rows],
  );
  const [selectedYear, setSelectedYear] = useState("");
  const year =
    selectedYear && availableYears.includes(selectedYear)
      ? selectedYear
      : availableYears[0] || String(new Date().getFullYear());
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  const trendData = useMemo(() => {
    const totals = new Map(MONTHS.map((m) => [m, 0]));
    rows
      .filter((r) => r.date?.startsWith(year))
      .forEach((r) => {
        const month = Number(r.date.slice(5, 7)) - 1;
        if (month >= 0 && month < 12)
          totals.set(
            MONTHS[month],
            totals.get(MONTHS[month]) + Number(r.amount || 0),
          );
      });
    return MONTHS.map((month) => ({
      month,
      value: (totals.get(month) || 0) / 1_000_000,
    }));
  }, [rows, year]);
  const comparisonData = useMemo(
    () =>
      MONTHS.map((month) => {
        const monthIndex = MONTHS.indexOf(month) + 1;
        const monthRows = rows.filter(
          (r) =>
            r.date?.startsWith(year) &&
            Number(r.date.slice(5, 7)) === monthIndex,
        );
        return {
          month,
          receipts:
            monthRows
              .filter((r) => /receipt|received/i.test(r.type))
              .reduce((s, r) => s + Number(r.amount || 0), 0) / 1_000_000,
          vendor:
            monthRows
              .filter((r) => /vendor|payment|paid/i.test(r.type))
              .reduce((s, r) => s + Number(r.amount || 0), 0) / 1_000_000,
        };
      }),
    [rows, year],
  );
  const lineMax = Math.max(
    1,
    Math.ceil(Math.max(...trendData.map((d) => d.value), 0) / 5) * 5,
  );
  const selectedBars = comparisonData;
  const barMax = Math.max(
    1,
    Math.ceil(
      Math.max(...selectedBars.flatMap((d) => [d.receipts, d.vendor]), 0) / 2,
    ) * 2,
  );
  const linePlotWidth = LINE.width - LINE.left - LINE.right;
  const linePlotHeight = LINE.height - LINE.top - LINE.bottom;
  const lineX = (i) => LINE.left + (i / (trendData.length - 1)) * linePlotWidth;
  const lineY = (v) => LINE.top + ((lineMax - v) / lineMax) * linePlotHeight;
  const points = trendData
    .map((d, i) => `${lineX(i)},${lineY(d.value)}`)
    .join(" ");
  const barPlotWidth = BAR.width - BAR.left - BAR.right;
  const barPlotHeight = BAR.height - BAR.top - BAR.bottom;
  const groupWidth = barPlotWidth / selectedBars.length;
  const barWidth = Math.min(8, groupWidth * 0.34);
  const barY = (value) => BAR.top + ((barMax - value) / barMax) * barPlotHeight;
  const activeBar = hoveredBar === null ? null : selectedBars[hoveredBar.index];
  const formatM = (value) => `${Number(value || 0).toFixed(2)}M`;

  return (
    <ChartsPanel>
      <TrendSection>
        <ChartHeader>
          <ChartTitle>Monthly Payment Trend (SAR millions)</ChartTitle>
          <Select
            aria-label="Payment trend year"
            value={year}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setHoveredPoint(null);
            }}
          >
            {(availableYears.length ? availableYears : [year]).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Select>
        </ChartHeader>
        {rows.length === 0 ? (
          <p className="chart-empty">No payment data available to plot.</p>
        ) : (
          <LineChartSvg
            viewBox={`0 0 ${LINE.width} ${LINE.height}`}
            role="img"
            aria-label={`Monthly payment totals for ${year}`}
          >
            {lineTicks.map((tick) => {
              const y =
                LINE.top +
                ((lineMax - (tick * lineMax) / 25) / lineMax) * linePlotHeight;
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
                    {((tick * lineMax) / 25).toFixed(0)}
                  </text>
                </g>
              );
            })}
            <polyline
              points={points}
              fill="none"
              stroke="#ff7900"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {trendData.map((item, index) => (
              <g
                key={item.month}
                tabIndex={0}
                role="button"
                aria-label={`${item.month}: ${formatM(item.value)}`}
                onMouseEnter={() => setHoveredPoint(index)}
                onMouseLeave={() => setHoveredPoint(null)}
                onFocus={() => setHoveredPoint(index)}
                onBlur={() => setHoveredPoint(null)}
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
                  r={hoveredPoint === index ? 4 : 2.5}
                  fill="#ff7900"
                />
              </g>
            ))}
            {hoveredPoint !== null && (
              <g pointerEvents="none">
                <rect
                  x={Math.min(
                    Math.max(lineX(hoveredPoint) - 45, LINE.left),
                    LINE.width - 95,
                  )}
                  y={Math.max(lineY(trendData[hoveredPoint].value) - 43, 2)}
                  width="90"
                  height="34"
                  rx="5"
                  fill="#fff"
                  stroke="#ddd"
                />
                <text
                  x={Math.min(
                    Math.max(lineX(hoveredPoint) - 36, LINE.left + 8),
                    LINE.width - 87,
                  )}
                  y={Math.max(lineY(trendData[hoveredPoint].value) - 22, 22)}
                  className="tooltip-title"
                >
                  {trendData[hoveredPoint].month}:{" "}
                  {formatM(trendData[hoveredPoint].value)}
                </text>
              </g>
            )}
            {trendData.map((d, i) => (
              <text
                key={d.month}
                x={lineX(i)}
                y={LINE.height - 8}
                textAnchor="middle"
                className="axis-label month-label"
              >
                {d.month}
              </text>
            ))}
          </LineChartSvg>
        )}
      </TrendSection>
      <ChartDivider />
      <TrendSection>
        <ChartHeader>
          <ChartTitle>Monthly Receipts vs Vendor Payments</ChartTitle>
        </ChartHeader>
        {rows.length === 0 ? (
          <p className="chart-empty">No payment data available to plot.</p>
        ) : (
          <BarChartSvg
            viewBox={`0 0 ${BAR.width} ${BAR.height}`}
            role="img"
            aria-label={`Receipts and vendor payments by month for ${year}`}
          >
            {barTicks.map((tick) => {
              const value = (tick * barMax) / 10;
              const y = barY(value);
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
                    {value.toFixed(1)}
                  </text>
                </g>
              );
            })}
            {selectedBars.map((item, index) => {
              const center = BAR.left + groupWidth * (index + 0.5);
              const rx = center - barWidth - 1;
              const vx = center + 1;
              const ry = barY(item.receipts);
              const vy = barY(item.vendor);
              return (
                <g key={item.month}>
                  <rect
                    x={rx}
                    y={ry}
                    width={barWidth}
                    height={BAR.height - BAR.bottom - ry}
                    rx="2"
                    fill="#3453bd"
                    tabIndex={0}
                    role="button"
                    aria-label={`${item.month} receipts ${formatM(item.receipts)}`}
                    onMouseEnter={() =>
                      setHoveredBar({ index, type: "receipts" })
                    }
                    onMouseLeave={() => setHoveredBar(null)}
                    onFocus={() => setHoveredBar({ index, type: "receipts" })}
                    onBlur={() => setHoveredBar(null)}
                  />
                  <rect
                    x={vx}
                    y={vy}
                    width={barWidth}
                    height={BAR.height - BAR.bottom - vy}
                    rx="2"
                    fill="#ff850c"
                    tabIndex={0}
                    role="button"
                    aria-label={`${item.month} vendor payments ${formatM(item.vendor)}`}
                    onMouseEnter={() =>
                      setHoveredBar({ index, type: "vendor" })
                    }
                    onMouseLeave={() => setHoveredBar(null)}
                    onFocus={() => setHoveredBar({ index, type: "vendor" })}
                    onBlur={() => setHoveredBar(null)}
                  />
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
                      BAR.left + groupWidth * (hoveredBar.index + 0.5) - 54,
                      BAR.left,
                    ),
                    BAR.width - 112,
                  )}
                  y="4"
                  width="104"
                  height="36"
                  rx="5"
                  fill="#fff"
                  stroke="#ddd"
                />
                <text
                  x={Math.min(
                    Math.max(
                      BAR.left + groupWidth * (hoveredBar.index + 0.5) - 45,
                      BAR.left + 8,
                    ),
                    BAR.width - 103,
                  )}
                  y="19"
                  className="tooltip-title"
                >
                  {activeBar.month}
                </text>
                <text
                  x={Math.min(
                    Math.max(
                      BAR.left + groupWidth * (hoveredBar.index + 0.5) - 45,
                      BAR.left + 8,
                    ),
                    BAR.width - 103,
                  )}
                  y="32"
                  className="tooltip-text"
                >
                  {hoveredBar.type === "receipts"
                    ? `Receipts ${formatM(activeBar.receipts)}`
                    : `Vendor ${formatM(activeBar.vendor)}`}
                </text>
              </g>
            )}
          </BarChartSvg>
        )}
        <div className="chart-legend">
          <span>
            <i className="receipt-dot" /> Receipts
          </span>
          <span>
            <i className="vendor-dot" /> Vendor payments
          </span>
        </div>
      </TrendSection>
    </ChartsPanel>
  );
}
