import React from "react";
import Card from "../Common/Card";
import CardHeader from "../Common/CardHeader";
import Dropdown from "../Common/Dropdown";

import {
  Container,
  InfoCard,
  Logo,
  Content,
  Column,
  Title,
  Value,
} from "./GosiCard.styles";

const GosiCard = ({ data }) => {
  return (
    <Card>
      <CardHeader
        title="GOSI Contributions"
        control={
          <Dropdown
            options={["July", "June", "May"]}
            value="July"
          />
        }
      />

      <Container>
        {/* First Row */}
        <InfoCard>
          <Logo src="/images/gosi.png" alt="gosi" />

          <Content>
            <Column>
              <Title>GOSI Contribution</Title>
              <Value>SAR 285,400 (July)</Value>
            </Column>

            <Column>
              <Title>Company Paid</Title>
              <Value>SAR 165,800</Value>
            </Column>

            <Column>
              <Title>Salary Deduction</Title>
              <Value>SAR 165,800</Value>
            </Column>
          </Content>
        </InfoCard>

        {/* Second Row */}
        <InfoCard>
          <Logo src="/images/gosi.png" alt="gosi" />

          <Content>
            <Column>
              <Title>Next GOSI Due Date</Title>
              <Value>Aug 15, 2026</Value>
            </Column>

            <Column>
              <Title>Registered Employees</Title>
              <Value>412</Value>
            </Column>
          </Content>
        </InfoCard>
      </Container>
    </Card>
  );
};

export default GosiCard;