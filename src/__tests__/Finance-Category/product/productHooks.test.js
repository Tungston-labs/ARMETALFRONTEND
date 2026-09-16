import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { useProductList } from "../../../Pages/FinanceModule/PRODUCTS/ProductList/productHooks";

const { mockDispatch, mockUseSelector } = vi.hoisted(() => ({
    mockDispatch: vi.fn(),
    mockUseSelector: vi.fn(),
}));

vi.mock("react-redux", () => ({
    useDispatch: () => mockDispatch,
    useSelector: (selector) => mockUseSelector(selector),
}));

vi.mock("../../Redux/finance/ProductSlice", () => ({
    getProducts: vi.fn((params) => ({ type: "getProducts", payload: params })),
    selectProducts: (s) => s.product.products,
    selectProductPagination: (s) => s.product.pagination,
    selectProductLoading: (s) => s.product.loading,
    selectProductKPI: (s) => s.product.kpi,
}));

const baseState = {
    product: {
        products: [],
        pagination: { totalPages: 1 },
        loading: false,
        kpi: {},
    },
};

// Grab the mocked getProducts so we can inspect exactly what was passed to it.
import { getProducts } from "../../../Redux/finance/ProductSlice";

const lastDispatchedParams = () => {
    const call = mockDispatch.mock.calls.at(-1);
    return call[0].payload;
};

describe("useProductList", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockUseSelector.mockImplementation((selector) => selector(baseState));
    });

    it("fetches with only page/page_size on initial mount when no filters are set", () => {
        renderHook(() => useProductList());

        expect(getProducts).toHaveBeenCalledTimes(1);
        expect(lastDispatchedParams()).toEqual({ page: 1, page_size: 10 });
    });

    it("adds a trimmed search param and omits it when cleared", () => {
        const { result } = renderHook(() => useProductList());

        act(() => result.current.handleSearch("  cisco  "));
        expect(lastDispatchedParams()).toMatchObject({ search: "cisco" });

        act(() => result.current.handleSearch(""));
        expect(lastDispatchedParams()).not.toHaveProperty("search");
    });

    it("sends category as-is", () => {
        const { result } = renderHook(() => useProductList());

        act(() => result.current.handleCategory("1"));
        expect(lastDispatchedParams()).toMatchObject({ category: "1" });
    });

    it("lowercases status before sending it as 'status'", () => {
        const { result } = renderHook(() => useProductList());

        act(() => result.current.handleStatus("Active"));
        expect(lastDispatchedParams()).toMatchObject({ status: "active" });
    });

    it("maps 'type' to 'product_type' and lowercases it", () => {
        const { result } = renderHook(() => useProductList());

        act(() => result.current.handleType("Service"));
        expect(lastDispatchedParams()).toMatchObject({ product_type: "service" });
        expect(lastDispatchedParams()).not.toHaveProperty("type");
    });

    it("KNOWN GAP: stock_status is never sent to the backend yet", () => {
        const { result } = renderHook(() => useProductList());

        act(() => result.current.handleStockStatus("Out of Stock"));

        // Once the backend filter is built, flip this assertion to:
        // expect(lastDispatchedParams()).toMatchObject({ stock_status: "out_of_stock" });
        expect(lastDispatchedParams()).not.toHaveProperty("stock_status");
    });

    it("combines multiple active filters into a single request", () => {
        const { result } = renderHook(() => useProductList());

        act(() => {
            result.current.handleStatus("Active");
            result.current.handleType("Product");
            result.current.handleCategory("2");
        });

        expect(lastDispatchedParams()).toMatchObject({
            status: "active",
            product_type: "product",
            category: "2",
        });
    });

    it("resets to page 1 whenever a filter changes", () => {
        const { result } = renderHook(() => useProductList());

        act(() => result.current.handlePageChange(3));
        expect(lastDispatchedParams()).toMatchObject({ page: 3 });

        act(() => result.current.handleStatus("Inactive"));
        expect(lastDispatchedParams()).toMatchObject({ page: 1, status: "inactive" });
    });

    it("preserves active filters when only the page changes", () => {
        const { result } = renderHook(() => useProductList());

        act(() => result.current.handleCategory("5"));
        act(() => result.current.handlePageChange(2));

        expect(lastDispatchedParams()).toMatchObject({ page: 2, category: "5" });
    });
});