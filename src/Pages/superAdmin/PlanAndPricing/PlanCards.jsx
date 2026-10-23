import React from "react";
import {
  CardContainer,
  PlanCard,
  Top,
  PlanName,
  Badge,
  Price,
  Currency,
  Month,
  Description,
  FeatureList,
  Feature,
  EditButton,
} from "./PlanCards.styles";

import { FiCheckCircle } from "react-icons/fi";

const PlanCards = ({ plans, onEdit }) => {
  return (
    <CardContainer>
      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          orange={plan.tier?.toLowerCase() === "enterprise"}
        >
          <Top>
            <PlanName>
              {plan.plan}
            </PlanName>

            <Badge>
              {plan.tier}
            </Badge>
          </Top>

          <Price>
            <Currency>₹</Currency>{" "}
            {plan.price}
            <Month>/ Month</Month>
          </Price>

          <Description>
            {plan.description || "No description available."}
          </Description>

          <FeatureList>
            {plan.featureList?.length > 0 ? (
              plan.featureList.map((feature) => (
                <Feature key={feature.id}>
                  <FiCheckCircle />
                  {feature.name}
                </Feature>
              ))
            ) : (
              <Feature>
                No features available
              </Feature>
            )}
          </FeatureList>

          <EditButton
            type="button"
            onClick={() => onEdit?.(plan.raw)}
          >
            EDIT PLAN
          </EditButton>
        </PlanCard>
      ))}
    </CardContainer>
  );
};

export default PlanCards;