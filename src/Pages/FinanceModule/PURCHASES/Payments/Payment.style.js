import styled from "styled-components";

export const DateRangeWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const DatePickerContainer = styled.div`
  display: flex;
  align-items: center;

  height: 32px;

  padding: 0 5px;

  border: 1px solid #e1e5ec;
  border-radius: 5px;

  background: #ffffff;
`;

export const DateInput = styled.input`
  border: none;
  outline: none;

  width: 105px;

  font-size: 11px;
  color: #222222;

  background: transparent;
`;

export const DateSeparator = styled.span`
  margin: 0 5px;

  color: #777777;

  font-size: 11px;
`;

export const ExportButton = styled.button`
  height: 32px;

  padding: 0 12px;

  display: flex;
  align-items: center;
  gap: 6px;

  border: 1px solid #e1e5ec;
  border-radius: 5px;

  background: #ffffff;

  color: #222222;

  font-size: 11px;

  cursor: pointer;

  &:hover {
    background: #f8fafc;
  }
`;