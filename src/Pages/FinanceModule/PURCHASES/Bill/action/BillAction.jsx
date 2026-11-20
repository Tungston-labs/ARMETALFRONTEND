import React from "react";
import { FiEye, FiDownload, FiEdit2, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ActionWrapper, IconButton } from "./BillAction.styles";

// Statuses where the bill can no longer be edited or removed
const LOCKED_STATUSES = ["paid"];

const BillAction = ({ row, onView, onDownload, onDelete }) => {
  const navigate = useNavigate();

  const status = String(row?.status || "").toLowerCase();
  const canModify = !LOCKED_STATUSES.includes(status);

  // Row is passed in router state so the edit page can prefill instantly
  const handleEdit = () => {
    if (!row?.id) return;
    navigate(`/purchases/bill/edit/${row.id}`, {
      state: { billData: row },
    });
  };

  return (
    <ActionWrapper>
      {/* VIEW */}
      <IconButton
        type="button"
        title="View Bill"
        onClick={(e) => {
          e.stopPropagation();
          onView?.(row);
        }}
      >
        <FiEye size={14} />
      </IconButton>

      {/* DOWNLOAD */}
      <IconButton
        type="button"
        title="Download Bill"
        onClick={(e) => {
          e.stopPropagation();
          onDownload?.(row);
        }}
      >
        <FiDownload size={14} />
      </IconButton>

      {canModify && (
        <>
          {/* EDIT */}
          <IconButton
            type="button"
            title="Edit Bill"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
          >
            <FiEdit2 size={14} />
          </IconButton>

          {/* DELETE */}
          <IconButton
            type="button"
            $variant="danger"
            title="Delete Bill"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(row);
            }}
          >
            <FiX size={14} />
          </IconButton>
        </>
      )}
    </ActionWrapper>
  );
};

export default BillAction;