
import styled from "styled-components";

export const DashboardContainer = styled.div`
  width: 100%;
  min-width: 0;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  padding: 0 17px;
  box-sizing: border-box;
  font-family: "Urbanist", sans-serif;
`;

export const ChartSection = styled.section`
  width: 100%;
  min-width: 0;
  padding: 18px 0 22px;
  box-sizing: border-box;
  border-bottom: ${({ $last }) =>
    $last ? "none" : "1px solid #e8e8e8"};
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

export const SectionTitle = styled.h3`
  margin: 0;
  color: #111111;
  font-family: "Urbanist", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
`;

export const Dropdown = styled.select`
  min-width: 74px;
  height: 36px;
  padding: 0 10px;
  flex-shrink: 0;
  background: #ffffff;
  border: 1px solid #e3e3e3;
  border-radius: 6px;
  color: #111111;
  font-family: inherit;
  font-size: 14px;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #a5a5a5;
  }
`;

export const ChartWrapper = styled.div`
  width: 100%;
  height: 242px;
  min-width: 0;

  .recharts-wrapper {
    font-family: "Urbanist", sans-serif;
  }

  .recharts-cartesian-grid-horizontal line,
  .recharts-cartesian-grid-vertical line {
    stroke: #e8e8e8;
    stroke-width: 1;
  }

  .recharts-tooltip-wrapper {
    z-index: 10;
  }

  @media (max-width: 480px) {
    height: 220px;
  }
`;

export const CustomTooltipContainer = styled.div`
  min-width: 115px;
  padding: 9px 14px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 12px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  color: #292957;
  box-sizing: border-box;
`;

export const TooltipMonth = styled.div`
  margin-bottom: 3px;
  color: #292957;
  font-size: 14px;
  font-weight: 500;
`;

export const TooltipLabel = styled.div`
  margin-bottom: 3px;
  color: #292957;
  font-size: 14px;
  white-space: nowrap;
`;

export const TooltipValue = styled.div`
  color: #292957;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
`;

export const Legend = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 2px 0 5px;
  color: #555555;
  font-size: 12px;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const LegendColor = styled.span`
  display: inline-block;
  width: 15px;
  height: 3px;
  border-radius: 2px;
  background: ${({ $color }) => $color};
`;
