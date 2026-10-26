import React from "react";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// ---- PATHS ----
// Imports starting with "./" point at the TrialBalance page folder and the
// "../../../../" ones at src/. The one-shot command given with this file
// rewrites both to match wherever this test file lives, so nothing is edited by hand.
import TrialBalance from "../../../../Pages/FinanceModule/ACCOUNTS/TrialBalance/TrialBalance";

import { useDispatch, useSelector } from "react-redux";
import {
    getTrialBalance,
    getTrialBalanceDashboard,
} from "../../../../Redux/finance/accounts/TrialBalanceslice";

// NOTE: the real `useTrialBalance` hook and `TrialBalanceColumns` are intentionally
// NOT mocked, so these tests exercise page + hook + columns together. Only the
// Redux plumbing and the presentational children are mocked.

// ---- react-redux ----
vi.mock("react-redux", () => ({
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
}));

// ---- Redux slice (actions are plain marker objects) ----
vi.mock("../../../../Redux/finance/accounts/TrialBalanceslice", () => ({
    getTrialBalance: vi.fn((params) => ({ type: "getTrialBalance", params })),
    getTrialBalanceDashboard: vi.fn((params) => ({ type: "getTrialBalanceDashboard", params })),
}));

// ---- Styled-component mocks (plain elements) ----
vi.mock("../../../../Pages/FinanceModule/ACCOUNTS/TrialBalance/TrialBalance.styles", () => ({
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
    SectionIcon: ({ children }) => <span>{children}</span>,
    SectionTitle: ({ children }) => <h3>{children}</h3>,
    SectionCount: ({ children }) => <span>{children}</span>,
    SectionTotal: ({ children }) => <span data-testid="section-total">{children}</span>,
    TableWrapper: ({ children }) => <div>{children}</div>,
    Table: ({ children }) => <table>{children}</table>,
    TableHead: ({ children }) => <thead>{children}</thead>,
    TableHeader: ({ children }) => <th>{children}</th>,
    TableBody: ({ children }) => <tbody>{children}</tbody>,
    TableRow: ({ children }) => <tr>{children}</tr>,
    TableCell: ({ children }) => <td>{children}</td>,
    ExportButton: ({ children, ...props }) => <button {...props}>{children}</button>,
    BalanceSummary: ({ children }) => <div data-testid="balance-summary">{children}</div>,
    BalanceStatus: ({ children }) => <div>{children}</div>,
    BalanceTitle: ({ children }) => <div data-testid="balance-title">{children}</div>,
    BalanceDescription: ({ children }) => <div data-testid="balance-description">{children}</div>,
    BalanceTotals: ({ children }) => <div>{children}</div>,
    BalanceItem: ({ children }) => <div data-testid="balance-item">{children}</div>,
    BalanceLabel: ({ children }) => <span>{children}</span>,
    BalanceAmount: ({ children }) => <span data-testid="balance-amount">{children}</span>,
}));

vi.mock("../../../../Components/ReusableTable/ReusableHeader", () => ({
    default: ({ title, breadcrumbs = [], children }) => (
        <div data-testid="reusable-header">
            <h1>{title}</h1>
            <div data-testid="breadcrumbs">{breadcrumbs.join(" / ")}</div>
            <div data-testid="header-actions">{children}</div>
        </div>
    ),
}));

// Each card is a button so the card's onClick (filter by type) can be exercised.
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

// ---- Fixtures ----

const buildAccount = (overrides = {}) => ({
    account_id: 1,
    account_code: "1000",
    account_name: "Cash",
    account_type_label: "Asset",
    debit_amount: "4000",
    credit_amount: "0",
    ...overrides,
});

const buildGroups = () => [
    {
        type: "asset",
        label: "Assets",
        total_debit: "5000",
        total_credit: "1000",
        accounts: [
            buildAccount(),
            buildAccount({
                account_id: 2,
                account_code: "1100",
                account_name: "Bank",
                debit_amount: "1000",
                credit_amount: "1000",
            }),
        ],
    },
    {
        type: "liability",
        label: "Liabilities",
        total_debit: "0",
        total_credit: "3000",
        accounts: [
            buildAccount({
                account_id: 3,
                account_code: "2000",
                account_name: "Payables",
                account_type_label: "Liability",
                debit_amount: "0",
                credit_amount: "3000",
            }),
        ],
    },
    // empty group -> must be hidden
    { type: "equity", label: "Equity", total_debit: "0", total_credit: "0", accounts: [] },
];

const buildState = (overrides = {}) => ({
    trialBalance: {
        groups: buildGroups(),
        dashboard: {
            is_balanced: true,
            total_debit: 5000,
            total_credit: 5000,
            difference: 0,
            total_asset: 4000,
            total_liability: 3000,
            total_equity: 1000,
            total_revenue: 2500.5,
            total_expense: 800,
        },
        loading: false,
        error: null,
        dashboardError: null,
        ...overrides,
    },
});

const getStats = () => within(screen.getByTestId("stats-cards"));
const getStat = (title) => getStats().getByText(title).nextSibling;

const sectionAt = (i) => within(screen.getAllByTestId("account-section")[i]);

const sectionRows = (i) =>
    sectionAt(i)
        .getAllByRole("row")
        .slice(1) // skip the header row
        .map((tr) =>
            within(tr)
                .getAllByRole("cell")
                .map((c) => c.textContent)
        );

const lastCallParams = (fn) => fn.mock.calls[fn.mock.calls.length - 1][0];

const readBlob = (blob) =>
    new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsText(blob);
    });

describe("TrialBalance", () => {
    let dispatchMock;
    const originalCreateObjectURL = URL.createObjectURL;
    const originalRevokeObjectURL = URL.revokeObjectURL;
    const originalPrint = window.print;

    const setupSelectors = (overrides = {}) => {
        const state = buildState(overrides);
        vi.mocked(useSelector).mockImplementation((selector) => selector(state));
        return state;
    };

    beforeEach(() => {
        vi.clearAllMocks();
        dispatchMock = vi.fn((action) => action);
        vi.mocked(useDispatch).mockReturnValue(dispatchMock);
        setupSelectors();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
        URL.createObjectURL = originalCreateObjectURL;
        URL.revokeObjectURL = originalRevokeObjectURL;
        window.print = originalPrint;
    });

    // ---- Structure ----

    it("renders the header, stats, filters and account sections", () => {
        render(<TrialBalance />);

        expect(screen.getByText("Trial Balance", { selector: "h1" })).toBeInTheDocument();
        expect(screen.getByTestId("stats-cards")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Search Account")).toBeInTheDocument();
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.getAllByTestId("account-section")).toHaveLength(2);
    });

    it("renders the Accounting / Trial Balance breadcrumbs", () => {
        render(<TrialBalance />);

        expect(screen.getByTestId("breadcrumbs")).toHaveTextContent("Accounting / Trial Balance");
    });

    it("renders both export buttons in the header actions", () => {
        render(<TrialBalance />);

        const actions = within(screen.getByTestId("header-actions"));
        expect(actions.getByText("EXPORT EXCEL")).toBeInTheDocument();
        expect(actions.getByText("EXPORT PDF")).toBeInTheDocument();
    });

    // ---- Initial fetch ----

    it("dispatches getTrialBalance once on mount with no params", () => {
        render(<TrialBalance />);

        expect(getTrialBalance).toHaveBeenCalledTimes(1);
        expect(getTrialBalance).toHaveBeenCalledWith({});
        expect(dispatchMock).toHaveBeenCalledWith({ type: "getTrialBalance", params: {} });
    });

    it("dispatches getTrialBalanceDashboard once on mount with no params", () => {
        render(<TrialBalance />);

        expect(getTrialBalanceDashboard).toHaveBeenCalledTimes(1);
        expect(getTrialBalanceDashboard).toHaveBeenCalledWith({});
        expect(dispatchMock).toHaveBeenCalledWith({
            type: "getTrialBalanceDashboard",
            params: {},
        });
    });

    // ---- Stats ----

    it("renders the five stat cards in order", () => {
        render(<TrialBalance />);

        const titles = screen.getAllByTestId("stat-card").map((c) => c.firstChild.textContent);
        expect(titles).toEqual(["Assets", "Liabilities", "Equity", "Income", "Expenses"]);
    });

    it("shows each stat formatted to 2 decimals", () => {
        render(<TrialBalance />);

        expect(getStat("Assets")).toHaveTextContent("4,000.00");
        expect(getStat("Liabilities")).toHaveTextContent("3,000.00");
        expect(getStat("Equity")).toHaveTextContent("1,000.00");
        expect(getStat("Income")).toHaveTextContent("2,500.50");
        expect(getStat("Expenses")).toHaveTextContent("800.00");
    });

    it("falls back to total_income when total_revenue is missing", () => {
        setupSelectors({
            dashboard: { is_balanced: true, total_income: 99 },
        });
        render(<TrialBalance />);

        expect(getStat("Income")).toHaveTextContent("99.00");
    });

    it("prefers total_revenue over total_income", () => {
        setupSelectors({
            dashboard: { is_balanced: true, total_revenue: 10, total_income: 99 },
        });
        render(<TrialBalance />);

        expect(getStat("Income")).toHaveTextContent("10.00");
    });

    it("shows 0.00 for every stat when the dashboard is missing", () => {
        setupSelectors({ dashboard: null });
        render(<TrialBalance />);

        ["Assets", "Liabilities", "Equity", "Income", "Expenses"].forEach((title) =>
            expect(getStat(title)).toHaveTextContent("0.00")
        );
    });

    it("filters by type when a stat card is clicked", () => {
        render(<TrialBalance />);

        fireEvent.click(getStats().getByText("Liabilities"));

        expect(screen.getByRole("combobox")).toHaveValue("liability");
        expect(getTrialBalance).toHaveBeenLastCalledWith({ type: "liability" });
    });

    // ---- Balance banner ----

    it("shows the balanced banner with its description", () => {
        render(<TrialBalance />);

        expect(screen.getByTestId("balance-title")).toHaveTextContent("✓ Books Are Balanced");
        expect(screen.getByTestId("balance-description")).toHaveTextContent(
            "Total Debit equals Total Credit — no accounting errors detected"
        );
    });

    it("shows the not-balanced banner when is_balanced is false", () => {
        setupSelectors({
            dashboard: {
                is_balanced: false,
                total_debit: 5000,
                total_credit: 4000,
                difference: 1000,
            },
        });
        render(<TrialBalance />);

        expect(screen.getByTestId("balance-title")).toHaveTextContent("✕ Books Are Not Balanced");
        expect(screen.getByTestId("balance-description")).toHaveTextContent(
            "Total Debit does not equal Total Credit — please review your entries"
        );
    });

    it("treats an empty dashboard object as not balanced", () => {
        setupSelectors({ dashboard: {} });
        render(<TrialBalance />);

        expect(screen.getByTestId("balance-title")).toHaveTextContent("Books Are Not Balanced");
    });

    it("shows total debit, total credit and difference in SAR", () => {
        setupSelectors({
            dashboard: {
                is_balanced: false,
                total_debit: 5000,
                total_credit: 4000.5,
                difference: 999.5,
            },
        });
        render(<TrialBalance />);

        const labels = screen
            .getAllByTestId("balance-item")
            .map((item) => item.firstChild.textContent);
        expect(labels).toEqual(["TOTAL DEBIT", "TOTAL CREDIT", "DIFFERENCE"]);

        const amounts = screen.getAllByTestId("balance-amount").map((a) => a.textContent);
        expect(amounts).toEqual(["SAR 5,000.00", "SAR 4,000.50", "SAR 999.50"]);
    });

    it("hides the banner entirely when there is no dashboard", () => {
        setupSelectors({ dashboard: null });
        render(<TrialBalance />);

        expect(screen.queryByTestId("balance-summary")).not.toBeInTheDocument();
    });

    // ---- Sections ----

    it("renders a section per non-empty group, in API order", () => {
        render(<TrialBalance />);

        const titles = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
        expect(titles).toEqual(["ASSETS", "LIABILITIES"]);
    });

    it("hides groups that have no accounts", () => {
        render(<TrialBalance />);

        expect(screen.queryByText("EQUITY")).not.toBeInTheDocument();
    });

    it("shows the normal balance for each section", () => {
        render(<TrialBalance />);

        expect(sectionAt(0).getByText("Normal balance: Debit")).toBeInTheDocument();
        expect(sectionAt(1).getByText("Normal balance: Credit")).toBeInTheDocument();
    });

    it("applies the type's class name to the section header", () => {
        render(<TrialBalance />);

        const headers = screen.getAllByTestId("section-header");
        expect(headers[0]).toHaveClass("assets");
        expect(headers[1]).toHaveClass("liabilities");
    });

    it("prefers the API group label over the built-in label", () => {
        const groups = buildGroups();
        groups[0].label = "Fixed Assets";
        setupSelectors({ groups });
        render(<TrialBalance />);

        expect(screen.getByText("FIXED ASSETS")).toBeInTheDocument();
    });

    it("falls back to the built-in label when the group has no label", () => {
        const groups = buildGroups();
        delete groups[0].label;
        setupSelectors({ groups });
        render(<TrialBalance />);

        expect(screen.getByText("ASSETS")).toBeInTheDocument();
    });

    it("uses the 'Other' / Debit fallback for an unknown group type", () => {
        setupSelectors({
            groups: [
                {
                    type: "mystery",
                    total_debit: "10",
                    total_credit: "0",
                    accounts: [buildAccount()],
                },
            ],
        });
        render(<TrialBalance />);

        expect(screen.getByText("OTHER")).toBeInTheDocument();
        expect(screen.getByText("Normal balance: Debit")).toBeInTheDocument();
    });

    // CURRENT BEHAVIOR: the hook puts the raw number in totalText (no formatAmount),
    // so 4000 shows as "4000", not "4,000.00". Update these if you format it later.
    it("CURRENT BEHAVIOR: section total is net of the normal balance and not formatted", () => {
        render(<TrialBalance />);

        const totals = screen.getAllByTestId("section-total").map((t) => t.textContent);
        // asset (debit normal): 5000 - 1000, liability (credit normal): 3000 - 0
        expect(totals).toEqual(["4000", "3000"]);
    });

    it("computes a credit-normal section total as credit minus debit", () => {
        setupSelectors({
            groups: [
                {
                    type: "revenue",
                    label: "Income",
                    total_debit: "200",
                    total_credit: "1000",
                    accounts: [buildAccount()],
                },
            ],
        });
        render(<TrialBalance />);

        expect(screen.getByTestId("section-total")).toHaveTextContent("800");
    });

    // ---- Account tables ----

    it("renders the column headers in every section", () => {
        render(<TrialBalance />);

        [0, 1].forEach((i) => {
            const headers = sectionAt(i)
                .getAllByRole("columnheader")
                .map((h) => h.textContent);
            expect(headers).toEqual(["Code", "Account Name", "Debit", "Credit"]);
        });
    });

    it("renders a row per account with formatted debit and credit", () => {
        render(<TrialBalance />);

        expect(sectionRows(0)).toEqual([
            ["1000", "Cash", "4,000.00", "0.00"],
            ["1100", "Bank", "1,000.00", "1,000.00"],
        ]);
        expect(sectionRows(1)).toEqual([["2000", "Payables", "0.00", "3,000.00"]]);
    });

    it("formats missing or invalid amounts as 0.00", () => {
        setupSelectors({
            groups: [
                {
                    type: "asset",
                    label: "Assets",
                    total_debit: "0",
                    total_credit: "0",
                    accounts: [
                        buildAccount({ debit_amount: undefined, credit_amount: null }),
                        buildAccount({
                            account_id: 2,
                            account_code: "1100",
                            debit_amount: "abc",
                            credit_amount: "",
                        }),
                    ],
                },
            ],
        });
        render(<TrialBalance />);

        expect(sectionRows(0).map((r) => r.slice(2))).toEqual([
            ["0.00", "0.00"],
            ["0.00", "0.00"],
        ]);
    });

    // ---- Empty / loading / error states ----

    it("shows 'No accounts found.' when there are no groups", () => {
        setupSelectors({ groups: [] });
        render(<TrialBalance />);

        expect(screen.getByText("No accounts found.")).toBeInTheDocument();
    });

    it("shows 'No accounts found.' when every group is empty", () => {
        setupSelectors({
            groups: [{ type: "asset", label: "Assets", accounts: [] }],
        });
        render(<TrialBalance />);

        expect(screen.getByText("No accounts found.")).toBeInTheDocument();
        expect(screen.queryAllByTestId("account-section")).toHaveLength(0);
    });

    it("does not show 'No accounts found.' when accounts exist", () => {
        render(<TrialBalance />);

        expect(screen.queryByText("No accounts found.")).not.toBeInTheDocument();
    });

    it("shows the loading message on the initial load", () => {
        setupSelectors({ groups: [], loading: true });
        render(<TrialBalance />);

        expect(screen.getByText("Loading trial balance...")).toBeInTheDocument();
        expect(screen.queryByText("No accounts found.")).not.toBeInTheDocument();
    });

    it("keeps showing the sections (no loading message) when reloading", () => {
        setupSelectors({ loading: true });
        render(<TrialBalance />);

        expect(screen.queryByText("Loading trial balance...")).not.toBeInTheDocument();
        expect(screen.getAllByTestId("account-section")).toHaveLength(2);
    });

    it("shows a string error as-is", () => {
        setupSelectors({ error: "Network down" });
        render(<TrialBalance />);

        expect(screen.getByText("Network down")).toBeInTheDocument();
    });

    it("shows error.detail when present", () => {
        setupSelectors({ error: { detail: "Not allowed", other: "x" } });
        render(<TrialBalance />);

        expect(screen.getByText("Not allowed")).toBeInTheDocument();
    });

    it("joins DRF field errors into one line", () => {
        setupSelectors({ error: { date_from: ["Invalid date", "Too early"], type: "Bad type" } });
        render(<TrialBalance />);

        expect(
            screen.getByText("date_from: Invalid date, Too early | type: Bad type")
        ).toBeInTheDocument();
    });

    it("falls back to the dashboard error when the list has none", () => {
        setupSelectors({ dashboardError: "Dashboard failed" });
        render(<TrialBalance />);

        expect(screen.getByText("Dashboard failed")).toBeInTheDocument();
    });

    it("prefers the list error over the dashboard error", () => {
        setupSelectors({ error: "List failed", dashboardError: "Dashboard failed" });
        render(<TrialBalance />);

        expect(screen.getByText("List failed")).toBeInTheDocument();
        expect(screen.queryByText("Dashboard failed")).not.toBeInTheDocument();
    });

    it("hides the loading and empty messages while an error is shown", () => {
        setupSelectors({ groups: [], loading: true, error: "Boom" });
        const { rerender } = render(<TrialBalance />);

        expect(screen.getByText("Boom")).toBeInTheDocument();
        expect(screen.queryByText("Loading trial balance...")).not.toBeInTheDocument();

        setupSelectors({ groups: [], loading: false, error: "Boom" });
        rerender(<TrialBalance />);

        expect(screen.queryByText("No accounts found.")).not.toBeInTheDocument();
    });

    // ---- Search (debounced) ----

    it("updates the input immediately but only dispatches after the 400ms debounce", () => {
        vi.useFakeTimers();
        render(<TrialBalance />);
        const before = getTrialBalance.mock.calls.length;

        fireEvent.change(screen.getByPlaceholderText("Search Account"), {
            target: { value: "cash" },
        });

        expect(screen.getByPlaceholderText("Search Account")).toHaveValue("cash");

        act(() => {
            vi.advanceTimersByTime(399);
        });
        expect(getTrialBalance.mock.calls.length).toBe(before);

        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(getTrialBalance).toHaveBeenCalledTimes(before + 1);
        expect(getTrialBalance).toHaveBeenLastCalledWith({ search: "cash" });
    });

    it("trims the search term before sending it", () => {
        vi.useFakeTimers();
        render(<TrialBalance />);

        fireEvent.change(screen.getByPlaceholderText("Search Account"), {
            target: { value: "  cash  " },
        });
        act(() => {
            vi.advanceTimersByTime(400);
        });

        expect(getTrialBalance).toHaveBeenLastCalledWith({ search: "cash" });
    });

    it("does not send search when it is only whitespace", () => {
        vi.useFakeTimers();
        render(<TrialBalance />);
        const before = getTrialBalance.mock.calls.length;

        fireEvent.change(screen.getByPlaceholderText("Search Account"), {
            target: { value: "   " },
        });
        act(() => {
            vi.advanceTimersByTime(400);
        });

        expect(getTrialBalance.mock.calls.length).toBe(before);
        expect(lastCallParams(getTrialBalance)).not.toHaveProperty("search");
    });

    it("collapses rapid typing into a single request with the last value", () => {
        vi.useFakeTimers();
        render(<TrialBalance />);
        const before = getTrialBalance.mock.calls.length;
        const input = screen.getByPlaceholderText("Search Account");

        fireEvent.change(input, { target: { value: "c" } });
        act(() => {
            vi.advanceTimersByTime(200);
        });
        fireEvent.change(input, { target: { value: "ca" } });
        act(() => {
            vi.advanceTimersByTime(399);
        });
        expect(getTrialBalance.mock.calls.length).toBe(before);

        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(getTrialBalance).toHaveBeenCalledTimes(before + 1);
        expect(getTrialBalance).toHaveBeenLastCalledWith({ search: "ca" });
    });

    it("does not refetch the dashboard when searching", () => {
        vi.useFakeTimers();
        render(<TrialBalance />);

        fireEvent.change(screen.getByPlaceholderText("Search Account"), {
            target: { value: "cash" },
        });
        act(() => {
            vi.advanceTimersByTime(400);
        });

        expect(getTrialBalanceDashboard).toHaveBeenCalledTimes(1);
    });

    // ---- Type filter ----

    it("offers All Type plus the five account types", () => {
        render(<TrialBalance />);

        const options = within(screen.getByRole("combobox"))
            .getAllByRole("option")
            .map((o) => [o.value, o.textContent]);
        expect(options).toEqual([
            ["All", "All Type"],
            ["asset", "Assets"],
            ["liability", "Liabilities"],
            ["equity", "Equity"],
            ["revenue", "Income"],
            ["expense", "Expenses"],
        ]);
    });

    it("defaults the type filter to 'All'", () => {
        render(<TrialBalance />);

        expect(screen.getByRole("combobox")).toHaveValue("All");
    });

    it.each([["asset"], ["liability"], ["equity"], ["revenue"], ["expense"]])(
        "sends type '%s' when it is selected",
        (value) => {
            render(<TrialBalance />);

            fireEvent.change(screen.getByRole("combobox"), { target: { value } });

            expect(screen.getByRole("combobox")).toHaveValue(value);
            expect(getTrialBalance).toHaveBeenLastCalledWith({ type: value });
        }
    );

    it("omits type when 'All Type' is chosen again", () => {
        render(<TrialBalance />);

        fireEvent.change(screen.getByRole("combobox"), { target: { value: "asset" } });
        fireEvent.change(screen.getByRole("combobox"), { target: { value: "All" } });

        expect(lastCallParams(getTrialBalance)).not.toHaveProperty("type");
    });

    it("does not refetch the dashboard when the type changes", () => {
        render(<TrialBalance />);

        fireEvent.change(screen.getByRole("combobox"), { target: { value: "asset" } });

        expect(getTrialBalanceDashboard).toHaveBeenCalledTimes(1);
    });

    it("sends search and type together", () => {
        vi.useFakeTimers();
        render(<TrialBalance />);

        fireEvent.change(screen.getByRole("combobox"), { target: { value: "expense" } });
        fireEvent.change(screen.getByPlaceholderText("Search Account"), {
            target: { value: "rent" },
        });
        act(() => {
            vi.advanceTimersByTime(400);
        });

        expect(getTrialBalance).toHaveBeenLastCalledWith({ search: "rent", type: "expense" });
    });

    // ---- Export Excel (CSV) ----

    describe("export excel", () => {
        let createObjectURL;
        let revokeObjectURL;
        let clickedLinks;

        beforeEach(() => {
            createObjectURL = vi.fn(() => "blob:mock-url");
            revokeObjectURL = vi.fn();
            URL.createObjectURL = createObjectURL;
            URL.revokeObjectURL = revokeObjectURL;

            clickedLinks = [];
            vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function () {
                clickedLinks.push(this);
            });
        });

        it("downloads trial-balance.csv through a temporary link", () => {
            render(<TrialBalance />);

            fireEvent.click(screen.getByText("EXPORT EXCEL"));

            expect(createObjectURL).toHaveBeenCalledTimes(1);
            expect(clickedLinks).toHaveLength(1);
            expect(clickedLinks[0].download).toBe("trial-balance.csv");
            expect(clickedLinks[0].getAttribute("href")).toBe("blob:mock-url");
            expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
        });

        it("creates a UTF-8 CSV blob", () => {
            render(<TrialBalance />);

            fireEvent.click(screen.getByText("EXPORT EXCEL"));

            const blob = createObjectURL.mock.calls[0][0];
            expect(blob).toBeInstanceOf(Blob);
            expect(blob.type).toBe("text/csv;charset=utf-8;");
        });

        it("writes a header line and one quoted line per account across all sections", async () => {
            render(<TrialBalance />);

            fireEvent.click(screen.getByText("EXPORT EXCEL"));

            const text = await readBlob(createObjectURL.mock.calls[0][0]);
            expect(text.split("\n")).toEqual([
                '"Code","Account Name","Type","Debit (SAR)","Credit (SAR)"',
                '"1000","Cash","Assets","4000.00","0.00"',
                '"1100","Bank","Assets","1000.00","1000.00"',
                '"2000","Payables","Liabilities","0.00","3000.00"',
            ]);
        });

        it("escapes double quotes inside cells", async () => {
            setupSelectors({
                groups: [
                    {
                        type: "asset",
                        label: "Assets",
                        total_debit: "1",
                        total_credit: "0",
                        accounts: [buildAccount({ account_name: 'Petty "Cash"' })],
                    },
                ],
            });
            render(<TrialBalance />);

            fireEvent.click(screen.getByText("EXPORT EXCEL"));

            const text = await readBlob(createObjectURL.mock.calls[0][0]);
            expect(text.split("\n")[1]).toBe('"1000","Petty ""Cash""","Assets","4000.00","0.00"');
        });

        it("exports only the header when there are no accounts", async () => {
            setupSelectors({ groups: [] });
            render(<TrialBalance />);

            fireEvent.click(screen.getByText("EXPORT EXCEL"));

            const text = await readBlob(createObjectURL.mock.calls[0][0]);
            expect(text).toBe('"Code","Account Name","Type","Debit (SAR)","Credit (SAR)"');
        });

        it("does not refetch when exporting", () => {
            render(<TrialBalance />);
            const before = getTrialBalance.mock.calls.length;

            fireEvent.click(screen.getByText("EXPORT EXCEL"));

            expect(getTrialBalance.mock.calls.length).toBe(before);
        });
    });

    // ---- Export PDF ----

    it("opens the print dialog when EXPORT PDF is clicked (placeholder)", () => {
        const printSpy = vi.fn();
        window.print = printSpy;
        render(<TrialBalance />);

        fireEvent.click(screen.getByText("EXPORT PDF"));

        expect(printSpy).toHaveBeenCalledTimes(1);
    });

    it("does not refetch when EXPORT PDF is clicked", () => {
        window.print = vi.fn();
        render(<TrialBalance />);
        const before = getTrialBalance.mock.calls.length;

        fireEvent.click(screen.getByText("EXPORT PDF"));

        expect(getTrialBalance.mock.calls.length).toBe(before);
    });
});