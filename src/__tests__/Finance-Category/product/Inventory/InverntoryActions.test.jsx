import React from "react";

import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from "vitest";

import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

vi.mock("./InventoryAction.styles", async () => {
  const React = await import("react");

  const ActionWrapper = React.forwardRef(
    ({ children, ...props }, ref) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    )
  );

  const ActionButton = ({
    children,
    ...props
  }) => (
    <button {...props}>
      {children}
    </button>
  );

  const FloatingAction = ({
    children,
    $open,
    $position,
    ...props
  }) => (
    <button
      {...props}
      data-position={$position}
      hidden={!$open}
    >
      {children}
    </button>
  );

  return {
    ActionWrapper,
    ActionButton,
    FloatingAction,
  };
});

import InverntoryActions from "./InverntoryActions";

describe("InverntoryActions Component", () => {
  let onEdit;
  let onDelete;

  const mockRow = {
    id: 1,
    product_name: "Copper Wire",
  };

  beforeEach(() => {
    onEdit = vi.fn();
    onDelete = vi.fn();
  });

  it("should render action button", () => {
    render(
      <InverntoryActions
        row={mockRow}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    expect(
      screen.getByRole("button")
    ).toBeInTheDocument();
  });

  it("should open action menu on click", () => {
    render(
      <InverntoryActions row={mockRow} />
    );

    fireEvent.click(
      screen.getByRole("button")
    );

    expect(
      screen.getByTitle("Edit")
    ).toBeVisible();

    expect(
      screen.getByTitle("Delete")
    ).toBeVisible();
  });

  it("should close action menu on second click", () => {
    render(
      <InverntoryActions row={mockRow} />
    );

    const button = screen.getByRole("button");

    fireEvent.click(button);

    expect(
      screen.getByTitle("Edit")
    ).toBeVisible();

    fireEvent.click(button);

    expect(
      screen.getByTitle("Edit")
    ).not.toBeVisible();
  });

  it("should call onEdit with selected row", () => {
    render(
      <InverntoryActions
        row={mockRow}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    fireEvent.click(
      screen.getByRole("button")
    );

    fireEvent.click(
      screen.getByTitle("Edit")
    );

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(mockRow);
  });

  it("should call onDelete with selected row", () => {
    render(
      <InverntoryActions
        row={mockRow}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    fireEvent.click(
      screen.getByRole("button")
    );

    fireEvent.click(
      screen.getByTitle("Delete")
    );

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(mockRow);
  });

  it("should close menu after editing", () => {
    render(
      <InverntoryActions
        row={mockRow}
        onEdit={onEdit}
      />
    );

    fireEvent.click(
      screen.getByRole("button")
    );

    fireEvent.click(
      screen.getByTitle("Edit")
    );

    expect(
      screen.getByTitle("Edit")
    ).not.toBeVisible();
  });

  it("should close menu after deleting", () => {
    render(
      <InverntoryActions
        row={mockRow}
        onDelete={onDelete}
      />
    );

    fireEvent.click(
      screen.getByRole("button")
    );

    fireEvent.click(
      screen.getByTitle("Delete")
    );

    expect(
      screen.getByTitle("Delete")
    ).not.toBeVisible();
  });

  it("should close menu when clicking outside", () => {
    render(
      <>
        <InverntoryActions row={mockRow} />
        <button>Outside</button>
      </>
    );

    fireEvent.click(
      screen.getAllByRole("button")[0]
    );

    expect(
      screen.getByTitle("Edit")
    ).toBeVisible();

    fireEvent.mouseDown(
      screen.getByRole("button", {
        name: "Outside",
      })
    );

    expect(
      screen.getByTitle("Edit")
    ).not.toBeVisible();
  });

  it("should stop event propagation", () => {
    const parentClick = vi.fn();

    render(
      <div onClick={parentClick}>
        <InverntoryActions row={mockRow} />
      </div>
    );

    fireEvent.click(
      screen.getByRole("button")
    );

    expect(parentClick).not.toHaveBeenCalled();
  });

  it("should work without optional callbacks", () => {
    render(
      <InverntoryActions row={mockRow} />
    );

    fireEvent.click(
      screen.getByRole("button")
    );

    expect(() => {
      fireEvent.click(
        screen.getByTitle("Edit")
      );
    }).not.toThrow();
  });
});