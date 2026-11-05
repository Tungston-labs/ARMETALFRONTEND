import React from "react";

import { FiCheck, FiAlertTriangle, FiX } from "react-icons/fi";

import {
    NotificationCard,
    IconBox,
    Content,
    Title,
    Message,
    CloseButton,
} from "./Topnotification.styles";

const DEFAULT_TITLES = {
    success: "Success!",
    error: "Something went wrong",
};

/**
 * Props
 * - notification: { type: "success" | "error", message: string, title?: string } | null
 * - onClose: () => void
 */
const TopNotification = ({ notification, onClose }) => {
    if (!notification) return null;

    const isError = notification.type === "error";
    const title = notification.title || DEFAULT_TITLES[notification.type];

    return (
        <NotificationCard role={isError ? "alert" : "status"}>
            <IconBox $type={notification.type}>
                {isError ? <FiAlertTriangle size={16} /> : <FiCheck size={18} />}
            </IconBox>

            <Content>
                <Title>{title}</Title>
                <Message>{notification.message}</Message>
            </Content>

            <CloseButton
                type="button"
                onClick={onClose}
                aria-label="Dismiss notification"
            >
                <FiX size={13} />
            </CloseButton>
        </NotificationCard>
    );
};

export default TopNotification;