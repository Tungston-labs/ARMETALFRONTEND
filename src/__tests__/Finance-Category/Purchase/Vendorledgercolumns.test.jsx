import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";

import {
    getVendorLedgerColumns,
    formatAmount,
} from "../../../Pages/FinanceModule/PURCHASES/VendorLedger/Vendorledgercolumns";

// formatDate is not exported, so it is tested through the Date / Due Date
// columns' render functions.

const columns = getVendorLedgerColumns();

const getColumn = (header) => columns.find((c) => c.header === header);

// Renders a column cell for a row and returns RTL's container
const renderCell = (header, row) => {
    const { container } = render(<div>{getColumn(header).render(row)}</div>);
    return container;
};

describe("formatAmount", () => {
    it("formats with 2 decimals", () => {
        expect(formatAmount(100)).toBe("100.00");
        expect(formatAmount("1234.5")).toBe("1,234.50");
    });

    it("uses Indian digit grouping", () => {
        expect(formatAmount(1234567.891)).toBe("12,34,567.89");
    });

    it.each([null, undefined, "", 0])("returns 0.00 for %s", (value) => {
        expect(formatAmount(value)).toBe("0.00");
    });

    it("keeps the sign of negative amounts", () => {
        expect(formatAmount(-2500)).toBe("-2,500.00");
    });
});

describe("getVendorLedgerColumns", () => {
    it("returns the 8 columns in order", () => {
        expect(columns.map((c) => c.header)).toEqual([
            "Date",
            "Vendor",
            "Opening Balance",
            "Total Billed",
            "Total Paid",
            "Closing Balance",
            "Due Date",
            "Status",
        ]);
    });

    it("maps each column to the right accessor", () => {
        expect(columns.map((c) => c.accessor)).toEqual([
            "entry_date",
            "vendor_name",
            "opening_balance",
            "debit_amount",
            "credit_amount",
            "balance",
            "due_date",
            "vendor_status",
        ]);
    });

    it("makes every column non-sortable and gives it a render function", () => {
        columns.forEach((c) => {
            expect(c.sortable).toBe(false);
            expect(typeof c.render).toBe("function");
        });
    });

    it("returns a fresh array each call (and ignores any arguments)", () => {
        const a = getVendorLedgerColumns({ page: 1, pageSize: 10 });
        const b = getVendorLedgerColumns({ page: 2, pageSize: 10 });
        expect(a).not.toBe(b);
        expect(a.map((c) => c.header)).toEqual(b.map((c) => c.header));
    });

    // ---- Date / Due Date (formatDate) ----

    describe.each([
        ["Date", "entry_date"],
        ["Due Date", "due_date"],
    ])("%s column", (header, field) => {
        it("formats YYYY-MM-DD as DD/Mon/YYYY", () => {
            expect(getColumn(header).render({ [field]: "2026-01-05" })).toBe("05/Jan/2026");
            expect(getColumn(header).render({ [field]: "2026-12-31" })).toBe("31/Dec/2026");
        });

        it("ignores the time part of an ISO timestamp", () => {
            expect(getColumn(header).render({ [field]: "2026-03-09T10:30:00Z" })).toBe(
                "09/Mar/2026"
            );
        });

        it("pads single-digit days", () => {
            expect(getColumn(header).render({ [field]: "2026-02-03" })).toBe("03/Feb/2026");
        });

        it.each([null, undefined, ""])("returns '-' for %s", (value) => {
            expect(getColumn(header).render({ [field]: value })).toBe("-");
        });

        it.each(["not-a-date", "2026-00-10", "2026-05-00", "2026"])(
            "returns '-' for invalid value %s",
            (value) => {
                expect(getColumn(header).render({ [field]: value })).toBe("-");
            }
        );
    });

    // ---- Vendor ----

    describe("Vendor column", () => {
        it("shows the vendor name and code", () => {
            renderCell("Vendor", { vendor_name: "ABC Trading LLC", vendor_code: "V-001" });

            expect(screen.getByText("ABC Trading LLC")).toBeInTheDocument();
            expect(screen.getByText("V-001")).toBeInTheDocument();
        });

        it("hides the code line when there is no vendor_code", () => {
            const container = renderCell("Vendor", { vendor_name: "ABC Trading LLC" });

            expect(screen.getByText("ABC Trading LLC")).toBeInTheDocument();
            // container > wrapper div > cell's outer div > [name div] only
            const cell = container.firstChild.firstChild;
            expect(cell.children).toHaveLength(1);
        });

        it("shows '-' when the vendor name is missing", () => {
            renderCell("Vendor", { vendor_code: "V-002" });

            expect(screen.getByText("-")).toBeInTheDocument();
            expect(screen.getByText("V-002")).toBeInTheDocument();
        });

        it("styles the code as muted small text", () => {
            renderCell("Vendor", { vendor_name: "ABC", vendor_code: "V-001" });

            expect(screen.getByText("V-001")).toHaveStyle({
                fontSize: "12px",
                color: "#7B7B7B",
            });
        });
    });

    // ---- Amount columns ----

    describe("Opening Balance column", () => {
        it("formats the amount", () => {
            expect(getColumn("Opening Balance").render({ opening_balance: 1500 })).toBe("1,500.00");
        });

        it("shows 0.00 when missing", () => {
            expect(getColumn("Opening Balance").render({})).toBe("0.00");
        });
    });

    describe("Total Billed column", () => {
        it("formats the debit amount in red", () => {
            renderCell("Total Billed", { debit_amount: "2500.5" });

            expect(screen.getByText("2,500.50")).toHaveStyle({ color: "#EF4444" });
        });

        it("shows 0.00 when missing", () => {
            renderCell("Total Billed", {});

            expect(screen.getByText("0.00")).toBeInTheDocument();
        });
    });

    describe("Total Paid column", () => {
        it("formats the credit amount in green", () => {
            renderCell("Total Paid", { credit_amount: 1000 });

            expect(screen.getByText("1,000.00")).toHaveStyle({ color: "#16A34A" });
        });

        it("shows 0.00 when missing", () => {
            renderCell("Total Paid", {});

            expect(screen.getByText("0.00")).toBeInTheDocument();
        });
    });

    describe("Closing Balance column", () => {
        it("formats the balance in bold", () => {
            renderCell("Closing Balance", { balance: 1500 });

            expect(screen.getByText("1,500.00")).toHaveStyle({ fontWeight: "600" });
        });

        it("shows negative balances with a minus sign", () => {
            renderCell("Closing Balance", { balance: -300 });

            expect(screen.getByText("-300.00")).toBeInTheDocument();
        });

        it("shows 0.00 when missing", () => {
            renderCell("Closing Balance", {});

            expect(screen.getByText("0.00")).toBeInTheDocument();
        });
    });

    // ---- Status ----

    describe("Status column", () => {
        it("shows Active in green", () => {
            renderCell("Status", { vendor_status: "active" });

            expect(screen.getByText("Active")).toHaveStyle({ color: "#16A34A", fontWeight: "600" });
        });

        it("shows Inactive in red", () => {
            renderCell("Status", { vendor_status: "inactive" });

            expect(screen.getByText("Inactive")).toHaveStyle({ color: "#DC2626" });
        });

        it("matches the status case-insensitively for the colour", () => {
            renderCell("Status", { vendor_status: "ACTIVE" });

            // Colour is matched case-insensitively; the text keeps its original casing
            expect(screen.getByText("ACTIVE")).toHaveStyle({ color: "#16A34A" });
        });

        it("shows any other status in amber with the first letter capitalised", () => {
            renderCell("Status", { vendor_status: "blocked" });

            expect(screen.getByText("Blocked")).toHaveStyle({ color: "#F59E0B" });
        });

        it.each([null, undefined, ""])("shows '-' in amber for %s", (value) => {
            renderCell("Status", { vendor_status: value });

            expect(screen.getByText("-")).toHaveStyle({ color: "#F59E0B" });
        });
    });
});