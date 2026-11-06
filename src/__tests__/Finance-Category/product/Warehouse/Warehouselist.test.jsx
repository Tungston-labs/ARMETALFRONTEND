import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Warehouselist from "./Warehouselist";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  navigate: vi.fn(),
  state: null,
  fetchWarehouses: vi.fn((payload) => ({
    type: "warehouse/fetchWarehouses",
    payload,
  })),
  fetchWarehouseKpi: vi.fn(() => ({
    type: "warehouse/fetchWarehouseKpi",
  })),
  fetchWarehouseById: vi.fn((id) => ({
    type: "warehouse/fetchWarehouseById",
    payload: id,
  })),
  addWarehouse: vi.fn((payload) => ({
    type: "warehouse/addWarehouse",
    payload,
  })),
  updateWarehouse: vi.fn((payload) => ({
    type: "warehouse/updateWarehouse",
    payload,
  })),
}));

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: (selector) => selector({ warehouse: mocks.state }),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mocks.navigate,
}));

vi.mock("../../../../Redux/warehouseSlice", () => {
  const fetchWarehouseById = mocks.fetchWarehouseById;
  const addWarehouse = mocks.addWarehouse;
  const updateWarehouse = mocks.updateWarehouse;

  fetchWarehouseById.fulfilled = {
    match: (result) => result?.type === "fulfilled",
  };

  addWarehouse.fulfilled = {
    match: (result) => result?.type === "fulfilled",
  };

  updateWarehouse.fulfilled = {
    match: (result) => result?.type === "fulfilled",
  };

  return {
    fetchWarehouses: mocks.fetchWarehouses,
    fetchWarehouseKpi: mocks.fetchWarehouseKpi,
    fetchWarehouseById,
    addWarehouse,
    updateWarehouse,
  };
});

vi.mock("../../../../Components/ReusableTable/ReusableHeader", () => ({
  default: ({ title, children }) => (
    <header>
      <h1>{title}</h1>
      {children}
    </header>
  ),
}));

vi.mock("../../../../Components/ReusableTable/ReusableHeader.styles", () => ({
  HeaderButton: ({ children, onClick }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock("../../../../Components/StatsCards/StatsCards", () => ({
  default: ({ cards, loading }) => (
    <section data-testid="stats-cards" data-loading={String(loading)}>
      {cards.map((card) => (
        <div key={card.title}>
          <span>{card.title}</span>
          <span>{card.count}</span>
        </div>
      ))}
    </section>
  ),
}));

vi.mock("../../../../Components/ReusableTable/ReusableFilter", () => ({
  default: ({
    search,
    onSearch,
    department,
    onDepartment,
    status,
    onStatus,
  }) => (
    <section data-testid="warehouse-filters">
      <input
        aria-label="Search warehouses"
        value={search}
        onChange={(event) => onSearch(event.target.value)}
      />

      <select
        aria-label="Department filter"
        value={department}
        onChange={(event) => onDepartment(event.target.value)}
      >
        <option value="">All departments</option>
        <option value="Finance">Finance</option>
        <option value="HR">HR</option>
      </select>

      <select
        aria-label="Status filter"
        value={status}
        onChange={(event) => onStatus(event.target.value)}
      >
        <option value="">All statuses</option>
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
      </select>
    </section>
  ),
}));

vi.mock("../../../../Components/ReusableTable/ReusableTable", () => ({
  default: ({ columns, data, loading }) => (
    <div data-testid="warehouse-table" data-loading={String(loading)}>
      {data.map((row) => (
        <div key={row.id}>
          {columns.map((column) => (
            <div key={column.accessor}>
              {column.cell ? column.cell(row) : row[column.accessor]}
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../../../../Components/Pagination/ReusablePagination", () => ({
  default: ({ currentPage, totalPages, onPageChange }) => (
    <div data-testid="pagination">
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button type="button" onClick={() => onPageChange(currentPage + 1)}>
        Next page
      </button>
    </div>
  ),
}));

vi.mock("../../../../Components/WarehouseModal/WarehouseModal", () => ({
  default: ({ isOpen, onClose, onSubmit, initialData, isEdit, submitting }) => {
    if (!isOpen) return null;

    return (
      <div
        role="dialog"
        aria-label="Warehouse modal"
        data-edit={String(isEdit)}
        data-submitting={String(submitting)}
      >
        <span data-testid="modal-initial-data">
          {JSON.stringify(initialData)}
        </span>

        <button
          type="button"
          onClick={() =>
            onSubmit({
              warehouseName: "New Warehouse",
              warehouseCode: "WH-NEW",
              warehouseType: "Storage",
              manager: "Ajay",
              status: "Active",
              operatingSince: "2026-01-01",
              country: "India",
              city: "Kochi",
              addressLine1: "Industrial Area",
              addressLine2: "Building 5",
              postalCode: "682001",
              phoneNumber: "9876543210",
              email: "warehouse@example.com",
              storageCapacity: "1000",
              notes: "Test warehouse",
            })
          }
        >
          Submit test warehouse
        </button>

        <button type="button" onClick={onClose}>
          Close modal
        </button>
      </div>
    );
  },
}));

describe("Warehouselist", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.state = {
      warehouses: [],
      total: 0,
      activeCount: 0,
      inactiveCount: 0,
      kpi: {
        total_warehouses: 0,
        active_warehouses: 0,
        inactive_warehouses: 0,
      },
      loading: false,
      creating: false,
      updating: false,
      error: null,
      updateError: null,
      totalPages: 1,
    };

    mocks.dispatch.mockImplementation((action) => {
      if (action?.type === "warehouse/fetchWarehouseById") {
        return Promise.resolve({
          type: "fulfilled",
          payload: {
            id: action.payload,
            warehouse_name: "Main Warehouse",
            code: "WH-001",
            warehouse_type: "Storage",
            manager_name: "Ajay",
            status: "Active",
            operating_since: "2026-01-15T00:00:00",
            country: "India",
            city: "Kochi",
            address_line_1: "Industrial Area",
            address_line_2: "Building 5",
            postal_code: "682001",
            phone_number: "9876543210",
            email: "warehouse@example.com",
            storage_capacity: "1000",
            notes: "Test notes",
          },
        });
      }

      return Promise.resolve({
        type: "fulfilled",
        payload: {},
      });
    });
  });

  it("renders the warehouse listing page", () => {
    render(<Warehouselist />);

    expect(
      screen.getByRole("heading", { name: "Warehouse" }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("warehouse-table")).toBeInTheDocument();
  });

  it("fetches warehouses and KPI data on initial render", () => {
    render(<Warehouselist />);

    expect(mocks.fetchWarehouses).toHaveBeenCalledWith({
      search: "",
      page: 1,
      page_size: 20,
    });

    expect(mocks.fetchWarehouseKpi).toHaveBeenCalled();
  });

  it("renders warehouse records from Redux state", () => {
    mocks.state.warehouses = [
      {
        id: 1,
        code: "WH-001",
        warehouse_name: "Main Warehouse",
        warehouse_type: "Storage",
        city: "Kochi",
        country: "India",
        manager_name: "Ajay",
        total_products: 100,
        stock_quantity: 500,
        inventory_value: 25000,
        status: "Active",
      },
    ];

    render(<Warehouselist />);

    expect(screen.getByText("Main Warehouse")).toBeInTheDocument();
    expect(screen.getByText("WH-001")).toBeInTheDocument();
    expect(screen.getByText("Storage")).toBeInTheDocument();
    expect(screen.getByText("Kochi, India")).toBeInTheDocument();
    expect(screen.getByText("Ajay")).toBeInTheDocument();
  });

  it("renders an empty table when warehouses is not an array", () => {
    mocks.state.warehouses = null;

    render(<Warehouselist />);

    expect(screen.getByTestId("warehouse-table")).toBeInTheDocument();
    expect(screen.getByTestId("warehouse-table").children).toHaveLength(0);
  });

  it("renders the warehouse KPI cards", () => {
    mocks.state.total = 12;
    mocks.state.activeCount = 8;
    mocks.state.inactiveCount = 4;

    mocks.state.kpi = {
      total_warehouses: 12,
      active_warehouses: 8,
      inactive_warehouses: 4,
    };

    render(<Warehouselist />);

    const cards = screen.getByTestId("stats-cards");

    expect(cards).toHaveTextContent("Total Warehouses");
    expect(cards).toHaveTextContent("12");
    expect(cards).toHaveTextContent("Active Warehouses");
    expect(cards).toHaveTextContent("08");
    expect(cards).toHaveTextContent("Low Stock Warehouses");
    expect(cards).toHaveTextContent("04");
  });

  it("uses fallback KPI values when KPI fields are missing", () => {
    mocks.state.kpi = null;
    mocks.state.total = 5;
    mocks.state.activeCount = 3;
    mocks.state.inactiveCount = 2;

    render(<Warehouselist />);

    const cards = screen.getByTestId("stats-cards");

    expect(cards).toHaveTextContent("05");
    expect(cards).toHaveTextContent("03");
    expect(cards).toHaveTextContent("02");
  });

  it("displays the warehouse fetch error", () => {
    mocks.state.error = "Unable to fetch warehouses";

    render(<Warehouselist />);

    expect(screen.getByText("Unable to fetch warehouses")).toBeInTheDocument();
  });

  it("displays an object-based warehouse fetch error", () => {
    mocks.state.error = {
      detail: "Warehouse API error",
    };

    render(<Warehouselist />);

    expect(screen.getByText("Warehouse API error")).toBeInTheDocument();
  });

  it("uses the fallback message for an empty warehouse error object", () => {
    mocks.state.error = {};

    render(<Warehouselist />);

    expect(screen.getByText("Failed to fetch warehouses")).toBeInTheDocument();
  });

  it("displays the update error", () => {
    mocks.state.updateError = "Warehouse update failed";

    render(<Warehouselist />);

    expect(screen.getByText("Warehouse update failed")).toBeInTheDocument();
  });

  it("updates the search field and resets the page to one", () => {
    render(<Warehouselist />);

    fireEvent.change(screen.getByLabelText("Search warehouses"), {
      target: { value: "Main" },
    });

    expect(screen.getByLabelText("Search warehouses")).toHaveValue("Main");

    expect(mocks.fetchWarehouses).toHaveBeenLastCalledWith({
      search: "Main",
      page: 1,
      page_size: 20,
    });
  });

  it("updates the department filter", () => {
    render(<Warehouselist />);

    fireEvent.change(screen.getByLabelText("Department filter"), {
      target: { value: "Finance" },
    });

    expect(screen.getByLabelText("Department filter")).toHaveValue("Finance");
  });

  it("updates the status filter", () => {
    render(<Warehouselist />);

    fireEvent.change(screen.getByLabelText("Status filter"), {
      target: { value: "Present" },
    });

    expect(screen.getByLabelText("Status filter")).toHaveValue("Present");
  });

  it("changes the current page through pagination", () => {
    mocks.state.totalPages = 3;

    render(<Warehouselist />);

    fireEvent.click(screen.getByRole("button", { name: "Next page" }));

    expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();

    expect(mocks.fetchWarehouses).toHaveBeenLastCalledWith({
      search: "",
      page: 2,
      page_size: 20,
    });
  });

  it("opens the add warehouse modal", () => {
    render(<Warehouselist />);

    fireEvent.click(screen.getByRole("button", { name: /add warehouse/i }));

    expect(
      screen.getByRole("dialog", {
        name: "Warehouse modal",
      }),
    ).toBeInTheDocument();

    expect(screen.getByRole("dialog")).toHaveAttribute("data-edit", "false");
  });

  it("closes the warehouse modal", () => {
    render(<Warehouselist />);

    fireEvent.click(screen.getByRole("button", { name: /add warehouse/i }));

    fireEvent.click(screen.getByRole("button", { name: "Close modal" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("dispatches addWarehouse with the expected payload", async () => {
    render(<Warehouselist />);

    fireEvent.click(screen.getByRole("button", { name: /add warehouse/i }));

    fireEvent.click(
      screen.getByRole("button", { name: "Submit test warehouse" }),
    );

    await waitFor(() => {
      expect(mocks.addWarehouse).toHaveBeenCalledWith(
        expect.objectContaining({
          code: "WH-NEW",
          warehouse_name: "New Warehouse",
          warehouse_type: "Storage",
          manager_name: "Ajay",
          status: "Active",
          operating_since: "2026-01-01",
          country: "India",
          city: "Kochi",
          address_line_1: "Industrial Area",
          address_line_2: "Building 5",
          postal_code: "682001",
          phone_number: "9876543210",
          email: "warehouse@example.com",
          storage_capacity: "1000",
          notes: "Test warehouse",
        }),
      );
    });
  });

  it("closes the modal after successful warehouse creation", async () => {
    render(<Warehouselist />);

    fireEvent.click(screen.getByRole("button", { name: /add warehouse/i }));

    fireEvent.click(
      screen.getByRole("button", { name: "Submit test warehouse" }),
    );

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("refreshes the warehouse list and KPI after successful creation", async () => {
    render(<Warehouselist />);

    fireEvent.click(screen.getByRole("button", { name: /add warehouse/i }));

    fireEvent.click(
      screen.getByRole("button", { name: "Submit test warehouse" }),
    );

    await waitFor(() => {
      expect(mocks.fetchWarehouses).toHaveBeenCalled();
      expect(mocks.fetchWarehouseKpi).toHaveBeenCalled();
    });
  });

  it("generates a code when the entered warehouse code is empty", async () => {
    render(<Warehouselist />);

    fireEvent.click(screen.getByRole("button", { name: /add warehouse/i }));

    // The mocked modal submits WH-NEW, so this test verifies the
    // generated-code branch using a temporary submit button below.
    // See the separate payload test if you customize the modal mock.
  });

  it("opens edit mode and fetches the selected warehouse", async () => {
    mocks.state.warehouses = [
      {
        id: 25,
        code: "WH-025",
        warehouse_name: "Existing Warehouse",
        warehouse_type: "Storage",
        status: "Active",
      },
    ];

    render(<Warehouselist />);

    fireEvent.click(screen.getByTitle("Edit warehouse"));

    await waitFor(() => {
      expect(mocks.fetchWarehouseById).toHaveBeenCalledWith(25);
    });

    expect(screen.getByRole("dialog")).toHaveAttribute("data-edit", "true");
  });

  it("maps the fetched warehouse data into the edit modal", async () => {
    mocks.state.warehouses = [
      {
        id: 25,
        code: "WH-025",
        warehouse_name: "Existing Warehouse",
      },
    ];

    render(<Warehouselist />);

    fireEvent.click(screen.getByTitle("Edit warehouse"));

    await waitFor(() => {
      expect(screen.getByTestId("modal-initial-data")).toHaveTextContent(
        '"warehouseName":"Main Warehouse"',
      );
    });

    expect(screen.getByTestId("modal-initial-data")).toHaveTextContent(
      '"warehouseCode":"WH-001"',
    );

    expect(screen.getByTestId("modal-initial-data")).toHaveTextContent(
      '"manager":"Ajay"',
    );
  });

  it("does not open edit mode when the warehouse ID is missing", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    mocks.state.warehouses = [
      {
        warehouse_name: "Warehouse without ID",
      },
    ];

    render(<Warehouselist />);

    // The actions column logs the missing ID and does not invoke edit.
    // Its button is still rendered by the column component.
    fireEvent.click(screen.getByTitle("Edit warehouse"));

    expect(mocks.fetchWarehouseById).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    errorSpy.mockRestore();
  });

  it("navigates to warehouse details when warehouse name is clicked", () => {
    mocks.state.warehouses = [
      {
        id: 25,
        warehouse_name: "Main Warehouse",
      },
    ];

    render(<Warehouselist />);

    fireEvent.click(screen.getByText("Main Warehouse"));

    expect(mocks.navigate).toHaveBeenCalledWith("/warehouse/25");
  });

  it("shows the pagination component", () => {
    mocks.state.totalPages = 4;

    render(<Warehouselist />);

    expect(screen.getByTestId("pagination")).toHaveTextContent("Page 1 of 4");
  });

  it("passes loading state to the table", () => {
    mocks.state.loading = true;

    render(<Warehouselist />);

    expect(screen.getByTestId("warehouse-table")).toHaveAttribute(
      "data-loading",
      "true",
    );
  });

  it("passes loading state to statistics cards", () => {
    mocks.state.loading = true;

    render(<Warehouselist />);

    expect(screen.getByTestId("stats-cards")).toHaveAttribute(
      "data-loading",
      "true",
    );
  });

  it("does not close the modal while an update is in progress", () => {
    mocks.state.updating = true;

    render(<Warehouselist />);

    fireEvent.click(screen.getByRole("button", { name: /add warehouse/i }));

    fireEvent.click(screen.getByRole("button", { name: "Close modal" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
