import styled from "styled-components";

const CONTROL_HEIGHT = "40px";

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  margin: 0 auto;

`;

export const Hr = styled.hr`
  width: 100%;
  height: 0;
  margin: 4px 0;
  border: 0;
  border-top: 1px solid #e5e7eb;
`;

export const SectionTitle = styled.h2`
  margin: 0;
  color: #333;
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.2;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$columns || 5}, minmax(0, 1fr));
  gap: 16px 20px;
  align-items: start; /* keeps inputs aligned even when one field shows an error */

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr);
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
  display: block;
  margin-bottom: 8px;
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.2;
  color: #333;

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
  box-sizing: border-box;
  width: 100%;
  height: ${CONTROL_HEIGHT};
  padding: 0 10px;
  border: 1px solid lightgray;
  border-radius: 4px;
  font-size: 1rem;
  background: #fff;

  &:focus {
    border-color: #3352ba;
    outline: none;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
`;

export const Select = styled.select`
  box-sizing: border-box;
  width: 100%;
  height: ${CONTROL_HEIGHT};
  padding: 0 10px;
  border: 1px solid lightgray;
  border-radius: 4px;
  font-size: 1rem;
  background: #fff;

  /* Gray placeholder when no option is selected */
  color: ${(props) => (props.value ? "#333333" : "#9ca3af")};

  &:focus {
    border-color: #3352ba;
    outline: none;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }

  option {
    color: #333333;
  }

  option[value=""] {
    color: #9ca3af;
  }
`;

export const FileInputLabel = styled.label`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${CONTROL_HEIGHT};
  padding: 0 10px;
  border: 1px dashed #cbd5e1;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  color: #6b7280;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
  margin-top: 4px;
  color: red;
  font-size: 0.85em;
  line-height: 1.3;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
`;

export const NextButton = styled.button`
  padding: 10px 20px;
  background-color: #304eb0;
  color: white;
  font-weight: 500;
  border: 1px solid #172554;
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
  box-sizing: border-box;
  display: flex;
  align-items: center;
  height: ${CONTROL_HEIGHT};
  padding: 0 10px;
  margin-bottom: 12px;
  border: 1px solid lightgray;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  color: #172554;
  background-color: white;
`;

export const AddLeaveButton = styled.button`
  padding: 8px 12px;
  border: 1px dashed #304eb0;
  border-radius: 6px;
  background: transparent;
  color: #304eb0;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #304eb0;
    color: white;
  }
`;

export const LeaveGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 16px 20px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const LeaveItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

export const LeaveLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  color: #172554;
`;

export const LeaveInput = styled(Input)`
  width: 100%;
`;