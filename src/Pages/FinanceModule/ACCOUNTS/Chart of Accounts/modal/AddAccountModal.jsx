import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import {
  addAccount,
  editAccount,
  clearAccountError,
} from "../../../../../Redux/finance/accounts/Accountingslice";

const ACCOUNT_TYPE_OPTIONS = [
  { value: "asset", label: "ASSET" },
  { value: "liability", label: "LIABILITY" },
  { value: "equity", label: "EQUITY" },
  { value: "revenue", label: "INCOME" },
  { value: "expense", label: "EXPENSE" },
];

const CATEGORY_OPTIONS = {
  asset: [
    { value: "current_asset", label: "CURRENT ASSETS" },
    { value: "non_current_asset", label: "NON-CURRENT ASSETS" },
  ],
  liability: [
    { value: "current_liability", label: "CURRENT LIABILITIES" },
    { value: "non_current_liability", label: "NON-CURRENT LIABILITIES" },
  ],
  equity: [{ value: "equity", label: "EQUITY" }],
  revenue: [
    { value: "operating_revenue", label: "OPERATING REVENUE" },
    { value: "other_revenue", label: "OTHER REVENUE" },
  ],
  expense: [
    { value: "cost_of_goods_sold", label: "COST OF GOODS SOLD" },
    { value: "operating_expense", label: "OPERATING EXPENSE" },
    { value: "other_expense", label: "OTHER EXPENSE" },
  ],
};

// Normal balance side for each type
const DEFAULT_BALANCE_TYPE = {
  asset: "debit",
  expense: "debit",
  liability: "credit",
  equity: "credit",
  revenue: "credit",
};

const EMPTY_FORM = {
  account_type: "asset",
  account_name: "",
  account_code: "",
  parent_account: "",
  category: "current_asset",
  opening_balance: "0.00",
  opening_balance_type: "debit",
  status: "active",
  description: "",
};


const formatErrors = (err) => {
  if (!err) return [];
  if (typeof err === "string") return [err];
  if (err.detail) return [err.detail];

  return Object.entries(err).map(([field, messages]) => {
    const text = Array.isArray(messages) ? messages.join(" ") : String(messages);
    return `${field.replace(/_/g, " ")}: ${text}`;
  });
};

// Build the form state from a backend account object
const buildFormFromAccount = (account) => {
  const parentId =
    account.parent_account && typeof account.parent_account === "object"
      ? account.parent_account.id
      : account.parent_account;

  return {
    account_type: account.account_type,
    account_name: account.account_name || "",
    account_code: account.account_code || "",
    parent_account: parentId ? String(parentId) : "",
    category: account.category,
    opening_balance: String(account.opening_balance ?? "0.00"),
    opening_balance_type: account.opening_balance_type || "debit",
    status: account.status || "active",
    description: account.description || "",
  };
};

/**
 * Props:
 *  - isOpen  : boolean
 *  - onClose : () => void
 *  - account : backend account object to edit, or null to add
 */
const AccountModal = ({ isOpen, onClose, account = null }) => {
  const dispatch = useDispatch();
  const isEdit = Boolean(account);

  const sections = useSelector((state) => state.accounting.sections);

  // Prefill immediately on first render so edit never flashes an empty form
  const [formData, setFormData] = useState(
    account ? buildFormFromAccount(account) : EMPTY_FORM
  );
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);

  // Reset / prefill every time the modal opens or the selected account changes
  useEffect(() => {
    if (!isOpen) return;

    setErrors([]);
    setFormData(account ? buildFormFromAccount(account) : EMPTY_FORM);
  }, [isOpen, account]);

  // Parent options: existing accounts of the same type (excluding itself)
  const parentOptions = useMemo(
    () =>
      (sections?.[formData.account_type] || []).filter(
        (acc) => !account || acc.id !== account.id
      ),
    [sections, formData.account_type, account]
  );

  // Category options for the chosen type. If the saved category isn't in the
  // list, add it so the select shows (and keeps) the real value.
  const categoryOptions = useMemo(() => {
    const options = CATEGORY_OPTIONS[formData.account_type] || [];
    const exists = options.some((o) => o.value === formData.category);

    if (exists || !formData.category) return options;

    return [
      ...options,
      {
        value: formData.category,
        label: String(formData.category).replace(/_/g, " ").toUpperCase(),
      },
    ];
  }, [formData.account_type, formData.category]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Changing the type resets the dependent fields
  const handleTypeChange = (event) => {
    const type = event.target.value;

    setFormData((prev) => ({
      ...prev,
      account_type: type,
      category: CATEGORY_OPTIONS[type][0].value,
      parent_account: "",
      opening_balance_type: DEFAULT_BALANCE_TYPE[type],
    }));
  };

  const handleClose = () => {
    setErrors([]);
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      account_type: formData.account_type,
      account_name: formData.account_name.trim(),
      account_code: String(formData.account_code).trim(),
      parent_account: formData.parent_account
        ? Number(formData.parent_account)
        : null,
      category: formData.category,
      opening_balance: Number(formData.opening_balance || 0).toFixed(2),
      opening_balance_type: formData.opening_balance_type,
      status: formData.status,
      description: formData.description,
    };

    setSubmitting(true);
    setErrors([]);

    try {
      if (isEdit) {
        await dispatch(
          editAccount({ id: account.id, accountData: payload })
        ).unwrap();
      } else {
        await dispatch(addAccount(payload)).unwrap();
      }

      handleClose();
    } catch (err) {
      setErrors(formatErrors(err));
      // keep the error inside the modal instead of also showing it on the page
      dispatch(clearAccountError());
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer onClick={(event) => event.stopPropagation()}>
        <Form onSubmit={handleSubmit}>
          <SectionTitle>
            {isEdit ? "Edit Account" : "Add New Account"}
          </SectionTitle>

          <SectionDescription>
            {isEdit
              ? "Update the account details below. Changes apply to future entries and reports."
              : "Record essential journal information to ensure accurate accounting, reporting, and audit compliance."}
          </SectionDescription>

          <FormGrid>
            {/* ACCOUNT TYPE */}
            <FormGroup>
              <Label>
                ACCOUNT TYPE <span style={{ color: "#e03131" }}>*</span>
              </Label>

              <Select
                name="account_type"
                value={formData.account_type}
                onChange={handleTypeChange}
              >
                {ACCOUNT_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            {/* ACCOUNT NAME */}
            <FormGroup>
              <Label>
                ACCOUNT NAME <span style={{ color: "#e03131" }}>*</span>
              </Label>

              <Input
                type="text"
                name="account_name"
                value={formData.account_name}
                onChange={handleChange}
                placeholder="EG: PETTY CASH"
                required
              />
            </FormGroup>

            {/* ACCOUNT CODE */}
            <FormGroup>
              <Label>ACCOUNT CODE</Label>

              <Input
                type="text"
                name="account_code"
                value={formData.account_code}
                onChange={handleChange}
                placeholder="EG: 1001"
              />
            </FormGroup>

            {/* PARENT ACCOUNT */}
            <FormGroup>
              <Label>PARENT ACCOUNT</Label>

              <Select
                name="parent_account"
                value={formData.parent_account}
                onChange={handleChange}
              >
                <option value="">NONE</option>
                {parentOptions.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.account_code} - {acc.account_name}
                  </option>
                ))}
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
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormGroup>

            {/* OPENING BALANCE */}
            <FormGroup>
              <Label>OPENING BALANCE</Label>

              <Input
                type="number"
                name="opening_balance"
                value={formData.opening_balance}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </FormGroup>

            {/* DEBIT / CREDIT */}
            <FormGroup>
              <Label>
                DEBIT/CREDIT <span style={{ color: "#e03131" }}>*</span>
              </Label>

              <Select
                name="opening_balance_type"
                value={formData.opening_balance_type}
                onChange={handleChange}
              >
                <option value="debit">DEBIT</option>
                <option value="credit">CREDIT</option>
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
                <option value="active">ACTIVE</option>
                <option value="inactive">INACTIVE</option>
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

          {/* API validation errors */}
          {errors.length > 0 && (
            <div style={{ color: "#e03131", fontSize: "13px", marginTop: "12px" }}>
              {errors.map((line) => (
                <div key={line}>{line}</div>
              ))}
            </div>
          )}

          <ButtonGroup>
            <CancelButton type="button" onClick={handleClose}>
              CANCEL
            </CancelButton>

            <SaveButton type="submit" disabled={submitting}>
              <FiSave />
              <span>
                {submitting
                  ? "SAVING..."
                  : isEdit
                  ? "UPDATE ACCOUNT"
                  : "SAVE ACCOUNT"}
              </span>
            </SaveButton>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AccountModal;