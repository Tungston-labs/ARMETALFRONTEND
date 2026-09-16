import styled from "styled-components";

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 15px;

  background: rgba(0, 0, 0, 0.35);

  overflow-y: auto;
`;

export const ModalContainer = styled.div`
  width: 100%;
  max-width: 1205px;
  max-height: calc(100vh - 30px);

  padding: 48px 22px 46px;

  box-sizing: border-box;

  background: #ffffff;

  border-radius: 4px;

  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.15);

  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

export const Header = styled.div`
  margin-bottom: 22px;
`;

export const Title = styled.h2`
  margin: 0 0 5px;

  font-family: "Poppins", sans-serif;
  font-size: 17px;
  font-weight: 600;

  line-height: 1.4;

  color: #111111;
`;

export const Description = styled.p`
  margin: 0;

  font-family: "Poppins", sans-serif;
  font-size: 11px;
  font-weight: 400;

  line-height: 1.5;

  color: #111111;
`;

export const Form = styled.form`
  width: 100%;
`;

export const FormGrid = styled.div`
  display: grid;

  grid-template-columns: repeat(5, minmax(0, 1fr));

  column-gap: 22px;
  row-gap: 17px;

  width: 100%;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;

  min-width: 0;
`;

export const Label = styled.label`
  margin-bottom: 8px;

  font-family: "Poppins", sans-serif;
  font-size: 11px;
  font-weight: 500;

  line-height: 1.2;

  color: #111111;
`;

const fieldStyles = `
  width: 100%;
  height: 35px;

  box-sizing: border-box;

  padding: 0 11px;

  border: 1px solid #e4e4e4;
  border-radius: 4px;

  outline: none;

  background: #ffffff;

  font-family: "Poppins", sans-serif;
  font-size: 11px;

  color: #333333;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::placeholder {
    color: #888888;
  }

  &:focus {
    border-color: #3454b9;

    box-shadow:
      0 0 0 2px rgba(52, 84, 185, 0.08);
  }
`;

export const Input = styled.input`
  ${fieldStyles}
`;

export const Select = styled.select`
  ${fieldStyles}

  cursor: pointer;

  appearance: auto;

  color: ${({ value }) =>
    value ? "#333333" : "#888888"};

  option {
    color: #333333;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;

  gap: 12px;

  margin-top: 21px;
`;

export const CancelButton = styled.button`
  height: 36px;

  padding: 0 15px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #222222;
  border-radius: 3px;

  background: #ffffff;

  font-family: "Poppins", sans-serif;
  font-size: 11px;
  font-weight: 500;

  color: #111111;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    background: #111111;
    color: #ffffff;
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const SaveButton = styled.button`
  height: 36px;

  padding: 0 24px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 7px;

  border: none;
  border-radius: 3px;

  background: #3454b9;

  font-family: "Poppins", sans-serif;
  font-size: 11px;
  font-weight: 500;

  color: #ffffff;

  cursor: pointer;

  transition: all 0.2s ease;

  &:hover {
    background: #2947a5;
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;