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
  adjustmentDate: "",
  warehouse: "",
  product: "",
  adjustmentType: "Reduce Stock",
  reason: "Damaged Goods",
  currentStock: "",
  adjustmentQuantity: "",
  adjustedStock: "",
  note: "",
  attachment: null,
};

/* =======================================================
   VALIDATION
   Required: product, adjustmentType, warehouse, adjustmentQuantity
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

  if (data.adjustmentQuantity === "" || data.adjustmentQuantity === null) {
    errors.adjustmentQuantity = "Quantity is required";
  } else if (Number(data.adjustmentQuantity) <= 0) {
    errors.adjustmentQuantity = "Quantity must be greater than 0";
  }

  return errors;
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
  const [formData, setFormData] = useState({
    ...DEFAULT_FORM_DATA,
    ...(initialData || {}),
  });

  const [errors, setErrors] = useState({});

  /* =======================================================
     RESET FORM + ERRORS WHEN MODAL OPENS
  ======================================================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormData({
      ...DEFAULT_FORM_DATA,
      ...(initialData || {}),
    });

    setErrors({});
  }, [isOpen, initialData]);

  /* =======================================================
     ESCAPE KEY
  ======================================================= */

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

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

  /* =======================================================
     CALCULATE ADJUSTED STOCK
  ======================================================= */

  const calculateAdjustedStock = (
    currentStock,
    adjustmentQuantity,
    adjustmentType,
  ) => {
    const current = Number(currentStock) || 0;
    const quantity = Number(adjustmentQuantity) || 0;

    if (adjustmentType === "Add Stock") {
      return current + quantity;
    }

    return current - quantity;
  };

  /* =======================================================
     INPUT CHANGE
  ======================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => {
      const updated = {
        ...previous,
        [name]: value,
      };

      if (name === "product") {
        // product selected -> fetch its current stock
        const selected = products.find(
          (p) => String(p.id ?? p.value) === String(value),
        );

        updated.currentStock = selected
          ? Number(selected.currentStock) || 0
          : "";

        updated.adjustedStock = selected
          ? calculateAdjustedStock(
              updated.currentStock,
              previous.adjustmentQuantity,
              previous.adjustmentType,
            )
          : "";
      } else if (
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

    // clear the error of the field being edited
    if (errors[name]) {
      setErrors((previous) => {
        const next = { ...previous };
        delete next[name];
        return next;
      });
    }
  };

  /* =======================================================
     FILE CHANGE
  ======================================================= */

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    setFormData((previous) => ({
      ...previous,
      attachment: file,
    }));
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!onSubmit || submitting) {
      return;
    }

    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
  };

  /* =======================================================
     OVERLAY
  ======================================================= */

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget && !submitting) {
      onClose();
    }
  };

  /* =======================================================
     UNIT OF THE SELECTED PRODUCT
  ======================================================= */

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
        {/* =====================================================
            HEADER
        ===================================================== */}

        <Header>
          <Title id="stock-adjustment-modal-title">Stock Adjustment</Title>

          <Description>
            Adjust the available stock quantity for a product in a specific
            warehouse.
          </Description>
        </Header>

        {/* =====================================================
            FORM
        ===================================================== */}

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
                  value={formData.currentStock ?? ""}
                  onChange={handleChange}
                  placeholder="120"
                  disabled={submitting}
                />

                <UnitText>{unit}</UnitText>
              </UnitInput>
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

            {/* ADJUSTED STOCK */}

            <Field>
              <Label htmlFor="adjustedStock">ADJUSTED STOCK</Label>

              <UnitInput>
                <Input
                  id="adjustedStock"
                  name="adjustedStock"
                  type="number"
                  min="0"
                  value={formData.adjustedStock ?? ""}
                  onChange={handleChange}
                  placeholder="Enter adjusted stock"
                  disabled={submitting}
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
                    (initialData?.attachmentName ?? "-")
                  }
                  placeholder="-"
                  readOnly
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

          {/* =====================================================
              BUTTONS
          ===================================================== */}

          <ButtonGroup>
            <CancelButton type="button" onClick={onClose} disabled={submitting}>
              CANCEL
            </CancelButton>

            <SaveButton type="submit" disabled={submitting}>
              <FiSave size={14} />

              {submitting
                ? "SAVING..."
                : isEdit
                  ? "UPDATE ADJUSTMENT"
                  : "CONFIRM ADJUSTMENT"}
            </SaveButton>
          </ButtonGroup>
        </Form>
      </ModalContainer>
    </Overlay>
  );
};

export default StockAdjustmentModal;