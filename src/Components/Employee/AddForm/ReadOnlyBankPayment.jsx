import React from "react";
import styled from "styled-components";

const TableWrapper = styled.div`
  width: 100%;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  font-family: 'Segoe UI', sans-serif;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #222;
  margin-bottom: 1rem;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 12px;
  overflow: hidden;
  background-color: white;
`;

const Th = styled.th`
  background-color: #f0f0f0;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #ccc;
`;

const Td = styled.td`
  padding: 12px;
  color: #444;
  border-bottom: 1px solid #eee;
`;

const EmptyState = styled.p`
  color: #888;
  font-style: italic;
  padding: 1rem;
`;

const ReadOnlyBankPayment = ({ data }) => {
  if (!data) return <EmptyState>No bank/payment data available.</EmptyState>;

  return (
    <TableWrapper>
      <Title>Bank & Payment Summary</Title>
      <StyledTable>
        <thead>
          <tr>
            <Th>Bank Name</Th>
            <Th>Account Number</Th>
            <Th>Payment Mode</Th>
            <Th>Basic Salary</Th>
            <Th>Tax Regime</Th>
            <Th>Pan No</Th>
            <Th>UAN No</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td>{data.bank_name || "-"}</Td>
            <Td>{data.account_number || "-"}</Td>
            <Td>{data.payment_mode || "-"}</Td>
            <Td>{data.basic_salary || "-"}</Td>
            <Td>{data.tax_regime || "-"}</Td>
            <Td>{data.pan_number || "-"}</Td>
            <Td>{data.uan_number || "-"}</Td>
          </tr>
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
};

export default ReadOnlyBankPayment;
