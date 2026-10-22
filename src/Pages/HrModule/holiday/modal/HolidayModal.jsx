import React, { useEffect } from "react";
import { FiSave } from "react-icons/fi";

import {
  Overlay,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalSubtitle,
  FormGrid,
  FormGroup,
  Label,
  Required,
  Input,
  Select,
  ErrorMessage,
  ButtonRow,
  CancelButton,
  SubmitButton,
} from "./modal.styles";

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
  // Escape closes the modal (an onKeyDown on the overlay div never fires without focus)
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isOffDay = formData.type === "company_off_day";

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Add Holiday</ModalTitle>
          <ModalSubtitle>Create a new holiday or weekly off day</ModalSubtitle>
        </ModalHeader>

        <FormGrid>
          <FormGroup $full>
            <Label>
              Holiday Name <Required>*</Required>
            </Label>
            <Input
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
          </FormGroup>

          <FormGroup>
            <Label>
              Type <Required>*</Required>
            </Label>
            <Select name="type" value={formData.type} onChange={onChange}>
              <option value="">Select a type</option>
              {typeOptions.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </Select>
          </FormGroup>

          {isOffDay ? (
            <FormGroup>
              <Label>
                Weekly Off Day <Required>*</Required>
              </Label>
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
            </FormGroup>
          ) : (
            <FormGroup>
              <Label>
                Date <Required>*</Required>
              </Label>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={onChange}
              />
            </FormGroup>
          )}
        </FormGrid>

        {formError && <ErrorMessage>{formError}</ErrorMessage>}

        <ButtonRow>
          <CancelButton type="button" onClick={onClose}>
            Cancel
          </CancelButton>
          <SubmitButton type="button" onClick={onAdd}>
            <FiSave />
            Add Holiday
          </SubmitButton>
        </ButtonRow>
      </Modal>
    </Overlay>
  );
};

export default HolidayModal;