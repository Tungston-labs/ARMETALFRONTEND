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
    accessor: "code",
    header: "Code",
    render: (row) => row?.code || "-",
  },

  {
    accessor: "product_name",
    header: "Product",
    render: (row) => row?.product_name || "-",
  },

  {
    accessor: "category_name",
    header: "Category",
    render: (row) => row?.category_name || "-",
  },

  {
    accessor: "warehouse_name",
    header: "Warehouse",
    render: (row) => row?.warehouse_name || "-",
  },

  {
    accessor: "available_qty",
    header: "Available Qty",
    render: (row) => formatNumber(row?.available_qty),
  },

  {
    accessor: "reserved_qty",
    header: "Reserved Qty",
    render: (row) => formatNumber(row?.reserved_qty),
  },

  {
    accessor: "unit",
    header: "Unit",
    render: (row) => row?.unit || "-",
  },

  {
    accessor: "reorder_level",
    header: "Reorder Level",
    render: (row) => formatNumber(row?.reorder_level),
  },

  {
    accessor: "stock_status",
    header: "Stock Status",
    render: (row) => (
      <span className={getStockStatusClass(row?.stock_status)}>
        {row?.stock_status || "-"}
      </span>
    ),
  },

  {
    accessor: "inventory_value",
    header: "Inventory Value",
    render: (row) => formatCurrency(row?.inventory_value),
  },

  {
    accessor: "updated_at",
    header: "Last Updated",
    render: (row) => formatDate(row?.updated_at),
  },

  {
    accessor: "action",
    header: "Action",
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
