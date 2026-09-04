import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import DepartmentDetails from "../../Pages/department/Department/DepartmentDetails";
import {
  getDepartments,
  getEmployeesByDepartment,
  updateDepartmentById,
} from "../../Redux/departmentSlice";

// ---------------------------------------------------------------------------
// MOCKS
// ---------------------------------------------------------------------------

// Only mock the action creators so we can assert on dispatched actions;
// react-redux and react-router-dom themselves are used for real, with a real
// store and a MemoryRouter supplying the :id param.
vi.mock("../../Redux/departmentSlice", () => ({
  getDepartments: vi.fn((payload) => ({ type: "getDepartments", payload })),
  getEmployeesByDepartment: vi.fn((id) => ({
    type: "getEmployeesByDepartment",
    payload: id,
  })),
  // The real updateDepartmentById is an async thunk, and the component calls
  // dispatch(updateDepartmentById(payload)).unwrap(). configureStore includes
  // redux-thunk middleware by default, so returning a thunk function here
  // (rather than a plain action object) lets dispatch(...) return a promise
  // that has .unwrap() on it, just like the real thing would.
  updateDepartmentById: vi.fn((payload) => () => {
    const promise = Promise.resolve({
      type: "updateDepartmentById/fulfilled",
      payload,
    });
    promise.unwrap = () => Promise.resolve(payload);
    return promise;
  }),
}));

// Child components are mocked to simple, inspectable stand-ins so tests
// exercise only DepartmentDetails' own logic (data shaping, handlers, state).

vi.mock("../../Components/ReusableTable/ReusableTable", () => ({
  // DepartmentDetails builds `row.name` as JSX (it already includes the
  // "Department Head" badge when applicable), so we render each field once
  // rather than also printing a redundant plain-text copy of the name -
  // otherwise the same name ends up matching twice in the DOM.
  default: (props) => (
    <div data-testid="reusable-table">
      {props.loading && <div>{props.loadingMessage}</div>}
      {props.data.map((row) => (
        <div key={row.id} data-testid="employee-row">
          <span data-testid="employee-code">{row.employee_code}</span>
          <span data-testid="employee-email">{row.email}</span>
          <span data-testid="employee-designation">{row.designation}</span>
          <span data-testid="employee-name">{row.name}</span>
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../../Components/Pagination/ReusablePagination", () => ({
  default: (props) => (
    <div data-testid="pagination">
      <span>
        Page {props.currentPage} of {props.totalPages}
      </span>
      <button onClick={() => props.onPageChange(props.currentPage + 1)}>
        Next
      </button>
    </div>
  ),
}));

vi.mock("../../Components/ReusableTable/ReusableFilter", () => ({
  default: (props) => (
    <input
      data-testid="search-input"
      placeholder={props.searchPlaceholder}
      value={props.search}
      onChange={(e) => props.onSearch(e.target.value)}
    />
  ),
}));

vi.mock("../../Components/ReusableTable/ReusableHeader", () => ({
  default: (props) => (
    <div data-testid="reusable-header">
      <h1>{props.title}</h1>
      <button onClick={props.onButtonClick}>{props.buttonText}</button>
    </div>
  ),
}));

vi.mock("../../Components/StatsCards/StatsCards", () => ({
  default: (props) => (
    <div data-testid="stats-cards">
      {props.cards.map((card) => (
        <div key={card.title}>
          {card.title}: {card.count}
        </div>
      ))}
    </div>
  ),
}));

vi.mock("../../Pages/department/Department/modal/DepartmentModal", () => ({
  default: (props) =>
    props.isOpen ? (
      <div data-testid="department-modal">
        <span>mode:{props.mode}</span>
        <span>name:{props.departmentData?.departmentName}</span>
        <span>code:{props.departmentData?.departmentCode}</span>
        <span>head:{String(props.departmentData?.headOfDepartment)}</span>
        <button
          onClick={() =>
            props.onSubmit({
              departmentName: "Updated Dept",
              departmentCode: "UD-01",
              headOfDepartment: "5",
            })
          }
        >
          Submit
        </button>
        <button onClick={props.onClose}>Close</button>
      </div>
    ) : null,
}));

vi.mock("../../Pages/department/Department/data", () => ({
  departmentData: { departmentName: "Fallback Department" },
  departmentEmployeeColumns: [
    { key: "name", label: "Name" },
    { key: "employee_code", label: "Code" },
    { key: "email", label: "Email" },
    { key: "designation", label: "Designation" },
  ],
}));

// ---------------------------------------------------------------------------
// TEST HELPERS
// ---------------------------------------------------------------------------

const buildEmployee = (overrides = {}) => ({
  id: 1,
  name: "Jane Doe",
  employee_code: "EMP-001",
  email: "jane@example.com",
  designation: "Engineer",
  today_attendance_status: "present",
  ...overrides,
});

const baseDepartment = {
  id: "10",
  name: "Engineering",
  department_code: "ENG",
  department_head: 1,
  employee_count: 10,
  attendance_employee_count: 6,
  todays_leave_employee_count: 2,
};

// A minimal reducer that just returns whatever preloadedState was given for
// the `departments` slice - DepartmentDetails only ever reads state, it
// never needs the real reducer logic for these tests.
const departmentsReducer = (state = {}, _action) => state;

const buildStore = ({
  departmentList = [baseDepartment],
  departmentEmployees = [buildEmployee()],
  loadingDepartments = false,
  loadingEmployees = false,
  error = null,
} = {}) =>
  configureStore({
    reducer: {
      departments: departmentsReducer,
    },
    preloadedState: {
      departments: {
        list: departmentList,
        departmentEmployees,
        loading: loadingDepartments,
        loadingEmployees,
        error,
      },
    },
  });

const renderWithProviders = (
  ui,
  { store = buildStore(), routeId = "10", ...renderOptions } = {}
) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/department/${routeId ?? ""}`]}>
        <Routes>
          <Route path="/department/:id" element={ui} />
          <Route path="/department" element={ui} />
        </Routes>
      </MemoryRouter>
    </Provider>,
    renderOptions
  );

beforeEach(() => {
  vi.clearAllMocks();
});

// ---------------------------------------------------------------------------
// TESTS
// ---------------------------------------------------------------------------

describe("DepartmentDetails", () => {
  test("dispatches getDepartments and getEmployeesByDepartment on mount", () => {
    renderWithProviders(<DepartmentDetails />);

    expect(getDepartments).toHaveBeenCalledWith({ page: 1, search: "" });
    expect(getEmployeesByDepartment).toHaveBeenCalledWith("10");
  });

  test("does not fetch employees when departmentId is missing", () => {
    renderWithProviders(<DepartmentDetails />, { routeId: null });

    expect(getEmployeesByDepartment).not.toHaveBeenCalled();
  });

  test("renders the current department's name in the header", () => {
    renderWithProviders(<DepartmentDetails />);

    expect(
      screen.getByRole("heading", { name: "Engineering" })
    ).toBeInTheDocument();
  });

  test("falls back to departmentData's name when department is not found", () => {
    renderWithProviders(<DepartmentDetails />, {
      store: buildStore({ departmentList: [] }),
    });

    // When the current department can't be found in the list, the header
    // falls back to departmentData.departmentName from ./data (mocked above
    // as "Fallback Department"), not a hardcoded "Department Details" string.
    expect(
      screen.getByRole("heading", { name: "Fallback Department" })
    ).toBeInTheDocument();
  });

  test("renders stats cards computed from the current department", () => {
    renderWithProviders(<DepartmentDetails />);

    expect(screen.getByText("Total Employees: 10")).toBeInTheDocument();
    expect(screen.getByText("Present: 6")).toBeInTheDocument();
    expect(screen.getByText("On Leave: 2")).toBeInTheDocument();
    // absent = total - present - leave = 10 - 6 - 2 = 2
    expect(screen.getByText("Absent: 2")).toBeInTheDocument();
  });

  test("clamps absent count at zero when present+leave exceed total", () => {
    renderWithProviders(<DepartmentDetails />, {
      store: buildStore({
        departmentList: [
          {
            ...baseDepartment,
            employee_count: 5,
            attendance_employee_count: 4,
            todays_leave_employee_count: 4,
          },
        ],
      }),
    });

    expect(screen.getByText("Absent: 0")).toBeInTheDocument();
  });

  test("normalizes employees from a plain array response", () => {
    renderWithProviders(<DepartmentDetails />, {
      store: buildStore({
        departmentEmployees: [buildEmployee({ id: 2, name: "Sam Lee" })],
      }),
    });

    expect(screen.getByText(/Sam Lee/)).toBeInTheDocument();
  });

  test("normalizes employees from a { results: [...] } response", () => {
    renderWithProviders(<DepartmentDetails />, {
      store: buildStore({
        departmentEmployees: {
          results: [buildEmployee({ id: 3, name: "Alex Kim" })],
        },
      }),
    });

    expect(screen.getByText(/Alex Kim/)).toBeInTheDocument();
  });

  test("renders empty table when employees data is an unexpected shape", () => {
    renderWithProviders(<DepartmentDetails />, {
      store: buildStore({ departmentEmployees: null }),
    });

    expect(screen.queryAllByTestId("employee-row")).toHaveLength(0);
  });

  test("marks the matching employee as Department Head", () => {
    renderWithProviders(<DepartmentDetails />, {
      store: buildStore({
        departmentEmployees: [
          buildEmployee({ id: 1, name: "Jane Doe" }), // matches department_head: 1
          buildEmployee({ id: 2, name: "Sam Lee" }),
        ],
      }),
    });

    expect(screen.getByText("Department Head")).toBeInTheDocument();
  });

  test("handles department_head provided as an object", () => {
    renderWithProviders(<DepartmentDetails />, {
      store: buildStore({
        departmentList: [
          { ...baseDepartment, department_head: { id: 2, name: "Sam Lee" } },
        ],
        departmentEmployees: [
          buildEmployee({ id: 1, name: "Jane Doe" }),
          buildEmployee({ id: 2, name: "Sam Lee" }),
        ],
      }),
    });

    expect(screen.getByText("Department Head")).toBeInTheDocument();
  });

  test("filters employees by name via search input", () => {
    renderWithProviders(<DepartmentDetails />, {
      store: buildStore({
        departmentEmployees: [
          buildEmployee({ id: 1, name: "Jane Doe", employee_code: "EMP-001" }),
          buildEmployee({ id: 2, name: "Sam Lee", employee_code: "EMP-002" }),
        ],
      }),
    });

    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "sam" },
    });

    expect(screen.getByText(/Sam Lee/)).toBeInTheDocument();
    expect(screen.queryByText(/Jane Doe/)).not.toBeInTheDocument();
  });

  test("filters employees by employee_code via search input", () => {
    renderWithProviders(<DepartmentDetails />, {
      store: buildStore({
        departmentEmployees: [
          buildEmployee({ id: 1, name: "Jane Doe", employee_code: "EMP-001" }),
          buildEmployee({ id: 2, name: "Sam Lee", employee_code: "EMP-002" }),
        ],
      }),
    });

    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "emp-002" },
    });

    expect(screen.getByText(/Sam Lee/)).toBeInTheDocument();
    expect(screen.queryByText(/Jane Doe/)).not.toBeInTheDocument();
  });

  test("resets to page 1 when a new search is entered", () => {
    const manyEmployees = Array.from({ length: 25 }, (_, i) =>
      buildEmployee({ id: i + 1, name: `Employee ${i + 1}` })
    );
    renderWithProviders(<DepartmentDetails />, {
      store: buildStore({ departmentEmployees: manyEmployees }),
    });

    fireEvent.click(screen.getByText("Next"));
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();

    fireEvent.change(screen.getByTestId("search-input"), {
      target: { value: "Employee 1" },
    });

    expect(screen.getByText(/Page 1 of/)).toBeInTheDocument();
  });

  test("paginates employees at 20 rows per page", () => {
    const manyEmployees = Array.from({ length: 25 }, (_, i) =>
      buildEmployee({ id: i + 1, name: `Employee ${i + 1}` })
    );
    renderWithProviders(<DepartmentDetails />, {
      store: buildStore({ departmentEmployees: manyEmployees }),
    });

    expect(screen.getAllByTestId("employee-row")).toHaveLength(20);
    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Next"));

    expect(screen.getAllByTestId("employee-row")).toHaveLength(5);
    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
  });

  test("shows loading message when employees are loading", () => {
    renderWithProviders(<DepartmentDetails />, {
      store: buildStore({ loadingEmployees: true }),
    });

    expect(screen.getByText("Loading employees...")).toBeInTheDocument();
  });

  test("renders an error state and skips the main content", () => {
    renderWithProviders(<DepartmentDetails />, {
      store: buildStore({ error: "Something went wrong" }),
    });

    expect(
      screen.getByText("Failed to load department employees.")
    ).toBeInTheDocument();
    expect(screen.queryByTestId("reusable-table")).not.toBeInTheDocument();
  });

  test("opens the edit modal pre-filled with current department data", () => {
    renderWithProviders(<DepartmentDetails />);

    fireEvent.click(screen.getByText("Edit"));

    expect(screen.getByTestId("department-modal")).toBeInTheDocument();
    expect(screen.getByText("mode:edit")).toBeInTheDocument();
    expect(screen.getByText("name:Engineering")).toBeInTheDocument();
    expect(screen.getByText("code:ENG")).toBeInTheDocument();
    expect(screen.getByText("head:1")).toBeInTheDocument();
  });

  test("falls back to departmentData when current department is not found", () => {
    renderWithProviders(<DepartmentDetails />, {
      store: buildStore({ departmentList: [] }),
    });

    fireEvent.click(screen.getByText("Edit"));

    expect(screen.getByText("name:Fallback Department")).toBeInTheDocument();
  });

  test("submits department updates and refreshes the department list", async () => {
    renderWithProviders(<DepartmentDetails />);

    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(updateDepartmentById).toHaveBeenCalledWith({
        id: "10",
        data: {
          name: "Updated Dept",
          department_code: "UD-01",
          department_head_id: 5,
        },
      });
    });

    // Modal closes and department list is refreshed after a successful submit.
    await waitFor(() => {
      expect(screen.queryByTestId("department-modal")).not.toBeInTheDocument();
    });

    expect(getDepartments).toHaveBeenCalledWith({ page: 1, search: "" });
  });

  test("closes the modal via onClose without submitting", () => {
    renderWithProviders(<DepartmentDetails />);

    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByTestId("department-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByTestId("department-modal")).not.toBeInTheDocument();
  });

  test("throws and logs when submitting without a departmentId", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    renderWithProviders(<DepartmentDetails />, { routeId: null });

    fireEvent.click(screen.getByText("Edit"));
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        "Department update failed:",
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});