import React, { useState } from "react";
import {
  Card,
  Header,
  Title,
  Hours,
  SubTitle,
  BarWrapper,
  BarContainer,
  Bar,
  Day,
  Tooltip
} from "./ProgressCard.styles";

const ProgressCard = ({ attendanceGraph }) => {
  const days = Object.keys(attendanceGraph);
  const hoursData = Object.values(attendanceGraph);

  const [hoverIndex, setHoverIndex] = useState(null);
  const maxHours = Math.max(...hoursData);
  const maxBarHeight = 100;

  const totalHours = hoursData.reduce((a, b) => a + b, 0).toFixed(1);

  return (
    <Card>
      <Header>
        <div>
          <Title>Progress</Title>
          <Hours>{totalHours} hours</Hours>
          <SubTitle>Work Time This Week</SubTitle>
        </div>
      </Header>

      <BarWrapper>
        {days.map((day, i) => {
          const height = (hoursData[i] / maxHours) * maxBarHeight + "px";

          return (
            <BarContainer
              key={i}
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              {hoverIndex === i && <Tooltip>{hoursData[i]}h</Tooltip>}
              <Bar height={height} 
              highlight={i === 5} />
              <Day>{day.slice(0, 3)}</Day>
            </BarContainer>
          );
        })}
      </BarWrapper>
    </Card>
  );
};

export default ProgressCard;
