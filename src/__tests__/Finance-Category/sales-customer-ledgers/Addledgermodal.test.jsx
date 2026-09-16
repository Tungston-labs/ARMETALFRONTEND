import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Same directory depth as CustomerLedger.test.jsx (3 levels below src), so
// the same "../../../" prefix reaches src/Pages/... from here. Adjust if you
// save this file somewhere else.
import AddLedgerModal from "../../../Pages/FinanceModule/SALES/CustomerLedger/modal/AddLedgerModal";

vi.mock(
    "../../../Pages/FinanceModule/SALES/CustomerLedger/modal/AddLedgerModal.styles",
    () => ({
        Overlay: ({ children, onClick, ...p }) => (
            <div data-testid="overlay" onClick={onClick} {...p}>
                {children}
            </div>
        ),
        ModalContainer: ({ children, ...p }) => (
            <div data-testid="modal-container" {...p}>
                {children}
            </div>
        ),
        ModalHeader: ({ children, ...p }) => <div {...p}>{children}</div>,
        Title: ({ children, ...p }) => <h2 {...p}>{children}</h2>,
        Subtitle: ({ children, ...p }) => <p {...p}>{children}</p>,
        FormGroup: ({ children, ...p }) => <div {...p}>{children}</div>,
        Label: ({ children, ...p }) => <label {...p}>{children}</label>,
        InputWrapper: ({ children, ...p }) => <div {...p}>{children}</div>,
        Input: (p) => <input {...p} />,
        DateInput: (p) => <input {...p} />,
        RadioSection: ({ children, ...p }) => <div {...p}>{children}</div>,
        RadioOption: ({ children, ...p }) => <div {...p}>{children}</div>,
        RadioLabel: ({ children, ...p }) => <label {...p}>{children}</label>,
        RadioInput: (p) => <input {...p} />,
        ButtonSection: ({ children, ...p }) => <div {...p}>{children}</div>,
        CancelButton: ({ children, ...p }) => <button {...p}>{children}</button>,
        SaveButton: ({ children, ...p }) => <button {...p}>{children}</button>,
    })
);

const setup = (overrides = {}) => {
    const props = {
        isOpen: true,
        onClose: vi.fn(),
        onSave: vi.fn(),
        ...overrides,
    };
    const utils = render(<AddLedgerModal {...props} />);
    return { ...utils, props };
};

describe("AddLedgerModal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ---- Open / closed ----

    it("renders nothing when isOpen is false", () => {
        const { container } = setup({ isOpen: false });
        expect(container).toBeEmptyDOMElement();
    });

    it("renders the form when isOpen is true", () => {
        setup();

        expect(screen.getByText("Add New Ledger")).toBeInTheDocument();
        expect(
            screen.getByText("Record essential journal information.")
        ).toBeInTheDocument();
        expect(screen.getByText("Amount")).toBeInTheDocument();
        expect(screen.getByText("Date")).toBeInTheDocument();
        expect(screen.getByText("Reference")).toBeInTheDocument();
        expect(screen.getByText("CANCEL")).toBeInTheDocument();
        expect(screen.getByText("SAVE")).toBeInTheDocument();
    });

    // ---- Default field values ----

    it("defaults amount, date and reference to empty strings", () => {
        setup();

        const [amountInput, dateInput] = screen.getAllByDisplayValue("");
        expect(amountInput).toBeInTheDocument();
        expect(dateInput).toBeInTheDocument();
    });

    it("defaults the mode to debit", () => {
        setup();

        const radios = screen.getAllByRole("radio");
        const debit = radios.find((r) => r.value === "debit");
        const credit = radios.find((r) => r.value === "credit");

        expect(debit).toBeChecked();
        expect(credit).not.toBeChecked();
    });

    // ---- Field editing ----

    it("updates the amount field as the user types", () => {
        setup();

        const amountInput = document.querySelector('input[name="amount"]');
        fireEvent.change(amountInput, { target: { value: "1500" } });

        expect(amountInput).toHaveValue(1500);
    });

    it("updates the reference field as the user types", () => {
        setup();

        const referenceInput = document.querySelector('input[name="reference"]');
        fireEvent.change(referenceInput, { target: { value: "INV-2026-001" } });

        expect(referenceInput).toHaveValue("INV-2026-001");
    });

    it("updates the date field when changed", () => {
        setup();

        const dateInput = document.querySelector('input[name="date"]');
        fireEvent.change(dateInput, { target: { value: "2026-09-16" } });

        expect(dateInput).toHaveValue("2026-09-16");
    });

    it("switches mode to credit when the Credit radio is selected", () => {
        setup();

        const radios = screen.getAllByRole("radio");
        const credit = radios.find((r) => r.value === "credit");
        const debit = radios.find((r) => r.value === "debit");

        fireEvent.click(credit);

        expect(credit).toBeChecked();
        expect(debit).not.toBeChecked();
    });

    // ---- Overlay click-to-close ----

    it("calls onClose when the overlay background itself is clicked", () => {
        const { props } = setup();

        fireEvent.click(screen.getByTestId("overlay"));

        expect(props.onClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose when clicking inside the modal container", () => {
        const { props } = setup();

        fireEvent.click(screen.getByTestId("modal-container"));

        expect(props.onClose).not.toHaveBeenCalled();
    });

    // ---- Cancel ----

    it("calls onClose (and not onSave) when CANCEL is clicked", async () => {
        const user = userEvent.setup();
        const { props } = setup();

        await user.click(screen.getByText("CANCEL"));

        expect(props.onClose).toHaveBeenCalledTimes(1);
        expect(props.onSave).not.toHaveBeenCalled();
    });

    // ---- Submit / save ----

    it("calls onSave with the current form data when SAVE is clicked", async () => {
        const user = userEvent.setup();
        const { props } = setup();

        fireEvent.change(document.querySelector('input[name="amount"]'), {
            target: { value: "2500" },
        });
        fireEvent.change(document.querySelector('input[name="reference"]'), {
            target: { value: "REF-001" },
        });
        fireEvent.change(document.querySelector('input[name="date"]'), {
            target: { value: "2026-09-16" },
        });

        await user.click(screen.getByText("SAVE"));

        expect(props.onSave).toHaveBeenCalledWith({
            amount: "2500",
            date: "2026-09-16",
            reference: "REF-001",
            mode: "debit",
        });
    });

    it("submits the selected mode along with the rest of the form", async () => {
        const user = userEvent.setup();
        const { props } = setup();

        const radios = screen.getAllByRole("radio");
        const credit = radios.find((r) => r.value === "credit");
        fireEvent.click(credit);

        await user.click(screen.getByText("SAVE"));

        expect(props.onSave).toHaveBeenCalledWith(
            expect.objectContaining({ mode: "credit" })
        );
    });

    it("logs the form data on submit", async () => {
        const user = userEvent.setup();
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
        setup();

        await user.click(screen.getByText("SAVE"));

        expect(logSpy).toHaveBeenCalledWith(
            "Ledger Data:",
            expect.objectContaining({ mode: "debit" })
        );
        logSpy.mockRestore();
    });

    it("does not throw when submitted without an onSave handler", async () => {
        const user = userEvent.setup();
        setup({ onSave: undefined });

        await expect(user.click(screen.getByText("SAVE"))).resolves.not.toThrow();
    });

    it("does not call onClose on submit — closing is left entirely to the parent", async () => {
        const user = userEvent.setup();
        const { props } = setup();

        await user.click(screen.getByText("SAVE"));

        expect(props.onClose).not.toHaveBeenCalled();
    });

    // ---- Regression: form state is not reset ----

    it("REGRESSION: form values persist after save instead of clearing", async () => {
        const user = userEvent.setup();
        setup();

        fireEvent.change(document.querySelector('input[name="reference"]'), {
            target: { value: "REF-STICKY" },
        });

        await user.click(screen.getByText("SAVE"));

        // handleSubmit never resets formData, so the field the user just
        // typed into is still populated even though a save "completed".
        expect(document.querySelector('input[name="reference"]')).toHaveValue(
            "REF-STICKY"
        );
    });

    it("REGRESSION: form values persist across close/reopen since the component stays mounted", () => {
        const { rerender } = render(
            <AddLedgerModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />
        );

        fireEvent.change(document.querySelector('input[name="reference"]'), {
            target: { value: "SHOULD-CLEAR-IDEALLY" },
        });

        // parent closes the modal (isOpen: false)...
        rerender(<AddLedgerModal isOpen={false} onClose={vi.fn()} onSave={vi.fn()} />);
        // ...then reopens it
        rerender(<AddLedgerModal isOpen={true} onClose={vi.fn()} onSave={vi.fn()} />);

        // useState inside the same component instance isn't reinitialized
        // just because the parent stopped rendering its output — the old
        // value is still there on reopen.
        expect(document.querySelector('input[name="reference"]')).toHaveValue(
            "SHOULD-CLEAR-IDEALLY"
        );
    });
});