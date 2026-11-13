import styled from "styled-components";

/* Same look as AddingInvoice.styles.js */

export const PageWrapper = styled.div`
  width: 100%;
  min-height: 100%;
  padding: 20px;
  box-sizing: border-box;

  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 6px;
`;

export const FormBody = styled.div`
  width: 100%;
  margin-top: 22px;
`;

export const SectionTitle = styled.h3`
  margin: 0;

  font-family: "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;

  color: #111111;

  display: flex;
  align-items: center;
  gap: 6px;
`;

/* =========================
   FORM
========================= */

export const FormGrid = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  column-gap: 24px;
  row-gap: 10px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  width: 100%;
  min-width: 0;

  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  margin-bottom: 7px;

  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
`;

export const Required = styled.span`
  color: #ef4444;
`;


export const Input = styled.input`
  width: 100%;
  height: 38px;

  box-sizing: border-box;

  border: 1px solid #e2e5ea;
  border-radius: 5px;

  padding: 0 12px;

  background: #ffffff;
  color: #333333;

  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 400;

  outline: none;
  transition: border-color 0.2s ease;
  color-scheme: light;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #3049a3;
  }
`;

/* =========================
   SELECT
========================= */

export const SelectWrap = styled.div`
  position: relative;
  width: 100%;

  svg {
    position: absolute;

    right: 13px;
    top: 50%;

    transform: translateY(-50%);

    width: 16px;
    height: 16px;

    color: #4b5563;

    pointer-events: none;
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 40px;

  box-sizing: border-box;

  border: 1px solid #e2e5ea;
  border-radius: 5px;

  padding: 0 40px 0 12px;

  background: #ffffff;
  color: #4b5563;

  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 400;

  appearance: none;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #3049a3;
  }
`;

/* =========================
   ITEMS HEADER
========================= */

export const ItemsHeader = styled.div`
  width: 100%;

  margin-top: 30px;
  margin-bottom: 12px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const AddItemButton = styled.button`
  height: 36px;
  padding: 0 16px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  border: none;
  border-radius: 4px;

  background: #f48211;
  color: #ffffff;

  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 600;

  cursor: pointer;
  transition: background 0.2s ease;

  svg {
    width: 15px;
    height: 15px;
  }

  &:hover {
    background: #e87508;
  }
`;

/* =========================
   TABLE
========================= */

export const TableWrap = styled.div`
  width: 100%;

  overflow-x: auto;

  border: 1px solid #e5e7eb;
  border-radius: 5px;

  scrollbar-width: thin;
`;

export const ItemsTable = styled.table`
  width: 100%;
  min-width: 1050px;

  border-collapse: collapse;
  table-layout: fixed;

  thead {
    background: #2c469f;
  }

  th {
    height: 42px;
    padding: 0 9px;

    color: #ffffff;

    font-family: "Poppins", sans-serif;
    font-size: 11px;
    font-weight: 600;

    text-align: left;
    white-space: nowrap;
  }

  td {
    height: 48px;
    padding: 5px 8px;

    border-bottom: 1px solid #eeeeee;

    color: #555555;

    font-family: "Poppins", sans-serif;
    font-size: 11px;

    vertical-align: middle;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 6%;
    text-align: center;
  }
  th:nth-child(2),
  td:nth-child(2) {
    width: 11%;
  }
  th:nth-child(3),
  td:nth-child(3) {
    width: 19%;
  }
  th:nth-child(4),
  td:nth-child(4) {
    width: 7%;
  }
  th:nth-child(5),
  td:nth-child(5) {
    width: 9%;
  }
  th:nth-child(6),
  td:nth-child(6) {
    width: 10%;
  }
  th:nth-child(7),
  td:nth-child(7) {
    width: 8%;
  }
  th:nth-child(8),
  td:nth-child(8) {
    width: 10%;
  }
  th:nth-child(9),
  td:nth-child(9) {
    width: 11%;
  }
  th:nth-child(10),
  td:nth-child(10) {
    width: 7%;
    text-align: center;
  }

  input {
    width: 100%;
    height: 32px;

    box-sizing: border-box;

    padding: 0 8px;

    border: 1px solid #e3e5e8;
    border-radius: 3px;

    background: #ffffff;
    color: #4b5563;

    font-family: "Poppins", sans-serif;
    font-size: 11px;

    outline: none;

    &:focus {
      border-color: #3049a3;
    }

    &::placeholder {
      color: #9ca3af;
    }
  }

  select {
    width: 100%;
    height: 32px;

    box-sizing: border-box;

    padding: 0 8px;

    border: 1px solid #e3e5e8;
    border-radius: 3px;

    background: #ffffff;
    color: #4b5563;

    font-family: "Poppins", sans-serif;
    font-size: 11px;

    outline: none;

    &:focus {
      border-color: #3049a3;
    }

    &::placeholder {
      color: #9ca3af;
    }
  }
  .calculated {
    white-space: nowrap;
  }
`;

export const DeleteButton = styled.button`
  width: 28px;
  height: 28px;

  margin: 0 auto;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #ff3b30;
  border-radius: 50%;

  background: #ffffff;
  color: #ff3b30;

  cursor: pointer;
  transition: all 0.2s ease;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover:not(:disabled) {
    background: #fff1f0;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

/* =========================
   NOTES + SUMMARY
========================= */

export const BottomSection = styled.div`
  width: 100%;

  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(300px, 1fr);

  gap: 60px;

  margin-top: 28px;
  align-items: start;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 22px;
  }
`;

export const NotesBlock = styled.div`
  width: 100%;
  min-width: 0;

  textarea {
    width: 100%;
    min-height: 90px;
    margin-top: 14px;

    resize: vertical;
    box-sizing: border-box;

    padding: 10px 12px;

    border: 1px solid #e2e5ea;
    border-radius: 5px;

    outline: none;
    color: #4b5563;
    white-space: pre-wrap;

    font-family: "Poppins", sans-serif;
    font-size: 12px;
    line-height: 1.6;

    &:focus {
      border-color: #3049a3;
    }
  }
`;

export const Summary = styled.div`
  width: 100%;
  padding-top: 2px;
`;

export const SummaryRow = styled.div`
  min-height: 32px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  font-family: "Poppins", sans-serif;
  font-size: 12px;

  color: #111111;

  span {
    color: #4b5563;
  }

  strong {
    font-weight: 600;
    color: #111111;
    white-space: nowrap;
  }
`;

export const DiscountInput = styled.input`
  width: 90px;
  height: 30px;

  box-sizing: border-box;

  padding: 0 8px;

  border: 1px solid #e2e5ea;
  border-radius: 4px;

  outline: none;
  text-align: right;
  color: #20a34a;

  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 600;

  &:focus {
    border-color: #3049a3;
  }
`;

export const TotalBar = styled.div`
  width: 100%;
  height: 42px;

  margin-top: 10px;
  padding: 0 16px;

  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border-radius: 5px;

  background: #ff8500;
  color: #ffffff;

  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 600;

  strong {
    font-size: 14px;
    font-weight: 600;
  }
`;

/* =========================
   FOOTER / BUTTONS
========================= */

export const Footer = styled.footer`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: 30px;

  @media (max-width: 760px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const LockNote = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4b5563;
  font-family: "Poppins", sans-serif;
  font-size: 12px;

  svg {
    color: #9a873a;
  }

  @media (max-width: 760px) {
    white-space: normal;
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;

  @media (max-width: 760px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

export const OutlineButton = styled.button`
  min-width: 100px;
  height: 38px;
  padding: 0 16px;
  border: 1px solid #3049a3;
  border-radius: 4px;
  background: #ffffff;
  color: #3049a3;
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: #f5f7ff;
  }
`;

export const PrimaryButton = styled.button`
  min-width: 100px;
  height: 38px;
  padding: 0 16px;
  border: 1px solid #3049a3;
  border-radius: 4px;
  background: #3049a3;
  color: #ffffff;
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: #263b88;
  }
`;

export const ErrorMessage = styled.div`
  margin-top: 14px;
  color: #c0392b;
  font-family: "Poppins", sans-serif;
  font-size: 12px;
`;