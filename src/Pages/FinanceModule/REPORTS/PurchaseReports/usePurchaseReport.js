import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPurchaseReport } from "../../../../Redux/finance/reports/PurchaseReportSlice";

const EMPTY_SUMMARY = {
  totalPurchases: 0,
  totalPO: 0,
  paymentsMade: 0,
  purchaseReturns: 0,
  outstandingPayables: 0,
};

const normalizeText = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const normalizeOrder = (item, index) => {
  const rawItems = item.items ?? item.order_items ?? [];

  const amount = Number(
    item.value ?? item.total_amount ?? item.purchase_value ?? item.total ?? 0,
  );

  const outstanding = Number(
    item.outstanding ?? item.outstanding_amount ?? item.balance_due ?? 0,
  );

  const vendorValue =
    item.vendor_name ??
    item.supplier_name ??
    item.vendor?.name ??
    item.supplier?.name ??
    item.vendor ??
    "";

  return {
    id:
      item.id ??
      item.po_id ??
      item.purchase_order_id ??
      `purchase-order-${index}`,

    invoice_number:
      item.po ??
      item.po_number ??
      item.po_no ??
      item.purchase_order_number ??
      `PO-${item.id ?? index + 1}`,

    date: item.date ?? item.po_date ?? item.order_date ?? "",

    vendor:
      typeof vendorValue === "object"
        ? (vendorValue?.name ?? "")
        : String(vendorValue),

    category:
      item.category_name ?? item.product_category ?? item.category ?? "",

    items: Array.isArray(rawItems) ? rawItems.length : Number(rawItems) || 0,

    amount,
    outstanding,

    purchase_status:
      item.purchase_status ??
      item.status ??
      item.order_status ??
      item.delivery_status ??
      item.bill_status ??
      item.bill ??
      "Pending",

    bill_status: item.bill_status ?? item.bill ?? "Pending",

    payment_status: item.payment_status ?? item.payment ?? "Unpaid",
  };
};

const normalizeSummary = (summary = {}) => ({
  totalPurchases: Number(
    summary.totalPurchases ?? summary.total_purchases ?? 0,
  ),

  totalPO: Number(
    summary.totalPO ?? summary.total_po ?? summary.total_purchase_orders ?? 0,
  ),

  paymentsMade: Number(summary.paymentsMade ?? summary.payments_made ?? 0),

  purchaseReturns: Number(
    summary.purchaseReturns ?? summary.purchase_returns ?? 0,
  ),

  outstandingPayables: Number(
    summary.outstandingPayables ?? summary.outstanding_payables ?? 0,
  ),
});

const getErrorMessage = (error) =>
  error?.response?.data?.detail ??
  error?.response?.data?.message ??
  error?.detail ??
  error?.message ??
  "Unable to load purchase report.";

const usePurchaseReport = () => {
  const dispatch = useDispatch();

  const reportState = useSelector(
    (state) => state.purchaseReport ?? state.purchaseReports ?? {},
  );

  const {
    summary: rawSummary = EMPTY_SUMMARY,
    purchaseOrders: rawOrders = [],
    monthlyTrend: rawTrend = [],
    loading = false,
    error: rawError = null,
    exporting = false,
    exportError: rawExportError = null,
  } = reportState;

  const [search, setSearch] = useState("");
  const [purchaseStatus, setPurchaseStatus] = useState("all");
  const [billStatus, setBillStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [vendor, setVendor] = useState("all");
  const [category, setCategory] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 10;

  useEffect(() => {
    dispatch(fetchPurchaseReport());
  }, [dispatch]);

  const summary = useMemo(() => normalizeSummary(rawSummary), [rawSummary]);

  const purchaseOrders = useMemo(
    () =>
      (Array.isArray(rawOrders) ? rawOrders : []).map((item, index) =>
        normalizeOrder(item, index),
      ),
    [rawOrders],
  );

  const chart = useMemo(
    () => ({
      months: (Array.isArray(rawTrend) ? rawTrend : []).map((item) => ({
        ...item,
        month: Number(item.month),
        value: Number(item.value ?? item.amount ?? item.total ?? 0),
      })),
    }),
    [rawTrend],
  );

  const vendorOptions = useMemo(
    () =>
      [
        ...new Set(purchaseOrders.map((item) => item.vendor).filter(Boolean)),
      ].map((name) => ({
        label: name,
        value: name,
      })),
    [purchaseOrders],
  );

  const categoryOptions = useMemo(
    () =>
      [
        ...new Set(purchaseOrders.map((item) => item.category).filter(Boolean)),
      ].map((name) => ({
        label: name,
        value: name,
      })),
    [purchaseOrders],
  );

  const handleSearch = useCallback((value) => {
    setSearch(value ?? "");
    setCurrentPage(1);
  }, []);

  const handlePurchaseStatus = useCallback((value) => {
    setPurchaseStatus(value || "all");
    setCurrentPage(1);
  }, []);

  const handleBillStatus = useCallback((value) => {
    setBillStatus(value || "all");
    setCurrentPage(1);
  }, []);

  const handlePaymentStatus = useCallback((value) => {
    setPaymentStatus(value || "all");
    setCurrentPage(1);
  }, []);

  const handleVendorChange = useCallback((value) => {
    setVendor(value || "all");
    setCurrentPage(1);
  }, []);

  const handleCategoryChange = useCallback((value) => {
    setCategory(value || "all");
    setCurrentPage(1);
  }, []);

  const handleDateFromChange = useCallback((value) => {
    const dateValue =
      typeof value === "string" ? value : (value?.target?.value ?? "");

    setDateFrom(dateValue);
    setCurrentPage(1);
  }, []);

  const handleDateToChange = useCallback((value) => {
    const dateValue =
      typeof value === "string" ? value : (value?.target?.value ?? "");

    setDateTo(dateValue);
    setCurrentPage(1);
  }, []);

  const filteredOrders = useMemo(() => {
    const term = normalizeText(search);

    return purchaseOrders.filter((item) => {
      const itemDate = String(item.date ?? "").slice(0, 10);

      const matchesSearch =
        !term ||
        normalizeText(item.invoice_number).includes(term) ||
        normalizeText(item.vendor).includes(term);

      const matchesDate =
        (!dateFrom || (itemDate && itemDate >= dateFrom)) &&
        (!dateTo || (itemDate && itemDate <= dateTo));

      const matchesVendor = vendor === "all" || item.vendor === vendor;

      const matchesCategory = category === "all" || item.category === category;

      const matchesPurchaseStatus =
        purchaseStatus === "all" ||
        normalizeText(item.purchase_status) === normalizeText(purchaseStatus);

      const matchesBillStatus =
        billStatus === "all" ||
        normalizeText(item.bill_status) === normalizeText(billStatus);

      const matchesPaymentStatus =
        paymentStatus === "all" ||
        normalizeText(item.payment_status) === normalizeText(paymentStatus);

      return (
        matchesSearch &&
        matchesDate &&
        matchesVendor &&
        matchesCategory &&
        matchesPurchaseStatus &&
        matchesBillStatus &&
        matchesPaymentStatus
      );
    });
  }, [
    purchaseOrders,
    search,
    dateFrom,
    dateTo,
    vendor,
    category,
    purchaseStatus,
    billStatus,
    paymentStatus,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / rowsPerPage),
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(Math.max(page, 1), totalPages));
  }, [totalPages]);

  const rows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;

    return filteredOrders.slice(start, start + rowsPerPage).map((item) => ({
      id: item.id,
      po: item.invoice_number,
      date: item.date,
      vendor: item.vendor,
      items: item.items,
      value: item.amount,
      outstanding: item.outstanding,
      bill: item.bill_status,
      payment: item.payment_status,
    }));
  }, [filteredOrders, currentPage]);

  const handleExport = useCallback(() => {
    const headers = [
      "PO No",
      "Date",
      "Vendor",
      "Items",
      "Purchase Value",
      "Outstanding Value",
      "Bill Status",
      "Payment Status",
    ];

    const csvRows = filteredOrders.map((item) => [
      item.invoice_number,
      item.date,
      item.vendor,
      item.items,
      item.amount,
      item.outstanding,
      item.bill_status,
      item.payment_status,
    ]);

    const escapeCsvValue = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...csvRows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "purchase-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }, [filteredOrders]);

  return {
    search,
    purchaseStatus,
    billStatus,
    paymentStatus,
    vendor,
    category,

    vendorOptions,
    categoryOptions,

    summary,
    purchaseOrders,
    filteredOrders,
    rows,
    chart,

    currentPage,
    totalPages,
    setCurrentPage,

    loading,
    error: rawError ? getErrorMessage(rawError) : null,

    exporting,
    exportError: rawExportError ? getErrorMessage(rawExportError) : null,

    dateFrom,
    dateTo,

    handleSearch,
    handlePurchaseStatus,
    handleBillStatus,
    handlePaymentStatus,
    handleVendorChange,
    handleCategoryChange,
    handleDateFromChange,
    handleDateToChange,
    handleExport,
  };
};

export default usePurchaseReport;
