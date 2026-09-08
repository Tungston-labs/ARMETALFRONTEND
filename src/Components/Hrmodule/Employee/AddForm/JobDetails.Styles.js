import styled from "styled-components";

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  margin: auto;
  // padding: 20px;
  margin-top: -10px;
`;

export const SectionTitle = styled.h2`
  color: #333;
font-family: "Poppins";
font-weight: 400;
font-style: Regular;
font-size: 16px;
line-height: 100%;
letter-spacing: 0%;

`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$columns || 5}, 1fr);
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const FullWidthGroup = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  font-weight: 500;
  margin-bottom: 6px;
  font-size: 14px;
  font-family: "Poppins";
  font-weight: 400;
  font-style: Regular;
  font-size: 14px;
  line-height: 100%;
  letter-spacing: 0%;

  ${(props) =>
    props.$required &&
    `
      &::after {
        content: " *";
        color: #ef4444;
      }
    `}
`;
export const Input = styled.input`
  padding: 8px;
  border: 1px solid lightgray;
  border-radius: 4px;
  font-size: 1rem;
  &:focus {
    border-color: #3352BA;
    outline: none;
    box-shadow: 0 0 0 2px rgba(99,102,241,0.2);
  }
`;

export const Select = styled.select`
  padding:7px;
  border: 1px solid lightgray;
  border-radius: 4px;
  font-size: 1rem;
  background: #fff;
  &:focus {
    border-color: #6366f1;
    outline: none;
    box-shadow: 0 0 0 2px rgba(99,102,241,0.2);
  }
`;

export const FileInputLabel = styled.label`
  padding:8px;
  border: 1px dashed #cbd5e1;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
  &:hover {
    border-color: #6366f1;
    color: #4f46e5;
  }
`;

export const FileInput = styled.input`
  display: none;
`;

export const ErrorText = styled.div`
  color: red;
 font-size: 0.85em;
  margin-top: 4px;
`;
export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center; 
  gap: 12px;
  margin-top: 20px;
`;
export const NextButton = styled.button`
  padding: 10px 20px;
  background-color: #304EB0;
  color: white;
  font-weight: 500;
  border:1px solid #172554;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #172554;
  }

  &:disabled {
    background-color: #172554;
    cursor: not-allowed;
  }
`;

export const LeaveContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
`;

export const TotalLeaveBox = styled.div`
  padding: 8px;
  border: 1px solid lightgray;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 10px;
  font-weight: 600;
  color: #172554;
background-color:white;  
`;

export const AddLeaveButton = styled.button`
  padding: 8px 12px;
  border: 1px dashed #304EB0;
  border-radius: 6px;
  background: transparent;
  color: #304EB0;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #304EB0;
    color: white;
  }
`;

export const LeaveGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const LeaveItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const LeaveLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #172554;
`;

export const LeaveInput = styled(Input)`
  width: 100%;
`;