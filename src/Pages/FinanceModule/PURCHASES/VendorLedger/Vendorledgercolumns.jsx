import React from "react";

const formatDate = (dateStr) => {
  if (!dateStr) return "-";

  const [year, month, day] = String(dateStr)
    .slice(0, 10)
    .split("-")
    .map(Number);

  if (!year || !month || !day) return "-";

  const d = new Date(year, month - 1, day);

  const mon = d.toLocaleString("en-GB", {
    month: "short",
  });

  return `${String(day).padStart(2, "0")}/${mon}/${year}`;
};

export const formatAmount = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const getVendorLedgerColumns = () => [
  {
    header: "Date",
    accessor: "entry_date",
    sortable: false,
    render: (row) => formatDate(row.entry_date),
  },

  {
    header: "Vendor",
    accessor: "vendor_name",
    sortable: false,
    render: (row) => (
      <div>
        <div>{row.vendor_name || "-"}</div>

        {row.vendor_code && (
          <div
            style={{
              fontSize: 12,
              color: "#7B7B7B",
            }}
          >
            {row.vendor_code}
          </div>
        )}
      </div>
    ),
  },

  {
    header: "Opening Balance",
    accessor: "opening_balance",
    sortable: false,
    render: (row) => formatAmount(row.opening_balance),
  },

  {
    header: "Total Billed",
    accessor: "debit_amount",
    sortable: false,
    render: (row) => (
      <span style={{ color: "#EF4444" }}>
        {formatAmount(row.debit_amount)}
      </span>
    ),
  },

  {
    header: "Total Paid",
    accessor: "credit_amount",
    sortable: false,
    render: (row) => (
      <span style={{ color: "#16A34A" }}>
        {formatAmount(row.credit_amount)}
      </span>
    ),
  },

  {
    header: "Closing Balance",
    accessor: "balance",
    sortable: false,
    render: (row) => (
      <span style={{ fontWeight: 600 }}>
        {formatAmount(row.balance)}
      </span>
    ),
  },

  {
    header: "Due Date",
    accessor: "due_date",
    sortable: false,
    render: (row) => formatDate(row.due_date),
  },
  {
  header: "Status",
  accessor: "vendor_status",
  sortable: false,
  render: (row) => {
    const status = row.vendor_status?.toLowerCase();

    return (
      <span
        style={{
          fontWeight: 600,
          color:
            status === "active"
              ? "#16A34A"
              : status === "inactive"
              ? "#DC2626"
              : "#F59E0B",
        }}
      >
        {row.vendor_status
          ? row.vendor_status.charAt(0).toUpperCase() +
            row.vendor_status.slice(1)
          : "-"}
      </span>
    );
  },
},
];