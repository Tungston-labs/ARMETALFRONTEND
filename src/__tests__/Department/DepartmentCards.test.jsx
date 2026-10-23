import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from "vitest";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

import DepartmentCard from "../../Pages/department/Department/DepartmentCard";

import {
  getDepartments,
  createNewDepartment,
} from "../../../Redux/departmentSlice";

import { getAllEmployees } from "../../../Redux/employeeSlice";

// ============================================================
// MOCK REDUX ACTIONS
// ============================================================

vi.mock("../../../Redux/departmentSlice", () => ({
  getDepartments: vi.fn((payload) => ({
    type: "departments/getDepartments",
    payload,
  })),

  createNewDepartment: vi.fn((payload) => ({
    type: "departments/createNewDepartment",
    payload,
  })),
}));

vi.mock("../../../Redux/employeeSlice", () => ({
  getAllEmployees: vi.fn((payload) => ({
    type: "employee/getAllEmployees",
    payload,
  })),
}));

// ============================================================
// MOCK CHILD COMPONENTS
// ============================================================

vi.mock(
  "../../../Components/ReusableTable/ReusableHeader",
  () => ({
    default: ({
      title,
      buttonText,
      onButtonClick,
    }) => (
      <div>
        <h1>{title}</h1>

        <button onClick={onButtonClick}>
          {buttonText}
        </button>
      </div>
    ),
  })
);

vi.mock(
  "../../../Components/ReusableTable/ReusableFilter",
  () => ({
    default: ({
      search,
      onSearch,
      searchPlaceholder,
    }) => (
      <input
        aria-label="department-search"
        placeholder={searchPlaceholder}
        value={search}
        onChange={(event) =>
          onSearch(event.target.value)
        }
      />
    ),
  })
);

vi.mock(
  "./modal/DepartmentModal",
  () => ({
    default: ({
      isOpen,
      mode,
      onClose,
      onSubmit,
    }) => {
      if (!isOpen) return null;

      return (
        <div data-testid="department-modal">
          <h2>
            {mode === "add"
              ? "Add Department"
              : "Edit Department"}
          </h2>

          <button onClick={onClose}>
            Close
          </button>

          <button
            onClick={() =>
              onSubmit({
                departmentName: "Finance",
                departmentCode: "FIN",
                headOfDepartment: "10",
              })
            }
          >
            Submit Department
          </button>
        </div>
      );
    },
  })
);

vi.mock(
  "../../../Components/Skeleton/ SkeletonCard",
  () => ({
    default: () => (
      <div data-testid="skeleton-card">
        Loading...
      </div>
    ),
  })
);

// ============================================================
// MOCK STYLED COMPONENTS
// ============================================================

vi.mock("./DepartmentCard.Styles", () => {
  const React = require("react");

  const createComponent = (tag = "div") =>
    React.forwardRef(
      ({ children, ...props }, ref) =>
        React.createElement(
          tag,
          {
            ...props,
            ref,
          },
          children
        )
    );

  return {
    Container: createComponent(),
    HeaderWrapper: createComponent(),
    CardsGrid: createComponent(),
    Card: createComponent(),
    CardHeader: createComponent(),
    DepartmentName: createComponent(),
    ActiveBadge: createComponent(),
    DepartmentHead: createComponent(),
    TotalEmployee: createComponent(),
    StatusRow: createComponent(),
    Present: createComponent(),
    Leave: createComponent(),
    CardBottom: createComponent(),
    EmployeeCount: createComponent(),
    EmployeeImage: createComponent(),
    EmployeeNumber: createComponent(),
    ViewButton: createComponent("button"),
  };
});

// ============================================================
// MOCK REACT ROUTER
// ============================================================

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual(
    "react-router-dom"
  );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// ============================================================
// TEST REDUX STORE
// ============================================================

const createTestStore = ({
  departments = [],
  loading = false,
  error = null,
  employeeList = [],
} = {}) => {
  return configureStore({
    reducer: {
      departments: (
        state = {
          list: departments,
          loading,
          error,
        },
        action
      ) => state,

      employee: (
        state = {
          employeeList,
        },
        action
      ) => state,
    },
  });
};

// ============================================================
// RENDER HELPER
// ============================================================

const renderComponent = (state = {}) => {
  const store = createTestStore(state);

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <DepartmentCards />
      </MemoryRouter>
    </Provider>
  );
};

// ============================================================
// TESTS
// ============================================================

describe("DepartmentCards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================================
  // 1. BASIC RENDER
  // ==========================================================

  it("should render Department page", () => {
    renderComponent();

    expect(
      screen.getByText("Department")
    ).toBeInTheDocument();

    expect(
      screen.getByText("+ ADD NEW DEPARTMENT")
    ).toBeInTheDocument();
  });

  // ==========================================================
  // 2. SEARCH INPUT
  // ==========================================================

  it("should render department search input", () => {
    renderComponent();

    expect(
      screen.getByRole("textbox", {
        name: "department-search",
      })
    ).toBeInTheDocument();
  });

  // ==========================================================
  // 3. API CALL ON COMPONENT LOAD
  // ==========================================================

  it("should fetch departments and employees on mount", () => {
    renderComponent();

    expect(getDepartments).toHaveBeenCalledWith({
      page: 1,
      search: "",
    });

    expect(getAllEmployees).toHaveBeenCalledWith({
      page: 1,
      search: "",
    });
  });

  // ==========================================================
  // 4. LOADING STATE
  // ==========================================================

  it("should display skeleton cards while loading", () => {
    renderComponent({
      loading: true,
    });

    const skeletons =
      screen.getAllByTestId("skeleton-card");

    expect(skeletons).toHaveLength(8);
  });

  // ==========================================================
  // 5. DISPLAY DEPARTMENT
  // ==========================================================

  it("should display department information", () => {
    renderComponent({
      departments: [
        {
          id: 1,
          name: "Human Resources",
          employee_count: 15,
          attendance_employee_count: 10,
          todays_leave_employee_count: 2,
          department_head: {
            name: "John Doe",
          },
        },
      ],
    });

    expect(
      screen.getByText("Human Resources")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Head Of The Department:/)
    ).toBeInTheDocument();

    expect(
      screen.getByText("John Doe")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Total Employee:/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Present Today:/)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/On Leave Today:/)
    ).toBeInTheDocument();
  });

  // ==========================================================
  // 6. EMPLOYEE COUNT
  // ==========================================================

  it("should display employee count with leading zero", () => {
    renderComponent({
      departments: [
        {
          id: 1,
          name: "Finance",
          employee_count: 5,
          attendance_employee_count: 3,
          todays_leave_employee_count: 1,
          department_head: {
            name: "Alex",
          },
        },
      ],
    });

    expect(
      screen.getAllByText("05").length
    ).toBeGreaterThan(0);
  });

  // ==========================================================
  // 7. DEFAULT VALUES
  // ==========================================================

  it("should use default values when employee counts are missing", () => {
    renderComponent({
      departments: [
        {
          id: 1,
          name: "Finance",
          department_head: {
            name: "Alex",
          },
        },
      ],
    });

    expect(
      screen.getAllByText("00").length
    ).toBeGreaterThan(0);
  });

  // ==========================================================
  // 8. EMPTY DEPARTMENT LIST
  // ==========================================================

  it("should render no cards when department list is empty", () => {
    renderComponent({
      departments: [],
    });

    expect(
      screen.queryByText("Human Resources")
    ).not.toBeInTheDocument();
  });

  // ==========================================================
  // 9. ERROR STATE
  // ==========================================================

  it("should display error message when API fails", () => {
    renderComponent({
      error: "Something went wrong",
    });

    expect(
      screen.getByText("Something went wrong")
    ).toBeInTheDocument();
  });

  // ==========================================================
  // 10. OBJECT ERROR
  // ==========================================================

  it("should display default error message for object error", () => {
    renderComponent({
      error: {
        message: "API Error",
      },
    });

    expect(
      screen.getByText(
        "Failed to load departments"
      )
    ).toBeInTheDocument();
  });

  // ==========================================================
  // 11. ADD DEPARTMENT MODAL
  // ==========================================================

  it("should open add department modal", async () => {
    renderComponent();

    const addButton =
      screen.getByText("+ ADD NEW DEPARTMENT");

    fireEvent.click(addButton);

    expect(
      await screen.findByTestId(
        "department-modal"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText("Add Department")
    ).toBeInTheDocument();
  });

  // ==========================================================
  // 12. CLOSE MODAL
  // ==========================================================

  it("should close department modal", async () => {
    renderComponent();

    fireEvent.click(
      screen.getByText("+ ADD NEW DEPARTMENT")
    );

    expect(
      await screen.findByTestId(
        "department-modal"
      )
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByText("Close")
    );

    await waitFor(() => {
      expect(
        screen.queryByTestId(
          "department-modal"
        )
      ).not.toBeInTheDocument();
    });
  });

  // ==========================================================
  // 13. SEARCH
  // ==========================================================

  it("should search departments", async () => {
    renderComponent();

    const searchInput =
      screen.getByRole("textbox", {
        name: "department-search",
      });

    fireEvent.change(searchInput, {
      target: {
        value: "Finance",
      },
    });

    await waitFor(() => {
      expect(getDepartments).toHaveBeenCalledWith({
        page: 1,
        search: "Finance",
      });
    });
  });

  // ==========================================================
  // 14. VIEW DEPARTMENT
  // ==========================================================

  it("should navigate to department details when view button is clicked", () => {
    renderComponent({
      departments: [
        {
          id: 25,
          name: "Finance",
          employee_count: 10,
          attendance_employee_count: 8,
          todays_leave_employee_count: 1,
          department_head: {
            name: "John",
          },
        },
      ],
    });

    fireEvent.click(
      screen.getByText("VIEW DEPARTMENT")
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      "/departments/25"
    );
  });

  // ==========================================================
  // 15. CREATE DEPARTMENT
  // ==========================================================

  it("should create a new department", async () => {
    createNewDepartment.mockReturnValue({
      unwrap: vi.fn().mockResolvedValue({
        id: 10,
        name: "Finance",
      }),
    });

    renderComponent();

    fireEvent.click(
      screen.getByText("+ ADD NEW DEPARTMENT")
    );

    fireEvent.click(
      await screen.findByText(
        "Submit Department"
      )
    );

    await waitFor(() => {
      expect(
        createNewDepartment
      ).toHaveBeenCalledWith({
        name: "Finance",
        department_code: "FIN",
        department_head: "10",
      });
    });
  });

  // ==========================================================
  // 16. ACTIVE BADGE
  // ==========================================================

  it("should display Active badge for department", () => {
    renderComponent({
      departments: [
        {
          id: 1,
          name: "Finance",
          employee_count: 10,
          department_head: {
            name: "John",
          },
        },
      ],
    });

    expect(
      screen.getByText("Active")
    ).toBeInTheDocument();
  });

  // ==========================================================
  // 17. MULTIPLE DEPARTMENTS
  // ==========================================================

  it("should render multiple departments", () => {
    renderComponent({
      departments: [
        {
          id: 1,
          name: "Finance",
          employee_count: 10,
          department_head: {
            name: "John",
          },
        },
        {
          id: 2,
          name: "Human Resources",
          employee_count: 20,
          department_head: {
            name: "Jane",
          },
        },
        {
          id: 3,
          name: "IT",
          employee_count: 30,
          department_head: {
            name: "Alex",
          },
        },
      ],
    });

    expect(
      screen.getByText("Finance")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Human Resources")
    ).toBeInTheDocument();

    expect(
      screen.getByText("IT")
    ).toBeInTheDocument();
  });
});