import React, { useState } from "react";
import { FiSave, FiX } from "react-icons/fi";

import {
  ModalOverlay,
  ModalContainer,
  ModalTitle,
  ModalSubtitle,
  BankForm,
  FormGrid,
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
  BalanceInputWrapper,
  BalanceCurrency,
  ModalActions,
  CancelButton,
  SubmitButton,
  ErrorMessage,
} from "./AddBankModal.styles";

const INITIAL_FORM = {
  bank_name: "",
  account_holder_name: "",
  account_type: "",
  account_number: "",
  iban: "",
  bank_type: "",
  branch: "",
  opening_balance: "0.00",
  note: "",
};

export default function AddBankModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  error = "",
}) {
  const [form, setForm] = useState(INITIAL_FORM);

  if (!isOpen) return null;

  const updateField = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleClose = () => {
    if (loading) return;

    setForm(INITIAL_FORM);
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      opening_balance: Number(form.opening_balance || 0),
    };

    await onSubmit(payload);
  };

  return (
    <ModalOverlay onMouseDown={handleClose}>
      <ModalContainer
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-bank-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <ModalTitle id="add-bank-title">
          Add New Bank Account
        </ModalTitle>

        <ModalSubtitle>
          Log a New financial movement into the primary ledger.
        </ModalSubtitle>

        <BankForm onSubmit={handleSubmit}>
          <FormGrid>
            <FormField>
              <label htmlFor="bank_name">BANK NAME *</label>
              <FormSelect
                id="bank_name"
                name="bank_name"
                value={form.bank_name}
                onChange={updateField}
                required
              >
                <option value="">SELECT BANK</option>
                <option value="Al Rajhi Bank">Al Rajhi Bank</option>
                <option value="Riyad Bank">Riyad Bank</option>
                <option value="Bank AlBilad">Bank AlBilad</option>
                <option value="Other">Other</option>
              </FormSelect>
            </FormField>

            <FormField>
              <label htmlFor="account_holder_name">
                ACCOUNT HOLDER NAME *
              </label>
              <FormInput
                id="account_holder_name"
                name="account_holder_name"
                placeholder="NAME ON THE ACCOUNT"
                value={form.account_holder_name}
                onChange={updateField}
                required
              />
            </FormField>

            <FormField>
              <label htmlFor="account_type">ACCOUNT TYPE *</label>
              <FormSelect
                id="account_type"
                name="account_type"
                value={form.account_type}
                onChange={updateField}
                required
              >
                <option value="">CURRENT / SAVINGS</option>
                <option value="Current Account">Current Account</option>
                <option value="Savings Account">Savings Account</option>
              </FormSelect>
            </FormField>

            <FormField>
              <label htmlFor="account_number">ACCOUNT NUMBER *</label>
              <FormInput
                id="account_number"
                name="account_number"
                placeholder="e.g. 1235847935855"
                value={form.account_number}
                onChange={updateField}
                required
              />
            </FormField>

            <FormField>
              <label htmlFor="iban">IBAN</label>
              <FormInput
                id="iban"
                name="iban"
                placeholder="ENTER NUMBER"
                value={form.iban}
                onChange={updateField}
              />
            </FormField>

            <FormField>
              <label htmlFor="bank_type">BANK TYPE</label>
              <FormSelect
                id="bank_type"
                name="bank_type"
                value={form.bank_type}
                onChange={updateField}
              >
                <option value="">CASH A/C OR PETTY CASH</option>
                <option value="Cash Account">Cash Account</option>
                <option value="Petty Cash">Petty Cash</option>
                <option value="Loan Account">Loan Account</option>
              </FormSelect>
            </FormField>

            <FormField>
              <label htmlFor="branch">BRANCH</label>
              <FormInput
                id="branch"
                name="branch"
                placeholder="NAME OF THE BRANCH"
                value={form.branch}
                onChange={updateField}
              />
            </FormField>

            <FormField>
              <label htmlFor="opening_balance">OPENING BALANCE *</label>
              <BalanceInputWrapper>
                <FormInput
                  id="opening_balance"
                  name="opening_balance"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.opening_balance}
                  onChange={updateField}
                  required
                />
                <BalanceCurrency>SAR</BalanceCurrency>
              </BalanceInputWrapper>
            </FormField>

            <FormField $span={2}>
              <label htmlFor="note">NOTE</label>
              <FormTextarea
                id="note"
                name="note"
                placeholder="ADD ANY NOTE...."
                value={form.note}
                onChange={updateField}
                rows={1}
              />
            </FormField>
          </FormGrid>

          {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

          <ModalActions>
            <CancelButton
              type="button"
              onClick={handleClose}
              disabled={loading}
            >
              <FiX /> CANCEL
            </CancelButton>

            <SubmitButton type="submit" disabled={loading}>
              <FiSave />
              {loading ? "SAVING..." : "ADD BANK"}
            </SubmitButton>
          </ModalActions>
        </BankForm>
      </ModalContainer>
    </ModalOverlay>
  );
}