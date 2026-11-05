import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  align-items: flex-start;
  justify-content: center;

  padding: 5px 6px;

  background: rgba(0, 0, 0, 0.5);

  overflow-y: auto;
`;

export const ModalContainer = styled.div`
  width: 100%;
  max-width: 1180px;

  min-height: 322px;
  margin: 0 auto;

  padding: 44px 20px 45px;

  background: #ffffff;
  border-radius: 3px;

  box-sizing: border-box;

  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);

  @media (max-width: 1000px) {
    padding: 35px 20px;
  }

  @media (max-width: 700px) {
    padding: 30px 18px;
  }

  @media (max-width: 480px) {
    padding: 25px 14px;
  }
`;

export const ModalHeader = styled.div`
  margin-bottom: 12px;
`;

export const Title = styled.h2`
  margin: 0 0 2px;

  color: #3154bd;

  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
`;

export const Subtitle = styled.p`
  margin: 0;

  color: #777777;

  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
`;

export const FormGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(5, minmax(0, 1fr));

  column-gap: 22px;
  row-gap: 18px;

  width: 100%;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: 18px;
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 15px;
    row-gap: 16px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;

  min-width: 0;
`;

export const Label = styled.label`
  margin-bottom: 8px;

  color: #111111;

  font-size: 10px;
  font-weight: 500;
  line-height: 1.2;

  span {
    color: #dc2626;
    margin-left: 1px;
  }
`;

const fieldStyles = `
  width: 100%;
  height: 35px;

  padding: 0 10px;

  box-sizing: border-box;

  border: 1px solid #e5e5e5;
  border-radius: 4px;

  background: #ffffff;

  color: #777777;

  font-family: inherit;
  font-size: 11px;
  font-weight: 400;

  outline: none;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::placeholder {
    color: #999999;
  }

  &:focus {
    border-color: #3154bd;
    box-shadow: 0 0 0 1px rgba(49, 84, 189, 0.08);
  }

  &:disabled {
    background: #f9f9f9;
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  ${fieldStyles}

  &[type="date"] {
    color: #777777;
    cursor: pointer;
  }

  &[type="date"]::-webkit-calendar-picker-indicator {
    width: 12px;
    height: 12px;

    cursor: pointer;
  }

  &[readonly] {
    cursor: default;
    background: #ffffff;
  }

  ${({ $isBalance }) =>
    $isBalance &&
    `
      color: #dc2626 !important;
      font-weight: 500;
    `}
`;

export const Select = styled.select`
  ${fieldStyles}

  appearance: auto;

  color: #777777;

  cursor: pointer;

  option {
    color: #333333;
    background: #ffffff;
  }
`;

export const Textarea = styled.textarea`
  ${fieldStyles}

  height: 70px;

  padding-top: 9px;

  resize: none;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;

  gap: 12px;

  margin-top: 16px;

  @media (max-width: 480px) {
    flex-wrap: wrap;
    margin-top: 20px;
  }
`;

export const CancelButton = styled.button`
  height: 35px;
  min-width: 74px;

  padding: 0 15px;

  border: 1px solid #222222;
  border-radius: 4px;

  background: #ffffff;
  color: #111111;

  font-family: inherit;
  font-size: 11px;
  font-weight: 500;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SaveButton = styled.button`
  height: 35px;
  min-width: 138px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  padding: 0 15px;

  border: none;
  border-radius: 4px;

  background: #3453b5;
  color: #ffffff;

  font-family: inherit;
  font-size: 10px;
  font-weight: 500;

  cursor: pointer;

  transition: background 0.2s ease;

  span {
    font-size: 11px;
  }

  &:hover {
    background: #29469f;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
