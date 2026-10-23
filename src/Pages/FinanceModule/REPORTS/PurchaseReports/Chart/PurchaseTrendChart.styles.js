
import styled from "styled-components";

export const ChartContainer = styled.div`
  width: 100%;
  min-width: 0;
  min-height: 500px;
  padding: 12px 12px 8px;
  border: 1px solid #e7e7e7;
  border-radius: 5px;
  background: #fff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  @media (max-width: 1050px) {
    min-height: 430px;
  }
`;

export const ChartHeader = styled.div`
  width: 100%;
  min-height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
`;

export const ChartTitle = styled.h3`
  margin: 0;
  color: #111;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
`;

export const YearSelect = styled.select`
  width: 58px;
  height: 28px;
  padding: 0 5px;
  border: 1px solid #e4e4e4;
  border-radius: 4px;
  background: #fff;
  color: #222;
  font-family: inherit;
  font-size: 11px;
  outline: none;
  cursor: pointer;
`;

export const ChartBody = styled.div`
  position: relative;
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow: visible;
`;

export const ChartSvg = styled.svg`
  display: block;
  width: 100%;
  height: 100%;
  min-height: 400px;
  overflow: visible;
  font-family: inherit;

  .axis-label {
    fill: #171717;
    font-size: 11px;
    font-weight: 400;
  }

  .month-label {
    font-size: 11px;
  }

  .tooltip-month {
    fill: #17144f;
    font-size: 11px;
    font-weight: 500;
  }

  .tooltip-label {
    fill: #17144f;
    font-size: 10px;
    font-weight: 400;
  }

  .tooltip-value {
    fill: #17144f;
    font-size: 10px;
    font-weight: 500;
  }

  @media (max-width: 500px) {
    min-height: 340px;

    .axis-label {
      font-size: 10px;
    }

    .month-label {
      font-size: 9px;
    }
  }
`;

export const ChartTooltip = styled.div`
  position: absolute;
  z-index: 5;
  min-width: 126px;
  padding: 9px 11px;
  border: 1px solid #eee;
  border-radius: 7px;
  background: #fff;
  box-shadow: 0 5px 18px rgba(0, 0, 0, 0.12);
  pointer-events: none;
  box-sizing: border-box;
`;

export const TooltipTitle = styled.div`
  margin-bottom: 5px;
  color: #17144f;
  font-size: 11px;
  font-weight: 500;
`;

export const TooltipValue = styled.div`
  color: #17144f;
  font-size: 10px;
  font-weight: 400;
`;

export const ChartLegend = styled.div`
  display: none;
`;