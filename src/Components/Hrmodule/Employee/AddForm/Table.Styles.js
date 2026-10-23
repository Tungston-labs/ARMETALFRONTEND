// Components/Table.Styles.js
import styled from "styled-components";
const CONTROL_HEIGHT = "40px";

// Main container
export const Container = styled.div`
  // padding: 20px;
  margin: 0 auto;
`;

// Header
export const Header = styled.div`
  margin-top: 15px;
 
`;


// Form Section wrapper
export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// Row wrapper
export const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

// Two columns layout
export const TwoColumnRows = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

// Form group
export const FormGroups = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

// Label
export const Label = styled.label`
   display: block;
  margin-bottom: 8px;
  color: #333;
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.2;

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

// Select
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

// Button Group
export const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

// Button
export const Button = styled.button`
  padding: 10px 20px;
  background-color: #304EB0;
  color: #fff;
  border-radius: 8px;
 border:1px solid #172554;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s ease;
  &:hover {
    background-color: #172554;
  }
`;

export const SectionTitle = styled.h2`
 margin: 0;
  color: #333;
  font-family: "Poppins", sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.2;
  margin-bottom: 15px;
`;

export const Hr = styled.hr`
  width: 100%;
  height: 0;
  margin: 4px 0;
  border: 0;
  border-top: 1px solid #e5e7eb;
`;
