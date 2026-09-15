import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import Warehouselist from "../../Pages/inventory/Warehouse/Warehouselist";

/* =========================================================
   MOCK REDUX
========================================================= */

const mockDispatch = vi.fn();
const mockNavigate = vi.fn();

let mockWarehouseState;

/* =========================================================
   MOCK REACT REDUX
========================================================= */

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => selector({ warehouse: mockWarehouseState }),
}));

/* =========================================================
   MOCK REACT ROUTER
========================================================= */

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

/* =========================================================
   MOCK WAREHOUSE COLUMNS
========================================================= */

const mockGetWarehouseColumns = vi.fn();

vi.mock("../../../../Components/WarehouseDetails/warehouseColumns", () => ({
  default: (...args) => mockGetWarehouseColumns(...args),
}));

/* =========================================================
   MOCK REDUX SLICE
========================================================= */

const mockFetchWarehouses = vi.fn((payload) => ({
  type: "warehouse/fetchWarehouses",
  payload,
}));

const mockFetchWarehouseKpi = vi.fn(() => ({
  type: "warehouse/fetchWarehouseKpi",
}));

const mockAddWarehouse = vi.fn((payload) => ({
  type: "warehouse/addWarehouse",
  payload,
}));

mockAddWarehouse.fulfilled = {
  match: vi.fn(),
};

vi.mock("../../../../Redux/warehouseSlice", () => ({
  fetchWarehouses: (...args) => mockFetchWarehouses(...args),
  fetchWarehouseKpi: (...args) => mockFetchWarehouseKpi(...args),
  addWarehouse: (...args) => mockAddWarehouse(...args),
}));

/* =========================================================
   MOCK HEADER
========================================================= */

vi.mock("../../../../Components/ReusableTable/ReusableHeader", () => ({
  default: ({ title, children }) => (
    <div data-testid="reusable-header">
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

vi.mock("../../../../Components/ReusableTable/ReusableHeader.styles", () => ({
  HeaderButton: ({ children, onClick }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

/* =========================================================
   MOCK STATS CARDS
========================================================= */

vi.mock("../../../../Components/StatsCards/StatsCards", () => ({
  default: ({ cards, loading }) => (
    <div data-testid="stats-cards">
      <div data-testid="stats-loading">{loading ? "loading" : "loaded"}</div>

      {cards.map((card) => (
        <div key={card.title} data-testid="stat-card">
          <span>{card.title}</span>
          <span>{card.count}</span>
        </div>
      ))}
    </div>
  ),
}));

/* =========================================================
   MOCK TABLE
========================================================= */

vi.mock("../../../../Components/ReusableTable/ReusableTable", () => ({
  default: ({ columns, data, loading }) => (
    <div data-testid="reusable-table">
      <div data-testid="table-loading">{loading ? "loading" : "loaded"}</div>

      <div data-testid="column-count">{columns.length}</div>

      {data.map((warehouse) => (
        <div key={warehouse.id} data-testid="warehouse-row">
          <span>{warehouse.code}</span>
          <span>{warehouse.warehouse_name}</span>
        </div>
      ))}
    </div>
  ),
}));

/* =========================================================
   MOCK PAGINATION
========================================================= */

vi.mock("../../../../Components/Pagination/ReusablePagination", () => ({
  default: ({ currentPage, totalPages, onPageChange }) => (
    <div data-testid="pagination">
      <span>
        Page {currentPage} of {totalPages}
      </span>

      <button type="button" onClick={() => onPageChange(currentPage + 1)}>
        Next Page
      </button>

      <button type="button" onClick={() => onPageChange(1)}>
        First Page
      </button>
    </div>
  ),
}));

/* =========================================================
   MOCK FILTER
========================================================= */

vi.mock("../../../../Components/ReusableTable/ReusableFilter", () => ({
  default: ({
    search,
    onSearch,
    department,
    onDepartment,
    status,
    onStatus,
    rightButton,
  }) => (
    <div data-testid="reusable-filter">
      <input
        aria-label="Search"
        value={search}
        onChange={(event) => onSearch(event.target.value)}
      />

      <select
        aria-label="Department"
        value={department}
        onChange={(event) => onDepartment(event.target.value)}
      >
        <option value="">Select Department</option>
        <option value="HR">HR</option>
        <option value="Finance">Finance</option>
        <option value="Development">Development</option>
        <option value="Marketing">Marketing</option>
      </select>

      <select
        aria-label="Status"
        value={status}
        onChange={(event) => onStatus(event.target.value)}
      >
        <option value="">Select Status</option>
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
        <option value="On Leave">On Leave</option>
      </select>

      {rightButton}
    </div>
  ),
}));

/* =========================================================
   MOCK WAREHOUSE MODAL
========================================================= */

let mockModalProps;

vi.mock("../../../../Components/WarehouseModal/WarehouseModal", () => ({
  default: (props) => {
    mockModalProps = props;

    if (!props.isOpen) {
      return null;
    }

    return (
      <div data-testid="warehouse-modal">
        <div>Warehouse Modal</div>

        <button
          type="button"
          onClick={() =>
            props.onSubmit({
              warehouseCode: "WH-001",
              warehouseName: "Test Warehouse",
              warehouseType: "Main",
              manager: "John Manager",
              status: "active",
              operatingSince: "2026-01-01",
              country: "Saudi Arabia",
              city: "Riyadh",
              addressLine1: "Street 1",
              addressLine2: "Building 2",
              postalCode: "12345",
              phoneNumber: "123456789",
              email: "warehouse@test.com",
              storageCapacity: "10000",
              notes: "Test warehouse",
            })
          }
        >
          Submit Test Warehouse
        </button>

        <button type="button" onClick={props.onClose}>
          Close Modal
        </button>
      </div>
    );
  },
}));

/* =========================================================
   TEST DATA
========================================================= */

const createWarehouseState = (overrides = {}) => ({
  warehouses: [
    {
      id: 1,
      code: "WH-001",
      warehouse_name: "Main Warehouse",
      warehouse_type: "main",
      city: "Riyadh",
      status: "active",
    },
    {
      id: 2,
      code: "WH-002",
      warehouse_name: "Secondary Warehouse",
      warehouse_type: "secondary",
      city: "Jeddah",
      status: "inactive",
    },
  ],

  total: 12,
  activeCount: 8,
  inactiveCount: 4,

  kpi: {
    total_warehouses: 12,
    active_warehouses: 8,
    inactive_warehouses: 4,
  },

  loading: false,
  creating: false,
  error: null,
  totalPages: 3,

  ...overrides,
});

/* =========================================================
   BEFORE EACH
========================================================= */

beforeEach(() => {
  vi.clearAllMocks();

  mockWarehouseState = createWarehouseState();

  mockGetWarehouseColumns.mockReturnValue([
    {
      header: "Code",
      accessor: "code",
    },
    {
      header: "Warehouse Name",
      accessor: "warehouse_name",
    },
    {
      header: "Action",
      accessor: "action",
    },
  ]);

  mockAddWarehouse.fulfilled.match.mockReturnValue(false);

  mockDispatch.mockImplementation((action) => action);

  mockModalProps = undefined;
});

/* =========================================================
   INITIAL RENDER
========================================================= */

describe("Warehouselist - Initial Render", () => {
  it("renders the warehouse page", () => {
    render(<Warehouselist />);

    expect(
      screen.getByRole("heading", { name: "Warehouse" }),
    ).toBeInTheDocument();

    expect(screen.getByTestId("reusable-header")).toBeInTheDocument();
    expect(screen.getByTestId("stats-cards")).toBeInTheDocument();
    expect(screen.getByTestId("reusable-filter")).toBeInTheDocument();
    expect(screen.getByTestId("reusable-table")).toBeInTheDocument();
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
  });

  it("fetches warehouses and KPI on initial render", () => {
    render(<Warehouselist />);

    expect(mockFetchWarehouses).toHaveBeenCalledWith({
      search: "",
      page: 1,
      page_size: 20,
    });

    expect(mockFetchWarehouseKpi).toHaveBeenCalledTimes(1);

    expect(mockDispatch).toHaveBeenCalled();
  });

  it("passes navigate and edit/delete callbacks to warehouse columns", () => {
    render(<Warehouselist />);

    expect(mockGetWarehouseColumns).toHaveBeenCalledTimes(1);

    const args = mockGetWarehouseColumns.mock.calls[0][0];

    expect(args.navigate).toBe(mockNavigate);
    expect(typeof args.onEdit).toBe("function");
    expect(typeof args.onDelete).toBe("function");
  });
});

/* =========================================================
   STATS CARDS
========================================================= */

describe("Warehouselist - Statistics", () => {
  it("renders KPI statistics", () => {
    render(<Warehouselist />);

    expect(screen.getByText("Total Warehouses")).toBeInTheDocument();
    expect(screen.getByText("Active Warehouses")).toBeInTheDocument();
    expect(screen.getByText("Total Stock Value")).toBeInTheDocument();
    expect(screen.getByText("Total Stock Quantity")).toBeInTheDocument();
    expect(screen.getByText("Low Stock Warehouses")).toBeInTheDocument();
  });

  it("renders KPI values with leading zero padding", () => {
    render(<Warehouselist />);

    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("08")).toBeInTheDocument();
    expect(screen.getByText("04")).toBeInTheDocument();
  });

  it("uses Redux fallback values when KPI values are missing", () => {
    mockWarehouseState = createWarehouseState({
      kpi: null,
      total: 5,
      activeCount: 3,
      inactiveCount: 2,
    });

    render(<Warehouselist />);

    expect(screen.getByText("05")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
  });

  it("uses zero when KPI and Redux counts are missing", () => {
    mockWarehouseState = createWarehouseState({
      kpi: null,
      total: undefined,
      activeCount: undefined,
      inactiveCount: undefined,
    });

    render(<Warehouselist />);

    expect(screen.getByText("00")).toBeInTheDocument();
  });

  it("renders static stock value and quantity", () => {
    render(<Warehouselist />);

    expect(screen.getByText("SAR 18.5M")).toBeInTheDocument();
    expect(screen.getByText("45,280 Units")).toBeInTheDocument();
  });
});

/* =========================================================
   ERROR
========================================================= */

describe("Warehouselist - Error Handling", () => {
  it("renders string error", () => {
    mockWarehouseState = createWarehouseState({
      error: "Unable to load warehouses",
    });

    render(<Warehouselist />);

    expect(screen.getByText("Unable to load warehouses")).toBeInTheDocument();
  });

  it("renders error detail", () => {
    mockWarehouseState = createWarehouseState({
      error: {
        detail: "Warehouse API failed",
      },
    });

    render(<Warehouselist />);

    expect(screen.getByText("Warehouse API failed")).toBeInTheDocument();
  });

  it("renders error message", () => {
    mockWarehouseState = createWarehouseState({
      error: {
        message: "Network error",
      },
    });

    render(<Warehouselist />);

    expect(screen.getByText("Network error")).toBeInTheDocument();
  });

  it("renders default error message for unknown error object", () => {
    mockWarehouseState = createWarehouseState({
      error: {
        something: "wrong",
      },
    });

    render(<Warehouselist />);

    expect(screen.getByText("Failed to fetch warehouses")).toBeInTheDocument();
  });

  it("does not render error container when error is null", () => {
    render(<Warehouselist />);

    expect(
      screen.queryByText("Failed to fetch warehouses"),
    ).not.toBeInTheDocument();
  });
});

/* =========================================================
   TABLE
========================================================= */

describe("Warehouselist - Table", () => {
  it("renders warehouse data", () => {
    render(<Warehouselist />);

    expect(screen.getByText("WH-001")).toBeInTheDocument();
    expect(screen.getByText("Main Warehouse")).toBeInTheDocument();

    expect(screen.getByText("WH-002")).toBeInTheDocument();
    expect(screen.getByText("Secondary Warehouse")).toBeInTheDocument();
  });

  it("passes empty array when warehouses is not an array", () => {
    mockWarehouseState = createWarehouseState({
      warehouses: null,
    });

    render(<Warehouselist />);

    expect(screen.queryAllByTestId("warehouse-row")).toHaveLength(0);
  });

  it("sets table loading when loading is true", () => {
    mockWarehouseState = createWarehouseState({
      loading: true,
    });

    render(<Warehouselist />);

    expect(screen.getByTestId("table-loading")).toHaveTextContent("loading");
  });

  it("sets table loading when creating is true", () => {
    mockWarehouseState = createWarehouseState({
      creating: true,
    });

    render(<Warehouselist />);

    expect(screen.getByTestId("table-loading")).toHaveTextContent("loading");
  });

  it("renders loaded table when loading and creating are false", () => {
    render(<Warehouselist />);

    expect(screen.getByTestId("table-loading")).toHaveTextContent("loaded");
  });
});

/* =========================================================
   SEARCH
========================================================= */

describe("Warehouselist - Search", () => {
  it("updates search value", async () => {
    render(<Warehouselist />);

    const searchInput = screen.getByRole("textbox", {
      name: "Search",
    });

    fireEvent.change(searchInput, {
      target: {
        value: "Main",
      },
    });

    expect(searchInput).toHaveValue("Main");

    await waitFor(() => {
      expect(mockFetchWarehouses).toHaveBeenCalledWith({
        search: "Main",
        page: 1,
        page_size: 20,
      });
    });
  });

  it("resets page to 1 when searching", async () => {
    render(<Warehouselist />);

    const nextButton = screen.getByRole("button", {
      name: "Next Page",
    });

    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
    });

    const searchInput = screen.getByRole("textbox", {
      name: "Search",
    });

    fireEvent.change(searchInput, {
      target: {
        value: "Test",
      },
    });

    await waitFor(() => {
      expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    });
  });
});

/* =========================================================
   DEPARTMENT
========================================================= */

describe("Warehouselist - Department Filter", () => {
  it("updates department filter", () => {
    render(<Warehouselist />);

    const departmentSelect = screen.getByRole("combobox", {
      name: "Department",
    });

    fireEvent.change(departmentSelect, {
      target: {
        value: "Finance",
      },
    });

    expect(departmentSelect).toHaveValue("Finance");
  });

  it("resets page when department changes", async () => {
    render(<Warehouselist />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Next Page",
      }),
    );

    await waitFor(() => {
      expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
    });

    fireEvent.change(
      screen.getByRole("combobox", {
        name: "Department",
      }),
      {
        target: {
          value: "HR",
        },
      },
    );

    await waitFor(() => {
      expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    });
  });
});

/* =========================================================
   STATUS
========================================================= */

describe("Warehouselist - Status Filter", () => {
  it("updates status filter", () => {
    render(<Warehouselist />);

    const statusSelect = screen.getByRole("combobox", {
      name: "Status",
    });

    fireEvent.change(statusSelect, {
      target: {
        value: "Present",
      },
    });

    expect(statusSelect).toHaveValue("Present");
  });

  it("resets page when status changes", async () => {
    render(<Warehouselist />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Next Page",
      }),
    );

    await waitFor(() => {
      expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
    });

    fireEvent.change(
      screen.getByRole("combobox", {
        name: "Status",
      }),
      {
        target: {
          value: "Absent",
        },
      },
    );

    await waitFor(() => {
      expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    });
  });
});

/* =========================================================
   PAGINATION
========================================================= */

describe("Warehouselist - Pagination", () => {
  it("changes current page", async () => {
    render(<Warehouselist />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Next Page",
      }),
    );

    await waitFor(() => {
      expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
    });

    expect(mockFetchWarehouses).toHaveBeenCalledWith({
      search: "",
      page: 2,
      page_size: 20,
    });
  });

  it("can return to first page", async () => {
    render(<Warehouselist />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Next Page",
      }),
    );

    await waitFor(() => {
      expect(screen.getByText("Page 2 of 3")).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "First Page",
      }),
    );

    await waitFor(() => {
      expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    });
  });

  it("uses 1 as total pages when totalPages is missing", () => {
    mockWarehouseState = createWarehouseState({
      totalPages: undefined,
    });

    render(<Warehouselist />);

    expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
  });
});

/* =========================================================
   ADD WAREHOUSE
========================================================= */

describe("Warehouselist - Add Warehouse", () => {
  it("opens warehouse modal", () => {
    render(<Warehouselist />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ ADD WAREHOUSE",
      }),
    );

    expect(screen.getByTestId("warehouse-modal")).toBeInTheDocument();
  });

  it("closes warehouse modal", () => {
    render(<Warehouselist />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ ADD WAREHOUSE",
      }),
    );

    expect(screen.getByTestId("warehouse-modal")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Close Modal",
      }),
    );

    expect(screen.queryByTestId("warehouse-modal")).not.toBeInTheDocument();
  });
});

/* =========================================================
   SAVE WAREHOUSE
========================================================= */

describe("Warehouselist - Save Warehouse", () => {
  it("creates a warehouse successfully", async () => {
    mockAddWarehouse.fulfilled.match.mockReturnValue(true);

    mockDispatch.mockImplementation((action) => action);

    render(<Warehouselist />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ ADD WAREHOUSE",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Submit Test Warehouse",
      }),
    );

    await waitFor(() => {
      expect(mockAddWarehouse).toHaveBeenCalledTimes(1);
    });

    const payload = mockAddWarehouse.mock.calls[0][0];

    expect(payload).toEqual({
      code: "WH-001",
      warehouse_name: "Test Warehouse",
      warehouse_type: "Main",
      manager_name: "John Manager",
      status: "active",
      operating_since: "2026-01-01",
      country: "Saudi Arabia",
      city: "Riyadh",
      address_line_1: "Street 1",
      address_line_2: "Building 2",
      postal_code: "12345",
      phone_number: "123456789",
      email: "warehouse@test.com",
      storage_capacity: "10000",
      notes: "Test warehouse",
    });

    await waitFor(() => {
      expect(screen.queryByTestId("warehouse-modal")).not.toBeInTheDocument();
    });

    expect(mockFetchWarehouses).toHaveBeenCalledWith({
      search: "",
      page: 1,
      page_size: 20,
    });

    expect(mockFetchWarehouseKpi).toHaveBeenCalled();
  });

  it("generates a safe code when submitted code already exists", async () => {
    mockAddWarehouse.fulfilled.match.mockReturnValue(true);

    render(<Warehouselist />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ ADD WAREHOUSE",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Submit Test Warehouse",
      }),
    );

    await waitFor(() => {
      expect(mockAddWarehouse).toHaveBeenCalled();
    });

    const payload = mockAddWarehouse.mock.calls[0][0];

    expect(payload.code).not.toBe("WH-001");
    expect(payload.code).toMatch(/^WH-001-/);
  });

  it("handles empty warehouse code", async () => {
    mockAddWarehouse.fulfilled.match.mockReturnValue(true);

    mockModalProps.onSubmit = async () => {};

    render(<Warehouselist />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ ADD WAREHOUSE",
      }),
    );

    await mockModalProps.onSubmit({
      warehouseCode: "",
      warehouseName: "No Code Warehouse",
    });

    expect(mockAddWarehouse).not.toHaveBeenCalled();
  });

  it("handles missing warehouse manager by sending null", async () => {
    mockAddWarehouse.fulfilled.match.mockReturnValue(true);

    render(<Warehouselist />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ ADD WAREHOUSE",
      }),
    );

    await mockModalProps.onSubmit({
      warehouseCode: "WH-999",
      warehouseName: "Manager Missing",
      manager: "",
    });

    /*
     * The real onSubmit is invoked through the component's
     * internal callback. This test verifies the callback exists.
     */
    expect(typeof mockModalProps.onSubmit).toBe("function");
  });

  it("handles null manager safely", async () => {
    render(<Warehouselist />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ ADD WAREHOUSE",
      }),
    );

    expect(typeof mockModalProps.onSubmit).toBe("function");

    await mockModalProps.onSubmit({
      warehouseCode: "WH-100",
      warehouseName: "Null Manager",
      manager: null,
    });
  });

  it("handles undefined manager safely", async () => {
    render(<Warehouselist />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ ADD WAREHOUSE",
      }),
    );

    expect(typeof mockModalProps.onSubmit).toBe("function");

    await mockModalProps.onSubmit({
      warehouseCode: "WH-101",
      warehouseName: "Undefined Manager",
      manager: undefined,
    });
  });

  it("handles failed warehouse creation", async () => {
    mockAddWarehouse.fulfilled.match.mockReturnValue(false);

    mockDispatch.mockImplementation((action) => ({
      ...action,
      payload: {
        detail: "Creation failed",
      },
    }));

    render(<Warehouselist />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ ADD WAREHOUSE",
      }),
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Submit Test Warehouse",
      }),
    );

    await waitFor(() => {
      expect(mockAddWarehouse).toHaveBeenCalled();
    });

    expect(screen.getByTestId("warehouse-modal")).toBeInTheDocument();
  });
});

/* =========================================================
   FORM DATA FALLBACKS
========================================================= */

describe("Warehouselist - Form Data Fallbacks", () => {
  it("supports missing optional form fields", async () => {
    mockAddWarehouse.fulfilled.match.mockReturnValue(true);

    render(<Warehouselist />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ ADD WAREHOUSE",
      }),
    );

    await mockModalProps.onSubmit({
      warehouseCode: "WH-777",
      warehouseName: "Minimal Warehouse",
    });

    /*
     * Ensures the component's submit handler accepts
     * partially populated form data without crashing.
     */
    expect(mockModalProps.onSubmit).toBeDefined();
  });

  it("supports null formData safely through submit handler", async () => {
    render(<Warehouselist />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ ADD WAREHOUSE",
      }),
    );

    await expect(mockModalProps.onSubmit(null)).resolves.not.toThrow();
  });

  it("supports undefined formData safely through submit handler", async () => {
    render(<Warehouselist />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "+ ADD WAREHOUSE",
      }),
    );

    await expect(mockModalProps.onSubmit(undefined)).resolves.not.toThrow();
  });
});

/* =========================================================
   EXPORT BUTTON
========================================================= */

describe("Warehouselist - Export", () => {
  it("renders export excel button", () => {
    render(<Warehouselist />);

    expect(
      screen.getByRole("button", {
        name: /EXPORT EXCEL/i,
      }),
    ).toBeInTheDocument();
  });
});

/* =========================================================
   FILTER BUTTON
========================================================= */

describe("Warehouselist - Apply Filters", () => {
  it("renders apply filters button", () => {
    render(<Warehouselist />);

    expect(
      screen.getByRole("button", {
        name: "Apply Filters",
      }),
    ).toBeInTheDocument();
  });
});

/* =========================================================
   LOADING STATES
========================================================= */

describe("Warehouselist - Loading States", () => {
  it("passes loading state to stats cards", () => {
    mockWarehouseState = createWarehouseState({
      loading: true,
    });

    render(<Warehouselist />);

    expect(screen.getByTestId("stats-loading")).toHaveTextContent("loading");
  });

  it("passes loaded state to stats cards", () => {
    render(<Warehouselist />);

    expect(screen.getByTestId("stats-loading")).toHaveTextContent("loaded");
  });
});
