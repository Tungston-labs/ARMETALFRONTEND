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
  max-width: 1420px;

  background: #fff;
  border-radius: 4px;
  padding: 28px 32px 24px;
  box-sizing: border-box;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.12);

  max-height: 95vh;
  overflow-y: auto;

  .payment-error {
    margin-top: 18px;
    padding: 12px 16px;
    border-radius: 6px;
    background: #fff1f0;
    border: 1px solid #ffccc7;
    color: #c0392b;
    font-family: "Poppins", sans-serif;
    font-size: 13px;
  }

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

export const ModalHeader = styled.div`
  margin-bottom: 23px;
`;

export const Title = styled.h2`
  margin: 0 0 12px;

  color: #111;
  font-family: "Poppins", sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 100%;
  letter-spacing: 0%;
`;

export const Subtitle = styled.p`
  margin: 0;

  color: #333;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0%;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));

  column-gap: 25px;
  row-gap: 20px;

  width: 100%;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 750px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  width: 100%;
  min-width: 0;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 10px;

  color: #222;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 100%;
  letter-spacing: 0%;
  text-transform: uppercase;

  span {
    margin-left: 3px;
    color: #e53935;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 41px;

  padding: 0 12px;
  box-sizing: border-box;

  border: 1px solid #e1e1e1;
  border-radius: 4px;
  outline: none;

  background: #ffffff;
  color: #333333;

  font-family: "Poppins", sans-serif;
  font-size: 13px;

  transition: 0.2s ease;

  &::placeholder {
    color: #999999;
  }

  &:focus {
    border-color: #3654b5;
  }

  &[readonly] {
    cursor: default;
  }

  &:disabled {
    background: #f9f9f9;
    cursor: not-allowed;
  }

  ${({ $isBalance }) =>
    $isBalance &&
    `
      color: #dc2626;
      font-weight: 500;
    `}
`;

export const Select = styled.select`
  width: 100%;
  height: 41px;

  padding: 0 12px;
  box-sizing: border-box;

  border: 1px solid #e1e1e1;
  border-radius: 4px;
  outline: none;

  background: #ffffff;
  color: #333333;

  font-family: "Poppins", sans-serif;
  font-size: 13px;

  cursor: pointer;
  transition: 0.2s ease;

  &:focus {
    border-color: #3654b5;
  }

  &:disabled {
    background: #f9f9f9;
    cursor: not-allowed;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 80px;

  padding: 10px 12px;
  box-sizing: border-box;
  resize: vertical;

  border: 1px solid #e1e1e1;
  border-radius: 4px;
  outline: none;

  background: #ffffff;
  color: #333333;

  font-family: "Poppins", sans-serif;
  font-size: 13px;

  &::placeholder {
    color: #999999;
  }

  &:focus {
    border-color: #3654b5;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;

  margin-top: 17px;

  @media (max-width: 480px) {
    flex-wrap: wrap;
  }
`;

export const CancelButton = styled.button`
  height: 40px;
  padding: 0 14px;

  border: 1px solid #111;
  border-radius: 4px;

  background: #fff;
  color: #111;

  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 500;

  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SaveButton = styled.button`
  min-width: 207px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 0 22px;

  border: none;
  border-radius: 4px;

  background: #3855bd;
  color: #fff;

  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 600;

  cursor: pointer;

  &:hover {
    background: #3049a5;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;