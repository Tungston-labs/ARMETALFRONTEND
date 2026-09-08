import styled from "styled-components";

export const Card = styled.div`
  width: 100%;
  min-height: 122px;

  box-sizing: border-box;

  display: grid;
  grid-template-columns: repeat(4, 1fr);

  align-items: center;

  padding: 20px 40px;

  background: #ffffff;

  border: 1px solid #e2e2e2;
  border-radius: 2px;

  column-gap: 35px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 20px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const Item = styled.div`
  display: flex;
  align-items: flex-start;

  gap: 10px;

  min-width: 0;
`;

export const Icon = styled.div`
  width: 18px;
  height: 18px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #111111;
`;

export const Content = styled.div`
  min-width: 0;

  display: flex;
  flex-direction: column;
`;

export const Label = styled.span`
  margin-bottom: 7px;

  font-family: "Poppins", sans-serif;
  font-size: 11px;
  font-weight: 400;

  line-height: 1.3;

  color: #444444;
`;

export const Value = styled.span`
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 500;

  line-height: 1.4;

  color: #111111;

  word-break: break-word;
`;