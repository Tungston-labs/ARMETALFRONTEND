import React, { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";
import {
  Overlay,
  ModalContainer,
  Header,
  Title,
  Description,
  Form,
  FormGrid,
  Field,
  Label,
  Input,
  Select,
  ButtonGroup,
  CancelButton,
  SaveButton,
} from "./WarehouseModal.styles";

const WarehouseModal = ({ isOpen, onClose, onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    warehouseName: "",
    warehouseCode: "1253698",
    warehouseType: "",
    manager: "",
    status: "",
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
    ...initialData,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        warehouseName: "",
        warehouseCode: "1253698",
        warehouseType: "",
        manager: "",
        status: "",
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
        ...initialData,
      });
    }
  }, [isOpen, initialData]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer
        role="dialog"
        aria-modal="true"
        aria-labelledby="warehouse-modal-title"
      >
        <Header>
          <Title id="warehouse-modal-title">Add New Warehouse</Title>

          <Description>
            Create a new warehouse to manage inventory and stock operations.
          </Description>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormGrid>
            <Field>
              <Label htmlFor="warehouseName">WAREHOUSE NAME</Label>

              <Input
                id="warehouseName"
                name="warehouseName"
                value={formData.warehouseName}
                onChange={handleChange}
                placeholder="Select Type"
              />
            </Field>

            <Field>
              <Label htmlFor="warehouseCode">WAREHOUSE CODE</Label>

              <Input
                id="warehouseCode"
                name="warehouseCode"
                value={formData.warehouseCode}
                onChange={handleChange}
                placeholder="1253698"
              />
            </Field>

            <Field>
              <Label htmlFor="warehouseType">WAREHOUSE TYPE</Label>

              <Select
                id="warehouseType"
                name="warehouseType"
                value={formData.warehouseType}
                onChange={handleChange}
              >
                <option value="">Select Type</option>
                <option value="central">Central</option>
                <option value="regional">Regional</option>
                <option value="distribution">Distribution</option>
              </Select>
            </Field>

            <Field>
              <Label htmlFor="manager">MANAGER</Label>

              <Input
                id="manager"
                name="manager"
                value={formData.manager}
                onChange={handleChange}
                placeholder="Enter name"
              />
            </Field>

            <Field>
              <Label htmlFor="status">STATUS</Label>

              <Select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="">Select Brand</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </Field>

            <Field>
              <Label htmlFor="operatingSince">OPERATING SINCE</Label>

              <Input
                id="operatingSince"
                name="operatingSince"
                type="date"
                value={formData.operatingSince}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <Label htmlFor="country">COUNTRY</Label>

              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <Label htmlFor="city">CITY</Label>

              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <Label htmlFor="addressLine1">ADDRESS LINE 1</Label>

              <Input
                id="addressLine1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <Label htmlFor="addressLine2">ADDRESS LINE 2</Label>

              <Select
                id="addressLine2"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="building">Building</option>
                <option value="floor">Floor</option>
                <option value="unit">Unit</option>
              </Select>
            </Field>

            <Field>
              <Label htmlFor="postalCode">POSTAL CODE</Label>

              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Enter Postal Code"
              />
            </Field>

            <Field>
              <Label htmlFor="phoneNumber">PHONE NUMBER</Label>

              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter Phone Number"
              />
            </Field>

            <Field>
              <Label htmlFor="email">EMAIL</Label>

              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
              />
            </Field>

            <Field>
              <Label htmlFor="storageCapacity">STORAGE CAPACITY</Label>

              <Input
                id="storageCapacity"
                name="storageCapacity"
                value={formData.storageCapacity}
                onChange={handleChange}
              />
            </Field>

            <Field>
              <Label htmlFor="notes">NOTES</Label>

              <Input
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </Field>
          </FormGrid>

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose}>
              CANCEL
            </CancelButton>

            <SaveButton type="submit">
              <FiSave size={14} />
              SAVE WAREHOUSE
            </SaveButton>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </Overlay>
  );
};

export default WarehouseModal;
