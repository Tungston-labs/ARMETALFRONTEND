import React, { useEffect, useMemo, useState } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";
import {
  addDebitNote,
  editDebitNote,
  getDebitNoteById,
  getBillDebitDetails,
  exportDebitNoteList,
  clearDebitNoteError,
  clearDebitNoteMessage,
} from "../../../../../Redux/finance/purchases/debitNoteSlice";

import {
  CreateBillContainer,
  FormGrid,
  FormGroup,
  Label,
  Input,
  SelectWrapper,
  Select,
  SelectIcon,
  ItemsHeader,
  ItemsTitle,
  ItemsTable,
  TableHeader,
  TableRow,
  TableCell,
  SmallInput,
  RemoveButton,
  BottomSection,
  NotesGroup,
  NotesTextarea,
  BottomSummary,
  SummaryRow,
  TotalAmount,
  ErrorMessage,
  LoadingMessage,
  ButtonWrapper,
  CancelButton,
  PreviewButton,
  AddButton,
} from "./CreateDebitNote.styles";

/* =========================================================
   CONSTANTS / HELPERS
========================================================= */

const LIST_ROUTE = "/purchases/debit-notes";

const REASONS = [
  { value: "damaged_goods", label: "Damaged Goods" },
  { value: "short_delivery", label: "Short Delivery" },
  { value: "purchase_return", label: "Purchase Return" },
  { value: "billing_error", label: "Billing Error" },
];

const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "issued", label: "Issued" },
  { value: "applied", label: "Applied" },
  { value: "cancelled", label: "Cancelled" },
];

const fmt = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const numberOrNull = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

let nextItemId = 1;
const newItem = (overrides = {}) => ({
  id: nextItemId++,
  product: "",
  reasonDetail: "",
  qty: "1",
  rate: "",
  vat: "15",
  ...overrides,
});

const emptyForm = {
  debitNoteNumber: "",
  billId: "",
  issueDate: "",
  reason: "damaged_goods",
  status: "pending",
  billValue: "",
  alreadyDebited: "",
  remainingBalance: "",
  companyName: "TUNGSTON LABS",
  companyAddress: "Tungston Labs, Ullampilly Building,...",
  companyPhone: "+91 97783 77526",
  companyEmail: "info@tungstonlabs.com",
  vendorId: "",
  vendorAddress: "",
  vendorPhone: "",
  vendorEmail: "",
  notes: "",
};

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

/* =========================================================
   COMPONENT
========================================================= */

const CreateDebitNote = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const { selectedDebitNote, submitting, detailsLoading, error } = useSelector(
    (state) => state.debitNote || {},
  );

  const [form, setForm] = useState(emptyForm);
  const [items, setItems] = useState([newItem()]);

  /* ---------- Load for edit ---------- */

  useEffect(() => {
    if (!isEdit) return;
    dispatch(getDebitNoteById(id));
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (!isEdit || !selectedDebitNote) return;

    const data = selectedDebitNote?.data || selectedDebitNote;

    setForm({
      debitNoteNumber: data.debit_note_number || data.debitNoteNumber || "",
      billId: data.bill_id || data.bill?.id || data.bill || "",
      issueDate: data.issue_date || "",
      reason: data.reason || "damaged_goods",
      status: data.status || "pending",
      billValue: data.bill_value ?? data.bill_amount ?? "",
      alreadyDebited: data.already_debited ?? "",
      remainingBalance: data.remaining_balance ?? "",
      companyName: data.company_name || emptyForm.companyName,
      companyAddress: data.company_address || "",
      companyPhone: data.company_phone || "",
      companyEmail: data.company_email || "",
      vendorId: data.vendor_id || data.vendor?.id || data.vendor || "",
      vendorAddress: data.vendor_address || "",
      vendorPhone: data.vendor_phone || "",
      vendorEmail: data.vendor_email || "",
      notes: data.notes || "",
    });

    if (Array.isArray(data.items) && data.items.length) {
      setItems(
        data.items.map((item) =>
          newItem({
            product: String(item.product_id ?? item.product ?? ""),
            reasonDetail: item.reason_detail || "",
            qty: String(item.quantity ?? item.qty ?? ""),
            rate: String(item.rate ?? ""),
            vat: String(item.vat_percentage ?? item.vat ?? "15"),
          }),
        ),
      );
    }
  }, [isEdit, selectedDebitNote]);

  /* ---------- Form ---------- */

  const handleChange = (field, value) =>
    setForm((previous) => ({ ...previous, [field]: value }));

  // Look up bill details when the Bill ID field loses focus
  const handleBillBlur = async () => {
    const value = String(form.billId || "").trim();
    if (!value || !/^\d+$/.test(value)) return;

    const result = await dispatch(getBillDebitDetails({ bill_id: value }));
    if (!getBillDebitDetails.fulfilled.match(result)) return;

    const data = result.payload?.data || result.payload;
    if (!data) return;

    setForm((previous) => ({
      ...previous,
      billValue: data.bill_value ?? data.bill_amount ?? previous.billValue,
      alreadyDebited: data.already_debited ?? previous.alreadyDebited,
      remainingBalance: data.remaining_balance ?? previous.remainingBalance,
      vendorId: data.vendor_id ?? data.vendor?.id ?? previous.vendorId,
      vendorAddress:
        data.vendor_address ?? data.vendor?.address ?? previous.vendorAddress,
      vendorPhone:
        data.vendor_phone ?? data.vendor?.phone ?? previous.vendorPhone,
      vendorEmail:
        data.vendor_email ?? data.vendor?.email ?? previous.vendorEmail,
    }));

    if (Array.isArray(resPayload.items) && resPayload.items.length > 0) {
      setItems(
        resPayload.items.map((item, index) => {
          const qty = item.max_debitable_qty > 0 ? item.max_debitable_qty : (item.quantity ?? item.billed_qty ?? 1);
          const rate = item.rate ?? item.unit_price ?? 0;
          const vat = item.vat_percentage ?? item.vat ?? 15;
          return {
            id: item.bill_item_id || item.id || Date.now() + index,
            bill_item: item.bill_item_id || item.id,
            product: item.product_id || item.product || "",
            productName: item.product_name || item.particular || `Product ${index + 1}`,
            particular: item.particular || item.product_name || "",
            reasonDetail: item.reason_detail || "Invoiced at wrong unit price",
            qty: String(qty),
            rate: String(rate),
            vat: String(vat),
          };
        }),
      );
    }
  };

  /* =====================================================
     VENDOR SELECT & AUTO-FILL
  ===================================================== */

  const handleVendorSelect = (selectedVendorId) => {
    handleChange("vendorId", selectedVendorId);

    if (!selectedVendorId) {
      return;
    }

    const selectedVendor = vendors.find(
      (v) => String(v.id) === String(selectedVendorId),
    );

    if (selectedVendor) {
      setForm((previous) => ({
        ...previous,
        vendorId: selectedVendor.id,
        vendorName:
          selectedVendor.name ||
          selectedVendor.vendor_name ||
          selectedVendor.company_name ||
          previous.vendorName,
        vendorAddress:
          selectedVendor.billing_address ||
          selectedVendor.address ||
          previous.vendorAddress,
        vendorPhone:
          selectedVendor.phno ||
          selectedVendor.phone_number ||
          previous.vendorPhone,
        vendorEmail:
          selectedVendor.financial_email ||
          selectedVendor.admin_email ||
          selectedVendor.email ||
          previous.vendorEmail,
      }));
    }
  };

  /* ---------- Items ---------- */

  const handleItemChange = (itemId, field, value) =>
    setItems((previous) =>
      previous.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item,
      ),
    );

  const handleAddItem = () => setItems((previous) => [...previous, newItem()]);

  // Always keep one row
  const handleRemoveItem = (itemId) =>
    setItems((previous) =>
      previous.length === 1 ? previous : previous.filter((i) => i.id !== itemId),
    );

  /* ---------- Calculations ---------- */

  const rows = useMemo(
    () =>
      items.map((item, index) => {
        const quantity = Number(item.qty) || 0;
        const rate = Number(item.rate) || 0;
        const vat = Number(item.vat) || 0;

        const subtotal = quantity * rate;
        const vatAmount = (subtotal * vat) / 100;

        return {
          ...item,
          slNo: String(index + 1).padStart(2, "0"),
          subtotal,
          vatAmount,
          amount: subtotal + vatAmount,
        };
      }),
    [items],
  );

  const subtotal = useMemo(
    () => rows.reduce((total, row) => total + row.subtotal, 0),
    [rows],
  );

  const tax = useMemo(
    () => rows.reduce((total, row) => total + row.vatAmount, 0),
    [rows],
  );

  const totalDebitAmount = subtotal + tax;

  /* ---------- Submit ---------- */

  const buildPayload = () => ({
    debit_note_number: form.debitNoteNumber || "",
    bill: numberOrNull(form.billId),
    issue_date: form.issueDate || null,
    reason: form.reason,
    status: form.status,
    bill_value: numberOrNull(form.billValue) ?? 0,
    already_debited: numberOrNull(form.alreadyDebited) ?? 0,
    remaining_balance: numberOrNull(form.remainingBalance) ?? 0,
    company_name: form.companyName,
    company_address: form.companyAddress,
    company_phone: form.companyPhone,
    company_email: form.companyEmail,
    vendor: numberOrNull(form.vendorId),
    vendor_address: form.vendorAddress,
    vendor_phone: form.vendorPhone,
    vendor_email: form.vendorEmail,
    notes: form.notes,
    items: rows.map((row) => ({
      product: numberOrNull(row.product),
      reason_detail: row.reasonDetail,
      quantity: numberOrNull(row.qty) ?? 0,
      rate: numberOrNull(row.rate) ?? 0,
      vat_percentage: numberOrNull(row.vat) ?? 0,
      vat_amount: numberOrNull(row.vatAmount) ?? 0,
      amount: numberOrNull(row.amount) ?? 0,
    })),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    dispatch(clearDebitNoteError());
    dispatch(clearDebitNoteMessage());

    const finalStatus = targetStatus || form.status || "pending";
    const payload = {
      ...buildPayload(),
      status: finalStatus,
      sub_total: subtotal,
      total_vat: tax,
      debit_amount: totalDebitAmount,
    };

    const result = isEdit
      ? await dispatch(editDebitNote({ id, data: payload }))
      : await dispatch(addDebitNote(payload));

    const succeeded = isEdit
      ? editDebitNote.fulfilled.match(result)
      : addDebitNote.fulfilled.match(result);

    if (succeeded) navigate(LIST_ROUTE);
  };

  const handleCancel = () => navigate(LIST_ROUTE);

  /* ---------- Error text ---------- */

  const errorText = useMemo(() => {
    if (!error) return "";
    if (typeof error === "string") return error;
    if (error.detail) return error.detail;

    return Object.entries(error)
      .map(
        ([field, value]) =>
          `${field}: ${
            Array.isArray(value)
              ? value.join(", ")
              : typeof value === "object" && value !== null
                ? JSON.stringify(value)
                : value
          }`,
      )
      .join(" | ");
  }, [error]);

  /* ---------- Render ---------- */

  if (isEdit && detailsLoading) {
    return <LoadingMessage>Loading Debit Note...</LoadingMessage>;
  }

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
        title={isEdit ? "Edit Debit Note" : "Create Debit Note"}
        breadcrumbs={["Purchases", "Debit Notes"]}
        showBack
        onBack={handleCancel}
      />

      <form onSubmit={handleSubmit}>
        <FormGrid>
          <TextField
            label="DEBIT NOTE NUMBER"
            field="debitNoteNumber"
            form={form}
            onChange={handleChange}
            placeholder="DN0028"
          />

          <TextField
            label="AGAINST BILL *"
            field="billId"
            form={form}
            onChange={handleChange}
            onBlur={handleBillBlur}
            placeholder="Bill ID"
          />

          <TextField
            label="ISSUE DATE"
            field="issueDate"
            form={form}
            onChange={handleChange}
            type="date"
          />

          <SelectField
            label="REASON *"
            value={form.reason}
            onChange={(e) => handleChange("reason", e.target.value)}
          >
            {REASONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </SelectField>

          <TextField
            label="BILL VALUE"
            field="billValue"
            form={form}
            onChange={handleChange}
            placeholder="15,000 SAR"
          />

          <TextField
            label="ALREADY DEBITED"
            field="alreadyDebited"
            form={form}
            onChange={handleChange}
            placeholder="10,000 SAR"
          />

          <TextField
            label="REMAINING BALANCE"
            field="remainingBalance"
            form={form}
            onChange={handleChange}
            placeholder="SAR 5,000"
          />

          <SelectField
            label="STATUS"
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </SelectField>

          {/* From */}
          <TextField label="FROM" field="companyName" form={form} onChange={handleChange} placeholder="From" />
          <TextField label="ADDRESS" field="companyAddress" form={form} onChange={handleChange} placeholder="Address" />
          <TextField label="PHONE NUMBER" field="companyPhone" form={form} onChange={handleChange} placeholder="Phone number" />
          <TextField label="EMAIL ID" field="companyEmail" form={form} onChange={handleChange} placeholder="Email" />

          {/* Vendor */}
          <TextField label="VENDOR *" field="vendorId" form={form} onChange={handleChange} placeholder="Vendor ID" />
          <TextField label="ADDRESS *" field="vendorAddress" form={form} onChange={handleChange} placeholder="Company/Client Address" />
          <TextField label="PHONE NUMBER *" field="vendorPhone" form={form} onChange={handleChange} placeholder="Company/Client Phone Number" />
          <TextField label="FINANCE CONTACT EMAIL *" field="vendorEmail" form={form} onChange={handleChange} placeholder="Company/Client Email ID" />
        </FormGrid>

        {/* ---------- Items ---------- */}
        <ItemsHeader>
          <ItemsTitle>ITEMS</ItemsTitle>
          <AddButton type="button" onClick={handleAddItem}>
            + ADD ITEM
          </AddButton>
        </ItemsHeader>

        <ItemsTable>
          <TableHeader>
            <span>SL No</span>
            <span>Product</span>
            <span>Reason Detail</span>
            <span>QTY</span>
            <span>Rate</span>
            <span>VAT (%)</span>
            <span>VAT (SAR)</span>
            <span>Unit Price</span>
            <span>Amount</span>
            <span>Action</span>
          </TableHeader>

          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.slNo}</TableCell>
              <TableCell>{cellInput(row, "product", { placeholder: "Product ID" })}</TableCell>
              <TableCell>{cellInput(row, "reasonDetail", { placeholder: "Reason detail" })}</TableCell>
              <TableCell>{cellInput(row, "qty", { type: "number", min: "0" })}</TableCell>
              <TableCell>{cellInput(row, "rate", { type: "number", min: "0", step: "0.01" })}</TableCell>
              <TableCell>{cellInput(row, "vat", { type: "number", min: "0" })}</TableCell>
              <TableCell>SAR {fmt(row.vatAmount)}</TableCell>
              <TableCell>SAR {fmt(row.rate)}</TableCell>
              <TableCell>SAR {fmt(row.amount)}</TableCell>
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

        {/* ---------- Notes (left) + Summary (right) ---------- */}
        <BottomSection>
          <NotesGroup>
            <Label>NOTES &amp; REASON DETAIL</Label>
            <NotesTextarea
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Enter notes"
            />
          </NotesGroup>

          <BottomSummary>
            <SummaryRow>
              <span>Subtotal</span>
              <strong>SAR {fmt(subtotal)}</strong>
            </SummaryRow>

            <SummaryRow>
              <span>Tax (VAT)</span>
              <strong>SAR {fmt(tax)}</strong>
            </SummaryRow>

            <TotalAmount>
              <span>TOTAL DEBIT AMOUNT</span>
              <strong>SAR {fmt(totalDebitAmount)}</strong>
            </TotalAmount>
          </BottomSummary>
        </BottomSection>

        {/* ---------- Error ---------- */}
        {errorText && <ErrorMessage>{errorText}</ErrorMessage>}

        <ButtonWrapper>
          <CancelButton type="button" onClick={handleCancel} disabled={submitting}>
            CANCEL
          </CancelButton>
          <PreviewButton type="submit" disabled={submitting}>
            {submitting
              ? "SAVING..."
              : isEdit
                ? "UPDATE DEBIT NOTE"
                : "ISSUE DEBIT NOTE"}
          </PreviewButton>
        </ButtonWrapper>
      </form>
    </CreateBillContainer>
  );
};

export default CreateDebitNote;