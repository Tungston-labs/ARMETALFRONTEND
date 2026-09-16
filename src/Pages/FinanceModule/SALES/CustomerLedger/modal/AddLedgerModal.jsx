import React, { useState } from "react";
import { FiCalendar, FiSave } from "react-icons/fi";

import {
  Overlay,
  ModalContainer,
  ModalHeader,
  Title,
  Subtitle,
  FormGroup,
  Label,
  InputWrapper,
  Input,
  DateInput,
  RadioSection,
  RadioOption,
  RadioLabel,
  RadioInput,
  ButtonSection,
  CancelButton,
  SaveButton,
} from "./AddLedgerModal.styles";

const AddLedgerModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    amount: "",
    date: "",
    reference: "",
    mode: "debit",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSave) {
      onSave(formData);
    }

    console.log("Ledger Data:", formData);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer>
        <ModalHeader>
          <Title>Add New Ledger</Title>
          <Subtitle>Record essential journal information.</Subtitle>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Amount</Label>

            <Input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
            />
          </FormGroup>

          <FormGroup>
            <Label>Date</Label>

            <InputWrapper>
              <DateInput
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />

              <FiCalendar />
            </InputWrapper>
          </FormGroup>

          <FormGroup>
            <Label>Reference</Label>

            <Input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
            />
          </FormGroup>

          <RadioSection>
            <Label>Mode</Label>

            <RadioOption>
              <RadioLabel>
                Debit

                <RadioInput
                  type="radio"
                  name="mode"
                  value="debit"
                  checked={formData.mode === "debit"}
                  onChange={handleChange}
                />
              </RadioLabel>

              <RadioLabel>
                Credit

                <RadioInput
                  type="radio"
                  name="mode"
                  value="credit"
                  checked={formData.mode === "credit"}
                  onChange={handleChange}
                />
              </RadioLabel>
            </RadioOption>
          </RadioSection>

          <ButtonSection>
            <CancelButton type="button" onClick={onClose}>
              CANCEL
            </CancelButton>

            <SaveButton type="submit">
              <FiSave />
              SAVE
            </SaveButton>
          </ButtonSection>
        </form>
      </ModalContainer>
    </Overlay>
  );
};

export default AddLedgerModal;