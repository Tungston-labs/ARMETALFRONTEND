import React, { useState } from "react";
import { FiDownload, FiEdit2, FiX, FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ActionWrapper, IconButton } from "./Purchaseorderactions.styles";

// Statuses where the order can no longer be edited or removed
const LOCKED_STATUSES = ["received"];

const PurchaseOrderActions = ({ row, onDelete, onDownload }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const status = String(row?.status || "").toLowerCase();
  const canModify = !LOCKED_STATUSES.includes(status);

  // Row is passed in router state so the edit page can prefill instantly
  const handleEdit = () => {
    navigate(`/purchases/purchase-orders/edit/${row.id}`, {
      state: { purchaseOrderData: row },
    });
  };

  const handleDelete = async () => {
    if (!onDelete || isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(row);
    } catch (err) {
      console.error("Failed to delete purchase order:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ActionWrapper>
      {/* DOWNLOAD (always visible) */}
      <IconButton
        type="button"
        title="Download Purchase Order"
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
            title="Edit Purchase Order"
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
            title="Delete Purchase Order"
            disabled={isDeleting}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            {isDeleting ? (
              <FiLoader size={14} className="spin" />
            ) : (
              <FiX size={14} />
            )}
          </IconButton>
        </>
      )}
    </ActionWrapper>
  );
};

export default PurchaseOrderActions;