import React, { useEffect, useMemo, useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";

import { FiChevronDown } from "react-icons/fi";

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
} from "./CreateCreditNotes.style";

import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";

import {
  fetchCreditNoteById,
  addCreditNote,
  editCreditNote,
  fetchInvoiceCreditNoteDetails,
} from "../../../../../Redux/finance/Sales/creditNoteSlice";

import { getCustomers as getCustomerList } from "../../../../../Redux/finance/Sales/CustomerSlice";

import { getProducts } from "../../../../../Redux/finance/Product/ProductSlice";

/* =========================================================
   CONSTANTS
========================================================= */

const today = new Date().toISOString().split("T")[0];

/* =========================================================
   DATE
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
   NUMBER
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
   ID
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
   DEFAULT ITEM
========================================================= */

const createDefaultItem = (index = 1) => ({
  id: Date.now() + index,

  slNo: String(index).padStart(2, "0"),

  product: "",

  productId: null,

  invoicedQty: 0,

  alreadyCredited: 0,

  creditingNow: 0,

  availableQty: 0,

  unitPrice: 0,

  creditTotal: 0,
});

const getDefaultItems = () => [createDefaultItem(1)];

/* =========================================================
   PRODUCT ID
========================================================= */

const getProductId = (item, products = []) => {
  const rawProduct =
    item?.productId ??
    item?.product_id ??
    item?.product?.id ??
    item?.product?.pk;

  if (rawProduct !== undefined && rawProduct !== null && rawProduct !== "") {
    return normalizeId(rawProduct);
  }

  const productText =
    typeof item?.product === "string" ? item.product.trim() : "";

  if (productText) {
    if (/^\d+$/.test(productText)) {
      return Number(productText);
    }

    const matched = products.find((product) => {
      const productId = product?.id ?? product?.pk ?? product?.product_id;

      const productName =
        product?.name ??
        product?.product_name ??
        product?.code ??
        product?.product_code ??
        "";

      return (
        String(productId ?? "") === String(productText) ||
        String(productName).toLowerCase() === productText.toLowerCase() ||
        String(product?.sku ?? "").toLowerCase() === productText.toLowerCase()
      );
    });

    if (matched) {
      return normalizeId(matched?.id ?? matched?.pk ?? matched?.product_id);
    }
  }

  if (typeof item?.product === "number") {
    return item.product;
  }

  return null;
};

/* =========================================================
   ERROR
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
      .map((item) => (typeof item === "string" ? item : JSON.stringify(item)))
      .join(" | ");
  }

  if (typeof error === "object") {
    return Object.entries(error)
      .map(([field, messages]) => {
        if (Array.isArray(messages)) {
          return `${field}: ${messages.join(", ")}`;
        }

        return `${field}: ${messages}`;
      })
      .join(" | ");
  }

  return String(error);
};

/* =========================================================
   API FORM MAPPING
========================================================= */

const mapRowToFormData = (row) => {
  if (!row) {
    return {
      creditNoteNumber: "",
      invoiceReference: "",
      issueDate: today,
      reason: "Price Adjustment",

      invoiceValue: "",
      alreadyCredited: "",
      remainingBalance: "",
      thisCreditNote: "",

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

      items: getDefaultItems(),

      notes: "",
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
    null;

  const customerValue =
    customerObject?.name ??
    customerObject?.customer_name ??
    customerObject?.company_name ??
    billToObject?.client ??
    row?.customer ??
    "";

  const apiItems = Array.isArray(row?.items) ? row.items : [];

  const items =
    apiItems.length > 0
      ? apiItems.map((item, index) => {
          const productObject =
            item?.product && typeof item.product === "object"
              ? item.product
              : null;

          const invoicedQty = toNumber(
            item?.invoiced_qty ??
              item?.invoiced_quantity ??
              item?.quantity ??
              0,
          );

          const alreadyCredited = toNumber(
            item?.already_credited ?? item?.already_credited_qty ?? 0,
          );

          return {
            id: item?.id ?? Date.now() + index,

            slNo:
              item?.sl_no ?? item?.slNo ?? String(index + 1).padStart(2, "0"),

            product:
              item?.product_name ??
              productObject?.name ??
              productObject?.product_name ??
              (typeof item?.product === "string" ? item.product : ""),

            productId:
              item?.product_id ??
              productObject?.id ??
              productObject?.pk ??
              null,

            invoicedQty,

            alreadyCredited,

            creditingNow: item?.crediting_now ?? item?.crediting_quantity ?? 0,

            availableQty: Math.max(0, invoicedQty - alreadyCredited),

            unitPrice: item?.unit_price ?? item?.price ?? 0,

            creditTotal: item?.credit_total ?? item?.credit_amount ?? 0,
          };
        })
      : getDefaultItems();

  return {
    creditNoteNumber:
      row?.credit_note_number ?? row?.creditNoteNumber ?? row?.number ?? "",

    invoiceReference:
      row?.invoice_reference ?? row?.invoiceReference ?? row?.invoice_ref ?? "",

    issueDate: toInputDate(row?.issue_date ?? row?.issueDate) || today,

    reason: row?.reason || "Price Adjustment",

    invoiceValue: row?.invoice_value ?? row?.invoiceValue ?? "",

    alreadyCredited: row?.already_credited ?? row?.alreadyCredited ?? "",

    remainingBalance: row?.remaining_balance ?? row?.remainingBalance ?? "",

    thisCreditNote:
      row?.this_credit_note ?? row?.thisCreditNote ?? row?.credit_amount ?? "",

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

    items,

    notes: row?.notes ?? row?.notes_reason_detail ?? "",
  };
};

/* =========================================================
   INVOICE ITEMS
========================================================= */

const getInvoiceItems = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  if (Array.isArray(response?.results)) {
    return response.results;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.invoice?.items)) {
    return response.invoice.items;
  }

  return [];
};

const mapInvoiceItems = (response) => {
  const apiItems = getInvoiceItems(response);

  return apiItems.map((item, index) => {
    const product =
      item?.product && typeof item.product === "object" ? item.product : null;

    const invoicedQty = toNumber(
      item?.invoiced_qty ??
        item?.invoiced_quantity ??
        item?.quantity ??
        item?.qty ??
        0,
    );

    const alreadyCredited = toNumber(
      item?.already_credited ??
        item?.already_credited_qty ??
        item?.credited_qty ??
        0,
    );

    return {
      id: item?.id ?? Date.now() + index,

      slNo: item?.sl_no ?? item?.slNo ?? String(index + 1).padStart(2, "0"),

      product:
        item?.product_name ??
        product?.name ??
        product?.product_name ??
        (typeof item?.product === "string" ? item.product : ""),

      productId: item?.product_id ?? product?.id ?? product?.pk ?? null,

      invoicedQty,

      alreadyCredited,

      creditingNow: 0,

      availableQty: Math.max(0, invoicedQty - alreadyCredited),

      unitPrice: item?.unit_price ?? item?.price ?? product?.unit_price ?? 0,

      creditTotal: 0,
    };
  });
};

/* =========================================================
   PAYLOAD
========================================================= */

const buildPayload = ({
  creditNoteNumber,
  invoiceReference,
  issueDate,
  reason,
  invoiceValue,
  alreadyCredited,
  remainingBalance,
  thisCreditNote,
  from,
  billTo,
  items,
  notes,
  products,
}) => {
  const customer = normalizeId(
    billTo?.clientId ?? billTo?.customerId ?? billTo?.client,
  );

  return {
    credit_note_number: String(creditNoteNumber ?? "").trim(),

    invoice_reference: String(invoiceReference ?? "").trim(),

    issue_date: issueDate || today,

    reason: String(reason ?? "").trim(),

    invoice_value: toNumber(invoiceValue),

    already_credited: toNumber(alreadyCredited),

    remaining_balance: toNumber(remainingBalance),

    this_credit_note: toNumber(thisCreditNote),

    customer,

    from_name: from?.name?.trim() || "",

    from_address: from?.address?.trim() || "",

    from_phone: from?.phone?.trim() || "",

    from_email: from?.email?.trim() || "",

    customer_address: billTo?.address?.trim() || "",

    customer_phone: billTo?.phone?.trim() || "",

    finance_contact_email: billTo?.email?.trim() || "",

    notes_reason_detail: notes?.trim() || "",

    items: (Array.isArray(items) ? items : [])
      .filter((item) => toNumber(item?.creditingNow) > 0)
      .map((item, index) => ({
        sl_no: item?.slNo || String(index + 1).padStart(2, "0"),

        product: getProductId(item, products),

        invoiced_qty: toNumber(item?.invoicedQty),

        already_credited: toNumber(item?.alreadyCredited),

        crediting_now: toNumber(item?.creditingNow),

        unit_price: toNumber(item?.unitPrice),

        credit_total: toNumber(item?.creditTotal),
      })),
  };
};

/* =========================================================
   COMPONENT
========================================================= */

const CreateCreditNotes = ({ onCancel }) => {
  const { id } = useParams();

  const navigate = useNavigate();

  const location = useLocation();

  const dispatch = useDispatch();

  const isEditMode = Boolean(id);

  /* =======================================================
     CUSTOMER
  ======================================================= */

  const customersFromStore = useSelector((state) => {
    const customers = state?.customer?.customers;

    if (Array.isArray(customers)) {
      return customers;
    }

    if (Array.isArray(customers?.results)) {
      return customers.results;
    }

    if (Array.isArray(customers?.data)) {
      return customers.data;
    }

    return [];
  });

  const customers = useMemo(
    () => (Array.isArray(customersFromStore) ? customersFromStore : []),
    [customersFromStore],
  );

  const products = useSelector((state) => state?.product?.products || []);

  const {
    selectedCreditNote,
    detailsLoading,
    submitting,
    submitError,

    invoiceDetailsLoading,
    invoiceDetailsError,
  } = useSelector((state) => state.creditNotes);

  /* =======================================================
     ROUTE DATA
  ======================================================= */

  const routeCreditNote = location.state?.creditNoteData || null;

  /* =======================================================
     FORM
  ======================================================= */

  const [creditNoteNumber, setCreditNoteNumber] = useState("");

  const [invoiceReference, setInvoiceReference] = useState("");

  const [issueDate, setIssueDate] = useState(today);

  const [reason, setReason] = useState("Price Adjustment");

  const [invoiceValue, setInvoiceValue] = useState("");

  const [alreadyCredited, setAlreadyCredited] = useState("");

  const [remainingBalance, setRemainingBalance] = useState("");

  const [thisCreditNote, setThisCreditNote] = useState("");

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
     CUSTOMER HELPERS
  ======================================================= */

  const getCustomerOptionValue = (customer) => {
    const value =
      customer?.id ??
      customer?.pk ??
      customer?.customer_id ??
      customer?.customer_code ??
      customer?.code ??
      "";

    return String(value);
  };

  const getCustomerLabel = (customer) =>
    customer?.customer_name ||
    customer?.name ||
    customer?.company_name ||
    customer?.customerName ||
    customer?.companyName ||
    customer?.customer_code ||
    customer?.code ||
    "";

  /* =======================================================
     FETCH CUSTOMER + PRODUCT
  ======================================================= */

  useEffect(() => {
    dispatch(getCustomerList());

    dispatch(
      getProducts({
        page_size: 200,
      }),
    );
  }, [dispatch]);

  /* =======================================================
     FETCH EDIT
  ======================================================= */

  useEffect(() => {
    if (isEditMode && id) {
      dispatch(fetchCreditNoteById(id));
    }
  }, [dispatch, id, isEditMode]);

  /* =======================================================
     POPULATE EDIT
  ======================================================= */

  useEffect(() => {
    const source = selectedCreditNote || routeCreditNote;

    if (!isEditMode || !source) {
      return;
    }

    const mapped = mapRowToFormData(source);

    setCreditNoteNumber(mapped.creditNoteNumber);

    setInvoiceReference(mapped.invoiceReference);

    setIssueDate(mapped.issueDate);

    setReason(mapped.reason);

    setInvoiceValue(mapped.invoiceValue);

    setAlreadyCredited(mapped.alreadyCredited);

    setRemainingBalance(mapped.remainingBalance);

    setThisCreditNote(mapped.thisCreditNote);

    setFrom(mapped.from);

    setBillTo(mapped.billTo);

    setItems(mapped.items);

    setNotes(mapped.notes);
  }, [isEditMode, selectedCreditNote, routeCreditNote]);

  /* =======================================================
     CUSTOMER CHANGE
  ======================================================= */

  const handleCustomerChange = (event) => {
    const value = event.target.value;

    const selected = customers.find(
      (customer) => String(getCustomerOptionValue(customer)) === String(value),
    );

    if (selected) {
      setBillTo({
        client: getCustomerLabel(selected),

        clientId: getCustomerOptionValue(selected),

        address: selected?.address ?? selected?.company_address ?? "",

        phone:
          selected?.phone ??
          selected?.phone_number ??
          selected?.contact_number ??
          "",

        email: selected?.email ?? selected?.finance_email ?? "",
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
     LOAD ORIGINAL INVOICE
  ======================================================= */

  const handleLoadInvoice = async () => {
    const invoice = invoiceReference.trim();

    if (!invoice) {
      return;
    }

    setValidationError("");

    try {
      const response = await dispatch(
        fetchInvoiceCreditNoteDetails({
          invoice_reference: invoice,
        }),
      ).unwrap();

      const invoiceData = response?.invoice ?? response?.data ?? response;

      const invoiceItems = mapInvoiceItems(response);

      if (!invoiceItems.length) {
        setValidationError("No invoice items were found for this invoice.");

        return;
      }

      setItems(invoiceItems);

      setInvoiceValue(
        invoiceData?.invoice_value ??
          invoiceData?.total ??
          invoiceData?.total_amount ??
          "",
      );

      setAlreadyCredited(invoiceData?.already_credited ?? "");

      setRemainingBalance(invoiceData?.remaining_balance ?? "");

      const customer = invoiceData?.customer;

      setBillTo((previous) => ({
        ...previous,

        client: customer?.name ?? invoiceData?.customer_name ?? previous.client,

        clientId: invoiceData?.customer_id ?? customer?.id ?? previous.clientId,

        address:
          invoiceData?.customer_address ??
          customer?.address ??
          previous.address,

        phone: invoiceData?.customer_phone ?? customer?.phone ?? previous.phone,

        email: invoiceData?.customer_email ?? customer?.email ?? previous.email,
      }));
    } catch (error) {
      console.error("Invoice details loading failed:", error);
    }
  };

  /* =======================================================
     ITEM UPDATE
  ======================================================= */

  const updateItem = (itemId, field, value) => {
    setItems((previous) =>
      previous.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        const updated = {
          ...item,
          [field]: value,
        };

        if (field === "creditingNow" || field === "unitPrice") {
          const quantity = toNumber(
            field === "creditingNow" ? value : updated.creditingNow,
          );

          const price = toNumber(
            field === "unitPrice" ? value : updated.unitPrice,
          );

          updated.creditTotal = quantity * price;
        }

        return updated;
      }),
    );
  };

  /* =======================================================
     TOTALS
  ======================================================= */

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + toNumber(item.creditTotal), 0),
    [items],
  );

  const tax = useMemo(() => subtotal * 0.15, [subtotal]);

  const totalCreditAmount = subtotal + tax;

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

    if (!invoiceReference.trim()) {
      setValidationError("Please select an original invoice.");

      return false;
    }

    if (!issueDate) {
      setValidationError("Please select an issue date.");

      return false;
    }

    const creditedItems = items.filter(
      (item) => toNumber(item.creditingNow) > 0,
    );

    if (!creditedItems.length) {
      setValidationError(
        "Please enter a credit quantity for at least one item.",
      );

      return false;
    }

    const invalidQuantity = creditedItems.some(
      (item) => toNumber(item.creditingNow) > toNumber(item.availableQty),
    );

    if (invalidQuantity) {
      setValidationError(
        "Crediting quantity cannot exceed available quantity.",
      );

      return false;
    }

    const invalidProduct = creditedItems.some(
      (item) => !getProductId(item, products),
    );

    if (invalidProduct) {
      setValidationError(
        "Please enter a valid product for every credited item.",
      );

      return false;
    }

    setValidationError("");

    return true;
  };

  /* =======================================================
     CREATE / UPDATE
  ======================================================= */

  const handleCreate = async () => {
    if (submitting) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    const payload = buildPayload({
      creditNoteNumber,
      invoiceReference,
      issueDate,
      reason,
      invoiceValue,
      alreadyCredited,
      remainingBalance,

      thisCreditNote: thisCreditNote || totalCreditAmount,

      from,
      billTo,
      items,
      notes,
      products,
    });

    console.log("FINAL CREDIT NOTE PAYLOAD:", JSON.stringify(payload, null, 2));

    try {
      if (isEditMode) {
        await dispatch(
          editCreditNote({
            id,
            payload,
          }),
        ).unwrap();
      } else {
        await dispatch(addCreditNote(payload)).unwrap();
      }

      navigate("/credit-notes");
    } catch (error) {
      console.error("Credit Note save failed:", error);
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

    navigate("/credit-notes");
  };

  /* =======================================================
     ERROR
  ======================================================= */

  const displayedError =
    validationError ||
    formatBackendError(submitError) ||
    formatBackendError(invoiceDetailsError);

  /* =======================================================
     EDIT LOADING
  ======================================================= */

  if (isEditMode && detailsLoading && !selectedCreditNote) {
    return (
      <OrderContainer>
        <ReusableHeader
          title="Edit Credit Note"
          breadcrumbs={["Dashboard", "Sales", "Credit Notes"]}
          showBack
          onBack={() => navigate("/credit-notes")}
        />

        <div
          style={{
            padding: 20,
          }}
        >
          Loading credit note...
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
        title={isEditMode ? "Edit Credit Note" : "Create Credit Note"}
        breadcrumbs={["Dashboard", "Sales", "Credit Notes"]}
        showBack
        onBack={() => navigate("/credit-notes")}
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
          <FormGroup>
            <Label>CREDIT NOTE NUMBER</Label>

            <Input
              placeholder="SR 0123"
              value={creditNoteNumber}
              onChange={(e) => setCreditNoteNumber(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>INVOICE REFERENCE</Label>

            <Input
              placeholder="INV 0123 - Chicking"
              value={invoiceReference}
              onChange={(e) => {
                setInvoiceReference(e.target.value);

                setValidationError("");
              }}
              onBlur={handleLoadInvoice}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();

                  handleLoadInvoice();
                }
              }}
            />
          </FormGroup>

          <FormGroup>
            <Label>ISSUE DATE</Label>

            <CalendarInput>
              <Input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </CalendarInput>
          </FormGroup>

          <FormGroup>
            <Label>REASON</Label>

            <SelectWrapper>
              <Select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="Sales Return">Sales Return</option>

                <option value="Price Adjustment">Price Adjustment</option>

                <option value="Damaged Goods">Damaged Goods</option>

                <option value="Discount Adjustment">Discount Adjustment</option>

                <option value="Pricing Error">Pricing Error</option>
              </Select>

              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          <FormGroup>
            <Label>INVOICE VALUE</Label>

            <Input
              placeholder="15,000 SAR"
              value={invoiceValue}
              onChange={(e) => setInvoiceValue(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>ALREADY CREDITED</Label>

            <Input
              placeholder="10,000 SAR"
              value={alreadyCredited}
              onChange={(e) => setAlreadyCredited(e.target.value)}
            />
          </FormGroup>

          <FormGroup className="remaining-balance">
            <Label>REMAINING BALANCE</Label>

            <Input
              placeholder="SAR 5,000"
              value={remainingBalance}
              onChange={(e) => setRemainingBalance(e.target.value)}
            />
          </FormGroup>

          <FormGroup className="this-credit-note">
            <Label>THIS CREDIT NOTE</Label>

            <Input
              placeholder="SAR 4,200"
              value={thisCreditNote}
              onChange={(e) => setThisCreditNote(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>FROM</Label>

            <Input
              placeholder="TUNGSTON LABS"
              value={from.name}
              onChange={(e) =>
                setFrom((previous) => ({
                  ...previous,
                  name: e.target.value,
                }))
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>ADDRESS</Label>

            <Input
              placeholder="Tungston Labs, Ullampilly Building,..."
              value={from.address}
              onChange={(e) =>
                setFrom((previous) => ({
                  ...previous,
                  address: e.target.value,
                }))
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>PHONE NUMBER</Label>

            <Input
              placeholder="+91 97783 77526"
              value={from.phone}
              onChange={(e) =>
                setFrom((previous) => ({
                  ...previous,
                  phone: e.target.value,
                }))
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>EMAIL ID</Label>

            <Input
              placeholder="info@tungstonlabs.com"
              value={from.email}
              onChange={(e) =>
                setFrom((previous) => ({
                  ...previous,
                  email: e.target.value,
                }))
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>BILL TO</Label>

            <SelectWrapper>
              <Select
                value={billTo.clientId ?? billTo.client ?? ""}
                onChange={handleCustomerChange}
              >
                <option value="">Company/Client Name</option>

                {customers.map((customer, index) => {
                  const value = getCustomerOptionValue(customer);

                  return (
                    <option
                      key={value || `${getCustomerLabel(customer)}-${index}`}
                      value={value}
                    >
                      {getCustomerLabel(customer)}
                    </option>
                  );
                })}
              </Select>

              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          <FormGroup>
            <Label>ADDRESS</Label>

            <Input
              placeholder="Company/Client ADDRESS"
              value={billTo.address}
              onChange={(e) =>
                setBillTo((previous) => ({
                  ...previous,
                  address: e.target.value,
                }))
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>PHONE NUMBER</Label>

            <Input
              placeholder="Company/Client Phone Number"
              value={billTo.phone}
              onChange={(e) =>
                setBillTo((previous) => ({
                  ...previous,
                  phone: e.target.value,
                }))
              }
            />
          </FormGroup>

          <FormGroup>
            <Label>FINANCE CONTACT EMAIL</Label>

            <Input
              placeholder="Company/Client Email ID"
              value={billTo.email}
              onChange={(e) =>
                setBillTo((previous) => ({
                  ...previous,
                  email: e.target.value,
                }))
              }
            />
          </FormGroup>
        </FormGrid>

        <OrderItemsHeader>
          <SectionTitle>RETURNED ITEMS</SectionTitle>
        </OrderItemsHeader>

        <OrderTableWrapper>
          <OrderTable>
            <thead>
              <tr>
                <th>SL NO</th>

                <th>Product</th>

                <th>Invoiced Qty</th>

                <th>Already Credited</th>

                <th>Crediting Now</th>

                <th>Unit Price</th>

                <th>Credit Total</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.slNo}</td>

                  <td>
                    <input value={item.product} readOnly />
                  </td>

                  <td>
                    <input value={item.invoicedQty} readOnly />
                  </td>

                  <td>
                    <input value={item.alreadyCredited} readOnly />
                  </td>

                  <td>
                    <input
                      type="number"
                      min="0"
                      max={item.availableQty}
                      value={item.creditingNow}
                      onChange={(e) => {
                        const value = Number(e.target.value);

                        if (value > Number(item.availableQty)) {
                          return;
                        }

                        updateItem(item.id, "creditingNow", value);
                      }}
                    />
                  </td>

                  <td>
                    <input
                      value={`SAR ${toNumber(item.unitPrice).toFixed(2)}`}
                      readOnly
                    />
                  </td>

                  <td>
                    <input
                      value={`SAR ${toNumber(item.creditTotal).toLocaleString(
                        "en-US",
                        {
                          maximumFractionDigits: 2,
                        },
                      )}`}
                      readOnly
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </OrderTable>
        </OrderTableWrapper>

        <PaymentSection>
          <PaymentLeft>
            <div />
          </PaymentLeft>

          <PaymentRight>
            <SummaryRow>
              <span>Subtotal</span>

              <strong>
                SAR{" "}
                {subtotal.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}
              </strong>
            </SummaryRow>

            <SummaryRow>
              <span>Tax (15% VAT)</span>

              <strong>
                SAR{" "}
                {tax.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}
              </strong>
            </SummaryRow>

            <TotalAmount>
              <span>Total Credit Amount</span>

              <strong>
                SAR{" "}
                {totalCreditAmount.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}
              </strong>
            </TotalAmount>
          </PaymentRight>
        </PaymentSection>

        <div className="credit-note-notes">
          <Label>Notes & reason detail</Label>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Price correction agreed with customer after post-delivery review — original invoice priced at incorrect rate for [Product]. Revised price approved by [Sales Manager name] on [date]. Adjustment applies to lines 1 & 2 only."
          />
        </div>

        <ButtonWrapper>
          <CancelButton type="button" onClick={handleCancel}>
            CANCEL
          </CancelButton>

          <PreviewButton
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
          </PreviewButton>
        </ButtonWrapper>
      </OrderForm>
    </OrderContainer>
  );
};

export default CreateCreditNotes;
