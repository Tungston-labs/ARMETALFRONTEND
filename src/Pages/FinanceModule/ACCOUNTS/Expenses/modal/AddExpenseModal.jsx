import React, { useState } from "react";
import { FiSave, FiUpload } from "react-icons/fi";

import {
  ModalOverlay,
  ModalContainer,
  Form,
  SectionTitle,
  SectionDescription,
  FormGrid,
  FormGroup,
  Label,
  Input,
  Select,
  TextArea,
  UploadWrapper,
  UploadLabel,
  HiddenFileInput,
  ButtonGroup,
  CancelButton,
  SaveButton,
} from "./AddExpenseModal.styles";

const AddExpenseModal = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    expenseDate: "",
    expenseCategory: "",
    referenceNo: "",
    payeeType: "",
    vendorEmployee: "",
    department: "",
    amount: "",
    paymentMethod: "",
    receipt: null,
    description: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      receipt: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit?.(formData);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Form onSubmit={handleSubmit}>

          <SectionTitle>
            Add Expense
          </SectionTitle>

          <SectionDescription>
            Enter the details of the expense.
          </SectionDescription>

          <FormGrid>

            {/* Expense Date */}
            <FormGroup>
              <Label>
                Expense Date <span style={{ color: "#e03131" }}>*</span>
              </Label>

              <Input
                type="date"
                name="expenseDate"
                value={formData.expenseDate}
                onChange={handleChange}
              />
            </FormGroup>

            {/* Expense Category */}
            <FormGroup>
              <Label>
                Expense Category <span style={{ color: "#e03131" }}>*</span>
              </Label>

              <Select
                name="expenseCategory"
                value={formData.expenseCategory}
                onChange={handleChange}
              >
                <option value="">
                  Select Customer
                </option>
                <option value="travel">
                  Travel
                </option>
                <option value="office">
                  Office Expense
                </option>
                <option value="utilities">
                  Utilities
                </option>
                <option value="salary">
                  Salary
                </option>
              </Select>
            </FormGroup>

            {/* Reference */}
            <FormGroup>
              <Label>
                Reference No
              </Label>

              <Input
                type="text"
                name="referenceNo"
                placeholder="Enter Reference Number"
                value={formData.referenceNo}
                onChange={handleChange}
              />
            </FormGroup>

            {/* Payee Type */}
            <FormGroup>
              <Label>
                Payee Type <span style={{ color: "#e03131" }}>*</span>
              </Label>

              <Select
                name="payeeType"
                value={formData.payeeType}
                onChange={handleChange}
              >
                <option value="">
                  Vendor / Employee
                </option>
                <option value="vendor">
                  Vendor
                </option>
                <option value="employee">
                  Employee
                </option>
              </Select>
            </FormGroup>

            {/* Vendor / Employee */}
            <FormGroup>
              <Label>
                Vendor / Employee
              </Label>

              <Input
                type="text"
                name="vendorEmployee"
                placeholder="----"
                value={formData.vendorEmployee}
                onChange={handleChange}
              />
            </FormGroup>

            {/* Department */}
            <FormGroup>
              <Label>
                Department
              </Label>

              <Select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">
                  Select Department
                </option>
                <option value="finance">
                  Finance
                </option>
                <option value="hr">
                  HR
                </option>
                <option value="sales">
                  Sales
                </option>
                <option value="operations">
                  Operations
                </option>
              </Select>
            </FormGroup>

            {/* Amount */}
            <FormGroup>
              <Label>
                Amount
              </Label>

              <Input
                type="number"
                name="amount"
                placeholder="00.00 SAR"
                value={formData.amount}
                onChange={handleChange}
              />
            </FormGroup>

            {/* Payment Method */}
            <FormGroup>
              <Label>
                Payment Method
              </Label>

              <Select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
              >
                <option value="">
                  Select Method
                </option>
                <option value="cash">
                  Cash
                </option>
                <option value="bank_transfer">
                  Bank Transfer
                </option>
                <option value="card">
                  Card
                </option>
                <option value="cheque">
                  Cheque
                </option>
              </Select>
            </FormGroup>

            {/* Receipt */}
            <FormGroup>
              <Label>
                Receipt/Document
              </Label>

              <UploadWrapper>
                <UploadLabel htmlFor="expense-receipt">
                  <span>
                    {formData.receipt
                      ? formData.receipt.name
                      : ""}
                  </span>

                  <span>
                    <FiUpload />
                  </span>
                </UploadLabel>

                <HiddenFileInput
                  id="expense-receipt"
                  type="file"
                  onChange={handleFileChange}
                />
              </UploadWrapper>
            </FormGroup>

            {/* Description */}
            <FormGroup>
              <Label>
                Description
              </Label>

              <TextArea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </FormGroup>

          </FormGrid>

          <ButtonGroup>

            <CancelButton
              type="button"
              onClick={onClose}
            >
              CANCEL
            </CancelButton>

            <SaveButton type="submit">
              <span>
                <FiSave />
              </span>

              SUBMIT EXPENSE
            </SaveButton>

          </ButtonGroup>

        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddExpenseModal;