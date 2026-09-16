import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

// ---- PATH PLACEHOLDER ----
// Confirm the real location with:
//   find src -iname 'AddingInvoice*' -o -iname 'Invoice.jsx'
// then update the import below AND the vi.mock path for AddingInvoice.styles
// to match — vi.mock paths resolve relative to THIS test file's location,
// not the component's.
import Invoice from "../../../Pages/FinanceModule/SALES/Invoices/AddingInvoice/AddingInvoice";

vi.mock(
    "../../../Pages/FinanceModule/SALES/Invoices/AddingInvoice/AddingInvoice.styles",
    () => ({
        InvoiceContainer: ({ children, ...p }) => <div {...p}>{children}</div>,
        InvoiceForm: ({ children, ...p }) => <div {...p}>{children}</div>,
        SectionTitle: ({ children, ...p }) => <h3 {...p}>{children}</h3>,
        FormGrid: ({ children, ...p }) => <div {...p}>{children}</div>,
        FormGroup: ({ children, ...p }) => <div {...p}>{children}</div>,
        Label: ({ children, ...p }) => <label {...p}>{children}</label>,
        Input: (p) => <input {...p} />,
        SelectWrapper: ({ children, ...p }) => <div {...p}>{children}</div>,
        Select: ({ children, ...p }) => <select {...p}>{children}</select>,
        CalendarInput: ({ children, ...p }) => <div {...p}>{children}</div>,
        InvoiceItemsHeader: ({ children, ...p }) => <div {...p}>{children}</div>,
        AddItemButton: ({ children, ...p }) => <button {...p}>{children}</button>,
        InvoiceTableWrapper: ({ children, ...p }) => <div {...p}>{children}</div>,
        InvoiceTable: ({ children, ...p }) => <table {...p}>{children}</table>,
        DeleteButton: ({ children, ...p }) => <button {...p}>{children}</button>,
        PaymentSection: ({ children, ...p }) => <div {...p}>{children}</div>,
        PaymentLeft: ({ children, ...p }) => <div {...p}>{children}</div>,
        PaymentGrid: ({ children, ...p }) => <div {...p}>{children}</div>,
        PaymentRight: ({ children, ...p }) => <div {...p}>{children}</div>,
        SummaryRow: ({ children, ...p }) => <div {...p}>{children}</div>,
        TotalAmount: ({ children, ...p }) => <div {...p}>{children}</div>,
        ButtonWrapper: ({ children, ...p }) => <div {...p}>{children}</div>,
        CancelButton: ({ children, ...p }) => <button {...p}>{children}</button>,
        PreviewButton: ({ children, ...p }) => <button {...p}>{children}</button>,
    })
);

vi.mock("../../../Components/ReusableTable/ReusableHeader", () => ({
    default: ({ title, breadcrumbs = [], buttonText, onButtonClick }) => (
        <div data-testid="reusable-header">
            <h1>{title}</h1>
            <div data-testid="breadcrumbs">{breadcrumbs.join(" / ")}</div>
            {buttonText ? <button onClick={onButtonClick}>{buttonText}</button> : null}
        </div>
    ),
}));

const todayISO = () => new Date().toISOString().split("T")[0];

const getDateInputs = (container) => {
    const dateInputs = container.querySelectorAll('input[type="date"]');
    return { invoiceDate: dateInputs[0], dueDate: dateInputs[1] };
};

describe("AddingInvoice (Invoice)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ---- Header ----

    it("renders the header with title and Sales / Invoices breadcrumbs", () => {
        render(<Invoice />);

        expect(screen.getByText("Generate New Invoice")).toBeInTheDocument();
        expect(screen.getByTestId("breadcrumbs")).toHaveTextContent("Sales / Invoices");
    });

    // ---- Invoice details fields ----

    it("renders the invoice number field", () => {
        render(<Invoice />);
        expect(screen.getByPlaceholderText("INV001")).toBeInTheDocument();
    });

    it("defaults the invoice date to today", () => {
        const { container } = render(<Invoice />);
        const { invoiceDate } = getDateInputs(container);

        expect(invoiceDate).toHaveValue(todayISO());
    });

    it("leaves due date empty by default, bounded to the invoice date", () => {
        const { container } = render(<Invoice />);
        const { dueDate } = getDateInputs(container);

        expect(dueDate).toHaveValue("");
        expect(dueDate).toHaveAttribute("min", todayISO());
    });

    it("raises the due date's minimum when the invoice date changes", () => {
        const { container } = render(<Invoice />);
        const { invoiceDate, dueDate } = getDateInputs(container);

        fireEvent.change(invoiceDate, { target: { value: "2026-10-01" } });

        expect(dueDate).toHaveAttribute("min", "2026-10-01");
    });

    it("updates the due date value when changed", () => {
        const { container } = render(<Invoice />);
        const { dueDate } = getDateInputs(container);

        fireEvent.change(dueDate, { target: { value: "2026-10-15" } });

        expect(dueDate).toHaveValue("2026-10-15");
    });

    it("offers Paid, Pending and Partially Paid as payment status options", () => {
        render(<Invoice />);

        const selects = screen.getAllByRole("combobox");
        const paymentStatus = selects[0];
        const labels = within(paymentStatus)
            .getAllByRole("option")
            .map((o) => o.textContent);

        expect(labels).toEqual([
            "Select Payment Status",
            "Paid",
            "Pending",
            "Partially Paid",
        ]);
    });

    it("offers two client options under Bill To", () => {
        render(<Invoice />);

        const selects = screen.getAllByRole("combobox");
        const billTo = selects[1];
        const labels = within(billTo)
            .getAllByRole("option")
            .map((o) => o.textContent);

        expect(labels).toEqual(["Company/Client Name", "Company 1", "Company 2"]);
    });

    it("renders the From and Bill To contact fields", () => {
        render(<Invoice />);

        expect(screen.getAllByPlaceholderText("TUNGSTON LABS")).toHaveLength(2);
        expect(
            screen.getByPlaceholderText("Tungston Labs, Ullampilly Building,...")
        ).toBeInTheDocument();
        expect(screen.getByPlaceholderText("+91 97783 77526")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("info@tungstonlabs.com")).toBeInTheDocument();

        expect(screen.getByPlaceholderText("Company/Client ADDRESS")).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("Company/Client Phone Number")
        ).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Company/Client Email ID")).toBeInTheDocument();
    });

    // ---- Invoice items table ----

    it("renders 2 rows initially with SL No 01 and 02", () => {
        render(<Invoice />);

        const rows = screen.getAllByRole("row");
        // rows[0] is the header row
        expect(within(rows[1]).getByText("01")).toBeInTheDocument();
        expect(within(rows[2]).getByText("02")).toBeInTheDocument();
    });

    it("pre-fills row 1 with the template line item and marks its fields read-only", () => {
        render(<Invoice />);

        const rows = screen.getAllByRole("row");
        const row1Inputs = within(rows[1]).getAllByRole("textbox");

        expect(row1Inputs[0]).toHaveValue("App Design");
        expect(row1Inputs[0]).toHaveAttribute("readonly");
        expect(row1Inputs[1]).toHaveValue("Wireframe Of 15 Pages");
        expect(row1Inputs[1]).toHaveAttribute("readonly");
    });

    it("REGRESSION: row 2's fields are empty but NOT marked read-only, despite having no onChange handler", () => {
        render(<Invoice />);

        const rows = screen.getAllByRole("row");
        const row2Inputs = within(rows[2]).getAllByRole("textbox");

        row2Inputs.forEach((input) => {
            expect(input).toHaveValue("");
            expect(input).not.toHaveAttribute("readonly");
        });
    });

    it("REGRESSION: React warns that row 2's inputs are controlled without an onChange handler", () => {
        const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

        render(<Invoice />);

        const warnedAboutMissingOnChange = errorSpy.mock.calls.some((call) =>
            String(call[0]).includes(
                "You provided a `value` prop to a form field without an `onChange` handler"
            )
        );
        expect(warnedAboutMissingOnChange).toBe(true);

        errorSpy.mockRestore();
    });

    it("adds a new empty row with the next SL No when ADD ITEM is clicked", async () => {
        const user = userEvent.setup();
        render(<Invoice />);

        await user.click(screen.getByText("ADD ITEM"));

        const rows = screen.getAllByRole("row");
        // header + 3 item rows now
        expect(rows).toHaveLength(4);
        expect(within(rows[3]).getByText("03")).toBeInTheDocument();
    });

    it("REGRESSION: a newly added row still shows the row-1 placeholder text, not a generic one", async () => {
        const user = userEvent.setup();
        render(<Invoice />);

        await user.click(screen.getByText("ADD ITEM"));

        const rows = screen.getAllByRole("row");
        const newRowInputs = within(rows[3]).getAllByRole("textbox");

        // service/particular placeholders are hardcoded in the component
        // regardless of row, so the new blank row shows the template's
        // example text rather than something row-appropriate.
        expect(newRowInputs[0]).toHaveAttribute("placeholder", "App Design");
        expect(newRowInputs[1]).toHaveAttribute(
            "placeholder",
            "Wireframe Of 15 Pages"
        );
    });

    it("removes a row when its delete (X) button is clicked", async () => {
        const user = userEvent.setup();
        render(<Invoice />);

        const deleteButtons = screen.getAllByRole("button", { name: "" });
        // second row's delete button — buttons include ADD ITEM/CANCEL/etc,
        // so scope to the row itself instead of relying on global order.
        const rows = screen.getAllByRole("row");
        const row2Delete = within(rows[2]).getByRole("button");

        await user.click(row2Delete);

        const rowsAfter = screen.getAllByRole("row");
        expect(rowsAfter).toHaveLength(2); // header + row 1 only
    });

    it("REGRESSION: the read-only template row (row 1) can still be deleted", async () => {
        const user = userEvent.setup();
        render(<Invoice />);

        const rowsBefore = screen.getAllByRole("row");
        const row1Delete = within(rowsBefore[1]).getByRole("button");

        await user.click(row1Delete);

        const rowsAfter = screen.getAllByRole("row");
        // only row 2 remains — nothing protects the template row from removal
        expect(rowsAfter).toHaveLength(2);
        expect(screen.queryByText("App Design")).not.toBeInTheDocument();
    });

    // ---- Payment / summary section ----

    it("renders the payment detail fields and QR upload box", () => {
        render(<Invoice />);

        expect(screen.getByPlaceholderText("12534789652135")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("2654559")).toBeInTheDocument();
    });

    it("renders the static summary totals", () => {
        render(<Invoice />);

        expect(screen.getByText("Sub Total")).toBeInTheDocument();
        expect(screen.getByText("SAR 1,970")).toBeInTheDocument();
        expect(screen.getByText("TOTAL AMOUNT")).toBeInTheDocument();
        expect(screen.getAllByText("SAR 1,411.15").length).toBeGreaterThan(0);
    });

    it("REGRESSION: summary totals do not change when items are added", async () => {
        const user = userEvent.setup();
        render(<Invoice />);

        await user.click(screen.getByText("ADD ITEM"));
        await user.click(screen.getByText("ADD ITEM"));

        // still the same static string — nothing recalculates from `items`
        expect(screen.getAllByText("SAR 1,411.15").length).toBeGreaterThan(0);
    });

    // ---- Footer buttons ----

    it("renders CANCEL and PREVIEW buttons", () => {
        render(<Invoice />);

        expect(screen.getByText("CANCEL")).toBeInTheDocument();
        expect(screen.getByText("PREVIEW")).toBeInTheDocument();
    });
});