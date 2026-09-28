import React from "react";

import {
  FiShoppingCart,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

import DeliveryAction from "./Action/DeliveryAction";

const formatDeliveryDate = (date) => {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const salesOrderColumns = (onDelete) => [
  {
    header: "DN No",
    accessor: "deliveryNoteNumber",

    render: (row) => row.deliveryNoteNumber || row.delivery_note_number || "-",
  },

  {
    header: "SO Ref",
    accessor: "salesOrderReference",

    render: (row) =>
      row.salesOrderReference || row.sales_order_reference || "-",
  },

  {
    header: "Customer",
    accessor: "customer",

    render: (row) => {
      const customer = row?.customer;

      if (customer && typeof customer === "object") {
        return (
          customer?.name ||
          customer?.customer_name ||
          customer?.company_name ||
          "-"
        );
      }

      return customer || row?.customer_name || "-";
    },
  },

  {
    header: "Delivery Date",
    accessor: "deliveryDate",

    render: (row) => formatDeliveryDate(row.deliveryDate || row.delivery_date),
  },

  {
    header: "Delivery Value",
    accessor: "deliveryValue",

    render: (row) => {
      const value =
        row.deliveryValue ||
        row.delivery_value ||
        row.amount ||
        row.total_amount ||
        row.thisDelivery ||
        row.this_delivery ||
        row.orderedValue;

      if (!value) {
        return "-";
      }

      const stringValue = String(value);

      return stringValue.toUpperCase().includes("SAR")
        ? stringValue
        : `SAR ${stringValue}`;
    },
  },

  {
    header: "Delivery Status",
    accessor: "deliveryStatus",

    render: (row) =>
      row.deliveryStatus || row.delivery_status || row.status || "-",
  },

  {
    header: "Invoice Status",
    accessor: "invoiceStatus",

    render: (row) => row.invoiceStatus || row.invoice_status || "-",
  },

  {
    header: "Action",
    accessor: "actions",
    sortable: false,

    render: (row) => <DeliveryAction row={row} onDelete={onDelete} />,
  },
];

export const salesOrderStats = (stats) => [
  {
    title: "Total Deliveries",
    count: stats.totalDeliveries,
    icon: <FiShoppingCart />,
    backgroundColor: "#E8F8EF",
    iconColor: "#22A06B",
  },

  {
    title: "Pending Deliveries",
    count: stats.pendingDeliveries,
    icon: <FiClock />,
    backgroundColor: "#E8F1FF",
    iconColor: "#3478F6",
  },

  {
    title: "Partially Delivered",
    count: stats.partiallyDelivered,
    icon: <FiClock />,
    backgroundColor: "#FFF4E5",
    iconColor: "#F59E0B",
  },

  {
    title: "Delivered",
    count: stats.delivered,
    icon: <FiCheckCircle />,
    backgroundColor: "#FDECEC",
    iconColor: "#E5484D",
  },

  {
    title: "Delivery Value",
    count: stats.deliveryValue,
    icon: <FiDollarSign />,
    backgroundColor: "#E5F6FA",
    iconColor: "#00A86B",
  },
];
