import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(15, 23, 42, 0.18);
`;

export const ModalContainer = styled.div`
  width: min(1180px, calc(100vw - 48px));
  max-height: calc(100vh - 40px);
  overflow-y: auto;

  background: #ffffff;
  border-radius: 4px;

  padding: 24px 22px 28px;

  box-shadow: 0 15px 45px rgba(15, 23, 42, 0.16);
`;

export const ModalHeader = styled.div`
  margin-bottom: 14px;
`;

export const Title = styled.h2`
  margin: 0;

  font-size: 17px;
  font-weight: 600;

  color: #3152b8;
`;

export const Subtitle = styled.p`
  margin: 3px 0 0;

  font-size: 12px;
  line-height: 18px;

  color: #777777;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  column-gap: 22px;
  row-gap: 16px;

  @media (max-width: 1000px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  min-width: 0;
`;

export const Label = styled.label`
  display: block;

  margin-bottom: 8px;

  font-size: 10px;
  font-weight: 500;

  color: #111111;

  text-transform: uppercase;

  span {
    color: #ef4444;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 35px;

  padding: 0 11px;

  border: 1px solid #e5e7eb;
  border-radius: 4px;

  outline: none;

  background: #ffffff;

  color: #777777;

  font-size: 11px;

  box-sizing: border-box;

  &:focus {
    border-color: #3152b8;
  }

  &::placeholder {
    color: #999999;
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 35px;

  padding: 0 11px;

  border: 1px solid #e5e7eb;
  border-radius: 4px;

  outline: none;

  background: #ffffff;

  color: #777777;

  font-size: 11px;

  box-sizing: border-box;

  &:focus {
    border-color: #3152b8;
  }
`;

export const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  margin-top: 16px;
`;

export const CancelButton = styled.button`
  height: 36px;

  padding: 0 18px;

  border: 1px solid #111111;
  border-radius: 3px;

  background: #ffffff;

  color: #111111;

  font-size: 11px;

  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const SaveButton = styled.button`
  height: 36px;

  padding: 0 18px;

  border: none;
  border-radius: 3px;

  background: #3152b8;

  color: #ffffff;

  font-size: 11px;

  cursor: pointer;

  display: inline-flex;
  align-items: center;
  gap: 7px;

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;