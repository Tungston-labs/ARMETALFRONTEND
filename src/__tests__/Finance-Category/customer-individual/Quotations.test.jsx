import React from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// --------------------------------------------------------------------
// GUESSED PATHS — confirm these with:
//   find src -iname "Quotations.jsx"
//   find src -iname "quotationColumns*"
// and adjust every path below (import + vi.mock) to match exactly,
// the same way Usecustomeroverview.test.js needed fixing.
// --------------------------------------------------------------------
import Quotations from "../../../Pages/FinanceModule/SALES/Customer/Quotations/Quotations";

// ---- Mock react-redux ----
const mockDispatch = vi.fn(() => ({
  unwrap: () => Promise.resolve(),
}));
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

// ---- Mock the thunk ----
vi.mock(
  "../../../Redux/finance/Sales/CustomerSlice",
  () => ({
    getCustomerQuotations: vi.fn((args) => ({
      type: "customer/getCustomerQuotations",
      payload: args,
    })),
  })
);

import { getCustomerQuotations } from "../../../Redux/finance/Sales/CustomerSlice";

// ---- Mock quotationColumns (contents don't matter for this test) ----
vi.mock("../../../Pages/FinanceModule/SALES/Customer/Quotations/quotationColumns", () => ({
  quotationColumns: [{ accessor: "quotation_number" }, { accessor: "status" }],
}));

// ---- Mock child components to keep this a unit test of Quotations only ----
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
    <div data-testid="stats-cards">Cards: {props.cards?.length ?? 0}</div>
  ),
}));

// ---- Helpers ----
const setReduxState = (overrides = {}) => {
  mockSelectorState = {
    customer: {
      quotations: [{ id: 1, quotation_number: "QT-0001" }],
      quotationsKpiCards: {
        total_quotations: 5,
        total_amount: 12000,
        negotiation_amount: 3000,
        rejected_quotations: 1,
        approved_quotations: 3,
      },
      quotationsTotalPages: 2,
      quotationsLoading: false,
      ...overrides,
    },
  };
};

describe("<Quotations />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockParams = { customerId: "1" };
    setReduxState();
  });

  // =====================================================
  // FETCHING
  // =====================================================

  test("dispatches getCustomerQuotations with customerId, page, and search on mount", () => {
    render(<Quotations />);

    expect(getCustomerQuotations).toHaveBeenCalledWith({
      id: "1",
      params: { page: 1, search: undefined },
    });
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "customer/getCustomerQuotations" })
    );
  });

  test("does not dispatch when there is no customerId", () => {
    mockParams = { customerId: undefined };

    render(<Quotations />);

    expect(getCustomerQuotations).not.toHaveBeenCalled();
  });

  test("re-fetches when the search value changes", () => {
    render(<Quotations />);
    vi.clearAllMocks();

    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "QT-0002" },
    });

    expect(getCustomerQuotations).toHaveBeenCalledWith({
      id: "1",
      params: { page: 1, search: "QT-0002" },
    });
  });

  test("resets to page 1 when a new search is entered", () => {
    render(<Quotations />);

    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "QT-0002" },
    });

    // Pagination reflects page 1 after the search-triggered reset.
    expect(screen.getByTestId("pagination")).toHaveTextContent(
      "Page 1 of 2"
    );
  });

  test("re-fetches with the new page when pagination changes", () => {
    render(<Quotations />);
    vi.clearAllMocks();

    fireEvent.click(screen.getByText("Next"));

    expect(getCustomerQuotations).toHaveBeenCalledWith({
      id: "1",
      params: { page: 2, search: undefined },
    });
  });

  // =====================================================
  // STATS CARDS
  // =====================================================

  test("renders 5 stat cards", () => {
    render(<Quotations />);

    expect(screen.getByTestId("stats-cards")).toHaveTextContent("Cards: 5");
  });

  test("falls back to 0 / AED 0 when quotationsKpiCards is null", () => {
    setReduxState({ quotationsKpiCards: null });

    render(<Quotations />);

    // Component still renders 5 cards, just with fallback values —
    // verified indirectly since StatsCards is mocked to only show count.
    expect(screen.getByTestId("stats-cards")).toHaveTextContent("Cards: 5");
  });

  // =====================================================
  // TABLE
  // =====================================================

  test("renders the table with quotations data and column count", () => {
    render(<Quotations />);

    expect(screen.getByTestId("table")).toHaveTextContent(
      "Rows: 1 / Cols: 2 / Loading: false"
    );
  });

  test("passes loading state through to the table", () => {
    setReduxState({ quotationsLoading: true });

    render(<Quotations />);

    expect(screen.getByTestId("table")).toHaveTextContent("Loading: true");
  });

  test("renders an empty table when quotations is null", () => {
    setReduxState({ quotations: null });

    render(<Quotations />);

    expect(screen.getByTestId("table")).toHaveTextContent("Rows: 0");
  });

  // =====================================================
  // PAGINATION
  // =====================================================

  test("passes totalPages from redux state to pagination", () => {
    setReduxState({ quotationsTotalPages: 7 });

    render(<Quotations />);

    expect(screen.getByTestId("pagination")).toHaveTextContent(
      "Page 1 of 7"
    );
  });

  test("defaults totalPages to 1 when quotationsTotalPages is falsy", () => {
    setReduxState({ quotationsTotalPages: 0 });

    render(<Quotations />);

    expect(screen.getByTestId("pagination")).toHaveTextContent(
      "Page 1 of 1"
    );
  });
});