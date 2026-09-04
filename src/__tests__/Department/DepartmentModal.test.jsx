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

import DepartmentModal from "../../Pages/department/Department/modal/DepartmentModal";

import {
  getEmployeesByDepartment,
} from "../../Redux/departmentSlice";

// ============================================================
// MOCK REDUX ACTION
// ============================================================

vi.mock("../../Redux/departmentSlice", () => ({
  getEmployeesByDepartment: vi.fn((departmentId) => ({
    type: "departments/getEmployeesByDepartment",
    payload: departmentId,
  })),
}));

// ============================================================
// MOCK STYLES
// ============================================================

vi.mock(
  "../../Pages/department/Department/modal/DepartmentModal.styles",
  () => {
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
      Overlay: ({ children, ...props }) => (
        <div
          data-testid="department-overlay"
          {...props}
        >
          {children}
        </div>
      ),
      Modal: createComponent(),
      ModalHeader: createComponent(),
      ModalTitle: createComponent("h2"),
      Form: createComponent("form"),
      FormRow: createComponent(),
      FormGroup: createComponent(),
      Label: createComponent("label"),
      Required: createComponent("span"),
      Input: createComponent("input"),
      Select: createComponent("select"),
      ButtonRow: createComponent(),
      CancelButton: createComponent("button"),
      SubmitButton: createComponent("button"),
      ErrorMessage: createComponent("div"),
    };
  }
);

// ============================================================
// TEST STORE
// ============================================================

const createTestStore = ({
  departmentEmployees = [],
  loadingEmployees = false,
} = {}) => {
  return configureStore({
    reducer: {
      departments: (
        state = {
          departmentEmployees,
          loadingEmployees,
        },
        action
      ) => state,
    },
  });
};

// ============================================================
// RENDER HELPER
// ============================================================

const renderModal = ({
  isOpen = true,
  mode = "add",
  departmentData = null,
  departmentId = null,
  onSubmit = vi.fn(),
  onClose = vi.fn(),
  departments = [],
  departmentEmployees = [],
  loadingEmployees = false,
} = {}) => {
  const store = createTestStore({
    departmentEmployees,
    loadingEmployees,
  });

  render(
    <Provider store={store}>
      <DepartmentModal
        isOpen={isOpen}
        mode={mode}
        departmentData={departmentData}
        departmentId={departmentId}
        onSubmit={onSubmit}
        onClose={onClose}
        departments={departments}
      />
    </Provider>
  );

  return {
    store,
    onSubmit,
    onClose,
  };
};

// ============================================================
// TESTS
// ============================================================

describe("DepartmentModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================================
  // 1. MODAL CLOSED
  // ==========================================================

  it("should not render when modal is closed", () => {
    renderModal({
      isOpen: false,
    });

    expect(
      screen.queryByText("Add Department")
    ).not.toBeInTheDocument();
  });

  // ==========================================================
  // 2. ADD MODE
  // ==========================================================

  it("should render Add Department modal", () => {
    renderModal();

    expect(
      screen.getByText("Add Department")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "CREATE",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "CANCEL",
      })
    ).toBeInTheDocument();
  });

  // ==========================================================
  // 3. FORM FIELDS
  // ==========================================================

  it("should render department name and code fields", () => {
    renderModal();

    expect(
      screen.getByPlaceholderText("Development")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("DEV-001")
    ).toBeInTheDocument();
  });

  // ==========================================================
  // 4. HEAD DROPDOWN NOT SHOWN IN ADD MODE
  // ==========================================================

  it("should not show Head Of The Department field in add mode", () => {
    renderModal();

    expect(
      screen.queryByText(
        "Head Of The Department"
      )
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("combobox")
    ).not.toBeInTheDocument();
  });

  // ==========================================================
  // 5. REQUIRED NAME VALIDATION
  // ==========================================================

  it("should show required error when department name is empty", async () => {
    const onSubmit = vi.fn();

    renderModal({
      onSubmit,
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "CREATE",
      })
    );

    expect(
      await screen.findByText(
        "Department name is required."
      )
    ).toBeInTheDocument();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  // ==========================================================
  // 6. REQUIRED CODE VALIDATION
  // ==========================================================

  it("should show required error when department code is empty", async () => {
    const onSubmit = vi.fn();

    renderModal({
      onSubmit,
    });

    const nameInput =
      screen.getByPlaceholderText(
        "Development"
      );

    fireEvent.change(nameInput, {
      target: {
        value: "Finance",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "CREATE",
      })
    );

    expect(
      await screen.findByText(
        "Department code is required."
      )
    ).toBeInTheDocument();

    expect(onSubmit).not.toHaveBeenCalled();
  });

  // ==========================================================
  // 7. DUPLICATE DEPARTMENT NAME
  // ==========================================================

  it("should show duplicate department name error", async () => {
    const departments = [
      {
        id: 1,
        name: "Finance",
        department_code: "FIN",
      },
    ];

    renderModal({
      departments,
    });

    const nameInput =
      screen.getByPlaceholderText(
        "Development"
      );

    fireEvent.change(nameInput, {
      target: {
        value: "Finance",
      },
    });

    expect(
      await screen.findByText(
        "Department name already exists."
      )
    ).toBeInTheDocument();
  });

  // ==========================================================
  // 8. DUPLICATE DEPARTMENT CODE
  // ==========================================================

  it("should show duplicate department code error", async () => {
    const departments = [
      {
        id: 1,
        name: "Finance",
        department_code: "FIN",
      },
    ];

    renderModal({
      departments,
    });

    const codeInput =
      screen.getByPlaceholderText("DEV-001");

    fireEvent.change(codeInput, {
      target: {
        value: "FIN",
      },
    });

    expect(
      await screen.findByText(
        "Department code already exists."
      )
    ).toBeInTheDocument();
  });

  // ==========================================================
  // 9. SUCCESSFUL CREATE
  // ==========================================================

  it("should submit valid department data", async () => {
    const onSubmit = vi
      .fn()
      .mockResolvedValue({
        id: 10,
        name: "Finance",
      });

    renderModal({
      onSubmit,
    });

    fireEvent.change(
      screen.getByPlaceholderText(
        "Development"
      ),
      {
        target: {
          value: "Finance",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("DEV-001"),
      {
        target: {
          value: "FIN",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "CREATE",
      })
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        departmentName: "Finance",
        departmentCode: "FIN",
        headOfDepartment: "",
      });
    });
  });

  // ==========================================================
  // 10. CLICK OVERLAY CLOSES MODAL (ADD MODE)
  // ==========================================================

  it("should call onClose when overlay is clicked", () => {
    const onClose = vi.fn();

    renderModal({
      onClose,
    });

    const overlay = screen.getByTestId(
      "department-overlay"
    );

    fireEvent.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  // ==========================================================
  // 11. EDIT MODE
  // ==========================================================

  it("should render Edit Department modal", () => {
    renderModal({
      mode: "edit",
      departmentId: 5,
      departmentData: {
        id: 5,
        departmentName: "Development",
        departmentCode: "DEV",
        headOfDepartment: "10",
      },
    });

    expect(
      screen.getByText("Edit Department")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "UPDATE",
      })
    ).toBeInTheDocument();
  });

  // ==========================================================
  // 12. EDIT FORM DATA
  // ==========================================================

  it("should populate form fields in edit mode", async () => {
    renderModal({
      mode: "edit",
      departmentId: 5,
      departmentData: {
        id: 5,
        departmentName: "Development",
        departmentCode: "DEV",
        headOfDepartment: "10",
      },
      departmentEmployees: [
        {
          id: 10,
          name: "John Doe",
        },
      ],
    });

    expect(
      screen.getByDisplayValue("Development")
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("DEV")
    ).toBeInTheDocument();

    const select = await screen.findByRole(
      "combobox"
    );

    await waitFor(() => {
      expect(select).toHaveValue("10");
    });
  });

  // ==========================================================
  // 13. EMPLOYEE API DISPATCH
  // ==========================================================

  it("should fetch department employees in edit mode", () => {
    renderModal({
      mode: "edit",
      departmentId: 5,
      departmentData: {
        id: 5,
        departmentName: "Development",
        departmentCode: "DEV",
      },
    });

    expect(
      getEmployeesByDepartment
    ).toHaveBeenCalledWith(5);
  });

  // ==========================================================
  // 14. HEAD OF DEPARTMENT DROPDOWN
  // ==========================================================

  it("should display employees in head of department dropdown", () => {
    renderModal({
      mode: "edit",
      departmentId: 5,
      departmentData: {
        id: 5,
        departmentName: "Development",
        departmentCode: "DEV",
      },
      departmentEmployees: [
        {
          id: 10,
          name: "John Doe",
        },
        {
          id: 11,
          employee_name: "Jane Smith",
        },
      ],
    });

    expect(
      screen.getByRole("option", {
        name: "John Doe",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Jane Smith",
      })
    ).toBeInTheDocument();
  });

  // ==========================================================
  // 15. EMPLOYEE FULL NAME FALLBACK
  // ==========================================================

  it("should use full_name when employee name is unavailable", () => {
    renderModal({
      mode: "edit",
      departmentId: 5,
      departmentData: {
        id: 5,
        departmentName: "Development",
        departmentCode: "DEV",
      },
      departmentEmployees: [
        {
          id: 20,
          full_name: "Alex Johnson",
        },
      ],
    });

    expect(
      screen.getByRole("option", {
        name: "Alex Johnson",
      })
    ).toBeInTheDocument();
  });

  // ==========================================================
  // 16. EMPLOYEE ID FALLBACK
  // ==========================================================

  it("should display Employee ID when employee name is missing", () => {
    renderModal({
      mode: "edit",
      departmentId: 5,
      departmentData: {
        id: 5,
        departmentName: "Development",
        departmentCode: "DEV",
      },
      departmentEmployees: [
        {
          id: 20,
        },
      ],
    });

    expect(
      screen.getByRole("option", {
        name: "Employee #20",
      })
    ).toBeInTheDocument();
  });

  // ==========================================================
  // 17. NO EMPLOYEES
  // ==========================================================

  it("should show no employees message", () => {
    renderModal({
      mode: "edit",
      departmentId: 5,
      departmentData: {
        id: 5,
        departmentName: "Development",
        departmentCode: "DEV",
      },
      departmentEmployees: [],
      loadingEmployees: false,
    });

    expect(
      screen.getByText(
        "No employees found in this department."
      )
    ).toBeInTheDocument();
  });

  // ==========================================================
  // 18. LOADING EMPLOYEES
  // ==========================================================

  it("should show loading employees message", () => {
    renderModal({
      mode: "edit",
      departmentId: 5,
      departmentData: {
        id: 5,
        departmentName: "Development",
        departmentCode: "DEV",
      },
      loadingEmployees: true,
    });

    expect(
      screen.getByRole("option", {
        name: "Loading employees...",
      })
    ).toBeInTheDocument();
  });

  // ==========================================================
  // 19. SELECT HEAD OF DEPARTMENT
  // ==========================================================

  it("should allow selecting a department head", () => {
    renderModal({
      mode: "edit",
      departmentId: 5,
      departmentData: {
        id: 5,
        departmentName: "Development",
        departmentCode: "DEV",
      },
      departmentEmployees: [
        {
          id: 10,
          name: "John Doe",
        },
      ],
    });

    const select =
      screen.getByRole("combobox");

    fireEvent.change(select, {
      target: {
        value: "10",
      },
    });

    expect(select).toHaveValue("10");
  });

  // ==========================================================
  // 20. EDIT SUBMIT
  // ==========================================================

  it("should submit edit department data", async () => {
    const onSubmit = vi
      .fn()
      .mockResolvedValue({});

    renderModal({
      onSubmit,
      mode: "edit",
      departmentId: 5,
      departmentData: {
        id: 5,
        departmentName: "Development",
        departmentCode: "DEV",
        headOfDepartment: "10",
      },
      departmentEmployees: [
        {
          id: 10,
          name: "John Doe",
        },
      ],
    });

    await screen.findByRole("option", {
      name: "John Doe",
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "UPDATE",
      })
    );

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        departmentName: "Development",
        departmentCode: "DEV",
        headOfDepartment: "10",
        id: 5,
      });
    });
  });

  // ==========================================================
  // 21. BACKEND DEPARTMENT CODE ERROR
  // ==========================================================

  it("should display backend department code error", async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValue({
        department_code: [
          "This department code already exists.",
        ],
      });

    renderModal({
      onSubmit,
    });

    fireEvent.change(
      screen.getByPlaceholderText(
        "Development"
      ),
      {
        target: {
          value: "Finance",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("DEV-001"),
      {
        target: {
          value: "FIN",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "CREATE",
      })
    );

    expect(
      await screen.findByText(
        "This department code already exists."
      )
    ).toBeInTheDocument();
  });

  // ==========================================================
  // 22. BACKEND DEPARTMENT NAME ERROR
  // ==========================================================

  it("should display backend department name error", async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValue({
        name: [
          "This department name already exists.",
        ],
      });

    renderModal({
      onSubmit,
    });

    fireEvent.change(
      screen.getByPlaceholderText(
        "Development"
      ),
      {
        target: {
          value: "Finance",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("DEV-001"),
      {
        target: {
          value: "FIN",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "CREATE",
      })
    );

    expect(
      await screen.findByText(
        "This department name already exists."
      )
    ).toBeInTheDocument();
  });

  // ==========================================================
  // 23. GENERAL BACKEND ERROR
  // ==========================================================

  it("should display general backend error", async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValue({
        detail: "Unable to create department.",
      });

    renderModal({
      onSubmit,
    });

    fireEvent.change(
      screen.getByPlaceholderText(
        "Development"
      ),
      {
        target: {
          value: "Finance",
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText("DEV-001"),
      {
        target: {
          value: "FIN",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "CREATE",
      })
    );

    expect(
      await screen.findByText(
        "Unable to create department."
      )
    ).toBeInTheDocument();
  });

  // ==========================================================
  // 24. DEPARTMENT NAME CHANGE
  // ==========================================================

  it("should update department name field", () => {
    renderModal();

    const input =
      screen.getByPlaceholderText(
        "Development"
      );

    fireEvent.change(input, {
      target: {
        value: "Finance",
      },
    });

    expect(input).toHaveValue("Finance");
  });

  // ==========================================================
  // 25. DEPARTMENT CODE CHANGE
  // ==========================================================

  it("should update department code field", () => {
    renderModal();

    const input =
      screen.getByPlaceholderText("DEV-001");

    fireEvent.change(input, {
      target: {
        value: "FIN",
      },
    });

    expect(input).toHaveValue("FIN");
  });
});