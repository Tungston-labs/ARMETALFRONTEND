
import styled from "styled-components";

export const DashboardContainer = styled.div`
  width: 100%;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  box-sizing: border-box;
  overflow: hidden;
  font-family: "Urbanist", sans-serif;
  color: #111111;
    padding: 0 17px;
`;

export const ChartSection = styled.section`
  width: 100%;
  padding: 18px 0 22px;
  box-sizing: border-box;

border-bottom: ${({ $last }) =>
    $last ? "none" : "1px solid #e8e8e8"};
    
  @media (max-width: 600px) {
    padding: 18px 14px 22px;
  }
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

  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

export const Dropdown = styled.select`
  height: 38px;
  min-width: 78px;
  padding: 0 12px;
  border: 1px solid #e2e2e2;
  border-radius: 6px;
  background-color: #ffffff;
  color: #222222;
  font-family: inherit;
  font-size: 15px;
  outline: none;
  cursor: pointer;
  flex-shrink: 0;

  &:focus {
    border-color: #b8b8b8;
  }
`;

export const RevenueChartWrapper = styled.div`
  width: 100%;
  height: 245px;
  min-width: 0;

  .recharts-wrapper {
    font-family: inherit;
  }

  @media (max-width: 600px) {
    height: 225px;
  }
`;

export const PaymentContent = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
  align-items: center;
  gap: 24px;
  margin-top: 4px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
    gap: 20px;
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
  gap: 5px;
  width: 48%;
  text-align: center;
  pointer-events: none;
  color: #34345f;
  font-size: 15px;
  line-height: 1.45;

  strong {
    font-weight: 500;
    white-space: nowrap;
  }

  @media (max-width: 360px) {
    font-size: 13px;
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

  @media (max-width: 360px) {
    gap: 6px;
  }
`;

export const LegendLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;

  @media (max-width: 360px) {
    gap: 8px;
  }
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
  font-size: 12px;
  white-space: nowrap;
   color: #333333;

  @media (max-width: 900px) {
    font-size: 14px;
  }

  @media (max-width: 360px) {
    font-size: 12px;
  }
`;

export const LegendAmount = styled.span`
    color: #111111;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  text-align: right;

  @media (max-width: 900px) {
    font-size: 14px;
  }

  @media (max-width: 360px) {
    font-size: 12px;
  }
`;
