import React, { useState } from "react";
import { FiEye, FiEdit2, FiDownload, FiX, FiLoader } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { downloadInvoice } from "../../../../../Redux/finance/Sales/InvoiceSlice";

import { ActionWrapper, ActionButton } from "./InvoiceActions.styles";

// Which actions each payment status allows.
// Delete is only offered when nothing has been paid yet.
const ACTIONS_BY_STATUS = {
    paid: ["view", "download"],
    partially_paid: ["view", "edit", "download"],
    pending: ["view", "edit", "download", "delete"],
    unpaid: ["view", "edit", "download", "delete"],
    overdue: ["view", "edit", "download", "delete"],
};

const DEFAULT_ACTIONS = ["view", "edit", "download"];

const InvoiceActions = ({ row, statusKey, onDelete }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const allowed = ACTIONS_BY_STATUS[statusKey] || DEFAULT_ACTIONS;
    // Delete also requires a handler to be passed in
    const can = (action) =>
        allowed.includes(action) && (action !== "delete" || !!onDelete);

    const handleView = (e) => {
        e.stopPropagation();
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
        if (isDownloading || !row?.id) return;

        setIsDownloading(true);
        try {
            await dispatch(downloadInvoice(row.id)).unwrap();
        } catch (err) {
            console.error("Failed to download invoice:", err);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        onDelete?.(row);
    };

    return (
        <ActionWrapper>
            {can("view") && (
                <ActionButton type="button" title="View Invoice" onClick={handleView}>
                    <FiEye size={13} />
                </ActionButton>
            )}

            {can("edit") && (
                <ActionButton type="button" title="Edit Invoice" onClick={handleEdit}>
                    <FiEdit2 size={13} />
                </ActionButton>
            )}

            {can("download") && (
                <ActionButton
                    type="button"
                    title="Download Invoice"
                    onClick={handleDownload}
                    disabled={isDownloading}
                >
                    {isDownloading ? (
                        <FiLoader size={13} className="spin" />
                    ) : (
                        <FiDownload size={13} />
                    )}
                </ActionButton>
            )}

            {can("delete") && (
                <ActionButton
                    type="button"
                    $danger
                    title="Delete Invoice"
                    onClick={handleDelete}
                >
                    <FiX size={15} />
                </ActionButton>
            )}
        </ActionWrapper>
    );
};

export default InvoiceActions;