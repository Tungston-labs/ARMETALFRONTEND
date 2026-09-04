import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  CardBox, 
  LeftSection, 
  RightSection, 
  StatNumber, 
  StatLabel, 
  IconBox, 
  Arrow 
} from "./StatCard.Styles";
import { BsArrowUpRightCircleFill } from "react-icons/bs";
const StatsCard = ({ number, label, icon: Icon, route }) => {
  const navigate = useNavigate();

  return (
    <CardBox onClick={() => navigate(route)}>
      <LeftSection>
        <IconBox>
          <Icon size={28} />
        </IconBox>
        <div>
          <StatNumber>{number}</StatNumber>
          <StatLabel>{label}</StatLabel>
        </div>
      </LeftSection>

      <RightSection>
        <Arrow><BsArrowUpRightCircleFill /></Arrow>
      </RightSection>
    </CardBox>
  );
};

export default StatsCard;
