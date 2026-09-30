import styled from "styled-components";

export const DateRangeWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const DatePickerContainer = styled.div`
  display: flex;
  align-items: center;

  height: 32px;

  border: 1px solid #e2e2e2;
  border-radius: 5px;

  background: #ffffff;

  overflow: hidden;
`;

export const DateInput = styled.input`
  width: 150px;

  height: 32px;

  border: none;
  outline: none;

  padding: 0 9px;

  font-size: 12px;
  font-family: inherit;

  color: #222222;

  background: transparent;

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
`;

export const DateSeparator = styled.span`
  font-size: 12px;

  color: #777777;

  padding: 0 2px;
`;

export const ExportButton = styled.button`
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 6px;

  padding: 0 12px;

  border: 1px solid #e2e2e2;

  border-radius: 5px;

  background: #ffffff;

  color: #111111;

  font-size: 12px;

  cursor: pointer;

  white-space: nowrap;

  svg {
    width: 13px;
    height: 13px;
  }

  &:hover {
    border-color: #2f4da8;
    color: #2f4da8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;