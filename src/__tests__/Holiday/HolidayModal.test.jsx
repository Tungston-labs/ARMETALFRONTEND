import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import HolidayModal from "../../Pages/holiday/modal/HolidayModal";

/* -------------------------------------------------------------------------- */
/*                                STYLE MOCKS                                 */
/* -------------------------------------------------------------------------- */

vi.mock("../../Pages/holiday/Holiday.styles", () => ({
  Select: ({ children, ...props }) => <select {...props}>{children}</select>,

  DateInput: (props) => <input {...props} />,

  DateWrapper: ({ children }) => (
    <div data-testid="date-wrapper">{children}</div>
  ),

  FieldWrapper: ({ children }) => (
    <div data-testid="field-wrapper">{children}</div>
  ),

  Label: ({ children }) => <label>{children}</label>,
}));

vi.mock("../../Pages/holiday/modal/modal.styles", () => ({
  Overlay: ({ children, onClick, onKeyDown }) => (
    <div
      data-testid="overlay"
      onClick={onClick}
      onKeyDown={onKeyDown}
      role="presentation"
      tabIndex={0}
    >
      {children}
    </div>
  ),

  Panel: ({ children, onClick }) => (
    <div data-testid="panel" onClick={onClick}>
      {children}
    </div>
  ),

  Header: ({ children }) => <div data-testid="header">{children}</div>,

  ModalTitle: ({ children }) => <h2 data-testid="modal-title">{children}</h2>,

  ModalSubtitle: ({ children }) => (
    <p data-testid="modal-subtitle">{children}</p>
  ),

  CloseButton: ({ children, ...props }) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),

  Body: ({ children }) => <div data-testid="body">{children}</div>,

  Footer: ({ children }) => <div data-testid="footer">{children}</div>,

  PrimaryButton: ({ children, ...props }) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),

  SecondaryButton: ({ children, ...props }) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
}));

/* -------------------------------------------------------------------------- */
/*                                   FIXTURES                                 */
/* -------------------------------------------------------------------------- */

const defaultFormData = {
  name: "",
  type: "",
  date: "",
  off_day_weekday: "",
};

const defaultTypeOptions = [
  {
    key: "public",
    label: "Public Holiday",
  },
  {
    key: "company",
    label: "Company Holiday",
  },
  {
    key: "company_off_day",
    label: "Company Off Day",
  },
  {
    key: "second_saturday",
    label: "Second Saturdays",
  },
];

/* -------------------------------------------------------------------------- */
/*                               RENDER HELPER                                */
/* -------------------------------------------------------------------------- */

const renderModal = (overrides = {}) => {
  const props = {
    isOpen: true,
    onClose: vi.fn(),
    formData: defaultFormData,
    onChange: vi.fn(),
    onAdd: vi.fn(),
    formError: "",
    typeOptions: defaultTypeOptions,
    ...overrides,
  };

  return {
    ...render(<HolidayModal {...props} />),
    props,
  };
};

/* -------------------------------------------------------------------------- */
/*                                   TESTS                                    */
/* -------------------------------------------------------------------------- */

describe("HolidayModal", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  /* ------------------------------------------------------------------------ */
  /*                                VISIBILITY                                */
  /* ------------------------------------------------------------------------ */

  describe("Visibility", () => {
    it("does not render when isOpen is false", () => {
      renderModal({
        isOpen: false,
      });

      expect(screen.queryByTestId("overlay")).not.toBeInTheDocument();
      expect(screen.queryByTestId("panel")).not.toBeInTheDocument();
    });

    it("renders when isOpen is true", () => {
      renderModal({
        isOpen: true,
      });

      expect(screen.getByTestId("overlay")).toBeInTheDocument();
      expect(screen.getByTestId("panel")).toBeInTheDocument();
    });
  });

  /* ------------------------------------------------------------------------ */
  /*                              MODAL CONTENT                               */
  /* ------------------------------------------------------------------------ */

  describe("Modal content", () => {
    it("renders the modal title", () => {
      renderModal();

      expect(screen.getByTestId("modal-title")).toHaveTextContent(
        "Add Holiday",
      );
    });

    it("renders the modal subtitle", () => {
      renderModal();

      expect(
        screen.getByText("Create a new holiday or weekly off day"),
      ).toBeInTheDocument();
    });

    it("renders Holiday Name field", () => {
      renderModal();

      expect(screen.getByText("Holiday Name")).toBeInTheDocument();

      expect(document.querySelector('input[name="name"]')).toBeInTheDocument();
    });

    it("renders Type field", () => {
      renderModal();

      expect(screen.getByText("Type")).toBeInTheDocument();

      expect(document.querySelector('select[name="type"]')).toBeInTheDocument();
    });

    it("renders Cancel and Add Holiday buttons", () => {
      renderModal();

      expect(
        screen.getByRole("button", {
          name: "Cancel",
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", {
          name: "Add Holiday",
        }),
      ).toBeInTheDocument();
    });
  });

  /* ------------------------------------------------------------------------ */
  /*                             TYPE OPTIONS                                 */
  /* ------------------------------------------------------------------------ */

  describe("Holiday type options", () => {
    it("renders the default Select a type option", () => {
      renderModal();

      const select = document.querySelector('select[name="type"]');

      expect(select).toBeInTheDocument();

      expect(
        screen.getByRole("option", {
          name: "Select a type",
        }),
      ).toBeInTheDocument();
    });

    it("renders all supplied type options", () => {
      renderModal();

      expect(
        screen.getByRole("option", {
          name: "Public Holiday",
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("option", {
          name: "Company Holiday",
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("option", {
          name: "Company Off Day",
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("option", {
          name: "Second Saturdays",
        }),
      ).toBeInTheDocument();
    });

    it("uses the supplied option keys as values", () => {
      renderModal();

      const select = document.querySelector('select[name="type"]');

      expect(select).toHaveValue("");

      expect(
        screen.getByRole("option", {
          name: "Public Holiday",
        }),
      ).toHaveValue("public");

      expect(
        screen.getByRole("option", {
          name: "Company Holiday",
        }),
      ).toHaveValue("company");

      expect(
        screen.getByRole("option", {
          name: "Company Off Day",
        }),
      ).toHaveValue("company_off_day");
    });

    it("supports an empty typeOptions array", () => {
      renderModal({
        typeOptions: [],
      });

      const select = document.querySelector('select[name="type"]');

      expect(select).toBeInTheDocument();

      expect(
        screen.getByRole("option", {
          name: "Select a type",
        }),
      ).toBeInTheDocument();

      expect(select.querySelectorAll("option")).toHaveLength(1);
    });
  });

  /* ------------------------------------------------------------------------ */
  /*                         NORMAL HOLIDAY DATE                              */
  /* ------------------------------------------------------------------------ */

  describe("Normal holiday date field", () => {
    it("renders date field for normal holiday types", () => {
      renderModal({
        formData: {
          ...defaultFormData,
          type: "public",
        },
      });

      const dateInput = document.querySelector('input[name="date"]');

      expect(dateInput).toBeInTheDocument();
      expect(dateInput).toHaveAttribute("type", "date");
    });

    it("does not render weekly off day field for normal holidays", () => {
      renderModal({
        formData: {
          ...defaultFormData,
          type: "public",
        },
      });

      expect(
        document.querySelector('select[name="off_day_weekday"]'),
      ).not.toBeInTheDocument();
    });

    it("uses the supplied date value", () => {
      renderModal({
        formData: {
          ...defaultFormData,
          type: "public",
          date: "2026-08-15",
        },
      });

      const dateInput = document.querySelector('input[name="date"]');

      expect(dateInput).toHaveValue("2026-08-15");
    });

    it("calls onChange when the date changes", () => {
      const received = vi.fn((event) => ({
        name: event.target.name,
        value: event.target.value,
      }));

      renderModal({
        onChange: received,
        formData: {
          ...defaultFormData,
          type: "public",
        },
      });

      const dateInput = document.querySelector('input[name="date"]');

      expect(dateInput).toBeInTheDocument();

      fireEvent.change(dateInput, {
        target: {
          value: "2026-12-25",
        },
      });

      expect(received).toHaveBeenCalledTimes(1);

      expect(received.mock.results[0].value).toEqual({
        name: "date",
        value: "2026-12-25",
      });
    });
  });

  /* ------------------------------------------------------------------------ */
  /*                            COMPANY OFF DAY                               */
  /* ------------------------------------------------------------------------ */

  describe("Company off day", () => {
    it("renders the weekly off day field for company_off_day", () => {
      renderModal({
        formData: {
          ...defaultFormData,
          type: "company_off_day",
        },
      });

      const select = document.querySelector('select[name="off_day_weekday"]');

      expect(select).toBeInTheDocument();

      expect(screen.getByText("Weekly Off Day")).toBeInTheDocument();
    });

    it("renders all seven weekday options", () => {
      renderModal({
        formData: {
          ...defaultFormData,
          type: "company_off_day",
        },
      });

      const select = document.querySelector('select[name="off_day_weekday"]');

      expect(select).toBeInTheDocument();

      const options = Array.from(select.querySelectorAll("option"));

      expect(options).toHaveLength(8);

      expect(options.map((option) => option.textContent)).toEqual([
        "Select day",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ]);
    });

    it("renders weekday values from 0 to 6", () => {
      renderModal({
        formData: {
          ...defaultFormData,
          type: "company_off_day",
        },
      });

      const select = document.querySelector('select[name="off_day_weekday"]');

      const options = Array.from(select.querySelectorAll("option"));

      expect(options.slice(1).map((option) => option.value)).toEqual([
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
      ]);
    });

    it("uses the supplied weekly off day value", () => {
      renderModal({
        formData: {
          ...defaultFormData,
          type: "company_off_day",
          off_day_weekday: "5",
        },
      });

      const select = document.querySelector('select[name="off_day_weekday"]');

      expect(select).toHaveValue("5");
    });

    it("does not render date field for company_off_day", () => {
      renderModal({
        formData: {
          ...defaultFormData,
          type: "company_off_day",
        },
      });

      expect(
        document.querySelector('input[name="date"]'),
      ).not.toBeInTheDocument();
    });

    it("calls onChange when the weekly off day changes", () => {
      const received = vi.fn((event) => ({
        name: event.target.name,
        value: event.target.value,
      }));

      renderModal({
        onChange: received,
        formData: {
          ...defaultFormData,
          type: "company_off_day",
          off_day_weekday: "",
        },
      });

      const select = document.querySelector('select[name="off_day_weekday"]');

      expect(select).toBeInTheDocument();

      fireEvent.change(select, {
        target: {
          value: "5",
        },
      });

      expect(received).toHaveBeenCalledTimes(1);

      expect(received.mock.results[0].value).toEqual({
        name: "off_day_weekday",
        value: "5",
      });
    });
  });

  /* ------------------------------------------------------------------------ */
  /*                            HOLIDAY NAME                                  */
  /* ------------------------------------------------------------------------ */

  describe("Holiday name input", () => {
    it("renders the supplied name", () => {
      renderModal({
        formData: {
          ...defaultFormData,
          name: "Independence Day",
        },
      });

      const input = document.querySelector('input[name="name"]');

      expect(input).toHaveValue("Independence Day");
    });

    it("uses the correct placeholder", () => {
      renderModal();

      const input = document.querySelector('input[name="name"]');

      expect(input).toHaveAttribute("placeholder", "e.g. Independence Day");
    });

    it("uses autocomplete off", () => {
      renderModal();

      const input = document.querySelector('input[name="name"]');

      expect(input).toHaveAttribute("autocomplete", "off");
    });

    it("limits the holiday name to 250 characters", () => {
      const onChange = vi.fn();

      renderModal({
        onChange,
      });

      const input = document.querySelector('input[name="name"]');

      fireEvent.change(input, {
        target: {
          value: "a".repeat(300),
        },
      });

      expect(onChange).toHaveBeenCalledTimes(1);

      const event = onChange.mock.calls[0][0];

      expect(event.target.name).toBe("name");
      expect(event.target.value).toHaveLength(250);
      expect(event.target.value).toBe("a".repeat(250));
    });
  });

  /* ------------------------------------------------------------------------ */
  /*                              FORM ERROR                                  */
  /* ------------------------------------------------------------------------ */

  describe("Form error", () => {
    it("does not render an error when formError is empty", () => {
      renderModal({
        formError: "",
      });

      expect(
        screen.queryByText("Something went wrong"),
      ).not.toBeInTheDocument();
    });

    it("renders the supplied form error", () => {
      renderModal({
        formError: "Holiday date is required",
      });

      expect(screen.getByText("Holiday date is required")).toBeInTheDocument();
    });

    it("renders different error messages correctly", () => {
      renderModal({
        formError: "Invalid holiday type",
      });

      expect(screen.getByText("Invalid holiday type")).toBeInTheDocument();
    });
  });

  /* ------------------------------------------------------------------------ */
  /*                              CLOSE BEHAVIOR                              */
  /* ------------------------------------------------------------------------ */

  describe("Close behavior", () => {
    it("calls onClose when close button is clicked", () => {
      const onClose = vi.fn();

      renderModal({
        onClose,
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: "Close",
        }),
      );

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when Cancel is clicked", () => {
      const onClose = vi.fn();

      renderModal({
        onClose,
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: "Cancel",
        }),
      );

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when the overlay is clicked", () => {
      const onClose = vi.fn();

      renderModal({
        onClose,
      });

      fireEvent.click(screen.getByTestId("overlay"));

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose when the panel is clicked", () => {
      const onClose = vi.fn();

      renderModal({
        onClose,
      });

      fireEvent.click(screen.getByTestId("panel"));

      expect(onClose).not.toHaveBeenCalled();
    });

    it("calls onClose when Escape is pressed on the overlay", () => {
      const onClose = vi.fn();

      renderModal({
        onClose,
      });

      fireEvent.keyDown(screen.getByTestId("overlay"), {
        key: "Escape",
      });

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose for unrelated keys", () => {
      const onClose = vi.fn();

      renderModal({
        onClose,
      });

      fireEvent.keyDown(screen.getByTestId("overlay"), {
        key: "Enter",
      });

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  /* ------------------------------------------------------------------------ */
  /*                               ADD BUTTON                                 */
  /* ------------------------------------------------------------------------ */

  describe("Add behavior", () => {
    it("calls onAdd when Add Holiday is clicked", () => {
      const onAdd = vi.fn();

      renderModal({
        onAdd,
      });

      fireEvent.click(
        screen.getByRole("button", {
          name: "Add Holiday",
        }),
      );

      expect(onAdd).toHaveBeenCalledTimes(1);
    });

    it("does not automatically call onAdd during render", () => {
      const onAdd = vi.fn();

      renderModal({
        onAdd,
      });

      expect(onAdd).not.toHaveBeenCalled();
    });
  });

  /* ------------------------------------------------------------------------ */
  /*                           COMBINED FORM STATES                           */
  /* ------------------------------------------------------------------------ */

  describe("Combined form states", () => {
    it("renders a normal holiday correctly with populated data", () => {
      renderModal({
        formData: {
          name: "Christmas",
          type: "public",
          date: "2026-12-25",
          off_day_weekday: "",
        },
      });

      expect(document.querySelector('input[name="name"]')).toHaveValue(
        "Christmas",
      );

      expect(document.querySelector('select[name="type"]')).toHaveValue(
        "public",
      );

      expect(document.querySelector('input[name="date"]')).toHaveValue(
        "2026-12-25",
      );

      expect(
        document.querySelector('select[name="off_day_weekday"]'),
      ).not.toBeInTheDocument();
    });

    it("renders a company off day correctly with populated data", () => {
      renderModal({
        formData: {
          name: "Weekly Off",
          type: "company_off_day",
          date: "",
          off_day_weekday: "6",
        },
      });

      expect(document.querySelector('input[name="name"]')).toHaveValue(
        "Weekly Off",
      );

      expect(document.querySelector('select[name="type"]')).toHaveValue(
        "company_off_day",
      );

      expect(
        document.querySelector('select[name="off_day_weekday"]'),
      ).toHaveValue("6");

      expect(
        document.querySelector('input[name="date"]'),
      ).not.toBeInTheDocument();
    });
  });
});
