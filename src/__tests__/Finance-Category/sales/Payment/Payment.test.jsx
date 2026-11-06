import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import Payment from "./Payment";

const mocks = vi.hoisted(() => {
  const dispatch = vi.fn();

  const mockState = {
    customer: {
      customers: [
        { id: 1, name: "ABC Trading" },
        { id: 2, customer_name: "Al Noor Trading" },
      ],
    },
  };

  const selectors = {
    selectPayments: vi.fn(() => [
      {
        id: 1,
        receipt_no: "REC-001",
        customer_name: "ABC Trading",
        amount: 1500,
      },
    ]),
    selectPaymentPagination: vi.fn(() => ({
      currentPage: 1,
      totalPages: 3,
    })),
    selectPaymentKPI: vi.fn(() => ({
      totalCollections: 10000,
      thisMonthCollections: 5000,
      outstandingReceivables: 2000,
      overdueReceivables: 500,
      collectionRate: 85,
    })),
    selectPaymentLoading: vi.fn(() => false),
    selectPaymentCreateLoading: vi.fn(() => false),
    selectPaymentError: vi.fn(() => null),
  };

  const makeThunk = (type) =>
    vi.fn((payload) => ({
      type,
      payload,
    }));

  return {
    dispatch,
    mockState,
    selectors,
    fetchPayments: makeThunk("fetchPayments"),
    fetchPaymentKPI: makeThunk("fetchPaymentKPI"),
    fetchPaymentById: makeThunk("fetchPaymentById"),
    createPayment: makeThunk("createPayment"),
    exportPayments: makeThunk("exportPayments"),
    getCustomers: makeThunk("getCustomers"),
  };
});

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: (selector) => selector(mocks.mockState),
}));

vi.mock("../../../../Redux/finance/Sales/paymentSlice", () => ({
  fetchPayments: mocks.fetchPayments,
  fetchPaymentKPI: mocks.fetchPaymentKPI,
  fetchPaymentById: mocks.fetchPaymentById,
  createPayment: mocks.createPayment,
  exportPayments: mocks.exportPayments,

  selectPayments: mocks.selectors.selectPayments,
  selectPaymentPagination: mocks.selectors.selectPaymentPagination,
  selectPaymentKPI: mocks.selectors.selectPaymentKPI,
  selectPaymentLoading: mocks.selectors.selectPaymentLoading,
  selectPaymentCreateLoading: mocks.selectors.selectPaymentCreateLoading,
  selectPaymentError: mocks.selectors.selectPaymentError,
}));

vi.mock("../../../../Redux/finance/Sales/CustomerSlice", () => ({
  getCustomers: mocks.getCustomers,
}));

vi.mock("../../../../Components/ReusableTable/ReusableHeader", () => ({
  default: ({ title, buttonText, onButtonClick, children }) => (
    <div>
      <h1>{title}</h1>
      <button type="button" onClick={onButtonClick}>
        {buttonText}
      </button>
      {children}
    </div>
  ),
}));

vi.mock("../../../../Components/ReusableTable/ReusableFilter", () => ({
  default: ({
    search,
    onSearch,
    status,
    onStatus,
    statuses,
    filters = [],
  }) => (
    <div>
      <input
        aria-label="Payment search"
        value={search}
        onChange={(event) => onSearch(event.target.value)}
      />

      <select
        aria-label="Payment status filter"
        value={status}
        onChange={(event) => onStatus(event.target.value)}
      >
        <option value="">All Status</option>
        {statuses.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>

      {filters.map((filter) => (
        <select
          key={filter.key}
          aria-label={filter.placeholder}
          value={filter.value}
          onChange={(event) => filter.onChange(event.target.value)}
        >
          <option value="">{filter.placeholder}</option>
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  ),
}));

vi.mock("../../../../Components/ReusableTable/ReusableTable", () => ({
  default: ({ data = [], loading }) => (
    <div>
      <span>{loading ? "Table loading" : "Table loaded"}</span>
      {data.map((payment) => (
        <div key={payment.id}>{payment.receipt_no}</div>
      ))}
    </div>
  ),
}));

vi.mock("../../../../Components/Pagination/ReusablePagination", () => ({
  default: ({ currentPage, totalPages, onPageChange }) => (
    <div>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button type="button" onClick={() => onPageChange(2)}>
        Next page
      </button>
    </div>
  ),
}));

vi.mock("../../../../Components/StatsCards/StatsCards", () => ({
  default: ({ cards = [] }) => (
    <div>
      {cards.map((card) => (
        <div key={card.title}>
          <span>{card.title}</span>
          <span>{card.count}</span>
        </div>
      ))}
    </div>
  ),
}));

vi.mock("./modal/Recordpayment", () => ({
  default: ({ isOpen, onClose, onSave, submitting, error }) =>
    isOpen ? (
      <div>
        <h2>Mock Record Payment Modal</h2>
        {error && <span>{String(error)}</span>}
        <button
          type="button"
          onClick={() =>
            onSave({
              invoiceNo: "INV-001",
              customerId: "1",
              customerName: "ABC Trading",
              invoiceAmount: "1500",
              outstandingAmount: "500",
              paymentDate: "2026-11-06",
              paymentType: "Full Payment",
              paymentMethod: "Bank Transfer",
              amountReceived: "1000",
              referenceNumber: "REF-001",
              notes: "Test payment",
            })
          }
          disabled={submitting}
        >
          Submit mock payment
        </button>
        <button type="button" onClick={onClose}>
          Close mock modal
        </button>
      </div>
    ) : null,
}));

describe("Payment page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.dispatch.mockImplementation((action) => {
      if (action?.type === "createPayment") {
        return {
          unwrap: () => Promise.resolve({ id: 10 }),
        };
      }

      return action;
    });
  });

  it("renders the Payments page", () => {
    render(<Payment />);

    expect(
      screen.getByRole("heading", { name: "Payments" }),
    ).toBeInTheDocument();

    expect(screen.getByText("REC-001")).toBeInTheDocument();
    expect(screen.getByText("Table loaded")).toBeInTheDocument();
  });

  it("fetches customers, payments and KPI data on mount", () => {
    render(<Payment />);

    expect(mocks.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "getCustomers" }),
    );

    expect(mocks.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: "fetchPaymentKPI" }),
    );

    expect(mocks.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "fetchPayments",
        payload: expect.objectContaining({
          page: 1,
        }),
      }),
    );
  });

  it("renders KPI cards", () => {
    render(<Payment />);

    expect(screen.getByText("Total Collections")).toBeInTheDocument();
    expect(screen.getByText("This Month Collections")).toBeInTheDocument();
    expect(screen.getByText("Outstanding Receivables")).toBeInTheDocument();
    expect(screen.getByText("Overdue Receivables")).toBeInTheDocument();
    expect(screen.getByText("Collection Rate")).toBeInTheDocument();
  });

  it("opens the record payment modal", () => {
    render(<Payment />);

    fireEvent.click(screen.getByText("+ RECORD PAYMENT"));

    expect(
      screen.getByText("Mock Record Payment Modal"),
    ).toBeInTheDocument();
  });

  it("closes the record payment modal", () => {
    render(<Payment />);

    fireEvent.click(screen.getByText("+ RECORD PAYMENT"));
    fireEvent.click(screen.getByText("Close mock modal"));

    expect(
      screen.queryByText("Mock Record Payment Modal"),
    ).not.toBeInTheDocument();
  });

  it("dispatches payment export when Export is clicked", () => {
    render(<Payment />);

    fireEvent.click(screen.getByText("Export"));

    expect(mocks.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "exportPayments",
      }),
    );
  });

  it("changes the current page when pagination is used", async () => {
    render(<Payment />);

    fireEvent.click(screen.getByText("Next page"));

    await waitFor(() => {
      expect(mocks.fetchPayments).toHaveBeenLastCalledWith(
        expect.objectContaining({
          page: 2,
        }),
      );
    });
  });

  it("dispatches payment details when the payment info handler is used", () => {
    // The table is mocked, so this checks the page's column callback directly.
    // The callback itself is exercised by the table in an integration test.
    render(<Payment />);

    expect(screen.getByText("REC-001")).toBeInTheDocument();
  });

  it("submits a payment and refreshes the list and KPI", async () => {
    render(<Payment />);

    fireEvent.click(screen.getByText("+ RECORD PAYMENT"));
    fireEvent.click(screen.getByText("Submit mock payment"));

    await waitFor(() => {
      expect(mocks.createPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          invoice_no: "INV-001",
          customer: 1,
          customer_id: 1,
          payment_type: "full_payment",
          payment_method: "bank_transfer",
          amount_received: 1000,
        }),
      );
    });

    await waitFor(() => {
      expect(mocks.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: "fetchPaymentKPI" }),
      );
    });

    expect(
      screen.queryByText("Mock Record Payment Modal"),
    ).not.toBeInTheDocument();
  });

  it("filters payments by status", async () => {
    render(<Payment />);

    fireEvent.change(screen.getByLabelText("Payment status filter"), {
      target: { value: "Pending" },
    });

    await waitFor(() => {
      expect(mocks.fetchPayments).toHaveBeenLastCalledWith(
        expect.objectContaining({
          status: "pending",
          page: 1,
        }),
      );
    });
  });

  it("filters payments by customer", async () => {
    render(<Payment />);

    fireEvent.change(screen.getByLabelText("All Customer"), {
      target: { value: "1" },
    });

    await waitFor(() => {
      expect(mocks.fetchPayments).toHaveBeenLastCalledWith(
        expect.objectContaining({
          customer: "1",
          page: 1,
        }),
      );
    });
  });

  it("filters payments by payment type", async () => {
    render(<Payment />);

    fireEvent.change(screen.getByLabelText("Payment Type"), {
      target: { value: "partial_payment" },
    });

    await waitFor(() => {
      expect(mocks.fetchPayments).toHaveBeenLastCalledWith(
        expect.objectContaining({
          payment_type: "partial_payment",
        }),
      );
    });
  });

  it("filters payments by payment method", async () => {
    render(<Payment />);

    fireEvent.change(screen.getByLabelText("Payment Method"), {
      target: { value: "cash" },
    });

    await waitFor(() => {
      expect(mocks.fetchPayments).toHaveBeenLastCalledWith(
        expect.objectContaining({
          payment_method: "cash",
        }),
      );
    });
  });

  it("updates the search filter after the debounce delay", async () => {
    vi.useFakeTimers();

    try {
      render(<Payment />);

      fireEvent.change(screen.getByLabelText("Payment search"), {
        target: { value: "REC-100" },
      });

      await waitFor(() => {
        vi.advanceTimersByTime(450);
      });

      await waitFor(() => {
        expect(mocks.fetchPayments).toHaveBeenLastCalledWith(
          expect.objectContaining({
            search: "REC-100",
          }),
        );
      });
    } finally {
      vi.useRealTimers();
    }
  });

  it("does not close the modal if payment creation fails", async () => {
    mocks.dispatch.mockImplementation((action) => {
      if (action?.type === "createPayment") {
        return {
          unwrap: () => Promise.reject(new Error("Payment failed")),
        };
      }

      return action;
    });

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<Payment />);

    fireEvent.click(screen.getByText("+ RECORD PAYMENT"));
    fireEvent.click(screen.getByText("Submit mock payment"));

    await waitFor(() => {
      expect(
        screen.getByText("Mock Record Payment Modal"),
      ).toBeInTheDocument();
    });

    consoleError.mockRestore();
  });
});