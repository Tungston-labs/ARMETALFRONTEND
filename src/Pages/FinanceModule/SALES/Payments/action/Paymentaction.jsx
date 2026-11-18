import React, { useState } from "react";
import { FiEye, FiEdit2, FiDownload, FiLoader, FiX } from "react-icons/fi";
import { ActionWrapper, IconButton } from "./Paymentaction.style";

const Paymentactions = ({ row, onView, onEdit, onDelete, onDownload }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async (e) => {
        e.stopPropagation();
        if (isDownloading || !row?.id) return;
        setIsDownloading(true);
        try {
            await onDownload?.(row);
        } catch (err) {
            console.error("Failed to download payment:", err);
        } finally {
            setIsDownloading(false);
        }
    };

    const call = (fn) => (e) => {
        e.stopPropagation();
        fn?.(row);
    };

    return (
        <ActionWrapper>
            {onView && (
                <IconButton type="button" title="View Payment" onClick={call(onView)}>
                    <FiEye size={14} />
                </IconButton>
            )}
            {onEdit && (
                <IconButton type="button" title="Edit Payment" onClick={call(onEdit)}>
                    <FiEdit2 size={14} />
                </IconButton>
            )}
            {onDownload && (
                <IconButton
                    type="button"
                    title="Download Payment"
                    onClick={handleDownload}
                    disabled={isDownloading}
                >
                    {isDownloading ? <FiLoader size={14} className="spin" /> : <FiDownload size={14} />}
                </IconButton>
            )}
            {onDelete && (
                <IconButton type="button" $danger title="Delete Payment" onClick={call(onDelete)}>
                    <FiX size={14} />
                </IconButton>
            )}
        </ActionWrapper>
    );
};

export default Paymentactions;