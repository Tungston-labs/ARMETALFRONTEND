import React from "react";
import {
  Select,
  DateInput,
  DateWrapper,
  FieldWrapper,
  Label,
} from "../Holiday.styles";
import {
  Overlay,
  Panel,
  Header,
  ModalTitle,
  ModalSubtitle,
  CloseButton,
  Body,
  Footer,
  PrimaryButton,
  SecondaryButton,
} from "./modal.styles";
import styled from "styled-components";

// Local, modal-scoped input (full-width, stacked fields read better
// in a narrow modal than the multi-column FormSection layout did)
const FieldsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const ModalInput = styled.input`
  padding: 12px;
  border: 1px solid #d8dce3;
  border-radius: 8px;
  width: 100%;
  font-size: 0.9rem;
  background: #fff;
  transition: border-color 0.15s ease;

  &:focus {
    outline: none;
    border-color: #3352ba;
  }
`;

const InlineError = styled.p`
  color: #dc2626;
  font-size: 0.85rem;
  margin: -6px 0 0;
`;

const WEEK_DAYS = [
  { value: 0, label: "Monday" },
  { value: 1, label: "Tuesday" },
  { value: 2, label: "Wednesday" },
  { value: 3, label: "Thursday" },
  { value: 4, label: "Friday" },
  { value: 5, label: "Saturday" },
  { value: 6, label: "Sunday" },
];

const HolidayModal = ({
  isOpen,
  onClose,
  formData,
  onChange,
  onAdd,
  formError,
  typeOptions = [],
}) => {
  if (!isOpen) return null;

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <Overlay onClick={onClose} onKeyDown={handleKeyDown}>
      <Panel onClick={(e) => e.stopPropagation()} $maxWidth="480px">
        <Header>
          <div>
            <ModalTitle>Add Holiday</ModalTitle>
            <ModalSubtitle>Create a new holiday or weekly off day</ModalSubtitle>
          </div>
          <CloseButton onClick={onClose} aria-label="Close">
            ×
          </CloseButton>
        </Header>

        <Body>
          <FieldsColumn>
            <FieldWrapper>
              <Label>Holiday Name</Label>
              <ModalInput
                name="name"
                autoComplete="off"
                placeholder="e.g. Independence Day"
                value={formData.name}
                onChange={(e) =>
                  onChange({
                    target: { name: "name", value: e.target.value.slice(0, 250) },
                  })
                }
              />
            </FieldWrapper>

            <FieldWrapper>
              <Label>Type</Label>
              <Select name="type" value={formData.type} onChange={onChange}>
                <option value="">Select a type</option>
                {typeOptions.map(({ key, label }) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </Select>
            </FieldWrapper>

            {formData.type === "company_off_day" && (
              <FieldWrapper>
                <Label>Weekly Off Day</Label>
                <Select
                  name="off_day_weekday"
                  value={formData.off_day_weekday}
                  onChange={onChange}
                >
                  <option value="">Select day</option>
                  {WEEK_DAYS.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </Select>
              </FieldWrapper>
            )}

            {formData.type !== "company_off_day" && (
              <FieldWrapper>
                <Label>Date</Label>
                <DateWrapper>
                  <DateInput
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={onChange}
                  />
                </DateWrapper>
              </FieldWrapper>
            )}

            {formError && <InlineError>{formError}</InlineError>}
          </FieldsColumn>
        </Body>

        <Footer>
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton onClick={onAdd}>Add Holiday</PrimaryButton>
        </Footer>
      </Panel>
    </Overlay>
  );
};

export default HolidayModal;