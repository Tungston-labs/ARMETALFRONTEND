import React from "react";
import { render, screen, fireEvent,within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

import ProductList from "../../Pages/FinanceModule/PRODUCTS/ProductList/ProductList";
import { useProductList } from "../../Pages/FinanceModule/PRODUCTS/ProductList/productHooks";

// ---- react-redux: ProductList reads createLoading/updateLoading/deleteLoading
// and categoryOptions via useSelector directly, and dispatches actions itself
// (unlike CategoriesList, which hides all of that behind one hook).
const { mockDispatch, mockUseSelector } = vi.hoisted(() => ({
    mockDispatch: vi.fn(),
    mockUseSelector: vi.fn(),
}));

vi.mock("react-redux", () => ({
    useDispatch: () => mockDispatch,
    useSelector: (selector) => mockUseSelector(selector),
}));

vi.mock("../../Pages/FinanceModule/PRODUCTS/ProductList/productHooks");

vi.mock("../../Redux/finance/ProductSlice", () => ({
    addProduct: vi.fn((data) => ({ type: "addProduct", payload: data })),
    editProduct: vi.fn((data) => ({ type: "editProduct", payload: data })),
    removeProduct: vi.fn((id) => ({ type: "removeProduct", payload: id })),
    getProducts: vi.fn((params) => ({ type: "getProducts", payload: params })),
    selectProductCreateLoading: (s) => s.product.createLoading,
    selectProductUpdateLoading: (s) => s.product.updateLoading,
    selectProductDeleteLoading: (s) => s.product.deleteLoading,
}));

vi.mock("../../Redux/finance/categorySlice", () => ({
    getCategories: vi.fn((params) => ({ type: "getCategories", payload: params })),
}));

vi.mock("../../Pages/FinanceModule/PRODUCTS/ProductList/columns.jsx", () => ({
    // Pass onEdit/onDelete straight through so the fake table below can call them.
    getProductColumns: ({ onEdit, onDelete }) => ({ onEdit, onDelete }),
}));

vi.mock("../../Pages/FinanceModule/PRODUCTS/ProductList/modal/AddProductModal", () => ({
    default: ({ isOpen, onClose, onSave, mode, loading }) =>
        isOpen ? (
            <div data-testid="add-product-modal" data-mode={mode} data-loading={String(loading)}>
                <button onClick={onClose}>close-add-modal</button>
                <button onClick={() => onSave({ product_name: "New Router" })}>save-add-modal</button>
            </div>
        ) : null,
}));

vi.mock("../../Pages/FinanceModule/PRODUCTS/ProductList/modal/DeleteConfirmModal", () => ({
    default: ({ isOpen, message, onCancel, onConfirm, loading }) =>
        isOpen ? (
            <div data-testid="delete-confirm-modal" data-loading={String(loading)}>
                <span>{message}</span>
                <button onClick={onCancel}>cancel-delete</button>
                <button onClick={onConfirm}>confirm-delete</button>
            </div>
        ) : null,
}));

vi.mock("../../Components/StatsCards/StatsCards.jsx", () => ({
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

vi.mock("../../Components/ReusableTable/ReusableTable", () => ({
    default: ({ data, loading, columns }) => (
        <div data-testid="reusable-table" data-loading={String(loading)}>
            {data.map((row) => (
                <div key={row.id} data-testid="table-row">
                    <span>{row.product_name}</span>
                    <button onClick={() => columns.onEdit(row)}>edit-{row.id}</button>
                    <button onClick={() => columns.onDelete(row)}>delete-{row.id}</button>
                </div>
            ))}
        </div>
    ),
}));

vi.mock("../../Components/Pagination/ReusablePagination", () => ({
    default: ({ currentPage, totalPages, onPageChange }) => (
        <div data-testid="pagination">
            <span>{currentPage}/{totalPages}</span>
            <button onClick={() => onPageChange(currentPage + 1)}>next-page</button>
        </div>
    ),
}));

vi.mock("../../Components/ReusableTable/ReusableFilter", () => ({
    default: ({ search, onSearch, status, onStatus, filters = [] }) => (
        <div data-testid="reusable-filter">
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
                <option value="">all</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
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

vi.mock("../../Components/ReusableTable/ReusableHeader", () => ({
    default: ({ title, buttonText, onButtonClick }) => (
        <div data-testid="reusable-header">
            <h1>{title}</h1>
            <button onClick={onButtonClick}>{buttonText}</button>
        </div>
    ),
}));

const baseHookReturn = {
    search: "",
    category: "",
    status: "",
    type: "",
    stockStatus: "",
    currentPage: 1,
    paginatedData: [
        { id: 1, product_name: "Cisco Router C9300" },
        { id: 2, product_name: "Managed IT Support" },
    ],
    totalPages: 4,
    loading: false,
    kpi: {
        total_products: 20,
        active_products: 15,
        inactive_products: 5,
        out_of_stock: 2,
        total_categories: 6,
    },
    handleSearch: vi.fn(),
    handleCategory: vi.fn(),
    handleStatus: vi.fn(),
    handleType: vi.fn(),
    handleStockStatus: vi.fn(),
    handlePageChange: vi.fn(),
    loadProducts: vi.fn(),
};

const baseState = {
    product: { createLoading: false, updateLoading: false, deleteLoading: false },
    category: { categories: [{ id: 1, category_name: "Networking" }] },
};

const mockHook = (overrides = {}) => {
    useProductList.mockReturnValue({ ...baseHookReturn, ...overrides });
};

const mockState = (overrides = {}) => {
    const state = { ...baseState, ...overrides };
    mockUseSelector.mockImplementation((selector) => selector(state));
};

describe("ProductList", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockHook();
        mockState();
    });

    it("renders header, stats cards, filter, table and pagination", () => {
        render(<ProductList />);

        expect(screen.getByText("Product List")).toBeInTheDocument();
        expect(screen.getByTestId("stats-cards")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-filter")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });

    it("dispatches getCategories on mount", () => {
        render(<ProductList />);

        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({ type: "getCategories" })
        );
    });

   it("renders all 5 stat cards from the hook's kpi", () => {
    render(<ProductList />);

    const statsCards = within(screen.getByTestId("stats-cards"));
    const cards = statsCards.getAllByTestId("stat-card");
    expect(cards).toHaveLength(5);

    expect(statsCards.getByText("Total Products").nextSibling).toHaveTextContent("20");
    expect(statsCards.getByText("Active Products").nextSibling).toHaveTextContent("15");
    expect(statsCards.getByText("Inactive Products").nextSibling).toHaveTextContent("5");
    expect(statsCards.getByText("Out of Stock").nextSibling).toHaveTextContent("2");
    expect(statsCards.getByText("Total Categories").nextSibling).toHaveTextContent("6");
});

    it("passes table rows through from paginatedData", () => {
        render(<ProductList />);

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(2);
        expect(rows[0]).toHaveTextContent("Cisco Router C9300");
        expect(rows[1]).toHaveTextContent("Managed IT Support");
    });

    // ---- Filter propagation: this is the part that was actually broken ----

    it("propagates search input changes to handleSearch", () => {
        const handleSearch = vi.fn();
        mockHook({ handleSearch });

        render(<ProductList />);
        fireEvent.change(screen.getByTestId("search-input"), {
            target: { value: "router" },
        });

        expect(handleSearch).toHaveBeenCalledWith("router");
    });

    it("propagates status filter changes to handleStatus", () => {
        const handleStatus = vi.fn();
        mockHook({ handleStatus });

        render(<ProductList />);
        fireEvent.change(screen.getByTestId("status-select"), {
            target: { value: "Active" },
        });

        expect(handleStatus).toHaveBeenCalledWith("Active");
    });

    it("propagates category filter changes to handleCategory", () => {
        const handleCategory = vi.fn();
        mockHook({ handleCategory });

        render(<ProductList />);
        fireEvent.change(screen.getByTestId("filter-category"), {
            target: { value: "1" },
        });

        expect(handleCategory).toHaveBeenCalledWith("1");
    });

    it("propagates type filter changes to handleType", () => {
        const handleType = vi.fn();
        mockHook({ handleType });

        render(<ProductList />);
        fireEvent.change(screen.getByTestId("filter-type"), {
            target: { value: "Service" },
        });

        expect(handleType).toHaveBeenCalledWith("Service");
    });

    it("propagates stock status filter changes to handleStockStatus", () => {
        const handleStockStatus = vi.fn();
        mockHook({ handleStockStatus });

        render(<ProductList />);
        fireEvent.change(screen.getByTestId("filter-stockStatus"), {
            target: { value: "Low Stock" },
        });

        expect(handleStockStatus).toHaveBeenCalledWith("Low Stock");
    });

    it("propagates page changes to handlePageChange", async () => {
        const user = userEvent.setup();
        const handlePageChange = vi.fn();
        mockHook({ handlePageChange, currentPage: 2, totalPages: 5 });

        render(<ProductList />);
        await user.click(screen.getByText("next-page"));

        expect(handlePageChange).toHaveBeenCalledWith(3);
    });

    it("passes the loading flag down to stats cards and table", () => {
        mockHook({ loading: true });
        render(<ProductList />);

        expect(screen.getByTestId("stats-cards")).toHaveAttribute("data-loading", "true");
        expect(screen.getByTestId("reusable-table")).toHaveAttribute("data-loading", "true");
    });

    // ---- Add / edit modal wiring ----

    it("opens the Add modal in 'add' mode when the header button is clicked", async () => {
        const user = userEvent.setup();
        render(<ProductList />);

        await user.click(screen.getByText("ADD NEW PRODUCT"));

        const modal = screen.getByTestId("add-product-modal");
        expect(modal).toBeInTheDocument();
        expect(modal).toHaveAttribute("data-mode", "add");
    });

    it("opens the Add modal in 'edit' mode with the row's data when Edit is clicked", async () => {
        const user = userEvent.setup();
        render(<ProductList />);

        await user.click(screen.getByText("edit-1"));

        const modal = screen.getByTestId("add-product-modal");
        expect(modal).toBeInTheDocument();
        expect(modal).toHaveAttribute("data-mode", "edit");
    });

    it("dispatches addProduct then refreshes the list when saving in add mode", async () => {
        const user = userEvent.setup();
        mockDispatch.mockReturnValue({ unwrap: vi.fn().mockResolvedValue({ id: 99 }) });

        render(<ProductList />);
        await user.click(screen.getByText("ADD NEW PRODUCT"));
        await user.click(screen.getByText("save-add-modal"));

        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({ type: "addProduct" })
        );
        // modal should close after a successful save
        expect(screen.queryByTestId("add-product-modal")).not.toBeInTheDocument();
    });

    it("dispatches editProduct (not addProduct) when saving in edit mode", async () => {
        const user = userEvent.setup();
        mockDispatch.mockReturnValue({ unwrap: vi.fn().mockResolvedValue({ id: 1 }) });

        render(<ProductList />);
        await user.click(screen.getByText("edit-1"));
        await user.click(screen.getByText("save-add-modal"));

        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({ type: "editProduct" })
        );
    });

    it("does not close the modal or refresh the list if the save fails", async () => {
        const user = userEvent.setup();
        mockDispatch.mockReturnValue({ unwrap: vi.fn().mockRejectedValue(new Error("boom")) });
        const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

        render(<ProductList />);
        await user.click(screen.getByText("ADD NEW PRODUCT"));
        await user.click(screen.getByText("save-add-modal"));

        expect(screen.getByTestId("add-product-modal")).toBeInTheDocument();
        consoleSpy.mockRestore();
    });

    // ---- Delete modal wiring ----

   it("opens the delete confirm modal with the product's name in the message", async () => {
    const user = userEvent.setup();
    render(<ProductList />);

    await user.click(screen.getByText("delete-1"));

    const modal = screen.getByTestId("delete-confirm-modal");
    expect(modal).toBeInTheDocument();
    expect(within(modal).getByText(/cisco router c9300/i)).toBeInTheDocument();
});

    it("closes the delete modal without dispatching when cancelled", async () => {
        const user = userEvent.setup();
        render(<ProductList />);

        await user.click(screen.getByText("delete-1"));
        await user.click(screen.getByText("cancel-delete"));

        expect(screen.queryByTestId("delete-confirm-modal")).not.toBeInTheDocument();
        expect(mockDispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({ type: "removeProduct" })
        );
    });

    it("dispatches removeProduct and closes the modal on confirm", async () => {
        const user = userEvent.setup();
        mockDispatch.mockReturnValue({ unwrap: vi.fn().mockResolvedValue(1) });

        render(<ProductList />);
        await user.click(screen.getByText("delete-1"));
        await user.click(screen.getByText("confirm-delete"));

        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({ type: "removeProduct", payload: 1 })
        );
        expect(screen.queryByTestId("delete-confirm-modal")).not.toBeInTheDocument();
    });

    // ---- Regression guard for the bug we found in refreshList ----

    it("REGRESSION: refresh after save should reuse the hook's filtered loadProducts, not an unfiltered getProducts call", async () => {
        const user = userEvent.setup();
        const loadProducts = vi.fn();
        mockHook({ status: "Active", category: "1", loadProducts });
        mockDispatch.mockReturnValue({ unwrap: vi.fn().mockResolvedValue({ id: 99 }) });

        render(<ProductList />);
        await user.click(screen.getByText("ADD NEW PRODUCT"));
        await user.click(screen.getByText("save-add-modal"));

        // This will fail against the current ProductList.jsx, which calls
        // dispatch(getProducts({ page, page_size, search })) directly inside
        // refreshList and drops category/status/type/stockStatus entirely.
        // Wire refreshList to call the hook's loadProducts() to fix it.
        expect(loadProducts).toHaveBeenCalled();
    });
});