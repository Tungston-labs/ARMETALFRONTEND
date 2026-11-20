import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getPurchaseOrders,
  getPurchaseOrderById,
} from "../../../../../Redux/finance/purchases/Purchaseordersslice";

// ---- Constants ----

const LIST_ROUTE = "/purchases/bill";

export const PAYMENT_TERMS = ["NET 10", "NET 15", "NET 30"];
export const BILL_STATUSES = ["Unpaid", "Partially Paid", "Fully Paid"];

// Stable empty array so memos don't recompute on every render
const EMPTY = [];

// ---- Helpers ----

const today = () => new Date().toISOString().slice(0, 10);

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
  billDate: today(),
  dueDate: "",
  vendor: "",
  paymentTerms: "NET 10",
  billStatus: "Unpaid",
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
  billNumber: b.bill_number || b.billNumber || "",
  purchaseOrderReference: b.po_number || b.purchase_order_reference || "",
  billDate: b.bill_date || emptyForm.billDate,
  dueDate: b.due_date || "",
  vendor: String(b.vendor?.id ?? b.vendor ?? ""),
  paymentTerms: b.payment_terms || emptyForm.paymentTerms,
  billStatus: b.status || emptyForm.billStatus,
  note: b.note || b.notes || "",
  discount: b.discount != null ? String(parseFloat(b.discount)) : "",
  billTo: b.bill_to || "",
  billToAddress: b.bill_to_address || "",
  billToPhone: b.bill_to_phone || "",
  financeEmail: b.finance_email || "",
});

const billToItems = (b = {}) => {
  const list = b.item_details || b.items || [];
  return list.length
    ? list.map((it) =>
        newItem({
          product: String(it.product?.id ?? it.product ?? ""),
          particular: it.description || it.particular || "",
          qty: it.quantity != null ? String(parseFloat(it.quantity)) : "",
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

export const fmt = (n) =>
  Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// ---- Hook ----

const useCreateBill = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // An :id in the URL means edit mode, otherwise create
  const { id } = useParams();
  const isEdit = Boolean(id);
  const billData = location.state?.billData;

  const purchaseOrders =
    useSelector((s) => s.purchaseOrder?.purchaseOrders) || EMPTY;

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

  // ---- Purchase order list ----

  useEffect(() => {
    dispatch(getPurchaseOrders({ page: 1, page_size: 100 }));
  }, [dispatch]);

  const poOptions = useMemo(
    () =>
      purchaseOrders.map((po) => ({
        value: po.po_number,
        label: po.vendor_name
          ? `${po.po_number} - ${po.vendor_name}`
          : po.po_number,
        id: po.id,
      })),
    [purchaseOrders]
  );

  // Picking a PO sets the reference and copies its items into the bill
  const handlePoChange = async (poNumber) => {
    handleChange("purchaseOrderReference", poNumber);

    const selected = poOptions.find((o) => o.value === poNumber);
    if (!selected) return;

    try {
      const po = await dispatch(getPurchaseOrderById(selected.id)).unwrap();
      setItems(billToItems(po));
    } catch (err) {
      setSaveError(err?.detail || "Failed to load purchase order items.");
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

  const handleSave = async () => {
    setSaveError("");

    const payload = {
      bill_number: form.billNumber.trim(),
      po_reference: form.purchaseOrderReference || undefined,
      bill_date: form.billDate,
      due_date: form.dueDate || undefined,
      vendor: form.vendor,
      payment_terms: form.paymentTerms,
      status: form.billStatus,
      note: form.note || undefined,
      discount: Number(form.discount || 0).toFixed(2),
      items: items.map((i) => ({
        product: i.product,
        description: i.particular || undefined,
        quantity: Number(i.qty || 0).toFixed(2),
        hs_code: i.hsCode || undefined,
        rate: Number(i.rate || 0).toFixed(2),
        vat_percentage: Number(i.vat || 0).toFixed(2),
      })),
    };

    setIsSaving(true);
    try {
      // TODO: connect your bill API / redux thunks here
      console.log(isEdit ? "UPDATE bill" : "CREATE bill", id, payload);
      navigate(LIST_ROUTE);
    } catch (err) {
      setSaveError(err?.detail || err?.message || "Failed to save bill.");
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