import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  background: rgba(0, 0, 0, 0.45);
`;

export const ModalContainer = styled.div`
  width: 100%;
  max-width: 450px;

  padding: 42px 24px 40px;

  background: #ffffff;
  border-radius: 6px;

  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.2);

  @media (max-width: 480px) {
    padding: 30px 18px;
  }
`;

export const ModalHeader = styled.div`
  margin-bottom: 15px;
`;

export const Title = styled.h2`
  margin: 0 0 6px;

  color: #262b33;
  font-size: 24px;
  font-weight: 600;
`;

export const Subtitle = styled.p`
  margin: 0;

  color: #454b54;
  font-size: 14px;
  font-weight: 400;
`;

export const FormGroup = styled.div`
  margin-bottom: 15px;
`;

export const Label = styled.label`
  display: block;

  margin-bottom: 8px;

  color: #30343a;
  font-size: 15px;
  font-weight: 400;
`;

export const Input = styled.input`
  width: 100%;
  height: 40px;

  padding: 0 12px;

  border: 1px solid #d6d9de;
  border-radius: 6px;

  outline: none;

  color: #2b2f35;
  font-size: 15px;

  box-sizing: border-box;

  &:focus {
    border-color: #385493;
  }
`;

export const InputWrapper = styled.div`
  position: relative;

  width: 100%;

  svg {
    position: absolute;
    top: 50%;
    right: 20px;

    transform: translateY(-50%);

    color: #30343a;
    font-size: 18px;

    pointer-events: none;
  }
`;

export const DateInput = styled.input`
  width: 100%;
  height: 40px;

  padding: 0 48px 0 12px;

  border: 1px solid #d6d9de;
  border-radius: 6px;

  outline: none;

  color: #2b2f35;
  font-size: 15px;

  box-sizing: border-box;

  &::-webkit-calendar-picker-indicator {
    opacity: 0;
    cursor: pointer;
  }

  &:focus {
    border-color: #385493;
  }
`;

export const RadioSection = styled.div`
  margin-top: 15px;
`;

export const RadioOption = styled.div`
  display: flex;
  align-items: center;

  gap: 55px;
`;

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;

  gap: 6px;

  color: #30343a;
  font-size: 14px;

  cursor: pointer;
`;

export const RadioInput = styled.input`
  width: 20px;
  height: 20px;

  margin: 0;

  accent-color: #3250B5;

  cursor: pointer;
`;

export const ButtonSection = styled.div`
  display: flex;
  justify-content: flex-end;

  gap: 10px;

  margin-top: 28px;
`;

export const CancelButton = styled.button`
  min-width: 85px;
  height: 42px;

  padding: 0 18px;

  background: #ffffff;

  border: 1px solid #3a3f46;
  border-radius: 4px;

  color: #30343a;

  font-size: 14px;
  font-weight: 500;

  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

export const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  gap: 8px;

  min-width: 95px;
  height: 42px;

  padding: 0 18px;

  background: #3250B5;

  border: none;
  border-radius: 4px;

  color: #ffffff;

  font-size: 14px;
  font-weight: 500;

  cursor: pointer;

  svg {
    font-size: 15px;
  }

  &:hover {
    opacity: 0.9;
  }
`;