
import styled from "styled-components";

const ERROR_COLOR = "#dc2626";

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
  max-width: 1420px;

  background: #fff;
  border-radius: 4px;

  padding: 58px 25px 54px;

  box-sizing: border-box;

  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.12);

  max-height: 95vh;
  overflow-y: auto;

  @media (max-width: 1100px) {
    max-width: 95%;
  }

  @media (max-width: 900px) {
    padding: 35px 24px;
  }

  @media (max-width: 600px) {
    padding: 25px 18px;
  }
`;

export const Header = styled.div`
  margin-bottom: 27px;
`;

export const Title = styled.h2`
  margin: 0 0 10px;

  font-family: "Poppins", sans-serif;
  color: #111111;

  font-weight: 500;
  font-size: 18px;
  line-height: 100%;
`;

export const Subtitle = styled.p`
  margin: 0;

  color: #333;

  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 13px;
`;

export const Form = styled.form`
  display: grid;

  grid-template-columns: repeat(5, minmax(0, 1fr));

  column-gap: 25px;
  row-gap: 23px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    column-gap: 18px;
  }

  @media (max-width: 820px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 14px;
    row-gap: 16px;
  }

  @media (max-width: 540px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
`;

export const FormGroup = styled.div`
  min-width: 0;
`;

export const Label = styled.label`
  display: block;

  margin-bottom: 11px;

  color: #222;

  text-transform: uppercase;

  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 13px;
  line-height: 100%;
`;

export const RequiredStar = styled.span`
  color: ${ERROR_COLOR};
  margin-left: 4px;
  font-weight: 600;
`;

export const ErrorText = styled.span`
  display: block;
  margin-top: 4px;

  color: ${ERROR_COLOR};

  font-family: "Poppins", sans-serif;
  font-size: 12px;
`;

const fieldStyles = `
  width: 100%;
  height: 40px;

  padding: 0 12px;

  box-sizing: border-box;

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
`;

export const Input = styled.input`
  ${fieldStyles}

  border: 1px solid ${({ $hasError }) =>
    $hasError ? ERROR_COLOR : "#e1e1e1"};

  &:focus {
    border-color: ${({ $hasError }) =>
      $hasError ? ERROR_COLOR : "#3654b5"};
  }
`;

export const Select = styled.select`
  ${fieldStyles}

  border: 1px solid ${({ $hasError }) =>
    $hasError ? ERROR_COLOR : "#e1e1e1"};

  cursor: pointer;

  &:focus {
    border-color: ${({ $hasError }) =>
      $hasError ? ERROR_COLOR : "#3654b5"};
  }
`;

export const ButtonRow = styled.div`
  grid-column: 1 / -1;

  display: flex;
  align-items: center;
  flex-wrap: wrap;

  gap: 13px;

  margin-top: 1px;

  @media (max-width: 540px) {
    flex-direction: column-reverse;
    align-items: stretch;

    & > button {
      width: 100%;
      min-width: 0;
    }
  }
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
