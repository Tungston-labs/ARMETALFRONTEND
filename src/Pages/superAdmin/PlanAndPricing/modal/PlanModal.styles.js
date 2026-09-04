import styled from "styled-components";

/* =========================
   OVERLAY
========================= */

export const Overlay = styled.div`
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.45);

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  z-index: 999;
`;

/* =========================
   MODAL
========================= */

export const Modal = styled.div`
  width: 800px;
  max-width: 100%;

  max-height: 90vh;
  overflow-y: auto;

  background: #ffffff;

  border-radius: 14px;

  padding: 28px;

  box-sizing: border-box;

  scrollbar-width: thin;

  @media (max-width: 768px) {
    width: 100%;
    padding: 20px;

    max-height: 95vh;
  }

  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 10px;
  }
`;

/* =========================
   HEADER
========================= */

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 24px;
`;

export const Title = styled.h2`
  margin: 0;

  font-size: 22px;
  font-weight: 600;

  color: #202224;

  @media (max-width: 480px) {
    font-size: 19px;
  }
`;

export const CloseButton = styled.button`
  width: 36px;
  height: 36px;

  border: none;

  background: #f4f4f4;

  border-radius: 50%;

  cursor: pointer;

  font-size: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: 0.2s;

  &:hover {
    background: #ececec;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

/* =========================
   FORM
========================= */

export const Form = styled.form`
  display: flex;
  flex-direction: column;

  gap: 16px;
`;

/* =========================
   ROW
========================= */

export const Row = styled.div`
  display: grid;

  grid-template-columns: repeat(
    2,
    minmax(1, 1fr)
  );

  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;

    gap: 16px;
  }
`;

/* =========================
   TWO COLUMN ROW
========================= */

export const Rows = styled.div`
  display: grid;

  grid-template-columns: repeat(
    2,
    minmax(0, 1fr)
  );

  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;

    gap: 16px;
  }
`;

/* =========================
   FIELD
========================= */

export const Field = styled.div`
  display: flex;
  flex-direction: column;

  min-width: 0;
`;

/* =========================
   LABEL
========================= */

export const Label = styled.label`
  font-size: 14px;

  font-weight: 500;

  margin-bottom: 7px;

  color: #202224;
`;

/* =========================
   REQUIRED
========================= */

export const Required = styled.span`
  color: #e53935;

  margin-left: 3px;

  font-weight: 600;
`;

/* =========================
   INPUT
========================= */

export const Input = styled.input`
  width: 100%;

  height: 42px;

  box-sizing: border-box;

  border: 1px solid
    ${({ $hasError }) =>
      $hasError
        ? "#e53935"
        : "#d9d9d9"};

  border-radius: 8px;

  padding: 0 12px;

  font-size: 14px;

  color: #202224;

  outline: none;

  background: #ffffff;

  transition: border-color 0.2s,
    box-shadow 0.2s;

  &::placeholder {
    color: #a0a0a0;
  }

  &:focus {
    border-color: ${({ $hasError }) =>
      $hasError
        ? "#e53935"
        : "#ff8c1a"};

    box-shadow: 0 0 0 2px
      ${({ $hasError }) =>
        $hasError
          ? "rgba(229, 57, 53, 0.08)"
          : "rgba(255, 140, 26, 0.08)"};
  }

  &:disabled {
    background: #f5f5f5;

    cursor: not-allowed;
  }
`;

/* =========================
   SELECT
========================= */

export const Select = styled.select`
  width: 100%;

  height: 42px;

  box-sizing: border-box;

  border: 1px solid
    ${({ $hasError }) =>
      $hasError
        ? "#e53935"
        : "#d9d9d9"};

  border-radius: 8px;

  padding: 0 12px;

  font-size: 14px;

  outline: none;

  background-color: #ffffff;

  color: #202224;

  cursor: pointer;

  transition: border-color 0.2s;

  &:focus {
    border-color: ${({ $hasError }) =>
      $hasError
        ? "#e53935"
        : "#ff8c1a"};
  }
`;

/* =========================
   TEXT AREA
========================= */

export const TextArea = styled.textarea`
  width: 100%;

  box-sizing: border-box;

  border: 1px solid #d9d9d9;

  border-radius: 8px;

  padding: 12px 14px;

  font-size: 14px;

  color: #202224;

  resize: vertical;

  outline: none;

  min-height: 90px;

  font-family: inherit;

  &:focus {
    border-color: #ff8c1a;

    box-shadow: 0 0 0 2px
      rgba(255, 140, 26, 0.08);
  }

  &::placeholder {
    color: #a0a0a0;
  }
`;

/* =========================
   PRICE
========================= */

export const PriceInputWrapper = styled.div`
  position: relative;

  width: 100%;
`;

/* =========================
   FEATURE SECTION
========================= */

export const FeatureSection = styled.div`
  width: 100%;

  border-radius: 10px;
`;

/* =========================
   FEATURE HEADER
========================= */

export const FeatureHeader = styled.div`
  display: flex;

  justify-content: space-between;

  align-items: center;

  width: 100%;

  margin-bottom: 10px;
`;

/* =========================
   ADD FEATURE BUTTON
========================= */

export const AddFeatureButton = styled.button`
  border: none;

  background: #e0822d;

  color: #ffffff;

  padding: 9px 16px;

  border-radius: 8px;

  cursor: pointer;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 7px;

  font-size: 14px;

  font-weight: 500;

  transition: 0.2s;

  &:hover {
    background: #ef7f06;
  }

  &:disabled {
    opacity: 0.6;

    cursor: not-allowed;
  }
`;

/* =========================
   NEW FEATURE INPUTS
========================= */

export const FeatureInputWrapper = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 8px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const FeatureInput = styled.input`
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;
  outline: none;
  &:focus {
    border-color: #ff8c1a;
  }

  &::placeholder {
    color: #a0a0a0;
  }
`;

/* =========================
   FEATURE LIST
========================= */

export const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 16px;
`;

/* =========================
   FEATURE ITEM
========================= */

export const FeatureItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 34px;
  border-radius: 8px;
  transition: background 0.2s;
  &:hover {
    background: #fafafa;
  }
`;

/* =========================
   CHECKBOX
========================= */

export const Checkbox = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #333;

  input {
    width: 17px;
    height: 17px;
    cursor: pointer;
    accent-color: #ff8c1a;
  }
`;

/* =========================
   REMOVE FEATURE
========================= */

export const RemoveButton = styled.button`
  border: none;
  background: transparent;
  color: #e53935;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 5px;
  transition: 0.2s;
  &:hover {
    background: #fff1f1;
  }
`;

/* =========================
   ERROR MESSAGE
========================= */

export const ErrorMessage = styled.span`
  color: #e53935;
  font-size: 12px;
  margin-top: 5px;
  line-height: 1.4;
  display: block;
`;

/* =========================
   GENERAL FORM ERROR
========================= */

export const FormError = styled.div`
  width: 100%;
  box-sizing: border-box;
  background: #fff1f1;
  border: 1px solid #f2b8b5;
  color: #d32f2f;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 2px;
`;

/* =========================
   LOADING / EMPTY
========================= */

export const FeatureLoading = styled.div`
  color: #777;

  font-size: 13px;

  padding: 8px 0;
`;

export const FeatureEmpty = styled.div`
  color: #999;

  font-size: 13px;

  padding: 8px 0;
`;

/* =========================
   FOOTER
========================= */

export const Footer = styled.div`
  display: flex;

  justify-content: flex-end;

  align-items: center;

  gap: 12px;

  margin-top: 8px;

  padding-top: 8px;

  @media (max-width: 480px) {
    flex-direction: column-reverse;

    width: 100%;
  }
`;

/* =========================
   CANCEL BUTTON
========================= */

export const CancelButton = styled.button`
  border: 1px solid #d9d9d9;

  background: #ffffff;

  color: #444;

  padding: 11px 24px;

  border-radius: 8px;

  cursor: pointer;

  font-size: 14px;

  transition: 0.2s;

  &:hover {
    background: #f7f7f7;
  }

  &:disabled {
    opacity: 0.6;

    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

/* =========================
   SUBMIT BUTTON
========================= */

export const SubmitButton = styled.button`
  border: none;

  background: #ff8c1a;

  color: #ffffff;

  padding: 11px 26px;

  border-radius: 8px;

  cursor: pointer;

  font-size: 14px;

  font-weight: 600;

  transition: 0.2s;

  &:hover {
    background: #ef7f06;
  }

  &:disabled {
    opacity: 0.6;

    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;