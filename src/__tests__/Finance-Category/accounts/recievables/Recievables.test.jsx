import React from "react";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// ---- PATHS ----
// Two placeholders appear in the imports and vi.mock() paths below:
//   ../../../..      -> relative path from THIS file up to src
//   FinanceModule/ACCOUNTS/Recievables -> the page folder relative to src/Pages
// Fill both in automatically (run from the project root, set T to this file's path):
//   T="src/__tests__/.../Recievables.test.jsx"
//   HOOK=$(find src/Pages -name "Userecievables.js" | head -n1)
//   DIR=$(dirname "$HOOK" | sed 's#^src/Pages/##')
//   REL=$(realpath --relative-to="$(dirname "$T")" src)
//   sed -i -e "s#../../../..#$REL#g" -e "s#FinanceModule/ACCOUNTS/Recievables#$DIR#g" "$T"
import Recievables from "../../../../Pages/FinanceModule/ACCOUNTS/Recievables/Recievables";

import { useDispatch, useSelector } from "react-redux";
import { getReceivables } from "../../../../Redux/finance/accounts/Receivableslice";

// NOTE: the real `useRecievables` hook is intentionally NOT mocked, so these
// tests exercise the page + hook together. Only the Redux plumbing and the
// presentational children are mocked. The mocked table renders each column's
// `render` function, so the status badge is tested through the page.

// ---- react-redux ----
vi.mock("react-redux", () => ({
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
}));

// ---- Redux slice (action is a plain marker object) ----
vi.mock("../../../../Redux/finance/accounts/Receivableslice", () => ({
    getReceivables: vi.fn((params) => ({ type: "getReceivables", params })),
}));

// ---- Presentational mocks ----
vi.mock("../../../../Pages/FinanceModule/ACCOUNTS/Recievables/Recievables.styles", () => ({
    ExportButton: ({ children, ...props }) => (
        <button data-testid="export-button" {...props}>
            {children}
        </button>
    ),
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

vi.mock("../../../../Components/ReusableTable/ReusableFilter", () => ({
    default: ({
        search,
        onSearch,
        searchPlaceholder,
        showSearch,
        status,
        statuses = [],
        onStatus,
        showStatus,
        filters = [],
    }) => (
        <div data-testid="reusable-filter">
            {showSearch ? (
                <input
                    data-testid="search-input"
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                />
            ) : null}

            {showStatus ? (
                <select
                    data-testid="status-select"
                    value={status}
                    onChange={(e) => onStatus(e.target.value)}
                >
                    <option value="">all</option>
                    {statuses.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            ) : null}

            {filters.map((f) => (
                <select
                    key={f.key}
                    data-testid={`filter-${f.key}`}
                    data-placeholder={f.placeholder}
                    value={f.value}
                    onChange={(e) => f.onChange(e.target.value)}
                >
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
    default: ({ columns = [], data = [], loading, emptyMessage }) => (
        <div
            data-testid="reusable-table"
            data-loading={String(!!loading)}
            data-empty-message={emptyMessage}
        >
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

const buildInvoice = (overrides = {}) => ({
    invoice_number: "INV-001",
    customer_id: 1,
    customer_name: "Alpha Corp",
    invoice_date: "2026-01-05",
    due_date: "2026-02-05",
    amount: "1000",
    paid_amount: "400",
    outstanding_amount: "600",
    status: "partially_paid",
    ...overrides,
});

const buildState = (overrides = {}) => ({
    receivable: {
        receivables: [
            buildInvoice(),
            buildInvoice({
                invoice_number: "INV-002",
                customer_id: 2,
                customer_name: "Beta Ltd",
                amount: 2500.5,
                paid_amount: 2500.5,
                outstanding_amount: 0,
                status: "paid",
            }),
            buildInvoice({
                invoice_number: "INV-003",
                customer_id: 3,
                customer_name: "Gamma Inc",
                amount: null,
                paid_amount: undefined,
                outstanding_amount: "",
                status: "overdue",
            }),
        ],
        dashboard: {
            total_receivable: 150000,
            not_yet_due: 90000,
            overdue_amount: 25000.5,
            over_60_days_late: 12000,
            overdue_customers: 3,
        },
        pagination: { totalPages: 3 },
        loading: false,
        error: null,
        ...overrides,
    },
});

const DEFAULT_PARAMS = { page: 1, page_size: 10 };

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

describe("Recievables", () => {
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

    it("renders header, stats, filter, table and pagination", () => {
        render(<Recievables />);

        expect(screen.getByText("Receivables", { selector: "h1" })).toBeInTheDocument();
        expect(screen.getByTestId("stats-cards")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-filter")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });

    it("renders the Accounting / Receivables breadcrumbs", () => {
        render(<Recievables />);

        expect(screen.getByTestId("breadcrumbs")).toHaveTextContent("Accounting / Receivables");
    });

    it("renders the date range and export button in the header actions", () => {
        render(<Recievables />);

        const actions = within(screen.getByTestId("header-actions"));
        expect(actions.getByTestId("date-range")).toBeInTheDocument();
        expect(actions.getByLabelText("Start date")).toBeInTheDocument();
        expect(actions.getByLabelText("End date")).toBeInTheDocument();
        expect(actions.getByTestId("export-button")).toHaveTextContent("Export");
    });

    // ---- Initial fetch ----

    it("dispatches getReceivables once on mount with only page and page_size", () => {
        render(<Recievables />);

        expect(getReceivables).toHaveBeenCalledTimes(1);
        expect(getReceivables).toHaveBeenCalledWith(DEFAULT_PARAMS);
    });

    // ---- Stats ----

    it("renders the five stat cards in order", () => {
        render(<Recievables />);

        const titles = screen.getAllByTestId("stat-card").map((c) => c.firstChild.textContent);
        expect(titles).toEqual([
            "Total Receivable",
            "Not yet Due",
            "Overdue",
            "Over 60 days late",
            "Customers Overdue",
        ]);
    });

    it("shows amounts formatted to 2 decimals and the overdue customer count", () => {
        render(<Recievables />);

        expect(getStat("Total Receivable")).toHaveTextContent("150,000.00");
        expect(getStat("Not yet Due")).toHaveTextContent("90,000.00");
        expect(getStat("Overdue")).toHaveTextContent("25,000.50");
        expect(getStat("Over 60 days late")).toHaveTextContent("12,000.00");
        expect(getStat("Customers Overdue")).toHaveTextContent("3");
    });

    it("shows zeros when the dashboard is missing", () => {
        setupSelectors({ dashboard: undefined });
        render(<Recievables />);

        expect(getStat("Total Receivable")).toHaveTextContent("0.00");
        expect(getStat("Customers Overdue")).toHaveTextContent("0");
    });

    // ---- Table ----

    it("renders the table headers", () => {
        render(<Recievables />);

        const headers = screen.getAllByRole("columnheader").map((h) => h.textContent);
        expect(headers).toEqual([
            "Invoice No.",
            "Customer",
            "Invoice Date",
            "Due Date",
            "Amount",
            "Paid",
            "Outstanding",
            "Status",
        ]);
    });

    it("renders a row per receivable with formatted amounts and a status label", () => {
        render(<Recievables />);

        expect(screen.getAllByTestId("table-row")).toHaveLength(3);
        expect(rowCells(0)).toEqual([
            "INV-001",
            "Alpha Corp",
            "2026-01-05",
            "2026-02-05",
            "1,000.00",
            "400.00",
            "600.00",
            "Partially Paid",
        ]);
        expect(rowCells(1).slice(4, 7)).toEqual(["2,500.50", "2,500.50", "0.00"]);
    });

    it("formats missing amounts as 0.00", () => {
        render(<Recievables />);

        expect(rowCells(2).slice(4, 7)).toEqual(["0.00", "0.00", "0.00"]);
    });

    it("renders no rows for an empty list", () => {
        setupSelectors({ receivables: [] });
        render(<Recievables />);

        expect(screen.queryAllByTestId("table-row")).toHaveLength(0);
    });

    it("passes loading and the empty message to the table", () => {
        setupSelectors({ loading: true });
        render(<Recievables />);

        const table = screen.getByTestId("reusable-table");
        expect(table).toHaveAttribute("data-loading", "true");
        expect(table).toHaveAttribute("data-empty-message", "No invoices found");
    });

    // ---- Status badge ----

    describe("status badge", () => {
        const renderWithStatus = (status) => {
            setupSelectors({ receivables: [buildInvoice({ status })] });
            render(<Recievables />);
            const cells = within(screen.getByTestId("table-row")).getAllByRole("cell");
            return cells[cells.length - 1].firstChild;
        };

        it.each([
            ["paid", "Paid", "#00A63C", "#E7F8EC"],
            ["partially_paid", "Partially Paid", "#FF7200", "#FFF1E5"],
            ["overdue", "Overdue", "#FF3131", "#FFE8E8"],
        ])("styles '%s' as '%s'", (status, label, color, background) => {
            const badge = renderWithStatus(status);

            expect(badge).toHaveTextContent(label);
            expect(badge).toHaveStyle({ color, backgroundColor: background });
        });

        it("title-cases unknown statuses and uses the neutral grey style", () => {
            const badge = renderWithStatus("pending_review");

            expect(badge).toHaveTextContent("Pending Review");
            expect(badge).toHaveStyle({ color: "#555", backgroundColor: "#EEE" });
        });

        it("does not crash when status is missing", () => {
            expect(() => renderWithStatus(undefined)).not.toThrow();
        });
    });

    // ---- Error ----

    it("shows no error message when there is no error", () => {
        render(<Recievables />);

        expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
    });

    it("shows a string error as-is", () => {
        setupSelectors({ error: "Network down" });
        render(<Recievables />);

        expect(screen.getByText("Network down")).toBeInTheDocument();
    });

    it("prefers error.detail over error.message", () => {
        setupSelectors({ error: { detail: "Detail msg", message: "Message msg" } });
        render(<Recievables />);

        expect(screen.getByText("Detail msg")).toBeInTheDocument();
        expect(screen.queryByText("Message msg")).not.toBeInTheDocument();
    });

    it("falls back to error.message", () => {
        setupSelectors({ error: { message: "Message msg" } });
        render(<Recievables />);

        expect(screen.getByText("Message msg")).toBeInTheDocument();
    });

    it("falls back to a generic message for unknown error shapes", () => {
        setupSelectors({ error: {} });
        render(<Recievables />);

        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    // ---- Search (debounced) ----

    it("renders the search placeholder", () => {
        render(<Recievables />);

        expect(screen.getByPlaceholderText("Search Invoice or Customer")).toBeInTheDocument();
    });

    it("updates the input immediately but only dispatches after the 400ms debounce", () => {
        vi.useFakeTimers();
        render(<Recievables />);
        const before = getReceivables.mock.calls.length;

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "inv" } });

        expect(screen.getByTestId("search-input")).toHaveValue("inv");

        act(() => {
            vi.advanceTimersByTime(399);
        });
        expect(getReceivables.mock.calls.length).toBe(before);

        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(getReceivables).toHaveBeenCalledTimes(before + 1);
        expect(getReceivables).toHaveBeenLastCalledWith({
            ...DEFAULT_PARAMS,
            search: "inv",
        });
    });

    it("trims the search term before sending it", () => {
        vi.useFakeTimers();
        render(<Recievables />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "  inv  " } });
        act(() => {
            vi.advanceTimersByTime(400);
        });

        expect(getReceivables).toHaveBeenLastCalledWith(
            expect.objectContaining({ search: "inv" })
        );
    });

    it("omits search from the request when it is only whitespace", () => {
        vi.useFakeTimers();
        render(<Recievables />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "   " } });
        act(() => {
            vi.advanceTimersByTime(400);
        });

        const lastParams = getReceivables.mock.calls[getReceivables.mock.calls.length - 1][0];
        expect(lastParams).not.toHaveProperty("search");
    });

    it("collapses rapid typing into a single request with the last value", () => {
        vi.useFakeTimers();
        render(<Recievables />);
        const before = getReceivables.mock.calls.length;

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "a" } });
        act(() => {
            vi.advanceTimersByTime(200);
        });
        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "ab" } });
        act(() => {
            vi.advanceTimersByTime(399);
        });
        expect(getReceivables.mock.calls.length).toBe(before);

        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(getReceivables).toHaveBeenCalledTimes(before + 1);
        expect(getReceivables).toHaveBeenLastCalledWith(expect.objectContaining({ search: "ab" }));
    });

    it("resets to page 1 once the debounced search is applied", () => {
        vi.useFakeTimers();
        render(<Recievables />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        expect(getReceivables).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }));

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "x" } });
        act(() => {
            vi.advanceTimersByTime(400);
        });

        expect(getReceivables).toHaveBeenLastCalledWith({
            page: 1,
            page_size: 10,
            search: "x",
        });
    });

    // ---- Customer filter ----

    it("builds customer options from the loaded receivables, 'All Customers' first", () => {
        render(<Recievables />);

        expect(optionLabels("filter-customer")).toEqual([
            "All Customers",
            "Alpha Corp",
            "Beta Ltd",
            "Gamma Inc",
        ]);
    });

    it("uses 'All Customers' as the placeholder and 'all' as the default value", () => {
        render(<Recievables />);

        const select = screen.getByTestId("filter-customer");
        expect(select).toHaveAttribute("data-placeholder", "All Customers");
        expect(select).toHaveValue("all");
    });

    it("has only 'All Customers' when nothing is loaded", () => {
        setupSelectors({ receivables: [] });
        render(<Recievables />);

        expect(optionLabels("filter-customer")).toEqual(["All Customers"]);
    });

    it("sends customer_id and resets to page 1 when a customer is selected", () => {
        render(<Recievables />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.change(screen.getByTestId("filter-customer"), { target: { value: "2" } });

        expect(screen.getByTestId("filter-customer")).toHaveValue("2");
        expect(getReceivables).toHaveBeenLastCalledWith({
            page: 1,
            page_size: 10,
            customer_id: "2",
        });
    });

    it("omits customer_id when 'All Customers' is chosen again", () => {
        render(<Recievables />);

        fireEvent.change(screen.getByTestId("filter-customer"), { target: { value: "2" } });
        fireEvent.change(screen.getByTestId("filter-customer"), { target: { value: "all" } });

        const lastParams = getReceivables.mock.calls[getReceivables.mock.calls.length - 1][0];
        expect(lastParams).not.toHaveProperty("customer_id");
    });

    it("keeps previously seen customers when a later result has different ones", () => {
        const { rerender } = render(<Recievables />);

        setupSelectors({
            receivables: [buildInvoice({ customer_id: 7, customer_name: "Seven Co" })],
        });
        rerender(<Recievables />);

        expect(optionLabels("filter-customer")).toEqual([
            "All Customers",
            "Alpha Corp",
            "Beta Ltd",
            "Gamma Inc",
            "Seven Co",
        ]);
    });

    it("does not clear known customers when the result becomes empty", () => {
        const { rerender } = render(<Recievables />);

        setupSelectors({ receivables: [] });
        rerender(<Recievables />);

        expect(optionLabels("filter-customer")).toEqual([
            "All Customers",
            "Alpha Corp",
            "Beta Ltd",
            "Gamma Inc",
        ]);
    });

    it("updates a customer's label when its name changes in a later result", () => {
        const { rerender } = render(<Recievables />);

        setupSelectors({
            receivables: [buildInvoice({ customer_id: 1, customer_name: "Alpha Renamed" })],
        });
        rerender(<Recievables />);

        expect(optionLabels("filter-customer")).toContain("Alpha Renamed");
        expect(optionLabels("filter-customer")).not.toContain("Alpha Corp");
    });

    // ---- Status filter ----

    it("offers Paid, Partially Paid and Overdue", () => {
        render(<Recievables />);

        expect(optionLabels("status-select")).toEqual(["all", "Paid", "Partially Paid", "Overdue"]);
    });

    it.each([
        ["Paid", "paid"],
        ["Partially Paid", "partially_paid"],
        ["Overdue", "overdue"],
    ])("maps '%s' to API status '%s' and resets to page 1", (label, apiValue) => {
        render(<Recievables />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.change(screen.getByTestId("status-select"), { target: { value: label } });

        expect(getReceivables).toHaveBeenLastCalledWith({
            page: 1,
            page_size: 10,
            status: apiValue,
        });
    });

    it("omits status from the request when it is cleared", () => {
        render(<Recievables />);

        fireEvent.change(screen.getByTestId("status-select"), { target: { value: "Paid" } });
        fireEvent.change(screen.getByTestId("status-select"), { target: { value: "" } });

        const lastParams = getReceivables.mock.calls[getReceivables.mock.calls.length - 1][0];
        expect(lastParams).not.toHaveProperty("status");
    });

    // ---- Date range ----

    it("starts with empty date inputs and no bounds", () => {
        render(<Recievables />);

        expect(screen.getByLabelText("Start date")).toHaveValue("");
        expect(screen.getByLabelText("End date")).toHaveValue("");
        expect(screen.getByLabelText("Start date")).not.toHaveAttribute("max");
        expect(screen.getByLabelText("End date")).not.toHaveAttribute("min");
    });

    it("sends date_from and resets to page 1 when the start date changes", () => {
        render(<Recievables />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2026-01-01" } });

        expect(screen.getByLabelText("Start date")).toHaveValue("2026-01-01");
        expect(getReceivables).toHaveBeenLastCalledWith({
            page: 1,
            page_size: 10,
            date_from: "2026-01-01",
        });
    });

    it("sends date_to and resets to page 1 when the end date changes", () => {
        render(<Recievables />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2026-01-31" } });

        expect(screen.getByLabelText("End date")).toHaveValue("2026-01-31");
        expect(getReceivables).toHaveBeenLastCalledWith({
            page: 1,
            page_size: 10,
            date_to: "2026-01-31",
        });
    });

    it("omits a date from the request once it is cleared", () => {
        render(<Recievables />);

        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2026-01-01" } });
        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "" } });

        const lastParams = getReceivables.mock.calls[getReceivables.mock.calls.length - 1][0];
        expect(lastParams).not.toHaveProperty("date_from");
    });

    it("bounds the start/end inputs against each other via max/min", () => {
        render(<Recievables />);

        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2026-01-01" } });
        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2026-01-31" } });

        expect(screen.getByLabelText("Start date")).toHaveAttribute("max", "2026-01-31");
        expect(screen.getByLabelText("End date")).toHaveAttribute("min", "2026-01-01");
    });

    // ---- Pagination ----

    it("shows currentPage/totalPages", () => {
        setupSelectors({ pagination: { totalPages: 7 } });
        render(<Recievables />);

        expect(screen.getByTestId("pagination")).toHaveTextContent("1/7");
    });

    it("dispatches getReceivables with the new page on page change", () => {
        render(<Recievables />);

        fireEvent.click(screen.getByText("next-page"));

        expect(screen.getByTestId("pagination")).toHaveTextContent("2/3");
        expect(getReceivables).toHaveBeenLastCalledWith({ page: 2, page_size: 10 });
    });

    // ---- Combined filters ----

    it("sends all active filters together and keeps them when changing page", () => {
        vi.useFakeTimers();
        render(<Recievables />);

        fireEvent.change(screen.getByTestId("filter-customer"), { target: { value: "2" } });
        fireEvent.change(screen.getByTestId("status-select"), { target: { value: "Paid" } });
        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2026-01-01" } });
        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2026-03-31" } });
        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "abc" } });
        act(() => {
            vi.advanceTimersByTime(400);
        });
        fireEvent.click(screen.getByText("next-page"));

        expect(getReceivables).toHaveBeenLastCalledWith({
            page: 2,
            page_size: 10,
            search: "abc",
            status: "paid",
            customer_id: "2",
            date_from: "2026-01-01",
            date_to: "2026-03-31",
        });
    });

    // ---- Export ----

    it("logs the export placeholder when Export is clicked (no export logic yet)", () => {
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
        render(<Recievables />);

        fireEvent.click(screen.getByTestId("export-button"));

        expect(logSpy).toHaveBeenCalledWith("Export Receivables to Excel");
    });

    it("does not refetch when Export is clicked", () => {
        vi.spyOn(console, "log").mockImplementation(() => {});
        render(<Recievables />);
        const before = getReceivables.mock.calls.length;

        fireEvent.click(screen.getByTestId("export-button"));

        expect(getReceivables.mock.calls.length).toBe(before);
    });
});