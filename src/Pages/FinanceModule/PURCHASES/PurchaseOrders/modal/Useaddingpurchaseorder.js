import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";


import { getVendors } from "../../../../../Redux/finance/purchases/vendorsSlice";

// import {
//   addPurchaseOrder,
//   updatePurchaseOrder,
//   getPurchaseOrderById,
// } from "../../../../../Redux/finance/purchases/purchaseOrderSlice";


export const PAYMENT_TERMS = [
  { value: "immediate", label: "Due on Receipt" },
  { value: "7_days", label: "7 Days" },
  { value: "15_days", label: "15 Days" },
  { value: "30_days", label: "30 Days" },
  { value: "45_days", label: "45 Days" },
  { value: "60_days", label: "60 Days" },
  { value: "90_days", label: "90 Days" },
];

export const ORDER_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "ordered", label: "Ordered" },
  { value: "received", label: "Received" },
  { value: "cancelled", label: "Cancelled" },
];

// TODO: replace with a warehouses API/slice when you have one
export const WAREHOUSES = [
  { value: "main", label: "Main Warehouse" },
  { value: "riyadh", label: "Riyadh Warehouse" },
  { value: "jeddah", label: "Jeddah Warehouse" },
];

export const SHIPPING_METHODS = [
  { value: "road", label: "Road" },
  { value: "air", label: "Air" },
  { value: "sea", label: "Sea" },
  { value: "courier", label: "Courier" },
  { value: "pickup", label: "Self Pickup" },
];

const VAT_RATE = 15;

let nextItemId = 1;
const newItem = (slNo = 1) => ({
  id: nextItemId++,
  slNo,
  item: "",
  description: "",
  qty: "",
  unit: "",
  rate: "",
  vat: String(VAT_RATE),
});

const toNum = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};

// Per-row maths, kept in one place so the table and summary always agree
const rowTotals = (row) => {
  const base = toNum(row.qty) * toNum(row.rate);
  const vatAmount = (base * toNum(row.vat)) / 100;
  return { base, vatAmount, amount: base + vatAmount };
};

const fmt = (n) =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const useAddingPurchaseOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // If there is an :id in the URL we are editing, otherwise adding
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [isLoading, setIsLoading] = useState(isEdit);

  const vendors = useSelector((state) => state.vendor?.vendors) || [];

  const [form, setForm] = useState({
    vendorId: "",
    poNumber: "",
    orderDate: new Date().toISOString().slice(0, 10),
    expectedDate: "",
    paymentTerm: "",
    orderStatus: "draft",
    warehouse: "",
    shippingMethod: "",
    discount: "",
    notes: "",
  });
  const [items, setItems] = useState([newItem(1)]);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Load vendors for the dropdown (large page so the list is complete)
  useEffect(() => {
    if (!vendors.length) {
      dispatch(getVendors({ page: 1, page_size: 100, ordering: "name" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Edit mode: load the purchase order and prefill the form
  useEffect(() => {
    if (!isEdit) return;
    let active = true;

    (async () => {
      try {
        const po = await dispatch(getPurchaseOrderById(id)).unwrap();
        if (!active) return;

        // Inverse of the save payload; adjust field names to your API
        setForm({
          vendorId: String(po.vendor?.id ?? po.vendor ?? ""),
          poNumber: po.po_number || "",
          orderDate: po.order_date || "",
          expectedDate: po.expected_delivery_date || "",
          paymentTerm: po.payment_term || "",
          orderStatus: po.order_status || "draft",
          warehouse: po.receiving_warehouse || "",
          shippingMethod: po.shipping_method || "",
          discount: po.discount != null ? String(po.discount) : "",
          notes: po.notes || "",
        });

        const loaded = (po.items || []).map((it, idx) => ({
          ...newItem(idx + 1),
          item: it.item_name || "",
          description: it.description || "",
          qty: it.quantity != null ? String(it.quantity) : "",
          unit: it.unit || "",
          rate: it.rate != null ? String(it.rate) : "",
          vat: it.vat_percent != null ? String(it.vat_percent) : String(VAT_RATE),
        }));
        setItems(loaded.length ? loaded : [newItem(1)]);
      } catch (err) {
        console.error("Failed to load purchase order:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [dispatch, id, isEdit]);

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Picking a vendor pre-fills their default payment term
  const handleVendorChange = (e) => {
    const vid = e.target.value;
    const vendor = vendors.find((v) => String(v.id) === String(vid));
    setForm((prev) => ({
      ...prev,
      vendorId: vid,
      paymentTerm: vendor?.payment_term || prev.paymentTerm,
    }));
    setErrors((prev) => ({ ...prev, vendorId: undefined }));
  };

  // ---- Items ----
  const addItem = () =>
    setItems((prev) => [...prev, newItem(prev.length + 1)]);

  const removeItem = (itemId) =>
    setItems((prev) =>
      prev.length === 1
        ? prev // always keep one row
        : prev
            .filter((i) => i.id !== itemId)
            .map((i, idx) => ({ ...i, slNo: idx + 1 }))
    );

  const updateItem = (itemId, field, value) =>
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, [field]: value } : i))
    );

  // Rows with computed VAT and amount for display
  const rows = useMemo(
    () =>
      items.map((i) => {
        const t = rowTotals(i);
        return { ...i, vatAmount: fmt(t.vatAmount), amount: fmt(t.amount) };
      }),
    [items]
  );

  const summary = useMemo(() => {
    const totals = items.map(rowTotals);
    const subTotal = totals.reduce((s, t) => s + t.base, 0);
    const vat = totals.reduce((s, t) => s + t.vatAmount, 0);
    const discount = toNum(form.discount);
    const beforeRound = subTotal + vat - discount;
    const total = Math.round(beforeRound);
    return {
      subTotal: fmt(subTotal),
      vat: fmt(vat),
      discount: fmt(discount),
      roundOff: fmt(total - beforeRound),
      total: fmt(total),
    };
  }, [items, form.discount]);

  // ---- Validation + save ----
  const validate = () => {
    const e = {};
    if (!form.vendorId) e.vendorId = "Select a vendor";
    if (!form.poNumber.trim()) e.poNumber = "PO number is required";
    if (!form.orderDate) e.orderDate = "Order date is required";
    if (!form.expectedDate) e.expectedDate = "Expected delivery date is required";
    else if (form.orderDate && form.expectedDate < form.orderDate)
      e.expectedDate = "Must be on or after the order date";
    if (!form.paymentTerm) e.paymentTerm = "Select payment terms";
    if (!form.orderStatus) e.orderStatus = "Select a status";
    if (!form.warehouse) e.warehouse = "Select a warehouse";
    if (!form.shippingMethod) e.shippingMethod = "Select a shipping method";

    const itemErrors = {};
    items.forEach((i) => {
      const r = {};
      if (!i.item.trim()) r.item = "Required";
      if (!(toNum(i.qty) > 0)) r.qty = "Enter qty";
      if (!(toNum(i.rate) > 0)) r.rate = "Enter rate";
      if (Object.keys(r).length) itemErrors[i.id] = r;
    });
    if (Object.keys(itemErrors).length) e.items = itemErrors;

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      // Field names are a guess at your Django model; adjust to match the API
      const payload = {
        vendor: form.vendorId,
        po_number: form.poNumber.trim(),
        order_date: form.orderDate,
        expected_delivery_date: form.expectedDate,
        payment_term: form.paymentTerm,
        order_status: form.orderStatus,
        receiving_warehouse: form.warehouse,
        shipping_method: form.shippingMethod,
        discount: toNum(form.discount),
        notes: form.notes || undefined,
        items: items.map((i) => ({
          item_name: i.item.trim(),
          description: i.description || undefined,
          quantity: toNum(i.qty),
          unit: i.unit || undefined,
          rate: toNum(i.rate),
          vat_percent: toNum(i.vat),
        })),
      };

      if (isEdit) {
        await dispatch(updatePurchaseOrder({ id, data: payload })).unwrap();
      } else {
        await dispatch(addPurchaseOrder(payload)).unwrap();
      }
      navigate("/purchases/purchase-orders");
    } catch (err) {
      console.error("Failed to save purchase order:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => navigate(-1);

  return {
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
  };
};

export default useAddingPurchaseOrder;