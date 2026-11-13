import React, { useMemo, useState } from "react";

import {
  ChartsPanel,
  ChartSection,
  ChartHeader,
  ChartTitle,
  ChartSelect,
  ChartSvg,
  ChartDivider,
  Legend,
  LegendItem,
  LegendColor,
} from "./TaxCollectionCharts.styles";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Replace these sample values with your API response if the chart
// already receives tax collection data from the backend.
const monthlyTax = {
  2024: [18, 24, 21, 32, 28, 38, 34, 43, 39, 48, 44, 55],
  2025: [22, 28, 25, 36, 32, 42, 39, 48, 45, 54, 50, 62],
  2026: [25, 31, 29, 40, 36, 46, 42, 53, 48, 58, 55, 66],
};

const comparisonData = {
  2024: {
    current: [18, 24, 21, 32, 28, 38, 34, 43, 39, 48, 44, 55],
    previous: [15, 20, 18, 27, 25, 33, 30, 37, 35, 42, 40, 49],
  },
  2025: {
    current: [22, 28, 25, 36, 32, 42, 39, 48, 45, 54, 50, 62],
    previous: [18, 24, 21, 32, 28, 38, 34, 43, 39, 48, 44, 55],
  },
  2026: {
    current: [25, 31, 29, 40, 36, 46, 42, 53, 48, 58, 55, 66],
    previous: [22, 28, 25, 36, 32, 42, 39, 48, 45, 54, 50, 62],
  },
};

const CHART = {
  width: 600,
  height: 230,
  left: 42,
  right: 16,
  top: 16,
  bottom: 34,
};

const COLORS = {
  current: "#6558D3",
  previous: "#28A7A1",
};

function getX(index, count) {
  const plotWidth = CHART.width - CHART.left - CHART.right;
  return CHART.left + (index / Math.max(count - 1, 1)) * plotWidth;
}

function getY(value, maxValue) {
  const plotHeight = CHART.height - CHART.top - CHART.bottom;
  return CHART.top + plotHeight - (value / maxValue) * plotHeight;
}

function makeLinePath(values, maxValue) {
  return values
    .map((value, index) => {
      const x = getX(index, values.length);
      const y = getY(value, maxValue);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
}

function GridLines({ maxValue, step }) {
  const ticks = [];

  for (let value = 0; value <= maxValue; value += step) {
    const y = getY(value, maxValue);

    ticks.push(
      <g key={value}>
        <line
          className="grid-line"
          x1={CHART.left}
          y1={y}
          x2={CHART.width - CHART.right}
          y2={y}
        />
        <text
          className="axis-label"
          x={CHART.left - 9}
          y={y + 3}
          textAnchor="end"
        >
          {value}
        </text>
      </g>,
    );
  }

  return <>{ticks}</>;
}

function MonthLabels() {
  return (
    <>
      {MONTHS.map((month, index) => (
        <text
          key={month}
          className="month-label"
          x={getX(index, MONTHS.length)}
          y={CHART.height - 10}
          textAnchor="middle"
        >
          {month}
        </text>
      ))}
    </>
  );
}

function ChartPoints({ values, color, maxValue }) {
  return (
    <>
      {values.map((value, index) => (
        <circle
          key={`${index}-${value}`}
          className="chart-point"
          cx={getX(index, values.length)}
          cy={getY(value, maxValue)}
          r="3.5"
          fill={color}
        >
          <title>{`${MONTHS[index]}: ${value}`}</title>
        </circle>
      ))}
    </>
  );
}

function LineChart({ values }) {
  const maxValue = Math.max(20, Math.ceil(Math.max(...values) / 20) * 20);
  const step = maxValue / 4;

  return (
    <ChartSvg
      viewBox={`0 0 ${CHART.width} ${CHART.height}`}
      role="img"
      aria-label="Monthly tax collection trend chart"
    >
      <GridLines maxValue={maxValue} step={step} />
      <MonthLabels />

      <path
        className="chart-line"
        d={makeLinePath(values, maxValue)}
        stroke={COLORS.current}
      />

      <ChartPoints values={values} color={COLORS.current} maxValue={maxValue} />
    </ChartSvg>
  );
}

function ComparisonChart({ currentValues, previousValues }) {
  const allValues = [...currentValues, ...previousValues];
  const maxValue = Math.max(20, Math.ceil(Math.max(...allValues) / 20) * 20);
  const step = maxValue / 4;

  return (
    <ChartSvg
      viewBox={`0 0 ${CHART.width} ${CHART.height}`}
      role="img"
      aria-label="Current and previous year tax collection comparison chart"
    >
      <GridLines maxValue={maxValue} step={step} />
      <MonthLabels />

      <path
        className="chart-line"
        d={makeLinePath(previousValues, maxValue)}
        stroke={COLORS.previous}
      />

      <path
        className="chart-line"
        d={makeLinePath(currentValues, maxValue)}
        stroke={COLORS.current}
      />

      <ChartPoints
        values={previousValues}
        color={COLORS.previous}
        maxValue={maxValue}
      />

      <ChartPoints
        values={currentValues}
        color={COLORS.current}
        maxValue={maxValue}
      />
    </ChartSvg>
  );
}

function ChartLegend({ items }) {
  return (
    <Legend>
      {items.map((item) => (
        <LegendItem key={item.label}>
          <LegendColor $color={item.color} />
          <span>{item.label}</span>
        </LegendItem>
      ))}
    </Legend>
  );
}

export default function TaxCollectionCharts() {
  const [selectedYear, setSelectedYear] = useState("2026");

  const availableYears = useMemo(
    () => Object.keys(monthlyTax).sort((a, b) => Number(b) - Number(a)),
    [],
  );

  const selectedMonthlyData =
    monthlyTax[selectedYear] || monthlyTax[availableYears[0]];

  const selectedComparison =
    comparisonData[selectedYear] || comparisonData[availableYears[0]];

  return (
    <ChartsPanel>
      <ChartSection>
        <ChartHeader>
          <ChartTitle>Monthly Tax Collection</ChartTitle>

          <ChartSelect
            aria-label="Select year for monthly tax collection"
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </ChartSelect>
        </ChartHeader>

        <LineChart values={selectedMonthlyData} />

        <ChartLegend
          items={[
            {
              label: `Tax Collection ${selectedYear}`,
              color: COLORS.current,
            },
          ]}
        />
      </ChartSection>

      <ChartDivider />

      <ChartSection>
        <ChartHeader>
          <ChartTitle>Tax Collection Comparison</ChartTitle>

          <ChartSelect
            aria-label="Select year for tax collection comparison"
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </ChartSelect>
        </ChartHeader>

        <ComparisonChart
          currentValues={selectedComparison.current}
          previousValues={selectedComparison.previous}
        />

        <ChartLegend
          items={[
            {
              label: selectedYear,
              color: COLORS.current,
            },
            {
              label: String(Number(selectedYear) - 1),
              color: COLORS.previous,
            },
          ]}
        />
      </ChartSection>
    </ChartsPanel>
  );
}
