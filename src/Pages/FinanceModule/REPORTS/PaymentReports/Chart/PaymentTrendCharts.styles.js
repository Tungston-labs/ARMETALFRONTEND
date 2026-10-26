import styled from "styled-components";

export const ChartsPanel = styled.div`
  width: 100%;
  min-width: 0;
  min-height: 584px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 0;
  border: 1px solid #e4e4e4;
  border-radius: 5px;
  background: #ffffff;
  box-sizing: border-box;

  @media (max-width: 600px) {
    min-height: 0;
    padding: 12px;
  }
`;

export const TrendSection = styled.section`
  width: 100%;
  min-width: 0;
  flex: 0 0 auto;
  box-sizing: border-box;
`;

export const ChartHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 12px;
`;

export const ChartTitle = styled.h3`
  margin: 0;
  color: #111111;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
`;

export const Select = styled.select`
  width: auto;
  min-width: 58px;
  max-width: 100px;
  height: 31px;
  padding: 0 8px;
  border: 1px solid #dedede;
  border-radius: 4px;
  background: #ffffff;
  color: #222222;
  font-family: inherit;
  font-size: 11px;
  outline: none;
  cursor: pointer;
  box-sizing: border-box;
`;

const chartBase = `
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;

  .grid-line {
    stroke: #eeeeee;
    stroke-width: 1;
  }

  .axis-label {
    fill: #666666;
    font-family: "Poppins", sans-serif;
    font-size: 10px;
    font-weight: 400;
  }

  .month-label {
    font-size: 9px;
  }

  .tooltip-title {
    fill: #171717;
    font-family: "Poppins", sans-serif;
    font-size: 10px;
    font-weight: 500;
  }

  .tooltip-text {
    fill: #202020;
    font-family: "Poppins", sans-serif;
    font-size: 10px;
    font-weight: 400;
  }

  .bar-value {
    fill: #333333;
    font-family: "Poppins", sans-serif;
    font-size: 9px;
    font-weight: 400;
  }
`;

export const LineChartSvg = styled.svg`
  ${chartBase}
`;

export const BarChartSvg = styled.svg`
  ${chartBase}
`;

export const ChartDivider = styled.div`
  width: calc(100% + 32px);
  height: 1px;
  flex-shrink: 0;
  margin: 12px -16px;
  background: #e4e4e4;

  @media (max-width: 600px) {
    width: calc(100% + 24px);
    margin: 12px -12px;
  }
`;
