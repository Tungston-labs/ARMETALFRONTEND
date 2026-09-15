import React from "react";
import { FiInfo } from "react-icons/fi";

// =====================================================
// FORMAT NUMBER
// =====================================================

const formatNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return value;
  }

  return number.toLocaleString("en-US");
};

// =====================================================
// FORMAT CURRENCY
// =====================================================

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") {
    return "SAR 0";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return `SAR ${value}`;
  }

  return `SAR ${number.toLocaleString("en-US")}`;
};

// =====================================================
// FORMAT DATE
// =====================================================

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// =====================================================
// STOCK STATUS CLASS
// =====================================================

const getStockStatusClass = (status) => {
  if (!status) {
    return "";
  }

  const normalizedStatus = status.toString().toLowerCase().replace(/\s+/g, "-");

  return `stock-status stock-status-${normalizedStatus}`;
};

// =====================================================
// INVENTORY COLUMNS
// =====================================================

export const inventoryColumns = [
  {
    key: "code",
    title: "Code",
    render: (row) => row?.code || "-",
  },

  {
    key: "product_name",
    title: "Product",
    render: (row) => row?.product_name || "-",
  },

  {
    key: "category_name",
    title: "Category",
    render: (row) => row?.category_name || "-",
  },

  {
    key: "warehouse_name",
    title: "Warehouse",
    render: (row) => row?.warehouse_name || "-",
  },

  {
    key: "available_qty",
    title: "Available Qty",
    render: (row) => formatNumber(row?.available_qty),
  },

  {
    key: "reserved_qty",
    title: "Reserved Qty",
    render: (row) => formatNumber(row?.reserved_qty),
  },

  {
    key: "unit",
    title: "Unit",
    render: (row) => row?.unit || "-",
  },

  {
    key: "reorder_level",
    title: "Reorder Level",
    render: (row) => formatNumber(row?.reorder_level),
  },

  {
    key: "stock_status",
    title: "Stock Status",
    render: (row) => (
      <span className={getStockStatusClass(row?.stock_status)}>
        {row?.stock_status || "-"}
      </span>
    ),
  },

  {
    key: "inventory_value",
    title: "Inventory Value",
    render: (row) => formatCurrency(row?.inventory_value),
  },

  {
    key: "updated_at",
    title: "Last Updated",
    render: (row) => formatDate(row?.updated_at),
  },

  {
    key: "action",
    title: "Action",
    render: (row) => (
      <button
        type="button"
        className="inventory-info-button"
        title={`View ${row?.product_name || "inventory"} details`}
        onClick={() => {
          console.log("Inventory details:", row);
        }}
      >
        <FiInfo size={15} />
      </button>
    ),
  },
];
