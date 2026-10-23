import React from "react";
import { CardContainer } from "./Card.styles";

const Card = ({ children, className }) => {
  return (
    <CardContainer className={className}>
      {children}
    </CardContainer>
  );
};

export default Card;