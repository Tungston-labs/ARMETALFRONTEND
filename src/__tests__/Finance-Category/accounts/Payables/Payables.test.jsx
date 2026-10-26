import React from "react";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// ---- PATHS ----
// Two placeholders appear in the imports and vi.mock() paths below:
//   ../../../..    -> relative path from THIS file up to src (e.g. ../../../.. )
//   FinanceModule/ACCOUNTS/Payables  -> the page folder relative to src/Pages
// Find the folder with:
//   find src/Pages -name "Usepayables*"
// then fill both in with one command, e.g.:
//   sed -i -e 's#../../../..#../../../..#g' -e 's#FinanceModule/ACCOUNTS/Payables#FinanceModule/ACCOUNTS/Payables#g' Payables.test.jsx
// (If the page file isn't named Payables.jsx, also fix the first import.)
import Payables from "../../../../Pages/FinanceModule/ACCOUNTS/Payables/Payables";

import { useDispatch, useSelector } from "react-redux";
import { getPayables } from "../../../../Redux/finance/accounts/payableSlice";
import { getVendors } from "../../../../Redux/finance/purchases/vendorsSlice";
import {
    ROWS_PER_PAGE,
    STATUS_MAP,
} from "../../../../Pages/FinanceModule/ACCOUNTS/Payables/Usepayables";
import {
    payableColumns,
    buildStatsCards,
    formatAmount,
} from "../../../../Pages/FinanceModule/ACCOUNTS/Payables/Payables.columns";

// NOTE: the real `usePayables` hook and the real columns file are used, so
// these tests exercise page + hook + columns together. Only Redux plumbing and
// the presentational children are mocked.

// ---- react-redux ----
vi.mock("react-redux", () => ({
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
}));

// ---- Redux slices (actions are plain marker objects) ----
vi.mock("../../../../Redux/finance/accounts/payableSlice", () => ({
    getPayables: vi.fn((params) => ({ type: "getPayables", params })),
}));

vi.mock("../../../../Redux/finance/purchases/vendorsSlice", () => ({
    getVendors: vi.fn((params) => ({ type: "getVendors", params })),
    selectVendors: (state) => state.vendors,
}));

// ---- Presentational mocks ----
vi.mock("../../../../Pages/FinanceModule/ACCOUNTS/Payables/Payables.styles", () => ({
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
    default: ({ columns = [], data = [] }) => (
        <div data-testid="reusable-table">
            <div data-testid="table-headers">
                {columns.map((c) => (
                    <span key={c.key}>{c.label}</span>
                ))}
            </div>
            {data.map((row, i) => (
                <div key={i} data-testid="table-row">
                    {row.bill_number} | {row.vendor_name}
                </div>
            ))}
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

const buildState = (overrides = {}) => ({
    vendors: [
        { id: 1, name: "Alpha Supplies" },
        { id: 2, vendor_name: "Beta Traders" },
        { id: 3, company_name: "Gamma Metals" },
        { id: 4 }, // no name -> "Vendor #4"
    ],
    payable: {
        payables: [
            { bill_number: "BILL-001", vendor_name: "Alpha Supplies" },
            { bill_number: "BILL-002", vendor_name: "Beta Traders" },
            { bill_number: "BILL-003", vendor_name: "Gamma Metals" },
        ],
        dashboard: {
            total_payable: 150000,
            not_yet_due: 90000,
            overdue_to_vendors: 25000.5,
            due_in_next_14_days: 12000,
            vendors_overdue_count: 4,
        },
        pagination: { currentPage: 1, totalPages: 3 },
        loading: false,
        error: null,
        ...overrides,
    },
});

const DEFAULT_PARAMS = {
    page: 1,
    page_size: ROWS_PER_PAGE,
    search: "",
    vendor_id: "",
    status: "",
    date_from: "",
    date_to: "",
};

const getStat = (title) =>
    within(screen.getByTestId("stats-cards")).getByText(title).nextSibling;

const optionLabels = (testId) =>
    within(screen.getByTestId(testId))
        .getAllByRole("option")
        .map((o) => o.textContent);

describe("Payables", () => {
    let dispatchMock;

    const setupSelectors = (reportOverrides = {}, topOverrides = {}) => {
        const state = { ...buildState(reportOverrides), ...topOverrides };
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
        render(<Payables />);

        expect(screen.getByText("Payables", { selector: "h1" })).toBeInTheDocument();
        expect(screen.getByTestId("stats-cards")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-filter")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });

    it("renders the Accounting / Payables breadcrumbs", () => {
        render(<Payables />);

        expect(screen.getByTestId("breadcrumbs")).toHaveTextContent("Accounting / Payables");
    });

    it("renders the date range and export button in the header actions", () => {
        render(<Payables />);

        const actions = within(screen.getByTestId("header-actions"));
        expect(actions.getByTestId("date-range")).toBeInTheDocument();
        expect(actions.getByLabelText("Start date")).toBeInTheDocument();
        expect(actions.getByLabelText("End date")).toBeInTheDocument();
        expect(actions.getByTestId("export-button")).toHaveTextContent("Export");
    });

    // ---- Initial fetching ----

    it("dispatches getVendors (page 1, page_size 100) once on mount", () => {
        render(<Payables />);

        expect(getVendors).toHaveBeenCalledTimes(1);
        expect(getVendors).toHaveBeenCalledWith({ page: 1, page_size: 100 });
    });

    it("dispatches getPayables on mount with the default params", () => {
        render(<Payables />);

        expect(getPayables).toHaveBeenCalledTimes(1);
        expect(getPayables).toHaveBeenCalledWith(DEFAULT_PARAMS);
    });

    // ---- Stats ----

    it("renders the five stat cards in order", () => {
        render(<Payables />);

        const titles = screen.getAllByTestId("stat-card").map((c) => c.firstChild.textContent);
        expect(titles).toEqual([
            "Total payable",
            "Not yet Due",
            "Overdue to vendors",
            "Due in next 14 days",
            "Vendors overdue",
        ]);
    });

    it("shows formatted amounts and the overdue vendor count from the dashboard", () => {
        render(<Payables />);

        expect(getStat("Total payable")).toHaveTextContent(formatAmount(150000));
        expect(getStat("Not yet Due")).toHaveTextContent(formatAmount(90000));
        expect(getStat("Overdue to vendors")).toHaveTextContent(formatAmount(25000.5));
        expect(getStat("Due in next 14 days")).toHaveTextContent(formatAmount(12000));
        expect(getStat("Vendors overdue")).toHaveTextContent("4");
    });

    it("shows zeros when the dashboard is missing", () => {
        setupSelectors({ dashboard: undefined });
        render(<Payables />);

        expect(getStat("Total payable")).toHaveTextContent(formatAmount(0));
        expect(getStat("Vendors overdue")).toHaveTextContent("0");
    });

    // ---- Table ----

    it("passes the payable columns to the table", () => {
        render(<Payables />);

        const headers = within(screen.getByTestId("table-headers"))
            .getAllByText(/.+/)
            .map((h) => h.textContent);
        expect(headers).toEqual(payableColumns.map((c) => c.label));
    });

    it("renders a row per payable", () => {
        render(<Payables />);

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(3);
        expect(rows[0]).toHaveTextContent("BILL-001 | Alpha Supplies");
    });

    it("renders no rows for an empty list", () => {
        setupSelectors({ payables: [] });
        render(<Payables />);

        expect(screen.queryAllByTestId("table-row")).toHaveLength(0);
    });

    // ---- Loading / error ----

    it("shows 'Loading...' only while loading", () => {
        const { unmount } = render(<Payables />);
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
        unmount();

        setupSelectors({ loading: true });
        render(<Payables />);
        expect(screen.getByText("Loading...")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
    });

    it("shows no error message when there is no error", () => {
        render(<Payables />);

        expect(screen.queryByText("Failed to load accounts payable")).not.toBeInTheDocument();
    });

    it("shows a string error as-is", () => {
        setupSelectors({ error: "Network down" });
        render(<Payables />);

        expect(screen.getByText("Network down")).toBeInTheDocument();
    });

    it("shows error.detail for object errors", () => {
        setupSelectors({ error: { detail: "Not authorised" } });
        render(<Payables />);

        expect(screen.getByText("Not authorised")).toBeInTheDocument();
    });

    it("falls back to a generic message when the error object has no detail", () => {
        setupSelectors({ error: {} });
        render(<Payables />);

        expect(screen.getByText("Failed to load accounts payable")).toBeInTheDocument();
    });

    // ---- Search (debounced) ----

    it("renders the search placeholder", () => {
        render(<Payables />);

        expect(screen.getByPlaceholderText("Search bill number or vendor")).toBeInTheDocument();
    });

    it("updates the input immediately but only dispatches after the 400ms debounce", () => {
        vi.useFakeTimers();
        render(<Payables />);
        const before = getPayables.mock.calls.length;

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "bill" } });

        expect(screen.getByTestId("search-input")).toHaveValue("bill");

        act(() => {
            vi.advanceTimersByTime(399);
        });
        expect(getPayables.mock.calls.length).toBe(before);

        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(getPayables).toHaveBeenCalledTimes(before + 1);
        expect(getPayables).toHaveBeenLastCalledWith(
            expect.objectContaining({ search: "bill", page: 1 })
        );
    });

    it("collapses rapid typing into a single request with the last value", () => {
        vi.useFakeTimers();
        render(<Payables />);
        const before = getPayables.mock.calls.length;

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "a" } });
        act(() => {
            vi.advanceTimersByTime(200);
        });
        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "ab" } });
        act(() => {
            vi.advanceTimersByTime(399);
        });
        expect(getPayables.mock.calls.length).toBe(before);

        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(getPayables).toHaveBeenCalledTimes(before + 1);
        expect(getPayables).toHaveBeenLastCalledWith(expect.objectContaining({ search: "ab" }));
    });

    it("resets to page 1 once the debounced search is applied", () => {
        vi.useFakeTimers();
        render(<Payables />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        expect(getPayables).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }));

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "x" } });
        act(() => {
            vi.advanceTimersByTime(400);
        });

        expect(getPayables).toHaveBeenLastCalledWith(
            expect.objectContaining({ search: "x", page: 1 })
        );
    });

    // ---- Vendor filter ----

    it("builds vendor options with 'All Vendors' first and name fallbacks", () => {
        render(<Payables />);

        expect(optionLabels("filter-vendor")).toEqual([
            "All Vendors",
            "Alpha Supplies",
            "Beta Traders",
            "Gamma Metals",
            "Vendor #4",
        ]);
    });

    it("uses 'All Vendors' as the placeholder and 'all' as the default value", () => {
        render(<Payables />);

        const select = screen.getByTestId("filter-vendor");
        expect(select).toHaveAttribute("data-placeholder", "All Vendors");
        expect(select).toHaveValue("all");
    });

    it("sends vendor_id and resets to page 1 when a vendor is selected", () => {
        render(<Payables />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.change(screen.getByTestId("filter-vendor"), { target: { value: "2" } });

        expect(screen.getByTestId("filter-vendor")).toHaveValue("2");
        expect(getPayables).toHaveBeenLastCalledWith(
            expect.objectContaining({ vendor_id: "2", page: 1 })
        );
    });

    it("sends an empty vendor_id when 'All Vendors' is chosen again", () => {
        render(<Payables />);

        fireEvent.change(screen.getByTestId("filter-vendor"), { target: { value: "2" } });
        fireEvent.change(screen.getByTestId("filter-vendor"), { target: { value: "all" } });

        expect(getPayables).toHaveBeenLastCalledWith(expect.objectContaining({ vendor_id: "" }));
    });

    // ---- Status filter ----

    it("offers the four statuses", () => {
        render(<Payables />);

        expect(optionLabels("status-select")).toEqual(["all", ...Object.keys(STATUS_MAP)]);
    });

    it.each([
        ["Unpaid", "unpaid"],
        ["Partially Paid", "partially_paid"],
        ["Paid", "paid"],
        ["Overdue", "overdue"],
    ])("maps the '%s' label to API status '%s' and resets to page 1", (label, apiValue) => {
        render(<Payables />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.change(screen.getByTestId("status-select"), { target: { value: label } });

        expect(getPayables).toHaveBeenLastCalledWith(
            expect.objectContaining({ status: apiValue, page: 1 })
        );
    });

    it("sends an empty status when the status is cleared", () => {
        render(<Payables />);

        fireEvent.change(screen.getByTestId("status-select"), { target: { value: "Paid" } });
        fireEvent.change(screen.getByTestId("status-select"), { target: { value: "" } });

        expect(getPayables).toHaveBeenLastCalledWith(expect.objectContaining({ status: "" }));
    });

    // ---- Date range ----

    it("starts with empty date inputs", () => {
        render(<Payables />);

        expect(screen.getByLabelText("Start date")).toHaveValue("");
        expect(screen.getByLabelText("End date")).toHaveValue("");
    });

    it("sends date_from and resets to page 1 when the start date changes", () => {
        render(<Payables />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2026-01-01" } });

        expect(screen.getByLabelText("Start date")).toHaveValue("2026-01-01");
        expect(getPayables).toHaveBeenLastCalledWith(
            expect.objectContaining({ date_from: "2026-01-01", page: 1 })
        );
    });

    it("sends date_to and resets to page 1 when the end date changes", () => {
        render(<Payables />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2026-01-31" } });

        expect(screen.getByLabelText("End date")).toHaveValue("2026-01-31");
        expect(getPayables).toHaveBeenLastCalledWith(
            expect.objectContaining({ date_to: "2026-01-31", page: 1 })
        );
    });

    it("bounds the start/end inputs against each other via max/min", () => {
        render(<Payables />);

        // no bounds while both are empty
        expect(screen.getByLabelText("Start date")).not.toHaveAttribute("max");
        expect(screen.getByLabelText("End date")).not.toHaveAttribute("min");

        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2026-01-01" } });
        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2026-01-31" } });

        expect(screen.getByLabelText("Start date")).toHaveAttribute("max", "2026-01-31");
        expect(screen.getByLabelText("End date")).toHaveAttribute("min", "2026-01-01");
    });

    // ---- Pagination ----

    it("shows currentPage/totalPages from the pagination state", () => {
        setupSelectors({ pagination: { currentPage: 2, totalPages: 7 } });
        render(<Payables />);

        expect(screen.getByTestId("pagination")).toHaveTextContent("2/7");
    });

    it("dispatches getPayables with the new page on page change, keeping filters", () => {
        render(<Payables />);

        fireEvent.change(screen.getByTestId("filter-vendor"), { target: { value: "3" } });
        fireEvent.change(screen.getByTestId("status-select"), { target: { value: "Overdue" } });
        fireEvent.click(screen.getByText("next-page"));

        expect(getPayables).toHaveBeenLastCalledWith({
            ...DEFAULT_PARAMS,
            vendor_id: "3",
            status: "overdue",
            page: 2,
        });
    });

    // ---- Export ----

    it("logs the export placeholder when Export is clicked (no export logic yet)", () => {
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
        render(<Payables />);

        fireEvent.click(screen.getByTestId("export-button"));

        expect(logSpy).toHaveBeenCalledWith("Export Payables to Excel");
    });

    it("does not refetch when Export is clicked", () => {
        vi.spyOn(console, "log").mockImplementation(() => {});
        render(<Payables />);
        const before = getPayables.mock.calls.length;

        fireEvent.click(screen.getByTestId("export-button"));

        expect(getPayables.mock.calls.length).toBe(before);
    });
});

// ---- Usepayables constants ----

describe("Usepayables constants", () => {
    it("uses 10 rows per page", () => {
        expect(ROWS_PER_PAGE).toBe(10);
    });

    it("maps UI status labels to API values", () => {
        expect(STATUS_MAP).toEqual({
            Unpaid: "unpaid",
            "Partially Paid": "partially_paid",
            Paid: "paid",
            Overdue: "overdue",
        });
    });
});

// ---- Payables.columns (real file) ----

describe("payableColumns", () => {
    it("defines the expected columns in order", () => {
        expect(payableColumns.map((c) => [c.key, c.label])).toEqual([
            ["bill_number", "Bill No"],
            ["vendor_name", "Vendor"],
            ["bill_date", "Bill Date"],
            ["due_date", "Due Date"],
            ["total_amount", "Amount"],
            ["balance", "Balance"],
            ["status", "Status"],
        ]);
    });
});

describe("formatAmount", () => {
    const expected = (n) =>
        n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    it("formats with exactly two decimals", () => {
        expect(formatAmount(1234.5)).toBe(expected(1234.5));
        expect(formatAmount(10)).toBe(expected(10));
    });

    it("converts numeric strings", () => {
        expect(formatAmount("2500")).toBe(expected(2500));
    });

    it.each([[undefined], [null], [""], [0]])("returns zero formatted for %p", (value) => {
        expect(formatAmount(value)).toBe(expected(0));
    });
});

describe("buildStatsCards", () => {
    const dashboard = {
        total_payable: 1000,
        not_yet_due: 400,
        overdue_to_vendors: 250.75,
        due_in_next_14_days: 100,
        vendors_overdue_count: 3,
    };

    it("returns five cards with the expected titles", () => {
        expect(buildStatsCards(dashboard).map((c) => c.title)).toEqual([
            "Total payable",
            "Not yet Due",
            "Overdue to vendors",
            "Due in next 14 days",
            "Vendors overdue",
        ]);
    });

    it("formats amounts and uses a plain string for the vendor count", () => {
        const counts = buildStatsCards(dashboard).map((c) => c.count);

        expect(counts).toEqual([
            formatAmount(1000),
            formatAmount(400),
            formatAmount(250.75),
            formatAmount(100),
            "3",
        ]);
    });

    it.each([[undefined], [null], [{}]])("defaults to zeros for dashboard %p", (value) => {
        const counts = buildStatsCards(value).map((c) => c.count);

        expect(counts.slice(0, 4)).toEqual(Array(4).fill(formatAmount(0)));
        expect(counts[4]).toBe("0");
    });

    it("keeps a vendors_overdue_count of 0 as '0'", () => {
        const cards = buildStatsCards({ vendors_overdue_count: 0 });

        expect(cards[4].count).toBe("0");
    });

    it("gives every card an icon element and colours", () => {
        buildStatsCards(dashboard).forEach((card) => {
            expect(React.isValidElement(card.icon)).toBe(true);
            expect(card.backgroundColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
            expect(card.iconColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
        });
    });
});