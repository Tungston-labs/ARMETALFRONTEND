import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

// ---- PATH PLACEHOLDER ----
// These paths assume this test file lives in the SAME folder as SalesReports.jsx
// (every vi.mock() path below is copied verbatim from SalesReports.jsx's and
// Usesalesreport.js's own imports). If you move this file, update the
// `import SalesReports` line AND every vi.mock(...) path. Mock paths resolve
// relative to THIS file, not the component.
import SalesReports from "../../../Pages/FinanceModule/REPORTS/Sales-Reports/SalesReports";

import { useDispatch, useSelector } from "react-redux";
import {
    getSalesReport,
    exportSalesReport,
} from "../../../Redux/finance/reports/Salesreportslice";
import { getCustomers } from "../../../Redux/finance/Sales/CustomerSlice";
import { buildStatsCards, buildCustomerOptions } from "../../../Pages/FinanceModule/REPORTS/Sales-Reports/Salesreportconfig";

// NOTE: the real `useSalesReport` hook (./Usesalesreport) is intentionally NOT
// mocked, so these tests exercise the component + hook together. Only the
// Redux plumbing and presentational children are mocked.

// ---- react-redux ----
vi.mock("react-redux", () => ({
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
}));

// ---- Redux slices (actions are plain marker objects) ----
vi.mock("../../../Redux/finance/reports/Salesreportslice", () => ({
    getSalesReport: vi.fn((params) => ({ type: "getSalesReport", params })),
    exportSalesReport: vi.fn((filters) => ({ type: "exportSalesReport", filters })),
}));

vi.mock("../../../Redux/finance/Sales/CustomerSlice", () => ({
    getCustomers: vi.fn((params) => ({ type: "getCustomers", params })),
    selectCustomers: (state) => state.customers,
}));

// ---- Config helpers (simplified, so tests don't depend on JSX icons etc.) ----
vi.mock("../../../Pages/FinanceModule/REPORTS/Sales-Reports/Salesreportconfig", () => ({
    buildStatsCards: vi.fn((summary = {}) => [
        { title: "Total Sales Revenue", count: summary.total_sales_revenue ?? 0 },
        { title: "Total Invoices", count: summary.total_invoices ?? 0 },
    ]),
    buildCustomerOptions: vi.fn((customers = []) =>
        customers.map((c) => ({ label: c.name, value: c.id }))
    ),
    salesColumns: [{ accessor: "invoice_number", header: "Invoice No." }],
    statusOptions: ["Unpaid", "Partial", "Paid"],
}));

// ---- Presentational mocks ----
vi.mock("../../../Pages/FinanceModule/REPORTS/Sales-Reports/SalesReports.styles", () => ({
    DateRangeWrapper: ({ children }) => <div data-testid="date-range">{children}</div>,
    DatePickerContainer: ({ children }) => <div>{children}</div>,
    DateInput: (props) => <input {...props} />,
    DateSeparator: ({ children }) => <span>{children}</span>,
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

vi.mock("../../../Components/ReusableTable/ReusableTable", () => ({
    default: ({ data = [], loading }) => (
        <div data-testid="reusable-table" data-loading={String(!!loading)}>
            {data.map((row) => (
                <div
                    key={row.id}
                    data-testid="table-row"
                    data-amount-type={typeof row.amount}
                    data-net-amount={row.net_amount}
                >
                    {row.invoice_number} | {row.customer}
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

vi.mock("../../../Pages/FinanceModule/REPORTS/Sales-Reports/Chart/SalesTrendChart", () => ({
    default: ({ data = [], year, onYearChange, loading }) => (
        <div data-testid="trend-chart" data-loading={String(!!loading)}>
            <span data-testid="chart-year">{year}</span>
            <span data-testid="chart-months">{data.length}</span>
            <button onClick={() => onYearChange("2024")}>change-year</button>
        </div>
    ),
}));

// ---- Fixtures ----

const buildInvoice = (i, overrides = {}) => ({
    invoice_id: i,
    invoice_number: `INV-00${i}`,
    date: "2026-01-05",
    customer: `Customer ${i}`,
    amount: "1000",
    tax_amount: "50",
    discount: "10",
    net_amount: "1040",
    paid: "500",
    credited: "0",
    products_sold: "3",
    status: "paid",
    ...overrides,
});

const buildState = (overrides = {}) => ({
    customers: [
        { id: 1, name: "ABC Trading" },
        { id: 2, name: "Riyadh Tech" },
    ],
    salesReport: {
        invoices: [
            buildInvoice(1, { customer: "ABC Trading" }),
            buildInvoice(2, { customer: "Riyadh Tech" }),
            buildInvoice(3, { customer: "Al Noor" }),
        ],
        summary: { total_sales_revenue: 5000, total_invoices: 3 },
        chart: { months: [{ month: 1, label: "Jan", revenue: 100 }] },
        pagination: { totalPages: 3 },
        loading: false,
        error: null,
        exporting: false,
        exportError: null,
        ...overrides,
    },
});

const CURRENT_YEAR = new Date().getFullYear();

describe("SalesReports", () => {
    let dispatchMock;

    // `reportOverrides` patch state.salesReport; `topOverrides` patch top-level state.
    const setupSelectors = (reportOverrides = {}, topOverrides = {}) => {
        const base = buildState(reportOverrides);
        const state = { ...base, ...topOverrides };
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
        render(<SalesReports />);

        expect(screen.getByText("Sales Reports")).toBeInTheDocument();
        expect(screen.getByTestId("stats-cards")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-filter")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
        expect(screen.getByTestId("trend-chart")).toBeInTheDocument();
    });

    it("renders the Reports / Sales Reports breadcrumbs", () => {
        render(<SalesReports />);
        expect(screen.getByTestId("breadcrumbs")).toHaveTextContent("Reports / Sales Reports");
    });

    it("renders the date range and export button inside the header actions", () => {
        render(<SalesReports />);

        const actions = within(screen.getByTestId("header-actions"));
        expect(actions.getByTestId("date-range")).toBeInTheDocument();
        expect(actions.getByLabelText("Start date")).toBeInTheDocument();
        expect(actions.getByLabelText("End date")).toBeInTheDocument();
        expect(actions.getByTestId("export-button")).toBeInTheDocument();
    });

    // ---- Initial fetching ----

    it("dispatches getCustomers (page 1, page_size 1000) once on mount", () => {
        render(<SalesReports />);

        expect(getCustomers).toHaveBeenCalledTimes(1);
        expect(getCustomers).toHaveBeenCalledWith({ page: 1, page_size: 1000 });
    });

    it("dispatches getSalesReport on mount with default filters and page 1", () => {
        render(<SalesReports />);

        expect(getSalesReport).toHaveBeenCalledWith({
            status: "",
            customer: "all",
            category: "all",
            year: CURRENT_YEAR,
            date_from: "",
            date_to: "",
            page: 1,
        });
    });

    // ---- Stats ----

    it("builds stat cards from the summary selector", () => {
        render(<SalesReports />);

        expect(buildStatsCards).toHaveBeenCalledWith(
            expect.objectContaining({ total_sales_revenue: 5000, total_invoices: 3 })
        );
        const stats = within(screen.getByTestId("stats-cards"));
        expect(stats.getByText("Total Sales Revenue").nextSibling).toHaveTextContent("5000");
        expect(stats.getByText("Total Invoices").nextSibling).toHaveTextContent("3");
    });

    // ---- Table rows / loading ----

    it("renders a row per invoice", () => {
        render(<SalesReports />);

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(3);
        expect(rows[0]).toHaveTextContent("INV-001 | ABC Trading");
    });

    it("converts numeric string fields on each row to numbers", () => {
        render(<SalesReports />);

        const row = screen.getAllByTestId("table-row")[0];
        expect(row).toHaveAttribute("data-amount-type", "number");
        expect(row).toHaveAttribute("data-net-amount", "1040");
    });

    it("passes loading through to stats, table and chart", () => {
        setupSelectors({ loading: true });
        render(<SalesReports />);

        expect(screen.getByTestId("stats-cards")).toHaveAttribute("data-loading", "true");
        expect(screen.getByTestId("reusable-table")).toHaveAttribute("data-loading", "true");
        expect(screen.getByTestId("trend-chart")).toHaveAttribute("data-loading", "true");
    });

    // ---- Search (client-side) ----

    it("filters rows by invoice number (case-insensitive) without dispatching", () => {
        render(<SalesReports />);
        const callsBefore = getSalesReport.mock.calls.length;

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "inv-002" } });

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(1);
        expect(rows[0]).toHaveTextContent("INV-002");
        expect(getSalesReport.mock.calls.length).toBe(callsBefore);
    });

    it("filters rows by customer name", () => {
        render(<SalesReports />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "noor" } });

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(1);
        expect(rows[0]).toHaveTextContent("Al Noor");
    });

    it("shows no rows when the search matches nothing", () => {
        render(<SalesReports />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "zzz" } });

        expect(screen.queryAllByTestId("table-row")).toHaveLength(0);
    });

    it("ignores surrounding whitespace in the search term", () => {
        render(<SalesReports />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "  INV-003  " } });

        expect(screen.getAllByTestId("table-row")).toHaveLength(1);
    });

    // ---- Status filter ----

    it("offers Unpaid, Partial and Paid as status options", () => {
        render(<SalesReports />);

        const options = within(screen.getByTestId("status-select"))
            .getAllByRole("option")
            .map((o) => o.textContent);
        expect(options).toEqual(["all", "Unpaid", "Partial", "Paid"]);
    });

    it("dispatches the lower-cased status and resets to page 1", () => {
        render(<SalesReports />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.change(screen.getByTestId("status-select"), { target: { value: "Paid" } });

        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
        expect(getSalesReport).toHaveBeenLastCalledWith(
            expect.objectContaining({ status: "paid", page: 1 })
        );
    });

    it("clearing the status sends an empty status", () => {
        render(<SalesReports />);

        fireEvent.change(screen.getByTestId("status-select"), { target: { value: "Paid" } });
        fireEvent.change(screen.getByTestId("status-select"), { target: { value: "" } });

        expect(getSalesReport).toHaveBeenLastCalledWith(expect.objectContaining({ status: "" }));
    });

    // ---- Customer filter ----

    it("builds customer options from the customers selector", () => {
        render(<SalesReports />);

        expect(buildCustomerOptions).toHaveBeenCalledWith([
            { id: 1, name: "ABC Trading" },
            { id: 2, name: "Riyadh Tech" },
        ]);
        const labels = within(screen.getByTestId("filter-customer"))
            .getAllByRole("option")
            .map((o) => o.textContent);
        expect(labels).toEqual(["All Customers", "ABC Trading", "Riyadh Tech"]);
    });

    it("dispatches the selected customer and resets to page 1", () => {
        render(<SalesReports />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.change(screen.getByTestId("filter-customer"), { target: { value: "2" } });

        expect(screen.getByTestId("filter-customer")).toHaveValue("2");
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
        expect(getSalesReport).toHaveBeenLastCalledWith(
            expect.objectContaining({ customer: "2", page: 1 })
        );
    });

    // ---- Date range ----
    // NOTE: these fail until useSalesReport's return object includes
    // dateFrom, dateTo, handleDateFromChange and handleDateToChange.

    it("starts with empty date inputs", () => {
        render(<SalesReports />);

        expect(screen.getByLabelText("Start date")).toHaveValue("");
        expect(screen.getByLabelText("End date")).toHaveValue("");
    });

    it("dispatches date_from and resets the page when the start date changes", () => {
        render(<SalesReports />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2026-01-01" } });

        expect(screen.getByLabelText("Start date")).toHaveValue("2026-01-01");
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
        expect(getSalesReport).toHaveBeenLastCalledWith(
            expect.objectContaining({ date_from: "2026-01-01", page: 1 })
        );
    });

    it("dispatches date_to and resets the page when the end date changes", () => {
        render(<SalesReports />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2026-01-31" } });

        expect(screen.getByLabelText("End date")).toHaveValue("2026-01-31");
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
        expect(getSalesReport).toHaveBeenLastCalledWith(
            expect.objectContaining({ date_to: "2026-01-31", page: 1 })
        );
    });

    it("bounds start/end inputs against each other via max/min", () => {
        render(<SalesReports />);

        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2026-01-01" } });
        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2026-01-31" } });

        expect(screen.getByLabelText("Start date")).toHaveAttribute("max", "2026-01-31");
        expect(screen.getByLabelText("End date")).toHaveAttribute("min", "2026-01-01");
    });

    // ---- Pagination ----

    it("shows currentPage/totalPages from the pagination selector", () => {
        setupSelectors({ pagination: { totalPages: 7 } });
        render(<SalesReports />);

        expect(screen.getByTestId("pagination")).toHaveTextContent("1/7");
    });

    it("dispatches getSalesReport with the new page on page change", () => {
        render(<SalesReports />);

        fireEvent.click(screen.getByText("next-page"));

        expect(screen.getByTestId("pagination")).toHaveTextContent("2/3");
        expect(getSalesReport).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }));
    });

    // ---- Chart / year ----

    it("passes the current year and month data to the chart", () => {
        render(<SalesReports />);

        expect(screen.getByTestId("chart-year")).toHaveTextContent(String(CURRENT_YEAR));
        expect(screen.getByTestId("chart-months")).toHaveTextContent("1");
    });

    it("changing the year refetches with a numeric year but keeps the current page", () => {
        render(<SalesReports />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.click(screen.getByText("change-year"));

        expect(screen.getByTestId("chart-year")).toHaveTextContent("2024");
        expect(screen.getByTestId("pagination")).toHaveTextContent("2/3");
        expect(getSalesReport).toHaveBeenLastCalledWith(
            expect.objectContaining({ year: 2024, page: 2 })
        );
    });

    // ---- Export ----

    it("shows 'Export Report' and an enabled button by default", () => {
        render(<SalesReports />);

        const button = screen.getByTestId("export-button");
        expect(button).toHaveTextContent("Export Report");
        expect(button).not.toBeDisabled();
    });

    it("dispatches exportSalesReport with the current filters (no page) on click", () => {
        render(<SalesReports />);

        fireEvent.change(screen.getByTestId("status-select"), { target: { value: "Unpaid" } });
        fireEvent.click(screen.getByTestId("export-button"));

        expect(exportSalesReport).toHaveBeenCalledTimes(1);
        const filters = exportSalesReport.mock.calls[0][0];
        expect(filters).toEqual(
            expect.objectContaining({ status: "unpaid", customer: "all", year: CURRENT_YEAR })
        );
        expect(filters).not.toHaveProperty("page");
    });

    it("shows 'Exporting...' and disables the button while exporting", () => {
        setupSelectors({ exporting: true });
        render(<SalesReports />);

        const button = screen.getByTestId("export-button");
        expect(button).toHaveTextContent("Exporting...");
        expect(button).toBeDisabled();
    });

    // ---- Error handling ----

    it("shows no error message when there is no error", () => {
        render(<SalesReports />);
        expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
    });

    it("shows a string error as-is", () => {
        setupSelectors({ error: "Network down" });
        render(<SalesReports />);

        expect(screen.getByText("Network down")).toBeInTheDocument();
    });

    it("prefers error.detail, then error.message", () => {
        setupSelectors({ error: { detail: "Detail msg", message: "Message msg" } });
        const { unmount } = render(<SalesReports />);
        expect(screen.getByText("Detail msg")).toBeInTheDocument();
        unmount();

        setupSelectors({ error: { message: "Message msg" } });
        render(<SalesReports />);
        expect(screen.getByText("Message msg")).toBeInTheDocument();
    });

    it("falls back to a generic message for unknown error shapes", () => {
        setupSelectors({ error: {} });
        render(<SalesReports />);

        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("shows the export error when there is no load error", () => {
        setupSelectors({ exportError: "Export failed" });
        render(<SalesReports />);

        expect(screen.getByText("Export failed")).toBeInTheDocument();
    });

    it("shows the load error instead of the export error when both exist", () => {
        setupSelectors({ error: "Load failed", exportError: "Export failed" });
        render(<SalesReports />);

        expect(screen.getByText("Load failed")).toBeInTheDocument();
        expect(screen.queryByText("Export failed")).not.toBeInTheDocument();
    });
});