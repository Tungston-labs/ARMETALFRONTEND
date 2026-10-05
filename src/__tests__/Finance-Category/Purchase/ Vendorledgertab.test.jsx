import React from "react";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Paths assume the component lives in
//   src/Pages/FinanceModule/PURCHASES/Vendors/Ledger/
// and this test in src/__tests__/Finance-Category/Purchase/.
// Every vi.mock() path must resolve to the same file as its import.
import VendorLedgerTab from "../../../Pages/FinanceModule/PURCHASES/Vendors/Ledger/VendorLedgerTab";
import {
    getVendorLedger,
    clearVendorLedger,
} from "../../../Redux/finance/purchases/Vendordetailslice";

// ---- react-redux / react-router: VendorLedgerTab reads the vendor detail
// slice through useSelector(selectVendorDetail), reads the vendor id from
// props or the route, and dispatches getVendorLedger / clearVendorLedger.
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
    getVendorLedger: vi.fn((args) => ({ type: "getVendorLedger", payload: args })),
    clearVendorLedger: vi.fn(() => ({ type: "clearVendorLedger" })),
    selectVendorDetail: (s) => s.vendorDetail,
}));

vi.mock("../../../Pages/FinanceModule/PURCHASES/Vendors/Ledger/dummydata", () => ({
    vendorLedgerColumns: [{ header: "Date" }, { header: "Reference" }],
}));

vi.mock("react-icons/fi", () => ({
    FiDollarSign: () => <span />,
    FiFileText: () => <span />,
    FiCheckCircle: () => <span />,
    FiAlertCircle: () => <span />,
}));

vi.mock("../../../Components/StatsCards/StatsCards", () => ({
    default: ({ cards }) => (
        <div data-testid="stats-cards">
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
                value={search}
                onChange={(e) => onSearch(e.target.value)}
            />
            <select
                data-testid="status-select"
                value={status}
                onChange={(e) => onStatus(e.target.value)}
            >
                <option value="">placeholder</option>
                {/* the real filter may offer an "All" choice */}
                <option value="All">All</option>
                {statuses.map((s) => (
                    <option key={s} value={s}>
                        {s}
                    </option>
                ))}
            </select>
        </div>
    ),
}));

vi.mock("../../../Components/ReusableTable/ReusableTable", () => ({
    default: ({ columns, data, totalRow, totalRowLabel }) => (
        <div data-testid="reusable-table">
            <div data-testid="table-headers">{columns.map((c) => c.header).join(",")}</div>
            {data.map((r) => (
                <div key={r.id} data-testid="table-row">
                    {[r.id, r.date, r.reference, r.description, r.type, r.debit, r.credit, r.balance].join(
                        "|"
                    )}
                </div>
            ))}
            {totalRow && (
                <div data-testid="total-row">
                    <span>{totalRowLabel}</span>
                    <span data-testid="total-debit">{totalRow.debit}</span>
                    <span data-testid="total-credit">{totalRow.credit}</span>
                    <span data-testid="total-balance">{totalRow.balance}</span>
                </div>
            )}
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

const makeLedger = (n) =>
    Array.from({ length: n }, (_, i) => {
        const k = i + 1;
        return {
            id: k,
            entry_date: `2026-01-${String(k).padStart(2, "0")}`,
            reference_number: `REF-${k}`,
            description: `Desc ${k}`,
            type: "Manual Entry",
            debit_amount: "100",
            credit_amount: "40",
            running_balance: String(k * 60),
        };
    });

const defaultCards = {
    total_opening_balance: 1000,
    total_billed: 2500.5,
    total_paid_and_debit_note: 1200,
    outstanding_payable: 2300.5,
};

const setDetail = (overrides = {}) => {
    hoisted.state = {
        vendorDetail: {
            ledger: makeLedger(3),
            ledgerCards: defaultCards,
            ledgerLoading: false,
            ledgerError: null,
            ...overrides,
        },
    };
};

const lastFetchArgs = () => {
    const calls = getVendorLedger.mock.calls;
    return calls[calls.length - 1][0];
};

const advance = (ms) => {
    act(() => {
        vi.advanceTimersByTime(ms);
    });
};

const pageInfo = () => screen.getByTestId("page-info");

describe("VendorLedgerTab", () => {
    let user;

    beforeEach(() => {
        // Fake timers so the 400ms search debounce only fires when a test advances it
        vi.useFakeTimers();
        user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        vi.clearAllMocks();
        vi.spyOn(console, "log").mockImplementation(() => {});
        hoisted.params = {};
        setDetail();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    // ---- vendor id resolution ----

    describe("vendor id", () => {
        it("uses the vendorId prop", () => {
            render(<VendorLedgerTab vendorId="7" />);

            expect(lastFetchArgs().vendorId).toBe("7");
        });

        it("falls back to the route param 'id'", () => {
            hoisted.params = { id: "12" };
            render(<VendorLedgerTab />);

            expect(lastFetchArgs().vendorId).toBe("12");
        });

        it("falls back to the route param 'vendorId'", () => {
            hoisted.params = { vendorId: "15" };
            render(<VendorLedgerTab />);

            expect(lastFetchArgs().vendorId).toBe("15");
        });

        it("prefers the prop over the route params", () => {
            hoisted.params = { id: "12", vendorId: "15" };
            render(<VendorLedgerTab vendorId="7" />);

            expect(lastFetchArgs().vendorId).toBe("7");
        });

        it("shows a message and does not fetch when there is no vendor id", () => {
            render(<VendorLedgerTab />);

            expect(screen.getByText(/No vendor id found/)).toBeInTheDocument();
            expect(screen.getByText(/Route params: none\./)).toBeInTheDocument();
            expect(getVendorLedger).not.toHaveBeenCalled();
            expect(screen.queryByTestId("reusable-table")).not.toBeInTheDocument();
        });

        it("lists the available route params in the message", () => {
            hoisted.params = { foo: "1", bar: "2" };
            render(<VendorLedgerTab />);

            expect(screen.getByText(/Route params: foo, bar\./)).toBeInTheDocument();
        });
    });

    // ---- fetching ----

    describe("fetching", () => {
        it("fetches the ledger on mount with empty filters", () => {
            render(<VendorLedgerTab vendorId="7" />);

            expect(getVendorLedger).toHaveBeenCalledTimes(1);
            expect(getVendorLedger).toHaveBeenCalledWith({
                vendorId: "7",
                params: { search: "", type: "" },
            });
            expect(mockDispatch).toHaveBeenCalledWith(
                expect.objectContaining({ type: "getVendorLedger" })
            );
        });

        it("does not fetch for a search until the 400ms debounce elapses", () => {
            render(<VendorLedgerTab vendorId="7" />);
            getVendorLedger.mockClear();

            fireEvent.change(screen.getByTestId("search-input"), { target: { value: "abc" } });

            advance(399);
            expect(getVendorLedger).not.toHaveBeenCalled();

            advance(1);
            expect(lastFetchArgs()).toEqual({
                vendorId: "7",
                params: { search: "abc", type: "" },
            });
        });

        it("only fetches with the last value when the user types quickly", () => {
            render(<VendorLedgerTab vendorId="7" />);
            const input = screen.getByTestId("search-input");
            getVendorLedger.mockClear();

            fireEvent.change(input, { target: { value: "a" } });
            advance(200);
            fireEvent.change(input, { target: { value: "ab" } });
            advance(200);
            fireEvent.change(input, { target: { value: "abc" } });
            advance(400);

            expect(getVendorLedger.mock.calls.map((c) => c[0].params.search)).toEqual(["abc"]);
        });

        it("fetches immediately when the type filter changes", async () => {
            render(<VendorLedgerTab vendorId="7" />);

            await user.selectOptions(screen.getByTestId("status-select"), "Credit Note");

            expect(lastFetchArgs().params.type).toBe("Credit Note");
        });

        it("sends an empty type when 'All' is selected", async () => {
            render(<VendorLedgerTab vendorId="7" />);
            await user.selectOptions(screen.getByTestId("status-select"), "Debit Note");
            expect(lastFetchArgs().params.type).toBe("Debit Note");

            await user.selectOptions(screen.getByTestId("status-select"), "All");

            expect(lastFetchArgs().params.type).toBe("");
        });

        it("combines search and type in one request", async () => {
            render(<VendorLedgerTab vendorId="7" />);

            await user.selectOptions(screen.getByTestId("status-select"), "Manual Entry");
            fireEvent.change(screen.getByTestId("search-input"), { target: { value: "abc" } });
            advance(400);

            expect(lastFetchArgs()).toEqual({
                vendorId: "7",
                params: { search: "abc", type: "Manual Entry" },
            });
        });

        it("refetches when the vendor changes", () => {
            const { rerender } = render(<VendorLedgerTab vendorId="7" />);
            getVendorLedger.mockClear();

            rerender(<VendorLedgerTab vendorId="8" />);

            expect(lastFetchArgs().vendorId).toBe("8");
        });
    });

    // ---- cleanup ----

    describe("clearing stale data", () => {
        it("dispatches clearVendorLedger on unmount", () => {
            const { unmount } = render(<VendorLedgerTab vendorId="7" />);
            clearVendorLedger.mockClear();

            unmount();

            expect(clearVendorLedger).toHaveBeenCalledTimes(1);
            expect(mockDispatch).toHaveBeenCalledWith({ type: "clearVendorLedger" });
        });

        it("dispatches clearVendorLedger when switching vendors", () => {
            const { rerender } = render(<VendorLedgerTab vendorId="7" />);
            clearVendorLedger.mockClear();

            rerender(<VendorLedgerTab vendorId="8" />);

            expect(clearVendorLedger).toHaveBeenCalledTimes(1);
        });
    });

    // ---- filter props ----

    it("enables the search box and the type filter with the ledger types", () => {
        render(<VendorLedgerTab vendorId="7" />);

        const filter = screen.getByTestId("reusable-filter");
        expect(filter).toHaveAttribute("data-show-search", "true");
        expect(filter).toHaveAttribute("data-show-status", "true");

        const values = Array.from(
            screen.getByTestId("status-select").querySelectorAll("option")
        ).map((o) => o.value);
        expect(values).toEqual(["", "All", "Manual Entry", "Credit Note", "Debit Note"]);
    });

    // ---- Stats cards ----

    describe("stats cards", () => {
        it("renders the 4 cards with formatted amounts", () => {
            render(<VendorLedgerTab vendorId="7" />);

            const stats = within(screen.getByTestId("stats-cards"));
            expect(stats.getAllByTestId("stat-card")).toHaveLength(4);
            expect(stats.getByText("Opening Balance").nextSibling).toHaveTextContent("1,000.00");
            expect(stats.getByText("Total Billed").nextSibling).toHaveTextContent("2,500.50");
            expect(stats.getByText("Paid & Debit Note").nextSibling).toHaveTextContent("1,200.00");
            expect(stats.getByText("Outstanding Payable").nextSibling).toHaveTextContent("2,300.50");
        });

        it("shows 0.00 on every card when ledgerCards is null", () => {
            setDetail({ ledgerCards: null });
            render(<VendorLedgerTab vendorId="7" />);

            const stats = within(screen.getByTestId("stats-cards"));
            ["Opening Balance", "Total Billed", "Paid & Debit Note", "Outstanding Payable"].forEach(
                (title) => {
                    expect(stats.getByText(title).nextSibling).toHaveTextContent("0.00");
                }
            );
        });
    });

    // ---- Table rows ----

    describe("table", () => {
        it("passes the columns to the table", () => {
            render(<VendorLedgerTab vendorId="7" />);

            expect(screen.getByTestId("table-headers")).toHaveTextContent("Date,Reference");
        });

        it("maps API fields to the table row keys and formats the amounts", () => {
            setDetail({
                ledger: [
                    {
                        id: 5,
                        entry_date: "2026-02-10",
                        reference_number: "BILL-5",
                        description: "Office chairs",
                        type: "Credit Note",
                        debit_amount: "1234.5",
                        credit_amount: null,
                        running_balance: "9876.543",
                    },
                ],
            });
            render(<VendorLedgerTab vendorId="7" />);

            expect(screen.getByTestId("table-row")).toHaveTextContent(
                "5|2026-02-10|BILL-5|Office chairs|Credit Note|1,234.50|0.00|9,876.54"
            );
        });

        it("renders no rows for an empty ledger", () => {
            setDetail({ ledger: [] });
            render(<VendorLedgerTab vendorId="7" />);

            expect(screen.queryAllByTestId("table-row")).toHaveLength(0);
        });

        it("falls back to an empty ledger when the slice has no data", () => {
            hoisted.state = {};
            render(<VendorLedgerTab vendorId="7" />);

            expect(screen.queryAllByTestId("table-row")).toHaveLength(0);
            expect(screen.getByTestId("total-balance")).toHaveTextContent("0.00");
        });
    });

    // ---- Total row ----

    describe("total row", () => {
        it("sums debit and credit across all rows", () => {
            render(<VendorLedgerTab vendorId="7" />);

            expect(screen.getByText("TOTAL")).toBeInTheDocument();
            expect(screen.getByTestId("total-debit")).toHaveTextContent("300.00");
            expect(screen.getByTestId("total-credit")).toHaveTextContent("120.00");
        });

        it("uses the last row's running balance as the closing balance", () => {
            render(<VendorLedgerTab vendorId="7" />);

            // 3rd row: running_balance = 180
            expect(screen.getByTestId("total-balance")).toHaveTextContent("180.00");
        });

        it("sums across all pages, not just the visible one", () => {
            setDetail({ ledger: makeLedger(25) });
            render(<VendorLedgerTab vendorId="7" />);

            expect(screen.getByTestId("total-debit")).toHaveTextContent("2,500.00");
            expect(screen.getByTestId("total-credit")).toHaveTextContent("1,000.00");
            expect(screen.getByTestId("total-balance")).toHaveTextContent("1,500.00");
        });

        it("shows 0.00 everywhere for an empty ledger", () => {
            setDetail({ ledger: [] });
            render(<VendorLedgerTab vendorId="7" />);

            expect(screen.getByTestId("total-debit")).toHaveTextContent("0.00");
            expect(screen.getByTestId("total-credit")).toHaveTextContent("0.00");
            expect(screen.getByTestId("total-balance")).toHaveTextContent("0.00");
        });
    });

    // ---- Loading ----

    describe("loading", () => {
        it("shows a loading message instead of the table", () => {
            setDetail({ ledgerLoading: true });
            render(<VendorLedgerTab vendorId="7" />);

            expect(screen.getByText("Loading ledger...")).toBeInTheDocument();
            expect(screen.queryByTestId("reusable-table")).not.toBeInTheDocument();
        });

        it("shows the table when not loading", () => {
            render(<VendorLedgerTab vendorId="7" />);

            expect(screen.queryByText("Loading ledger...")).not.toBeInTheDocument();
            expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
        });
    });

    // ---- Error message ----

    describe("error message", () => {
        it("shows nothing when there is no error", () => {
            const { container } = render(<VendorLedgerTab vendorId="7" />);

            expect(container.querySelector('[style*="rgb(239, 68, 68)"]')).not.toBeInTheDocument();
        });

        it("shows a string error as is", () => {
            setDetail({ ledgerError: "Something went wrong" });
            render(<VendorLedgerTab vendorId="7" />);

            expect(screen.getByText("Something went wrong")).toHaveStyle({ color: "#EF4444" });
        });

        it("shows error.detail when present", () => {
            setDetail({ ledgerError: { detail: "Not found." } });
            render(<VendorLedgerTab vendorId="7" />);

            expect(screen.getByText("Not found.")).toBeInTheDocument();
        });

        it("flattens field errors into 'field: message | field: message'", () => {
            setDetail({
                ledgerError: { type: ["Invalid choice", "Required"], search: "Too long" },
            });
            render(<VendorLedgerTab vendorId="7" />);

            expect(
                screen.getByText("type: Invalid choice, Required | search: Too long")
            ).toBeInTheDocument();
        });
    });

    // ---- Pagination (client-side) ----

    describe("pagination", () => {
        it("shows 1 page and the row count for a short ledger", () => {
            render(<VendorLedgerTab vendorId="7" />);

            expect(pageInfo()).toHaveTextContent("1/1");
            expect(screen.getByTestId("total-records")).toHaveTextContent("3");
        });

        it("shows 1 page and 0 records for an empty ledger", () => {
            setDetail({ ledger: [] });
            render(<VendorLedgerTab vendorId="7" />);

            expect(pageInfo()).toHaveTextContent("1/1");
            expect(screen.getByTestId("total-records")).toHaveTextContent("0");
        });

        it("splits the rows into pages of 10", () => {
            setDetail({ ledger: makeLedger(25) });
            render(<VendorLedgerTab vendorId="7" />);

            expect(pageInfo()).toHaveTextContent("1/3");
            expect(screen.getByTestId("total-records")).toHaveTextContent("25");

            const rows = screen.getAllByTestId("table-row");
            expect(rows).toHaveLength(10);
            expect(rows[0]).toHaveTextContent(/^1\|/);
            expect(rows[9]).toHaveTextContent(/^10\|/);
        });

        it("shows the next 10 rows on page 2", async () => {
            setDetail({ ledger: makeLedger(25) });
            render(<VendorLedgerTab vendorId="7" />);

            await user.click(screen.getByText("next-page"));

            expect(pageInfo()).toHaveTextContent("2/3");
            const rows = screen.getAllByTestId("table-row");
            expect(rows).toHaveLength(10);
            expect(rows[0]).toHaveTextContent(/^11\|/);
        });

        it("shows the remaining rows on the last page", async () => {
            setDetail({ ledger: makeLedger(25) });
            render(<VendorLedgerTab vendorId="7" />);

            await user.click(screen.getByText("page-three"));

            const rows = screen.getAllByTestId("table-row");
            expect(rows).toHaveLength(5);
            expect(rows[0]).toHaveTextContent(/^21\|/);
        });

        it("goes back to page 1 when the type filter changes", async () => {
            setDetail({ ledger: makeLedger(25) });
            render(<VendorLedgerTab vendorId="7" />);
            await user.click(screen.getByText("next-page"));
            expect(pageInfo()).toHaveTextContent("2/3");

            await user.selectOptions(screen.getByTestId("status-select"), "Credit Note");

            expect(pageInfo()).toHaveTextContent("1/3");
        });

        it("goes back to page 1 after a search", async () => {
            setDetail({ ledger: makeLedger(25) });
            render(<VendorLedgerTab vendorId="7" />);
            await user.click(screen.getByText("next-page"));
            expect(pageInfo()).toHaveTextContent("2/3");

            fireEvent.change(screen.getByTestId("search-input"), { target: { value: "abc" } });
            advance(400);

            expect(pageInfo()).toHaveTextContent("1/3");
        });
    });
});