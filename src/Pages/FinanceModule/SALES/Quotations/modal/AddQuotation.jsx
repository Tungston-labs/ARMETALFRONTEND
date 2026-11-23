import React, { useEffect, useMemo, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import {
  Container,
  Card,
  Grid4,
  FieldGroup,
  Label,
  Input,
  Select,
  ItemsHeader,
  SectionHeading,
  AddItemBtn,
  TableWrap,
  ItemsTable,
  RemoveBtn,
  BottomGrid,
  TextArea,
  SummaryCard,
  SummaryRow,
  TotalBanner,
  ActionsBar,
  ButtonGroup,
  OutlineBtn,
  PrimaryBtn,
} from "./AddQuotation.style";

import API from "../../../../../services/api";
import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";

const createEmptyItem = () => ({
  product: "",
  service_name: "",
  description: "",
  quantity: "1",
  hs_code: "",
  rate: "0",
  vat_percentage: "15",
});

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

// Builds the form state from an existing quotation (edit) or blank (create).
const buildForm = (data, defaultCustomerId, today) => ({
  quote_number: data?.quote_number || "",
  issue_date: String(data?.issue_date || today).slice(0, 10),
  valid_till: String(data?.valid_till || today).slice(0, 10),
  status: String(data?.status || "draft").toLowerCase(),
  from_company_name: data?.from_company_name || "Tungston Labs",
  from_address: data?.from_address || "",
  from_phone_number: data?.from_phone_number || "",
  from_email: data?.from_email || "",
  customer: data?.customer || defaultCustomerId || "",
  bill_to_name: data?.bill_to_name || data?.customer_name || "",
  bill_to_address: data?.bill_to_address || "",
  bill_to_phone: data?.bill_to_phone || "",
  finance_contact_email: data?.finance_contact_email || "",
  discount: String(data?.discount ?? "0"),
  round_off: String(data?.round_off ?? "0"),
  negotiation_amount:
    data?.negotiation_amount !== undefined && data?.negotiation_amount !== null
      ? String(data.negotiation_amount)
      : "",
  notes: data?.notes || "",
  items:
    Array.isArray(data?.items) && data.items.length > 0
      ? data.items.map((it) => ({
          product: it.product || "",
          service_name: it.service_name || it.product_name || "",
          description: it.description || "",
          quantity: String(it.quantity ?? "1"),
          hs_code: it.hs_code || "",
          rate: String(it.rate ?? "0"),
          vat_percentage: String(it.vat_percentage ?? "15"),
        }))
      : [createEmptyItem()],
});

const AddQuotation = ({
  isOpen = true,
  initialData = null,
  defaultCustomerId = "",
  submitting = false,
  error = "",
  onCancel,
  onSave,
}) => {
  const isEdit = Boolean(initialData?.id);
  const today = new Date().toISOString().slice(0, 10);

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [formError, setFormError] = useState("");

  const [form, setForm] = useState(() =>
    buildForm(initialData, defaultCustomerId, today)
  );

  // Re-fill the form when the quotation being edited loads or changes.
  // Keyed on the id so parent re-renders don't wipe what the user is typing.
  useEffect(() => {
    setForm(buildForm(initialData, defaultCustomerId, today));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData?.id]);

  useEffect(() => {
    if (!isOpen) return;
    API.get("/finance/customer/", { params: { page_size: 100 } })
      .then((res) => {
        const rows = res.data?.results || res.data || [];
        setCustomers(Array.isArray(rows) ? rows : []);
      })
      .catch(() => setCustomers([]));

    API.get("/finance/product/", { params: { page_size: 100 } })
      .then((res) => {
        const rows = res.data?.results || res.data || [];
        setProducts(Array.isArray(rows) ? rows : []);
      })
      .catch(() => setProducts([]));
  }, [isOpen]);

  const getCustomerAddress = (c) => {
    if (!c) return "";
    const parts = [
      c.billing_address || c.address,
      c.city,
      c.state,
      c.country,
      c.postal,
    ]
      .map((p) => (typeof p === "string" ? p.trim() : p))
      .filter(Boolean);
    return parts.length > 0
      ? parts.join(", ")
      : (c.billing_address || c.address || "");
  };

  // Auto-fill Bill To fields when customer list loads for defaultCustomerId
  useEffect(() => {
    if (!form.customer || customers.length === 0) return;
    const selected = customers.find(
      (c) => String(c.id) === String(form.customer),
    );
    if (selected && !form.bill_to_name) {
      setForm((prev) => ({
        ...prev,
        bill_to_name:
          selected.customer_name || selected.company_name || prev.bill_to_name,
        bill_to_address:
          getCustomerAddress(selected) || prev.bill_to_address,
        bill_to_phone:
          selected.phno || selected.phone_number || selected.phone || prev.bill_to_phone,
        finance_contact_email:
          selected.financial_email || selected.admin_email || selected.email || prev.finance_contact_email,
      }));
    }
  }, [customers, form.customer, form.bill_to_name]);

  const selectedCustomerObj = useMemo(
    () => customers.find((c) => String(c.id) === String(form.customer)),
    [customers, form.customer],
  );
  const currency =
    selectedCustomerObj?.currency || initialData?.currency || "SAR";

  const totals = useMemo(() => {
    let subTotal = 0;
    let totalVat = 0;
    const lines = form.items.map((item) => {
      const qty = toNum(item.quantity);
      const rate = toNum(item.rate);
      const vatPct = toNum(item.vat_percentage);
      const base = qty * rate;
      const vatAmt = (base * vatPct) / 100;
      subTotal += base;
      totalVat += vatAmt;
      return { vatAmt, amount: base };
    });
    const discount = toNum(form.discount);
    const roundOff = toNum(form.round_off);
    const negotiation = toNum(form.negotiation_amount);
    const baseTotal = Math.max(0, subTotal + totalVat - discount + roundOff);
    const grandTotal = Math.max(0, baseTotal - (negotiation > 0 ? negotiation : 0));
    return {
      lines,
      subTotal,
      totalVat,
      discount,
      roundOff,
      baseTotal,
      negotiation,
      grandTotal,
    };
  }, [form.items, form.discount, form.round_off, form.negotiation_amount]);

  if (!isOpen) return null;

  const handleField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = (customerId) => {
    const selected = customers.find(
      (c) => String(c.id) === String(customerId),
    );
    setForm((prev) => ({
      ...prev,
      customer: customerId,
      bill_to_name:
        selected?.customer_name || selected?.company_name || prev.bill_to_name,
      bill_to_address:
        getCustomerAddress(selected) || prev.bill_to_address,
      bill_to_phone:
        selected?.phno || selected?.phone_number || selected?.phone || prev.bill_to_phone,
      finance_contact_email:
        selected?.financial_email || selected?.admin_email || selected?.email || prev.finance_contact_email,
    }));
  };

  const handleItemChange = (index, field, value) => {
    setForm((prev) => {
      const next = [...prev.items];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, items: next };
    });
  };

  const handleProductSelect = (index, productId) => {
    const prod = products.find((p) => String(p.id) === String(productId));
    setForm((prev) => {
      const next = [...prev.items];
      next[index] = {
        ...next[index],
        product: productId,
        service_name: prod?.product_name || next[index].service_name,
        description:
          prod?.description || prod?.product_name || next[index].description,
        hs_code: prod?.hsn_sac_code || next[index].hs_code,
        rate: prod?.selling_price ?? next[index].rate,
        vat_percentage: prod?.tax_rate ?? next[index].vat_percentage,
      };
      return { ...prev, items: next };
    });
  };

  const addItemRow = () => {
    setForm((prev) => ({ ...prev, items: [...prev.items, createEmptyItem()] }));
  };

  const removeItemRow = (index) => {
    setForm((prev) => {
      if (prev.items.length <= 1) return prev;
      return { ...prev, items: prev.items.filter((_, idx) => idx !== index) };
    });
  };

  const submitWithStatus = (statusOverride = null) => {
    if (submitting) return;
    setFormError("");

    if (!form.customer) {
      setFormError("Please select a Bill To customer.");
      return;
    }
    if (!form.issue_date) {
      setFormError("Quotation date is required.");
      return;
    }

    const cleanItems = form.items
      .filter(
        (it) =>
          it.product ||
          String(it.service_name || "").trim() ||
          String(it.description || "").trim() ||
          toNum(it.rate) > 0,
      )
      .map((it) => ({
        ...(it.product ? { product: Number(it.product) } : {}),
        service_name: it.service_name || it.description || "Item",
        description: it.description || it.service_name || "",
        quantity: toNum(it.quantity) || 1,
        hs_code: it.hs_code || "",
        rate: toNum(it.rate),
        vat_percentage: toNum(it.vat_percentage),
      }));

    if (cleanItems.length === 0) {
      setFormError("Please add at least one quotation item.");
      return;
    }

    const payload = {
      ...(form.quote_number.trim()
        ? { quote_number: form.quote_number.trim() }
        : {}),
      customer: Number(form.customer),
      issue_date: form.issue_date,
      valid_till: form.valid_till || null,
      status: statusOverride || form.status || "pending",
      from_company_name: form.from_company_name,
      from_address: form.from_address,
      from_phone_number: form.from_phone_number,
      from_email: form.from_email,
      bill_to_name: form.bill_to_name,
      bill_to_address: form.bill_to_address,
      bill_to_phone: form.bill_to_phone,
      finance_contact_email: form.finance_contact_email,
      sub_total: totals.subTotal.toFixed(2),
      total_vat: totals.totalVat.toFixed(2),
      discount: totals.discount.toFixed(2),
      round_off: totals.roundOff.toFixed(2),
      quote_amount: totals.grandTotal.toFixed(2),
      old_quote_amount: totals.negotiation > 0 ? totals.baseTotal.toFixed(2) : null,
      negotiation_amount: totals.negotiation > 0 ? totals.negotiation.toFixed(2) : "0.00",
      notes: form.notes,
      items: cleanItems,
    };

    onSave?.(payload);
  };

  return (
    <Container>
      <ReusableHeader
        title={isEdit ? "Edit Quotation" : "Generate New Quotation"}
        breadcrumbs={["Dashboard", "Sales", "Quotations"]}
        showBack
        onBack={onCancel}
      />

      <Card
        onSubmit={(e) => {
          e.preventDefault();
          submitWithStatus();
        }}
      >
        <Grid4>
          <FieldGroup>
            <Label>Quotation Number</Label>
            <Input
              placeholder="Auto-generated if blank"
              value={form.quote_number}
              onChange={(e) => handleField("quote_number", e.target.value)}
              readOnly={isEdit}
            />
          </FieldGroup>

          <FieldGroup>
            <Label>
              Quotation Date<span>*</span>
            </Label>
            <Input
              type="date"
              value={form.issue_date}
              onChange={(e) => handleField("issue_date", e.target.value)}
              required
            />
          </FieldGroup>

          <FieldGroup>
            <Label>
              Valid Till<span>*</span>
            </Label>
            <Input
              type="date"
              value={form.valid_till}
              onChange={(e) => handleField("valid_till", e.target.value)}
            />
          </FieldGroup>

          <FieldGroup>
            <Label>Status</Label>
            <Select
              value={form.status}
              onChange={(e) => handleField("status", e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </Select>
          </FieldGroup>
        </Grid4>

        <Grid4>
          <FieldGroup>
            <Label>From</Label>
            <Input
              value={form.from_company_name}
              onChange={(e) => handleField("from_company_name", e.target.value)}
            />
          </FieldGroup>

          <FieldGroup>
            <Label>Address</Label>
            <Input
              placeholder="Company Address"
              value={form.from_address}
              onChange={(e) => handleField("from_address", e.target.value)}
            />
          </FieldGroup>

          <FieldGroup>
            <Label>Phone Number</Label>
            <Input
              placeholder="+966 ..."
              value={form.from_phone_number}
              onChange={(e) => handleField("from_phone_number", e.target.value)}
            />
          </FieldGroup>

          <FieldGroup>
            <Label>Email ID</Label>
            <Input
              type="email"
              placeholder="info@company.com"
              value={form.from_email}
              onChange={(e) => handleField("from_email", e.target.value)}
            />
          </FieldGroup>
        </Grid4>

        <Grid4>
          <FieldGroup>
            <Label>
              Bill To<span>*</span>
            </Label>
            <Select
              value={form.customer}
              onChange={(e) => handleCustomerChange(e.target.value)}
              required
            >
              <option value="">Select company/client</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.customer_name}
                </option>
              ))}
            </Select>
          </FieldGroup>

          <FieldGroup>
            <Label>
              Address<span>*</span>
            </Label>
            <Input
              placeholder="Filled from the client"
              value={form.bill_to_address}
              onChange={(e) => handleField("bill_to_address", e.target.value)}
            />
          </FieldGroup>

          <FieldGroup>
            <Label>
              Phone Number<span>*</span>
            </Label>
            <Input
              placeholder="Filled from the client"
              value={form.bill_to_phone}
              onChange={(e) => handleField("bill_to_phone", e.target.value)}
            />
          </FieldGroup>

          <FieldGroup>
            <Label>
              Finance Contact Email<span>*</span>
            </Label>
            <Input
              type="email"
              placeholder="Filled from the client"
              value={form.finance_contact_email}
              onChange={(e) =>
                handleField("finance_contact_email", e.target.value)
              }
            />
          </FieldGroup>
        </Grid4>

        <ItemsHeader>
          <SectionHeading>Quotation Items</SectionHeading>
          <AddItemBtn type="button" onClick={addItemRow}>
            <FiPlus size={14} /> ADD ITEM
          </AddItemBtn>
        </ItemsHeader>

        <TableWrap>
          <ItemsTable>
            <thead>
              <tr>
                <th>SL No</th>
                <th>Product</th>
                <th>Description</th>
                <th>QTY</th>
                <th>HS Code</th>
                <th>Rate</th>
                <th>VAT (%)</th>
                <th>VAT ({currency})</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {form.items.map((item, idx) => {
                const line = totals.lines[idx] || { vatAmt: 0, amount: 0 };
                return (
                  <tr key={idx}>
                    <td>{String(idx + 1).padStart(2, "0")}</td>
                    <td style={{ minWidth: 140 }}>
                      {products.length > 0 ? (
                        <select
                          value={item.product}
                          onChange={(e) =>
                            handleProductSelect(idx, e.target.value)
                          }
                        >
                          <option value="">Select Product</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.product_name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          placeholder="Product/Service"
                          value={item.service_name}
                          onChange={(e) =>
                            handleItemChange(idx, "service_name", e.target.value)
                          }
                        />
                      )}
                    </td>
                    <td style={{ minWidth: 150 }}>
                      <input
                        placeholder="Description"
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(idx, "description", e.target.value)
                        }
                      />
                    </td>
                    <td style={{ width: 70 }}>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(idx, "quantity", e.target.value)
                        }
                      />
                    </td>
                    <td style={{ width: 90 }}>
                      <input
                        placeholder="HS Code"
                        value={item.hs_code}
                        onChange={(e) =>
                          handleItemChange(idx, "hs_code", e.target.value)
                        }
                      />
                    </td>
                    <td style={{ width: 95 }}>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(idx, "rate", e.target.value)
                        }
                      />
                    </td>
                    <td style={{ width: 75 }}>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={item.vat_percentage}
                        onChange={(e) =>
                          handleItemChange(idx, "vat_percentage", e.target.value)
                        }
                      />
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {currency} {line.vatAmt.toFixed(2)}
                    </td>
                    <td style={{ whiteSpace: "nowrap", fontWeight: 500 }}>
                      {currency} {line.amount.toFixed(2)}
                    </td>
                    <td>
                      <RemoveBtn
                        type="button"
                        onClick={() => removeItemRow(idx)}
                        title="Remove item"
                      >
                        <FiX size={13} />
                      </RemoveBtn>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </ItemsTable>
        </TableWrap>

        <BottomGrid>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <FieldGroup>
              <Label>Negotiation Amount ({currency})</Label>
              <Input
                type="number"
                min="0"
                step="any"
                placeholder="Optional negotiated amount"
                value={form.negotiation_amount}
                onChange={(e) =>
                  handleField("negotiation_amount", e.target.value)
                }
              />
            </FieldGroup>
            <FieldGroup>
              <Label>Notes</Label>
              <TextArea
                placeholder="Above information is not an invoice and only an estimate of services."
                value={form.notes}
                onChange={(e) => handleField("notes", e.target.value)}
              />
            </FieldGroup>

          </div>

          <SummaryCard>
            <SummaryRow>
              <span>Sub Total</span>
              <strong>
                {currency} {totals.subTotal.toFixed(2)}
              </strong>
            </SummaryRow>
            <SummaryRow>
              <span>Total VAT</span>
              <strong>
                {currency} {totals.totalVat.toFixed(2)}
              </strong>
            </SummaryRow>
            {/* <SummaryRow>
              <span>Discount ({currency})</span>
              <Input
                type="number"
                min="0"
                step="any"
                style={{ width: 110, height: 32, textAlign: "right" }}
                value={form.discount}
                onChange={(e) => handleField("discount", e.target.value)}
              />
            </SummaryRow> */}
            {/* <SummaryRow>
              <span>Round Off ({currency})</span>
              <Input
                type="number"
                step="any"
                style={{ width: 110, height: 32, textAlign: "right" }}
                value={form.round_off}
                onChange={(e) => handleField("round_off", e.target.value)}
              />
            </SummaryRow> */}
            {totals.negotiation > 0 && (
              <SummaryRow>
                <span>Negotiation Discount ({currency})</span>
                <strong style={{ color: "#16a34a" }}>
                  - {currency} {totals.negotiation.toFixed(2)}
                </strong>
              </SummaryRow>
            )}
            <TotalBanner>
              <span>TOTAL AMOUNT</span>
              <span>
                {currency} {totals.grandTotal.toFixed(2)}
              </span>
            </TotalBanner>
          </SummaryCard>
        </BottomGrid>

        {(formError || error) && (
          <div
            role="alert"
            style={{ marginTop: 14, color: "#dc2626", fontSize: 13 }}
          >
            {formError || error}
          </div>
        )}

        <ActionsBar>
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            Sent is locked until an admin approves this quote
          </span>

          <ButtonGroup>
            <OutlineBtn type="button" onClick={onCancel} disabled={submitting}>
              CANCEL
            </OutlineBtn>
            {!isEdit && (
              <OutlineBtn
                type="button"
                onClick={() => submitWithStatus("draft")}
                disabled={submitting}
              >
                SAVE DRAFT
              </OutlineBtn>
            )}
            <PrimaryBtn type="submit" disabled={submitting}>
              {submitting
                ? "SAVING..."
                : isEdit
                  ? "UPDATE QUOTATION"
                  : "SENT FOR APPROVAL"}
            </PrimaryBtn>
          </ButtonGroup>
        </ActionsBar>
      </Card>
    </Container>
  );
};

export default AddQuotation;