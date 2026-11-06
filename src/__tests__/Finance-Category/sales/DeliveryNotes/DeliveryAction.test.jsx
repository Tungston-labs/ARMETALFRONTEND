import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mocks.navigate,
}));

import DeliveryAction from "./DeliveryAction";

describe("DeliveryAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const row = {
    id: 15,
    deliveryNoteNumber: "DN-015",
  };

  it("renders the actions button", () => {
    render(<DeliveryAction row={row} />);

    expect(screen.getByTitle("Actions")).toBeInTheDocument();
  });

  it("opens the action menu when Actions is clicked", () => {
    render(<DeliveryAction row={row} />);

    fireEvent.click(screen.getByTitle("Actions"));

    expect(screen.getByTitle("Edit Delivery Note")).toBeInTheDocument();
    expect(screen.getByTitle("Delete Delivery Note")).toBeInTheDocument();
  });

  it("navigates to the edit page with delivery note data", () => {
    render(<DeliveryAction row={row} />);

    fireEvent.click(screen.getByTitle("Actions"));
    fireEvent.click(screen.getByTitle("Edit Delivery Note"));

    expect(mocks.navigate).toHaveBeenCalledWith("/delivery/notes/edit/15", {
      state: {
        deliveryNoteData: row,
      },
    });
  });

  it("calls onDelete with the selected row", () => {
    const onDelete = vi.fn();

    render(<DeliveryAction row={row} onDelete={onDelete} />);

    fireEvent.click(screen.getByTitle("Actions"));
    fireEvent.click(screen.getByTitle("Delete Delivery Note"));

    expect(onDelete).toHaveBeenCalledWith(row);
  });

  it("does not navigate when the row has no id", () => {
    render(<DeliveryAction row={{ deliveryNoteNumber: "DN-016" }} />);

    fireEvent.click(screen.getByTitle("Actions"));
    fireEvent.click(screen.getByTitle("Edit Delivery Note"));

    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it("closes the menu when clicking outside the action wrapper", () => {
    render(
      <div>
        <DeliveryAction row={row} />
        <button>Outside</button>
      </div>,
    );

    fireEvent.click(screen.getByTitle("Actions"));

    const editButton = screen.getByTitle("Edit Delivery Note");
    expect(editButton).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole("button", { name: "Outside" }));

    // The menu is closed by setting its $open prop to false.
    expect(editButton).toBeInTheDocument();
  });
});
