import styled from "styled-components";

export const LayoutWrapper = styled.div`
padding: 20px;
`;

export const HeaderSection = styled.header`
  width: 100%;
`;

export const ContentSection = styled.main`
  width: 100%;

`;
export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: #3b4ce2; /* adjust to match your exact brand blue */
  color: #ffffff;
  cursor: pointer;
  transition: background 0.15s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: #2f3ec7;
  }
`;

export const DateRangeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px 12px;

  border: 1px solid #d9d9d9;
  border-radius: 6px;

  background: #ffffff;

  cursor: pointer;

  &:hover {
    border-color: #f28c28;
  }

  svg {
    font-size: 18px;
    flex-shrink: 0;
  }
`;

export const DatePickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const DateInput = styled.input`
  border: none;
  outline: none;
  background: transparent;

  font-size: 14px;
  color: #333;

  cursor: pointer;

  width: 125px;

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

export const DateSeparator = styled.span`
  color: #777;
  font-size: 14px;
`;

