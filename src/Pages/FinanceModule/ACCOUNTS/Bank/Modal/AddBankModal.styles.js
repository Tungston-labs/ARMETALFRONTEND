import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 12px;
  background: rgba(0, 0, 0, 0.48);
`;

export const ModalContainer = styled.div`
  width: 100%;
  max-width: 1180px;
  max-height: calc(100vh - 24px);
  overflow-y: auto;

  padding: 48px 21px 46px;
  background: #ffffff;
  border-radius: 4px;
  box-sizing: border-box;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);

  @media (max-width: 768px) {
    padding: 28px 16px;
  }
`;

export const ModalTitle = styled.h2`
  margin: 0;
  color: #111111;
  font-family: "Poppins", sans-serif;
  font-size: 16px;
  font-weight: 600;
`;

export const ModalSubtitle = styled.p`
  margin: 2px 0 14px;
  color: #444444;
  font-family: "Poppins", sans-serif;
  font-size: 11px;
  font-weight: 300;
`;

export const BankForm = styled.form`
  width: 100%;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 17px 22px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 650px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 0;

  ${({ $span }) =>
    $span === 2 &&
    `
      grid-column: span 2;
    `}

  label {
    color: #111111;
    font-family: "Poppins", sans-serif;
    font-size: 10px;
    font-weight: 500;
  }

  @media (max-width: 420px) {
    grid-column: span 1;
  }
`;

const inputStyles = `
  width: 100%;
  height: 35px;
  padding: 0 10px;

  box-sizing: border-box;
  border: 1px solid #e6e6e6;
  border-radius: 5px;
  outline: none;
  background: #ffffff;

  color: #333333;
  font-family: "Poppins", sans-serif;
  font-size: 10px;

  &:focus {
    border-color: #354fba;
  }

  &::placeholder {
    color: #777777;
    opacity: 1;
  }
`;

export const FormInput = styled.input`
  ${inputStyles}
`;

export const FormSelect = styled.select`
  ${inputStyles}
  cursor: pointer;
`;

export const BalanceInputWrapper = styled.div`
  position: relative;
  width: 100%;

  input {
    padding-right: 43px;
  }
`;

export const BalanceCurrency = styled.span`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);

  color: #777777;
  font-family: "Poppins", sans-serif;
  font-size: 10px;
  pointer-events: none;
`;

export const FormTextarea = styled.textarea`
  ${inputStyles}
  resize: vertical;
  min-height: 35px;
  padding-top: 10px;
`;

export const ModalActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 15px;
`;

const actionStyles = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;

  height: 35px;
  padding: 0 17px;
  border-radius: 4px;

  font-family: "Poppins", sans-serif;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 13px;
    height: 13px;
  }
`;

export const CancelButton = styled.button`
  ${actionStyles}
  border: 1px solid #222222;
  background: #ffffff;
  color: #111111;
`;

export const SubmitButton = styled.button`
  ${actionStyles}
  border: 1px solid #354fba;
  background: #354fba;
  color: #ffffff;

  &:hover:not(:disabled) {
    background: #293f9d;
  }
`;

export const ErrorMessage = styled.p`
  margin: 12px 0 0;
  color: #dc2626;
  font-size: 12px;
`;
