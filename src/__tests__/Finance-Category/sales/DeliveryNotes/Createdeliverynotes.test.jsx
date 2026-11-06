import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  navigate: vi.fn(),
  params: {},
  location: { state: null },
  state: {
    customer: {
      customers: [
        {
          id: 1,
          name: "ABC Trading",
          address: "Riyadh",
          phone: "123456789",
          email: "abc@example.com",
        },
      ],
    },
    product: {
      products: [{ id: 101, name: "Laptop", product_name: "Laptop" }],
    },
    deliveryNotes: {
      selectedDeliveryNote: null,
      detailsLoading: false,
      submitting: false,
      submitError: null,
    },
  },
  fetchDeliveryNoteById: vi.fn((id) => ({
    type: "deliveryNotes/fetchById",
    payload: id,
  })),
  addDeliveryNote: vi.fn((payload) => ({
    type: "deliveryNotes/add",
    payload,
  })),
  editDeliveryNote: vi.fn((payload) => ({
    type: "deliveryNotes/edit",
    payload,
  })),
  getCustomerList: vi.fn(() => ({ type: "customers/fetch" })),
  getProducts: vi.fn((payload) => ({
    type: "products/fetch",
    payload,
  })),
}));

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: (selector) => selector(mocks.state),
}));

vi.mock("react-router-dom", () => ({
  useParams: () => mocks.params,
  useNavigate: () => mocks.navigate,
  useLocation: () => mocks.location,
}));

vi.mock("../../../../../Components/ReusableTable/ReusableHeader", () => ({
  default: ({ title, onBack }) => (
    <div>
      <h1>{title}</h1>
      <button onClick={onBack}>Back</button>
    </div>
  ),
}));

vi.mock("../../../../../Redux/finance/Sales/deliveryNotesSlice", () => ({
  fetchDeliveryNoteById: mocks.fetchDeliveryNoteById,
  addDeliveryNote: mocks.addDeliveryNote,
  editDeliveryNote: mocks.editDeliveryNote,
}));

vi.mock("../../../../../Redux/finance/Sales/CustomerSlice", () => ({
  getCustomers: mocks.getCustomerList,
}));

vi.mock("../../../../../Redux/finance/Product/ProductSlice", () => ({
  getProducts: mocks.getProducts,
}));

import Createdeliverynotes from "./Createdeliverynotes";

describe("Createdeliverynotes", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.params = {};
    mocks.location = { state: null };

    mocks.state = {
      customer: {
        customers: [
          {
            id: 1,
            name: "ABC Trading",
            address: "Riyadh",
            phone: "123456789",
            email: "abc@example.com",
          },
        ],
      },
      product: {
        products: [{ id: 101, name: "Laptop", product_name: "Laptop" }],
      },
      deliveryNotes: {
        selectedDeliveryNote: null,
        detailsLoading: false,
        submitting: false,
        submitError: null,
      },
    };

    mocks.dispatch.mockImplementation((action) => {
      if (
        action?.type === "deliveryNotes/add" ||
        action?.type === "deliveryNotes/edit"
      ) {
        return {
          unwrap: () => Promise.resolve({ success: true }),
        };
      }

      return action;
    });
  });

  it("renders the delivery note form", () => {
    render(<Createdeliverynotes />);

    expect(
      screen.getByRole("heading", { name: "Generate Delivery Notes" }),
    ).toBeInTheDocument();

    expect(screen.getByText("DELIVERY NOTE NUMBER")).toBeInTheDocument();
    expect(screen.getByText("SALES ORDER REFERENCE")).toBeInTheDocument();
    expect(screen.getByText("DELIVERY STATUS")).toBeInTheDocument();
    expect(screen.getByText("BILL TO")).toBeInTheDocument();
    expect(screen.getByText("INVOICE ITEMS")).toBeInTheDocument();
  });

  it("fetches customers and products on mount", () => {
    render(<Createdeliverynotes />);

    expect(mocks.getCustomerList).toHaveBeenCalled();
    expect(mocks.getProducts).toHaveBeenCalledWith({ page_size: 200 });
  });

  it("updates the delivery note number", () => {
    render(<Createdeliverynotes />);

    const input = screen.getByPlaceholderText("DN 0123");

    fireEvent.change(input, {
      target: { value: "DN-100" },
    });

    expect(input).toHaveValue("DN-100");
  });

  it("updates the sales order reference", () => {
    render(<Createdeliverynotes />);

    const input = screen.getByPlaceholderText("SO 0123 - Clicking");

    fireEvent.change(input, {
      target: { value: "SO-100" },
    });

    expect(input).toHaveValue("SO-100");
  });

  it("updates delivery status", () => {
    render(<Createdeliverynotes />);

    const selects = screen.getAllByRole("combobox");

    fireEvent.change(selects[0], {
      target: { value: "Fully Delivered" },
    });

    expect(selects[0]).toHaveValue("Fully Delivered");
    expect(screen.getByText("FULLY DELIVERED")).toBeInTheDocument();
  });

  it("selects a customer and populates its contact details", () => {
    render(<Createdeliverynotes />);

    const selects = screen.getAllByRole("combobox");

    // The first select is Delivery Status; the second is Bill To.
    fireEvent.change(selects[1], {
      target: { value: "1" },
    });

    expect(selects[1]).toHaveValue("1");
    expect(screen.getByPlaceholderText("Company/Client ADDRESS")).toHaveValue(
      "Riyadh",
    );
    expect(
      screen.getByPlaceholderText("Company/Client Phone Number"),
    ).toHaveValue("123456789");
    expect(screen.getByPlaceholderText("Company/Client Email ID")).toHaveValue(
      "abc@example.com",
    );
  });

  it("adds another delivery item", () => {
    render(<Createdeliverynotes />);

    expect(screen.getAllByPlaceholderText("Product / Product ID")).toHaveLength(
      1,
    );

    fireEvent.click(screen.getByRole("button", { name: /ADD ITEM/i }));

    expect(screen.getAllByPlaceholderText("Product / Product ID")).toHaveLength(
      2,
    );
  });

  it("updates a delivery item product", () => {
    render(<Createdeliverynotes />);

    const productInput = screen.getByPlaceholderText("Product / Product ID");

    fireEvent.change(productInput, {
      target: { value: "Laptop" },
    });

    expect(productInput).toHaveValue("Laptop");
  });

  it("updates the notes field", () => {
    render(<Createdeliverynotes />);

    const notes = screen.getByPlaceholderText(/Remaining packaging units/i);

    fireEvent.change(notes, {
      target: { value: "Deliver remaining units next week." },
    });

    expect(notes).toHaveValue("Deliver remaining units next week.");
  });

  it("shows validation when customer is not selected", () => {
    render(<Createdeliverynotes />);

    fireEvent.click(screen.getByRole("button", { name: "PREVIEW" }));

    expect(
      screen.getByText("Please select a customer from BILL TO."),
    ).toBeInTheDocument();

    expect(mocks.addDeliveryNote).not.toHaveBeenCalled();
  });

  it("shows validation when the product is invalid", () => {
    render(<Createdeliverynotes />);

    const selects = screen.getAllByRole("combobox");

    fireEvent.change(selects[1], {
      target: { value: "1" },
    });

    fireEvent.click(screen.getByRole("button", { name: "PREVIEW" }));

    expect(
      screen.getByText(
        "Please enter a valid product id or select a valid product for every delivery item.",
      ),
    ).toBeInTheDocument();
  });

  it("passes the API payload to onPreview when the form is valid", () => {
    const onPreview = vi.fn();

    render(<Createdeliverynotes onPreview={onPreview} />);

    fireEvent.change(screen.getByPlaceholderText("DN 0123"), {
      target: { value: "DN-001" },
    });

    fireEvent.change(screen.getByPlaceholderText("SO 0123 - Clicking"), {
      target: { value: "SO-001" },
    });

    const selects = screen.getAllByRole("combobox");

    fireEvent.change(selects[1], {
      target: { value: "1" },
    });

    fireEvent.change(screen.getByPlaceholderText("Product / Product ID"), {
      target: { value: "Laptop" },
    });

    fireEvent.change(
      screen.getByPlaceholderText(
        "Remaining packaging units to be dispatched with next batch from Jeddah DC — awaiting stock replenishment.",
      ),
      {
        target: { value: "Test delivery note" },
      },
    );

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    fireEvent.click(screen.getByRole("button", { name: "PREVIEW" }));

    expect(onPreview).toHaveBeenCalledWith(
      expect.objectContaining({
        deliveryNoteNumber: "DN-001",
        salesOrderReference: "SO-001",
        deliveryStatus: "Partially",
        notes: "Test delivery note",
        apiPayload: expect.objectContaining({
          delivery_note_number: "DN-001",
          sales_order_reference: "SO-001",
          customer: 1,
          delivery_status: "partial",
          items: [
            expect.objectContaining({
              product: 101,
              status: "pending",
            }),
          ],
        }),
      }),
    );

    expect(mocks.addDeliveryNote).not.toHaveBeenCalled();

    logSpy.mockRestore();
  });

  it("dispatches create when no onPreview callback is provided", async () => {
    render(<Createdeliverynotes />);

    fireEvent.change(screen.getByPlaceholderText("DN 0123"), {
      target: { value: "DN-002" },
    });

    const selects = screen.getAllByRole("combobox");

    fireEvent.change(selects[1], {
      target: { value: "1" },
    });

    fireEvent.change(screen.getByPlaceholderText("Product / Product ID"), {
      target: { value: "Laptop" },
    });

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    fireEvent.click(screen.getByRole("button", { name: "PREVIEW" }));

    await waitFor(() => {
      expect(mocks.addDeliveryNote).toHaveBeenCalledWith(
        expect.objectContaining({
          delivery_note_number: "DN-002",
          customer: 1,
          delivery_status: "partial",
        }),
      );
    });

    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith("/delivery/notes");
    });

    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("calls onCancel when Cancel is clicked", () => {
    const onCancel = vi.fn();

    render(<Createdeliverynotes onCancel={onCancel} />);

    fireEvent.click(screen.getByRole("button", { name: "CANCEL" }));

    expect(onCancel).toHaveBeenCalled();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it("navigates to the delivery notes list when Cancel has no callback", () => {
    render(<Createdeliverynotes />);

    fireEvent.click(screen.getByRole("button", { name: "CANCEL" }));

    expect(mocks.navigate).toHaveBeenCalledWith("/delivery/notes");
  });

  it("shows the edit title and fetches an existing delivery note", () => {
    mocks.params = { id: "25" };

    render(<Createdeliverynotes />);

    expect(
      screen.getByRole("heading", { name: "Edit Delivery Notes" }),
    ).toBeInTheDocument();

    expect(mocks.fetchDeliveryNoteById).toHaveBeenCalledWith("25");
  });

  it("shows the edit loading state", () => {
    mocks.params = { id: "25" };
    mocks.state.deliveryNotes.detailsLoading = true;

    render(<Createdeliverynotes />);

    expect(screen.getByText("Loading delivery note...")).toBeInTheDocument();
  });

  it("shows backend validation errors", () => {
    mocks.state.deliveryNotes.submitError = {
      delivery_date: ["Invalid date"],
    };

    render(<Createdeliverynotes />);

    expect(screen.getByText("delivery_date: Invalid date")).toBeInTheDocument();
  });
});
