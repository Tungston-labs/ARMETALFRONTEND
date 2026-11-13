import styled from "styled-components";

const ERROR_COLOR = "#dc2626";

/* =========================================================
   OVERLAY
========================================================= */

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(0, 0, 0, 0.25);

  padding: 20px;
`;

/* =========================================================
   MODAL CONTAINER
========================================================= */

export const ModalContainer = styled.div`
  width: 100%;
  max-width: 1420px;

  background: #fff;

  border-radius: 4px;

  padding: 28px 32px 30px;

  box-sizing: border-box;

  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.12);

  max-height: 95vh;
  overflow-y: auto;

  @media (max-width: 1100px) {
    max-width: 95%;
  }

  @media (max-width: 900px) {
    padding: 24px;
  }

  @media (max-width: 600px) {
    padding: 20px;
  }
`;

/* =========================================================
   HEADER
========================================================= */

export const Header = styled.div`
  margin-bottom: 23px;
`;

export const Title = styled.h2`
  margin: 0 0 12px;
  font-family: "Poppins", sans-serif;
  color: #111111;
  font-weight: 500;
  font-size: 20px;
  line-height: 100%;
  letter-spacing: 0%;
`;

export const Description = styled.p`
  margin: 0;
  color: #333;
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;
`;

/* =========================================================
   FORM
========================================================= */

export const Form = styled.form`
  width: 100%;
`;

export const FormGrid = styled.div`
  display: grid;

  /* 10 fields -> 2 clean rows of 5 */
  grid-template-columns: repeat(5, minmax(0, 1fr));

  column-gap: 18px;
  row-gap: 15px;

  width: 100%;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));

    column-gap: 16px;
    row-gap: 16px;
  }

  @media (max-width: 650px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div`
  min-width: 0;
`;

/* =========================================================
   LABEL / REQUIRED STAR / ERROR TEXT
========================================================= */

export const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  color: #222;
  text-transform: uppercase;
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 13px;
  line-height: 100%;
  letter-spacing: 0%;
`;

/* red star shown after the label of a required field */
export const RequiredStar = styled.span`
  color: ${ERROR_COLOR};
  margin-left: 4px;
  font-weight: 600;
`;

/* validation message shown under a field */
export const ErrorText = styled.span`
  display: block;
  margin-top: 4px;
  color: ${ERROR_COLOR};
  font-family: "Poppins", sans-serif;
  font-size: 12px;
  line-height: 1.3;
`;

/* =========================================================
   INPUT / SELECT
   $hasError turns the border red
========================================================= */

const fieldStyles = `
  width: 100%;
  height: 41px;
  padding: 0 12px;
  box-sizing: border-box;
  border-radius: 4px;
  outline: none;
  background: #ffffff;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  color: #333333;
  transition: 0.2s ease;

  &::placeholder {
    color: #999999;
  }

  &:disabled {
    background: #f9f9f9;
    cursor: not-allowed;
  }

  &:read-only {
    cursor: default;
  }
`;

export const Input = styled.input`
  ${fieldStyles}

  border: 1px solid ${({ $hasError }) => ($hasError ? ERROR_COLOR : "#e1e1e1")};

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? ERROR_COLOR : "#3654b5")};
  }

  &[type="date"]::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.65;
  }

  &[type="number"] {
    padding-right: 42px;
  }
`;

export const Select = styled.select`
  ${fieldStyles}

  border: 1px solid ${({ $hasError }) => ($hasError ? ERROR_COLOR : "#e1e1e1")};

  cursor: pointer;

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? ERROR_COLOR : "#3654b5")};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

/* =========================================================
   UNIT INPUT (PCS suffix)
========================================================= */

export const UnitInput = styled.div`
  position: relative;

  width: 100%;

  input {
    padding-right: 48px;
  }
`;

export const UnitText = styled.span`
  position: absolute;

  top: 50%;
  right: 12px;

  transform: translateY(-50%);

  font-family: "Poppins", sans-serif;
  font-size: 12px;
  font-weight: 400;

  color: #777777;

  pointer-events: none;
`;

/* =========================================================
   NOTE
========================================================= */

export const NoteWrapper = styled.div`
  position: relative;

  width: 100%;
`;

export const NoteInput = styled.input`
  ${fieldStyles}

  padding-right: 32px;
`;

export const NoteChevron = styled.span`
  position: absolute;

  top: 50%;
  right: 10px;

  transform: translateY(-50%);

  display: flex;
  align-items: center;
  justify-content: center;

  color: #333333;

  pointer-events: none;
`;

/* =========================================================
   ATTACHMENT
========================================================= */

export const AttachmentWrapper = styled.div`
  position: relative;

  display: flex;
  align-items: center;

  width: 100%;
  height: 41px;

  box-sizing: border-box;

  border: 1px solid ${({ $hasError }) => ($hasError ? ERROR_COLOR : "#e1e1e1")};
  border-radius: 4px;

  background: #ffffff;

  overflow: hidden;

  transition: 0.2s ease;

  &:focus-within {
    border-color: ${({ $hasError }) => ($hasError ? ERROR_COLOR : "#3654b5")};
  }
`;

export const AttachmentInput = styled.input`
  width: 100%;
  height: 39px;

  box-sizing: border-box;

  padding: 0 44px 0 12px;

  border: none;
  outline: none;

  background: transparent;

  font-family: "Poppins", sans-serif;
  font-size: 13px;

  color: #777777;

  &::placeholder {
    color: #999999;
  }
`;

export const UploadLabel = styled.label`
  position: absolute;

  top: 0;
  right: 0;

  width: 41px;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  margin: 0;

  color: #333333;

  cursor: pointer;

  transition: 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }

  svg {
    width: 15px;
    height: 15px;
    stroke-width: 1.6;
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

/* =========================================================
   BUTTONS
========================================================= */

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;

  gap: 10px;

  margin-top: 20px;
`;

export const CancelButton = styled.button`
  height: 40px;
  min-width: 86px;
  padding: 0 18px;
  background: #ffffff;
  border: 1px solid #111111;
  border-radius: 4px;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #111111;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SaveButton = styled.button`
  height: 40px;
  min-width: 207px;
  padding: 0 25px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  background: #3857b9;
  border: none;
  border-radius: 4px;

  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.4px;
  color: #ffffff;

  cursor: pointer;
  transition: 0.2s ease;

  svg {
    width: 15px;
    height: 15px;
  }

  &:hover {
    background: #2e49a5;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
