import React, {
    useEffect,
    useRef,
    useState,
} from "react";
import { CiSquareInfo } from "react-icons/ci";
import {
    FiMoreVertical,
    FiEdit2,
    FiTrash2,
} from "react-icons/fi";

import {
    ActionWrapper,
    ActionButton,
    FloatingAction,
} from "./InvoiceActions.styles";

const InvoiceActions = ({
    row,
    onEdit,
    onDelete,
}) => {
    const [open, setOpen] = useState(false);

    const wrapperRef = useRef(null);

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
            >
                <FiMoreVertical size={12} />
            </ActionButton>

            {/* VIEW */}

 

            {/* EDIT */}

            <FloatingAction
                type="button"
                $open={open}
                $position="edit"
                title="Edit Invoice"
                onClick={(e) => {
                    e.stopPropagation();

                    onEdit?.(row);

                    setOpen(false);
                }}
            >
                <FiEdit2 size={12} />
            </FloatingAction>

            {/* DELETE */}

            <FloatingAction
                type="button"
                $open={open}
                $position="delete"
                title="Delete Invoice"
                onClick={(e) => {
                    e.stopPropagation();

                    onDelete?.(row);

                    setOpen(false);
                }}
            >
                <FiTrash2 size={12} />
            </FloatingAction>
        </ActionWrapper>
    );
};

export default InvoiceActions;