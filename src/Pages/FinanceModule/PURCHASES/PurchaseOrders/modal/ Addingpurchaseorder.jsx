import React from "react";
import styled from "styled-components";
import { FiChevronDown, FiPlus, FiX } from "react-icons/fi";

// Copy of AddingInvoice.styles.js
import {
  InvoiceContainer,
  InvoiceForm,
  SectionTitle,
  FormGrid,
  FormGroup,
  Label,
  Input,
  SelectWrapper,
  Select,
  CalendarInput,
  InvoiceItemsHeader,
  AddItemButton,
  InvoiceTableWrapper,
  InvoiceTable,
  DeleteButton,
  PaymentSection,
  PaymentRight,
  SummaryRow,
  TotalAmount,
  ButtonWrapper,
  CancelButton,
  PreviewButton,
} from "./AddingPurchaseOrder.styles";

import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";
import useAddingPurchaseOrder, {
  PAYMENT_TERMS,
  ORDER_STATUSES,
  SHIPPING_METHODS,
} from "./Useaddingpurchaseorder";

const errorStyle = { borderColor: "#c0392b" };

// Editable amounts in the summary (Discount, Round Off)
const SummaryInput = styled.input`
  width: 110px;
  height: 30px;
  padding: 0 8px;
  box-sizing: border-box;
  text-align: right;

  border: 1px solid #e2e5ea;
  border-radius: 4px;

  font-family: "Poppins", sans-serif;
  font-size: 12px;
  outline: none;

  &:focus {
    border-color: #3049a3;
  }
`;

// Product <select> inside the items table, styled like the table's inputs
const cellSelectStyle = {
  width: "100%",
  height: 32,
  boxSizing: "border-box",
  padding: "0 6px",
  border: "1px solid #e3e5e8",
  borderRadius: 3,
  background: "#fff",
  color: "#4b5563",
  fontFamily: "Poppins, sans-serif",
  fontSize: 11,
  outline: "none",
};

const ErrorText = ({ children }) =>
  children ? (
    <span
      style={{
        display: "block",
        color: "#c0392b",
        fontSize: "12px",
        marginTop: "4px",
      }}
    >
      {children}
    </span>
  ) : null;

// Label + native <select> with the chevron used across the app
const SelectField = ({ label, name, value, onChange, options, placeholder, error }) => (
  <FormGroup>
    <Label>{label}</Label>
    <SelectWrapper>
      <Select
        name={name}
        value={value}
        onChange={onChange}
        style={error ? errorStyle : undefined}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
      <FiChevronDown />
    </SelectWrapper>
    <ErrorText>{error}</ErrorText>
  </FormGroup>
);

const AddingPurchaseOrder = () => {
  const {
    form,
    errors,
    saveError,
    rows,
    summary,
    isSaving,
    isEdit,
    isLoading,
    vendorOptions,
    warehouseOptions,
    productOptions,
    setField,
    handleVendorChange,
    addItem,
    removeItem,
    updateItem,
    selectProduct,
    handleSave,
    handleCancel,
  } = useAddingPurchaseOrder();

  const onSelect = (e) => setField(e.target.name, e.target.value);

  return (
    <InvoiceContainer>
      <ReusableHeader
        title={isEdit ? "Edit Purchase Order" : "Create Purchase Order"}
        breadcrumbs={["Purchases", "Purchase Orders"]}
        showBack
        onBack={handleCancel}
      />

      {saveError && (
        <div
          style={{
            margin: "12px 0 0",
            padding: "10px 14px",
            borderRadius: 6,
            background: "#FDEEEE",
            color: "#B00020",
            fontSize: 14,
          }}
        >
          {saveError}
        </div>
      )}

      {isLoading ? (
        <p style={{ padding: "24px" }}>Loading purchase order...</p>
      ) : (
        <InvoiceForm>
          <FormGrid>
            <SelectField
              label="VENDOR NAME"
              name="vendorId"
              value={form.vendorId}
              onChange={handleVendorChange}
              options={vendorOptions}
              placeholder="Select Vendor"
              error={errors.vendorId}
            />

            <FormGroup>
              <Label>PO NUMBER</Label>
              <Input
                name="poNumber"
                placeholder="Auto-generated"
                value={form.poNumber}
                readOnly
              />
            </FormGroup>

            <FormGroup>
              <Label>PR REFERENCE</Label>
              <Input
                name="prReference"
                placeholder="PR-2026-001"
                value={form.prReference}
                onChange={(e) => setField("prReference", e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>ORDER DATE</Label>
              <CalendarInput>
                <Input
                  type="date"
                  value={form.orderDate}
                  max={form.expectedDate || undefined}
                  onChange={(e) => setField("orderDate", e.target.value)}
                  style={errors.orderDate ? errorStyle : undefined}
                />
              </CalendarInput>
              <ErrorText>{errors.orderDate}</ErrorText>
            </FormGroup>

            <FormGroup>
              <Label>EXPECTED DELIVERY DATE</Label>
              <CalendarInput>
                <Input
                  type="date"
                  value={form.expectedDate}
                  min={form.orderDate || undefined}
                  onChange={(e) => setField("expectedDate", e.target.value)}
                  style={errors.expectedDate ? errorStyle : undefined}
                />
              </CalendarInput>
              <ErrorText>{errors.expectedDate}</ErrorText>
            </FormGroup>

            <SelectField
              label="PAYMENT TERMS"
              name="paymentTerm"
              value={form.paymentTerm}
              onChange={onSelect}
              options={PAYMENT_TERMS}
              placeholder="Select Payment Terms"
              error={errors.paymentTerm}
            />

            <SelectField
              label="ORDER STATUS"
              name="orderStatus"
              value={form.orderStatus}
              onChange={onSelect}
              options={ORDER_STATUSES}
              placeholder="Select Order Status"
              error={errors.orderStatus}
            />

            <SelectField
              label="RECEIVING WAREHOUSE"
              name="warehouse"
              value={form.warehouse}
              onChange={onSelect}
              options={warehouseOptions}
              placeholder="Select Warehouse"
              error={errors.warehouse}
            />

            <SelectField
              label="SHIPPING METHOD"
              name="shippingMethod"
              value={form.shippingMethod}
              onChange={onSelect}
              options={SHIPPING_METHODS}
              placeholder="Select Shipping Method"
              error={errors.shippingMethod}
            />
          </FormGrid>

          {/* ---------- Items ---------- */}
          <InvoiceItemsHeader>
            <SectionTitle>ORDER ITEMS</SectionTitle>
            <AddItemButton type="button" onClick={addItem}>
              <FiPlus />
              ADD ITEM
            </AddItemButton>
          </InvoiceItemsHeader>

          <InvoiceTableWrapper>
            <InvoiceTable>
              <thead>
                <tr>
                  <th>SL No</th>
                  <th>Product</th>
                  <th>Description</th>
                  <th>QTY</th>
                  <th>HS Code</th>
                  <th>Rate</th>
                  <th>VAT (%)</th>
                  <th>VAT</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => {
                  const rowErrors = errors.items?.[row.id] || {};
                  return (
                    <tr key={row.id}>
                      <td>{row.slNo}</td>
                      <td>
                        <select
                          value={row.product}
                          onChange={(e) => selectProduct(row.id, e.target.value)}
                          style={{
                            ...cellSelectStyle,
                            ...(rowErrors.product ? errorStyle : {}),
                          }}
                        >
                          <option value="">Select</option>
                          {productOptions.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                        <ErrorText>{rowErrors.product}</ErrorText>
                      </td>
                      <td>
                        <input
                          placeholder="Description"
                          value={row.description}
                          onChange={(e) =>
                            updateItem(row.id, "description", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          value={row.qty}
                          onChange={(e) => updateItem(row.id, "qty", e.target.value)}
                          style={rowErrors.qty ? errorStyle : undefined}
                        />
                        <ErrorText>{rowErrors.qty}</ErrorText>
                      </td>
                      <td>
                        <input
                          placeholder="HS code"
                          value={row.hsCode}
                          onChange={(e) => updateItem(row.id, "hsCode", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={row.rate}
                          onChange={(e) => updateItem(row.id, "rate", e.target.value)}
                          style={rowErrors.rate ? errorStyle : undefined}
                        />
                        <ErrorText>{rowErrors.rate}</ErrorText>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          value={row.vat}
                          onChange={(e) => updateItem(row.id, "vat", e.target.value)}
                        />
                      </td>
                      {/* Calculated, so read-only */}
                      <td>
                        <input value={row.vatAmount} readOnly />
                      </td>
                      <td>
                        <input value={row.amount} readOnly />
                      </td>
                      <td>
                        <DeleteButton
                          type="button"
                          onClick={() => removeItem(row.id)}
                          aria-label="Remove item"
                        >
                          <FiX />
                        </DeleteButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </InvoiceTable>
          </InvoiceTableWrapper>

          {/* ---------- Summary ---------- */}
          <PaymentSection>
            <PaymentRight>
              <SummaryRow>
                <span>Sub Total</span>
                <strong>{summary.subTotal}</strong>
              </SummaryRow>
              <SummaryRow>
                <span>Total VAT</span>
                <strong>{summary.vat}</strong>
              </SummaryRow>
              <SummaryRow>
                <span>Discount</span>
                <SummaryInput
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.discount}
                  onChange={(e) => setField("discount", e.target.value)}
                />
              </SummaryRow>
              <SummaryRow>
                <span>Round Off</span>
                <SummaryInput
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.roundOff}
                  onChange={(e) => setField("roundOff", e.target.value)}
                />
              </SummaryRow>
              <TotalAmount>
                <span>TOTAL AMOUNT</span>
                <strong>{summary.total}</strong>
              </TotalAmount>
            </PaymentRight>
          </PaymentSection>

          <ButtonWrapper>
            <CancelButton type="button" onClick={handleCancel}>
              CANCEL
            </CancelButton>
            <PreviewButton type="button" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "SAVING..." : isEdit ? "UPDATE" : "SAVE"}
            </PreviewButton>
          </ButtonWrapper>
        </InvoiceForm>
      )}
    </InvoiceContainer>
  );
};

export default AddingPurchaseOrder;