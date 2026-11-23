import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getApprovedPurchaseOrders,
  getApprovedPurchaseOrderDetail,
  selectApprovedPurchaseOrders,
  addBill,
  editBill,
} from "../../../../../Redux/finance/purchases/BillSlice";

// ---- Constants ----

const LIST_ROUTE = "/purchases/bill";

export const PAYMENT_TERMS = ["NET 10", "NET 15", "NET 30"];

// value = what the backend accepts, label = what the user sees
export const BILL_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "send_for_approval", label: "Send for Approval" },
  { value: "received", label: "Received" },
];

// Stable empty array so memos don't recompute on every render
const EMPTY = [];

// ---- Helpers ----

const today = () => new Date().toISOString().slice(0, 10);

// "Send for Approval" -> "send_for_approval"
const normalizeStatus = (s, fallback = "draft") =>
  String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_") || fallback;

let nextItemId = 1;
const newItem = (overrides = {}) => ({
  id: nextItemId++,
  product: "",
  particular: "",
  qty: "",
  hsCode: "",
  rate: "",
  vat: "15",
  ...overrides,
});

const emptyForm = {
  billNumber: "",
  purchaseOrderReference: "",
  purchaseOrderId: "",
  billDate: today(),
  dueDate: "",
  vendor: "",
  paymentTerms: "NET 10",
  billStatus: "draft",
  note: "",
  discount: "",
  from: "",
  fromAddress: "",
  phoneNumber: "",
  email: "",
  billTo: "",
  billToAddress: "",
  billToPhone: "",
  financeEmail: "",
};

// Bill from the list/API -> form values (adjust keys to your API)
const billToForm = (b = {}) => ({
  ...emptyForm,
  billNumber: b.bill_number || b.invoice_number || b.billNumber || "",
  purchaseOrderReference:
    b.po_number || b.po_reference || b.purchase_order_reference || "",
  purchaseOrderId: String(b.purchase_order_id ?? ""),
  billDate: b.bill_date || emptyForm.billDate,
  dueDate: b.due_date || "",
  vendor: String(b.vendor?.id ?? b.vendor ?? ""),
  paymentTerms: b.payment_terms || emptyForm.paymentTerms,
  billStatus: normalizeStatus(b.status, emptyForm.billStatus),
  note: b.note || b.notes || "",
  discount: b.discount != null ? String(parseFloat(b.discount)) : "",
  from: b.from_name || "",
  fromAddress: b.from_address || "",
  phoneNumber: b.from_phone || "",
  email: b.from_email || "",
  billTo: b.bill_to_name || b.vendor_name || b.bill_to || "",
  billToAddress: b.bill_to_address || "",
  billToPhone: b.bill_to_phone || "",
  financeEmail:
    b.finance_contact_email || b.bill_to_email || b.finance_email || "",
});

const billToItems = (b = {}) => {
  const list = b.item_details || b.items || [];
  return list.length
    ? list.map((it) =>
        newItem({
          product: String(it.product?.id ?? it.product ?? ""),
          particular: it.description || it.particular || "",
          qty:
            it.quantity != null
              ? String(parseFloat(it.quantity))
              : it.qty != null
              ? String(parseFloat(it.qty))
              : "",
          hsCode: it.hs_code || "",
          rate: it.rate != null ? String(parseFloat(it.rate)) : "",
          vat:
            it.vat_percentage != null
              ? String(parseFloat(it.vat_percentage))
              : "15",
        })
      )
    : [newItem()];
};

// ---- Approved purchase order helpers (adjust keys to your API) ----

const getPoNumber = (po = {}) =>
  po.po_number ||
  po.po_reference ||
  po.purchase_order_number ||
  po.reference ||
  "";

const getPoVendorName = (po = {}) =>
  po.vendor_name || po.vendor?.name || po.vendor?.vendor_name || "";

// Vendor + "from" details from a PO -> bill form fields.
// Only keys that actually have a value are returned, so nothing is blanked out.
const poToFormPatch = (po = {}) => {
  const vendorObj = typeof po.vendor === "object" && po.vendor ? po.vendor : {};

  const patch = {
    purchaseOrderId: String(po.purchase_order_id ?? po.id ?? ""),
    vendor: String(vendorObj.id ?? po.vendor_id ?? po.vendor ?? ""),

    // Vendor / bill to
    billTo: po.vendor_name || po.bill_to_name || vendorObj.name || "",
    billToAddress: po.bill_to_address || "",
    billToPhone: po.bill_to_phone || "",
    financeEmail: po.finance_contact_email || po.bill_to_email || "",

    // From
    from: po.from_name || "",
    fromAddress: po.from_address || "",
    phoneNumber: po.from_phone || "",
    email: po.from_email || "",
  };

  return Object.fromEntries(
    Object.entries(patch).filter(([, value]) => value)
  );
};

export const fmt = (n) =>
  Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// Turn a backend error (string or { field: ["msg"] }) into one readable line
const errorToMessage = (err, fallback) => {
  if (typeof err === "string") return err;
  if (err?.detail) return err.detail;
  if (err?.message) return err.message;
  if (err && typeof err === "object") {
    const text = Object.entries(err)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
      .join(" | ");
    if (text) return text;
  }
  return fallback;
};

// ---- Hook ----

const useCreateBill = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // An :id in the URL means edit mode, otherwise create
  const { id } = useParams();
  const isEdit = Boolean(id);
  const billData = location.state?.billData;

  const purchaseOrders = useSelector(selectApprovedPurchaseOrders) || EMPTY;

  const [form, setForm] = useState(() =>
    isEdit && billData ? billToForm(billData) : emptyForm
  );
  const [items, setItems] = useState(() =>
    isEdit && billData ? billToItems(billData) : [newItem()]
  );
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // ---- Approved purchase order list ----

  useEffect(() => {
    dispatch(getApprovedPurchaseOrders());
  }, [dispatch]);

  const poOptions = useMemo(() => {
    const options = purchaseOrders.map((po) => {
      const poNumber = getPoNumber(po);
      const vendorName = getPoVendorName(po);

      return {
        value: poNumber,
        label: vendorName ? `${poNumber} - ${vendorName}` : poNumber,
        id: po.id ?? po.po_id ?? po.purchase_order_id,
      };
    });

    // In edit mode keep the bill's saved PO visible even if it is no longer
    // in the approved list, so the dropdown doesn't look empty.
    const current = form.purchaseOrderReference;
    if (current && !options.some((o) => o.value === current)) {
      options.unshift({ value: current, label: current, id: null });
    }

    return options;
  }, [purchaseOrders, form.purchaseOrderReference]);

  // Picking a PO sets the reference, fills the vendor details and copies
  // its items into the bill
  const handlePoChange = async (poNumber) => {
    handleChange("purchaseOrderReference", poNumber);

    const selected = poOptions.find((o) => o.value === poNumber);
    if (!selected || !selected.id) return;

    setSaveError("");

    try {
      const response = await dispatch(
        getApprovedPurchaseOrderDetail(selected.id)
      ).unwrap();

      // Handle both { ...po } and { data: { ...po } } responses
      const po =
        response?.data && typeof response.data === "object"
          ? response.data
          : response;

      setForm((prev) => ({ ...prev, ...poToFormPatch(po) }));
      setItems(billToItems(po));
    } catch (err) {
      setSaveError(
        errorToMessage(err, "Failed to load purchase order items.")
      );
    }
  };

  // ---- Items ----

  const handleItemChange = (itemId, field, value) =>
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, [field]: value } : i))
    );

  const handleAddItem = () => setItems((prev) => [...prev, newItem()]);

  // Always keep one row
  const handleRemoveItem = (itemId) =>
    setItems((prev) =>
      prev.length === 1 ? prev : prev.filter((i) => i.id !== itemId)
    );

  // Rows with computed VAT and amount for display
  const rows = useMemo(
    () =>
      items.map((i, index) => {
        const amount = Number(i.rate || 0) * Number(i.qty || 0);
        const vatAmount = (amount * Number(i.vat || 0)) / 100;
        return {
          ...i,
          slNo: String(index + 1).padStart(2, "0"),
          amount,
          vatAmount,
        };
      }),
    [items]
  );

  const calculations = useMemo(() => {
    const subtotal = rows.reduce((s, r) => s + r.amount, 0);
    const vat = rows.reduce((s, r) => s + r.vatAmount, 0);
    const discount = Number(form.discount || 0);
    return { subtotal, vat, discount, total: subtotal + vat - discount };
  }, [rows, form.discount]);

  // ---- Save / cancel ----

  // statusOverride lets "SAVE DRAFT" force status "draft".
  // It must be a string, because onClick={handleSave} passes the click event.
  const handleSave = async (statusOverride) => {
    setSaveError("");

    const status = normalizeStatus(
      typeof statusOverride === "string" ? statusOverride : form.billStatus
    );

    // Request keys mirror the PO detail response; adjust if the bill API
    // reports a validation error for a specific field.
    const payload = {
      purchase_order_id: form.purchaseOrderId || undefined,
      po_reference: form.purchaseOrderReference || undefined,
      bill_date: form.billDate,
      due_date: form.dueDate || undefined,
      vendor: form.vendor || undefined,
      payment_terms: form.paymentTerms,
      status,
      note: form.note || undefined,
      discount: Number(form.discount || 0).toFixed(2),

      from_name: form.from,
      from_address: form.fromAddress,
      from_phone: form.phoneNumber,
      from_email: form.email,

      bill_to_name: form.billTo,
      bill_to_address: form.billToAddress,
      bill_to_phone: form.billToPhone,
      finance_contact_email: form.financeEmail,

      items: items.map((i) => ({
        product: i.product,
        particular: i.particular || undefined,
        quantity: Number(i.qty || 0).toFixed(2),
        hs_code: i.hsCode || undefined,
        rate: Number(i.rate || 0).toFixed(2),
        vat_percentage: Number(i.vat || 0).toFixed(2),
      })),
    };

    setIsSaving(true);
    try {
      if (isEdit) {
        await dispatch(editBill({ id, billData: payload })).unwrap();
      } else {
        await dispatch(addBill(payload)).unwrap();
      }
      navigate(LIST_ROUTE);
    } catch (err) {
      setSaveError(errorToMessage(err, "Failed to save bill."));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => navigate(LIST_ROUTE);

  return {
    form,
    rows,
    calculations,
    saveError,
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
  };
};

export default useCreateBill;