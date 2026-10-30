import React, { useEffect, useState } from "react";
import { FiSave, FiUpload, FiChevronDown } from "react-icons/fi";

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
  UnitInput,
  UnitText,
  NoteWrapper,
  NoteInput,
  NoteChevron,
  AttachmentWrapper,
  AttachmentInput,
  UploadLabel,
  HiddenFileInput,
  ButtonGroup,
  CancelButton,
  SaveButton,
  ErrorMessage,
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
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [validationError, setValidationError] = useState("");

  // Reset form whenever modal opens or edit data changes.
  useEffect(() => {
    if (!isOpen) return;

    const initial = {
      ...DEFAULT_FORM_DATA,
      ...(initialData || {}),
    };

    const current = initial.currentStock;
    const quantity = initial.adjustmentQuantity;

    if (
      current !== "" &&
      current !== null &&
      quantity !== "" &&
      quantity !== null
    ) {
      const currentValue = Number(current) || 0;
      const quantityValue = Number(quantity) || 0;

      initial.adjustedStock =
        initial.adjustmentType === "Add Stock"
          ? currentValue + quantityValue
          : currentValue - quantityValue;
    }

    setFormData(initial);
    setValidationError("");
  }, [isOpen, initialData]);

  // Close modal using Escape key.
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

  // Calculate adjusted stock.
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

    return adjustmentType === "Add Stock"
      ? current + quantity
      : current - quantity;
  };

  // Handle normal input changes.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setValidationError("");

    setFormData((previous) => {
      const updated = {
        ...previous,
        [name]: value,
      };

      if (
        name === "currentStock" ||
        name === "adjustmentQuantity" ||
        name === "adjustmentType"
      ) {
        updated.adjustedStock = calculateAdjustedStock(
          name === "currentStock" ? value : previous.currentStock,
          name === "adjustmentQuantity" ? value : previous.adjustmentQuantity,
          name === "adjustmentType" ? value : previous.adjustmentType,
        );
      }

      return updated;
    });
  };

  // Handle attachment selection.
  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    setFormData((previous) => ({
      ...previous,
      attachment: file,
    }));
  };

  // Validate and submit form.
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!onSubmit || submitting) return;

    const current = Number(formData.currentStock);
    const quantity = Number(formData.adjustmentQuantity);
    const adjusted = Number(formData.adjustedStock);

    if (!formData.product) {
      setValidationError("Please select a product.");
      return;
    }

    if (!formData.warehouse) {
      setValidationError("Please select a warehouse.");
      return;
    }

    if (
      formData.adjustmentQuantity === "" ||
      !Number.isFinite(quantity) ||
      quantity <= 0
    ) {
      setValidationError("Please enter a valid adjustment quantity.");
      return;
    }

    if (
      formData.currentStock === "" ||
      !Number.isFinite(current) ||
      current < 0
    ) {
      setValidationError("Please enter a valid current stock.");
      return;
    }

    if (formData.adjustmentType === "Reduce Stock" && quantity > current) {
      setValidationError("Adjustment quantity cannot exceed current stock.");
      return;
    }

    if (!Number.isFinite(adjusted) || adjusted < 0) {
      setValidationError("Adjusted stock cannot be negative.");
      return;
    }

    onSubmit(formData);
  };

  // Close when clicking outside the modal.
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && !submitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

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

        <Form onSubmit={handleSubmit}>
          <FormGrid>
            {/* ROW 1 - PRODUCT */}

            <Field>
              <Label htmlFor="product">
                PRODUCT <span>*</span>
              </Label>

              <Select
                id="product"
                name="product"
                value={formData.product ?? ""}
                onChange={handleChange}
                disabled={submitting}
                required
              >
                <option value="">-----</option>

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
            </Field>

            {/* ADJUSTMENT TYPE */}

            <Field>
              <Label htmlFor="adjustmentType">
                ADJUSTMENT TYPE <span>*</span>
              </Label>

              <Select
                id="adjustmentType"
                name="adjustmentType"
                value={formData.adjustmentType}
                onChange={handleChange}
                disabled={submitting}
                required
              >
                <option value="Reduce Stock">Reduce Stock</option>
                <option value="Add Stock">Add Stock</option>
              </Select>
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

            {/* WAREHOUSE */}

            <Field>
              <Label htmlFor="warehouse">
                WAREHOUSE <span>*</span>
              </Label>

              <Select
                id="warehouse"
                name="warehouse"
                value={formData.warehouse ?? ""}
                onChange={handleChange}
                disabled={submitting}
                required
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
            </Field>

            {/* ROW 2 - CURRENT STOCK */}

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
                />

                <UnitText>PCS</UnitText>
              </UnitInput>
            </Field>

            {/* ADJUSTMENT QUANTITY */}

            <Field>
              <Label htmlFor="adjustmentQuantity">
                ADJUSTMENT QUANTITY <span>*</span>
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
                  required
                />

                <UnitText>PCS</UnitText>
              </UnitInput>
            </Field>

            {/* ADJUSTED STOCK */}

            <Field>
              <Label htmlFor="adjustedStock">ADJUSTED STOCK</Label>

              <UnitInput>
                <Input
                  id="adjustedStock"
                  name="adjustedStock"
                  type="number"
                  value={formData.adjustedStock ?? ""}
                  placeholder="115"
                  readOnly
                  disabled={submitting}
                />

                <UnitText>PCS</UnitText>
              </UnitInput>
            </Field>

            {/* NOTE */}

            <Field>
              <Label htmlFor="note">NOTE</Label>

              <NoteWrapper>
                <NoteInput
                  id="note"
                  name="note"
                  type="text"
                  value={formData.note ?? ""}
                  onChange={handleChange}
                  placeholder="Add any extra details"
                  disabled={submitting}
                />

                <NoteChevron>
                  <FiChevronDown size={15} />
                </NoteChevron>
              </NoteWrapper>
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

          {validationError && (
            <ErrorMessage role="alert">{validationError}</ErrorMessage>
          )}

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
