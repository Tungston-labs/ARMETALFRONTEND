import styled from "styled-components";

export const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const InfoCard = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;

  background: #fff;
  border: 1px solid #edf2f7;
  border-radius: 14px;
  padding: 16px;

  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
`;

export const Logo = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: cover;
`;

export const Content = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #2d2d2d;
  margin-bottom: 4px;
`;

export const Value = styled.span`
  font-size: 14px;
  color: #2d2d2d;
  line-height: 1.5;
`;