import React from "react";
import { render, screen, fireEvent, within, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// ---- PATHS ----
// This file is expected at src/__tests__/Finance-Category/Report/cashflow/, so
// every import and vi.mock() path is relative to that folder. The page lives in
// src/Pages/FinanceModule/REPORTS/CashFlow/. If your folder differs, run:
//   sed -i 's#REPORTS/CashFlow/#REPORTS/<YOUR-FOLDER>/#g' Cashflow.test.jsx
import CashFlow from "../../../../Pages/FinanceModule/REPORTS/CashFlow/CashFlow";

import { useDispatch, useSelector } from "react-redux";
import {
    getCashFlowReport,
    clearCashFlowReportError,
} from "../../../../Redux/finance/reports/Cashflowreportslice";

// NOTE: the real `useCashFlow` hook (Usecashflow.js) is intentionally NOT
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
vi.mock("../../../../Redux/finance/reports/Cashflowreportslice", () => ({
    getCashFlowReport: vi.fn((params) => ({ type: "getCashFlowReport", params })),
    clearCashFlowReportError: vi.fn(() => ({ type: "clearCashFlowReportError" })),
}));

// ---- Styled components -> plain elements ----
vi.mock("../../../../Pages/FinanceModule/REPORTS/CashFlow/CashFlow.style", () => ({
    ProfitLossContainer: ({ children }) => <div data-testid="container">{children}</div>,
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
    ClosingBalanceRow: ({ children }) => <div data-testid="closing-row">{children}</div>,
    ClosingBalanceLabel: ({ children }) => <span>{children}</span>,
    ClosingBalanceAmount: ({ children }) => <span data-testid="closing-amount">{children}</span>,
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

// Rows per page used by the hook
const ROWS_PER_PAGE = 10;

// ---- Fixtures ----

const makeSection = (label, rows, totals) => ({
    label,
    rows,
    cashIn: totals.cashIn,
    cashOut: totals.cashOut,
    netAmount: totals.netAmount,
});

// 4 + 3 + 3 section rows + 1 grand total = 11 rows => 2 pages (10 per page)
const buildSections = () => ({
    operating: makeSection(
        "Operating Activities",
        [
            { id: 1, particular: "Cash from customers", cashIn: 5000, cashOut: 0, netAmount: 5000 },
            { id: 2, particular: "Paid to suppliers", cashIn: 0, cashOut: 2000, netAmount: -2000 },
        ],
        { cashIn: 5000, cashOut: 2000, netAmount: 3000 }
    ),
    investing: makeSection(
        "Investing Activities",
        [{ id: 3, particular: "Purchase of equipment", cashIn: 0, cashOut: 500, netAmount: -500 }],
        { cashIn: 0, cashOut: 500, netAmount: -500 }
    ),
    financing: makeSection(
        "Financing Activities",
        [{ id: 4, particular: "Loan proceeds", cashIn: 800, cashOut: 0, netAmount: 800 }],
        { cashIn: 800, cashOut: 0, netAmount: 800 }
    ),
});

const buildState = (overrides = {}) => ({
    cashFlowReport: {
        summary: {
            openingBalance: "1000",
            cashInflow: "5000",
            cashOutflow: "2000",
            netCashFlow: "3000",
            closingBalance: "4000",
        },
        sections: buildSections(),
        totals: { cashIn: 5800, cashOut: 2500, netCashFlow: 3300 },
        currency: "USD",
        loading: false,
        error: null,
        ...overrides,
    },
});

const getStat = (title) =>
    within(screen.getByTestId("stats-cards")).getByText(title).nextSibling;

// Scope text lookups to the table (stat titles share some labels, e.g. "Net Cash Flow")
const table = () => within(screen.getByTestId("statement-table"));
const rowOf = (label) => table().getByText(label).closest("tr");
const cellsOf = (label) => within(rowOf(label)).getAllByRole("cell");
const getRows = () => screen.getAllByTestId("table-row");
const kindOf = (kind) => getRows().filter((r) => r.getAttribute("data-kind") === kind);

describe("CashFlow", () => {
    let dispatchMock;
    let abortMock;

    // `reportOverrides` patch state.cashFlowReport.
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

    it("renders header, stats, filter, table, closing balance and pagination", () => {
        render(<CashFlow />);

        expect(screen.getByText("Cash Flow")).toBeInTheDocument();
        expect(screen.getByTestId("stats-cards")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-filter")).toBeInTheDocument();
        expect(screen.getByTestId("statement-table")).toBeInTheDocument();
        expect(screen.getByTestId("closing-row")).toBeInTheDocument();
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });

    it("renders the Reports / Cash Flow breadcrumbs", () => {
        render(<CashFlow />);
        expect(screen.getByTestId("breadcrumbs")).toHaveTextContent("Reports / Cash Flow");
    });

    it("renders the Export button in the header actions", () => {
        render(<CashFlow />);

        const button = within(screen.getByTestId("header-actions")).getByTestId("export-button");
        expect(button).toHaveTextContent("Export");
        expect(button).toHaveAttribute("type", "button");
        expect(button).not.toBeDisabled();
    });

    it("renders the search box with its placeholder", () => {
        render(<CashFlow />);
        expect(screen.getByPlaceholderText("Search Account")).toBeInTheDocument();
    });

    // ---- Initial fetching ----

    it("dispatches getCashFlowReport once on mount with no date params", () => {
        render(<CashFlow />);

        expect(getCashFlowReport).toHaveBeenCalledTimes(1);
        expect(getCashFlowReport).toHaveBeenCalledWith({});
    });

    // ---- Date range ----

    it("starts with empty date inputs and no min / max", () => {
        render(<CashFlow />);

        expect(screen.getByLabelText("Start date")).toHaveValue("");
        expect(screen.getByLabelText("End date")).toHaveValue("");
        expect(screen.getByLabelText("Start date")).not.toHaveAttribute("max");
        expect(screen.getByLabelText("End date")).not.toHaveAttribute("min");
    });

    it("refetches with date_from when the start date changes", () => {
        render(<CashFlow />);

        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2024-01-01" } });

        expect(screen.getByLabelText("Start date")).toHaveValue("2024-01-01");
        expect(getCashFlowReport).toHaveBeenLastCalledWith({ date_from: "2024-01-01" });
    });

    it("refetches with date_to when the end date changes", () => {
        render(<CashFlow />);

        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2024-03-31" } });

        expect(getCashFlowReport).toHaveBeenLastCalledWith({ date_to: "2024-03-31" });
    });

    it("refetches with both dates once both are set", () => {
        render(<CashFlow />);

        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2024-01-01" } });
        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2024-03-31" } });

        expect(getCashFlowReport).toHaveBeenLastCalledWith({
            date_from: "2024-01-01",
            date_to: "2024-03-31",
        });
    });

    it("limits the pickers: start <= end via max / min", () => {
        render(<CashFlow />);

        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2024-01-01" } });
        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2024-03-31" } });

        expect(screen.getByLabelText("Start date")).toHaveAttribute("max", "2024-03-31");
        expect(screen.getByLabelText("End date")).toHaveAttribute("min", "2024-01-01");
    });

    it("aborts the previous request when the date changes", () => {
        render(<CashFlow />);
        expect(abortMock).not.toHaveBeenCalled();

        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2024-01-01" } });

        expect(abortMock).toHaveBeenCalledTimes(1);
    });

    it("aborts the in-flight request on unmount", () => {
        const { unmount } = render(<CashFlow />);
        unmount();

        expect(abortMock).toHaveBeenCalledTimes(1);
    });

    it("resets to page 1 when a date changes", () => {
        render(<CashFlow />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        expect(screen.getByTestId("pagination")).toHaveTextContent("2/2");

        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2024-01-01" } });

        expect(screen.getByTestId("pagination")).toHaveTextContent("1/2");
    });

    // ---- Stats ----

    it("renders the five stat cards with their titles", () => {
        render(<CashFlow />);

        const titles = screen.getAllByTestId("stat-card").map((c) => c.firstChild.textContent);
        expect(titles).toEqual([
            "Opening Balance",
            "Cash Inflow",
            "Cash Outflow",
            "Net Cash Flow",
            "Closing Balance",
        ]);
    });

    it("shows the summary amounts formatted with 2 decimals", () => {
        render(<CashFlow />);

        expect(getStat("Opening Balance")).toHaveTextContent("1,000.00");
        expect(getStat("Cash Inflow")).toHaveTextContent("5,000.00");
        expect(getStat("Cash Outflow")).toHaveTextContent("2,000.00");
        expect(getStat("Net Cash Flow")).toHaveTextContent("3,000.00");
        expect(getStat("Closing Balance")).toHaveTextContent("4,000.00");
    });

    it("shows 0.00 for missing summary values", () => {
        setupSelectors({ summary: {} });
        render(<CashFlow />);

        expect(getStat("Opening Balance")).toHaveTextContent("0.00");
        expect(getStat("Closing Balance")).toHaveTextContent("0.00");
    });

    it("passes loading through to the stats cards", () => {
        setupSelectors({ loading: true });
        render(<CashFlow />);

        expect(screen.getByTestId("stats-cards")).toHaveAttribute("data-loading", "true");
    });

    // ---- Table ----

    it("renders column headers with the currency", () => {
        setupSelectors({ currency: "INR" });
        render(<CashFlow />);

        expect(table().getByText("PARTICULAR")).toBeInTheDocument();
        expect(table().getByText("Cash In (INR)")).toBeInTheDocument();
        expect(table().getByText("Cash Out (INR)")).toBeInTheDocument();
        expect(table().getByText("Net Amount (INR)")).toBeInTheDocument();
    });

    it("renders section, data and total rows (10 on the first page)", () => {
        render(<CashFlow />);

        expect(getRows()).toHaveLength(ROWS_PER_PAGE);
        expect(kindOf("section")).toHaveLength(3);
        expect(kindOf("data")).toHaveLength(4);
        expect(kindOf("total")).toHaveLength(3);
    });

    it("renders section names upper-cased and spanning all four columns", () => {
        render(<CashFlow />);

        expect(table().getByText("OPERATING ACTIVITIES")).toHaveAttribute("colspan", "4");
        expect(table().getByText("INVESTING ACTIVITIES")).toBeInTheDocument();
        expect(table().getByText("FINANCING ACTIVITIES")).toBeInTheDocument();
    });

    it("renders per-section totals as 'Net Cash from <section>'", () => {
        render(<CashFlow />);

        expect(table().getByText("Net Cash from Operating Activities")).toBeInTheDocument();
        expect(table().getByText("Net Cash from Investing Activities")).toBeInTheDocument();
        expect(table().getByText("Net Cash from Financing Activities")).toBeInTheDocument();
    });

    it("keeps rows in report order", () => {
        render(<CashFlow />);

        const names = getRows().map((r) => r.firstChild.textContent);
        expect(names).toEqual([
            "OPERATING ACTIVITIES",
            "Cash from customers",
            "Paid to suppliers",
            "Net Cash from Operating Activities",
            "INVESTING ACTIVITIES",
            "Purchase of equipment",
            "Net Cash from Investing Activities",
            "FINANCING ACTIVITIES",
            "Loan proceeds",
            "Net Cash from Financing Activities",
        ]);
    });

    it("formats cash in / cash out / net amounts", () => {
        render(<CashFlow />);

        const cells = cellsOf("Cash from customers");
        expect(cells[1]).toHaveTextContent("5,000.00");
        expect(cells[2]).toHaveTextContent("0.00");
        expect(cells[3]).toHaveTextContent("5,000.00");
    });

    it("marks the net cell positive when there is cash in and no cash out", () => {
        render(<CashFlow />);
        expect(cellsOf("Cash from customers")[3]).toHaveClass("positive");
    });

    it("marks the net cell negative when there is cash out", () => {
        render(<CashFlow />);
        expect(cellsOf("Paid to suppliers")[3]).toHaveClass("negative");
        expect(cellsOf("Paid to suppliers")[3]).toHaveTextContent("-2,000.00");
    });

    it("gives no colour class when cash in and out are both zero", () => {
        setupSelectors({
            sections: {
                ...buildSections(),
                financing: makeSection(
                    "Financing Activities",
                    [{ id: 4, particular: "Zero movement", cashIn: 0, cashOut: 0, netAmount: 0 }],
                    { cashIn: 0, cashOut: 0, netAmount: 0 }
                ),
            },
        });
        render(<CashFlow />);

        const net = cellsOf("Zero movement")[3];
        expect(net).not.toHaveClass("positive");
        expect(net).not.toHaveClass("negative");
    });

    it("shows a Loading row and hides report rows while loading", () => {
        setupSelectors({ loading: true });
        render(<CashFlow />);

        expect(table().getByText("Loading...")).toBeInTheDocument();
        expect(screen.queryByText("Cash from customers")).not.toBeInTheDocument();
        expect(screen.queryByText("No records found.")).not.toBeInTheDocument();
    });

    it("shows an empty state when there are no matching rows", () => {
        render(<CashFlow />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "zzz" } });

        expect(screen.getByText("No records found.")).toBeInTheDocument();
    });

    // ---- Amount formatting (verified through the table cells) ----

    it.each([
        [null, "0.00"],
        [undefined, "0.00"],
        ["", "0.00"],
        [0, "0.00"],
        [1234.5, "1,234.50"],
        ["1000.00", "1,000.00"],
        [10.456, "10.46"],
        [-2000, "-2,000.00"],
    ])("formats %p as %s", (input, expected) => {
        setupSelectors({
            sections: {
                ...buildSections(),
                operating: makeSection(
                    "Operating Activities",
                    [{ id: 1, particular: "Formatted row", cashIn: input, cashOut: 0, netAmount: 0 }],
                    { cashIn: 0, cashOut: 0, netAmount: 0 }
                ),
            },
        });
        render(<CashFlow />);

        expect(cellsOf("Formatted row")[1].textContent).toBe(expected);
    });

    // ---- Closing balance ----

    it("shows the closing balance with the currency", () => {
        render(<CashFlow />);

        expect(screen.getByText("Closing Cash Balance")).toBeInTheDocument();
        expect(screen.getByTestId("closing-amount")).toHaveTextContent("4,000.00 USD");
    });

    it("uses the currency from the report", () => {
        setupSelectors({ currency: "SAR" });
        render(<CashFlow />);

        expect(screen.getByTestId("closing-amount")).toHaveTextContent("4,000.00 SAR");
    });

    // ---- Search (client-side) ----

    it("filters rows by particular (case-insensitive) without refetching", () => {
        render(<CashFlow />);
        const callsBefore = getCashFlowReport.mock.calls.length;

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "LOAN" } });

        const rows = getRows();
        expect(rows).toHaveLength(1);
        expect(rows[0]).toHaveTextContent("Loan proceeds");
        expect(getCashFlowReport.mock.calls.length).toBe(callsBefore);
    });

    it("matches section headers and their totals", () => {
        render(<CashFlow />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "investing" } });

        const names = getRows().map((r) => r.firstChild.textContent);
        expect(names).toEqual(["INVESTING ACTIVITIES", "Net Cash from Investing Activities"]);
    });

    it("searches across all pages, not only the visible one", () => {
        render(<CashFlow />);
        // "Net Cash Flow" grand total lives on page 2
        expect(screen.queryByText("Net Cash Flow", { selector: "td" })).not.toBeInTheDocument();

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "net cash flow" } });

        expect(table().getByText("Net Cash Flow")).toBeInTheDocument();
    });

    it("ignores the search value when cleared", () => {
        render(<CashFlow />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "loan" } });
        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "" } });

        expect(getRows()).toHaveLength(ROWS_PER_PAGE);
    });

    it("resets to page 1 when searching", () => {
        render(<CashFlow />);

        fireEvent.click(screen.getByText("next-page"));
        expect(screen.getByTestId("pagination")).toHaveTextContent("2/2");

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "loan" } });

        expect(screen.getByTestId("pagination")).toHaveTextContent("1/1");
    });

    // ---- Pagination ----

    it("shows 2 pages and the full record count for 11 rows", () => {
        render(<CashFlow />);

        expect(screen.getByTestId("pagination")).toHaveTextContent("1/2");
        expect(screen.getByTestId("pagination")).toHaveAttribute("data-total-records", "11");
    });

    it("shows the remaining row on page 2", () => {
        render(<CashFlow />);

        fireEvent.click(screen.getByText("next-page"));

        const rows = getRows();
        expect(rows).toHaveLength(1);
        expect(rows[0]).toHaveTextContent("Net Cash Flow");
        expect(rows[0]).toHaveAttribute("data-kind", "total");
    });

    it("paginating is client-side and does not refetch", () => {
        render(<CashFlow />);
        const callsBefore = getCashFlowReport.mock.calls.length;

        fireEvent.click(screen.getByText("next-page"));

        expect(getCashFlowReport.mock.calls.length).toBe(callsBefore);
    });

    it("always shows at least 1 page when nothing matches", () => {
        render(<CashFlow />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "zzz" } });

        expect(screen.getByTestId("pagination")).toHaveTextContent("1/1");
        expect(screen.getByTestId("pagination")).toHaveAttribute("data-total-records", "0");
    });

    it("falls back to the last page when the report shrinks", () => {
        const { rerender } = render(<CashFlow />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        expect(screen.getByTestId("pagination")).toHaveTextContent("2/2");

        // 1 row per section => 10 rows total => a single page
        setupSelectors({
            sections: {
                ...buildSections(),
                operating: makeSection(
                    "Operating Activities",
                    [{ id: 1, particular: "Cash from customers", cashIn: 5000, cashOut: 0, netAmount: 5000 }],
                    { cashIn: 5000, cashOut: 0, netAmount: 5000 }
                ),
            },
        });
        rerender(<CashFlow />);

        expect(screen.getByTestId("pagination")).toHaveTextContent("1/1");
    });

    // ---- Error handling ----

    it("shows no error message when there is no error", () => {
        render(<CashFlow />);

        expect(screen.queryByText("Failed to load cash flow report")).not.toBeInTheDocument();
    });

    it("shows a string error as-is and hides the report rows", () => {
        setupSelectors({ error: "Network down" });
        render(<CashFlow />);

        expect(screen.getByText("Network down")).toBeInTheDocument();
        expect(screen.queryByText("Cash from customers")).not.toBeInTheDocument();
        expect(screen.queryByText("No records found.")).not.toBeInTheDocument();
    });

    it("shows error.detail for object errors", () => {
        setupSelectors({ error: { detail: "Not authorised" } });
        render(<CashFlow />);

        expect(screen.getByText("Not authorised")).toBeInTheDocument();
    });

    it("shows error.message when there is no detail", () => {
        setupSelectors({ error: { message: "Timeout" } });
        render(<CashFlow />);

        expect(screen.getByText("Timeout")).toBeInTheDocument();
    });

    it("falls back to a generic message when the error object has neither", () => {
        setupSelectors({ error: {} });
        render(<CashFlow />);

        expect(screen.getByText("Failed to load cash flow report")).toBeInTheDocument();
    });

    it("prefers error.detail over error.message", () => {
        setupSelectors({ error: { detail: "Detail wins", message: "Message loses" } });
        render(<CashFlow />);

        expect(screen.getByText("Detail wins")).toBeInTheDocument();
        expect(screen.queryByText("Message loses")).not.toBeInTheDocument();
    });

    it("shows Loading... instead of the error while loading", () => {
        setupSelectors({ loading: true, error: "Network down" });
        render(<CashFlow />);

        expect(screen.getByText("Loading...")).toBeInTheDocument();
        expect(screen.queryByText("Network down")).not.toBeInTheDocument();
    });

    it("clears the error when a date changes while an error is shown", () => {
        setupSelectors({ error: "Network down" });
        render(<CashFlow />);

        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2024-01-01" } });

        expect(clearCashFlowReportError).toHaveBeenCalledTimes(1);
    });

    it("does not dispatch clear when there is no error", () => {
        render(<CashFlow />);

        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2024-01-01" } });
        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2024-02-01" } });

        expect(clearCashFlowReportError).not.toHaveBeenCalled();
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

        it("downloads cash-flow-statement.csv", () => {
            render(<CashFlow />);
            exportCsv();

            expect(clickSpy).toHaveBeenCalledTimes(1);
            expect(downloadName).toBe("cash-flow-statement.csv");
            expect(blobArgs.options).toEqual({ type: "text/csv;charset=utf-8;" });
            expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
            expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock");
        });

        it("writes a header row that includes the currency", () => {
            render(<CashFlow />);

            expect(exportCsv().split("\n")[0]).toBe(
                '"Particular","Cash In (USD)","Cash Out (USD)","Net Amount (USD)"'
            );
        });

        it("exports every row (not just the visible page) plus opening / closing balances", () => {
            render(<CashFlow />);

            const lines = exportCsv().split("\n");
            // header + 11 report rows + opening + closing
            expect(lines).toHaveLength(14);
            expect(lines[1]).toBe('"OPERATING ACTIVITIES","","",""');
            expect(lines[2]).toBe('"Cash from customers","5000","0","5000"');
            expect(lines[11]).toBe('"Net Cash Flow","5800","2500","3300"');
            expect(lines[12]).toBe('"Opening Cash Balance","","","1000"');
            expect(lines[13]).toBe('"Closing Cash Balance","","","4000"');
        });

        it("exports everything even when a search filter is active", () => {
            render(<CashFlow />);

            fireEvent.change(screen.getByTestId("search-input"), { target: { value: "loan" } });

            expect(exportCsv().split("\n")).toHaveLength(14);
        });

        it("escapes double quotes in cells", () => {
            setupSelectors({
                sections: {
                    ...buildSections(),
                    financing: makeSection(
                        "Financing Activities",
                        [{ id: 4, particular: 'Loan "Alpha"', cashIn: 800, cashOut: 0, netAmount: 800 }],
                        { cashIn: 800, cashOut: 0, netAmount: 800 }
                    ),
                },
            });
            render(<CashFlow />);

            expect(exportCsv()).toContain('"Loan ""Alpha"""');
        });

        it("disables the Export button while loading", () => {
            setupSelectors({ loading: true });
            render(<CashFlow />);

            expect(screen.getByTestId("export-button")).toBeDisabled();
        });
    });
});