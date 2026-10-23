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

const StatsCards = ({ cards = [], loading = false }) => {
  if (loading) {
    return (
      <Wrapper>
        {Array.from({ length: cards.length || 4 }).map((_, index) => (
          <SkeletonStatsCard key={index} />
        ))}
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      {cards.map((card, index) => (
        <Card
          key={card.title || index}
          onClick={card.onClick}
          $clickable={Boolean(card.onClick)}
        >
          <IconWrapper $bg={card.backgroundColor} $color={card.iconColor}>
            {card.icon}
          </IconWrapper>

          <Content>
            <Count title={String(card.count)}>{card.count}</Count>
            <Title title={card.title}>{card.title}</Title>
          </Content>
        </Card>
      ))}
    </Wrapper>
  );
};

export default StatsCards;