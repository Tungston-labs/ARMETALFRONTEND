import styled from "styled-components";

export const ActionWrapper = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ActionButton = styled.button`
  width: 25px;
  height: 25px;

  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #e3e3e3;
  border-radius: 4px;

  background: #ffffff;

  color: #222222;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    border-color: #3049a3;

    color: #3049a3;

    background: #f5f7ff;
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;