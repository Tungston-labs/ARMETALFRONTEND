import styled from "styled-components";

export const DeliveryNoteContainer = styled.div`
  width: 100%;
  min-height: 100%;
  padding: 24px;
  box-sizing: border-box;

  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 6px;

  .form-error {
    margin: 0 0 16px;
    padding: 12px 16px;
    border-radius: 6px;
    background: #fff1f0;
    border: 1px solid #ffccc7;
    color: #c0392b;
    font-family: "Poppins", sans-serif;
    font-size: 14px;
  }
`;

export const DeliveryNoteForm = styled.div`
  width: 100%;
  margin-top: 22px;
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


  @media (max-width: 900px) {
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
`;

/* =========================
   ITEMS
========================= */

export const ItemsTitle = styled.h3`
  margin: 30px 0 12px;

  font-family: "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 20px;
  color: #111111;
`;

export const ItemsTableWrapper = styled.div`
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
    font-size: 14px;
    font-weight: 600;
    line-height: 100%;
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
    text-align: center;
    vertical-align: middle;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 7%;
  }
  th:nth-child(2),
  td:nth-child(2) {
    width: 18%;
  }
  th:nth-child(3),
  td:nth-child(3) {
    width: 12%;
  }
  th:nth-child(4),
  td:nth-child(4) {
    width: 14%;
  }
  th:nth-child(5),
  td:nth-child(5) {
    width: 13%;
  }
  th:nth-child(6),
  td:nth-child(6) {
    width: 10%;
  }
  th:nth-child(7),
  td:nth-child(7) {
    width: 13%;
  }
  th:nth-child(8),
  td:nth-child(8) {
    width: 13%;
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
      background: #ffffff;
    }
  }

  .item-status {
    font-family: "Poppins", sans-serif;
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
  }
  .item-status.fully-delivered {
    color: #07952f;
  }
  .item-status.partial {
    color: #ff7900;
  }
  .item-status.pending {
    color: #e11d48;
  }
`;

/* =========================
   NOTES
========================= */

export const NotesSection = styled.div`
  width: 50%;
  min-width: 320px;
  margin-top: 28px;

  label {
    display: block;
    margin: 0 0 10px;

    font-family: "Poppins", sans-serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 100%;
    color: #111111;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: 0;
  }
`;

export const NotesTextarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  resize: vertical;

  border: 1px solid #e2e5ea;
  border-radius: 5px;
  outline: none;

  color: #333333;
  font-family: "Poppins", sans-serif;
  font-size: 13px;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #3049a3;
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
`;

export const CreateButton = styled.button`
  min-width: 120px;
  height: 38px;
  padding: 0 14px;

  border: 1px solid #3250b5;
  border-radius: 4px;
  background: #3250b5;
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