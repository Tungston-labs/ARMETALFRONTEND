import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { useCustomerList } from "../../../Pages/FinanceModule/SALES/Customer/Usecustomerlist ";

// ---- react-redux: the hook reads customer state via useSelector and
// dispatches thunks directly, so both are faked here.
const { mockDispatch, mockUseSelector } = vi.hoisted(() => ({
    mockDispatch: vi.fn(),
    mockUseSelector: vi.fn(),
}));

vi.mock("react-redux", () => ({
    useDispatch: () => mockDispatch,
    useSelector: (selector) => mockUseSelector(selector),
}));

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));

vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

vi.mock("../../../Redux/finance/CustomerSlice", () => ({
        getCustomers: vi.fn((params) => ({ type: "getCustomers", payload: params })),
    getCustomerById: vi.fn((id) => ({ type: "getCustomerById", payload: id })),
    addCustomer: vi.fn((data) => ({ type: "addCustomer", payload: data })),
    editCustomer: vi.fn((data) => ({ type: "editCustomer", payload: data })),
    removeCustomer: vi.fn((id) => ({ type: "removeCustomer", payload: id })),
}));

const baseCustomerState = {
    customers: [
        {
            id: 1,
            customer_name: "Acme Corp",
            credit_limit: "1000",
            total_invoices: "3",
            payments_received: "500",
            balance: "200",
        },
        {
            id: 2,
            customer_name: "Globex Ltd",
            credit_limit: "2000",
            total_invoices: "1",
            payments_received: "0",
            balance: "800",
        },
    ],
    totalPages: 4,
    totalItems: 37,
    currentPage: 1,
    loading: false,
    selectedCustomer: null,
};

const mockState = (overrides = {}) => {
    const state = { customer: { ...baseCustomerState, ...overrides } };
    mockUseSelector.mockImplementation((selector) => selector(state));
};

describe("useCustomerList", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        mockState();
    });

    afterEach(() => {
        act(() => {
            vi.runOnlyPendingTimers();
        });
        vi.useRealTimers();
    });

    // ---- Selector wiring ----

    it("exposes customers, totalPages, currentPage, loading and selectedCustomer from state", () => {
        const { result } = renderHook(() => useCustomerList());

        expect(result.current.customers).toEqual(baseCustomerState.customers);
        expect(result.current.totalPages).toBe(4);
        expect(result.current.currentPage).toBe(1);
        expect(result.current.loading).toBe(false);
        expect(result.current.selectedCustomer).toBeNull();
    });

    it("exposes totalItems from state as totalRecords", () => {
        mockState({ totalItems: 97 });
        const { result } = renderHook(() => useCustomerList());

        expect(result.current.totalRecords).toBe(97);
    });

    // ---- Debounced fetch ----

    it("dispatches getCustomers 300ms after mount with trimmed search and default page", () => {
        renderHook(() => useCustomerList());

        expect(mockDispatch).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "getCustomers",
                payload: { search: "", page: 1, page_size: 10 },
            })
        );
    });

    it("debounces repeated search changes into a single dispatch", () => {
        const { result } = renderHook(() => useCustomerList());

        act(() => {
            result.current.setSearch("a");
        });
        act(() => {
            vi.advanceTimersByTime(100);
        });
        act(() => {
            result.current.setSearch("ac");
        });
        act(() => {
            vi.advanceTimersByTime(100);
        });
        act(() => {
            result.current.setSearch("acme");
        });

        // still inside the debounce window — nothing dispatched yet
        expect(mockDispatch).not.toHaveBeenCalled();

        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "getCustomers",
                payload: { search: "acme", page: 1, page_size: 10 },
            })
        );
    });

    it("trims whitespace from the search term before dispatching", () => {
        const { result } = renderHook(() => useCustomerList());

        act(() => {
            result.current.setSearch("  acme  ");
        });
        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                payload: expect.objectContaining({ search: "acme" }),
            })
        );
    });

    it("re-fetches when the page changes", () => {
        const { result } = renderHook(() => useCustomerList());

        act(() => {
            vi.advanceTimersByTime(300);
        });
        mockDispatch.mockClear();

        act(() => {
            result.current.setPage(2);
        });
        act(() => {
            vi.advanceTimersByTime(300);
        });

        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                payload: expect.objectContaining({ page: 2 }),
            })
        );
    });

    // ---- Stats cards ----

    it("builds 5 stat cards from the customers list", () => {
        const { result } = renderHook(() => useCustomerList());

        expect(result.current.cards).toHaveLength(5);
        expect(result.current.cards.map((c) => c.title)).toEqual([
            "Total Customers",
            "Active Customers",
            "New Customers (MAY)",
            "Inactive Customers",
            "Payments Received",
        ]);
    });

    it("counts total customers as the length of the customers array", () => {
        const { result } = renderHook(() => useCustomerList());

        const card = result.current.cards.find((c) => c.title === "Total Customers");
        expect(card.count).toBe(2);
    });

    it("sums credit_limit across customers and formats it as currency", () => {
        const { result } = renderHook(() => useCustomerList());

        // 1000 + 2000 = 3000
        const card = result.current.cards.find((c) => c.title === "Active Customers");
        expect(card.count).toBe("SAR 3,000");
    });

    it("sums total_invoices across customers", () => {
        const { result } = renderHook(() => useCustomerList());

        // 3 + 1 = 4
        const card = result.current.cards.find(
            (c) => c.title === "New Customers (MAY)"
        );
        expect(card.count).toBe(4);
    });

    it("sums payments_received and formats it as currency", () => {
        const { result } = renderHook(() => useCustomerList());

        // 500 + 0 = 500
        const card = result.current.cards.find(
            (c) => c.title === "Inactive Customers"
        );
        expect(card.count).toBe("SAR 500");
    });

    it("sums balance and formats it as currency", () => {
        const { result } = renderHook(() => useCustomerList());

        // 200 + 800 = 1000
        const card = result.current.cards.find(
            (c) => c.title === "Payments Received"
        );
        expect(card.count).toBe("SAR 1,000");
    });

    it("handles an empty customers list without crashing the stats", () => {
        mockState({ customers: [] });
        const { result } = renderHook(() => useCustomerList());

        expect(result.current.cards.find((c) => c.title === "Total Customers").count).toBe(0);
        expect(
            result.current.cards.find((c) => c.title === "Active Customers").count
        ).toBe("SAR 0");
    });

    // ---- Add / edit modal state ----

    it("opens the modal in add mode with no editing customer", () => {
        const { result } = renderHook(() => useCustomerList());

        act(() => {
            result.current.handleAddCustomer();
        });

        expect(result.current.isCustomerModalOpen).toBe(true);
        expect(result.current.modalMode).toBe("add");
        expect(result.current.editingCustomer).toBeNull();
    });

    it("opens the modal in edit mode and fetches the customer by id", () => {
        const { result } = renderHook(() => useCustomerList());
        const customer = { id: 5, customer_name: "Initech" };

        act(() => {
            result.current.handleEditCustomer(customer);
        });

        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({ type: "getCustomerById", payload: 5 })
        );
        expect(result.current.modalMode).toBe("edit");
        expect(result.current.editingCustomer).toEqual(customer);
        expect(result.current.isCustomerModalOpen).toBe(true);
    });

    it("opens the modal in view mode via handleViewCustomer", () => {
        const { result } = renderHook(() => useCustomerList());
        const customer = { id: 8, customer_name: "Soylent" };

        act(() => {
            result.current.handleViewCustomer(customer);
        });

        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({ type: "getCustomerById", payload: 8 })
        );
        expect(result.current.modalMode).toBe("view");
        expect(result.current.editingCustomer).toEqual(customer);
    });

    it("resets modal state on close", () => {
        const { result } = renderHook(() => useCustomerList());

        act(() => {
            result.current.handleEditCustomer({ id: 5, customer_name: "Initech" });
        });
        act(() => {
            result.current.handleCloseCustomerModal();
        });

        expect(result.current.isCustomerModalOpen).toBe(false);
        expect(result.current.editingCustomer).toBeNull();
    });

    // ---- Save (add vs edit) ----

    it("dispatches addCustomer, closes the modal, and refetches on a successful add", async () => {
        mockDispatch.mockImplementation((action) => {
            if (action?.type === "addCustomer") return Promise.resolve({ payload: action.payload });
            return Promise.resolve({ type: action.type });
        });

        const { result } = renderHook(() => useCustomerList());

        act(() => {
            result.current.handleAddCustomer();
        });

        await act(async () => {
            await result.current.handleSaveCustomer({ customer_name: "New Co" });
        });

        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({ type: "addCustomer" })
        );
        expect(result.current.isCustomerModalOpen).toBe(false);
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({ type: "getCustomers" })
        );
    });

    it("dispatches editCustomer (not addCustomer) with the editing id on a successful edit", async () => {
        mockDispatch.mockImplementation((action) => Promise.resolve({ type: action.type }));

        const { result } = renderHook(() => useCustomerList());

        act(() => {
            result.current.handleEditCustomer({ id: 5, customer_name: "Initech" });
        });

        await act(async () => {
            await result.current.handleSaveCustomer({ customer_name: "Initech Renamed" });
        });

        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({
                type: "editCustomer",
                payload: { id: 5, customerData: { customer_name: "Initech Renamed" } },
            })
        );
        expect(mockDispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({ type: "addCustomer" })
        );
        expect(result.current.isCustomerModalOpen).toBe(false);
    });

    it("keeps the modal open and does not refetch when the save fails", async () => {
        mockDispatch.mockImplementation((action) => {
            if (action?.type === "addCustomer") {
                return Promise.resolve({ error: { message: "boom" } });
            }
            return Promise.resolve({ type: action.type });
        });

        const { result } = renderHook(() => useCustomerList());

        act(() => {
            result.current.handleAddCustomer();
        });

        await act(async () => {
            await result.current.handleSaveCustomer({ customer_name: "New Co" });
        });

        expect(result.current.isCustomerModalOpen).toBe(true);
        expect(mockDispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({ type: "getCustomers" })
        );
    });

    // ---- Delete ----

    it("does nothing when deleting a customer without an id", () => {
        const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
        const { result } = renderHook(() => useCustomerList());

        act(() => {
            result.current.handleDeleteCustomer({ customer_name: "No Id Co" });
        });

        expect(confirmSpy).not.toHaveBeenCalled();
        expect(mockDispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({ type: "removeCustomer" })
        );
        confirmSpy.mockRestore();
    });

    it("asks for confirmation before dispatching removeCustomer", () => {
        const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
        const { result } = renderHook(() => useCustomerList());

        act(() => {
            result.current.handleDeleteCustomer({ id: 3, customer_name: "Delete Me" });
        });

        expect(confirmSpy).toHaveBeenCalledWith(
            "Are you sure you want to delete Delete Me?"
        );
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({ type: "removeCustomer", payload: 3 })
        );
        confirmSpy.mockRestore();
    });

    it("does not dispatch removeCustomer when the confirmation is cancelled", () => {
        const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
        const { result } = renderHook(() => useCustomerList());

        act(() => {
            result.current.handleDeleteCustomer({ id: 3, customer_name: "Delete Me" });
        });

        expect(mockDispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({ type: "removeCustomer" })
        );
        confirmSpy.mockRestore();
    });

    // ---- Navigation handlers ----

    it("navigates to the invoices route for a customer", () => {
        const { result } = renderHook(() => useCustomerList());

        act(() => {
            result.current.handleCreateInvoice({ id: 9 });
        });

        expect(mockNavigate).toHaveBeenCalledWith("9/invoices");
    });

    it("navigates to the ledger route for a customer", () => {
        const { result } = renderHook(() => useCustomerList());

        act(() => {
            result.current.handleViewLedger({ id: 9 });
        });

        expect(mockNavigate).toHaveBeenCalledWith("9/ledger");
    });

    it("navigates to the overview route for a customer", () => {
        const { result } = renderHook(() => useCustomerList());

        act(() => {
            result.current.handleViewOverview({ id: 9 });
        });

        expect(mockNavigate).toHaveBeenCalledWith("9/overview");
    });

    it("does not navigate when the customer has no id", () => {
        const { result } = renderHook(() => useCustomerList());

        act(() => {
            result.current.handleCreateInvoice({});
            result.current.handleViewLedger({});
            result.current.handleViewOverview({});
        });

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    // ---- Date range / export ----

    it("updates startDate and resets the page to 1", () => {
        const { result } = renderHook(() => useCustomerList());

        act(() => {
            result.current.setPage(3);
        });
        act(() => {
            result.current.handleStartDateChange({ target: { value: "2026-01-01" } });
        });

        expect(result.current.startDate).toBe("2026-01-01");
        expect(result.current.page).toBe(1);
    });

    it("updates endDate and resets the page to 1", () => {
        const { result } = renderHook(() => useCustomerList());

        act(() => {
            result.current.setPage(3);
        });
        act(() => {
            result.current.handleEndDateChange({ target: { value: "2026-01-31" } });
        });

        expect(result.current.endDate).toBe("2026-01-31");
        expect(result.current.page).toBe(1);
    });

    it("logs export details without dispatching or navigating", () => {
        const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
        const { result } = renderHook(() => useCustomerList());

        act(() => {
            result.current.setSearch("acme");
        });
        act(() => {
            result.current.handleExport();
        });

        expect(logSpy).toHaveBeenCalledWith(
            "Export Customer List",
            expect.objectContaining({ search: "acme" })
        );
        expect(mockNavigate).not.toHaveBeenCalled();
        logSpy.mockRestore();
    });

    // ---- Actions menu ----

    it("toggles the open menu id on and off for the same row", () => {
        const { result } = renderHook(() => useCustomerList());

        act(() => {
            result.current.toggleActionsMenu(4);
        });
        expect(result.current.openMenuId).toBe(4);

        act(() => {
            result.current.toggleActionsMenu(4);
        });
        expect(result.current.openMenuId).toBeNull();
    });

    it("switches the open menu id when a different row is toggled", () => {
        const { result } = renderHook(() => useCustomerList());

        act(() => {
            result.current.toggleActionsMenu(4);
        });
        act(() => {
            result.current.toggleActionsMenu(7);
        });

        expect(result.current.openMenuId).toBe(7);
    });

    it("closes the open menu on an outside click", () => {
        const { result } = renderHook(() => useCustomerList());

        act(() => {
            result.current.toggleActionsMenu(4);
        });
        expect(result.current.openMenuId).toBe(4);

        act(() => {
            document.body.dispatchEvent(
                new MouseEvent("mousedown", { bubbles: true })
            );
        });

        expect(result.current.openMenuId).toBeNull();
    });

    it("keeps the menu open on a click inside a data-menu-root element", () => {
        const { result } = renderHook(() => useCustomerList());

        const menuRoot = document.createElement("div");
        menuRoot.setAttribute("data-menu-root", "");
        document.body.appendChild(menuRoot);

        act(() => {
            result.current.toggleActionsMenu(4);
        });

        act(() => {
            menuRoot.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
        });

        expect(result.current.openMenuId).toBe(4);

        document.body.removeChild(menuRoot);
    });
});