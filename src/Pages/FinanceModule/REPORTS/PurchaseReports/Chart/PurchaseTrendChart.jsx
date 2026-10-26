import React, { useMemo, useState } from "react";
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  YearSelect,
  ChartBody,
  ChartContent,
  GridLines,
  GridLine,
  ChartRow,
  MonthLabel,
  BarArea,
  Bar,
  Tooltip,
  TooltipTitle,
  TooltipValue,
  XAxis,
  XAxisValue,
} from "./PurchaseTrendChart.styles";

const GRID_STEPS = 6;
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const YEAR_OPTIONS = [currentYear, currentYear - 1, currentYear - 2];

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

const niceStep = (raw) => {
  if (raw <= 0) return 1;

  const power = Math.pow(10, Math.floor(Math.log10(raw)));
  const fraction = raw / power;
  const nice = [1, 2, 2.5, 5, 10].find((n) => fraction <= n);

  return (nice || 10) * power;
};

const formatAxis = (value) => {
  if (value >= 1_000_000) {
    return `${+(value / 1_000_000).toFixed(2)} M`;
  }

  if (value >= 1_000) {
    return `${+(value / 1_000).toFixed(1)} K`;
  }

  return String(value);
};

const formatSAR = (value) =>
  `SAR ${Number(value || 0).toLocaleString("en-US", {
    maximumFractionDigits: 2,
  })}`;

const PurchaseTrendChart = ({ monthlyTrend = [], loading = false }) => {
  const [year, setYear] = useState(currentYear);
  const [hoveredMonth, setHoveredMonth] = useState(null);

  const safeData = useMemo(
    () =>
      (Array.isArray(monthlyTrend) ? monthlyTrend : []).map((item) => ({
        ...item,
        month: Number(item.month),
        year: Number(item.year || currentYear),
        value: Number(item.value ?? item.amount ?? item.total ?? 0),
      })),
    [monthlyTrend],
  );

  const rows = useMemo(() => {
    const lastMonth = year === currentYear ? currentMonth : 12;

    return safeData
      .filter(
        (item) =>
          item.month >= 1 &&
          item.month <= lastMonth &&
          item.year === Number(year),
      )
      .sort((a, b) => a.month - b.month);
  }, [safeData, year]);

  const { axisMax, ticks, topMonth } = useMemo(() => {
    const max = Math.max(0, ...rows.map((item) => item.value));
    const step = niceStep(max / GRID_STEPS);

    return {
      axisMax: step * GRID_STEPS,
      ticks: Array.from({ length: GRID_STEPS + 1 }, (_, index) => index * step),
      topMonth: max > 0 ? rows.find((item) => item.value === max)?.month : null,
    };
  }, [rows]);

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Purchase Trend (Monthly)</ChartTitle>

        <YearSelect
          value={String(year)}
          onChange={(event) => {
            setYear(Number(event.target.value));
            setHoveredMonth(null);
          }}
        >
          {YEAR_OPTIONS.map((itemYear) => (
            <option key={itemYear} value={itemYear}>
              {itemYear}
            </option>
          ))}
        </YearSelect>
      </ChartHeader>

      <ChartBody style={{ opacity: loading ? 0.5 : 1 }}>
        <ChartContent>
          <GridLines>
            {Array.from({ length: GRID_STEPS }).map((_, index) => (
              <GridLine key={index} />
            ))}
          </GridLines>

          {rows.map((item) => {
            const width = axisMax
              ? Math.min(100, (item.value / axisMax) * 100)
              : 0;

            return (
              <ChartRow
                key={`${item.year}-${item.month}`}
                onMouseEnter={() => setHoveredMonth(item.month)}
                onMouseLeave={() => setHoveredMonth(null)}
              >
                <MonthLabel>{item.label || MONTHS[item.month - 1]}</MonthLabel>

                <BarArea>
                  <Bar
                    style={{ width: `${width}%` }}
                    active={item.month === topMonth}
                  />

                  {hoveredMonth === item.month && (
                    <Tooltip>
                      <TooltipTitle>Purchase Value</TooltipTitle>
                      <TooltipValue>{formatSAR(item.value)}</TooltipValue>
                    </Tooltip>
                  )}
                </BarArea>
              </ChartRow>
            );
          })}

          {!loading && rows.length === 0 && (
            <p style={{ padding: 12, fontSize: 12, color: "#666" }}>
              No purchase trend data available for {year}.
            </p>
          )}

          <XAxis>
            {ticks.map((tick, index) => (
              <XAxisValue key={index}>{formatAxis(tick)}</XAxisValue>
            ))}
          </XAxis>
        </ChartContent>
      </ChartBody>
    </ChartContainer>
  );
};

export default PurchaseTrendChart;
