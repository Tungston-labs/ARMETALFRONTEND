import React from "react";
import { FiChevronDown, FiPlus, FiX } from "react-icons/fi";

// Copy AddingInvoice.styles.js next to this file and rename it to
// AddingPurchaseOrder.styles.js so both pages look identical.
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
  WAREHOUSES,
  SHIPPING_METHODS,
} from "./Useaddingpurchaseorder";

const errorStyle = { borderColor: "#c0392b" };

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
    vendors,
    rows,
    summary,
    isSaving,
    isEdit,
    isLoading,
    setField,
    handleVendorChange,
    addItem,
    removeItem,
    updateItem,
    handleSave,
    handleCancel,
    navigate,
  } = useAddingPurchaseOrder();

  const vendorOptions = vendors.map((v) => ({
    value: String(v.id),
    label: v.name || `Vendor #${v.id}`,
  }));

  const onSelect = (e) => setField(e.target.name, e.target.value);

  return (
    <InvoiceContainer>
      <ReusableHeader
        title={isEdit ? "Edit Purchase Order" : "Create Purchase Order"}
        breadcrumbs={["Purchases", "Purchase Orders"]}
        showBack
        onBack={() => navigate(-1)}
      />

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
                placeholder="PO001"
                value={form.poNumber}
                onChange={(e) => setField("poNumber", e.target.value)}
                style={errors.poNumber ? errorStyle : undefined}
              />
              <ErrorText>{errors.poNumber}</ErrorText>
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
              options={WAREHOUSES}
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
                  <th>Item</th>
                  <th>Description</th>
                  <th>QTY</th>
                  <th>Unit</th>
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
                        <input
                          placeholder="Item name"
                          value={row.item}
                          onChange={(e) => updateItem(row.id, "item", e.target.value)}
                          style={rowErrors.item ? errorStyle : undefined}
                        />
                        <ErrorText>{rowErrors.item}</ErrorText>
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
                          placeholder="Nos"
                          value={row.unit}
                          onChange={(e) => updateItem(row.id, "unit", e.target.value)}
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
                <strong className="discount">{summary.discount}</strong>
              </SummaryRow>
              <SummaryRow>
                <span>Round Off</span>
                <strong>{summary.roundOff}</strong>
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