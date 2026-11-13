import React from "react";
import {
  FiFileText,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
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
  if (!raw || raw === "-") return "-";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return raw;
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const customerLabel = (row) => {
  const customer = row?.customer;
  if (customer && typeof customer === "object") {
    return value(customer, "name", "customer_name", "company_name");
  }
  return value(row, "customer_name", "customer");
};

const itemSummary = (row) => {
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
    const totals = items.reduce(
      (acc, item) => {
        acc.delivered +=
          Number(item?.already_delivered ?? item?.delivered_qty ?? 0) || 0;
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
  if (explicit !== "-") return explicit;
  const text = String(value(row, "status", "delivery_status")).toLowerCase();
  if (text.includes("partial")) return "Partial";
  if (text.includes("deliver")) return "Full";
  return "-";
};

export const deliveryNoteColumns = (onDelete) => [
  {
    header: "DN No",
    accessor: "delivery_note_number",
    render: (row) =>
      value(row, "delivery_note_number", "deliveryNoteNumber", "number"),
  },
  {
    header: "Customer",
    accessor: "customer",
    render: customerLabel,
  },
  {
    header: "Order ref",
    accessor: "sales_order_reference",
    render: (row) =>
      value(
        row,
        "sales_order_reference",
        "salesOrderReference",
        "order_reference",
        "order_ref",
      ),
  },
  {
    header: "Dispatch date",
    accessor: "dispatch_date",
    render: (row) => dateLabel(value(row, "dispatch_date", "dispatchDate")),
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
    header: "Items (Delivered/Ordered)",
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
    render: (row) => value(row, "status", "delivery_status", "deliveryStatus"),
  },
  {
    header: "Action",
    accessor: "actions",
    sortable: false,
    render: (row) => <DeliveryAction row={row} onDelete={onDelete} />,
  },
];

export const deliveryNoteStats = (stats) => [
  {
    title: "Total delivery notes",
    count: stats.total,
    icon: <FiFileText />,
    backgroundColor: "#E8F1FF",
    iconColor: "#3478F6",
  },
  {
    title: "In transit",
    count: stats.inTransit,
    icon: <FiTruck />,
    backgroundColor: "#F3E8FF",
    iconColor: "#9333EA",
  },
  {
    title: "Delivered",
    count: stats.delivered,
    icon: <FiCheckCircle />,
    backgroundColor: "#E8F8EF",
    iconColor: "#22A06B",
  },
  {
    title: "Partially Delivered",
    count: stats.partiallyDelivered,
    icon: <FiClock />,
    backgroundColor: "#FFF4E5",
    iconColor: "#F59E0B",
  },
  {
    title: "Cancelled",
    count: stats.cancelled,
    icon: <FiXCircle />,
    backgroundColor: "#FDECEC",
    iconColor: "#E5484D",
  },
];
