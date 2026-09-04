import styled from "styled-components";

export const PaymentContainer = styled.div`
  width: 100%;
  background: #ffffff;
  border: 1px solid #e1e1e1;
  border-radius: 5px;
  overflow: hidden;
  box-sizing: border-box;
`;

export const PaymentHeader = styled.div`
  height: 53px;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
`;

export const PaymentTitle = styled.h2`
  margin: 0;
  color: #111111;
  font-family: "Poppins";
font-weight: 500;
font-style: Medium;
font-size: 16px;
line-height: 18px;
letter-spacing: 0%;

`;

export const PaymentCount = styled.span`
  color: #3157c5;
  font-size: 14px;
  font-weight: 500;
`;

export const PaymentTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const PaymentTable = styled.table`
  width: 100%;
  min-width: 1050px;
  border-collapse: collapse;
  table-layout: auto;
`;

export const TableHeader = styled.th`
  height: 40px;
  padding: 0 34px;
  background: #ff841d;
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  text-align: left;
  white-space: nowrap;

  &:first-child {
    border-radius: 5px 0 0 0;
  }

  &:last-child {
    border-radius: 0 5px 0 0;
  }
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid #e2e2e2;

  &:last-child {
    border-bottom: none;
  }
`;

export const TableCell = styled.td`
  height: 40px;
  padding: 0 34px;
  color: #171717;
  font-size: 12px;
  font-weight: 400;
  white-space: nowrap;
  font-family: "Poppins";


`;