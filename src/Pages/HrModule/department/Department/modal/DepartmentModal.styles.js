import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  z-index: 9999;
`;

export const Modal = styled.div`
  width: 100%;
  max-width: 680px;
  background: #ffffff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.15);
  animation: modalOpen 0.2s ease-in-out;

  @keyframes modalOpen {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 650px) {
    max-width: 100%;
  }
`;

export const ModalHeader = styled.div`
  width: 100%;
  min-height: 46px;

  background: #3559bd;

  display: flex;
  align-items: center;

  padding: 0 38px;

  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 0 20px;
  }
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: #ffffff;
  font-family: "Poppins";
font-weight: 500;
font-style: Medium;
font-size: 16px;
line-height: 100%;
letter-spacing: 0px;

`;

export const Form = styled.form`
  width: 100%;

  padding: 18px 38px 26px;

  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 18px 20px 24px;
  }
`;

export const FormRow = styled.div`
  width: 100%;

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 12px;

  margin-bottom: 12px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;

    gap: 12px;
  }
`;

export const FormGroup = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  color: #333333;
  margin-bottom: 6px;
  line-height: 1.2;

  font-family: "Poppins";
font-weight: 400;
font-style: Regular;
font-size: 12px;
line-height: 20px;
letter-spacing: -0.05px;

`;

export const Required = styled.span`
  color: #e53935;

  margin-left: 2px;
`;

export const Input = styled.input`
  width: 100%;
  height: 35px;
  padding: 0 10px;
  box-sizing: border-box;
  border: 1px solid #e1e1e1;
  border-radius: 3px;
  outline: none;
  font-size: 14px;
  color: #555555;
  background: #ffffff;
  font-family: inherit;

  &::placeholder {
    color: #b0b0b0;
  }

  &:focus {
    border-color: #3559bd;

    box-shadow:
      0 0 0 2px rgba(53, 89, 189, 0.08);
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 35px;
  padding: 0 10px;
  box-sizing: border-box;
  border: 1px solid #e1e1e1;
  border-radius: 3px;
  outline: none;
  background: #ffffff;
  color: #777777;
  font-size: 14px;

  font-family: inherit;

  cursor: pointer;

  &:focus {
    border-color: #3559bd;

    box-shadow:
      0 0 0 2px rgba(53, 89, 189, 0.08);
  }
`;
export const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #eef0f4;

  @media (max-width: 480px) {
    gap: 8px;
    margin-top: 20px;
    padding-top: 14px;
  }
`;

export const CancelButton = styled.button`
  min-width: 82px;
  height: 34px;
  padding: 0 16px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #d9dee8;
  border-radius: 6px;

  background: #ffffff;
  color: #6b7280;

  font-family: "Poppins", sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.3px;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    background: #f3f5f8;
    border-color: #c5cad4;
    color: #374151;
  }

  &:active {
    transform: scale(0.97);
  }
`;

export const SubmitButton = styled.button`
  min-width: 82px;
  height: 34px;
  padding: 0 18px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 6px;

  background: #3559bd;
  color: #ffffff;

  font-family: "Poppins", sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.3px;

  cursor: pointer;

  box-shadow: 0 2px 6px rgba(53, 89, 189, 0.18);

  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #294aa5;
    box-shadow: 0 4px 10px rgba(53, 89, 189, 0.25);
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    background: #c8cdd6;
    color: #ffffff;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

export const ErrorMessage = styled.span`
  display: block;
  margin-top: 6px;

  color: #dc2626;

  font-family: "Poppins", sans-serif;
  font-size: 10px;
  font-weight: 400;
  line-height: 15px;
`;