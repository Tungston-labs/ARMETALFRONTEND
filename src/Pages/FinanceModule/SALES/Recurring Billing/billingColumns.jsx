import { ToggleSwitch } from "./RecurringBilling.styles";
import RecurringBillingAction from "./action/RecurringBillingAction"; 

export const getBillingColumns = ({ onToggleAutoSend, onDelete } = {}) => [
  { header: "Plan No", accessor: "contract_number", render: (row) => row.contract_number || "-" },
  { header: "Customer", accessor: "customer_name", render: (row) => row.customer_name || "-" },
  { header: "Frequency", accessor: "frequency", render: (row) => row.frequency || "-" },
  { header: "Start Date", accessor: "start_date", render: (row) => row.start_date || "-" },
  { header: "Billing Cycle", accessor: "billing_cycle", render: (row) => row.billing_cycle || "-" },
  { header: "Invoice Date", accessor: "invoice_date", render: (row) => row.invoice_date || "-" },
  { header: "Next Invoice Date", accessor: "next_invoice_date", render: (row) => row.next_invoice_date || "-" },
  {
    header: "Amount",
    accessor: "monthly_amount",
    render: (row) =>
      Number(row.monthly_amount || 0).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
  },
  {
    header: "Auto-Send",
    accessor: "auto_send",
    render: (row) => (
      <ToggleSwitch
        type="button"
        role="switch"
        aria-checked={!!row.auto_send}
        $on={!!row.auto_send}
        onClick={() => onToggleAutoSend?.(row)}
      />
    ),
  },
  { header: "Status", accessor: "recurrence_status", render: (row) => row.recurrence_status || "-" },
  {
    header: "Action",
    accessor: "actions",
    render: (row) => <RecurringBillingAction row={row} onDelete={onDelete} />,
  },
];