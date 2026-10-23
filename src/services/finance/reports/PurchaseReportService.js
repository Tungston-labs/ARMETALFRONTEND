import API from "../../api";

// Final URL: /api/finance/reports/purchase/
const PURCHASE_REPORT_URL = "/finance/reports/purchase/";

/* -------------------- Helpers -------------------- */

const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const firstDefined = (object, keys, fallback = null) => {
  if (!isObject(object)) return fallback;

  for (const key of keys) {
    if (object[key] !== undefined && object[key] !== null) {
      return object[key];
    }
  }

  return fallback;
};

const toNumber = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const cleaned = String(value)
    .replace(/,/g, "")
    .replace(/[^\d.-]/g, "");

  if (!cleaned || cleaned === "-" || cleaned === ".") return 0;

  const result = Number(cleaned);
  return Number.isFinite(result) ? result : 0;
};

const toText = (value, fallback = "") => {
  if (value === null || value === undefined) return fallback;

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (isObject(value)) {
    return String(
      firstDefined(
        value,
        ["name", "vendor_name", "supplier_name", "title", "label"],
        fallback,
      ),
    );
  }

  return fallback;
};

const normalizeStatus = (value, fallback = "Pending") => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const status = toText(value, fallback).trim();
  const normalized = status.toLowerCase();

  const statusMap = {
    paid: "Paid",
    unpaid: "Unpaid",
    partial: "Partial",
    partially: "Partially",
    "partially paid": "Partial",
    pending: "Pending",
    delivered: "Delivered",
    completed: "Delivered",
    overdue: "Overdue",
    cancelled: "Cancelled",
    canceled: "Cancelled",
    approved: "Approved",
    rejected: "Rejected",
    draft: "Draft",
  };

  return statusMap[normalized] || status;
};

/* -------------------- Purchase Orders -------------------- */

const normalizePurchaseOrder = (item, index) => {
  const order = isObject(item) ? item : {};

  const rawItems = firstDefined(
    order,
    ["items", "line_items", "purchase_items", "order_items"],
    [],
  );

  const vendor = firstDefined(
    order,
    ["vendor_name", "supplier_name", "vendor", "supplier"],
    "",
  );

  const category = firstDefined(
    order,
    ["category_name", "product_category", "category"],
    "",
  );

  return {
    id: firstDefined(
      order,
      ["id", "pk", "purchase_order_id", "uuid"],
      `purchase-order-${index + 1}`,
    ),

    po: toText(
      firstDefined(
        order,
        [
          "po_number",
          "po_no",
          "purchase_order_number",
          "order_number",
          "number",
          "reference",
        ],
        `PO-${index + 1}`,
      ),
      `PO-${index + 1}`,
    ),

    date: firstDefined(
      order,
      ["po_date", "purchase_date", "order_date", "date", "created_at"],
      "",
    ),

    vendor: toText(vendor, "—"),

    items: Array.isArray(rawItems)
      ? rawItems.length
      : toNumber(
          firstDefined(
            order,
            ["items_count", "total_items", "item_count", "total_quantity"],
            rawItems,
          ),
        ),

    value: toNumber(
      firstDefined(
        order,
        ["purchase_value", "total_amount", "grand_total", "total", "amount"],
        0,
      ),
    ),

    outstanding: toNumber(
      firstDefined(
        order,
        [
          "outstanding_value",
          "outstanding_amount",
          "balance_due",
          "due_amount",
          "balance",
        ],
        0,
      ),
    ),

    bill: normalizeStatus(
      firstDefined(
        order,
        ["bill_status", "delivery_status", "purchase_status", "status"],
        "Pending",
      ),
    ),

    payment: normalizeStatus(
      firstDefined(order, ["payment_status", "payment_state"], "Unpaid"),
      "Unpaid",
    ),

    category: toText(category, ""),
  };
};

/* -------------------- Monthly Trend -------------------- */

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const MONTH_ALIASES = {
  JANUARY: "JAN",
  FEBRUARY: "FEB",
  MARCH: "MAR",
  APRIL: "APR",
  MAY: "MAY",
  JUNE: "JUN",
  JULY: "JUL",
  AUGUST: "AUG",
  SEPTEMBER: "SEP",
  OCTOBER: "OCT",
  NOVEMBER: "NOV",
  DECEMBER: "DEC",
};

const normalizeMonth = (value) => {
  const month = toText(value, "").trim().toUpperCase();

  if (MONTH_ALIASES[month]) return MONTH_ALIASES[month];

  const abbreviated = month.slice(0, 3);

  return MONTHS.includes(abbreviated) ? abbreviated : "";
};

const normalizeMonthlyTrend = (items) => {
  if (!Array.isArray(items)) return [];

  return items
    .filter(isObject)
    .map((item) => {
      const rawValue = firstDefined(
        item,
        [
          "purchase_value",
          "total_purchases",
          "total_purchase_value",
          "total",
          "amount",
          "value",
        ],
        0,
      );

      const unit = toText(
        firstDefined(item, ["unit", "value_unit"], ""),
        "",
      ).toLowerCase();

      const isMillions =
        item.value_in_millions === true ||
        item.value_in_millions === 1 ||
        unit === "million" ||
        unit === "millions";

      const numericValue = toNumber(rawValue);

      return {
        month: normalizeMonth(
          firstDefined(item, ["month", "month_name", "label"], ""),
        ),

        year: firstDefined(
          item,
          ["year", "financial_year", "fiscal_year"],
          undefined,
        ),

        // PurchaseTrendChart expects values in millions of SAR.
        // Change this conversion if the backend uses another unit.
        value: isMillions ? numericValue : numericValue / 1_000_000,
      };
    })
    .filter((item) => item.month);
};

/* -------------------- API Response Parsing -------------------- */

const extractReportData = (response) => {
  let data = response?.data ?? response ?? {};

  // Support responses nested inside data.data.
  for (let depth = 0; depth < 3; depth += 1) {
    if (!isObject(data) || !isObject(data.data)) break;
    data = data.data;
  }

  return data;
};

const extractOrders = (data) => {
  const orders = firstDefined(
    data,
    ["purchase_orders", "purchases", "results", "orders", "records", "items"],
    [],
  );

  if (Array.isArray(orders)) return orders;

  if (isObject(orders)) {
    const nested = firstDefined(orders, ["results", "items", "records"], []);

    return Array.isArray(nested) ? nested : [];
  }

  return [];
};

const extractTrend = (data) => {
  const trend = firstDefined(
    data,
    [
      "monthly_purchase_trend",
      "monthly_trend",
      "purchase_trend",
      "trend",
      "chart",
    ],
    [],
  );

  if (Array.isArray(trend)) return trend;

  if (isObject(trend)) {
    const nested = firstDefined(
      trend,
      ["results", "data", "items", "months"],
      [],
    );

    return Array.isArray(nested) ? nested : [];
  }

  return [];
};

const normalizeSummary = (data, orders) => {
  const summary = firstDefined(
    data,
    ["summary", "kpis", "statistics", "totals"],
    {},
  );

  const safeSummary = isObject(summary) ? summary : {};

  return {
    totalPurchases: toNumber(
      firstDefined(
        safeSummary,
        ["total_purchases", "total_purchase_value", "purchase_total"],
        0,
      ),
    ),

    totalPO: toNumber(
      firstDefined(
        safeSummary,
        [
          "total_po",
          "total_purchase_orders",
          "purchase_order_count",
          "total_orders",
        ],
        firstDefined(data, ["count", "total_count"], orders.length),
      ),
    ),

    paymentsMade: toNumber(
      firstDefined(
        safeSummary,
        ["payments_made", "total_payments", "total_paid"],
        0,
      ),
    ),

    purchaseReturns: toNumber(
      firstDefined(
        safeSummary,
        ["purchase_returns", "total_returns", "return_amount"],
        0,
      ),
    ),

    outstandingPayables: toNumber(
      firstDefined(
        safeSummary,
        ["outstanding_payables", "total_outstanding", "outstanding_amount"],
        0,
      ),
    ),
  };
};

const normalizePurchaseReport = (response) => {
  const data = extractReportData(response);
  const orders = extractOrders(data);

  const purchaseOrders = orders.map((item, index) =>
    normalizePurchaseOrder(item, index),
  );

  const monthlyTrend = normalizeMonthlyTrend(extractTrend(data));

  return {
    summary: normalizeSummary(data, orders),
    purchaseOrders,
    monthlyTrend,
  };
};

/* -------------------- Service -------------------- */

const purchaseReportService = {
  async getPurchaseReport() {
    try {
      const response = await API.get(PURCHASE_REPORT_URL);

      return normalizePurchaseReport(response);
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load purchase report.";

      const serviceError = new Error(message);

      serviceError.status = error?.response?.status;
      serviceError.response = error?.response;

      throw serviceError;
    }
  },
};

export {
  normalizePurchaseOrder,
  normalizeMonthlyTrend,
  normalizePurchaseReport,
  toNumber,
};

export default purchaseReportService;
