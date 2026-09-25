import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import {
  ActionWrapper,
  ActionButton,
  FloatingAction,
} from "./InventoryAction.styles";

const InverntoryActions = ({
  row,
  onEdit,
  onDelete,
}) => {
  const [open, setOpen] =
    useState(false);

  const wrapperRef =
    useRef(null);

  useEffect(() => {
    const handleClickOutside = (
      event,
    ) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(
          event.target,
        )
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  const handleEdit = (event) => {
    event.stopPropagation();

    if (onEdit) {
      onEdit(row);
    }

    setOpen(false);
  };

  const handleDelete = (event) => {
    event.stopPropagation();

    if (onDelete) {
      onDelete(row);
    }

    setOpen(false);
  };

  return (
    <ActionWrapper
      ref={wrapperRef}
    >
      <ActionButton
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((previous) => !previous);
        }}
      >
        <FiMoreVertical size={12} />
      </ActionButton>

      <FloatingAction
        type="button"
        $open={open}
        $position="edit"
        title="Edit"
        onClick={handleEdit}
      >
        <FiEdit2 size={12} />
      </FloatingAction>

      <FloatingAction
        type="button"
        $open={open}
        $position="delete"
        title="Delete"
        onClick={handleDelete}
      >
        <FiTrash2 size={12} />
      </FloatingAction>
    </ActionWrapper>
  );
};

export default InverntoryActions;