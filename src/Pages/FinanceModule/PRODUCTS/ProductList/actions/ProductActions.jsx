import React, { useState, useRef, useEffect } from "react";
import { FiMoreVertical, FiEdit2, FiTrash2 } from "react-icons/fi";

import {
    ActionWrapper,
    ActionButton,
    FloatingAction,
} from "./ProductActions.styles";

const ProductActions = ({ row, onEdit, onDelete }) => {
    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    return (
        <ActionWrapper ref={wrapperRef}>
            <ActionButton
                type="button"
                onClick={() => setOpen((prev) => !prev)}
            >
                <FiMoreVertical size={12} />
            </ActionButton>

            <FloatingAction
                type="button"
                $open={open}
                $position="edit"
                title="Edit"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(row);
                    setOpen(false);
                }}
            >
                <FiEdit2 size={12} />
            </FloatingAction>

            <FloatingAction
                type="button"
                $open={open}
                $position="delete"
                title="Delete"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(row);
                    setOpen(false);
                }}
            >
                <FiTrash2 size={12} />
            </FloatingAction>
        </ActionWrapper>
    );
};

export default ProductActions;