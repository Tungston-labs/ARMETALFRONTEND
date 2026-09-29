import React, { useEffect, useRef, useState } from "react";
import {
    FiMoreVertical,
    FiEdit2,
    FiTrash2,
    FiLoader,
} from "react-icons/fi";
import {
    ActionWrapper,
    ActionButton,
    FloatingAction,
} from "./Vendoractions.styles";

const VendorActions = ({ row, onEdit, onDelete }) => {
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const wrapperRef = useRef(null);

    // Close the menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Vendors are edited in the modal, so hand the row to the parent
    const handleEdit = () => {
        setOpen(false);
        if (onEdit) onEdit(row);
    };

    const handleDelete = async () => {
        if (!onDelete || isDeleting) return;

        setOpen(false);
        setIsDeleting(true);

        try {
            await onDelete(row);
        } catch (err) {
            console.error("Failed to delete vendor:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <ActionWrapper ref={wrapperRef}>
            {/* MORE BUTTON */}

            <ActionButton
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen((prev) => !prev);
                }}
                title="Actions"
                disabled={isDeleting}
            >
                {isDeleting ? (
                    <FiLoader size={12} className="spin" />
                ) : (
                    <FiMoreVertical size={12} />
                )}
            </ActionButton>

            {/* EDIT */}

            <FloatingAction
                type="button"
                $open={open}
                $position="edit"
                title="Edit Vendor"
                onClick={(e) => {
                    e.stopPropagation();
                    handleEdit();
                }}
            >
                <FiEdit2 size={12} />
            </FloatingAction>

            {/* DELETE */}

            <FloatingAction
                type="button"
                $open={open}
                $position="delete"
                title="Delete Vendor"
                onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                }}
            >
                <FiTrash2 size={12} />
            </FloatingAction>
        </ActionWrapper>
    );
};

export default VendorActions;