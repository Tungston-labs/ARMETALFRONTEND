import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Paths assume the component lives in
//   src/Pages/FinanceModule/PURCHASES/Vendors/Orders/
// and this test in src/__tests__/Finance-Category/Purchase/.
// Find the real folder with:  find src -iname "VendorPurchaseOrders*"
// Every vi.mock() path must resolve to the same file as its import.
import VendorPurchaseOrders from "../../../Pages/FinanceModule/PURCHASES/Vendors/Orders/VendorPurchaseOrders";
import { getVendorPurchaseOrders } from "../../../Redux/finance/purchases/Vendordetailslice";

// ---- react-redux / react-router: the component reads state.vendorDetail
// via useSelector, gets the vendor id from the route and dispatches
// getVendorPurchaseOrders.
const { mockDispatch, hoisted } = vi.hoisted(() => ({
    mockDispatch: vi.fn(),
    hoisted: { state: {}, params: {} },
}));

vi.mock("react-redux", () => ({
    useDispatch: () => mockDispatch,
    useSelector: (selector) => selector(hoisted.state),
}));

vi.mock("react-router-dom", () => ({
    useParams: () => hoisted.params,
}));

vi.mock("../../../Redux/finance/purchases/Vendordetailslice", () => ({
    getVendorPurchaseOrders: vi.fn((args) => ({ type: "getVendorPurchaseOrders", payload: args })),
}));

vi.mock("react-icons/fi", () => ({
    FiFileText: () => <span />,
    FiClock: () => <span />,
    FiCheckCircle: () => <span />,
    FiPackage: () => <span />,
}));

vi.mock("../../../Components/StatsCards/StatsCards", () => ({
    default: ({ cards, loading }) => (
        <div data-testid="stats-cards" data-loading={String(loading)}>
            {cards.map((c) => (
                <div key={c.title} data-testid="stat-card">
                    <span>{c.title}</span>
                    <span>{c.count}</span>
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
        status,
        statuses = [],
        onStatus,
        showSearch,
        showStatus,
    }) => (
        <div
            data-testid="reusable-filter"
            data-show-search={String(!!showSearch)}
            data-show-status={String(!!showStatus)}
        >
            <input
                data-testid="search-input"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => onSearch(e.target.value)}
            />
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
        </div>
    ),
}));

// The columns live inside the component, so the fake table renders every
// cell through the column's own render() / accessor to test them.
vi.mock("../../../Components/ReusableTable/ReusableTable", () => ({
    default: ({ columns, data, loading }) => (
        <div data-testid="reusable-table" data-loading={String(loading)}>
            <div data-testid="table-headers">{columns.map((c) => c.header).join(",")}</div>
            {data.map((row) => (
                <div key={row.id} data-testid="table-row">
                    {columns.map((c) => (
                        <span key={c.accessor} data-testid={`cell-${row.id}-${c.accessor}`}>
                            {c.render ? c.render(row) : row[c.accessor]}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    ),
}));

vi.mock("../../../Components/Pagination/ReusablePagination", () => ({
    default: ({ currentPage, totalPages, totalRecords, onPageChange }) => (
        <div data-testid="pagination">
            <span data-testid="page-info">
                {currentPage}/{totalPages}
            </span>
            <span data-testid="total-records">{totalRecords}</span>
            <button onClick={() => onPageChange(currentPage + 1)}>next-page</button>
            <button onClick={() => onPageChange(3)}>page-three</button>
        </div>
    ),
}));

// ---- fixtures ----

const makePO = (n, overrides = {}) => ({
    id: n,
    po_number: `PO-${String(n).padStart(4, "0")}`,
    po_date: "2026-01-05",
    delivery_date: "2026-01-20",
    total_amount: "1500",
    order_status: "approved",
    delivery_status: "not_received",
    bill_status: "unbilled",
    payment_status: "unpaid",
    ...overrides,
});

const makePOs = (count) => Array.from({ length: count }, (_, i) => makePO(i + 1));

const defaultSummary = {
    total_orders: 12,
    pending_approval_count: 3,
    open_orders_count: 5,
    completed_orders_count: 4,
};

const setDetail = (overrides = {}) => {
    hoisted.state = {
        vendorDetail: {
            purchaseOrders: makePOs(3),
            purchaseOrdersSummary: defaultSummary,
            purchaseOrdersLoading: false,
            purchaseOrdersError: null,
            ...overrides,
        },
    };
};

const pageInfo = () => screen.getByTestId("page-info");
const rowNumbers = () =>
    screen.queryAllByTestId("table-row").map((r) => within(r).getAllByText(/^PO-/)[0].textContent);

describe("VendorPurchaseOrders", () => {
    let user;

    beforeEach(() => {
        user = userEvent.setup();
        vi.clearAllMocks();
        hoisted.params = { id: "7" };
        setDetail();
    });

    // ---- vendor id ----

    describe("vendor id", () => {
        it("uses the route param 'id'", () => {
            render(<VendorPurchaseOrders />);

            expect(getVendorPurchaseOrders).toHaveBeenCalledWith({ vendorId: "7" });
        });

        it("falls back to the route param 'vendorId'", () => {
            hoisted.params = { vendorId: "15" };
            render(<VendorPurchaseOrders />);

            expect(getVendorPurchaseOrders).toHaveBeenCalledWith({ vendorId: "15" });
        });

        it("prefers 'id' over 'vendorId'", () => {
            hoisted.params = { id: "7", vendorId: "15" };
            render(<VendorPurchaseOrders />);

            expect(getVendorPurchaseOrders).toHaveBeenCalledWith({ vendorId: "7" });
        });

        it("shows a message and does not fetch when there is no vendor id", () => {
            hoisted.params = {};
            render(<VendorPurchaseOrders />);

            expect(screen.getByText(/No vendor id in the URL \(no params\)\./)).toBeInTheDocument();
            expect(getVendorPurchaseOrders).not.toHaveBeenCalled();
            expect(screen.queryByTestId("reusable-table")).not.toBeInTheDocument();
        });

        it("lists the available route params in the message", () => {
            hoisted.params = { foo: "1", bar: "2" };
            render(<VendorPurchaseOrders />);

            expect(screen.getByText(/\(foo, bar\)/)).toBeInTheDocument();
        });
    });

    // ---- fetching ----

    describe("fetching", () => {
        it("dispatches getVendorPurchaseOrders once on mount", () => {
            render(<VendorPurchaseOrders />);

            expect(getVendorPurchaseOrders).toHaveBeenCalledTimes(1);
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({ type: "getVendorPurchaseOrders" })
            );
        });

        it("does not refetch when the user searches or filters (done client-side)", async () => {
            render(<VendorPurchaseOrders />);

            fireEvent.change(screen.getByTestId("search-input"), { target: { value: "PO-0001" } });
            await user.selectOptions(screen.getByTestId("status-select"), "Approved");

            expect(getVendorPurchaseOrders).toHaveBeenCalledTimes(1);
        });
    });

    // ---- error message ----

    describe("error message", () => {
        it("shows nothing when there is no error", () => {
            render(<VendorPurchaseOrders />);

            expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
        });

        it("shows a string error as is, styled as an error", () => {
            setDetail({ purchaseOrdersError: "Something went wrong" });
            render(<VendorPurchaseOrders />);

            expect(screen.getByText("Something went wrong")).toHaveStyle({
                color: "#B00020",
                background: "#FDEEEE",
            });
        });

        it("shows error.detail when present", () => {
            setDetail({ purchaseOrdersError: { detail: "Not found." } });
            render(<VendorPurchaseOrders />);

            expect(screen.getByText("Not found.")).toBeInTheDocument();
        });

        it("flattens field errors into 'field: message | field: message'", () => {
            setDetail({
                purchaseOrdersError: { vendor: ["Invalid", "Required"], page: "Too big" },
            });
            render(<VendorPurchaseOrders />);

            expect(screen.getByText("vendor: Invalid, Required | page: Too big")).toBeInTheDocument();
        });
    });

    // ---- stats cards ----

    describe("stats cards", () => {
        it("renders the 4 cards from the summary", () => {
            render(<VendorPurchaseOrders />);

            const stats = within(screen.getByTestId("stats-cards"));
            expect(stats.getAllByTestId("stat-card")).toHaveLength(4);
            expect(stats.getByText("Total Purchase Orders").nextSibling).toHaveTextContent("12");
            expect(stats.getByText("Pending Approval").nextSibling).toHaveTextContent("3");
            expect(stats.getByText("Open Orders").nextSibling).toHaveTextContent("5");
            expect(stats.getByText("Completed Orders").nextSibling).toHaveTextContent("4");
        });

        it("shows 0 on every card when the summary is null", () => {
            setDetail({ purchaseOrdersSummary: null });
            render(<VendorPurchaseOrders />);

            const stats = within(screen.getByTestId("stats-cards"));
            ["Total Purchase Orders", "Pending Approval", "Open Orders", "Completed Orders"].forEach(
                (title) => {
                    expect(stats.getByText(title).nextSibling).toHaveTextContent("0");
                }
            );
        });

        it("keeps real zero values from the summary", () => {
            setDetail({ purchaseOrdersSummary: { ...defaultSummary, open_orders_count: 0 } });
            render(<VendorPurchaseOrders />);

            const stats = within(screen.getByTestId("stats-cards"));
            expect(stats.getByText("Open Orders").nextSibling).toHaveTextContent("0");
        });

        it("passes the loading flag to the stats cards and the table", () => {
            setDetail({ purchaseOrdersLoading: true });
            render(<VendorPurchaseOrders />);

            expect(screen.getByTestId("stats-cards")).toHaveAttribute("data-loading", "true");
            expect(screen.getByTestId("reusable-table")).toHaveAttribute("data-loading", "true");
        });
    });

    // ---- filter props ----

    it("enables the search box and status filter with the right placeholder", () => {
        render(<VendorPurchaseOrders />);

        const filter = screen.getByTestId("reusable-filter");
        expect(filter).toHaveAttribute("data-show-search", "true");
        expect(filter).toHaveAttribute("data-show-status", "true");
        expect(screen.getByPlaceholderText("Search PO number")).toBeInTheDocument();
    });

    it("offers the 7 order statuses", () => {
        render(<VendorPurchaseOrders />);

        const values = Array.from(
            screen.getByTestId("status-select").querySelectorAll("option")
        ).map((o) => o.value);
        expect(values).toEqual([
            "",
            "Draft",
            "Pending",
            "Approved",
            "Ordered",
            "Partially Received",
            "Received",
            "Cancelled",
        ]);
    });

    // ---- client-side search and status filter ----

    describe("filtering", () => {
        const list = [
            makePO(1, { po_number: "PO-0001", order_status: "draft" }),
            makePO(2, { po_number: "PO-0002", order_status: "approved" }),
            makePO(3, { po_number: "ABC-777", order_status: "partially_received" }),
            makePO(4, { po_number: null, order_status: "approved" }),
        ];

        beforeEach(() => {
            setDetail({ purchaseOrders: list });
        });

        it("shows every order when no filter is set", () => {
            render(<VendorPurchaseOrders />);

            expect(screen.getAllByTestId("table-row")).toHaveLength(4);
            expect(screen.getByTestId("total-records")).toHaveTextContent("4");
        });

        it("searches the PO number (partial, case-insensitive)", () => {
            render(<VendorPurchaseOrders />);

            fireEvent.change(screen.getByTestId("search-input"), { target: { value: "abc" } });

            expect(screen.getAllByTestId("table-row")).toHaveLength(1);
            expect(screen.getByText("ABC-777")).toBeInTheDocument();
        });

        it("trims the search term", () => {
            render(<VendorPurchaseOrders />);

            fireEvent.change(screen.getByTestId("search-input"), { target: { value: "  po-0002  " } });

            expect(screen.getAllByTestId("table-row")).toHaveLength(1);
            expect(screen.getByText("PO-0002")).toBeInTheDocument();
        });

        it("ignores orders without a PO number while searching", () => {
            render(<VendorPurchaseOrders />);

            fireEvent.change(screen.getByTestId("search-input"), { target: { value: "po" } });

            // only PO-0001 and PO-0002 contain "po"; the order with no number is skipped
            expect(screen.getAllByTestId("table-row")).toHaveLength(2);
        });

        it("shows no rows when nothing matches", () => {
            render(<VendorPurchaseOrders />);

            fireEvent.change(screen.getByTestId("search-input"), { target: { value: "zzz" } });

            expect(screen.queryAllByTestId("table-row")).toHaveLength(0);
            expect(screen.getByTestId("total-records")).toHaveTextContent("0");
            expect(pageInfo()).toHaveTextContent("1/1");
        });

        it("filters by order status", async () => {
            render(<VendorPurchaseOrders />);

            await user.selectOptions(screen.getByTestId("status-select"), "Approved");

            // PO-0002 and the order with no number
            expect(screen.getAllByTestId("table-row")).toHaveLength(2);
            expect(screen.getByTestId("total-records")).toHaveTextContent("2");
        });

        it("maps a multi-word status label to its API key", async () => {
            render(<VendorPurchaseOrders />);

            await user.selectOptions(screen.getByTestId("status-select"), "Partially Received");

            expect(screen.getAllByTestId("table-row")).toHaveLength(1);
            expect(screen.getByText("ABC-777")).toBeInTheDocument();
        });

        it("combines search and status", async () => {
            render(<VendorPurchaseOrders />);

            await user.selectOptions(screen.getByTestId("status-select"), "Approved");
            fireEvent.change(screen.getByTestId("search-input"), { target: { value: "0002" } });

            expect(screen.getAllByTestId("table-row")).toHaveLength(1);
            expect(screen.getByText("PO-0002")).toBeInTheDocument();
        });

        it("clears the status filter when the placeholder is chosen again", async () => {
            render(<VendorPurchaseOrders />);
            await user.selectOptions(screen.getByTestId("status-select"), "Draft");
            expect(screen.getAllByTestId("table-row")).toHaveLength(1);

            await user.selectOptions(screen.getByTestId("status-select"), "");

            expect(screen.getAllByTestId("table-row")).toHaveLength(4);
        });
    });

    // ---- columns ----

    describe("columns", () => {
        it("passes the 8 column headers to the table", () => {
            render(<VendorPurchaseOrders />);

            expect(screen.getByTestId("table-headers")).toHaveTextContent(
                "PO Number,PO Date,Delivery Date,Amount,Order Status,Delivery Status,Bill Status,Payment Status"
            );
        });

        it("renders plain fields as they are", () => {
            setDetail({ purchaseOrders: [makePO(1)] });
            render(<VendorPurchaseOrders />);

            expect(screen.getByTestId("cell-1-po_number")).toHaveTextContent("PO-0001");
            expect(screen.getByTestId("cell-1-po_date")).toHaveTextContent("2026-01-05");
            expect(screen.getByTestId("cell-1-delivery_date")).toHaveTextContent("2026-01-20");
        });

        it("formats the amount with 2 decimals and grouping", () => {
            setDetail({
                purchaseOrders: [
                    makePO(1, { total_amount: "1234567.5" }),
                    makePO(2, { total_amount: null }),
                ],
            });
            render(<VendorPurchaseOrders />);

            expect(screen.getByTestId("cell-1-total_amount")).toHaveTextContent("1,234,567.50");
            expect(screen.getByTestId("cell-2-total_amount")).toHaveTextContent("0.00");
        });

        it("prettifies the status fields", () => {
            setDetail({
                purchaseOrders: [
                    makePO(1, {
                        order_status: "partially_received",
                        delivery_status: "not_received",
                        bill_status: "partially_billed",
                        payment_status: "unpaid",
                    }),
                ],
            });
            render(<VendorPurchaseOrders />);

            expect(screen.getByTestId("cell-1-order_status")).toHaveTextContent("Partially Received");
            expect(screen.getByTestId("cell-1-delivery_status")).toHaveTextContent("Not Received");
            expect(screen.getByTestId("cell-1-bill_status")).toHaveTextContent("Partially Billed");
            expect(screen.getByTestId("cell-1-payment_status")).toHaveTextContent("Unpaid");
        });

        it("shows an em dash for missing statuses", () => {
            setDetail({
                purchaseOrders: [
                    makePO(1, {
                        order_status: null,
                        delivery_status: "",
                        bill_status: undefined,
                        payment_status: null,
                    }),
                ],
            });
            render(<VendorPurchaseOrders />);

            ["order_status", "delivery_status", "bill_status", "payment_status"].forEach((key) => {
                expect(screen.getByTestId(`cell-1-${key}`)).toHaveTextContent("—");
            });
        });
    });

    // ---- table / empty state ----

    it("falls back to an empty list when the slice has no data", () => {
        hoisted.state = {};
        render(<VendorPurchaseOrders />);

        expect(screen.queryAllByTestId("table-row")).toHaveLength(0);
        expect(pageInfo()).toHaveTextContent("1/1");
        expect(screen.getByTestId("total-records")).toHaveTextContent("0");
    });

    // ---- pagination (client-side) ----

    describe("pagination", () => {
        beforeEach(() => {
            setDetail({ purchaseOrders: makePOs(25) });
        });

        it("splits the orders into pages of 10", () => {
            render(<VendorPurchaseOrders />);

            expect(pageInfo()).toHaveTextContent("1/3");
            expect(screen.getByTestId("total-records")).toHaveTextContent("25");
            expect(rowNumbers()).toHaveLength(10);
            expect(rowNumbers()[0]).toBe("PO-0001");
            expect(rowNumbers()[9]).toBe("PO-0010");
        });

        it("shows the next 10 orders on page 2", async () => {
            render(<VendorPurchaseOrders />);

            await user.click(screen.getByText("next-page"));

            expect(pageInfo()).toHaveTextContent("2/3");
            expect(rowNumbers()[0]).toBe("PO-0011");
        });

        it("shows the remaining orders on the last page", async () => {
            render(<VendorPurchaseOrders />);

            await user.click(screen.getByText("page-three"));

            expect(rowNumbers()).toHaveLength(5);
            expect(rowNumbers()[0]).toBe("PO-0021");
        });

        it("goes back to page 1 after a search", async () => {
            render(<VendorPurchaseOrders />);
            await user.click(screen.getByText("next-page"));
            expect(pageInfo()).toHaveTextContent("2/3");

            fireEvent.change(screen.getByTestId("search-input"), { target: { value: "PO-00" } });

            expect(pageInfo()).toHaveTextContent("1/3");
        });

        it("goes back to page 1 when the status changes", async () => {
            render(<VendorPurchaseOrders />);
            await user.click(screen.getByText("next-page"));
            expect(pageInfo()).toHaveTextContent("2/3");

            await user.selectOptions(screen.getByTestId("status-select"), "Approved");

            expect(pageInfo()).toHaveTextContent("1/3");
        });

        it("recalculates the page count for the filtered list", () => {
            render(<VendorPurchaseOrders />);

            fireEvent.change(screen.getByTestId("search-input"), { target: { value: "PO-002" } });

            // PO-0020 .. PO-0025
            expect(screen.getByTestId("total-records")).toHaveTextContent("6");
            expect(pageInfo()).toHaveTextContent("1/1");
        });
    });
});