import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  getFinanceColumns,
  getStatCards,
} from "../../Pages/finance/FinanceColumns";

import { formatCurrency } from "../../utils/FormatCurrency";

import { FiTrendingUp, FiTrendingDown, FiDollarSign } from "react-icons/fi";

vi.mock("../../utils/FormatCurrency", () => ({
  formatCurrency: vi.fn((amount, currencyCode) => {
    return `${currencyCode} ${amount}`;
  }),
}));

describe("FinanceColumns", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // getFinanceColumns
  // ===========================================================================

  describe("getFinanceColumns", () => {
    const defaultProps = {
      page: 1,
      pageSize: 10,
      currencyCode: "INR",
    };

    // -------------------------------------------------------------------------
    // Column configuration
    // -------------------------------------------------------------------------

    describe("Column configuration", () => {
      it("returns all seven finance columns", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(columns).toHaveLength(7);
      });

      it("returns the correct column headers", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(columns.map((column) => column.header)).toEqual([
          "Sl No",
          "Date",
          "Category",
          "Note",
          "Income",
          "Expense",
          "Status",
        ]);
      });

      it("returns the correct accessors", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(columns.map((column) => column.accessor)).toEqual([
          "slNo",
          "date",
          "category_name",
          "note",
          "income",
          "expense",
          "payment_type",
        ]);
      });

      it("provides a render function for every column", () => {
        const columns = getFinanceColumns(defaultProps);

        columns.forEach((column) => {
          expect(column.render).toEqual(expect.any(Function));
        });
      });

      it("marks only the expected columns as non-sortable", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(columns[0].sortable).toBe(false);
        expect(columns[1].sortable).toBeUndefined();
        expect(columns[2].sortable).toBeUndefined();
        expect(columns[3].sortable).toBeUndefined();
        expect(columns[4].sortable).toBe(false);
        expect(columns[5].sortable).toBe(false);
        expect(columns[6].sortable).toBe(false);
      });
    });

    // -------------------------------------------------------------------------
    // Sl No
    // -------------------------------------------------------------------------

    describe("Sl No column", () => {
      it("returns 1 for the first row of the first page", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(columns[0].render({}, 0)).toBe(1);
      });

      it("returns correct serial numbers on the first page", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(columns[0].render({}, 0)).toBe(1);
        expect(columns[0].render({}, 1)).toBe(2);
        expect(columns[0].render({}, 4)).toBe(5);
        expect(columns[0].render({}, 9)).toBe(10);
      });

      it("returns correct serial numbers on the second page", () => {
        const columns = getFinanceColumns({
          page: 2,
          pageSize: 10,
          currencyCode: "INR",
        });

        expect(columns[0].render({}, 0)).toBe(11);
        expect(columns[0].render({}, 4)).toBe(15);
        expect(columns[0].render({}, 9)).toBe(20);
      });

      it("returns correct serial numbers on a later page with a different page size", () => {
        const columns = getFinanceColumns({
          page: 3,
          pageSize: 25,
          currencyCode: "INR",
        });

        expect(columns[0].render({}, 0)).toBe(51);
        expect(columns[0].render({}, 9)).toBe(60);
      });

      it("works with a page size of one", () => {
        const columns = getFinanceColumns({
          page: 5,
          pageSize: 1,
          currencyCode: "INR",
        });

        expect(columns[0].render({}, 0)).toBe(5);
      });

      it("does not depend on row data", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(columns[0].render(null, 0)).toBe(1);
        expect(columns[0].render(undefined, 2)).toBe(3);
      });
    });

    // -------------------------------------------------------------------------
    // Date
    // -------------------------------------------------------------------------

    describe("Date column", () => {
      it("formats January dates correctly", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[1].render({
            date: "2025-01-15T00:00:00",
          }),
        ).toBe("15/Jan/2025");
      });

      it("formats December dates correctly", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[1].render({
            date: "2024-12-05T00:00:00",
          }),
        ).toBe("05/Dec/2024");
      });

      it("pads a single digit day with zero", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[1].render({
            date: "2024-03-07T00:00:00",
          }),
        ).toBe("07/Mar/2024");
      });

      it("formats another valid date correctly", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[1].render({
            date: "2023-09-21T00:00:00",
          }),
        ).toBe("21/Sep/2023");
      });

      it("returns fallback for null date", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(columns[1].render({ date: null })).toBe("----");
      });

      it("returns fallback for undefined date", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(columns[1].render({ date: undefined })).toBe("----");
      });

      it("returns fallback when date property is absent", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(columns[1].render({})).toBe("----");
      });

      it("returns fallback for an empty date string", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(columns[1].render({ date: "" })).toBe("----");
      });
    });

    // -------------------------------------------------------------------------
    // Category
    // -------------------------------------------------------------------------

    describe("Category column", () => {
      it("renders category name", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[2].render({
            category_name: "Salary",
          }),
        ).toBe("Salary");
      });

      it("renders another category name", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[2].render({
            category_name: "Office Expenses",
          }),
        ).toBe("Office Expenses");
      });

      it("returns fallback for an empty category", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[2].render({
            category_name: "",
          }),
        ).toBe("----");
      });

      it("returns fallback for a null category", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[2].render({
            category_name: null,
          }),
        ).toBe("----");
      });

      it("returns fallback for an undefined category", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[2].render({
            category_name: undefined,
          }),
        ).toBe("----");
      });

      it("returns fallback when category property is absent", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(columns[2].render({})).toBe("----");
      });
    });

    // -------------------------------------------------------------------------
    // Note
    // -------------------------------------------------------------------------

    describe("Note column", () => {
      it("renders the note text", () => {
        const columns = getFinanceColumns(defaultProps);

        render(
          <div>
            {columns[3].render({
              note: "Monthly salary payment",
            })}
          </div>,
        );

        expect(screen.getByText("Monthly salary payment")).toBeInTheDocument();
      });

      it("sets the note as the title attribute", () => {
        const columns = getFinanceColumns(defaultProps);

        render(
          <div>
            {columns[3].render({
              note: "Monthly salary payment",
            })}
          </div>,
        );

        const element = screen.getByTitle("Monthly salary payment");

        expect(element).toBeInTheDocument();
        expect(element).toHaveTextContent("Monthly salary payment");
      });

      it("uses fallback for null note", () => {
        const columns = getFinanceColumns(defaultProps);

        render(
          <div>
            {columns[3].render({
              note: null,
            })}
          </div>,
        );

        expect(screen.getByTitle("----")).toBeInTheDocument();
        expect(screen.getByText("----")).toBeInTheDocument();
      });

      it("uses fallback for undefined note", () => {
        const columns = getFinanceColumns(defaultProps);

        render(<div>{columns[3].render({})}</div>);

        expect(screen.getByTitle("----")).toBeInTheDocument();
      });

      it("uses fallback for an empty note", () => {
        const columns = getFinanceColumns(defaultProps);

        render(
          <div>
            {columns[3].render({
              note: "",
            })}
          </div>,
        );

        expect(screen.getByTitle("----")).toBeInTheDocument();
        expect(screen.getByText("----")).toBeInTheDocument();
      });

      it("applies the actual note styles", () => {
        const columns = getFinanceColumns(defaultProps);

        render(
          <div>
            {columns[3].render({
              note: "A long finance note",
            })}
          </div>,
        );

        const element = screen.getByTitle("A long finance note");

        expect(element).toHaveStyle({
          display: "inline-block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          cursor: "default",
        });
      });

      it("does not require maxWidth because it is commented out in the source", () => {
        const columns = getFinanceColumns(defaultProps);

        render(
          <div>
            {columns[3].render({
              note: "Finance note",
            })}
          </div>,
        );

        const element = screen.getByTitle("Finance note");

        expect(element).not.toHaveStyle({
          maxWidth: "180px",
        });
      });
    });

    // -------------------------------------------------------------------------
    // Income
    // -------------------------------------------------------------------------

    describe("Income column", () => {
      it("formats an IN payment with an amount", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[4].render({
            payment_type: "IN",
            amount: 50000,
          }),
        ).toBe("INR 50000");

        expect(formatCurrency).toHaveBeenCalledWith(50000, "INR");
      });

      it("returns fallback for IN payment with null amount", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[4].render({
            payment_type: "IN",
            amount: null,
          }),
        ).toBe("----");

        expect(formatCurrency).not.toHaveBeenCalled();
      });

      it("returns fallback for IN payment with undefined amount", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[4].render({
            payment_type: "IN",
          }),
        ).toBe("----");

        expect(formatCurrency).not.toHaveBeenCalled();
      });

      it("returns fallback for IN payment with an explicitly undefined amount", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[4].render({
            payment_type: "IN",
            amount: undefined,
          }),
        ).toBe("----");
      });

      it("returns double dash for OUT payment", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[4].render({
            payment_type: "OUT",
            amount: 2500,
          }),
        ).toBe("--");

        expect(formatCurrency).not.toHaveBeenCalled();
      });

      it("returns double dash when payment type is missing", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[4].render({
            amount: 2500,
          }),
        ).toBe("--");
      });

      it("returns double dash for a different payment type", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[4].render({
            payment_type: "OTHER",
            amount: 2500,
          }),
        ).toBe("--");
      });

      it("uses the supplied currency code", () => {
        const columns = getFinanceColumns({
          page: 1,
          pageSize: 10,
          currencyCode: "AED",
        });

        expect(
          columns[4].render({
            payment_type: "IN",
            amount: 1000,
          }),
        ).toBe("AED 1000");

        expect(formatCurrency).toHaveBeenCalledWith(1000, "AED");
      });

      it("allows zero as a valid amount", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[4].render({
            payment_type: "IN",
            amount: 0,
          }),
        ).toBe("INR 0");

        expect(formatCurrency).toHaveBeenCalledWith(0, "INR");
      });

      it("allows negative amounts", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[4].render({
            payment_type: "IN",
            amount: -500,
          }),
        ).toBe("INR -500");

        expect(formatCurrency).toHaveBeenCalledWith(-500, "INR");
      });

      it("allows decimal amounts", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[4].render({
            payment_type: "IN",
            amount: 1000.5,
          }),
        ).toBe("INR 1000.5");

        expect(formatCurrency).toHaveBeenCalledWith(1000.5, "INR");
      });

      it("marks Income as not sortable", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(columns[4].sortable).toBe(false);
      });
    });

    // -------------------------------------------------------------------------
    // Expense
    // -------------------------------------------------------------------------

    describe("Expense column", () => {
      it("formats an OUT payment with an amount", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[5].render({
            payment_type: "OUT",
            amount: 15000,
          }),
        ).toBe("INR 15000");

        expect(formatCurrency).toHaveBeenCalledWith(15000, "INR");
      });

      it("returns fallback for OUT payment with null amount", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[5].render({
            payment_type: "OUT",
            amount: null,
          }),
        ).toBe("----");

        expect(formatCurrency).not.toHaveBeenCalled();
      });

      it("returns fallback for OUT payment with undefined amount", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[5].render({
            payment_type: "OUT",
          }),
        ).toBe("----");

        expect(formatCurrency).not.toHaveBeenCalled();
      });

      it("returns double dash for IN payment", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[5].render({
            payment_type: "IN",
            amount: 5000,
          }),
        ).toBe("--");

        expect(formatCurrency).not.toHaveBeenCalled();
      });

      it("returns double dash when payment type is missing", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[5].render({
            amount: 5000,
          }),
        ).toBe("--");
      });

      it("returns double dash for a different payment type", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[5].render({
            payment_type: "OTHER",
            amount: 5000,
          }),
        ).toBe("--");
      });

      it("uses the supplied currency code", () => {
        const columns = getFinanceColumns({
          page: 1,
          pageSize: 10,
          currencyCode: "USD",
        });

        expect(
          columns[5].render({
            payment_type: "OUT",
            amount: 250,
          }),
        ).toBe("USD 250");

        expect(formatCurrency).toHaveBeenCalledWith(250, "USD");
      });

      it("allows zero as a valid amount", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[5].render({
            payment_type: "OUT",
            amount: 0,
          }),
        ).toBe("INR 0");

        expect(formatCurrency).toHaveBeenCalledWith(0, "INR");
      });

      it("allows negative amounts", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[5].render({
            payment_type: "OUT",
            amount: -250,
          }),
        ).toBe("INR -250");

        expect(formatCurrency).toHaveBeenCalledWith(-250, "INR");
      });

      it("allows decimal amounts", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(
          columns[5].render({
            payment_type: "OUT",
            amount: 250.75,
          }),
        ).toBe("INR 250.75");

        expect(formatCurrency).toHaveBeenCalledWith(250.75, "INR");
      });

      it("marks Expense as not sortable", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(columns[5].sortable).toBe(false);
      });
    });

    // -------------------------------------------------------------------------
    // Status
    // -------------------------------------------------------------------------

    describe("Status column", () => {
      it("renders Income for IN payment", () => {
        const columns = getFinanceColumns(defaultProps);

        render(
          <div>
            {columns[6].render({
              payment_type: "IN",
            })}
          </div>,
        );

        const status = screen.getByText("Income");

        expect(status).toBeInTheDocument();

        expect(status).toHaveStyle({
          padding: "4px 10px",
          borderRadius: "999px",
          fontSize: "12px",
          fontWeight: "600",
          color: "#16a34a",
          backgroundColor: "#d3f3e0",
        });
      });

      it("renders Expense for OUT payment", () => {
        const columns = getFinanceColumns(defaultProps);

        render(
          <div>
            {columns[6].render({
              payment_type: "OUT",
            })}
          </div>,
        );

        const status = screen.getByText("Expense");

        expect(status).toBeInTheDocument();

        expect(status).toHaveStyle({
          padding: "4px 10px",
          borderRadius: "999px",
          fontSize: "12px",
          fontWeight: "600",
          color: "#dc2626",
          backgroundColor: "#fbdcdc",
        });
      });

      it("renders Expense when payment type is missing", () => {
        const columns = getFinanceColumns(defaultProps);

        render(<div>{columns[6].render({})}</div>);

        expect(screen.getByText("Expense")).toBeInTheDocument();
      });

      it("renders Expense when payment type is null", () => {
        const columns = getFinanceColumns(defaultProps);

        render(
          <div>
            {columns[6].render({
              payment_type: null,
            })}
          </div>,
        );

        expect(screen.getByText("Expense")).toBeInTheDocument();
      });

      it("renders Expense for another payment type", () => {
        const columns = getFinanceColumns(defaultProps);

        render(
          <div>
            {columns[6].render({
              payment_type: "OTHER",
            })}
          </div>,
        );

        expect(screen.getByText("Expense")).toBeInTheDocument();
      });

      it("marks Status as not sortable", () => {
        const columns = getFinanceColumns(defaultProps);

        expect(columns[6].sortable).toBe(false);
      });
    });
  });

  // ===========================================================================
  // getStatCards
  // ===========================================================================

  describe("getStatCards", () => {
    const defaultStats = {
      totalIncome: 100000,
      totalExpense: 35000,
      cashBalance: 65000,
      currencyCode: "INR",
    };

    // -------------------------------------------------------------------------
    // Structure
    // -------------------------------------------------------------------------

    it("returns exactly three stat cards", () => {
      const cards = getStatCards(defaultStats);

      expect(cards).toHaveLength(3);
    });

    it("returns the correct card titles", () => {
      const cards = getStatCards(defaultStats);

      expect(cards.map((card) => card.title)).toEqual([
        "Total Income",
        "Total Expense",
        "Cash Balance",
      ]);
    });

    it("returns all expected properties for every card", () => {
      const cards = getStatCards(defaultStats);

      cards.forEach((card) => {
        expect(card).toEqual(
          expect.objectContaining({
            icon: expect.anything(),
            backgroundColor: expect.any(String),
            iconColor: expect.any(String),
            count: expect.any(String),
            title: expect.any(String),
          }),
        );
      });
    });

    // -------------------------------------------------------------------------
    // Currency formatting
    // -------------------------------------------------------------------------

    it("formats Total Income correctly", () => {
      const cards = getStatCards(defaultStats);

      expect(cards[0].count).toBe("INR 100000");
      expect(formatCurrency).toHaveBeenNthCalledWith(1, 100000, "INR");
    });

    it("formats Total Expense correctly", () => {
      const cards = getStatCards(defaultStats);

      expect(cards[1].count).toBe("INR 35000");
      expect(formatCurrency).toHaveBeenNthCalledWith(2, 35000, "INR");
    });

    it("formats Cash Balance correctly", () => {
      const cards = getStatCards(defaultStats);

      expect(cards[2].count).toBe("INR 65000");
      expect(formatCurrency).toHaveBeenNthCalledWith(3, 65000, "INR");
    });

    it("calls formatCurrency exactly three times", () => {
      getStatCards(defaultStats);

      expect(formatCurrency).toHaveBeenCalledTimes(3);
    });

    it("passes the same currency code to all cards", () => {
      getStatCards({
        totalIncome: 1000,
        totalExpense: 400,
        cashBalance: 600,
        currencyCode: "AED",
      });

      expect(formatCurrency).toHaveBeenNthCalledWith(1, 1000, "AED");
      expect(formatCurrency).toHaveBeenNthCalledWith(2, 400, "AED");
      expect(formatCurrency).toHaveBeenNthCalledWith(3, 600, "AED");
    });

    // -------------------------------------------------------------------------
    // Colors
    // -------------------------------------------------------------------------

    it("returns the correct icon colors", () => {
      const cards = getStatCards(defaultStats);

      expect(cards.map((card) => card.iconColor)).toEqual([
        "#22c55e",
        "#ef4444",
        "#6366f1",
      ]);
    });

    it("returns the correct background colors", () => {
      const cards = getStatCards(defaultStats);

      expect(cards.map((card) => card.backgroundColor)).toEqual([
        "#d3f3e0",
        "#fbdcdc",
        "#e0e7ff",
      ]);
    });

    // -------------------------------------------------------------------------
    // Icons
    // -------------------------------------------------------------------------

    it("creates a valid React element for every icon", () => {
      const cards = getStatCards(defaultStats);

      cards.forEach((card) => {
        expect(React.isValidElement(card.icon)).toBe(true);
      });
    });

    it("uses FiTrendingUp for Total Income", () => {
      const cards = getStatCards(defaultStats);

      expect(cards[0].icon.type).toBe(FiTrendingUp);
    });

    it("uses FiTrendingDown for Total Expense", () => {
      const cards = getStatCards(defaultStats);

      expect(cards[1].icon.type).toBe(FiTrendingDown);
    });

    it("uses FiDollarSign for Cash Balance", () => {
      const cards = getStatCards(defaultStats);

      expect(cards[2].icon.type).toBe(FiDollarSign);
    });

    it("sets icon size to 20 for all cards", () => {
      const cards = getStatCards(defaultStats);

      cards.forEach((card) => {
        expect(card.icon.props.size).toBe(20);
      });
    });

    // -------------------------------------------------------------------------
    // Edge cases
    // -------------------------------------------------------------------------

    it("handles zero totals correctly", () => {
      const cards = getStatCards({
        totalIncome: 0,
        totalExpense: 0,
        cashBalance: 0,
        currencyCode: "INR",
      });

      expect(cards).toHaveLength(3);
      expect(cards[0].count).toBe("INR 0");
      expect(cards[1].count).toBe("INR 0");
      expect(cards[2].count).toBe("INR 0");

      expect(formatCurrency).toHaveBeenNthCalledWith(1, 0, "INR");
      expect(formatCurrency).toHaveBeenNthCalledWith(2, 0, "INR");
      expect(formatCurrency).toHaveBeenNthCalledWith(3, 0, "INR");
    });

    it("handles negative values correctly", () => {
      const cards = getStatCards({
        totalIncome: -1000,
        totalExpense: -1500,
        cashBalance: -500,
        currencyCode: "INR",
      });

      expect(cards[0].count).toBe("INR -1000");
      expect(cards[1].count).toBe("INR -1500");
      expect(cards[2].count).toBe("INR -500");
    });

    it("handles negative cash balance correctly", () => {
      const cards = getStatCards({
        totalIncome: 1000,
        totalExpense: 1500,
        cashBalance: -500,
        currencyCode: "INR",
      });

      expect(cards[2].count).toBe("INR -500");

      expect(formatCurrency).toHaveBeenNthCalledWith(3, -500, "INR");
    });

    it("handles decimal values correctly", () => {
      const cards = getStatCards({
        totalIncome: 1000.5,
        totalExpense: 250.75,
        cashBalance: 749.75,
        currencyCode: "USD",
      });

      expect(cards[0].count).toBe("USD 1000.5");
      expect(cards[1].count).toBe("USD 250.75");
      expect(cards[2].count).toBe("USD 749.75");

      expect(formatCurrency).toHaveBeenNthCalledWith(1, 1000.5, "USD");

      expect(formatCurrency).toHaveBeenNthCalledWith(2, 250.75, "USD");

      expect(formatCurrency).toHaveBeenNthCalledWith(3, 749.75, "USD");
    });

    it("handles mixed zero, negative, and decimal values", () => {
      const cards = getStatCards({
        totalIncome: 0,
        totalExpense: -250.5,
        cashBalance: 100.25,
        currencyCode: "AED",
      });

      expect(cards[0].count).toBe("AED 0");
      expect(cards[1].count).toBe("AED -250.5");
      expect(cards[2].count).toBe("AED 100.25");
    });

    it("supports another currency code", () => {
      const cards = getStatCards({
        totalIncome: 500,
        totalExpense: 300,
        cashBalance: 200,
        currencyCode: "USD",
      });

      expect(cards[0].count).toBe("USD 500");
      expect(cards[1].count).toBe("USD 300");
      expect(cards[2].count).toBe("USD 200");
    });
  });
});
