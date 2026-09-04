import React from "react";

import {
  Wrapper,
  Card,
  IconWrapper,
  Content,
  Count,
  Title,
} from "./StatsCards.styles";

import SkeletonStatsCard from "../Skeleton/SkeletonStatsCard";

const StatsCards = ({
  cards = [],
  loading = false,
}) => {
  if (loading) {
    return (
      <Wrapper>
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonStatsCard key={index} />
        ))}
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {cards.map((card, index) => (
        <Card
          key={index}
          onClick={card.onClick}
        >
          <IconWrapper
            bg={card.backgroundColor}
            color={card.iconColor}
          >
            {card.icon}
          </IconWrapper>

          <Content>
            <Count>
              {card.count}
            </Count>

            <Title>
              {card.title}
            </Title>
          </Content>
        </Card>
      ))}
    </Wrapper>
  );
};

export default StatsCards;