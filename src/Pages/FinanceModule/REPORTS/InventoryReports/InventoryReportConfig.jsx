
import {
  FiPackage,
  FiDollarSign,
  FiAlertCircle,
  FiCheckCircle,
  FiTrendingDown,
} from "react-icons/fi";

export const formatSAR = (value) => {
  const amount = Number(value);
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  return `SAR ${safeAmount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

export const getRecordValue = (record, keys, fallback = "—") => {
  for (const key of keys) {
    const value = record?.[key];

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return fallback;
};

export const getStockStatus = (record) => {
  const status = String(
    getRecordValue(
      record,
      ["stock_status", "status", "stockStatus"],
      ""
    )
  )
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .trim();

  if (status.includes("out of stock") || status === "out") {
    return "Out of Stock";
  }

  if (status.includes("low stock") || status === "low") {
    return "Low Stock";
  }

  if (status.includes("in stock") || status === "in") {
    return "In Stock";
  }

  const quantity = Number(
    getRecordValue(
      record,
      [
        "available_quantity",
        "available",
        "quantity",
        "stock_quantity",
      ],
      NaN
    )
  );

  if (quantity === 0) return "Out of Stock";
  if (Number.isFinite(quantity) && quantity > 0) return "In Stock";

  return "Unknown";
};

export const buildInventoryKpis = (report = {}) => [
  {
    title: "Total Items",
    value: Number(report.total_items || 0).toLocaleString("en-US"),
    icon: FiPackage,
    background: "#e8efff",
    color: "#3154b5",
  },
  {
    title: "Inventory Value",
    value: formatSAR(report.total_inventory_value),
    icon: FiDollarSign,
    background: "#fff2e6",
    color: "#ff850c",
  },
  {
    title: "Low Stock",
    value: Number(report.low_stock || 0).toLocaleString("en-US"),
    icon: FiTrendingDown,
    background: "#dff4f7",
    color: "#19a8c2",
  },
  {
    title: "Out of Stock",
    value: Number(report.out_of_stock || 0).toLocaleString("en-US"),
    icon: FiAlertCircle,
    background: "#f3dede",
    color: "#ed3434",
  },
  {
    title: "In Stock",
    value: Number(report.in_stock || 0).toLocaleString("en-US"),
    icon: FiCheckCircle,
    background: "#e4f6e9",
    color: "#218838",
  },
];
