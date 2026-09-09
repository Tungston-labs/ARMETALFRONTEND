import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

import CategoriesList from "../../Pages/FinanceModule/PRODUCTS/Categories/CategoriesList";
import { useCategoriesList } from "../../Pages/FinanceModule/PRODUCTS/Categories/useCategoriesList";

// ---- Mock child pieces that aren't the concern of this test ----
// Paths below are resolved relative to THIS test file
// (src/__tests__/Finance-Category/Categorieslist.test.jsx),
// and must point at the same real modules CategoriesList.jsx itself imports.

vi.mock("../../Pages/FinanceModule/Categories/useCategoriesList");

vi.mock("../../Pages/FinanceModule/Categories/modal/CategoryModal", () => ({
    default: ({ isOpen, onClose, onSave }) =>
        isOpen ? (
            <div data-testid="category-modal">
                <button onClick={onClose}>close-modal</button>
                <button onClick={() => onSave({ code: "X" })}>save-modal</button>
            </div>
        ) : null,
}));

vi.mock("../../Components/StatsCards/StatsCards", () => ({
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
    default: ({ data, loading }) => (
        <div data-testid="reusable-table" data-loading={String(loading)}>
            {data.map((row, i) => (
                <div key={row.id ?? i} data-testid="table-row">
                    {row.category_name}
                </div>
            ))}
        </div>
    ),
}));

vi.mock("../../Components/Pagination/ReusablePagination", () => ({
    default: ({ currentPage, totalPages, onPageChange }) => (
        <div data-testid="pagination">
            <span>
                {currentPage}/{totalPages}
            </span>
            <button onClick={() => onPageChange(currentPage + 1)}>next-page</button>
        </div>
    ),
}));

vi.mock("../../Components/ReusableTable/ReusableFilter", () => ({
    default: ({ search, onSearch, status, onStatus, rightButton }) => (
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
                <option value="active">active</option>
                <option value="inactive">inactive</option>
            </select>
            {rightButton}
        </div>
    ),
}));

vi.mock("../../Components/ReusableTable/ReusableHeader", () => ({
    default: ({ title, children }) => (
        <div data-testid="reusable-header">
            <h1>{title}</h1>
            {children}
        </div>
    ),
}));

const baseHookReturn = {
    parentCategories: [{ id: 1, category_name: "Electronics" }],
    filteredData: [
        { id: 1, category_name: "Phones" },
        { id: 2, category_name: "Laptops" },
    ],
    totalPages: 3,
    currentPage: 1,
    loading: false,
    error: null,
    search: "",
    status: "",
    showCategoryModal: false,
    handleAddCategory: vi.fn(),
    handleCloseCategoryModal: vi.fn(),
    handleSaveCategory: vi.fn(),
    handlePageChange: vi.fn(),
    handleSearchChange: vi.fn(),
    handleStatusChange: vi.fn(),
    categories: [{ id: 1, code: "ELEC", category_name: "Electronics" }],
    count: 10,
    activeCount: 7,
    inactiveCount: 3,
    productCount: 5,
};

const mockHook = (overrides = {}) => {
    useCategoriesList.mockReturnValue({ ...baseHookReturn, ...overrides });
};

describe("CategoriesList", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockHook();
    });

    it("renders the header, stats cards, filter, table and pagination", () => {
        render(<CategoriesList />);

        expect(screen.getByText("Categories")).toBeInTheDocument();
        expect(screen.getByTestId("stats-cards")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-filter")).toBeInTheDocument();
        expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });

    it("passes table rows through from filteredData", () => {
        render(<CategoriesList />);

        const rows = screen.getAllByTestId("table-row");
        expect(rows).toHaveLength(2);
        expect(rows[0]).toHaveTextContent("Phones");
        expect(rows[1]).toHaveTextContent("Laptops");
    });

    it("renders stat card counts from the hook", () => {
        render(<CategoriesList />);

        const cards = screen.getAllByTestId("stat-card");
        expect(cards).toHaveLength(5);
        expect(screen.getByText("Total Categories").nextSibling).toHaveTextContent("10");
        expect(screen.getByText("Active Categories").nextSibling).toHaveTextContent("7");
    });

    it("shows a string error message", () => {
        mockHook({ error: "Something went wrong" });
        render(<CategoriesList />);

        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("shows an object error's detail message, falling back to a default", () => {
        mockHook({ error: { detail: "Server exploded" } });
        render(<CategoriesList />);
        expect(screen.getByText("Server exploded")).toBeInTheDocument();
    });

    it("falls back to a generic error message when detail is missing", () => {
        mockHook({ error: {} });
        render(<CategoriesList />);
        expect(screen.getByText(/failed to load categories/i)).toBeInTheDocument();
    });

    it("does not render an error block when there is no error", () => {
        render(<CategoriesList />);
        expect(screen.queryByText(/failed to load categories/i)).not.toBeInTheDocument();
    });

    it("opens the modal via handleAddCategory when '+ ADD CATEGORY' is clicked", async () => {
        const user = userEvent.setup();
        const handleAddCategory = vi.fn();
        mockHook({ handleAddCategory });

        render(<CategoriesList />);
        await user.click(screen.getByText(/\+ add category/i));

        expect(handleAddCategory).toHaveBeenCalledTimes(1);
    });

    it("renders the CategoryModal when showCategoryModal is true", () => {
        mockHook({ showCategoryModal: true });
        render(<CategoriesList />);

        expect(screen.getByTestId("category-modal")).toBeInTheDocument();
    });

    it("does not render the CategoryModal when showCategoryModal is false", () => {
        render(<CategoriesList />);
        expect(screen.queryByTestId("category-modal")).not.toBeInTheDocument();
    });

    it("wires up close and save handlers on the modal", async () => {
        const user = userEvent.setup();
        const handleCloseCategoryModal = vi.fn();
        const handleSaveCategory = vi.fn();
        mockHook({
            showCategoryModal: true,
            handleCloseCategoryModal,
            handleSaveCategory,
        });

        render(<CategoriesList />);

        await user.click(screen.getByText("close-modal"));
        expect(handleCloseCategoryModal).toHaveBeenCalledTimes(1);

        await user.click(screen.getByText("save-modal"));
        expect(handleSaveCategory).toHaveBeenCalledTimes(1);
        expect(handleSaveCategory).toHaveBeenCalledWith({ code: "X" });
    });

    it("propagates search input changes to handleSearchChange", () => {
        const handleSearchChange = vi.fn();
        mockHook({ handleSearchChange });

        render(<CategoriesList />);
        fireEvent.change(screen.getByTestId("search-input"), {
            target: { value: "phones" },
        });

        expect(handleSearchChange).toHaveBeenCalledWith("phones");
    });

    it("propagates status filter changes to handleStatusChange", () => {
        const handleStatusChange = vi.fn();
        mockHook({ handleStatusChange });

        render(<CategoriesList />);
        fireEvent.change(screen.getByTestId("status-select"), {
            target: { value: "active" },
        });

        expect(handleStatusChange).toHaveBeenCalledWith("active");
    });

    it("propagates page changes to handlePageChange", async () => {
        const user = userEvent.setup();
        const handlePageChange = vi.fn();
        mockHook({ handlePageChange, currentPage: 2, totalPages: 5 });

        render(<CategoriesList />);
        await user.click(screen.getByText("next-page"));

        expect(handlePageChange).toHaveBeenCalledWith(3);
    });

    it("passes the loading flag down to the stats cards and table", () => {
        mockHook({ loading: true });
        render(<CategoriesList />);

        expect(screen.getByTestId("stats-cards")).toHaveAttribute("data-loading", "true");
        expect(screen.getByTestId("reusable-table")).toHaveAttribute("data-loading", "true");
    });
});