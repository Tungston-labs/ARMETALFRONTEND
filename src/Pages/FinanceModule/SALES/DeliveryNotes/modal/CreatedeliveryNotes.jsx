import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiChevronDown } from "react-icons/fi";

import {
  DeliveryNoteContainer,
  DeliveryNoteForm,
  FormGrid,
  FormGroup,
  Label,
  Input,
  SelectWrapper,
  Select,
  ItemsTitle,
  ItemsTableWrapper,
  ItemsTable,
  NotesSection,
  NotesTextarea,
  ButtonWrapper,
  CancelButton,
  CreateButton,
} from "./CreatedeliveryNotes.style";

import { fetchWarehouses } from "../../../../../Redux/finance/Product/warehouseSlice";
import {
  getSalesOrders,
  selectSalesOrders,
} from "../../../../../Redux/finance/Sales/Salesorderslice";
import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";
import {
  fetchDeliveryNoteById,
  addDeliveryNote,
  editDeliveryNote,
} from "../../../../../Redux/finance/Sales/deliveryNotesSlice";
import { getCustomers as getCustomerList } from "../../../../../Redux/finance/Sales/CustomerSlice";
import { getProducts } from "../../../../../Redux/finance/Product/ProductSlice";
import { getDeliveryNotePrefill } from "../../../../../services/finance/Sales/deliveryNotesService";

const today = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const dateValue = (value) => {
  if (!value) return "";
  const match = String(value).match(/^\d{4}-\d{2}-\d{2}/);
  if (match) return match[0];
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

const asNumber = (value) => {
  const parsed = Number(
    String(value ?? "")
      .replace(/SAR/gi, "")
      .replace(/INR/gi, "")
      .replace(/AED/gi, "")
      .replace(/,/g, "")
      .trim(),
  );
  return Number.isFinite(parsed) ? parsed : 0;
};

const first = (object, keys, fallback = "") => {
  for (const key of keys) {
    if (
      object?.[key] !== undefined &&
      object?.[key] !== null &&
      object?.[key] !== ""
    )
      return object[key];
  }
  return fallback;
};

const normalizeId = (value) => {
  if (value && typeof value === "object")
    return normalizeId(value.id ?? value.pk ?? value.value);
  if (value === "" || value === null || value === undefined) return null;
  return /^\d+$/.test(String(value)) ? Number(value) : value;
};

const normalizeStatus = (value) => {
  const status = String(value || "Draft")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ");
  if (status === "in transit" || status === "transit") return "In Transit";
  if (status === "partially delivered" || status === "partial")
    return "Partially Delivered";
  if (
    status === "fully delivered" ||
    status === "delivered" ||
    status === "complete"
  )
    return "Delivered";
  if (status === "cancelled" || status === "canceled") return "Cancelled";
  if (status === "dispatched") return "Dispatched";
  return "Draft";
};

const apiStatus = (value) =>
  ({
    Draft: "draft",
    "In Transit": "in_transit",
    Dispatched: "dispatched",
    Delivered: "delivered",
    "Partially Delivered": "partially_delivered",
    Cancelled: "cancelled",
  })[value] || "draft";

const Createdeliverynotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isViewMode =
    location.pathname.includes("/view/") || Boolean(location.state?.isView);
  const isEditMode = Boolean(id) && !isViewMode;

  /* ---------- Redux state ---------- */
  const customerState = useSelector(
    (state) => state?.customer?.customers ?? [],
  );
  // eslint-disable-next-line no-unused-vars
  const productState = useSelector((state) => state?.product?.products ?? []);
  const { selectedDeliveryNote, detailsLoading, submitting, submitError } =
    useSelector((state) => state?.deliveryNotes ?? {});
  const warehouseList = useSelector(
    (state) => state?.warehouse?.warehouses ?? [],
  );
  const salesOrders = useSelector(selectSalesOrders);

  const customers = useMemo(() => {
    const list =
      customerState?.results ??
      customerState?.data ??
      customerState?.customers ??
      customerState;
    return Array.isArray(list) ? list : [];
  }, [customerState]);

  /* ---------- Form state ---------- */
  const [deliveryNoteNumber, setDeliveryNoteNumber] = useState("");
  const [dispatchDate, setDispatchDate] = useState(today());
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(today());
  const [status, setStatus] = useState("Draft");
  const [customerId, setCustomerId] = useState("");
  const [customerLabel, setCustomerLabel] = useState("");
  const [orderReference, setOrderReference] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [warehouse, setWarehouse] = useState("");
  const [items, setItems] = useState([]);
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");

  const selectedCustomerObj = useMemo(
    () => customers.find((c) => String(c.id) === String(customerId)),
    [customers, customerId],
  );
  const currency = selectedCustomerObj?.currency || "SAR";

  const selectedOrderObj = useMemo(
    () =>
      (Array.isArray(salesOrders) ? salesOrders : []).find(
        (o) => (o.so_number || o.order_number) === orderReference,
      ),
    [salesOrders, orderReference],
  );

  // Customer is derived from the selected order, so it is display-only.
  const customerName =
    selectedCustomerObj?.customer_name ||
    selectedCustomerObj?.name ||
    selectedOrderObj?.customer_name ||
    customerLabel ||
    "";

  // All sales orders are selectable; the customer follows the order.
  const orderOptions = useMemo(
    () => (Array.isArray(salesOrders) ? salesOrders : []),
    [salesOrders],
  );

  /* ---------- Load initial data ---------- */
  useEffect(() => {
    dispatch(getCustomerList());
    dispatch(getProducts({ page_size: 200 }));
    dispatch(fetchWarehouses({ page_size: 200 }));
    dispatch(getSalesOrders({ page_size: 200 }));
  }, [dispatch]);

  useEffect(() => {
    if ((isEditMode || isViewMode) && id) dispatch(fetchDeliveryNoteById(id));
  }, [dispatch, id, isEditMode, isViewMode]);

  const routeData = location.state?.deliveryNoteData || null;

  /* ---------- Edit/View mode populate ---------- */
  useEffect(() => {
    const row = selectedDeliveryNote || routeData;
    if ((!isEditMode && !isViewMode) || !row) return;

    setDeliveryNoteNumber(
      first(row, ["delivery_note_number", "deliveryNoteNumber", "dn_number"], ""),
    );
    setDispatchDate(
      dateValue(first(row, ["dispatch_date", "dispatchDate"], "")) || today(),
    );
    setExpectedDeliveryDate(
      dateValue(
        first(
          row,
          ["expected_delivery_date", "expectedDeliveryDate", "delivery_date"],
          "",
        ),
      ) || today(),
    );
    setStatus(
      normalizeStatus(
        first(row, ["status", "delivery_status", "deliveryStatus"], "Draft"),
      ),
    );
    const customer =
      row.customer && typeof row.customer === "object"
        ? (row.customer.id ?? row.customer.pk)
        : (row.customer_id ?? row.customer);
    setCustomerId(customer == null ? "" : String(customer));
    setCustomerLabel(
      row.customer_name ||
        (row.customer && typeof row.customer === "object"
          ? row.customer.customer_name || row.customer.name
          : "") ||
        "",
    );

    const orderRef = String(
      first(
        row,
        ["sales_order_reference", "salesOrderReference", "order_reference", "so_ref"],
        "",
      ),
    );
    setOrderReference(orderRef);
    if (row.sales_order) setSelectedOrderId(row.sales_order);

    const warehouseValue =
      row.warehouse && typeof row.warehouse === "object"
        ? (row.warehouse.id ?? row.warehouse.pk)
        : (row.warehouse_id ?? row.warehouse);
    setWarehouse(warehouseValue == null ? "" : String(warehouseValue));

    if (Array.isArray(row.items) && row.items.length) {
      setItems(
        row.items.map((item, idx) => {
          const ordered = asNumber(item.ordered_qty ?? item.ordered_quantity ?? item.quantity);
          const already = asNumber(item.already_delivered ?? 0);
          const now = asNumber(item.delivering_now ?? item.quantity ?? 0);
          const rate = asNumber(item.rate ?? 0);
          const vatPct = asNumber(item.vat_percentage ?? 15);
          const base = now * rate;
          const vat = base * (vatPct / 100);
          const amount = asNumber(item.amount) || base + vat;

          let itemStatus = "Pending";
          if (already + now >= ordered && ordered > 0) {
            itemStatus = "Fully Delivered";
          } else if (already + now > 0) {
            itemStatus = "Partial";
          }

          return {
            id: item.id || `${Date.now()}-${idx}`,
            sales_order_item: item.sales_order_item || null,
            productId: item.product?.id ?? item.product ?? null,
            product:
              item.product_name ||
              item.item_name ||
              item.service_name ||
              item.product?.product_name ||
              "Product",
            slNo: String(idx + 1).padStart(2, "0"),
            orderedQty: ordered,
            alreadyDelivered: already,
            deliveringNow: now,
            balance: Math.max(0, ordered - already - now),
            rate,
            vat_percentage: vatPct,
            amount,
            status: itemStatus,
          };
        }),
      );
    }
    setNotes(first(row, ["notes", "instructions"], ""));
  }, [isEditMode, isViewMode, selectedDeliveryNote, routeData]);

  /* ---------- Sales Order Selection & Items Prefill ---------- */
  const handleOrderChange = async (selectedRef) => {
    setOrderReference(selectedRef);
    if (!selectedRef) {
      setSelectedOrderId(null);
      setCustomerId("");
      setCustomerLabel("");
      setWarehouse("");
      setItems([]);
      return;
    }

    const matchedOrder = (Array.isArray(salesOrders) ? salesOrders : []).find(
      (o) => (o.so_number || o.order_number) === selectedRef,
    );

    if (matchedOrder) {
      setSelectedOrderId(matchedOrder.id);
      const custVal =
        matchedOrder.customer?.id ??
        matchedOrder.customer_id ??
        matchedOrder.customer;
      if (custVal) {
        setCustomerId(String(custVal));
      } else if (matchedOrder.customer_name) {
        const foundCust = customers.find(
          (c) =>
            (c.customer_name || c.name || "").toLowerCase().trim() ===
            matchedOrder.customer_name.toLowerCase().trim(),
        );
        if (foundCust) setCustomerId(String(foundCust.id));
      }
      setCustomerLabel(matchedOrder.customer_name || "");
      if (matchedOrder.warehouse) {
        setWarehouse(String(matchedOrder.warehouse));
      }
    }

    // Try API prefill first for live already_delivered & stock data
    if (matchedOrder?.id) {
      try {
        const prefill = await getDeliveryNotePrefill(matchedOrder.id);
        if (prefill) {
          if (prefill.customer) setCustomerId(String(prefill.customer));
          if (prefill.customer_name) setCustomerLabel(prefill.customer_name);
          if (prefill.warehouse) setWarehouse(String(prefill.warehouse));
          if (Array.isArray(prefill.items) && prefill.items.length) {
            setItems(
              prefill.items.map((it, idx) => {
                const ordered = asNumber(it.ordered_qty);
                const already = asNumber(it.already_delivered);
                const now = asNumber(it.delivering_now);
                const rate = asNumber(it.rate);
                const vatPct = asNumber(it.vat_percentage);
                const base = now * rate;
                const vat = base * (vatPct / 100);
                const amount = asNumber(it.amount) || base + vat;

                return {
                  id: `${Date.now()}-${idx}`,
                  sales_order_item: it.sales_order_item || null,
                  productId: it.product || null,
                  product: it.product_name || it.item_name || it.service_name || "Product",
                  slNo: String(idx + 1).padStart(2, "0"),
                  orderedQty: ordered,
                  alreadyDelivered: already,
                  deliveringNow: now,
                  balance: Math.max(0, ordered - already - now),
                  rate,
                  vat_percentage: vatPct,
                  amount,
                  status: it.status || (now >= ordered - already && ordered > 0 ? "Fully Delivered" : (now > 0 ? "Partial" : "Pending")),
                };
              }),
            );
            return;
          }
        }
      } catch (e) {
        console.warn("Could not fetch delivery note prefill, falling back to local sales order items:", e);
      }
    }

    // Fallback: Populate directly from local sales order items
    if (matchedOrder && Array.isArray(matchedOrder.items) && matchedOrder.items.length) {
      setItems(
        matchedOrder.items.map((it, idx) => {
          const ordered = asNumber(it.quantity);
          const already = asNumber(it.delivered_quantity);
          const now = Math.max(0, ordered - already);
          const rate = asNumber(it.rate);
          const vatPct = asNumber(it.vat_percentage ?? 15);
          const base = now * rate;
          const vat = base * (vatPct / 100);
          const amount = base + vat;

          let itemStatus = "Pending";
          if (already + now >= ordered && ordered > 0) {
            itemStatus = "Fully Delivered";
          } else if (already + now > 0) {
            itemStatus = "Partial";
          }

          return {
            id: `${Date.now()}-${idx}`,
            sales_order_item: it.id || null,
            productId: it.product?.id ?? it.product ?? null,
            product: it.product_name || it.service_name || "Product",
            slNo: String(idx + 1).padStart(2, "0"),
            orderedQty: ordered,
            alreadyDelivered: already,
            deliveringNow: now,
            balance: Math.max(0, ordered - already - now),
            rate,
            vat_percentage: vatPct,
            amount,
            status: itemStatus,
          };
        }),
      );
    }
  };

  /* ---------- Delivering Now Edit & Auto Calculate ---------- */
  const handleDeliveringNowChange = (index, value) => {
    setItems((prev) => {
      const next = [...prev];
      const item = { ...next[index] };
      const now = asNumber(value);
      item.deliveringNow = value;

      const ordered = asNumber(item.orderedQty);
      const already = asNumber(item.alreadyDelivered);
      item.balance = Math.max(0, ordered - already - now);

      const rate = asNumber(item.rate);
      const vatPct = asNumber(item.vat_percentage ?? 15);
      const base = now * rate;
      const vat = base * (vatPct / 100);
      item.amount = base + vat;

      if (already + now >= ordered && ordered > 0) {
        item.status = "Fully Delivered";
      } else if (already + now > 0) {
        item.status = "Partial";
      } else {
        item.status = "Pending";
      }

      next[index] = item;
      return next;
    });
  };

  /* ---------- Submit Handler ---------- */
  const handleCreate = async () => {
    setFormError("");
    if (!orderReference.trim())
      return setFormError("Please select an order reference.");
    if (!customerId)
      return setFormError("The selected order has no customer linked.");
    if (!dispatchDate || !expectedDeliveryDate)
      return setFormError("Please select both dispatch and delivery dates.");
    if (expectedDeliveryDate < dispatchDate)
      return setFormError(
        "Expected delivery date cannot be earlier than dispatch date.",
      );
    if (!warehouse) return setFormError("Please select a warehouse.");

    if (!items.length) {
      return setFormError("Please select an Order Reference with products to deliver.");
    }

    if (
      items.some(
        (item) =>
          asNumber(item.deliveringNow) >
          Math.max(
            0,
            asNumber(item.orderedQty) - asNumber(item.alreadyDelivered),
          ),
      )
    ) {
      return setFormError(
        "Delivering Now cannot exceed the remaining ordered quantity.",
      );
    }

    const payloadItems = items.map((item, index) => {
      const delivering = asNumber(item.deliveringNow);
      const rate = asNumber(item.rate);
      const vatPct = asNumber(item.vat_percentage ?? 15);
      const base = delivering * rate;
      const vatAmt = base * (vatPct / 100);

      return {
        sales_order_item: item.sales_order_item || undefined,
        product: item.productId || undefined,
        item_name: item.product || "Product",
        service_name: item.product || "Product",
        quantity: delivering,
        delivering_now: delivering,
        rate: rate,
        vat_percentage: vatPct,
        vat_amount: vatAmt,
        amount: base + vatAmt,
        sl_no: item.slNo || String(index + 1).padStart(2, "0"),
      };
    });

    // The DN number is generated by the backend, so it is never sent.
    const payload = {
      sales_order: selectedOrderId || undefined,
      so_ref: orderReference.trim(),
      sales_order_reference: orderReference.trim(),
      dispatch_date: dispatchDate,
      expected_delivery_date: expectedDeliveryDate,
      delivery_date: expectedDeliveryDate,
      delivery_status: apiStatus(status),
      status: apiStatus(status),
      customer: normalizeId(customerId),
      warehouse: normalizeId(warehouse),
      notes: notes.trim(),
      items: payloadItems,
    };

    try {
      if (isEditMode) {
        await dispatch(editDeliveryNote({ id, payload })).unwrap();
      } else {
        await dispatch(addDeliveryNote(payload)).unwrap();
      }
      navigate("/delivery/notes");
    } catch (error) {
      console.error("Delivery note save failed:", error);
      const respData = error?.response?.data || error?.data || error;
      let message = "Unable to save delivery note.";
      if (typeof respData === "string") {
        message = respData;
      } else if (respData?.detail) {
        message = Array.isArray(respData.detail)
          ? respData.detail.join(", ")
          : String(respData.detail);
      } else if (typeof respData === "object") {
        message = Object.entries(respData)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
          .join(" | ");
      }
      setFormError(message);
    }
  };

  const displayedError =
    formError || (typeof submitError === "string" ? submitError : "");

  if ((isEditMode || isViewMode) && detailsLoading && !selectedDeliveryNote) {
    return (
      <DeliveryNoteContainer>
        <div style={{ padding: 20 }}>Loading delivery note...</div>
      </DeliveryNoteContainer>
    );
  }

  return (
    <DeliveryNoteContainer>
      <ReusableHeader
        title={
          isViewMode
            ? "View Delivery Note"
            : isEditMode
            ? "Edit Delivery Note"
            : "Generate Delivery Notes"
        }
        breadcrumbs={["Sales", "Delivery Notes"]}
        showBack
        onBack={() => navigate("/delivery/notes")}
      />

      {displayedError && <div className="form-error">{displayedError}</div>}

      <DeliveryNoteForm>
        <FormGrid>
          <FormGroup>
            <Label>DELIVERY NOTE NUMBER</Label>
            <Input
              value={deliveryNoteNumber}
              placeholder="Auto-generated after save"
              readOnly
              disabled
            />
          </FormGroup>

          <FormGroup>
            <Label>DISPATCH DATE</Label>
            <Input
              type="date"
              value={dispatchDate}
              onChange={(e) => setDispatchDate(e.target.value)}
              readOnly={isViewMode}
              disabled={isViewMode}
            />
          </FormGroup>

          <FormGroup>
            <Label>EXPECTED DELIVERY DATE</Label>
            <Input
              type="date"
              min={dispatchDate}
              value={expectedDeliveryDate}
              onChange={(e) => setExpectedDeliveryDate(e.target.value)}
              readOnly={isViewMode}
              disabled={isViewMode}
            />
          </FormGroup>

          <FormGroup>
            <Label>STATUS</Label>
            <SelectWrapper>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={isViewMode}
              >
                {[
                  "Draft",
                  "In Transit",
                  "Dispatched",
                  "Delivered",
                  "Partially Delivered",
                  "Cancelled",
                ].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          <FormGroup>
            <Label>ORDER REFERENCE</Label>
            <SelectWrapper>
              <Select
                value={orderReference}
                onChange={(e) => handleOrderChange(e.target.value)}
                disabled={isEditMode || isViewMode}
              >
                <option value="">Select Order Reference</option>
                {orderOptions.map((order) => {
                  const ref = order.so_number || order.order_number;
                  return (
                    <option key={order.id} value={ref}>
                      {ref}
                    </option>
                  );
                })}
                {orderReference &&
                  !orderOptions.some(
                    (o) => (o.so_number || o.order_number) === orderReference,
                  ) && (
                    <option value={orderReference}>{orderReference}</option>
                  )}
              </Select>
              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          <FormGroup>
            <Label>CUSTOMER</Label>
            <Input
              value={customerName}
              placeholder="Auto-filled from order reference"
              readOnly
              disabled
            />
          </FormGroup>

          <FormGroup>
            <Label>WAREHOUSE / DISPATCH LOCATION</Label>
            <SelectWrapper>
              <Select
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                disabled={isViewMode}
              >
                <option value="">Select Warehouse</option>
                {warehouseList.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.warehouse_name || w.name || `Warehouse #${w.id}`}
                  </option>
                ))}
              </Select>
              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>
        </FormGrid>

        {/* ITEMS SECTION */}
        <ItemsTitle>ITEMS TO DELIVER</ItemsTitle>

        <ItemsTableWrapper>
          <ItemsTable>
            <thead>
              <tr>
                <th>SL No</th>
                <th>Product</th>
                <th>Ordered Qty</th>
                <th>Already Delivered</th>
                <th>Delivering Now</th>
                <th>Balance</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "24px 0", color: "#6b7280", fontStyle: "italic" }}>
                    Select an Order Reference above to populate items to deliver.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{item.slNo}</td>
                    <td>
                      <input
                        value={item.product}
                        readOnly
                        style={{ background: "#f9fafb", cursor: "default" }}
                      />
                    </td>
                    <td>
                      <input
                        value={item.orderedQty}
                        readOnly
                        style={{ background: "#f9fafb", textAlign: "center" }}
                      />
                    </td>
                    <td>
                      <input
                        value={item.alreadyDelivered}
                        readOnly
                        style={{ background: "#f9fafb", textAlign: "center" }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max={Math.max(0, asNumber(item.orderedQty) - asNumber(item.alreadyDelivered))}
                        value={item.deliveringNow}
                        onChange={(e) =>
                          handleDeliveringNowChange(index, e.target.value)
                        }
                        readOnly={isViewMode}
                        disabled={isViewMode}
                        style={
                          isViewMode
                            ? { background: "#f9fafb", textAlign: "center", cursor: "default" }
                            : { textAlign: "center", fontWeight: 600, borderColor: "#3049a3" }
                        }
                      />
                    </td>
                    <td>
                      <input
                        value={item.balance}
                        readOnly
                        style={{ background: "#f9fafb", textAlign: "center" }}
                      />
                    </td>
                    <td>
                      <input
                        value={`${currency} ${asNumber(item.amount).toFixed(2)}`}
                        readOnly
                        style={{ background: "#f9fafb", textAlign: "right" }}
                      />
                    </td>
                    <td>
                      <span
                        className={`item-status ${String(item.status || "pending").toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </ItemsTable>
        </ItemsTableWrapper>

        {/* NOTES & INSTRUCTIONS */}
        <NotesSection>
          <Label>Notes &amp; instructions</Label>
          <NotesTextarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            readOnly={isViewMode}
            disabled={isViewMode}
            placeholder="Remaining packaging units to be dispatched with next batch from Jeddah DC — awaiting stock replenishment."
          />
        </NotesSection>

        {/* ACTION BUTTONS */}
        <ButtonWrapper>
          <CancelButton
            type="button"
            onClick={() => navigate("/delivery/notes")}
          >
            {isViewMode ? "BACK" : "CANCEL"}
          </CancelButton>
          {!isViewMode && (
            <CreateButton
              type="button"
              onClick={handleCreate}
              disabled={submitting}
            >
              {submitting
                ? isEditMode
                  ? "UPDATING..."
                  : "CREATING..."
                : isEditMode
                  ? "UPDATE"
                  : "CREATE"}
            </CreateButton>
          )}
        </ButtonWrapper>
      </DeliveryNoteForm>
    </DeliveryNoteContainer>
  );
};

export default Createdeliverynotes;