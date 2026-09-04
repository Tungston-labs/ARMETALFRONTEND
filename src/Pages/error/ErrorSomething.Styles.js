import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
`;

export const IconImage = styled.img`
  width: 20%;
  height: auto;
  margin-bottom: 20px;
`;

export const Title = styled.h1`
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

export const Subtitle = styled.p`
  font-size: 18px;
  color: #666;
  max-width: 450px;
  margin-bottom: 30px;
`;

export const RetryButton = styled.button`
  padding: 12px 30px;
  font-size: 16px;
  background-color: #ff6b6b;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #e35353;
  }
`;
