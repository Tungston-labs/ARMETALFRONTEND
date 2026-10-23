import styled from "styled-components";

export const PlanContainer = styled.div`
  position: relative;
  width: 100%;
  height: 276px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e1e1e1;
  border-radius: 5px;
  box-sizing: border-box;
`;

export const PlanHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const PlanTitle = styled.h2`
  margin: 0;
  color: #111111;
  font-size: 15px;
  font-weight: 500;
`;

export const MonthButton = styled.button`
  border: none;
  border-radius: 8px;
  padding: 8px 10px;
  background: #fafafa;

  display: flex;
  align-items: center;
  gap: 8px;

  color: #111111;
  font-size: 10px;
  font-weight: 500;

  cursor: pointer;

  svg {
    color: #ff841d;
    font-size: 13px;
  }
`;

export const ChartWrapper = styled.div`
  position: relative;
  margin-top: 12px;
  height: 190px;
  padding-left: 62px;

  background-image: repeating-linear-gradient(
    to right,
    transparent 0,
    transparent calc(20% - 1px),
    #e1e4e9 calc(20% - 1px),
    #e1e4e9 20%
  );

  &::after {
    content: "";
    position: absolute;
    left: 62px;
    right: 0;
    bottom: 28px;
    border-bottom: 1px solid #cfcfcf;
  }

  .axis-labels {
    position: absolute;
    left: 62px;
    right: 0;
    bottom: 0;

    display: flex;
    justify-content: space-between;

    color: #666666;
    font-size: 10px;
  }
`;

export const PlanRow = styled.div`
  height: 47px;
  display: flex;
  align-items: center;
`;

export const PlanLabel = styled.span`
  position: absolute;
  left: 0;
  width: 55px;

  color: #555555;
  font-size: 10px;
  text-align: right;
`;

export const BarArea = styled.div`
  width: 100%;
  height: 18px;
  display: flex;
  align-items: center;
`;

export const PlanBar = styled.div`
  height: 18px;
  border-radius: 0 7px 7px 0;
  background: #3857bd;
  transition: width 0.3s ease;
`;

export const PlanValue = styled.span`
  font-size: 10px;
`;

export const TooltipBox = styled.div`
  position: absolute;
  right: 28px;
  top: 58px;

  min-width: 120px;
  padding: 12px;

  background: #ffffff;
  border-radius: 8px;

  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);

  z-index: 5;
`;

export const TooltipMonth = styled.div`
  margin-bottom: 6px;

  color: #222222;
  font-size: 12px;
  font-weight: 600;
`;

export const TooltipValue = styled.div`
  color: #3c3c7c;
  font-size: 11px;
`;