import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(0, 0, 0, 0.35);
`;

export const ModalContainer = styled.div`
  width: 100%;
  max-width: 480px;

  background: #ffffff;
  border-radius: 5px;

  padding: 42px 24px 28px;

  box-sizing: border-box;

  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
`;

export const ModalHeader = styled.div`
  margin-bottom: 20px;
`;

export const ModalTitle = styled.h2`
  margin: 0;

  font-family: "Open Sans", sans-serif;
  font-size: 21px;
  font-weight: 600;
  line-height: 28px;

  color: #111111;
`;

export const ModalDescription = styled.p`
  margin: 8px 0 0;

  font-family: "Open Sans", sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;

  color: #222222;
`;

export const Form = styled.form`
  width: 100%;
`;

export const FormGroup = styled.div`
  width: 100%;
  margin-bottom: 13px;
`;

export const Label = styled.label`
  display: block;

  margin-bottom: 8px;

  font-family: "Open Sans", sans-serif;
  font-size: 14px;
  font-weight: 400;

  color: #171717;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const Input = styled.input`
  width: 100%;
  height: 40px;

  padding: 0 12px;

  box-sizing: border-box;

  border: 1px solid #dedede;
  border-radius: 5px;

  outline: none;

  font-family: "Open Sans", sans-serif;
  font-size: 14px;

  color: #222222;
  background: #ffffff;

  &:focus {
    border-color: #3957c8;
  }

  &::-webkit-calendar-picker-indicator {
    opacity: 0;
    cursor: pointer;
  }
`;

export const CalendarIcon = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;

  transform: translateY(-50%);

  display: flex;
  align-items: center;

  font-size: 17px;
  color: #222222;

  pointer-events: none;
`;

export const ModeWrapper = styled.div`
  display: flex;
  align-items: center;

  gap: 48px;

  margin-top: 2px;
`;

export const ModeOption = styled.label`
  display: flex;
  align-items: center;

  gap: 7px;

  cursor: pointer;
`;

export const RadioInput = styled.input`
  width: 18px;
  height: 18px;

  margin: 0;

  accent-color: #3154c9;

  cursor: pointer;
`;

export const ModeLabel = styled.span`
  font-family: "Open Sans", sans-serif;
  font-size: 14px;
  font-weight: 400;

  color: #222222;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  gap: 9px;

  margin-top: 28px;
`;

export const CancelButton = styled.button`
  width: 86px;
  height: 40px;

  border: 1px solid #222222;
  border-radius: 5px;

  background: #ffffff;

  font-family: "Open Sans", sans-serif;
  font-size: 14px;
  font-weight: 400;

  color: #111111;

  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

export const SaveButton = styled.button`
  width: 94px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 9px;

  border: none;
  border-radius: 5px;

  background: #3855c7;

  font-family: "Open Sans", sans-serif;
  font-size: 14px;
  font-weight: 500;

  color: #ffffff;

  cursor: pointer;

  svg {
    font-size: 15px;
  }

  &:hover {
    background: #2f49b2;
  }
`;

