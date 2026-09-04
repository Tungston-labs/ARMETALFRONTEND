import React from "react";
import { useSelector } from "react-redux";
import { FaCalendarAlt } from "react-icons/fa";
import {
  PlanContainer,
  PlanHeader,
  PlanTitle,
  MonthButton,
  ChartWrapper,
  PlanRow,
  PlanLabel,
  BarArea,
  PlanBar,
  PlanValue,
  TooltipBox,
  TooltipMonth,
  TooltipValue,
} from "./TopPlan.Styles";

const TopPlan = () => {
  const { overview } = useSelector((state) => state.superAdmin);
  const plans = overview?.top_plans || [];

  const maxValue = plans.length > 0 ? Math.max(...plans.map((p) => p.value), 5000) : 5000;

  const formatINR = (value) => {
    if (value === 0) return "0";
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${Number(value).toFixed(0)}`;
  };

  // Find the highest revenue plan for the tooltip summary
  const topPlan = plans.length > 0
    ? plans.reduce((max, p) => (p.value > max.value ? p : max), plans[0])
    : null;

  const currentMonthName = new Date().toLocaleString("en-US", { month: "long" });

  return (
    <PlanContainer>
      <PlanHeader>
        <PlanTitle>Top Plan</PlanTitle>

        <MonthButton>
          <FaCalendarAlt />
          THIS MONTH
        </MonthButton>
      </PlanHeader>

      <ChartWrapper>
        {plans.map((plan) => (
          <PlanRow key={plan.name}>
            <PlanLabel>{plan.name}</PlanLabel>

            <BarArea>
              <PlanBar
                style={{
                  width: `${(plan.value / maxValue) * 100}%`,
                }}
              />
            </BarArea>
          </PlanRow>
        ))}

        <div className="axis-labels">
          <span>0</span>
          <span>{formatINR(maxValue * 0.25)}</span>
          <span>{formatINR(maxValue * 0.5)}</span>
          <span>{formatINR(maxValue * 0.75)}</span>
          <span>{formatINR(maxValue)}</span>
        </div>

        {topPlan && topPlan.value > 0 && (
          <TooltipBox>
            <TooltipMonth>{currentMonthName}</TooltipMonth>
            <TooltipValue>
              {topPlan.name} · {formatINR(topPlan.value)}
            </TooltipValue>
          </TooltipBox>
        )}
      </ChartWrapper>
    </PlanContainer>
  );
};

export default TopPlan;