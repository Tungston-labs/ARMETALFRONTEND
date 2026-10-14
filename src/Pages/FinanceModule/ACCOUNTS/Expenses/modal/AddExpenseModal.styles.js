import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(0, 0, 0, 0.25);

  padding: 20px;
`;

export const ModalContainer = styled.div`
  width: 100%;
  max-width: 1220px;
  background: #fff;
  border-radius: 4px;
  padding: 28px 32px 24px;
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

export const Form = styled.form`
  width: 100%;
`;

export const SectionTitle = styled.h2`
  margin: 0 0 5px;
  color: #111111;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5;
`;

export const SectionDescription = styled.p`
  margin: 0 0 24px;
  color: #333333;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.5;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  column-gap: 26px;
  row-gap: 20px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 16px;
    row-gap: 18px;
  }

  @media (max-width: 450px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 9px;
`;

export const Label = styled.label`
  color: #111111;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.3;
`;

const fieldStyles = `
  width: 100%;
  height: 40px;
  box-sizing: border-box;
  padding: 0 12px;

  border: 1px solid #e5e5e5;
  border-radius: 5px;

  outline: none;
  background: #ffffff;
  color: #222222;

  font-family: inherit;
  font-size: 13px;
  font-weight: 400;

  transition: border-color 0.2s ease;

  &::placeholder {
    color: #888888;
  }

  &:focus {
    border-color: #3151bd;
  }

  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  ${fieldStyles}
`;

export const Select = styled.select`
  ${fieldStyles}

  cursor: pointer;

  option {
    color: #222222;
  }
`;

export const TextArea = styled.textarea`
  ${fieldStyles}

  min-height: 40px;
  resize: vertical;
  padding-top: 10px;
`;

export const UploadWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 40px;
`;

export const UploadLabel = styled.label`
  ${fieldStyles}

  display: flex;
  align-items: center;
  justify-content: space-between;

  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  span {
    margin-left: 8px;
    color: #111111;
    font-size: 19px;
  }

  &:hover {
    border-color: #3151bd;
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 18px;

  @media (max-width: 450px) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;

export const CancelButton = styled.button`
  min-width: 85px;
  height: 40px;
  padding: 0 16px;

  border: 1px solid #111111;
  border-radius: 5px;

  background: #ffffff;
  color: #111111;

  font-family: inherit;
  font-size: 13px;
  font-weight: 500;

  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #f3f3f3;
  }
`;

export const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 18px;

  min-width: 206px;
  height: 40px;
  padding: 0 20px;

  border: none;
  border-radius: 5px;

  background: #304fba;
  color: #ffffff;

  font-family: inherit;
  font-size: 13px;
  font-weight: 500;

  cursor: pointer;
  transition: background 0.2s ease;

  span {
    font-size: 16px;
  }

  &:hover {
    background: #243f9d;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 450px) {
    width: 100%;
  }
`;