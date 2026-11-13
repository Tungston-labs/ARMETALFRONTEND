import React, { useMemo } from "react";
import {
  ChartContainer,
  ChartHeader,
  ChartTitle,
  YearSelect,
  ChartBody,
  Plot,
  YAxis,
  YTick,
  Bars,
  BarGroup,
  Bar,
  XAxis,
  Legend,
  LegendItem,
  Dot,
  EmptyChart,
} from "./EquityChart.style";
import { formatMoney } from "../changesInEquityConfig";

const COLORS = {
  share_capital: "#078A19",
  retained_earnings: "#7C4DFF",
  reserves: "#3452B7",
  other_equity: "#FF850A",
};
const LABELS = {
  share_capital: "Share Capital",
  retained_earnings: "Retained Earnings",
  reserves: "Reserves",
  other_equity: "Other Equity",
};
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
const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = [currentYear, currentYear - 1, currentYear - 2];

const EquityComponentsTrend = ({
  components = {},
  year = currentYear,
  onYearChange,
  loading,
}) => {
  const chartData = useMemo(() => {
    // API summary is period-scoped. Component closing balances are shown as
    // the latest available component totals; do not fabricate monthly history.
    const keys = Object.keys(LABELS);
    return keys.map((key) => ({
      key,
      label: LABELS[key],
      value: Math.max(0, Number(components?.[key]?.closing_balance || 0)),
    }));
  }, [components]);

  const maxValue = Math.max(1, ...chartData.map((item) => item.value));
  const axisMax = Math.ceil(maxValue / 5) * 5;
  const ticks = Array.from({ length: 6 }, (_, index) => (axisMax / 5) * index);

  return (
    <ChartContainer>
      <ChartHeader>
        <ChartTitle>Equity Components Trend</ChartTitle>
        <YearSelect
          value={String(year)}
          onChange={(event) => onYearChange?.(event.target.value)}
        >
          {YEAR_OPTIONS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </YearSelect>
      </ChartHeader>
      <ChartBody style={{ opacity: loading ? 0.55 : 1 }}>
        <YAxis>
          {ticks
            .slice()
            .reverse()
            .map((tick, index) => (
              <YTick key={index}>
                {tick >= 1_000_000
                  ? `${(tick / 1_000_000).toFixed(0)}M`
                  : formatMoney(tick)}
              </YTick>
            ))}
        </YAxis>
        <Plot>
          {ticks.map((tick, index) => (
            <div
              key={index}
              className="grid-line"
              style={{ bottom: `${(tick / axisMax) * 100}%` }}
            />
          ))}
          <Bars>
            {chartData.map((item) => (
              <BarGroup
                key={item.key}
                title={`${item.label}: SAR ${formatMoney(item.value)}`}
              >
                <Bar
                  style={{
                    height: `${(item.value / axisMax) * 100}%`,
                    background: COLORS[item.key],
                  }}
                />
                <span>{item.label.split(" ")[0]}</span>
              </BarGroup>
            ))}
          </Bars>
        </Plot>
      </ChartBody>
      {!chartData.some((item) => item.value > 0) && (
        <EmptyChart>No equity data for this period</EmptyChart>
      )}
      <Legend>
        {Object.keys(LABELS).map((key) => (
          <LegendItem key={key}>
            <Dot style={{ background: COLORS[key] }} />
            {LABELS[key]}
          </LegendItem>
        ))}
      </Legend>
    </ChartContainer>
  );
};

export default EquityComponentsTrend;
