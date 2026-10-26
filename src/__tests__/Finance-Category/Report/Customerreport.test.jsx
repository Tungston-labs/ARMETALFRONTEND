import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

// ---- PATHS ----
// This file is expected at src/__tests__/Finance-Category/Report/, so every
// import and vi.mock() path is relative to that folder. The page folder below
// is assumed to be "Customer-Reports". If your real folder name differs, run:
//   sed -i 's#REPORTS/Customer-Reports/#REPORTS/<YOUR-FOLDER>/#g' CustomerReport.test.jsx
import CustomerReport from "../../../Pages/FinanceModule/REPORTS/Customer-Reports/CustomerReport";

import { useDispatch, useSelector } from "react-redux";
import { getCustomerReport } from "../../../Redux/finance/reports/Customerreportslice";
import { getCustomers } from "../../../Redux/finance/Sales/CustomerSlice";
import {
    formatSAR,
    normalize,
    PAGE_SIZE,
    STATUS_OPTIONS,
} from "../../../Pages/FinanceModule/REPORTS/Customer-Reports/Usecustomerreport";

// NOTE: the real `useCustomerReport` hook is intentionally NOT mocked, so these
// tests exercise the component + hook together. Only the Redux plumbing and the
// presentational children are mocked.

// ---- react-redux ----
vi.mock("react-redux", () => ({
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
}));

// ---- Redux slices (actions are plain marker objects) ----
vi.mock("../../../Redux/finance/reports/Customerreportslice", () => ({
    getCustomerReport: vi.fn((params) => ({ type: "getCustomerReport", params })),
}));

vi.mock("../../../Redux/finance/Sales/CustomerSlice", () => ({
    getCustomers: vi.fn(() => ({ type: "getCustomers" })),
    selectCustomers: (state) => state.customers,
}));

// ---- Columns (real file imports the hook; keep the page test simple) ----
vi.mock("../../../Pages/FinanceModule/REPORTS/Customer-Reports/Customerreportcolumns", () => ({
    default: [{ accessor: "customer_name", header: "Customer" }],
}));

// ---- Presentational mocks ----
vi.mock("../../../Pages/FinanceModule/REPORTS/Customer-Reports/CustomerReport.styles", () => ({
    ExportButton: ({ children, ...props }) => (
        <button data-testid="export-button" {...props}>
            {children}
        </button>
    ),
    MainReportLayout: ({ children }) => <div data-testid="main-layout">{children}</div>,
    TableSide: ({ children }) => <div data-testid="table-side">{children}</div>,
}));

vi.mock("../../../Components/ReusableTable/ReusableHeader", () => ({
    default: ({ title, breadcrumbs = [], children }) => (
        <div data-testid="reusable-header">
            <h1>{title}</h1>
            <div data-testid="breadcrumbs">{breadcrumbs.join(" / ")}</div>
            <div data-testid="header-actions">{children}</div>
        </div>
    ),
}));

vi.mock("../../../Components/StatsCards/StatsCards", () => ({
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

vi.mock("../../../Components/ReusableTable/ReusableFilter", () => ({
    default: ({
        search,
        onSearch,
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
                    value={f.value}
                    onChange={(e) => f.onChange(e.target.value)}
                >
                    <option value="">{f.placeholder}</option>
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

vi.mock("../../../Components/ReusableTable/ReusableTable", () => ({
    default: ({ data = [], loading }) => (
        <div data-testid="reusable-table" data-loading={String(!!loading)}>
            {data.map((row) => (
                <div key={row.id} data-testid="table-row" data-id={row.id}>
                    {row.customer_name} | {row.invoice}
                </div>
            ))}
        </div>
    ),
}));

vi.mock("../../../Components/Pagination/ReusablePagination", () => ({
    default: ({ currentPage, totalPages, onPageChange }) => (
        <div data-testid="pagination">
            <span>
                {currentPage}/{totalPages}
            </span>
            <button onClick={() => onPageChange(currentPage + 1)}>next-page</button>
        </div>
    ),
}));

vi.mock("../../../Pages/FinanceModule/REPORTS/Customer-Reports/chart/CustomerRevenueDashboard", () => ({
    default: ({ selectedYear, selectedMonth, onYearChange, onMonthChange }) => (
        <div data-testid="revenue-chart">
            <span data-testid="chart-year">{selectedYear}</span>
            <span data-testid="chart-month">{selectedMonth}</span>
            <button onClick={() => onYearChange("2025")}>change-year</button>
            <button onClick={() => onMonthChange("3")}>change-month</button>
        </div>
    ),
}));

// ---- Fixtures ----

const buildState = (overrides = {}) => ({
    customers: [
        { id: 1, name: "ABC Trading" },
        { id: 2, customer_name: "Riyadh Tech" },
        { id: 3, company_name: "Al Noor" },
        { id: 4 }, // no name -> "Customer 4"
    ],
    customerReport: {
        report: [
            {
                customer_id: 1,
                customer_name: "ABC Trading",
                invoice: "INV-001",
                status: "Paid",
            },
            {
                customer_id: 2,
                customer_name: "Riyadh Tech",
                invoice: "INV-002",
                status: "partially_paid", // exercises normalize()
            },
            {
                customer_id: 3,
                customer_name: "Al Noor",
                invoice: "INV-003",
                status: "Unpaid",
            },
            {
                customer_id: 1,
                customer_name: "ABC Trading",
                invoice: "INV-004",
                status: "Overdue",
            },
        ],
        summary: {
            totalCustomers: 12,
            totalRevenue: 150000,
            paymentReceived: 90000,
            outstandingPayable: 60000,
            totalInvoices: 48,
        },
        pagination: { count: 40 },
        loading: false,
        error: null,
        ...overrides,
    },
});

const CURRENT_YEAR = String(new Date().getFullYear());
const CURRENT_MONTH = new Date().getMonth() + 1;

const getStat = (title) =>
    within(screen.getByTestId("stats-cards")).getByText(title).nextSibling;

describe("CustomerReport", () => {
    let dispatchMock;

    // `reportOverrides` patch state.customerReport; `topOverrides` patch top-level state.
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

    // ---- Structure ----

    it("renders header, stats, filter, table, pagination and chart", () => {
        render(<CustomerReport />);

        expect(screen.getByText("Customer Reports")).toBeInTheDocument();
        expect(screen.getByTestId("stats-cards")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-filter")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
        expect(screen.getByTestId("revenue-chart")).toBeInTheDocument();
    });

    it("renders the Reports / Customer Reports breadcrumbs", () => {
        render(<CustomerReport />);
        expect(screen.getByTestId("breadcrumbs")).toHaveTextContent("Reports / Customer Reports");
    });

    it("renders the Export Accounts button in the header actions", () => {
        render(<CustomerReport />);

        const button = within(screen.getByTestId("header-actions")).getByTestId("export-button");
        expect(button).toHaveTextContent("Export Accounts");
        expect(button).toHaveAttribute("type", "button");
    });

    // ---- Initial fetching ----

    it("dispatches getCustomers once on mount", () => {
        render(<CustomerReport />);

        expect(getCustomers).toHaveBeenCalledTimes(1);
    });

    it("dispatches getCustomerReport on mount for the current year/month and page 1", () => {
        render(<CustomerReport />);

        expect(getCustomerReport).toHaveBeenCalledWith({
            date_from: `${CURRENT_YEAR}-01-01`,
            date_to: `${CURRENT_YEAR}-12-31`,
            chart_year: CURRENT_YEAR,
            graph_year: CURRENT_YEAR,
            graph_month: CURRENT_MONTH,
            page: 1,
        });
    });

    // ---- Stats ----

    it("renders the five stat cards with their titles", () => {
        render(<CustomerReport />);

        const titles = screen.getAllByTestId("stat-card").map((c) => c.firstChild.textContent);
        expect(titles).toEqual([
            "Total Customers",
            "Total Revenue",
            "Payments Received",
            "Outstanding Receivables",
            "Total Invoice",
        ]);
    });

    it("shows counts from the summary, formatting money as SAR", () => {
        render(<CustomerReport />);

        expect(getStat("Total Customers")).toHaveTextContent("12");
        expect(getStat("Total Revenue")).toHaveTextContent(formatSAR(150000));
        expect(getStat("Payments Received")).toHaveTextContent(formatSAR(90000));
        expect(getStat("Outstanding Receivables")).toHaveTextContent(formatSAR(60000));
        expect(getStat("Total Invoice")).toHaveTextContent("48");
    });

    it("passes loading through to stats and table", () => {
        setupSelectors({ loading: true });
        render(<CustomerReport />);

        expect(screen.getByTestId("stats-cards")).toHaveAttribute("data-loading", "true");
        expect(screen.getByTestId("reusable-table")).toHaveAttribute("data-loading", "true");
    });

    // ---- Table rows ----

    it("renders a row per report item", () => {
        render(<CustomerReport />);

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(4);
        expect(rows[0]).toHaveTextContent("ABC Trading | INV-001");
    });

    it("uses the invoice number as each row's id", () => {
        render(<CustomerReport />);

        const ids = screen.getAllByTestId("table-row").map((r) => r.getAttribute("data-id"));
        expect(ids).toEqual(["INV-001", "INV-002", "INV-003", "INV-004"]);
    });

    it("renders no rows for an empty report", () => {
        setupSelectors({ report: [] });
        render(<CustomerReport />);

        expect(screen.queryAllByTestId("table-row")).toHaveLength(0);
    });

    // ---- Search (client-side) ----

    it("filters by invoice number (case-insensitive) without refetching", () => {
        render(<CustomerReport />);
        const callsBefore = getCustomerReport.mock.calls.length;

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "inv-003" } });

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(1);
        expect(rows[0]).toHaveTextContent("INV-003");
        expect(getCustomerReport.mock.calls.length).toBe(callsBefore);
    });

    it("filters by customer name", () => {
        render(<CustomerReport />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "abc" } });

        expect(screen.getAllByTestId("table-row")).toHaveLength(2);
    });

    it("filters by status text", () => {
        render(<CustomerReport />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "overdue" } });

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(1);
        expect(rows[0]).toHaveTextContent("INV-004");
    });

    it("ignores surrounding whitespace in the search term", () => {
        render(<CustomerReport />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "  INV-001  " } });

        expect(screen.getAllByTestId("table-row")).toHaveLength(1);
    });

    it("shows no rows when the search matches nothing", () => {
        render(<CustomerReport />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "zzz" } });

        expect(screen.queryAllByTestId("table-row")).toHaveLength(0);
    });

    // ---- Status filter (client-side) ----

    it("offers the four status options", () => {
        render(<CustomerReport />);

        const options = within(screen.getByTestId("status-select"))
            .getAllByRole("option")
            .map((o) => o.textContent);
        expect(options).toEqual(["all", ...STATUS_OPTIONS]);
    });

    it("filters rows by status", () => {
        render(<CustomerReport />);

        fireEvent.change(screen.getByTestId("status-select"), { target: { value: "Unpaid" } });

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(1);
        expect(rows[0]).toHaveTextContent("INV-003");
    });

    it("matches 'Partially Paid' against a 'partially_paid' status (normalized)", () => {
        render(<CustomerReport />);

        fireEvent.change(screen.getByTestId("status-select"), {
            target: { value: "Partially Paid" },
        });

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(1);
        expect(rows[0]).toHaveTextContent("INV-002");
    });

    it("clearing the status shows all rows again", () => {
        render(<CustomerReport />);

        fireEvent.change(screen.getByTestId("status-select"), { target: { value: "Paid" } });
        fireEvent.change(screen.getByTestId("status-select"), { target: { value: "" } });

        expect(screen.getAllByTestId("table-row")).toHaveLength(4);
    });

    // ---- Customer filter (client-side) ----

    it("builds customer options, falling back through name fields to 'Customer <id>'", () => {
        render(<CustomerReport />);

        const labels = within(screen.getByTestId("filter-customer"))
            .getAllByRole("option")
            .map((o) => o.textContent);
        expect(labels).toEqual([
            "Select Customer",
            "ABC Trading",
            "Riyadh Tech",
            "Al Noor",
            "Customer 4",
        ]);
    });

    it("filters rows by the selected customer id", () => {
        render(<CustomerReport />);

        fireEvent.change(screen.getByTestId("filter-customer"), { target: { value: "1" } });

        expect(screen.getByTestId("filter-customer")).toHaveValue("1");
        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(2);
        rows.forEach((r) => expect(r).toHaveTextContent("ABC Trading"));
    });

    it("combines status and customer filters", () => {
        render(<CustomerReport />);

        fireEvent.change(screen.getByTestId("filter-customer"), { target: { value: "1" } });
        fireEvent.change(screen.getByTestId("status-select"), { target: { value: "Overdue" } });

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(1);
        expect(rows[0]).toHaveTextContent("INV-004");
    });

    it("client-side filters do not trigger a refetch", () => {
        render(<CustomerReport />);
        const callsBefore = getCustomerReport.mock.calls.length;

        fireEvent.change(screen.getByTestId("status-select"), { target: { value: "Paid" } });
        fireEvent.change(screen.getByTestId("filter-customer"), { target: { value: "1" } });

        expect(getCustomerReport.mock.calls.length).toBe(callsBefore);
    });

    // ---- Pagination ----

    it("computes totalPages from pagination.count and PAGE_SIZE", () => {
        setupSelectors({ pagination: { count: 40 } });
        render(<CustomerReport />);

        expect(screen.getByTestId("pagination")).toHaveTextContent(`1/${Math.ceil(40 / PAGE_SIZE)}`);
    });

    it("always shows at least 1 page, even when count is 0", () => {
        setupSelectors({ pagination: { count: 0 } });
        render(<CustomerReport />);

        expect(screen.getByTestId("pagination")).toHaveTextContent("1/1");
    });

    it("rounds partial pages up (count = PAGE_SIZE + 1 -> 2 pages)", () => {
        setupSelectors({ pagination: { count: PAGE_SIZE + 1 } });
        render(<CustomerReport />);

        expect(screen.getByTestId("pagination")).toHaveTextContent("1/2");
    });

    it("dispatches getCustomerReport with the new page on page change", () => {
        render(<CustomerReport />);

        fireEvent.click(screen.getByText("next-page"));

        expect(screen.getByTestId("pagination")).toHaveTextContent("2/3");
        expect(getCustomerReport).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }));
    });

    // ---- Chart year / month ----

    it("passes the current year and month to the chart", () => {
        render(<CustomerReport />);

        expect(screen.getByTestId("chart-year")).toHaveTextContent(CURRENT_YEAR);
        expect(screen.getByTestId("chart-month")).toHaveTextContent(String(CURRENT_MONTH));
    });

    it("changing the year refetches for that year and resets to page 1", () => {
        render(<CustomerReport />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.click(screen.getByText("change-year"));

        expect(screen.getByTestId("chart-year")).toHaveTextContent("2025");
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
        expect(getCustomerReport).toHaveBeenLastCalledWith(
            expect.objectContaining({
                date_from: "2025-01-01",
                date_to: "2025-12-31",
                chart_year: "2025",
                graph_year: "2025",
                page: 1,
            })
        );
    });

    it("changing the month converts it to a number, refetches, and resets to page 1", () => {
        render(<CustomerReport />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.click(screen.getByText("change-month"));

        expect(screen.getByTestId("chart-month")).toHaveTextContent("3");
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
        expect(getCustomerReport).toHaveBeenLastCalledWith(
            expect.objectContaining({ graph_month: 3, page: 1 })
        );
    });

    // ---- Error handling ----

    it("shows no error message when there is no error", () => {
        render(<CustomerReport />);

        expect(screen.queryByText("Failed to load customer report")).not.toBeInTheDocument();
    });

    it("shows a string error as-is", () => {
        setupSelectors({ error: "Network down" });
        render(<CustomerReport />);

        expect(screen.getByText("Network down")).toBeInTheDocument();
    });

    it("shows error.detail for object errors", () => {
        setupSelectors({ error: { detail: "Not authorised" } });
        render(<CustomerReport />);

        expect(screen.getByText("Not authorised")).toBeInTheDocument();
    });

    it("falls back to a generic message when the error object has no detail", () => {
        setupSelectors({ error: {} });
        render(<CustomerReport />);

        expect(screen.getByText("Failed to load customer report")).toBeInTheDocument();
    });
});

// ---- Exported helpers from Usecustomerreport ----

describe("Usecustomerreport helpers", () => {
    describe("formatSAR", () => {
        it("prefixes values with 'SAR'", () => {
            expect(formatSAR(1500)).toMatch(/^SAR /);
        });

        it.each([[undefined], [null], [""], [0]])("returns 'SAR 0' for %p", (value) => {
            expect(formatSAR(value)).toBe("SAR 0");
        });

        it("rounds to at most 2 decimal places", () => {
            expect(formatSAR(10.456)).toBe(
                `SAR ${(10.456).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
            );
            expect(formatSAR(10.456)).not.toMatch(/10\.456/);
        });
    });

    describe("normalize", () => {
        it("lower-cases, trims and replaces spaces with underscores", () => {
            expect(normalize("  Partially Paid ")).toBe("partially_paid");
        });

        it("collapses repeated whitespace", () => {
            expect(normalize("Over   Due")).toBe("over_due");
        });

        it.each([[null], [undefined]])("returns '' for %p", (value) => {
            expect(normalize(value)).toBe("");
        });
    });

    it("exposes the expected constants", () => {
        expect(PAGE_SIZE).toBe(15);
        expect(STATUS_OPTIONS).toEqual(["Paid", "Partially Paid", "Unpaid", "Overdue"]);
    });
});