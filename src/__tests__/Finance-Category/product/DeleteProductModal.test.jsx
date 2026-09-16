import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

import DeleteConfirmModal from "../../../Pages/FinanceModule/PRODUCTS/ProductList/modal/DeleteConfirmModal";

// ---- react-spinners ----
// Swap ClipLoader for a plain marker so tests can assert on its presence
// without depending on SVG internals.
vi.mock("react-spinners", () => ({
    ClipLoader: (props) => <div data-testid="spinner" {...props} />,
}));

// ---- styled-components stand-ins ----
vi.mock(
    "../../Pages/FinanceModule/PRODUCTS/ProductList/modal/DeleteConfirmModal.styles",
    () => ({
        Overlay: ({ children, onClick }) => (
            <div data-testid="overlay" onClick={onClick}>
                {children}
            </div>
        ),
        ModalBox: ({ children, onClick }) => (
            <div data-testid="modal-box" onClick={onClick}>
                {children}
            </div>
        ),
        Title: ({ children }) => <h2>{children}</h2>,
        Message: ({ children }) => <p>{children}</p>,
        ButtonRow: ({ children }) => <div>{children}</div>,
        CancelButton: ({ children, ...rest }) => (
            <button data-testid="cancel-btn" {...rest}>
                {children}
            </button>
        ),
        ConfirmButton: ({ children, ...rest }) => (
            <button data-testid="confirm-btn" {...rest}>
                {children}
            </button>
        ),
    })
);

const baseProps = {
    isOpen: true,
    title: "Delete Product",
    message: 'Are you sure you want to delete "Cisco Router C9300"? This action cannot be undone.',
    loading: false,
    onCancel: vi.fn(),
    onConfirm: vi.fn(),
};

describe("DeleteConfirmModal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders nothing when isOpen is false", () => {
        render(<DeleteConfirmModal {...baseProps} isOpen={false} />);
        expect(screen.queryByTestId("overlay")).not.toBeInTheDocument();
    });

    it("renders the given title and message", () => {
        render(<DeleteConfirmModal {...baseProps} />);

        expect(screen.getByText("Delete Product")).toBeInTheDocument();
        expect(
            screen.getByText(
                'Are you sure you want to delete "Cisco Router C9300"? This action cannot be undone.'
            )
        ).toBeInTheDocument();
    });

    it("falls back to default title and message when none are provided", () => {
        render(
            <DeleteConfirmModal
                isOpen
                loading={false}
                onCancel={vi.fn()}
                onConfirm={vi.fn()}
            />
        );

        expect(screen.getByText("Delete Item")).toBeInTheDocument();
        expect(
            screen.getByText("Are you sure you want to delete this item?")
        ).toBeInTheDocument();
    });

    it("shows the 'Delete' label when not loading", () => {
        render(<DeleteConfirmModal {...baseProps} loading={false} />);

        expect(screen.getByTestId("confirm-btn")).toHaveTextContent("Delete");
        expect(screen.queryByTestId("spinner")).not.toBeInTheDocument();
    });

    it("shows a spinner instead of the 'Delete' label while loading", () => {
        render(<DeleteConfirmModal {...baseProps} loading />);

        expect(screen.getByTestId("spinner")).toBeInTheDocument();
        expect(screen.getByTestId("confirm-btn")).not.toHaveTextContent("Delete");
    });

    it("disables both Cancel and Confirm buttons while loading", () => {
        render(<DeleteConfirmModal {...baseProps} loading />);

        expect(screen.getByTestId("cancel-btn")).toBeDisabled();
        expect(screen.getByTestId("confirm-btn")).toBeDisabled();
    });

    it("enables both buttons when not loading", () => {
        render(<DeleteConfirmModal {...baseProps} loading={false} />);

        expect(screen.getByTestId("cancel-btn")).not.toBeDisabled();
        expect(screen.getByTestId("confirm-btn")).not.toBeDisabled();
    });

    it("calls onCancel when the Cancel button is clicked", async () => {
        const user = userEvent.setup();
        const onCancel = vi.fn();
        render(<DeleteConfirmModal {...baseProps} onCancel={onCancel} />);

        await user.click(screen.getByTestId("cancel-btn"));

        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it("calls onConfirm when the Confirm/Delete button is clicked", async () => {
        const user = userEvent.setup();
        const onConfirm = vi.fn();
        render(<DeleteConfirmModal {...baseProps} onConfirm={onConfirm} />);

        await user.click(screen.getByTestId("confirm-btn"));

        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it("does NOT call onConfirm when clicking a disabled Confirm button while loading", async () => {
        const user = userEvent.setup();
        const onConfirm = vi.fn();
        render(<DeleteConfirmModal {...baseProps} onConfirm={onConfirm} loading />);

        // userEvent respects the `disabled` attribute and won't fire the click
        await user.click(screen.getByTestId("confirm-btn"));

        expect(onConfirm).not.toHaveBeenCalled();
    });

    it("calls onCancel when the overlay (backdrop) is clicked", async () => {
        const user = userEvent.setup();
        const onCancel = vi.fn();
        render(<DeleteConfirmModal {...baseProps} onCancel={onCancel} />);

        await user.click(screen.getByTestId("overlay"));

        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it("does not call onCancel when clicking inside the modal box (stopPropagation)", async () => {
        const user = userEvent.setup();
        const onCancel = vi.fn();
        render(<DeleteConfirmModal {...baseProps} onCancel={onCancel} />);

        await user.click(screen.getByTestId("modal-box"));

        expect(onCancel).not.toHaveBeenCalled();
    });

    // ---- Behavior flag, not a fixture bug ----
    // Unlike AddProductModal's handleClose, which explicitly guards
    // `if (loading) return;` before calling onClose, this component's
    // Overlay has NO such guard — onCancel fires from a backdrop click
    // even while a delete is in progress, despite the Cancel *button*
    // being disabled at the same time. This test documents the current
    // (possibly unintended) behavior. If this should be blocked during
    // loading for consistency with AddProductModal, the fix is:
    //   <Overlay onClick={loading ? undefined : onCancel}>
    // and this test's expectation flips to `.not.toHaveBeenCalled()`.
    it("CURRENT BEHAVIOR: overlay click still fires onCancel even while loading (no guard, unlike AddProductModal)", async () => {
        const user = userEvent.setup();
        const onCancel = vi.fn();
        render(<DeleteConfirmModal {...baseProps} onCancel={onCancel} loading />);

        await user.click(screen.getByTestId("overlay"));

        expect(onCancel).toHaveBeenCalledTimes(1);
    });
});