import styled from "styled-components";

export const ModalOverlay = styled.div`
   position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(0, 0, 0, 0.25);

  padding: 20px;
`;

export const ModalContainer = styled.div`
width: 100%;
  max-width: 1420px;

  background: #fff;

  border-radius: 4px;

  padding: 28px 32px 24px;

  box-sizing: border-box;

  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.12);

  max-height: 95vh;
  overflow-y: auto;

  @media (max-width: 1100px) {
    max-width: 95%;
  }

  @media (max-width: 900px) {
    padding: 24px;
  }

  @media (max-width: 600px) {
    padding: 20px;
  }
`;

export const Header = styled.div`
  margin-bottom: 23px;
`;

export const Title = styled.h2`
  margin: 0 0 12px;
  font-size: 20px;
  color: #111;
  font-family: "Poppins";
font-weight: 500;
font-style: Medium;
line-height: 100%;
letter-spacing: 0%;

`;

export const Description = styled.p`
   color: #333;
   font-family: "Poppins", sans-serif;
font-weight: 400;
font-style: Regular;
font-size: 14px;
line-height: 100%;
letter-spacing: 0%;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));

  column-gap: 25px;
  row-gap: 20px;

  width: 100%;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 750px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled.div`
  width: 100%;
`;

export const Label = styled.label`
 display: block;
  margin-bottom: 10px;
  font-size: 10px;
  line-height: 1;
  font-weight: 500;
  color: #222;
  text-transform: uppercase;
    font-family: "Poppins", sans-serif;
font-weight: 400;
font-style: Regular;
font-size: 13px;
line-height: 100%;
letter-spacing: 0%;
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

export const Select = styled.select`
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

export const InputWithIcon = styled.div`
  position: relative;
  width: 100%;

  ${Input} {
    padding-right: 40px;
  }
`;

export const IconButton = styled.button`
  position: absolute;

  top: 50%;
  right: 10px;

  transform: translateY(-50%);

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  border: none;
  background: transparent;

  color: #111;

  cursor: pointer;
`;

export const AddressLabel = styled(Label)`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const PlusButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 17px;
  height: 17px;

  padding: 0;

  border: none;
  background: transparent;

  color: #111;

  cursor: pointer;
`;

export const SectionDivider = styled.div`
  width: calc(100% + 46px);
  height: 1px;

  margin: 36px -23px 27px;

  background: #e7e7e7;
`;

export const Section = styled.section`
  width: 100%;
`;

export const SectionTitle = styled.h3`
   margin: 0 0 12px;
  font-size: 20px;
  color: #111;
  font-family: "Poppins";
font-weight: 500;
font-style: Medium;
line-height: 100%;
letter-spacing: 0%;
`;

export const SectionDescription = styled.p`
  margin: 0 0 27px;

  font-size: 13px;
  color: #222;

  font-family: "Poppins";
font-weight: 400;
font-style: Regular;
font-size: 14px;
line-height: 100%;
letter-spacing: 0%;

`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 13px;

  margin-top: 17px;
`;

export const CancelButton = styled.button`
  height: 40px;

  padding: 0 14px;

  border: 1px solid #111;
  border-radius: 4px;

  background: #fff;

  color: #111;

  font-size: 13px;
  font-weight: 500;

  cursor: pointer;
`;

export const SaveButton = styled.button`
  min-width: 207px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  padding: 0 22px;

  border: none;
  border-radius: 4px;

  background: #3855bd;

  color: #fff;

  font-size: 13px;
  font-weight: 600;

  cursor: pointer;

  &:hover {
    background: #3049a5;
  }
`;