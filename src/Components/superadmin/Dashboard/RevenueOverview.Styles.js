import styled from "styled-components";

export const RevenueContainer = styled.div`
  width: 100%;
  height: 276px;

  padding: 20px;

  box-sizing: border-box;

  background: #ffffff;
  border: 1px solid #e1e1e1;
  border-radius: 5px;
`;

export const RevenueHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const RevenueTitle = styled.h2`
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

export const ChartContainer = styled.div`
  width: 100%;
  height: 205px;
  margin-top: 5px;
`;