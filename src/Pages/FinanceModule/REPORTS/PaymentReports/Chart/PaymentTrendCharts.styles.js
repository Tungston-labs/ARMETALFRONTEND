
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

export const TrendSection = styled.section`
  min-width: 0;
  padding: 10px 10px 4px;
  box-sizing: border-box;
`;

export const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  min-height: 30px;
  margin-bottom: 3px;
`;

export const ChartTitle = styled.h3`
  margin: 0;
  color: #111;
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 17px;
`;

export const Select = styled.select`
  width: 59px;
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
`;

export const LineChartSvg = styled.svg`
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
    font-size: 9px;
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

  @media (max-width: 400px) {
    .axis-label {
      font-size: 9px;
    }

    .month-label {
      font-size: 8px;
    }
  }
`;

export const ChartDivider = styled.div`
  height: 1px;
  width: 100%;
  background: #e7e7e7;
`;

export const BarChartSvg = styled.svg`
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
  font-family: "Poppins", sans-serif;

  .grid-line {
    stroke: #e2e5ec;
    stroke-width: 1;
  }

  .axis-label {
    fill: #555;
    font-size: 10px;
    font-weight: 400;
  }

  .month-label {
    font-size: 9px;
  }

  .bar-value {
    fill: #333;
    font-size: 9px;
    font-weight: 400;
  }

  .tooltip-title {
    fill: #17144f;
    font-size: 10px;
    font-weight: 500;
  }

  .tooltip-text {
    fill: #17144f;
    font-size: 9px;
    font-weight: 400;
  }

  @media (max-width: 400px) {
    .axis-label {
      font-size: 9px;
    }

    .month-label {
      font-size: 8px;
    }
  }
`;

export const ChartTooltip = styled.div`
  position: absolute;
  z-index: 10;
  padding: 8px 10px;
  border: 1px solid #eee;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.12);
  pointer-events: none;
`;