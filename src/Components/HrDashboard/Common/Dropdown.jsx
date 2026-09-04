import React from "react";
import { FaChevronDown } from "react-icons/fa6";
import {
  DropdownButton,
  Label,
} from "./Dropdown.styles";

const Dropdown = ({ label, onClick }) => {
  return (
    <DropdownButton onClick={onClick}>
      <Label>{label}</Label>
      <FaChevronDown size={15} />
    </DropdownButton>
  );
};

export default Dropdown;