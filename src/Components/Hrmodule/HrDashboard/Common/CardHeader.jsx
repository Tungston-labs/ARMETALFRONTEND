import React from "react";
import {
  Header,
  Title,
  RightContent,
} from "./CardHeader.styles";

const CardHeader = ({
  title,
  control,
  className,
}) => {
  return (
    <Header className={className}>
      <Title>{title}</Title>

      <RightContent>
        {control}
      </RightContent>
    </Header>
  );
};

export default CardHeader;