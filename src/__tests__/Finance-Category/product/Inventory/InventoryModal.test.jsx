import React from "react";

import {
  describe,
  it,
  expect,
  vi,
} from "vitest";

import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import StockAdjustmentModal from "./InventoryModal.jsx";

describe("StockAdjustmentModal Component", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    initialData: null,
    isEdit: false,
    submitting: false,
    warehouses: [],
    products: [],
  };

  it("should not render when modal is closed", () => {
    const { container } = render(
      <StockAdjustmentModal
        {...defaultProps}
        isOpen={false}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("should render modal when opened", () => {
    render(
      <StockAdjustmentModal {...defaultProps} />
    );

    expect(
      screen.getByRole("dialog")
    ).toBeInTheDocument();
  });

  it("should render modal title", () => {
    render(
      <StockAdjustmentModal {...defaultProps} />
    );

    expect(
      screen.getByText("Stock Adjustment")
    ).toBeInTheDocument();
  });

  it("should render all form fields", () => {
    render(
      <StockAdjustmentModal {...defaultProps} />
    );

    expect(
      screen.getByLabelText("ADJUSTMENT NUMBER")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("ADJUSTMENT DATE")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("WAREHOUSE")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("PRODUCT")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("ADJUSTMENT TYPE")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("REASON")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("CURRENT STOCK")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("ADJUSTMENT QUANTITY")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("ADJUSTED STOCK")
    ).toBeInTheDocument();
  });

  it("should render default warehouse options", () => {
    render(
      <StockAdjustmentModal {...defaultProps} />
    );

    expect(
      screen.getByRole("option", {
        name: "Bicycle WH",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Main Warehouse",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Spare Parts WH",
      })
    ).toBeInTheDocument();
  });

  it("should render default product options", () => {
    render(
      <StockAdjustmentModal {...defaultProps} />
    );

    expect(
      screen.getByRole("option", {
        name: "Fiber Cable",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Steel Cable",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Copper Wire",
      })
    ).toBeInTheDocument();
  });

  it("should render supplied warehouse options", () => {
    render(
      <StockAdjustmentModal
        {...defaultProps}
        warehouses={[
          {
            id: 1,
            name: "Central Warehouse",
          },
        ]}
      />
    );

    expect(
      screen.getByRole("option", {
        name: "Central Warehouse",
      })
    ).toHaveValue("1");
  });

  it("should render supplied product options", () => {
    render(
      <StockAdjustmentModal
        {...defaultProps}
        products={[
          {
            id: 10,
            name: "Copper Cable",
          },
        ]}
      />
    );

    expect(
      screen.getByRole("option", {
        name: "Copper Cable",
      })
    ).toHaveValue("10");
  });

  it("should load initial form data", () => {
    render(
      <StockAdjustmentModal
        {...defaultProps}
        initialData={{
          adjustmentNumber: "SA20260001",
          adjustmentDate: "2026-11-06",
          warehouse: "1",
          product: "10",
          currentStock: "100",
          adjustmentQuantity: "10",
          adjustedStock: "90",
        }}
      />
    );

    expect(
      screen.getByLabelText("ADJUSTMENT NUMBER")
    ).toHaveValue("SA20260001");

    expect(
      screen.getByLabelText("CURRENT STOCK")
    ).toHaveValue(100);

    expect(
      screen.getByLabelText("ADJUSTMENT QUANTITY")
    ).toHaveValue(10);
  });

  it("should make adjustment number readonly in edit mode", () => {
    render(
      <StockAdjustmentModal
        {...defaultProps}
        isEdit={true}
        initialData={{
          adjustmentNumber: "SA20260001",
        }}
      />
    );

    expect(
      screen.getByLabelText("ADJUSTMENT NUMBER")
    ).toHaveAttribute("readonly");
  });

  it("should display update button in edit mode", () => {
    render(
      <StockAdjustmentModal
        {...defaultProps}
        isEdit={true}
      />
    );

    expect(
      screen.getByRole("button", {
        name: /update adjustment/i,
      })
    ).toBeInTheDocument();
  });

  it("should calculate reduced stock correctly", async () => {
    const user = userEvent.setup();

    render(
      <StockAdjustmentModal {...defaultProps} />
    );

    await user.type(
      screen.getByLabelText("CURRENT STOCK"),
      "100"
    );

    await user.type(
      screen.getByLabelText("ADJUSTMENT QUANTITY"),
      "20"
    );

    expect(
      screen.getByLabelText("ADJUSTED STOCK")
    ).toHaveValue(80);
  });

  it("should calculate added stock correctly", async () => {
    const user = userEvent.setup();

    render(
      <StockAdjustmentModal {...defaultProps} />
    );

    await user.type(
      screen.getByLabelText("CURRENT STOCK"),
      "100"
    );

    await user.type(
      screen.getByLabelText("ADJUSTMENT QUANTITY"),
      "20"
    );

    await user.selectOptions(
      screen.getByLabelText("ADJUSTMENT TYPE"),
      "Add Stock"
    );

    expect(
      screen.getByLabelText("ADJUSTED STOCK")
    ).toHaveValue(120);
  });

  it("should recalculate stock when adjustment type changes", async () => {
    const user = userEvent.setup();

    render(
      <StockAdjustmentModal
        {...defaultProps}
        initialData={{
          currentStock: "50",
          adjustmentQuantity: "10",
        }}
      />
    );

    const typeSelect = screen.getByLabelText(
      "ADJUSTMENT TYPE"
    );

    await user.selectOptions(
      typeSelect,
      "Add Stock"
    );

    expect(
      screen.getByLabelText("ADJUSTED STOCK")
    ).toHaveValue(60);

    await user.selectOptions(
      typeSelect,
      "Reduce Stock"
    );

    expect(
      screen.getByLabelText("ADJUSTED STOCK")
    ).toHaveValue(40);
  });

  it("should handle empty numeric values", () => {
    render(
      <StockAdjustmentModal {...defaultProps} />
    );

    expect(
      screen.getByLabelText("ADJUSTED STOCK")
    ).toHaveValue(0);
  });

  it("should call onSubmit when form is submitted", () => {
    const onSubmit = vi.fn();

    render(
      <StockAdjustmentModal
        {...defaultProps}
        onSubmit={onSubmit}
      />
    );

    fireEvent.submit(
      screen.getByRole("button", {
        name: /confirm adjustment/i,
      }).closest("form")
    );

    expect(onSubmit).toHaveBeenCalledTimes(1);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        adjustmentType: "Reduce Stock",
        reason: "Damaged Goods",
        attachment: null,
      })
    );
  });

  it("should not submit when submitting is true", () => {
    const onSubmit = vi.fn();

    render(
      <StockAdjustmentModal
        {...defaultProps}
        onSubmit={onSubmit}
        submitting={true}
      />
    );

    fireEvent.submit(
      screen.getByRole("button", {
        name: /saving/i,
      }).closest("form")
    );

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should not submit when onSubmit is missing", () => {
    render(
      <StockAdjustmentModal
        {...defaultProps}
        onSubmit={undefined}
      />
    );

    fireEvent.submit(
      screen.getByRole("button", {
        name: /confirm adjustment/i,
      }).closest("form")
    );

    expect(
      screen.getByRole("dialog")
    ).toBeInTheDocument();
  });

  it("should call onClose when cancel is clicked", () => {
    const onClose = vi.fn();

    render(
      <StockAdjustmentModal
        {...defaultProps}
        onClose={onClose}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "CANCEL",
      })
    );

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should close modal when Escape is pressed", () => {
    const onClose = vi.fn();

    render(
      <StockAdjustmentModal
        {...defaultProps}
        onClose={onClose}
      />
    );

    fireEvent.keyDown(document, {
      key: "Escape",
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should not close modal on Escape while submitting", () => {
    const onClose = vi.fn();

    render(
      <StockAdjustmentModal
        {...defaultProps}
        onClose={onClose}
        submitting={true}
      />
    );

    fireEvent.keyDown(document, {
      key: "Escape",
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("should close modal when overlay is clicked", () => {
    const onClose = vi.fn();

    const { container } = render(
      <StockAdjustmentModal
        {...defaultProps}
        onClose={onClose}
      />
    );

    fireEvent.click(container.firstChild);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should not close modal when modal content is clicked", () => {
    const onClose = vi.fn();

    render(
      <StockAdjustmentModal
        {...defaultProps}
        onClose={onClose}
      />
    );

    fireEvent.click(
      screen.getByRole("dialog")
    );

    expect(onClose).not.toHaveBeenCalled();
  });

  it("should not close overlay while submitting", () => {
    const onClose = vi.fn();

    const { container } = render(
      <StockAdjustmentModal
        {...defaultProps}
        onClose={onClose}
        submitting={true}
      />
    );

    fireEvent.click(container.firstChild);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("should upload and display selected attachment name", () => {
    const { container } = render(
      <StockAdjustmentModal {...defaultProps} />
    );

    const file = new File(
      ["test attachment"],
      "stock-proof.pdf",
      {
        type: "application/pdf",
      }
    );

    const fileInput = container.querySelector(
      'input[type="file"]'
    );

    fireEvent.change(fileInput, {
      target: {
        files: [file],
      },
    });

    expect(
      screen.getByDisplayValue("stock-proof.pdf")
    ).toBeInTheDocument();
  });

  it("should display existing attachment name", () => {
    render(
      <StockAdjustmentModal
        {...defaultProps}
        initialData={{
          attachmentName: "existing-proof.pdf",
        }}
      />
    );

    expect(
      screen.getByDisplayValue("existing-proof.pdf")
    ).toBeInTheDocument();
  });

  it("should disable inputs while submitting", () => {
    render(
      <StockAdjustmentModal
        {...defaultProps}
        submitting={true}
      />
    );

    expect(
      screen.getByLabelText("ADJUSTMENT DATE")
    ).toBeDisabled();

    expect(
      screen.getByLabelText("WAREHOUSE")
    ).toBeDisabled();

    expect(
      screen.getByLabelText("PRODUCT")
    ).toBeDisabled();

    expect(
      screen.getByLabelText("CURRENT STOCK")
    ).toBeDisabled();

    expect(
      screen.getByRole("button", {
        name: "CANCEL",
      })
    ).toBeDisabled();
  });
});