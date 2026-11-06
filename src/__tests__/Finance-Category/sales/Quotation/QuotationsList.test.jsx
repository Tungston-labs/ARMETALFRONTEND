import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import QuotationsList from "./QuotationsList";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  state: {
    quotation: {
      list: [
        {
          id: 1,
          quotation_number: "QT-001",
          client_name: "ABC Company",
          quotation_date: "2026-04-01",
          due_date: "2026-04-30",
          total_amount: 1500,
          negotiation_amount: 1200,
          payment_status: "Pending",
        },
        {
          id: 2,
          quotation_number: "QT-002",
          client_name: "XYZ Company",
          quotation_date: "2026-04-02",
          due_date: "2026-04-30",
          total_amount: 2500,
          negotiation_amount: 2000,
          payment_status: "Approved",
        },
      ],
      pagination: {
        totalPages: 1,
        totalItems: 2,
      },
      kpi: {
        totalValue: 4000,
        negotiation: 3200,
        approved: 1,
        rejected: 0,
        pending: 1,
      },
      loading: false,
      saving: false,
      error: null,
    },
  },
  fetchQuotationList: vi.fn((payload) => ({
    type: "fetchQuotationList",
    payload,
  })),
  fetchQuotationKpi: vi.fn(() => ({
    type: "fetchQuotationKpi",
  })),
  fetchQuotationDetails: vi.fn((id) => ({
    type: "fetchQuotationDetails",
    payload: id,
  })),
  convertQuotation: vi.fn((id) => ({
    type: "convertQuotation",
    payload: id,
  })),
  createQuotation: vi.fn((payload) => ({
    type: "createQuotation",
    payload,
  })),
}));

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: (selector) => selector(mocks.state),
}));

vi.mock("../../../../Redux/quotationThunks", () => ({
  createQuotation: mocks.createQuotation,
  fetchQuotationDetails: mocks.fetchQuotationDetails,
  fetchQuotationKpi: mocks.fetchQuotationKpi,
  fetchQuotationList: mocks.fetchQuotationList,
  convertQuotation: mocks.convertQuotation,
}));

vi.mock("../../../../Components/ReusableTable/ReusableHeader", () => ({
  default: ({ title, children }) => (
    <header>
      <h1>{title}</h1>
      {children}
    </header>
  ),
}));

vi.mock("../../../../Components/ReusableTable/ReusableFilter", () => ({
  default: ({
    search,
    onSearch,
    department,
    departments,
    onDepartment,
    status,
    statuses,
    onStatus,
  }) => (
    <div data-testid="quotation-filters">
      <input
        aria-label="Search quotations"
        value={search}
        onChange={(event) => onSearch(event.target.value)}
      />

      <select
        aria-label="Customer filter"
        value={department}
        onChange={(event) => onDepartment(event.target.value)}
      >
        <option value="">All customers</option>
        {departments.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      <select
        aria-label="Status filter"
        value={status}
        onChange={(event) => onStatus(event.target.value)}
      >
        <option value="">All statuses</option>
        {statuses.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  ),
}));

vi.mock("../../../../Components/ReusableTable/ReusableTable", () => ({
  default: ({ columns, data, loading }) => (
    <div data-testid="quotation-table">
      {loading && <span>Loading quotations</span>}

      {data.map((row) => (
        <div key={row.id} data-testid="quotation-row">
          <span>{row.quoteNumber}</span>
          <span>{row.customer}</span>
          <span>{row.status}</span>

          {columns.find((column) => column.accessor === "action")?.render(row)}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../../../../Components/Pagination/ReusablePagination", () => ({
  default: ({ currentPage, totalPages, onPageChange }) => (
    <div data-testid="quotation-pagination">
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button type="button" onClick={() => onPageChange(currentPage + 1)}>
        Next page
      </button>
    </div>
  ),
}));

vi.mock("../../../../Components/StatsCards/StatsCards", () => ({
  default: ({ cards }) => (
    <div data-testid="quotation-stats">
      {cards.map((card) => (
        <div key={card.title}>
          <span>{card.title}</span>
          <span>{card.count}</span>
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../../../../Components/QuotationInvoice/QuotationInvoice", () => ({
  default: ({ quotation, onCancel, onSaveDraft, onSend, error }) => (
    <div data-testid="quotation-invoice">
      <span>{quotation?.quoteNumber}</span>
      {error && <div role="alert">{String(error)}</div>}
      <button onClick={onCancel}>Cancel invoice</button>
      <button onClick={onSaveDraft}>Save draft</button>
      <button onClick={onSend}>Send quotation</button>
    </div>
  ),
}));

vi.mock("./modal/AddQuotation", () => ({
  default: ({ onClose, onPreview }) => (
    <div data-testid="generate-quotation-modal">
      <h2>Generate New Quotation</h2>
      <button onClick={onClose}>Close quotation form</button>
      <button
        onClick={() =>
          onPreview({
            quotationNumber: "QT-NEW",
            quotationDate: "2026-04-10",
            dueDate: "2026-04-30",
            paymentStatus: "Draft",
            from: "TUNGSTON LABS",
            billTo: "ABC Company",
            items: [
              {
                service: "Web Development",
                description: "Website development",
                quantity: 1,
                rate: 1000,
                vatRate: 15,
              },
            ],
            totals: {
              subtotal: 1000,
              vat: 150,
              discount: 0,
              total: 1150,
            },
          })
        }
      >
        Preview quotation
      </button>
    </div>
  ),
}));

import { HeaderButton } from "../../../../Components/ReusableTable/ReusableHeader.styles";

const renderPage = () => render(<QuotationsList />);

describe("QuotationsList", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.dispatch.mockReturnValue({
      unwrap: () => Promise.resolve({ success: true }),
    });

    mocks.state.quotation = {
      list: [
        {
          id: 1,
          quotation_number: "QT-001",
          client_name: "ABC Company",
          quotation_date: "2026-04-01",
          due_date: "2026-04-30",
          total_amount: 1500,
          negotiation_amount: 1200,
          payment_status: "Pending",
        },
        {
          id: 2,
          quotation_number: "QT-002",
          client_name: "XYZ Company",
          quotation_date: "2026-04-02",
          due_date: "2026-04-30",
          total_amount: 2500,
          negotiation_amount: 2000,
          payment_status: "Approved",
        },
      ],
      pagination: {
        totalPages: 1,
        totalItems: 2,
      },
      kpi: {
        totalValue: 4000,
        negotiation: 3200,
        approved: 1,
        rejected: 0,
        pending: 1,
      },
      loading: false,
      saving: false,
      error: null,
    };
  });

  it("should render the Quotations page", () => {
    renderPage();

    expect(
      screen.getByRole("heading", {
        name: "Quotations",
      }),
    ).toBeInTheDocument();

    expect(screen.getByText("QT-001")).toBeInTheDocument();
    expect(screen.getByText("QT-002")).toBeInTheDocument();
  });

  it("should fetch quotation list and KPI on initial render", async () => {
    renderPage();

    await waitFor(() => {
      expect(mocks.fetchQuotationList).toHaveBeenCalledWith({
        page: 1,
        page_size: 10,
      });

      expect(mocks.fetchQuotationKpi).toHaveBeenCalled();
    });

    expect(mocks.dispatch).toHaveBeenCalled();
  });

  it("should display quotation KPI cards", () => {
    renderPage();

    expect(screen.getByText("Total Quotation Value")).toBeInTheDocument();

    expect(screen.getByText("Negotiation Amount")).toBeInTheDocument();

    expect(screen.getByText("Approved Quotes")).toBeInTheDocument();

    expect(screen.getByText("Rejected Quotes")).toBeInTheDocument();

    expect(screen.getByText("Pending Quotes")).toBeInTheDocument();
  });

  it("should filter quotations by search text", () => {
    renderPage();

    fireEvent.change(screen.getByLabelText("Search quotations"), {
      target: { value: "QT-001" },
    });

    expect(screen.getByText("QT-001")).toBeInTheDocument();
    expect(screen.queryByText("QT-002")).not.toBeInTheDocument();
  });

  it("should filter quotations by customer", () => {
    renderPage();

    fireEvent.change(screen.getByLabelText("Customer filter"), {
      target: { value: "XYZ Company" },
    });

    expect(screen.getByText("QT-002")).toBeInTheDocument();
    expect(screen.queryByText("QT-001")).not.toBeInTheDocument();
  });

  it("should filter quotations by status", () => {
    renderPage();

    fireEvent.change(screen.getByLabelText("Status filter"), {
      target: { value: "Approved" },
    });

    expect(screen.getByText("QT-002")).toBeInTheDocument();
    expect(screen.queryByText("QT-001")).not.toBeInTheDocument();
  });

  it("should reset the page to one when search changes", () => {
    renderPage();

    fireEvent.change(screen.getByLabelText("Search quotations"), {
      target: { value: "ABC" },
    });

    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
  });

  it("should open the Generate Quote form", () => {
    renderPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: /generate quote/i,
      }),
    );

    expect(screen.getByTestId("generate-quotation-modal")).toBeInTheDocument();
  });

  it("should close the Generate Quote form", () => {
    renderPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: /generate quote/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Close quotation form",
      }),
    );

    expect(
      screen.queryByTestId("generate-quotation-modal"),
    ).not.toBeInTheDocument();
  });

  it("should open the invoice preview from the quotation form", () => {
    renderPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: /generate quote/i,
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Preview quotation",
      }),
    );

    expect(screen.getByTestId("quotation-invoice")).toBeInTheDocument();

    expect(screen.getByText("QT-NEW")).toBeInTheDocument();
  });

  it("should export quotations as CSV", () => {
    const createObjectURL = vi.fn(() => "blob:test-url");
    const revokeObjectURL = vi.fn();

    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      writable: true,
      value: createObjectURL,
    });

    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      writable: true,
      value: revokeObjectURL,
    });

    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    renderPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: /export/i,
      }),
    );

    expect(createObjectURL).toHaveBeenCalled();
    expect(clickSpy).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:test-url");

    clickSpy.mockRestore();
  });

  it("should display the loading state", () => {
    mocks.state.quotation.loading = true;

    renderPage();

    expect(screen.getByText("Loading quotations")).toBeInTheDocument();
  });

  it("should display an API error message", () => {
    mocks.state.quotation.error = "Unable to load";

    renderPage();

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Unable to load quotations. Please try again.",
    );
  });
});
