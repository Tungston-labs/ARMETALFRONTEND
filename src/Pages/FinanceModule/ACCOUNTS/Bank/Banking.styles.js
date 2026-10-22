import styled from "styled-components";

export const BankingPage = styled.div`
  width: 100%;
  min-width: 0;
  min-height: 100%;
  padding: 22px 3.35% 10px;
  box-sizing: border-box;
  background: #f4f7ff;
  color: #111;
  font-family: "Poppins", sans-serif;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

export const BankingHeaderActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    justify-content: flex-start;
    width: 100%;
  }
`;

export const AddBankButton = styled.button`
  height: 32px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 0;
  border-radius: 4px;
  background: #354fba;
  color: #fff;
  font:
    500 12px "Poppins",
    sans-serif;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.2s ease;
  svg {
    width: 15px;
    height: 15px;
  }
  &:hover {
    background: #293f9d;
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
  gap: 7px;
  width: 187px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
  background: #fff;
  box-sizing: border-box;
  @media (max-width: 480px) {
    width: 100%;
    max-width: 280px;
  }
`;

export const DateInput = styled.input`
  min-width: 0;
  width: 100%;
  flex: 1;
  height: 100%;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #374151;
  font:
    11px "Poppins",
    sans-serif;
  cursor: pointer;
  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
`;

export const DateSeparator = styled.span`
  flex-shrink: 0;
  color: #6b7280;
  font-size: 11px;
`;

export const BankingTabs = styled.div`
  display: flex;
  align-items: stretch;
  width: 100%;
  min-height: 45px;
  margin: 16px 0;
  padding: 0 12px;
  background: #fff;
  box-sizing: border-box;
  overflow-x: auto;
  &::-webkit-scrollbar {
    height: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }
`;

export const BankingTab = styled.button`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 135px;
  padding: 0 18px;
  border: 0;
  border-bottom: 2px solid
    ${({ $active }) => ($active ? "#354fba" : "transparent")};
  background: transparent;
  color: ${({ $active }) => ($active ? "#354fba" : "#111")};
  font:
    ${({ $active }) => ($active ? "600" : "400")} 11px "Poppins",
    sans-serif;
  white-space: nowrap;
  cursor: pointer;
  &:hover {
    color: #354fba;
  }
`;

export const BankingTablePanel = styled.div`
  width: 100%;
  min-width: 0;
  padding: 20px 19px 0;
  border-radius: 10px;
  background: #fff;
  box-sizing: border-box;
  overflow-x: auto;

  input,
  select {
    font-family: "Poppins", sans-serif;
    font-size: 11px;
  }

  table {
    width: 100%;
    min-width: 900px;
    border-collapse: collapse;
    border-spacing: 0;
    background: #fff;
    font:
      400 10.5px "Poppins",
      sans-serif;
  }

  thead tr {
    height: 40px;
    background: #ff850b;
  }
  thead th {
    padding: 0 12px;
    border: 0;
    background: #ff850b;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    font-size: 11px;
    font-weight: 500;
  }
  tbody tr {
    height: 46px;
    background: #fff;
  }
  tbody td {
    padding: 0 12px;
    border-bottom: 1px solid #e9e9e9;
    color: #252525;
    font-size: 10.5px;
    font-weight: 400;
    white-space: nowrap;
  }
  tbody tr:last-child td {
    border-bottom: 0;
  }

  @media (max-width: 768px) {
    padding: 12px 12px 0;
    table {
      min-width: 900px;
    }
  }
`;

export const BankMoneyIn = styled.span`
  color: #159447;
  white-space: nowrap;
`;

export const BankMoneyOut = styled.span`
  color: #ff3b45;
  white-space: nowrap;
`;

export const BankMuted = styled.span`
  color: #888;
`;

export const BankStatus = styled.span`
  display: inline-block;
  color: ${({ $status }) => ($status === "Reconciled" ? "#159447" : "#ff7900")};
  font:
    400 11px "Poppins",
    sans-serif;
  white-space: nowrap;
`;

export const BankType = styled.span`
  color: ${({ $type }) => ($type === "Cash Account" ? "#16803b" : "#ff7900")};
  white-space: nowrap;
`;

export const BankActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 25px;
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: #fff;
  color: #111827;
  cursor: pointer;
  svg {
    width: 17px;
    height: 17px;
  }
  &:hover {
    background: #f3f4f6;
  }
`;
