
import React from "react";
import { FiEye, FiDownload, FiX } from "react-icons/fi";
import {
    ActionWrapper,
    ActionButton,
} from "./OrderAction.styles";

const OrderActions = ({
    row,
    onView,
    onDownload,
    onDelete,
    showDelete = false,
}) => {
    return (
        <ActionWrapper>
            {/* VIEW */}
            <ActionButton
                type="button"
                title="View"
                onClick={(e) => {
                    e.stopPropagation();
                    onView?.(row);
                }}
            >
                <FiEye size={13} />
            </ActionButton>

            {/* DOWNLOAD */}
            <ActionButton
                type="button"
                title="Download"
                onClick={(e) => {
                    e.stopPropagation();
                    onDownload?.(row);
                }}
            >
                <FiDownload size={13} />
            </ActionButton>

            {/* DELETE */}
            {showDelete && (
                <ActionButton
                    type="button"
                    $danger
                    title="Delete"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(row);
                    }}
                >
                    <FiX size={15} />
                </ActionButton>
            )}
        </ActionWrapper>
    );
};

export default OrderActions;
