// src/__tests__/pages/dailyTask/DailyTask.test.jsx
//
// Test stack: Jest + @testing-library/react + @testing-library/user-event
//
// Card, EmployeeList, and TaskPanel are declared inline in DailyTask.jsx
// and not exported individually, so every test here goes through the
// default export and exercises them by interaction.

import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDispatch, useSelector } from "react-redux";

import DailyTask from "../../Pages/dailytask/DailyTask";

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("../../Redux/departmentSlice", () => ({
  getDepartmentsMin: () => ({ type: "getDepartmentsMin" }),
  getEmployeesByDepartmentMini: (id) => ({
    type: "getEmployeesByDepartmentMini",
    payload: id,
  }),
}));

vi.mock("../../Redux/dailyTaskSlice", () => ({
  getTasks: (args) => ({ type: "getTasks", payload: args }),
}));

const mockDispatch = vi.fn();

const departmentsFixture = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Sales" },
];

const employeesFixture = [
  { id: 101, employee_id: "E101", name: "Alice", profile_pic: "alice.png" },
  { id: 102, employee_id: "E102", name: "Bob", profile_pic: "" },
];

const tasksFixture = [
  {
    id: 1,
    task: "Fix login bug",
    project: "Portal",
    description: "Resolve the auth token issue",
    time_taken: 3,
    updated_at: "2026-01-15",
  },
];

let stateOverrides;

beforeEach(() => {
  vi.clearAllMocks();
  mockDispatch.mockImplementation(() => Promise.resolve({}));
  useDispatch.mockReturnValue(mockDispatch);

  stateOverrides = {
    departments: {
      minList: departmentsFixture,
      departmentEmployeesMini: employeesFixture,
    },
    dailyTask: { tasks: [], loading: false },
  };

  useSelector.mockImplementation((selectorFn) => selectorFn(stateOverrides));
});

describe("DailyTask", () => {
  test("fetches the minimal department list on mount", () => {
    render(<DailyTask />);
    expect(
      mockDispatch.mock.calls.some((c) => c[0].type === "getDepartmentsMin")
    ).toBe(true);
  });

  test("renders all departments and filters them as the user searches", async () => {
    const user = userEvent.setup();
    render(<DailyTask />);

    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getByText("Sales")).toBeInTheDocument();

    await user.type(
      screen.getByPlaceholderText("Search Department..."),
      "sale"
    );
    expect(screen.getByText("Sales")).toBeInTheDocument();
    expect(screen.queryByText("Engineering")).not.toBeInTheDocument();
  });

  test("prompts to select an employee before any department is chosen", () => {
    render(<DailyTask />);
    expect(screen.getByText("Select Employee Tasks")).toBeInTheDocument();
    expect(screen.getByText("Please select an employee.")).toBeInTheDocument();
  });

  test("selecting a department fetches its employees and shows the employee panel", async () => {
    const user = userEvent.setup();
    render(<DailyTask />);

    await user.click(screen.getByText("Engineering"));

    expect(
      mockDispatch.mock.calls.some(
        (c) =>
          c[0].type === "getEmployeesByDepartmentMini" && c[0].payload === 1
      )
    ).toBe(true);
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  test("clicking the same department again deselects it", async () => {
    const user = userEvent.setup();
    render(<DailyTask />);

    await user.click(screen.getByText("Engineering"));
    mockDispatch.mockClear();
    await user.click(screen.getByText("Engineering"));

    // Deselecting shouldn't re-trigger the employees fetch.
    expect(
      mockDispatch.mock.calls.some(
        (c) => c[0].type === "getEmployeesByDepartmentMini"
      )
    ).toBe(false);
  });

  test("employee search filters by name, case-insensitively", async () => {
    const user = userEvent.setup();
    render(<DailyTask />);
    await user.click(screen.getByText("Engineering"));

    await user.type(screen.getByPlaceholderText("Search Employee..."), "ALI");
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.queryByText("Bob")).not.toBeInTheDocument();
  });

  test("shows a message when the department has no employees", async () => {
    stateOverrides.departments.departmentEmployeesMini = [];
    const user = userEvent.setup();
    render(<DailyTask />);

    await user.click(screen.getByText("Engineering"));
    expect(
      screen.getByText("No employees in this department.")
    ).toBeInTheDocument();
  });

  test("shows an avatar image when profile_pic is set, and a fallback icon otherwise", async () => {
    const user = userEvent.setup();
    render(<DailyTask />);
    await user.click(screen.getByText("Engineering"));

    const aliceRow = screen.getByText("Alice").closest("div");
    expect(within(aliceRow).getByRole("img")).toBeInTheDocument();

    const bobRow = screen.getByText("Bob").closest("div");
    expect(within(bobRow).queryByRole("img")).not.toBeInTheDocument();
  });

  test("selecting an employee loads their tasks and updates the panel heading", async () => {
    const user = userEvent.setup();
    render(<DailyTask />);

    await user.click(screen.getByText("Engineering"));
    await user.click(screen.getByText("Alice"));

    expect(
      mockDispatch.mock.calls.some(
        (c) =>
          c[0].type === "getTasks" &&
          c[0].payload.employeeId === 101 &&
          c[0].payload.date === null
      )
    ).toBe(true);
    expect(screen.getByText("Tasks for Alice")).toBeInTheDocument();
  });

  test("keeps the selected employee's task panel visible even after the department is deselected", async () => {
    const user = userEvent.setup();
    render(<DailyTask />);

    await user.click(screen.getByText("Engineering"));
    await user.click(screen.getByText("Alice"));
    await user.click(screen.getByText("Engineering")); // deselect department

    expect(screen.getByText("Tasks for Alice")).toBeInTheDocument();
  });

  test("shows a loading message while tasks are being fetched", async () => {
    stateOverrides.dailyTask.loading = true;
    const user = userEvent.setup();
    render(<DailyTask />);

    await user.click(screen.getByText("Engineering"));
    await user.click(screen.getByText("Alice"));

    expect(screen.getByText("Loading tasks...")).toBeInTheDocument();
  });

  test("shows an empty-state message when the employee has no tasks", async () => {
    const user = userEvent.setup();
    render(<DailyTask />);

    await user.click(screen.getByText("Engineering"));
    await user.click(screen.getByText("Alice"));

    expect(
      screen.getByText("No tasks found for this employee.")
    ).toBeInTheDocument();
  });

  test("renders each task with its title, project, description, hours, and formatted date", async () => {
    stateOverrides.dailyTask.tasks = tasksFixture;
    const user = userEvent.setup();
    render(<DailyTask />);

    await user.click(screen.getByText("Engineering"));
    await user.click(screen.getByText("Alice"));

    expect(screen.getByText("Fix login bug")).toBeInTheDocument();
    expect(screen.getByText("(Portal)")).toBeInTheDocument();
    expect(screen.getByText("Resolve the auth token issue")).toBeInTheDocument();
    expect(screen.getByText("3 hrs")).toBeInTheDocument();
    expect(screen.getByText("15/01/2026")).toBeInTheDocument();
  });

  test("picking a due date re-fetches tasks with the formatted date", async () => {
    const user = userEvent.setup();
    render(<DailyTask />);

    await user.click(screen.getByText("Engineering"));
    await user.click(screen.getByText("Alice"));
    mockDispatch.mockClear();

    const dateInput = document.querySelector('input[type="date"]');
    await user.type(dateInput, "2026-02-10");

    await waitFor(() => {
      expect(
        mockDispatch.mock.calls.some(
          (c) => c[0].type === "getTasks" && c[0].payload.date === "2026-02-10"
        )
      ).toBe(true);
    });
  });

  test("the toggle arrow flips the department panel's open state", async () => {
    const user = userEvent.setup();
    render(<DailyTask />);

    expect(screen.getByText("«")).toBeInTheDocument();
    await user.click(screen.getByText("«"));
    expect(screen.getByText("»")).toBeInTheDocument();
  });
});