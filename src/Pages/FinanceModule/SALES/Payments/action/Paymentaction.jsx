import React, { useState } from "react";
import { FiDownload, FiEdit2, FiLoader, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ActionWrapper, IconButton } from "./Paymentaction.style";

const Paymentactions = ({ row, onDelete, onDownload }) => {
    const navigate = useNavigate();
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

    const handleEdit = (e) => {
        e.stopPropagation();
        navigate(`/sales/orders/edit/${row.id}`, {
            state: { orderData: row },
        });
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete?.(row);
    };

    return (
        <ActionWrapper>
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

            <IconButton
                type="button"
                title="Edit Order"
                onClick={handleEdit}
            >
                <FiEdit2 size={14} />
            </IconButton>

            <IconButton
                type="button"
                $danger
                title="Delete Order"
                onClick={handleDelete}
            >
                <FiX size={14} />
            </IconButton>
        </ActionWrapper>
    );
};

export default Paymentactions;