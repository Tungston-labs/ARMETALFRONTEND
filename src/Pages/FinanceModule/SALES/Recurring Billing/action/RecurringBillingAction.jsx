import React, { useState } from "react";
import {
    FiEye,
    FiEdit2,
    FiTrash2,
    FiDownload,
    FiLoader,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ActionWrapper, ActionButton } from "./RecurringBillingAction.styles";

const RecurringBillingAction = ({ row, onView, onDelete, onDownload }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const navigate = useNavigate();

    const isBusy = isDeleting || isDownloading;

    const handleView = (e) => {
        e.stopPropagation();
        if (onView) {
            onView(row);
            return;
        }
        // Default: go to the invoice view page
        navigate(`/sales/invoices/view/${row.id}`, {
            state: { invoiceData: row },
        });
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        navigate(`/sales/invoices/edit/${row.id}`, {
            state: { invoiceData: row },
        });
    };

    const handleDownload = async (e) => {
        e.stopPropagation();
        if (!onDownload || isBusy) return;

        setIsDownloading(true);
        try {
            await onDownload(row);
        } catch (err) {
            console.error("Failed to download invoice:", err);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!onDelete || isBusy) return;

        setIsDeleting(true);
        try {
            await onDelete(row);
        } catch (err) {
            console.error("Failed to delete invoice:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <ActionWrapper>
            {/* VIEW */}
            <ActionButton
                type="button"
                title="View Invoice"
                onClick={handleView}
                disabled={isBusy}
            >
                <FiEye size={13} />
            </ActionButton>

            {/* EDIT */}
            <ActionButton
                type="button"
                title="Edit Invoice"
                onClick={handleEdit}
                disabled={isBusy}
            >
                <FiEdit2 size={13} />
            </ActionButton>

            {/* DOWNLOAD */}
            {onDownload && (
                <ActionButton
                    type="button"
                    title="Download Invoice"
                    onClick={handleDownload}
                    disabled={isBusy}
                >
                    {isDownloading ? (
                        <FiLoader size={13} className="spin" />
                    ) : (
                        <FiDownload size={13} />
                    )}
                </ActionButton>
            )}

            {/* DELETE */}
            {onDelete && (
                <ActionButton
                    type="button"
                    $danger
                    title="Delete Invoice"
                    onClick={handleDelete}
                    disabled={isBusy}
                >
                    {isDeleting ? (
                        <FiLoader size={13} className="spin" />
                    ) : (
                        <FiTrash2 size={13} />
                    )}
                </ActionButton>
            )}
        </ActionWrapper>
    );
};

export default RecurringBillingAction;