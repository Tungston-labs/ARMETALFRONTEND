import React from "react";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// NOTE: this file sits next to VendorLedger.jsx, so every path below is the
// same one the component itself imports. If you move the test into a
// separate tests folder, change the import AND every vi.mock() path to the
// same new relative path (vi.mock resolves relative to the test file).
import VendorLedger from "../../../Pages/FinanceModule/PURCHASES/VendorLedger/VendorLedger";
import { getVendorLedgers } from "../../../Redux/finance/purchases/vendorLedgerslice";
import { getVendorLedgerColumns } from "../../../Pages/FinanceModule/PURCHASES/VendorLedger/Vendorledgercolumns";

// ---- react-redux: VendorLedger reads { list, pagination, loading } from
// state.vendorLedger via useSelector and dispatches getVendorLedgers itself.
const { mockDispatch, mockUseSelector } = vi.hoisted(() => ({
    mockDispatch: vi.fn(),
    mockUseSelector: vi.fn(),
}));

vi.mock("react-redux", () => ({
    useDispatch: () => mockDispatch,
    useSelector: (selector) => mockUseSelector(selector),
}));

vi.mock("../../../Redux/finance/purchases/vendorLedgerslice", () => ({
    getVendorLedgers: vi.fn((params) => ({ type: "getVendorLedgers", payload: params })),
}));

vi.mock("../../../Pages/FinanceModule/PURCHASES/VendorLedger/Vendorledgercolumns", () => ({
    getVendorLedgerColumns: vi.fn(() => [{ key: "col" }]),
    formatAmount: (n) => Number(n).toFixed(2),
}));

vi.mock("react-icons/fi", () => ({
    FiDollarSign: () => <span />,
    FiArrowDownCircle: () => <span />,
    FiArrowUpCircle: () => <span />,
    FiFileText: () => <span />,
}));

vi.mock("../../../Pages/FinanceModule/PURCHASES/VendorLedger/VendorLedger.styles", () => ({
    DateInput: (props) => <input {...props} />,
    DatePickerContainer: ({ children }) => <div>{children}</div>,
    DateRangeWrapper: ({ children }) => <div>{children}</div>,
    DateSeparator: ({ children }) => <span>{children}</span>,
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

vi.mock("../../../Components/ReusableTable/ReusableTable", () => ({
    default: ({ data, loading, totalRow, totalRowLabel }) => (
        <div data-testid="reusable-table" data-loading={String(loading)}>
            {data.map((row) => (
                <div key={row.id} data-testid="table-row">
                    {row.id}
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
            <button onClick={() => onPageChange(0)}>page-zero</button>
            <button onClick={() => onPageChange(999)}>page-too-far</button>
            <button onClick={() => onPageChange(3)}>page-three</button>
        </div>
    ),
}));

vi.mock("../../../Components/ReusableTable/ReusableFilter", () => ({
    default: ({ search, onSearch, searchPlaceholder, filters = [] }) => (
        <div data-testid="reusable-filter">
            <input
                data-testid="search-input"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => onSearch(e.target.value)}
            />
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

vi.mock("../../../Components/ReusableTable/ReusableHeader", () => ({
    default: ({ title, children }) => (
        <div data-testid="reusable-header">
            <h1>{title}</h1>
            {children}
        </div>
    ),
}));

// ---- fixtures ----

const sampleList = [
    { id: 1, debit_amount: "100.50", credit_amount: "0" },
    { id: 2, debit_amount: "0", credit_amount: "40.25" },
    { id: 3, debit_amount: "200", credit_amount: "50" },
];

const mockState = (ledgerOverrides = {}) => {
    const state = {
        vendorLedger: {
            list: sampleList,
            pagination: { totalPages: 5, totalItems: 47 },
            loading: false,
            ...ledgerOverrides,
        },
    };
    mockUseSelector.mockImplementation((selector) => selector(state));
};

const lastFetchParams = () => {
    const calls = getVendorLedgers.mock.calls;
    return calls[calls.length - 1][0];
};

const advanceDebounce = (ms = 300) => {
    act(() => {
        vi.advanceTimersByTime(ms);
    });
};

const pageInfo = () => screen.getByTestId("page-info");

describe("VendorLedger", () => {
    let user;

    beforeEach(() => {
        // Fake timers so the 300ms search debounce never fires on its own and
        // accidentally resets the page in the middle of a test.
        vi.useFakeTimers();
        user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
        vi.clearAllMocks();
        mockState();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    // ---- Render ----

    it("renders header, stats cards, filter, table and pagination", () => {
        render(<VendorLedger />);

        expect(screen.getByText("Vendor Ledger")).toBeInTheDocument();
        expect(screen.getByTestId("stats-cards")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-filter")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });

    it("dispatches getVendorLedgers with the default params on mount", () => {
        render(<VendorLedger />);

        expect(getVendorLedgers).toHaveBeenCalledWith({
            page: 1,
            pageSize: 10,
            search: "",
            vendor: "",
            transaction_type: "",
            status: "",
            from_date: "",
            to_date: "",
        });
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({ type: "getVendorLedgers" })
        );
    });

    it("passes table rows, loading flag and pagination info through from the store", () => {
        mockState({ loading: true });
        render(<VendorLedger />);

        expect(screen.getAllByTestId("table-row")).toHaveLength(3);
        expect(screen.getByTestId("reusable-table")).toHaveAttribute("data-loading", "true");
        expect(pageInfo()).toHaveTextContent("1/5");
        expect(screen.getByTestId("total-records")).toHaveTextContent("47");
    });

    it("builds the columns with the current page and page size", () => {
        render(<VendorLedger />);

        expect(getVendorLedgerColumns).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
    });

    // ---- Stats cards ----

    it("renders all 4 stat cards", () => {
        render(<VendorLedger />);

        const stats = within(screen.getByTestId("stats-cards"));
        expect(stats.getAllByTestId("stat-card")).toHaveLength(4);

        expect(stats.getByText("Total Payables").nextSibling).toHaveTextContent("0.00");
        expect(stats.getByText("Total Purchases").nextSibling).toHaveTextContent("0.00");
        expect(stats.getByText("Total Payments").nextSibling).toHaveTextContent("0.00");
        expect(stats.getByText("Total Transactions").nextSibling).toHaveTextContent("47");
    });

    it("falls back to 0 for Total Transactions when totalItems is missing", () => {
        mockState({ pagination: {} });
        render(<VendorLedger />);

        const stats = within(screen.getByTestId("stats-cards"));
        expect(stats.getByText("Total Transactions").nextSibling).toHaveTextContent("0");
    });

    // ---- Total row ----

    it("sums debit, credit and balance for the rows on the page", () => {
        render(<VendorLedger />);

        expect(screen.getByText("TOTAL")).toBeInTheDocument();
        expect(screen.getByTestId("total-debit")).toHaveTextContent("300.50");
        expect(screen.getByTestId("total-credit")).toHaveTextContent("90.25");
        expect(screen.getByTestId("total-balance")).toHaveTextContent("210.25");
    });

    it("treats null / missing amounts as 0 in the total row", () => {
        mockState({
            list: [
                { id: 1, debit_amount: null, credit_amount: undefined },
                { id: 2, debit_amount: "10", credit_amount: "" },
            ],
        });
        render(<VendorLedger />);

        expect(screen.getByTestId("total-debit")).toHaveTextContent("10.00");
        expect(screen.getByTestId("total-credit")).toHaveTextContent("0.00");
        expect(screen.getByTestId("total-balance")).toHaveTextContent("10.00");
    });

    it("does not render the total row when the list is empty", () => {
        mockState({ list: [] });
        render(<VendorLedger />);

        expect(screen.queryByTestId("total-row")).not.toBeInTheDocument();
    });

    // ---- Search (debounced) ----

    it("does not fetch for a search until the 300ms debounce has elapsed", () => {
        render(<VendorLedger />);
        getVendorLedgers.mockClear();

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "abc" } });

        advanceDebounce(299);
        expect(getVendorLedgers).not.toHaveBeenCalled();

        advanceDebounce(1);
        expect(lastFetchParams()).toMatchObject({ search: "abc", page: 1 });
    });

    it("trims the search term before fetching", () => {
        render(<VendorLedger />);

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "  abc  " } });
        advanceDebounce();

        expect(lastFetchParams().search).toBe("abc");
    });

    it("only fetches with the last value when the user types quickly", () => {
        render(<VendorLedger />);
        const input = screen.getByTestId("search-input");
        getVendorLedgers.mockClear();

        fireEvent.change(input, { target: { value: "a" } });
        advanceDebounce(100);
        fireEvent.change(input, { target: { value: "ab" } });
        advanceDebounce(100);
        fireEvent.change(input, { target: { value: "abc" } });
        advanceDebounce();

        expect(getVendorLedgers.mock.calls.map((c) => c[0].search)).toEqual(["abc"]);
    });

    it("resets to page 1 after a search", async () => {
        render(<VendorLedger />);
        await user.click(screen.getByText("next-page"));
        expect(pageInfo()).toHaveTextContent("2/5");

        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "abc" } });
        advanceDebounce();

        expect(pageInfo()).toHaveTextContent("1/5");
        expect(lastFetchParams()).toMatchObject({ search: "abc", page: 1 });
    });

    // ---- Dropdown filters ----

    it("propagates the vendor filter to the fetch", async () => {
        render(<VendorLedger />);

        await user.selectOptions(screen.getByTestId("filter-vendor"), "2");

        expect(lastFetchParams().vendor).toBe("2");
    });

    it("propagates the transaction type filter as transaction_type", async () => {
        render(<VendorLedger />);

        await user.selectOptions(screen.getByTestId("filter-transactionType"), "payment");

        expect(lastFetchParams().transaction_type).toBe("payment");
    });

    it("propagates the status filter to the fetch", async () => {
        render(<VendorLedger />);

        await user.selectOptions(screen.getByTestId("filter-status"), "settled");

        expect(lastFetchParams().status).toBe("settled");
    });

    it("offers the expected transaction type and status options", () => {
        render(<VendorLedger />);

        const values = (testId) =>
            Array.from(screen.getByTestId(testId).querySelectorAll("option")).map((o) => o.value);

        expect(values("filter-transactionType")).toEqual([
            "",
            "bill",
            "payment",
            "opening_balance",
            "manual",
            "credit_note",
            "debit_note",
        ]);
        expect(values("filter-status")).toEqual(["", "open", "partial", "settled", "cancelled"]);
    });

    it("combines several filters in a single fetch", async () => {
        render(<VendorLedger />);

        await user.selectOptions(screen.getByTestId("filter-vendor"), "1");
        await user.selectOptions(screen.getByTestId("filter-transactionType"), "bill");
        await user.selectOptions(screen.getByTestId("filter-status"), "open");

        expect(lastFetchParams()).toMatchObject({
            vendor: "1",
            transaction_type: "bill",
            status: "open",
        });
    });

    it.each([
        ["filter-vendor", "1"],
        ["filter-transactionType", "bill"],
        ["filter-status", "open"],
    ])("resets to page 1 when %s changes", async (testId, value) => {
        render(<VendorLedger />);
        await user.click(screen.getByText("next-page"));
        expect(pageInfo()).toHaveTextContent("2/5");

        await user.selectOptions(screen.getByTestId(testId), value);

        expect(pageInfo()).toHaveTextContent("1/5");
        expect(lastFetchParams().page).toBe(1);
    });

    // ---- Date range ----

    it("propagates the start and end dates as from_date / to_date", () => {
        render(<VendorLedger />);

        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2026-01-01" } });
        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2026-01-31" } });

        expect(lastFetchParams()).toMatchObject({
            from_date: "2026-01-01",
            to_date: "2026-01-31",
        });
    });

    it("limits the start date by the end date and vice versa", () => {
        render(<VendorLedger />);
        const start = screen.getByLabelText("Start date");
        const end = screen.getByLabelText("End date");

        expect(start).not.toHaveAttribute("max");
        expect(end).not.toHaveAttribute("min");

        fireEvent.change(start, { target: { value: "2026-01-01" } });
        fireEvent.change(end, { target: { value: "2026-01-31" } });

        expect(start).toHaveAttribute("max", "2026-01-31");
        expect(end).toHaveAttribute("min", "2026-01-01");
    });

    it("resets to page 1 when a date changes", async () => {
        render(<VendorLedger />);
        await user.click(screen.getByText("next-page"));
        expect(pageInfo()).toHaveTextContent("2/5");

        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2026-01-31" } });

        expect(pageInfo()).toHaveTextContent("1/5");
    });

    // ---- Pagination ----

    it("fetches the requested page and rebuilds the columns for it", async () => {
        render(<VendorLedger />);

        await user.click(screen.getByText("next-page"));

        expect(pageInfo()).toHaveTextContent("2/5");
        expect(lastFetchParams().page).toBe(2);
        expect(getVendorLedgerColumns).toHaveBeenLastCalledWith({ page: 2, pageSize: 10 });
    });

    it("ignores a page below 1", async () => {
        render(<VendorLedger />);
        getVendorLedgers.mockClear();

        await user.click(screen.getByText("page-zero"));

        expect(pageInfo()).toHaveTextContent("1/5");
        expect(getVendorLedgers).not.toHaveBeenCalled();
    });

    it("ignores a page above totalPages", async () => {
        render(<VendorLedger />);
        getVendorLedgers.mockClear();

        await user.click(screen.getByText("page-too-far"));

        expect(pageInfo()).toHaveTextContent("1/5");
        expect(getVendorLedgers).not.toHaveBeenCalled();
    });

    it("treats a missing totalPages as a single page", async () => {
        mockState({ pagination: {} });
        render(<VendorLedger />);
        getVendorLedgers.mockClear();

        await user.click(screen.getByText("next-page"));

        expect(getVendorLedgers).not.toHaveBeenCalled();
    });

    it("moves back to the last valid page when totalPages shrinks", async () => {
        const { rerender } = render(<VendorLedger />);
        await user.click(screen.getByText("page-three"));
        expect(pageInfo()).toHaveTextContent("3/5");

        mockState({ pagination: { totalPages: 2, totalItems: 15 } });
        rerender(<VendorLedger />);

        expect(pageInfo()).toHaveTextContent("2/2");
        expect(lastFetchParams().page).toBe(2);
    });
});