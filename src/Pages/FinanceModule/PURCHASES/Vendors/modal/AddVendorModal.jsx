import React, { useEffect, useState } from "react";
import {
  ModalOverlay, ModalContainer, SectionTitle, SectionDescription, Form,
  FormGrid, FormGroup, Label, Input, Select, AddressHeader, AddAddressButton,
  AddressInput, Divider, ButtonGroup, CancelButton, SaveButton, UploadWrapper,
  HiddenFileInput, UploadLabel, ErrorText,
} from "./AddVendorModal.styles";
import { FiSave } from "react-icons/fi";
import { formatApiError, vendorToForm, vendorAddresses } from "../Vendorpayload";

const VENDOR_TYPES = [
  { value: "equipment", label: "Equipment" },
  { value: "telecom", label: "Telecom" },
  { value: "networking", label: "Networking" },
  { value: "software", label: "Software" },
  { value: "services", label: "Services" },
  { value: "other", label: "Other" },
];

const PAYMENT_TERMS = [
  { value: "immediate", label: "Due on Receipt" },
  { value: "7_days", label: "7 Days" },
  { value: "15_days", label: "15 Days" },
  { value: "30_days", label: "30 Days" },
  { value: "45_days", label: "45 Days" },
  { value: "60_days", label: "60 Days" },
  { value: "90_days", label: "90 Days" },
];

const CURRENCIES = ["AED", "INR", "USD", "EUR", "SAR", "GBP", "OMR", "QAR", "BHD", "KWD"];

const initialState = {
  vendorId: "", vendorName: "", vendorType: "", openingBalance: "",
  creditLimit: "", crNumber: "", currency: "SAR", vatNumber: "",
  paymentTerm: "", crExpiryDate: "", city: "", state: "",
  country: "Saudi Arabia", postalCode: "", phoneNumber: "", adminEmail: "",
  financialEmail: "", technicalEmail: "", clientStatus: "", bankName: "",
  accountNumber: "", ibanNumber: "", branch: "", documents: null,
};

/* ---------------- Validation ---------------- */

// Fields that show the red * and cannot be empty
const REQUIRED_FIELDS = [
  "vendorName", "vendorType", "phoneNumber", "clientStatus",
  "vatNumber", "paymentTerm", "creditLimit",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_RE = /^[A-Za-z\u0600-\u06FF0-9\s.,&'()\-]+$/; // letters, digits, basic punctuation, Arabic
const PLACE_RE = /^[A-Za-z\u0600-\u06FF\s.'\-]+$/;
const PHONE_RE = /^\+?[0-9\s\-()]{7,16}$/;
const MAX_FILE_MB = 5;
const ALLOWED_FILES = ["application/pdf", "image/jpeg", "image/png"];

const isBlank = (v) => v === null || v === undefined || String(v).trim() === "";

const validators = {
  vendorName: (v) => {
    if (isBlank(v)) return "Vendor name is required";
    if (v.trim().length < 2) return "Must be at least 2 characters";
    if (v.trim().length > 100) return "Must be 100 characters or less";
    if (!NAME_RE.test(v.trim())) return "Contains invalid characters";
    return "";
  },
  vendorType: (v) => (isBlank(v) ? "Select a vendor type" : ""),
  openingBalance: (v) => {
    if (isBlank(v)) return "";
    if (isNaN(Number(v))) return "Enter a valid number";
    return "";
  },
  creditLimit: (v) => {
    if (isBlank(v)) return "Credit limit is required";
    if (isNaN(Number(v))) return "Enter a valid number";
    if (Number(v) < 0) return "Cannot be negative";
    return "";
  },
  crNumber: (v) => {
    if (isBlank(v)) return "";
    if (!/^[A-Za-z0-9\-]{5,20}$/.test(v.trim())) return "5–20 letters/digits only";
    return "";
  },
  currency: (v) => (isBlank(v) ? "Select a currency" : ""),
  vatNumber: (v) => {
    if (isBlank(v)) return "VAT registration number is required";
    if (!/^[A-Za-z0-9]{10,20}$/.test(v.trim())) return "Must be 10–20 letters/digits, no spaces";
    return "";
  },
  paymentTerm: (v) => (isBlank(v) ? "Select a payment term" : ""),
  crExpiryDate: (v) => {
    if (isBlank(v)) return "";
    const d = new Date(v);
    if (isNaN(d.getTime())) return "Enter a valid date";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (d < today) return "CR has already expired";
    return "";
  },
  city: (v) => (isBlank(v) || PLACE_RE.test(v.trim()) ? "" : "Letters only"),
  state: (v) => (isBlank(v) || PLACE_RE.test(v.trim()) ? "" : "Letters only"),
  country: (v) => (isBlank(v) || PLACE_RE.test(v.trim()) ? "" : "Letters only"),
  postalCode: (v) =>
    isBlank(v) || /^[A-Za-z0-9\s\-]{3,10}$/.test(v.trim()) ? "" : "3–10 letters/digits",
  phoneNumber: (v) => {
    if (isBlank(v)) return "Phone number is required";
    if (!PHONE_RE.test(v.trim())) return "Enter a valid phone number (7–15 digits)";
    return "";
  },
  adminEmail: (v) => (isBlank(v) || EMAIL_RE.test(v.trim()) ? "" : "Enter a valid email"),
  financialEmail: (v) => (isBlank(v) || EMAIL_RE.test(v.trim()) ? "" : "Enter a valid email"),
  technicalEmail: (v) => (isBlank(v) || EMAIL_RE.test(v.trim()) ? "" : "Enter a valid email"),
  clientStatus: (v) => (isBlank(v) ? "Select a status" : ""),
  bankName: (v) =>
    isBlank(v) || (NAME_RE.test(v.trim()) && v.trim().length <= 100)
      ? ""
      : "Enter a valid bank name",
  accountNumber: (v) =>
    isBlank(v) || /^[0-9]{6,24}$/.test(v.trim()) ? "" : "6–24 digits only",
  ibanNumber: (v) => {
    if (isBlank(v)) return "";
    const iban = v.replace(/\s/g, "").toUpperCase();
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) return "Enter a valid IBAN (e.g. SA03...)";
    return "";
  },
  branch: (v) => (isBlank(v) || v.trim().length <= 100 ? "" : "Must be 100 characters or less"),
  documents: (file) => {
    if (!file) return "";
    if (!ALLOWED_FILES.includes(file.type)) return "Only PDF, JPG or PNG allowed";
    if (file.size > MAX_FILE_MB * 1024 * 1024) return `File must be under ${MAX_FILE_MB} MB`;
    return "";
  },
};

const validateAddresses = (list) => {
  if (list.some((a) => a.trim().length > 200)) return "Each address must be 200 characters or less";
  return "";
};

/* ---------------- Component ---------------- */

const AddVendorModal = ({
  isOpen, onClose, onSave, vendor = null, saving = false, error = null,
}) => {
  const isEdit = Boolean(vendor);

  const [formData, setFormData] = useState(initialState);
  const [addresses, setAddresses] = useState([""]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) return;

    setErrors({});
    if (vendor) {
      setFormData({ ...initialState, ...vendorToForm(vendor) });
      setAddresses(vendorAddresses(vendor));
    } else {
      setFormData(initialState);
      setAddresses([""]);
    }
  }, [isOpen, vendor]);

  if (!isOpen) return null;

  const setFieldError = (name, message) =>
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[name] = message;
      else delete next[name];
      return next;
    });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const newValue = files ? files[0] : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // re-validate live once the field has shown an error, and always for files
    if (errors[name] || files) {
      setFieldError(name, validators[name]?.(newValue) || "");
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (validators[name]) setFieldError(name, validators[name](value));
  };

  const handleAddressChange = (index, value) => {
    setAddresses((prev) => prev.map((a, i) => (i === index ? value : a)));
    if (errors.billingAddress) setFieldError("billingAddress", "");
  };

  const addAddress = () => setAddresses((prev) => [...prev, ""]);

  const validateAll = () => {
    const result = {};
    Object.keys(validators).forEach((name) => {
      if (name === "vendorId") return;
      const msg = validators[name](formData[name]);
      if (msg) result[name] = msg;
    });
    const addrMsg = validateAddresses(addresses);
    if (addrMsg) result.billingAddress = addrMsg;
    return result;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (saving) return;

    const result = validateAll();
    setErrors(result);

    const firstKey = Object.keys(result)[0];
    if (firstKey) {
      const el = document.querySelector(`[name="${firstKey}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus?.();
      return;
    }

    onSave(
      {
        ...formData,
        vendorName: formData.vendorName.trim(),
        billingAddresses: addresses,
      },
      isEdit
    );
  };

  // shared props for every controlled field
  const bind = (name) => ({
    name,
    value: formData[name],
    onChange: handleChange,
    onBlur: handleBlur,
    $error: Boolean(errors[name]),
  });

  const req = (name) => REQUIRED_FIELDS.includes(name);
  const Err = ({ name }) => (errors[name] ? <ErrorText>{errors[name]}</ErrorText> : null);

  return (
    <ModalOverlay onClick={saving ? undefined : onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Form onSubmit={handleSubmit} noValidate>
          <section>
            <SectionTitle>{isEdit ? "Edit Vendor" : "Add New Vendor"}</SectionTitle>
            <SectionDescription>
              {isEdit
                ? "Update vendor details for invoices, payments, and financial operations."
                : "Enter vendor details for invoice, payments, and financial operations."}
            </SectionDescription>

            <FormGrid>
              <FormGroup>
                <Label>VENDOR ID</Label>
                <Input
                  name="vendorId"
                  value={formData.vendorId}
                  placeholder="Auto-generated"
                  readOnly
                />
              </FormGroup>

              <FormGroup>
                <Label $required={req("vendorName")}>VENDOR NAME</Label>
                <Input {...bind("vendorName")} 
                placeholder="Enter vendor name"
                 maxLength={100} 
                 autoComplete="off"
                 />
                <Err name="vendorName" />
              </FormGroup>

              <FormGroup>
                <Label $required={req("vendorType")}>VENDOR TYPE</Label>
                <Select {...bind("vendorType")}>
                  <option value="">Select Vendor Type</option>
                  {VENDOR_TYPES.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
                <Err name="vendorType" />
              </FormGroup>

              <FormGroup>
                <Label>OPENING BALANCE</Label>
                <Input {...bind("openingBalance")} type="number" step="0.01"
                  autoComplete="off" />
                <Err name="openingBalance" />
              </FormGroup>

              <FormGroup>
                <Label $required={req("creditLimit")}>CREDIT LIMIT</Label>
                <Input {...bind("creditLimit")} type="number" min="0" step="0.01"
                  autoComplete="off" />
                <Err name="creditLimit" />
              </FormGroup>

              <FormGroup>
                <Label>CR NUMBER</Label>
                <Input {...bind("crNumber")} placeholder="Enter Number" maxLength={20} 
                  autoComplete="off"/>
                <Err name="crNumber" />
              </FormGroup>

              <FormGroup>
                <Label $required={req("vatNumber")}>VAT REGISTRATION NUMBER</Label>
                <Input {...bind("vatNumber")} placeholder="Enter Number" maxLength={20}
                  autoComplete="off" />
                <Err name="vatNumber" />
              </FormGroup>

              <FormGroup>
                <Label $required={req("paymentTerm")}>PAYMENT TERM</Label>
                <Select {...bind("paymentTerm")}>
                  <option value="">Select</option>
                  {PAYMENT_TERMS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
                <Err name="paymentTerm" />
              </FormGroup>

              <FormGroup>
                <Label>CR EXPIRY DATE</Label>
                <Input
                  {...bind("crExpiryDate")}
                  type="date"
                  value={formData.crExpiryDate ? formData.crExpiryDate.slice(0, 10) : ""}
                />
                <Err name="crExpiryDate" />
              </FormGroup>

              {/* Billing Address */}
              <FormGroup>
                <AddressHeader>
                  <Label>BILLING ADDRESS</Label>
                  <AddAddressButton type="button" onClick={addAddress}>+</AddAddressButton>
                </AddressHeader>

                {addresses.map((address, index) => (
                  <AddressInput
                    key={index}
                    name={index === 0 ? "billingAddress" : undefined}
                    $error={Boolean(errors.billingAddress)}
                    placeholder="Enter billing address"
                    value={address}
                    maxLength={200}
                    onChange={(e) => handleAddressChange(index, e.target.value)}
                      autoComplete="off"
                  />
                ))}
                <Err name="billingAddress" />
              </FormGroup>

              <FormGroup>
                <Label>CITY</Label>
                <Input {...bind("city")} placeholder="Enter city" 
                  autoComplete="off"/>
                <Err name="city" />
              </FormGroup>

              <FormGroup>
                <Label>STATE</Label>
                <Input {...bind("state")} placeholder="Enter state"
                  autoComplete="off" />
                <Err name="state" />
              </FormGroup>

              <FormGroup>
                <Label>COUNTRY</Label>
                <Input {...bind("country")} placeholder="Enter country" 
                  autoComplete="off"/>
                <Err name="country" />
              </FormGroup>

              <FormGroup>
                <Label>POSTAL/ZIP CODE</Label>
                <Input {...bind("postalCode")} placeholder="Enter Code" maxLength={10} 
                  autoComplete="off"/>
                <Err name="postalCode" />
              </FormGroup>

              <FormGroup>
                <Label $required={req("phoneNumber")}>PHONE NUMBER</Label>
                <Input {...bind("phoneNumber")} type="tel" placeholder="Enter Phone Number" maxLength={16} 
                  autoComplete="off"/>
                <Err name="phoneNumber" />
              </FormGroup>

              <FormGroup>
                <Label>ADMIN CONTACT EMAIL ID</Label>
                <Input {...bind("adminEmail")} type="email" placeholder="Enter Email ID"   autoComplete="off"/>
                <Err name="adminEmail" />
              </FormGroup>

              <FormGroup>
                <Label>FINANCIAL CONTACT EMAIL ID</Label>
                <Input {...bind("financialEmail")} type="email" placeholder="Enter Email ID"   autoComplete="off"/>
                <Err name="financialEmail" />
              </FormGroup>

              <FormGroup>
                <Label>TECHNICAL CONTACT EMAIL ID</Label>
                <Input {...bind("technicalEmail")} type="email" placeholder="Enter Email ID"  autoComplete="off" />
                <Err name="technicalEmail" />
              </FormGroup>

              <FormGroup>
                <Label $required={req("clientStatus")}>CLIENT STATUS</Label>
                <Select {...bind("clientStatus")}>
                  <option value="">Select status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
                <Err name="clientStatus" />
              </FormGroup>
            </FormGrid>
          </section>

          <Divider />

          <section>
            <SectionTitle>Bank Information</SectionTitle>
            <SectionDescription>
              Enter vendor details for invoice, payments, and financial operations.
            </SectionDescription>

            <FormGrid>
              <FormGroup>
                <Label>BANK NAME</Label>
                <Input {...bind("bankName")} autoComplete="off"/>
                <Err name="bankName" />
              </FormGroup>

              <FormGroup>
                <Label>ACCOUNT NUMBER</Label>
                <Input {...bind("accountNumber")} inputMode="numeric" maxLength={24}   autoComplete="off"/>
                <Err name="accountNumber" />
              </FormGroup>

              <FormGroup>
                <Label>IBAN NUMBER</Label>
                <Input {...bind("ibanNumber")} maxLength={34}   autoComplete="off"/>
                <Err name="ibanNumber" />
              </FormGroup>

              <FormGroup>
                <Label>BRANCH</Label>
                <Input {...bind("branch")}   autoComplete="off"/>
                <Err name="branch" />
              </FormGroup>

              <FormGroup>
                <Label>UPLOAD DOCUMENTS</Label>
                <UploadWrapper>
                  <UploadLabel htmlFor="vendor-document" $error={Boolean(errors.documents)}>
                    {formData.documents?.name || vendor?.documentName || "Upload document"}
                    <span>⇧</span>
                  </UploadLabel>
                  <HiddenFileInput
                    id="vendor-document"
                    type="file"
                    name="documents"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleChange}
                  />
                </UploadWrapper>
                <Err name="documents" />
              </FormGroup>
            </FormGrid>
          </section>

          {error && (
            <p style={{ color: "#d32f2f", fontSize: 13, margin: "12px 0 0" }}>
              {formatApiError(error)}
            </p>
          )}

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose} disabled={saving}>
              CANCEL
            </CancelButton>
            <SaveButton type="submit" disabled={saving}>
              <FiSave size={15} />
              {saving ? "SAVING..." : isEdit ? "UPDATE VENDOR" : "SAVE VENDOR"}
            </SaveButton>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddVendorModal;