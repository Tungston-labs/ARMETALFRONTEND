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

  background: #ff850d;
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
    color: white;
    font-family: "Poppins",sans-serif;
font-weight: 600;
font-size: 14px;
line-height: 18px;
letter-spacing: 0px;

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