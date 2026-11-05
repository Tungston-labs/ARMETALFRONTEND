import React, {
    useEffect,
    useRef,
    useState,
} from "react";
import {
    FiMoreVertical,
    FiEye,
    FiEdit2,
    FiTrash2,
    FiLoader,
    FiDownload,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { downloadInvoice } from "../../../../../Redux/finance/Sales/InvoiceSlice";
import {
    ActionWrapper,
    ActionButton,
    FloatingAction,
} from "./InvoiceActions.styles";

/*
 * Which actions each payment status can use.
 * Keys come from getInvoiceStatusMeta(row).key in SalesInvoices.columns.jsx
 */
const ACTIONS_BY_STATUS = {
    paid: ["view", "download"],
    pending: ["view", "download", "edit", "delete"],
    unpaid: ["view", "download", "edit", "delete"],
    partially_paid: ["view", "download", "edit"],
    overdue: ["view", "download", "edit", "delete"],
};

const DEFAULT_ACTIONS = ["view", "download", "edit", "delete"];

// Change this if your view page uses a different route
const getViewPath = (id) => `/sales/invoices/view/${id}`;

const InvoiceActions = ({
    row,
    statusKey,
    onDelete,
}) => {
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
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
                !wrapperRef.current.contains(
                    e.target
                )
            ) {
                setOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, []);

    const handleView = (invoice) => {
        navigate(getViewPath(invoice.id), {
            state: { invoiceData: invoice },
        });
    };

    const handleEdit = (invoice) => {
        navigate(`/sales/invoices/edit/${invoice.id}`, {
            state: { invoiceData: invoice },
        });
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

    const handleDelete = async () => {
        if (!onDelete || isDeleting) return;

        setOpen(false);
        setIsDeleting(true);

        try {
            await onDelete(row);
        } catch (err) {

            console.error("Failed to delete invoice:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    const isBusy = isDeleting || isDownloading;

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
                disabled={isBusy}
            >
                {isBusy ? (
                    <FiLoader size={12} className="spin" />
                ) : (
                    <FiMoreVertical size={12} />
                )}
            </ActionButton>

            {/* VIEW */}

            {can("view") && (
                <FloatingAction
                    type="button"
                    $open={open}
                    $position="view"
                    title="View Invoice"
                    onClick={(e) => {
                        e.stopPropagation();

                        handleView(row);

                        setOpen(false);
                    }}
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
                    onClick={(e) => {
                        e.stopPropagation();

                        handleDownload();
                    }}
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
                    onClick={(e) => {
                        e.stopPropagation();

                        handleEdit(row);

                        setOpen(false);
                    }}
                >
                    <FiEdit2 size={12} />
                </FloatingAction>
            )}

            {/* DELETE */}

            {can("delete") && (
                <FloatingAction
                    type="button"
                    $open={open}
                    $position="delete"
                    title="Delete Invoice"
                    onClick={(e) => {
                        e.stopPropagation();

                        handleDelete();
                    }}
                >
                    <FiTrash2 size={12} />
                </FloatingAction>
            )}
        </ActionWrapper>
    );
};

export default InvoiceActions;