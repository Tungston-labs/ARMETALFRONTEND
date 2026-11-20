import React from "react";
import { FiChevronDown, FiX } from "react-icons/fi";
import {
  CreateBillContainer,
  FormGrid,
  FormGroup,
  Label,
  Input,
  SelectWrapper,
  Select,
  SelectIcon,
  ItemsTitle,
  ItemsTable,
  TableHeader,
  TableRow,
  TableCell,
  SmallInput,
  RemoveButton,
  SummaryWrapper,
  SummaryRow,
  TotalAmount,
  ButtonWrapper,
  CancelButton,
  PreviewButton,
  AddButton,
} from "./CreateBill.style";
import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";
import useCreateBill, {
  PAYMENT_TERMS,
  BILL_STATUSES,
  fmt,
} from "./useCreateBill";

// Label + native <select> with the chevron
const SelectField = ({ label, value, onChange, children }) => (
  <FormGroup>
    <Label>{label}</Label>
    <SelectWrapper>
      <Select value={value} onChange={onChange}>
        {children}
      </Select>
      <SelectIcon>
        <FiChevronDown />
      </SelectIcon>
    </SelectWrapper>
  </FormGroup>
);

// Label + text input bound to a form field
const TextField = ({ label, field, form, onChange, ...rest }) => (
  <FormGroup>
    <Label>{label}</Label>
    <Input
      value={form[field]}
      onChange={(e) => onChange(field, e.target.value)}
      {...rest}
    />
  </FormGroup>
);

const CreateBill = () => {
  const {
    form,
    rows,
    calculations,
    isSaving,
    isEdit,
    poOptions,
handlePoChange,
    handleChange,
    handleItemChange,
    handleAddItem,
    handleRemoveItem,
    handleSave,
    handleCancel,
  } = useCreateBill();

  const cellInput = (row, field, props = {}) => (
    <SmallInput
      value={row[field]}
      onChange={(e) => handleItemChange(row.id, field, e.target.value)}
      {...props}
    />
  );

  return (
    <CreateBillContainer>
      <ReusableHeader
        title={isEdit ? "Edit Bill" : "Create Bill"}
        breadcrumbs={["Purchases", "Bill"]}
        showBack
        onBack={handleCancel}
      />

      <FormGrid>
        <FormGroup>
          <Label>BILL NUMBER</Label>
          <Input
            placeholder="Auto-generated bill number"
            value={form.billNumber}
            readOnly
          />
        </FormGroup>

        <SelectField
  label="PURCHASE ORDER REFERENCE"
  value={form.purchaseOrderReference}
  onChange={(e) => handlePoChange(e.target.value)}
>
  <option value="">Select Purchase Order</option>
  {poOptions.map((o) => (
    <option key={o.value} value={o.value}>
      {o.label}
    </option>
  ))}
</SelectField>

        <TextField
          label="BILL DATE"
          field="billDate"
          form={form}
          onChange={handleChange}
          type="date"
        />

        <TextField
          label="DUE DATE"
          field="dueDate"
          form={form}
          onChange={handleChange}
          type="date"
          min={form.billDate || undefined}
        />

        <SelectField
          label="PAYMENT TERMS"
          value={form.paymentTerms}
          onChange={(e) => handleChange("paymentTerms", e.target.value)}
        >
          {PAYMENT_TERMS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </SelectField>

        <SelectField
          label="BILL STATUS"
          value={form.billStatus}
          onChange={(e) => handleChange("billStatus", e.target.value)}
        >
          {BILL_STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </SelectField>

        <TextField
          label="NOTE"
          field="note"
          form={form}
          onChange={handleChange}
          placeholder="Enter Note"
        />
<br/>
        <TextField label="FROM" field="from" form={form} onChange={handleChange} placeholder="From" />
        <TextField label="ADDRESS" field="fromAddress" form={form} onChange={handleChange} placeholder="Address" />
        <TextField label="PHONE NUMBER" field="phoneNumber" form={form} onChange={handleChange} placeholder="Phone number" />
        <TextField label="EMAIL ID" field="email" form={form} onChange={handleChange} placeholder="Email" />

        <SelectField
          label="VENDOR NAME"
          value={form.billTo}
          onChange={(e) => handleChange("billTo", e.target.value)}
        >
          <option value="">Company/Client Name</option>
          <option>Mediora</option>
          <option>Chicking</option>
        </SelectField>

        <TextField label="ADDRESS" field="billToAddress" form={form} onChange={handleChange} placeholder="Company/Client ADDRESS" />
        <TextField label="PHONE NUMBER" field="billToPhone" form={form} onChange={handleChange} placeholder="Company/Client Phone Number" />
        <TextField label="FINANCE CONTACT EMAIL" field="financeEmail" form={form} onChange={handleChange} placeholder="Company/Client Email ID" />
      </FormGrid>

      {/* ---------- Items ---------- */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <ItemsTitle>ITEMS</ItemsTitle>
        <AddButton type="button" onClick={handleAddItem}>
          + ADD ITEM
        </AddButton>
      </div>

      <ItemsTable style={{ marginTop: 12 }}>
        <TableHeader>
          <span>SL No</span>
          <span>Products</span>
          <span>Particular</span>
          <span>QTY</span>
          <span>HS Code</span>
          <span>Rate</span>
          <span>VAT (%)</span>
          <span>VAT (SAR)</span>
          <span>Amount</span>
          <span>Action</span>
        </TableHeader>

        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell>{row.slNo}</TableCell>
            <TableCell>{cellInput(row, "product", { placeholder: "Product" })}</TableCell>
            <TableCell>{cellInput(row, "particular", { placeholder: "Description" })}</TableCell>
            <TableCell>{cellInput(row, "qty", { type: "number", min: "0" })}</TableCell>
            <TableCell>{cellInput(row, "hsCode", { placeholder: "HS code" })}</TableCell>
            <TableCell>{cellInput(row, "rate", { type: "number", min: "0", step: "0.01" })}</TableCell>
            <TableCell>{cellInput(row, "vat", { type: "number", min: "0" })}</TableCell>
            <TableCell>SAR {fmt(row.vatAmount)}</TableCell>
            <TableCell>
            SAR {fmt(row.amount)}
            </TableCell>
            <TableCell>
              <RemoveButton
                type="button"
                onClick={() => handleRemoveItem(row.id)}
                aria-label="Remove item"
              >
                <FiX />
              </RemoveButton>
            </TableCell>
          </TableRow>
        ))}
      </ItemsTable>

      {/* ---------- Summary ---------- */}
      <SummaryWrapper>
        <SummaryRow>
          <span>Sub Total</span>
          <strong>SAR {fmt(calculations.subtotal)}</strong>
        </SummaryRow>

        <SummaryRow>
          <span>Total VAT</span>
          <strong>SAR {fmt(calculations.vat)}</strong>
        </SummaryRow>

        <SummaryRow>
          <span>Discount</span>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.discount}
            onChange={(e) => handleChange("discount", e.target.value)}
            style={{ width: 130, height: 32, textAlign: "right" }}
          />
        </SummaryRow>

        <TotalAmount>
          <span>TOTAL AMOUNT</span>
          <strong>SAR {fmt(calculations.total)}</strong>
        </TotalAmount>
      </SummaryWrapper>

      <ButtonWrapper>
        <CancelButton type="button" onClick={handleCancel} disabled={isSaving}>
          CANCEL
        </CancelButton>
         <CancelButton type="button" onClick={handleCancel} disabled={isSaving}>
       SAVE DRAFT
        </CancelButton>
        <CancelButton type="button" onClick={handleCancel} disabled={isSaving}>
        DOWNLOAD
        </CancelButton>
        <PreviewButton type="button" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "SAVING..." : isEdit ? "UPDATE" : "SEND"}
        </PreviewButton>
      </ButtonWrapper>
    </CreateBillContainer>
  );
};

export default CreateBill;