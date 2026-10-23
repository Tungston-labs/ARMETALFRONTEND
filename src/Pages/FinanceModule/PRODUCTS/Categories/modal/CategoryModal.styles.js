import styled from "styled-components";

export const ModalOverlay = styled.div`
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

export const ModalContainer = styled.div`
  /* width: calc(100% - 38px); */
  max-width: 1200px;
  min-height: 300px;
  background: #ffffff;
  border-radius: 4px;
  padding: 55px 25px 35px;
  box-sizing: border-box;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.12);
  position: relative;


  @media (max-width: 1200px) {
    width: calc(100% - 30px);
  }

  @media (max-width: 900px) {
    overflow-y: auto;
    max-height: 90vh;
  }
`;

export const ModalHeader = styled.div`
  margin-bottom: 24px;
`;

export const ModalTitle = styled.h2`
  margin: 0 0 12px;
  font-family: "Poppins", sans-serif;
  color: #111111;
font-weight: 500;
font-style: Medium;
font-size: 20px;
line-height: 100%;
letter-spacing: 0%;

`;

export const ModalSubtitle = styled.p`
  margin: 0;
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  color: #111111;
font-weight: 400;
font-style: Regular;
font-size: 14px;
line-height: 100%;
letter-spacing: 0%;

`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 25px;
  width: 100%;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  width: 100%;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #111111;
font-weight: 400;
font-style: Regular;
font-size: 14px;
line-height: 100%;
letter-spacing: 0%;
  text-transform: uppercase;
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
  font-family: "Poppins", sans-serif;
  font-size: 13px;
  color: #333333;
  transition: 0.2s ease;

  &::placeholder {
    color: #999999;
  }

  &:focus {
    border-color: #3654b5;
  }
`;

export const SelectWrapper = styled.div`
  position: relative;

  width: 100%;

  svg {
    position: absolute;

    right: 12px;
    top: 50%;

    transform: translateY(-50%);

    width: 17px;
    height: 17px;

    color: #111111;

    pointer-events: none;
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 41px;

  padding: 0 38px 0 12px;

  box-sizing: border-box;

  border: 1px solid #e1e1e1;

  border-radius: 4px;

  outline: none;

  appearance: none;

  background: #ffffff;

  font-family: "Poppins", sans-serif;

  font-size: 13px;

  color: #888888;

  cursor: pointer;

  &:focus {
    border-color: #3654b5;
  }

  option {
    color: #333333;
  }
`;

export const ButtonRow = styled.div`
  display: flex;

  align-items: center;

  gap: 13px;

  margin-top: 17px;
`;

export const CancelButton = styled.button`
  height: 40px;

  min-width: 86px;

  padding: 0 18px;

  background: #ffffff;

  border: 1px solid #111111;

  border-radius: 4px;

  font-family: "Poppins", sans-serif;

  font-size: 13px;
  font-weight: 500;

  color: #111111;

  cursor: pointer;

  transition: 0.2s ease;

  &:hover {
    background: #f5f5f5;
  }
`;

export const SaveButton = styled.button`
  height: 40px;

  min-width: 207px;

  padding: 0 25px;

  display: flex;

  align-items: center;
  justify-content: center;

  gap: 10px;

  background: #3857b9;

  border: none;

  border-radius: 4px;

  font-family: "Poppins", sans-serif;

  font-size: 13px;
  font-weight: 500;

  letter-spacing: 0.4px;

  color: #ffffff;

  cursor: pointer;

  transition: 0.2s ease;

  svg {
    width: 15px;
    height: 15px;
  }

  &:hover {
    background: #2e49a5;
  }
`;


export const ComboBoxWrapper = styled.div`
  position: relative;
  width: 100%;

  svg {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 17px;
    height: 17px;
    color: #111111;
    cursor: pointer;
  }
`;

export const ComboBoxInput = styled.input`
  width: 100%;
  height: 41px;

  padding: 0 38px 0 12px;

  box-sizing: border-box;

  border: 1px solid #e1e1e1;
  border-radius: 4px;

  outline: none;

  background: #ffffff;

  font-family: "Poppins", sans-serif;
  font-size: 13px;

  color: #333333;

  &::placeholder {
    color: #999999;
  }

  &:focus {
    border-color: #3857b9;
  }
`;

export const ComboBoxDropdown = styled.div`
  position: absolute;

  top: calc(100% + 4px);
  left: 0;
  right: 0;

  max-height: 180px;

  overflow-y: auto;

  background: #ffffff;

  border: 1px solid #e1e1e1;

  border-radius: 4px;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);

  z-index: 100;
`;

export const ComboBoxOption = styled.div`
  padding: 10px 12px;

  font-family: "Poppins", sans-serif;

  font-size: 13px;

  color: #333333;

  cursor: pointer;

  transition: background 0.15s ease;

  &:hover {
    background: #f2f5ff;
  }
`;

export const NoCategory = styled.div`
  padding: 10px 12px;

  font-family: "Poppins", sans-serif;

  font-size: 13px;

  color: #999999;
`;