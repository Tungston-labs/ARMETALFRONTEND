import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  navigate: vi.fn(),
  state: {
    deliveryNotes: [],
    kpi: {},
    totalItems: 0,
    totalPages: 1,
    loading: false,
    error: null,
  },
  fetchDeliveryNotes: vi.fn((payload) => ({
    type: "deliveryNotes/fetch",
    payload,
  })),
  fetchDeliveryNoteKpi: vi.fn(() => ({
    type: "deliveryNotes/kpi",
  })),
  removeDeliveryNote: vi.fn((id) => ({
    type: "deliveryNotes/remove",
    payload: id,
  })),
}));

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: (selector) => selector({ deliveryNotes: mocks.state }),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mocks.navigate,
}));

vi.mock("../../../../Redux/finance/Sales/deliveryNotesSlice", () => ({
  fetchDeliveryNotes: mocks.fetchDeliveryNotes,
  fetchDeliveryNoteKpi: mocks.fetchDeliveryNoteKpi,
  removeDeliveryNote: mocks.removeDeliveryNote,
}));

vi.mock("../../../../Components/ReusableTable/ReusableHeader", () => ({
  default: ({ title, onButtonClick, children }) => (
    <div>
      <h1>{title}</h1>
      <button onClick={onButtonClick}>Create</button>
      {children}
    </div>
  ),
}));

vi.mock("../../../../Components/ReusableTable/ReusableFilter", () => ({
  default: ({ onSearch, onStatus, filters, onFilterClick }) => (
    <div>
      <input
        aria-label="Search delivery notes"
        onChange={(e) => onSearch(e.target.value)}
      />

      <select
        aria-label="Status filter"
        onChange={(e) => onStatus(e.target.value)}
      >
        <option value="">All statuses</option>
        <option value="Delivered">Delivered</option>
        <option value="Pending">Pending</option>
        <option value="Partially">Partially</option>
      </select>

      <select
        aria-label="Customer filter"
        value={filters?.[0]?.value || ""}
        onChange={(e) => filters?.[0]?.onChange(e.target.value)}
      >
        <option value="">All customers</option>
        <option value="ABC Trading">ABC Trading</option>
        <option value="Riyadh Tech">Riyadh Tech</option>
      </select>

      <button onClick={onFilterClick}>Apply filters</button>
    </div>
  ),
}));

vi.mock("../../../../Components/ReusableTable/ReusableTable", () => ({
  default: ({ columns, data }) => (
    <table>
      <tbody>
        {data.map((row, index) => (
          <tr key={row.id || index}>
            {columns.map((column) => (
              <td key={column.header}>
                {column.render ? column.render(row) : row[column.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

vi.mock("../../../../Components/Pagination/ReusablePagination", () => ({
  default: ({ currentPage, onPageChange }) => (
    <div>
      <span>Page {currentPage}</span>
      <button onClick={() => onPageChange(currentPage + 1)}>Next page</button>
    </div>
  ),
}));

vi.mock("../../../../Components/StatsCards/StatsCards", () => ({
  default: ({ cards }) => (
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

import DeliveryNotes from "./DeliveryNotes";

describe("DeliveryNotes", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.state = {
      deliveryNotes: [],
      kpi: {},
      totalItems: 0,
      totalPages: 1,
      loading: false,
      error: null,
    };

    mocks.dispatch.mockImplementation((action) => {
      if (
        typeof action === "object" &&
        action.type === "deliveryNotes/remove"
      ) {
        return {
          unwrap: () => Promise.resolve({ success: true }),
        };
      }

      return action;
    });
  });

  it("renders the Delivery Notes page", () => {
    render(<DeliveryNotes />);

    expect(
      screen.getByRole("heading", { name: "Delivery Notes" }),
    ).toBeInTheDocument();

    expect(screen.getByText("Total Deliveries")).toBeInTheDocument();
    expect(screen.getByText("Delivery Value")).toBeInTheDocument();
  });

  it("fetches delivery notes and KPI on mount", async () => {
    render(<DeliveryNotes />);

    await waitFor(() => {
      expect(mocks.fetchDeliveryNotes).toHaveBeenCalled();
      expect(mocks.fetchDeliveryNoteKpi).toHaveBeenCalled();
    });
  });

  it("navigates when Create is clicked", () => {
    render(<DeliveryNotes />);

    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    expect(mocks.navigate).toHaveBeenCalledWith("add");
  });

  it("updates the search filter", async () => {
    render(<DeliveryNotes />);

    fireEvent.change(screen.getByLabelText("Search delivery notes"), {
      target: { value: "DN-001" },
    });

    await waitFor(() => {
      expect(mocks.fetchDeliveryNotes).toHaveBeenLastCalledWith(
        expect.objectContaining({
          search: "DN-001",
          page: 1,
          page_size: 10,
        }),
      );
    });
  });

  it("updates the status filter", async () => {
    render(<DeliveryNotes />);

    fireEvent.change(screen.getByLabelText("Status filter"), {
      target: { value: "Delivered" },
    });

    await waitFor(() => {
      expect(mocks.fetchDeliveryNotes).toHaveBeenLastCalledWith(
        expect.objectContaining({
          status: "Delivered",
        }),
      );
    });
  });

  it("updates the customer filter", async () => {
    render(<DeliveryNotes />);

    fireEvent.change(screen.getByLabelText("Customer filter"), {
      target: { value: "ABC Trading" },
    });

    await waitFor(() => {
      expect(mocks.fetchDeliveryNotes).toHaveBeenLastCalledWith(
        expect.objectContaining({
          customer: "ABC Trading",
        }),
      );
    });
  });

  it("displays delivery note rows", () => {
    mocks.state.deliveryNotes = [
      {
        id: 1,
        deliveryNoteNumber: "DN-001",
        salesOrderReference: "SO-001",
        customer: "ABC Trading",
        deliveryStatus: "Delivered",
        deliveryValue: 1200,
      },
    ];

    render(<DeliveryNotes />);

    expect(screen.getByText("DN-001")).toBeInTheDocument();
    expect(screen.getByText("SO-001")).toBeInTheDocument();
    expect(screen.getByText("ABC Trading")).toBeInTheDocument();
  });

  it("shows the loading message when loading is true", () => {
    mocks.state.loading = true;

    render(<DeliveryNotes />);

    expect(screen.getByText("Loading delivery notes...")).toBeInTheDocument();
  });

  it("shows the API error when error is a string", () => {
    mocks.state.error = "Unable to load records";

    render(<DeliveryNotes />);

    expect(screen.getByText("Unable to load records")).toBeInTheDocument();
  });

  it("shows a fallback error for a non-string error", () => {
    mocks.state.error = { detail: "Server error" };

    render(<DeliveryNotes />);

    expect(
      screen.getByText("Failed to load delivery notes"),
    ).toBeInTheDocument();
  });

  it("changes the page when pagination is clicked", async () => {
    render(<DeliveryNotes />);

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));

    expect(screen.getByText("Page 2")).toBeInTheDocument();

    await waitFor(() => {
      expect(mocks.fetchDeliveryNotes).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 2 }),
      );
    });
  });

  it("exports the current filter values when Export is clicked", () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<DeliveryNotes />);

    fireEvent.click(screen.getByRole("button", { name: /Export/i }));

    expect(logSpy).toHaveBeenCalledWith(
      "Export Delivery Notes",
      expect.objectContaining({
        search: "",
        status: "",
        customer: "",
      }),
    );

    logSpy.mockRestore();
  });

  it("confirms and dispatches deletion", async () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    mocks.state.deliveryNotes = [
      {
        id: 10,
        deliveryNoteNumber: "DN-010",
        customer: "ABC Trading",
      },
    ];

    render(<DeliveryNotes />);

    // The table's Action column renders DeliveryAction.
    fireEvent.click(screen.getByTitle("Actions"));
    fireEvent.click(screen.getByTitle("Delete Delivery Note"));

    expect(confirmSpy).toHaveBeenCalledWith(
      "Are you sure you want to delete this delivery note?",
    );

    await waitFor(() => {
      expect(mocks.removeDeliveryNote).toHaveBeenCalledWith(10);
    });

    confirmSpy.mockRestore();
  });
});
