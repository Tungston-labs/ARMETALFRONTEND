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

import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";
import {
  fetchDeliveryNoteById,
  addDeliveryNote,
  editDeliveryNote,
} from "../../../../../Redux/finance/Sales/deliveryNotesSlice";
import { getCustomers as getCustomerList } from "../../../../../Redux/finance/Sales/CustomerSlice";
import { getProducts } from "../../../../../Redux/finance/Product/ProductSlice";

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

const createItem = (index) => ({
  id: `${Date.now()}-${index}`,
  slNo: String(index).padStart(2, "0"),
  product: "",
  productId: null,
  orderedQty: "",
  alreadyDelivered: "",
  deliveringNow: "",
  amount: "",
});

const getProductId = (item, products) => {
  if (item.productId) return normalizeId(item.productId);
  const raw = String(item.product || "").trim();
  if (!raw) return null;
  if (/^\d+$/.test(raw)) return Number(raw);
  const found = products.find(
    (product) =>
      String(
        first(product, ["name", "product_name", "code", "product_code"], ""),
      ).toLowerCase() === raw.toLowerCase(),
  );
  return found ? normalizeId(first(found, ["id", "pk", "product_id"])) : null;
};

const mapApiItem = (item, index) => ({
  id: item?.id ?? `${Date.now()}-${index}`,
  slNo: String(
    first(item, ["sl_no", "slNo"], String(index + 1).padStart(2, "0")),
  ),
  product: first(
    item,
    ["product_name"],
    typeof item?.product === "string" ? item.product : "",
  ),
  productId: first(
    item,
    ["product_id"],
    item?.product?.id ??
      item?.product?.pk ??
      (typeof item?.product === "number" ? item.product : null),
  ),
  orderedQty: first(item, ["ordered_qty", "ordered_quantity", "quantity"], ""),
  alreadyDelivered: first(
    item,
    ["already_delivered", "already_delivered_qty"],
    "",
  ),
  deliveringNow: first(item, ["delivering_now", "delivering_quantity"], ""),
  amount: first(item, ["amount", "delivery_value"], ""),
});

const Createdeliverynotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isEditMode = Boolean(id);

  const customerState = useSelector(
    (state) => state?.customer?.customers ?? [],
  );
  const productState = useSelector((state) => state?.product?.products ?? []);
  const { selectedDeliveryNote, detailsLoading, submitting, submitError } =
    useSelector((state) => state?.deliveryNotes ?? {});

  const customers = useMemo(() => {
    const list =
      customerState?.results ??
      customerState?.data ??
      customerState?.customers ??
      customerState;
    return Array.isArray(list) ? list : [];
  }, [customerState]);

  const products = useMemo(() => {
    const list = productState?.results ?? productState?.data ?? productState;
    return Array.isArray(list) ? list : [];
  }, [productState]);

  const [deliveryNoteNumber, setDeliveryNoteNumber] = useState("");
  const [dispatchDate, setDispatchDate] = useState(today());
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState(today());
  const [status, setStatus] = useState("Draft");
  const [customerId, setCustomerId] = useState("");
  const [orderReference, setOrderReference] = useState("");
  const [warehouse, setWarehouse] = useState("Jeddah");
  const [items, setItems] = useState([createItem(1)]);
  const [notes, setNotes] = useState("");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    dispatch(getCustomerList());
    dispatch(getProducts({ page_size: 200 }));
  }, [dispatch]);

  useEffect(() => {
    if (isEditMode && id) dispatch(fetchDeliveryNoteById(id));
  }, [dispatch, id, isEditMode]);

  const routeData = location.state?.deliveryNoteData || null;

  useEffect(() => {
    const row = selectedDeliveryNote || routeData;
    if (!isEditMode || !row) return;

    setDeliveryNoteNumber(
      first(row, ["delivery_note_number", "deliveryNoteNumber"], ""),
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
    setOrderReference(
      String(
        first(
          row,
          ["sales_order_reference", "salesOrderReference", "order_reference"],
          "",
        ),
      ),
    );
    const warehouseValue =
      row.warehouse && typeof row.warehouse === "object"
        ? row.warehouse.name
        : (row.warehouse_name ?? row.warehouse ?? row.dispatch_location);
    setWarehouse(String(warehouseValue || "Jeddah"));
    setItems(
      Array.isArray(row.items) && row.items.length
        ? row.items.map(mapApiItem)
        : [createItem(1)],
    );
    setNotes(first(row, ["notes", "instructions"], ""));
  }, [isEditMode, selectedDeliveryNote, routeData]);

  const updateItem = (idToUpdate, field, value) => {
    setItems((previous) =>
      previous.map((item) => {
        if (item.id !== idToUpdate) return item;
        const updated = { ...item, [field]: value };
        if (field === "product") updated.productId = null;
        return updated;
      }),
    );
  };

  const getItemBalance = (item) =>
    Math.max(
      0,
      asNumber(item.orderedQty) -
        asNumber(item.alreadyDelivered) -
        asNumber(item.deliveringNow),
    );

  const getItemStatus = (item) => {
    const ordered = asNumber(item.orderedQty);
    const deliveredAfterThis =
      asNumber(item.alreadyDelivered) + asNumber(item.deliveringNow);
    if (ordered > 0 && deliveredAfterThis >= ordered) return "Fully Delivered";
    if (deliveredAfterThis > 0) return "Partial";
    return "Pending";
  };

  const handleCreate = async () => {
    setFormError("");
    if (!deliveryNoteNumber.trim())
      return setFormError("Please enter a delivery note number.");
    if (!customerId) return setFormError("Please select a customer.");
    if (!dispatchDate || !expectedDeliveryDate)
      return setFormError("Please select both dates.");
    if (expectedDeliveryDate < dispatchDate)
      return setFormError(
        "Expected delivery date cannot be earlier than dispatch date.",
      );
    if (!orderReference.trim())
      return setFormError("Please select or enter an order reference.");
    if (!warehouse) return setFormError("Please select a warehouse.");
    if (!items.length || items.some((item) => !getProductId(item, products))) {
      return setFormError("Please select a valid product for every item.");
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

    const payloadItems = items.map((item, index) => ({
      sl_no: item.slNo || String(index + 1).padStart(2, "0"),
      product: getProductId(item, products),
      ordered_qty: asNumber(item.orderedQty),
      already_delivered: asNumber(item.alreadyDelivered),
      delivering_now: asNumber(item.deliveringNow),
      balance: getItemBalance(item),
      amount: asNumber(item.amount),
      status: getItemStatus(item).toLowerCase().replace(/\s+/g, "_"),
    }));

    const payload = {
      delivery_note_number: deliveryNoteNumber.trim(),
      dispatch_date: dispatchDate,
      expected_delivery_date: expectedDeliveryDate,
      delivery_date: expectedDeliveryDate,
      status: apiStatus(status),
      delivery_status: apiStatus(status),
      customer: normalizeId(customerId),
      sales_order_reference: orderReference.trim(),
      warehouse,
      dispatch_location: warehouse,
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
      const message =
        typeof error === "string"
          ? error
          : error?.detail ||
            error?.message ||
            "Unable to save delivery note. Check the API response.";
      setFormError(message);
    }
  };

  const displayedError =
    formError || (typeof submitError === "string" ? submitError : "");

  if (isEditMode && detailsLoading && !selectedDeliveryNote) {
    return (
      <DeliveryNoteContainer>
        <div style={{ padding: 20 }}>Loading delivery note...</div>
      </DeliveryNoteContainer>
    );
  }

  return (
    <DeliveryNoteContainer>
      <ReusableHeader
        title={isEditMode ? "Edit Delivery Note" : "Generate Delivery Notes"}
        breadcrumbs={["Dashboard", "Sales", "Delivery Notes"]}
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
              onChange={(e) => setDeliveryNoteNumber(e.target.value)}
              placeholder="DN 0123"
            />
          </FormGroup>

          <FormGroup>
            <Label>DISPATCH DATE</Label>
            <Input
              type="date"
              value={dispatchDate}
              onChange={(e) => setDispatchDate(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>EXPECTED DELIVERY DATE</Label>
            <Input
              type="date"
              min={dispatchDate}
              value={expectedDeliveryDate}
              onChange={(e) => setExpectedDeliveryDate(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>STATUS</Label>
            <SelectWrapper>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
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
            <Label>CUSTOMER</Label>
            <SelectWrapper>
              <Select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                <option value="">Select Customer</option>
                {customers.map((customer, index) => {
                  const idValue = first(
                    customer,
                    ["id", "pk", "customer_id", "customer_code"],
                    "",
                  );
                  const label = first(
                    customer,
                    ["customer_name", "name", "company_name", "customerName"],
                    `Customer ${index + 1}`,
                  );
                  return (
                    <option key={idValue || index} value={idValue}>
                      {label}
                    </option>
                  );
                })}
              </Select>
              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          <FormGroup>
            <Label>ORDER REFERENCE</Label>
            <SelectWrapper>
              <Select
                value={orderReference}
                onChange={(e) => setOrderReference(e.target.value)}
              >
                <option value="">Select Order Reference</option>
                {orderReference && (
                  <option value={orderReference}>{orderReference}</option>
                )}
              </Select>
              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          <FormGroup className="warehouse-field">
            <Label>WAREHOUSE / DISPATCH LOCATION</Label>
            <SelectWrapper>
              <Select
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
              >
                <option value="">Select Warehouse</option>
                {["Jeddah", "Riyadh", "Dammam"].map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </Select>
              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>
        </FormGrid>

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
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.slNo}</td>
                  <td>
                    <input
                      list="delivery-product-options"
                      value={item.product}
                      placeholder="Select Product"
                      onChange={(e) =>
                        updateItem(item.id, "product", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={item.orderedQty}
                      onChange={(e) =>
                        updateItem(item.id, "orderedQty", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={item.alreadyDelivered}
                      onChange={(e) =>
                        updateItem(item.id, "alreadyDelivered", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      value={item.deliveringNow}
                      onChange={(e) =>
                        updateItem(item.id, "deliveringNow", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input value={getItemBalance(item)} readOnly />
                  </td>
                  <td>
                    <input
                      value={item.amount}
                      onChange={(e) =>
                        updateItem(item.id, "amount", e.target.value)
                      }
                      placeholder="SAR 0.00"
                    />
                  </td>
                  <td>
                    <span
                      className={`item-status ${getItemStatus(item).toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      {getItemStatus(item)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </ItemsTable>
        </ItemsTableWrapper>

        <datalist id="delivery-product-options">
          {products.map((product, index) => (
            <option
              key={first(product, ["id", "pk", "product_id"], index)}
              value={first(
                product,
                ["product_name", "name", "code", "product_code"],
                "",
              )}
            />
          ))}
        </datalist>

        <NotesSection>
          <Label>Notes &amp; instructions</Label>
          <NotesTextarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter notes and delivery instructions"
          />
        </NotesSection>

        <ButtonWrapper>
          <CancelButton
            type="button"
            onClick={() => navigate("/delivery/notes")}
          >
            CANCEL
          </CancelButton>
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
        </ButtonWrapper>
      </DeliveryNoteForm>
    </DeliveryNoteContainer>
  );
};

export default Createdeliverynotes;
