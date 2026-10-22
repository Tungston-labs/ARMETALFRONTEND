import styled from "styled-components";

export const DashboardContainer = styled.div`
  width: 100%;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  padding: 0 17px;
  box-sizing: border-box;
  font-family: "Urbanist", sans-serif;
`;

export const ChartSection = styled.section`
  width: 100%;
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
  margin-bottom: 10px;
  min-height: 36px;

  @media (max-width: 420px) {
    align-items: flex-start;
    flex-wrap: wrap;
  }
`;

export const SectionTitle = styled.h3`
  margin: 0;
  color: #111111;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
`;

export const Dropdown = styled.select`
  min-width: 74px;
  height: 36px;
  padding: 0 10px;
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

export const PurchaseChartWrapper = styled.div`
  width: 100%;
  height: 245px;
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
    height: 200px;
  }
`;

export const PaymentContent = styled.div`
  display: grid;
  grid-template-columns: minmax(145px, 1fr) minmax(155px, 1.15fr);
  align-items: center;
  gap: 12px;
  width: 100%;

  @media (max-width: 480px) {
    grid-template-columns: minmax(125px, 0.95fr) minmax(135px, 1.05fr);
    gap: 8px;
  }

  @media (max-width: 360px) {
    grid-template-columns: minmax(105px, 0.9fr) minmax(125px, 1.1fr);
    gap: 5px;
  }
`;

export const DoughnutWrapper = styled.div`
 width: 100%;
  max-width: 290px;
  height: 255px;
  margin: 0 auto;
  position: relative;
  min-width: 0;

  @media (max-width: 700px) {
    max-width: 270px;
    height: 240px;
  }
`;

export const DoughnutCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 75%;
  pointer-events: none;
  text-align: center;
  color: #292957;
  line-height: 1.7;

  span {
    font-size: 12px;
    white-space: nowrap;
  }

  strong {
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
  }

  @media (max-width: 360px) {
    span,
    strong {
      font-size: 10px;
    }
  }
`;

export const PaymentLegend = styled.div`
  width: 100%;
  min-width: 0;
`;

export const LegendRow = styled.div`
   display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  min-height: 40px;
  border-bottom: 1px solid #e5e5e5;
  padding: 8px 0;
  box-sizing: border-box;

 
   &:first-child {
    border-top: none;
  }
`;

export const LegendLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const LegendDot = styled.span`
   display: inline-block;
  width: 11px;
  height: 11px;
  min-width: 11px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

export const LegendLabel = styled.span`
  color: #333333;
  font-size: 12px;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

export const LegendAmount = styled.span`
  color: #111111;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;

  @media (max-width: 480px) {
    font-size: 10px;
  }
`;

export const LegendDivider = styled.div`
  width: 100%;
  height: 1px;
  background: #ededed;
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