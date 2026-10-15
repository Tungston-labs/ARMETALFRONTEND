import React, { useEffect, useRef, useState } from "react";

import { FiMoreVertical, FiEdit2, FiTrash2 } from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import {
  ActionWrapper,
  ActionButton,
  FloatingAction,
} from "./BillAction.styles";

const BillAction = ({ row, onDelete }) => {
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

  const handleEdit = () => {
    if (!row?.id) {
      return;
    }

    navigate(`/purchases/bill/edit/${row.id}`);

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
        title="Actions"
        onClick={(event) => {
          event.stopPropagation();

          setOpen((previous) => !previous);
        }}
      >
        <FiMoreVertical size={13} />
      </ActionButton>

      <FloatingAction
        type="button"
        $open={open}
        $position="edit"
        title="Edit Bill"
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
        title="Delete Bill"
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

export default BillAction;
