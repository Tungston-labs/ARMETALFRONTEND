
import styled from "styled-components";

export const ReportPage = styled.div`
  width: 100%;
  min-width: 0;
  padding: 12px 24px 24px;
  box-sizing: border-box;
  background: #fff;
  color: #111;
  font-family: "Poppins", sans-serif;

  @media (max-width: 650px) {
    padding: 12px;
  }
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
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #e7e7e7;
  border-radius: 8px;
  background: #fff;
  box-sizing: border-box;

  @media (max-width: 650px) {
    min-height: 82px;
    padding: 10px;
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
  font-size: 19px;

  @media (max-width: 650px) {
    width: 34px;
    height: 34px;
    flex-basis: 34px;
    font-size: 15px;
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

  @media (max-width: 650px) {
    font-size: 10px;
  }
`;

export const KPIValue = styled.div`
  color: #080808;
  font-size: 18px;
  font-weight: 600;
  line-height: 24px;
  white-space: nowrap;

  @media (max-width: 650px) {
    font-size: 13px;
    line-height: 19px;
  }
`;

export const FilterBar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;

  @media (max-width: 650px) {
    margin-bottom: 16px;
  }
`;

export const DateFilter = styled.div`
  height: 32px;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 7px;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  background: #fff;
  box-sizing: border-box;

  span {
    color: #555;
    font-size: 10px;
  }

  @media (max-width: 650px) {
    width: 100%;
  }
`;

export const DateInput = styled.input`
  width: 91px;
  min-width: 0;
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: #111;
  font-family: inherit;
  font-size: 10px;

  @media (max-width: 650px) {
    flex: 1;
    width: 0;
  }
`;

export const FilterSelect = styled.select`
  height: 32px;
  min-width: 0;
  max-width: 235px;
  padding: 0 24px 0 9px;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  outline: none;
  background: #fff;
  color: #111;
  font-family: inherit;
  font-size: 11px;
  cursor: pointer;

  @media (max-width: 650px) {
    flex: 1 1 125px;
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
    font-size: 12px;
  }
`;

export const MainReportLayout = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 2.3fr) minmax(300px, 1.1fr);
  gap: 12px;
  align-items: stretch;

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
`;

export const TableSide = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

export const TableWrapper = styled.div`
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  border: 1px solid #e7e7e7;
  border-radius: 5px 5px 0 0;
`;

export const InventoryTable = styled.table`
  width: 100%;
  min-width: 700px;
  table-layout: fixed;
  border-collapse: collapse;
  font-family: inherit;

  th:nth-child(1) { width: 9%; }
  th:nth-child(2) { width: 17%; }
  th:nth-child(3) { width: 11%; }
  th:nth-child(4) { width: 14%; }
  th:nth-child(5) { width: 9%; }
  th:nth-child(6) { width: 9%; }
  th:nth-child(7) { width: 9%; }
  th:nth-child(8) { width: 13%; }
  th:nth-child(9) { width: 12%; }

  th,
  td {
    overflow-wrap: anywhere;
  }

  tbody tr {
    height: 43px;
  }

  tbody td {
    border-right: 1px solid #ebebeb;
  }

  tbody td:last-child {
    border-right: none;
  }

  tbody tr:hover {
    background: #fafbff;
  }

  .empty-state {
    height: 90px;
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
    padding: 6px 7px;
    text-align: left;
    vertical-align: middle;
    font-size: 10px;
    font-weight: 600;
    line-height: 13px;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
  }

  th:last-child {
    border-right: none;
  }
`;

export const TableCell = styled.td`
  padding: 10px 7px;
  border-bottom: 1px solid #ebebeb;
  color: #171717;
  font-size: 10px;
  font-weight: 400;
  line-height: 14px;
  vertical-align: middle;
`;

export const StatusText = styled.span`
  color: ${(props) => {
    if (props.$status === "In Stock") return "#171717";
    if (props.$status === "Low Stock") return "#171717";
    return "#171717";
  }};
  font-size: 10px;
  font-weight: 400;
  white-space: nowrap;
`;

export const Message = styled.div`
  padding: 16px;
  margin: 12px 0;
  text-align: center;
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
`;

export const PaginationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e7e7e7;
  border-top: none;
  border-radius: 0 0 5px 5px;

  @media (max-width: 650px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;