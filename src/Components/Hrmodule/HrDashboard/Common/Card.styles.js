import styled from "styled-components";

export const CardContainer = styled.div`
  background: #ffffff;

  border: 1px solid #edf1f7;
  border-radius: 20px;

  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);

  overflow: hidden;

  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  }
`;