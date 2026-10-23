import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

// ---- PATHS ----
// Place this file 3 levels below src (e.g. src/__tests__/Finance-Category/Accounting/).
// "FinanceModule/ACCOUNTS/Chart of Accounts" below is a placeholder for the page folder path
// relative to src/Pages. Find it with:
//   find src/Pages -name "Usechartofaccounts*"
// then replace the placeholder everywhere in this file, e.g.:
//   sed -i 's#FinanceModule/ACCOUNTS/Chart of Accounts#FinanceModule/ACCOUNTING/Chart-Of-Accounts#g' ChartOfAccounts.test.jsx
// (If the page file isn't named ChartOfAccounts.jsx, also fix the first import.)
import ChartOfAccounts from "../../../../Pages/FinanceModule/ACCOUNTS/Chart of Accounts/ChartOfAccounts";
import useChartOfAccounts from "../../../../Pages/FinanceModule/ACCOUNTS/Chart of Accounts/Usechartofaccounts";
import {
    getAccountColumns,
    getStatsCards,
} from "../../../../Pages/FinanceModule/ACCOUNTS/Chart of Accounts/Chartofaccountscolumns";

// NOTE: the `useChartOfAccounts` hook (and its helpers) are mocked, so these
// tests cover the page's rendering and wiring. The real columns file
// (Chartofaccountscolumns) is used, which also lets us test it directly below.

// ---- Hook module (default hook + helpers used by the page and columns) ----
vi.mock("../../../../Pages/FinanceModule/ACCOUNTS/Chart of Accounts/Usechartofaccounts", () => ({
    default: vi.fn(),
    SECTION_COLORS: {
        Assets: "#111111",
        Liabilities: "#222222",
        Equity: "#333333",
        Income: "#444444",
        Expenses: "#555555",
    },
    formatAmount: (value) => `AMT ${value}`,
    padCount: (n) => String(n).padStart(2, "0"),
    sectionTotal: (items) => items.reduce((sum, i) => sum + Number(i.balance || 0), 0),
}));

// ---- Styled-component mocks (transient `$` props are not forwarded to the DOM) ----
vi.mock("../../../../Pages/FinanceModule/ACCOUNTS/Chart of Accounts/ChartOfAccounts.styles", () => ({
    Page: ({ children }) => <div data-testid="page">{children}</div>,
    ContentCard: ({ children }) => <div>{children}</div>,
    FilterSection: ({ children }) => <div>{children}</div>,
    SearchBox: ({ children }) => <div>{children}</div>,
    SearchIcon: ({ children }) => <span>{children}</span>,
    SearchInput: (props) => <input {...props} />,
    SelectWrapper: ({ children }) => <div>{children}</div>,
    Select: ({ children, ...props }) => <select {...props}>{children}</select>,
    SelectArrow: ({ children }) => <span>{children}</span>,
    AccountSection: ({ children }) => <section data-testid="account-section">{children}</section>,
    SectionHeader: ({ children, className }) => (
        <div data-testid="section-header" className={className}>
            {children}
        </div>
    ),
    SectionTitleWrapper: ({ children }) => <div>{children}</div>,
    SectionIcon: ({ children, $color }) => (
        <span data-testid="section-icon" data-color={$color}>
            {children}
        </span>
    ),
    SectionTitle: ({ children }) => <h3>{children}</h3>,
    SectionCount: ({ children }) => <span data-testid="section-count">{children}</span>,
    SectionTotal: ({ children }) => <span data-testid="section-total">{children}</span>,
    TableWrapper: ({ children }) => <div>{children}</div>,
    Table: ({ children }) => <table>{children}</table>,
    TableHead: ({ children }) => <thead>{children}</thead>,
    TableHeader: ({ children }) => <th>{children}</th>,
    TableBody: ({ children }) => <tbody data-testid="table-body">{children}</tbody>,
    TableRow: ({ children }) => <tr>{children}</tr>,
    TableCell: ({ children }) => <td>{children}</td>,
    ExportButton: ({ children, ...props }) => (
        <button data-testid="export-button" {...props}>
            {children}
        </button>
    ),
    Status: ({ children, className }) => (
        <span data-testid="status-badge" className={className}>
            {children}
        </span>
    ),
    ActionWrapper: ({ children }) => <div>{children}</div>,
    EditButton: ({ children, ...props }) => <button {...props}>{children}</button>,
    DeleteButton: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

// ---- Child component mocks ----
vi.mock("../../../../Components/ReusableTable/ReusableHeader", () => ({
    default: ({ title, breadcrumbs = [], buttonText, onButtonClick, children }) => (
        <div data-testid="reusable-header">
            <h1>{title}</h1>
            <div data-testid="breadcrumbs">{breadcrumbs.join(" / ")}</div>
            <button onClick={onButtonClick}>{buttonText}</button>
            <div data-testid="header-actions">{children}</div>
        </div>
    ),
}));

vi.mock("../../../../Components/StatsCards/StatsCards", () => ({
    default: ({ cards = [] }) => (
        <div data-testid="stats-cards">
            {cards.map((c) => (
                <button key={c.title} data-testid="stat-card" onClick={c.onClick}>
                    <span>{c.title}</span>
                    <span>{String(c.count)}</span>
                </button>
            ))}
        </div>
    ),
}));

vi.mock("../../../../Pages/FinanceModule/ACCOUNTS/Chart of Accounts/modal/AddAccountModal", () => ({
    default: ({ isOpen, onClose, account }) => (
        <div
            data-testid="add-account-modal"
            data-open={String(!!isOpen)}
            data-account-id={account ? String(account.id) : ""}
        >
            <button onClick={onClose}>close-modal</button>
        </div>
    ),
}));

vi.mock("../../../../Components/modals/ReusableConfirmModal", () => ({
    default: ({
        show,
        title,
        message,
        confirmText,
        cancelText,
        confirmVariant,
        loadingText,
        onConfirm,
        onClose,
    }) =>
        show ? (
            <div data-testid="confirm-modal" data-loading-text={loadingText}>
                <h2>{title}</h2>
                <p>{message}</p>
                <button data-testid="modal-confirm" data-variant={confirmVariant} onClick={onConfirm}>
                    {confirmText}
                </button>
                <button data-testid="modal-cancel" onClick={onClose}>
                    {cancelText}
                </button>
            </div>
        ) : null,
}));

// ---- Fixtures ----

const accounts = {
    cash: {
        id: 1,
        code: "1001",
        name: "Cash",
        parent: "-",
        category: "Current Assets",
        balance: 1000,
        status: "Active",
    },
    bank: {
        id: 2,
        code: "1002",
        name: "Bank",
        parent: "Cash",
        category: "Current Assets",
        balance: 500,
        status: "Inactive",
    },
    payable: {
        id: 3,
        code: "2001",
        name: "Payables",
        parent: "-",
        category: "Current Liabilities",
        balance: 300,
        status: "Active",
    },
    rent: {
        id: 4,
        code: "5001",
        name: "Rent",
        parent: "-",
        category: "Operating Expense",
        balance: 200,
        status: "Active",
    },
};

const buildHook = (overrides = {}) => ({
    loading: false,
    errorText: "",
    totalAccounts: 4,
    filteredCount: 4,
    groupedAccounts: {
        Assets: [accounts.cash, accounts.bank],
        Liabilities: [accounts.payable],
        Equity: [],
        Income: [],
        Expenses: [accounts.rent],
    },
    stats: { total: 4, active: 3, assets: 2, liabilities: 1, equity: 0 },

    search: "",
    setSearch: vi.fn(),
    typeFilter: "All",
    setTypeFilter: vi.fn(),
    statusFilter: "All",
    setStatusFilter: vi.fn(),
    showAll: vi.fn(),

    isModalOpen: false,
    editingAccount: null,
    handleAdd: vi.fn(),
    handleEdit: vi.fn(),
    handleCloseModal: vi.fn(),

    handleDelete: vi.fn(),
    handleExport: vi.fn(),

    deleteTarget: null,
    handleCancelDelete: vi.fn(),
    handleConfirmDelete: vi.fn(),
    ...overrides,
});

const optionLabels = (selectEl) =>
    within(selectEl)
        .getAllByRole("option")
        .map((o) => o.textContent);

describe("ChartOfAccounts", () => {
    let hook;

    const setHook = (overrides = {}) => {
        hook = buildHook(overrides);
        vi.mocked(useChartOfAccounts).mockReturnValue(hook);
        return hook;
    };

    beforeEach(() => {
        vi.clearAllMocks();
        setHook();
    });

    // ---- Header ----

    it("renders the title and breadcrumbs", () => {
        render(<ChartOfAccounts />);

        expect(screen.getByText("Chart Of Accounting")).toBeInTheDocument();
        expect(screen.getByTestId("breadcrumbs")).toHaveTextContent("Accounting / Chart Of Accounting");
    });

    it("calls handleAdd when the add button is clicked", () => {
        render(<ChartOfAccounts />);

        fireEvent.click(screen.getByText("+ ADD NEW Account"));

        expect(hook.handleAdd).toHaveBeenCalledTimes(1);
    });

    it("calls handleExport when Export Accounts is clicked", () => {
        render(<ChartOfAccounts />);

        const button = within(screen.getByTestId("header-actions")).getByTestId("export-button");
        expect(button).toHaveTextContent("Export Accounts");
        expect(button).toHaveAttribute("type", "button");

        fireEvent.click(button);
        expect(hook.handleExport).toHaveBeenCalledTimes(1);
    });

    // ---- Stats cards ----

    it("renders the five stat cards with padded type counts", () => {
        render(<ChartOfAccounts />);

        const cards = screen.getAllByTestId("stat-card").map((c) => [
            c.children[0].textContent,
            c.children[1].textContent,
        ]);
        expect(cards).toEqual([
            ["Total Accounts", "4"],
            ["Active Accounts", "3"],
            ["Asset Accounts", "02"],
            ["Liability Accounts", "01"],
            ["Equity Accounts", "00"],
        ]);
    });

    it("clicking 'Total Accounts' calls showAll", () => {
        render(<ChartOfAccounts />);

        fireEvent.click(screen.getByText("Total Accounts"));

        expect(hook.showAll).toHaveBeenCalledTimes(1);
    });

    it("clicking 'Active Accounts' filters by Active status", () => {
        render(<ChartOfAccounts />);

        fireEvent.click(screen.getByText("Active Accounts"));

        expect(hook.setStatusFilter).toHaveBeenCalledWith("Active");
    });

    it.each([
        ["Asset Accounts", "Assets"],
        ["Liability Accounts", "Liabilities"],
        ["Equity Accounts", "Equity"],
    ])("clicking '%s' filters by type '%s'", (title, type) => {
        render(<ChartOfAccounts />);

        fireEvent.click(screen.getByText(title));

        expect(hook.setTypeFilter).toHaveBeenCalledWith(type);
    });

    // ---- Filters ----

    it("renders the search input with the hook's search value", () => {
        setHook({ search: "cash" });
        render(<ChartOfAccounts />);

        expect(screen.getByPlaceholderText("Search Account")).toHaveValue("cash");
    });

    it("calls setSearch when typing in the search box", () => {
        render(<ChartOfAccounts />);

        fireEvent.change(screen.getByPlaceholderText("Search Account"), {
            target: { value: "bank" },
        });

        expect(hook.setSearch).toHaveBeenCalledWith("bank");
    });

    it("offers all account types in the type filter", () => {
        render(<ChartOfAccounts />);

        expect(optionLabels(screen.getByDisplayValue("All Type"))).toEqual([
            "All Type",
            "Assets",
            "Liabilities",
            "Equity",
            "Income",
            "Expenses",
        ]);
    });

    it("offers All / Active / Inactive in the status filter", () => {
        render(<ChartOfAccounts />);

        expect(optionLabels(screen.getByDisplayValue("All Status"))).toEqual([
            "All Status",
            "Active",
            "Inactive",
        ]);
    });

    it("calls setTypeFilter when the type changes", () => {
        render(<ChartOfAccounts />);

        fireEvent.change(screen.getByDisplayValue("All Type"), { target: { value: "Income" } });

        expect(hook.setTypeFilter).toHaveBeenCalledWith("Income");
    });

    it("calls setStatusFilter when the status changes", () => {
        render(<ChartOfAccounts />);

        fireEvent.change(screen.getByDisplayValue("All Status"), { target: { value: "Inactive" } });

        expect(hook.setStatusFilter).toHaveBeenCalledWith("Inactive");
    });

    it("reflects the hook's current type and status filters", () => {
        setHook({ typeFilter: "Equity", statusFilter: "Inactive" });
        render(<ChartOfAccounts />);

        expect(screen.getByDisplayValue("Equity")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Inactive")).toBeInTheDocument();
    });

    // ---- Loading / error / empty states ----

    it("shows 'Loading accounts...' while loading with no accounts yet", () => {
        setHook({ loading: true, totalAccounts: 0, filteredCount: 0, groupedAccounts: {} });
        render(<ChartOfAccounts />);

        expect(screen.getByText("Loading accounts...")).toBeInTheDocument();
        expect(screen.queryByText("No accounts found.")).not.toBeInTheDocument();
    });

    it("does not show the loading text when accounts are already loaded", () => {
        setHook({ loading: true });
        render(<ChartOfAccounts />);

        expect(screen.queryByText("Loading accounts...")).not.toBeInTheDocument();
    });

    it("shows the error text", () => {
        setHook({ errorText: "Failed to load accounts" });
        render(<ChartOfAccounts />);

        expect(screen.getByText("Failed to load accounts")).toBeInTheDocument();
    });

    it("shows 'No accounts found.' when the filtered list is empty", () => {
        setHook({ filteredCount: 0, groupedAccounts: {} });
        render(<ChartOfAccounts />);

        expect(screen.getByText("No accounts found.")).toBeInTheDocument();
    });

    it("does not show 'No accounts found.' while loading or when there is an error", () => {
        setHook({ filteredCount: 0, groupedAccounts: {}, loading: true, totalAccounts: 3 });
        const { unmount } = render(<ChartOfAccounts />);
        expect(screen.queryByText("No accounts found.")).not.toBeInTheDocument();
        unmount();

        setHook({ filteredCount: 0, groupedAccounts: {}, errorText: "Boom" });
        render(<ChartOfAccounts />);
        expect(screen.queryByText("No accounts found.")).not.toBeInTheDocument();
    });

    it("does not show 'No accounts found.' when there are accounts", () => {
        render(<ChartOfAccounts />);

        expect(screen.queryByText("No accounts found.")).not.toBeInTheDocument();
    });

    // ---- Account groups ----

    it("renders a section only for account types that have accounts", () => {
        render(<ChartOfAccounts />);

        const titles = screen
            .getAllByTestId("section-header")
            .map((h) => within(h).getByRole("heading").textContent);
        expect(titles).toEqual(["ASSETS", "LIABILITIES", "EXPENSES"]);
    });

    it("shows each section's account count and total", () => {
        render(<ChartOfAccounts />);

        const counts = screen.getAllByTestId("section-count").map((c) => c.textContent);
        const totals = screen.getAllByTestId("section-total").map((t) => t.textContent);

        expect(counts).toEqual(["2 Accounts", "1 Accounts", "1 Accounts"]);
        expect(totals).toEqual(["AMT 1500", "AMT 300", "AMT 200"]);
    });

    it("gives each section header a lower-cased type class and its colour", () => {
        render(<ChartOfAccounts />);

        const headers = screen.getAllByTestId("section-header");
        expect(headers[0]).toHaveClass("assets");
        expect(headers[1]).toHaveClass("liabilities");
        expect(headers[2]).toHaveClass("expenses");

        const colors = screen.getAllByTestId("section-icon").map((i) => i.getAttribute("data-color"));
        expect(colors).toEqual(["#111111", "#222222", "#555555"]);
    });

    it("renders the table headers for each section", () => {
        render(<ChartOfAccounts />);

        const [firstSection] = screen.getAllByTestId("account-section");
        const headers = within(firstSection)
            .getAllByRole("columnheader")
            .map((h) => h.textContent);
        expect(headers).toEqual([
            "Code",
            "Account Name",
            "Parent Account",
            "Category",
            "Balance",
            "Status",
            "Action",
        ]);
    });

    it("renders one row per account in each section", () => {
        render(<ChartOfAccounts />);

        const counts = screen
            .getAllByTestId("account-section")
            .map((s) => within(within(s).getByTestId("table-body")).getAllByRole("row").length);
        expect(counts).toEqual([2, 1, 1]);
    });

    it("renders each account's cells (formatted balance, status badge)", () => {
        render(<ChartOfAccounts />);

        const [firstSection] = screen.getAllByTestId("account-section");
        const [firstRow] = within(within(firstSection).getByTestId("table-body")).getAllByRole("row");
        const cells = within(firstRow).getAllByRole("cell");

        expect(cells.slice(0, 6).map((c) => c.textContent)).toEqual([
            "1001",
            "Cash",
            "-",
            "Current Assets",
            "AMT 1000",
            "Active",
        ]);
        expect(within(firstRow).getByTestId("status-badge")).toHaveClass("active");
    });

    it("lower-cases the status into the badge class (Inactive -> inactive)", () => {
        render(<ChartOfAccounts />);

        const [firstSection] = screen.getAllByTestId("account-section");
        const rows = within(within(firstSection).getByTestId("table-body")).getAllByRole("row");

        expect(within(rows[1]).getByTestId("status-badge")).toHaveClass("inactive");
    });

    // ---- Row actions ----

    it("calls handleEdit with the account when Edit is clicked", () => {
        render(<ChartOfAccounts />);

        fireEvent.click(screen.getAllByTitle("Edit")[0]);

        expect(hook.handleEdit).toHaveBeenCalledWith(accounts.cash);
    });

    it("calls handleDelete with the account when Delete is clicked", () => {
        render(<ChartOfAccounts />);

        fireEvent.click(screen.getAllByTitle("Delete")[2]); // third account overall = payable

        expect(hook.handleDelete).toHaveBeenCalledWith(accounts.payable);
    });

    // ---- Add / edit modal wiring ----

    it("passes isOpen to the account modal (closed by default)", () => {
        render(<ChartOfAccounts />);

        const modal = screen.getByTestId("add-account-modal");
        expect(modal).toHaveAttribute("data-open", "false");
        expect(modal).toHaveAttribute("data-account-id", "");
    });

    it("opens the modal with the account being edited", () => {
        setHook({ isModalOpen: true, editingAccount: { id: 7 } });
        render(<ChartOfAccounts />);

        const modal = screen.getByTestId("add-account-modal");
        expect(modal).toHaveAttribute("data-open", "true");
        expect(modal).toHaveAttribute("data-account-id", "7");
    });

    it("calls handleCloseModal when the modal closes", () => {
        render(<ChartOfAccounts />);

        fireEvent.click(screen.getByText("close-modal"));

        expect(hook.handleCloseModal).toHaveBeenCalledTimes(1);
    });

    // ---- Delete confirmation ----

    it("does not render the confirm modal without a delete target", () => {
        render(<ChartOfAccounts />);

        expect(screen.queryByTestId("confirm-modal")).not.toBeInTheDocument();
    });

    it("shows the confirm modal with the account code and name", () => {
        setHook({ deleteTarget: accounts.cash });
        render(<ChartOfAccounts />);

        expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();
        expect(screen.getByText("Delete Account")).toBeInTheDocument();
        expect(
            screen.getByText(
                'Are you sure you want to delete "1001 - Cash"? This action cannot be undone.'
            )
        ).toBeInTheDocument();
        expect(screen.getByTestId("modal-confirm")).toHaveTextContent("Delete");
        expect(screen.getByTestId("modal-confirm")).toHaveAttribute("data-variant", "danger");
        expect(screen.getByTestId("modal-cancel")).toHaveTextContent("Cancel");
        expect(screen.getByTestId("confirm-modal")).toHaveAttribute("data-loading-text", "Deleting...");
    });

    it("calls handleConfirmDelete when Delete is confirmed", () => {
        setHook({ deleteTarget: accounts.cash });
        render(<ChartOfAccounts />);

        fireEvent.click(screen.getByTestId("modal-confirm"));

        expect(hook.handleConfirmDelete).toHaveBeenCalledTimes(1);
    });

    it("calls handleCancelDelete when the confirm modal is cancelled", () => {
        setHook({ deleteTarget: accounts.cash });
        render(<ChartOfAccounts />);

        fireEvent.click(screen.getByTestId("modal-cancel"));

        expect(hook.handleCancelDelete).toHaveBeenCalledTimes(1);
    });
});

// ---- Chartofaccountscolumns (real file) ----

describe("getAccountColumns", () => {
    it("defines the expected columns in order", () => {
        const columns = getAccountColumns({ onEdit: vi.fn(), onDelete: vi.fn() });

        expect(columns.map((c) => [c.key, c.header])).toEqual([
            ["code", "Code"],
            ["name", "Account Name"],
            ["parent", "Parent Account"],
            ["category", "Category"],
            ["balance", "Balance"],
            ["status", "Status"],
            ["action", "Action"],
        ]);
    });

    it("renders plain fields as-is and the balance via formatAmount", () => {
        const columns = getAccountColumns({ onEdit: vi.fn(), onDelete: vi.fn() });
        const byKey = Object.fromEntries(columns.map((c) => [c.key, c]));

        expect(byKey.code.render(accounts.cash)).toBe("1001");
        expect(byKey.name.render(accounts.cash)).toBe("Cash");
        expect(byKey.parent.render(accounts.bank)).toBe("Cash");
        expect(byKey.category.render(accounts.cash)).toBe("Current Assets");
        expect(byKey.balance.render(accounts.cash)).toBe("AMT 1000");
    });

    it("renders a status badge with a lower-cased class", () => {
        const columns = getAccountColumns({ onEdit: vi.fn(), onDelete: vi.fn() });
        const status = columns.find((c) => c.key === "status");

        render(<div>{status.render(accounts.bank)}</div>);

        const badge = screen.getByTestId("status-badge");
        expect(badge).toHaveTextContent("Inactive");
        expect(badge).toHaveClass("inactive");
    });

    it("Edit button calls onEdit with the account and stops propagation", () => {
        const onEdit = vi.fn();
        const parentClick = vi.fn();
        const action = getAccountColumns({ onEdit, onDelete: vi.fn() }).find((c) => c.key === "action");

        render(<div onClick={parentClick}>{action.render(accounts.cash)}</div>);
        fireEvent.click(screen.getByTitle("Edit"));

        expect(onEdit).toHaveBeenCalledWith(accounts.cash);
        expect(parentClick).not.toHaveBeenCalled();
    });

    it("Delete button calls onDelete with the account and stops propagation", () => {
        const onDelete = vi.fn();
        const parentClick = vi.fn();
        const action = getAccountColumns({ onEdit: vi.fn(), onDelete }).find((c) => c.key === "action");

        render(<div onClick={parentClick}>{action.render(accounts.bank)}</div>);
        fireEvent.click(screen.getByTitle("Delete"));

        expect(onDelete).toHaveBeenCalledWith(accounts.bank);
        expect(parentClick).not.toHaveBeenCalled();
    });

    it("renders both action buttons as type=button", () => {
        const action = getAccountColumns({ onEdit: vi.fn(), onDelete: vi.fn() }).find(
            (c) => c.key === "action"
        );

        render(<div>{action.render(accounts.cash)}</div>);

        expect(screen.getByTitle("Edit")).toHaveAttribute("type", "button");
        expect(screen.getByTitle("Delete")).toHaveAttribute("type", "button");
    });
});

describe("getStatsCards", () => {
    const build = () => {
        const handlers = {
            showAll: vi.fn(),
            setStatusFilter: vi.fn(),
            setTypeFilter: vi.fn(),
        };
        const cards = getStatsCards({
            stats: { total: 9, active: 7, assets: 3, liabilities: 5, equity: 0 },
            ...handlers,
        });
        return { cards, handlers };
    };

    it("returns five cards with the expected titles", () => {
        const { cards } = build();

        expect(cards.map((c) => c.title)).toEqual([
            "Total Accounts",
            "Active Accounts",
            "Asset Accounts",
            "Liability Accounts",
            "Equity Accounts",
        ]);
    });

    it("uses raw numbers for total/active and padded counts for the types", () => {
        const { cards } = build();

        expect(cards.map((c) => c.count)).toEqual([9, 7, "03", "05", "00"]);
    });

    it("wires each card's onClick to the right handler and value", () => {
        const { cards, handlers } = build();

        cards[0].onClick();
        cards[1].onClick();
        cards[2].onClick();
        cards[3].onClick();
        cards[4].onClick();

        expect(handlers.showAll).toHaveBeenCalledTimes(1);
        expect(handlers.setStatusFilter).toHaveBeenCalledWith("Active");
        expect(handlers.setTypeFilter).toHaveBeenNthCalledWith(1, "Assets");
        expect(handlers.setTypeFilter).toHaveBeenNthCalledWith(2, "Liabilities");
        expect(handlers.setTypeFilter).toHaveBeenNthCalledWith(3, "Equity");
    });

    it("gives every card an icon element and colours", () => {
        const { cards } = build();

        cards.forEach((card) => {
            expect(React.isValidElement(card.icon)).toBe(true);
            expect(card.backgroundColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
            expect(card.iconColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
        });
    });
});