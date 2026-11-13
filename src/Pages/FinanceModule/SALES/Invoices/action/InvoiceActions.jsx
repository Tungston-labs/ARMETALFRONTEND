import React, { useEffect, useRef, useState } from "react";
import {
    FiEye,
    FiEdit2,
    FiLoader,
    FiDownload,
    FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { downloadInvoice } from "../../../../../Redux/finance/Sales/InvoiceSlice";

import {
    ActionWrapper,
    ActionButton,
    FloatingAction,
} from "./InvoiceActions.styles";

import { PiDotsThreeCircleVertical } from "react-icons/pi";

const ACTIONS_BY_STATUS = {
    paid: ["view", "download"],
    pending: ["view", "download", "edit"],
    unpaid: ["view", "download", "edit"],
    partially_paid: ["view", "download", "edit"],
    overdue: ["view", "download", "edit"],
};

const DEFAULT_ACTIONS = ["view", "download", "edit"];

const getViewPath = (id) => `/sales/invoices/view/${id}`;

const InvoiceActions = ({ row, statusKey }) => {
    const [open, setOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const wrapperRef = useRef(null);

    const allowed = ACTIONS_BY_STATUS[statusKey] || DEFAULT_ACTIONS;
    const can = (action) => allowed.includes(action);

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
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleView = () => {
        navigate(getViewPath(row.id), {
            state: { invoiceData: row },
        });
        setOpen(false);
    };

    const handleEdit = () => {
        navigate(`/sales/invoices/edit/${row.id}`, {
            state: { invoiceData: row },
        });
        setOpen(false);
    };

    const handleDownload = async () => {
        if (isDownloading || !row?.id) return;

        setOpen(false);
        setIsDownloading(true);

        try {
            await dispatch(downloadInvoice(row.id)).unwrap();
        } catch (err) {
            console.error("Failed to download invoice:", err);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <ActionWrapper ref={wrapperRef}>
            <ActionButton
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen((prev) => !prev);
                }}
                title="Actions"
                disabled={isDownloading}
            >
                {isDownloading ? (
                    <FiLoader size={12} className="spin" />
                ) : (
                    <PiDotsThreeCircleVertical size={14} />
                )}
            </ActionButton>

            {/* VIEW */}
            {can("view") && (
                <FloatingAction
                    type="button"
                    $open={open}
                    $position="view"
                    title="View Invoice"
                    onClick={handleView}
                >
                    <FiEye size={12} />
                </FloatingAction>
            )}

            {/* DOWNLOAD */}
            {can("download") && (
                <FloatingAction
                    type="button"
                    $open={open}
                    $position="download"
                    title="Download Invoice"
                    onClick={handleDownload}
                >
                    <FiDownload size={12} />
                </FloatingAction>
            )}

            {/* EDIT */}
            {can("edit") && (
                <FloatingAction
                    type="button"
                    $open={open}
                    $position="edit"
                    title="Edit Invoice"
                    onClick={handleEdit}
                >
                    <FiEdit2 size={12} />
                </FloatingAction>
            )}

            {/* CLOSE */}
            <FloatingAction
                type="button"
                $open={open}
                $position="close"
                title="Close Actions"
                onClick={handleClose}
            >
                <FiX size={12} />
            </FloatingAction>
        </ActionWrapper>
    );
};

export default InvoiceActions;