import styled from "styled-components";
import { FaArrowLeft } from "react-icons/fa6";

export const Container = styled.div`
  font-family: "poppins", sans-serif;
  padding: 20px;
`;



export const Select = styled.select`
  margin: 4px;
  width: 100%;
  min-width: 100px;
  padding: 6px 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: "Satoshi", sans-serif;
  font-weight: 300;
  font-style: "italic";
  font-size: 1rem;
  appearance: none;

  /* Only the selected value background */
  background-color: ${(props) => props.$bg || "white"};
  color: ${(props) => props.$color || "black"};

  /* Default dropdown arrow */
  background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;

  option {
    background: white !important;
    color: black !important;
  }

  @media (max-width: 768px) {
    width: 100%;
    font-size: 0.85rem;
    padding: 5px 14px 5px 8px;
    background-size: 12px;
  }
  
`;

