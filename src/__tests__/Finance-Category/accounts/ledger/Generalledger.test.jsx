import React from "react";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// ---- PLACEMENT ----
// Put this file in the SAME folder as GeneralLedger.jsx. Every import and
// vi.mock() path below is then identical to the ones GeneralLedger.jsx itself
// uses, so nothing needs to be edited.
//
// If you want it under src/__tests__/..., replace every "../../../../" with the
// relative path from the new location up to src/ (and "./" with the path to the
// page folder).
import GeneralLedger from "../../../../Pages/FinanceModule/ACCOUNTS/General Ledger/GeneralLedger";

import { useDispatch, useSelector } from "react-redux";
import {
    getLedgerEntries,
    getDashboardSummary,
    getCustomerWiseSummary,
} from "../../../../Redux/finance/accounts/Ledgerslice";

// NOTE: the real `useGeneralLedger` hook is intentionally NOT mocked, so these
// tests exercise the page + hook together. Only the Redux plumbing and the
// presentational children are mocked.

// ---- react-redux ----
vi.mock("react-redux", () => ({
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
}));

// ---- Redux slice (actions are plain marker objects) ----
vi.mock("../../../../Redux/finance/accounts/Ledgerslice", () => ({
    getLedgerEntries: vi.fn((params) => ({ type: "getLedgerEntries", params })),
    getDashboardSummary: vi.fn((params) => ({ type: "getDashboardSummary", params })),
    getCustomerWiseSummary: vi.fn((params) => ({ type: "getCustomerWiseSummary", params })),
}));

// ---- Presentational mocks ----
vi.mock("../../../../Pages/FinanceModule/ACCOUNTS/General Ledger/GeneralLedger.styles", () => ({
    BalanceBanner: ({ children }) => <div data-testid="balance-banner">{children}</div>,
    BalanceStatus: ({ children }) => <span data-testid="balance-status">{children}</span>,
    BalanceAmount: ({ children }) => <span data-testid="balance-amount">{children}</span>,
    ExportButton: ({ children, ...props }) => <button {...props}>{children}</button>,
    DateRangeWrapper: ({ children }) => <div data-testid="date-range">{children}</div>,
    DatePickerContainer: ({ children }) => <div>{children}</div>,
    DateInput: (props) => <input {...props} />,
    DateSeparator: ({ children }) => <span>{children}</span>,
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

vi.mock("../../../../Components/StatsCards/StatsCards", () => ({
    default: ({ cards = [] }) => (
        <div data-testid="stats-cards">
            {cards.map((c) => (
                <div key={c.title} data-testid="stat-card">
                    <span>{c.title}</span>
                    <span>{String(c.count)}</span>
                </div>
            ))}
        </div>
    ),
}));

// Each filter renders a <select>; the placeholder becomes the first ("all") option.
vi.mock("../../../../Components/ReusableTable/ReusableFilter", () => ({
    default: ({ search, onSearch, searchPlaceholder, showSearch, filters = [] }) => (
        <div data-testid="reusable-filter">
            {showSearch ? (
                <input
                    data-testid="search-input"
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                />
            ) : null}

            {filters.map((f) => (
                <select
                    key={f.key}
                    data-testid={`filter-${f.key}`}
                    data-placeholder={f.placeholder}
                    value={f.value}
                    onChange={(e) => f.onChange(e.target.value)}
                >
                    <option value="all">{f.placeholder}</option>
                    {f.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ))}
        </div>
    ),
}));

vi.mock("../../../../Components/ReusableTable/ReusableTable", () => ({
    default: ({ columns = [], data = [] }) => (
        <div data-testid="reusable-table">
            <table>
                <thead>
                    <tr>
                        {columns.map((c) => (
                            <th key={c.accessor}>{c.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => (
                        <tr key={i} data-testid="table-row">
                            {columns.map((c) => (
                                <td key={c.accessor}>
                                    {c.render ? c.render(row) : row[c.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ),
}));

vi.mock("../../../../Components/Pagination/ReusablePagination", () => ({
    default: ({ currentPage, totalPages, onPageChange }) => (
        <div data-testid="pagination">
            <span>
                {currentPage}/{totalPages}
            </span>
            <button onClick={() => onPageChange(currentPage + 1)}>next-page</button>
        </div>
    ),
}));

// ---- Fixtures ----

const buildEntry = (overrides = {}) => ({
    transaction_date: "2026-01-05",
    customer_name: "Alpha Corp",
    transaction_type_display: "Invoice",
    reference_number: "INV-001",
    description: "January invoice",
    debit: "1000",
    credit: "0",
    balance: "1000",
    ...overrides,
});

const buildState = (overrides = {}) => ({
    ledger: {
        ledgerEntries: [
            buildEntry(),
            buildEntry({
                transaction_date: "2026-01-10",
                customer_name: "Beta Ltd",
                transaction_type_display: "Payment",
                reference_number: "PAY-001",
                description: "Payment received",
                debit: 0,
                credit: 2500.5,
                balance: -1500.5,
            }),
            buildEntry({
                transaction_date: "2026-01-15",
                customer_name: "Gamma Inc",
                transaction_type_display: "Adjustment",
                reference_number: "ADJ-001",
                description: "",
                debit: null,
                credit: undefined,
                balance: "",
            }),
        ],
        ledgerPagination: { totalPages: 3 },
        dashboardSummary: {
            total_receivable: 20000,
            total_invoice: 50000,
            total_collection: 30000,
            total_credit: 1500.5,
            overdue_amount: 4000.25,
        },
        customerSummaries: [
            { customer_name: "Alpha Corp", customer_code: "C001" },
            { customer_name: "Beta Ltd", customer_code: "C002" },
        ],
        loading: false,
        error: null,
        ...overrides,
    },
});

const DEFAULT_PARAMS = { page: 1, page_size: 10 };

const lastLedgerParams = () => {
    const calls = getLedgerEntries.mock.calls;
    return calls[calls.length - 1][0];
};

const getStat = (title) =>
    within(screen.getByTestId("stats-cards")).getByText(title).nextSibling;

const optionLabels = (testId) =>
    within(screen.getByTestId(testId))
        .getAllByRole("option")
        .map((o) => o.textContent);

const rowCells = (rowIndex) =>
    within(screen.getAllByTestId("table-row")[rowIndex])
        .getAllByRole("cell")
        .map((c) => c.textContent);

describe("GeneralLedger", () => {
    let dispatchMock;

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
    });

    // ---- Structure ----

    it("renders header, stats, filter, banner, table and pagination", () => {
        render(<GeneralLedger />);

        expect(screen.getByText("General Ledger", { selector: "h1" })).toBeInTheDocument();
        expect(screen.getByTestId("stats-cards")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-filter")).toBeInTheDocument();
        expect(screen.getByTestId("balance-banner")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });

    it("renders the Accounting / General Ledger breadcrumbs", () => {
        render(<GeneralLedger />);

        expect(screen.getByTestId("breadcrumbs")).toHaveTextContent("Accounting / General Ledger");
    });

    it("renders the date range and both export buttons in the header actions", () => {
        render(<GeneralLedger />);

        const actions = within(screen.getByTestId("header-actions"));
        expect(actions.getByTestId("date-range")).toBeInTheDocument();
        expect(actions.getByLabelText("Start date")).toBeInTheDocument();
        expect(actions.getByLabelText("End date")).toBeInTheDocument();
        expect(actions.getByText("Export Excel")).toBeInTheDocument();
        expect(actions.getByText("Export PDF")).toBeInTheDocument();
    });

    // ---- Initial fetch ----

    it("dispatches the dashboard summary once on mount", () => {
        render(<GeneralLedger />);

        expect(getDashboardSummary).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith({
            type: "getDashboardSummary",
            params: undefined,
        });
    });

    it("loads up to 100 customers for the account dropdown on mount", () => {
        render(<GeneralLedger />);

        expect(getCustomerWiseSummary).toHaveBeenCalledTimes(1);
        expect(getCustomerWiseSummary).toHaveBeenCalledWith({ page: 1, page_size: 100 });
    });

    it("dispatches getLedgerEntries once on mount with only page and page_size", () => {
        render(<GeneralLedger />);

        expect(getLedgerEntries).toHaveBeenCalledTimes(1);
        expect(getLedgerEntries).toHaveBeenCalledWith(DEFAULT_PARAMS);
        expect(dispatchMock).toHaveBeenCalledWith({
            type: "getLedgerEntries",
            params: DEFAULT_PARAMS,
        });
    });

    // ---- Stats ----

    it("renders the five stat cards in order", () => {
        render(<GeneralLedger />);

        const titles = screen.getAllByTestId("stat-card").map((c) => c.firstChild.textContent);
        expect(titles).toEqual([
            "Total Receivable",
            "Total Invoice",
            "Total Collection",
            "Total Credit",
            "Overdue Amount",
        ]);
    });

    it("shows stat amounts formatted to 2 decimals", () => {
        render(<GeneralLedger />);

        expect(getStat("Total Receivable")).toHaveTextContent("20,000.00");
        expect(getStat("Total Invoice")).toHaveTextContent("50,000.00");
        expect(getStat("Total Collection")).toHaveTextContent("30,000.00");
        expect(getStat("Total Credit")).toHaveTextContent("1,500.50");
        expect(getStat("Overdue Amount")).toHaveTextContent("4,000.25");
    });

    it("shows 0.00 for every stat when the dashboard summary is missing", () => {
        setupSelectors({ dashboardSummary: undefined });
        render(<GeneralLedger />);

        ["Total Receivable", "Total Invoice", "Total Collection", "Total Credit", "Overdue Amount"].forEach(
            (title) => expect(getStat(title)).toHaveTextContent("0.00")
        );
    });

    // ---- Balance banner ----

    it("shows the 'Books are balanced' status", () => {
        render(<GeneralLedger />);

        expect(screen.getByTestId("balance-status")).toHaveTextContent("Books are balanced");
    });

    it("shows the invoice - collection = receivable equation in SAR", () => {
        render(<GeneralLedger />);

        expect(screen.getByTestId("balance-amount")).toHaveTextContent(
            "Total Invoice: SAR 50,000.00 - Collection: SAR 30,000.00 = Receivable: SAR 20,000.00"
        );
    });

    it("shows a zeroed equation when the dashboard summary is missing", () => {
        setupSelectors({ dashboardSummary: undefined });
        render(<GeneralLedger />);

        expect(screen.getByTestId("balance-amount")).toHaveTextContent(
            "Total Invoice: SAR 0.00 - Collection: SAR 0.00 = Receivable: SAR 0.00"
        );
    });

    // ---- Table ----

    it("renders the table headers", () => {
        render(<GeneralLedger />);

        const headers = screen.getAllByRole("columnheader").map((h) => h.textContent);
        expect(headers).toEqual([
            "Date",
            "Customer",
            "Type",
            "Reference",
            "Description",
            "Debit",
            "Credit",
            "Balance",
        ]);
    });

    it("renders a row per ledger entry with formatted debit, credit and balance", () => {
        render(<GeneralLedger />);

        expect(screen.getAllByTestId("table-row")).toHaveLength(3);
        expect(rowCells(0)).toEqual([
            "2026-01-05",
            "Alpha Corp",
            "Invoice",
            "INV-001",
            "January invoice",
            "1,000.00",
            "0.00",
            "1,000.00",
        ]);
        expect(rowCells(1).slice(5, 8)).toEqual(["0.00", "2,500.50", "-1,500.50"]);
    });

    it("formats missing debit, credit and balance as 0.00", () => {
        render(<GeneralLedger />);

        expect(rowCells(2).slice(5, 8)).toEqual(["0.00", "0.00", "0.00"]);
    });

    it("renders no rows for an empty list", () => {
        setupSelectors({ ledgerEntries: [] });
        render(<GeneralLedger />);

        expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
        expect(screen.queryAllByTestId("table-row")).toHaveLength(0);
    });

    // ---- Loading ----

    it("shows 'Loading...' instead of the table on the initial load", () => {
        setupSelectors({ loading: true, ledgerEntries: [] });
        render(<GeneralLedger />);

        expect(screen.getByText("Loading...")).toBeInTheDocument();
        expect(screen.queryByTestId("reusable-table")).not.toBeInTheDocument();
    });

    it("keeps showing the table while reloading when entries already exist", () => {
        setupSelectors({ loading: true });
        render(<GeneralLedger />);

        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
        expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
        expect(screen.getAllByTestId("table-row")).toHaveLength(3);
    });

    it("does not show 'Loading...' when not loading", () => {
        render(<GeneralLedger />);

        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // ---- Error ----

    it("shows no error message when there is no error", () => {
        render(<GeneralLedger />);

        expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
    });

    it("shows a string error as-is", () => {
        setupSelectors({ error: "Network down" });
        render(<GeneralLedger />);

        expect(screen.getByText("Network down")).toBeInTheDocument();
    });

    it("prefers error.detail over error.message", () => {
        setupSelectors({ error: { detail: "Detail msg", message: "Message msg" } });
        render(<GeneralLedger />);

        expect(screen.getByText("Detail msg")).toBeInTheDocument();
        expect(screen.queryByText("Message msg")).not.toBeInTheDocument();
    });

    it("falls back to error.message", () => {
        setupSelectors({ error: { message: "Message msg" } });
        render(<GeneralLedger />);

        expect(screen.getByText("Message msg")).toBeInTheDocument();
    });

    it("falls back to a generic message for unknown error shapes", () => {
        setupSelectors({ error: {} });
        render(<GeneralLedger />);

        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    // ---- Search (debounced) ----

    it("renders the search placeholder", () => {
        render(<GeneralLedger />);

        expect(
            screen.getByPlaceholderText("Search customer, reference or description")
        ).toBeInTheDocument();
    });

    it("updates the input immediately but only dispatches after the 400ms debounce", () => {
        vi.useFakeTimers();
        render(<GeneralLedger />);
        const before = getLedgerEntries.mock.calls.length;

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "inv" } });

        expect(screen.getByTestId("search-input")).toHaveValue("inv");

        act(() => {
            vi.advanceTimersByTime(399);
        });
        expect(getLedgerEntries.mock.calls.length).toBe(before);

        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(getLedgerEntries).toHaveBeenCalledTimes(before + 1);
        expect(getLedgerEntries).toHaveBeenLastCalledWith({
            ...DEFAULT_PARAMS,
            search: "inv",
        });
    });

    it("trims the search term before sending it", () => {
        vi.useFakeTimers();
        render(<GeneralLedger />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "  inv  " } });
        act(() => {
            vi.advanceTimersByTime(400);
        });

        expect(getLedgerEntries).toHaveBeenLastCalledWith(
            expect.objectContaining({ search: "inv" })
        );
    });

    it("omits search from the request when it is only whitespace", () => {
        vi.useFakeTimers();
        render(<GeneralLedger />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "   " } });
        act(() => {
            vi.advanceTimersByTime(400);
        });

        expect(lastLedgerParams()).not.toHaveProperty("search");
    });

    it("collapses rapid typing into a single request with the last value", () => {
        vi.useFakeTimers();
        render(<GeneralLedger />);
        const before = getLedgerEntries.mock.calls.length;

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "a" } });
        act(() => {
            vi.advanceTimersByTime(200);
        });
        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "ab" } });
        act(() => {
            vi.advanceTimersByTime(399);
        });
        expect(getLedgerEntries.mock.calls.length).toBe(before);

        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(getLedgerEntries).toHaveBeenCalledTimes(before + 1);
        expect(getLedgerEntries).toHaveBeenLastCalledWith(
            expect.objectContaining({ search: "ab" })
        );
    });

    it("resets to page 1 once the debounced search is applied", () => {
        vi.useFakeTimers();
        render(<GeneralLedger />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        expect(getLedgerEntries).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }));

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "x" } });
        act(() => {
            vi.advanceTimersByTime(400);
        });

        expect(getLedgerEntries).toHaveBeenLastCalledWith({
            page: 1,
            page_size: 10,
            search: "x",
        });
    });

    // ---- Account filter ----

    it("builds account options as 'Name (CODE)' with 'All Accounts' first", () => {
        render(<GeneralLedger />);

        expect(optionLabels("filter-account")).toEqual([
            "All Accounts",
            "Alpha Corp (C001)",
            "Beta Ltd (C002)",
        ]);
    });

    it("uses 'All Accounts' as the placeholder and 'all' as the default value", () => {
        render(<GeneralLedger />);

        const select = screen.getByTestId("filter-account");
        expect(select).toHaveAttribute("data-placeholder", "All Accounts");
        expect(select).toHaveValue("all");
    });

    it("has only 'All Accounts' when no customers are loaded", () => {
        setupSelectors({ customerSummaries: [] });
        render(<GeneralLedger />);

        expect(optionLabels("filter-account")).toEqual(["All Accounts"]);
    });

    it("sends customer_code and resets to page 1 when an account is selected", () => {
        render(<GeneralLedger />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.change(screen.getByTestId("filter-account"), { target: { value: "C002" } });

        expect(screen.getByTestId("filter-account")).toHaveValue("C002");
        expect(getLedgerEntries).toHaveBeenLastCalledWith({
            page: 1,
            page_size: 10,
            customer_code: "C002",
        });
    });

    it("omits customer_code when 'All Accounts' is chosen again", () => {
        render(<GeneralLedger />);

        fireEvent.change(screen.getByTestId("filter-account"), { target: { value: "C002" } });
        fireEvent.change(screen.getByTestId("filter-account"), { target: { value: "all" } });

        expect(lastLedgerParams()).not.toHaveProperty("customer_code");
    });

    // ---- Type filter ----

    it("offers all the transaction types with 'All Types' first", () => {
        render(<GeneralLedger />);

        expect(optionLabels("filter-type")).toEqual([
            "All Types",
            "Opening Balance",
            "Invoice",
            "Payment",
            "Credit Note",
            "Adjustment",
        ]);
    });

    it("uses 'All Types' as the placeholder and 'all' as the default value", () => {
        render(<GeneralLedger />);

        const select = screen.getByTestId("filter-type");
        expect(select).toHaveAttribute("data-placeholder", "All Types");
        expect(select).toHaveValue("all");
    });

    it.each([
        ["opening_balance"],
        ["invoice"],
        ["payment"],
        ["credit_note"],
        ["adjustment"],
    ])("sends transaction_type '%s' and resets to page 1", (value) => {
        render(<GeneralLedger />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.change(screen.getByTestId("filter-type"), { target: { value } });

        expect(getLedgerEntries).toHaveBeenLastCalledWith({
            page: 1,
            page_size: 10,
            transaction_type: value,
        });
    });

    it("omits transaction_type when 'All Types' is chosen again", () => {
        render(<GeneralLedger />);

        fireEvent.change(screen.getByTestId("filter-type"), { target: { value: "invoice" } });
        fireEvent.change(screen.getByTestId("filter-type"), { target: { value: "all" } });

        expect(lastLedgerParams()).not.toHaveProperty("transaction_type");
    });

    // ---- Source filter ----

    it("offers all the sources with 'All Sources' first", () => {
        render(<GeneralLedger />);

        expect(optionLabels("filter-source")).toEqual([
            "All Sources",
            "Invoice",
            "Payment",
            "Opening Balance",
            "Manual",
        ]);
    });

    it("uses 'All Sources' as the placeholder and 'all' as the default value", () => {
        render(<GeneralLedger />);

        const select = screen.getByTestId("filter-source");
        expect(select).toHaveAttribute("data-placeholder", "All Sources");
        expect(select).toHaveValue("all");
    });

    it.each([["invoice"], ["payment"], ["opening_balance"], ["manual"]])(
        "sends source '%s' and resets to page 1",
        (value) => {
            render(<GeneralLedger />);

            fireEvent.click(screen.getByText("next-page")); // -> page 2
            fireEvent.change(screen.getByTestId("filter-source"), { target: { value } });

            expect(getLedgerEntries).toHaveBeenLastCalledWith({
                page: 1,
                page_size: 10,
                source: value,
            });
        }
    );

    it("omits source when 'All Sources' is chosen again", () => {
        render(<GeneralLedger />);

        fireEvent.change(screen.getByTestId("filter-source"), { target: { value: "manual" } });
        fireEvent.change(screen.getByTestId("filter-source"), { target: { value: "all" } });

        expect(lastLedgerParams()).not.toHaveProperty("source");
    });

    // ---- Date range ----

    it("starts with empty date inputs and no bounds", () => {
        render(<GeneralLedger />);

        expect(screen.getByLabelText("Start date")).toHaveValue("");
        expect(screen.getByLabelText("End date")).toHaveValue("");
        expect(screen.getByLabelText("Start date")).not.toHaveAttribute("max");
        expect(screen.getByLabelText("End date")).not.toHaveAttribute("min");
    });

    it("sends from_date and resets to page 1 when the start date changes", () => {
        render(<GeneralLedger />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2026-01-01" } });

        expect(screen.getByLabelText("Start date")).toHaveValue("2026-01-01");
        expect(getLedgerEntries).toHaveBeenLastCalledWith({
            page: 1,
            page_size: 10,
            from_date: "2026-01-01",
        });
    });

    it("sends to_date and resets to page 1 when the end date changes", () => {
        render(<GeneralLedger />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2026-01-31" } });

        expect(screen.getByLabelText("End date")).toHaveValue("2026-01-31");
        expect(getLedgerEntries).toHaveBeenLastCalledWith({
            page: 1,
            page_size: 10,
            to_date: "2026-01-31",
        });
    });

    it("omits a date from the request once it is cleared", () => {
        render(<GeneralLedger />);

        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2026-01-01" } });
        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "" } });
        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2026-01-31" } });
        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "" } });

        expect(lastLedgerParams()).not.toHaveProperty("from_date");
        expect(lastLedgerParams()).not.toHaveProperty("to_date");
    });

    it("bounds the start/end inputs against each other via max/min", () => {
        render(<GeneralLedger />);

        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2026-01-01" } });
        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2026-01-31" } });

        expect(screen.getByLabelText("Start date")).toHaveAttribute("max", "2026-01-31");
        expect(screen.getByLabelText("End date")).toHaveAttribute("min", "2026-01-01");
    });

    // ---- Pagination ----

    it("shows currentPage/totalPages", () => {
        setupSelectors({ ledgerPagination: { totalPages: 7 } });
        render(<GeneralLedger />);

        expect(screen.getByTestId("pagination")).toHaveTextContent("1/7");
    });

    it("dispatches getLedgerEntries with the new page on page change", () => {
        render(<GeneralLedger />);

        fireEvent.click(screen.getByText("next-page"));

        expect(screen.getByTestId("pagination")).toHaveTextContent("2/3");
        expect(getLedgerEntries).toHaveBeenLastCalledWith({ page: 2, page_size: 10 });
    });

    it("does not refetch the dashboard or customers when the page changes", () => {
        render(<GeneralLedger />);

        fireEvent.click(screen.getByText("next-page"));

        expect(getDashboardSummary).toHaveBeenCalledTimes(1);
        expect(getCustomerWiseSummary).toHaveBeenCalledTimes(1);
    });

    // ---- Combined filters ----

    it("sends all active filters together and keeps them when changing page", () => {
        vi.useFakeTimers();
        render(<GeneralLedger />);

        fireEvent.change(screen.getByTestId("filter-account"), { target: { value: "C002" } });
        fireEvent.change(screen.getByTestId("filter-type"), { target: { value: "payment" } });
        fireEvent.change(screen.getByTestId("filter-source"), { target: { value: "manual" } });
        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2026-01-01" } });
        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2026-03-31" } });
        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "abc" } });
        act(() => {
            vi.advanceTimersByTime(400);
        });
        fireEvent.click(screen.getByText("next-page"));

        expect(getLedgerEntries).toHaveBeenLastCalledWith({
            page: 2,
            page_size: 10,
            search: "abc",
            customer_code: "C002",
            transaction_type: "payment",
            source: "manual",
            from_date: "2026-01-01",
            to_date: "2026-03-31",
        });
    });

    // ---- Export ----

    it("logs the Excel export placeholder when Export Excel is clicked", () => {
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
        render(<GeneralLedger />);

        fireEvent.click(screen.getByText("Export Excel"));

        expect(logSpy).toHaveBeenCalledWith("Export General Ledger to Excel");
    });

    it("logs the PDF export placeholder when Export PDF is clicked", () => {
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
        render(<GeneralLedger />);

        fireEvent.click(screen.getByText("Export PDF"));

        expect(logSpy).toHaveBeenCalledWith("Export General Ledger to PDF");
    });

    it("does not refetch when an export button is clicked", () => {
        vi.spyOn(console, "log").mockImplementation(() => {});
        render(<GeneralLedger />);
        const before = getLedgerEntries.mock.calls.length;

        fireEvent.click(screen.getByText("Export Excel"));
        fireEvent.click(screen.getByText("Export PDF"));

        expect(getLedgerEntries.mock.calls.length).toBe(before);
    });
});