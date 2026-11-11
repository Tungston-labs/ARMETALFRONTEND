import React, { useEffect, useState } from "react";
import { FiSave, FiUpload } from "react-icons/fi";

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
  RequiredStar,
  ErrorText,
  Input,
  Select,
  UnitInput,
  UnitText,
  AttachmentWrapper,
  AttachmentInput,
  UploadLabel,
  HiddenFileInput,
  ButtonGroup,
  CancelButton,
  SaveButton,
} from "./InventoryModal.style";

const DEFAULT_FORM_DATA = {
  adjustmentNumber: "",
  product: "",
  adjustmentType: "Reduce Stock",
  reason: "Damaged Goods",
  adjustmentDate: "",
  warehouse: "",
  currentStock: "",
  adjustmentQuantity: "",
  adjustedStock: "",
  note: "",
  attachment: null,
};

/* =======================================================
   HELPERS
======================================================= */

const calculateAdjustedStock = (
  currentStock,
  adjustmentQuantity,
  adjustmentType,
) => {
  if (
    currentStock === "" ||
    currentStock === null ||
    adjustmentQuantity === "" ||
    adjustmentQuantity === null
  ) {
    return "";
  }

  const current = Number(currentStock);
  const quantity = Number(adjustmentQuantity);

  if (!Number.isFinite(current) || !Number.isFinite(quantity)) {
    return "";
  }

  return adjustmentType === "Add Stock" ? current + quantity : current - quantity;
};

/* =======================================================
   VALIDATION (single source of truth)
======================================================= */

const validateForm = (data) => {
  const errors = {};

  if (!data.product) {
    errors.product = "Product is required";
  }

  if (!data.adjustmentType) {
    errors.adjustmentType = "Adjustment type is required";
  }

  if (!data.warehouse) {
    errors.warehouse = "Warehouse is required";
  }

  const current = Number(data.currentStock);
  const quantity = Number(data.adjustmentQuantity);

  if (data.adjustmentQuantity === "" || data.adjustmentQuantity === null) {
    errors.adjustmentQuantity = "Quantity is required";
  } else if (!Number.isFinite(quantity) || quantity <= 0) {
    errors.adjustmentQuantity = "Quantity must be greater than 0";
  } else if (
    data.adjustmentType === "Reduce Stock" &&
    Number.isFinite(current) &&
    quantity > current
  ) {
    errors.adjustmentQuantity = "Quantity cannot exceed current stock";
  }

  if (data.currentStock === "" || !Number.isFinite(current) || current < 0) {
    errors.currentStock = "Enter a valid current stock";
  }

  return errors;
};

/* =======================================================
   COMPONENT
======================================================= */

const StockAdjustmentModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEdit = false,
  submitting = false,
  warehouses = [],
  products = [],
}) => {
  const [formData, setFormData] = useState({
    ...DEFAULT_FORM_DATA,
    ...(initialData || {}),
  });

  const [errors, setErrors] = useState({});

  /* Reset form + errors when the modal opens or a different record is edited.
     Keyed on initialData?.id so an inline object prop doesn't wipe user input. */
  useEffect(() => {
    if (!isOpen) return;

    setFormData({
      ...DEFAULT_FORM_DATA,
      ...(initialData || {}),
    });

    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData?.id]);

  /* Close with Escape */
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose, submitting]);

  /* Input changes */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => {
      const updated = { ...previous, [name]: value };

      if (name === "product") {
        const selected = products.find(
          (p) => String(p.id ?? p.value) === String(value),
        );

        updated.currentStock = selected
          ? Number(selected.currentStock) || 0
          : "";

        updated.adjustedStock = calculateAdjustedStock(
          updated.currentStock,
          previous.adjustmentQuantity,
          previous.adjustmentType,
        );
      } else if (
        name === "currentStock" ||
        name === "adjustmentQuantity" ||
        name === "adjustmentType"
      ) {
        updated.adjustedStock = calculateAdjustedStock(
          updated.currentStock,
          updated.adjustmentQuantity,
          updated.adjustmentType,
        );
      }

      return updated;
    });

    /* Clear this field's error. Also clear the quantity error when
       fields it depends on change ("exceeds current stock" rule). */
    setErrors((previous) => {
      if (!previous[name] && !previous.adjustmentQuantity) return previous;

      const next = { ...previous };
      delete next[name];

      if (["currentStock", "adjustmentType", "product"].includes(name)) {
        delete next.adjustmentQuantity;
      }

      return next;
    });
  };

  /* Attachment */
  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    setFormData((previous) => ({
      ...previous,
      attachment: file,
    }));
  };

  /* Submit */
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!onSubmit || submitting) return;

    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
  };

  /* Close on overlay click */
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && !submitting) {
      onClose();
    }
  };

  /* Unit of the selected product */
  const selectedProduct = products.find(
    (p) => String(p.id ?? p.value) === String(formData.product),
  );

  const unit = selectedProduct?.unit || "PCS";

  if (!isOpen) {
    return null;
  }

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer
        role="dialog"
        aria-modal="true"
        aria-labelledby="stock-adjustment-modal-title"
      >
        <Header>
          <Title id="stock-adjustment-modal-title">Stock Adjustment</Title>

          <Description>
            Adjust the available stock quantity for a product in a specific
            warehouse.
          </Description>
        </Header>

        <Form onSubmit={handleSubmit} noValidate>
          <FormGrid>
            {/* PRODUCT * */}
            <Field>
              <Label htmlFor="product">
                PRODUCT<RequiredStar>*</RequiredStar>
              </Label>

              <Select
                id="product"
                name="product"
                value={formData.product ?? ""}
                onChange={handleChange}
                disabled={submitting}
                $hasError={Boolean(errors.product)}
              >
                <option value="">Select</option>

                {products.length > 0 ? (
                  products.map((product) => (
                    <option
                      key={product.id ?? product.value}
                      value={product.id ?? product.value}
                    >
                      {product.name ?? product.label}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Fiber Cable">Fiber Cable</option>
                    <option value="Steel Cable">Steel Cable</option>
                    <option value="Copper Wire">Copper Wire</option>
                  </>
                )}
              </Select>

              {errors.product && <ErrorText>{errors.product}</ErrorText>}
            </Field>

            {/* ADJUSTMENT TYPE * */}
            <Field>
              <Label htmlFor="adjustmentType">
                ADJUSTMENT TYPE<RequiredStar>*</RequiredStar>
              </Label>

              <Select
                id="adjustmentType"
                name="adjustmentType"
                value={formData.adjustmentType ?? ""}
                onChange={handleChange}
                disabled={submitting}
                $hasError={Boolean(errors.adjustmentType)}
              >
                <option value="">Select</option>
                <option value="Reduce Stock">Reduce Stock</option>
                <option value="Add Stock">Add Stock</option>
              </Select>

              {errors.adjustmentType && (
                <ErrorText>{errors.adjustmentType}</ErrorText>
              )}
            </Field>

            {/* REASON */}
            <Field>
              <Label htmlFor="reason">REASON</Label>

              <Select
                id="reason"
                name="reason"
                value={formData.reason ?? ""}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="Damaged Goods">Damaged Goods</option>
                <option value="Expired Goods">Expired Goods</option>
                <option value="Stock Correction">Stock Correction</option>
                <option value="Physical Count">Physical Count</option>
                <option value="Other">Other</option>
              </Select>
            </Field>

            {/* ADJUSTMENT DATE */}
            <Field>
              <Label htmlFor="adjustmentDate">ADJUSTMENT DATE</Label>

              <Input
                id="adjustmentDate"
                name="adjustmentDate"
                type="date"
                value={formData.adjustmentDate ?? ""}
                onChange={handleChange}
                disabled={submitting}
              />
            </Field>

            {/* WAREHOUSE * */}
            <Field>
              <Label htmlFor="warehouse">
                WAREHOUSE<RequiredStar>*</RequiredStar>
              </Label>

              <Select
                id="warehouse"
                name="warehouse"
                value={formData.warehouse ?? ""}
                onChange={handleChange}
                disabled={submitting}
                $hasError={Boolean(errors.warehouse)}
              >
                <option value="">Select</option>

                {warehouses.length > 0 ? (
                  warehouses.map((warehouse) => (
                    <option
                      key={warehouse.id ?? warehouse.value}
                      value={warehouse.id ?? warehouse.value}
                    >
                      {warehouse.name ?? warehouse.label}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Bicycle WH">Bicycle WH</option>
                    <option value="Main Warehouse">Main Warehouse</option>
                    <option value="Spare Parts WH">Spare Parts WH</option>
                  </>
                )}
              </Select>

              {errors.warehouse && <ErrorText>{errors.warehouse}</ErrorText>}
            </Field>

            {/* CURRENT STOCK */}
            <Field>
              <Label htmlFor="currentStock">CURRENT STOCK</Label>

              <UnitInput>
                <Input
                  id="currentStock"
                  name="currentStock"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.currentStock ?? ""}
                  onChange={handleChange}
                  placeholder="120"
                  disabled={submitting}
                  $hasError={Boolean(errors.currentStock)}
                />

                <UnitText>{unit}</UnitText>
              </UnitInput>

              {errors.currentStock && (
                <ErrorText>{errors.currentStock}</ErrorText>
              )}
            </Field>

            {/* ADJUSTMENT QUANTITY * */}
            <Field>
              <Label htmlFor="adjustmentQuantity">
                ADJUSTMENT QUANTITY<RequiredStar>*</RequiredStar>
              </Label>

              <UnitInput>
                <Input
                  id="adjustmentQuantity"
                  name="adjustmentQuantity"
                  type="number"
                  min="0"
                  step="any"
                  value={formData.adjustmentQuantity ?? ""}
                  onChange={handleChange}
                  placeholder="05"
                  disabled={submitting}
                  $hasError={Boolean(errors.adjustmentQuantity)}
                />

                <UnitText>{unit}</UnitText>
              </UnitInput>

              {errors.adjustmentQuantity && (
                <ErrorText>{errors.adjustmentQuantity}</ErrorText>
              )}
            </Field>

            {/* ADJUSTED STOCK (calculated, read-only) */}
            <Field>
              <Label htmlFor="adjustedStock">ADJUSTED STOCK</Label>

              <UnitInput>
                <Input
                  id="adjustedStock"
                  name="adjustedStock"
                  type="number"
                  value={formData.adjustedStock ?? ""}
                  placeholder="Calculated automatically"
                  readOnly
                  disabled
                />

                <UnitText>{unit}</UnitText>
              </UnitInput>
            </Field>

            {/* NOTE */}
            <Field>
              <Label htmlFor="note">NOTE</Label>

              <Select
                id="note"
                name="note"
                value={formData.note ?? ""}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="">Select Note</option>
                <option value="Damaged Goods">Damaged Goods</option>
                <option value="Returned Stock">Returned Stock</option>
                <option value="Lost/Missing">Lost/Missing</option>
                <option value="New Stock Received">New Stock Received</option>
                <option value="Others">Others</option>
              </Select>
            </Field>

            {/* ATTACHMENT */}
            <Field>
              <Label htmlFor="attachment">ATTACHMENT</Label>

              <AttachmentWrapper>
                <AttachmentInput
                  type="text"
                  value={
                    formData.attachment?.name ||
                    initialData?.attachmentName ||
                    "-"
                  }
                  placeholder="-"
                  readOnly
                  aria-label="Selected attachment"
                />

                <UploadLabel htmlFor="attachment">
                  <FiUpload size={14} />
                </UploadLabel>

                <HiddenFileInput
                  id="attachment"
                  name="attachment"
                  type="file"
                  onChange={handleFileChange}
                  disabled={submitting}
                />
              </AttachmentWrapper>
            </Field>
          </FormGrid>

          {/* BUTTONS */}
          <ButtonGroup>
            <CancelButton type="button" onClick={onClose} disabled={submitting}>
              CANCEL
            </CancelButton>

            <SaveButton type="submit" disabled={submitting}>
              <FiSave size={13} />

              {submitting
                ? "SAVING..."
                : isEdit
                  ? "UPDATE ADJUSTMENT"
                  : "SAVE ADJUSTMENT"}
            </SaveButton>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </Overlay>
  );
};

export default StockAdjustmentModal;