import React, { useEffect, useState } from "react";
import {
  ModalOverlay,
  ModalContainer,
  SectionTitle,
  SectionDescription,
  Form,
  FormGrid,
  FormGroup,
  Label,
  Input,
  Select,
  AddressHeader,
  AddAddressButton,
  AddressInput,
  Divider,
  ButtonGroup,
  CancelButton,
  SaveButton,
  UploadWrapper,
  HiddenFileInput,
  UploadLabel,
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

const CURRENCIES = [
  "AED", "INR", "USD", "EUR", "SAR", "GBP", "OMR", "QAR", "BHD", "KWD",
];

const initialState = {
  vendorId: "",
  vendorName: "",
  vendorType: "",
  openingBalance: "",
  creditLimit: "",
  crNumber: "",
  currency: "SAR",
  vatNumber: "",
  paymentTerm: "",
  crExpiryDate: "",
  city: "",
  state: "",
  country: "Saudi Arabia",
  postalCode: "",
  phoneNumber: "",
  adminEmail: "",
  financialEmail: "",
  technicalEmail: "",
  clientStatus: "",
  bankName: "",
  accountNumber: "",
  ibanNumber: "",
  branch: "",
  documents: null,
};

const AddVendorModal = ({
  isOpen,
  onClose,
  onSave,
  vendor = null,
  saving = false,
  error = null,
}) => {
  const isEdit = Boolean(vendor);

  const [formData, setFormData] = useState(initialState);
  const [addresses, setAddresses] = useState([""]);

useEffect(() => {
  if (!isOpen) return;

  if (vendor) {
    setFormData({ ...initialState, ...vendorToForm(vendor) });
    setAddresses(vendorAddresses(vendor));
  } else {
    setFormData(initialState);
    setAddresses([""]);
  }
}, [isOpen, vendor]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleAddressChange = (index, value) => {
    setAddresses((prev) =>
      prev.map((address, i) => (i === index ? value : address))
    );
  };

  const addAddress = () => {
    setAddresses((prev) => [...prev, ""]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (saving) return;

    onSave({ ...formData, billingAddresses: addresses }, isEdit);
  };

  return (
    <ModalOverlay onClick={saving ? undefined : onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Form onSubmit={handleSubmit}>
          {/* Vendor Information */}

          <section>
            <SectionTitle>
              {isEdit ? "Edit Vendor" : "Add New Vendor"}
            </SectionTitle>

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
                  onChange={handleChange}
                  placeholder="Auto-generated"
                  readOnly
                />
              </FormGroup>

              <FormGroup>
                <Label>VENDOR NAME</Label>
                <Input
                  name="vendorName"
                  placeholder="Enter vendor name"
                  value={formData.vendorName}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>VENDOR TYPE</Label>
                <Select
                  name="vendorType"
                  value={formData.vendorType}
                  onChange={handleChange}
                >
                  <option value="">Select Vendor Type</option>
                  {VENDOR_TYPES.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>OPENING BALANCE</Label>
                <Input
                  type="number"
                  name="openingBalance"
                  value={formData.openingBalance}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>CREDIT LIMIT</Label>
                <Input
                  type="number"
                  name="creditLimit"
                  value={formData.creditLimit}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>CR NUMBER</Label>
                <Input
                  name="crNumber"
                  placeholder="Enter Number"
                  value={formData.crNumber}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>CURRENCY</Label>
                <Select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>VAT REGISTRATION NUMBER</Label>
                <Input
                  name="vatNumber"
                  placeholder="Enter Number"
                  value={formData.vatNumber}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>PAYMENT TERM</Label>
                <Select
                  name="paymentTerm"
                  value={formData.paymentTerm}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {PAYMENT_TERMS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>CR EXPIRY DATE</Label>
                <Input
                  type="date"
                  name="crExpiryDate"
                  value={
                    formData.crExpiryDate
                      ? formData.crExpiryDate.slice(0, 10)
                      : ""
                  }
                  onChange={handleChange}
                />
              </FormGroup>

              {/* Billing Address */}

              <FormGroup>
                <AddressHeader>
                  <Label>BILLING ADDRESS</Label>
                  <AddAddressButton type="button" onClick={addAddress}>
                    +
                  </AddAddressButton>
                </AddressHeader>

                {addresses.map((address, index) => (
                  <AddressInput
                    key={index}
                    placeholder="Enter billing address"
                    value={address}
                    onChange={(e) =>
                      handleAddressChange(index, e.target.value)
                    }
                  />
                ))}
              </FormGroup>

              <FormGroup>
                <Label>CITY</Label>
                <Input
                  name="city"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>STATE</Label>
                <Input
                  name="state"
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>COUNTRY</Label>
                <Input
                  name="country"
                  placeholder="Enter country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>POSTAL/ZIP CODE</Label>
                <Input
                  name="postalCode"
                  placeholder="Enter Code"
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>PHONE NUMBER</Label>
                <Input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Enter Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>ADMIN CONTACT EMAIL ID</Label>
                <Input
                  type="email"
                  name="adminEmail"
                  placeholder="Enter Email ID"
                  value={formData.adminEmail}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>FINANCIAL CONTACT EMAIL ID</Label>
                <Input
                  type="email"
                  name="financialEmail"
                  placeholder="Enter Email ID"
                  value={formData.financialEmail}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>TECHNICAL CONTACT EMAIL ID</Label>
                <Input
                  type="email"
                  name="technicalEmail"
                  placeholder="Enter Email ID"
                  value={formData.technicalEmail}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>CLIENT STATUS</Label>
                <Select
                  name="clientStatus"
                  value={formData.clientStatus}
                  onChange={handleChange}
                >
                  <option value="">Select status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
              </FormGroup>
            </FormGrid>
          </section>

          {/* Bank Information */}

          <Divider />

          <section>
            <SectionTitle>Bank Information</SectionTitle>

            <SectionDescription>
              Enter vendor details for invoice, payments, and
              financial operations.
            </SectionDescription>

            <FormGrid>
              <FormGroup>
                <Label>BANK NAME</Label>
                <Input
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>ACCOUNT NUMBER</Label>
                <Input
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>IBAN NUMBER</Label>
                <Input
                  name="ibanNumber"
                  value={formData.ibanNumber}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>BRANCH</Label>
                <Input
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label>UPLOAD DOCUMENTS</Label>

                <UploadWrapper>
                  <UploadLabel htmlFor="vendor-document">
                    {formData.documents?.name ||
                      vendor?.documentName ||
                      "Upload document"}
                    <span>⇧</span>
                  </UploadLabel>

                  <HiddenFileInput
                    id="vendor-document"
                    type="file"
                    name="documents"
                    onChange={handleChange}
                  />
                </UploadWrapper>
              </FormGroup>
            </FormGrid>
          </section>

          {/* Error + Buttons */}

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
              {saving
                ? "SAVING..."
                : isEdit
                ? "UPDATE VENDOR"
                : "SAVE VENDOR"}
            </SaveButton>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddVendorModal;