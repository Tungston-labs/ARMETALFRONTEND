import React, { useEffect, useMemo, useState } from "react";

import { FiPlus, FiTrash2 } from "react-icons/fi";

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

import { getBills } from "../../../../../Redux/finance/purchases/BillSlice";
import { getVendors } from "../../../../../Redux/finance/purchases/vendorsSlice";

const CreateDebitNote = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { id } = useParams();

  const isEdit = Boolean(id);

  const { selectedDebitNote, billDetails, submitting, detailsLoading, error } =
    useSelector((state) => state.debitNote || {});

  const vendors = useSelector(
    (state) =>
      state.vendor?.vendors ||
      state.vendors?.vendors ||
      [],
  );

  const bills = useSelector(
    (state) =>
      state.bill?.bills ||
      state.bills?.bills ||
      [],
  );

  /* =====================================================
     FORM
  ===================================================== */

  const [form, setForm] = useState({
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
  });

  /* =====================================================
     ITEMS
  ===================================================== */

  const [items, setItems] = useState([
    {
      id: Date.now(),
      product: "",
      reasonDetail: "",
      qty: "1",
      rate: "",
      vat: "15",
    },
  ]);

  /* =====================================================
     LOAD DETAILS & LOOKUPS
  ===================================================== */

  useEffect(() => {
    dispatch(getBills({ page_size: 100 }));
    dispatch(getVendors({ page_size: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (!isEdit && !form.issueDate) {
      setForm((prev) => ({
        ...prev,
        issueDate: new Date().toISOString().slice(0, 10),
      }));
    }
  }, [isEdit, form.issueDate]);

  useEffect(() => {
    if (!isEdit) {
      return;
    }

    dispatch(getDebitNoteById(id));
  }, [dispatch, id, isEdit]);

  /* =====================================================
     OPTIONS
  ===================================================== */

  const vendorOptions = useMemo(() => {
    return vendors.map((v) => ({
      id: v.id,
      name: v.name || v.vendor_name || v.company_name || `Vendor #${v.id}`,
    }));
  }, [vendors]);

  const billOptions = useMemo(() => {
    if (!form.vendorId) {
      return bills;
    }
    return bills.filter((b) => {
      const bVendorId = typeof b.vendor === "object" ? b.vendor?.id : (b.vendor_id ?? b.vendor);
      return !bVendorId || String(bVendorId) === String(form.vendorId);
    });
  }, [bills, form.vendorId]);

  /* =====================================================
     PREFILL EDIT
  ===================================================== */

  useEffect(() => {
    if (!isEdit || !selectedDebitNote) {
      return;
    }

    const data = selectedDebitNote?.data || selectedDebitNote;

    setForm({
      debitNoteNumber: data.debit_note_number || data.dn_number || data.debitNoteNumber || "",

      billId: data.bill_id || data.bill?.id || data.bill || "",

      issueDate: data.issue_date || "",

      reason: data.reason || "damaged_goods",

      status: data.status || "pending",

      billValue: data.bill_value ?? data.bill_amount ?? "",

      alreadyDebited: data.already_debited ?? "",

      remainingBalance: data.remaining_balance ?? data.balance ?? "",

      companyName: data.company_name || data.from_company_name || "TUNGSTON LABS",

      companyAddress: data.company_address || data.from_address || "",

      companyPhone: data.company_phone || data.from_phone_number || "",

      companyEmail: data.company_email || data.from_email || "",

      vendorId: data.vendor_id || data.vendor?.id || data.vendor || "",

      vendorAddress: data.vendor_address || data.bill_to_address || "",

      vendorPhone: data.vendor_phone || data.bill_to_phone || "",

      vendorEmail: data.vendor_email || data.finance_contact_email || "",

      notes: data.notes || "",
    });

    if (Array.isArray(data.items) && data.items.length) {
      setItems(
        data.items.map((item, index) => ({
          id: item.id || Date.now() + index,

          bill_item: item.bill_item || item.bill_item_id || null,

          product: item.product_id || item.product || "",

          productName: item.product_name || item.item_name || item.particular || `Product ${index + 1}`,

          particular: item.particular || item.item_name || "",

          reasonDetail: item.reason_detail || item.description || "",

          qty: String(item.quantity ?? item.qty ?? "1"),

          rate: String(item.rate ?? ""),

          vat: String(item.vat_percentage ?? item.vat ?? "15"),
        })),
      );
    }
  }, [isEdit, selectedDebitNote]);

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* =====================================================
     BILL SELECT & AUTO-FILL
  ===================================================== */

  const handleBillSelect = async (selectedBillId) => {
    handleChange("billId", selectedBillId);

    if (!selectedBillId) {
      setForm((previous) => ({
        ...previous,
        billId: "",
        billValue: "",
        alreadyDebited: "",
        remainingBalance: "",
      }));
      return;
    }

    const result = await dispatch(
      getBillDebitDetails({
        bill_id: selectedBillId,
      }),
    );

    if (!getBillDebitDetails.fulfilled.match(result)) {
      return;
    }

    const resPayload = result.payload?.data || result.payload;
    if (!resPayload) {
      return;
    }

    setForm((previous) => ({
      ...previous,
      billId: selectedBillId,
      billValue: resPayload.bill_value !== undefined ? String(resPayload.bill_value) : previous.billValue,
      alreadyDebited: resPayload.already_debited_amount !== undefined ? String(resPayload.already_debited_amount) : previous.alreadyDebited,
      remainingBalance: resPayload.remaining_balance !== undefined ? String(resPayload.remaining_balance) : previous.remainingBalance,

      vendorId: resPayload.vendor_id ?? resPayload.vendor ?? previous.vendorId,
      vendorName: resPayload.vendor_name ?? resPayload.bill_to_name ?? previous.vendorName,
      vendorAddress: resPayload.vendor_address ?? resPayload.bill_to_address ?? previous.vendorAddress,
      vendorPhone: resPayload.vendor_phone ?? resPayload.bill_to_phone ?? previous.vendorPhone,
      vendorEmail: resPayload.vendor_email ?? resPayload.finance_contact_email ?? previous.vendorEmail,

      companyName: resPayload.from_company_name || resPayload.company_name || previous.companyName || "TUNGSTON LABS",
      companyAddress: resPayload.from_address || resPayload.company_address || previous.companyAddress,
      companyPhone: resPayload.from_phone_number || resPayload.company_phone || previous.companyPhone,
      companyEmail: resPayload.from_email || resPayload.company_email || previous.companyEmail,
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

  /* =====================================================
     ITEM CHANGE
  ===================================================== */

  const updateItem = (itemId, field, value) => {
    setItems((previous) =>
      previous.map((item) =>
        item.id === itemId
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );
  };

  /* =====================================================
     ADD ITEM
  ===================================================== */

  const addItem = () => {
    setItems((previous) => [
      ...previous,
      {
        id: Date.now(),
        product: "",
        reasonDetail: "",
        qty: "1",
        rate: "",
        vat: "15",
      },
    ]);
  };

  /* =====================================================
     REMOVE ITEM
  ===================================================== */

  const removeItem = (itemId) => {
    setItems((previous) => previous.filter((item) => item.id !== itemId));
  };

  /* =====================================================
     CALCULATIONS
  ===================================================== */

  const calculatedItems = useMemo(() => {
    return items.map((item) => {
      const quantity = Number(item.qty) || 0;

      const rate = Number(item.rate) || 0;

      const vat = Number(item.vat) || 0;

      const subtotal = quantity * rate;

      const vatAmount = (subtotal * vat) / 100;

      const amount = subtotal + vatAmount;

      return {
        ...item,
        subtotal,
        vatAmount,
        amount,
      };
    });
  }, [items]);

  const subtotal = useMemo(
    () => calculatedItems.reduce((total, item) => total + item.subtotal, 0),
    [calculatedItems],
  );

  const tax = useMemo(
    () => calculatedItems.reduce((total, item) => total + item.vatAmount, 0),
    [calculatedItems],
  );

  const totalDebitAmount = subtotal + tax;

  /* =====================================================
     SAFE NUMBER
  ===================================================== */

  const numberOrNull = (value) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    const number = Number(value);

    return Number.isFinite(number) ? number : null;
  };

  /* =====================================================
     PAYLOAD
  ===================================================== */

  const buildPayload = () => ({
    debit_note_number: form.debitNoteNumber || "",
    dn_number: form.debitNoteNumber || "",

    bill: numberOrNull(form.billId),
    bill_id: numberOrNull(form.billId),

    issue_date: form.issueDate || null,

    reason: form.reason || "damaged_goods",

    status: form.status || "pending",

    bill_value: numberOrNull(form.billValue) ?? 0,

    already_debited: numberOrNull(form.alreadyDebited) ?? 0,

    remaining_balance: numberOrNull(form.remainingBalance) ?? 0,

    sub_total: subtotal,

    total_vat: tax,

    debit_amount: totalDebitAmount,

    from_company_name: form.companyName || "TUNGSTON LABS",
    company_name: form.companyName || "TUNGSTON LABS",

    from_address: form.companyAddress || "",
    company_address: form.companyAddress || "",

    from_phone_number: form.companyPhone || "",
    company_phone: form.companyPhone || "",

    from_email: form.companyEmail || "",
    company_email: form.companyEmail || "",

    vendor: numberOrNull(form.vendorId),
    vendor_id: numberOrNull(form.vendorId),

    bill_to_name: form.vendorName || "",
    bill_to_address: form.vendorAddress || "",
    vendor_address: form.vendorAddress || "",

    bill_to_phone: form.vendorPhone || "",
    vendor_phone: form.vendorPhone || "",

    finance_contact_email: form.vendorEmail || "",
    vendor_email: form.vendorEmail || "",

    notes: form.notes || "",

    items: calculatedItems.map((item) => ({
      bill_item: numberOrNull(item.bill_item),

      product: numberOrNull(item.product),

      item_name: item.particular || item.productName || "Debit Item",

      description: item.reasonDetail || "",
      reason_detail: item.reasonDetail || "",

      quantity: numberOrNull(item.qty) ?? 1,
      qty: numberOrNull(item.qty) ?? 1,

      rate: numberOrNull(item.rate) ?? 0,
      unit_price: numberOrNull(item.rate) ?? 0,

      vat_percentage: numberOrNull(item.vat) ?? 15,
      vat: numberOrNull(item.vat) ?? 15,

      vat_amount: numberOrNull(item.vatAmount) ?? 0,

      amount: numberOrNull(item.amount) ?? 0,
    })),
  });

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmitWithStatus = async (targetStatus) => {
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

    let result;

    if (isEdit) {
      result = await dispatch(
        editDebitNote({
          id,
          data: payload,
        }),
      );
    } else {
      result = await dispatch(addDebitNote(payload));
    }

    if (
      isEdit
        ? editDebitNote.fulfilled.match(result)
        : addDebitNote.fulfilled.match(result)
    ) {
      navigate("/purchases/debit-notes");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSubmitWithStatus(form.status || "pending");
  };

  const handleDownload = () => {
    dispatch(exportDebitNoteList());
  };

  /* =====================================================
     CANCEL
  ===================================================== */

  const handleCancel = () => {
    navigate("/purchases/debit-notes");
  };

  /* =====================================================
     ERROR
  ===================================================== */

  const errorText = useMemo(() => {
    if (!error) {
      return "";
    }

    if (typeof error === "string") {
      return error;
    }

    if (error.detail) {
      return error.detail;
    }

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

  /* =====================================================
     INPUT STYLE
  ===================================================== */

  const inputStyle = {
    width: "100%",
    height: "36px",
    border: "1px solid #E5E7EB",
    borderRadius: "4px",
    padding: "0 12px",
    fontSize: "13px",
    boxSizing: "border-box",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: "11px",
    fontWeight: 500,
    marginBottom: "7px",
    color: "#111827",
    textTransform: "uppercase",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px 24px",
    padding: "20px",
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (isEdit && detailsLoading) {
    return (
      <div
        style={{
          padding: 30,
          textAlign: "center",
        }}
      >
        Loading Debit Note...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <ReusableHeader
        title={isEdit ? "Edit Debit Note" : "Create Debit Note"}
        breadcrumbs={["Purchases", "Debit Notes"]}
        showBack
        onBack={handleCancel}
      />

      {errorText && (
        <div
          style={{
            margin: "10px 0",
            padding: "10px 14px",
            background: "#FDEEEE",
            color: "#B00020",
            borderRadius: "5px",
            fontSize: "13px",
          }}
        >
          {errorText}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: "6px",
          }}
        >
          <div style={gridStyle}>
            <div>
              <label style={labelStyle}>Debit Note Number</label>

              <input
                value={form.debitNoteNumber}
                onChange={(e) =>
                  handleChange("debitNoteNumber", e.target.value)
                }
                placeholder="DN0028"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Against Bill *</label>

              <select
                value={form.billId}
                onChange={(e) => handleBillSelect(e.target.value)}
                style={inputStyle}
              >
                <option value="">Select Bill</option>
                {billOptions.map((bill) => (
                  <option key={bill.id} value={bill.id}>
                    {bill.bill_number} - {bill.vendor_name || bill.bill_to_name || "Vendor"} ({formatCurrency(bill.total_amount)} SAR)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Issue Date</label>

              <input
                type="date"
                value={form.issueDate}
                onChange={(e) => handleChange("issueDate", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Reason *</label>

              <select
                value={form.reason}
                onChange={(e) => handleChange("reason", e.target.value)}
                style={inputStyle}
              >
                <option value="damaged_goods">Damaged Goods</option>

                <option value="short_delivery">Short Delivery</option>

                <option value="purchase_return">Purchase Return</option>

                <option value="billing_error">Billing Error</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Bill Value</label>

              <input
                value={
                  form.billValue !== "" && !isNaN(Number(form.billValue))
                    ? `${formatCurrency(form.billValue)} SAR`
                    : form.billValue
                }
                readOnly
                placeholder="15,000 SAR"
                style={{
                  ...inputStyle,
                  background: "#F9FAFB",
                }}
              />
            </div>

            <div>
              <label style={labelStyle}>Already Debited</label>

              <input
                value={
                  form.alreadyDebited !== "" && !isNaN(Number(form.alreadyDebited))
                    ? `${formatCurrency(form.alreadyDebited)} SAR`
                    : form.alreadyDebited
                }
                readOnly
                placeholder="10,000 SAR"
                style={{
                  ...inputStyle,
                  background: "#F9FAFB",
                }}
              />
            </div>

            <div>
              <label style={labelStyle}>Remaining Balance</label>

              <input
                value={
                  form.remainingBalance !== "" && !isNaN(Number(form.remainingBalance))
                    ? `SAR ${formatCurrency(form.remainingBalance)}`
                    : form.remainingBalance
                }
                readOnly
                placeholder="SAR 5,000"
                style={{
                  ...inputStyle,
                  background: "#FFFBEB",
                  color: "#B45309",
                  fontWeight: 600,
                  borderColor: "#FDE68A",
                }}
              />
            </div>

            <div>
              <label style={labelStyle}>Status</label>

              <select
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value)}
                style={inputStyle}
              >
                <option value="pending">Pending</option>

                <option value="issued">Issued</option>

                <option value="applied">Applied</option>

                <option value="cancelled">Cancelled</option>

                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>From</label>

              <input
                value={form.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Address</label>

              <input
                value={form.companyAddress}
                onChange={(e) => handleChange("companyAddress", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Phone Number</label>

              <input
                value={form.companyPhone}
                onChange={(e) => handleChange("companyPhone", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Email ID</label>

              <input
                value={form.companyEmail}
                onChange={(e) => handleChange("companyEmail", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Vendor *</label>

              <select
                value={form.vendorId}
                onChange={(e) => handleVendorSelect(e.target.value)}
                style={inputStyle}
              >
                <option value="">Company/Client Name</option>
                {vendorOptions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Address *</label>

              <input
                value={form.vendorAddress}
                onChange={(e) => handleChange("vendorAddress", e.target.value)}
                placeholder="Company/Client Address"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Phone Number *</label>

              <input
                value={form.vendorPhone}
                onChange={(e) => handleChange("vendorPhone", e.target.value)}
                placeholder="Company/Client Phone Number"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Finance Contact Email *</label>

              <input
                value={form.vendorEmail}
                onChange={(e) => handleChange("vendorEmail", e.target.value)}
                placeholder="Company/Client Email ID"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            background: "#FFFFFF",
            borderRadius: "6px",
          }}
        >
          <div
            style={{
              padding: "18px 20px 10px",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            ITEMS
          </div>

          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#304BA8",
                    color: "#FFFFFF",
                  }}
                >
                  {[
                    "SL No",
                    "Product",
                    "Reason Detail",
                    "Qty",
                    "Rate",
                    "VAT (%)",
                    "VAT (SAR)",
                    "Unit Price",
                    "Amount",
                    "",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: "10px 8px",
                        fontSize: "12px",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {calculatedItems.map((item, index) => (
                  <tr key={item.id}>
                    <td
                      style={{
                        padding: "12px 8px",
                        textAlign: "center",
                        fontSize: "12px",
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </td>

                    <td>
                      <input
                        value={item.productName || item.particular || item.product || ""}
                        onChange={(e) => {
                          updateItem(item.id, "productName", e.target.value);
                          updateItem(item.id, "particular", e.target.value);
                        }}
                        placeholder="Product 1"
                        style={{
                          ...inputStyle,
                          minWidth: "120px",
                        }}
                      />
                    </td>

                    <td>
                      <input
                        value={item.reasonDetail}
                        onChange={(e) =>
                          updateItem(item.id, "reasonDetail", e.target.value)
                        }
                        placeholder="Invoiced at wrong unit price"
                        style={{
                          ...inputStyle,
                          width: "205px",
                        }}
                      />
                    </td>

                    <td>
                      <input
                        value={item.qty}
                        onChange={(e) =>
                          updateItem(item.id, "qty", e.target.value)
                        }
                        style={{
                          ...inputStyle,
                          width: "45px",
                        }}
                      />
                    </td>

                    <td>
                      <input
                        value={item.rate}
                        onChange={(e) =>
                          updateItem(item.id, "rate", e.target.value)
                        }
                        style={{
                          ...inputStyle,
                          width: "70px",
                        }}
                      />
                    </td>

                    <td>
                      <input
                        value={item.vat}
                        onChange={(e) =>
                          updateItem(item.id, "vat", e.target.value)
                        }
                        style={{
                          ...inputStyle,
                          width: "50px",
                        }}
                      />
                    </td>

                    <td
                      style={{
                        textAlign: "center",
                        fontSize: "12px",
                      }}
                    >
                      {formatCurrency(item.vatAmount)}
                    </td>

                    <td
                      style={{
                        textAlign: "center",
                        fontSize: "12px",
                      }}
                    >
                      SAR {formatCurrency(item.rate)}
                    </td>

                    <td
                      style={{
                        textAlign: "center",
                        color: "#EF4444",
                        fontWeight: 600,
                        fontSize: "12px",
                      }}
                    >
                      SAR {formatCurrency(item.amount)}
                    </td>

                    <td
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        style={{
                          width: "25px",
                          height: "25px",
                          border: "1px solid #EF4444",
                          color: "#EF4444",
                          borderRadius: "50%",
                          background: "#FFFFFF",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              padding: "12px 20px",
            }}
          >
            <button
              type="button"
              onClick={addItem}
              style={{
                border: "none",
                background: "transparent",
                color: "#304BA8",
                cursor: "pointer",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <FiPlus size={13} />
              Add Item
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              padding: "20px",
              borderRadius: "6px",
            }}
          >
            <label style={labelStyle}>Notes & Reason Detail</label>

            <textarea
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Lorem ipsum dolor sit amet..."
              style={{
                width: "100%",
                minHeight: "80px",
                resize: "vertical",
                border: "1px solid #E5E7EB",
                borderRadius: "4px",
                padding: "10px",
                boxSizing: "border-box",
                fontSize: "12px",
              }}
            />
          </div>

          <div
            style={{
              background: "#F5F7FC",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
              }}
            >
              <span>Subtotal</span>

              <strong>SAR {formatCurrency(subtotal)}</strong>
            </div>

            <div
              style={{
                padding: "0 18px 12px",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
              }}
            >
              <span>Tax (15% VAT)</span>

              <strong>SAR {formatCurrency(tax)}</strong>
            </div>

            <div
              style={{
                padding: "14px 18px",
                background: "#FF8500",
                color: "#FFFFFF",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              <span>Total Debit Amount</span>

              <span>SAR {formatCurrency(totalDebitAmount)}</span>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "18px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button
            type="button"
            onClick={handleCancel}
            style={{
              height: "36px",
              padding: "0 22px",
              border: "1px solid #D1D5DB",
              color: "#374151",
              background: "#FFFFFF",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "12px",
            }}
          >
            CANCEL
          </button>

          <button
            type="button"
            onClick={handleDownload}
            style={{
              height: "36px",
              padding: "0 22px",
              border: "1px solid #D1D5DB",
              color: "#374151",
              background: "#FFFFFF",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: 500,
              fontSize: "12px",
            }}
          >
            DOWNLOAD
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmitWithStatus("draft")}
            style={{
              height: "36px",
              padding: "0 22px",
              border: "1px solid #304BA8",
              color: "#304BA8",
              background: "#FFFFFF",
              borderRadius: "4px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontWeight: 500,
              fontSize: "12px",
            }}
          >
            SAVE DRAFT
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSubmitWithStatus(isEdit ? form.status : "pending")}
            style={{
              height: "36px",
              padding: "0 24px",
              border: "none",
              color: "#FFFFFF",
              background: "#304BA8",
              borderRadius: "4px",
              cursor: submitting ? "not-allowed" : "pointer",
              fontWeight: 500,
              fontSize: "12px",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting
              ? "Saving..."
              : isEdit
                ? "UPDATE DEBIT NOTE"
                : "SENT FOR APPROVAL"}
          </button>
        </div>
      </form>
    </div>
  );
};

/* =========================================================
   CURRENCY
========================================================= */

const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default CreateDebitNote;