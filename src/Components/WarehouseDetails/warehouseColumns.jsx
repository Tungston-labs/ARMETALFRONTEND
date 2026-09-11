import React from "react";
import { FiInfo } from "react-icons/fi";

/* =========================================================
   FORMAT NUMBER
========================================================= */

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

/* =========================================================
   FORMAT CURRENCY
========================================================= */

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (trimmedValue.toUpperCase().includes("SAR")) {
      return trimmedValue;
    }
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return value;
  }

  return `SAR ${number.toLocaleString("en-US")}`;
};

/* =========================================================
   FORMAT TYPE
========================================================= */

const formatType = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const text = String(value);

  return text.charAt(0).toUpperCase() + text.slice(1);
};

/* =========================================================
   FORMAT STATUS
========================================================= */

const formatStatus = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  const text = String(value);

  return text.charAt(0).toUpperCase() + text.slice(1);
};

/* =========================================================
   MANAGER NAME
========================================================= */

const getManagerName = (row) => {
  if (
    row?.manager_name !== null &&
    row?.manager_name !== undefined &&
    row?.manager_name !== ""
  ) {
    return row.manager_name;
  }

  if (
    row?.manager?.name !== null &&
    row?.manager?.name !== undefined &&
    row?.manager?.name !== ""
  ) {
    return row.manager.name;
  }

  if (
    row?.manager?.full_name !== null &&
    row?.manager?.full_name !== undefined &&
    row?.manager?.full_name !== ""
  ) {
    return row.manager.full_name;
  }

  if (
    row?.manager?.username !== null &&
    row?.manager?.username !== undefined &&
    row?.manager?.username !== ""
  ) {
    return row.manager.username;
  }

  if (
    typeof row?.manager === "number" ||
    (typeof row?.manager === "string" && /^\d+$/.test(row.manager))
  ) {
    return "-";
  }

  if (typeof row?.manager === "string" && row.manager.trim() !== "") {
    return row.manager;
  }

  return "-";
};

/* =========================================================
   WAREHOUSE COLUMNS
========================================================= */

const getWarehouseColumns = ({ navigate }) => [
  /* =======================================================
     CODE
  ======================================================= */

  {
    header: "Code",

    accessor: "code",
  },

  /* =======================================================
     WAREHOUSE NAME
  ======================================================= */

  {
    header: "Warehouse Name",

    accessor: "warehouse_name",

    cell: (row) => {
      const warehouseId = row?.id;

      const warehouseName = row?.warehouse_name || row?.name || "-";

      const handleClick = () => {
        /*
         * IMPORTANT:
         *
         * Always use the database ID
         * for the details API.
         *
         * Example:
         *
         * id   = 7
         * code = WH001
         *
         * URL:
         * /warehouse/7
         */

        if (
          warehouseId === null ||
          warehouseId === undefined ||
          warehouseId === ""
        ) {
          console.error("Warehouse ID is missing:", row);

          return;
        }

        navigate(`/warehouse/${encodeURIComponent(warehouseId)}`);
      };

      return (
        <button
          type="button"
          onClick={handleClick}
          style={{
            color: "#3454B9",

            fontFamily: "Poppins, sans-serif",

            fontSize: "12px",

            fontWeight: 500,

            background: "transparent",

            border: "none",

            padding: 0,

            cursor: "pointer",

            textAlign: "left",
          }}
        >
          {warehouseName}
        </button>
      );
    },
  },

  /* =======================================================
     TYPE
  ======================================================= */

  {
    header: "Type",

    accessor: "warehouse_type",

    cell: (row) => <span>{formatType(row?.warehouse_type)}</span>,
  },

  /* =======================================================
     LOCATION
  ======================================================= */

  {
    header: "Location",

    accessor: "city",

    cell: (row) => <span>{row?.city || "-"}</span>,
  },

  /* =======================================================
     MANAGER
  ======================================================= */

  {
    header: "Manager",

    accessor: "manager_name",

    cell: (row) => <span>{getManagerName(row)}</span>,
  },

  /* =======================================================
     TOTAL PRODUCTS
  ======================================================= */

  {
    header: "Total Products",

    accessor: "total_products",

    cell: (row) => <span>{formatNumber(row?.total_products)}</span>,
  },

  /* =======================================================
     STOCK QUANTITY
  ======================================================= */

  {
    header: "Stock Quantity",

    accessor: "stock_quantity",

    cell: (row) => <span>{formatNumber(row?.stock_quantity)}</span>,
  },

  /* =======================================================
     INVENTORY VALUE
  ======================================================= */

  {
    header: "Inventory Value",

    accessor: "inventory_value",

    cell: (row) => <span>{formatCurrency(row?.inventory_value)}</span>,
  },

  /* =======================================================
     STATUS
  ======================================================= */

  {
    header: "Status",

    accessor: "status",

    cell: (row) => <span>{formatStatus(row?.status)}</span>,
  },

  /* =======================================================
     ACTION
  ======================================================= */

  {
    header: "Action",

    accessor: "action",

    cell: (row) => {
      const warehouseId = row?.id;

      const warehouseName = row?.warehouse_name || "warehouse";

      const handleClick = () => {
        if (
          warehouseId === null ||
          warehouseId === undefined ||
          warehouseId === ""
        ) {
          console.error("Warehouse ID is missing:", row);

          return;
        }

        navigate(`/warehouse/${encodeURIComponent(warehouseId)}`);
      };

      return (
        <button
          type="button"
          title="View warehouse"
          aria-label={`View ${warehouseName}`}
          onClick={handleClick}
          style={{
            width: "25px",

            height: "25px",

            padding: 0,

            border: "1px solid #DDDDDD",

            borderRadius: "5px",

            background: "#FFFFFF",

            color: "#333333",

            cursor: "pointer",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            margin: "0 auto",
          }}
        >
          <FiInfo size={14} />
        </button>
      );
    },
  },
];

export default getWarehouseColumns;
