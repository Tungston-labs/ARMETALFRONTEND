import styled from "styled-components";

export const DeliveryNoteContainer = styled.div`
  width: 100%;
  min-height: 100%;
  padding: 20px 24px 28px;
  box-sizing: border-box;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 6px;

  .form-error {
    margin: 14px 24px 0;
    padding: 11px 13px;
    color: #b42318;
    background: #fef3f2;
    border: 1px solid #fecdca;
    border-radius: 5px;
    font-size: 12px;
  }
`;

export const DeliveryNoteForm = styled.div`
  width: 100%;
  margin-top: 22px;
  padding: 0 24px 20px;
  box-sizing: border-box;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: 24px;
  row-gap: 13px;

  .warehouse-field {
    grid-column: span 2;
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    .warehouse-field {
      grid-column: span 2;
    }
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    .warehouse-field {
      grid-column: span 1;
    }
  }
`;

export const FormGroup = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  margin: 0 0 7px;
  color: #171717;
  font-family: "Poppins", sans-serif;
  font-size: 11px;
  font-weight: 500;
  line-height: 15px;
`;

export const Input = styled.input`
  width: 100%;
  height: 36px;
  padding: 0 12px;
  box-sizing: border-box;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
  outline: none;
  background: #fff;
  color: #4b5563;
  font-family: "Poppins", sans-serif;
  font-size: 12px;

  &::placeholder {
    color: #9ca3af;
  }
  &:focus {
    border-color: #3049a3;
  }
`;

export const SelectWrapper = styled.div`
  position: relative;
  width: 100%;

  svg {
    position: absolute;
    top: 50%;
    right: 12px;
    width: 15px;
    height: 15px;
    transform: translateY(-50%);
    pointer-events: none;
    color: #111827;
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 36px;
  padding: 0 36px 0 12px;
  box-sizing: border-box;
  appearance: none;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
  outline: none;
  background: #fff;
  color: #4b5563;
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  cursor: pointer;

  &:focus {
    border-color: #3049a3;
  }
`;

export const ItemsTitle = styled.h3`
  margin: 25px 0 13px 4px;
  color: #111;
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 600;
`;

export const ItemsTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const ItemsTable = styled.table`
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
  table-layout: fixed;
  font-family: "Poppins", sans-serif;

  thead {
    background: #304db3;
  }

  th {
    height: 35px;
    padding: 0 8px;
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
  }

  td {
    height: 39px;
    padding: 4px 8px;
    color: #555;
    font-size: 10px;
    text-align: center;
    border-bottom: 1px solid #f0f0f0;
  }

  tbody tr:last-child td {
    border-bottom: 0;
  }

  th:nth-child(1),
  td:nth-child(1) {
    width: 7%;
  }
  th:nth-child(2),
  td:nth-child(2) {
    width: 17%;
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
    width: 14%;
  }
  th:nth-child(8),
  td:nth-child(8) {
    width: 13%;
  }

  input {
    width: 100%;
    max-width: 112px;
    height: 27px;
    padding: 0 6px;
    box-sizing: border-box;
    border: 1px solid #e5e7eb;
    border-radius: 3px;
    outline: none;
    background: #fff;
    color: #555;
    font-family: "Poppins", sans-serif;
    font-size: 10px;
    text-align: center;

    &:focus {
      border-color: #3049a3;
    }
    &:read-only {
      background: #fff;
    }
  }

  td:nth-child(2) input {
    max-width: 130px;
  }
  .item-status {
    font-size: 10px;
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

export const NotesSection = styled.div`
  width: 52%;
  min-width: 320px;
  margin-top: 15px;

  @media (max-width: 700px) {
    width: 100%;
    min-width: 0;
  }
`;

export const NotesTextarea = styled.textarea`
  width: 100%;
  min-height: 41px;
  margin-top: 7px;
  padding: 11px;
  box-sizing: border-box;
  resize: vertical;
  border: 1px solid #e5e7eb;
  border-radius: 5px;
  outline: none;
  color: #4b5563;
  font-family: "Poppins", sans-serif;
  font-size: 10px;

  &::placeholder {
    color: #9ca3af;
  }
  &:focus {
    border-color: #3049a3;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
`;

export const CancelButton = styled.button`
  width: 96px;
  height: 36px;
  border: 1px solid #3049a3;
  border-radius: 4px;
  background: #fff;
  color: #111;
  font-family: "Poppins", sans-serif;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #f5f7ff;
  }
`;

export const CreateButton = styled.button`
  width: 96px;
  height: 36px;
  border: 1px solid #3049a3;
  border-radius: 4px;
  background: #3049a3;
  color: #fff;
  font-family: "Poppins", sans-serif;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #263b88;
  }
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;
