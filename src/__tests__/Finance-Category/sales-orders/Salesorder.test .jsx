import React from "react";
import { render, screen, fireEvent, within, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// ---- PATH PLACEHOLDER ----
// These paths assume this test file lives in the SAME folder as SalesOrder.jsx
// (so every vi.mock() path below is copied verbatim from SalesOrder.jsx's own
// imports). If you put this file somewhere else (e.g. a top-level __tests__
// folder), you MUST update:
//   1. The `import SalesOrder from ...` line below
//   2. Every vi.mock(...) path below
// Mock paths resolve relative to THIS file's location, not the component's.
import SalesOrder from "./SalesOrder";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    getSalesOrders,
    getSalesOrderSummary,
    getCustomers,
    removeSalesOrder,
} from "../../../../Redux/finance/Sales/Salesorderslice";
import { getSalesOrderColumns } from "./SalesOrders.columns";

// ---- react-redux / react-router-dom ----

// NOTE: deliberately NOT using the `async (importOriginal) => ({...actual, ...})`
// form here. With react-router-dom v7 (it re-exports from the "react-router"
// package under the hood), awaiting importOriginal() inside an async mock
// factory can end up not overriding the hook at all, so the REAL useNavigate
// runs and throws "useNavigate() may be used only in the context of a
// <Router>". Returning a plain object with just the hooks the component
// actually uses sidesteps that entirely.
vi.mock("react-redux", () => ({
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
    useNavigate: vi.fn(),
}));

// ---- Redux slice (actions are just marker objects; selectors read from
// whatever fake state object the test's useSelector mock is fed) ----

vi.mock("../../../../Redux/finance/Sales/Salesorderslice", () => ({
    getSalesOrders: vi.fn((params) => ({ type: "getSalesOrders", params })),
    getSalesOrderSummary: vi.fn(() => ({ type: "getSalesOrderSummary" })),
    getCustomers: vi.fn(() => ({ type: "getCustomers" })),
    removeSalesOrder: vi.fn((id) => ({ type: "removeSalesOrder", id })),
    selectSalesOrders: (state) => state.salesOrders,
    selectSalesOrderPagination: (state) => state.pagination,
    selectSalesOrderKPI: (state) => state.kpi,
    selectSalesOrderLoading: (state) => state.loading,
    selectCustomers: (state) => state.customers,
}));

// ---- Columns / stats helpers ----
// getSalesOrderColumns is mocked so we can grab the onDelete callback the
// component wires up and trigger it from the mocked ReusableTable below.

vi.mock("./SalesOrders.columns", () => ({
    getSalesOrderColumns: vi.fn(({ onDelete }) => [
        { accessor: "id", header: "ID" },
        { accessor: "actions", header: "Actions", onDelete },
    ]),
    buildSalesOrderStats: vi.fn((kpi = {}) => [
        { title: "Total Orders", count: kpi.total ?? 0 },
        { title: "Completed Orders", count: kpi.completed ?? 0 },
        { title: "Pending Orders", count: kpi.pending ?? 0 },
        { title: "Cancelled Orders", count: kpi.cancelled ?? 0 },
    ]),
    ORDER_STATUS_OPTIONS: [
        { label: "Completed", value: "completed" },
        { label: "Pending", value: "pending" },
        { label: "Cancelled", value: "cancelled" },
    ],
}));

// ---- Presentational component mocks ----

vi.mock("./SalesOrder.styles", () => ({
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

vi.mock("../../../../Components/ReusableTable/ReusableHeader", () => ({
    default: ({ title, breadcrumbs = [], buttonText, onButtonClick, children }) => (
        <div data-testid="reusable-header">
            <h1>{title}</h1>
            <div data-testid="breadcrumbs">{breadcrumbs.join(" / ")}</div>
            <button onClick={onButtonClick}>{buttonText}</button>
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

vi.mock("../../../../Components/ReusableTable/ReusableTable", () => ({
    default: ({ data = [], columns = [], loading }) => {
        const actionsColumn = columns.find((c) => c.onDelete);
        return (
            <div data-testid="reusable-table" data-loading={String(!!loading)}>
                {loading && <div data-testid="table-loading">Loading...</div>}
                {data.map((row) => (
                    <div key={row.id} data-testid="table-row">
                        <span>{row.so_number}</span>
                        {actionsColumn && (
                            <button onClick={() => actionsColumn.onDelete(row)}>
                                delete-{row.id}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        );
    },
}));

vi.mock("../../../../Components/Pagination/ReusablePagination", () => ({
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

vi.mock("../../../../Components/modals/ReusableConfirmModal", () => ({
    default: ({ show, title, message, confirmText, confirmVariant, onConfirm, onClose }) =>
        show ? (
            <div data-testid="confirm-modal">
                <h2>{title}</h2>
                <p>{message}</p>
                <button data-testid="modal-confirm" data-variant={confirmVariant} onClick={onConfirm}>
                    {confirmText}
                </button>
                <button data-testid="modal-close" onClick={onClose}>
                    Close
                </button>
            </div>
        ) : null,
}));

// ---- Test fixtures ----

const buildSalesOrders = (n) =>
    Array.from({ length: n }, (_, i) => ({
        id: i + 1,
        so_number: `SO-${1000 + i}`,
    }));

const buildState = (overrides = {}) => ({
    salesOrders: buildSalesOrders(5),
    pagination: { currentPage: 1, totalPages: 3 },
    kpi: { total: 25, completed: 10, pending: 8, cancelled: 7 },
    loading: false,
    customers: [
        { id: 1, name: "ABC Trading" },
        { id: 2, name: "Riyadh Tech" },
        { id: 3, customer_name: "Al Noor Company" },
        { id: 4 }, // no name -> falls back to "Customer #4"
    ],
    ...overrides,
});

const getDateInputs = () => ({
    start: screen.getByLabelText("Start date"),
    end: screen.getByLabelText("End date"),
});

// Matches the component's hardcoded "current month" (Sep 2026)
const EXPECTED_MONTH_START = "2026-09-01";
const EXPECTED_MONTH_END = "2026-09-30";

describe("SalesOrder", () => {
    let dispatchMock;
    let navigateMock;
    let removeSalesOrderResult;

    const setupSelectors = (stateOverrides = {}) => {
        const state = buildState(stateOverrides);
        vi.mocked(useSelector).mockImplementation((selector) => selector(state));
        return state;
    };

    beforeEach(() => {
        vi.clearAllMocks();

        navigateMock = vi.fn();
        vi.mocked(useNavigate).mockReturnValue(navigateMock);

        removeSalesOrderResult = { error: false };
        dispatchMock = vi.fn((action) => {
            if (action && action.type === "removeSalesOrder") {
                return Promise.resolve(removeSalesOrderResult);
            }
            return action;
        });
        vi.mocked(useDispatch).mockReturnValue(dispatchMock);

        setupSelectors();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    // ---- Structure ----

    it("renders header, stats cards, filter, table and pagination", () => {
        render(<SalesOrder />);

        expect(screen.getByText("Sales Orders")).toBeInTheDocument();
        expect(screen.getByTestId("stats-cards")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-filter")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
        expect(screen.queryByTestId("confirm-modal")).not.toBeInTheDocument();
    });

    it("renders the Sales / Sales Orders breadcrumbs", () => {
        render(<SalesOrder />);

        expect(screen.getByTestId("breadcrumbs")).toHaveTextContent("Sales / Sales Orders");
    });

    it("navigates to the add-order page when the header button is clicked", async () => {
        const user = userEvent.setup();
        render(<SalesOrder />);

        await user.click(screen.getByText("+ ADD NEW SALES ORDER"));

        expect(navigateMock).toHaveBeenCalledWith("/sales/orders/add");
    });

    it("renders the date range inside the header actions", () => {
        render(<SalesOrder />);

        const actions = within(screen.getByTestId("header-actions"));
        expect(actions.getByTestId("date-range")).toBeInTheDocument();
    });

    // ---- Initial data fetching ----

    it("dispatches getCustomers and getSalesOrderSummary once on mount", () => {
        render(<SalesOrder />);

        expect(getCustomers).toHaveBeenCalledTimes(1);
        expect(getSalesOrderSummary).toHaveBeenCalledTimes(1);
    });

    it("dispatches getSalesOrders on mount with the default month range and page 1", () => {
        render(<SalesOrder />);

        expect(getSalesOrders).toHaveBeenCalledWith(
            expect.objectContaining({
                page: 1,
                order_date_after: EXPECTED_MONTH_START,
                order_date_before: EXPECTED_MONTH_END,
            })
        );
        // no search/status/customer sent when empty
        const lastCallParams = getSalesOrders.mock.calls[getSalesOrders.mock.calls.length - 1][0];
        expect(lastCallParams).not.toHaveProperty("search");
        expect(lastCallParams).not.toHaveProperty("order_status");
        expect(lastCallParams).not.toHaveProperty("customer");
    });

    // ---- Stats ----

    it("renders stat cards derived from the KPI selector", () => {
        render(<SalesOrder />);

        const stats = within(screen.getByTestId("stats-cards"));
        expect(stats.getByText("Total Orders").nextSibling).toHaveTextContent("25");
        expect(stats.getByText("Completed Orders").nextSibling).toHaveTextContent("10");
        expect(stats.getByText("Pending Orders").nextSibling).toHaveTextContent("8");
        expect(stats.getByText("Cancelled Orders").nextSibling).toHaveTextContent("7");
    });

    // ---- Table / loading ----

    it("renders a row per sales order from the selector", () => {
        render(<SalesOrder />);

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(5);
        expect(rows[0]).toHaveTextContent("SO-1000");
    });

    it("passes the loading flag through to the table", () => {
        setupSelectors({ loading: true });
        render(<SalesOrder />);

        expect(screen.getByTestId("reusable-table")).toHaveAttribute("data-loading", "true");
        expect(screen.getByTestId("table-loading")).toBeInTheDocument();
    });

    // ---- Search (debounced) ----

    it("updates the search input immediately but only dispatches after the debounce delay", () => {
        vi.useFakeTimers();
        render(<SalesOrder />);

        const callsBeforeTyping = getSalesOrders.mock.calls.length;

        fireEvent.change(screen.getByTestId("search-input"), {
            target: { value: "order" },
        });

        expect(screen.getByTestId("search-input")).toHaveValue("order");
        // no new dispatch yet - still debouncing
        expect(getSalesOrders.mock.calls.length).toBe(callsBeforeTyping);

        act(() => {
            vi.advanceTimersByTime(400);
        });

        expect(getSalesOrders).toHaveBeenLastCalledWith(
            expect.objectContaining({ search: "order", page: 1 })
        );
    });

    it("resets to page 1 as soon as the search value changes", () => {
        render(<SalesOrder />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.change(screen.getByTestId("search-input"), {
            target: { value: "order" },
        });

        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
    });

    it("renders the search placeholder", () => {
        render(<SalesOrder />);
        expect(screen.getByPlaceholderText("Search SO Number or Customer")).toBeInTheDocument();
    });

    // ---- Status filter ----

    it("offers Completed, Pending and Cancelled as status options", () => {
        render(<SalesOrder />);

        const select = screen.getByTestId("status-select");
        const options = within(select)
            .getAllByRole("option")
            .map((o) => o.textContent);

        expect(options).toEqual(["all", "Completed", "Pending", "Cancelled"]);
    });

    it("maps the selected status label to its value, dispatches it, and resets the page", () => {
        render(<SalesOrder />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.change(screen.getByTestId("status-select"), {
            target: { value: "Completed" },
        });

        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
        expect(getSalesOrders).toHaveBeenLastCalledWith(
            expect.objectContaining({ order_status: "completed", page: 1 })
        );
    });

    // ---- Customer filter ----

    it("builds customer options from the selector, falling back to Customer #id when unnamed", () => {
        render(<SalesOrder />);

        const select = screen.getByTestId("filter-customer");
        const labels = within(select)
            .getAllByRole("option")
            .map((o) => o.textContent);

        expect(labels).toEqual([
            "All Customers",
            "ABC Trading",
            "Riyadh Tech",
            "Al Noor Company",
            "Customer #4",
        ]);
    });

    it("dispatches the selected customer id and resets the page", () => {
        render(<SalesOrder />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        fireEvent.change(screen.getByTestId("filter-customer"), {
            target: { value: "2" },
        });

        expect(screen.getByTestId("filter-customer")).toHaveValue("2");
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
        expect(getSalesOrders).toHaveBeenLastCalledWith(
            expect.objectContaining({ customer: "2", page: 1 })
        );
    });

    // ---- Date range ----

    it("defaults the date range to the hardcoded current month (Sep 2026)", () => {
        render(<SalesOrder />);

        const { start, end } = getDateInputs();
        expect(start).toHaveValue(EXPECTED_MONTH_START);
        expect(end).toHaveValue(EXPECTED_MONTH_END);
    });

    it("bounds start against end and end against start via min/max attributes", () => {
        render(<SalesOrder />);

        const { start, end } = getDateInputs();
        expect(start).toHaveAttribute("max", EXPECTED_MONTH_END);
        expect(end).toHaveAttribute("min", EXPECTED_MONTH_START);
    });

    it("updates startDate and always resets the page, even when clearing it", () => {
        render(<SalesOrder />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        const { start } = getDateInputs();

        fireEvent.change(start, { target: { value: "" } });

        expect(start).toHaveValue("");
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
    });

    it("pushes endDate forward when a later startDate is chosen", () => {
        render(<SalesOrder />);

        const { start, end } = getDateInputs();
        fireEvent.change(start, { target: { value: "2099-12-31" } });

        expect(end).toHaveValue("2099-12-31");
    });

    it("ignores an endDate earlier than the current startDate (no state change)", () => {
        render(<SalesOrder />);

        const { start, end } = getDateInputs();
        const callsBefore = getSalesOrders.mock.calls.length;

        fireEvent.change(end, { target: { value: "2000-01-01" } });

        expect(end).toHaveValue(EXPECTED_MONTH_END);
        expect(start).toHaveValue(EXPECTED_MONTH_START);
        // early-return path: no re-render-triggering state change
        expect(getSalesOrders.mock.calls.length).toBe(callsBefore);
    });

    it("accepts a valid endDate and resets the page", () => {
        render(<SalesOrder />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        const { end } = getDateInputs();

        fireEvent.change(end, { target: { value: "2026-09-25" } });

        expect(end).toHaveValue("2026-09-25");
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
    });

    it("clearing endDate also resets the page", () => {
        render(<SalesOrder />);

        fireEvent.click(screen.getByText("next-page")); // -> page 2
        const { end } = getDateInputs();

        fireEvent.change(end, { target: { value: "" } });

        expect(end).toHaveValue("");
        expect(screen.getByTestId("pagination")).toHaveTextContent("1/3");
    });

    // ---- Pagination ----

    it("reflects currentPage/totalPages from the pagination selector", () => {
        setupSelectors({ pagination: { currentPage: 2, totalPages: 4 } });
        render(<SalesOrder />);

        expect(screen.getByTestId("pagination")).toHaveTextContent("2/4");
    });

    it("dispatches getSalesOrders with the new page when pagination changes", () => {
        render(<SalesOrder />);

        fireEvent.click(screen.getByText("next-page"));

        expect(getSalesOrders).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }));
    });

    // ---- Delete flow ----

    it("opens the confirm modal with the order's SO number when delete is clicked", async () => {
        const user = userEvent.setup();
        render(<SalesOrder />);

        await user.click(screen.getByText("delete-1"));

        expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();
        expect(screen.getByText("Delete Sales Order")).toBeInTheDocument();
        expect(screen.getByText("Are you sure you want to delete sales order SO-1000?")).toBeInTheDocument();
        expect(screen.getByTestId("modal-confirm")).toHaveTextContent("Delete");
        expect(screen.getByTestId("modal-confirm")).toHaveAttribute("data-variant", "danger");
    });

    it("confirming a successful delete calls removeSalesOrder, refreshes the summary, and closes the modal", async () => {
        const user = userEvent.setup();
        render(<SalesOrder />);

        await user.click(screen.getByText("delete-1"));
        await user.click(screen.getByTestId("modal-confirm"));

        expect(removeSalesOrder).toHaveBeenCalledWith(1);
        await waitFor(() => {
            expect(getSalesOrderSummary).toHaveBeenCalledTimes(2); // mount + post-delete
        });
        expect(screen.queryByTestId("confirm-modal")).not.toBeInTheDocument();
    });

    it("shows the server error message and switches to a Close action on failed delete", async () => {
        removeSalesOrderResult = { error: true, payload: { detail: "Order has linked invoices." } };
        const user = userEvent.setup();
        render(<SalesOrder />);

        await user.click(screen.getByText("delete-1"));
        await user.click(screen.getByTestId("modal-confirm"));

        expect(await screen.findByText("Unable to Delete Sales Order")).toBeInTheDocument();
        expect(screen.getByText("Order has linked invoices.")).toBeInTheDocument();
        expect(screen.getByTestId("modal-confirm")).toHaveTextContent("Close");
        expect(screen.getByTestId("modal-confirm")).toHaveAttribute("data-variant", "secondary");

        await user.click(screen.getByTestId("modal-confirm"));
        expect(screen.queryByTestId("confirm-modal")).not.toBeInTheDocument();
    });

    it("falls back to a default error message when the server gives no detail", async () => {
        removeSalesOrderResult = { error: true, payload: {} };
        const user = userEvent.setup();
        render(<SalesOrder />);

        await user.click(screen.getByText("delete-1"));
        await user.click(screen.getByTestId("modal-confirm"));

        expect(await screen.findByText("This Sales Order cannot be deleted.")).toBeInTheDocument();
    });

    it("closes the modal without deleting when Close/onClose is clicked before confirming", async () => {
        const user = userEvent.setup();
        render(<SalesOrder />);

        await user.click(screen.getByText("delete-1"));
        expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();

        await user.click(screen.getByTestId("modal-close"));

        expect(screen.queryByTestId("confirm-modal")).not.toBeInTheDocument();
        expect(removeSalesOrder).not.toHaveBeenCalled();
    });

    // ---- Columns wiring ----

    it("builds the table columns via getSalesOrderColumns once", () => {
        render(<SalesOrder />);

        expect(getSalesOrderColumns).toHaveBeenCalledTimes(1);
        expect(getSalesOrderColumns).toHaveBeenCalledWith(
            expect.objectContaining({ onDelete: expect.any(Function) })
        );
    });
});