import styled from "styled-components";

export const Page = styled.div`
  width: 100%;
  min-height: 100vh;

  padding: 20px 28px 30px;

  box-sizing: border-box;

  background: #f4f7fd;
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  margin-bottom: 16px;

  @media (max-width: 900px) {
    flex-direction: column;
    gap: 18px;
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Title = styled.h2`
  margin: 0;

  font-family: "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 500;

  color: #3154bc;
`;

export const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;

  font-family: "Poppins", sans-serif;
  font-size: 13px;

  color: #171717;

  .active {
    color: #3154bc;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;

  @media (max-width: 700px) {
    width: 100%;
    flex-wrap: wrap;
  }
`;

export const ExportButton = styled.button`
  height: 38px;
  padding: 0 15px;
  border: 1px solid #dfe3ea;
  border-radius: 5px;
  background: #fff;
  font-family: "Poppins", sans-serif;
font-weight: 500;
font-style: Medium;
font-size: 13px;
line-height: 18px;
letter-spacing: 0px;
text-align: center;
text-transform: uppercase;
  cursor: pointer;
`;

export const NewAccountButton = styled.button`
  height: 38px;

  padding: 0 20px;

  border: none;
  border-radius: 4px;

  background: #3455bc;
  color: #fff;

  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 500;

  cursor: pointer;
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
`;

export const UserAvatar = styled.div`
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #d9dde4;

  font-size: 10px;
  font-weight: 600;
`;

export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UserName = styled.span`
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 600;
`;

export const UserRole = styled.span`
  font-family: "Poppins", sans-serif;
  font-size: 10px;
  color: #555;
`;

export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);

  gap: 26px;

  margin-bottom: 18px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 650px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

export const SummaryCard = styled.div`
  min-height: 94px;

  display: flex;
  align-items: center;

  gap: 14px;

  padding: 16px 20px;

  box-sizing: border-box;

  border-radius: 12px;

  background: #fff;
`;

export const SummaryIcon = styled.div`
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 50%;

  font-size: 18px;

  &.green {
    background: #e6f7eb;
    color: #07982a;
  }

  &.purple {
    background: #eee7ff;
    color: #7b3cff;
  }

  &.success {
    background: #e7f8ea;
    color: #00a52a;
  }

  &.orange {
    background: #fff0df;
    color: #ff7600;
  }

  &.red {
    background: #ffe5e5;
    color: #ff1616;
  }
`;

export const SummaryContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SummaryValue = styled.span`
  font-family: "Poppins", sans-serif;
  font-size: 18px;
  font-weight: 500;
`;

export const SummaryLabel = styled.span`
  font-family: "Poppins", sans-serif;
  font-size: 11px;

  color: #858585;
`;

export const ContentCard = styled.div`
  width: 100%;

  background: #fff;

  border-radius: 12px;

  overflow: hidden;

  box-shadow: 0 4px 20px rgba(25, 55, 110, 0.08);
`;

export const FilterSection = styled.div`
  display: flex;
  align-items: center;

  gap: 14px;

  padding: 25px 23px 13px;

  background: #f8faff;

  @media (max-width: 650px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchBox = styled.div`
  position: relative;

  width: 253px;

  @media (max-width: 650px) {
    width: 100%;
  }
`;

export const SearchIcon = styled.span`
  position: absolute;

  left: 13px;
  top: 50%;

  transform: translateY(-50%);

  display: flex;
  align-items: center;

  font-size: 18px;
`;

export const SearchInput = styled.input`
  width: 100%;
  height: 36px;
  box-sizing: border-box;
  padding: 0 12px 0 38px;
  border: 1px solid #dce1e9;
  border-radius: 4px;
  outline: none;
  background: #f8faff;

  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 300;
  line-height: 22px;
  letter-spacing: 0;

  &:focus {
    border-color: #3455bc;
  }
`;

export const SelectWrapper = styled.div`
  position: relative;

  width: 143px;

  @media (max-width: 650px) {
    width: 100%;
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 36px;
  appearance: none;
  padding: 0 32px 0 13px;
  border: 1px solid #dce1e9;
  border-radius: 4px;
  outline: none;
  background: #f8faff;

  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 300;
  line-height: 22px;
  letter-spacing: 0;
`;

export const SelectArrow = styled.span`
  position: absolute;

  right: 12px;
  top: 50%;

  transform: translateY(-50%);

  pointer-events: none;
`;

export const AccountSection = styled.div`
  width: 100%;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  min-height: 56px;

  padding: 8px 34px;

  box-sizing: border-box;

  &.assets {
    background: #15b03e1a;
  }

  &.liabilities {
    background: #ffe7e7;
  }

  &.equity {
    background: #eee9ff;
  }

  &.income {
    background: #e3f2fd;
  }

  &.expenses {
    background: #fff0df;
  }
`;

export const SectionTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const SectionIcon = styled.div`
  width: 32px;
  height: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.6);

  font-size: 18px;
  color: ${({ $color }) => $color || "#3455bc"};
`;

export const SectionTitle = styled.div`
  font-family: "Poppins", sans-serif;
  font-size: 15px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 0;
`;

export const SectionCount = styled.div`
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 300;
  line-height: 18px;
  letter-spacing: 0;
`;

export const SectionTotal = styled.div`
  font-family: "Poppins", sans-serif;
  font-size: 15px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 0;
`;

export const TableWrapper = styled.div`
  width: 100%;

  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  min-width: 1050px;

  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background: #f4f8ff;
`;

export const TableHeader = styled.th`
  height: 44px;
  padding: 0 12px;
  text-align: left;

  font-family: "Poppins", sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0;

  white-space: nowrap;

  &:first-child {
    padding-left: 34px;
  }

  &:last-child {
    padding-right: 34px;
  }
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid #e8e8e8;

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  height: 53px;
  padding: 0 12px;

  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 300;
  line-height: 18px;
  letter-spacing: 0;

  white-space: nowrap;

  &:first-child {
    padding-left: 34px;
  }

  &:last-child {
    padding-right: 34px;
  }
`;

export const Status = styled.span`
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0;

  &.active {
    color: #009a20;
  }

  &.inactive {
    color: #e01b1b;
  }
`;

export const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const EditButton = styled.button`
  width: 28px;
  height: 28px;

  border: 1px solid #e1e4e9;
  border-radius: 5px;

  background: #fff;

  cursor: pointer;
`;

export const DeleteButton = styled.button`
  width: 28px;
  height: 28px;

  border: 1px solid #e1e4e9;
  border-radius: 5px;

  background: #fff;

  color: #ff1717;

  font-size: 19px;

  cursor: pointer;
`;

