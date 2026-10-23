import React, { useEffect, useState } from "react";
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
  account_type: "current",
  account_number: "",
  iban: "",
  bank_type: "bank",
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

  useEffect(() => {
    if (!isOpen) {
      setForm(INITIAL_FORM);
    }
  }, [isOpen]);

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
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      bank_name: form.bank_name.trim(),
      account_holder_name: form.account_holder_name.trim(),
      account_number: form.account_number.trim(),
      iban: form.iban.trim(),
      branch: form.branch.trim(),
      opening_balance: String(form.opening_balance || "0.00"),
      note: form.note.trim(),
    };

    try {
      await onSubmit(payload);
    } catch {
      // The parent handles and displays API errors.
    }
  };

  return (
    <ModalOverlay onMouseDown={handleClose}>
      <ModalContainer
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-bank-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <ModalTitle id="add-bank-title">Add New Bank Account</ModalTitle>

        <ModalSubtitle>
          Add a financial account to your banking ledger.
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
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="Al Rajhi Bank">Al Rajhi Bank</option>
                <option value="Riyad Bank">Riyad Bank</option>
                <option value="Bank AlBilad">Bank AlBilad</option>
                <option value="Other">Other</option>
              </FormSelect>
            </FormField>

            <FormField>
              <label htmlFor="account_holder_name">ACCOUNT HOLDER NAME *</label>
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
                <option value="current">Current Account</option>
                <option value="savings">Savings Account</option>
              </FormSelect>
            </FormField>

            <FormField>
              <label htmlFor="account_number">ACCOUNT NUMBER *</label>
              <FormInput
                id="account_number"
                name="account_number"
                placeholder="Enter account number"
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
                placeholder="Enter IBAN"
                value={form.iban}
                onChange={updateField}
              />
            </FormField>

            <FormField>
              <label htmlFor="bank_type">BANK TYPE *</label>
              <FormSelect
                id="bank_type"
                name="bank_type"
                value={form.bank_type}
                onChange={updateField}
                required
              >
                <option value="bank">Bank</option>
              </FormSelect>
            </FormField>

            <FormField>
              <label htmlFor="branch">BRANCH</label>
              <FormInput
                id="branch"
                name="branch"
                placeholder="Name of the branch"
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
                placeholder="Add any note..."
                value={form.note}
                onChange={updateField}
                rows={2}
              />
            </FormField>
          </FormGrid>

          {error && (
            <ErrorMessage role="alert">
              {typeof error === "string"
                ? error
                : error?.detail || JSON.stringify(error)}
            </ErrorMessage>
          )}

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
