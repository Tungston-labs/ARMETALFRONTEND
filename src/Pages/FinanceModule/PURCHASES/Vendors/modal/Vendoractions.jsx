import React, { useState } from "react";
import { FiEye, FiDownload, FiX, FiLoader } from "react-icons/fi";
import { LuEraser } from "react-icons/lu";
import { ActionWrapper, ActionButton } from "./Vendoractions.styles";

const VendorActions = ({
    row,
    onView,
    onDownload,
    onClear,
    onDelete,
    showClear = false,   // show eraser button
    showDelete = false,  // show red X button
}) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!onDelete || isDeleting) return;
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
        <ActionWrapper>
            <ActionButton
                type="button"
                title="View"
                onClick={(e) => {
                    e.stopPropagation();
                    onView?.(row);
                }}
            >
                <FiEye size={14} />
            </ActionButton>

            <ActionButton
                type="button"
                title="Download"
                onClick={(e) => {
                    e.stopPropagation();
                    onDownload?.(row);
                }}
            >
                <FiDownload size={14} />
            </ActionButton>

            {showClear && (
                <ActionButton
                    type="button"
                    title="Clear"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClear?.(row);
                    }}
                >
                    <LuEraser size={14} />
                </ActionButton>
            )}

            {showDelete && (
                <ActionButton
                    type="button"
                    $danger
                    title="Delete"
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
                </ActionButton>
            )}
        </ActionWrapper>
    );
};

export default VendorActions;