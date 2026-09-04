import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  ModalOverlay,
  ModalContainer,
  ModalTitle,
  Message,
  ButtonRow,
  ModalButton,
} from "./ReusableConfirmModal.Styles";

const ReusableConfirmModal = ({
  show = false,
  title = "Confirmation",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "success",
  cancelVariant = "cancel",
  loadingText = "Processing...",
  onConfirm,
  onClose,
  zIndex = 2000,
}) => {
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);

      if (onConfirm) {
        await onConfirm();
      }
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <ModalOverlay style={{ zIndex }}>
      <ModalContainer>
        <ModalTitle>{title}</ModalTitle>

        <Message>{message}</Message>

        <ButtonRow>
          <ModalButton
            type="button"
            variant={cancelVariant}
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </ModalButton>

          <ModalButton
            type="button"
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? loadingText : confirmText}
          </ModalButton>
        </ButtonRow>
      </ModalContainer>
    </ModalOverlay>,
    document.body
  );
};

export default ReusableConfirmModal;