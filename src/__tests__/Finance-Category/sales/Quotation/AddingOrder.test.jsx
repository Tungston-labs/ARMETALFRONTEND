
import React from "react";
import { describe, it, expect, vi } from "vitest";
import {
    render,
    screen,
    fireEvent,
    within,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import AddingOrder from "./AddQuotation";

vi.mock("../../../../../Components/ReusableTable/ReusableHeader", () => ({
    default: ({ title, breadcrumbs }) => (
        <div>
            <h1>{title}</h1>
            <div>{breadcrumbs?.join(" / ")}</div>
        </div>
    ),
}));

const renderQuotationForm = (props = {}) => {
    return render(
        <MemoryRouter initialEntries={["/sales/quotations"]}>
            <Routes>
                <Route
                    path="/sales/quotations"
                    element={
                        <AddingOrder
                            mode="quotation"
                            {...props}
                        />
                    }
                />
            </Routes>
        </MemoryRouter>
    );
};

describe("AddingOrder - quotation mode", () => {
    it("should render the quotation form", () => {
        renderQuotationForm();

        expect(
            screen.getByText("Generate New Quotation")
        ).toBeInTheDocument();

        expect(
            screen.getByText("QUOTATION ITEMS")
        ).toBeInTheDocument();

        expect(
            screen.getByText("PREVIEW")
        ).toBeInTheDocument();

        expect(
            screen.getByText("CANCEL")
        ).toBeInTheDocument();
    });

    it("should display quotation fields", () => {
        renderQuotationForm();

        expect(screen.getByPlaceholderText("INV001")).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText(
                "TUNGSTON LABS"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText(
                "Company/Client Address"
            )
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText(
                "Company/Client Phone Number"
            )
        ).toBeInTheDocument();
    });

    it("should render the default quotation item", () => {
        renderQuotationForm();

        expect(screen.getByText("01")).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText("App Design")
        ).toBeInTheDocument();

        expect(
            screen.getByPlaceholderText("Wireframe Of 15 Pages")
        ).toBeInTheDocument();
    });

    it("should add a new quotation item", () => {
        renderQuotationForm();

        fireEvent.click(
            screen.getByRole("button", {
                name: /add item/i,
            })
        );

        expect(screen.getByText("02")).toBeInTheDocument();

        expect(
            screen.getAllByPlaceholderText("App Design")
        ).toHaveLength(2);
    });

    it("should remove a quotation item", () => {
        renderQuotationForm();

        fireEvent.click(
            screen.getByRole("button", {
                name: /add item/i,
            })
        );

        expect(screen.getByText("02")).toBeInTheDocument();

        const deleteButtons = screen.getAllByRole("button");
        const deleteButton = deleteButtons.find(
            (button) => button.querySelector("svg")
                && button.textContent.trim() === ""
                && button.closest("td")
        );

        expect(deleteButton).toBeTruthy();

        fireEvent.click(deleteButton);

        expect(screen.queryByText("02")).not.toBeInTheDocument();
    });

    it("should update quotation number", () => {
        renderQuotationForm();

        const quotationNumber = screen.getByPlaceholderText("INV001");

        fireEvent.change(quotationNumber, {
            target: { value: "QT-2026-001" },
        });

        expect(quotationNumber).toHaveValue("QT-2026-001");
    });

    it("should update quotation item fields", () => {
        renderQuotationForm();

        const service = screen.getByPlaceholderText("App Design");

        const description = screen.getByPlaceholderText(
            "Wireframe Of 15 Pages"
        );

        fireEvent.change(service, {
            target: { value: "Website Development" },
        });

        fireEvent.change(description, {
            target: { value: "Company website design" },
        });

        expect(service).toHaveValue("Website Development");
        expect(description).toHaveValue("Company website design");
    });

    it("should update the quotation status", () => {
        renderQuotationForm();

        const statusSelect = screen.getAllByRole("combobox")[0];

        fireEvent.change(statusSelect, {
            target: { value: "Approved" },
        });

        expect(statusSelect).toHaveValue("Approved");
    });

    it("should call onPreview with quotation form data", () => {
        const onPreview = vi.fn();

        renderQuotationForm({ onPreview });

        fireEvent.change(
            screen.getByPlaceholderText("INV001"),
            {
                target: { value: "QT-2026-001" },
            }
        );

        fireEvent.change(
            screen.getByPlaceholderText("App Design"),
            {
                target: { value: "Website Development" },
            }
        );

        fireEvent.change(
            screen.getByPlaceholderText("Wireframe Of 15 Pages"),
            {
                target: { value: "Website UI and development" },
            }
        );

        fireEvent.change(
            screen.getByRole("combobox", { name: "" }),
            {
                target: { value: "client1" },
            }
        );

        fireEvent.click(
            screen.getByRole("button", {
                name: "PREVIEW",
            })
        );

        expect(onPreview).toHaveBeenCalledTimes(1);

        const payload = onPreview.mock.calls[0][0];

        expect(payload.orderNumber).toBe("QT-2026-001");
        expect(payload.billTo.client).toBe("client1");
        expect(payload.items[0].service).toBe("Website Development");
        expect(payload.items[0].particular).toBe(
            "Website UI and development"
        );
    });

    it("should call onCancel when cancel is clicked", () => {
        const onCancel = vi.fn();

        renderQuotationForm({ onCancel });

        fireEvent.click(
            screen.getByRole("button", {
                name: "CANCEL",
            })
        );

        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it("should display the quotation notes", () => {
        renderQuotationForm();

        expect(
            screen.getByText(/only an estimate of services/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(/please confirm your acceptance/i)
        ).toBeInTheDocument();
    });

    it("should display quotation summary values", () => {
        renderQuotationForm();

        expect(screen.getByText("Sub Total")).toBeInTheDocument();
        expect(screen.getByText("Discount")).toBeInTheDocument();
        expect(screen.getByText("TOTAL AMOUNT")).toBeInTheDocument();
    });
});
