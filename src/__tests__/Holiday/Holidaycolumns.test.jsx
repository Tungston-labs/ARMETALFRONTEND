import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { getHolidayColumns } from "../../Pages/holiday/Holidaycolumns";

describe("Holiday Columns", () => {
  const createColumns = (overrides = {}) =>
    getHolidayColumns({
      currentPage: 1,
      pageSize: 20,
      onDeleteClick: vi.fn(),
      ...overrides,
    });

  it("returns all expected columns", () => {
    const columns = createColumns();

    expect(columns).toHaveLength(5);

    expect(columns.map((column) => column.header)).toEqual([
      "Sl No",
      "Holiday name",
      "Holiday type",
      "Date",
      "",
    ]);

    expect(columns.map((column) => column.accessor)).toEqual([
      "slNo",
      "description",
      "holiday_type_display",
      "date",
      "actions",
    ]);
  });

  it("configures sortable properties correctly", () => {
    const columns = createColumns();

    expect(columns[0].sortable).toBe(false);
    expect(columns[1].sortable).toBeUndefined();
    expect(columns[2].sortable).toBeUndefined();
    expect(columns[3].sortable).toBeUndefined();
    expect(columns[4].sortable).toBe(false);
  });

  describe("Sl No column", () => {
    it("calculates serial number correctly on the first page", () => {
      const columns = createColumns({
        currentPage: 1,
        pageSize: 20,
      });

      const renderSlNo = columns[0].render;

      expect(renderSlNo({}, 0)).toBe(1);
      expect(renderSlNo({}, 1)).toBe(2);
      expect(renderSlNo({}, 4)).toBe(5);
    });

    it("calculates serial number correctly on later pages", () => {
      const columns = createColumns({
        currentPage: 3,
        pageSize: 20,
      });

      const renderSlNo = columns[0].render;

      expect(renderSlNo({}, 0)).toBe(41);
      expect(renderSlNo({}, 4)).toBe(45);
      expect(renderSlNo({}, 19)).toBe(60);
    });

    it("uses the configured page size", () => {
      const columns = createColumns({
        currentPage: 4,
        pageSize: 10,
      });

      expect(columns[0].render({}, 0)).toBe(31);
      expect(columns[0].render({}, 9)).toBe(40);
    });
  });

  describe("Holiday name column", () => {
    it("capitalizes the first character of the holiday description", () => {
      const columns = createColumns();

      expect(
        columns[1].render({
          description: "independence day",
        }),
      ).toBe("Independence day");
    });

    it("preserves the remaining characters of the description", () => {
      const columns = createColumns();

      expect(
        columns[1].render({
          description: "company foundation day",
        }),
      ).toBe("Company foundation day");
    });

    it("returns placeholder when description is empty", () => {
      const columns = createColumns();

      expect(
        columns[1].render({
          description: "",
        }),
      ).toBe("----");
    });

    it("returns placeholder when description is missing", () => {
      const columns = createColumns();

      expect(columns[1].render({})).toBe("----");
    });

    it("handles a single-character description", () => {
      const columns = createColumns();

      expect(
        columns[1].render({
          description: "a",
        }),
      ).toBe("A");
    });
  });

  describe("Holiday type column", () => {
    it("uses holiday_type_display as the accessor", () => {
      const columns = createColumns();

      expect(columns[2].accessor).toBe("holiday_type_display");
      expect(columns[2].header).toBe("Holiday type");
    });

    it("does not define a custom render function", () => {
      const columns = createColumns();

      expect(columns[2].render).toBeUndefined();
    });
  });

  describe("Date column", () => {
    it("formats a valid date correctly", () => {
      const columns = createColumns();

      expect(
        columns[3].render({
          date: "2026-09-20",
        }),
      ).toBe("20/Sep/2026");
    });

    it("formats another valid date correctly", () => {
      const columns = createColumns();

      expect(
        columns[3].render({
          date: "2026-01-05",
        }),
      ).toBe("05/Jan/2026");
    });

    it("returns placeholder when date is null", () => {
      const columns = createColumns();

      expect(
        columns[3].render({
          date: null,
        }),
      ).toBe("----");
    });

    it("returns placeholder when date is undefined", () => {
      const columns = createColumns();

      expect(columns[3].render({})).toBe("----");
    });

    it("returns placeholder when date is an empty string", () => {
      const columns = createColumns();

      expect(
        columns[3].render({
          date: "",
        }),
      ).toBe("----");
    });
  });

  describe("Delete action column", () => {
    it("renders the delete icon", () => {
      const columns = createColumns();

      const { container } = render(
        columns[4].render({
          id: 123,
        }),
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders the delete icon with an SVG element", () => {
      const columns = createColumns();

      const { container } = render(
        columns[4].render({
          id: 123,
        }),
      );

      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("calls onDeleteClick with the holiday id when clicked", () => {
      const onDeleteClick = vi.fn();

      const columns = createColumns({
        onDeleteClick,
      });

      const { container } = render(
        columns[4].render({
          id: 123,
        }),
      );

      const deleteIcon = container.querySelector("svg");

      expect(deleteIcon).toBeInTheDocument();

      fireEvent.click(deleteIcon);

      expect(onDeleteClick).toHaveBeenCalledTimes(1);
      expect(onDeleteClick).toHaveBeenCalledWith(123);
    });

    it("works with a string holiday id", () => {
      const onDeleteClick = vi.fn();

      const columns = createColumns({
        onDeleteClick,
      });

      const { container } = render(
        columns[4].render({
          id: "holiday-123",
        }),
      );

      fireEvent.click(container.querySelector("svg"));

      expect(onDeleteClick).toHaveBeenCalledWith("holiday-123");
    });
  });

  describe("Column render functions", () => {
    it("accepts row and index arguments for the serial number renderer", () => {
      const columns = createColumns({
        currentPage: 2,
        pageSize: 20,
      });

      const row = {
        id: 10,
        description: "test holiday",
      };

      expect(columns[0].render(row, 0)).toBe(21);
      expect(columns[0].render(row, 5)).toBe(26);
    });

    it("accepts the row argument for the holiday name renderer", () => {
      const columns = createColumns();

      const row = {
        description: "new year",
      };

      expect(columns[1].render(row)).toBe("New year");
    });

    it("accepts the row argument for the date renderer", () => {
      const columns = createColumns();

      const row = {
        date: "2026-12-25",
      };

      expect(columns[3].render(row)).toBe("25/Dec/2026");
    });

    it("accepts the row argument for the delete renderer", () => {
      const onDeleteClick = vi.fn();

      const columns = createColumns({
        onDeleteClick,
      });

      const row = {
        id: 999,
      };

      const { container } = render(columns[4].render(row));

      fireEvent.click(container.querySelector("svg"));

      expect(onDeleteClick).toHaveBeenCalledWith(999);
    });
  });
});
