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
// FORMAT CURRENCY - SAR
// =====================================================

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") {
    return "SAR 0.00";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return `SAR ${value}`;
  }

  return `SAR ${number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// =====================================================
// GET MANAGER NAME
// =====================================================

const getManagerName = (row) => {
  return (
    row?.manager_name ||
    row?.manager?.name ||
    row?.manager?.full_name ||
    row?.manager?.username ||
    (typeof row?.manager === "string" ? row.manager : "-")
  );
};

// =====================================================
// CHECK WAREHOUSE ID
// =====================================================

const hasWarehouseId = (row) => {
  return !(row?.id === null || row?.id === undefined || row?.id === "");
};

// =====================================================
// GET TOTAL UNITS
// =====================================================

const getTotalUnits = (row) => {
  return row?.total_units ?? row?.stock_quantity ?? row?.total_products ?? 0;
};

// =====================================================
// GET CAPACITY USED
// Example: 76% of 400
// =====================================================

const getCapacityUsed = (row) => {
  const capacity =
    row?.capacity ?? row?.total_capacity ?? row?.warehouse_capacity;

  const usedUnits =
    row?.total_units ?? row?.stock_quantity ?? row?.used_capacity;

  if (
    capacity !== null &&
    capacity !== undefined &&
    capacity !== "" &&
    usedUnits !== null &&
    usedUnits !== undefined &&
    usedUnits !== ""
  ) {
    const totalCapacity = Number(capacity);
    const used = Number(usedUnits);

    if (
      !Number.isNaN(totalCapacity) &&
      !Number.isNaN(used) &&
      totalCapacity > 0
    ) {
      const percentage = Math.round((used / totalCapacity) * 100);

      return `${percentage}% of ${formatNumber(totalCapacity)}`;
    }
  }

  const percentage = row?.capacity_used_percent ?? row?.capacity_percentage;

  if (percentage !== null && percentage !== undefined && percentage !== "") {
    return `${formatNumber(percentage)}%${
      capacity ? ` of ${formatNumber(capacity)}` : ""
    }`;
  }

  return "-";
};

// =====================================================
// WAREHOUSE COLUMNS
// Matching the provided screenshot
// =====================================================

const getWarehouseColumns = ({ navigate, onEdit, onDelete }) => [
  // CODE
  {
    header: "Code",
    accessor: "code",
    cell: (row) => row?.code || "-",
  },

  // WAREHOUSE
  {
    header: "Warehouse",
    accessor: "warehouse_name",
    cell: (row) => {
      const warehouseId = row?.id;
      const warehouseName = row?.warehouse_name || "-";

      const handleWarehouseClick = () => {
        if (!hasWarehouseId(row)) {
          console.error("Warehouse ID is missing:", row);
          return;
        }

        if (typeof navigate !== "function") {
          console.error("Navigate function is missing.");
          return;
        }

        const id = String(warehouseId);

        navigate(`/warehouse/${encodeURIComponent(id)}`);
      };

      return (
        <span
          onClick={handleWarehouseClick}
          style={{
            cursor: hasWarehouseId(row) ? "pointer" : "default",
            color: "inherit",
            fontWeight: 400,
          }}
        >
          {warehouseName}
        </span>
      );
    },
  },

  // LOCATION
  {
    header: "Location",
    accessor: "city",
    cell: (row) => row?.city || row?.location || "-",
  },

  // MANAGER
  {
    header: "Manager",
    accessor: "manager",
    cell: (row) => getManagerName(row),
  },

  // TOTAL UNITS
  {
    header: "Total units",
    accessor: "total_units",
    cell: (row) => formatNumber(getTotalUnits(row)),
  },

  // STOCK VALUE
  {
    header: "Stock value",
    accessor: "inventory_value",
    cell: (row) => formatCurrency(row?.inventory_value),
  },

  // CAPACITY USED
  {
    header: "Capacity used",
    accessor: "capacity_used",
    cell: (row) => getCapacityUsed(row),
  },

  // STATUS
  {
    header: "Status",
    accessor: "status",
    cell: (row) => row?.status || "-",
  },

  // ACTION
  {
    header: "Action",
    accessor: "actions",
    cell: (row) => {
      const handleInfo = () => {
        if (!hasWarehouseId(row)) {
          console.error("Warehouse ID is missing:", row);
          return;
        }

        if (typeof onEdit !== "function") {
          console.error("onEdit function is missing.");
          return;
        }

        onEdit(row);
      };

      return (
        <button
          type="button"
          onClick={handleInfo}
          title="View warehouse details"
          style={{
            width: "24px",
            height: "24px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid #e5e7eb",
            borderRadius: "5px",
            background: "#ffffff",
            color: "#333333",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <FiInfo size={13} /> 
        </button>
      );
    },
  },
];

export default getWarehouseColumns;
