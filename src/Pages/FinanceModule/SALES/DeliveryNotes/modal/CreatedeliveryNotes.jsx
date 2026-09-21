import React, { useEffect, useMemo, useState } from "react";

import { useParams, useNavigate, useLocation } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { FiChevronDown, FiPlus } from "react-icons/fi";

import {
  InvoiceContainer as OrderContainer,
  InvoiceForm as OrderForm,
  SectionTitle,
  FormGrid,
  FormGroup,
  Label,
  Input,
  SelectWrapper,
  Select,
  CalendarInput,
  InvoiceItemsHeader as OrderItemsHeader,
  AddItemButton,
  InvoiceTableWrapper as OrderTableWrapper,
  InvoiceTable as OrderTable,
  PaymentSection,
  PaymentLeft,
  PaymentRight,
  SummaryRow,
  TotalAmount,
  ButtonWrapper,
  CancelButton,
  PreviewButton,
} from "./CreatedeliveryNotes.style";

import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";

import {
  fetchDeliveryNoteById,
  addDeliveryNote,
  editDeliveryNote,
} from "../../../../../Redux/finance/deliveryNotesSlice";

import { getCustomers as getCustomerList } from "../../../../../Redux/finance/CustomerSlice";

/* =========================================================
   CONSTANTS
========================================================= */

const today = new Date().toISOString().split("T")[0];

/* =========================================================
   DATE HELPER
========================================================= */

const toInputDate = (value) => {
  if (!value) {
    return "";
  }

  const stringValue = String(value).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(stringValue)) {
    return stringValue;
  }

  const datePart = stringValue.match(/^(\d{4}-\d{2}-\d{2})/);

  if (datePart) {
    return datePart[1];
  }

  const parsed = new Date(stringValue);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed.toISOString().split("T")[0];
};

/* =========================================================
   NUMBER HELPER
========================================================= */

const toNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const cleaned = String(value).replace(/SAR/gi, "").replace(/,/g, "").trim();

  if (!cleaned) {
    return 0;
  }

  const number = Number(cleaned);

  return Number.isFinite(number) ? number : 0;
};

/* =========================================================
   ID HELPER
========================================================= */

const normalizeId = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  if (typeof value === "object") {
    return normalizeId(
      value?.id ??
        value?.pk ??
        value?.value ??
        value?.customer_id ??
        value?.product_id,
    );
  }

  const stringValue = String(value).trim();

  if (/^\d+$/.test(stringValue)) {
    return Number(stringValue);
  }

  return stringValue;
};

/* =========================================================
   DELIVERY STATUS
========================================================= */

const DELIVERY_STATUS_API_VALUES = {
  Pending: "pending",
  Partially: "partial",
  Partial: "partial",
  "Partially Delivered": "partial",
  "Fully Delivered": "delivered",
  Delivered: "delivered",
};

const normalizeDeliveryStatusForForm = (value) => {
  if (!value) {
    return "Pending";
  }

  const normalized = String(value)
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (["pending", "awaiting", "not_delivered"].includes(normalized)) {
    return "Pending";
  }

  if (["partial", "partially", "partially_delivered"].includes(normalized)) {
    return "Partially";
  }

  if (
    ["delivered", "fully_delivered", "completed", "complete"].includes(
      normalized,
    )
  ) {
    return "Fully Delivered";
  }

  return value;
};

const normalizeDeliveryStatusForApi = (value) => {
  if (!value) {
    return "pending";
  }

  return (
    DELIVERY_STATUS_API_VALUES[value] ||
    String(value).trim().toLowerCase().replace(/\s+/g, "_")
  );
};

/* =========================================================
   ITEM STATUS
========================================================= */

const ITEM_STATUS_API_VALUES = {
  Pending: "pending",
  Partial: "partial",
  Partially: "partial",
  "Fully Delivered": "delivered",
  Delivered: "delivered",
};

const normalizeItemStatusForApi = (value) => {
  if (!value) {
    return "pending";
  }

  return (
    ITEM_STATUS_API_VALUES[value] ||
    String(value).trim().toLowerCase().replace(/\s+/g, "_")
  );
};

/* =========================================================
   PRODUCT ID
========================================================= */

const getProductId = (item) => {
  const rawProduct =
    item?.productId ??
    item?.product_id ??
    item?.product?.id ??
    item?.product?.pk;

  if (rawProduct !== undefined && rawProduct !== null && rawProduct !== "") {
    return normalizeId(rawProduct);
  }

  if (typeof item?.product === "string" && /^\d+$/.test(item.product.trim())) {
    return Number(item.product.trim());
  }

  if (typeof item?.product === "number") {
    return item.product;
  }

  return item?.product ?? "";
};

/* =========================================================
   BACKEND ERROR FORMATTER
========================================================= */

const formatBackendError = (error) => {
  if (!error) {
    return "";
  }

  if (typeof error === "string") {
    return error;
  }

  if (Array.isArray(error)) {
    return error
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }

        return JSON.stringify(item);
      })
      .join(" | ");
  }

  if (typeof error === "object") {
    return Object.entries(error)
      .map(([field, messages]) => {
        if (Array.isArray(messages)) {
          return `${field}: ${messages.join(", ")}`;
        }

        if (typeof messages === "object" && messages !== null) {
          return `${field}: ${JSON.stringify(messages)}`;
        }

        return `${field}: ${messages}`;
      })
      .join(" | ");
  }

  return String(error);
};

/* =========================================================
   DEFAULT ITEM
========================================================= */

const createDefaultItem = (index = 1) => ({
  id: Date.now() + index,

  slNo: String(index).padStart(2, "0"),

  product: "",

  productId: null,

  orderedQty: "",

  alreadyDelivered: "",

  deliveringNow: "",

  balance: "",

  amount: "",

  status: "Pending",
});

/* =========================================================
   DEFAULT ITEMS
========================================================= */

const getDefaultItems = () => [
  {
    id: Date.now(),
    slNo: "01",
    product: "",
    productId: null,
    orderedQty: "",
    alreadyDelivered: "",
    deliveringNow: "",
    balance: "",
    amount: "",
    status: "Pending",
  },
];

/* =========================================================
   MAP API -> FORM
========================================================= */

const mapRowToFormData = (row) => {
  if (!row) {
    return {
      deliveryNoteNumber: "",
      salesOrderReference: "",
      deliveryDate: today,
      deliveryStatus: "Pending",

      orderedValue: "",
      alreadyDelivered: "",
      balanceToDeliver: "",
      thisDelivery: "",

      from: {
        name: "",
        address: "",
        phone: "",
        email: "",
      },

      billTo: {
        client: "",
        clientId: null,
        address: "",
        phone: "",
        email: "",
      },

      notes: "",

      items: getDefaultItems(),
    };
  }

  const customerObject =
    row?.customer && typeof row.customer === "object" ? row.customer : null;

  const billToObject =
    row?.bill_to && typeof row.bill_to === "object"
      ? row.bill_to
      : row?.billTo && typeof row.billTo === "object"
        ? row.billTo
        : null;

  const customerId =
    row?.customer_id ??
    customerObject?.id ??
    customerObject?.pk ??
    billToObject?.clientId ??
    billToObject?.customerId ??
    null;

  const customerValue =
    customerObject?.name ??
    customerObject?.customer_name ??
    customerObject?.company_name ??
    billToObject?.client ??
    row?.customer ??
    "";

  const apiItems = Array.isArray(row?.items) ? row.items : [];

  const mappedItems =
    apiItems.length > 0
      ? apiItems.map((item, index) => {
          const productObject =
            item?.product && typeof item.product === "object"
              ? item.product
              : null;

          const productId =
            item?.product_id ??
            productObject?.id ??
            productObject?.pk ??
            (typeof item?.product === "number" ? item.product : null);

          const productName =
            item?.product_name ??
            productObject?.name ??
            productObject?.product_name ??
            (typeof item?.product === "string" ? item.product : "");

          return {
            id: item?.id ?? Date.now() + index,

            slNo:
              item?.sl_no ?? item?.slNo ?? String(index + 1).padStart(2, "0"),

            product: productName,

            productId: productId,

            orderedQty:
              item?.ordered_qty ??
              item?.ordered_quantity ??
              item?.quantity ??
              "",

            alreadyDelivered:
              item?.already_delivered ?? item?.already_delivered_qty ?? "",

            deliveringNow:
              item?.delivering_now ?? item?.delivering_quantity ?? "",

            balance: item?.balance ?? item?.balance_qty ?? "",

            amount: item?.amount ?? item?.delivery_value ?? "",

            status: normalizeDeliveryStatusForForm(item?.status || "Pending"),
          };
        })
      : getDefaultItems();

  return {
    deliveryNoteNumber:
      row?.delivery_note_number ??
      row?.deliveryNoteNumber ??
      row?.order_number ??
      "",

    salesOrderReference:
      row?.sales_order_reference ??
      row?.salesOrderReference ??
      row?.so_number ??
      "",

    deliveryDate:
      toInputDate(row?.delivery_date ?? row?.deliveryDate ?? "") || today,

    deliveryStatus: normalizeDeliveryStatusForForm(
      row?.delivery_status ?? row?.deliveryStatus ?? row?.status ?? "Pending",
    ),

    orderedValue: row?.ordered_value ?? row?.orderedValue ?? "",

    alreadyDelivered: row?.already_delivered ?? row?.alreadyDelivered ?? "",

    balanceToDeliver: row?.balance_to_deliver ?? row?.balanceToDeliver ?? "",

    thisDelivery: row?.this_delivery ?? row?.thisDelivery ?? "",

    from: {
      name: row?.from_name ?? row?.from?.name ?? "",

      address: row?.from_address ?? row?.from?.address ?? "",

      phone: row?.from_phone ?? row?.from?.phone ?? "",

      email: row?.from_email ?? row?.from?.email ?? "",
    },

    billTo: {
      client: customerValue,

      clientId: customerId,

      address: row?.customer_address ?? billToObject?.address ?? "",

      phone: row?.customer_phone ?? billToObject?.phone ?? "",

      email:
        row?.finance_contact_email ??
        row?.customer_email ??
        billToObject?.email ??
        "",
    },

    notes: row?.notes ?? "",

    items: mappedItems,
  };
};

/* =========================================================
   BUILD API PAYLOAD
========================================================= */

const buildPayload = ({
  deliveryNoteNumber,
  salesOrderReference,
  deliveryDate,
  deliveryStatus,
  orderedValue,
  alreadyDelivered,
  balanceToDeliver,
  thisDelivery,
  from,
  billTo,
  notes,
  items,
}) => {
  const rawCustomer =
    billTo?.clientId ?? billTo?.customerId ?? billTo?.client ?? "";

  const customer = normalizeId(rawCustomer);

  return {
    delivery_note_number: String(deliveryNoteNumber ?? "").trim(),

    sales_order_reference: String(salesOrderReference ?? "").trim(),

    /*
     * Real customer ID from the
     * customer dropdown.
     */
    customer,

    /*
     * Always send a real date.
     */
    delivery_date: deliveryDate || today,

    /*
     * Convert UI label to API value.
     */
    delivery_status: normalizeDeliveryStatusForApi(deliveryStatus),

    ordered_value: toNumber(orderedValue),

    already_delivered: toNumber(alreadyDelivered),

    balance_to_deliver: toNumber(balanceToDeliver),

    this_delivery: toNumber(thisDelivery),

    from_name: from?.name?.trim() || "",

    from_address: from?.address?.trim() || "",

    from_phone: from?.phone?.trim() || "",

    from_email: from?.email?.trim() || "",

    customer_address: billTo?.address?.trim() || "",

    customer_phone: billTo?.phone?.trim() || "",

    finance_contact_email: billTo?.email?.trim() || "",

    notes: notes?.trim() || "",

    items: (Array.isArray(items) ? items : []).map((item, index) => ({
      sl_no: item?.slNo || String(index + 1).padStart(2, "0"),

      product: getProductId(item),

      ordered_qty: toNumber(item?.orderedQty),

      already_delivered: toNumber(item?.alreadyDelivered),

      delivering_now: toNumber(item?.deliveringNow),

      balance: toNumber(item?.balance),

      amount: toNumber(item?.amount),

      status: normalizeItemStatusForApi(item?.status),
    })),
  };
};

/* =========================================================
   COMPONENT
========================================================= */

const Createdeliverynotes = ({ onCancel, onPreview }) => {
  const { id } = useParams();

  const navigate = useNavigate();

  const location = useLocation();

  const dispatch = useDispatch();

  const isEditMode = Boolean(id);

  /* =======================================================
     CUSTOMER REDUX
  ======================================================= */

  const customersFromStore = useSelector((state) => {
    const customerList = state?.customer?.customers;
    if (Array.isArray(customerList)) {
      return customerList;
    }

    const salesOrderCustomers = state?.salesOrder?.customers;
    if (Array.isArray(salesOrderCustomers)) {
      return salesOrderCustomers;
    }

    if (Array.isArray(customerList?.results)) {
      return customerList.results;
    }

    if (Array.isArray(customerList?.data)) {
      return customerList.data;
    }

    if (Array.isArray(salesOrderCustomers?.results)) {
      return salesOrderCustomers.results;
    }

    if (Array.isArray(salesOrderCustomers?.data)) {
      return salesOrderCustomers.data;
    }

    return [];
  });

  const customers = useMemo(() => {
    if (Array.isArray(customersFromStore)) {
      return customersFromStore;
    }

    if (Array.isArray(customersFromStore?.results)) {
      return customersFromStore.results;
    }

    if (Array.isArray(customersFromStore?.data)) {
      return customersFromStore.data;
    }

    if (Array.isArray(customersFromStore?.customers)) {
      return customersFromStore.customers;
    }

    return [];
  }, [customersFromStore]);

  const getCustomerOptionValue = (customer) => {
    const value =
      customer?.id ??
      customer?.pk ??
      customer?.customer_id ??
      customer?.customerCode ??
      customer?.customer_code ??
      customer?.code ??
      "";

    return value === null || value === undefined || value === ""
      ? ""
      : String(value);
  };

  const getCustomerLabel = (customer) => {
    const fallbackName =
      customer?.customer_name ||
      customer?.name ||
      customer?.company_name ||
      customer?.customerName ||
      customer?.companyName ||
      customer?.customerCode ||
      customer?.customer_code ||
      customer?.code ||
      "";

    const fallbackId =
      customer?.customer_id ??
      customer?.customer_code ??
      customer?.id ??
      customer?.pk ??
      "";

    return fallbackName || `Customer #${fallbackId}`;
  };

  /* =======================================================
     DELIVERY NOTE REDUX
  ======================================================= */

  const { selectedDeliveryNote, detailsLoading, submitting, submitError } =
    useSelector((state) => state.deliveryNotes);

  /* =======================================================
     ROUTE DATA
  ======================================================= */

  const routeDeliveryNote =
    location.state?.deliveryNoteData || location.state?.orderData || null;

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [deliveryNoteNumber, setDeliveryNoteNumber] = useState("");

  const [salesOrderReference, setSalesOrderReference] = useState("");

  const [deliveryDate, setDeliveryDate] = useState(today);

  const [deliveryStatus, setDeliveryStatus] = useState("Partially");

  const [orderedValue, setOrderedValue] = useState("");

  const [alreadyDelivered, setAlreadyDelivered] = useState("");

  const [balanceToDeliver, setBalanceToDeliver] = useState("");

  const [thisDelivery, setThisDelivery] = useState("");

  const [from, setFrom] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const [billTo, setBillTo] = useState({
    client: "",
    clientId: null,
    address: "",
    phone: "",
    email: "",
  });

  const [items, setItems] = useState(getDefaultItems());

  const [notes, setNotes] = useState("");

  const [validationError, setValidationError] = useState("");

  /* =======================================================
     FETCH CUSTOMERS
  ======================================================= */

  useEffect(() => {
    dispatch(getCustomerList());
  }, [dispatch]);

  /* =======================================================
     FETCH DELIVERY NOTE DETAIL
  ======================================================= */

  useEffect(() => {
    if (!isEditMode || !id) {
      return;
    }

    dispatch(fetchDeliveryNoteById(id));
  }, [dispatch, id, isEditMode]);

  /* =======================================================
     POPULATE EDIT MODE
  ======================================================= */

  useEffect(() => {
    const source = selectedDeliveryNote || routeDeliveryNote;

    if (!isEditMode || !source) {
      return;
    }

    const mapped = mapRowToFormData(source);

    setDeliveryNoteNumber(mapped.deliveryNoteNumber);

    setSalesOrderReference(mapped.salesOrderReference);

    setDeliveryDate(mapped.deliveryDate || today);

    setDeliveryStatus(mapped.deliveryStatus);

    setOrderedValue(mapped.orderedValue);

    setAlreadyDelivered(mapped.alreadyDelivered);

    setBalanceToDeliver(mapped.balanceToDeliver);

    setThisDelivery(mapped.thisDelivery);

    setFrom(mapped.from);

    setBillTo(mapped.billTo);

    setItems(mapped.items);

    setNotes(mapped.notes);
  }, [isEditMode, selectedDeliveryNote, routeDeliveryNote]);

  /* =======================================================
     CUSTOMER SELECT
  ======================================================= */

  const handleCustomerChange = (e) => {
    const value = e.target.value;

    const selectedCustomer = customers.find((customer) => {
      const customerValue = getCustomerOptionValue(customer);
      return customerValue && String(customerValue) === String(value);
    });

    if (selectedCustomer) {
      const selectedCustomerId = getCustomerOptionValue(selectedCustomer);

      setBillTo({
        client: getCustomerLabel(selectedCustomer),

        clientId: selectedCustomerId,

        address:
          selectedCustomer?.address ?? selectedCustomer?.company_address ?? "",

        phone:
          selectedCustomer?.phone ??
          selectedCustomer?.phone_number ??
          selectedCustomer?.contact_number ??
          "",

        email: selectedCustomer?.email ?? selectedCustomer?.finance_email ?? "",
      });
    } else {
      setBillTo({
        client: value,
        clientId: normalizeId(value),
        address: "",
        phone: "",
        email: "",
      });
    }

    setValidationError("");
  };

  /* =======================================================
     ITEM HANDLERS
  ======================================================= */

  const addItem = () => {
    setItems((previous) => [
      ...previous,
      createDefaultItem(previous.length + 1),
    ]);
  };

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

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateForm = () => {
    const customerId =
      billTo?.clientId ?? billTo?.customerId ?? billTo?.client ?? "";

    if (customerId === "" || customerId === null || customerId === undefined) {
      setValidationError("Please select a customer from BILL TO.");

      return false;
    }

    if (!deliveryDate) {
      setValidationError("Please select a delivery date.");

      return false;
    }

    if (!items.length) {
      setValidationError("Please add at least one delivery item.");

      return false;
    }

    const emptyProduct = items.some(
      (item) => !String(item?.product ?? "").trim(),
    );

    if (emptyProduct) {
      setValidationError("Please enter a product for every delivery item.");

      return false;
    }

    setValidationError("");

    return true;
  };

  /* =======================================================
     SAVE
  ======================================================= */

  const handlePreview = async () => {
    if (submitting) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    const payload = buildPayload({
      deliveryNoteNumber,
      salesOrderReference,
      deliveryDate,
      deliveryStatus,
      orderedValue,
      alreadyDelivered,
      balanceToDeliver,
      thisDelivery,
      from,
      billTo,
      notes,
      items,
    });

    console.log(
      "FINAL DELIVERY NOTE PAYLOAD:",
      JSON.stringify(payload, null, 2),
    );

    /*
     * Keep existing preview callback.
     */
    if (onPreview) {
      onPreview({
        ...(id ? { id } : {}),

        deliveryNoteNumber,

        salesOrderReference,

        deliveryDate,

        deliveryStatus,

        orderedValue,

        alreadyDelivered,

        balanceToDeliver,

        thisDelivery,

        from,

        billTo,

        items,

        notes,

        apiPayload: payload,
      });

      return;
    }

    try {
      let result;

      if (isEditMode) {
        result = await dispatch(
          editDeliveryNote({
            id,
            payload,
          }),
        ).unwrap();
      } else {
        result = await dispatch(addDeliveryNote(payload)).unwrap();
      }

      console.log("DELIVERY NOTE API RESPONSE:", result);

      navigate("/delivery/notes");
    } catch (error) {
      console.error(
        "Delivery Note save failed:",
        JSON.stringify(error, null, 2),
      );

      console.error("Server validation error:", error);
    }
  };

  /* =======================================================
     CANCEL
  ======================================================= */

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
      return;
    }

    navigate("/delivery/notes");
  };

  /* =======================================================
     ERROR
  ======================================================= */

  const displayedError = validationError || formatBackendError(submitError);

  /* =======================================================
     EDIT LOADING
  ======================================================= */

  if (isEditMode && detailsLoading && !selectedDeliveryNote) {
    return (
      <OrderContainer>
        <ReusableHeader
          title="Edit Delivery Note"
          breadcrumbs={["Dashboard", "Sales", "Delivery Notes"]}
          showBack
          onBack={() => navigate("/delivery/notes")}
        />

        <div
          style={{
            padding: 20,
          }}
        >
          Loading delivery note...
        </div>
      </OrderContainer>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <OrderContainer>
      <ReusableHeader
        title={isEditMode ? "Edit Delivery Notes" : "Generate Delivery Notes"}
        breadcrumbs={["Dashboard", "Sales", "Delivery Notes"]}
        showBack
        onBack={() => navigate("/delivery/notes")}
      />

      {displayedError && (
        <div
          style={{
            margin: "0 20px 15px",
            padding: "12px 14px",
            borderRadius: 6,
            background: "#FDECEC",
            border: "1px solid #F5B5B5",
            color: "#B42318",
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          {displayedError}
        </div>
      )}

      <OrderForm>
        <FormGrid>
          {/* DELIVERY NOTE NUMBER */}

          <FormGroup>
            <Label>DELIVERY NOTE NUMBER</Label>

            <Input
              placeholder="DN 0123"
              value={deliveryNoteNumber}
              onChange={(e) => setDeliveryNoteNumber(e.target.value)}
            />
          </FormGroup>

          {/* SALES ORDER REFERENCE */}

          <FormGroup>
            <Label>SALES ORDER REFERENCE</Label>

            <Input
              placeholder="SO 0123 - Clicking"
              value={salesOrderReference}
              onChange={(e) => setSalesOrderReference(e.target.value)}
            />
          </FormGroup>

          {/* DELIVERY DATE */}

          <FormGroup>
            <Label>DELIVERY DATE</Label>

            <CalendarInput>
              <Input
                type="date"
                value={deliveryDate || today}
                onChange={(e) => {
                  setDeliveryDate(e.target.value);

                  setValidationError("");
                }}
              />
            </CalendarInput>
          </FormGroup>

          {/* DELIVERY STATUS */}

          <FormGroup>
            <Label>DELIVERY STATUS</Label>

            <SelectWrapper>
              <Select
                value={deliveryStatus}
                onChange={(e) => setDeliveryStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>

                <option value="Partially">Partially</option>

                <option value="Fully Delivered">Fully Delivered</option>
              </Select>

              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          {/* ORDERED VALUE */}

          <FormGroup>
            <Label>ORDERED VALUE (SO 0123)</Label>

            <Input
              placeholder="22,852 SAR"
              value={orderedValue}
              onChange={(e) => setOrderedValue(e.target.value)}
            />
          </FormGroup>

          {/* ALREADY DELIVERED */}

          <FormGroup>
            <Label>ALREADY DELIVERED</Label>

            <Input
              placeholder="9,240 SAR"
              value={alreadyDelivered}
              onChange={(e) => setAlreadyDelivered(e.target.value)}
            />
          </FormGroup>

          {/* BALANCE TO DELIVER */}

          <FormGroup>
            <Label>BALANCE TO DELIVER</Label>

            <Input
              placeholder="13,612 SAR"
              value={balanceToDeliver}
              onChange={(e) => setBalanceToDeliver(e.target.value)}
              style={{
                background: "#fff5e6",
              }}
            />
          </FormGroup>

          {/* THIS DELIVERY */}

          <FormGroup>
            <Label>THIS DELIVERY</Label>

            <Input
              placeholder="7,320 SAR"
              value={thisDelivery}
              onChange={(e) => setThisDelivery(e.target.value)}
              style={{
                background: "#e0f5ec",
              }}
            />
          </FormGroup>

          {/* FROM */}

          <FormGroup>
            <Label>FROM</Label>

            <Input
              placeholder="TUNGSTON LABS"
              value={from.name}
              onChange={(e) =>
                setFrom((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />
          </FormGroup>

          {/* ADDRESS */}

          <FormGroup>
            <Label>ADDRESS</Label>

            <Input
              placeholder="Tungston Labs, Ullampilly Building,..."
              value={from.address}
              onChange={(e) =>
                setFrom((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
            />
          </FormGroup>

          {/* PHONE */}

          <FormGroup>
            <Label>PHONE NUMBER</Label>

            <Input
              placeholder="+91 97783 77526"
              value={from.phone}
              onChange={(e) =>
                setFrom((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
            />
          </FormGroup>

          {/* EMAIL */}

          <FormGroup>
            <Label>EMAIL ID</Label>

            <Input
              placeholder="info@tungstonlabs.com"
              value={from.email}
              onChange={(e) =>
                setFrom((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
          </FormGroup>

          {/* BILL TO */}

          <FormGroup>
            <Label>BILL TO</Label>

            <SelectWrapper>
              <Select
                value={billTo.clientId ?? billTo.client ?? ""}
                onChange={handleCustomerChange}
              >
                <option value="">Company/Client Name</option>

                {customers.map((customer, index) => {
                  const optionValue = getCustomerOptionValue(customer);

                  return (
                    <option
                      key={
                        optionValue || `${getCustomerLabel(customer)}-${index}`
                      }
                      value={optionValue}
                    >
                      {getCustomerLabel(customer)}
                    </option>
                  );
                })}
              </Select>

              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          {/* CUSTOMER ADDRESS */}

          <FormGroup>
            <Label>ADDRESS</Label>

            <Input
              placeholder="Company/Client ADDRESS"
              value={billTo.address}
              onChange={(e) =>
                setBillTo((prev) => ({
                  ...prev,
                  address: e.target.value,
                }))
              }
            />
          </FormGroup>

          {/* CUSTOMER PHONE */}

          <FormGroup>
            <Label>PHONE NUMBER</Label>

            <Input
              placeholder="Company/Client Phone Number"
              value={billTo.phone}
              onChange={(e) =>
                setBillTo((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
            />
          </FormGroup>

          {/* FINANCE EMAIL */}

          <FormGroup>
            <Label>Finance Contact Email</Label>

            <Input
              placeholder="Company/Client Email ID"
              value={billTo.email}
              onChange={(e) =>
                setBillTo((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
          </FormGroup>
        </FormGrid>

        {/* ITEMS */}

        <OrderItemsHeader>
          <SectionTitle>INVOICE ITEMS</SectionTitle>

          <AddItemButton type="button" onClick={addItem}>
            <FiPlus />
            ADD ITEM
          </AddItemButton>
        </OrderItemsHeader>

        <OrderTableWrapper>
          <OrderTable>
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
                      value={item.product}
                      onChange={(e) =>
                        updateItem(item.id, "product", e.target.value)
                      }
                      placeholder="Product / Product ID"
                    />
                  </td>

                  <td>
                    <input
                      value={item.orderedQty}
                      onChange={(e) =>
                        updateItem(item.id, "orderedQty", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={item.alreadyDelivered}
                      onChange={(e) =>
                        updateItem(item.id, "alreadyDelivered", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={item.deliveringNow}
                      onChange={(e) =>
                        updateItem(item.id, "deliveringNow", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={item.balance}
                      onChange={(e) =>
                        updateItem(item.id, "balance", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      value={item.amount}
                      onChange={(e) =>
                        updateItem(item.id, "amount", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <Select
                      value={item.status}
                      onChange={(e) =>
                        updateItem(item.id, "status", e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>

                      <option value="Partial">Partial</option>

                      <option value="Fully Delivered">Fully Delivered</option>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </OrderTable>
        </OrderTableWrapper>

        {/* SUMMARY */}

        <PaymentSection>
          <PaymentLeft
            style={{
              flex: 1,
            }}
          >
            <div />
          </PaymentLeft>

          <PaymentRight
            style={{
              maxWidth: 390,
              marginLeft: "auto",
            }}
          >
            <SummaryRow>
              <span>Total Quantity</span>

              <strong>160 Unit</strong>
            </SummaryRow>

            <SummaryRow>
              <span>Pending Quantity</span>

              <strong>330 Unit</strong>
            </SummaryRow>

            <SummaryRow>
              <span>Delivery Value</span>

              <strong
                style={{
                  color: "#00a52a",
                }}
              >
                SAR 7,320
              </strong>
            </SummaryRow>

            <TotalAmount
              style={{
                marginTop: 10,
                background: "#ff8500",
                color: "#fff",
                borderRadius: 4,
              }}
            >
              <span>DELIVERY STATUS</span>

              <strong>{String(deliveryStatus).toUpperCase()}</strong>
            </TotalAmount>
          </PaymentRight>
        </PaymentSection>

        {/* NOTES */}

        <div
          style={{
            marginTop: 25,
            width: "52%",
          }}
        >
          <Label>Notes & instructions</Label>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Remaining packaging units to be dispatched with next batch from Jeddah DC — awaiting stock replenishment."
            style={{
              width: "100%",
              minHeight: "42px",
              marginTop: "7px",
              padding: "12px",
              border: "1px solid #e5e5e5",
              borderRadius: "4px",
              resize: "none",
              fontFamily: "inherit",
              fontSize: "12px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* BUTTONS */}

        <ButtonWrapper
          style={{
            marginTop: 18,
          }}
        >
          <CancelButton type="button" onClick={handleCancel}>
            CANCEL
          </CancelButton>

          <PreviewButton
            type="button"
            onClick={handlePreview}
            disabled={submitting}
          >
            {submitting
              ? isEditMode
                ? "UPDATING..."
                : "SAVING..."
              : "PREVIEW"}
          </PreviewButton>
        </ButtonWrapper>
      </OrderForm>
    </OrderContainer>
  );
};

export default Createdeliverynotes;
