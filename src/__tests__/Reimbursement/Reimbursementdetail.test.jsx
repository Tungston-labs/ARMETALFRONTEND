import React from "react";
import { render, screen, waitFor, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from 'vitest';

import ReimbursementDetail from "../../Pages/reimbursement/Reimb_info"; // adjust path/filename to match your project
import {
  fetchReimbursementDetail,
  updateReimbursementStatus,
} from "../../services/reimbursement";

// ---- Mocks -----------------------------------------------------------

vi.mock("../../services/reimbursement", () => ({
  fetchReimbursementDetail: vi.fn(),
  updateReimbursementStatus: vi.fn(),
}));

vi.mock("../../Components/Loader/Loader", () => ({
  default: () => <div data-testid="loader" />,
}));

vi.mock("../../Components/EmployeeTitle", () => ({
  default: (props) => (
    <div data-testid="employee-title">
      <span>{props.title}</span>
      <span>{props.subtitle}</span>
      {props.rightElement}
    </div>
  ),
}));

vi.mock("../../assets/remi.svg", () => ({
  default: "remi-icon.svg",
}));

// Styled-components are mocked as simple passthrough elements so we can
// query by role/text without depending on the actual styling implementation.
vi.mock("../../Pages/reimbursement/Reimb_info.Styles", () => {
  const passthrough = (tag) => (props) =>
    React.createElement(tag, props, props.children);
  return {
    PageWrapper: passthrough("div"),
    Card: passthrough("div"),
    SectionTitle: passthrough("h3"),
    ProfileRow: passthrough("div"),
    ProfileImage: (props) => <img alt="profile" {...props} />,
    ProfileInfo: passthrough("div"),
    InfoRow: passthrough("div"),
    Label: passthrough("span"),
    Value: passthrough("span"),
    StatusSelect: (props) => <select {...props}>{props.children}</select>,
    Divider: passthrough("hr"),
    NoteBox: passthrough("div"),
    BillsGrid: passthrough("div"),
    BillImageWrapper: passthrough("div"),
    BillImage: (props) => <img alt="bill" {...props} />,
    NoteCard: passthrough("div"),
    NoteHeader: passthrough("div"),
    Arrow: passthrough("span"),
    TopStatusBar: passthrough("div"),
    TopStatusLabel: passthrough("label"),
  };
});

// ---- Test data ---------------------------------------------------------

const baseReimbursement = {
  id: "1",
  status: "In Verification",
  employee_name: "Jane Doe",
  employee_id: "EMP-100",
  department: { name: "Engineering" },
  profile_pic: null,
  date: "2026-03-15T00:00:00.000Z",
  amount: 1200,
  note: "Client dinner reimbursement",
  images: [
    { id: "b1", image: "https://example.com/bill1.png" },
    { id: "b2", image: "https://example.com/bill2.png" },
  ],
};

const renderWithRouter = (id = "1") =>
  render(
    <MemoryRouter initialEntries={[`/reimbursements/${id}`]}>
      <Routes>
        <Route path="/reimbursements/:id" element={<ReimbursementDetail />} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => {
  vi.clearAllMocks();
});

// ---- Tests ---------------------------------------------------------------

describe("ReimbursementDetail", () => {
  test("shows the loader while the detail is being fetched", async () => {
    let resolvePromise;
    fetchReimbursementDetail.mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      })
    );

    renderWithRouter();

    expect(screen.getByTestId("loader")).toBeInTheDocument();

    resolvePromise(baseReimbursement);
    await waitFor(() =>
      expect(screen.queryByTestId("loader")).not.toBeInTheDocument()
    );
  });

  test("renders 'No reimbursement found.' when fetch resolves to null", async () => {
    fetchReimbursementDetail.mockResolvedValue(null);

    renderWithRouter();

    expect(await screen.findByText("No reimbursement found.")).toBeInTheDocument();
  });

  test("renders 'No reimbursement found.' when fetch throws", async () => {
    fetchReimbursementDetail.mockRejectedValue(new Error("network error"));

    renderWithRouter();

    expect(await screen.findByText("No reimbursement found.")).toBeInTheDocument();
  });

  test("calls fetchReimbursementDetail with the id from the route params", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    renderWithRouter("42");

    await waitFor(() =>
      expect(fetchReimbursementDetail).toHaveBeenCalledWith("42")
    );
  });

  test("renders employee information once loaded", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    renderWithRouter();

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("EMP-100")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
  });

  test("formats the date as DD/Mon/YYYY", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    renderWithRouter();

    expect(await screen.findByText("15/Mar/2026")).toBeInTheDocument();
  });

  test("renders '----' when date is missing", async () => {
    fetchReimbursementDetail.mockResolvedValue({ ...baseReimbursement, date: null });

    renderWithRouter();

    expect(await screen.findByText("----")).toBeInTheDocument();
  });

  test("renders the amount", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    renderWithRouter();

    expect(await screen.findByText("1200")).toBeInTheDocument();
  });

  test("falls back to a ui-avatars image when profile_pic is missing", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    renderWithRouter();

    const img = await screen.findByAltText("profile");
    expect(img.src).toContain("ui-avatars.com/api/");
    expect(img.src).toContain(encodeURIComponent("Jane Doe"));
  });

  test("uses the provided profile_pic when present", async () => {
    fetchReimbursementDetail.mockResolvedValue({
      ...baseReimbursement,
      profile_pic: "https://example.com/avatar.png",
    });

    renderWithRouter();

    const img = await screen.findByAltText("profile");
    expect(img.src).toBe("https://example.com/avatar.png");
  });

  test("renders one image per bill", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    renderWithRouter();

    const bills = await screen.findAllByAltText("bill");
    expect(bills).toHaveLength(2);
    expect(bills[0]).toHaveAttribute("src", "https://example.com/bill1.png");
    expect(bills[1]).toHaveAttribute("src", "https://example.com/bill2.png");
  });

  test("note is hidden by default and toggles open/closed on click", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    renderWithRouter();
    await screen.findByText("Jane Doe");

    expect(screen.queryByText("Client dinner reimbursement")).not.toBeInTheDocument();
    expect(screen.getByText("▼")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Note"));

    expect(await screen.findByText("Client dinner reimbursement")).toBeInTheDocument();
    expect(screen.getByText("▲")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Note"));

    expect(screen.queryByText("Client dinner reimbursement")).not.toBeInTheDocument();
  });

  test("status select is enabled and shows current status when not Approved", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);

    renderWithRouter();

    const select = await screen.findByDisplayValue("In Verification");
    expect(select).not.toBeDisabled();
  });

  test("status select is disabled when status is Approve", async () => {
    fetchReimbursementDetail.mockResolvedValue({ ...baseReimbursement, status: "Approve" });

    renderWithRouter();

    const select = await screen.findByDisplayValue("Approved");
    expect(select).toBeDisabled();
  });

  test("changing status optimistically updates and calls updateReimbursementStatus", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);
    updateReimbursementStatus.mockResolvedValue({});

    renderWithRouter();

    const select = await screen.findByDisplayValue("In Verification");
    fireEvent.change(select, { target: { value: "On Hold" } });

    expect(select.value).toBe("On Hold");
    await waitFor(() =>
      expect(updateReimbursementStatus).toHaveBeenCalledWith("1", "On Hold")
    );
  });

  test("reverts to the previous status if updateReimbursementStatus fails", async () => {
    fetchReimbursementDetail.mockResolvedValue(baseReimbursement);
    updateReimbursementStatus.mockRejectedValue(new Error("failed"));

    renderWithRouter();

    const select = await screen.findByDisplayValue("In Verification");
    fireEvent.change(select, { target: { value: "Reject" } });

    // Optimistic update happens immediately
    expect(select.value).toBe("Reject");

    // Reverts after the failed API call resolves
    await waitFor(() => expect(select.value).toBe("In Verification"));
  });

  test("does nothing when status is already Approve (early return guard)", async () => {
    fetchReimbursementDetail.mockResolvedValue({ ...baseReimbursement, status: "Approve" });

    renderWithRouter();

    const select = await screen.findByDisplayValue("Approved");
    fireEvent.change(select, { target: { value: "Reject" } });

    expect(updateReimbursementStatus).not.toHaveBeenCalled();
    expect(select.value).toBe("Approve");
  });
});