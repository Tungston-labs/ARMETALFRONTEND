import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

import CustomerList from "../../../Pages/FinanceModule/SALES/Customer/CustomerList";
import { useCustomerList } from "../../../Pages/FinanceModule/SALES/Customer/Usecustomerlist ";

// NOTE: the hook file is literally named "Usecustomerlist " (trailing space).
// The mock path below must match that byte-for-byte or the mock silently misses.

// ---- CustomerList keeps everything behind one hook (like CategoriesList),
// so there is no redux wiring to fake here — every handler comes from the hook.
vi.mock("../../../Pages/FinanceModule/SALES/Customer/Usecustomerlist ");

vi.mock("../../../Pages/FinanceModule/SALES/Customer/Customerlist.columns", () => ({
    // Pass the handlers straight through so the fake table below can invoke them.
    getCustomerColumns: (handlers) => handlers,
}));

vi.mock("../../../Pages/FinanceModule/SALES/Customer/CustomerList.styles", () => ({
    ExportButton: ({ children, ...props }) => (
        <button data-testid="export-button" {...props}>
            {children}
        </button>
    ),
    DateRangeWrapper: ({ children }) => <div data-testid="date-range">{children}</div>,
    DatePickerContainer: ({ children }) => <div>{children}</div>,
    DateInput: (props) => <input {...props} />,
    DateSeparator: ({ children }) => <span>{children}</span>,
}));

vi.mock("../../../Pages/FinanceModule/SALES/Customer/modal/CustomerModal", () => ({
    default: ({ isOpen, onClose, onSave, mode, customer }) =>
        isOpen ? (
            <div
                data-testid="customer-modal"
                data-mode={mode}
                data-customer-id={customer?.id ?? ""}
            >
                <span>{customer?.customer_name}</span>
                <button onClick={onClose}>close-customer-modal</button>
                <button onClick={() => onSave({ customer_name: "New Customer" })}>
                    save-customer-modal
                </button>
            </div>
        ) : null,
}));

vi.mock("../../../Components/StatsCards/StatsCards", () => ({
    default: ({ cards = [], loading }) => (
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

vi.mock("../../../Components/ReusableTable/ReusableTable", () => ({
    default: ({ data = [], loading, columns }) => (
        <div data-testid="reusable-table" data-loading={String(loading)}>
            {data.map((row) => (
                <div key={row.id} data-testid="table-row">
                    <span>{row.customer_name}</span>
                    <button onClick={() => columns.toggleActionsMenu(row.id)}>
                        actions-{row.id}
                    </button>
                    <button onClick={() => columns.handleViewOverview(row)}>
                        overview-{row.id}
                    </button>
                    <button onClick={() => columns.handleCreateInvoice(row)}>
                        invoice-{row.id}
                    </button>
                    <button onClick={() => columns.handleViewLedger(row)}>
                        ledger-{row.id}
                    </button>
                    <button onClick={() => columns.handleEditCustomer(row)}>
                        edit-{row.id}
                    </button>
                    <button onClick={() => columns.handleDeleteCustomer(row)}>
                        delete-{row.id}
                    </button>
                    <span data-testid={`open-menu-${row.id}`}>{String(columns.openMenuId)}</span>
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
        </div>
    ),
}));

vi.mock("../../../Components/ReusableTable/ReusableFilter", () => ({
    default: ({ search, onSearch, showSearch, searchPlaceholder }) => (
        <div data-testid="reusable-filter">
            {showSearch ? (
                <input
                    data-testid="search-input"
                    placeholder={searchPlaceholder}
                    value={search}
                    onChange={(e) => onSearch(e.target.value)}
                />
            ) : null}
        </div>
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

const baseHookReturn = {
    customers: [
        { id: 1, customer_name: "Acme Corp" },
        { id: 2, customer_name: "Globex Ltd" },
    ],
    totalPages: 4,
    loading: false,
    selectedCustomer: null,
    cards: [
        { title: "Total Customers", count: 42 },
        { title: "Active Customers", count: 30 },
        { title: "Inactive Customers", count: 12 },
        { title: "Outstanding", count: 8 },
    ],

    openMenuId: null,
    toggleActionsMenu: vi.fn(),
    handleCreateInvoice: vi.fn(),
    handleViewLedger: vi.fn(),
    handleViewOverview: vi.fn(),

    search: "",
    setSearch: vi.fn(),
    page: 1,
    setPage: vi.fn(),
    startDate: "",
    endDate: "",

    isCustomerModalOpen: false,
    modalMode: "add",
    editingCustomer: null,

    handleAddCustomer: vi.fn(),
    handleEditCustomer: vi.fn(),
    handleDeleteCustomer: vi.fn(),
    handleSaveCustomer: vi.fn(),
    handleCloseCustomerModal: vi.fn(),
    handleExport: vi.fn(),
    handleStartDateChange: vi.fn(),
    handleEndDateChange: vi.fn(),
};

const mockHook = (overrides = {}) => {
    useCustomerList.mockReturnValue({ ...baseHookReturn, ...overrides });
};

const getDateInputs = () => ({
    start: screen.getByLabelText("Start date"),
    end: screen.getByLabelText("End date"),
});

describe("CustomerList", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockHook();
    });

    // ---- Structure ----

    it("renders header, stats cards, filter, table and pagination", () => {
        render(<CustomerList />);

        expect(screen.getByText("Customer List")).toBeInTheDocument();
        expect(screen.getByTestId("stats-cards")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-filter")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });

    it("renders the Sales / Customer breadcrumbs", () => {
        render(<CustomerList />);

        expect(screen.getByTestId("breadcrumbs")).toHaveTextContent("Sales / Customer");
    });

    it("renders the export button and date range inside the header", () => {
        render(<CustomerList />);

        const actions = within(screen.getByTestId("header-actions"));
        expect(actions.getByTestId("export-button")).toBeInTheDocument();
        expect(actions.getByTestId("date-range")).toBeInTheDocument();
    });

    it("renders every stat card supplied by the hook", () => {
        render(<CustomerList />);

        const statsCards = within(screen.getByTestId("stats-cards"));
        expect(statsCards.getAllByTestId("stat-card")).toHaveLength(4);
        expect(statsCards.getByText("Total Customers").nextSibling).toHaveTextContent("42");
        expect(statsCards.getByText("Active Customers").nextSibling).toHaveTextContent("30");
        expect(statsCards.getByText("Inactive Customers").nextSibling).toHaveTextContent("12");
        expect(statsCards.getByText("Outstanding").nextSibling).toHaveTextContent("8");
    });

    it("passes table rows through from the hook's customers", () => {
        render(<CustomerList />);

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(2);
        expect(rows[0]).toHaveTextContent("Acme Corp");
        expect(rows[1]).toHaveTextContent("Globex Ltd");
    });

    it("renders an empty table without crashing when customers is undefined", () => {
        mockHook({ customers: [], totalPages: 0 });
        render(<CustomerList />);

        expect(screen.queryAllByTestId("table-row")).toHaveLength(0);
        expect(screen.getByTestId("pagination")).toHaveAttribute("data-total-records", "0");
    });

    it("passes the loading flag down to stats cards and table", () => {
        mockHook({ loading: true });
        render(<CustomerList />);

        expect(screen.getByTestId("stats-cards")).toHaveAttribute("data-loading", "true");
        expect(screen.getByTestId("reusable-table")).toHaveAttribute("data-loading", "true");
    });

    // ---- Search / pagination ----

    it("propagates search input changes to setSearch and resets the page", () => {
        const setSearch = vi.fn();
        const setPage = vi.fn();
        mockHook({ setSearch, setPage });

        render(<CustomerList />);
        fireEvent.change(screen.getByTestId("search-input"), {
            target: { value: "acme" },
        });

        expect(setSearch).toHaveBeenCalledWith("acme");
        expect(setPage).toHaveBeenCalledWith(1);
    });

    it("renders the search placeholder from the component", () => {
        render(<CustomerList />);

        expect(screen.getByPlaceholderText("Search Customer")).toBeInTheDocument();
    });

    it("propagates page changes to setPage", async () => {
        const user = userEvent.setup();
        const setPage = vi.fn();
        mockHook({ setPage, page: 2, totalPages: 5 });

        render(<CustomerList />);
        await user.click(screen.getByText("next-page"));

        expect(setPage).toHaveBeenCalledWith(3);
    });

    it("passes the current page and total pages to the pagination component", () => {
        mockHook({ page: 3, totalPages: 7 });
        render(<CustomerList />);

        expect(screen.getByTestId("pagination")).toHaveTextContent("3/7");
    });

    // ---- Export + date range ----

    it("calls handleExport when the export button is clicked", async () => {
        const user = userEvent.setup();
        const handleExport = vi.fn();
        mockHook({ handleExport });

        render(<CustomerList />);
        await user.click(screen.getByTestId("export-button"));

        expect(handleExport).toHaveBeenCalledTimes(1);
    });

    it("propagates start and end date changes to their handlers", () => {
        const handleStartDateChange = vi.fn();
        const handleEndDateChange = vi.fn();
        mockHook({ handleStartDateChange, handleEndDateChange });

        render(<CustomerList />);
        const { start, end } = getDateInputs();

        fireEvent.change(start, { target: { value: "2026-01-01" } });
        fireEvent.change(end, { target: { value: "2026-01-31" } });

        expect(handleStartDateChange).toHaveBeenCalled();
        expect(handleEndDateChange).toHaveBeenCalled();
    });

    it("bounds the date inputs against each other", () => {
        mockHook({ startDate: "2026-01-01", endDate: "2026-01-31" });
        render(<CustomerList />);

        const { start, end } = getDateInputs();
        expect(start).toHaveValue("2026-01-01");
        expect(start).toHaveAttribute("max", "2026-01-31");
        expect(end).toHaveValue("2026-01-31");
        expect(end).toHaveAttribute("min", "2026-01-01");
    });

    it("leaves the min/max bounds off while the range is empty", () => {
        render(<CustomerList />);

        const { start, end } = getDateInputs();
        expect(start).not.toHaveAttribute("max");
        expect(end).not.toHaveAttribute("min");
    });

    // ---- Row actions wired through the columns factory ----

    it("passes the row action handlers into getCustomerColumns", async () => {
        const user = userEvent.setup();
        const handleViewOverview = vi.fn();
        const handleCreateInvoice = vi.fn();
        const handleViewLedger = vi.fn();
        mockHook({ handleViewOverview, handleCreateInvoice, handleViewLedger });

        render(<CustomerList />);
        await user.click(screen.getByText("overview-1"));
        await user.click(screen.getByText("invoice-1"));
        await user.click(screen.getByText("ledger-2"));

        expect(handleViewOverview).toHaveBeenCalledWith(
            expect.objectContaining({ id: 1 })
        );
        expect(handleCreateInvoice).toHaveBeenCalledWith(
            expect.objectContaining({ id: 1 })
        );
        expect(handleViewLedger).toHaveBeenCalledWith(
            expect.objectContaining({ id: 2 })
        );
    });

    it("forwards toggleActionsMenu and the current openMenuId to the columns", async () => {
        const user = userEvent.setup();
        const toggleActionsMenu = vi.fn();
        mockHook({ toggleActionsMenu, openMenuId: 2 });

        render(<CustomerList />);
        await user.click(screen.getByText("actions-1"));

        expect(toggleActionsMenu).toHaveBeenCalledWith(1);
        expect(screen.getByTestId("open-menu-1")).toHaveTextContent("2");
    });

    it("forwards edit and delete row actions to the hook", async () => {
        const user = userEvent.setup();
        const handleEditCustomer = vi.fn();
        const handleDeleteCustomer = vi.fn();
        mockHook({ handleEditCustomer, handleDeleteCustomer });

        render(<CustomerList />);
        await user.click(screen.getByText("edit-1"));
        await user.click(screen.getByText("delete-2"));

        expect(handleEditCustomer).toHaveBeenCalledWith(
            expect.objectContaining({ id: 1, customer_name: "Acme Corp" })
        );
        expect(handleDeleteCustomer).toHaveBeenCalledWith(
            expect.objectContaining({ id: 2, customer_name: "Globex Ltd" })
        );
    });

    // ---- Modal wiring ----

    it("keeps the customer modal closed by default", () => {
        render(<CustomerList />);

        expect(screen.queryByTestId("customer-modal")).not.toBeInTheDocument();
    });

    it("calls handleAddCustomer when the NEW CUSTOMER header button is clicked", async () => {
        const user = userEvent.setup();
        const handleAddCustomer = vi.fn();
        mockHook({ handleAddCustomer });

        render(<CustomerList />);
        await user.click(screen.getByText("+ NEW CUSTOMER"));

        expect(handleAddCustomer).toHaveBeenCalledTimes(1);
    });

    it("renders the modal in add mode when the hook opens it", () => {
        mockHook({ isCustomerModalOpen: true, modalMode: "add" });
        render(<CustomerList />);

        expect(screen.getByTestId("customer-modal")).toHaveAttribute("data-mode", "add");
    });

    it("renders the modal in edit mode with the editing customer", () => {
        mockHook({
            isCustomerModalOpen: true,
            modalMode: "edit",
            editingCustomer: { id: 7, customer_name: "Initech" },
        });
        render(<CustomerList />);

        const modal = screen.getByTestId("customer-modal");
        expect(modal).toHaveAttribute("data-mode", "edit");
        expect(modal).toHaveAttribute("data-customer-id", "7");
        expect(within(modal).getByText("Initech")).toBeInTheDocument();
    });

    it("prefers selectedCustomer over editingCustomer when both are set", () => {
        mockHook({
            isCustomerModalOpen: true,
            modalMode: "view",
            selectedCustomer: { id: 5, customer_name: "Selected Co" },
            editingCustomer: { id: 9, customer_name: "Editing Co" },
        });
        render(<CustomerList />);

        const modal = screen.getByTestId("customer-modal");
        expect(modal).toHaveAttribute("data-customer-id", "5");
        expect(within(modal).getByText("Selected Co")).toBeInTheDocument();
        expect(within(modal).queryByText("Editing Co")).not.toBeInTheDocument();
    });

    it("calls handleSaveCustomer with the modal payload", async () => {
        const user = userEvent.setup();
        const handleSaveCustomer = vi.fn();
        mockHook({ isCustomerModalOpen: true, handleSaveCustomer });

        render(<CustomerList />);
        await user.click(screen.getByText("save-customer-modal"));

        expect(handleSaveCustomer).toHaveBeenCalledWith({ customer_name: "New Customer" });
    });

    it("calls handleCloseCustomerModal when the modal closes", async () => {
        const user = userEvent.setup();
        const handleCloseCustomerModal = vi.fn();
        mockHook({ isCustomerModalOpen: true, handleCloseCustomerModal });

        render(<CustomerList />);
        await user.click(screen.getByText("close-customer-modal"));

        expect(handleCloseCustomerModal).toHaveBeenCalledTimes(1);
    });

    // ---- Guard: pagination currently reports the page size, not the dataset size ----

    it("REGRESSION: totalRecords should be the full record count, not customers.length", () => {
        mockHook({
            customers: [{ id: 1, customer_name: "Acme Corp" }],
            totalPages: 10,
            totalRecords: 97,
        });

        render(<CustomerList />);

        // CustomerList.jsx passes `customers?.length || 0`, so this reads "1" —
        // the count of rows on the current page — and the footer will say
        // "1 record" on a 97-record list. Expose totalRecords from the hook and
        // pass it through to fix.
        expect(screen.getByTestId("pagination")).toHaveAttribute("data-total-records", "97");
    });
});