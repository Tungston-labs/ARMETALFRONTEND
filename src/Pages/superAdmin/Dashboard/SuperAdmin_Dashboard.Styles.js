import styled from "styled-components";

export const DashboardContainer = styled.main`
  width: 100%;
  min-height: 100vh;
 padding: 20px;
 margin-top:-20px;
`;

export const ChartsSection = styled.div`
  width: 100%;
  margin-top: 15px;

  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;

  box-sizing: border-box;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;