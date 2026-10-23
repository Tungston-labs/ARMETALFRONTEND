import React from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// --------------------------------------------------------------------
// Paths below are relative to THIS file's location:
//   src/__tests__/Finance-Category/Invoice/SalesInvoices.test.jsx
// which is 3 levels below src/. The real files live at:
//   src/Pages/FinanceModule/SALES/Invoices/
// which is 4 levels below src/.
// --------------------------------------------------------------------
import SalesInvoices from "../../../Pages/FinanceModule/SALES/Invoices/SalesInvoices";
import useSalesInvoices from "../../../Pages/FinanceModule/SALES/Invoices/UseSalesInvoices";

// ---- Mock react-router-dom navigate ----
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// ---- Mock the data hook (path MUST match the import above exactly) ----
vi.mock("../../../Pages/FinanceModule/SALES/Invoices/UseSalesInvoices", () => ({
  default: vi.fn(),
}));

// ---- Mock child components to keep this a unit test of SalesInvoices only ----
vi.mock("../../../Components/ReusableTable/ReusableHeader", () => ({
  default: (props) => (
    <div data-testid="header">
      <span>{props.title}</span>
      <span>{props.breadcrumbs?.join(" / ")}</span>
      <button onClick={props.onButtonClick}>{props.buttonText}</button>
      {props.children}
    </div>
  ),
}));

vi.mock("../../../Components/ReusableTable/ReusableFilter", () => ({
  default: (props) => (
    <div data-testid="filter">
      <input
        data-testid="search-input"
        placeholder={props.searchPlaceholder}
        value={props.search || ""}
        onChange={(e) => props.onSearch(e.target.value)}
      />
      <select
        data-testid="status-select"
        value={props.status || ""}
        onChange={(e) => props.onStatus(e.target.value)}
      >
        <option value="">All</option>
        {props.statuses?.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {props.filters?.map((f) => (
        <select
          key={f.key}
          data-testid={`filter-${f.key}`}
          value={f.value || ""}
          onChange={(e) => f.onChange(e.target.value)}
        >
          <option value="">{f.placeholder}</option>
          {f.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  ),
}));

vi.mock("../../../Components/ReusableTable/ReusableTable", () => ({
  default: (props) => (
    <div data-testid="table">
      Rows: {props.data?.length ?? 0} / Cols: {props.columns?.length ?? 0}
    </div>
  ),
}));

vi.mock("../../../Components/Pagination/ReusablePagination", () => ({
  default: (props) => (
    <div data-testid="pagination">
      <span>
        Page {props.currentPage} of {props.totalPages} (
        {props.totalRecords} total)
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

vi.mock("../../../Components/modals/ReusableConfirmModal", () => ({
  default: (props) =>
    props.show ? (
      <div data-testid="delete-modal">
        <span>{props.title}</span>
        <span>{props.message}</span>
        <button onClick={props.onConfirm}>{props.confirmText}</button>
        <button onClick={props.onClose}>{props.cancelText}</button>
      </div>
    ) : null,
}));

// ---- Shared default mock return value for the hook ----
const buildHookReturn = (overrides = {}) => ({
  salesInvoiceColumns: [{ key: "invoice_number" }, { key: "status" }],
  paginatedData: [{ id: 1, invoice_number: "INV-001" }],
  totalRecords: 1,
  totalPages: 1,

  loading: false,
  error: null,
  successMessage: null,

  search: "",
  status: "",
  customer: "",
  dueDate: "",
  startDate: "",
  endDate: "",
  currentPage: 1,

  salesOrderStats: [{ label: "Total", value: 10 }],
  customerOptions: [{ label: "Acme", value: "acme" }],
  deleteModal: { isOpen: false, invoice: null },

  handleSearch: vi.fn(),
  handleStatus: vi.fn(),
  handleCustomer: vi.fn(),
  handleDueDate: vi.fn(),
  handleStartDateChange: vi.fn(),
  handleEndDateChange: vi.fn(),
  handleExport: vi.fn(),
  setCurrentPage: vi.fn(),
  handleDeleteCancel: vi.fn(),
  handleDeleteConfirm: vi.fn(),

  ...overrides,
});

describe("<SalesInvoices />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders header with correct title and breadcrumbs", () => {
    useSalesInvoices.mockReturnValue(buildHookReturn());
    render(<SalesInvoices />);

    expect(screen.getByText("Invoices")).toBeInTheDocument();
    expect(screen.getByText("Sales / Invoices")).toBeInTheDocument();
  });

  test("navigates to add-invoice page when header button is clicked", () => {
    useSalesInvoices.mockReturnValue(buildHookReturn());
    render(<SalesInvoices />);

    fireEvent.click(screen.getByText("+ ADD NEW INVOICE"));
    expect(mockNavigate).toHaveBeenCalledWith("/sales/invoices/add");
  });

  test("renders stats cards with data from the hook", () => {
    useSalesInvoices.mockReturnValue(buildHookReturn());
    render(<SalesInvoices />);

    expect(screen.getByTestId("stats-cards")).toHaveTextContent("Cards: 1");
  });

  test("shows loading state instead of the table when loading is true", () => {
    useSalesInvoices.mockReturnValue(buildHookReturn({ loading: true }));
    render(<SalesInvoices />);

    expect(screen.getByText(/Loading invoices/i)).toBeInTheDocument();
    expect(screen.queryByTestId("table")).not.toBeInTheDocument();
  });

  test("renders the table with paginated data when not loading", () => {
    useSalesInvoices.mockReturnValue(buildHookReturn());
    render(<SalesInvoices />);

    expect(screen.getByTestId("table")).toHaveTextContent("Rows: 1 / Cols: 2");
  });

  test("displays a string error message", () => {
    useSalesInvoices.mockReturnValue(
      buildHookReturn({ error: "Failed to load invoices" })
    );
    render(<SalesInvoices />);

    expect(screen.getByText("Failed to load invoices")).toBeInTheDocument();
  });

  test("displays an object error's message/detail field", () => {
    useSalesInvoices.mockReturnValue(
      buildHookReturn({ error: { message: "Network error" } })
    );
    render(<SalesInvoices />);

    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  test("falls back to a generic message for an unrecognized error shape", () => {
    useSalesInvoices.mockReturnValue(buildHookReturn({ error: {} }));
    render(<SalesInvoices />);

    expect(screen.getByText("Something went wrong.")).toBeInTheDocument();
  });

  test("displays success message when present", () => {
    useSalesInvoices.mockReturnValue(
      buildHookReturn({ successMessage: "Invoice deleted successfully" })
    );
    render(<SalesInvoices />);

    expect(
      screen.getByText("Invoice deleted successfully")
    ).toBeInTheDocument();
  });

  test("does not render error/success banners when absent", () => {
    useSalesInvoices.mockReturnValue(buildHookReturn());
    render(<SalesInvoices />);

    expect(
      screen.queryByText("Something went wrong.")
    ).not.toBeInTheDocument();
  });

  test("calls handleSearch when typing in the search input", () => {
    const hookReturn = buildHookReturn();
    useSalesInvoices.mockReturnValue(hookReturn);
    render(<SalesInvoices />);

    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "INV-001" },
    });
    expect(hookReturn.handleSearch).toHaveBeenCalledWith("INV-001");
  });

  test("calls handleStatus when a status is selected", () => {
    const hookReturn = buildHookReturn();
    useSalesInvoices.mockReturnValue(hookReturn);
    render(<SalesInvoices />);

    fireEvent.change(screen.getByTestId("status-select"), {
      target: { value: "Paid" },
    });
    expect(hookReturn.handleStatus).toHaveBeenCalledWith("Paid");
  });

  test("calls handleCustomer and handleDueDate for their respective filters", () => {
    const hookReturn = buildHookReturn();
    useSalesInvoices.mockReturnValue(hookReturn);
    render(<SalesInvoices />);

    fireEvent.change(screen.getByTestId("filter-customer"), {
      target: { value: "acme" },
    });
    expect(hookReturn.handleCustomer).toHaveBeenCalledWith("acme");

    fireEvent.change(screen.getByTestId("filter-dueDate"), {
      target: { value: "overdue" },
    });
    expect(hookReturn.handleDueDate).toHaveBeenCalledWith("overdue");
  });

  test("calls handleStartDateChange and handleEndDateChange on date input changes", () => {
    const hookReturn = buildHookReturn();
    useSalesInvoices.mockReturnValue(hookReturn);
    render(<SalesInvoices />);

    fireEvent.change(screen.getByLabelText("Start date"), {
      target: { value: "2026-01-01" },
    });
    expect(hookReturn.handleStartDateChange).toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("End date"), {
      target: { value: "2026-01-31" },
    });
    expect(hookReturn.handleEndDateChange).toHaveBeenCalled();
  });

  test("enforces min/max constraints between start and end date inputs", () => {
    useSalesInvoices.mockReturnValue(
      buildHookReturn({ startDate: "2026-01-01", endDate: "2026-01-31" })
    );
    render(<SalesInvoices />);

    expect(screen.getByLabelText("Start date")).toHaveAttribute(
      "max",
      "2026-01-31"
    );
    expect(screen.getByLabelText("End date")).toHaveAttribute(
      "min",
      "2026-01-01"
    );
  });

  test("calls setCurrentPage when pagination triggers a page change", () => {
    const hookReturn = buildHookReturn();
    useSalesInvoices.mockReturnValue(hookReturn);
    render(<SalesInvoices />);

    fireEvent.click(screen.getByText("Next"));
    expect(hookReturn.setCurrentPage).toHaveBeenCalledWith(2);
  });

  test("passes totalRecords and totalPages to pagination", () => {
    useSalesInvoices.mockReturnValue(
      buildHookReturn({ totalRecords: 42, totalPages: 5, currentPage: 3 })
    );
    render(<SalesInvoices />);

    expect(screen.getByTestId("pagination")).toHaveTextContent(
      "Page 3 of 5 (42 total)"
    );
  });

  test("does not render the delete modal when deleteModal.isOpen is false", () => {
    useSalesInvoices.mockReturnValue(buildHookReturn());
    render(<SalesInvoices />);

    expect(screen.queryByTestId("delete-modal")).not.toBeInTheDocument();
  });

  test("renders the delete modal with invoice number when open", () => {
    useSalesInvoices.mockReturnValue(
      buildHookReturn({
        deleteModal: {
          isOpen: true,
          invoice: { invoice_number: "INV-007" },
        },
      })
    );
    render(<SalesInvoices />);

    expect(screen.getByTestId("delete-modal")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to delete invoice INV-007?")
    ).toBeInTheDocument();
  });

  test("renders a generic delete confirmation when no invoice is set", () => {
    useSalesInvoices.mockReturnValue(
      buildHookReturn({ deleteModal: { isOpen: true, invoice: null } })
    );
    render(<SalesInvoices />);

    expect(
      screen.getByText("Are you sure you want to delete this invoice?")
    ).toBeInTheDocument();
  });

  test("calls handleDeleteConfirm and handleDeleteCancel from the modal", () => {
    const hookReturn = buildHookReturn({
      deleteModal: { isOpen: true, invoice: { invoice_number: "INV-007" } },
    });
    useSalesInvoices.mockReturnValue(hookReturn);
    render(<SalesInvoices />);

    fireEvent.click(screen.getByText("Delete"));
    expect(hookReturn.handleDeleteConfirm).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Cancel"));
    expect(hookReturn.handleDeleteCancel).toHaveBeenCalled();
  });
});