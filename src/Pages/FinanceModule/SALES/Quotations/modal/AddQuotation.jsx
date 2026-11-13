import React, { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiPlus, FiX } from "react-icons/fi";
import { IoHomeOutline } from "react-icons/io5";
import styled from "styled-components";

import API from "../../../../../services/api";

const Container = styled.div`
  width: 100%;
  max-width: 100%;
  min-height: 100vh;
  background: #f5f6fa;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 14px;
  }
`;

const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  min-width: 0;

  @media (max-width: 768px) {
    padding-top: 50px;
  }
`;

const BackChevronButton = styled.button`
  background: transparent;
  border: none;
  padding: 4px 2px;
  margin: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #111827;
  cursor: pointer;
  flex-shrink: 0;
  border-radius: 4px;
  transition: color 0.2s ease, background-color 0.2s ease;

  &:hover {
    color: #3250bc;
    background: rgba(50, 80, 188, 0.08);
  }
`;

const HeaderTitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: clamp(19px, 1.8vw, 24px);
  font-weight: 500;
  line-height: 1.3;
  color: #3250bc;
`;

const HeaderBreadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #374151;
  flex-wrap: wrap;

  span.active {
    color: #3250bc;
  }
`;

const Card = styled.form`
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 24px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Grid4 = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 18px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  text-transform: uppercase;

  span {
    color: #dc2626;
    margin-left: 2px;
  }
`;

const Input = styled.input`
  height: 38px;
  padding: 0 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  color: #111827;
  background: #ffffff;
  width: 100%;
  box-sizing: border-box;
  outline: none;

  &:focus {
    border-color: #3857b9;
  }
`;

const Select = styled.select`
  height: 38px;
  padding: 0 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  color: #111827;
  background: #ffffff;
  width: 100%;
  box-sizing: border-box;
  outline: none;

  &:focus {
    border-color: #3857b9;
  }
`;

const ItemsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 22px 0 12px;
  gap: 12px;
  flex-wrap: wrap;
`;

const SectionHeading = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  text-transform: uppercase;
`;

const AddItemBtn = styled.button`
  height: 36px;
  padding: 0 14px;
  background: #f58220;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 12.5px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  &:hover {
    background: #df7113;
  }
`;

const TableWrap = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px dashed #d1d5db;
  border-radius: 4px;
`;

const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    background: #233c8b;
    color: #ffffff;
    font-size: 12px;
    font-weight: 600;
    padding: 10px 8px;
    text-align: left;
    white-space: nowrap;
  }

  td {
    padding: 8px 6px;
    border-bottom: 1px solid #e5e7eb;
    font-size: 12.5px;
    vertical-align: middle;
  }

  input,
  select {
    height: 34px;
    padding: 0 8px;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 12.5px;
    width: 100%;
    min-width: 72px;
    box-sizing: border-box;
    background: #ffffff;
  }
`;

const RemoveBtn = styled.button`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid #ef4444;
  background: #ffffff;
  color: #ef4444;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: #fef2f2;
  }
`;

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 0.9fr);
  gap: 24px;
  margin-top: 22px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 90px;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  font-family: inherit;
  box-sizing: border-box;
  resize: vertical;
`;

const SummaryCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SummaryRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: #374151;

  strong {
    font-weight: 600;
    color: #111827;
  }
`;

const TotalBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f58220;
  color: #ffffff;
  padding: 11px 14px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  margin-top: 4px;
`;

const ActionsBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 24px;
  flex-wrap: wrap;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const OutlineBtn = styled.button`
  height: 38px;
  padding: 0 18px;
  background: #ffffff;
  color: #111827;
  border: 1px solid #111827;
  border-radius: 4px;
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #f3f4f6;
  }
`;

const PrimaryBtn = styled.button`
  height: 38px;
  padding: 0 20px;
  background: #3857b9;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #2e49a5;
  }
`;

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

  const [form, setForm] = useState({
    quote_number: initialData?.quote_number || "",
    issue_date: String(initialData?.issue_date || today).slice(0, 10),
    valid_till: String(initialData?.valid_till || today).slice(0, 10),
    status: String(initialData?.status || "draft").toLowerCase(),
    from_company_name: initialData?.from_company_name || "Tungston Labs",
    from_address: initialData?.from_address || "",
    from_phone_number: initialData?.from_phone_number || "",
    from_email: initialData?.from_email || "",
    customer: initialData?.customer || defaultCustomerId || "",
    bill_to_name: initialData?.bill_to_name || initialData?.customer_name || "",
    bill_to_address: initialData?.bill_to_address || "",
    bill_to_phone: initialData?.bill_to_phone || "",
    finance_contact_email: initialData?.finance_contact_email || "",
    discount: String(initialData?.discount ?? "0"),
    round_off: String(initialData?.round_off ?? "0"),
    negotiation_amount:
      initialData?.negotiation_amount !== undefined &&
      initialData?.negotiation_amount !== null
        ? String(initialData.negotiation_amount)
        : "",
    notes: initialData?.notes || "",
    items:
      Array.isArray(initialData?.items) && initialData.items.length > 0
        ? initialData.items.map((it) => ({
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

  // Auto-fill Bill To fields when customer list loads for defaultCustomerId
  useEffect(() => {
    if (!form.customer || customers.length === 0) return;
    const selected = customers.find(
      (c) => String(c.id) === String(form.customer),
    );
    if (selected && !form.bill_to_name) {
      setForm((prev) => ({
        ...prev,
        bill_to_name: selected.customer_name || prev.bill_to_name,
        bill_to_address:
          selected.address || selected.city || prev.bill_to_address,
        bill_to_phone: selected.phone_number || prev.bill_to_phone,
        finance_contact_email: selected.email || prev.finance_contact_email,
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
    const grandTotal = Math.max(0, subTotal + totalVat - discount + roundOff);
    return { lines, subTotal, totalVat, discount, roundOff, grandTotal };
  }, [form.items, form.discount, form.round_off]);

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
      bill_to_name: selected?.customer_name || prev.bill_to_name,
      bill_to_address:
        selected?.address || selected?.city || prev.bill_to_address,
      bill_to_phone: selected?.phone_number || prev.bill_to_phone,
      finance_contact_email: selected?.email || prev.finance_contact_email,
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
        description: prod?.description || prod?.product_name || next[index].description,
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
      ...(form.negotiation_amount !== ""
        ? { negotiation_amount: toNum(form.negotiation_amount).toFixed(2) }
        : {}),
      notes: form.notes,
      items: cleanItems,
    };

    onSave?.(payload);
  };

  return (
    <Container>
      <HeaderBar>
        <BackChevronButton
          type="button"
          onClick={onCancel}
          aria-label="Back to quotations"
        >
          <FiChevronLeft size={24} strokeWidth={2.2} />
        </BackChevronButton>

        <HeaderTitleGroup>
          <HeaderTitle>
            {isEdit ? "Edit Quotation" : "Generate New Quotation"}
          </HeaderTitle>
          <HeaderBreadcrumb>
            <IoHomeOutline size={13} />
            <span>Dashboard</span>
            <span>›</span>
            <span>Sales</span>
            <span>›</span>
            <span className="active">Quotations</span>
          </HeaderBreadcrumb>
        </HeaderTitleGroup>
      </HeaderBar>

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
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <FieldGroup>
              <Label>Notes</Label>
              <TextArea
                placeholder="Above information is not an invoice and only an estimate of services."
                value={form.notes}
                onChange={(e) => handleField("notes", e.target.value)}
              />
            </FieldGroup>

            <FieldGroup style={{ maxWidth: 260 }}>
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
            <SummaryRow>
              <span>Discount ({currency})</span>
              <Input
                type="number"
                min="0"
                step="any"
                style={{ width: 110, height: 32, textAlign: "right" }}
                value={form.discount}
                onChange={(e) => handleField("discount", e.target.value)}
              />
            </SummaryRow>
            <SummaryRow>
              <span>Round Off ({currency})</span>
              <Input
                type="number"
                step="any"
                style={{ width: 110, height: 32, textAlign: "right" }}
                value={form.round_off}
                onChange={(e) => handleField("round_off", e.target.value)}
              />
            </SummaryRow>
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
            <OutlineBtn
              type="button"
              onClick={() => submitWithStatus("draft")}
              disabled={submitting}
            >
              SAVE DRAFT
            </OutlineBtn>
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
