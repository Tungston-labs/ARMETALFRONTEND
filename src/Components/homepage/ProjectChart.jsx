import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import {
  ChartCard,
  ChartTitle,
  ChartWrapper,
  IconButton,
  TooltipBox,
  getXAxisTickStyle,
  getYAxisTickStyle
} from "./ProjectChart.Styles";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const CustomTooltip = ({ active, payload }) => {

  if (active && payload && payload.length) {
    return (
      <TooltipBox>
        <p className="label">{payload[0].name}</p>
        <p className="value">{payload[0].value}</p>
      </TooltipBox>
    );
  }
  return null;
};

const ProjectChart = ({ projectEmployeeCount }) => {
  const navigate = useNavigate();

  if (!projectEmployeeCount) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  const { on_site, variant, bench } = projectEmployeeCount;

  const data = [
    { name: "On-Site", value: on_site || 0 },
    { name: "Variant", value: variant || 0 },
    { name: "Bench", value: bench || 0 }
  ];

  const maxValue = Math.max(on_site || 0, variant || 0, bench || 0);
  const roundedMax = Math.ceil(maxValue / 10) * 10 + 10;

  const ticks = [];
  for (let i = 0; i <= roundedMax; i += roundedMax / 6) {
    ticks.push(Math.round(i));
  }

  return (
    <ChartCard>
      <ChartTitle>
          <span>Project Summary</span>
          <IconButton onClick={() => navigate("/project")}>
    <BsArrowUpRightCircleFill />
  </IconButton>
      </ChartTitle>

      <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 10, bottom: 10 }}
            barCategoryGap="25%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

            <XAxis
              dataKey="name"
              tick={getXAxisTickStyle()}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={getYAxisTickStyle()}
              axisLine={false}
              tickLine={false}
              domain={[0, roundedMax]}
              ticks={ticks}
            />

            <Tooltip content={<CustomTooltip />} />

            <defs>
              <linearGradient id="barColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b5bff" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#3b5bff" stopOpacity={0.4} />
              </linearGradient>
            </defs>

            <Bar
              dataKey="value"
              fill="url(#barColor)"
              radius={[10, 10, 0, 0]}
              animationDuration={3000}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </ChartCard>
  );
};


export default ProjectChart;
