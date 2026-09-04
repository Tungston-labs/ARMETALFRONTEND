import React, { act } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import HolidayManager from "../../Pages/holiday/Holiday";

import { useDispatch, useSelector } from "react-redux";
import {
  getHolidays,
  addHoliday,
  removeHoliday,
} from "../../Redux/holidaySlice";
import { fetchHolidayTypes } from "../../services/holidayService";
import { getHolidayColumns } from "../../Pages/holiday/Holidaycolumns";

/* -------------------------------------------------------------------------- */
/*                                   MOCKS                                    */
/* -------------------------------------------------------------------------- */

vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(),
}));

vi.mock("../../Redux/holidaySlice", () => ({
  getHolidays: vi.fn((page) => ({
    type: "holidays/getHolidays",
    payload: page,
  })),
  addHoliday: vi.fn((payload) => ({
    type: "holidays/addHoliday",
    payload,
    unwrap: () => Promise.resolve({}),
  })),
  removeHoliday: vi.fn((id) => ({
    type: "holidays/removeHoliday",
    payload: id,
  })),
}));

vi.mock("../../services/holidayService", () => ({
  fetchHolidayTypes: vi.fn(),
}));

vi.mock("../../Pages/holiday/Holidaycolumns", () => ({
  getHolidayColumns: vi.fn(() => []),
}));

vi.mock("../../Pages/holiday/Holiday.styles", () => ({
  Container: ({ children }) => (
    <div data-testid="holiday-container">{children}</div>
  ),
}));

vi.mock("../../Components/ReusableTable/ReusableHeader", () => ({
  default: ({ title, buttonText, onButtonClick }) => (
    <div data-testid="reusable-header">
      <h1>{title}</h1>

      <button type="button" onClick={onButtonClick}>
        {buttonText}
      </button>
    </div>
  ),
}));

vi.mock("../../Components/ReusableTable/ReusableFilter", () => ({
  default: ({ search, onSearch, searchPlaceholder, date, onDate }) => (
    <div data-testid="reusable-filter">
      <input
        aria-label="Search holidays"
        placeholder={searchPlaceholder}
        value={search || ""}
        onChange={(event) => onSearch?.(event.target.value)}
      />

      <input
        aria-label="Holiday month"
        type="month"
        value={date || ""}
        onChange={(event) => onDate?.(event.target.value)}
      />
    </div>
  ),
}));

vi.mock("../../Components/ReusableTable/ReusableTable", () => ({
  default: ({ data = [], loading }) => (
    <div data-testid="reusable-table">
      {loading ? (
        <div data-testid="table-loading">Loading...</div>
      ) : (
        data.map((holiday, index) => (
          <div
            data-testid="holiday-row"
            key={holiday.id ?? `${holiday.description}-${index}`}
          >
            <span>{holiday.description}</span>

            <button
              type="button"
              aria-label={`Delete ${holiday.description}`}
              onClick={() => {
                if (holiday.id !== undefined) {
                  window.__holidayDelete?.(holiday.id);
                }
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  ),
}));

vi.mock("../../Components/Pagination/Pagination", () => ({
  default: ({ currentPage, totalPages, onPageChange }) => (
    <div data-testid="pagination">
      <span data-testid="current-page">{currentPage}</span>
      <span data-testid="total-pages">{totalPages}</span>

      <button
        type="button"
        aria-label="Previous page"
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>

      <button
        type="button"
        aria-label="Next page"
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  ),
}));

vi.mock("../../Components/modals/ReusableConfirmModal", () => ({
  default: ({
    show,
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onClose,
  }) =>
    show ? (
      <div data-testid="confirm-modal">
        <h2>{title}</h2>
        <p>{message}</p>

        <button type="button" onClick={onConfirm}>
          {confirmText}
        </button>

        <button type="button" onClick={onClose}>
          {cancelText}
        </button>
      </div>
    ) : null,
}));

vi.mock("../../Pages/holiday/modal/HolidayModal", () => ({
  default: ({
    isOpen,
    onClose,
    formData,
    onChange,
    onAdd,
    formError,
    typeOptions,
  }) =>
    isOpen ? (
      <div data-testid="holiday-modal">
        <h2>Add Holiday</h2>

        <input
          aria-label="Holiday name"
          name="name"
          value={formData.name}
          onChange={onChange}
        />

        <select
          aria-label="Holiday type"
          name="type"
          value={formData.type}
          onChange={onChange}
        >
          <option value="">Select type</option>

          {typeOptions.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>

        <input
          aria-label="Holiday date"
          name="date"
          type="date"
          value={formData.date}
          onChange={onChange}
        />

        <select
          aria-label="Weekly off day"
          name="off_day_weekday"
          value={formData.off_day_weekday}
          onChange={onChange}
        >
          <option value="">Select weekday</option>
          <option value="0">Sunday</option>
          <option value="1">Monday</option>
          <option value="2">Tuesday</option>
          <option value="3">Wednesday</option>
          <option value="4">Thursday</option>
          <option value="5">Friday</option>
          <option value="6">Saturday</option>
        </select>

        {formError && <div data-testid="form-error">{formError}</div>}

        <button type="button" onClick={onAdd}>
          Add Holiday
        </button>

        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

/* -------------------------------------------------------------------------- */
/*                              TEST CONSTANTS                                */
/* -------------------------------------------------------------------------- */

const defaultHolidays = [
  {
    id: 1,
    description: "Independence Day",
    date: "2026-08-15",
  },
  {
    id: 2,
    description: "Company Foundation Day",
    date: "2026-09-10",
  },
  {
    id: 3,
    description: "Second Saturday",
    date: "2026-09-12",
  },
  {
    id: 4,
    description: "Weekly Off",
    date: null,
  },
];

const createState = (overrides = {}) => ({
  holidays: {
    list: defaultHolidays,
    loading: false,
    totalPages: 3,
    currentPage: 1,
    ...overrides,
  },
});

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

const renderHoliday = (stateOverrides = {}) => {
  useSelector.mockImplementation((selector) =>
    selector(createState(stateOverrides)),
  );

  return render(<HolidayManager />);
};

/* -------------------------------------------------------------------------- */
/*                                   TESTS                                    */
/* -------------------------------------------------------------------------- */

describe("HolidayManager", () => {
  let mockDispatch;

  beforeEach(() => {
    vi.clearAllMocks();

    mockDispatch = vi.fn();

    useDispatch.mockReturnValue(mockDispatch);

    fetchHolidayTypes.mockResolvedValue({
      holiday_types: [
        { key: "public", label: "Public Holiday" },
        { key: "company", label: "Company Holiday" },
        { key: "company_off_day", label: "Company Off Day" },
        { key: "second_saturday", label: "Second Saturdays" },
      ],
    });

    mockDispatch.mockImplementation((action) => {
      if (action?.type === "holidays/addHoliday") {
        return {
          unwrap: () => Promise.resolve({}),
        };
      }

      if (action?.type === "holidays/removeHoliday") {
        return Promise.resolve({});
      }

      return Promise.resolve({});
    });

    window.__holidayDelete = undefined;
  });

  afterEach(() => {
    delete window.__holidayDelete;
    vi.restoreAllMocks();
  });

  /* ---------------------------------------------------------------------- */
  /*                              INITIAL RENDER                            */
  /* ---------------------------------------------------------------------- */

  it("renders the Holiday page", async () => {
    renderHoliday();

    expect(screen.getByText("Holiday")).toBeInTheDocument();
    expect(screen.getByText("+ ADD NEW HOLIDAY")).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchHolidayTypes).toHaveBeenCalledTimes(1);
    });
  });

  it("dispatches getHolidays on initial render", async () => {
    renderHoliday();

    await waitFor(() => {
      expect(getHolidays).toHaveBeenCalledWith(1);
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it("passes the correct columns configuration", async () => {
    renderHoliday();

    await waitFor(() => {
      expect(getHolidayColumns).toHaveBeenCalledWith(
        expect.objectContaining({
          currentPage: 1,
          pageSize: 20,
          onDeleteClick: expect.any(Function),
        }),
      );
    });
  });

  it("renders holidays sorted by date descending with null dates last", () => {
    renderHoliday();

    const rows = screen.getAllByTestId("holiday-row");

    expect(rows).toHaveLength(4);

    expect(rows[0]).toHaveTextContent("Second Saturday");
    expect(rows[1]).toHaveTextContent("Company Foundation Day");
    expect(rows[2]).toHaveTextContent("Independence Day");
    expect(rows[3]).toHaveTextContent("Weekly Off");
  });

  it("renders loading state", () => {
    renderHoliday({ loading: true });

    expect(screen.getByTestId("table-loading")).toBeInTheDocument();
  });

  it("handles empty holiday list", () => {
    renderHoliday({
      list: [],
    });

    expect(screen.queryAllByTestId("holiday-row")).toHaveLength(0);
  });

  it("handles holidays with missing description", () => {
    renderHoliday({
      list: [
        {
          id: 1,
          date: "2026-09-10",
        },
      ],
    });

    expect(screen.getByTestId("holiday-row")).toBeInTheDocument();
  });

  it("handles holidays with missing date", () => {
    renderHoliday({
      list: [
        {
          id: 1,
          description: "No Date Holiday",
          date: null,
        },
      ],
    });

    expect(screen.getByText("No Date Holiday")).toBeInTheDocument();
  });

  /* ---------------------------------------------------------------------- */
  /*                            HOLIDAY TYPES                               */
  /* ---------------------------------------------------------------------- */

  it("uses API holiday types when available", async () => {
    fetchHolidayTypes.mockResolvedValueOnce({
      holiday_types: [
        {
          key: "special",
          label: "Special Holiday",
        },
      ],
    });

    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    await waitFor(() => {
      expect(screen.getByText("Special Holiday")).toBeInTheDocument();
    });
  });

  it("uses default holiday types when API returns empty holiday_types", async () => {
    fetchHolidayTypes.mockResolvedValueOnce({
      holiday_types: [],
    });

    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    await waitFor(() => {
      expect(screen.getByText("Public Holiday")).toBeInTheDocument();

      expect(screen.getByText("Company Holiday")).toBeInTheDocument();

      expect(screen.getByText("Company Off Day")).toBeInTheDocument();

      expect(screen.getByText("Second Saturdays")).toBeInTheDocument();
    });
  });

  it("uses default holiday types when API returns no holiday_types property", async () => {
    fetchHolidayTypes.mockResolvedValueOnce({});

    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    await waitFor(() => {
      expect(screen.getByText("Public Holiday")).toBeInTheDocument();
    });
  });

  it("uses default holiday types when fetchHolidayTypes rejects", async () => {
    fetchHolidayTypes.mockRejectedValueOnce(new Error("Holiday types failed"));

    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    await waitFor(() => {
      expect(screen.getByText("Public Holiday")).toBeInTheDocument();

      expect(screen.getByText("Company Off Day")).toBeInTheDocument();
    });
  });

  /* ---------------------------------------------------------------------- */
  /*                              MODAL                                     */
  /* ---------------------------------------------------------------------- */

  it("opens the add holiday modal", () => {
    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    expect(screen.getByTestId("holiday-modal")).toBeInTheDocument();
  });

  it("closes the add holiday modal", () => {
    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    expect(screen.getByTestId("holiday-modal")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));

    expect(screen.queryByTestId("holiday-modal")).not.toBeInTheDocument();
  });

  it("resets the form when opening the modal", () => {
    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    const nameInput = screen.getByLabelText("Holiday name");

    fireEvent.change(nameInput, {
      target: {
        value: "Temporary Holiday",
      },
    });

    fireEvent.click(screen.getByText("Close"));

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    expect(screen.getByLabelText("Holiday name")).toHaveValue("");
  });

  it("updates form fields when changed", () => {
    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    const nameInput = screen.getByLabelText("Holiday name");
    const typeInput = screen.getByLabelText("Holiday type");
    const dateInput = screen.getByLabelText("Holiday date");

    fireEvent.change(nameInput, {
      target: {
        name: "name",
        value: "New Holiday",
      },
    });

    fireEvent.change(typeInput, {
      target: {
        name: "type",
        value: "public",
      },
    });

    fireEvent.change(dateInput, {
      target: {
        name: "date",
        value: "2099-01-01",
      },
    });

    expect(nameInput).toHaveValue("New Holiday");
    expect(typeInput).toHaveValue("public");
    expect(dateInput).toHaveValue("2099-01-01");
  });

  /* ---------------------------------------------------------------------- */
  /*                            VALIDATION                                  */
  /* ---------------------------------------------------------------------- */

  it("shows required field validation when name and type are empty", () => {
    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    fireEvent.click(screen.getByRole("button", { name: "Add Holiday" }));

    expect(screen.getByTestId("form-error")).toHaveTextContent(
      "Please fill in all required fields.",
    );

    expect(addHoliday).not.toHaveBeenCalled();
  });

  it("shows validation when holiday name is only whitespace", () => {
    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    fireEvent.change(screen.getByLabelText("Holiday name"), {
      target: {
        name: "name",
        value: "   ",
      },
    });

    fireEvent.change(screen.getByLabelText("Holiday type"), {
      target: {
        name: "type",
        value: "public",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add Holiday" }));

    expect(screen.getByTestId("form-error")).toHaveTextContent(
      "Please fill in all required fields.",
    );

    expect(addHoliday).not.toHaveBeenCalled();
  });

  it("rejects holiday names longer than 250 characters", () => {
    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    fireEvent.change(screen.getByLabelText("Holiday name"), {
      target: {
        name: "name",
        value: "A".repeat(251),
      },
    });

    fireEvent.change(screen.getByLabelText("Holiday type"), {
      target: {
        name: "type",
        value: "public",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add Holiday" }));

    expect(screen.getByTestId("form-error")).toHaveTextContent(
      "Holiday name cannot exceed 250 characters.",
    );

    expect(addHoliday).not.toHaveBeenCalled();
  });

  it("rejects company off day without weekday", () => {
    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    fireEvent.change(screen.getByLabelText("Holiday name"), {
      target: {
        name: "name",
        value: "Weekly Off",
      },
    });

    fireEvent.change(screen.getByLabelText("Holiday type"), {
      target: {
        name: "type",
        value: "company_off_day",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add Holiday" }));

    expect(screen.getByTestId("form-error")).toHaveTextContent(
      "Please select a weekly off day.",
    );

    expect(addHoliday).not.toHaveBeenCalled();
  });

  it("rejects normal holiday without date", () => {
    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    fireEvent.change(screen.getByLabelText("Holiday name"), {
      target: {
        name: "name",
        value: "New Holiday",
      },
    });

    fireEvent.change(screen.getByLabelText("Holiday type"), {
      target: {
        name: "type",
        value: "public",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add Holiday" }));

    expect(screen.getByTestId("form-error")).toHaveTextContent(
      "Please select a date.",
    );

    expect(addHoliday).not.toHaveBeenCalled();
  });

  it("rejects a holiday date in the past", () => {
    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    fireEvent.change(screen.getByLabelText("Holiday name"), {
      target: {
        name: "name",
        value: "Past Holiday",
      },
    });

    fireEvent.change(screen.getByLabelText("Holiday type"), {
      target: {
        name: "type",
        value: "public",
      },
    });

    fireEvent.change(screen.getByLabelText("Holiday date"), {
      target: {
        name: "date",
        value: "2000-01-01",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add Holiday" }));

    expect(screen.getByTestId("form-error")).toHaveTextContent(
      "Holiday date cannot be in the past.",
    );

    expect(addHoliday).not.toHaveBeenCalled();
  });

  it("rejects a duplicate holiday date", () => {
    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    fireEvent.change(screen.getByLabelText("Holiday name"), {
      target: {
        name: "name",
        value: "Duplicate Holiday",
      },
    });

    fireEvent.change(screen.getByLabelText("Holiday type"), {
      target: {
        name: "type",
        value: "public",
      },
    });

    fireEvent.change(screen.getByLabelText("Holiday date"), {
      target: {
        name: "date",
        value: "2026-09-10",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add Holiday" }));

    expect(screen.getByTestId("form-error")).toHaveTextContent(
      "A holiday already exists on this date.",
    );

    expect(addHoliday).not.toHaveBeenCalled();
  });

  /* ---------------------------------------------------------------------- */
  /*                              ADD HOLIDAY                               */
  /* ---------------------------------------------------------------------- */

  it("adds a normal public holiday successfully", async () => {
    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    fireEvent.change(screen.getByLabelText("Holiday name"), {
      target: {
        name: "name",
        value: "Republic Day",
      },
    });

    fireEvent.change(screen.getByLabelText("Holiday type"), {
      target: {
        name: "type",
        value: "public",
      },
    });

    fireEvent.change(screen.getByLabelText("Holiday date"), {
      target: {
        name: "date",
        value: "2099-01-26",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add Holiday" }));

    await waitFor(() => {
      expect(addHoliday).toHaveBeenCalledWith({
        description: "Republic Day",
        holiday_type: "public",
        date: "2099-01-26",
      });
    });

    await waitFor(() => {
      expect(getHolidays).toHaveBeenCalledWith(1);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("holiday-modal")).not.toBeInTheDocument();
    });
  });

  it("trims whitespace from holiday name before adding", async () => {
    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    fireEvent.change(screen.getByLabelText("Holiday name"), {
      target: {
        name: "name",
        value: "  Republic Day  ",
      },
    });

    fireEvent.change(screen.getByLabelText("Holiday type"), {
      target: {
        name: "type",
        value: "public",
      },
    });

    fireEvent.change(screen.getByLabelText("Holiday date"), {
      target: {
        name: "date",
        value: "2099-01-26",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add Holiday" }));

    await waitFor(() => {
      expect(addHoliday).toHaveBeenCalledWith({
        description: "Republic Day",
        holiday_type: "public",
        date: "2099-01-26",
      });
    });
  });

  it("adds a company holiday successfully", async () => {
    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    fireEvent.change(screen.getByLabelText("Holiday name"), {
      target: {
        name: "name",
        value: "Company Day",
      },
    });

    fireEvent.change(screen.getByLabelText("Holiday type"), {
      target: {
        name: "type",
        value: "company",
      },
    });

    fireEvent.change(screen.getByLabelText("Holiday date"), {
      target: {
        name: "date",
        value: "2099-05-01",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add Holiday" }));

    await waitFor(() => {
      expect(addHoliday).toHaveBeenCalledWith({
        description: "Company Day",
        holiday_type: "company",
        date: "2099-05-01",
      });
    });
  });

  it("adds a second Saturday holiday successfully", async () => {
    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    fireEvent.change(screen.getByLabelText("Holiday name"), {
      target: {
        name: "name",
        value: "Second Saturday",
      },
    });

    fireEvent.change(screen.getByLabelText("Holiday type"), {
      target: {
        name: "type",
        value: "second_saturday",
      },
    });

    fireEvent.change(screen.getByLabelText("Holiday date"), {
      target: {
        name: "date",
        value: "2099-06-13",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add Holiday" }));

    await waitFor(() => {
      expect(addHoliday).toHaveBeenCalledWith({
        description: "Second Saturday",
        holiday_type: "second_saturday",
        date: "2099-06-13",
      });
    });
  });

  it("adds company off day with numeric weekday", async () => {
    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    fireEvent.change(screen.getByLabelText("Holiday name"), {
      target: {
        name: "name",
        value: "Sunday Weekly Off",
      },
    });

    fireEvent.change(screen.getByLabelText("Holiday type"), {
      target: {
        name: "type",
        value: "company_off_day",
      },
    });

    fireEvent.change(screen.getByLabelText("Weekly off day"), {
      target: {
        name: "off_day_weekday",
        value: "0",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add Holiday" }));

    await waitFor(() => {
      expect(addHoliday).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "Sunday Weekly Off",
          holiday_type: "company_off_day",
          off_day_weekday: 0,
          date: expect.any(String),
        }),
      );
    });
  });

  it("adds company off day with weekday 6", async () => {
    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    fireEvent.change(screen.getByLabelText("Holiday name"), {
      target: {
        name: "name",
        value: "Saturday Weekly Off",
      },
    });

    fireEvent.change(screen.getByLabelText("Holiday type"), {
      target: {
        name: "type",
        value: "company_off_day",
      },
    });

    fireEvent.change(screen.getByLabelText("Weekly off day"), {
      target: {
        name: "off_day_weekday",
        value: "6",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add Holiday" }));

    await waitFor(() => {
      expect(addHoliday).toHaveBeenCalledWith(
        expect.objectContaining({
          description: "Saturday Weekly Off",
          holiday_type: "company_off_day",
          off_day_weekday: 6,
        }),
      );
    });
  });

  it("handles add holiday API failure", async () => {
    const addError = new Error("Create failed");

    mockDispatch.mockImplementation((action) => {
      if (action?.type === "holidays/addHoliday") {
        return {
          unwrap: () => Promise.reject(addError),
        };
      }

      return Promise.resolve({});
    });

    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    fireEvent.change(screen.getByLabelText("Holiday name"), {
      target: {
        name: "name",
        value: "Failed Holiday",
      },
    });

    fireEvent.change(screen.getByLabelText("Holiday type"), {
      target: {
        name: "type",
        value: "public",
      },
    });

    fireEvent.change(screen.getByLabelText("Holiday date"), {
      target: {
        name: "date",
        value: "2099-12-25",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add Holiday" }));

    await waitFor(() => {
      expect(screen.getByTestId("form-error")).toHaveTextContent(
        "Create failed",
      );
    });

    expect(screen.getByTestId("holiday-modal")).toBeInTheDocument();
  });

  it("uses fallback add error when rejected error has no message", async () => {
    mockDispatch.mockImplementation((action) => {
      if (action?.type === "holidays/addHoliday") {
        return {
          unwrap: () => Promise.reject({}),
        };
      }

      return Promise.resolve({});
    });

    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    fireEvent.change(screen.getByLabelText("Holiday name"), {
      target: {
        name: "name",
        value: "Failed Holiday",
      },
    });

    fireEvent.change(screen.getByLabelText("Holiday type"), {
      target: {
        name: "type",
        value: "public",
      },
    });

    fireEvent.change(screen.getByLabelText("Holiday date"), {
      target: {
        name: "date",
        value: "2099-12-25",
      },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add Holiday" }));

    await waitFor(() => {
      expect(screen.getByTestId("form-error")).toHaveTextContent(
        "Failed to create holiday",
      );
    });
  });

  /* ---------------------------------------------------------------------- */
  /*                              SEARCH                                    */
  /* ---------------------------------------------------------------------- */

  it("filters holidays by search text", async () => {
    renderHoliday();

    const searchInput = screen.getByLabelText("Search holidays");

    await act(async () => {
      fireEvent.change(searchInput, {
        target: {
          value: "Company",
        },
      });
    });

    expect(screen.getByText("Company Foundation Day")).toBeInTheDocument();

    expect(screen.queryByText("Independence Day")).not.toBeInTheDocument();

    expect(screen.queryByText("Second Saturday")).not.toBeInTheDocument();
  });

  it("search is case insensitive", async () => {
    renderHoliday();

    const searchInput = screen.getByLabelText("Search holidays");

    await act(async () => {
      fireEvent.change(searchInput, {
        target: {
          value: "company",
        },
      });
    });

    expect(screen.getByText("Company Foundation Day")).toBeInTheDocument();
  });

  it("search ignores leading and trailing spaces", async () => {
    renderHoliday();

    const searchInput = screen.getByLabelText("Search holidays");

    await act(async () => {
      fireEvent.change(searchInput, {
        target: {
          value: "  Company  ",
        },
      });
    });

    expect(screen.getByText("Company Foundation Day")).toBeInTheDocument();
  });

  it("shows all holidays when search is cleared", async () => {
    renderHoliday();

    const searchInput = screen.getByLabelText("Search holidays");

    await act(async () => {
      fireEvent.change(searchInput, {
        target: {
          value: "Company",
        },
      });
    });

    expect(screen.queryByText("Independence Day")).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.change(searchInput, {
        target: {
          value: "",
        },
      });
    });

    expect(screen.getByText("Independence Day")).toBeInTheDocument();

    expect(screen.getByText("Company Foundation Day")).toBeInTheDocument();
  });

  it("handles search when holiday description is missing", async () => {
    renderHoliday({
      list: [
        {
          id: 1,
          description: undefined,
          date: "2026-09-10",
        },
        {
          id: 2,
          description: "Company Foundation Day",
          date: "2026-09-15",
        },
      ],
      loading: false,
      totalPages: 1,
      currentPage: 1,
    });

    const searchInput = screen.getByPlaceholderText("Search Holiday Name");

    await act(async () => {
      fireEvent.change(searchInput, {
        target: {
          value: "Company",
        },
      });
    });

    expect(screen.getByText("Company Foundation Day")).toBeInTheDocument();

    expect(screen.getAllByTestId("holiday-row")).toHaveLength(1);
  });

  /* ---------------------------------------------------------------------- */
  /*                              MONTH FILTER                              */
  /* ---------------------------------------------------------------------- */

  it("filters holidays by month", async () => {
    renderHoliday();

    const monthInput = screen.getByLabelText("Holiday month");

    await act(async () => {
      fireEvent.change(monthInput, {
        target: {
          value: "2026-09",
        },
      });
    });

    expect(screen.getByText("Company Foundation Day")).toBeInTheDocument();

    expect(screen.getByText("Second Saturday")).toBeInTheDocument();

    expect(screen.queryByText("Independence Day")).not.toBeInTheDocument();

    expect(screen.queryByText("Weekly Off")).not.toBeInTheDocument();
  });

  it("combines search and month filters", async () => {
    renderHoliday();

    const searchInput = screen.getByLabelText("Search holidays");

    const monthInput = screen.getByLabelText("Holiday month");

    await act(async () => {
      fireEvent.change(searchInput, {
        target: {
          value: "Company",
        },
      });
    });

    await act(async () => {
      fireEvent.change(monthInput, {
        target: {
          value: "2026-09",
        },
      });
    });

    expect(screen.getByText("Company Foundation Day")).toBeInTheDocument();

    expect(screen.queryByText("Independence Day")).not.toBeInTheDocument();

    expect(screen.queryByText("Second Saturday")).not.toBeInTheDocument();
  });

  it("removes month filtering when month is cleared", async () => {
    renderHoliday();

    const monthInput = screen.getByLabelText("Holiday month");

    await act(async () => {
      fireEvent.change(monthInput, {
        target: {
          value: "2026-09",
        },
      });
    });

    expect(screen.queryByText("Independence Day")).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.change(monthInput, {
        target: {
          value: "",
        },
      });
    });

    expect(screen.getByText("Independence Day")).toBeInTheDocument();
  });

  it("excludes holidays without dates when month filter is active", async () => {
    renderHoliday();

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Holiday month"), {
        target: {
          value: "2026-09",
        },
      });
    });

    expect(screen.queryByText("Weekly Off")).not.toBeInTheDocument();
  });

  /* ---------------------------------------------------------------------- */
  /*                              PAGINATION                                */
  /* ---------------------------------------------------------------------- */

  it("changes page when next page is valid", async () => {
    renderHoliday();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Next page",
      }),
    );

    await waitFor(() => {
      expect(screen.getByTestId("current-page")).toHaveTextContent("2");
    });

    expect(getHolidays).toHaveBeenCalledWith(2);
  });

  it("does not go below page 1", async () => {
    renderHoliday();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Previous page",
      }),
    );

    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
  });

  it("does not go beyond totalPages", async () => {
    renderHoliday({
      totalPages: 1,
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Next page",
      }),
    );

    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
  });

  it("passes totalPages as a number to pagination", () => {
    renderHoliday({
      totalPages: "5",
    });

    expect(screen.getByTestId("total-pages")).toHaveTextContent("5");
  });

  it("falls back to one page when totalPages is invalid", () => {
    renderHoliday({
      totalPages: undefined,
    });

    expect(screen.getByTestId("total-pages")).toHaveTextContent("1");
  });

  /* ---------------------------------------------------------------------- */
  /*                              DELETE                                    */
  /* ---------------------------------------------------------------------- */

  it("opens delete confirmation modal", async () => {
    renderHoliday();

    window.__holidayDelete = (id) => {
      const callback = getHolidayColumns.mock.calls.at(-1)?.[0]?.onDeleteClick;

      callback?.(id);
    };

    const columnsConfig = getHolidayColumns.mock.calls.at(-1)?.[0];

    expect(columnsConfig?.onDeleteClick).toEqual(expect.any(Function));

    act(() => {
      columnsConfig.onDeleteClick(2);
    });

    expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();

    expect(screen.getByText("Confirm Deletion")).toBeInTheDocument();

    expect(
      screen.getByText("Are you sure you want to delete this Holiday?"),
    ).toBeInTheDocument();
  });

  it("confirms deletion successfully", async () => {
    renderHoliday();

    const columnsConfig = getHolidayColumns.mock.calls.at(-1)?.[0];

    act(() => {
      columnsConfig.onDeleteClick(2);
    });

    expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Delete",
      }),
    );

    await waitFor(() => {
      expect(removeHoliday).toHaveBeenCalledWith(2);
    });

    await waitFor(() => {
      expect(getHolidays).toHaveBeenCalledWith(1);
    });

    await waitFor(() => {
      expect(screen.queryByTestId("confirm-modal")).not.toBeInTheDocument();
    });
  });

  it("cancels deletion", async () => {
    renderHoliday();

    const columnsConfig = getHolidayColumns.mock.calls.at(-1)?.[0];

    act(() => {
      columnsConfig.onDeleteClick(2);
    });

    expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    );

    expect(screen.queryByTestId("confirm-modal")).not.toBeInTheDocument();

    expect(removeHoliday).not.toHaveBeenCalled();
  });

  it("does nothing when confirmDelete is called without a selected id", async () => {
    renderHoliday();

    const columnsConfig = getHolidayColumns.mock.calls.at(-1)?.[0];

    expect(columnsConfig?.onDeleteClick).toEqual(expect.any(Function));

    /*
     * confirmDelete itself is only exposed to ReusableConfirmModal.
     * Since the modal is closed initially, no deletion request can occur.
     */
    expect(removeHoliday).not.toHaveBeenCalled();
  });

  it("handles delete API failure without crashing", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    renderHoliday({
      list: [
        {
          id: 1,
          description: "Holiday To Delete",
          date: "2026-09-20",
        },
      ],
      loading: false,
      totalPages: 1,
      currentPage: 1,
    });

    /*
     * removeHoliday must return the Redux action object.
     * The dispatch itself is what rejects in this test because
     * HolidayManager awaits:
     *
     *   await dispatch(removeHoliday(selectedIdToDelete))
     */
    removeHoliday.mockImplementationOnce((id) => ({
      type: "holidays/removeHoliday",
      payload: id,
    }));

    mockDispatch.mockImplementation((action) => {
      if (action?.type === "holidays/removeHoliday") {
        return Promise.reject(new Error("Delete failed"));
      }

      return Promise.resolve({});
    });

    const initialGetHolidaysCalls = getHolidays.mock.calls.length;

    const columnsConfig = getHolidayColumns.mock.calls.at(-1)?.[0];

    expect(columnsConfig?.onDeleteClick).toEqual(expect.any(Function));

    await act(async () => {
      columnsConfig.onDeleteClick(1);
    });

    expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();

    const confirmButton = screen.getByRole("button", {
      name: "Delete",
    });

    await act(async () => {
      fireEvent.click(confirmButton);
    });

    await waitFor(() => {
      expect(removeHoliday).toHaveBeenCalledWith(1);
    });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Failed to delete holiday:",
        expect.any(Error),
      );
    });

    /*
     * Because deletion failed, HolidayManager must NOT dispatch
     * getHolidays again and must keep the confirmation modal open.
     */
    expect(getHolidays.mock.calls.length).toBe(initialGetHolidaysCalls);

    expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  /* ---------------------------------------------------------------------- */
  /*                              SORTING                                   */
  /* ---------------------------------------------------------------------- */

  it("sorts dated holidays from newest to oldest", () => {
    renderHoliday({
      list: [
        {
          id: 1,
          description: "January Holiday",
          date: "2026-01-01",
        },
        {
          id: 2,
          description: "December Holiday",
          date: "2026-12-01",
        },
        {
          id: 3,
          description: "June Holiday",
          date: "2026-06-01",
        },
      ],
    });

    const rows = screen.getAllByTestId("holiday-row");

    expect(rows[0]).toHaveTextContent("December Holiday");
    expect(rows[1]).toHaveTextContent("June Holiday");
    expect(rows[2]).toHaveTextContent("January Holiday");
  });

  it("places holidays without dates at the end", () => {
    renderHoliday({
      list: [
        {
          id: 1,
          description: "No Date",
          date: null,
        },
        {
          id: 2,
          description: "Future Holiday",
          date: "2026-12-01",
        },
      ],
    });

    const rows = screen.getAllByTestId("holiday-row");

    expect(rows[0]).toHaveTextContent("Future Holiday");
    expect(rows[1]).toHaveTextContent("No Date");
  });

  it("handles multiple holidays without dates", () => {
    renderHoliday({
      list: [
        {
          id: 1,
          description: "No Date One",
          date: null,
        },
        {
          id: 2,
          description: "No Date Two",
          date: null,
        },
      ],
    });

    expect(screen.getAllByTestId("holiday-row")).toHaveLength(2);
  });

  /* ---------------------------------------------------------------------- */
  /*                              SELECTOR DEFAULTS                         */
  /* ---------------------------------------------------------------------- */

  it("uses default list when selector list is undefined", () => {
    renderHoliday({
      list: undefined,
    });

    /*
     * The component destructures:
     * list: holidays = []
     */
    expect(screen.queryAllByTestId("holiday-row")).toHaveLength(0);
  });

  it("uses default totalPages when selector value is missing", () => {
    renderHoliday({
      totalPages: undefined,
    });

    expect(screen.getByTestId("total-pages")).toHaveTextContent("1");
  });

  /* ---------------------------------------------------------------------- */
  /*                         FORM ERROR RESET                               */
  /* ---------------------------------------------------------------------- */

  it("clears form error when a field changes", () => {
    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    fireEvent.click(screen.getByRole("button", { name: "Add Holiday" }));

    expect(screen.getByTestId("form-error")).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Holiday name"), {
      target: {
        name: "name",
        value: "New Holiday",
      },
    });

    expect(screen.queryByTestId("form-error")).not.toBeInTheDocument();
  });

  /* ---------------------------------------------------------------------- */
  /*                           MODAL RESET                                  */
  /* ---------------------------------------------------------------------- */

  it("clears form error when modal is closed", () => {
    renderHoliday();

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    fireEvent.click(screen.getByRole("button", { name: "Add Holiday" }));

    expect(screen.getByTestId("form-error")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));

    fireEvent.click(screen.getByText("+ ADD NEW HOLIDAY"));

    expect(screen.queryByTestId("form-error")).not.toBeInTheDocument();

    expect(screen.getByLabelText("Holiday name")).toHaveValue("");
  });
});
