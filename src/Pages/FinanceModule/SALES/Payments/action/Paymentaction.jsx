import React, { useState } from "react";
import { FiDownload, FiEdit2, FiEye, FiLoader, FiX } from "react-icons/fi";
import { ActionWrapper, IconButton } from "./Paymentaction.style";
import { getPaymentStatus } from "../PaymentColoumn";

const Paymentactions = ({ row, onInfo, onEdit, onDelete, onDownload }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleView = (e) => {
        e.stopPropagation();
        onInfo?.(row);
    };

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

    const handleEdit = (e) => {
        e.stopPropagation();
        onEdit?.(row);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete?.(row);
    };

    const status = getPaymentStatus(row);
    const isPartiallyPaid = status === "Partially Paid";

    return (
        <ActionWrapper>
            <IconButton
                type="button"
                title="View Payment"
                onClick={handleView}
            >
                <FiEye size={14} />
            </IconButton>

            <IconButton
                type="button"
                title="Download Payment"
                onClick={handleDownload}
                disabled={isDownloading}
            >
                {isDownloading ? (
                    <FiLoader size={14} className="spin" />
                ) : (
                    <FiDownload size={14} />
                )}
            </IconButton>

            {isPartiallyPaid && (
                <>
                    <IconButton
                        type="button"
                        title="Edit Payment"
                        onClick={handleEdit}
                    >
                        <FiEdit2 size={14} />
                    </IconButton>

                    <IconButton
                        type="button"
                        $danger
                        title="Delete Payment"
                        onClick={handleDelete}
                    >
                        <FiX size={14} />
                    </IconButton>
                </>
            )}
        </ActionWrapper>
    );
};

export default Paymentactions;
