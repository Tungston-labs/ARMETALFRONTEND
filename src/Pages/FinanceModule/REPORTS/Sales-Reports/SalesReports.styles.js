import styled from "styled-components";

export const MainReportLayout = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(320px, 1fr);

  gap: 16px;

  margin-top: 16px;

  align-items: stretch;

  /* Tablet and below: stack table and side panel */
  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);
  }

  /* Mobile: tighter spacing */
  @media (max-width: 600px) {
    gap: 12px;
    margin-top: 12px;
  }
`;

export const TableSide = styled.div`
  min-width: 0;

  display: flex;
  flex-direction: column;

  /* Lets wide tables scroll sideways instead of breaking the layout */
  overflow-x: auto;
`;
export const ExportButton = styled.button`
  height: 38px;
  padding: 0 15px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  border: 1px solid #dfe3ea;
  border-radius: 5px;

  background: #fff;

  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
  letter-spacing: 0;
  text-align: center;
  text-transform: uppercase;
  white-space: nowrap;

  cursor: pointer;

  @media (max-width: 600px) {
    height: 34px;
    padding: 0 12px;
    font-size: 12px;
  }

  /* Small phones: full-width button */
  @media (max-width: 400px) {
    width: 100%;
  }
`;

export const DateRangeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const DatePickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  width: 280px;
  height: 38px;
  padding: 0 10px;

  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #ffffff;

  box-sizing: border-box;
`;

export const DateInput = styled.input`
  flex: 1;
  min-width: 0;
  width: 100%;
  height: 100%;

  border: none;
  outline: none;
  background: transparent;

  color: #374151;
  font-size: 13px;
  cursor: pointer;

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
`;

export const DateSeparator = styled.span`
  flex-shrink: 0;

  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
`;
