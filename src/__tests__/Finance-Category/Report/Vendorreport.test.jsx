import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

// ---- PATHS ----
// This file is expected at src/__tests__/Finance-Category/Report/, so every
// import and vi.mock() path is relative to that folder. The page folder below
// is assumed to be "Vendor-Reports". If your real folder name differs, run:
//   sed -i 's#REPORTS/Vendor-Report/#REPORTS/<YOUR-FOLDER>/#g' VendorReport.test.jsx
import VendorReport from "../../../Pages/FinanceModule/REPORTS/Vendor-Report/VendorReport";

import { useDispatch, useSelector } from "react-redux";
import { getVendorReport } from "../../../Redux/finance/reports/Vendorreportslice";
import { getVendors } from "../../../Redux/finance/purchases/vendorsSlice";
import {
    formatSAR,
    normalize,
    PAGE_SIZE,
    STATUS_OPTIONS,
} from "../../../Pages/FinanceModule/REPORTS/Vendor-Report/Usevendorreport";

// NOTE: the real `useVendorReport` hook is intentionally NOT mocked, so these
// tests exercise the component + hook together. Only the Redux plumbing and the
// presentational children are mocked.

// ---- react-redux ----
vi.mock("react-redux", () => ({
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
}));

// ---- Redux slices (actions are plain marker objects) ----
vi.mock("../../../Redux/finance/reports/Vendorreportslice", () => ({
    getVendorReport: vi.fn((params) => ({ type: "getVendorReport", params })),
}));

vi.mock("../../../Redux/finance/purchases/vendorsSlice", () => ({
    getVendors: vi.fn((params) => ({ type: "getVendors", params })),
    selectVendors: (state) => state.vendors,
}));

// ---- Columns ----
vi.mock("../../../Pages/FinanceModule/REPORTS/Vendor-Report/Vendorreportcolumns", () => ({
    default: [{ accessor: "vendor_name", header: "Vendor" }],
}));

// ---- Presentational mocks ----
vi.mock("../../../Pages/FinanceModule/REPORTS/Vendor-Report/VendorReport.styles", () => ({
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
                <div
                    key={row.id}
                    data-testid="table-row"
                    data-id={row.id}
                    data-po-count={row.po_count}
                >
                    {row.vendor_name}
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

vi.mock("../../../Pages/FinanceModule/REPORTS/Vendor-Report/chart/VendorPurchaseDashboard", () => ({
    default: ({ selectedYear, selectedMonth, onYearChange, onMonthChange }) => (
        <div data-testid="purchase-chart">
            <span data-testid="chart-year">{selectedYear}</span>
            <span data-testid="chart-month">{selectedMonth}</span>
            <button onClick={() => onYearChange("2025")}>change-year</button>
            <button onClick={() => onMonthChange("3")}>change-month</button>
        </div>
    ),
}));

// ---- Fixtures ----

const buildState = (overrides = {}) => ({
    vendors: [
        { id: 1, vendor_name: "Alpha Supplies" },
        { id: 2, name: "Beta Traders" },
        { id: 3, company_name: "Gamma Metals" },
        { id: 4 }, // no name -> "Vendor 4"
    ],
    vendorReport: {
        report: [
            {
                vendor_id: 1,
                vendor_name: "Alpha Supplies",
                vendor_code: "V-001",
                status: "Paid",
                purchase_orders: ["PO-100", "PO-101"],
                payment_term: "30_days",
            },
            {
                vendor_id: 2,
                vendor_name: "Beta Traders",
                vendor_code: "V-002",
                status: "partially_paid", // exercises status text search
                purchase_orders: ["PO-200"],
                payment_term: "7_days",
            },
            {
                vendor_id: 3,
                vendor_name: "Gamma Metals",
                vendor_code: "V-003",
                status: "Unpaid",
                purchase_orders: [],
                payment_term: "15_days",
            },
            {
                vendor_id: 4,
                vendor_name: "Delta Co",
                vendor_code: "V-004",
                status: "Overdue",
                // purchase_orders missing, payment_term missing
            },
        ],
        kpis: {
            totalVendors: 12,
            totalBills: 48,
            totalPayments: 90000,
            outstandingPayables: 60000,
        },
        pagination: { totalPages: 3 },
        loading: false,
        error: null,
        ...overrides,
    },
});

const CURRENT_YEAR = String(new Date().getFullYear());
const CURRENT_MONTH = new Date().getMonth() + 1;

const getStat = (title) =>
    within(screen.getByTestId("stats-cards")).getByText(title).nextSibling;

const optionLabels = (testId) =>
    within(screen.getByTestId(testId))
        .getAllByRole("option")
        .map((o) => o.textContent);

describe("VendorReport", () => {
    let dispatchMock;

    // `reportOverrides` patch state.vendorReport; `topOverrides` patch top-level state.
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
        render(<VendorReport />);

        expect(screen.getByText("Vendor Reports")).toBeInTheDocument();
        expect(screen.getByTestId("stats-cards")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-filter")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
        expect(screen.getByTestId("purchase-chart")).toBeInTheDocument();
    });

    it("renders the Reports / Vendor Reports breadcrumbs", () => {
        render(<VendorReport />);
        expect(screen.getByTestId("breadcrumbs")).toHaveTextContent("Reports / Vendor Reports");
    });

    it("renders the Export Accounts button in the header actions", () => {
        render(<VendorReport />);

        const button = within(screen.getByTestId("header-actions")).getByTestId("export-button");
        expect(button).toHaveTextContent("Export Accounts");
        expect(button).toHaveAttribute("type", "button");
    });

    // ---- Initial fetching ----

    it("dispatches getVendors with page_size 1000 once on mount", () => {
        render(<VendorReport />);

        expect(getVendors).toHaveBeenCalledTimes(1);
        expect(getVendors).toHaveBeenCalledWith({ page_size: 1000 });
    });

    it("dispatches getVendorReport on mount with year/month/page and no optional filters", () => {
        render(<VendorReport />);

        expect(getVendorReport).toHaveBeenCalledWith({
            date_from: `${CURRENT_YEAR}-01-01`,
            date_to: `${CURRENT_YEAR}-12-31`,
            chart_year: CURRENT_YEAR,
            graph_year: CURRENT_YEAR,
            graph_month: CURRENT_MONTH,
            page: 1,
            page_size: PAGE_SIZE,
        });
    });

    // ---- Stats ----

    it("renders the four stat cards with their titles", () => {
        render(<VendorReport />);

        const titles = screen.getAllByTestId("stat-card").map((c) => c.firstChild.textContent);
        expect(titles).toEqual([
            "Total Vendors",
            "Total Bills",
            "Payments Made",
            "Outstanding Payables",
        ]);
    });

    it("shows counts from the KPIs, formatting money as SAR", () => {
        render(<VendorReport />);

        expect(getStat("Total Vendors")).toHaveTextContent("12");
        expect(getStat("Total Bills")).toHaveTextContent("48");
        expect(getStat("Payments Made")).toHaveTextContent(formatSAR(90000));
        expect(getStat("Outstanding Payables")).toHaveTextContent(formatSAR(60000));
    });

    it("passes loading through to stats and table", () => {
        setupSelectors({ loading: true });
        render(<VendorReport />);

        expect(screen.getByTestId("stats-cards")).toHaveAttribute("data-loading", "true");
        expect(screen.getByTestId("reusable-table")).toHaveAttribute("data-loading", "true");
    });

    // ---- Table rows ----

    it("renders a row per vendor in the report", () => {
        render(<VendorReport />);

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(4);
        expect(rows[0]).toHaveTextContent("Alpha Supplies");
    });

    it("uses vendor_id as each row's id", () => {
        render(<VendorReport />);

        const ids = screen.getAllByTestId("table-row").map((r) => r.getAttribute("data-id"));
        expect(ids).toEqual(["1", "2", "3", "4"]);
    });

    it("derives po_count from purchase_orders (0 when empty or missing)", () => {
        render(<VendorReport />);

        const counts = screen
            .getAllByTestId("table-row")
            .map((r) => r.getAttribute("data-po-count"));
        expect(counts).toEqual(["2", "1", "0", "0"]);
    });

    it("renders no rows for an empty report", () => {
        setupSelectors({ report: [] });
        render(<VendorReport />);

        expect(screen.queryAllByTestId("table-row")).toHaveLength(0);
    });

    // ---- Search (client-side) ----

    it("filters by vendor name (case-insensitive) without refetching", () => {
        render(<VendorReport />);
        const callsBefore = getVendorReport.mock.calls.length;

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "alpha" } });

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(1);
        expect(rows[0]).toHaveTextContent("Alpha Supplies");
        expect(getVendorReport.mock.calls.length).toBe(callsBefore);
    });

    it("filters by vendor code", () => {
        render(<VendorReport />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "v-003" } });

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(1);
        expect(rows[0]).toHaveTextContent("Gamma Metals");
    });

    it("filters by status text", () => {
        render(<VendorReport />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "overdue" } });

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(1);
        expect(rows[0]).toHaveTextContent("Delta Co");
    });

    it("filters by purchase order number", () => {
        render(<VendorReport />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "po-200" } });

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(1);
        expect(rows[0]).toHaveTextContent("Beta Traders");
    });

    it("ignores surrounding whitespace in the search term", () => {
        render(<VendorReport />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "  Alpha  " } });

        expect(screen.getAllByTestId("table-row")).toHaveLength(1);
    });

    it("shows no rows when the search matches nothing", () => {
        render(<VendorReport />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "zzz" } });

        expect(screen.queryAllByTestId("table-row")).toHaveLength(0);
    });

    it("does not reset the page when searching", () => {
        render(<VendorReport />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "alpha" } });

        expect(screen.getByTestId("pagination")).toHaveTextContent("2/3");
    });

    // ---- Status filter (server-side) ----

    it("offers the four status options", () => {
        render(<VendorReport />);

        expect(optionLabels("status-select")).toEqual(["all", ...STATUS_OPTIONS]);
    });

    it("sends the normalized status as payment_status and resets to page 1", () => {
        render(<VendorReport />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.change(screen.getByTestId("status-select"), {
            target: { value: "Partially Paid" },
        });

        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
        expect(getVendorReport).toHaveBeenLastCalledWith(
            expect.objectContaining({ payment_status: "partially_paid", page: 1 })
        );
    });

    it("omits payment_status again when the status is cleared", () => {
        render(<VendorReport />);

        fireEvent.change(screen.getByTestId("status-select"), { target: { value: "Paid" } });
        fireEvent.change(screen.getByTestId("status-select"), { target: { value: "" } });

        const lastParams = getVendorReport.mock.calls[getVendorReport.mock.calls.length - 1][0];
        expect(lastParams).not.toHaveProperty("payment_status");
    });

    // ---- Vendor filter (server-side) ----

    it("builds vendor options, falling back through name fields to 'Vendor <id>'", () => {
        render(<VendorReport />);

        expect(optionLabels("filter-vendor")).toEqual([
            "Select Vendor",
            "Alpha Supplies",
            "Beta Traders",
            "Gamma Metals",
            "Vendor 4",
        ]);
    });

    it("sends the selected vendor id and resets to page 1", () => {
        render(<VendorReport />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.change(screen.getByTestId("filter-vendor"), { target: { value: "2" } });

        expect(screen.getByTestId("filter-vendor")).toHaveValue("2");
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
        expect(getVendorReport).toHaveBeenLastCalledWith(
            expect.objectContaining({ vendor: "2", page: 1 })
        );
    });

    it("omits vendor when it is cleared", () => {
        render(<VendorReport />);

        fireEvent.change(screen.getByTestId("filter-vendor"), { target: { value: "2" } });
        fireEvent.change(screen.getByTestId("filter-vendor"), { target: { value: "" } });

        const lastParams = getVendorReport.mock.calls[getVendorReport.mock.calls.length - 1][0];
        expect(lastParams).not.toHaveProperty("vendor");
    });

    // ---- Payment term filter (server-side) ----

    it("builds payment term options from the report, formatted and sorted numerically", () => {
        render(<VendorReport />);

        expect(optionLabels("filter-paymentTerm")).toEqual([
            "Payment Term",
            "7 days",
            "15 days",
            "30 days",
        ]);
    });

    it("uses the raw payment_term as the option value", () => {
        render(<VendorReport />);

        const values = within(screen.getByTestId("filter-paymentTerm"))
            .getAllByRole("option")
            .map((o) => o.getAttribute("value"));
        expect(values).toEqual(["", "7_days", "15_days", "30_days"]);
    });

    it("sends the selected payment term and resets to page 1", () => {
        render(<VendorReport />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.change(screen.getByTestId("filter-paymentTerm"), {
            target: { value: "7_days" },
        });

        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
        expect(getVendorReport).toHaveBeenLastCalledWith(
            expect.objectContaining({ payment_term: "7_days", page: 1 })
        );
    });

    it("has no payment term options when no report row has a payment_term", () => {
        setupSelectors({ report: [{ vendor_id: 9, vendor_name: "X" }] });
        render(<VendorReport />);

        expect(optionLabels("filter-paymentTerm")).toEqual(["Payment Term"]);
    });

    it("keeps previously seen payment terms when a later report has different ones", () => {
        const { rerender } = render(<VendorReport />);
        expect(optionLabels("filter-paymentTerm")).toEqual([
            "Payment Term",
            "7 days",
            "15 days",
            "30 days",
        ]);

        setupSelectors({
            report: [{ vendor_id: 5, vendor_name: "New", payment_term: "60_days" }],
        });
        rerender(<VendorReport />);

        expect(optionLabels("filter-paymentTerm")).toEqual([
            "Payment Term",
            "7 days",
            "15 days",
            "30 days",
            "60 days",
        ]);
    });

    it("does not clear known payment terms when the report becomes empty", () => {
        const { rerender } = render(<VendorReport />);

        setupSelectors({ report: [] });
        rerender(<VendorReport />);

        expect(optionLabels("filter-paymentTerm")).toEqual([
            "Payment Term",
            "7 days",
            "15 days",
            "30 days",
        ]);
    });

    // ---- Combined server filters ----

    it("sends all active filters together and keeps them when changing page", () => {
        render(<VendorReport />);

        fireEvent.change(screen.getByTestId("filter-vendor"), { target: { value: "1" } });
        fireEvent.change(screen.getByTestId("status-select"), { target: { value: "Unpaid" } });
        fireEvent.change(screen.getByTestId("filter-paymentTerm"), {
            target: { value: "30_days" },
        });
        fireEvent.click(screen.getByText("next-page"));

        expect(getVendorReport).toHaveBeenLastCalledWith(
            expect.objectContaining({
                vendor: "1",
                payment_status: "unpaid",
                payment_term: "30_days",
                page: 2,
                page_size: PAGE_SIZE,
            })
        );
    });

    // ---- Pagination ----

    it("shows totalPages from the pagination selector", () => {
        setupSelectors({ pagination: { totalPages: 5 } });
        render(<VendorReport />);

        expect(screen.getByTestId("pagination")).toHaveTextContent("1/5");
    });

    it.each([[0], [undefined]])("falls back to 1 page when totalPages is %p", (totalPages) => {
        setupSelectors({ pagination: { totalPages } });
        render(<VendorReport />);

        expect(screen.getByTestId("pagination")).toHaveTextContent("1/1");
    });

    it("dispatches getVendorReport with the new page on page change", () => {
        render(<VendorReport />);

        fireEvent.click(screen.getByText("next-page"));

        expect(screen.getByTestId("pagination")).toHaveTextContent("2/3");
        expect(getVendorReport).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }));
    });

    // ---- Chart year / month ----

    it("passes the current year and month to the chart", () => {
        render(<VendorReport />);

        expect(screen.getByTestId("chart-year")).toHaveTextContent(CURRENT_YEAR);
        expect(screen.getByTestId("chart-month")).toHaveTextContent(String(CURRENT_MONTH));
    });

    it("changing the year refetches for that year and resets to page 1", () => {
        render(<VendorReport />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.click(screen.getByText("change-year"));

        expect(screen.getByTestId("chart-year")).toHaveTextContent("2025");
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
        expect(getVendorReport).toHaveBeenLastCalledWith(
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
        render(<VendorReport />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.click(screen.getByText("change-month"));

        expect(screen.getByTestId("chart-month")).toHaveTextContent("3");
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
        expect(getVendorReport).toHaveBeenLastCalledWith(
            expect.objectContaining({ graph_month: 3, page: 1 })
        );
    });

    // ---- Error handling ----

    it("shows no error message when there is no error", () => {
        render(<VendorReport />);

        expect(screen.queryByText("Failed to load vendor report")).not.toBeInTheDocument();
    });

    it("shows a string error as-is", () => {
        setupSelectors({ error: "Network down" });
        render(<VendorReport />);

        expect(screen.getByText("Network down")).toBeInTheDocument();
    });

    it("shows error.detail for object errors", () => {
        setupSelectors({ error: { detail: "Not authorised" } });
        render(<VendorReport />);

        expect(screen.getByText("Not authorised")).toBeInTheDocument();
    });

    it("falls back to a generic message when the error object has no detail", () => {
        setupSelectors({ error: {} });
        render(<VendorReport />);

        expect(screen.getByText("Failed to load vendor report")).toBeInTheDocument();
    });
});

// ---- Exported helpers from Usevendorreport ----

describe("Usevendorreport helpers", () => {
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