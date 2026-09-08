// Components/Table.Styles.js
import styled from "styled-components";

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
  font-weight: 500;
  font-size: 0.9rem;
  color: #172554;
  margin-bottom: 5px;
`;


export const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid lightgray;
  font-size: 0.95rem;
  &:focus {
    border-color: #4f46e5;
    outline: none;
  }
`;

// Select
export const Select = styled.select`
  padding: 8px;
  border-radius: 4px;
  background:white;
  border: 1px solid lightgray;
  font-size: 0.95rem;
  &:focus {
    border-color: #4f46e5;
    outline: none;
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
  font-family: "Poppins";
font-weight: 400;
font-style: Regular;
font-size: 16px;
line-height: 100%;
letter-spacing: 0%;
margin-bottom:15px;
`;