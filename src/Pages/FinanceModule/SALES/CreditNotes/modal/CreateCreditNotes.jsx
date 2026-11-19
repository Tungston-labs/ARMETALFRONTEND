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
  NotesTitle,
  CreditNotesTextArea,
  Required,
} from "./CreateCreditNotes.style";

import ReusableHeader from "../../../../../Components/ReusableTable/ReusableHeader";

import {
  fetchCreditNoteById,
  addCreditNote,
  editCreditNote,
  fetchInvoiceCreditNoteDetails,
} from "../../../../../Redux/finance/Sales/creditNoteSlice";

import { getInvoices } from "../../../../../Redux/finance/Sales/InvoiceSlice";
import { getCustomers as getCustomerList } from "../../../../../Redux/finance/Sales/CustomerSlice";
import { getProducts } from "../../../../../Redux/finance/Product/ProductSlice";

const today = new Date().toISOString().split("T")[0];

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

const createDefaultItem = (index = 1) => ({
  id: Date.now() + index,
  invoiceItemId: null,
  slNo: String(index).padStart(2, "0"),
  product: "",
  productId: null,
  invoicedQty: 0,
  alreadyCredited: 0,
  creditingNow: 0,
  availableQty: 0,
  rate: 0,
  unitPrice: 0,
  vatPercentage: 15,
  vatAmount: 0,
  creditTotal: 0,
});

const getDefaultItems = () => [createDefaultItem(1)];

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

const getInvoiceRef = (invoice) =>
  invoice?.invoice_number ||
  invoice?.invoice_reference ||
  invoice?.number ||
  "";

const mapRowToFormData = (row) => {
  if (!row) {
    return {
      creditNoteNumber: "",
      invoiceReference: "",
      issueDate: today,
      reason: "Price Adjustment",
      status: "open",
      invoiceValue: "",
      alreadyCredited: "",
      remainingBalance: "",
      thisCreditNote: "",
      from: {
        name: "Tungston Labs",
        address: "Tungston Labs, Ullampilly Building,...",
        phone: "+91 97783 77526",
        email: "info@tungstonlabs.com",
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
    (typeof row?.customer === "number" ? row.customer : null);

  const customerValue =
    customerObject?.name ??
    customerObject?.customer_name ??
    customerObject?.company_name ??
    billToObject?.client ??
    row?.customer_name ??
    (typeof row?.customer === "string" ? row.customer : "");

  const apiItems = Array.isArray(row?.items) ? row.items : [];

  const items =
    apiItems.length > 0
      ? apiItems.map((item, index) => {
          const productObject =
            item?.product && typeof item.product === "object"
              ? item.product
              : null;

          const qty = toNumber(item?.quantity ?? item?.crediting_now ?? item?.creditingNow ?? 0);
          const rate = toNumber(item?.rate ?? item?.unit_price ?? item?.unitPrice ?? 0);
          const vatPct = toNumber(item?.vat_percentage ?? item?.vatPercentage ?? 15);
          const vatAmount = toNumber(item?.vat_amount ?? (qty * rate * (vatPct / 100)));
          const amount = toNumber(item?.amount ?? item?.credit_total ?? (qty * rate + vatAmount));

          return {
            id: item?.id ?? Date.now() + index,
            invoiceItemId: item?.invoice_item ?? item?.invoice_item_id ?? null,
            slNo: item?.sl_no ?? item?.slNo ?? String(index + 1).padStart(2, "0"),
            product:
              item?.item_name ??
              item?.product_name ??
              productObject?.name ??
              productObject?.product_name ??
              (typeof item?.product === "string" ? item.product : ""),
            productId:
              item?.product_id ??
              productObject?.id ??
              productObject?.pk ??
              (typeof item?.product === "number" ? item.product : null),
            invoicedQty: qty,
            alreadyCredited: 0,
            creditingNow: qty,
            availableQty: qty,
            rate,
            unitPrice: rate,
            vatPercentage: vatPct,
            vatAmount,
            creditTotal: amount,
          };
        })
      : getDefaultItems();

  const reasonMap = {
    sales_return: "Sales Return",
    price_adjustment: "Price Adjustment",
    damaged_goods: "Damaged Goods",
    discount_adjustment: "Discount Adjustment",
    pricing_error: "Pricing Error",
  };
  const displayReason = reasonMap[row?.reason] || row?.reason || "Price Adjustment";

  const invVal =
    row?.invoice_amount ??
    row?.invoice_value ??
    row?.invoice?.total_amount ??
    row?.invoice?.grand_total ??
    row?.invoice_total ??
    "";

  const alreadyCred =
    row?.already_credited ??
    row?.alreadyCredited ??
    row?.applied_amount ??
    "";

  const remBal =
    row?.remaining_balance ??
    row?.remainingBalance ??
    row?.balance ??
    "";

  const statusMap = {
    open: "open",
    pending: "open",
    closed: "closed",
    applied: "closed",
    partially_applied: "partially_applied",
    draft: "draft",
    cancelled: "cancelled",
  };
  const normalizedStatus =
    statusMap[String(row?.status || "").toLowerCase()] || row?.status || "open";

  const customerAddress =
    row?.customer_address ||
    row?.customer?.billing_address ||
    row?.customer?.address ||
    billToObject?.address ||
    "";

  const customerPhone =
    row?.customer_phone ||
    row?.customer?.phno ||
    row?.customer?.phone ||
    billToObject?.phone ||
    "";

  const customerEmail =
    row?.customer_email ||
    row?.finance_contact_email ||
    row?.customer?.financial_email ||
    row?.customer?.admin_email ||
    row?.customer?.email ||
    billToObject?.email ||
    "";

  return {
    creditNoteNumber:
      row?.cn_number ?? row?.credit_note_number ?? row?.creditNoteNumber ?? row?.number ?? "",
    invoiceReference:
      row?.invoice_ref ?? row?.invoice_reference ?? row?.invoiceReference ?? "",
    issueDate: toInputDate(row?.issue_date ?? row?.issueDate) || today,
    reason: displayReason,
    status: normalizedStatus,
    invoiceValue:
      invVal !== "" && invVal !== null && invVal !== undefined && Number(invVal) > 0
        ? `SAR ${toNumber(invVal).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : "",
    alreadyCredited:
      alreadyCred !== "" && alreadyCred !== null && alreadyCred !== undefined
        ? `SAR ${toNumber(alreadyCred).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : "SAR 0.00",
    remainingBalance:
      remBal !== "" && remBal !== null && remBal !== undefined
        ? `SAR ${toNumber(remBal).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : "",
    thisCreditNote:
      row?.credit_amount ?? row?.this_credit_note ?? row?.thisCreditNote ?? "",
    from: {
      name: row?.from_company_name ?? row?.from_name ?? row?.from?.name ?? "Tungston Labs",
      address: row?.from_address ?? row?.from?.address ?? "Tungston Labs, Ullampilly Building,...",
      phone: row?.from_phone_number ?? row?.from_phone ?? row?.from?.phone ?? "+91 97783 77526",
      email: row?.from_email ?? row?.from?.email ?? "info@tungstonlabs.com",
    },
    billTo: {
      client: customerValue,
      clientId: customerId,
      address: customerAddress,
      phone: customerPhone,
      email: customerEmail,
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
  if (Array.isArray(response?.data?.items)) {
    return response.data.items;
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

    const availableQty = item?.max_creditable_qty !== undefined
      ? toNumber(item.max_creditable_qty)
      : Math.max(0, invoicedQty - alreadyCredited);

    const rate = toNumber(
      item?.unit_price ?? item?.rate ?? item?.price ?? product?.selling_price ?? 0
    );
    const vatPercentage = toNumber(item?.vat_percentage ?? 15);
    // When loading an invoice, default creditingNow to availableQty if > 0, otherwise default to invoicedQty (so it's never 0)
    const creditingNow = availableQty > 0 ? availableQty : (invoicedQty > 0 ? invoicedQty : 1);
    const vatAmount = (creditingNow * rate) * (vatPercentage / 100);
    const creditTotal = (creditingNow * rate) + vatAmount;

    return {
      id: item?.id ?? item?.invoice_item_id ?? Date.now() + index,
      invoiceItemId: item?.invoice_item_id ?? item?.id ?? null,
      slNo: item?.sl_no ?? item?.slNo ?? String(index + 1).padStart(2, "0"),
      product:
        item?.product_name ??
        item?.particular ??
        product?.name ??
        product?.product_name ??
        (typeof item?.product === "string" ? item.product : ""),
      productId: item?.product_id ?? product?.id ?? product?.pk ?? null,
      invoicedQty,
      alreadyCredited,
      creditingNow,
      availableQty: availableQty > 0 ? availableQty : (invoicedQty > 0 ? invoicedQty : 99999),
      rate,
      unitPrice: rate,
      vatPercentage,
      vatAmount,
      creditTotal,
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
  status,
  from,
  billTo,
  items,
  notes,
  products,
  invoices,
}) => {
  const customer = normalizeId(
    billTo?.clientId ?? billTo?.customerId ?? billTo?.client,
  );

  const selectedInvoice = invoices?.find(
    (inv) => getInvoiceRef(inv) === invoiceReference || String(inv.id) === invoiceReference,
  );

  const reasonMap = {
    "Sales Return": "sales_return",
    "Price Adjustment": "price_adjustment",
    "Damaged Goods": "damaged_goods",
    "Discount Adjustment": "discount_adjustment",
    "Pricing Error": "pricing_error",
  };
  const snakeReason =
    reasonMap[reason] ||
    String(reason || "sales_return").toLowerCase().replace(/\s+/g, "_");

  const creditedItems = (Array.isArray(items) ? items : [])
    .filter((item) => toNumber(item?.creditingNow) > 0)
    .map((item, index) => {
      const qty = toNumber(item?.creditingNow);
      const rate = toNumber(item?.rate || item?.unitPrice);
      const vatPct = toNumber(item?.vatPercentage || 15);
      const vatAmount = toNumber(item?.vatAmount || (qty * rate * (vatPct / 100)));
      const amount = toNumber(item?.creditTotal || (qty * rate + vatAmount));

      return {
        invoice_item: item?.invoiceItemId || item?.id || null,
        product: getProductId(item, products),
        item_name: item?.product || `Item ${index + 1}`,
        description: item?.description || item?.product || "",
        quantity: qty,
        rate: rate,
        vat_percentage: vatPct,
        vat_amount: Number(vatAmount.toFixed(2)),
        amount: Number(amount.toFixed(2)),
      };
    });

  const subTotal = creditedItems.reduce((acc, it) => acc + (it.quantity * it.rate), 0);
  const totalVat = creditedItems.reduce((acc, it) => acc + it.vat_amount, 0);
  const creditAmount = subTotal + totalVat;

  const payload = {
    customer,
    invoice: selectedInvoice?.id || (invoiceReference && /^\d+$/.test(invoiceReference) ? Number(invoiceReference) : null),
    invoice_ref: String(invoiceReference ?? "").trim(),
    issue_date: issueDate || today,
    reason: snakeReason,
    status: status || "open",
    credit_amount: Number(creditAmount.toFixed(2)),
    sub_total: Number(subTotal.toFixed(2)),
    total_vat: Number(totalVat.toFixed(2)),
    discount: 0,
    from_company_name: from?.name?.trim() || "Tungston Labs",
    from_address: from?.address?.trim() || "",
    from_phone_number: from?.phone?.trim() || "",
    from_email: from?.email?.trim() || "",
    notes: notes?.trim() || "",
    items: creditedItems,
  };

  if (creditNoteNumber && String(creditNoteNumber).trim()) {
    payload.cn_number = String(creditNoteNumber).trim();
  }

  return payload;
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

  const invoicesFromStore = useSelector((state) => state?.invoice?.invoices);

  const invoices = useMemo(
    () => (Array.isArray(invoicesFromStore) ? invoicesFromStore : []),
    [invoicesFromStore],
  );

  const {
    selectedCreditNote,
    detailsLoading,
    submitting,
    submitError,
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

  const [status, setStatus] = useState("open");

  const [from, setFrom] = useState({
    name: "Tungston Labs",
    address: "Tungston Labs, Ullampilly Building,...",
    phone: "+91 97783 77526",
    email: "info@tungstonlabs.com",
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
     FETCH CUSTOMER + PRODUCT + INVOICES
  ======================================================= */

  useEffect(() => {
    dispatch(getCustomerList());

    dispatch(
      getProducts({
        page_size: 200,
      }),
    );

    dispatch(
      getInvoices({
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

    // Fallback: match from customers store if address or phone missing
    const custId = mapped.billTo.clientId;
    if ((!mapped.billTo.address || !mapped.billTo.phone) && custId && customers.length > 0) {
      const matched = customers.find(
        (c) =>
          String(getCustomerOptionValue(c)) === String(custId) ||
          String(c.id) === String(custId),
      );
      if (matched) {
        if (!mapped.billTo.address) {
          mapped.billTo.address =
            matched.billing_address || matched.address || "";
        }
        if (!mapped.billTo.phone) {
          mapped.billTo.phone = matched.phno || matched.phone || "";
        }
        if (!mapped.billTo.email) {
          mapped.billTo.email =
            matched.financial_email ||
            matched.admin_email ||
            matched.email ||
            "";
        }
      }
    }

    setCreditNoteNumber(mapped.creditNoteNumber);
    setInvoiceReference(mapped.invoiceReference);
    setIssueDate(mapped.issueDate);
    setReason(mapped.reason);
    setInvoiceValue(mapped.invoiceValue);
    setAlreadyCredited(mapped.alreadyCredited);
    setRemainingBalance(mapped.remainingBalance);
    setStatus(mapped.status || "open");
    setFrom(mapped.from);
    setBillTo(mapped.billTo);
    setItems(mapped.items);
    setNotes(mapped.notes);

    if (!mapped.invoiceValue && mapped.invoiceReference && invoices.length > 0) {
      const foundInvoice = invoices.find(
        (inv) => getInvoiceRef(inv) === mapped.invoiceReference || String(inv.id) === String(mapped.invoiceReference)
      );
      if (foundInvoice) {
        const total = toNumber(foundInvoice.total_amount ?? foundInvoice.grand_total);
        if (total > 0) {
          setInvoiceValue(`SAR ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
        }
      }
    }
  }, [isEditMode, selectedCreditNote, routeCreditNote, invoices]);

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
        address:
          selected?.billing_address ??
          selected?.address ??
          selected?.company_address ??
          "",
        phone:
          selected?.phno ??
          selected?.phone ??
          selected?.phone_number ??
          selected?.contact_number ??
          "",
        email:
          selected?.financial_email ??
          selected?.admin_email ??
          selected?.email ??
          selected?.finance_email ??
          "",
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

  const handleLoadInvoice = async (ref = invoiceReference) => {
    const invoice = String(ref || "").trim();

    if (!invoice) {
      return;
    }

    setValidationError("");

    try {
      const selectedInv = invoices.find(
        (inv) => getInvoiceRef(inv) === invoice || String(inv.id) === invoice,
      );
      const invoiceId = selectedInv?.id;

      const response = await dispatch(
        fetchInvoiceCreditNoteDetails({
          invoice_reference: invoice,
          invoice_number: invoice,
          invoice_id: invoiceId,
          ...(isEditMode && id ? { exclude_credit_note: id } : {}),
        }),
      ).unwrap();

      const invoiceData = response?.data ?? response?.invoice ?? response;
      const invoiceItems = mapInvoiceItems(response);

      if (!invoiceItems.length) {
        setValidationError("No invoice items were found for this invoice.");
        return;
      }

      setItems(invoiceItems);

      const invVal = toNumber(
        invoiceData?.invoice_value ??
          invoiceData?.total ??
          invoiceData?.total_amount ??
          selectedInv?.total_amount ??
          0,
      );
      const alreadyCred = toNumber(
        invoiceData?.already_credited_amount ??
          invoiceData?.already_credited ??
          0,
      );
      const remBal = toNumber(
        invoiceData?.remaining_balance ?? Math.max(0, invVal - alreadyCred),
      );

      setInvoiceValue(`SAR ${invVal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      setAlreadyCredited(`SAR ${alreadyCred.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      setRemainingBalance(`SAR ${remBal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

      const customerObj = invoiceData?.customer;
      const matchedCust = customers.find(
        (c) =>
          String(getCustomerOptionValue(c)) === String(invoiceData?.customer) ||
          String(c.id) === String(invoiceData?.customer),
      );

      setBillTo({
        client:
          invoiceData?.customer_name ||
          (typeof customerObj === "object" ? customerObj?.customer_name || customerObj?.name : "") ||
          matchedCust?.customer_name ||
          selectedInv?.customer_name ||
          "",
        clientId:
          invoiceData?.customer ??
          invoiceData?.customer_id ??
          (typeof customerObj === "object" ? customerObj?.id : customerObj) ??
          matchedCust?.id ??
          selectedInv?.customer ??
          null,
        address:
          invoiceData?.customer_address ||
          (typeof customerObj === "object" ? customerObj?.address : "") ||
          matchedCust?.address ||
          selectedInv?.customer_address ||
          "",
        phone:
          invoiceData?.customer_phone ||
          (typeof customerObj === "object" ? customerObj?.phone : "") ||
          matchedCust?.phone ||
          selectedInv?.customer_phone ||
          "",
        email:
          invoiceData?.customer_email ||
          invoiceData?.finance_contact_email ||
          (typeof customerObj === "object" ? customerObj?.email : "") ||
          matchedCust?.email ||
          selectedInv?.customer_email ||
          "",
      });

      setFrom((previous) => ({
        ...previous,
        name: invoiceData?.from_company_name || selectedInv?.company_name || previous.name || "Tungston Labs",
        address: invoiceData?.from_address || selectedInv?.company_address || previous.address || "Tungston Labs, Ullampilly Building,...",
        phone: invoiceData?.from_phone_number || selectedInv?.company_phone || previous.phone || "+91 97783 77526",
        email: invoiceData?.from_email || selectedInv?.company_email || previous.email || "info@tungstonlabs.com",
      }));
    } catch (error) {
      console.error("Invoice details loading failed:", error);
    }
  };

  const handleInvoiceChange = (event) => {
    const value = event.target.value;

    setInvoiceReference(value);
    setValidationError("");

    if (!value) {
      setItems(getDefaultItems());
      setInvoiceValue("");
      setAlreadyCredited("");
      setRemainingBalance("");
      setBillTo({
        client: "",
        clientId: null,
        address: "",
        phone: "",
        email: "",
      });
      return;
    }

    handleLoadInvoice(value);
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

        if (field === "creditingNow" || field === "rate" || field === "unitPrice") {
          const quantity = toNumber(
            field === "creditingNow" ? value : updated.creditingNow,
          );
          const unitRate = toNumber(
            field === "rate" || field === "unitPrice" ? value : (updated.rate || updated.unitPrice),
          );
          const vatPct = toNumber(updated.vatPercentage || 15);
          const base = quantity * unitRate;
          const vat = base * (vatPct / 100);

          updated.creditingNow = quantity;
          updated.rate = unitRate;
          updated.unitPrice = unitRate;
          updated.vatAmount = vat;
          updated.creditTotal = base + vat;
        }

        return updated;
      }),
    );
  };

  /* =======================================================
     TOTALS
  ======================================================= */

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + (toNumber(item.creditingNow) * toNumber(item.rate || item.unitPrice)),
        0,
      ),
    [items],
  );

  const tax = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + toNumber(item.vatAmount),
        0,
      ),
    [items],
  );

  const totalCreditAmount = useMemo(() => subtotal + tax, [subtotal, tax]);

  /* =======================================================
     VALIDATION
  ======================================================= */

  const validateForm = () => {
    const customerId =
      billTo?.clientId ?? billTo?.customerId ?? billTo?.client ?? "";

    if (customerId === "" || customerId === null || customerId === undefined) {
      setValidationError("Please select a customer.");
      return false;
    }

    if (!invoiceReference.trim()) {
      setValidationError("Please select an invoice.");
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
      (item) => toNumber(item.creditingNow) <= 0,
    );

    if (invalidQuantity) {
      setValidationError("Crediting quantity must be greater than zero.");
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
      status,
      from,
      billTo,
      items,
      notes,
      products,
      invoices,
    });

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
          breadcrumbs={["Sales", "Credit Notes"]}
          showBack
          onBack={() => navigate("/credit-notes")}
        />

        <div style={{ padding: 20 }}>
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
        breadcrumbs={["Sales", "Credit Notes"]}
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
          {/* ROW 1 */}
          <FormGroup>
            <Label>CREDIT NOTE NUMBER</Label>
            <Input
              placeholder="Auto-generated after save"
              value={creditNoteNumber}
              readOnly
              disabled
            />
          </FormGroup>

          <FormGroup>
            <Label>
              AGAINST INVOICE <Required />
            </Label>
            <SelectWrapper>
              <Select
                value={invoiceReference}
                onChange={handleInvoiceChange}
                disabled={isEditMode}
              >
                <option value="">Select Invoice</option>
                {invoices.map((invoice, index) => {
                  const ref = getInvoiceRef(invoice);
                  const custName =
                    invoice?.customer_name ||
                    invoice?.customer?.customer_name ||
                    invoice?.customer?.name ||
                    "";
                  const label = custName ? `${ref} - ${custName}` : ref;

                  return (
                    <option key={invoice?.id ?? `${ref}-${index}`} value={ref}>
                      {label}
                    </option>
                  );
                })}

                {invoiceReference &&
                  !invoices.some(
                    (invoice) => getInvoiceRef(invoice) === invoiceReference,
                  ) && (
                    <option value={invoiceReference}>{invoiceReference}</option>
                  )}
              </Select>
              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          <FormGroup>
            <Label>
              ISSUE DATE <Required />
            </Label>
            <CalendarInput>
              <Input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
              />
            </CalendarInput>
          </FormGroup>

          <FormGroup>
            <Label>
              REASON <Required />
            </Label>
            <SelectWrapper>
              <Select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="Price Adjustment">Price Adjustment</option>
                <option value="Sales Return">Sales Return</option>
                <option value="Damaged Goods">Damaged Goods</option>
                <option value="Discount Adjustment">Discount Adjustment</option>
                <option value="Pricing Error">Pricing Error</option>
              </Select>
              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          {/* ROW 2: 3 financial cards matching Figma */}
          <FormGroup>
            <Label>INVOICE AMOUNT</Label>
            <Input
              placeholder="SAR 0.00"
              value={invoiceValue}
              readOnly
            />
          </FormGroup>

          <FormGroup>
            <Label>ALREADY CREDITED</Label>
            <Input
              placeholder="SAR 0.00"
              value={alreadyCredited}
              readOnly
            />
          </FormGroup>

          <FormGroup className="remaining-balance">
            <Label>REMAINING CREDITABLE</Label>
            <Input
              placeholder="SAR 0.00"
              value={remainingBalance}
              readOnly
            />
          </FormGroup>

          <FormGroup>
            <Label>STATUS</Label>
            <SelectWrapper>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="open">Issued/Pending</option>
                <option value="closed">Applied</option>
                <option value="partially_applied">Partially Applied</option>
                <option value="draft">Draft</option>
                <option value="cancelled">Cancelled</option>
              </Select>
              <FiChevronDown />
            </SelectWrapper>
          </FormGroup>

          {/* ROW 3: FROM / COMPANY */}
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

          {/* ROW 4: CUSTOMER / BILL TO */}
          <FormGroup>
            <Label>
              CUSTOMER <Required />
            </Label>
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
            <Label>
              ADDRESS <Required />
            </Label>
            <Input
              placeholder="Company/Client aDDRESS"
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
            <Label>
              PHONE NUMBER <Required />
            </Label>
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

        {/* ITEMS BEING CREDITED */}
        <OrderItemsHeader>
          <SectionTitle>ITEMS BEING CREDITED</SectionTitle>
        </OrderItemsHeader>

        <OrderTableWrapper>
          <OrderTable>
            <thead>
              <tr>
                <th style={{ width: "7%", textAlign: "center" }}>SL No</th>
                <th style={{ width: "25%", textAlign: "left" }}>Product</th>
                <th style={{ width: "12%", textAlign: "center" }}>Qty</th>
                <th style={{ width: "14%", textAlign: "right" }}>Rate</th>
                <th style={{ width: "12%", textAlign: "center" }}>VAT (%)</th>
                <th style={{ width: "14%", textAlign: "right" }}>VAT (SAR)</th>
                <th style={{ width: "16%", textAlign: "right" }}>Amount</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={{ textAlign: "center" }}>{item.slNo}</td>

                  <td>
                    <input
                      value={item.product}
                      readOnly
                      style={{
                        border: "none",
                        background: "transparent",
                        width: "100%",
                        outline: "none",
                        color: "#333333",
                        fontSize: "13px",
                      }}
                    />
                  </td>

                  <td style={{ textAlign: "center" }}>
                    <input
                      type="number"
                      min="0"
                      value={item.creditingNow}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const val = raw === "" ? 0 : Number(raw);
                        if (val < 0) return;
                        updateItem(item.id, "creditingNow", val);
                      }}
                      style={{
                        width: "60px",
                        height: "32px",
                        textAlign: "center",
                        border: "1px solid #e2e5ea",
                        borderRadius: "4px",
                        fontSize: "13px",
                      }}
                    />
                  </td>

                  <td style={{ textAlign: "right" }}>
                    <input
                      value={toNumber(item.rate || item.unitPrice).toFixed(2)}
                      readOnly
                      style={{
                        border: "none",
                        background: "transparent",
                        width: "100%",
                        textAlign: "right",
                        outline: "none",
                        color: "#333333",
                        fontSize: "13px",
                      }}
                    />
                  </td>

                  <td style={{ textAlign: "center" }}>
                    <span style={{ fontSize: "13px", color: "#333333" }}>
                      {toNumber(item.vatPercentage || 15)}%
                    </span>
                  </td>

                  <td style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "13px", color: "#333333" }}>
                      {toNumber(item.vatAmount).toFixed(2)}
                    </span>
                  </td>

                  <td style={{ textAlign: "right" }}>
                    <strong
                      style={{
                        fontSize: "13px",
                        color: "#d9383a",
                        fontWeight: "600",
                      }}
                    >
                      SAR{" "}
                      {toNumber(item.creditTotal).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </OrderTable>
        </OrderTableWrapper>

        {/* SUMMARY & NOTES SECTION */}
        <PaymentSection>
          <PaymentLeft>
            <NotesTitle>Notes &amp; reason detail</NotesTitle>
            <CreditNotesTextArea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Price correction agreed with customer after post-delivery review — original invoice priced at incorrect rate for [Product]. Revised price approved by [Sales Manager name] on [date]. Adjustment applies to lines 1 & 2 only."
            />
          </PaymentLeft>

          <PaymentRight>
            <SummaryRow>
              <span>Subtotal</span>
              <strong>
                SAR{" "}
                {subtotal.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
            </SummaryRow>

            <SummaryRow>
              <span>Tax (15% VAT)</span>
              <strong>
                SAR{" "}
                {tax.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
            </SummaryRow>

            <TotalAmount>
              <span>Total Credit Amount</span>
              <strong>
                SAR{" "}
                {totalCreditAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>
            </TotalAmount>
          </PaymentRight>
        </PaymentSection>

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
                : "SAVING..."
              : isEditMode
                ? "UPDATE CREDIT NOTE"
                : "SENT FOR APPROVAL"}
          </PreviewButton>
        </ButtonWrapper>
      </OrderForm>
    </OrderContainer>
  );
};

export default CreateCreditNotes;