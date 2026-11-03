import { formatDate } from "../../../../../utils/Formatdate";

export const vendorLedgerColumns = [
  {
    accessor: "date",
    header: "Date",
    render: (row) => formatDate(row.date),
},
    { header: "Reference No.", accessor: "reference" },
    { header: "Description", accessor: "description" },
    { header: "Type", accessor: "type" },
    { header: "Debit", accessor: "debit" },
    { header: "Credit", accessor: "credit" },
    { header: "Running Balance", accessor: "balance" },
];