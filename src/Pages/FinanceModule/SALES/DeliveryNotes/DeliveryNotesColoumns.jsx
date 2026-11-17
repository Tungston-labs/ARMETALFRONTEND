import React from "react";
import {
  FiFileText,
  FiTruck,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import DeliveryAction from "./Action/DeliveryAction";

const value = (row, ...keys) => {
  for (const key of keys) {
    if (row?.[key] !== undefined && row?.[key] !== null && row?.[key] !== "")
      return row[key];
  }
  return "-";
};

const dateLabel = (raw) => {
  if (!raw || raw === "-") return "--";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const customerLabel = (row) => {
  if (row?.customer_name) return row.customer_name;
  if (row?.customerName) return row.customerName;
  const customer = row?.customer;
  if (customer && typeof customer === "object") {
    return value(customer, "customer_name", "name", "company_name");
  }
  if (customer && typeof customer === "string") return customer;
  return value(row, "bill_to_name", "client_name");
};

const itemSummary = (row) => {
  if (row?.items_delivered_ordered) return row.items_delivered_ordered;
  if (row?.items_summary) return row.items_summary;

  const delivered = value(
    row,
    "delivered_quantity",
    "total_delivered",
    "already_delivered",
    "delivered_qty",
  );
  const ordered = value(
    row,
    "ordered_quantity",
    "total_ordered",
    "ordered_qty",
    "total_qty",
  );
  if (delivered === "-" && ordered === "-") {
    const items = Array.isArray(row?.items) ? row.items : [];
    if (!items.length) return "--";
    const totals = items.reduce(
      (acc, item) => {
        acc.delivered +=
          Number(item?.quantity ?? item?.delivering_now ?? 0) || 0;
        acc.ordered +=
          Number(
            item?.ordered_qty ?? item?.ordered_quantity ?? item?.quantity ?? 0,
          ) || 0;
        return acc;
      },
      { delivered: 0, ordered: 0 },
    );
    return `${totals.delivered}/${totals.ordered}`;
  }
  return `${delivered === "-" ? 0 : delivered}/${ordered === "-" ? 0 : ordered}`;
};

const deliveryType = (row) => {
  const explicit = value(row, "delivery_type", "deliveryType");
  if (explicit !== "-") {
    const isFull = explicit.toLowerCase() === "full";
    const isPartial = explicit.toLowerCase() === "partial";
    return (
      <span
        style={{
          color: isFull ? "#16a34a" : isPartial ? "#ea580c" : "#6b7280",
          fontWeight: 500,
        }}
      >
        {explicit}
      </span>
    );
  }
  const text = String(value(row, "status", "delivery_status")).toLowerCase();
  if (text.includes("partial"))
    return <span style={{ color: "#ea580c", fontWeight: 500 }}>Partial</span>;
  if (text.includes("deliver"))
    return <span style={{ color: "#16a34a", fontWeight: 500 }}>Full</span>;
  return <span style={{ color: "#6b7280" }}>--</span>;
};

const renderStatus = (row) => {
  const raw = String(
    value(row, "status", "delivery_status", "deliveryStatus") || "draft",
  );
  const normalized = raw.toLowerCase().replace(/[\s-]/g, "_");

  let color = "#16a34a";
  let label = "Delivered";

  if (normalized === "draft") {
    color = "#2563eb";
    label = "Draft";
  } else if (normalized === "pending") {
    color = "#ea580c";
    label = "Pending";
  } else if (normalized === "in_transit" || normalized === "transit") {
    color = "#9333ea";
    label = "In Transit";
  } else if (normalized === "dispatched") {
    color = "#ea580c";
    label = "Dispatched";
  } else if (normalized === "partially_delivered" || normalized === "partial") {
    color = "#d97706";
    label = "Partially Delivered";
  } else if (normalized === "delivered") {
    color = "#16a34a";
    label = "Delivered";
  } else if (normalized === "cancelled" || normalized === "canceled") {
    color = "#dc2626";
    label = "Cancelled";
  } else {
    label = raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  return (
    <span style={{ color, fontWeight: 500, fontSize: "13.5px" }}>
      {label}
    </span>
  );
};

export const deliveryNoteColumns = (onDelete, onOrderRefClick) => [
  {
    header: "DN No",
    accessor: "delivery_note_number",
    render: (row) =>
      value(
        row,
        "delivery_note_number",
        "deliveryNoteNumber",
        "dn_number",
        "number",
      ),
  },
  {
    header: "Customer",
    accessor: "customer",
    render: customerLabel,
  },
  {
    header: "Order ref",
    accessor: "sales_order_reference",
    render: (row) => {
      const ref = value(
        row,
        "sales_order_reference",
        "salesOrderReference",
        "order_reference",
        "so_ref",
        "order_ref",
      );
      if (ref === "-") return "--";
      return (
        <span
          style={{
            color: "#2563eb",
            textDecoration: "underline",
            cursor: "pointer",
            fontWeight: 500,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onOrderRefClick?.(row);
          }}
        >
          {ref}
        </span>
      );
    },
  },
  {
    header: "Dispatch date",
    accessor: "dispatch_date",
    render: (row) =>
      dateLabel(value(row, "dispatch_date", "dispatchDate")),
  },
  {
    header: "Delivery date",
    accessor: "expected_delivery_date",
    render: (row) =>
      dateLabel(
        value(
          row,
          "expected_delivery_date",
          "expectedDeliveryDate",
          "delivery_date",
          "deliveryDate",
        ),
      ),
  },
  {
    header: "Warehouse",
    accessor: "warehouse",
    render: (row) => {
      const warehouse = row?.warehouse;
      if (warehouse && typeof warehouse === "object")
        return value(warehouse, "name", "warehouse_name");
      return value(row, "warehouse_name", "warehouse", "dispatch_location");
    },
  },
  {
    header: (
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          lineHeight: 1.2,
          whiteSpace: "normal",
        }}
      >
        <span>Items</span>
        <span
          style={{
            fontSize: "10.5px",
            fontWeight: "normal",
            opacity: 0.9,
          }}
        >
          (Delivered/Ordered)
        </span>
      </div>
    ),
    accessor: "items",
    render: itemSummary,
  },
  {
    header: "Delivery Type",
    accessor: "delivery_type",
    render: deliveryType,
  },
  {
    header: "Status",
    accessor: "status",
    render: renderStatus,
  },
  {
    header: "Action",
    accessor: "actions",
    sortable: false,
    render: (row) => <DeliveryAction row={row} onDelete={onDelete} />,
  },
];

const pad2 = (val) => {
  const num = Number(val) || 0;
  return String(num).padStart(2, "0");
};

export const deliveryNoteStats = (stats) => [
  {
    title: "Total delivery notes",
    count: pad2(stats.total),
    icon: <FiFileText />,
    backgroundColor: "#E8F1FF",
    iconColor: "#3478F6",
  },
  {
    title: "In transit",
    count: pad2(stats.inTransit),
    icon: <FiTruck />,
    backgroundColor: "#F3E8FF",
    iconColor: "#9333EA",
  },
  {
    title: "Delivered",
    count: pad2(stats.delivered),
    icon: <FiCheckCircle />,
    backgroundColor: "#E8F8EF",
    iconColor: "#22A06B",
  },
  {
    title: "Partially Delivered",
    count: pad2(stats.partiallyDelivered),
    icon: <FiClock />,
    backgroundColor: "#FFF4E5",
    iconColor: "#F59E0B",
  },
];
