import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  UploadWrapper,
  UploadLabel,
  HiddenFileInput,
  ButtonGroup,
  CancelButton,
  SaveButton,
} from "./AddExpenseModal.styles";

// NOTE: adjust this path to where your slice lives (same file the page imports)
import { getActiveBankAccounts } from "../../../../../Redux/finance/accounts/Expenseslice";

// Values match Expense.CATEGORY_CHOICES / PAYMENT_METHOD_CHOICES in the backend
export const EXPENSE_CATEGORIES = [
  { label: "Rent", value: "rent" },
  { label: "Utilities", value: "utilities" },
  { label: "Salary and Wages", value: "salary_wages" },
  { label: "Marketing", value: "marketing" },
  { label: "Others", value: "others" },
];

export const PAYMENT_METHODS = [
  { label: "Bank Transfer", value: "bank_transfer" },
  { label: "Cash", value: "cash" },
  { label: "Card", value: "card" },
  { label: "Cheque", value: "cheque" },
  { label: "Other", value: "other" },
];

const STATUS_OPTIONS = [
  { label: "Paid", value: "paid" },
  { label: "Unpaid", value: "unpaid" },
];

// Same limits as the backend (validate_document)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"];

const initialForm = {
  expenseDate: "",
  category: "",
  paidTo: "",
  paidMethod: "bank_transfer",
  paidFromAccountId: "",
  amount: "",
  receipt: null,
  status: "paid",
  description: "",
};

const requiredMark = <span style={{ color: "#e03131" }}> *</span>;

// The backend returns bank_name for the account; adjust if your accounts API differs
const getAccountLabel = (account) => {
  const name =
    account.bank_name ||
    account.account_name ||
    account.name ||
    `Account ${account.id}`;
  const number = account.account_number
    ? ` (${String(account.account_number).slice(-4)})`
    : "";

  return `${name}${number}`;
};

// Turns a DRF error ({ field: ["msg"] } | { detail } | string) into one message
const getErrorText = (err) => {
  if (!err) return "Failed to save expense";
  if (typeof err === "string") return err;
  if (err.detail) return err.detail;

  const parts = Object.entries(err).map(([field, msg]) => {
    const text = Array.isArray(msg) ? msg.join(" ") : String(msg);
    return field === "non_field_errors" ? text : text;
  });

  return parts.join(" | ") || "Failed to save expense";
};

const AddExpenseModal = ({ isOpen, onClose, onSubmit, nextExpenseId }) => {
  const dispatch = useDispatch();

  const bankAccounts = useSelector((state) => state.expense?.bankAccounts) || [];
  const bankAccountsLoading = useSelector(
    (state) => state.expense?.bankAccountsLoading
  );

  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Reset the form and load the bank accounts each time the modal opens
  useEffect(() => {
    if (!isOpen) return;

    setFormData(initialForm);
    setFormError("");
    setSubmitting(false);
    dispatch(getActiveBankAccounts());
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  // Cash comes out of cash on hand, so no bank account is needed
  const isCash = formData.paidMethod === "cash";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // switching to cash clears any selected bank account
      ...(name === "paidMethod" && value === "cash"
        ? { paidFromAccountId: "" }
        : {}),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0] || null;

    if (file) {
      const name = file.name.toLowerCase();
      const okType = ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext));

      if (!okType) {
        setFormError("Upload a PDF, JPG, JPEG, PNG, DOC, or DOCX file.");
        e.target.value = "";
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setFormError("Document size cannot exceed 5 MB.");
        e.target.value = "";
        return;
      }
    }

    setFormError("");
    setFormData((prev) => ({ ...prev, receipt: file }));
  };

  const validate = () => {
    if (!formData.expenseDate) return "Expense date is required";
    if (!formData.category) return "Expense category is required";
    if (!formData.paidTo.trim()) return "Paid to is required";
    if (!formData.paidMethod) return "Payment method is required";
    if (!isCash && !formData.paidFromAccountId)
      return "Paid from account is required";
    if (!formData.amount || Number(formData.amount) <= 0)
      return "Enter an amount greater than 0";
    return "";
  };

  // Builds the API payload (field names match POST /finance/expenses/)
  const buildPayload = () => {
    const payload = {
      expense_date: formData.expenseDate,
      category: formData.category,
      paid_to: formData.paidTo.trim(),
      paid_method: formData.paidMethod,
      amount: Number(formData.amount).toFixed(2),
      status: formData.status,
      description: formData.description.trim(),
    };

    // Only sent for non-cash payments
    if (!isCash) {
      payload.paid_from_account_id = Number(formData.paidFromAccountId);
    }

    // A document needs multipart/form-data. The backend field is "document".
    if (formData.receipt) {
      const body = new FormData();
      Object.entries(payload).forEach(([key, value]) => body.append(key, value));
      body.append("document", formData.receipt);
      return body;
    }

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const message = validate();
    if (message) {
      setFormError(message);
      return;
    }

    setFormError("");
    setSubmitting(true);

    try {
      // The page's handler throws on failure, so the modal stays open
      await onSubmit?.(buildPayload());
    } catch (err) {
      setFormError(getErrorText(err));
      setSubmitting(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Form onSubmit={handleSubmit}>
          <SectionTitle>Add Expense</SectionTitle>

          <SectionDescription>
            Enter the details of the expense.
          </SectionDescription>

          <FormGrid>
            {/* Expense ID (generated by the backend after saving) */}
            <FormGroup>
              <Label>Expense ID</Label>

              <Input
                type="text"
                value={nextExpenseId || "Auto-generated"}
                readOnly
                disabled
              />
            </FormGroup>

            {/* Expense Date */}
            <FormGroup>
              <Label>Expense Date{requiredMark}</Label>

              <Input
                type="date"
                name="expenseDate"
                value={formData.expenseDate}
                onChange={handleChange}
              />
            </FormGroup>

            {/* Expense Category */}
            <FormGroup>
              <Label>Expense Category{requiredMark}</Label>

              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            {/* Paid To */}
            <FormGroup>
              <Label>Paid to{requiredMark}</Label>

              <Input
                type="text"
                name="paidTo"
                placeholder="e.g. Al Fisal Properties"
                value={formData.paidTo}
                onChange={handleChange}
              />
            </FormGroup>

            {/* Payment Method */}
            <FormGroup>
              <Label>Payment method{requiredMark}</Label>

              <Select
                name="paidMethod"
                value={formData.paidMethod}
                onChange={handleChange}
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            {/* Paid From Account (not needed for cash) */}
            <FormGroup>
              <Label>Paid from account{!isCash && requiredMark}</Label>

              <Select
                name="paidFromAccountId"
                value={formData.paidFromAccountId}
                onChange={handleChange}
                disabled={isCash || bankAccountsLoading}
              >
                <option value="">
                  {isCash
                    ? "Not required for cash"
                    : bankAccountsLoading
                    ? "Loading accounts..."
                    : "Select account"}
                </option>
                {bankAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {getAccountLabel(account)}
                  </option>
                ))}
              </Select>
            </FormGroup>

            {/* Amount */}
            <FormGroup>
              <Label>Amount{requiredMark}</Label>

              <div style={{ position: "relative" }}>
                <Input
                  type="number"
                  name="amount"
                  min="0"
                  step="0.01"
                  placeholder="00.00"
                  value={formData.amount}
                  onChange={handleChange}
                  style={{ paddingRight: 52 }}
                />
                <span
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 13,
                    color: "#6b7280",
                    pointerEvents: "none",
                  }}
                >
                  SAR
                </span>
              </div>
            </FormGroup>

            {/* Receipt / Document */}
            <FormGroup>
              <Label>Receipt/Document</Label>

              <UploadWrapper>
                <UploadLabel htmlFor="expense-receipt">
                  <span>{formData.receipt ? formData.receipt.name : ""}</span>

                  <span>
                    <FiUpload />
                  </span>
                </UploadLabel>

                <HiddenFileInput
                  id="expense-receipt"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileChange}
                />
              </UploadWrapper>
            </FormGroup>

            {/* Status */}
            <FormGroup>
              <Label>Status</Label>

              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            {/* Description */}
            <FormGroup>
              <Label>Description</Label>

              <Input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </FormGroup>
          </FormGrid>

          {formError && (
            <p style={{ color: "#e03131", margin: "8px 0 0" }}>{formError}</p>
          )}

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose} disabled={submitting}>
              CANCEL
            </CancelButton>

            <SaveButton type="submit" disabled={submitting}>
              <span>
                <FiSave />
              </span>

              {submitting ? "SAVING..." : "SAVE EXPENSE"}
            </SaveButton>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddExpenseModal;