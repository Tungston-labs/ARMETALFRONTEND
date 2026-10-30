import React from "react";

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
// STOCK STATUS
// =====================================================

const getStockStatusClass = (status) => {
  const normalizedStatus = (status || "")
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-");

  return `stock-status stock-status-${normalizedStatus}`;
};

// =====================================================
// INVENTORY COLUMNS
// Matching the provided screenshot
// =====================================================

export const inventoryColumns = [
  {
    accessor: "code",
    header: "Code",
    render: (row) => row?.code || "-",
  },

  {
    accessor: "product_name",
    header: "Item",
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
    header: "In stock",
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
    accessor: "inventory_value",
    header: "Stock value",
    render: (row) => formatCurrency(row?.inventory_value),
  },

  {
    accessor: "stock_status",
    header: "Stock Status",
    render: (row) => (
      <span
        className={getStockStatusClass(row?.stock_status)}
        style={{
          color:
            row?.stock_status?.toLowerCase() === "in stock"
              ? "#16a34a"
              : row?.stock_status?.toLowerCase() === "low stock"
                ? "#f97316"
                : row?.stock_status?.toLowerCase() === "out of stock"
                  ? "#ef4444"
                  : "#333333",
          fontSize: "12px",
          fontWeight: 400,
          whiteSpace: "nowrap",
        }}
      >
        {row?.stock_status || "-"}
      </span>
    ),
  },
];
