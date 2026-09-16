import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

// ---- PATH PLACEHOLDER ----
// Confirm the real location with:
//   find src -iname 'CustomerLedger*' -o -iname 'AddLedgerModal*'
// then update the import below AND the vi.mock paths for CustomerLedger.styles
// and modal/AddLedgerModal to match — vi.mock paths resolve relative to THIS
// test file's location, not the component's.
import CustomerLedger from "../../../Pages/FinanceModule/SALES/CustomerLedger/CustomerLedger";

vi.mock("../../../Components/ReusableTable/dummydata", () => ({
    employeeColumns: [{ accessor: "id", header: "ID" }],
    employeeData: Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        name: `Entry ${i + 1}`,
    })),
}));

vi.mock("../../../Pages/FinanceModule/SALES/CustomerLedger/CustomerLedger.styles", () => ({
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

vi.mock(
    "../../../Pages/FinanceModule/SALES/CustomerLedger/modal/AddLedgerModal",
    () => ({
        default: ({ isOpen, onClose, onSave }) =>
            isOpen ? (
                <div data-testid="add-ledger-modal">
                    <button onClick={onClose}>close-ledger-modal</button>
                    <button
                        onClick={() =>
                            onSave({ name: "Manual Entry", amount: "SAR 500" })
                        }
                    >
                        save-ledger-modal
                    </button>
                </div>
            ) : null,
    })
);

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
    default: ({ cards = [], loading }) => (
        <div data-testid="stats-cards" data-loading={String(loading)}>
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
    default: ({ currentPage, totalPages, totalRecords, onPageChange }) => (
        <div data-testid="pagination" data-total-records={String(totalRecords)}>
            <span>
                {currentPage}/{totalPages}
            </span>
            <button onClick={() => onPageChange(currentPage + 1)}>next-page</button>
            <button onClick={() => onPageChange(currentPage - 1)}>prev-page</button>
        </div>
    ),
}));

const getDateInputs = () => ({
    start: screen.getByLabelText("Start date"),
    end: screen.getByLabelText("End date"),
});

describe("CustomerLedger", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ---- Structure ----

    it("renders header, stats cards, filter, table and pagination", () => {
        render(<CustomerLedger />);

        expect(screen.getByText("Customer Ledger")).toBeInTheDocument();
        expect(screen.getByTestId("stats-cards")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-filter")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });

    it("renders the Sales / Customer Ledger breadcrumbs", () => {
        render(<CustomerLedger />);

        expect(screen.getByTestId("breadcrumbs")).toHaveTextContent(
            "Sales / Customer Ledger"
        );
    });

    it("renders the export button and date range inside the header", () => {
        render(<CustomerLedger />);

        const actions = within(screen.getByTestId("header-actions"));
        expect(actions.getByTestId("export-button")).toBeInTheDocument();
        expect(actions.getByTestId("date-range")).toBeInTheDocument();
    });

    // ---- Stats (all 5 cards are static in this component) ----

    it("renders all 5 static stat cards", () => {
        render(<CustomerLedger />);

        const stats = within(screen.getByTestId("stats-cards"));
        expect(stats.getAllByTestId("stat-card")).toHaveLength(5);
        expect(stats.getByText("Total Receivables").nextSibling).toHaveTextContent(
            "SAR 45,000"
        );
        expect(stats.getByText("Total Invoices").nextSibling).toHaveTextContent(
            "SAR 32,500"
        );
        expect(stats.getByText("Total Collections").nextSibling).toHaveTextContent(
            "SAR 12,500"
        );
        expect(stats.getByText("Total Credit Notes").nextSibling).toHaveTextContent(
            "08"
        );
        expect(stats.getByText("Overdue Amount").nextSibling).toHaveTextContent(
            "SAR 8,000"
        );
    });

    it("passes loading=false to stats cards", () => {
        render(<CustomerLedger />);
        expect(screen.getByTestId("stats-cards")).toHaveAttribute(
            "data-loading",
            "false"
        );
    });

    // ---- Table / pagination against the mocked dataset (25 rows, page size 10) ----

    it("paginates the mocked dataset into pages of 10", () => {
        render(<CustomerLedger />);

        expect(screen.getAllByTestId("table-row")).toHaveLength(10);
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
    });

    it("passes the full dataset length as totalRecords, not just the current page", () => {
        render(<CustomerLedger />);

        expect(screen.getByTestId("pagination")).toHaveAttribute(
            "data-total-records",
            "25"
        );
    });

    it("shows the correct slice of data after moving to page 2", async () => {
        const user = userEvent.setup();
        render(<CustomerLedger />);

        await user.click(screen.getByText("next-page"));

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(10);
        expect(rows[0]).toHaveTextContent("Entry 11");
        expect(rows[9]).toHaveTextContent("Entry 20");
    });

    it("passes employeeColumns through to the table unchanged", () => {
        render(<CustomerLedger />);

        const table = screen.getByTestId("reusable-table");
        expect(JSON.parse(table.getAttribute("data-columns"))).toEqual([
            { accessor: "id", header: "ID" },
        ]);
    });

    // ---- Search / status / transactionType / customer filters ----

    it("propagates search input to state and resets to page 1", async () => {
        const user = userEvent.setup();
        render(<CustomerLedger />);

        await user.click(screen.getByText("next-page"));
        fireEvent.change(screen.getByTestId("search-input"), {
            target: { value: "invoice" },
        });

        expect(screen.getByTestId("search-input")).toHaveValue("invoice");
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
    });

    it("renders the search placeholder", () => {
        render(<CustomerLedger />);
        expect(screen.getByPlaceholderText("Search Ledger")).toBeInTheDocument();
    });

    it("offers Paid, Pending, Partially Paid and Overdue as status options", () => {
        render(<CustomerLedger />);

        const select = screen.getByTestId("status-select");
        const options = within(select)
            .getAllByRole("option")
            .map((o) => o.textContent);

        expect(options).toEqual(["all", "Paid", "Pending", "Partially Paid", "Overdue"]);
    });

    it("propagates status filter changes and resets to page 1", async () => {
        const user = userEvent.setup();
        render(<CustomerLedger />);

        await user.click(screen.getByText("next-page"));
        fireEvent.change(screen.getByTestId("status-select"), {
            target: { value: "Overdue" },
        });

        expect(screen.getByTestId("status-select")).toHaveValue("Overdue");
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
    });

    it("offers Invoice, Payment, Credit Note and Journal Entry as transaction types", () => {
        render(<CustomerLedger />);

        const select = screen.getByTestId("filter-transactionType");
        const labels = within(select)
            .getAllByRole("option")
            .map((o) => o.textContent);

        expect(labels).toEqual([
            "All Transaction Types",
            "Invoice",
            "Payment",
            "Credit Note",
            "Journal Entry",
        ]);
    });

    it("propagates transaction type filter changes and resets to page 1", async () => {
        const user = userEvent.setup();
        render(<CustomerLedger />);

        await user.click(screen.getByText("next-page"));
        fireEvent.change(screen.getByTestId("filter-transactionType"), {
            target: { value: "Payment" },
        });

        expect(screen.getByTestId("filter-transactionType")).toHaveValue("Payment");
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
    });

    it("lists all 4 customer options", () => {
        render(<CustomerLedger />);

        const select = screen.getByTestId("filter-customer");
        const labels = within(select)
            .getAllByRole("option")
            .map((o) => o.textContent);

        expect(labels).toEqual([
            "All Customers",
            "ABC Trading",
            "Riyadh Tech",
            "Al Noor Company",
            "Saudi Solutions",
        ]);
    });

    it("propagates customer filter changes and resets to page 1", async () => {
        const user = userEvent.setup();
        render(<CustomerLedger />);

        await user.click(screen.getByText("next-page"));
        fireEvent.change(screen.getByTestId("filter-customer"), {
            target: { value: "Al Noor Company" },
        });

        expect(screen.getByTestId("filter-customer")).toHaveValue("Al Noor Company");
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
    });

    it("logs current filter state (not the export payload) when Filter is clicked", async () => {
        const user = userEvent.setup();
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        render(<CustomerLedger />);
        fireEvent.change(screen.getByTestId("search-input"), {
            target: { value: "acme" },
        });

        await user.click(screen.getByTestId("filter-button"));

        expect(logSpy).toHaveBeenCalledWith(
            "Ledger filter clicked",
            expect.objectContaining({ search: "acme" })
        );
        logSpy.mockRestore();
    });

    // ---- Date range ----

    it("starts with an empty date range (no default month applied)", () => {
        render(<CustomerLedger />);

        const { start, end } = getDateInputs();
        expect(start).toHaveValue("");
        expect(end).toHaveValue("");
    });

    it("propagates start and end date changes and resets the page", async () => {
        const user = userEvent.setup();
        render(<CustomerLedger />);

        await user.click(screen.getByText("next-page"));
        const { start } = getDateInputs();

        fireEvent.change(start, { target: { value: "2026-01-01" } });

        expect(start).toHaveValue("2026-01-01");
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
    });

    it("bounds the date inputs against each other", () => {
        render(<CustomerLedger />);

        const { start, end } = getDateInputs();

        fireEvent.change(start, { target: { value: "2026-01-01" } });
        fireEvent.change(end, { target: { value: "2026-01-31" } });

        expect(start).toHaveAttribute("max", "2026-01-31");
        expect(end).toHaveAttribute("min", "2026-01-01");
    });

    // ---- Export ----

    it("logs the current filters when Export is clicked", async () => {
        const user = userEvent.setup();
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        render(<CustomerLedger />);
        fireEvent.change(screen.getByTestId("status-select"), {
            target: { value: "Paid" },
        });

        await user.click(screen.getByTestId("export-button"));

        expect(logSpy).toHaveBeenCalledWith(
            "Export Customer Ledger",
            expect.objectContaining({ status: "Paid" })
        );
        logSpy.mockRestore();
    });

    // ---- Add Ledger modal ----

    it("keeps the ledger modal closed by default", () => {
        render(<CustomerLedger />);
        expect(screen.queryByTestId("add-ledger-modal")).not.toBeInTheDocument();
    });

    it("opens the modal when + NEW JOURNAL ENTRY is clicked", async () => {
        const user = userEvent.setup();
        render(<CustomerLedger />);

        await user.click(screen.getByText("+ NEW JOURNAL ENTRY"));

        expect(screen.getByTestId("add-ledger-modal")).toBeInTheDocument();
    });

    it("closes the modal via onClose without adding a row", async () => {
        const user = userEvent.setup();
        render(<CustomerLedger />);

        await user.click(screen.getByText("+ NEW JOURNAL ENTRY"));
        await user.click(screen.getByText("close-ledger-modal"));

        expect(screen.queryByTestId("add-ledger-modal")).not.toBeInTheDocument();
        expect(screen.getByTestId("pagination")).toHaveAttribute(
            "data-total-records",
            "25"
        );
    });

    it("prepends a saved entry, closes the modal, resets to page 1, and grows totalRecords", async () => {
        const user = userEvent.setup();
        render(<CustomerLedger />);

        await user.click(screen.getByText("next-page")); // move off page 1 first
        await user.click(screen.getByText("+ NEW JOURNAL ENTRY"));
        await user.click(screen.getByText("save-ledger-modal"));

        expect(screen.queryByTestId("add-ledger-modal")).not.toBeInTheDocument();
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/");
        expect(screen.getByTestId("pagination")).toHaveAttribute(
            "data-total-records",
            "26"
        );

        // the new entry is now first on page 1
        const rows = screen.getAllByTestId("table-row");
        expect(rows[0]).toHaveTextContent("Manual Entry");
    });

    it("logs the new entry payload when saved", async () => {
        const user = userEvent.setup();
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

        render(<CustomerLedger />);
        await user.click(screen.getByText("+ NEW JOURNAL ENTRY"));
        await user.click(screen.getByText("save-ledger-modal"));

        expect(logSpy).toHaveBeenCalledWith(
            "New Ledger Entry:",
            expect.objectContaining({ name: "Manual Entry" })
        );
        logSpy.mockRestore();
    });
});