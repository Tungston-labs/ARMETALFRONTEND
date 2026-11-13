import React from "react";
import { FiDownload, FiEdit2, FiEye, FiTrash2 } from "react-icons/fi";
import {
  ActionGroup,
  ConvertSOButton,
  InlineStatusSelect,
  SmallIconButton,
  StatusText,
} from "./QuotationsList.styles";

const formatDisplayDate = (dateStr) => {
  if (!dateStr || dateStr === "-") return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export const quotationColumns = ({
  onConvertSO,
  onView,
  onDownload,
  onEdit,
  onDelete,
  onStatusChange,
  formatCurrency,
  currency = "SAR",
}) => [
  {
    header: "Quote No.",
    accessor: "quoteNumber",
    render: (row) => (
      <span style={{ fontWeight: 500, color: "#1e293b" }}>
        {row.quoteNumber || "—"}
      </span>
    ),
  },
  {
    header: "Customer",
    accessor: "customerName",
    render: (row) => row.customerName || "—",
  },
  {
    header: "Issue Date",
    accessor: "issueDate",
    render: (row) => formatDisplayDate(row.issueDate),
  },
  {
    header: "Valid Till",
    accessor: "validTill",
    render: (row) => formatDisplayDate(row.validTill),
  },
  {
    header: "Old Quote Amt",
    accessor: "oldQuoteAmount",
    render: (row) =>
      row.oldQuoteAmount !== null &&
      row.oldQuoteAmount !== undefined &&
      Number(row.oldQuoteAmount) > 0
        ? formatCurrency(row.oldQuoteAmount, row.currency || currency)
        : "------",
  },
  {
    header: "Negotiation Amount",
    accessor: "negotiationAmount",
    render: (row) =>
      row.negotiationAmount !== null &&
      row.negotiationAmount !== undefined &&
      Number(row.negotiationAmount) > 0
        ? formatCurrency(row.negotiationAmount, row.currency || currency)
        : "------",
  },
  {
    header: "Quote Value",
    accessor: "quoteAmount",
    render: (row) => formatCurrency(row.quoteAmount, row.currency || currency),
  },
  {
    header: "Status",
    accessor: "status",
    render: (row) => {
      const normalized = String(row.status || "pending").toLowerCase();
      if (normalized === "converted") {
        return <StatusText $status={normalized}>Converted</StatusText>;
      }
      return (
        <InlineStatusSelect
          $status={normalized}
          value={normalized}
          aria-label={`Change status for ${row.quoteNumber}`}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onStatusChange?.(row, e.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </InlineStatusSelect>
      );
    },
  },
  {
    header: "Action",
    accessor: "action",
    sortable: false,
    render: (row) => {
      const normalized = String(row.status || "").toLowerCase();
      const canConvert = normalized === "approved";
      const canEdit =
        normalized === "draft" ||
        normalized === "pending" ||
        normalized === "rejected" ||
        normalized === "sent";
      const canDelete =
        normalized === "draft" ||
        normalized === "pending" ||
        normalized === "rejected";

      return (
        <ActionGroup onClick={(e) => e.stopPropagation()}>
          {canConvert && (
            <ConvertSOButton type="button" onClick={() => onConvertSO?.(row)}>
              Convert SO
            </ConvertSOButton>
          )}

          <SmallIconButton
            type="button"
            title="View quotation"
            onClick={() => onView?.(row)}
          >
            <FiEye size={13} />
          </SmallIconButton>

          <SmallIconButton
            type="button"
            title="Download quotation"
            onClick={() => onDownload?.(row)}
          >
            <FiDownload size={13} />
          </SmallIconButton>

          {canEdit && (
            <SmallIconButton
              type="button"
              title="Edit quotation"
              onClick={() => onEdit?.(row)}
            >
              <FiEdit2 size={13} />
            </SmallIconButton>
          )}

          {canDelete && (
            <SmallIconButton
              type="button"
              title="Delete quotation"
              $danger
              onClick={() => onDelete?.(row)}
            >
              <FiTrash2 size={13} />
            </SmallIconButton>
          )}
        </ActionGroup>
      );
    },
  },
];
