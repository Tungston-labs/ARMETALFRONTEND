import styled from "styled-components";

export const ChartContainer = styled.div`
  position: relative;
  width: 100%;
  min-width: 0;
  min-height: 514px;
  padding: 20px 16px 16px;
  border-radius: 9px;
  background: #fff;
  box-sizing: border-box;
`;
export const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 20px;
`;
export const ChartTitle = styled.h3`
  margin: 0;
  color: #111;
  font-size: 13px;
  font-weight: 600;
  line-height: 20px;
`;
export const YearSelect = styled.select`
  width: 62px;
  height: 29px;
  padding: 0 5px;
  border: 1px solid #dedede;
  border-radius: 4px;
  background: #fff;
  color: #222;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
`;
export const ChartBody = styled.div`
  height: 355px;
  display: flex;
  gap: 8px;
  transition: opacity 0.2s ease;
`;
export const YAxis = styled.div`
  width: 28px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0 0 26px;
  box-sizing: border-box;
`;
export const YTick = styled.span`
  color: #333;
  font-size: 9px;
  white-space: nowrap;
`;
export const Plot = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
  height: calc(100% - 26px);
  margin-top: 2px;
  .grid-line {
    position: absolute;
    left: 0;
    right: 0;
    border-top: 1px solid #eee;
  }
`;
export const Bars = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: stretch;
  justify-content: space-around;
  gap: 8px;
`;
export const BarGroup = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  max-width: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  > span {
    position: absolute;
    top: calc(100% + 7px);
    color: #222;
    font-size: 9px;
    white-space: nowrap;
  }
`;
export const Bar = styled.div`
  width: 100%;
  min-height: 0;
  border-radius: 2px 2px 0 0;
  transition: height 0.2s ease;
`;
export const XAxis = styled.div``;
export const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px 16px;
  margin-top: 25px;
`;
export const LegendItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  color: #333;
  white-space: nowrap;
`;
export const Dot = styled.span`
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 50%;
`;
export const EmptyChart = styled.div`
  position: absolute;
  left: 45px;
  right: 10px;
  top: 50%;
  text-align: center;
  color: #777;
  font-size: 11px;
  pointer-events: none;
`;
