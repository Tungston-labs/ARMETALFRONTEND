import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  Wrapper,
  Title,
  LegendBox,
  LegendItem,
  ColorDot,
  DoughnutWrapper
} from "./AttendanceCircle.styles";

ChartJS.register(ArcElement, Tooltip, Legend);

const AttendanceCircle = ({ present = 0, leave = 0 }) => {

  const presentVal = Number(present) || 0;
  const leaveVal = Number(leave) || 0;

  const safeData =
    presentVal === 0 && leaveVal === 0 ? [1, 0] : [presentVal, leaveVal];

  const data = {
    labels: ["Present", "Leave"],
    datasets: [
      {
        data: safeData,
        backgroundColor: ["#3352BA", "#f6413b"],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const options = {
    rotation: -90,
    circumference: 180, 
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <Wrapper>
      <Title>Today's Attendance</Title>

      <DoughnutWrapper>
        <Doughnut data={data} options={options} />
      </DoughnutWrapper>

      <LegendBox>
        <LegendItem>
          <ColorDot color="#3352BA" />
          Present: {presentVal}%
        </LegendItem>

        <LegendItem>
          <ColorDot color="#f6413b" />
          Leave: {leaveVal}%
        </LegendItem>
      </LegendBox>
    </Wrapper>
  );
};

export default AttendanceCircle;
