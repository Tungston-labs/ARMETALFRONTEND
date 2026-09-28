import React, { useEffect, useState } from "react";
import { FiCalendar, FiSave } from "react-icons/fi";

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

const EMPTY_FORM = {
  customer: "",
  amount: "",
  date: "",
  reference: "",
  description: "",
  mode: "debit",
};

const AddNewLedger = ({
  isOpen,
  onClose,
  onSave,
  customerOptions = [],
  saving = false,
}) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  // Reset the form every time the modal closes (after save or cancel)
  useEffect(() => {
    if (!isOpen) {
      setFormData(EMPTY_FORM);
      setFormError("");
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.customer || !formData.amount || !formData.date) {
      setFormError("Customer, amount and date are required.");
      return;
    }

    if (Number(formData.amount) <= 0) {
      setFormError("Amount must be greater than zero.");
      return;
    }

    setFormError("");

    // Map the form fields to the exact keys the backend expects:
    // { customer, transaction_date, reference_number, description, mode, amount }
    const payload = {
      customer: Number(formData.customer),
      transaction_date: formData.date,
      reference_number: formData.reference,
      description: formData.description,
      mode: formData.mode,
      amount: Number(formData.amount).toFixed(2),
    };

    // The parent closes the modal only if the API call succeeds,
    // so on failure the form keeps what the user typed.
    if (onSave) {
      await onSave(payload);
    }
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
          {/* Customer */}
          <FormGroup>
            <Label htmlFor="customer">Customer</Label>

            <Input
              as="select"
              id="customer"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
            >
              <option value="">Select Customer</option>
              {customerOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Input>
          </FormGroup>

          {/* Amount */}
          <FormGroup>
            <Label htmlFor="amount">Amount</Label>

            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
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

          {/* Description */}
          <FormGroup>
            <Label htmlFor="description">Description</Label>

            <Input
              id="description"
              type="text"
              name="description"
              value={formData.description}
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

          {formError && (
            <div style={{ color: "#B00020", fontSize: 13 }}>{formError}</div>
          )}

          {/* Buttons */}
          <ButtonWrapper>
            <CancelButton type="button" onClick={onClose} disabled={saving}>
              CANCEL
            </CancelButton>

            <SaveButton type="submit" disabled={saving}>
              <FiSave />
              {saving ? "SAVING..." : "SAVE"}
            </SaveButton>
          </ButtonWrapper>
        </Form>
      </ModalContainer>
    </Overlay>
  );
};

export default AddNewLedger;