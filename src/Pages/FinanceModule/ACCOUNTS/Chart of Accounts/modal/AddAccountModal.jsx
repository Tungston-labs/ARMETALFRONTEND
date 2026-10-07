import React, { useState } from "react";
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
  ButtonGroup,
  CancelButton,
  SaveButton,
} from "./AddAccountModal.styles";

import { FiSave } from "react-icons/fi";

const AddAccountModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    accountType: "ASSET",
    accountName: "",
    accountCode: "",
    parentAccount: "CURRENT ASSETS",
    category: "CURRENT ASSETS",
    openingBalance: "0.00",
    debitCredit: "DEBIT",
    status: "ACTIVE",
    description: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Account Data:", formData);

    // Add API call here

    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(event) => event.stopPropagation()}>
        <Form onSubmit={handleSubmit}>
          <SectionTitle>Add New Account</SectionTitle>

          <SectionDescription>
            Record essential journal information to ensure accurate
            accounting, reporting, and audit compliance.
          </SectionDescription>

          <FormGrid>
            {/* ACCOUNT TYPE */}
            <FormGroup>
              <Label>
                ACCOUNT TYPE <span style={{ color: "#e03131" }}>*</span>
              </Label>

              <Select
                name="accountType"
                value={formData.accountType}
                onChange={handleChange}
              >
                <option value="ASSET">ASSET</option>
                <option value="LIABILITY">LIABILITY</option>
                <option value="EQUITY">EQUITY</option>
                <option value="INCOME">INCOME</option>
                <option value="EXPENSE">EXPENSE</option>
              </Select>
            </FormGroup>

            {/* ACCOUNT NAME */}
            <FormGroup>
              <Label>
                ACCOUNT NAME <span style={{ color: "#e03131" }}>*</span>
              </Label>

              <Input
                type="text"
                name="accountName"
                value={formData.accountName}
                onChange={handleChange}
                placeholder="EG: PETTY CASH"
              />
            </FormGroup>

            {/* ACCOUNT CODE */}
            <FormGroup>
              <Label>ACCOUNT CODE</Label>

              <Input
                type="text"
                name="accountCode"
                value={formData.accountCode}
                onChange={handleChange}
                placeholder="SAR 4,200.00"
              />
            </FormGroup>

            {/* PARENT ACCOUNT */}
            <FormGroup>
              <Label>PARENT ACCOUNT</Label>

              <Select
                name="parentAccount"
                value={formData.parentAccount}
                onChange={handleChange}
              >
                <option value="CURRENT ASSETS">
                  CURRENT ASSETS
                </option>

                <option value="FIXED ASSETS">
                  FIXED ASSETS
                </option>

                <option value="CURRENT LIABILITIES">
                  CURRENT LIABILITIES
                </option>

                <option value="LONG TERM LIABILITIES">
                  LONG TERM LIABILITIES
                </option>

                <option value="EQUITY">EQUITY</option>
              </Select>
            </FormGroup>

            {/* CATEGORY */}
            <FormGroup>
              <Label>
                CATEGORY <span style={{ color: "#e03131" }}>*</span>
              </Label>

              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="CURRENT ASSETS">
                  CURRENT ASSETS
                </option>

                <option value="FIXED ASSETS">
                  FIXED ASSETS
                </option>

                <option value="CURRENT LIABILITIES">
                  CURRENT LIABILITIES
                </option>

                <option value="EQUITY">EQUITY</option>

                <option value="INCOME">INCOME</option>

                <option value="EXPENSE">EXPENSE</option>
              </Select>
            </FormGroup>

            {/* OPENING BALANCE */}
            <FormGroup>
              <Label>OPENING BALANCE (SAR)</Label>

              <Input
                type="number"
                name="openingBalance"
                value={formData.openingBalance}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
              />
            </FormGroup>

            {/* DEBIT / CREDIT */}
            <FormGroup>
              <Label>
                DEBIT/CREDIT <span style={{ color: "#e03131" }}>*</span>
              </Label>

              <Select
                name="debitCredit"
                value={formData.debitCredit}
                onChange={handleChange}
              >
                <option value="DEBIT">DEBIT</option>
                <option value="CREDIT">CREDIT</option>
              </Select>
            </FormGroup>

            {/* STATUS */}
            <FormGroup>
              <Label>STATUS</Label>

              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </Select>
            </FormGroup>

            {/* DESCRIPTION */}
            <FormGroup>
              <Label>DESCRIPTION</Label>

              <Input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="WHAT THIS A/C IS USED FOR (OPT)"
                autoComplete="off"
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
              <FiSave />
              <span>SAVE ACCOUNT</span>
            </SaveButton>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddAccountModal;