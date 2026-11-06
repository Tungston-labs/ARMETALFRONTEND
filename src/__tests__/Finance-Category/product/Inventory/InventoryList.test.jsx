import React from "react";

import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from "vitest";

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),

  getCategories: vi.fn(),
  fetchInventory: vi.fn(),
  fetchInventoryKPI: vi.fn(),

  createInventoryAdjustment: vi.fn(),
  updateInventoryAdjustment: vi.fn(),
  fetchInventoryAdjustmentById: vi.fn(),
  deleteInventoryAdjustment: vi.fn(),

  getWarehouses: vi.fn(),
  fetchProducts: vi.fn(),

  state: {
    inventory: {},
    category: {},
  },
}));

// REDUX MOCK

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,

  useSelector: (selector) =>
    selector(mocks.state),
}));

// INVENTORY REDUX MOCK

vi.mock(
  "../../../../Redux/finance/Product/inventorySlice",
  () => ({
    fetchInventory: mocks.fetchInventory,
    fetchInventoryKPI: mocks.fetchInventoryKPI,

    createInventoryAdjustment:
      mocks.createInventoryAdjustment,

    updateInventoryAdjustment:
      mocks.updateInventoryAdjustment,

    fetchInventoryAdjustmentById:
      mocks.fetchInventoryAdjustmentById,

    deleteInventoryAdjustment:
      mocks.deleteInventoryAdjustment,
  })
);

// CATEGORY REDUX MOCK

vi.mock(
  "../../../../Redux/finance/Product/categorySlice.js",
  () => ({
    getCategories: mocks.getCategories,
  })
);

// WAREHOUSE SERVICE MOCK

vi.mock(
  "../../../../services/warehouseService",
  () => ({
    getWarehouses: mocks.getWarehouses,
  })
);

// PRODUCT SERVICE MOCK

vi.mock(
  "../../../../services/finance/Product/productServices",
  () => ({
    fetchProducts: mocks.fetchProducts,
  })
);

// TABLE MOCK

vi.mock(
  "../../../../Components/ReusableTable/inventoryColumns.jsx",
  () => ({
    inventoryColumns: [],
  })
);

vi.mock(
  "../../../../Components/ReusableTable/ReusableTable",
  () => ({
    default: ({ data }) => (
      <div data-testid="inventory-table">
        {data.map((item) => (
          <div key={item.id}>
            {item.product_name || item.name || item.id}
          </div>
        ))}
      </div>
    ),
  })
);

// PAGINATION MOCK

vi.mock(
  "../../../../Components/Pagination/ReusablePagination",
  () => ({
    default: ({
      currentPage,
      totalPages,
      onPageChange,
    }) => (
      <div>
        <span data-testid="pagination">
          {currentPage}/{totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(2)}
        >
          Next page
        </button>
      </div>
    ),
  })
);

// FILTER MOCK

vi.mock(
  "../../../../Components/ReusableTable/ReusableFilter",
  () => ({
    default: ({
      search,
      onSearch,
      department,
      onDepartment,
      status,
      onStatus,
      filters,
      rightButton,
    }) => (
      <div>
        <input
          aria-label="Search inventory"
          value={search}
          onChange={(event) =>
            onSearch(event.target.value)
          }
        />

        <select
          aria-label="Category filter"
          value={department}
          onChange={(event) =>
            onDepartment(event.target.value)
          }
        >
          <option value="">All categories</option>
          <option value="5">Electrical</option>
        </select>

        <select
          aria-label="Status filter"
          value={status}
          onChange={(event) =>
            onStatus(event.target.value)
          }
        >
          <option value="">All statuses</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        <select
          aria-label="Warehouse filter"
          value={filters[0]?.value || ""}
          onChange={(event) =>
            filters[0]?.onChange(event.target.value)
          }
        >
          <option value="">All warehouses</option>
          <option value="9">Main Warehouse</option>
        </select>

        {rightButton}
      </div>
    ),
  })
);

// HEADER MOCK

vi.mock(
  "../../../../Components/ReusableTable/ReusableHeader",
  () => ({
    default: ({ children, title }) => (
      <header>
        <h1>{title}</h1>
        {children}
      </header>
    ),
  })
);

vi.mock(
  "../../../../Components/ReusableTable/ReusableHeader.styles",
  () => ({
    HeaderButton: ({ children, ...props }) => (
      <button type="button" {...props}>
        {children}
      </button>
    ),
  })
);

// MODAL MOCK

vi.mock(
  "../Inventory/InventoryModal/InventoryModal.jsx",
  () => ({
    default: ({
      isOpen,
      onClose,
      onSubmit,
      isEdit,
      submitting,
    }) =>
      isOpen ? (
        <div
          role="dialog"
          aria-label="Stock Adjustment Test Modal"
        >
          <span>
            {isEdit ? "Edit mode" : "Create mode"}
          </span>

          <button
            type="button"
            disabled={submitting}
            onClick={() =>
              onSubmit({
                product: "8",
                adjustmentQuantity: "2",
              })
            }
          >
            Submit adjustment
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
          >
            Close modal
          </button>
        </div>
      ) : null,
  })
);

import InventoryList from "./InventoryList";

// THUNK HELPERS

const makeThunkResult = (value = {}) => {
  const promise = Promise.resolve(value);

  promise.unwrap = () => Promise.resolve(value);

  return promise;
};

describe("InventoryList Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.state.inventory = {
      inventory: [],
      totalPages: 0,
      currentPage: 1,
      loading: false,
      adjustmentLoading: false,
      error: null,
      adjustmentError: null,
      selectedAdjustment: null,
    };

    mocks.state.category = {
      categories: [],
    };

    mocks.dispatch.mockImplementation(() =>
      makeThunkResult({})
    );

    mocks.getCategories.mockReturnValue({
      type: "categories/load",
    });

    mocks.fetchInventory.mockImplementation(
      (payload) => ({
        type: "inventory/load",
        payload,
      })
    );

    mocks.fetchInventoryKPI.mockReturnValue({
      type: "inventory/kpi",
    });

    mocks.createInventoryAdjustment.mockImplementation(
      (payload) => ({
        type: "inventory/create",
        payload,
      })
    );

    mocks.updateInventoryAdjustment.mockImplementation(
      (payload) => ({
        type: "inventory/update",
        payload,
      })
    );

    mocks.fetchInventoryAdjustmentById.mockReturnValue({
      type: "inventory/detail",
    });

    mocks.deleteInventoryAdjustment.mockReturnValue({
      type: "inventory/delete",
    });

    mocks.getWarehouses.mockResolvedValue([
      {
        id: 9,
        warehouse_name: "Main Warehouse",
      },
    ]);

    mocks.fetchProducts.mockResolvedValue([
      {
        id: 8,
        product_name: "Copper Wire",
      },
    ]);
  });

  // INITIAL RENDER

  it("should render inventory heading", () => {
    render(<InventoryList />);

    expect(
      screen.getByRole("heading", {
        name: "Inventory",
      })
    ).toBeInTheDocument();
  });

  it("should render stock adjustment button", () => {
    render(<InventoryList />);

    expect(
      screen.getByRole("button", {
        name: /stock adjustment/i,
      })
    ).toBeInTheDocument();
  });

  it("should render export button", () => {
    render(<InventoryList />);

    expect(
      screen.getByRole("button", {
        name: /export excel/i,
      })
    ).toBeInTheDocument();
  });

  // INITIAL API LOAD

  it("should load categories on mount", () => {
    render(<InventoryList />);

    expect(
      mocks.getCategories
    ).toHaveBeenCalledWith({
      page: 1,
      page_size: 100,
    });
  });

  it("should load warehouse options", async () => {
    render(<InventoryList />);

    await waitFor(() => {
      expect(
        mocks.getWarehouses
      ).toHaveBeenCalledWith({
        page: 1,
        page_size: 100,
      });
    });
  });

  it("should load product options", async () => {
    render(<InventoryList />);

    await waitFor(() => {
      expect(
        mocks.fetchProducts
      ).toHaveBeenCalledWith({
        page: 1,
        page_size: 100,
      });
    });
  });

  it("should fetch inventory on initial load", () => {
    render(<InventoryList />);

    expect(
      mocks.fetchInventory
    ).toHaveBeenCalledWith({
      page: 1,
      page_size: 20,
      search: "",
      category: "",
      warehouse: "",
      stock_status: "",
    });
  });

  it("should fetch inventory KPI on initial load", () => {
    render(<InventoryList />);

    expect(
      mocks.fetchInventoryKPI
    ).toHaveBeenCalled();
  });

  // INVENTORY TABLE

  it("should display inventory records", () => {
    mocks.state.inventory.inventory = [
      {
        id: 1,
        product_name: "Copper Wire",
      },
      {
        id: 2,
        product_name: "Steel Cable",
      },
    ];

    render(<InventoryList />);

    expect(
      screen.getByTestId("inventory-table")
    ).toHaveTextContent("Copper Wire");

    expect(
      screen.getByTestId("inventory-table")
    ).toHaveTextContent("Steel Cable");
  });

  it("should display loading state", () => {
    mocks.state.inventory.loading = true;

    render(<InventoryList />);

    expect(
      screen.getByText("Loading inventory...")
    ).toBeInTheDocument();
  });

  it("should hide table while loading", () => {
    mocks.state.inventory.loading = true;

    render(<InventoryList />);

    expect(
      screen.queryByTestId("inventory-table")
    ).not.toBeInTheDocument();
  });

  it("should display empty inventory message", () => {
    render(<InventoryList />);

    expect(
      screen.getByText("No inventory records found.")
    ).toBeInTheDocument();
  });

  // ERROR HANDLING

  it("should display inventory API error", () => {
    mocks.state.inventory.error =
      "Inventory loading failed";

    render(<InventoryList />);

    expect(
      screen.getByText("Inventory loading failed")
    ).toBeInTheDocument();
  });

  it("should display fallback inventory error", () => {
    mocks.state.inventory.error = {
      message: "Error",
    };

    render(<InventoryList />);

    expect(
      screen.getByText("Failed to load inventory.")
    ).toBeInTheDocument();
  });

  it("should display adjustment API error", () => {
    mocks.state.inventory.adjustmentError =
      "Adjustment failed";

    render(<InventoryList />);

    expect(
      screen.getByText("Adjustment failed")
    ).toBeInTheDocument();
  });

  it("should display fallback adjustment error", () => {
    mocks.state.inventory.adjustmentError = {
      message: "Error",
    };

    render(<InventoryList />);

    expect(
      screen.getByText(
        "Stock adjustment operation failed."
      )
    ).toBeInTheDocument();
  });

  // FILTERS

  it("should update search value", () => {
    render(<InventoryList />);

    fireEvent.change(
      screen.getByLabelText("Search inventory"),
      {
        target: {
          value: "Copper",
        },
      }
    );

    expect(
      screen.getByLabelText("Search inventory")
    ).toHaveValue("Copper");
  });

  it("should update category filter", () => {
    render(<InventoryList />);

    fireEvent.change(
      screen.getByLabelText("Category filter"),
      {
        target: {
          value: "5",
        },
      }
    );

    expect(
      screen.getByLabelText("Category filter")
    ).toHaveValue("5");
  });

  it("should update warehouse filter", () => {
    render(<InventoryList />);

    fireEvent.change(
      screen.getByLabelText("Warehouse filter"),
      {
        target: {
          value: "9",
        },
      }
    );

    expect(
      screen.getByLabelText("Warehouse filter")
    ).toHaveValue("9");
  });

  it("should update stock status filter", () => {
    render(<InventoryList />);

    fireEvent.change(
      screen.getByLabelText("Status filter"),
      {
        target: {
          value: "Low Stock",
        },
      }
    );

    expect(
      screen.getByLabelText("Status filter")
    ).toHaveValue("Low Stock");
  });

  it("should apply all selected filters", () => {
    render(<InventoryList />);

    fireEvent.change(
      screen.getByLabelText("Search inventory"),
      {
        target: {
          value: " Copper ",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Category filter"),
      {
        target: {
          value: "5",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Warehouse filter"),
      {
        target: {
          value: "9",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Status filter"),
      {
        target: {
          value: "Low Stock",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Apply Filters",
      })
    );

    expect(
      mocks.fetchInventory
    ).toHaveBeenLastCalledWith({
      page: 1,
      page_size: 20,
      search: "Copper",
      category: "5",
      warehouse: "9",
      stock_status: "Low Stock",
    });
  });

  // PAGINATION

  it("should display pagination", () => {
    mocks.state.inventory.totalPages = 3;

    render(<InventoryList />);

    expect(
      screen.getByTestId("pagination")
    ).toHaveTextContent("1/3");
  });

  it("should fetch inventory when page changes", () => {
    mocks.state.inventory.totalPages = 3;

    render(<InventoryList />);

    fireEvent.click(
      screen.getByRole("button", {
        name: "Next page",
      })
    );

    expect(
      mocks.fetchInventory
    ).toHaveBeenLastCalledWith({
      page: 2,
      page_size: 20,
      search: "",
      category: "",
      warehouse: "",
      stock_status: "",
    });
  });

  // CREATE MODAL

  it("should open create adjustment modal", () => {
    render(<InventoryList />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /stock adjustment/i,
      })
    );

    expect(
      screen.getByRole("dialog", {
        name: "Stock Adjustment Test Modal",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Create mode")
    ).toBeInTheDocument();
  });

  it("should close create adjustment modal", () => {
    render(<InventoryList />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /stock adjustment/i,
      })
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Close modal",
      })
    );

    expect(
      screen.queryByRole("dialog", {
        name: "Stock Adjustment Test Modal",
      })
    ).not.toBeInTheDocument();
  });

  // CREATE ADJUSTMENT

  it("should create stock adjustment successfully", async () => {
    render(<InventoryList />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /stock adjustment/i,
      })
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Submit adjustment",
      })
    );

    await waitFor(() => {
      expect(
        mocks.createInventoryAdjustment
      ).toHaveBeenCalledWith({
        product: "8",
        adjustmentQuantity: "2",
      });
    });

    await waitFor(() => {
      expect(
        mocks.fetchInventoryKPI
      ).toHaveBeenCalledTimes(2);
    });

    expect(
      screen.queryByRole("dialog", {
        name: "Stock Adjustment Test Modal",
      })
    ).not.toBeInTheDocument();
  });

  it("should keep modal open when creation fails", async () => {
    mocks.dispatch.mockImplementation((action) => {
      if (action?.type === "inventory/create") {
        const promise = Promise.reject(
          new Error("Create failed")
        );

        promise.unwrap = () =>
          Promise.reject(
            new Error("Create failed")
          );

        return promise;
      }

      return makeThunkResult({});
    });

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<InventoryList />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /stock adjustment/i,
      })
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Submit adjustment",
      })
    );

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Stock adjustment submit failed:",
        expect.any(Error)
      );
    });

    expect(
      screen.getByRole("dialog", {
        name: "Stock Adjustment Test Modal",
      })
    ).toBeInTheDocument();

    consoleError.mockRestore();
  });

  it("should prevent closing modal while adjustment is loading", () => {
    mocks.state.inventory.adjustmentLoading = true;

    render(<InventoryList />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /stock adjustment/i,
      })
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Close modal",
      })
    );

    expect(
      screen.getByRole("dialog", {
        name: "Stock Adjustment Test Modal",
      })
    ).toBeInTheDocument();
  });

  // WAREHOUSE AND PRODUCT API ERROR

  it("should handle warehouse loading failure", async () => {
    mocks.getWarehouses.mockRejectedValue(
      new Error("Warehouse unavailable")
    );

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<InventoryList />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Failed to load inventory warehouse options:",
        expect.any(Error)
      );
    });

    expect(
      screen.getByRole("heading", {
        name: "Inventory",
      })
    ).toBeInTheDocument();

    consoleError.mockRestore();
  });

  it("should handle product loading failure", async () => {
    mocks.fetchProducts.mockRejectedValue(
      new Error("Products unavailable")
    );

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<InventoryList />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Failed to load inventory product options:",
        expect.any(Error)
      );
    });

    expect(
      screen.getByRole("heading", {
        name: "Inventory",
      })
    ).toBeInTheDocument();

    consoleError.mockRestore();
  });

  // EXPORT

  it("should trigger inventory export action", () => {
    const consoleLog = vi
      .spyOn(console, "log")
      .mockImplementation(() => {});

    render(<InventoryList />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /export excel/i,
      })
    );

    expect(consoleLog).toHaveBeenCalledWith(
      "Export inventory to Excel"
    );

    consoleLog.mockRestore();
  });
});