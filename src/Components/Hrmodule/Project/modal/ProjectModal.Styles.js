import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.25);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 9999;
`;

export const ModalContainer = styled.div`
  width: 96%;
  max-width: 1150px;

  background: #ffffff;

  border-radius: 4px;

  overflow: hidden;

  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
`;

export const ModalHeader = styled.div`
  height: 48px;

  background: #3857bc;

  display: flex;
  align-items: center;

  padding: 0 52px;
`;

export const ModalTitle = styled.h2`
  margin: 0;

  color: #ffffff;

  font-size: 15px;
  font-weight: 500;
`;

export const ModalBody = styled.div`
  padding: 36px 50px 48px;
`;

export const FormGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(4, 1fr);

  column-gap: 16px;
  row-gap: 20px;

  align-items: end;

  width: 100%;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;
export const FormGroup = styled.div`
  width: 100%;

  ${(props) =>
    props.$fullWidth &&
    `
      grid-column: span 3;
    `}
`;

export const Label = styled.label`
  display: block;

  margin-bottom: 7px;

  color: #202020;

  font-size: 14px;
  font-weight: 500;
`;

export const Required = styled.span`
  color: #f04444;

  margin-left: 2px;
`;

export const Input = styled.input`
  width: 100%;
  height: 35px;

  padding: 0 11px;

  box-sizing: border-box;

  border: 1px solid #e1e1e1;
  border-radius: 4px;

  background: #ffffff;

  color: #333333;

  font-size: 12px;

  outline: none;

  &::placeholder {
    color: #999999;
  }

  &:focus {
    border-color: #3857bc;
  }
`;

export const SelectWrapper = styled.div`
  position: relative;

  width: 100%;
`;

export const Select = styled.select`
  width: 100%;
  height: 35px;

  padding: 0 34px 0 11px;

  box-sizing: border-box;

  border: 1px solid #e1e1e1;
  border-radius: 4px;

  background: #ffffff;

  color: #777777;

  font-size: 12px;

  outline: none;

  appearance: none;

  cursor: pointer;

  &:focus {
    border-color: #3857bc;
  }
`;

export const SelectArrow = styled.span`
  position: absolute;

  right: 11px;
  top: 50%;

  transform: translateY(-55%);

  color: #444444;

  font-size: 16px;

  pointer-events: none;
`;

export const ButtonRow = styled.div`
  display: flex;

  gap: 10px;

  margin-top: 16px;
`;

export const CancelButton = styled.button`
  height: 32px;

  padding: 0 17px;

  border: none;
  border-radius: 4px;

  background: #3857bc;

  color: #ffffff;

  font-size: 10px;
  font-weight: 600;

  cursor: pointer;

  transition: 0.2s ease;

  &:hover {
    background: #2f4da9;
  }
`;

export const SubmitButton = styled.button`
  height: 32px;

  padding: 0 17px;

  border: none;
  border-radius: 4px;

  background: #e98227;

  color: #ffffff;

  font-size: 10px;
  font-weight: 600;

  cursor: pointer;

  transition: 0.2s ease;

  &:hover {
    background: #d9711c;
  }
`;

