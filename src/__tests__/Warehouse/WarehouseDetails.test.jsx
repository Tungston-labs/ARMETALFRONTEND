import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

/* =========================================================
   MOCK REACT REDUX
========================================================= */

const mockDispatch = vi.fn();

let mockWarehouseState = {
  warehouseDetail: null,
  detailLoading: false,
  detailError: null,
};

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,

  useSelector: (selector) =>
    selector({
      warehouse: mockWarehouseState,
    }),
}));

/* =========================================================
   MOCK REACT ROUTER
========================================================= */

let mockParams = {
  id: "7",
};

vi.mock("react-router-dom", () => ({
  useParams: () => mockParams,
}));

/* =========================================================
   MOCK REDUX ACTION
========================================================= */

const mockFetchWarehouseById = vi.fn((id) => ({
  type: "warehouse/fetchWarehouseById",
  payload: id,
}));

vi.mock("../../Redux/warehouseSlice", () => ({
  fetchWarehouseById: mockFetchWarehouseById,
}));

/* =========================================================
   MOCK CHILD COMPONENTS
========================================================= */

vi.mock("../../../../Components/WarehouseDetails/WarehouseInfoCard", () => ({
  default: ({
    image,
    warehouseName,
    companyName,
    addressLine1,
    addressLine2,
    city,
  }) => (
    <div data-testid="warehouse-info-card">
      <span data-testid="info-image">{image}</span>
      <span data-testid="info-warehouse-name">{warehouseName}</span>
      <span data-testid="info-company-name">{companyName}</span>
      <span data-testid="info-address-line-1">{addressLine1}</span>
      <span data-testid="info-address-line-2">{addressLine2}</span>
      <span data-testid="info-city">{city}</span>
    </div>
  ),
}));

vi.mock("../../../../Components/WarehouseDetails/WarehouseContactCard", () => ({
  default: ({ manager, phoneNumber, email, storageCapacity }) => (
    <div data-testid="warehouse-contact-card">
      <span data-testid="contact-manager">{manager}</span>

      <span data-testid="contact-phone">{phoneNumber}</span>

      <span data-testid="contact-email">{email}</span>

      <span data-testid="contact-storage">{storageCapacity}</span>
    </div>
  ),
}));

/* =========================================================
   MOCK HEADER
========================================================= */

vi.mock("../../../../Components/ReusableTable/ReusableHeader", () => ({
  default: ({ title, breadcrumbs, children }) => (
    <div data-testid="reusable-header">
      <h1 data-testid="header-title">{title}</h1>

      <div data-testid="breadcrumbs">{breadcrumbs?.join(" / ")}</div>

      <div>{children}</div>
    </div>
  ),
}));

/* =========================================================
   MOCK HEADER BUTTON
========================================================= */

vi.mock("../../../../Components/ReusableTable/ReusableHeader.styles", () => ({
  HeaderButton: ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

/* =========================================================
   MOCK STATS CARDS
========================================================= */

vi.mock("../../../../Components/StatsCards/StatsCards", () => ({
  default: ({ cards, loading }) => (
    <div data-testid="stats-cards">
      <span data-testid="stats-loading">{String(loading)}</span>

      {cards?.map((card, index) => (
        <div key={index} data-testid={`stat-card-${index}`}>
          <span>{card.count}</span>
          <span>{card.title}</span>
        </div>
      ))}
    </div>
  ),
}));

/* =========================================================
   MOCK STYLES
========================================================= */

vi.mock("./WarehouseDetails.styles", () => ({
  Page: ({ children }) => (
    <div data-testid="warehouse-details-page">{children}</div>
  ),

  DetailsGrid: ({ children }) => (
    <div data-testid="details-grid">{children}</div>
  ),
}));

/* =========================================================
   IMPORT COMPONENT AFTER MOCKS
========================================================= */

import WarehouseDetails from "../../Pages/inventory/WarehouseDetails/WarehouseDetails";

/* =========================================================
   TEST DATA
========================================================= */

const completeWarehouse = {
  id: 7,
  warehouse_name: "Main Warehouse",
  operating_since: "2025-01-15",
  warehouse_type: "central",
  total_products: 1500,
  stock_quantity: 50000,
  low_stock_products: 25,
  out_of_stock_products: 10,

  manager_name: "Ahmed Ali",

  phone_number: "+966501234567",

  email: "ahmed@example.com",

  storage_capacity: 100000,

  company_name: "Armetal Company",

  address_line_1: "Industrial Area",

  address_line_2: "Building 25",

  city: "Riyadh",
};

/* =========================================================
   SETUP
========================================================= */

beforeEach(() => {
  vi.clearAllMocks();

  mockParams = {
    id: "7",
  };

  mockWarehouseState = {
    warehouseDetail: completeWarehouse,
    detailLoading: false,
    detailError: null,
  };
});

/* =========================================================
   BASIC RENDERING
========================================================= */

describe("WarehouseDetails", () => {
  it("renders the warehouse details page", () => {
    render(<WarehouseDetails />);

    expect(screen.getByTestId("warehouse-details-page")).toBeInTheDocument();
  });

  /* =========================================================
     API DISPATCH
  ========================================================= */

  it("dispatches fetchWarehouseById when ID is available", async () => {
    render(<WarehouseDetails />);

    await waitFor(() => {
      expect(mockFetchWarehouseById).toHaveBeenCalledWith("7");

      expect(mockDispatch).toHaveBeenCalledWith({
        type: "warehouse/fetchWarehouseById",
        payload: "7",
      });
    });
  });

  it("does not dispatch when warehouse ID is undefined", () => {
    mockParams = {
      id: undefined,
    };

    render(<WarehouseDetails />);

    expect(mockFetchWarehouseById).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("does not dispatch when warehouse ID is null", () => {
    mockParams = {
      id: null,
    };

    render(<WarehouseDetails />);

    expect(mockFetchWarehouseById).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("does not dispatch when warehouse ID is empty", () => {
    mockParams = {
      id: "",
    };

    render(<WarehouseDetails />);

    expect(mockFetchWarehouseById).not.toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  /* =========================================================
     HEADER
  ========================================================= */

  it("renders warehouse name and operating date in header", () => {
    render(<WarehouseDetails />);

    expect(screen.getByTestId("header-title")).toHaveTextContent(
      "Main Warehouse - 2025-01-15",
    );
  });

  it("renders breadcrumbs", () => {
    render(<WarehouseDetails />);

    expect(screen.getByTestId("breadcrumbs")).toHaveTextContent(
      "Dashboard / Products / Warehouse",
    );
  });

  /* =========================================================
     EDIT BUTTON
  ========================================================= */

  it("renders EDIT button", () => {
    render(<WarehouseDetails />);

    expect(
      screen.getByRole("button", {
        name: /EDIT/i,
      }),
    ).toBeInTheDocument();
  });

  it("handles edit warehouse click", () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<WarehouseDetails />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /EDIT/i,
      }),
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      "Edit warehouse:",
      expect.objectContaining({
        name: "Main Warehouse",
      }),
    );

    consoleSpy.mockRestore();
  });

  /* =========================================================
     DELETE BUTTON
  ========================================================= */

  it("renders DELETE button", () => {
    render(<WarehouseDetails />);

    expect(
      screen.getByRole("button", {
        name: /DELETE/i,
      }),
    ).toBeInTheDocument();
  });

  it("does not delete when confirmation is cancelled", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<WarehouseDetails />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /DELETE/i,
      }),
    );

    expect(confirmSpy).toHaveBeenCalledWith(
      'Are you sure you want to delete "Main Warehouse"?',
    );

    expect(consoleSpy).not.toHaveBeenCalledWith(
      "Delete warehouse:",
      expect.anything(),
    );

    confirmSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  it("handles confirmed delete warehouse", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<WarehouseDetails />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /DELETE/i,
      }),
    );

    expect(confirmSpy).toHaveBeenCalledWith(
      'Are you sure you want to delete "Main Warehouse"?',
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      "Delete warehouse:",
      expect.objectContaining({
        name: "Main Warehouse",
      }),
    );

    confirmSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  /* =========================================================
     STATS CARDS
  ========================================================= */

  it("renders all five stats cards", () => {
    render(<WarehouseDetails />);

    expect(screen.getByTestId("stat-card-0")).toBeInTheDocument();

    expect(screen.getByTestId("stat-card-1")).toBeInTheDocument();

    expect(screen.getByTestId("stat-card-2")).toBeInTheDocument();

    expect(screen.getByTestId("stat-card-3")).toBeInTheDocument();

    expect(screen.getByTestId("stat-card-4")).toBeInTheDocument();
  });

  it("renders warehouse type stat", () => {
    expect.assertions(2);

    render(<WarehouseDetails />);

    const card = screen.getByTestId("stat-card-0");

    expect(card).toHaveTextContent("central");
    expect(card).toHaveTextContent("Warehouses Type");
  });

  it("renders total products stat", () => {
    const { getByTestId } = render(<WarehouseDetails />);

    const card = getByTestId("stat-card-1");

    expect(card).toHaveTextContent("1500");
    expect(card).toHaveTextContent("Total Products");
  });

  it("renders stock quantity stat", () => {
    render(<WarehouseDetails />);

    const card = screen.getByTestId("stat-card-2");

    expect(card).toHaveTextContent("50000");
    expect(card).toHaveTextContent("Total Stock Quantity");
  });

  it("renders low stock products stat", () => {
    render(<WarehouseDetails />);

    const card = screen.getByTestId("stat-card-3");

    expect(card).toHaveTextContent("25");
    expect(card).toHaveTextContent("Low Stock Products");
  });

  it("renders out of stock products stat", () => {
    render(<WarehouseDetails />);

    const card = screen.getByTestId("stat-card-4");

    expect(card).toHaveTextContent("10");
    expect(card).toHaveTextContent("Out of Stock Products");
  });

  /* =========================================================
     LOADING STATE
  ========================================================= */

  it("passes loading state to StatsCards", () => {
    mockWarehouseState = {
      warehouseDetail: completeWarehouse,
      detailLoading: true,
      detailError: null,
    };

    render(<WarehouseDetails />);

    expect(screen.getByTestId("stats-loading")).toHaveTextContent("true");
  });

  /* =========================================================
     ERROR STATE
  ========================================================= */

  it("renders string detail error", () => {
    mockWarehouseState = {
      warehouseDetail: completeWarehouse,
      detailLoading: false,
      detailError: "Unable to load warehouse",
    };

    render(<WarehouseDetails />);

    expect(screen.getByText("Unable to load warehouse")).toBeInTheDocument();
  });

  it("renders detail error object using detail property", () => {
    mockWarehouseState = {
      warehouseDetail: completeWarehouse,
      detailLoading: false,
      detailError: {
        detail: "Warehouse not found",
      },
    };

    render(<WarehouseDetails />);

    expect(screen.getByText("Warehouse not found")).toBeInTheDocument();
  });

  it("renders detail error object using message property", () => {
    mockWarehouseState = {
      warehouseDetail: completeWarehouse,
      detailLoading: false,
      detailError: {
        message: "Server error",
      },
    };

    render(<WarehouseDetails />);

    expect(screen.getByText("Server error")).toBeInTheDocument();
  });

  it("renders fallback error message for unknown error object", () => {
    mockWarehouseState = {
      warehouseDetail: completeWarehouse,
      detailLoading: false,
      detailError: {
        unknown: "error",
      },
    };

    render(<WarehouseDetails />);

    expect(
      screen.getByText("Failed to fetch warehouse detail"),
    ).toBeInTheDocument();
  });

  it("does not render error message when detailError is null", () => {
    render(<WarehouseDetails />);

    expect(
      screen.queryByText("Failed to fetch warehouse detail"),
    ).not.toBeInTheDocument();
  });

  /* =========================================================
     WAREHOUSE INFO CARD
  ========================================================= */

  it("passes warehouse information to WarehouseInfoCard", () => {
    render(<WarehouseDetails />);

    expect(screen.getByTestId("info-image")).toHaveTextContent(
      "/warehouse-logo.png",
    );

    expect(screen.getByTestId("info-warehouse-name")).toHaveTextContent(
      "Main Warehouse",
    );

    expect(screen.getByTestId("info-company-name")).toHaveTextContent(
      "Armetal Company",
    );

    expect(screen.getByTestId("info-address-line-1")).toHaveTextContent(
      "Industrial Area",
    );

    expect(screen.getByTestId("info-address-line-2")).toHaveTextContent(
      "Building 25",
    );

    expect(screen.getByTestId("info-city")).toHaveTextContent("Riyadh");
  });

  /* =========================================================
     WAREHOUSE CONTACT CARD
  ========================================================= */

  it("passes contact information to WarehouseContactCard", () => {
    render(<WarehouseDetails />);

    expect(screen.getByTestId("contact-manager")).toHaveTextContent(
      "Ahmed Ali",
    );

    expect(screen.getByTestId("contact-phone")).toHaveTextContent(
      "+966501234567",
    );

    expect(screen.getByTestId("contact-email")).toHaveTextContent(
      "ahmed@example.com",
    );

    expect(screen.getByTestId("contact-storage")).toHaveTextContent("100000");
  });

  /* =========================================================
     MANAGER FALLBACKS
  ========================================================= */

  it("uses manager.name when manager_name is unavailable", () => {
    mockWarehouseState = {
      warehouseDetail: {
        ...completeWarehouse,
        manager_name: null,
        manager: {
          name: "Manager Name",
        },
      },
      detailLoading: false,
      detailError: null,
    };

    render(<WarehouseDetails />);

    expect(screen.getByTestId("contact-manager")).toHaveTextContent(
      "Manager Name",
    );
  });

  it("uses manager.full_name when manager.name is unavailable", () => {
    mockWarehouseState = {
      warehouseDetail: {
        ...completeWarehouse,
        manager_name: null,
        manager: {
          full_name: "Full Manager Name",
        },
      },
      detailLoading: false,
      detailError: null,
    };

    render(<WarehouseDetails />);

    expect(screen.getByTestId("contact-manager")).toHaveTextContent(
      "Full Manager Name",
    );
  });

  it("uses manager.username when name and full_name are unavailable", () => {
    mockWarehouseState = {
      warehouseDetail: {
        ...completeWarehouse,
        manager_name: null,
        manager: {
          username: "manager123",
        },
      },
      detailLoading: false,
      detailError: null,
    };

    render(<WarehouseDetails />);

    expect(screen.getByTestId("contact-manager")).toHaveTextContent(
      "manager123",
    );
  });

  it("uses manager string when manager is a string", () => {
    mockWarehouseState = {
      warehouseDetail: {
        ...completeWarehouse,
        manager_name: null,
        manager: "Direct Manager",
      },
      detailLoading: false,
      detailError: null,
    };

    render(<WarehouseDetails />);

    expect(screen.getByTestId("contact-manager")).toHaveTextContent(
      "Direct Manager",
    );
  });

  it("uses dash when manager is an unsupported object", () => {
    mockWarehouseState = {
      warehouseDetail: {
        ...completeWarehouse,
        manager_name: null,
        manager: {
          id: 10,
        },
      },
      detailLoading: false,
      detailError: null,
    };

    render(<WarehouseDetails />);

    expect(screen.getByTestId("contact-manager")).toHaveTextContent("-");
  });

  /* =========================================================
     WAREHOUSE NAME FALLBACKS
  ========================================================= */

  it("uses name when warehouse_name is unavailable", () => {
    mockWarehouseState = {
      warehouseDetail: {
        ...completeWarehouse,
        warehouse_name: null,
        name: "Fallback Warehouse",
      },
      detailLoading: false,
      detailError: null,
    };

    render(<WarehouseDetails />);

    expect(screen.getByTestId("header-title")).toHaveTextContent(
      "Fallback Warehouse - 2025-01-15",
    );
  });

  it("uses Warehouse when both warehouse names are unavailable", () => {
    mockWarehouseState = {
      warehouseDetail: {
        ...completeWarehouse,
        warehouse_name: null,
        name: null,
      },
      detailLoading: false,
      detailError: null,
    };

    render(<WarehouseDetails />);

    expect(screen.getByTestId("header-title")).toHaveTextContent(
      "Warehouse - 2025-01-15",
    );
  });

  /* =========================================================
     DATE FALLBACK
  ========================================================= */

  it("uses created_at when operating_since is unavailable", () => {
    mockWarehouseState = {
      warehouseDetail: {
        ...completeWarehouse,
        operating_since: null,
        created_at: "2024-12-01",
      },
      detailLoading: false,
      detailError: null,
    };

    render(<WarehouseDetails />);

    expect(screen.getByTestId("header-title")).toHaveTextContent(
      "Main Warehouse - 2024-12-01",
    );
  });

  it("uses dash when both dates are unavailable", () => {
    mockWarehouseState = {
      warehouseDetail: {
        ...completeWarehouse,
        operating_since: null,
        created_at: null,
      },
      detailLoading: false,
      detailError: null,
    };

    render(<WarehouseDetails />);

    expect(screen.getByTestId("header-title")).toHaveTextContent(
      "Main Warehouse - -",
    );
  });

  /* =========================================================
     COMPANY FALLBACKS
  ========================================================= */

  it("uses company.name when company_name is unavailable", () => {
    mockWarehouseState = {
      warehouseDetail: {
        ...completeWarehouse,
        company_name: null,
        company: {
          name: "Fallback Company",
        },
      },
      detailLoading: false,
      detailError: null,
    };

    render(<WarehouseDetails />);

    expect(screen.getByTestId("info-company-name")).toHaveTextContent(
      "Fallback Company",
    );
  });

  it("uses dash when company information is unavailable", () => {
    mockWarehouseState = {
      warehouseDetail: {
        ...completeWarehouse,
        company_name: null,
        company: null,
      },
      detailLoading: false,
      detailError: null,
    };

    render(<WarehouseDetails />);

    expect(screen.getByTestId("info-company-name")).toHaveTextContent("-");
  });

  /* =========================================================
     ADDRESS FALLBACKS
  ========================================================= */

  it("uses address when address_line_1 is unavailable", () => {
    mockWarehouseState = {
      warehouseDetail: {
        ...completeWarehouse,
        address_line_1: null,
        address: "Fallback Address",
      },
      detailLoading: false,
      detailError: null,
    };

    render(<WarehouseDetails />);

    expect(screen.getByTestId("info-address-line-1")).toHaveTextContent(
      "Fallback Address",
    );
  });

  it("uses dash when address_line_1 and address are unavailable", () => {
    mockWarehouseState = {
      warehouseDetail: {
        ...completeWarehouse,
        address_line_1: null,
        address: null,
      },
      detailLoading: false,
      detailError: null,
    };

    render(<WarehouseDetails />);

    expect(screen.getByTestId("info-address-line-1")).toHaveTextContent("-");
  });

  it("uses dash when address_line_2 is unavailable", () => {
    mockWarehouseState = {
      warehouseDetail: {
        ...completeWarehouse,
        address_line_2: null,
      },
      detailLoading: false,
      detailError: null,
    };

    render(<WarehouseDetails />);

    expect(screen.getByTestId("info-address-line-2")).toHaveTextContent("-");
  });

  /* =========================================================
     CITY / CONTACT FALLBACKS
  ========================================================= */

  it("uses dash when city is unavailable", () => {
    mockWarehouseState = {
      warehouseDetail: {
        ...completeWarehouse,
        city: null,
      },
      detailLoading: false,
      detailError: null,
    };

    render(<WarehouseDetails />);

    expect(screen.getByTestId("info-city")).toHaveTextContent("-");
  });

  it("uses dash when phone number is unavailable", () => {
    mockWarehouseState = {
      warehouseDetail: {
        ...completeWarehouse,
        phone_number: null,
      },
      detailLoading: false,
      detailError: null,
    };

    render(<WarehouseDetails />);

    expect(screen.getByTestId("contact-phone")).toHaveTextContent("-");
  });

  it("uses dash when email is unavailable", () => {
    mockWarehouseState = {
      warehouseDetail: {
        ...completeWarehouse,
        email: null,
      },
      detailLoading: false,
      detailError: null,
    };

    render(<WarehouseDetails />);

    expect(screen.getByTestId("contact-email")).toHaveTextContent("-");
  });

  it("uses dash when storage capacity is unavailable", () => {
    mockWarehouseState = {
      warehouseDetail: {
        ...completeWarehouse,
        storage_capacity: null,
      },
      detailLoading: false,
      detailError: null,
    };

    render(<WarehouseDetails />);

    expect(screen.getByTestId("contact-storage")).toHaveTextContent("-");
  });

  /* =========================================================
     ZERO VALUES
  ========================================================= */

  it("preserves zero values for warehouse statistics", () => {
    mockWarehouseState = {
      warehouseDetail: {
        ...completeWarehouse,
        total_products: 0,
        stock_quantity: 0,
        low_stock_products: 0,
        out_of_stock_products: 0,
      },
      detailLoading: false,
      detailError: null,
    };

    render(<WarehouseDetails />);

    expect(screen.getByTestId("stat-card-1")).toHaveTextContent("0");

    expect(screen.getByTestId("stat-card-2")).toHaveTextContent("0");

    expect(screen.getByTestId("stat-card-3")).toHaveTextContent("0");

    expect(screen.getByTestId("stat-card-4")).toHaveTextContent("0");
  });

  /* =========================================================
     EMPTY WAREHOUSE DETAIL
  ========================================================= */

  it("renders safely when warehouseDetail is null", () => {
    mockWarehouseState = {
      warehouseDetail: null,
      detailLoading: false,
      detailError: null,
    };

    render(<WarehouseDetails />);

    expect(screen.getByTestId("header-title")).toHaveTextContent(
      "Warehouse - -",
    );

    expect(screen.getByTestId("info-warehouse-name")).toHaveTextContent(
      "Warehouse",
    );

    expect(screen.getByTestId("info-company-name")).toHaveTextContent("-");

    expect(screen.getByTestId("contact-phone")).toHaveTextContent("-");

    expect(screen.getByTestId("contact-email")).toHaveTextContent("-");
  });

  it("renders safely when warehouseDetail is an empty object", () => {
    mockWarehouseState = {
      warehouseDetail: {},
      detailLoading: false,
      detailError: null,
    };

    render(<WarehouseDetails />);

    expect(screen.getByTestId("header-title")).toHaveTextContent(
      "Warehouse - -",
    );
  });

  /* =========================================================
     DETAILS GRID
  ========================================================= */

  it("renders both information and contact cards inside details grid", () => {
    render(<WarehouseDetails />);

    const grid = screen.getByTestId("details-grid");

    expect(
      grid.querySelector('[data-testid="warehouse-info-card"]'),
    ).toBeInTheDocument();

    expect(
      grid.querySelector('[data-testid="warehouse-contact-card"]'),
    ).toBeInTheDocument();
  });
});
