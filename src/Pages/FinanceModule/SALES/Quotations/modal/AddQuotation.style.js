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


export const Required = styled.span`
  color: #ef4444;
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


export const Container = styled.div`
  padding: 20px;
  background: #ffffff;
  @media (max-width: 768px) {
    padding: 14px;
  }
`;

export const Card = styled.form`
  background: #ffffff;
  /* border: 1px solid #e5e7eb; */
  /* padding: 24px; */

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const Grid4 = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 10px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  /* gap: 6px; */
  min-width: 0;
`;

export const Label = styled.label`
    margin-bottom: 7px;
    font-family: "Poppins", sans-serif;
    font-size: 14px;
    font-weight: 400;
    line-height: 18px;

    span{
      color: red;
    }
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

export const Select = styled.select`
  height: 38px;
  padding: 0 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  color: #111827;
  background: #ffffff;
  width: 100%;
  box-sizing: border-box;
  outline: none;

  &:focus {
    border-color: #3857b9;
  }
`;

export const ItemsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 22px 0 12px;
  gap: 12px;
  flex-wrap: wrap;
`;

export const SectionHeading = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  text-transform: uppercase;
`;

export const AddItemBtn = styled.button`
  height: 36px;
  padding: 0 14px;
  background: #f58220;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 12.5px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  &:hover {
    background: #df7113;
  }
`;

export const TableWrap = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px dashed #d1d5db;
  border-radius: 4px;
`;

export const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    background: #233c8b;
    color: #ffffff;
    font-size: 12px;
    font-weight: 600;
    padding: 10px 8px;
    text-align: left;
    white-space: nowrap;
  }

  td {
    padding: 8px 6px;
    border-bottom: 1px solid #e5e7eb;
    font-size: 12.5px;
    vertical-align: middle;
  }

  input,
  select {
    height: 34px;
    padding: 0 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 12.5px;
    width: 100%;
    min-width: 72px;
    box-sizing: border-box;
    background: #ffffff;
  }
`;

export const RemoveBtn = styled.button`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid #ef4444;
  background: #ffffff;
  color: #ef4444;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: #fef2f2;
  }
`;

export const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.9fr);
  gap: 24px;
  margin-top: 22px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 90px;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  font-family: inherit;
  box-sizing: border-box;
  resize: vertical;
`;

export const SummaryCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: #374151;

  strong {
    font-weight: 600;
    color: #111827;
  }
`;

export const TotalBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f58220;
  color: #ffffff;
  padding: 11px 14px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  margin-top: 4px;
`;

export const ActionsBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const OutlineBtn = styled.button`
  height: 38px;
  padding: 0 18px;
  background: #ffffff;
  color: #111827;
  border: 1px solid #111827;
  border-radius: 4px;
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #f3f4f6;
  }
`;

export const PrimaryBtn = styled.button`
  height: 38px;
  padding: 0 20px;
  background: #3857b9;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #2e49a5;
  }
`;