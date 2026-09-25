import React, { useState } from "react";
import { FiCalendar, FiSave, FiX } from "react-icons/fi";

import {
  Overlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  Form,
  FormGroup,
  Label,
  InputWrapper,
  Input,
  CalendarIcon,
  ModeWrapper,
  ModeOption,
  RadioInput,
  ModeLabel,
  ButtonWrapper,
  CancelButton,
  SaveButton,
} from "./AddNewLedger.styles";

const AddNewLedger = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    amount: "",
    date: "",
    reference: "",
    mode: "debit",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.date) {
      return;
    }

    if (onSave) {
      onSave(formData);
    }

    setFormData({
      amount: "",
      date: "",
      reference: "",
      mode: "debit",
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Add New Ledger</ModalTitle>

          <ModalDescription>
            Record essential journal information.
          </ModalDescription>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          {/* Amount */}
          <FormGroup>
            <Label htmlFor="amount">Amount</Label>

            <Input
              id="amount"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
            />
          </FormGroup>

          {/* Date */}
          <FormGroup>
            <Label htmlFor="date">Date</Label>

            <InputWrapper>
              <Input
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />

              <CalendarIcon>
                <FiCalendar />
              </CalendarIcon>
            </InputWrapper>
          </FormGroup>

          {/* Reference */}
          <FormGroup>
            <Label htmlFor="reference">Reference</Label>

            <Input
              id="reference"
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
            />
          </FormGroup>

          {/* Mode */}
          <FormGroup>
            <Label>Mode</Label>

            <ModeWrapper>
              <ModeOption>
                <RadioInput
                  type="radio"
                  name="mode"
                  value="debit"
                  checked={formData.mode === "debit"}
                  onChange={handleChange}
                />

                <ModeLabel>Debit</ModeLabel>
              </ModeOption>

              <ModeOption>
                <RadioInput
                  type="radio"
                  name="mode"
                  value="credit"
                  checked={formData.mode === "credit"}
                  onChange={handleChange}
                />

                <ModeLabel>Credit</ModeLabel>
              </ModeOption>
            </ModeWrapper>
          </FormGroup>

          {/* Buttons */}
          <ButtonWrapper>
            <CancelButton
              type="button"
              onClick={onClose}
            >
              CANCEL
            </CancelButton>

            <SaveButton type="submit">
              <FiSave />
              SAVE
            </SaveButton>
          </ButtonWrapper>
        </Form>
      </ModalContainer>
    </Overlay>
  );
};

export default AddNewLedger;