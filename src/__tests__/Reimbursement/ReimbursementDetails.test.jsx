import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReimbursementDetails from "../../Pages/reimbursement/ReimbursementDetails";
import { fetchReimbursementsByDepartment } from "../../services/reimbursement";

// Mocks
vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useParams: () => ({ id: "14" }),
    useNavigate: () => vi.fn(),
  };
});

vi.mock("../../services/reimbursement", () => ({
  fetchReimbursementsByDepartment: vi.fn(),
  updateReimbursementStatus: vi.fn(),
  fetchReimbursementDetail: vi.fn(),
}));

vi.mock("../../Components/ReusableTable/ReusableTable", () => ({
  default: () => <div data-testid="reusable-table">Table</div>,
}));

vi.mock("../../Components/Pagination/ReusablePagination", () => ({
  default: () => <div data-testid="pagination">Pagination</div>,
}));

vi.mock("../../Components/ReusableTable/ReusableFilter", () => ({
  default: () => <div data-testid="filter">Filter</div>,
}));

vi.mock("../../Components/ReusableTable/ReusableHeader", () => ({
  default: (props) => <div data-testid="header">{props.title}</div>,
}));

vi.mock("../../Components/StatsCards/StatsCards", () => ({
  default: () => <div data-testid="stats-cards">Stats</div>,
}));

describe("ReimbursementDetails", () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockReturnValue({
      list: [{ id: "14", name: "HR Department" }],
    });
  });

  test("renders department title and details", async () => {
    fetchReimbursementsByDepartment.mockResolvedValue({
      results: [
        {
          id: 1,
          employee_name: "John Doe",
          expense_category: "Travel",
          amount: 100,
          date: "2026-08-31",
          created_at: "2026-08-31",
          note: "Travel note",
          status: "Pending",
        },
      ],
      count: 1,
    });

    render(
      <MemoryRouter initialEntries={["/reimbursements/14"]}>
        <Routes>
          <Route path="/reimbursements/:id" element={<ReimbursementDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("header")).toHaveTextContent("Reimbursement - HR Department Department");
    });
  });
});
