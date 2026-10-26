import { renderHook, act } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import useSalesInvoices from "../../../Pages/FinanceModule/SALES/Invoices/UseSalesInvoices";

// --------------------------------------------------------------------
// vi.mock() factories are hoisted above every import in this file, so
// anything they close over must be created via vi.hoisted() rather
// than a plain module-level `let` (which would still be in the
// temporal dead zone when the factory first runs).
// --------------------------------------------------------------------
const mocks = vi.hoisted(() => {
  const state = { current: null, shouldFailRemove: false };

  const dispatch = vi.fn((action) => {
    if (action?.__thunk === "removeInvoice") {
      return {
        unwrap: () =>
          state.shouldFailRemove
            ? Promise.reject(new Error("Delete failed"))
            : Promise.resolve(action),
      };
    }
    if (action?.__thunk === "getInvoiceSummary") {
      return { unwrap: () => Promise.resolve(action) };
    }
    return action;
  });

  return { state, dispatch };
});

const captured = vi.hoisted(() => ({ onDelete: undefined }));

// --------------------------------------------------------------------
// Mock react-redux. useSelector reads from mocks.state.current so
// tests can adjust slice state; useDispatch returns a controllable
// mock that also fakes `.unwrap()` for the two thunks that use it.
// --------------------------------------------------------------------
vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: (selector) => selector(mocks.state.current),
}));

// --------------------------------------------------------------------
// Mock the Redux slice: every thunk/action creator returns a plain,
// inspectable object so we can assert both "was it called with the
// right params" and "did dispatch receive the right action".
// --------------------------------------------------------------------
vi.mock("../../../../Redux/finance/Sales/InvoiceSlice", () => ({
  getInvoices: vi.fn((params) => ({ __thunk: "getInvoices", params })),
  getInvoiceSummary: vi.fn((params) => ({
    __thunk: "getInvoiceSummary",
    params,
  })),
  getInvoiceCustomers: vi.fn(() => ({ __thunk: "getInvoiceCustomers" })),
  removeInvoice: vi.fn((id) => ({ __thunk: "removeInvoice", id })),
  clearInvoiceError: vi.fn(() => ({ __thunk: "clearInvoiceError" })),
  clearInvoiceMessage: vi.fn(() => ({ __thunk: "clearInvoiceMessage" })),
}));

// --------------------------------------------------------------------
// Mock the columns/stats module. Capturing the onDelete callback that
// the hook passes to getSalesInvoiceColumns lets us simulate a
// "delete" click on a table row without needing the real column defs.
// --------------------------------------------------------------------
vi.mock("./SalesInvoices.columns", () => ({
  getSalesInvoiceColumns: vi.fn((onDelete) => {
    captured.onDelete = onDelete;
    return [
      { header: "Invoice #", accessor: "invoice_number" },
      { header: "Status", accessor: "status" },
      { header: "Actions", accessor: "actions" },
    ];
  }),
  salesInvoiceStats: vi.fn((summary) => [
    { label: "mocked-stats", value: summary },
  ]),
}));

import {
  getInvoices,
  getInvoiceSummary,
  getInvoiceCustomers,
  removeInvoice,
  clearInvoiceError,
  clearInvoiceMessage,
} from "../../../Redux/finance/Sales/InvoiceSlice";
import {
  getSalesInvoiceColumns,
  salesInvoiceStats,
} from "../../../Pages/FinanceModule/SALES/Invoices/SalesInvoices.columns";

const buildState = (overrides = {}) => ({
  invoice: {
    invoices: [],
    totalItems: 0,
    totalPages: 0,
    loading: false,
    summary: null,
    summaryLoading: false,
    customers: [],
    deleteLoading: false,
    error: null,
    successMessage: null,
    ...overrides,
  },
});

const setState = (overrides = {}) => {
  mocks.state.current = buildState(overrides);
};

const FIXED_NOW = new Date("2026-09-15T00:00:00");

beforeEach(() => {
  vi.useFakeTimers().setSystemTime(FIXED_NOW);
  setState();
  mocks.state.shouldFailRemove = false;
  captured.onDelete = undefined;
  vi.clearAllMocks();
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("useSalesInvoices", () => {
  // ------------------------------------------------------------
  // Initial fetches on mount
  // ------------------------------------------------------------
  describe("initial mount", () => {
    test("fetches invoices with default page/ordering and current-month date range", () => {
      renderHook(() => useSalesInvoices());

      expect(getInvoices).toHaveBeenCalledWith({
        page: 1,
        page_size: 10,
        ordering: "-created_at",
        invoice_date_after: "2026-09-01",
        invoice_date_before: "2026-09-30",
      });
    });

    test("fetches the summary with empty params when no filters are set", () => {
      renderHook(() => useSalesInvoices());

      expect(getInvoiceSummary).toHaveBeenCalledWith({});
    });

    test("fetches the customer list once", () => {
      renderHook(() => useSalesInvoices());

      expect(getInvoiceCustomers).toHaveBeenCalledTimes(1);
      expect(getInvoiceCustomers).toHaveBeenCalledWith();
    });

    test("passes the delete callback into getSalesInvoiceColumns", () => {
      renderHook(() => useSalesInvoices());

      expect(getSalesInvoiceColumns).toHaveBeenCalledWith(
        expect.any(Function)
      );
    });

    test("exposes rowsPerPage and maps selector state to the return value", () => {
      setState({
        invoices: [{ id: 1 }],
        totalItems: 5,
        totalPages: 2,
        loading: true,
      });

      const { result } = renderHook(() => useSalesInvoices());

      expect(result.current.paginatedData).toEqual([{ id: 1 }]);
      expect(result.current.totalRecords).toBe(5);
      expect(result.current.totalPages).toBe(2);
      expect(result.current.loading).toBe(true);
      expect(result.current.rowsPerPage).toBe(10);
    });
  });

  // ------------------------------------------------------------
  // Filter handlers
  // ------------------------------------------------------------
  describe("filter handlers", () => {
    test("handleSearch trims the value, resets the page, and refetches", () => {
      const { result } = renderHook(() => useSalesInvoices());

      act(() => {
        result.current.handleSearch("  invoice-1  ");
      });

      expect(result.current.search).toBe("  invoice-1  ");
      expect(result.current.currentPage).toBe(1);
      expect(getInvoices).toHaveBeenLastCalledWith(
        expect.objectContaining({ search: "invoice-1" })
      );
    });

    test("blank search is not sent as a param", () => {
      const { result } = renderHook(() => useSalesInvoices());

      act(() => {
        result.current.handleSearch("   ");
      });

      const lastCall =
        getInvoices.mock.calls[getInvoices.mock.calls.length - 1][0];
      expect(lastCall).not.toHaveProperty("search");
    });

    test("handleStatus maps the UI label to the API payment_status value", () => {
      const { result } = renderHook(() => useSalesInvoices());

      act(() => {
        result.current.handleStatus("Partially Paid");
      });

      expect(getInvoices).toHaveBeenLastCalledWith(
        expect.objectContaining({ payment_status: "partially_paid" })
      );
      expect(getInvoiceSummary).toHaveBeenLastCalledWith(
        expect.objectContaining({ payment_status: "partially_paid" })
      );
    });

    test("handleCustomer sets the customer param on both invoices and summary fetches", () => {
      const { result } = renderHook(() => useSalesInvoices());

      act(() => {
        result.current.handleCustomer("cust-42");
      });

      expect(getInvoices).toHaveBeenLastCalledWith(
        expect.objectContaining({ customer: "cust-42" })
      );
      expect(getInvoiceSummary).toHaveBeenLastCalledWith(
        expect.objectContaining({ customer: "cust-42" })
      );
    });

    test.each([
      ["due_today", { due_date: "2026-09-15" }],
      [
        "due_week",
        {
          due_date_after: "2026-09-15",
          due_date_before: "2026-09-22",
        },
      ],
      ["overdue", { due_date_before: "2026-09-14" }],
      ["due_later", { due_date_after: "2026-09-22" }],
    ])("handleDueDate('%s') builds the correct params", (value, expected) => {
      const { result } = renderHook(() => useSalesInvoices());

      act(() => {
        result.current.handleDueDate(value);
      });

      expect(getInvoices).toHaveBeenLastCalledWith(
        expect.objectContaining(expected)
      );
    });
  });

  // ------------------------------------------------------------
  // Date range handlers
  // ------------------------------------------------------------
  describe("date range handlers", () => {
    test("handleStartDateChange updates startDate and resets the page", () => {
      const { result } = renderHook(() => useSalesInvoices());

      act(() => {
        result.current.handleStartDateChange({
          target: { value: "2026-09-05" },
        });
      });

      expect(result.current.startDate).toBe("2026-09-05");
      expect(result.current.currentPage).toBe(1);
    });

    test("handleStartDateChange clears the date on empty value", () => {
      const { result } = renderHook(() => useSalesInvoices());

      act(() => {
        result.current.handleStartDateChange({ target: { value: "" } });
      });

      expect(result.current.startDate).toBe("");
    });

    test("handleStartDateChange pushes endDate forward if it's now before startDate", () => {
      const { result } = renderHook(() => useSalesInvoices());

      // initial endDate defaults to end of current month (2026-09-30)
      act(() => {
        result.current.handleStartDateChange({
          target: { value: "2026-10-05" },
        });
      });

      expect(result.current.startDate).toBe("2026-10-05");
      expect(result.current.endDate).toBe("2026-10-05");
    });

    test("handleEndDateChange rejects a value earlier than startDate", () => {
      const { result } = renderHook(() => useSalesInvoices());

      act(() => {
        result.current.handleStartDateChange({
          target: { value: "2026-09-10" },
        });
      });
      const endDateBefore = result.current.endDate;

      act(() => {
        result.current.handleEndDateChange({
          target: { value: "2026-09-05" },
        });
      });

      expect(result.current.endDate).toBe(endDateBefore);
    });

    test("handleEndDateChange accepts a valid value", () => {
      const { result } = renderHook(() => useSalesInvoices());

      act(() => {
        result.current.handleStartDateChange({
          target: { value: "2026-09-10" },
        });
      });

      act(() => {
        result.current.handleEndDateChange({
          target: { value: "2026-09-20" },
        });
      });

      expect(result.current.endDate).toBe("2026-09-20");
    });

    test("handleEndDateChange clears the date on empty value", () => {
      const { result } = renderHook(() => useSalesInvoices());

      act(() => {
        result.current.handleEndDateChange({ target: { value: "" } });
      });

      expect(result.current.endDate).toBe("");
    });
  });

  // ------------------------------------------------------------
  // Pagination
  // ------------------------------------------------------------
  test("setCurrentPage triggers a refetch with the new page", () => {
    const { result } = renderHook(() => useSalesInvoices());

    act(() => {
      result.current.setCurrentPage(3);
    });

    expect(result.current.currentPage).toBe(3);
    expect(getInvoices).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 3 })
    );
  });

  // ------------------------------------------------------------
  // Error / success message auto-clear
  // ------------------------------------------------------------
  test("clears error and success messages after 4 seconds", () => {
    setState({
      error: "Something broke",
      successMessage: "Saved!",
    });

    renderHook(() => useSalesInvoices());

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(clearInvoiceError).toHaveBeenCalled();
    expect(clearInvoiceMessage).toHaveBeenCalled();
  });

  test("does not schedule a clear when there is no error or success message", () => {
    renderHook(() => useSalesInvoices());

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(clearInvoiceError).not.toHaveBeenCalled();
    expect(clearInvoiceMessage).not.toHaveBeenCalled();
  });

  // ------------------------------------------------------------
  // Delete flow
  // ------------------------------------------------------------
  describe("delete flow", () => {
    test("opening the modal requires an invoice id", () => {
      const { result } = renderHook(() => useSalesInvoices());

      act(() => {
        captured.onDelete({ invoice_number: "INV-NOID" }); // no id
      });

      expect(result.current.deleteModal.isOpen).toBe(false);
      expect(console.error).toHaveBeenCalled();
    });

    test("clicking delete on a row with an id opens the modal", () => {
      const { result } = renderHook(() => useSalesInvoices());
      const invoice = { id: 7, invoice_number: "INV-007" };

      act(() => {
        captured.onDelete(invoice);
      });

      expect(result.current.deleteModal).toEqual({
        isOpen: true,
        invoice,
        loading: false,
      });
    });

    test("handleDeleteCancel resets the modal state", () => {
      const { result } = renderHook(() => useSalesInvoices());

      act(() => {
        captured.onDelete({ id: 1 });
      });
      act(() => {
        result.current.handleDeleteCancel();
      });

      expect(result.current.deleteModal).toEqual({
        isOpen: false,
        invoice: null,
        loading: false,
      });
    });

    test("handleDeleteConfirm removes the invoice, closes the modal, and refreshes the summary", async () => {
      const { result } = renderHook(() => useSalesInvoices());

      act(() => {
        captured.onDelete({ id: 7, invoice_number: "INV-007" });
      });

      await act(async () => {
        await result.current.handleDeleteConfirm();
      });

      expect(removeInvoice).toHaveBeenCalledWith(7);
      expect(result.current.deleteModal).toEqual({
        isOpen: false,
        invoice: null,
        loading: false,
      });
      // Summary is re-fetched after a successful delete
      expect(getInvoiceSummary).toHaveBeenLastCalledWith({});
    });

    test("handleDeleteConfirm keeps the modal open and stops loading on failure", async () => {
      mocks.state.shouldFailRemove = true;
      const { result } = renderHook(() => useSalesInvoices());
      const invoice = { id: 9, invoice_number: "INV-009" };

      act(() => {
        captured.onDelete(invoice);
      });

      await act(async () => {
        await result.current.handleDeleteConfirm();
      });

      expect(result.current.deleteModal).toEqual({
        isOpen: true,
        invoice,
        loading: false,
      });
      expect(console.error).toHaveBeenCalled();
    });

    test("handleDeleteConfirm is a no-op when no invoice is staged for deletion", async () => {
      const { result } = renderHook(() => useSalesInvoices());

      await act(async () => {
        await result.current.handleDeleteConfirm();
      });

      expect(removeInvoice).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        "Cannot delete invoice: ID missing"
      );
    });
  });

  // ------------------------------------------------------------
  // Export
  // ------------------------------------------------------------
  describe("handleExport", () => {
    let createObjectURLSpy;
    let revokeObjectURLSpy;
    let clickSpy;

    beforeEach(() => {
      createObjectURLSpy = vi.fn(() => "blob:mock-url");
      revokeObjectURLSpy = vi.fn();
      global.URL.createObjectURL = createObjectURLSpy;
      global.URL.revokeObjectURL = revokeObjectURLSpy;
      clickSpy = vi
        .spyOn(HTMLAnchorElement.prototype, "click")
        .mockImplementation(() => {});
    });

    afterEach(() => {
      clickSpy.mockRestore();
    });

    test("does nothing when there is no data to export", () => {
      const { result } = renderHook(() => useSalesInvoices());

      act(() => {
        result.current.handleExport();
      });

      expect(createObjectURLSpy).not.toHaveBeenCalled();
      expect(clickSpy).not.toHaveBeenCalled();
    });

    test("builds and downloads a CSV, excluding the actions column", () => {
      setState({
        invoices: [{ invoice_number: "INV-001", status: "Paid" }],
      });

      const { result } = renderHook(() => useSalesInvoices());

      act(() => {
        result.current.handleExport();
      });

      expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
      expect(createObjectURLSpy.mock.calls[0][0]).toBeInstanceOf(Blob);
      expect(clickSpy).toHaveBeenCalledTimes(1);
      expect(revokeObjectURLSpy).toHaveBeenCalledWith("blob:mock-url");
    });
  });

  // ------------------------------------------------------------
  // Customer options mapping
  // ------------------------------------------------------------
  test("customerOptions maps customers, falling back across name fields", () => {
    setState({
      customers: [
        { id: 1, name: "Acme Co" },
        { id: 2, display_name: "Beta LLC" },
        { id: 3, customer_name: "Gamma Inc" },
        { id: 4 },
      ],
    });

    const { result } = renderHook(() => useSalesInvoices());

    expect(result.current.customerOptions).toEqual([
      { label: "Acme Co", value: "1" },
      { label: "Beta LLC", value: "2" },
      { label: "Gamma Inc", value: "3" },
      { label: "Unknown Customer", value: "4" },
    ]);
  });

  // ------------------------------------------------------------
  // Stats
  // ------------------------------------------------------------
  test("salesOrderStats is derived from the summary via salesInvoiceStats", () => {
    const summary = { paid: 10, unpaid: 5 };
    setState({ summary });

    renderHook(() => useSalesInvoices());

    expect(salesInvoiceStats).toHaveBeenCalledWith(summary);
  });

  test("salesOrderStats passes an empty object when summary is null", () => {
    renderHook(() => useSalesInvoices());

    expect(salesInvoiceStats).toHaveBeenCalledWith({});
  });
});