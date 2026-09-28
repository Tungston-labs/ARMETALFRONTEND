import React, { useState } from "react";
import { FiCalendar, FiChevronDown, FiSave } from "react-icons/fi";

import {
  Overlay,
  Modal,
  ModalHeader,
  Title,
  Description,
  Form,
  Field,
  Label,
  Required,
  InputWrapper,
  Input,
  SelectWrapper,
  Select,
  SelectIcon,
  DateInputWrapper,
  DateInput,
  CalendarIcon,
  AmountInputWrapper,
  AmountInput,
  Currency,
  NotesInput,
  ButtonContainer,
  CancelButton,
  SaveButton,
} from "./RecordPaymentModal.styles";

const RecordPaymentModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    invoiceNo: "",
    customer: "",
    invoiceAmount: "",
    outstandingAmount: "",
    paymentDate: "",
    paymentType: "Full Payment",
    paymentMethod: "Bank Transfer",
    amountReceived: "",
    referenceNumber: "",
    notes: "",
  });

  if (!isOpen) {
    return null;
  }

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
  };

  return (
    <Overlay>
      <Modal>
        <ModalHeader>
          <Title>Record Payment</Title>

          <Description>
            Monitor customer collections, track payment transactions, manage
            outstanding balances.
          </Description>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          {/* Row 1 */}

          <Field>
            <Label>
              Invoice No <Required>*</Required>
            </Label>

            <Input
              type="text"
              name="invoiceNo"
              value={formData.invoiceNo}
              onChange={handleChange}
              placeholder="CLT0012563"
            />
          </Field>

          <Field>
            <Label>
              Customer <Required>*</Required>
            </Label>

            <Input
              type="text"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              placeholder="Enter client name"
            />
          </Field>

          <Field>
            <Label>Invoice Amount (SAR)</Label>

            <AmountInputWrapper>
              <AmountInput
                type="number"
                name="invoiceAmount"
                value={formData.invoiceAmount}
                onChange={handleChange}
                placeholder="00.00"
              />

              <Currency>SAR</Currency>
            </AmountInputWrapper>
          </Field>

          <Field>
            <Label>Outstanding Amount (SAR)</Label>

            <AmountInputWrapper>
              <AmountInput
                type="number"
                name="outstandingAmount"
                value={formData.outstandingAmount}
                onChange={handleChange}
                placeholder="00.00"
              />

              <Currency>SAR</Currency>
            </AmountInputWrapper>
          </Field>

          <Field>
            <Label>
              Payment Date <Required>*</Required>
            </Label>

            <DateInputWrapper>
              <DateInput
                type="text"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                placeholder="dd-mm-yyyy"
                onFocus={(e) => {
                  e.target.type = "date";
                }}
                onBlur={(e) => {
                  if (!e.target.value) {
                    e.target.type = "text";
                  }
                }}
              />

              <CalendarIcon>
                <FiCalendar />
              </CalendarIcon>
            </DateInputWrapper>
          </Field>

          {/* Row 2 */}

          <Field>
            <Label>
              Payment Type <Required>*</Required>
            </Label>

            <SelectWrapper>
              <Select
                name="paymentType"
                value={formData.paymentType}
                onChange={handleChange}
              >
                <option value="Full Payment">Full Payment</option>
                <option value="Partial Payment">Partial Payment</option>
              </Select>

              <SelectIcon>
                <FiChevronDown />
              </SelectIcon>
            </SelectWrapper>
          </Field>

          <Field>
            <Label>
              Payment Method <Required>*</Required>
            </Label>

            <SelectWrapper>
              <Select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cash">Cash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cheque">Cheque</option>
              </Select>

              <SelectIcon>
                <FiChevronDown />
              </SelectIcon>
            </SelectWrapper>
          </Field>

          <Field>
            <Label>
              Amount Received <Required>*</Required>
            </Label>

            <AmountInputWrapper>
              <AmountInput
                type="number"
                name="amountReceived"
                value={formData.amountReceived}
                onChange={handleChange}
                placeholder="00.00"
              />

              <Currency>SAR</Currency>
            </AmountInputWrapper>
          </Field>

          <Field>
            <Label>Reference Number</Label>

            <Input
              type="text"
              name="referenceNumber"
              value={formData.referenceNumber}
              onChange={handleChange}
              placeholder="Enter Number"
            />
          </Field>

          <Field>
            <Label>Notes</Label>

            <NotesInput
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </Field>

          {/* Buttons */}

          <ButtonContainer>
            <CancelButton type="button" onClick={onClose}>
              CANCEL
            </CancelButton>

            <SaveButton type="submit">
              <FiSave />
              SAVE PAYMENT
            </SaveButton>
          </ButtonContainer>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default RecordPaymentModal;
