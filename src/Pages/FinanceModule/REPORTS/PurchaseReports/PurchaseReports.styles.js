
import styled from "styled-components";

export const ReportPage = styled.div`
  width: 100%;
  min-width: 0;
  padding: 12px 24px 24px;
  box-sizing: border-box;
  background: #fff;
  font-family: "Poppins", sans-serif;
  color: #111;
`;

export const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  margin: 24px 0;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 650px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin: 16px 0;
  }
`;

export const KPICard = styled.div`
  min-width: 0;
  min-height: 103px;
  padding: 18px 15px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #e7e7e7;
  border-radius: 8px;
  background: #fff;
  box-sizing: border-box;

  @media (max-width: 650px) {
    min-height: 85px;
    padding: 12px 9px;
    gap: 8px;
  }
`;

export const KPIIcon = styled.div`
  width: 46px;
  height: 46px;
  flex: 0 0 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${(props) => props.$background};
  color: ${(props) => props.$color};
  font-size: 20px;

  @media (max-width: 650px) {
    width: 35px;
    height: 35px;
    flex-basis: 35px;
    font-size: 16px;
  }
`;

export const KPIInfo = styled.div`
  min-width: 0;
`;

export const KPIName = styled.div`
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 400;
  line-height: 17px;
  white-space: nowrap;

  @media (max-width: 650px) {
    font-size: 10px;
    white-space: normal;
  }
`;

export const KPIValue = styled.div`
  color: #080808;
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
  white-space: nowrap;

  @media (max-width: 650px) {
    font-size: 14px;
    line-height: 20px;
  }
`;

export const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 24px;

  @media (max-width: 650px) {
    gap: 8px;
    margin-bottom: 16px;
  }
`;

export const DateFilter = styled.div`
  min-width: 0;
  height: 32px;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 8px;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  background: #fff;
  box-sizing: border-box;
  color: #222;

  svg {
    flex-shrink: 0;
    font-size: 13px;
  }

  @media (max-width: 650px) {
    width: 100%;
  }
`;

export const DateInput = styled.input`
  width: 100px;
  min-width: 0;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #222;
  font: inherit;
  font-size: 11px;

  &::-webkit-calendar-picker-indicator {
    display: none;
  }

  @media (max-width: 650px) {
    flex: 1;
    width: 0;
  }
`;

export const FilterSelect = styled.select`
  min-width: 0;
  width: auto;
  max-width: 180px;
  height: 32px;
  padding: 0 25px 0 9px;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  outline: none;
  background: #fff;
  color: #111;
  font-family: inherit;
  font-size: 11px;
  cursor: pointer;

  @media (max-width: 650px) {
    flex: 1 1 140px;
    max-width: none;
  }
`;

export const ExportButton = styled.button`
  height: 32px;
  min-width: 140px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 0;
  border-radius: 4px;
  background: #3151b7;
  color: #fff;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #26449f;
  }

  svg {
    font-size: 13px;
  }
`;

export const MainReportLayout = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
  gap: 14px;
  align-items: stretch;

  @media (max-width: 1050px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const TableSide = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid #e7e7e7;
  border-radius: 5px 5px 0 0;
`;

export const PurchaseTable = styled.table`
  width: 100%;
  min-width: 690px;
  border-collapse: collapse;
  table-layout: fixed;
  font-family: inherit;

  th:nth-child(1) { width: 10%; }
  th:nth-child(2) { width: 13%; }
  th:nth-child(3) { width: 18%; }
  th:nth-child(4) { width: 8%; }
  th:nth-child(5) { width: 13%; }
  th:nth-child(6) { width: 15%; }
  th:nth-child(7) { width: 11%; }
  th:nth-child(8) { width: 12%; }

  th,
  td {
    overflow-wrap: anywhere;
  }

  tbody tr {
    height: 43px;
  }

  tbody tr:hover {
    background: #fafbff;
  }

  .empty-state {
    height: 100px;
    text-align: center;
    color: #777;
    font-size: 12px;
  }
`;

export const TableHead = styled.thead`
  background: #ff810c;
  color: #fff;

  th {
    height: 39px;
    padding: 6px 8px;
    text-align: left;
    vertical-align: middle;
    font-size: 10px;
    font-weight: 600;
    line-height: 13px;
  }
`;

export const TableCell = styled.td`
  padding: 10px 8px;
  border-bottom: 1px solid #ebebeb;
  color: #171717;
  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  vertical-align: middle;
`;

export const StatusText = styled.span`
  color: ${(props) => {
    const status = props.$status?.toLowerCase();

    if (status === "paid" || status === "delivered") return "#008f16";
    if (status === "unpaid" || status === "pending") return "#ff2929";
    if (status === "partial" || status === "partially") return "#ff7900";

    return "#222";
  }};
  font-size: 10px;
  font-weight: 500;
  white-space: nowrap;
`;