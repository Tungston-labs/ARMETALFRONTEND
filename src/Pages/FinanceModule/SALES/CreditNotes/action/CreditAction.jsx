import React from "react";
import { FiEye, FiDownload, FiEdit2, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ActionWrapper, ActionIconButton } from "./CreditAction.style";

const CreditAction = ({ row, onDelete }) => {
  const navigate = useNavigate();

  const getId = () => {
    return row?.id ?? row?.credit_note_id ?? row?.pk;
  };

  const handleView = (event) => {
    event.stopPropagation();
    const id = getId();
    if (!id) return;
    navigate(`/credit-notes/edit/${id}`, {
      state: {
        creditNoteData: row,
        isViewOnly: true,
      },
    });
  };

  const handleDownload = (event) => {
    event.stopPropagation();
    const id = getId();
    const cnNumber = row?.cn_number || row?.credit_note_number || `credit-note-${id}`;
    window.print();
  };

  const handleEdit = (event) => {
    event.stopPropagation();
    const id = getId();
    if (!id) return;
    navigate(`/credit-notes/edit/${id}`, {
      state: {
        creditNoteData: row,
      },
    });
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete?.(row);
  };

  const status = String(row?.status || "").toLowerCase();
  const isApplied = status === "closed" || status === "applied";

  return (
    <ActionWrapper onClick={(e) => e.stopPropagation()}>
      <ActionIconButton
        type="button"
        title="View Credit Note"
        onClick={handleView}
      >
        <FiEye />
      </ActionIconButton>

      <ActionIconButton
        type="button"
        title="Download / Print"
        onClick={handleDownload}
      >
        <FiDownload />
      </ActionIconButton>

      {!isApplied && (
        <>
          <ActionIconButton
            type="button"
            title="Edit Credit Note"
            onClick={handleEdit}
          >
            <FiEdit2 />
          </ActionIconButton>

          <ActionIconButton
            type="button"
            $variant="delete"
            title="Delete / Cancel"
            onClick={handleDelete}
          >
            <FiX />
          </ActionIconButton>
        </>
      )}
    </ActionWrapper>
  );
};

export default CreditAction;
