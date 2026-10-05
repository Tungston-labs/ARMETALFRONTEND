import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Paths assume the component lives in
//   src/Pages/FinanceModule/PURCHASES/PurchaseOrders/
// and this test in src/__tests__/Finance-Category/Purchase/.
// Verify with:  find src -iname "PurchaseOrders*"  (and Usepurchaseorders*)
// Every vi.mock() path must resolve to the same file as its import.
import PurchaseOrders from "../../../Pages/FinanceModule/PURCHASES/PurchaseOrders/PurchaseOrders";
import usePurchaseOrders from "../../../Pages/FinanceModule/PURCHASES/PurchaseOrders/Usepurchaseorders";

// ---- PurchaseOrders is a thin view over the usePurchaseOrders hook, so the
// hook is mocked and every Reusable* component is replaced by a small fake
// that exposes the props it receives.

vi.mock("../../../Pages/FinanceModule/PURCHASES/PurchaseOrders/Usepurchaseorders");

vi.mock("../../../Pages/FinanceModule/PURCHASES/PurchaseOrders/PurchaseOrders.styles", () => ({
    DateInput: (props) => <input {...props} />,
    DatePickerContainer: ({ children }) => <div>{children}</div>,
    DateRangeWrapper: ({ children }) => <div>{children}</div>,
    DateSeparator: ({ children }) => <span>{children}</span>,
}));

vi.mock("../../../Components/ReusableTable/ReusableHeader", () => ({
    default: ({ title, breadcrumbs, buttonText, onButtonClick, children }) => (
        <div data-testid="reusable-header">
            <h1>{title}</h1>
            <span data-testid="breadcrumbs">{(breadcrumbs || []).join(" > ")}</span>
            <button onClick={onButtonClick}>{buttonText}</button>
            {children}
        </div>
    ),
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
        showSearch,
        status,
        statuses = [],
        onStatus,
        showStatus,
        filters = [],
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
                {statuses.map((s) => {
                    const value = typeof s === "string" ? s : s.value;
                    const label = typeof s === "string" ? s : s.label;
                    return (
                        <option key={value} value={value}>
                            {label}
                        </option>
                    );
                })}
            </select>

            {filters.map((f) => (
                <select
                    key={f.key}
                    data-testid={`filter-${f.key}`}
                    value={f.value}
                    onChange={(e) => f.onChange(e.target.value)}
                >
                    <option value="">{f.placeholder}</option>
                    {f.options.map((opt) => {
                        const value = typeof opt === "string" ? opt : opt.value;
                        const label = typeof opt === "string" ? opt : opt.label;
                        return (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        );
                    })}
                </select>
            ))}
        </div>
    ),
}));

vi.mock("../../../Components/ReusableTable/ReusableTable", () => ({
    default: ({ columns, data, loading }) => (
        <div data-testid="reusable-table" data-loading={String(loading)}>
            <div data-testid="table-headers">{columns.map((c) => c.header).join(",")}</div>
            {data.map((row) => (
                <div key={row.id} data-testid="table-row">
                    {row.po_number}
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
        </div>
    ),
}));

// ---- fixtures ----

const baseHookReturn = {
    search: "",
    vendor: "",
    status: "",
    receiptStatus: "",
    billStatus: "",
    startDate: "",
    endDate: "",

    currentPage: 1,
    totalPages: 4,
    totalItems: 38,
    setCurrentPage: vi.fn(),

    cards: [
        { title: "Total Purchase Orders", count: 38 },
        { title: "Pending Receipt", count: 7 },
        { title: "Pending Billing", count: 5 },
    ],
    columns: [{ header: "PO No" }, { header: "Vendor" }, { header: "Status" }],
    paginatedData: [
        { id: 1, po_number: "PO-0001" },
        { id: 2, po_number: "PO-0002" },
    ],

    loading: false,
    dashboardLoading: false,
    errorMessage: "",

    vendorOptions: [
        { label: "ABC Trading LLC", value: "1" },
        { label: "XYZ Supplies", value: "2" },
    ],
    statusOptions: ["Draft", "Approved", "Closed"],
    receiptStatusOptions: [
        { label: "Pending", value: "pending" },
        { label: "Received", value: "received" },
    ],
    billStatusOptions: [
        { label: "Unbilled", value: "unbilled" },
        { label: "Billed", value: "billed" },
    ],

    handleSearch: vi.fn(),
    handleVendorChange: vi.fn(),
    handleStatusChange: vi.fn(),
    handleReceiptStatusChange: vi.fn(),
    handleBillStatusChange: vi.fn(),
    handleStartDateChange: vi.fn(),
    handleEndDateChange: vi.fn(),
    handleAddPurchaseOrder: vi.fn(),
};

const mockHook = (overrides = {}) => {
    usePurchaseOrders.mockReturnValue({ ...baseHookReturn, ...overrides });
};

const optionValues = (testId) =>
    Array.from(screen.getByTestId(testId).querySelectorAll("option")).map((o) => o.value);

describe("PurchaseOrders", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockHook();
    });

    // ---- Render ----

    it("renders header, stats cards, filter, table and pagination", () => {
        render(<PurchaseOrders />);

        expect(screen.getByRole("heading", { name: "Purchase Orders" })).toBeInTheDocument();
        expect(screen.getByTestId("stats-cards")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-filter")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });

    it("passes the title, breadcrumb and add button text to the header", () => {
        render(<PurchaseOrders />);

        expect(screen.getByRole("heading", { name: "Purchase Orders" })).toBeInTheDocument();
        expect(screen.getByTestId("breadcrumbs")).toHaveTextContent("Purchase Orders");
        expect(screen.getByText("+ ADD NEW PURCHASE ORDER")).toBeInTheDocument();
    });

    it("calls handleAddPurchaseOrder when the add button is clicked", async () => {
        const user = userEvent.setup();
        const handleAddPurchaseOrder = vi.fn();
        mockHook({ handleAddPurchaseOrder });

        render(<PurchaseOrders />);
        await user.click(screen.getByText("+ ADD NEW PURCHASE ORDER"));

        expect(handleAddPurchaseOrder).toHaveBeenCalledTimes(1);
    });

    // ---- Error banner ----

    it("does not show an error banner when errorMessage is empty", () => {
        render(<PurchaseOrders />);

        expect(screen.queryByText("Failed to load purchase orders")).not.toBeInTheDocument();
    });

    it("shows the error message when errorMessage is set", () => {
        mockHook({ errorMessage: "Failed to load purchase orders" });
        render(<PurchaseOrders />);

        expect(screen.getByText("Failed to load purchase orders")).toBeInTheDocument();
    });

    it("styles the error banner as an error", () => {
        mockHook({ errorMessage: "Something went wrong" });
        render(<PurchaseOrders />);

        expect(screen.getByText("Something went wrong")).toHaveStyle({
            color: "#B00020",
            background: "#FDEEEE",
        });
    });

    // ---- Stats cards ----

    it("renders the cards from the hook", () => {
        render(<PurchaseOrders />);

        const stats = within(screen.getByTestId("stats-cards"));
        expect(stats.getAllByTestId("stat-card")).toHaveLength(3);
        expect(stats.getByText("Total Purchase Orders").nextSibling).toHaveTextContent("38");
        expect(stats.getByText("Pending Receipt").nextSibling).toHaveTextContent("7");
        expect(stats.getByText("Pending Billing").nextSibling).toHaveTextContent("5");
    });

    it("passes dashboardLoading (not loading) to the stats cards", () => {
        mockHook({ dashboardLoading: true, loading: false });
        render(<PurchaseOrders />);

        expect(screen.getByTestId("stats-cards")).toHaveAttribute("data-loading", "true");
        expect(screen.getByTestId("reusable-table")).toHaveAttribute("data-loading", "false");
    });

    // ---- Date range ----

    it("shows the start and end dates from the hook", () => {
        mockHook({ startDate: "2026-01-01", endDate: "2026-01-31" });
        render(<PurchaseOrders />);

        expect(screen.getByLabelText("Start date")).toHaveValue("2026-01-01");
        expect(screen.getByLabelText("End date")).toHaveValue("2026-01-31");
    });

    it("limits the start date by the end date and vice versa", () => {
        mockHook({ startDate: "2026-01-01", endDate: "2026-01-31" });
        render(<PurchaseOrders />);

        expect(screen.getByLabelText("Start date")).toHaveAttribute("max", "2026-01-31");
        expect(screen.getByLabelText("End date")).toHaveAttribute("min", "2026-01-01");
    });

    it("has no min / max when the other date is empty", () => {
        render(<PurchaseOrders />);

        expect(screen.getByLabelText("Start date")).not.toHaveAttribute("max");
        expect(screen.getByLabelText("End date")).not.toHaveAttribute("min");
    });

    it("propagates date changes to the handlers", () => {
        const handleStartDateChange = vi.fn();
        const handleEndDateChange = vi.fn();
        mockHook({ handleStartDateChange, handleEndDateChange });

        render(<PurchaseOrders />);
        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2026-02-01" } });
        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2026-02-28" } });

        expect(handleStartDateChange).toHaveBeenCalledTimes(1);
        expect(handleEndDateChange).toHaveBeenCalledTimes(1);
    });

    // ---- Filters ----

    it("enables the search box and status filter with the right placeholder", () => {
        render(<PurchaseOrders />);

        const filter = screen.getByTestId("reusable-filter");
        expect(filter).toHaveAttribute("data-show-search", "true");
        expect(filter).toHaveAttribute("data-show-status", "true");
        expect(screen.getByPlaceholderText("Search PO number or vendor")).toBeInTheDocument();
    });

    it("shows the current search value", () => {
        mockHook({ search: "PO-0001" });
        render(<PurchaseOrders />);

        expect(screen.getByTestId("search-input")).toHaveValue("PO-0001");
    });

    it("propagates search input changes to handleSearch", () => {
        const handleSearch = vi.fn();
        mockHook({ handleSearch });

        render(<PurchaseOrders />);
        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "xyz" } });

        expect(handleSearch).toHaveBeenCalledWith("xyz");
    });

    it("propagates status changes to handleStatusChange", async () => {
        const user = userEvent.setup();
        const handleStatusChange = vi.fn();
        mockHook({ handleStatusChange });

        render(<PurchaseOrders />);
        await user.selectOptions(screen.getByTestId("status-select"), "Approved");

        expect(handleStatusChange).toHaveBeenCalledWith("Approved");
    });

    it("passes statusOptions as the status list", () => {
        render(<PurchaseOrders />);

        expect(optionValues("status-select")).toEqual(["", "Draft", "Approved", "Closed"]);
    });

    it("propagates vendor changes to handleVendorChange", async () => {
        const user = userEvent.setup();
        const handleVendorChange = vi.fn();
        mockHook({ handleVendorChange });

        render(<PurchaseOrders />);
        await user.selectOptions(screen.getByTestId("filter-vendor"), "2");

        expect(handleVendorChange).toHaveBeenCalledWith("2");
    });

    it("propagates receipt status changes to handleReceiptStatusChange", async () => {
        const user = userEvent.setup();
        const handleReceiptStatusChange = vi.fn();
        mockHook({ handleReceiptStatusChange });

        render(<PurchaseOrders />);
        await user.selectOptions(screen.getByTestId("filter-receiptStatus"), "received");

        expect(handleReceiptStatusChange).toHaveBeenCalledWith("received");
    });

    it("propagates bill status changes to handleBillStatusChange", async () => {
        const user = userEvent.setup();
        const handleBillStatusChange = vi.fn();
        mockHook({ handleBillStatusChange });

        render(<PurchaseOrders />);
        await user.selectOptions(screen.getByTestId("filter-billStatus"), "billed");

        expect(handleBillStatusChange).toHaveBeenCalledWith("billed");
    });

    it("renders the three dropdown filters with their placeholders and options", () => {
        render(<PurchaseOrders />);

        const placeholder = (testId) =>
            screen.getByTestId(testId).querySelector("option").textContent;

        expect(placeholder("filter-vendor")).toBe("All Vendors");
        expect(placeholder("filter-receiptStatus")).toBe("All Receipt Status");
        expect(placeholder("filter-billStatus")).toBe("All Bill Status");

        expect(optionValues("filter-vendor")).toEqual(["", "1", "2"]);
        expect(optionValues("filter-receiptStatus")).toEqual(["", "pending", "received"]);
        expect(optionValues("filter-billStatus")).toEqual(["", "unbilled", "billed"]);
    });

    it("shows the current filter values as selected", () => {
        mockHook({
            vendor: "1",
            status: "Draft",
            receiptStatus: "pending",
            billStatus: "billed",
        });
        render(<PurchaseOrders />);

        expect(screen.getByTestId("filter-vendor")).toHaveValue("1");
        expect(screen.getByTestId("status-select")).toHaveValue("Draft");
        expect(screen.getByTestId("filter-receiptStatus")).toHaveValue("pending");
        expect(screen.getByTestId("filter-billStatus")).toHaveValue("billed");
    });

    it("falls back to empty option lists when the hook returns no options", () => {
        mockHook({
            vendorOptions: undefined,
            statusOptions: undefined,
            receiptStatusOptions: undefined,
            billStatusOptions: undefined,
        });
        render(<PurchaseOrders />);

        expect(optionValues("filter-vendor")).toEqual([""]);
        expect(optionValues("status-select")).toEqual([""]);
        expect(optionValues("filter-receiptStatus")).toEqual([""]);
        expect(optionValues("filter-billStatus")).toEqual([""]);
    });

    // ---- Table ----

    it("passes the columns and rows to the table", () => {
        render(<PurchaseOrders />);

        expect(screen.getByTestId("table-headers")).toHaveTextContent("PO No,Vendor,Status");

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(2);
        expect(rows[0]).toHaveTextContent("PO-0001");
        expect(rows[1]).toHaveTextContent("PO-0002");
    });

    it("renders no rows when paginatedData is empty", () => {
        mockHook({ paginatedData: [] });
        render(<PurchaseOrders />);

        expect(screen.queryAllByTestId("table-row")).toHaveLength(0);
    });

    it("passes the loading flag to the table", () => {
        mockHook({ loading: true });
        render(<PurchaseOrders />);

        expect(screen.getByTestId("reusable-table")).toHaveAttribute("data-loading", "true");
    });

    // ---- Pagination ----

    it("passes page info and total records to the pagination", () => {
        mockHook({ currentPage: 2, totalPages: 4, totalItems: 38 });
        render(<PurchaseOrders />);

        expect(screen.getByTestId("page-info")).toHaveTextContent("2/4");
        expect(screen.getByTestId("total-records")).toHaveTextContent("38");
    });

    it("calls setCurrentPage when the page changes", async () => {
        const user = userEvent.setup();
        const setCurrentPage = vi.fn();
        mockHook({ setCurrentPage, currentPage: 2, totalPages: 5 });

        render(<PurchaseOrders />);
        await user.click(screen.getByText("next-page"));

        expect(setCurrentPage).toHaveBeenCalledWith(3);
    });
});