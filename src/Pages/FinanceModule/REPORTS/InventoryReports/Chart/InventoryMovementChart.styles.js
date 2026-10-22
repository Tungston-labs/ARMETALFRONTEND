
import styled from "styled-components";

export const ChartContainer = styled.div`
  width: 100%;
  min-width: 0;
  min-height: 500px;
  padding: 10px 10px 12px;
  border: 1px solid #e7e7e7;
  border-radius: 5px;
  background: #fff;
  box-sizing: border-box;
`;

export const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 5px;
`;

export const ChartTitle = styled.h3`
  margin: 0;
  color: #111;
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
`;

export const YearSelect = styled.select`
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

export const ChartSvg = styled.svg`
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
  font-family: "Poppins", sans-serif;

  .grid-line {
    stroke: #ededed;
    stroke-width: 1;
  }

  .axis-label {
    fill: #171717;
    font-size: 11px;
    font-weight: 400;
  }

  .month-label {
    fill: #171717;
    font-size: 11px;
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

  g[role="button"]:focus {
    outline: none;
  }

  @media (max-width: 500px) {
    .axis-label {
      font-size: 10px;
    }

    .month-label {
      font-size: 9px;
    }
  }
`;