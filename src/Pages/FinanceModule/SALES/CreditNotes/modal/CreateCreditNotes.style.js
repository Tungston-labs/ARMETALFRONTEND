import styled from "styled-components";

export const InvoiceContainer = styled.div`
  width: 100%;
  min-height: 100%;
  background: #ffffff;
  box-sizing: border-box;
`;

export const InvoiceForm = styled.div`
  width: 100%;
  box-sizing: border-box;

  padding: 8px 51px 35px;

  background: #ffffff;

  @media (max-width: 1100px) {
    padding: 8px 30px 30px;
  }

  @media (max-width: 768px) {
    padding: 8px 20px 30px;
  }
`;

export const SectionTitle = styled.h3`
  margin: 0;
  padding: 0;

  font-size: 12px;
  font-weight: 600;
  line-height: 18px;

  color: #111111;

  text-transform: uppercase;
`;

export const FormGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(
    4,
    minmax(0, 1fr)
  );

  column-gap: 25px;
  row-gap: 13px;

  width: 100%;

  box-sizing: border-box;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(
      2,
      minmax(0, 1fr)
    );
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  width: 100%;

  min-width: 0;

  box-sizing: border-box;

  &.remaining-balance {
    input {
      background: #fff6e7;
    }
  }

  &.this-credit-note {
    input {
      background: #fce2e2;
      color: #ef1d1d;
      font-weight: 500;
    }
  }
`;

export const Label = styled.label`
  display: block;

  margin: 0 0 5px;

  color: #111111;

  font-size: 12px;
  font-weight: 500;
  line-height: 17px;
`;

export const Input = styled.input`
  width: 100%;

  height: 35px;

  padding: 0 16px;

  box-sizing: border-box;

  border: 1px solid #e6e3e3;

  border-radius: 4px;

  background: #ffffff;

  color: #777777;

  font-family: inherit;

  font-size: 12px;

  font-weight: 400;

  outline: none;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::placeholder {
    color: #999999;

    opacity: 1;
  }

  &:focus {
    border-color: #b8b8b8;

    box-shadow: none;
  }

  &[type="date"] {
    color: #777777;
  }
`;

export const SelectWrapper = styled.div`
  position: relative;

  width: 100%;

  svg {
    position: absolute;

    top: 50%;
    right: 15px;

    width: 15px;
    height: 15px;

    transform: translateY(-50%);

    color: #111111;

    pointer-events: none;
  }
`;

export const Select = styled.select`
  width: 100%;

  height: 35px;

  padding: 0 38px 0 16px;

  box-sizing: border-box;

  border: 1px solid #e6e3e3;

  border-radius: 4px;

  background: #ffffff;

  color: #777777;

  font-family: inherit;

  font-size: 12px;

  font-weight: 400;

  outline: none;

  appearance: none;

  -webkit-appearance: none;

  -moz-appearance: none;

  cursor: pointer;

  &:focus {
    border-color: #b8b8b8;
  }
`;

export const CalendarInput = styled.div`
  position: relative;

  width: 100%;

  input {
    width: 100%;
  }
`;

export const InvoiceItemsHeader = styled.div`
  display: flex;

  align-items: center;

  justify-content: space-between;

  width: 100%;

  margin-top: 25px;

  margin-bottom: 12px;
`;

export const InvoiceTableWrapper = styled.div`
  width: 100%;

  overflow-x: auto;

  border-bottom: 1px solid #eeeeee;

  box-sizing: border-box;

  &::-webkit-scrollbar {
    height: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: #d8d8d8;

    border-radius: 5px;
  }
`;

export const InvoiceTable = styled.table`
  width: 100%;

  min-width: 850px;

  border-collapse: collapse;

  table-layout: fixed;

  font-family: inherit;

  thead {
    background: #3149a0;
  }

  th {
    height: 35px;

    padding: 0 8px;

    color: #ffffff;

    font-size: 12px;

    font-weight: 600;

    text-align: center;

    vertical-align: middle;

    white-space: nowrap;
  }

  th:nth-child(1) {
    width: 7%;
  }

  th:nth-child(2) {
    width: 17%;
  }

  th:nth-child(3) {
    width: 15%;
  }

  th:nth-child(4) {
    width: 16%;
  }

  th:nth-child(5) {
    width: 15%;
  }

  th:nth-child(6) {
    width: 15%;
  }

  th:nth-child(7) {
    width: 15%;
  }

  tbody tr {
    height: 40px;
  }

  tbody td {
    padding: 5px 8px;

    color: #777777;

    font-size: 12px;

    font-weight: 400;

    text-align: center;

    vertical-align: middle;

    border-bottom: 0;
  }

  tbody td:first-child {
    color: #777777;
  }

  tbody input {
    width: 100%;

    max-width: 100%;

    height: 26px;

    padding: 0 8px;

    box-sizing: border-box;

    border: 1px solid #e5e5e5;

    border-radius: 0;

    background: #ffffff;

    color: #777777;

    font-family: inherit;

    font-size: 12px;

    outline: none;

    text-align: center;
  }

  tbody td:nth-child(2) input {
    text-align: left;
  }

  tbody td:nth-child(7) input {
    color: #ef1d1d;

    font-weight: 500;
  }

  tbody input:focus {
    border-color: #c8c8c8;
  }
`;

export const PaymentSection = styled.div`
  display: flex;

  width: 100%;

  min-height: 132px;

  margin-top: 0;

  box-sizing: border-box;
`;

export const PaymentLeft = styled.div`
  flex: 1;

  min-width: 0;
`;

export const PaymentRight = styled.div`
  width: 390px;

  max-width: 390px;

  margin-left: auto;

  padding: 13px 14px 23px;

  box-sizing: border-box;

  background: #f7f7fb;

  @media (max-width: 600px) {
    width: 100%;

    max-width: 100%;
  }
`;

export const SummaryRow = styled.div`
  display: flex;

  align-items: center;

  justify-content: space-between;

  min-height: 25px;

  color: #111111;

  font-size: 12px;

  font-weight: 400;

  span {
    color: #111111;
  }

  strong {
    color: #111111;

    font-size: 12px;

    font-weight: 500;
  }
`;

export const TotalAmount = styled.div`
  display: flex;

  align-items: center;

  justify-content: space-between;

  width: 100%;

  min-height: 36px;

  margin-top: 7px;

  padding: 0 14px;

  box-sizing: border-box;

  background: #ff8500;

  color: #ffffff;

  border-radius: 4px;

  font-size: 12px;

  font-weight: 600;

  span,
  strong {
    color: #ffffff;

    font-size: 12px;

    font-weight: 600;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;

  align-items: center;

  justify-content: flex-end;

  gap: 11px;

  width: 100%;

  margin-top: 13px;
`;

export const CancelButton = styled.button`
  width: 99px;

  height: 36px;

  padding: 0;

  border: 1px solid #3149a0;

  border-radius: 4px;

  background: #ffffff;

  color: #111111;

  font-family: inherit;

  font-size: 12px;

  font-weight: 500;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;

  &:hover {
    background: #f5f7ff;
  }

  &:disabled {
    opacity: 0.6;

    cursor: not-allowed;
  }
`;

export const PreviewButton = styled.button`
  width: 99px;

  height: 36px;

  padding: 0;

  border: 1px solid #3149a0;

  border-radius: 4px;

  background: #3149a0;

  color: #ffffff;

  font-family: inherit;

  font-size: 12px;

  font-weight: 500;

  cursor: pointer;

  transition:
    background 0.2s ease,
    opacity 0.2s ease;

  &:hover {
    background: #293f8e;
  }

  &:disabled {
    opacity: 0.65;

    cursor: not-allowed;
  }
`;

export const ActionWrapper = styled.div`
  display: flex;

  align-items: center;

  justify-content: left;

  gap: 6px;

  overflow: visible;

  position: relative;
`;

export const ActionButton = styled.button`
  width: 25px;

  height: 25px;

  padding: 0;

  margin: 0;

  border: none;

  border-radius: 50%;

  background: #f3f4f6;

  color: #374151;

  display: flex;

  align-items: center;

  justify-content: center;

  cursor: pointer;

  flex-shrink: 0;

  position: relative;

  z-index: 10;

  transition: all 0.2s ease;

  &:hover {
    background: #e5e7eb;

    transform: scale(1.08);
  }

  svg {
    display: block;
  }
`;

export const FloatingAction = styled.button`
  width: 24px;

  height: 24px;

  padding: 0;

  margin: 0;

  border: none;

  border-radius: 50%;

  display: ${({ $open }) =>
        $open ? "flex" : "none"};

  align-items: center;

  justify-content: center;

  cursor: pointer;

  flex-shrink: 0;

  transition:
    transform 0.2s ease,
    opacity 0.2s ease;

  ${({ $position }) =>
        $position === "view" &&
        `
      background: #e8f1ff;
      color: #3478f6;
    `}

  ${({ $position }) =>
        $position === "edit" &&
        `
      background: #fef3c7;
      color: #d97706;
    `}

  ${({ $position }) =>
        $position === "delete" &&
        `
      background: #ffe8e8;
      color: #dc2626;
    `}

  &:hover {
    transform: scale(1.12);
  }

  svg {
    display: block;
  }
`;

export const CreditNotesTextArea = styled.textarea`
  width: 52%;

  min-height: 42px;

  padding: 8px 10px;

  box-sizing: border-box;

  resize: vertical;

  border: 1px solid #e6e3e3;

  border-radius: 4px;

  background: #ffffff;

  color: #777777;

  font-family: inherit;

  font-size: 11px;

  font-weight: 400;

  line-height: 16px;

  outline: none;

  &::placeholder {
    color: #999999;

    opacity: 1;
  }

  &:focus {
    border-color: #b8b8b8;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;