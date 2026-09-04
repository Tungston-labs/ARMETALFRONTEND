import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReimbursementCards from "../../Pages/reimbursement/ReimbursementCards";
import { getDepartments } from "../../Redux/departmentSlice";
import { getGroupedReimbursements } from "../../services/reimbursement";

// Mocks
vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("../../Redux/departmentSlice", () => ({
  getDepartments: vi.fn(),
}));

vi.mock("../../services/reimbursement", () => ({
  getGroupedReimbursements: vi.fn(),
}));

vi.mock("../../Components/ReusableTable/ReusableHeader", () => ({
  default: (props) => (
    <div data-testid="header">
      <h1>{props.title}</h1>
      <button onClick={props.onButtonClick}>{props.buttonText}</button>
    </div>
  ),
}));

vi.mock("../../Components/ReusableTable/ReusableFilter", () => ({
  default: (props) => (
    <input
      data-testid="filter-input"
      value={props.search}
      onChange={(e) => props.onSearch(e.target.value)}
    />
  ),
}));

// Mock styled components
vi.mock("../../Pages/reimbursement/ReimbursementCard.Styles", () => {
  const passthrough = (tag) => (props) =>
    React.createElement(tag, props, props.children);
  return {
    Container: passthrough("div"),
    HeaderWrapper: passthrough("div"),
    CardsGrid: passthrough("div"),
    Card: passthrough("div"),
    CardHeader: passthrough("div"),
    ReimbursementName: passthrough("h3"),
    StatusBadge: passthrough("span"),
    StatusRow: passthrough("div"),
    ApprovedAmount: passthrough("span"),
    PendingAmount: passthrough("span"),
    CardBottom: passthrough("div"),
    EmployeeCount: passthrough("div"),
    EmployeeImage: (props) => <img alt="avatar" {...props} />,
    ReimbursementNumber: passthrough("span"),
    ViewButton: passthrough("button"),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("ReimbursementCards", () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    mockDispatch.mockImplementation(() => ({
      unwrap: () => Promise.resolve([])
    }));
    useSelector.mockReturnValue({
      list: [
        { id: 14, name: "HR", department_head: { name: "Ansal" } },
        { id: 15, name: "Development", department_head: { name: "Risvin" } },
      ],
    });
  });

  test("dispatches getDepartments and fetches grouped reimbursements on mount", async () => {
    getDepartments.mockReturnValue({ type: "departments/getDepartments" });
    mockDispatch.mockReturnValue({ unwrap: () => Promise.resolve([]) });
    getGroupedReimbursements.mockResolvedValue([]);

    render(
      <MemoryRouter>
        <ReimbursementCards />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(getGroupedReimbursements).toHaveBeenCalled();
    });
  });

  test("renders department cards with head, requests count, and amounts", async () => {
    getDepartments.mockReturnValue({ type: "departments/getDepartments" });
    mockDispatch.mockReturnValue({ unwrap: () => Promise.resolve([]) });

    // Mock 3 reimbursement requests belonging to HR (department id 14)
    const mockGrouped = [
      {
        date: "2026-08-31",
        reimbursements: [
          {
            id: 1,
            amount: 1500,
            status: "Approve",
            department: { id: 14, name: "HR" },
            employee_id: "emp1",
            employee_name: "Jane",
          },
          {
            id: 2,
            amount: 3500,
            status: "Pending",
            department: { id: 14, name: "HR" },
            employee_id: "emp2",
            employee_name: "John",
          },
        ],
      },
    ];

    getGroupedReimbursements.mockResolvedValue(mockGrouped);

    render(
      <MemoryRouter>
        <ReimbursementCards />
      </MemoryRouter>
    );

    // Wait for async load
    expect(await screen.findByText("HR DEPARTMENT")).toBeInTheDocument();
    expect(screen.getByText("Head Of The Department : Ansal")).toBeInTheDocument();

    // Verify requests and amount calculations:
    // Total Request = 2, Approved = 1500, Total AMT = 5000
    expect(screen.getByText("Total Request : 02")).toBeInTheDocument();
    expect(screen.getByText("Approved : ₹1,500")).toBeInTheDocument();
    expect(screen.getByText("Total AMT : ₹5,000")).toBeInTheDocument();
  });

  test("clicking VIEW REQUEST navigates to department-wise reimbursement list", async () => {
    getDepartments.mockReturnValue({ type: "departments/getDepartments" });
    mockDispatch.mockReturnValue({ unwrap: () => Promise.resolve([]) });
    const mockGrouped = [
      {
        date: "2026-08-31",
        reimbursements: [
          {
            id: 1,
            amount: 1500,
            status: "Approve",
            department: { id: 14, name: "HR" },
            employee_id: "emp1",
            employee_name: "Jane",
          },
        ],
      },
    ];
    getGroupedReimbursements.mockResolvedValue(mockGrouped);

    render(
      <MemoryRouter>
        <ReimbursementCards />
      </MemoryRouter>
    );

    const viewRequestBtn = await screen.findAllByText("VIEW REQUEST");
    fireEvent.click(viewRequestBtn[0]);

    // Navigates to HR department id 14
    expect(mockNavigate).toHaveBeenCalledWith("/reimbursements/14");
  });
});
