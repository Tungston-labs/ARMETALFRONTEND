import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

// ---- PATH PLACEHOLDER ----
// Confirm the real location with:  find src -iname 'SalesInvoices*'
// then update the import below AND the vi.mock path for SalesInvoices.styles
// to match — vi.mock paths resolve relative to THIS test file's location,
// not the component's.
import SalesInvoices from "../../../Pages/FinanceModule/SALES/Invoices/SalesInvoices";

vi.mock("../../../Components/ReusableTable/dummydata", () => ({
    employeeColumns: [{ accessor: "id", header: "ID" }],
    employeeData: Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `Order ${i + 1}`,
    })),
}));

vi.mock("../../../Pages/FinanceModule/SALES/Invoices/SalesInvoices.styles", () => ({
    DateRangeWrapper: ({ children }) => <div data-testid="date-range">{children}</div>,
    DatePickerContainer: ({ children }) => <div>{children}</div>,
    DateInput: (props) => <input {...props} />,
    DateSeparator: ({ children }) => <span>{children}</span>,
    ExportButton: ({ children, ...props }) => (
        <button data-testid="export-button" {...props}>
            {children}
        </button>
    ),
}));

vi.mock("../../../Components/ReusableTable/ReusableHeader", () => ({
    default: ({ title, breadcrumbs = [], buttonText, onButtonClick, children }) => (
        <div data-testid="reusable-header">
            <h1>{title}</h1>
            <div data-testid="breadcrumbs">{breadcrumbs.join(" / ")}</div>
            <button onClick={onButtonClick}>{buttonText}</button>
            <div data-testid="header-actions">{children}</div>
        </div>
    ),
}));

vi.mock("../../../Components/StatsCards/StatsCards", () => ({
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

vi.mock("../../../Components/ReusableTable/ReusableFilter", () => ({
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
        showFilterButton,
        filterButtonText,
        onFilterClick,
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

            {showFilterButton ? (
                <button data-testid="filter-button" onClick={onFilterClick}>
                    {filterButtonText}
                </button>
            ) : null}
        </div>
    ),
}));

vi.mock("../../../Components/ReusableTable/ReusableTable", () => ({
    default: ({ data = [], columns }) => (
        <div data-testid="reusable-table" data-columns={JSON.stringify(columns)}>
            {data.map((row) => (
                <div key={row.id} data-testid="table-row">
                    {row.name}
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
            <button onClick={() => onPageChange(currentPage - 1)}>prev-page</button>
        </div>
    ),
}));

// Mirrors the component's own getCurrentMonthRange so the default date
// values can be asserted without hardcoding "today".
const getExpectedMonthRange = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const fmt = (d) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
            d.getDate()
        ).padStart(2, "0")}`;
    return { start: fmt(firstDay), end: fmt(lastDay) };
};

const getDateInputs = () => ({
    start: screen.getByLabelText("Start date"),
    end: screen.getByLabelText("End date"),
});

describe("SalesInvoices", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ---- Structure ----

    it("renders header, stats cards, filter, table and pagination", () => {
        render(<SalesInvoices />);

        expect(screen.getByText("Invoices")).toBeInTheDocument();
        expect(screen.getByTestId("stats-cards")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-filter")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });

    it("renders the Sales / Invoices breadcrumbs", () => {
        render(<SalesInvoices />);

        expect(screen.getByTestId("breadcrumbs")).toHaveTextContent(
            "Sales / Invoices"
        );
    });

    it("renders the export button and date range inside the header", () => {
        render(<SalesInvoices />);

        const actions = within(screen.getByTestId("header-actions"));
        expect(actions.getByTestId("export-button")).toBeInTheDocument();
        expect(actions.getByTestId("date-range")).toBeInTheDocument();
    });

    it("logs when the ADD NEW INVOICE button is clicked", async () => {
        const user = userEvent.setup();
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        render(<SalesInvoices />);
        await user.click(screen.getByText("+ ADD NEW INVOICE"));

        expect(logSpy).toHaveBeenCalledWith("Add Sales invoice");
        logSpy.mockRestore();
    });

    // ---- Stats ----

    it("renders all 5 stat cards with Total Orders matching the dataset length", () => {
        render(<SalesInvoices />);

        const stats = within(screen.getByTestId("stats-cards"));
        const cards = stats.getAllByTestId("stat-card");
        expect(cards).toHaveLength(5);
        expect(stats.getByText("Total Orders").nextSibling).toHaveTextContent("25");
    });

    it("formats Total Amount as a currency placeholder", () => {
        render(<SalesInvoices />);

        const stats = within(screen.getByTestId("stats-cards"));
        expect(stats.getByText("Total Amount").nextSibling).toHaveTextContent(
            "SAR 0.00"
        );
    });

    // ---- Table / pagination against the mocked dataset (25 rows, page size 10) ----

    it("paginates the mocked dataset into pages of 10", () => {
        render(<SalesInvoices />);

        expect(screen.getAllByTestId("table-row")).toHaveLength(10);
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
    });

    it("shows the correct slice of data after moving to page 2", async () => {
        const user = userEvent.setup();
        render(<SalesInvoices />);

        await user.click(screen.getByText("next-page"));

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(10);
        expect(rows[0]).toHaveTextContent("Order 11");
        expect(rows[9]).toHaveTextContent("Order 20");
    });

    it("shows the remaining partial page (5 rows) on the last page", async () => {
        const user = userEvent.setup();
        render(<SalesInvoices />);

        await user.click(screen.getByText("next-page"));
        await user.click(screen.getByText("next-page"));

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(5);
        expect(rows[0]).toHaveTextContent("Order 21");
        expect(rows[4]).toHaveTextContent("Order 25");
    });

    it("passes employeeColumns through to the table unchanged", () => {
        render(<SalesInvoices />);

        const table = screen.getByTestId("reusable-table");
        expect(JSON.parse(table.getAttribute("data-columns"))).toEqual([
            { accessor: "id", header: "ID" },
        ]);
    });

    // ---- Search / status / customer / due-date filters (all reset the page) ----

    it("propagates search input to state and resets to page 1", async () => {
        const user = userEvent.setup();
        render(<SalesInvoices />);

        await user.click(screen.getByText("next-page"));
        fireEvent.change(screen.getByTestId("search-input"), {
            target: { value: "invoice" },
        });

        expect(screen.getByTestId("search-input")).toHaveValue("invoice");
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
    });

    it("renders the search placeholder", () => {
        render(<SalesInvoices />);
        expect(screen.getByPlaceholderText("Search Order")).toBeInTheDocument();
    });

    it("propagates status filter changes and resets to page 1", async () => {
        const user = userEvent.setup();
        render(<SalesInvoices />);

        await user.click(screen.getByText("next-page"));
        fireEvent.change(screen.getByTestId("status-select"), {
            target: { value: "Completed" },
        });

        expect(screen.getByTestId("status-select")).toHaveValue("Completed");
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
    });

    it("offers Completed, Pending and Cancelled as status options", () => {
        render(<SalesInvoices />);

        const select = screen.getByTestId("status-select");
        const options = within(select)
            .getAllByRole("option")
            .map((o) => o.textContent);

        expect(options).toEqual(["all", "Completed", "Pending", "Cancelled"]);
    });

    it("propagates customer filter changes and resets to page 1", async () => {
        const user = userEvent.setup();
        render(<SalesInvoices />);

        await user.click(screen.getByText("next-page"));
        fireEvent.change(screen.getByTestId("filter-customer"), {
            target: { value: "Riyadh Tech" },
        });

        expect(screen.getByTestId("filter-customer")).toHaveValue("Riyadh Tech");
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
    });

    it("lists all 4 customer options", () => {
        render(<SalesInvoices />);

        const select = screen.getByTestId("filter-customer");
        const labels = within(select)
            .getAllByRole("option")
            .map((o) => o.textContent);

        expect(labels).toEqual([
            "All Customer",
            "ABC Trading",
            "Riyadh Tech",
            "Al Noor Company",
            "Saudi Solutions",
        ]);
    });

    it("propagates due-date filter changes and resets to page 1", async () => {
        const user = userEvent.setup();
        render(<SalesInvoices />);

        await user.click(screen.getByText("next-page"));
        fireEvent.change(screen.getByTestId("filter-dueDate"), {
            target: { value: "overdue" },
        });

        expect(screen.getByTestId("filter-dueDate")).toHaveValue("overdue");
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
    });

    it("lists all 4 due-date options", () => {
        render(<SalesInvoices />);

        const select = screen.getByTestId("filter-dueDate");
        const labels = within(select)
            .getAllByRole("option")
            .map((o) => o.textContent);

        expect(labels).toEqual([
            "All Due Date",
            "Due Today",
            "Due This Week",
            "Overdue",
            "Due Later",
        ]);
    });

    it("logs when the Filter button is clicked", async () => {
        const user = userEvent.setup();
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        render(<SalesInvoices />);
        await user.click(screen.getByTestId("filter-button"));

        expect(logSpy).toHaveBeenCalledWith("Filter clicked");
        logSpy.mockRestore();
    });

    // ---- Date range defaults + behavior ----

    it("defaults the date range to the current calendar month", () => {
        render(<SalesInvoices />);

        const expected = getExpectedMonthRange();
        const { start, end } = getDateInputs();

        expect(start).toHaveValue(expected.start);
        expect(end).toHaveValue(expected.end);
    });

    it("updates startDate and resets the page", async () => {
        const user = userEvent.setup();
        render(<SalesInvoices />);

        await user.click(screen.getByText("next-page"));

        const { start } = getDateInputs();
        fireEvent.change(start, { target: { value: "2026-09-15" } });

        expect(start).toHaveValue("2026-09-15");
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
    });

    it("pushes endDate forward when a later startDate is chosen", () => {
        render(<SalesInvoices />);

        const { start, end } = getDateInputs();
        const laterThanCurrentEnd = "2099-12-31";

        fireEvent.change(start, { target: { value: laterThanCurrentEnd } });

        expect(end).toHaveValue(laterThanCurrentEnd);
    });

    it("clears startDate without resetting the page when the input is emptied", async () => {
        const user = userEvent.setup();
        render(<SalesInvoices />);

        await user.click(screen.getByText("next-page"));
        const { start } = getDateInputs();

        fireEvent.change(start, { target: { value: "" } });

        expect(start).toHaveValue("");
        // no page reset on clearing — still on page 2
        expect(screen.getByTestId("pagination")).toHaveTextContent("2/3");
    });

    it("ignores an endDate earlier than the current startDate", () => {
        render(<SalesInvoices />);

        const { start, end } = getDateInputs();
        const expected = getExpectedMonthRange();

        fireEvent.change(end, { target: { value: "2000-01-01" } });

        // unchanged — the handler returns early rather than accepting it
        expect(end).toHaveValue(expected.end);
        expect(start).toHaveValue(expected.start);
    });

    it("accepts a valid endDate and resets the page", async () => {
        const user = userEvent.setup();
        render(<SalesInvoices />);

        await user.click(screen.getByText("next-page"));
        const { end } = getDateInputs();
        const expected = getExpectedMonthRange();

        // must differ from the input's current value or React won't fire
        // onChange for a controlled input — use start-of-month instead of
        // re-supplying the already-set end-of-month value.
        fireEvent.change(end, { target: { value: expected.start } });

        expect(end).toHaveValue(expected.start);
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
    });

    it("clears endDate without resetting the page when the input is emptied", async () => {
        const user = userEvent.setup();
        render(<SalesInvoices />);

        await user.click(screen.getByText("next-page"));
        const { end } = getDateInputs();

        fireEvent.change(end, { target: { value: "" } });

        expect(end).toHaveValue("");
        expect(screen.getByTestId("pagination")).toHaveTextContent("2/3");
    });

    it("bounds start against end and end against start via min/max attributes", () => {
        render(<SalesInvoices />);

        const expected = getExpectedMonthRange();
        const { start, end } = getDateInputs();

        expect(start).toHaveAttribute("max", expected.end);
        expect(end).toHaveAttribute("min", expected.start);
    });

    // ---- Export ----

    it("logs the current filters (labeled 'Export Sales Orders') when Export is clicked", async () => {
        const user = userEvent.setup();
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        render(<SalesInvoices />);
        fireEvent.change(screen.getByTestId("search-input"), {
            target: { value: "invoice" },
        });
        fireEvent.change(screen.getByTestId("status-select"), {
            target: { value: "Pending" },
        });

        await user.click(screen.getByTestId("export-button"));

        // NOTE: the export log message still says "Export Sales Orders" —
        // likely copy-pasted from SalesOrder and not updated for Invoices.
        // This test documents current behavior; update the string here if
        // the label gets fixed in the component.
        expect(logSpy).toHaveBeenCalledWith(
            "Export Sales Orders",
            expect.objectContaining({ search: "invoice", status: "Pending" })
        );
        logSpy.mockRestore();
    });

    it("does not include dueDate in the export payload", async () => {
        const user = userEvent.setup();
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        render(<SalesInvoices />);
        fireEvent.change(screen.getByTestId("filter-dueDate"), {
            target: { value: "overdue" },
        });

        await user.click(screen.getByTestId("export-button"));

        // handleExport's payload omits dueDate even though the filter exists
        // — flagging this so it isn't silently lost if export gets wired up
        // to a real backend call later.
        const [, payload] = logSpy.mock.calls[0];
        expect(payload).not.toHaveProperty("dueDate");

        logSpy.mockRestore();
    });

    // ---- Regression guard: stats beyond "Total Orders" are still hardcoded ----

    it("REGRESSION: Completed/Pending/Cancelled counts are hardcoded to 0 regardless of data", () => {
        render(<SalesInvoices />);

        const stats = within(screen.getByTestId("stats-cards"));
        expect(stats.getByText("Completed Orders").nextSibling).toHaveTextContent("0");
        expect(stats.getByText("Pending Orders").nextSibling).toHaveTextContent("0");
        expect(stats.getByText("Cancelled Orders").nextSibling).toHaveTextContent("0");
    });
});