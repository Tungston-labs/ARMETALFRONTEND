import React, { useEffect, useRef, useState } from "react";

import { FiMoreVertical, FiEdit2, FiTrash2 } from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import {
  ActionWrapper,
  ActionButton,
  FloatingAction,
} from "./CreditAction.style";

const CreditAction = ({ row, onDelete }) => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getId = () => {
    return row?.id ?? row?.credit_note_id ?? row?.pk;
  };

  const handleEdit = () => {
    const id = getId();

    if (!id) {
      return;
    }

    navigate(`/credit-notes/edit/${id}`, {
      state: {
        creditNoteData: row,
      },
    });

    setOpen(false);
  };

  const handleDelete = () => {
    onDelete?.(row);

    setOpen(false);
  };

  return (
    <ActionWrapper ref={wrapperRef}>
      <ActionButton
        type="button"
        onClick={(event) => {
          event.stopPropagation();

          setOpen((previous) => !previous);
        }}
        title="Actions"
      >
        <FiMoreVertical size={12} />
      </ActionButton>

      <FloatingAction
        type="button"
        $open={open}
        $position="edit"
        title="Edit Credit Note"
        onClick={(event) => {
          event.stopPropagation();

          handleEdit();
        }}
      >
        <FiEdit2 size={12} />
      </FloatingAction>

      <FloatingAction
        type="button"
        $open={open}
        $position="delete"
        title="Delete Credit Note"
        onClick={(event) => {
          event.stopPropagation();

          handleDelete();
        }}
      >
        <FiTrash2 size={12} />
      </FloatingAction>
    </ActionWrapper>
  );
};

export default CreditAction;
