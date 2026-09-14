import React from "react";

import { FiInfo } from "react-icons/fi";

const formatNumber = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return value;
  }

  return number.toLocaleString("en-US");
};

const formatCurrency = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "-";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return value;
  }

  return `₹${number.toLocaleString("en-IN")}`;
};

const getManagerName = (row) => {
  return (
    row?.manager_name ||
    row?.manager?.name ||
    row?.manager?.full_name ||
    row?.manager?.username ||
    (typeof row?.manager === "string"
      ? row.manager
      : "-")
  );
};

const hasWarehouseId = (row) => {
  return !(
    row?.id === null ||
    row?.id === undefined ||
    row?.id === ""
  );
};

const getWarehouseColumns = ({
  navigate,
  onEdit,
  onDelete,
}) => [
  {
    header: "Code",
    accessor: "code",
    cell: (row) => row?.code || "-",
  },

  {
    header: "Warehouse Name",
    accessor: "warehouse_name",
    cell: (row) => {
      const warehouseId = row?.id;
      const warehouseName =
        row?.warehouse_name || "-";

      const handleWarehouseClick = () => {
        if (!hasWarehouseId(row)) {
          console.error(
            "Warehouse ID is missing:",
            row,
          );
          return;
        }

        const id = String(warehouseId);

        console.log(
          "Navigating to warehouse details:",
          id,
        );

        navigate(
          `/warehouse/${encodeURIComponent(id)}`,
        );
      };

      return (
        <span
          onClick={handleWarehouseClick}
          style={{
            cursor: hasWarehouseId(row)
              ? "pointer"
              : "default",
            color: hasWarehouseId(row)
              ? "#3454B9"
              : "inherit",
            fontWeight: 500,
          }}
        >
          {warehouseName}
        </span>
      );
    },
  },

  {
    header: "Warehouse Type",
    accessor: "warehouse_type",
    cell: (row) =>
      row?.warehouse_type || "-",
  },

  {
    header: "Location",
    accessor: "city",
    cell: (row) => {
      const city = row?.city || "";
      const country = row?.country || "";

      if (!city && !country) {
        return "-";
      }

      return [city, country]
        .filter(Boolean)
        .join(", ");
    },
  },

  {
    header: "Manager",
    accessor: "manager",
    cell: (row) =>
      getManagerName(row),
  },

  {
    header: "Total Products",
    accessor: "total_products",
    cell: (row) =>
      formatNumber(row?.total_products),
  },

  {
    header: "Stock Quantity",
    accessor: "stock_quantity",
    cell: (row) =>
      formatNumber(row?.stock_quantity),
  },

  {
    header: "Inventory Value",
    accessor: "inventory_value",
    cell: (row) =>
      formatCurrency(row?.inventory_value),
  },

  {
    header: "Status",
    accessor: "status",
    cell: (row) => {
      const status = row?.status || "-";

      return (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 500,
            background:
              String(status).toLowerCase() ===
              "active"
                ? "#E8F7EE"
                : "#FDECEC",
            color:
              String(status).toLowerCase() ===
              "active"
                ? "#16A34A"
                : "#D64545",
          }}
        >
          {status}
        </span>
      );
    },
  },

  {
    header: "Actions",
    accessor: "actions",
    cell: (row) => {
      const handleEdit = () => {
        if (!hasWarehouseId(row)) {
          console.error(
            "Warehouse ID is missing:",
            row,
          );
          return;
        }

        if (typeof onEdit !== "function") {
          console.error(
            "onEdit function is missing.",
          );
          return;
        }

        onEdit(row);
      };

      const handleDelete = () => {
        if (!hasWarehouseId(row)) {
          console.error(
            "Warehouse ID is missing:",
            row,
          );
          return;
        }

        if (typeof onDelete !== "function") {
          console.error(
            "onDelete function is missing.",
          );
          return;
        }

        onDelete(row);
      };

      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <button
            type="button"
            onClick={handleEdit}
            title="Edit warehouse"
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FiInfo size={18} />
          </button>

          {typeof onDelete === "function" && (
            <button
              type="button"
              onClick={handleDelete}
              title="Delete warehouse"
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: 4,
              }}
            >
              Delete
            </button>
          )}
        </div>
      );
    },
  },
];

export default getWarehouseColumns;