import React, { useEffect, useRef, useState } from "react";
import { FiMoreVertical, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
    ActionWrapper,
    ActionButton,
    FloatingAction,
} from "./Paymentaction.style";

const OrderActions = ({ row, onDelete }) => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleEdit = (order) => {
        navigate(`/sales/orders/edit/${order.id}`, {
            state: { orderData: order },
        });
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
            >
                <FiMoreVertical size={12} />
            </ActionButton>

            <FloatingAction
                type="button"
                $open={open}
                $position="edit"
                title="Edit Order"
                onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(row);
                    setOpen(false);
                }}
            >
                <FiEdit2 size={12} />
            </FloatingAction>

            <FloatingAction
                type="button"
                $open={open}
                $position="delete"
                title="Delete Order"
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

export default OrderActions;