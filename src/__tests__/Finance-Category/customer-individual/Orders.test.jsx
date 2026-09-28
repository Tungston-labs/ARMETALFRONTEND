import React from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// --------------------------------------------------------------------
// GUESSED PATHS — confirm these with:
//   find src -iname "Orders.jsx"
//   find src -iname "ordersColumns*"
// and adjust every path below (import + vi.mock) to match exactly,
// the same way Usecustomeroverview.test.js needed fixing.
// --------------------------------------------------------------------
import Orders from "../../../Pages/FinanceModule/SALES/Customer/Orders/Orders";

// ---- Mock react-redux ----
const mockDispatch = vi.fn();
let mockSelectorState;

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selectorFn) => selectorFn(mockSelectorState),
}));

// ---- Mock react-router-dom useParams ----
let mockParams = { customerId: "1" };
vi.mock("react-router-dom", () => ({
  useParams: () => mockParams,
}));

// ---- Mock the thunks ----
vi.mock(
  "../../../Redux/finance/Sales/CustomerSlice",
  () => ({
    getCustomerOrders: vi.fn((args) => ({
      type: "customer/getCustomerOrders",
      payload: args,
    })),
    getCustomerOrdersSummary: vi.fn((customerId) => ({
      type: "customer/getCustomerOrdersSummary",
      payload: customerId,
    })),
  })
);

import {
  getCustomerOrders,
  getCustomerOrdersSummary,
} from "../../../Redux/finance/Sales/CustomerSlice";

// ---- Mock ordersColumns (contents don't matter for this test) ----
vi.mock("../../../Pages/FinanceModule/SALES/Customer/Orders/ordersColumns", () => ({
  ordersColumns: [{ accessor: "so_number" }, { accessor: "order_status" }],
}));

// ---- Mock child components to keep this a unit test of Orders only ----
vi.mock("../../../Components/ReusableTable/ReusableFilter", () => ({
  default: (props) => (
    <div data-testid="filter">
      <input
        data-testid="search-input"
        value={props.search || ""}
        onChange={(e) => props.onSearch(e.target.value)}
      />
    </div>
  ),
}));

vi.mock("../../../Components/ReusableTable/ReusableTable", () => ({
  default: (props) => (
    <div data-testid="table">
      Rows: {props.data?.length ?? 0} / Cols: {props.columns?.length ?? 0} /
      Loading: {String(props.loading)}
    </div>
  ),
}));

vi.mock("../../../Components/Pagination/ReusablePagination", () => ({
  default: (props) => (
    <div data-testid="pagination">
      <span>
        Page {props.currentPage} of {props.totalPages}
      </span>
      <button onClick={() => props.onPageChange(props.currentPage + 1)}>
        Next
      </button>
    </div>
  ),
}));

vi.mock("../../../Components/StatsCards/StatsCards", () => ({
  default: (props) => (
    <div data-testid="stats-cards">
      Cards: {props.cards?.length ?? 0} / Loading: {String(props.loading)}
    </div>
  ),
}));

// ---- Helpers ----
const setReduxState = (overrides = {}) => {
  mockSelectorState = {
    customer: {
      orders: [{ id: 6, so_number: "SO-0006" }],
      ordersTotalPages: 2,
      ordersLoading: false,
      ordersSummary: {
        total_orders: 6,
        open_orders: 6,
        completed_orders: 0,
        total_order_amount: 9765,
      },
      ordersSummaryLoading: false,
      ...overrides,
    },
  };
};

describe("<Orders />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockParams = { customerId: "1" };
    setReduxState();
  });

  // =====================================================
  // FETCHING — ORDERS LIST
  // =====================================================

  test("dispatches getCustomerOrders with customerId, page, and search on mount", () => {
    render(<Orders />);

    expect(getCustomerOrders).toHaveBeenCalledWith({
      customerId: "1",
      params: { page: 1, search: undefined },
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "customer/getCustomerOrders" })
    );
  });

  test("does not dispatch getCustomerOrders when there is no customerId", () => {
    mockParams = { customerId: undefined };

    render(<Orders />);

    expect(getCustomerOrders).not.toHaveBeenCalled();
  });

  test("re-fetches orders when the search value changes", () => {
    render(<Orders />);
    vi.clearAllMocks();

    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "SO-0002" },
    });

    expect(getCustomerOrders).toHaveBeenCalledWith({
      customerId: "1",
      params: { page: 1, search: "SO-0002" },
    });
  });

  test("resets to page 1 when a new search is entered", () => {
    render(<Orders />);

    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "SO-0002" },
    });

    expect(screen.getByTestId("pagination")).toHaveTextContent(
      "Page 1 of 2"
    );
  });

  test("re-fetches orders with the new page when pagination changes", () => {
    render(<Orders />);
    vi.clearAllMocks();

    fireEvent.click(screen.getByText("Next"));

    expect(getCustomerOrders).toHaveBeenCalledWith({
      customerId: "1",
      params: { page: 2, search: undefined },
    });
  });

  // =====================================================
  // FETCHING — ORDERS SUMMARY
  // =====================================================

  test("dispatches getCustomerOrdersSummary with customerId on mount", () => {
    render(<Orders />);

    expect(getCustomerOrdersSummary).toHaveBeenCalledWith("1");
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "customer/getCustomerOrdersSummary" })
    );
  });

  test("does not dispatch getCustomerOrdersSummary when there is no customerId", () => {
    mockParams = { customerId: undefined };

    render(<Orders />);

    expect(getCustomerOrdersSummary).not.toHaveBeenCalled();
  });

  test("does not re-fetch summary when only search or page changes", () => {
    render(<Orders />);
    vi.clearAllMocks();

    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "SO-0002" },
    });

    // Summary effect only depends on customerId, so it should not
    // fire again just because search changed.
    expect(getCustomerOrdersSummary).not.toHaveBeenCalled();
  });

  test("re-fetches summary when customerId changes", () => {
    const { rerender } = render(<Orders />);

    expect(getCustomerOrdersSummary).toHaveBeenCalledWith("1");

    mockParams = { customerId: "2" };
    rerender(<Orders />);

    expect(getCustomerOrdersSummary).toHaveBeenCalledWith("2");
  });

  // =====================================================
  // STATS CARDS
  // =====================================================

  test("renders 4 stat cards", () => {
    render(<Orders />);

    expect(screen.getByTestId("stats-cards")).toHaveTextContent("Cards: 4");
  });

  test("passes ordersSummaryLoading through to StatsCards", () => {
    setReduxState({ ordersSummaryLoading: true });

    render(<Orders />);

    expect(screen.getByTestId("stats-cards")).toHaveTextContent(
      "Loading: true"
    );
  });

  test("still renders 4 cards with fallback values when ordersSummary is null", () => {
    setReduxState({ ordersSummary: null });

    render(<Orders />);

    expect(screen.getByTestId("stats-cards")).toHaveTextContent("Cards: 4");
  });

  // =====================================================
  // TABLE
  // =====================================================

  test("renders the table with orders data and column count", () => {
    render(<Orders />);

    expect(screen.getByTestId("table")).toHaveTextContent(
      "Rows: 1 / Cols: 2 / Loading: false"
    );
  });

  test("passes ordersLoading through to the table", () => {
    setReduxState({ ordersLoading: true });

    render(<Orders />);

    expect(screen.getByTestId("table")).toHaveTextContent("Loading: true");
  });

  test("renders an empty table when orders is undefined", () => {
    setReduxState({ orders: undefined });

    render(<Orders />);

    expect(screen.getByTestId("table")).toHaveTextContent("Rows: 0");
  });

  // =====================================================
  // PAGINATION
  // =====================================================

  test("passes ordersTotalPages from redux state to pagination", () => {
    setReduxState({ ordersTotalPages: 9 });

    render(<Orders />);

    expect(screen.getByTestId("pagination")).toHaveTextContent(
      "Page 1 of 9"
    );
  });
});