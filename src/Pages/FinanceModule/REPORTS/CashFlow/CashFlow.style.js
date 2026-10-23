import styled from "styled-components";

export const ProfitLossContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 5px 5px 0 0;
  overflow: hidden;
  font-family: "Poppins", sans-serif;
  color: #111111;
`;

export const StatementTitle = styled.div`
  width: 100%;
  min-height: 45px;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  background: #F48211;
  color: #ffffff;

  font-size: 16px;
  font-weight: 600;
  text-align: center;
`;

export const StatementTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const StatementTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;

  th,
  td {
    box-sizing: border-box;
    border-bottom: 1px solid #e8e8e8;
    vertical-align: middle;
  }

  th {
    height: 45px;
    padding: 10px 34px;
    background: #fff5e7;
    color: #111111;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
  }

  td {
    height: 38px;
    padding: 9px 34px;
    font-size: 12.5px;
    background: #ffffff;
  }

  th:first-child,
  td:first-child {
    width: 28%;
    text-align: left;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 24%;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 27%;
  }

  th:nth-child(4),
  td:nth-child(4) {
    width: 21%;
  }

  th:not(:first-child),
  td:not(:first-child) {
    text-align: right;
  }

  tbody tr:hover td {
    background: #fffaf4;
  }

  @media (max-width: 768px) {
    min-width: 750px;

    th,
    td {
      padding-left: 18px;
      padding-right: 18px;
    }
  }
`;

export const TableHeader = styled.tr`
  th {
    background: #F48211;
    font-family: "Poppins",sans-serif;
font-weight: 500;
font-style: Medium;
font-size: 14px;
line-height: 18px;
letter-spacing: 0px;
color: white;

  }
`;

export const SectionRow = styled.tr`
  td {
    height: 36px;
    padding-top: 8px;
    padding-bottom: 8px;
    font-size: 12.5px;
    font-weight: 600;
  }
`;

export const DataRow = styled.tr`
  td {
    font-weight: 400;
  }
`;

export const TotalRow = styled.tr`
  td {
    height: 42px;
    font-size: 13px;
    font-weight: 600;
  }
`;

export const ExportButton = styled.button`
    height: 36px;
    padding: 0 14px;

    display: flex;
    align-items: center;
    gap: 7px;

    background: #ffffff;
    border: 1px solid #dcdcdc;
    border-radius: 5px;

    color: #333;
    font-size: 12px;
    font-weight: 500;

    cursor: pointer;

    transition: all 0.2s ease;

    svg {
        font-size: 16px;
    }

    &:hover {
        background: #f5f5f5;
        border-color: #c8c8c8;
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