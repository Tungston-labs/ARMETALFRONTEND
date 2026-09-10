import React from "react";
import { ClipLoader } from "react-spinners";

import {
    Overlay,
    ModalBox,
    Title,
    Message,
    ButtonRow,
    CancelButton,
    ConfirmButton,
} from "./DeleteConfirmModal.styles";

const DeleteConfirmModal = ({
    isOpen,
    title = "Delete Item",
    message = "Are you sure you want to delete this item?",
    loading = false,
    onCancel,
    onConfirm,
}) => {
    if (!isOpen) return null;

    return (
        <Overlay onClick={onCancel}>
            <ModalBox onClick={(e) => e.stopPropagation()}>
                <Title>{title}</Title>
                <Message>{message}</Message>

                <ButtonRow>
                    <CancelButton
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancel
                    </CancelButton>

                    <ConfirmButton
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? (
                            <ClipLoader size={16} color="#fff" />
                        ) : (
                            "Delete"
                        )}
                    </ConfirmButton>
                </ButtonRow>
            </ModalBox>
        </Overlay>
    );
};

export default DeleteConfirmModal;