export const ledgerColumns = [
  { header: "Date", accessor: "transaction_date", render: (row) => row.transaction_date },
  { header: "Document NO", accessor: "reference_number", render: (row) => row.reference_number || "-" },
  { header: "Description", accessor: "description", render: (row) => row.description || "-" },
  { header: "Type", accessor: "transaction_type_display", render: (row) => row.transaction_type_display || "-" },
  { header: "Debit", accessor: "debit", render: (row) => Number(row.debit || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
  { header: "Credit", accessor: "credit", render: (row) => Number(row.credit || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
  { header: "Balance", accessor: "balance", render: (row) => Number(row.balance || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
];