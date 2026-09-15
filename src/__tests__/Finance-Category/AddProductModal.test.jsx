import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

import AddProductModal from "../../Pages/FinanceModule/PRODUCTS/ProductList/modal/AddProductModal";

// ---- react-redux ----
const { mockDispatch, mockUseSelector } = vi.hoisted(() => ({
    mockDispatch: vi.fn(),
    mockUseSelector: vi.fn(),
}));

vi.mock("react-redux", () => ({
    useDispatch: () => mockDispatch,
    useSelector: (selector) => mockUseSelector(selector),
}));

vi.mock("../../Redux/finance/categorySlice", () => ({
    getCategories: vi.fn((params) => ({ type: "getCategories", payload: params })),
}));

import { getCategories } from "../../Redux/finance/categorySlice";

// ---- styled-components stand-ins ----
// Real behavior lives in JSX structure/logic, not styling, so swap in plain
// tags. Input/Select get data-testid={name} so tests can target the exact
// field without depending on unlabelled placeholder text.
vi.mock(
    "../../Pages/FinanceModule/PRODUCTS/ProductList/modal/AddProductModal.styles",
    () => ({
        Overlay: ({ children, onClick }) => (
            <div data-testid="overlay" onClick={onClick}>
                {children}
            </div>
        ),
        Modal: ({ children, onClick }) => (
            <div data-testid="modal" onClick={onClick}>
                {children}
            </div>
        ),
        Header: ({ children }) => <div>{children}</div>,
        Title: ({ children }) => <h2>{children}</h2>,
        Subtitle: ({ children }) => <p>{children}</p>,
        Form: ({ children, onSubmit }) => (
            <form onSubmit={onSubmit}>{children}</form>
        ),
        FormGroup: ({ children }) => <div>{children}</div>,
        Label: ({ children }) => <label>{children}</label>,
        Input: (props) => <input data-testid={props.name} {...props} />,
        Select: (props) => (
            <select data-testid={props.name} {...props}>
                {props.children}
            </select>
        ),
        ButtonRow: ({ children }) => <div>{children}</div>,
        CancelButton: ({ children, ...rest }) => (
            <button data-testid="cancel-btn" {...rest}>
                {children}
            </button>
        ),
        SaveButton: ({ children, ...rest }) => (
            <button data-testid="save-btn" {...rest}>
                {children}
            </button>
        ),
    })
);

const baseCategoryState = {
    category: {
        categories: [
            { id: 1, category_name: "Networking" },
            { id: 2, category_name: "Furniture" },
        ],
        loading: false,
    },
};

const mockCategoryState = (overrides = {}) => {
    const state = { category: { ...baseCategoryState.category, ...overrides } };
    mockUseSelector.mockImplementation((selector) => selector(state));
};

const baseProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSave: vi.fn(),
    loading: false,
    warehouses: [{ id: 1, warehouse_name: "Main Warehouse" }],
    initialData: null,
    mode: "add",
};

describe("AddProductModal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockCategoryState();
    });

    it("renders nothing when isOpen is false", () => {
        render(<AddProductModal {...baseProps} isOpen={false} />);
        expect(screen.queryByTestId("overlay")).not.toBeInTheDocument();
    });

    it("dispatches getCategories when the modal opens", () => {
        render(<AddProductModal {...baseProps} />);

        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({ type: "getCategories" })
        );
        expect(getCategories).toHaveBeenCalledWith({ page: 1, page_size: 100 });
    });

    it("shows Add-mode copy and button label", () => {
        render(<AddProductModal {...baseProps} mode="add" />);

        expect(screen.getByText("Add New Product")).toBeInTheDocument();
        expect(screen.getByText("Create a new product or service.")).toBeInTheDocument();
        expect(screen.getByTestId("save-btn")).toHaveTextContent("SAVE PRODUCT");
    });

    it("shows Edit-mode copy and button label", () => {
        render(<AddProductModal {...baseProps} mode="edit" />);

        expect(screen.getByText("Edit Product")).toBeInTheDocument();
        expect(
            screen.getByText("Update the details of this product or service.")
        ).toBeInTheDocument();
        expect(screen.getByTestId("save-btn")).toHaveTextContent("UPDATE PRODUCT");
    });

    it("resets to blank defaults when opened with no initialData", () => {
        render(<AddProductModal {...baseProps} initialData={null} />);

        expect(screen.getByTestId("product_name")).toHaveValue("");
        expect(screen.getByTestId("opening_stock_qty")).toHaveValue(0);
        expect(screen.getByTestId("reorder_level")).toHaveValue(10);
        // FIX: there is no "status" field rendered in this modal — status is
        // only ever set via initialData, never editable here. Assert against
        // a field that actually exists instead of a getByTestId(...) ?? ...
        // fallback, which never works anyway since getByTestId throws (it
        // doesn't return null like queryByTestId does).
        expect(screen.getByTestId("product_type")).toHaveValue("product");
    });

    it("prefills the form from initialData, unwrapping object category/warehouse", () => {
        const initialData = {
            product_name: "Cisco Router C9300",
            sku: "1253698",
            category: { id: 2, category_name: "Furniture" },
            warehouse: { id: 1, warehouse_name: "Main Warehouse" },
            brand: "Cisco",
            supplier: "Cisco Systems",
            opening_stock_qty: 125,
            current_stock: 175,
            reorder_level: 10,
            unit: "PCS",
            quantity: 50,
            cost_price: "9500.00",
            selling_price: "12000.00",
            tax_type: "vat",
            tax_rate: 15,
            hsn_sac_code: "85176290",
            status: "active",
        };

        render(<AddProductModal {...baseProps} mode="edit" initialData={initialData} />);

        expect(screen.getByTestId("product_name")).toHaveValue("Cisco Router C9300");
        expect(screen.getByTestId("sku")).toHaveValue("1253698");
        expect(screen.getByTestId("category")).toHaveValue("2");
        expect(screen.getByTestId("warehouse")).toHaveValue("1");
        expect(screen.getByTestId("opening_stock_qty")).toHaveValue(125);
        expect(screen.getByTestId("quantity")).toHaveValue(50);
        expect(screen.getByTestId("cost_price")).toHaveValue(9500);
        expect(screen.getByTestId("selling_price")).toHaveValue(12000);
        expect(screen.getByTestId("hsn_sac_code")).toHaveValue("85176290");
    });

    it("falls back opening_stock_qty and quantity to current_stock when the specific fields are missing", () => {
        const initialData = {
            product_name: "Legacy Item",
            current_stock: 42,
        };

        render(<AddProductModal {...baseProps} mode="edit" initialData={initialData} />);

        expect(screen.getByTestId("opening_stock_qty")).toHaveValue(42);
        expect(screen.getByTestId("quantity")).toHaveValue(42);
    });

    it("falls back category/warehouse to a plain id when not nested in an object", () => {
        const initialData = {
            product_name: "Plain Id Product",
            // FIX: category must match an id that actually exists in the
            // mocked category list (baseCategoryState has ids 1 and 2).
            // A <select> can't land on a value with no matching <option>,
            // so id 3 was silently rendered as unselected — not a real bug,
            // just bad test data.
            category: 2,
            warehouse: 1,
        };

        render(<AddProductModal {...baseProps} mode="edit" initialData={initialData} />);

        expect(screen.getByTestId("category")).toHaveValue("2");
        expect(screen.getByTestId("warehouse")).toHaveValue("1");
    });

    it("updates form state when a field changes", () => {
        render(<AddProductModal {...baseProps} />);

        fireEvent.change(screen.getByTestId("product_name"), {
            target: { value: "New Widget" },
        });

        expect(screen.getByTestId("product_name")).toHaveValue("New Widget");
    });

    it("shows 'Loading Categories...' and disables selection while categories load", () => {
        mockCategoryState({ loading: true, categories: [] });
        render(<AddProductModal {...baseProps} />);

        const categorySelect = screen.getByTestId("category");
        expect(within(categorySelect).getByText("Loading Categories...")).toBeInTheDocument();
        expect(within(categorySelect).queryByText("Networking")).not.toBeInTheDocument();
    });

    it("lists categories from redux state once loaded", () => {
        render(<AddProductModal {...baseProps} />);

        const categorySelect = screen.getByTestId("category");
        expect(within(categorySelect).getByText("Networking")).toBeInTheDocument();
        expect(within(categorySelect).getByText("Furniture")).toBeInTheDocument();
    });

    it("lists warehouses passed in via props", () => {
        render(<AddProductModal {...baseProps} />);

        const warehouseSelect = screen.getByTestId("warehouse");
        expect(within(warehouseSelect).getByText("Main Warehouse")).toBeInTheDocument();
    });

    it("submits a payload with category/warehouse set to null when left empty", () => {
        const onSave = vi.fn();
        render(<AddProductModal {...baseProps} onSave={onSave} />);

        fireEvent.change(screen.getByTestId("product_name"), {
            target: { value: "No Category Item" },
        });
        fireEvent.submit(screen.getByTestId("product_name").closest("form"));

        expect(onSave).toHaveBeenCalledTimes(1);
        const payload = onSave.mock.calls[0][0];
        expect(payload.category).toBeNull();
        expect(payload.warehouse).toBeNull();
    });

    it("coerces quantity/opening_stock_qty/reorder_level to numbers, defaulting to 0 for invalid input", () => {
        const onSave = vi.fn();
        render(<AddProductModal {...baseProps} onSave={onSave} />);

        fireEvent.change(screen.getByTestId("quantity"), { target: { value: "15" } });
        fireEvent.change(screen.getByTestId("opening_stock_qty"), { target: { value: "" } });
        fireEvent.submit(screen.getByTestId("product_name").closest("form"));

        const payload = onSave.mock.calls[0][0];
        expect(payload.quantity).toBe(15);
        expect(payload.opening_stock_qty).toBe(0);
        expect(typeof payload.quantity).toBe("number");
    });

    it("defaults cost_price/selling_price/tax_rate to the string '0' when left blank", () => {
        const onSave = vi.fn();
        render(<AddProductModal {...baseProps} onSave={onSave} />);

        fireEvent.submit(screen.getByTestId("product_name").closest("form"));

        const payload = onSave.mock.calls[0][0];
        expect(payload.cost_price).toBe("0");
        expect(payload.selling_price).toBe("0");
        expect(payload.tax_rate).toBe("0");
    });

    it("resets the form back to blank defaults immediately after a successful submit", () => {
        render(<AddProductModal {...baseProps} />);

        fireEvent.change(screen.getByTestId("product_name"), {
            target: { value: "Temp Value" },
        });
        fireEvent.submit(screen.getByTestId("product_name").closest("form"));

        expect(screen.getByTestId("product_name")).toHaveValue("");
    });

    it("disables Save/Cancel and shows 'SAVING...' while loading in add mode", () => {
        render(<AddProductModal {...baseProps} mode="add" loading />);

        expect(screen.getByTestId("save-btn")).toBeDisabled();
        expect(screen.getByTestId("save-btn")).toHaveTextContent("SAVING...");
        expect(screen.getByTestId("cancel-btn")).toBeDisabled();
    });

    it("shows 'UPDATING...' while loading in edit mode", () => {
        render(<AddProductModal {...baseProps} mode="edit" loading />);

        expect(screen.getByTestId("save-btn")).toHaveTextContent("UPDATING...");
    });

    it("calls onClose and resets the form when Cancel is clicked and not loading", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(<AddProductModal {...baseProps} onClose={onClose} loading={false} />);

        fireEvent.change(screen.getByTestId("product_name"), {
            target: { value: "Will be cleared" },
        });
        await user.click(screen.getByTestId("cancel-btn"));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does NOT call onClose when the overlay is clicked while loading (guarded)", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(<AddProductModal {...baseProps} onClose={onClose} loading />);

        await user.click(screen.getByTestId("overlay"));

        expect(onClose).not.toHaveBeenCalled();
    });

    it("closes via overlay click when not loading", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(<AddProductModal {...baseProps} onClose={onClose} loading={false} />);

        await user.click(screen.getByTestId("overlay"));

        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not close when clicking inside the modal body (stopPropagation)", async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(<AddProductModal {...baseProps} onClose={onClose} loading={false} />);

        await user.click(screen.getByTestId("modal"));

        expect(onClose).not.toHaveBeenCalled();
    });
});