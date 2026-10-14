import React, { useState } from "react";
import {
    ChartContainer,
    ChartHeader,
    ChartTitle,
    YearSelect,
    ChartBody,
    YAxis,
    YAxisValue,
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

const salesData = [
    {
        month: "DEC",
        value: 5,
        amount: "SAR 5,120",
    },
    {
        month: "NOV",
        value: 11,
        amount: "SAR 11,240",
    },
    {
        month: "OCT",
        value: 17,
        amount: "SAR 17,420",
    },
    {
        month: "SEP",
        value: 11,
        amount: "SAR 11,120",
    },
    {
        month: "AUG",
        value: 19,
        amount: "SAR 19,240",
    },
    {
        month: "JULY",
        value: 13,
        amount: "SAR 13,420",
    },
    {
        month: "JUN",
        value: 19,
        amount: "SAR 19,620",
    },
    {
        month: "MAY",
        value: 24,
        amount: "SAR 24,120",
    },
    {
        month: "APR",
        value: 21,
        amount: "SAR 21,320",
    },
    {
        month: "MAR",
        value: 31,
        amount: "SAR 14,835",
        active: true,
    },
    {
        month: "FEB",
        value: 18,
        amount: "SAR 18,120",
    },
    {
        month: "JAN",
        value: 13,
        amount: "SAR 13,420",
    },
];

const SalesTrendChart = () => {
    const [year, setYear] = useState("2026");
    const [hoveredMonth, setHoveredMonth] = useState(null);

    const maxValue = 31;

    return (
        <ChartContainer>
            {/* Header */}
            <ChartHeader>
                <ChartTitle>
                    Sales Trend (Monthly)
                </ChartTitle>

                <YearSelect
                    value={year}
                    onChange={(event) =>
                        setYear(event.target.value)
                    }
                >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                </YearSelect>
            </ChartHeader>

            {/* Chart */}
            <ChartBody>

                <ChartContent>

                    {/* Vertical grid lines */}
                    <GridLines>
                        <GridLine />
                        <GridLine />
                        <GridLine />
                        <GridLine />
                        <GridLine />
                        <GridLine />
                    </GridLines>

                    {/* Bars */}
                    {salesData.map((item) => {
                        const width =
                            (item.value / maxValue) * 100;

                        return (
                            <ChartRow
                                key={item.month}
                                onMouseEnter={() =>
                                    setHoveredMonth(item.month)
                                }
                                onMouseLeave={() =>
                                    setHoveredMonth(null)
                                }
                            >
                                <MonthLabel>
                                    {item.month}
                                </MonthLabel>

                                <BarArea>
                                    <Bar
                                        style={{
                                            width: `${width}%`,
                                        }}
                                        active={item.active}
                                    />

                                    {hoveredMonth ===
                                        item.month && (
                                        <Tooltip>
                                            <TooltipTitle>
                                                Sales Revenue
                                            </TooltipTitle>

                                            <TooltipValue>
                                                {item.amount}
                                            </TooltipValue>
                                        </Tooltip>
                                    )}
                                </BarArea>
                            </ChartRow>
                        );
                    })}

                    {/* X Axis */}
                    <XAxis>
                        <XAxisValue>0</XAxisValue>
                        <XAxisValue>5 M</XAxisValue>
                        <XAxisValue>10 M</XAxisValue>
                        <XAxisValue>15 M</XAxisValue>
                        <XAxisValue>20 M</XAxisValue>
                        <XAxisValue>25 M</XAxisValue>
                        <XAxisValue>25 M</XAxisValue>
                    </XAxis>

                </ChartContent>
            </ChartBody>
        </ChartContainer>
    );
};

export default SalesTrendChart;