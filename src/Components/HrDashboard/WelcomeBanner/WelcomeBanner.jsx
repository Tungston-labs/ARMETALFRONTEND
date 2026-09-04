import React from "react";

import {
  Container,
  LeftSection,
  Greeting,
  Title,
  Description,
  RightSection,
  Summary,
  SummaryTitle,
  ProgressRow,
  Dot,
  Label,
  ProgressBar,
  Progress,
  Count,
  Attendance,
} from "./WelcomeBanner.styles";

import { getGreeting } from "../../../utils/dateUtils";

const WelcomeBanner = ({ data = {} }) => {

  const totalEmployees = data.total_employees ?? 0;

  const presentToday = data.present_today_count ?? 0;

  const onLeaveToday = data.on_leave_today_count ?? 0;

  const presentPercentage = data.present_percentage ?? 0;

  const leavePercentage = data.leave_percentage ?? 0;

  return (
    <Container>

      {/* Left Section */}
      <LeftSection>

        <Greeting>
          {getGreeting()}
        </Greeting>

        <Title>
          Welcome back, Admin!
        </Title>

        <Description>
          Here's what's happening at your company today.
        </Description>

      </LeftSection>

      {/* Right Section */}
      <RightSection>

        <Summary>

          <SummaryTitle>
            Today's Summary
          </SummaryTitle>

          {/* Check In */}
          <ProgressRow>

            <Label>
              <Dot color="#22c55e" />

              Check In
            </Label>

            <ProgressBar>
              <Progress
                width={`${presentPercentage}%`}
                color="#22c55e"
              />
            </ProgressBar>

            <Count>
              {presentToday}/{totalEmployees}
            </Count>

          </ProgressRow>

          {/* On Leave */}
          <ProgressRow>

            <Label>
              <Dot color="#f59e0b" />

              On Leave
            </Label>

            <ProgressBar>
              <Progress
                width={`${leavePercentage}%`}
                color="#f59e0b"
              />
            </ProgressBar>

            <Count>
              {onLeaveToday}
            </Count>

          </ProgressRow>

        </Summary>

      </RightSection>

    </Container>
  );
};

export default WelcomeBanner;