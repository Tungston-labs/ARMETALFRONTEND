import styled from "styled-components";

export const BalanceSheetPage = styled.div`
  width: 100%;
  min-width: 0;
  padding: 0;
  box-sizing: border-box;
  color: #111;
  font-family: "Poppins", sans-serif;
`;

export const DatePanel = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  min-height: 76px;
  margin: 14px 0 16px;
  padding: 18px 30px;
  background: #fff;
  border-radius: 8px;
  box-sizing: border-box;

  span {
    color: #666;
    font-size: 12px;
  }

  @media (max-width: 600px) {
    padding: 14px;
  }
`;

export const DateField = styled.input`
  width: 165px;
  height: 32px;
  padding: 0 10px;
  box-sizing: border-box;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  background: #fff;
  color: #222;
  font-family: inherit;
  font-size: 11px;
  outline: none;

  &:focus {
    border-color: #3454b4;
  }
`;

export const StatementWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  background: #fff;
  box-sizing: border-box;
`;

export const StatementTable = styled.table`
  width: 100%;
  min-width: 850px;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
  font-size: 11px;

  th,
  td {
    box-sizing: border-box;
    vertical-align: middle;
  }

  th {
    height: 41px;
    padding: 10px 32px;
    background: #f58211;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    text-align: left;
    border-bottom: 1px solid #e8e8e8;
  }

  thead th:first-child {
    border-right: 1px solid rgba(0, 0, 0, 0.08);
  }

  tbody td {
    height: 47px;
    padding: 10px 30px;
    background: #fff;
    border-bottom: 1px solid #e8e8e8;
    font-size: 11px;
  }

  tbody td:nth-child(2),
  tbody td:nth-child(4) {
    text-align: right;
    white-space: nowrap;
  }

  tbody td:nth-child(3) {
    border-left: 1px solid #e8e8e8;
  }

  tbody tr.bs-group-row td.bs-group-label,
  tbody tr.bs-group-row td.bs-group-amount {
    font-weight: 600;
  }

  tbody tr.bs-group-row td.bs-group-label.liability,
  tbody tr.bs-group-row td.bs-group-amount.liability {
    background: #fbe7e8;
  }

  tbody tr.bs-group-row td.bs-group-amount.liability {
    color: #e00000;
  }

  tbody tr.bs-group-row td.bs-group-label.asset,
  tbody tr.bs-group-row td.bs-group-amount.asset {
    background: #e5f2e7;
  }

  tbody tr.bs-group-row td.bs-group-amount.asset {
    color: #07852b;
  }

  tbody tr.bs-account-row td {
    background: #fff;
    color: #333;
    font-weight: 400;
  }

  tbody tr.bs-account-row:hover td:not(.bs-empty-cell) {
    background: #fafafa;
  }

  tbody td.bs-empty-cell {
    padding: 0;
    background: #fff;
  }

  tbody td.bs-message-cell {
    height: 64px;
    text-align: center;
    color: #666;
  }

  @media (max-width: 768px) {
    min-width: 850px;

    th {
      padding-left: 16px;
      padding-right: 16px;
    }

    tbody td {
      padding-left: 16px;
      padding-right: 16px;
    }
  }
`;

export const StatementHeader = styled.tr`
  th {
    background: #f58211;
    color: #fff;
  }
`;

export const GroupRow = styled.tr`
  td {
    background: ${({ $side }) => ($side === "asset" ? "#e5f2e7" : "#fbe7e8")};
    font-weight: 600;
  }

  td:nth-child(2),
  td:nth-child(4) {
    color: ${({ $side }) => ($side === "asset" ? "#07852b" : "#e00000")};
  }
`;

export const AccountRow = styled.tr`
  td {
    background: #fff;
    color: ${({ $muted }) => ($muted ? "#999" : "#444")};
    font-weight: 400;
  }
`;

export const GrandTotalRow = styled.tr`
  td {
    height: 53px;
    padding: 14px 32px;
    background: #000;
    color: #000;
    border-bottom: none;
    font-size: 12px;
    font-weight: 700;
  }

  td:nth-child(2),
  td:nth-child(4) {
    text-align: right;
    white-space: nowrap;
  }

  td:nth-child(3) {
    border-left: 1px solid rgba(255, 255, 255, 0.12);
  }

  @media (max-width: 768px) {
    td {
      padding-left: 16px;
      padding-right: 16px;
    }
  }
`;

export const StatusText = styled.div`
  margin: 12px 0;
  color: ${({ $balanced }) => ($balanced ? "#16803c" : "#dc2626")};
  font-size: 12px;
  font-weight: 600;
`;

export const ExportButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 16px;
  border: 0;
  border-radius: 5px;
  background: #3452b5;
  color: #fff;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #29449c;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  svg {
    width: 15px;
    height: 15px;
  }
`;

export const MessageRow = styled.div`
  margin: 12px 0;
  padding: 12px 16px;
  border: 1px solid #fecaca;
  border-radius: 5px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 12px;
`;
