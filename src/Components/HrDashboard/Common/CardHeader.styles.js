import styled from "styled-components";

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
/* background-color: #fff; */
  padding: 20px 24px 0;

  @media (max-width: 768px) {
    padding: 16px 18px 0;
  }
`;

export const Title = styled.h3`
  margin: 0;

  font-size: 16px;
  font-weight: 600;

  color: #1f2937;
`;

export const RightContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;