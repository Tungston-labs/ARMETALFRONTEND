import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  background: #ffffff;
  border-radius: 18px;
  
`;

export const ChartContainer = styled.div`
  width: 100%;
  height: 340px;
  padding: 0 20px 20px;
box-shadow: 0px 2.5px 25px 0px #4545501A;
background-color: #fff;

  .recharts-wrapper {
    font-size: 13px;
  }

  .recharts-cartesian-grid-horizontal line {
    stroke: #ececec;
  }

  .recharts-cartesian-axis-tick-value {
    fill: #4b5563;
    font-size: 13px;
  }

  .recharts-bar-rectangle {
    transition: all 0.3s ease;
  }

  .recharts-bar-rectangle:hover {
    opacity: 0.85;
  }

  @media (max-width: 768px) {
    height: 280px;
    padding: 0 15px 15px;
  }
`;

export const LegendContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
`;

export const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ color }) => color};
`;

export const TooltipBox = styled.div`
  background: #ffffff;
  padding: 14px 18px;
  /* border-radius: 12px; */
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);

  border: 1px solid #f1f5f9;
  min-width: 120px;
`;

export const TooltipTitle = styled.div`
  color: ${({ color }) => color};

  font-weight: 600;
  font-size: 14px;
  margin-bottom: 6px;
`;

export const TooltipValue = styled.div`
  font-size: 15px;
  color: #111827;
  font-weight: 700;
`;
export const TooltipRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 4px 0;
`;

export const TooltipLabel = styled.span`
  color: ${({ color }) => color};
  font-weight: 600;
  font-size: 13px;
`;