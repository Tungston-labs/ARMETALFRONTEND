import React, {
    useEffect,
    useRef,
    useState,
} from "react";
import {
    FiMoreVertical,
    FiEdit2,
    FiTrash2,
    FiDownload,
    FiLoader,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
    ActionWrapper,
    ActionButton,
    FloatingAction,
} from "./RecurringBillingAction.styles";

const RecurringBillingAction = ({
    row,
    onDelete,
    onDownload,
}) => {
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const navigate = useNavigate();
    const wrapperRef = useRef(null);

    const isBusy = isDeleting || isDownloading;

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

    const handleEdit = (invoice) => {
        navigate(`/sales/invoices/edit/${invoice.id}`, {
            state: { invoiceData: invoice },
        });
    };

    const handleDelete = async () => {
        if (!onDelete || isBusy) return;

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

    const handleDownload = async () => {
        if (!onDownload || isBusy) return;

        setOpen(false);
        setIsDownloading(true);

        try {
            await onDownload(row);
        } catch (err) {
            console.error("Failed to download invoice:", err);
        } finally {
            setIsDownloading(false);
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
                disabled={isBusy}
            >
                {isBusy ? (
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
                title="Edit Invoice"
                onClick={(e) => {
                    e.stopPropagation();

                    handleEdit(row);

                    setOpen(false);
                }}
            >
                <FiEdit2 size={12} />
            </FloatingAction>

            {/* DOWNLOAD */}

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

            {/* DELETE */}

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
        </ActionWrapper>
    );
};

export default RecurringBillingAction;