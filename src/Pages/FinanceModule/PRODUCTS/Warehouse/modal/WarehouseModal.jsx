import React, { useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";

import { COUNTRY_OPTIONS, getCountryByCode } from "../../../../../utils/countryData";

import {
  Overlay,
  Modal,
  Header,
  Title,
  Subtitle,
  Form,
  FormGroup,
  Label,
  Input,
  Select,
  ButtonRow,
  CancelButton,
  SaveButton,
} from "./WarehouseModal.styles";

const WAREHOUSE_TYPE_OPTIONS = [
  { value: "main", label: "Main" },
  { value: "distribution", label: "Distribution" },
  { value: "regional", label: "Regional" },
  { value: "service", label: "Service" },
  { value: "spare_parts", label: "Spare Parts" },
  { value: "other", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const getInitialFormData = () => ({
  warehouseCode: "",
  warehouseName: "",
  warehouseType: "main",
  manager: "",
  status: "active",
  operatingSince: "",
  country: "",
  city: "",
  addressLine1: "",
  addressLine2: "",
  postalCode: "",
  phoneNumber: "",
  email: "",
  storageCapacity: "",
  notes: "",
});

const WarehouseModal = ({
  isOpen = true,
  onClose,
  onSave,
  initialData,
  isEdit = false,
  submitting = false,
  error = "",
}) => {
  const [formData, setFormData] = useState({
    ...getInitialFormData(),
    ...initialData,
  });

  useEffect(() => {
    setFormData({
      ...getInitialFormData(),
      ...initialData,
    });
  }, [initialData, isOpen]);

  const selectedCountry = useMemo(
    () => getCountryByCode(formData.country),
    [formData.country],
  );

  const countrySelectOptions = useMemo(() => {
    const base = COUNTRY_OPTIONS.map((c) => ({ value: c.code, label: c.name }));
    const current = String(formData.country || "").trim();
    if (
      current &&
      !base.some(
        (c) =>
          c.value.toLowerCase() === current.toLowerCase() ||
          c.label.toLowerCase() === current.toLowerCase(),
      )
    ) {
      return [{ value: current, label: current }, ...base];
    }
    return base;
  }, [formData.country]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleEscape = (e) => {
      if (e.key === "Escape" && !submitting) onClose?.();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, submitting]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;

    onSave?.({
      ...formData,
      country: selectedCountry?.name || formData.country || "",
      countryCode: selectedCountry?.code || "",
    });
  };

  const handleOverlayClick = () => {
    if (!submitting) onClose?.();
  };

  const renderInput = (name, placeholder = "", required = false, type = "text") => (
    <Input
      type={type}
      id={name}
      name={name}
      placeholder={placeholder}
      value={formData[name] ?? ""}
      onChange={handleChange}
      required={required}
      disabled={submitting}
    />
  );

  const renderSelect = (name, options, placeholder = "", required = false) => {
    const current = formData[name];
    const list =
      current && !options.some((o) => String(o.value) === String(current))
        ? [{ value: current, label: current }, ...options]
        : options;

    return (
      <Select
        id={name}
        name={name}
        value={current ?? ""}
        onChange={handleChange}
        required={required}
        disabled={submitting}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {list.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );
  };

  const capacityValue = String(formData.storageCapacity ?? "").trim();
  const isNumericCapacity = capacityValue === "" || /^\d+(\.\d+)?$/.test(capacityValue);

  return (
    <Overlay onClick={handleOverlayClick}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>{isEdit ? "Edit Warehouse" : "Add New Warehouse"}</Title>
          <Subtitle>
            {isEdit
              ? "Update the warehouse details."
              : "Create a new warehouse to manage inventory and stock operations."}
          </Subtitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          {/* Row 1 */}
          <FormGroup>
            <Label htmlFor="warehouseCode">Warehouse Code</Label>
            {renderInput("warehouseCode", "1253698")}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="warehouseName">Warehouse Name</Label>
            {renderInput("warehouseName", "Enter warehouse name", true)}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="warehouseType">Warehouse Type</Label>
            {renderSelect("warehouseType", WAREHOUSE_TYPE_OPTIONS)}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="manager">Manager</Label>
            {renderInput("manager", "Enter Name")}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="status">Status</Label>
            {renderSelect("status", STATUS_OPTIONS)}
          </FormGroup>

          {/* Row 2 */}
          <FormGroup>
            <Label htmlFor="operatingSince">Operating Since</Label>
            <Input
              type="date"
              id="operatingSince"
              name="operatingSince"
              value={formData.operatingSince ?? ""}
              onChange={handleChange}
              disabled={submitting}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="country">Country</Label>
            {renderSelect("country", countrySelectOptions, "Select country")}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="city">City</Label>
            {renderInput("city", "Enter City")}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="addressLine1">Address Line 1</Label>
            {renderInput("addressLine1", "Enter Address Line 1")}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="addressLine2">Address Line 2</Label>
            {renderInput("addressLine2", "Enter Address Line 2")}
          </FormGroup>

          {/* Row 3 */}
          <FormGroup>
            <Label htmlFor="postalCode">Postal Code</Label>
            {renderInput("postalCode", "Enter Postal Code")}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            {renderInput(
              "phoneNumber",
              selectedCountry?.dialCode
                ? `${selectedCountry.dialCode} Enter Phone Number`
                : "Enter Phone Number",
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            {renderInput("email", "Enter Email", false, "email")}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="storageCapacity">Storage Capacity</Label>
            <Input
              type={isNumericCapacity ? "number" : "text"}
              min={isNumericCapacity ? "0" : undefined}
              step={isNumericCapacity ? "any" : undefined}
              id="storageCapacity"
              name="storageCapacity"
              placeholder="Enter Storage Capacity"
              value={formData.storageCapacity ?? ""}
              onChange={handleChange}
              disabled={submitting}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="notes">Notes</Label>
            {renderInput("notes", "Enter Notes")}
          </FormGroup>

          {error && (
            <div
              role="alert"
              style={{ gridColumn: "1 / -1", color: "#b91c1c", fontSize: 13 }}
            >
              {error}
            </div>
          )}

          <ButtonRow>
            <CancelButton type="button" onClick={onClose} disabled={submitting}>
              CANCEL
            </CancelButton>

            <SaveButton type="submit" disabled={submitting}>
              <Save size={15} />
              {submitting
                ? "SAVING..."
                : isEdit
                  ? "UPDATE WAREHOUSE"
                  : "SAVE WAREHOUSE"}
            </SaveButton>
          </ButtonRow>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default WarehouseModal;
