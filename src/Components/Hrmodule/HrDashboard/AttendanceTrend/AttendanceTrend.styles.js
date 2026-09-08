import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
`;

export const ChartContainer = styled.div`
  height: 240px;
  padding: 10px 16px 16px;

  @media (max-width: 768px) {
    height: 220px;
    padding: 12px;
  }
`;