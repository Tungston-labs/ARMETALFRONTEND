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
} from "./SalesTrendChart.styles";

import { formatNumber } from "../Salesreportconfig";

const GRID_STEPS = 6; 


const niceStep = (raw) => {
    if (raw <= 0) return 1;
    const power = Math.pow(10, Math.floor(Math.log10(raw)));
    const fraction = raw / power;
    const nice = [1, 2, 2.5, 5, 10].find((n) => fraction <= n);
    return nice * power;
};

const formatAxis = (value) => {
    if (value >= 1_000_000) return `${+(value / 1_000_000).toFixed(2)} M`;
    if (value >= 1_000) return `${+(value / 1_000).toFixed(1)} K`;
    return String(value);
};

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1; // 1-12
const YEAR_OPTIONS = [currentYear, currentYear - 1, currentYear - 2];


const SalesTrendChart = ({
    data = [],
    year = currentYear,
    onYearChange,
    loading = false,
}) => {
    const [hoveredMonth, setHoveredMonth] = useState(null);

    
    const rows = useMemo(() => {
        const lastMonth =
            Number(year) === currentYear ? currentMonth : 12;

        return data.filter((m) => m.month <= lastMonth).reverse();
    }, [data, year]);

    const { axisMax, ticks, topMonth } = useMemo(() => {
        const max = Math.max(0, ...data.map((m) => Number(m.revenue) || 0));
        const step = niceStep(max / GRID_STEPS);
        const axisMax = step * GRID_STEPS;

        const top = data.find((m) => Number(m.revenue) === max && max > 0);

        return {
            axisMax,
            ticks: Array.from({ length: GRID_STEPS + 1 }, (_, i) => i * step),
            topMonth: top ? top.month : null,
        };
    }, [data]);

    return (
        <ChartContainer>
            {/* Header */}
            <ChartHeader>
                <ChartTitle>Sales Trend (Monthly)</ChartTitle>

                <YearSelect
                    value={String(year)}
                    onChange={(event) => onYearChange?.(event.target.value)}
                >
                    {YEAR_OPTIONS.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </YearSelect>
            </ChartHeader>

            {/* Chart */}
            <ChartBody style={{ opacity: loading ? 0.5 : 1 }}>
                <ChartContent>
                    {/* Vertical grid lines */}
                    <GridLines>
                        {Array.from({ length: GRID_STEPS }).map((_, i) => (
                            <GridLine key={i} />
                        ))}
                    </GridLines>

                    {/* Bars */}
                    {rows.map((item) => {
                        const revenue = Number(item.revenue) || 0;
                        const width = axisMax ? (revenue / axisMax) * 100 : 0;

                        return (
                            <ChartRow
                                key={item.month}
                                onMouseEnter={() => setHoveredMonth(item.month)}
                                onMouseLeave={() => setHoveredMonth(null)}
                            >
                                <MonthLabel>
                                    {String(item.label).toUpperCase()}
                                </MonthLabel>

                                <BarArea>
                                    <Bar
                                        style={{ width: `${width}%` }}
                                        active={item.month === topMonth}
                                    />

                                    {hoveredMonth === item.month && (
                                        <Tooltip>
                                            <TooltipTitle>
                                                Sales Revenue
                                            </TooltipTitle>

                                            <TooltipValue>
                                                {formatNumber(revenue)}
                                            </TooltipValue>
                                        </Tooltip>
                                    )}
                                </BarArea>
                            </ChartRow>
                        );
                    })}

                    {/* X Axis */}
                    <XAxis>
                        {ticks.map((tick, i) => (
                            <XAxisValue key={i}>{formatAxis(tick)}</XAxisValue>
                        ))}
                    </XAxis>
                </ChartContent>
            </ChartBody>
        </ChartContainer>
    );
};

export default SalesTrendChart;