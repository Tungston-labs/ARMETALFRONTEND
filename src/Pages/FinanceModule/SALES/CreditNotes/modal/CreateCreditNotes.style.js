import styled from "styled-components";

export const InvoiceContainer = styled.div`
  width: 100%;
  min-height: 100%;
  padding: 24px;
  box-sizing: border-box;

  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 6px;
`;

export const InvoiceForm = styled.div`
  width: 100%;
  margin-top: 22px;

  /* Notes & reason detail block (plain textarea used in the component) */
  .credit-note-notes {
    width: 100%;
    margin-top: 28px;

    label {
      margin: 0 0 10px;
      font-family: "Poppins", sans-serif;
      font-size: 16px;
      font-weight: 500;
      line-height: 100%;
      color: #111111;
    }

    textarea {
      width: 100%;
      min-height: 80px;
      box-sizing: border-box;
      padding: 10px 12px;
      resize: vertical;

      border: 1px solid #e2e5ea;
      border-radius: 5px;

      background: #ffffff;
      color: #4b5563;

      font-family: "Poppins", sans-serif;
      font-size: 12px;
      line-height: 18px;

      outline: none;

      &::placeholder {
        color: #9ca3af;
      }

      &:focus {
        border-color: #3049a3;
      }
    }
  }
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

  svg {
    width: 15px;
    height: 15px;
  }
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

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  width: 100%;
  min-width: 0;

  display: flex;
  flex-direction: column;

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
  margin-bottom: 7px;

  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
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

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #3049a3;
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`;

/* =========================
   DATE
========================= */

export const CalendarInput = styled.div`
  position: relative;
  width: 100%;
`;

/* =========================
   SELECT
========================= */

export const SelectWrapper = styled.div`
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

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`;

/* =========================
   ITEMS HEADER
========================= */

export const InvoiceItemsHeader = styled.div`
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
    background: #f48211;
  }
`;

/* =========================
   TABLE (7 columns)
========================= */

export const InvoiceTableWrapper = styled.div`
  width: 100%;

  overflow-x: auto;

  border: 1px solid #e5e7eb;
  border-radius: 5px;

  scrollbar-width: thin;
`;

export const InvoiceTable = styled.table`
  width: 100%;
  min-width: 850px;

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
    font-size: 14px;
    font-weight: 600;
    line-height: 100%;
    letter-spacing: 0%;

    text-align: center;
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
    width: 7%;
    text-align: center;
  }

  th:nth-child(2),
  td:nth-child(2) {
    width: 20%;
  }

  th:nth-child(3),
  td:nth-child(3) {
    width: 14%;
  }

  th:nth-child(4),
  td:nth-child(4) {
    width: 15%;
  }

  th:nth-child(5),
  td:nth-child(5) {
    width: 15%;
  }

  th:nth-child(6),
  td:nth-child(6) {
    width: 14%;
  }

  th:nth-child(7),
  td:nth-child(7) {
    width: 15%;
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

    &:read-only {
      background: #f9fafb;
    }
  }

  /* Credit Total column stays highlighted */
  td:nth-child(7) input {
    color: #ef1d1d;
    font-weight: 500;
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

  &:hover {
    background: #fff1f0;
  }
`;

/* =========================
   PAYMENT / SUMMARY SECTION
========================= */

export const PaymentSection = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  margin-top: 28px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const PaymentLeft = styled.div`
  width: 100%;
  min-width: 0;
`;

export const NotesTitle = styled.h4`
  margin: 0 0 10px;

  font-family: "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 100%;
  letter-spacing: 0%;

  color: #111111;
`;

export const NotesBox = styled.div`
  width: 100%;
  min-height: 50px;
  box-sizing: border-box;
  padding: 7px 10px;

  border: 1px solid #e2e5ea;
  border-radius: 5px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;

  span {
    font-family: "Poppins", sans-serif;
    font-size: 11px;
    font-weight: 400;
    line-height: 100%;
    color: #999999;
    margin-bottom: 5px;
  }

  strong {
    font-family: "Poppins", sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 100%;
    color: #111111;
  }
`;

export const PaymentRight = styled.div`
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  justify-self: stretch;

  @media (max-width: 768px) {
    width: 100%;
  }
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

export const TotalAmount = styled.div`
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

  span {
    color: #ffffff;
  }

  strong {
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
  }
`;

/* =========================
   BUTTONS
========================= */

export const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
`;

export const CancelButton = styled.button`
  min-width: 100px;
  height: 38px;
  padding: 0 14px;

  border: 1px solid #3049a3;
  border-radius: 4px;

  background: #ffffff;
  color: #111111;

  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 500;

  cursor: pointer;

  &:hover {
    background: #f5f7ff;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const DraftButton = styled.button`
  min-width: 110px;
  height: 38px;
  padding: 0 14px;

  border: 1px solid #3049a3;
  border-radius: 4px;

  background: #ffffff;
  color: #334155;

  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 500;

  cursor: pointer;

  &:hover {
    background: #f1f5f9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const PreviewButton = styled.button`
  min-width: 100px;
  height: 38px;
  padding: 0 14px;

  border: 1px solid #3049a3;
  border-radius: 4px;

  background: #3049a3;
  color: #ffffff;

  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 500;

  cursor: pointer;

  &:hover {
    background: #263b88;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/* =========================
   VALIDATION
========================= */

export const Required = styled.span`
  margin-left: 3px;
  color: #e53935;

  &::after {
    content: "*";
  }
`;

export const ErrorText = styled.span`
  display: block;
  margin-top: 4px;

  font-family: "Poppins", sans-serif;
  font-size: 12px;
  line-height: 16px;

  color: #e53935;
`;

/* =========================
   NOTES TEXTAREA
========================= */

export const CreditNotesTextArea = styled.textarea`
  width: 100%;
  min-height: 80px;

  padding: 10px 12px;

  box-sizing: border-box;

  resize: vertical;

  border: 1px solid #e2e5ea;
  border-radius: 5px;

  background: #ffffff;

  color: #4b5563;

  font-family: "Poppins", sans-serif;
  font-size: 12px;
  line-height: 18px;

  outline: none;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #3049a3;
  }
`;

/* =========================
   ROW ACTIONS (list page)
========================= */

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

  display: ${({ $open }) => ($open ? "flex" : "none")};

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