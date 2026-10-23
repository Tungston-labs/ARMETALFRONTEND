import React from "react";
import {
  Card,
  TopSection,
  IconContainer,
  Content,
  Title,
  Value,
  BottomSection,
  ChangeContainer,
  ChangeText,
  Grid,
} from "./StatsGrid.styles";

const StatsGrid = ({ data }) => {
  return (
    <Grid>
      {data.map((item) => (
        <Card key={item.id}>
          <TopSection>
            <IconContainer bg={item.iconBg}>
              {React.cloneElement(item.icon, {
                color: item.iconColor,
                size: 28,
              })}
            </IconContainer>

            <Content>
              <Value>{item.value}</Value>
              <Title>{item.title}</Title>
            </Content>
          </TopSection>

          <BottomSection>
            <ChangeContainer color={item.percentageColor}>
              {item.percentage}
            </ChangeContainer>

            <ChangeText>{item.description}</ChangeText>
          </BottomSection>
        </Card>
      ))}
    </Grid>
  );
};

export default StatsGrid;