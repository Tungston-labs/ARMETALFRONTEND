import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

// -----------------------------------------------------------------------------
// Mocks
// -----------------------------------------------------------------------------

const mockDispatch = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) =>
    selector({
      finance: {
        list: [
          {
            id: 1,
            category_name: "Salary",
            date: "2026-09-01",
            note: "Monthly salary",
            payment_type: "IN",
            amount: 50000,
          },
          {
            id: 2,
            category_name: "Office",
            date: "2026-09-02",
            note: "Office expense",
            payment_type: "OUT",
            amount: 5000,
          },
        ],
        loading: false,
        pagination: {
          totalPages: 3,
        },
        totalIncome: 50000,
        totalExpense: 5000,
        cashBalance: 45000,
      },
    }),
}));

vi.mock("../../Redux/financeThunks", () => ({
  createFinance: vi.fn((payload) => ({
    type: "finance/createFinance",
    payload,
  })),
  fetchFinanceList: vi.fn((payload) => ({
    type: "finance/fetchFinanceList",
    payload,
  })),
}));

vi.mock("../../hooks/useCurrency", () => ({
  useCurrency: () => ({
    currencyCode: "INR",
  }),
}));

vi.mock("../../Pages/finance/FinancePage.Styles", () => ({
  Container: ({ children }) => (
    <div data-testid="finance-container">{children}</div>
  ),
}));

vi.mock("../../Components/StatsCards/StatsCards", () => ({
  default: ({ cards }) => (
    <div data-testid="stats-cards">
      {cards.map((card) => (
        <div key={card.title} data-testid={`stat-${card.title}`}>
          <span>{card.title}</span>
          <span>{card.count}</span>
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../../Components/Pagination/Pagination", () => ({
  default: ({ currentPage, totalPages, onPageChange }) => (
    <div data-testid="pagination">
      <span data-testid="current-page">{currentPage}</span>
      <span data-testid="total-pages">{totalPages}</span>

      <button onClick={() => onPageChange(1)}>Page 1</button>
      <button onClick={() => onPageChange(2)}>Page 2</button>
      <button onClick={() => onPageChange(3)}>Page 3</button>
      <button onClick={() => onPageChange(0)}>Invalid Previous</button>
      <button onClick={() => onPageChange(4)}>Invalid Next</button>
    </div>
  ),
}));

vi.mock("../../Components/ReusableTable/ReusableTable", () => ({
  default: ({ columns, data, loading }) => (
    <div data-testid="reusable-table">
      <span data-testid="table-loading">{loading ? "Loading" : "Loaded"}</span>

      <span data-testid="table-row-count">{data.length}</span>

      {data.map((row, index) => (
        <div key={row.id || index} data-testid={`table-row-${index}`}>
          {columns.map((column) => (
            <span key={column.accessor}>
              {column.render ? column.render(row, index) : row[column.accessor]}
            </span>
          ))}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../../Components/ReusableTable/ReusableHeader", () => ({
  default: ({ title, breadcrumbs, buttonText, onButtonClick }) => (
    <div data-testid="reusable-header">
      <h1>{title}</h1>

      <div data-testid="breadcrumbs">{breadcrumbs.join(" / ")}</div>

      <button onClick={onButtonClick}>{buttonText}</button>
    </div>
  ),
}));

vi.mock("../../Components/ReusableTable/ReusableFilter", () => ({
  default: ({
    search,
    onSearch,
    searchPlaceholder,
    status,
    statuses,
    onStatus,
    date,
    onDate,
    showSearch,
    showStatus,
    showDate,
  }) => (
    <div data-testid="reusable-filter">
      {showSearch && (
        <input
          aria-label="finance-search"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
      )}

      {showStatus && (
        <select
          aria-label="finance-status"
          value={status}
          onChange={(event) => onStatus(event.target.value)}
        >
          <option value="">All</option>

          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      )}

      {showDate && (
        <input
          aria-label="finance-date"
          type="month"
          value={date}
          onChange={(event) => onDate(event.target.value)}
        />
      )}
    </div>
  ),
}));

vi.mock("../../Pages/finance/NewFinance", () => ({
  default: ({ isOpen, onClose, onSave }) =>
    isOpen ? (
      <div data-testid="finance-modal">
        <h2>Add Finance</h2>

        <button onClick={onClose}>Close Modal</button>

        <button
          onClick={() =>
            onSave({
              category: 10,
              date: "2026-09-02",
              note: "Test finance",
              paymentType: "IN",
              amount1: 2500,
            })
          }
        >
          Save Finance
        </button>
      </div>
    ) : null,
}));

// Import after mocks
import FinanceDetail from "../../Pages/finance/FinancePage";
import { createFinance, fetchFinanceList } from "../../Redux/financeThunks";

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe("FinanceDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Every dispatch returns a resolved promise so handleAddFinance can
    // execute its .then() block.
    mockDispatch.mockImplementation(() => Promise.resolve());
  });

  // ---------------------------------------------------------------------------
  // Initial rendering
  // ---------------------------------------------------------------------------

  it("renders the Finance page", () => {
    render(<FinanceDetail />);

    expect(screen.getByText("Finance")).toBeInTheDocument();
    expect(screen.getByTestId("finance-container")).toBeInTheDocument();
  });

  it("renders the Finance header", () => {
    render(<FinanceDetail />);

    expect(screen.getByTestId("reusable-header")).toBeInTheDocument();
    expect(screen.getByText("Finance")).toBeInTheDocument();
    expect(screen.getByText("Dashboard / Finance")).toBeInTheDocument();
  });

  it("renders the Add New Finance button", () => {
    render(<FinanceDetail />);

    expect(
      screen.getByRole("button", {
        name: "+ ADD NEW FINANCE",
      }),
    ).toBeInTheDocument();
  });

  it("renders StatsCards", () => {
    render(<FinanceDetail />);

    expect(screen.getByTestId("stats-cards")).toBeInTheDocument();

    expect(screen.getByText("Total Records")).toBeInTheDocument();
    expect(screen.getByText("Total Income")).toBeInTheDocument();
    expect(screen.getByText("Total Expense")).toBeInTheDocument();
    expect(screen.getByText("Cash Balance")).toBeInTheDocument();
  });

  it("renders the finance filter", () => {
    render(<FinanceDetail />);

    expect(screen.getByTestId("reusable-filter")).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Search Category / Note"),
    ).toBeInTheDocument();

    expect(screen.getByLabelText("finance-status")).toBeInTheDocument();
    expect(screen.getByLabelText("finance-date")).toBeInTheDocument();
  });

  it("renders the finance table", () => {
    render(<FinanceDetail />);

    expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
    expect(screen.getByTestId("table-row-count")).toHaveTextContent("2");
  });

  it("renders pagination", () => {
    render(<FinanceDetail />);

    expect(screen.getByTestId("pagination")).toBeInTheDocument();
    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
    expect(screen.getByTestId("total-pages")).toHaveTextContent("3");
  });

  // ---------------------------------------------------------------------------
  // Initial API fetch
  // ---------------------------------------------------------------------------

  it("fetches finance list on initial render", async () => {
    render(<FinanceDetail />);

    await waitFor(() => {
      expect(fetchFinanceList).toHaveBeenCalled();
    });

    expect(fetchFinanceList).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20,
      search: "",
      payment_type: "",
      month: "",
    });
  });

  it("dispatches the initial finance fetch", async () => {
    render(<FinanceDetail />);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "finance/fetchFinanceList",
      }),
    );
  });

  // ---------------------------------------------------------------------------
  // Search
  // ---------------------------------------------------------------------------

  it("updates search text when the user searches", async () => {
    render(<FinanceDetail />);

    const searchInput = screen.getByPlaceholderText("Search Category / Note");

    fireEvent.change(searchInput, {
      target: {
        value: "salary",
      },
    });

    expect(searchInput).toHaveValue("salary");

    await waitFor(() => {
      expect(fetchFinanceList).toHaveBeenCalledWith({
        page: 1,
        pageSize: 20,
        search: "salary",
        payment_type: "",
        month: "",
      });
    });
  });

  it("fetches finance data using the search text", async () => {
    render(<FinanceDetail />);

    const searchInput = screen.getByPlaceholderText("Search Category / Note");

    fireEvent.change(searchInput, {
      target: {
        value: "office",
      },
    });

    await waitFor(() => {
      expect(fetchFinanceList).toHaveBeenLastCalledWith({
        page: 1,
        pageSize: 20,
        search: "office",
        payment_type: "",
        month: "",
      });
    });
  });

  // ---------------------------------------------------------------------------
  // Payment filter
  // ---------------------------------------------------------------------------

  it("selects Income payment filter", async () => {
    render(<FinanceDetail />);

    const statusSelect = screen.getByLabelText("finance-status");

    fireEvent.change(statusSelect, {
      target: {
        value: "Income",
      },
    });

    expect(statusSelect).toHaveValue("Income");

    await waitFor(() => {
      expect(fetchFinanceList).toHaveBeenCalledWith({
        page: 1,
        pageSize: 20,
        search: "",
        payment_type: "IN",
        month: "",
      });
    });
  });

  it("selects Expense payment filter", async () => {
    render(<FinanceDetail />);

    const statusSelect = screen.getByLabelText("finance-status");

    fireEvent.change(statusSelect, {
      target: {
        value: "Expense",
      },
    });

    expect(statusSelect).toHaveValue("Expense");

    await waitFor(() => {
      expect(fetchFinanceList).toHaveBeenCalledWith({
        page: 1,
        pageSize: 20,
        search: "",
        payment_type: "OUT",
        month: "",
      });
    });
  });

  it("clears the payment filter", async () => {
    render(<FinanceDetail />);

    const statusSelect = screen.getByLabelText("finance-status");

    fireEvent.change(statusSelect, {
      target: {
        value: "Income",
      },
    });

    await waitFor(() => {
      expect(statusSelect).toHaveValue("Income");
    });

    fireEvent.change(statusSelect, {
      target: {
        value: "",
      },
    });

    expect(statusSelect).toHaveValue("");

    await waitFor(() => {
      expect(fetchFinanceList).toHaveBeenLastCalledWith({
        page: 1,
        pageSize: 20,
        search: "",
        payment_type: "",
        month: "",
      });
    });
  });

  // ---------------------------------------------------------------------------
  // Month filter
  // ---------------------------------------------------------------------------

  it("updates the month filter", async () => {
    render(<FinanceDetail />);

    const dateInput = screen.getByLabelText("finance-date");

    fireEvent.change(dateInput, {
      target: {
        value: "2026-09",
      },
    });

    expect(dateInput).toHaveValue("2026-09");

    await waitFor(() => {
      expect(fetchFinanceList).toHaveBeenCalledWith({
        page: 1,
        pageSize: 20,
        search: "",
        payment_type: "",
        month: "2026-09",
      });
    });
  });

  // ---------------------------------------------------------------------------
  // Combined filters
  // ---------------------------------------------------------------------------

  it("fetches using search, payment type and month together", async () => {
    render(<FinanceDetail />);

    const searchInput = screen.getByPlaceholderText("Search Category / Note");

    const statusSelect = screen.getByLabelText("finance-status");

    const dateInput = screen.getByLabelText("finance-date");

    fireEvent.change(searchInput, {
      target: {
        value: "salary",
      },
    });

    fireEvent.change(statusSelect, {
      target: {
        value: "Income",
      },
    });

    fireEvent.change(dateInput, {
      target: {
        value: "2026-09",
      },
    });

    await waitFor(() => {
      expect(fetchFinanceList).toHaveBeenLastCalledWith({
        page: 1,
        pageSize: 20,
        search: "salary",
        payment_type: "IN",
        month: "2026-09",
      });
    });
  });

  // ---------------------------------------------------------------------------
  // Add Finance modal
  // ---------------------------------------------------------------------------

  it("does not show Finance modal initially", () => {
    render(<FinanceDetail />);

    expect(screen.queryByTestId("finance-modal")).not.toBeInTheDocument();
  });

  it("opens Finance modal when Add New Finance is clicked", () => {
    render(<FinanceDetail />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ ADD NEW FINANCE",
      }),
    );

    expect(screen.getByTestId("finance-modal")).toBeInTheDocument();
    expect(screen.getByText("Add Finance")).toBeInTheDocument();
  });

  it("closes Finance modal when Close is clicked", () => {
    render(<FinanceDetail />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ ADD NEW FINANCE",
      }),
    );

    expect(screen.getByTestId("finance-modal")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Close Modal",
      }),
    );

    expect(screen.queryByTestId("finance-modal")).not.toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------
  // Save Finance
  // ---------------------------------------------------------------------------

  it("creates finance with the correct payload", async () => {
    render(<FinanceDetail />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ ADD NEW FINANCE",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Finance",
      }),
    );

    await waitFor(() => {
      expect(createFinance).toHaveBeenCalledWith({
        category: 10,
        date: "2026-09-02",
        note: "Test finance",
        payment_type: "IN",
        amount: 2500,
      });
    });
  });

  it("dispatches createFinance when finance is saved", async () => {
    render(<FinanceDetail />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ ADD NEW FINANCE",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Finance",
      }),
    );

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "finance/createFinance",
        }),
      );
    });
  });

  it("closes the modal after successfully saving finance", async () => {
    render(<FinanceDetail />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ ADD NEW FINANCE",
      }),
    );

    expect(screen.getByTestId("finance-modal")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Finance",
      }),
    );

    await waitFor(() => {
      expect(screen.queryByTestId("finance-modal")).not.toBeInTheDocument();
    });
  });

  it("fetches finance list again after saving", async () => {
    render(<FinanceDetail />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ ADD NEW FINANCE",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Finance",
      }),
    );

    await waitFor(() => {
      expect(fetchFinanceList).toHaveBeenCalledWith({
        page: 1,
        pageSize: 20,
      });
    });
  });

  // ---------------------------------------------------------------------------
  // Pagination
  // ---------------------------------------------------------------------------

  it("changes page when a valid page is selected", async () => {
    render(<FinanceDetail />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Page 2",
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("current-page")).toHaveTextContent("2");
    });

    await waitFor(() => {
      expect(fetchFinanceList).toHaveBeenLastCalledWith({
        page: 2,
        pageSize: 20,
        search: "",
        payment_type: "",
        month: "",
      });
    });
  });

  it("allows navigation to the last valid page", async () => {
    render(<FinanceDetail />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Page 3",
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("current-page")).toHaveTextContent("3");
    });
  });

  it("does not change page when page is below 1", async () => {
    render(<FinanceDetail />);

    expect(screen.getByTestId("current-page")).toHaveTextContent("1");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Invalid Previous",
      }),
    );

    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
  });

  it("does not change page when page exceeds total pages", async () => {
    render(<FinanceDetail />);

    expect(screen.getByTestId("current-page")).toHaveTextContent("1");

    fireEvent.click(
      screen.getByRole("button", {
        name: "Invalid Next",
      }),
    );

    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
  });

  // ---------------------------------------------------------------------------
  // Filter page reset
  // ---------------------------------------------------------------------------

  it("resets page to 1 when search changes", async () => {
    render(<FinanceDetail />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Page 2",
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("current-page")).toHaveTextContent("2");
    });

    fireEvent.change(screen.getByPlaceholderText("Search Category / Note"), {
      target: {
        value: "salary",
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId("current-page")).toHaveTextContent("1");
    });
  });

  it("resets page to 1 when payment filter changes", async () => {
    render(<FinanceDetail />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Page 2",
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("current-page")).toHaveTextContent("2");
    });

    fireEvent.change(screen.getByLabelText("finance-status"), {
      target: {
        value: "Income",
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId("current-page")).toHaveTextContent("1");
    });
  });

  it("resets page to 1 when month changes", async () => {
    render(<FinanceDetail />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Page 2",
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("current-page")).toHaveTextContent("2");
    });

    fireEvent.change(screen.getByLabelText("finance-date"), {
      target: {
        value: "2026-09",
      },
    });

    await waitFor(() => {
      expect(screen.getByTestId("current-page")).toHaveTextContent("1");
    });
  });

  // ---------------------------------------------------------------------------
  // Finance table data
  // ---------------------------------------------------------------------------

  it("renders finance category data in the table", () => {
    render(<FinanceDetail />);

    expect(screen.getByText("Salary")).toBeInTheDocument();
    expect(screen.getByText("Office")).toBeInTheDocument();
  });

  it("renders finance notes in the table", () => {
    render(<FinanceDetail />);

    expect(screen.getByText("Monthly salary")).toBeInTheDocument();
    expect(screen.getByText("Office expense")).toBeInTheDocument();
  });

  it("renders Income and Expense status values", () => {
    render(<FinanceDetail />);

    // Income appears both in the filter <option> and table status.
    // Select the table status elements specifically.
    const incomeStatuses = screen.getAllByText("Income");
    const expenseStatuses = screen.getAllByText("Expense");

    expect(incomeStatuses.length).toBeGreaterThanOrEqual(2);
    expect(expenseStatuses.length).toBeGreaterThanOrEqual(2);

    // The last matching elements are the status values rendered
    // by the Finance table.
    expect(incomeStatuses[incomeStatuses.length - 1]).toBeInTheDocument();
    expect(expenseStatuses[expenseStatuses.length - 1]).toBeInTheDocument();
  });
});
