import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { getCustomerColumns } from "../../../Pages/FinanceModule/SALES/Customer/Customerlist.columns";

// ---- Styled-components stand-ins. We only care about what gets passed
// through (children, handlers, the $negative / $variant flags), not the
// actual styling, so these render as plain elements exposing that as
// data-attributes/testids.
vi.mock("../../../Pages/FinanceModule/SALES/Customer/CustomerList.styles", () => ({
    LinkName: ({ children, ...props }) => (
        <button data-testid="link-name" {...props}>
            {children}
        </button>
    ),
    BalanceAmount: ({ children, $negative, ...props }) => (
        <span data-testid="balance-amount" data-negative={String(!!$negative)} {...props}>
            {children}
        </span>
    ),
    ActionsCell: ({ children, ...props }) => (
        <div data-testid="actions-cell" {...props}>
            {children}
        </div>
    ),
    ActionButton: ({ children, ...props }) => <button {...props}>{children}</button>,
    MenuWrapper: ({ children, ...props }) => (
        <div data-testid="menu-wrapper" {...props}>
            {children}
        </div>
    ),
    KebabButton: ({ children, ...props }) => (
        <button data-testid="kebab-button" {...props}>
            {children}
        </button>
    ),
    CircleIconButton: ({ children, $variant, ...props }) => (
        <button data-testid={`circle-icon-${$variant}`} {...props}>
            {children}
        </button>
    ),
}));

const baseHandlers = () => ({
    openMenuId: null,
    toggleActionsMenu: vi.fn(),
    handleViewOverview: vi.fn(),
    handleCreateInvoice: vi.fn(),
    handleViewLedger: vi.fn(),
    handleEditCustomer: vi.fn(),
    handleDeleteCustomer: vi.fn(),
});

const sampleRow = {
    id: 1,
    customer_id: "CUST-001",
    customer_name: "Acme Corp",
    credit_limit: "10,000",
    total_invoices: 5,
    payments_received: "4,000",
    balance: "500",
    outstanding_days: 12,
    last_payment_date: "2026-08-01",
};

const findColumn = (columns, accessor) =>
    columns.find((c) => c.accessor === accessor);

describe("getCustomerColumns", () => {
    let handlers;
    let columns;

    beforeEach(() => {
        vi.clearAllMocks();
        handlers = baseHandlers();
        columns = getCustomerColumns(handlers);
    });

    // ---- Static shape ----

    it("returns 9 columns in the expected order", () => {
        expect(columns).toHaveLength(9);
        expect(columns.map((c) => c.accessor)).toEqual([
            "customer_id",
            "customer_name",
            "credit_limit",
            "total_invoices",
            "payments_received",
            "balance",
            "outstanding_days",
            "last_payment_date",
            "actions",
        ]);
    });

    it("sets header labels for every column", () => {
        expect(findColumn(columns, "customer_id").header).toBe("Code");
        expect(findColumn(columns, "customer_name").header).toBe("Customer Name");
        expect(findColumn(columns, "credit_limit").header).toBe("Credit Limit");
        expect(findColumn(columns, "total_invoices").header).toBe("Total Invoices");
        expect(findColumn(columns, "payments_received").header).toBe(
            "Payments Received"
        );
        expect(findColumn(columns, "balance").header).toBe("Balance");
        expect(findColumn(columns, "outstanding_days").header).toBe(
            "Outstanding Days"
        );
        expect(findColumn(columns, "last_payment_date").header).toBe(
            "Last Payment"
        );
        expect(findColumn(columns, "actions").header).toBe("Actions");
    });

    it("marks customer_name and actions as always-visible (priority 1)", () => {
        expect(findColumn(columns, "customer_name").priority).toBe(1);
        expect(findColumn(columns, "actions").priority).toBe(1);
    });

    it("assigns the documented priority tiers to the remaining columns", () => {
        expect(findColumn(columns, "customer_id").priority).toBe(2);
        expect(findColumn(columns, "balance").priority).toBe(2);
        expect(findColumn(columns, "last_payment_date").priority).toBe(3);
        expect(findColumn(columns, "credit_limit").priority).toBe(4);
        expect(findColumn(columns, "total_invoices").priority).toBe(4);
        expect(findColumn(columns, "payments_received").priority).toBe(5);
        expect(findColumn(columns, "outstanding_days").priority).toBe(5);
    });

    it("gives the actions column a fixed pixel width and the rest percentage widths", () => {
        expect(findColumn(columns, "actions").width).toBe("300px");
        expect(findColumn(columns, "customer_id").width).toBe("9%");
        expect(findColumn(columns, "customer_name").width).toBe("13%");
    });

    it("leaves plain columns without a custom render function", () => {
        expect(findColumn(columns, "customer_id").render).toBeUndefined();
        expect(findColumn(columns, "total_invoices").render).toBeUndefined();
        expect(findColumn(columns, "outstanding_days").render).toBeUndefined();
        expect(findColumn(columns, "last_payment_date").render).toBeUndefined();
    });

    // ---- customer_name render ----

    it("renders the customer name as a clickable link", () => {
        const column = findColumn(columns, "customer_name");
        render(column.render(sampleRow));

        expect(screen.getByTestId("link-name")).toHaveTextContent("Acme Corp");
    });

    it("calls handleViewOverview with the row when the name link is clicked", async () => {
        const user = userEvent.setup();
        const column = findColumn(columns, "customer_name");
        render(column.render(sampleRow));

        await user.click(screen.getByTestId("link-name"));

        expect(handlers.handleViewOverview).toHaveBeenCalledWith(sampleRow);
    });

    // ---- balance render ----

    it("renders the balance value", () => {
        const column = findColumn(columns, "balance");
        render(column.render(sampleRow));

        expect(screen.getByTestId("balance-amount")).toHaveTextContent("500");
    });

    it("flags $negative when balance is a positive number", () => {
        // NOTE: as written, `$negative={Number(row.balance) > 0}` is true for
        // balances ABOVE zero, not below — this test documents the current
        // behavior rather than asserting it's the intended one. If "negative"
        // is meant to mean "customer owes money" that may be correct; if it's
        // meant to mean "balance < 0" the condition is inverted.
        const column = findColumn(columns, "balance");
        render(column.render({ ...sampleRow, balance: "500" }));

        expect(screen.getByTestId("balance-amount")).toHaveAttribute(
            "data-negative",
            "true"
        );
    });

    it("does not flag $negative when balance is zero", () => {
        const column = findColumn(columns, "balance");
        render(column.render({ ...sampleRow, balance: "0" }));

        expect(screen.getByTestId("balance-amount")).toHaveAttribute(
            "data-negative",
            "false"
        );
    });

    // ---- actions render: invoice / ledger buttons ----

    it("calls handleCreateInvoice with the row when Invoice is clicked", async () => {
        const user = userEvent.setup();
        const column = findColumn(columns, "actions");
        render(column.render(sampleRow));

        await user.click(screen.getByText("Invoice"));

        expect(handlers.handleCreateInvoice).toHaveBeenCalledWith(sampleRow);
    });

    it("calls handleViewLedger with the row when Ledger is clicked", async () => {
        const user = userEvent.setup();
        const column = findColumn(columns, "actions");
        render(column.render(sampleRow));

        await user.click(screen.getByText("Ledger"));

        expect(handlers.handleViewLedger).toHaveBeenCalledWith(sampleRow);
    });

    // ---- actions render: kebab menu ----

    it("resolves the row id from `id`, falling back to `customer_id`", async () => {
        const user = userEvent.setup();
        const column = findColumn(columns, "actions");

        render(column.render(sampleRow));
        await user.click(screen.getByTestId("kebab-button"));
        expect(handlers.toggleActionsMenu).toHaveBeenCalledWith(1);

        handlers.toggleActionsMenu.mockClear();

        const rowWithoutId = { ...sampleRow, id: undefined };
        render(column.render(rowWithoutId));
        const kebabButtons = screen.getAllByTestId("kebab-button");
        await user.click(kebabButtons[kebabButtons.length - 1]);
        expect(handlers.toggleActionsMenu).toHaveBeenCalledWith("CUST-001");
    });

    it("hides the edit/delete buttons when the menu is closed", () => {
        const column = getCustomerColumns({ ...handlers, openMenuId: null })
            .find((c) => c.accessor === "actions");
        render(column.render(sampleRow));

        expect(screen.queryByTestId("circle-icon-edit")).not.toBeInTheDocument();
        expect(screen.queryByTestId("circle-icon-delete")).not.toBeInTheDocument();
        expect(screen.getByTestId("kebab-button")).toHaveAttribute(
            "aria-expanded",
            "false"
        );
    });

    it("shows the edit/delete buttons when this row's menu is open", () => {
        const column = getCustomerColumns({ ...handlers, openMenuId: sampleRow.id })
            .find((c) => c.accessor === "actions");
        render(column.render(sampleRow));

        expect(screen.getByTestId("circle-icon-edit")).toBeInTheDocument();
        expect(screen.getByTestId("circle-icon-delete")).toBeInTheDocument();
        expect(screen.getByTestId("kebab-button")).toHaveAttribute(
            "aria-expanded",
            "true"
        );
    });

    it("keeps another row's menu closed when openMenuId points at a different row", () => {
        const column = getCustomerColumns({ ...handlers, openMenuId: 999 })
            .find((c) => c.accessor === "actions");
        render(column.render(sampleRow));

        expect(screen.queryByTestId("circle-icon-edit")).not.toBeInTheDocument();
        expect(screen.queryByTestId("circle-icon-delete")).not.toBeInTheDocument();
    });

    it("calls handleEditCustomer with the row when the edit icon is clicked", async () => {
        const user = userEvent.setup();
        const column = getCustomerColumns({ ...handlers, openMenuId: sampleRow.id })
            .find((c) => c.accessor === "actions");
        render(column.render(sampleRow));

        await user.click(screen.getByTestId("circle-icon-edit"));

        expect(handlers.handleEditCustomer).toHaveBeenCalledWith(sampleRow);
    });

    it("calls handleDeleteCustomer with the row when the delete icon is clicked", async () => {
        const user = userEvent.setup();
        const column = getCustomerColumns({ ...handlers, openMenuId: sampleRow.id })
            .find((c) => c.accessor === "actions");
        render(column.render(sampleRow));

        await user.click(screen.getByTestId("circle-icon-delete"));

        expect(handlers.handleDeleteCustomer).toHaveBeenCalledWith(sampleRow);
    });

    it("marks the menu wrapper with data-menu-root for outside-click handling", () => {
        const column = findColumn(columns, "actions");
        render(column.render(sampleRow));

        // the hook relies on `e.target.closest("[data-menu-root]")` to decide
        // whether a click was inside the menu — this guards that contract.
        expect(screen.getByTestId("menu-wrapper")).toHaveAttribute("data-menu-root");
    });

    it("renders Invoice and Ledger inside the same actions cell as the menu", () => {
        const column = findColumn(columns, "actions");
        render(column.render(sampleRow));

        const cell = within(screen.getByTestId("actions-cell"));
        expect(cell.getByText("Invoice")).toBeInTheDocument();
        expect(cell.getByText("Ledger")).toBeInTheDocument();
        expect(cell.getByTestId("menu-wrapper")).toBeInTheDocument();
    });
});