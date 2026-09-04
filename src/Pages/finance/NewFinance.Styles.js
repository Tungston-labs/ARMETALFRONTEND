import styled from "styled-components";

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContainer = styled.div`
  width: 100%;
  max-width: 620px;
  /* background: #2b2b2b; */
  background: white;
  border-radius: 12px;
  overflow: hidden;
  /* border: 1px solid #3a3a3a; */
  color: #fff;
`;

export const ModalHeader = styled.div`
 background: #3352BA;
  padding: 16px 20px;

  display: flex;
  justify-content: space-between;
  align-items: center;

`;
export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
`;
export const ModalTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  font-family: Satoshi;
font-weight: 700;
font-style: Bold;
line-height: 100%;
letter-spacing: 0%;

`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

export const Form = styled.form`
  padding: 20px;
`;

export const FormRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  > div {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`;

export const Label = styled.label`
  font-size: 12px;
  color: #000;
  margin-bottom: 5px;
  display: block;

`;

export const Input = styled.input`
  width: 100%;
  padding: 9px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  /* background: #1f1f1f; */
  color: #000;
  font-size: 13px;

  &:focus {
    outline: none;
    border-color: #3f57b3;
  }
`;

export const TextArea = styled.textarea`
   width: 100%;
  padding: 9px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 13px;
  resize: vertical;
color: #000;
  &:focus {
    outline: none;
    border-color: #3f57b3;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

export const Button = styled.button`
  flex: 1;
  padding: 12px;
  margin: 0 5px;
  border-radius: 6px;
  border: none;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;

  ${({ variant }) =>
    variant === "cancel"
      ? `
        background: white;
        border: 1px solid black;
        color: black;
      `
      : `
        background: #3352BA;
        color: white;
      `}
`;

export const Select = styled.select`
    width: 100%;
  padding: 9px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;
  color: #000;
  font-size: 13px;

  &:focus {
    outline: none;
    border-color: #3f57b3;
  }
`;
