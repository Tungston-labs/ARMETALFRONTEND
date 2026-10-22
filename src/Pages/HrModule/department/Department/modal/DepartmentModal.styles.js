import styled from "styled-components";

const chevron = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23222' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>")`;

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

export const Modal = styled.div`
  width: 100%;
  max-width: 720px;
  background: #fff;
  border-radius: 4px;
  padding: 28px 32px 24px;
  box-sizing: border-box;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.12);
  max-height: 95vh;
  overflow-y: auto;

  @media (max-width: 1100px) { max-width: 95%; }
  @media (max-width: 900px)  { padding: 24px; }
  @media (max-width: 600px)  { padding: 20px; }
`;

export const ModalHeader = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 23px;
  box-sizing: border-box;
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-family: "Poppins", sans-serif;
  font-size: 20px;
  font-weight: 500;
  line-height: 1.3;
  color: #3250bc;
`;

export const ModalSubtitle = styled.p`
  margin: 0;
  font-family: "Poppins", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  color: #666;

  @media (max-width: 480px) { font-size: 12px; }
`;

export const Form = styled.form`
  width: 100%;
  box-sizing: border-box;
`;

export const FormRow = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 25px;
  row-gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 520px) { grid-template-columns: 1fr; }
`;

export const FormGroup = styled.div`
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.2;
  color: #222;
  text-transform: uppercase;
`;

export const Required = styled.span`
  color: #e53935;
  margin-left: 2px;
`;

export const Input = styled.input`
  width: 100%;
  height: 41px;
  padding: 0 12px;
  box-sizing: border-box;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  outline: none;
  background: #fff;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  color: #333;
  transition: 0.2s ease;

  &::placeholder { color: #999; }
  &:focus { border-color: #3654b5; }
`;

export const Select = styled.select`
  width: 100%;
  height: 41px;
  padding: 0 38px 0 12px;
  box-sizing: border-box;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  outline: none;
  background-color: #fff;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: 0.2s ease;

  appearance: none;
  -webkit-appearance: none;
  background-image: ${chevron};
  background-repeat: no-repeat;
  background-position: right 14px center;

  &:focus { border-color: #3654b5; }
  &:disabled { background-color: #f7f7f7; cursor: not-allowed; }
`;

export const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 13px;
  margin-top: 17px;

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    align-items: stretch;
  }
`;

export const CancelButton = styled.button`
  height: 40px;
  padding: 0 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: 1px solid #111;
  border-radius: 4px;
  background: #fff;
  color: #111;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 500;
  text-transform: uppercase;
  cursor: pointer;

  &:hover { background: #f5f5f5; }
`;

export const SubmitButton = styled.button`
  min-width: 140px;
  height: 40px;
  padding: 0 22px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-sizing: border-box;
  border: none;
  border-radius: 4px;
  background: #3855bd;
  color: #fff;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s ease;

  svg { width: 14px; height: 14px; flex-shrink: 0; }

  &:hover:not(:disabled) { background: #3049a5; }
  &:disabled { background: #c8cdd6; cursor: not-allowed; }
`;

export const ErrorMessage = styled.span`
  display: block;
  margin-top: 6px;
  color: #dc2626;
  font-family: "Poppins", sans-serif;
  font-size: 11px;
  line-height: 15px;
`;