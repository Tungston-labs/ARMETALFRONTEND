import React, { useState } from "react";
import { FiDownload, FiEdit2, FiEye, FiLoader, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const DebitNoteActions = ({ row, onDelete, onDownload }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/purchases/debit-notes/${row.id}`);
  };

  const handleEdit = () => {
    navigate(`/purchases/debit-notes/edit/${row.id}`);
  };

  const handleDelete = async () => {
    if (!onDelete || isDeleting) {
      return;
    }

    const confirmed = window.confirm(
      `Delete debit note "${row.debit_note_number || row.debitNoteNo}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDelete(row);
    } catch (error) {
      console.error("Failed to delete debit note:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload(row);
    }
  };

  const buttonStyle = {
    width: "24px",
    height: "24px",
    minWidth: "24px",
    border: "1px solid #E5E7EB",
    background: "#FFFFFF",
    borderRadius: "4px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0,
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "5px",
      }}
    >
      <button
        type="button"
        onClick={handleView}
        title="View Debit Note"
        style={buttonStyle}
      >
        <FiEye size={12} />
      </button>

      <button
        type="button"
        onClick={handleDownload}
        title="Download Debit Note"
        style={buttonStyle}
      >
        <FiDownload size={12} />
      </button>

      {String(row.status || "").toLowerCase() !== "issued" && (
        <button
          type="button"
          onClick={handleEdit}
          title="Edit Debit Note"
          style={buttonStyle}
        >
          <FiEdit2 size={12} />
        </button>
      )}

      {String(row.status || "").toLowerCase() !== "issued" && (
        <button
          type="button"
          onClick={handleDelete}
          title="Delete Debit Note"
          disabled={isDeleting}
          style={{
            ...buttonStyle,
            color: "#EF4444",
          }}
        >
          {isDeleting ? (
            <FiLoader size={12} className="spin" />
          ) : (
            <FiTrash2 size={12} />
          )}
        </button>
      )}
    </div>
  );
};

export default DebitNoteActions;
