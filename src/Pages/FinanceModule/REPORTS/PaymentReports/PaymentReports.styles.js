import styled from "styled-components";

export const ReportPage = styled.div`
  width: 100%;
  min-width: 0;
  padding: 0;
  color: #111111;
  font-family: "Poppins", sans-serif;
  box-sizing: border-box;
`;

export const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  margin: 20px 0 24px;
  width: 100%;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin: 16px 0;
  }

  @media (max-width: 420px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const KPICard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  min-height: 103px;
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #ffffff;
  box-sizing: border-box;

  @media (max-width: 700px) {
    min-height: 88px;
    padding: 12px;
    gap: 9px;
  }
`;

export const KPIIcon = styled.div`
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: ${(props) => props.$background || "#e8efff"};
  color: ${(props) => props.$color || "#3154b5"};
  font-size: 20px;

  @media (max-width: 700px) {
    width: 38px;
    height: 38px;
    flex-basis: 38px;
    font-size: 17px;
  }
`;

export const KPIInfo = styled.div`
  min-width: 0;
`;

export const KPIName = styled.div`
  margin-bottom: 5px;
  color: #222222;
  font-size: 13px;
  font-weight: 400;
  line-height: 19px;

  @media (max-width: 700px) {
    font-size: 12px;
    line-height: 17px;
  }
`;

export const KPIValue = styled.div`
  color: #111111;
  font-size: 19px;
  font-weight: 600;
  line-height: 25px;
  overflow-wrap: anywhere;

  @media (max-width: 700px) {
    font-size: 16px;
    line-height: 22px;
  }
`;

export const FilterBar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  margin: 0 0 24px;
  box-sizing: border-box;

  > button {
    margin-left: auto;
  }

  @media (max-width: 1100px) {
    > button {
      margin-left: 0;
    }
  }

  @media (max-width: 700px) {
    gap: 9px;
    margin-bottom: 16px;
  }
`;

export const DateFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;

  > span {
    color: #777777;
    font-size: 12px;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const DateInput = styled.input`
  width: 187px;
  max-width: 100%;
  height: 32px;
  padding: 0 8px;
  border: 1px solid #e4e4e4;
  border-radius: 5px;
  background: #ffffff;
  color: #222222;
  font-family: inherit;
  font-size: 11px;
  box-sizing: border-box;
  outline: none;

  &:focus {
    border-color: #3453bd;
  }

  @media (max-width: 600px) {
    flex: 1;
    width: 50%;
    min-width: 0;
  }
`;

export const FilterSelect = styled.select`
  min-width: 140px;
  max-width: 100%;
  height: 32px;
  padding: 0 27px 0 9px;
  border: 1px solid #e4e4e4;
  border-radius: 5px;
  background: #ffffff;
  color: #252525;
  font-family: inherit;
  font-size: 11px;
  outline: none;
  cursor: pointer;
  box-sizing: border-box;

  &:focus {
    border-color: #3453bd;
  }

  @media (max-width: 600px) {
    flex: 1 1 140px;
  }
`;

export const SearchInputWrap = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 180px;
  flex: 1;
  padding: 0 10px;
  border: 1px solid #e4e4e4;
  border-radius: 5px;
  background: #ffffff;
  color: #777777;
`;

export const SearchInput = styled.input`
  width: 100%;
  min-width: 0;
  height: 32px;
  padding: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #222222;
  font: inherit;
  font-size: 12px;
`;

export const MainReportLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(320px, 0.75fr);
  gap: 8px;
  width: 100%;
  margin-top: 0;
  align-items: stretch;
  box-sizing: border-box;

  @media (max-width: 1100px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }

  @media (max-width: 600px) {
    gap: 12px;
  }
`;

export const TableSide = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

export const TableWrapper = styled.div`
  width: 100%;
  min-width: 0;
  overflow-x: auto;
  border: 1px solid #e7e7e7;
  border-radius: 5px;
  background: #ffffff;
  box-sizing: border-box;
  scrollbar-width: thin;
`;

export const PaymentTable = styled.table`
  width: 100%;
  min-width: 790px;
  border-collapse: collapse;
  table-layout: auto;
  background: #ffffff;
  font-family: "Poppins", sans-serif;
  font-size: 12px;

  th,
  td {
    padding: 13px 10px;
    text-align: left;
    vertical-align: middle;
    white-space: nowrap;
    border-right: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9;
  }

  th:last-child,
  td:last-child {
    border-right: 0;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

  tbody tr:hover {
    background: #fafafa;
  }

  .empty-state {
    padding: 26px 12px;
    text-align: center;
    color: #777777;
    white-space: normal;
  }

  @media (max-width: 600px) {
    min-width: 790px;

    th,
    td {
      padding: 11px 8px;
    }
  }
`;

export const TableHead = styled.thead`
  background: #ff850c;
  color: #ffffff;

  th {
    background: #ff850c;
    color: #ffffff;
    font-size: 11px;
    font-weight: 600;
    line-height: 15px;
    border-color: #ff850c;
  }
`;

export const TableCell = styled.td`
  color: #222222;
  font-size: 11.5px;
  font-weight: 400;
`;

export const StatusText = styled.span`
  display: inline-block;
  padding: 0;
  border-radius: 0;
  background: transparent;
  color: ${(props) =>
    /failed|cancelled|rejected/i.test(props.$status || "")
      ? "#c62828"
      : "#222222"};
  font-size: 11.5px;
  font-weight: 400;
  white-space: nowrap;
`;

export const ExportButton = styled.button`
  min-width: 140px;
  height: 32px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid #3453bd;
  border-radius: 4px;
  background: #3453bd;
  color: #ffffff;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  box-sizing: border-box;

  &:hover {
    background: #2945a5;
    border-color: #2945a5;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  @media (max-width: 700px) {
    min-width: 120px;
  }
`;

export const ChartsSide = styled.div`
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
`;

export const Notice = styled.div`
  margin: 12px 0;
  padding: 11px 14px;
  border-radius: 5px;
  background: ${(props) => (props.$error ? "#fff0f0" : "#eef5ff")};
  color: ${(props) => (props.$error ? "#a12727" : "#2756a4")};
  font-size: 13px;

  button {
    margin-left: 10px;
    border: 0;
    background: transparent;
    text-decoration: underline;
    cursor: pointer;
    color: inherit;
  }
`;

export const EmptyState = styled.div`
  padding: 26px 12px;
  text-align: center;
  color: #777777;
  font-size: 13px;
`;