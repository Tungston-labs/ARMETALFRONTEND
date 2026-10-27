
import styled from "styled-components";

export const ChartsPanel = styled.div`
  width: 100%;
  min-width: 0;
  border: 1px solid #e7e7e7;
  border-radius: 5px;
  background: #fff;
  overflow: hidden;
  box-sizing: border-box;
`;

export const ChartSection = styled.section`
  width: 100%;
  min-width: 0;
  padding: 10px;
  box-sizing: border-box;
`;

export const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
`;

export const ChartTitle = styled.h3`
  margin: 0;
  color: #111;
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
`;

export const ChartSelect = styled.select`
  width: 70px;
  height: 28px;
  flex-shrink: 0;
  padding: 0 5px;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  outline: none;
  background: #fff;
  color: #222;
  font-family: inherit;
  font-size: 11px;
  cursor: pointer;

  &:focus {
    border-color: #7772d8;
  }
`;

export const ChartSvg = styled.svg`
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
  font-family: "Poppins", sans-serif;

  .grid-line {
    stroke: #e9e9e9;
    stroke-width: 1;
  }

  .axis-label {
    fill: #555;
    font-size: 10px;
    font-weight: 400;
  }

  .month-label {
    fill: #555;
    font-size: 9px;
    font-weight: 400;
  }

  .tooltip-title {
    fill: #17144f;
    font-size: 11px;
    font-weight: 500;
  }

  .tooltip-text {
    fill: #17144f;
    font-size: 10px;
    font-weight: 400;
  }

  .chart-line {
    fill: none;
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .chart-point {
    stroke: #fff;
    stroke-width: 1.5;
  }

  @media (max-width: 500px) {
    .axis-label {
      font-size: 9px;
    }

    .month-label {
      font-size: 8px;
    }
  }
`;

export const ChartDivider = styled.div`
  width: 100%;
  height: 1px;
  background: #e7e7e7;
`;

export const Legend = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 20px;
  margin-top: 10px;
  padding: 2px 8px 8px;
  color: #555;
  font-family: "Poppins", sans-serif;
  font-size: 10px;
  box-sizing: border-box;

  @media (max-width: 500px) {
    gap: 8px 12px;
    font-size: 9px;
  }
`;

export const LegendItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  color: #555;
  font-size: inherit;
`;

export const LegendColor = styled.span`
  display: inline-block;
  width: 9px;
  height: 9px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${(props) => props.$color || "#888"};
`;
