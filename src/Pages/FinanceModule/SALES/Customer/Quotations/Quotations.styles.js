import styled from "styled-components";

export const CompactCustomerTableWrapper = styled.div`
  width: 100%;
  max-width: 100%;

  table {
    min-width: 100% !important;
    table-layout: auto !important;
  }

  th {
    font-size: 12.5px !important;
    padding: 11px 8px !important;
  }

  td {
    font-size: 12.5px !important;
    padding: 10px 8px !important;
  }

  @media (max-width: 1320px) {
    th,
    td {
      font-size: 12px !important;
      padding: 9px 6px !important;
    }
  }
`;

export const GenerateCustomerQuoteButton = styled.button`
  height: 36px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #3857b9;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-family: "Poppins", sans-serif;
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #2e49a5;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;
