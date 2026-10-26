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
  const [formData, setFormData] = useState({
    ...DEFAULT_FORM_DATA,
    ...(initialData || {}),
  });

  /* =======================================================
     RESET FORM WHEN MODAL OPENS
  ======================================================= */

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormData({
      ...DEFAULT_FORM_DATA,
      ...(initialData || {}),
    });
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

        <Form onSubmit={handleSubmit}>
          <FormGrid>
            {/* =================================================
                ROW 1
            ================================================= */}

            {/* ADJUSTMENT NUMBER */}

            <Field>
              <Label htmlFor="adjustmentNumber">ADJUSTMENT NUMBER</Label>

              <Input
                id="adjustmentNumber"
                name="adjustmentNumber"
                value={formData.adjustmentNumber ?? ""}
                onChange={handleChange}
                placeholder="SA20260008"
                readOnly={isEdit}
                disabled={submitting}
              />
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
              <Label htmlFor="warehouse">WAREHOUSE</Label>

              <Select
                id="warehouse"
                name="warehouse"
                value={formData.warehouse ?? ""}
                onChange={handleChange}
                disabled={submitting}
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

            {/* PRODUCT */}

            <Field>
              <Label htmlFor="product">PRODUCT</Label>

              <Select
                id="product"
                name="product"
                value={formData.product ?? ""}
                onChange={handleChange}
                disabled={submitting}
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
            </Field>

            {/* ADJUSTMENT TYPE */}

            <Field>
              <Label htmlFor="adjustmentType">ADJUSTMENT TYPE</Label>

              <Select
                id="adjustmentType"
                name="adjustmentType"
                value={formData.adjustmentType ?? ""}
                onChange={handleChange}
                disabled={submitting}
              >
                <option value="Reduce Stock">Reduce Stock</option>

                <option value="Add Stock">Add Stock</option>
              </Select>
            </Field>

            {/* =================================================
                ROW 2
            ================================================= */}

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

                <UnitText>PCS</UnitText>
              </UnitInput>
            </Field>

            {/* ADJUSTMENT QUANTITY */}

            <Field>
              <Label htmlFor="adjustmentQuantity">ADJUSTMENT QUANTITY</Label>

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
                  readOnly
                />

                <UnitText>PCS</UnitText>
              </UnitInput>
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
