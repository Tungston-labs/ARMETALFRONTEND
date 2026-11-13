import styled from "styled-components";

export const MainReportLayout = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1.8fr) minmax(320px, 1fr);
  gap: 8px;
  margin-top: 14px;
  align-items: stretch;
  @media (max-width: 1350px) {
    grid-template-columns: minmax(0, 1fr);
  }
  @media (max-width: 600px) {
    gap: 12px;
    margin-top: 12px;
  }
`;

export const TableSide = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  background: #fff;
  border-radius: 9px;
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
  background: #fff;
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
  font-size: 12px;
  cursor: pointer;
`;

export const DateSeparator = styled.span`
  flex-shrink: 0;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
`;

export const ExportButton = styled.button`
  height: 38px;
  padding: 0 15px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 0;
  border-radius: 5px;
  background: #3452b7;
  color: #fff;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-size: 12px;
  white-space: nowrap;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  @media (max-width: 600px) {
    height: 34px;
    padding: 0 12px;
  }
`;

export const ReportToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  padding: 14px 16px;
  background: #fff;
  border-radius: 9px;
  @media (max-width: 700px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

export const ComponentTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
`;

export const ComponentTab = styled.button`
  height: 32px;
  padding: 0 18px;
  border: 1px solid ${(p) => (p.$active ? "#3452B7" : "#E5E7EB")};
  border-radius: 4px;
  background: ${(p) => (p.$active ? "#3452B7" : "#fff")};
  color: ${(p) => (p.$active ? "#fff" : "#202020")};
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
`;

export const ReportNote = styled.div`
  padding: 16px;
  color: #15803d;
  font-size: 12px;
  font-weight: 600;
  background: #fff;
  span {
    margin-right: 4px;
  }
`;
