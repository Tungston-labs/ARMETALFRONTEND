import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import FinanceModal from "../../Pages/finance/NewFinance";

import {
  createFinanceCategory,
  fetchFinanceCategoryList,
} from "../../Redux/financeThunks";

// ============================================================
// MOCKS
// ============================================================

const mockDispatch = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

vi.mock("../../Redux/financeThunks", () => ({
  createFinanceCategory: vi.fn((payload) => ({
    type: "finance/createFinanceCategory",
    payload,
  })),

  fetchFinanceCategoryList: vi.fn((paymentType) => ({
    type: "finance/fetchFinanceCategoryList",
    payload: paymentType,
  })),
}));

// ------------------------------------------------------------
// Styled component mocks
// ------------------------------------------------------------

vi.mock("../../Pages/finance/NewFinance.Styles", () => ({
  ModalOverlay: ({ children }) => (
    <div data-testid="modal-overlay">{children}</div>
  ),

  ModalContainer: ({ children }) => (
    <div data-testid="modal-container">{children}</div>
  ),

  ModalHeader: ({ children }) => (
    <div data-testid="modal-header">{children}</div>
  ),

  ModalTitle: ({ children }) => <h2>{children}</h2>,

  Form: ({ children, onSubmit }) => <form onSubmit={onSubmit}>{children}</form>,

  FormRow: ({ children }) => <div data-testid="form-row">{children}</div>,

  Input: (props) => <input {...props} />,

  TextArea: (props) => <textarea {...props} />,

  ButtonGroup: ({ children }) => (
    <div data-testid="button-group">{children}</div>
  ),

  Button: ({ children, ...props }) => <button {...props}>{children}</button>,

  Label: ({ children }) => <label>{children}</label>,

  HeaderLeft: ({ children }) => <div>{children}</div>,

  Select: (props) => <select {...props} />,
}));

// ============================================================
// TEST DATA
// ============================================================

const categories = [
  {
    id: 1,
    name: "Salary",
  },
  {
    id: 2,
    name: "Bonus",
  },
];

const expenseCategories = [
  {
    id: 3,
    name: "Office",
  },
  {
    id: 4,
    name: "Travel",
  },
];

const fulfilled = (payload) => ({
  meta: {
    requestStatus: "fulfilled",
  },
  payload,
});

const rejected = (payload = null) => ({
  meta: {
    requestStatus: "rejected",
  },
  payload,
});

// ============================================================
// HELPERS
// ============================================================

const getField = (name) => {
  const element = document.querySelector(`[name="${name}"]`);

  if (!element) {
    throw new Error(`Field with name="${name}" was not found`);
  }

  return element;
};

const renderModal = (props = {}) => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSave: vi.fn().mockResolvedValue(undefined),
  };

  return render(<FinanceModal {...defaultProps} {...props} />);
};

const selectPaymentType = async (
  user,
  value = "IN",
  result = { results: categories },
) => {
  mockDispatch.mockResolvedValueOnce(fulfilled(result));

  await user.selectOptions(getField("paymentType"), value);

  await waitFor(() => {
    expect(fetchFinanceCategoryList).toHaveBeenCalledWith(value);
  });
};

// ============================================================
// SETUP
// ============================================================

beforeEach(() => {
  vi.clearAllMocks();

  mockDispatch.mockResolvedValue(
    fulfilled({
      results: categories,
    }),
  );
});

// ============================================================
// BASIC RENDERING
// ============================================================

describe("FinanceModal - Rendering", () => {
  it("does not render when isOpen is false", () => {
    renderModal({
      isOpen: false,
    });

    expect(screen.queryByText("New Finance Entry")).not.toBeInTheDocument();
  });

  it("renders when isOpen is true", () => {
    renderModal();

    expect(screen.getByText("New Finance Entry")).toBeInTheDocument();
  });

  it("renders payment type select", () => {
    renderModal();

    expect(getField("paymentType")).toBeInTheDocument();
  });

  it("renders payment type options", () => {
    renderModal();

    expect(
      screen.getByRole("option", {
        name: "Select Payment Type",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Income",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Expense",
      }),
    ).toBeInTheDocument();
  });

  it("renders date field with today's date", () => {
    renderModal();

    const dateField = getField("date");

    expect(dateField).toHaveValue(new Date().toISOString().split("T")[0]);
  });

  it("renders category field", () => {
    renderModal();

    expect(getField("category")).toBeInTheDocument();
  });

  it("renders amount field", () => {
    renderModal();

    expect(getField("amount1")).toBeInTheDocument();
  });

  it("renders note field", () => {
    renderModal();

    expect(getField("note")).toBeInTheDocument();
  });

  it("renders Cancel and Submit buttons", () => {
    renderModal();

    expect(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Submit",
      }),
    ).toBeInTheDocument();
  });
});

// ============================================================
// PAYMENT TYPE / CATEGORY LOADING
// ============================================================

describe("FinanceModal - Payment Type and Categories", () => {
  it("does not fetch categories when payment type is empty", async () => {
    renderModal();

    await waitFor(() => {
      expect(fetchFinanceCategoryList).not.toHaveBeenCalled();
    });
  });

  it("fetches income categories when Income is selected", async () => {
    const user = userEvent.setup();

    renderModal();

    mockDispatch.mockResolvedValueOnce(
      fulfilled({
        results: categories,
      }),
    );

    await user.selectOptions(getField("paymentType"), "IN");

    await waitFor(() => {
      expect(fetchFinanceCategoryList).toHaveBeenCalledWith("IN");
    });
  });

  it("fetches expense categories when Expense is selected", async () => {
    const user = userEvent.setup();

    renderModal();

    mockDispatch.mockResolvedValueOnce(
      fulfilled({
        results: expenseCategories,
      }),
    );

    await user.selectOptions(getField("paymentType"), "OUT");

    await waitFor(() => {
      expect(fetchFinanceCategoryList).toHaveBeenCalledWith("OUT");
    });
  });

  it("renders fetched categories", async () => {
    const user = userEvent.setup();

    renderModal();

    mockDispatch.mockResolvedValueOnce(
      fulfilled({
        results: categories,
      }),
    );

    await user.selectOptions(getField("paymentType"), "IN");

    await waitFor(() => {
      expect(
        screen.getByRole("option", {
          name: "Salary",
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("option", {
          name: "Bonus",
        }),
      ).toBeInTheDocument();
    });
  });

  it("renders expense categories", async () => {
    const user = userEvent.setup();

    renderModal();

    mockDispatch.mockResolvedValueOnce(
      fulfilled({
        results: expenseCategories,
      }),
    );

    await user.selectOptions(getField("paymentType"), "OUT");

    await waitFor(() => {
      expect(
        screen.getByRole("option", {
          name: "Office",
        }),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("option", {
          name: "Travel",
        }),
      ).toBeInTheDocument();
    });
  });

  it("handles rejected category fetch without crashing", async () => {
    const user = userEvent.setup();

    renderModal();

    mockDispatch.mockResolvedValueOnce(rejected());

    await user.selectOptions(getField("paymentType"), "IN");

    await waitFor(() => {
      expect(fetchFinanceCategoryList).toHaveBeenCalledWith("IN");
    });

    expect(getField("category")).toBeInTheDocument();
  });

  it("clears category when payment type changes", async () => {
    const user = userEvent.setup();

    renderModal();

    mockDispatch
      .mockResolvedValueOnce(
        fulfilled({
          results: categories,
        }),
      )
      .mockResolvedValueOnce(
        fulfilled({
          results: expenseCategories,
        }),
      );

    await user.selectOptions(getField("paymentType"), "IN");

    await waitFor(() => {
      expect(
        screen.getByRole("option", {
          name: "Salary",
        }),
      ).toBeInTheDocument();
    });

    await user.selectOptions(getField("category"), "1");

    expect(getField("category")).toHaveValue("1");

    await user.selectOptions(getField("paymentType"), "OUT");

    await waitFor(() => {
      expect(getField("category")).toHaveValue("");
    });
  });
});

// ============================================================
// FORM CHANGES
// ============================================================

describe("FinanceModal - Form Changes", () => {
  it("updates payment type", async () => {
    const user = userEvent.setup();

    renderModal();

    await user.selectOptions(getField("paymentType"), "IN");

    expect(getField("paymentType")).toHaveValue("IN");
  });

  it("updates date", async () => {
    const user = userEvent.setup();

    renderModal();

    await user.clear(getField("date"));
    await user.type(getField("date"), "2026-08-25");

    expect(getField("date")).toHaveValue("2026-08-25");
  });

  it("updates amount", async () => {
    const user = userEvent.setup();

    renderModal();

    await user.type(getField("amount1"), "2500");

    expect(getField("amount1")).toHaveValue(2500);
  });

  it("updates note", async () => {
    const user = userEvent.setup();

    renderModal();

    await user.type(getField("note"), "Monthly salary");

    expect(getField("note")).toHaveValue("Monthly salary");
  });

  it("clears an existing error when the related field changes", async () => {
    const user = userEvent.setup();

    renderModal();

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      }),
    );

    expect(screen.getByText("Payment type is required")).toBeInTheDocument();

    await user.selectOptions(getField("paymentType"), "IN");

    expect(
      screen.queryByText("Payment type is required"),
    ).not.toBeInTheDocument();
  });
});

// ============================================================
// VALIDATION
// ============================================================

describe("FinanceModal - Validation", () => {
  it("shows payment type validation error", async () => {
    const user = userEvent.setup();

    renderModal();

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      }),
    );

    expect(screen.getByText("Payment type is required")).toBeInTheDocument();
  });

  it("shows category validation error", async () => {
    const user = userEvent.setup();

    renderModal();

    await user.selectOptions(getField("paymentType"), "IN");

    await user.type(getField("amount1"), "1000");

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      }),
    );

    expect(screen.getByText("Category is required")).toBeInTheDocument();
  });

  it("shows amount validation error", async () => {
    const user = userEvent.setup();

    renderModal();

    await user.selectOptions(getField("paymentType"), "IN");

    await user.selectOptions(getField("category"), "");

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      }),
    );

    expect(screen.getByText("Category is required")).toBeInTheDocument();

    expect(screen.getByText("Amount is required")).toBeInTheDocument();
  });

  it("shows amount error when amount is zero", async () => {
    const user = userEvent.setup();

    renderModal();

    mockDispatch.mockResolvedValueOnce(
      fulfilled({
        results: categories,
      }),
    );

    await user.selectOptions(getField("paymentType"), "IN");

    await waitFor(() => {
      expect(
        screen.getByRole("option", {
          name: "Salary",
        }),
      ).toBeInTheDocument();
    });

    await user.selectOptions(getField("category"), "1");

    await user.type(getField("amount1"), "0");

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      }),
    );

    expect(
      screen.getByText("Amount must be greater than 0"),
    ).toBeInTheDocument();
  });

  it("shows amount error when amount is negative", async () => {
    const user = userEvent.setup();

    renderModal();

    mockDispatch.mockResolvedValueOnce(
      fulfilled({
        results: categories,
      }),
    );

    await user.selectOptions(getField("paymentType"), "IN");

    await waitFor(() => {
      expect(
        screen.getByRole("option", {
          name: "Salary",
        }),
      ).toBeInTheDocument();
    });

    await user.selectOptions(getField("category"), "1");

    fireEvent.change(getField("amount1"), {
      target: {
        value: "-100",
      },
    });

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      }),
    );

    expect(
      screen.getByText("Amount must be greater than 0"),
    ).toBeInTheDocument();
  });

  it("does not call onSave when validation fails", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    renderModal({
      onSave,
    });

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      }),
    );

    expect(onSave).not.toHaveBeenCalled();
  });
});

// ============================================================
// NORMAL SUBMISSION
// ============================================================

describe("FinanceModal - Normal Submission", () => {
  it("submits an income finance entry", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);

    renderModal({
      onSave,
    });

    mockDispatch.mockResolvedValueOnce(
      fulfilled({
        results: categories,
      }),
    );

    await user.selectOptions(getField("paymentType"), "IN");

    await waitFor(() => {
      expect(
        screen.getByRole("option", {
          name: "Salary",
        }),
      ).toBeInTheDocument();
    });

    await user.selectOptions(getField("category"), "1");

    await user.type(getField("amount1"), "50000");

    await user.type(getField("note"), "Monthly salary");

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      }),
    );

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          category: "1",
          paymentType: "IN",
          amount1: "50000",
          note: "Monthly salary",
        }),
      );
    });
  });

  it("submits an expense finance entry", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);

    renderModal({
      onSave,
    });

    mockDispatch.mockResolvedValueOnce(
      fulfilled({
        results: expenseCategories,
      }),
    );

    await user.selectOptions(getField("paymentType"), "OUT");

    await waitFor(() => {
      expect(
        screen.getByRole("option", {
          name: "Office",
        }),
      ).toBeInTheDocument();
    });

    await user.selectOptions(getField("category"), "3");

    await user.type(getField("amount1"), "5000");

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      }),
    );

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          category: "3",
          paymentType: "OUT",
          amount1: "5000",
        }),
      );
    });
  });

  it("passes the selected date to onSave", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);

    renderModal({
      onSave,
    });

    mockDispatch.mockResolvedValueOnce(
      fulfilled({
        results: categories,
      }),
    );

    await user.selectOptions(getField("paymentType"), "IN");

    await waitFor(() => {
      expect(
        screen.getByRole("option", {
          name: "Salary",
        }),
      ).toBeInTheDocument();
    });

    await user.selectOptions(getField("category"), "1");

    await user.clear(getField("date"));

    await user.type(getField("date"), "2026-08-20");

    await user.type(getField("amount1"), "1000");

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      }),
    );

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          date: "2026-08-20",
        }),
      );
    });
  });

  it("submits successfully without a note", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);

    renderModal({
      onSave,
    });

    mockDispatch.mockResolvedValueOnce(
      fulfilled({
        results: categories,
      }),
    );

    await user.selectOptions(getField("paymentType"), "IN");

    await waitFor(() => {
      expect(
        screen.getByRole("option", {
          name: "Salary",
        }),
      ).toBeInTheDocument();
    });

    await user.selectOptions(getField("category"), "1");

    await user.type(getField("amount1"), "1000");

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      }),
    );

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
    });

    expect(onSave.mock.calls[0][0].note).toBe("");
  });

  it("calls onSave only once for a valid submission", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);

    renderModal({
      onSave,
    });

    mockDispatch.mockResolvedValueOnce(
      fulfilled({
        results: categories,
      }),
    );

    await user.selectOptions(getField("paymentType"), "IN");

    await waitFor(() => {
      expect(
        screen.getByRole("option", {
          name: "Salary",
        }),
      ).toBeInTheDocument();
    });

    await user.selectOptions(getField("category"), "1");

    await user.type(getField("amount1"), "1000");

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      }),
    );

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1);
    });
  });
});

// ============================================================
// ADD NEW CATEGORY
// ============================================================

describe("FinanceModal - Add New Category", () => {
  const prepareAddNewCategory = async (
    user,
    onSave = vi.fn().mockResolvedValue(undefined),
  ) => {
    renderModal({
      onSave,
    });

    mockDispatch.mockResolvedValueOnce(
      fulfilled({
        results: categories,
      }),
    );

    await user.selectOptions(getField("paymentType"), "IN");

    await waitFor(() => {
      expect(
        screen.getByRole("option", {
          name: "Salary",
        }),
      ).toBeInTheDocument();
    });

    await user.selectOptions(getField("category"), "ADD_NEW");

    return onSave;
  };

  it("shows custom category input when ADD_NEW is selected", async () => {
    const user = userEvent.setup();

    await prepareAddNewCategory(user);

    expect(
      screen.getByPlaceholderText("Enter new category"),
    ).toBeInTheDocument();
  });

  it("hides custom category input when normal category is selected", async () => {
    const user = userEvent.setup();

    await prepareAddNewCategory(user);

    expect(
      screen.getByPlaceholderText("Enter new category"),
    ).toBeInTheDocument();

    await user.selectOptions(getField("category"), "1");

    expect(
      screen.queryByPlaceholderText("Enter new category"),
    ).not.toBeInTheDocument();
  });

  it("shows error for whitespace-only custom category", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    await prepareAddNewCategory(user, onSave);

    await user.type(screen.getByPlaceholderText("Enter new category"), "   ");

    await user.type(getField("amount1"), "1000");

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      }),
    );

    await waitFor(() => {
      expect(screen.getByText("Enter category name")).toBeInTheDocument();
    });

    expect(onSave).not.toHaveBeenCalled();
  });

  it("creates a new category with lowercase name", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);

    await prepareAddNewCategory(user, onSave);

    mockDispatch
      .mockResolvedValueOnce(
        fulfilled({
          id: 99,
        }),
      )
      .mockResolvedValueOnce(
        fulfilled({
          results: [
            ...categories,
            {
              id: 99,
              name: "new category",
            },
          ],
        }),
      );

    await user.type(
      screen.getByPlaceholderText("Enter new category"),
      "New Category",
    );

    await user.type(getField("amount1"), "2500");

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      }),
    );

    await waitFor(() => {
      expect(createFinanceCategory).toHaveBeenCalledWith({
        name: "new category",
        payment_type: "IN",
      });
    });
  });

  it("creates category using trimmed lowercase text", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);

    await prepareAddNewCategory(user, onSave);

    mockDispatch
      .mockResolvedValueOnce(
        fulfilled({
          id: 100,
        }),
      )
      .mockResolvedValueOnce(
        fulfilled({
          results: categories,
        }),
      );

    await user.type(
      screen.getByPlaceholderText("Enter new category"),
      "  Travel Expense  ",
    );

    await user.type(getField("amount1"), "3000");

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      }),
    );

    await waitFor(() => {
      expect(createFinanceCategory).toHaveBeenCalledWith({
        name: "  travel expense  ",
        payment_type: "IN",
      });
    });
  });

  it("uses newly created category id in onSave", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);

    await prepareAddNewCategory(user, onSave);

    mockDispatch
      .mockResolvedValueOnce(
        fulfilled({
          id: 99,
        }),
      )
      .mockResolvedValueOnce(
        fulfilled({
          results: [
            ...categories,
            {
              id: 99,
              name: "new category",
            },
          ],
        }),
      );

    await user.type(
      screen.getByPlaceholderText("Enter new category"),
      "New Category",
    );

    await user.type(getField("amount1"), "2500");

    await user.type(getField("note"), "New category entry");

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      }),
    );

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          category: 99,
          paymentType: "IN",
          amount1: "2500",
          note: "New category entry",
        }),
      );
    });
  });

  it("refreshes categories after successful category creation", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);

    await prepareAddNewCategory(user, onSave);

    mockDispatch
      .mockResolvedValueOnce(
        fulfilled({
          id: 99,
        }),
      )
      .mockResolvedValueOnce(
        fulfilled({
          results: [
            ...categories,
            {
              id: 99,
              name: "new category",
            },
          ],
        }),
      );

    await user.type(
      screen.getByPlaceholderText("Enter new category"),
      "New Category",
    );

    await user.type(getField("amount1"), "2500");

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      }),
    );

    await waitFor(() => {
      expect(fetchFinanceCategoryList).toHaveBeenCalledWith("IN");
    });

    expect(fetchFinanceCategoryList.mock.calls.length).toBeGreaterThanOrEqual(
      2,
    );
  });

  it("does not call onSave when category creation fails", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    await prepareAddNewCategory(user, onSave);

    mockDispatch.mockResolvedValueOnce(rejected());

    await user.type(
      screen.getByPlaceholderText("Enter new category"),
      "Failed Category",
    );

    await user.type(getField("amount1"), "2000");

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      }),
    );

    await waitFor(() => {
      expect(createFinanceCategory).toHaveBeenCalled();
    });

    expect(onSave).not.toHaveBeenCalled();
  });

  it("does not refresh categories when creation fails", async () => {
    const user = userEvent.setup();

    await prepareAddNewCategory(user);

    mockDispatch.mockResolvedValueOnce(rejected());

    await user.type(
      screen.getByPlaceholderText("Enter new category"),
      "Failed Category",
    );

    await user.type(getField("amount1"), "2000");

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      }),
    );

    await waitFor(() => {
      expect(createFinanceCategory).toHaveBeenCalled();
    });

    expect(fetchFinanceCategoryList).toHaveBeenCalledTimes(1);
  });
});

// ============================================================
// CLOSE / RESET
// ============================================================

describe("FinanceModal - Close and Reset", () => {
  it("calls onClose when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderModal({
      onClose,
    });

    await user.click(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("resets form when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderModal({
      onClose,
    });

    await user.selectOptions(getField("paymentType"), "IN");

    await user.type(getField("amount1"), "5000");

    await user.type(getField("note"), "Temporary note");

    expect(getField("amount1")).toHaveValue(5000);

    expect(getField("note")).toHaveValue("Temporary note");

    await user.click(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    );

    expect(onClose).toHaveBeenCalled();

    // Component stays mounted in the test because the parent
    // mock does not unmount it.
    expect(getField("amount1").value).toBe("");

    expect(getField("note")).toHaveValue("");

    expect(getField("paymentType")).toHaveValue("");
  });

  it("resets custom category on Cancel", async () => {
    const user = userEvent.setup();

    renderModal();

    mockDispatch.mockResolvedValueOnce(
      fulfilled({
        results: categories,
      }),
    );

    await user.selectOptions(getField("paymentType"), "IN");

    await waitFor(() => {
      expect(
        screen.getByRole("option", {
          name: "Salary",
        }),
      ).toBeInTheDocument();
    });

    await user.selectOptions(getField("category"), "ADD_NEW");

    await user.type(
      screen.getByPlaceholderText("Enter new category"),
      "Temporary",
    );

    expect(screen.getByPlaceholderText("Enter new category")).toHaveValue(
      "Temporary",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Cancel",
      }),
    );

    expect(getField("paymentType")).toHaveValue("");

    expect(getField("category")).toHaveValue("");
  });
});

// ============================================================
// SUBMIT RESET
// ============================================================

describe("FinanceModal - Submit Reset", () => {
  it("resets the form after successful submission", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);

    renderModal({
      onSave,
    });

    mockDispatch.mockResolvedValueOnce(
      fulfilled({
        results: categories,
      }),
    );

    await user.selectOptions(getField("paymentType"), "IN");

    await waitFor(() => {
      expect(
        screen.getByRole("option", {
          name: "Salary",
        }),
      ).toBeInTheDocument();
    });

    await user.selectOptions(getField("category"), "1");

    await user.type(getField("amount1"), "5000");

    await user.type(getField("note"), "Test finance");

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      }),
    );

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(getField("paymentType")).toHaveValue("");

      expect(getField("category")).toHaveValue("");

      expect(getField("amount1").value).toBe("");

      expect(getField("note")).toHaveValue("");
    });
  });

  it("keeps the modal open after successful onSave", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);

    renderModal({
      onSave,
    });

    mockDispatch.mockResolvedValueOnce(
      fulfilled({
        results: categories,
      }),
    );

    await user.selectOptions(getField("paymentType"), "IN");

    await waitFor(() => {
      expect(
        screen.getByRole("option", {
          name: "Salary",
        }),
      ).toBeInTheDocument();
    });

    await user.selectOptions(getField("category"), "1");

    await user.type(getField("amount1"), "1000");

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      }),
    );

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
    });

    expect(screen.getByText("New Finance Entry")).toBeInTheDocument();
  });
});

// ============================================================
// EDGE CASES
// ============================================================

describe("FinanceModal - Edge Cases", () => {
  it("handles empty category API result", async () => {
    const user = userEvent.setup();

    renderModal();

    mockDispatch.mockResolvedValueOnce(
      fulfilled({
        results: [],
      }),
    );

    await user.selectOptions(getField("paymentType"), "IN");

    await waitFor(() => {
      expect(fetchFinanceCategoryList).toHaveBeenCalledWith("IN");
    });

    expect(
      screen.getByRole("option", {
        name: "+ Add New Category",
      }),
    ).toBeInTheDocument();
  });

  it("renders Add New Category option", async () => {
    const user = userEvent.setup();

    renderModal();

    mockDispatch.mockResolvedValueOnce(
      fulfilled({
        results: categories,
      }),
    );

    await user.selectOptions(getField("paymentType"), "IN");

    await waitFor(() => {
      expect(
        screen.getByRole("option", {
          name: "+ Add New Category",
        }),
      ).toBeInTheDocument();
    });
  });

  it("allows decimal amount", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);

    renderModal({
      onSave,
    });

    mockDispatch.mockResolvedValueOnce(
      fulfilled({
        results: categories,
      }),
    );

    await user.selectOptions(getField("paymentType"), "IN");

    await waitFor(() => {
      expect(
        screen.getByRole("option", {
          name: "Salary",
        }),
      ).toBeInTheDocument();
    });

    await user.selectOptions(getField("category"), "1");

    await user.type(getField("amount1"), "1250.50");

    // HTML number inputs normalize 1250.50 to 1250.5.
    expect(getField("amount1").value).toBe("1250.5");

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      }),
    );

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          amount1: "1250.5",
        }),
      );
    });
  });

  it("accepts a positive amount greater than zero", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);

    renderModal({
      onSave,
    });

    mockDispatch.mockResolvedValueOnce(
      fulfilled({
        results: categories,
      }),
    );

    await user.selectOptions(getField("paymentType"), "IN");

    await waitFor(() => {
      expect(
        screen.getByRole("option", {
          name: "Salary",
        }),
      ).toBeInTheDocument();
    });

    await user.selectOptions(getField("category"), "1");

    await user.type(getField("amount1"), "0.01");

    await user.click(
      screen.getByRole("button", {
        name: "Submit",
      }),
    );

    await waitFor(() => {
      expect(onSave).toHaveBeenCalled();
    });
  });
});
