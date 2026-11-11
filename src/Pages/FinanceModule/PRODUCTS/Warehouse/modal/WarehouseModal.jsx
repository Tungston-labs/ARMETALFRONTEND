import React, { useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";

import {
  COUNTRY_OPTIONS,
  getCountryByCode,
  getStatesByCountry,
  getCitiesByState,
} from "../../../../../utils/countryData";

import {
  Overlay, Modal, Header, Title, Subtitle, Form, FormGroup, Label,
  Input, Select, ButtonRow, CancelButton, SaveButton,
} from "./WarehouseModal.styles";

const getInitialFormData = () => ({
  warehouseCode: "",
  warehouseName: "",
  warehouseType: "Main",
  manager: "",
  status: "Active",
  operatingSince: new Date().toISOString().slice(0, 10),
  country: "",
  state: "",
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

  const selectedCountry = useMemo(
    () => getCountryByCode(formData.country),
    [formData.country],
  );
  const states = useMemo(
    () => getStatesByCountry(formData.country),
    [formData.country],
  );
  const cities = useMemo(
    () => getCitiesByState(formData.country, formData.state),
    [formData.country, formData.state],
  );

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
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "country") {
        updated.state = "";
        updated.city = "";
      } else if (name === "state") {
        updated.city = "";
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;

    const stateObj = states.find((s) => s.code === formData.state);

    onSave?.({
      ...formData,
      country: selectedCountry?.name || "",
      countryCode: formData.country,
      state: stateObj?.name || formData.state,
      stateCode: stateObj?.code || "",
    });
  };

  const handleOverlayClick = () => {
    if (!submitting) onClose?.();
  };

  const renderInput = (name, placeholder = "", required = false) => (
    <Input
      type="text"
      id={name}
      name={name}
      placeholder={placeholder}
      value={formData[name] ?? ""}
      onChange={handleChange}
      required={required}
      disabled={submitting}
    />
  );

  const renderSelect = (name, options, placeholder, required = false) => {
    const current = formData[name];
    /* keep a saved value visible even if it's not in the fixed list */
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
          <FormGroup>
            <Label htmlFor="warehouseCode">Warehouse Code</Label>
            {renderInput("warehouseCode", "1253698", true)}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="warehouseName">Warehouse Name</Label>
            {renderSelect(
              "warehouseName",
              [
                { value: "Central Warehouse", label: "Central Warehouse" },
                { value: "Main Warehouse", label: "Main Warehouse" },
                { value: "Branch Warehouse", label: "Branch Warehouse" },
              ],
              "Select warehouse name",
              true,
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="warehouseType">Warehouse Type</Label>
            {renderSelect("warehouseType", [
              { value: "Main", label: "Main" },
              { value: "Branch", label: "Branch" },
              { value: "Distribution", label: "Distribution" },
              { value: "Regional", label: "Regional" },
            ])}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="manager">Manager</Label>
            {renderInput("manager", "Enter Name", true)}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="status">Status</Label>
            {renderSelect("status", [
              { value: "Active", label: "Active" },
              { value: "Inactive", label: "Inactive" },
            ])}
          </FormGroup>

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
            {renderSelect(
              "country",
              COUNTRY_OPTIONS.map((c) => ({ value: c.code, label: c.name })),
              "Select country",
              true,
            )}
          </FormGroup>

          {/* STATE: dropdown when data exists, otherwise free text */}
          <FormGroup>
            <Label htmlFor="state">State / Province</Label>
            {states.length > 0 ? (
              renderSelect(
                "state",
                states.map((s) => ({ value: s.code, label: s.name })),
                "Select state",
              )
            ) : (
              <Input
                type="text"
                id="state"
                name="state"
                placeholder={
                  formData.country ? "Enter state" : "Select country first"
                }
                value={formData.state ?? ""}
                onChange={handleChange}
                disabled={submitting || !formData.country}
              />
            )}
          </FormGroup>

          {/* CITY */}
          <FormGroup>
            <Label htmlFor="city">City</Label>
            {cities.length > 0 ? (
              renderSelect(
                "city",
                cities.map((c) => ({ value: c.name, label: c.name })),
                "Select city",
              )
            ) : (
              <Input
                type="text"
                id="city"
                name="city"
                placeholder={
                  states.length > 0 && !formData.state
                    ? "Select state first"
                    : "Enter city"
                }
                value={formData.city ?? ""}
                onChange={handleChange}
                disabled={
                  submitting ||
                  !formData.country ||
                  (states.length > 0 && !formData.state)
                }
              />
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="addressLine1">Address Line 1</Label>
            {renderInput("addressLine1")}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="addressLine2">Address Line 2</Label>
            {renderSelect(
              "addressLine2",
              [
                { value: "Building", label: "Building" },
                { value: "Street", label: "Street" },
                { value: "Area", label: "Area" },
              ],
              "Select",
            )}
          </FormGroup>

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
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email ?? ""}
              onChange={handleChange}
              disabled={submitting}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="storageCapacity">Storage Capacity</Label>
            <Input
              type="number"
              min="0"
              step="any"
              id="storageCapacity"
              name="storageCapacity"
              value={formData.storageCapacity ?? ""}
              onChange={handleChange}
              disabled={submitting}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="notes">Notes</Label>
            {renderInput("notes")}
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