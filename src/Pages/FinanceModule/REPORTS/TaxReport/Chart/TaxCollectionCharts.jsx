
import React, { useState } from "react";
import {
  ChartsPanel,
  ChartSection,
  ChartHeader,
  ChartTitle,
  ChartSelect,
  ChartSvg,
  ChartDivider,
} from "./TaxCollectionCharts.styles";

const monthlyTax = {
  2026: [
    { month: "JAN", value: 21 },
    { month: "FEB", value: 10 },
    { month: "MAR", value: 4 },
    { month: "APR", value: 9 },
    { month: "MAY", value: 9 },
    { month: "JUN", value: 23 },
    { month: "JUL", value: 4 },
    { month: "AUG", value: 8 },
  ],
  2025: [
    { month: "JAN", value: 12 },
    { month: "FEB", value: 15 },
    { month: "MAR", value: 8 },
    { month: "APR", value: 11 },
    { month: "MAY", value: 14 },
    { month: "JUN", value: 18 },
    { month: "JUL", value: 16 },
    { month: "AUG", value: 20 },
  ],
  2024: [
    { month: "JAN", value: 8 },
    { month: "FEB", value: 12 },
    { month: "MAR", value: 10 },
    { month: "APR", value: 14 },
    { month: "MAY", value: 11 },
    { month: "JUN", value: 17 },
    { month: "JUL", value: 15 },
    { month: "AUG", value: 19 },
  ],
};

const comparisonData = {
  JAN: {
    months: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "JUL"],
    output: [500, 850, 650, 70, 560, 580, 1120, 900],
    input: [380, 720, 520, 30, 440, 470, 820, 680],
  },
  FEB: {
    months: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "JUL"],
    output: [420, 780, 600, 100, 490, 530, 920, 760],
    input: [320, 650, 460, 70, 400, 420, 700, 560],
  },
  MAR: {
    months: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "JUL"],
    output: [460, 800, 620, 80, 530, 560, 980, 810],
    input: [350, 680, 490, 50, 420, 450, 750, 610],
  },
};

const WIDTH = 390;
const LINE_HEIGHT = 205;
const BAR_HEIGHT = 215;

const LineChart = ({ year, hoveredIndex, setHoveredIndex }) => {
  const data = monthlyTax[year];
  const left = 48;
  const right = 8;
  const top = 14;
  const bottom = 29;
  const max = 25;
  const plotWidth = WIDTH - left - right;
  const plotHeight = LINE_HEIGHT - top - bottom;

  const x = (index) =>
    left + (index / (data.length - 1)) * plotWidth;

  const y = (value) =>
    top + ((max - value) / max) * plotHeight;

  const path = data
    .map((item, index) => {
      const px = x(index);
      const py = y(item.value);

      if (index === 0) return `M ${px} ${py}`;

      const previousX = x(index - 1);
      const previousY = y(data[index - 1].value);
      const midX = (previousX + px) / 2;

      return `Q ${midX} ${previousY} ${px} ${py}`;
    })
    .join(" ");

  const active = hoveredIndex === null ? null : data[hoveredIndex];

  const tooltipX =
    hoveredIndex === null
      ? 0
      : Math.max(49, Math.min(x(hoveredIndex) - 46, WIDTH - 105));

  const tooltipY =
    active === null ? 0 : Math.max(5, y(active.value) - 68);

  return (
    <ChartSvg viewBox={`0 0 ${WIDTH} ${LINE_HEIGHT}`} role="img" aria-label={`Monthly tax collection ${year}`}>
      {[0, 5, 10, 15, 20, 25].map((tick) => (
        <g key={tick}>
          <line
            x1={left}
            x2={WIDTH - right}
            y1={y(tick)}
            y2={y(tick)}
            className="grid-line"
          />
          <text
            x={left - 9}
            y={y(tick) + 3}
            textAnchor="end"
            className="axis-label"
          >
            {tick === 0 ? "0" : `${tick} M`}
          </text>
        </g>
      ))}

      {data.map((item, index) => (
        <line
          key={`grid-${index}`}
          x1={x(index)}
          x2={x(index)}
          y1={top}
          y2={LINE_HEIGHT - bottom}
          className="grid-line"
        />
      ))}

      <path
        d={path}
        fill="none"
        stroke="#ff7900"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {data.map((item, index) => (
        <g
          key={`${item.month}-${index}`}
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
            r="2.3"
            fill="#3154b5"
            pointerEvents="none"
          />
        </g>
      ))}

      {active && (
        <g pointerEvents="none">
          <rect
            x={tooltipX}
            y={tooltipY}
            width="98"
            height="53"
            rx="7"
            fill="#fff"
            stroke="#e8e8e8"
          />
          <text x={tooltipX + 10} y={tooltipY + 15} className="tooltip-title">
            {active.month.charAt(0) + active.month.slice(1).toLowerCase()}
          </text>
          <text x={tooltipX + 10} y={tooltipY + 30} className="tooltip-text">
            Tax Collected
          </text>
          <text x={tooltipX + 10} y={tooltipY + 44} className="tooltip-text">
            SAR {active.value}M
          </text>
        </g>
      )}

      {data.map((item, index) => (
        <text
          key={`label-${index}`}
          x={x(index)}
          y={LINE_HEIGHT - 9}
          textAnchor="middle"
          className="month-label"
        >
          {item.month}
        </text>
      ))}
    </ChartSvg>
  );
};

const ComparisonChart = ({ selectedMonth, setSelectedMonth }) => {
  const data = comparisonData[selectedMonth];
  const left = 48;
  const right = 8;
  const top = 14;
  const bottom = 29;
  const max = 1100;
  const plotWidth = WIDTH - left - right;
  const plotHeight = BAR_HEIGHT - top - bottom;

  const x = (index) =>
    left + (index / (data.months.length - 1)) * plotWidth;

  const y = (value) =>
    top + ((max - value) / max) * plotHeight;

  const outputPath = data.output
    .map((value, index) =>
      `${index === 0 ? "M" : "L"} ${x(index)} ${y(value)}`
    )
    .join(" ");

  const inputPath = data.input
    .map((value, index) =>
      `${index === 0 ? "M" : "L"} ${x(index)} ${y(value)}`
    )
    .join(" ");

  return (
    <ChartSvg viewBox={`0 0 ${WIDTH} ${BAR_HEIGHT}`} role="img" aria-label={`Output tax versus input tax for ${selectedMonth}`}>
      {[0, 200, 400, 600, 800, 1000].map((tick) => (
        <g key={tick}>
          <line
            x1={left}
            x2={WIDTH - right}
            y1={y(tick)}
            y2={y(tick)}
            className="grid-line"
          />
          <text
            x={left - 9}
            y={y(tick) + 3}
            textAnchor="end"
            className="axis-label"
          >
            {tick === 0 ? "0" : tick === 1000 ? "1M" : `${tick} K`}
          </text>
        </g>
      ))}

      {data.months.map((month, index) => (
        <line
          key={`grid-${index}`}
          x1={x(index)}
          x2={x(index)}
          y1={top}
          y2={BAR_HEIGHT - bottom}
          className="grid-line"
        />
      ))}

      <path
        d={outputPath}
        fill="none"
        stroke="#3154c5"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      <path
        d={inputPath}
        fill="none"
        stroke="#ff7900"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {data.months.map((month, index) => (
        <g key={`${month}-${index}`}>
          <circle cx={x(index)} cy={y(data.output[index])} r="2.3" fill="#3154c5" />
          <circle cx={x(index)} cy={y(data.input[index])} r="2.3" fill="#ff7900" />
          <text
            x={x(index)}
            y={BAR_HEIGHT - 9}
            textAnchor="middle"
            className="month-label"
          >
            {month}
          </text>
        </g>
      ))}
    </ChartSvg>
  );
};

const TaxCollectionCharts = () => {
  const [year, setYear] = useState("2026");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("JAN");

  return (
    <ChartsPanel>
      <ChartSection>
        <ChartHeader>
          <ChartTitle>Monthly Tax Collection</ChartTitle>
          <ChartSelect
            aria-label="Tax collection year"
            value={year}
            onChange={(event) => {
              setYear(event.target.value);
              setHoveredIndex(null);
            }}
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </ChartSelect>
        </ChartHeader>

        <LineChart
          year={year}
          hoveredIndex={hoveredIndex}
          setHoveredIndex={setHoveredIndex}
        />
      </ChartSection>

      <ChartDivider />

      <ChartSection>
        <ChartHeader>
          <ChartTitle>Output Tax vs Input Tax</ChartTitle>
          <ChartSelect
            aria-label="Comparison month"
            value={selectedMonth}
            onChange={(event) => setSelectedMonth(event.target.value)}
          >
            <option value="JAN">JAN</option>
            <option value="FEB">FEB</option>
            <option value="MAR">MAR</option>
          </ChartSelect>
        </ChartHeader>

        <ComparisonChart
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />

        <Legend>
          <LegendItem>
            <LegendColor $color="#3154c5" />
            Output Tax
          </LegendItem>
          <LegendItem>
            <LegendColor $color="#ff7900" />
            Input Tax
          </LegendItem>
        </Legend>
      </ChartSection>
    </ChartsPanel>
  );
};

export default TaxCollectionCharts;