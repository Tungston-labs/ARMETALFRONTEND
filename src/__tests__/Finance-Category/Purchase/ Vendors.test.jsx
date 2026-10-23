import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

// Paths assume the component lives in
//   src/Pages/FinanceModule/PURCHASES/Vendors/
// and this test in src/__tests__/Finance-Category/Purchase/.
// Every vi.mock() path must resolve to the same file as its import.
import Vendors from "../../../Pages/FinanceModule/PURCHASES/Vendors/Vendors";
import useVendors from "../../../Pages/FinanceModule/PURCHASES/Vendors/Usevendors";
import { formatApiError } from "../../../Pages/FinanceModule/PURCHASES/Vendors/Vendorpayload";

// ---- Vendors is a thin view over the useVendors hook, so the hook is
// mocked and every child component is replaced by a small fake that exposes
// the props it receives.

vi.mock("../../../Pages/FinanceModule/PURCHASES/Vendors/Usevendors");

vi.mock("../../../Pages/FinanceModule/PURCHASES/Vendors/Vendorpayload", () => ({
    formatApiError: vi.fn((e) => `formatted: ${typeof e === "string" ? e : e?.message}`),
}));

vi.mock("../../../Pages/FinanceModule/PURCHASES/Vendors/Vendors.styles", () => ({
    DateInput: (props) => <input {...props} />,
    DatePickerContainer: ({ children }) => <div>{children}</div>,
    DateRangeWrapper: ({ children }) => <div>{children}</div>,
    DateSeparator: ({ children }) => <span>{children}</span>,
}));

vi.mock("../../../Pages/FinanceModule/PURCHASES/Vendors/modal/AddVendorModal", () => ({
    default: ({ isOpen, vendor, onClose, onSave, saving, error }) => (
        <div
            data-testid="add-vendor-modal"
            data-open={String(!!isOpen)}
            data-saving={String(!!saving)}
            data-vendor={vendor ? vendor.vendor_name : ""}
            data-error={error ? String(error) : ""}
        >
            <button onClick={onClose}>close-modal</button>
            <button onClick={() => onSave({ vendor_name: "New Vendor" })}>save-modal</button>
        </div>
    ),
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
    default: ({ columns, data, loading, onRowClick }) => (
        <div data-testid="reusable-table" data-loading={String(loading)}>
            <div data-testid="table-headers">{columns.map((c) => c.header).join(",")}</div>
            {data.map((row) => (
                <div key={row.id} data-testid="table-row">
                    <span>{row.vendor_name}</span>
                    <button onClick={() => onRowClick(row)}>open-{row.id}</button>
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
    status: "",
    vendorType: "",
    paymentTerm: "",
    startDate: "",
    endDate: "",

    isVendorModalOpen: false,
    editingVendor: null,
    currentPage: 1,
    totalPages: 3,
    totalItems: 24,
    setCurrentPage: vi.fn(),

    cards: [
        { title: "Total Vendors", count: 24 },
        { title: "Active Vendors", count: 20 },
        { title: "Inactive Vendors", count: 4 },
    ],
    columns: [{ header: "Vendor" }, { header: "Type" }, { header: "Status" }],
    paginatedData: [
        { id: 1, vendor_name: "ABC Trading LLC" },
        { id: 2, vendor_name: "XYZ Supplies" },
    ],

    loading: false,
    isSaving: false,
    dashboardLoading: false,
    error: null,

    statusOptions: ["Active", "Inactive"],
    vendorTypeOptions: [
        { label: "Supplier", value: "supplier" },
        { label: "Contractor", value: "contractor" },
    ],
    paymentTermOptions: [
        { label: "Net 30", value: "net_30" },
        { label: "Net 60", value: "net_60" },
    ],

    handleSearch: vi.fn(),
    handleStatusChange: vi.fn(),
    handleVendorType: vi.fn(),
    handlePaymentTerm: vi.fn(),
    handleStartDateChange: vi.fn(),
    handleEndDateChange: vi.fn(),
    handleAddVendor: vi.fn(),
    handleCloseVendor: vi.fn(),
    handleSaveVendor: vi.fn(),
    handleViewVendor: vi.fn(),
};

const mockHook = (overrides = {}) => {
    useVendors.mockReturnValue({ ...baseHookReturn, ...overrides });
};

const optionValues = (testId) =>
    Array.from(screen.getByTestId(testId).querySelectorAll("option")).map((o) => o.value);

describe("Vendors", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockHook();
    });

    // ---- Render ----

    it("renders header, stats cards, filter, table, pagination and modal", () => {
        render(<Vendors />);

        expect(screen.getByRole("heading", { name: "Vendors" })).toBeInTheDocument();
        expect(screen.getByTestId("stats-cards")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-filter")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
        expect(screen.getByTestId("add-vendor-modal")).toBeInTheDocument();
    });

    it("passes the title, breadcrumb and add button text to the header", () => {
        render(<Vendors />);

        expect(screen.getByTestId("breadcrumbs")).toHaveTextContent("Vendors");
        expect(screen.getByText("+ ADD NEW VENDOR")).toBeInTheDocument();
    });

    it("calls handleAddVendor when the add button is clicked", async () => {
        const user = userEvent.setup();
        const handleAddVendor = vi.fn();
        mockHook({ handleAddVendor });

        render(<Vendors />);
        await user.click(screen.getByText("+ ADD NEW VENDOR"));

        expect(handleAddVendor).toHaveBeenCalledTimes(1);
    });

    // ---- Page-level error banner ----

    it("does not show an error banner when there is no error", () => {
        render(<Vendors />);

        expect(screen.queryByText(/^formatted:/)).not.toBeInTheDocument();
        expect(formatApiError).not.toHaveBeenCalled();
    });

    it("shows the formatted error when there is an error and the modal is closed", () => {
        mockHook({ error: "Network error", isVendorModalOpen: false });
        render(<Vendors />);

        expect(formatApiError).toHaveBeenCalledWith("Network error");
        expect(screen.getByText("formatted: Network error")).toBeInTheDocument();
    });

    it("styles the error banner as an error", () => {
        mockHook({ error: "Network error" });
        render(<Vendors />);

        expect(screen.getByText("formatted: Network error")).toHaveStyle({
            color: "#B00020",
            background: "#FDEEEE",
        });
    });

    it("hides the page-level banner while the modal is open", () => {
        mockHook({ error: "Network error", isVendorModalOpen: true });
        render(<Vendors />);

        expect(screen.queryByText("formatted: Network error")).not.toBeInTheDocument();
    });

    it("always passes the error down to the modal", () => {
        mockHook({ error: "Network error", isVendorModalOpen: true });
        render(<Vendors />);

        expect(screen.getByTestId("add-vendor-modal")).toHaveAttribute(
            "data-error",
            "Network error"
        );
    });

    // ---- Stats cards ----

    it("renders the cards from the hook", () => {
        render(<Vendors />);

        const stats = within(screen.getByTestId("stats-cards"));
        expect(stats.getAllByTestId("stat-card")).toHaveLength(3);
        expect(stats.getByText("Total Vendors").nextSibling).toHaveTextContent("24");
        expect(stats.getByText("Active Vendors").nextSibling).toHaveTextContent("20");
        expect(stats.getByText("Inactive Vendors").nextSibling).toHaveTextContent("4");
    });

    it("passes dashboardLoading (not loading) to the stats cards", () => {
        mockHook({ dashboardLoading: true, loading: false });
        render(<Vendors />);

        expect(screen.getByTestId("stats-cards")).toHaveAttribute("data-loading", "true");
        expect(screen.getByTestId("reusable-table")).toHaveAttribute("data-loading", "false");
    });

    // ---- Date range ----

    it("shows the start and end dates from the hook", () => {
        mockHook({ startDate: "2026-01-01", endDate: "2026-01-31" });
        render(<Vendors />);

        expect(screen.getByLabelText("Start date")).toHaveValue("2026-01-01");
        expect(screen.getByLabelText("End date")).toHaveValue("2026-01-31");
    });

    it("limits the start date by the end date and vice versa", () => {
        mockHook({ startDate: "2026-01-01", endDate: "2026-01-31" });
        render(<Vendors />);

        expect(screen.getByLabelText("Start date")).toHaveAttribute("max", "2026-01-31");
        expect(screen.getByLabelText("End date")).toHaveAttribute("min", "2026-01-01");
    });

    it("has no min / max when the other date is empty", () => {
        render(<Vendors />);

        expect(screen.getByLabelText("Start date")).not.toHaveAttribute("max");
        expect(screen.getByLabelText("End date")).not.toHaveAttribute("min");
    });

    it("propagates date changes to the handlers", () => {
        const handleStartDateChange = vi.fn();
        const handleEndDateChange = vi.fn();
        mockHook({ handleStartDateChange, handleEndDateChange });

        render(<Vendors />);
        fireEvent.change(screen.getByLabelText("Start date"), { target: { value: "2026-02-01" } });
        fireEvent.change(screen.getByLabelText("End date"), { target: { value: "2026-02-28" } });

        expect(handleStartDateChange).toHaveBeenCalledTimes(1);
        expect(handleEndDateChange).toHaveBeenCalledTimes(1);
    });

    // ---- Filters ----

    it("enables the search box and status filter with the right placeholder", () => {
        render(<Vendors />);

        const filter = screen.getByTestId("reusable-filter");
        expect(filter).toHaveAttribute("data-show-search", "true");
        expect(filter).toHaveAttribute("data-show-status", "true");
        expect(screen.getByPlaceholderText("Search Vendor")).toBeInTheDocument();
    });

    it("shows the current search value", () => {
        mockHook({ search: "abc" });
        render(<Vendors />);

        expect(screen.getByTestId("search-input")).toHaveValue("abc");
    });

    it("propagates search input changes to handleSearch", () => {
        const handleSearch = vi.fn();
        mockHook({ handleSearch });

        render(<Vendors />);
        fireEvent.change(screen.getByTestId("search-input"), { target: { value: "xyz" } });

        expect(handleSearch).toHaveBeenCalledWith("xyz");
    });

    it("propagates status changes to handleStatusChange", async () => {
        const user = userEvent.setup();
        const handleStatusChange = vi.fn();
        mockHook({ handleStatusChange });

        render(<Vendors />);
        await user.selectOptions(screen.getByTestId("status-select"), "Active");

        expect(handleStatusChange).toHaveBeenCalledWith("Active");
    });

    it("passes statusOptions as the status list", () => {
        render(<Vendors />);

        expect(optionValues("status-select")).toEqual(["", "Active", "Inactive"]);
    });

    it("propagates vendor type changes to handleVendorType", async () => {
        const user = userEvent.setup();
        const handleVendorType = vi.fn();
        mockHook({ handleVendorType });

        render(<Vendors />);
        await user.selectOptions(screen.getByTestId("filter-vendorType"), "contractor");

        expect(handleVendorType).toHaveBeenCalledWith("contractor");
    });

    it("propagates payment term changes to handlePaymentTerm", async () => {
        const user = userEvent.setup();
        const handlePaymentTerm = vi.fn();
        mockHook({ handlePaymentTerm });

        render(<Vendors />);
        await user.selectOptions(screen.getByTestId("filter-paymentTerm"), "net_60");

        expect(handlePaymentTerm).toHaveBeenCalledWith("net_60");
    });

    it("renders the two dropdown filters with their placeholders and options", () => {
        render(<Vendors />);

        const placeholder = (testId) =>
            screen.getByTestId(testId).querySelector("option").textContent;

        expect(placeholder("filter-vendorType")).toBe("All Vendor Types");
        expect(placeholder("filter-paymentTerm")).toBe("All Payment Terms");

        expect(optionValues("filter-vendorType")).toEqual(["", "supplier", "contractor"]);
        expect(optionValues("filter-paymentTerm")).toEqual(["", "net_30", "net_60"]);
    });

    it("shows the current filter values as selected", () => {
        mockHook({ status: "Inactive", vendorType: "supplier", paymentTerm: "net_30" });
        render(<Vendors />);

        expect(screen.getByTestId("status-select")).toHaveValue("Inactive");
        expect(screen.getByTestId("filter-vendorType")).toHaveValue("supplier");
        expect(screen.getByTestId("filter-paymentTerm")).toHaveValue("net_30");
    });

    // ---- Table ----

    it("passes the columns and rows to the table", () => {
        render(<Vendors />);

        expect(screen.getByTestId("table-headers")).toHaveTextContent("Vendor,Type,Status");

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(2);
        expect(rows[0]).toHaveTextContent("ABC Trading LLC");
        expect(rows[1]).toHaveTextContent("XYZ Supplies");
    });

    it("renders no rows when paginatedData is empty", () => {
        mockHook({ paginatedData: [] });
        render(<Vendors />);

        expect(screen.queryAllByTestId("table-row")).toHaveLength(0);
    });

    it("passes the loading flag to the table", () => {
        mockHook({ loading: true });
        render(<Vendors />);

        expect(screen.getByTestId("reusable-table")).toHaveAttribute("data-loading", "true");
    });

    it("calls handleViewVendor with the clicked row", async () => {
        const user = userEvent.setup();
        const handleViewVendor = vi.fn();
        mockHook({ handleViewVendor });

        render(<Vendors />);
        await user.click(screen.getByText("open-2"));

        expect(handleViewVendor).toHaveBeenCalledWith({ id: 2, vendor_name: "XYZ Supplies" });
    });

    // ---- Pagination ----

    it("passes page info and total records to the pagination", () => {
        mockHook({ currentPage: 2, totalPages: 3, totalItems: 24 });
        render(<Vendors />);

        expect(screen.getByTestId("page-info")).toHaveTextContent("2/3");
        expect(screen.getByTestId("total-records")).toHaveTextContent("24");
    });

    it("calls setCurrentPage when the page changes", async () => {
        const user = userEvent.setup();
        const setCurrentPage = vi.fn();
        mockHook({ setCurrentPage, currentPage: 2, totalPages: 5 });

        render(<Vendors />);
        await user.click(screen.getByText("next-page"));

        expect(setCurrentPage).toHaveBeenCalledWith(3);
    });

    // ---- Add / edit vendor modal ----

    it("passes isOpen=false to the modal by default", () => {
        render(<Vendors />);

        expect(screen.getByTestId("add-vendor-modal")).toHaveAttribute("data-open", "false");
    });

    it("passes isOpen=true to the modal when isVendorModalOpen is set", () => {
        mockHook({ isVendorModalOpen: true });
        render(<Vendors />);

        expect(screen.getByTestId("add-vendor-modal")).toHaveAttribute("data-open", "true");
    });

    it("passes the editing vendor to the modal", () => {
        mockHook({
            isVendorModalOpen: true,
            editingVendor: { id: 1, vendor_name: "ABC Trading LLC" },
        });
        render(<Vendors />);

        expect(screen.getByTestId("add-vendor-modal")).toHaveAttribute(
            "data-vendor",
            "ABC Trading LLC"
        );
    });

    it("passes no vendor to the modal when adding a new one", () => {
        mockHook({ isVendorModalOpen: true, editingVendor: null });
        render(<Vendors />);

        expect(screen.getByTestId("add-vendor-modal")).toHaveAttribute("data-vendor", "");
    });

    it("passes the saving flag to the modal", () => {
        mockHook({ isVendorModalOpen: true, isSaving: true });
        render(<Vendors />);

        expect(screen.getByTestId("add-vendor-modal")).toHaveAttribute("data-saving", "true");
    });

    it("calls handleCloseVendor when the modal is closed", async () => {
        const user = userEvent.setup();
        const handleCloseVendor = vi.fn();
        mockHook({ isVendorModalOpen: true, handleCloseVendor });

        render(<Vendors />);
        await user.click(screen.getByText("close-modal"));

        expect(handleCloseVendor).toHaveBeenCalledTimes(1);
    });

    it("calls handleSaveVendor with the modal's payload on save", async () => {
        const user = userEvent.setup();
        const handleSaveVendor = vi.fn();
        mockHook({ isVendorModalOpen: true, handleSaveVendor });

        render(<Vendors />);
        await user.click(screen.getByText("save-modal"));

        expect(handleSaveVendor).toHaveBeenCalledWith({ vendor_name: "New Vendor" });
    });
});