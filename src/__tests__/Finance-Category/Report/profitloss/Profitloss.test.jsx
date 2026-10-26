import React from "react";
import { render, screen, fireEvent, within, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// ---- PATHS ----
// This file is expected at src/__tests__/Finance-Category/Report/, so every
// import and vi.mock() path is relative to that folder. The page folder below
// is assumed to be "Profit-Loss". If your real folder name differs, run:
//   sed -i 's#REPORTS/ProfitLoss/#REPORTS/<YOUR-FOLDER>/#g' ProfitLoss.test.jsx
import ProfitLoss from "../../../../Pages/FinanceModule/REPORTS/ProfitLoss/ProfitLoss";

import { useDispatch, useSelector } from "react-redux";
import {
    getProfitLossReport,
    clearProfitLossReportError,
} from "../../../../Redux/finance/reports/Profitlossreportslice";

// NOTE: the real `useProfitLoss` hook (Useprofitloss.js) is intentionally NOT
// mocked, so these tests exercise the component + hook together. Only the Redux
// plumbing and the presentational children are mocked. The hook and page only
// export defaults, so formatting / row-building / error-message logic is
// verified through the rendered output.

// ---- react-redux ----
vi.mock("react-redux", () => ({
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
}));

// ---- Redux slice (actions are plain marker objects) ----
vi.mock("../../../../Redux/finance/reports/Profitlossreportslice", () => ({
    getProfitLossReport: vi.fn((params) => ({ type: "getProfitLossReport", params })),
    clearProfitLossReportError: vi.fn(() => ({ type: "clearProfitLossReportError" })),
}));

// ---- Styled components -> plain elements ----
vi.mock("../../../../Pages/FinanceModule/REPORTS/ProfitLoss/ProfitLoss.styles", () => ({
    ProfitLossContainer: ({ children }) => <div data-testid="container">{children}</div>,
    StatementTitle: ({ children }) => <h2>{children}</h2>,
    StatementTableWrapper: ({ children }) => <div>{children}</div>,
    StatementTable: ({ children }) => <table data-testid="statement-table">{children}</table>,
    TableHeader: ({ children }) => <tr>{children}</tr>,
    SectionRow: ({ children }) => (
        <tr data-testid="table-row" data-kind="section">
            {children}
        </tr>
    ),
    DataRow: ({ children }) => (
        <tr data-testid="table-row" data-kind="data">
            {children}
        </tr>
    ),
    TotalRow: ({ children }) => (
        <tr data-testid="table-row" data-kind="total">
            {children}
        </tr>
    ),
    DateRangeWrapper: ({ children }) => <div>{children}</div>,
    DatePickerContainer: ({ children }) => <div>{children}</div>,
    DateInput: (props) => <input {...props} />,
    DateSeparator: ({ children }) => <span>{children}</span>,
    ExportButton: ({ children, ...props }) => (
        <button data-testid="export-button" {...props}>
            {children}
        </button>
    ),
}));

// ---- Presentational mocks ----
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
    default: ({ cards = [], loading }) => (
        <div data-testid="stats-cards" data-loading={String(!!loading)}>
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
    default: ({ search, onSearch, showSearch, searchPlaceholder }) => (
        <div data-testid="reusable-filter">
            {showSearch ? (
                <input
                    data-testid="search-input"
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                />
            ) : null}
        </div>
    ),
}));

vi.mock("../../../../Components/Pagination/ReusablePagination", () => ({
    default: ({ currentPage, totalPages, totalRecords, onPageChange }) => (
        <div data-testid="pagination" data-total-records={totalRecords}>
            <span>
                {currentPage}/{totalPages}
            </span>
            <button onClick={() => onPageChange(currentPage + 1)}>next-page</button>
        </div>
    ),
}));

// ---- Fixtures ----

const ROWS_PER_PAGE = 10; // page size used by the hook

const makeSection = (rows, total, lastYearTotal, variance) => ({
    rows,
    total,
    lastYearTotal,
    variance,
});

const makeResult = (currentYear, lastYear, variance) => ({ currentYear, lastYear, variance });

// Without Other Expenses: 3 + 3 + 1 + 3 + 1 = 11 rows => 2 pages (10 per page)
const buildSections = (overrides = {}) => ({
    revenue: makeSection(
        [{ accountId: 101, particular: "Product sales", currentYear: "10000", lastYear: "8000", variance: "2000" }],
        "10000", "8000", "2000"
    ),
    costOfGoodsSold: makeSection(
        [{ accountId: 201, particular: "Materials", currentYear: "4000", lastYear: "3000", variance: "1000" }],
        "4000", "3000", "1000"
    ),
    grossProfit: makeResult("6000", "5000", "1000"),
    operatingExpenses: makeSection(
        [{ accountId: 301, particular: "Rent", currentYear: "2000", lastYear: "1800", variance: "200" }],
        "2000", "1800", "200"
    ),
    otherExpenses: makeSection([], "0", "0", "0"),
    netProfit: makeResult("4000", "3200", "800"),
    ...overrides,
});

const sectionsWithOtherExpenses = () =>
    buildSections({
        otherExpenses: makeSection(
            [{ accountId: 401, particular: "Bank charges", currentYear: "50", lastYear: "40", variance: "10" }],
            "50", "40", "10"
        ),
    });

const buildState = (overrides = {}) => ({
    profitLossReport: {
        kpis: {
            totalRevenue: "10000",
            costOfGoodsSold: "4000",
            grossProfit: "6000",
            operatingExpenses: "2000",
            netProfit: "4000",
        },
        sections: buildSections(),
        loading: false,
        error: null,
        ...overrides,
    },
});

const getStat = (title) =>
    within(screen.getByTestId("stats-cards")).getByText(title).nextSibling;

// Scope text lookups to the table (stat titles share labels such as "Gross Profit")
const table = () => within(screen.getByTestId("statement-table"));
const rowOf = (label) => table().getByText(label).closest("tr");
const cellsOf = (label) => within(rowOf(label)).getAllByRole("cell");
const getRows = () => screen.getAllByTestId("table-row");
const kindOf = (kind) => getRows().filter((r) => r.getAttribute("data-kind") === kind);

describe("ProfitLoss", () => {
    let dispatchMock;
    let abortMock;

    // `reportOverrides` patch state.profitLossReport.
    const setupSelectors = (reportOverrides = {}) => {
        const state = buildState(reportOverrides);
        vi.mocked(useSelector).mockImplementation((selector) => selector(state));
        return state;
    };

    beforeEach(() => {
        vi.clearAllMocks();
        abortMock = vi.fn();
        // the page aborts the in-flight request on cleanup, so dispatch returns { abort }
        dispatchMock = vi.fn((action) => ({ ...action, abort: abortMock }));
        vi.mocked(useDispatch).mockReturnValue(dispatchMock);
        setupSelectors();
    });

    afterEach(() => cleanup());

    // ---- Structure ----

    it("renders header, stats, filter, statement table and pagination", () => {
        render(<ProfitLoss />);

        expect(screen.getByText("Profit & Loss Report")).toBeInTheDocument();
        expect(screen.getByTestId("stats-cards")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-filter")).toBeInTheDocument();
        expect(screen.getByTestId("statement-table")).toBeInTheDocument();
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });

    it("renders the statement title", () => {
        render(<ProfitLoss />);
        expect(screen.getByText("Profit & Loss Statement")).toBeInTheDocument();
    });

    it("renders the Reports / Profit & Loss Report breadcrumbs", () => {
        render(<ProfitLoss />);
        expect(screen.getByTestId("breadcrumbs")).toHaveTextContent(
            "Reports / Profit & Loss Report"
        );
    });

    it("renders the Export button in the header actions", () => {
        render(<ProfitLoss />);

        const button = within(screen.getByTestId("header-actions")).getByTestId("export-button");
        expect(button).toHaveTextContent("Export");
        expect(button).toHaveAttribute("type", "button");
        expect(button).not.toBeDisabled();
    });

    it("renders the search box with its placeholder", () => {
        render(<ProfitLoss />);
        expect(screen.getByPlaceholderText("Search particular")).toBeInTheDocument();
    });

    // ---- Initial fetching ----

    it("dispatches getProfitLossReport once on mount with no date params", () => {
        render(<ProfitLoss />);

        expect(getProfitLossReport).toHaveBeenCalledTimes(1);
        expect(getProfitLossReport).toHaveBeenCalledWith({});
    });

    // ---- Date range ----

    it("starts with empty date inputs and no min / max", () => {
        render(<ProfitLoss />);

        expect(screen.getByLabelText("Start date")).toHaveValue("");
        expect(screen.getByLabelText("End date")).toHaveValue("");
        expect(screen.getByLabelText("Start date")).not.toHaveAttribute("max");
        expect(screen.getByLabelText("End date")).not.toHaveAttribute("min");
    });

    it("refetches with date_from when the start date changes", () => {
        render(<ProfitLoss />);

        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2024-01-01" } });

        expect(screen.getByLabelText("Start date")).toHaveValue("2024-01-01");
        expect(getProfitLossReport).toHaveBeenLastCalledWith({ date_from: "2024-01-01" });
    });

    it("refetches with date_to when the end date changes", () => {
        render(<ProfitLoss />);

        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2024-06-30" } });

        expect(getProfitLossReport).toHaveBeenLastCalledWith({ date_to: "2024-06-30" });
    });

    it("refetches with both dates once both are set", () => {
        render(<ProfitLoss />);

        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2024-01-01" } });
        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2024-06-30" } });

        expect(getProfitLossReport).toHaveBeenLastCalledWith({
            date_from: "2024-01-01",
            date_to: "2024-06-30",
        });
    });

    it("limits the pickers: start <= end via max / min", () => {
        render(<ProfitLoss />);

        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2024-01-01" } });
        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2024-06-30" } });

        expect(screen.getByLabelText("Start date")).toHaveAttribute("max", "2024-06-30");
        expect(screen.getByLabelText("End date")).toHaveAttribute("min", "2024-01-01");
    });

    it("aborts the previous request when the date changes", () => {
        render(<ProfitLoss />);
        expect(abortMock).not.toHaveBeenCalled();

        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2024-01-01" } });

        expect(abortMock).toHaveBeenCalledTimes(1);
    });

    it("aborts the in-flight request on unmount", () => {
        const { unmount } = render(<ProfitLoss />);
        unmount();

        expect(abortMock).toHaveBeenCalledTimes(1);
    });

    it("resets to page 1 when a date changes", () => {
        render(<ProfitLoss />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        expect(screen.getByTestId("pagination")).toHaveTextContent("2/2");

        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2024-06-30" } });

        expect(screen.getByTestId("pagination")).toHaveTextContent("1/2");
    });

    // ---- Stats ----

    it("renders the five stat cards with their titles", () => {
        render(<ProfitLoss />);

        const titles = screen.getAllByTestId("stat-card").map((c) => c.firstChild.textContent);
        expect(titles).toEqual([
            "Total Revenue",
            "Cost of Good Sold",
            "Gross Profit",
            "Operating Expenses",
            "Net Profit",
        ]);
    });

    it("shows the KPI amounts formatted with 2 decimals", () => {
        render(<ProfitLoss />);

        expect(getStat("Total Revenue")).toHaveTextContent("10,000.00");
        expect(getStat("Cost of Good Sold")).toHaveTextContent("4,000.00");
        expect(getStat("Gross Profit")).toHaveTextContent("6,000.00");
        expect(getStat("Operating Expenses")).toHaveTextContent("2,000.00");
        expect(getStat("Net Profit")).toHaveTextContent("4,000.00");
    });

    it("shows 0.00 for missing KPI values", () => {
        setupSelectors({ kpis: {} });
        render(<ProfitLoss />);

        expect(getStat("Total Revenue")).toHaveTextContent("0.00");
        expect(getStat("Net Profit")).toHaveTextContent("0.00");
    });

    it("passes loading through to the stats cards", () => {
        setupSelectors({ loading: true });
        render(<ProfitLoss />);

        expect(screen.getByTestId("stats-cards")).toHaveAttribute("data-loading", "true");
    });

    // ---- Table ----

    it("renders the four column headers", () => {
        render(<ProfitLoss />);

        expect(table().getByText("PARTICULAR")).toBeInTheDocument();
        expect(table().getByText("CURRENT YEAR")).toBeInTheDocument();
        expect(table().getByText("LAST YEAR")).toBeInTheDocument();
        expect(table().getByText("VARIANCE")).toBeInTheDocument();
    });

    it("renders section, data and total rows (10 on the first page)", () => {
        render(<ProfitLoss />);

        expect(getRows()).toHaveLength(ROWS_PER_PAGE);
        expect(kindOf("section")).toHaveLength(3);
        expect(kindOf("data")).toHaveLength(3);
        expect(kindOf("total")).toHaveLength(4);
    });

    it("renders section headers spanning all four columns", () => {
        render(<ProfitLoss />);

        expect(table().getByText("REVENUE")).toHaveAttribute("colspan", "4");
        expect(table().getByText("COST OF GOODS SOLD")).toBeInTheDocument();
        expect(table().getByText("OPERATING EXPENSES")).toBeInTheDocument();
    });

    it("keeps rows in report order", () => {
        render(<ProfitLoss />);

        const names = getRows().map((r) => r.firstChild.textContent);
        expect(names).toEqual([
            "REVENUE",
            "Product sales",
            "Total Revenue",
            "COST OF GOODS SOLD",
            "Materials",
            "Total Cost of Goods Sold",
            "Gross Profit",
            "OPERATING EXPENSES",
            "Rent",
            "Total Operating Expenses",
        ]);
    });

    it("formats current year, last year and variance", () => {
        render(<ProfitLoss />);

        const cells = cellsOf("Product sales");
        expect(cells[1]).toHaveTextContent("10,000.00");
        expect(cells[2]).toHaveTextContent("8,000.00");
        expect(cells[3]).toHaveTextContent("2,000.00");
    });

    it("renders section totals from total / lastYearTotal / variance", () => {
        render(<ProfitLoss />);

        const cells = cellsOf("Total Cost of Goods Sold");
        expect(cells[1]).toHaveTextContent("4,000.00");
        expect(cells[2]).toHaveTextContent("3,000.00");
        expect(cells[3]).toHaveTextContent("1,000.00");
    });

    it("renders Gross Profit as a total row", () => {
        render(<ProfitLoss />);

        expect(rowOf("Gross Profit")).toHaveAttribute("data-kind", "total");
        expect(cellsOf("Gross Profit")[1]).toHaveTextContent("6,000.00");
    });

    it("shows a Loading row and hides report rows while loading", () => {
        setupSelectors({ loading: true });
        render(<ProfitLoss />);

        expect(table().getByText("Loading...")).toBeInTheDocument();
        expect(screen.queryByText("Product sales")).not.toBeInTheDocument();
        expect(screen.queryByText("No records found.")).not.toBeInTheDocument();
    });

    it("shows an empty state when there are no matching rows", () => {
        render(<ProfitLoss />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "zzz" } });

        expect(screen.getByText("No records found.")).toBeInTheDocument();
    });

    // ---- Amount formatting (formatAmount, verified through the table) ----

    it("formats numeric strings, negatives and decimals with separators and 2 places", () => {
        setupSelectors({
            sections: buildSections({
                revenue: makeSection(
                    [
                        {
                            accountId: 1,
                            particular: "Format row",
                            currentYear: "1234.5",
                            lastYear: -2000,
                            variance: 10.456,
                        },
                    ],
                    "1234.5", "-2000", "10.456"
                ),
            }),
        });
        render(<ProfitLoss />);

        const cells = cellsOf("Format row");
        expect(cells[1]).toHaveTextContent("1,234.50");
        expect(cells[2]).toHaveTextContent("-2,000.00");
        expect(cells[3]).toHaveTextContent("10.46");
    });

    it.each([[null], [undefined], [""], [0]])("renders %p amounts as 0.00", (value) => {
        setupSelectors({
            sections: buildSections({
                revenue: makeSection(
                    [{ accountId: 1, particular: "Empty amounts", currentYear: value, lastYear: value, variance: value }],
                    value, value, value
                ),
            }),
        });
        render(<ProfitLoss />);

        const cells = cellsOf("Empty amounts");
        expect(cells[1]).toHaveTextContent("0.00");
        expect(cells[2]).toHaveTextContent("0.00");
        expect(cells[3]).toHaveTextContent("0.00");
    });

    // ---- Row building edge cases ----

    it("renders a section with no rows as just its header and total", () => {
        setupSelectors({
            sections: buildSections({ costOfGoodsSold: makeSection([], "0", "0", "0") }),
        });
        render(<ProfitLoss />);

        const names = getRows().map((r) => r.firstChild.textContent);
        expect(names).toEqual([
            "REVENUE",
            "Product sales",
            "Total Revenue",
            "COST OF GOODS SOLD",
            "Total Cost of Goods Sold",
            "Gross Profit",
            "OPERATING EXPENSES",
            "Rent",
            "Total Operating Expenses",
            "Net Profit",
        ]);
    });

    it("renders rows that have no accountId (key falls back to the particular)", () => {
        setupSelectors({
            sections: buildSections({
                revenue: makeSection(
                    [
                        { particular: "Service income", currentYear: "1", lastYear: "1", variance: "0" },
                        { particular: "Other income", currentYear: "2", lastYear: "2", variance: "0" },
                    ],
                    "3", "3", "0"
                ),
            }),
        });
        render(<ProfitLoss />);

        expect(table().getByText("Service income")).toBeInTheDocument();
        expect(table().getByText("Other income")).toBeInTheDocument();
    });

    // ---- Other Expenses (optional section) ----

    it("hides Other Expenses when the section has no rows", () => {
        render(<ProfitLoss />);

        fireEvent.click(screen.getByText("next-page"));

        expect(screen.queryByText("OTHER EXPENSES")).not.toBeInTheDocument();
        expect(screen.queryByText("Total Other Expenses")).not.toBeInTheDocument();
    });

    it("shows Other Expenses (header, rows, total) when it has rows", () => {
        setupSelectors({ sections: sectionsWithOtherExpenses() });
        render(<ProfitLoss />);

        fireEvent.click(screen.getByText("next-page")); // rows 11-14 live on page 2

        const names = getRows().map((r) => r.firstChild.textContent);
        expect(names).toEqual([
            "OTHER EXPENSES",
            "Bank charges",
            "Total Other Expenses",
            "Net Profit",
        ]);
    });

    it("adds the Other Expenses rows to the total record count", () => {
        setupSelectors({ sections: sectionsWithOtherExpenses() });
        render(<ProfitLoss />);

        expect(screen.getByTestId("pagination")).toHaveAttribute("data-total-records", "14");
    });

    // ---- Search (client-side) ----

    it("filters rows by particular (case-insensitive) without refetching", () => {
        render(<ProfitLoss />);
        const callsBefore = getProfitLossReport.mock.calls.length;

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "RENT" } });

        const rows = getRows();
        expect(rows).toHaveLength(1);
        expect(rows[0]).toHaveTextContent("Rent");
        expect(getProfitLossReport.mock.calls.length).toBe(callsBefore);
    });

    it("matches all total rows when searching for 'total'", () => {
        render(<ProfitLoss />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "total" } });

        const names = getRows().map((r) => r.firstChild.textContent);
        expect(names).toEqual([
            "Total Revenue",
            "Total Cost of Goods Sold",
            "Total Operating Expenses",
        ]);
    });

    it("searches across all pages, not only the visible one", () => {
        render(<ProfitLoss />);
        // "Net Profit" lives on page 2
        expect(screen.queryByText("Net Profit", { selector: "td" })).not.toBeInTheDocument();

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "net profit" } });

        expect(table().getByText("Net Profit")).toBeInTheDocument();
    });

    it("shows all rows again once the search is cleared", () => {
        render(<ProfitLoss />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "rent" } });
        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "" } });

        expect(getRows()).toHaveLength(ROWS_PER_PAGE);
    });

    it("resets to page 1 when searching", () => {
        render(<ProfitLoss />);

        fireEvent.click(screen.getByText("next-page"));
        expect(screen.getByTestId("pagination")).toHaveTextContent("2/2");

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "rent" } });

        expect(screen.getByTestId("pagination")).toHaveTextContent("1/1");
    });

    // ---- Pagination ----

    it("shows 2 pages and the full record count for 11 rows", () => {
        render(<ProfitLoss />);

        expect(screen.getByTestId("pagination")).toHaveTextContent("1/2");
        expect(screen.getByTestId("pagination")).toHaveAttribute("data-total-records", "11");
    });

    it("shows the remaining row (Net Profit) on page 2", () => {
        render(<ProfitLoss />);

        fireEvent.click(screen.getByText("next-page"));

        const rows = getRows();
        expect(rows).toHaveLength(1);
        expect(rows[0]).toHaveTextContent("Net Profit");
        expect(rows[0]).toHaveAttribute("data-kind", "total");
        expect(cellsOf("Net Profit")[3]).toHaveTextContent("800.00");
    });

    it("paginating is client-side and does not refetch", () => {
        render(<ProfitLoss />);
        const callsBefore = getProfitLossReport.mock.calls.length;

        fireEvent.click(screen.getByText("next-page"));

        expect(getProfitLossReport.mock.calls.length).toBe(callsBefore);
    });

    it("always shows at least 1 page when nothing matches", () => {
        render(<ProfitLoss />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "zzz" } });

        expect(screen.getByTestId("pagination")).toHaveTextContent("1/1");
        expect(screen.getByTestId("pagination")).toHaveAttribute("data-total-records", "0");
    });

    it("falls back to the last page when the report shrinks", () => {
        const { rerender } = render(<ProfitLoss />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        expect(screen.getByTestId("pagination")).toHaveTextContent("2/2");

        // Remove the COGS row => 10 rows total => a single page
        setupSelectors({
            sections: buildSections({ costOfGoodsSold: makeSection([], "0", "0", "0") }),
        });
        rerender(<ProfitLoss />);

        expect(screen.getByTestId("pagination")).toHaveTextContent("1/1");
    });

    // ---- Error handling ----

    it("shows no error message when there is no error", () => {
        render(<ProfitLoss />);

        expect(screen.queryByText("Failed to load profit & loss report")).not.toBeInTheDocument();
    });

    it("shows a string error as-is and hides the report rows", () => {
        setupSelectors({ error: "Network down" });
        render(<ProfitLoss />);

        expect(screen.getByText("Network down")).toBeInTheDocument();
        expect(screen.queryByText("Product sales")).not.toBeInTheDocument();
        expect(screen.queryByText("No records found.")).not.toBeInTheDocument();
    });

    it("shows error.detail for object errors", () => {
        setupSelectors({ error: { detail: "Not authorised" } });
        render(<ProfitLoss />);

        expect(screen.getByText("Not authorised")).toBeInTheDocument();
    });

    it("shows error.message when there is no detail", () => {
        setupSelectors({ error: { message: "Timeout" } });
        render(<ProfitLoss />);

        expect(screen.getByText("Timeout")).toBeInTheDocument();
    });

    it("falls back to a generic message when the error object has neither", () => {
        setupSelectors({ error: {} });
        render(<ProfitLoss />);

        expect(screen.getByText("Failed to load profit & loss report")).toBeInTheDocument();
    });

    it("shows Loading... instead of the error while loading", () => {
        setupSelectors({ loading: true, error: "Network down" });
        render(<ProfitLoss />);

        expect(screen.getByText("Loading...")).toBeInTheDocument();
        expect(screen.queryByText("Network down")).not.toBeInTheDocument();
    });

    it("clears the error when a date changes while an error is shown", () => {
        setupSelectors({ error: "Network down" });
        render(<ProfitLoss />);

        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2024-01-01" } });

        expect(clearProfitLossReportError).toHaveBeenCalledTimes(1);
    });

    it("does not dispatch clear when there is no error", () => {
        render(<ProfitLoss />);

        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2024-01-01" } });
        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2024-02-01" } });

        expect(clearProfitLossReportError).not.toHaveBeenCalled();
    });

    // ---- Export ----

    describe("export", () => {
        let clickSpy;
        let downloadName;
        let blobArgs;

        beforeEach(() => {
            downloadName = undefined;
            blobArgs = null;

            class FakeBlob {
                constructor(parts, options) {
                    blobArgs = { parts, options };
                }
            }
            vi.stubGlobal("Blob", FakeBlob);

            URL.createObjectURL = vi.fn(() => "blob:mock");
            URL.revokeObjectURL = vi.fn();
            clickSpy = vi
                .spyOn(HTMLAnchorElement.prototype, "click")
                .mockImplementation(function () {
                    downloadName = this.download;
                });
        });

        afterEach(() => {
            clickSpy.mockRestore();
            vi.unstubAllGlobals();
        });

        const exportCsv = () => {
            fireEvent.click(screen.getByTestId("export-button"));
            return blobArgs.parts[0];
        };

        it("downloads profit-loss-statement.csv", () => {
            render(<ProfitLoss />);
            exportCsv();

            expect(clickSpy).toHaveBeenCalledTimes(1);
            expect(downloadName).toBe("profit-loss-statement.csv");
            expect(blobArgs.options).toEqual({ type: "text/csv;charset=utf-8;" });
            expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
            expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock");
        });

        it("writes the header row", () => {
            render(<ProfitLoss />);

            expect(exportCsv().split("\n")[0]).toBe(
                '"Particular","Current Year","Last Year","Variance"'
            );
        });

        it("exports every row (not just the visible page)", () => {
            render(<ProfitLoss />);

            const lines = exportCsv().split("\n");
            // header + 11 report rows
            expect(lines).toHaveLength(12);
            expect(lines[1]).toBe('"REVENUE","","",""');
            expect(lines[2]).toBe('"Product sales","10000","8000","2000"');
            expect(lines[11]).toBe('"Net Profit","4000","3200","800"');
        });

        it("exports everything even when a search filter is active", () => {
            render(<ProfitLoss />);

            fireEvent.change(screen.getByTestId("search-input"), { target: { value: "rent" } });

            expect(exportCsv().split("\n")).toHaveLength(12);
        });

        it("includes Other Expenses when present", () => {
            setupSelectors({ sections: sectionsWithOtherExpenses() });
            render(<ProfitLoss />);

            const csv = exportCsv();
            expect(csv).toContain('"OTHER EXPENSES","","",""');
            expect(csv).toContain('"Bank charges","50","40","10"');
        });

        it("escapes double quotes in cells", () => {
            setupSelectors({
                sections: buildSections({
                    revenue: makeSection(
                        [{ accountId: 1, particular: 'Sales "EU"', currentYear: "1", lastYear: "1", variance: "0" }],
                        "1", "1", "0"
                    ),
                }),
            });
            render(<ProfitLoss />);

            expect(exportCsv()).toContain('"Sales ""EU"""');
        });

        it("disables the Export button while loading", () => {
            setupSelectors({ loading: true });
            render(<ProfitLoss />);

            expect(screen.getByTestId("export-button")).toBeDisabled();
        });
    });
});