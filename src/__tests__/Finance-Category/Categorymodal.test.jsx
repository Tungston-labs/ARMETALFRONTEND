import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import CategoryModal from "../../Pages/FinanceModule/PRODUCTS/Categories/modal/CategoryModal";

/**
 * NOTE ON STYLED COMPONENTS
 * CategoryModal imports several styled-components (ModalOverlay, Input, Select, ...)
 * from "./CategoryModal.styles". These render as plain DOM elements with the
 * behavior/markup styled-components produces, so no additional mocking is required
 * for these tests to work — RTL queries by role/label/placeholder/text.
 */

const existingCategories = [
    { id: 1, code: "ELEC", category_name: "Electronics" },
    { id: 2, code: "FOOD", category_name: "Groceries" },
];

const parentCategories = [
    { id: 1, category_name: "Electronics" },
    { id: 2, category_name: "Groceries" },
    { id: 3, category_name: "Home Appliances" },
];

const setup = (overrides = {}) => {
    const onSave = jest.fn().mockResolvedValue(undefined);
    const onClose = jest.fn();

    const utils = render(
        <CategoryModal
            isOpen={true}
            onClose={onClose}
            onSave={onSave}
            categories={existingCategories}
            parentCategories={parentCategories}
            {...overrides}
        />
    );

    return { onSave, onClose, ...utils };
};

// Helper getters (component doesn't use <label htmlFor>, so we query by placeholder/text)
const getCodeInput = () => screen.getByPlaceholderText("1253698");
const getNameInput = () => screen.getByPlaceholderText("Enter name");
const getParentInput = () => screen.getByPlaceholderText("Select Parent Category");
const getCategoryTypeSelect = () => screen.getByDisplayValue("Product/Service");
const getStatusSelect = () => screen.getByDisplayValue("Active/Inactive");
// Matches both "SAVE CATEGORY" (idle) and "SAVING..." (in-flight) button text
const getSaveButton = () => screen.getByRole("button", { name: /save category|saving/i });
const getCancelButton = () => screen.getByRole("button", { name: /cancel/i });

describe("CategoryModal", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("visibility", () => {
        it("renders nothing when isOpen is false", () => {
            const { container } = render(
                <CategoryModal
                    isOpen={false}
                    onClose={jest.fn()}
                    onSave={jest.fn()}
                    categories={existingCategories}
                    parentCategories={parentCategories}
                />
            );
            expect(container).toBeEmptyDOMElement();
        });

        it("renders the form when isOpen is true", () => {
            setup();
            expect(screen.getByText(/add new category/i)).toBeInTheDocument();
            expect(getCodeInput()).toBeInTheDocument();
            expect(getNameInput()).toBeInTheDocument();
        });

        it("resets form fields every time the modal is (re)opened", () => {
            const { rerender } = render(
                <CategoryModal
                    isOpen={true}
                    onClose={jest.fn()}
                    onSave={jest.fn()}
                    categories={existingCategories}
                    parentCategories={parentCategories}
                />
            );

            fireEvent.change(getCodeInput(), { target: { value: "NEW1" } });
            expect(getCodeInput()).toHaveValue("NEW1");

            // Close then reopen
            rerender(
                <CategoryModal
                    isOpen={false}
                    onClose={jest.fn()}
                    onSave={jest.fn()}
                    categories={existingCategories}
                    parentCategories={parentCategories}
                />
            );
            rerender(
                <CategoryModal
                    isOpen={true}
                    onClose={jest.fn()}
                    onSave={jest.fn()}
                    categories={existingCategories}
                    parentCategories={parentCategories}
                />
            );

            expect(getCodeInput()).toHaveValue("");
        });
    });

    describe("validation", () => {
        it("shows required errors when submitting an empty form", async () => {
            setup();
            fireEvent.click(getSaveButton());

            expect(await screen.findByText(/category code is required/i)).toBeInTheDocument();
            expect(screen.getByText(/category name is required/i)).toBeInTheDocument();
            expect(screen.getByText(/please select a category type/i)).toBeInTheDocument();
            expect(screen.getByText(/please select a status/i)).toBeInTheDocument();
        });

        it("rejects a code that fails the pattern (bad characters / too short)", async () => {
            setup();
            fireEvent.change(getCodeInput(), { target: { value: "!" } });
            fireEvent.click(getSaveButton());

            expect(
                await screen.findByText(/2–20 characters \(letters, numbers, # or - only\)/i)
            ).toBeInTheDocument();
        });

        it("rejects a code that is already in use (case-insensitive)", async () => {
            setup();
            fireEvent.change(getCodeInput(), { target: { value: "elec" } });
            fireEvent.change(getNameInput(), { target: { value: "Brand New Name" } });
            fireEvent.click(getSaveButton());

            expect(await screen.findByText(/this code is already in use/i)).toBeInTheDocument();
        });

        it("rejects a category name shorter than 2 characters", async () => {
            setup();
            fireEvent.change(getCodeInput(), { target: { value: "NEWX" } });
            fireEvent.change(getNameInput(), { target: { value: "A" } });
            fireEvent.click(getSaveButton());

            expect(
                await screen.findByText(/category name must be at least 2 characters/i)
            ).toBeInTheDocument();
        });

        it("rejects a category name that already exists (case-insensitive)", async () => {
            setup();
            fireEvent.change(getCodeInput(), { target: { value: "NEWX" } });
            fireEvent.change(getNameInput(), { target: { value: "electronics" } });
            fireEvent.click(getSaveButton());

            expect(
                await screen.findByText(/a category with this name already exists/i)
            ).toBeInTheDocument();
        });

        it("errors when parent search text was typed but no option was selected (no match)", async () => {
            setup();
            fireEvent.change(getCodeInput(), { target: { value: "NEWX" } });
            fireEvent.change(getNameInput(), { target: { value: "Brand New" } });
            fireEvent.change(getParentInput(), { target: { value: "Nonexistent Parent" } });
            fireEvent.click(getSaveButton());

            expect(
                await screen.findByText(/no matching category — clear this field or pick one/i)
            ).toBeInTheDocument();
        });

        it("errors when typed text exactly matches an option but it wasn't clicked/selected", async () => {
            setup();
            fireEvent.change(getCodeInput(), { target: { value: "NEWX" } });
            fireEvent.change(getNameInput(), { target: { value: "Brand New" } });
            fireEvent.change(getParentInput(), { target: { value: "Electronics" } });
            fireEvent.click(getSaveButton());

            expect(
                await screen.findByText(/please select the matching category from the list/i)
            ).toBeInTheDocument();
        });

        it("clears a field's error as soon as the user edits that field", async () => {
            setup();
            fireEvent.click(getSaveButton());
            expect(await screen.findByText(/category code is required/i)).toBeInTheDocument();

            fireEvent.change(getCodeInput(), { target: { value: "NEWX" } });

            await waitFor(() => {
                expect(screen.queryByText(/category code is required/i)).not.toBeInTheDocument();
            });
        });
    });

    describe("parent category combobox", () => {
        it("filters the dropdown options as the user types", async () => {
            const user = userEvent.setup();
            setup();

            await user.click(getParentInput());
            await user.type(getParentInput(), "Elec");

            expect(screen.getByText("Electronics")).toBeInTheDocument();
            expect(screen.queryByText("Groceries")).not.toBeInTheDocument();
            expect(screen.queryByText("Home Appliances")).not.toBeInTheDocument();
        });

        it("shows a 'no existing category found' message when nothing matches", async () => {
            const user = userEvent.setup();
            setup();

            await user.click(getParentInput());
            await user.type(getParentInput(), "zzz-no-match");

            expect(screen.getByText(/no existing category found/i)).toBeInTheDocument();
        });

        it("selecting an option fills the input and stores the parent id", async () => {
            const user = userEvent.setup();
            setup();

            await user.click(getParentInput());
            await user.click(screen.getByText("Home Appliances"));

            expect(getParentInput()).toHaveValue("Home Appliances");
            // dropdown should close after selection
            expect(screen.queryByText("Electronics")).not.toBeInTheDocument();
        });

        it("re-typing after a selection clears the previously selected parent id", async () => {
            const user = userEvent.setup();
            setup();

            await user.click(getParentInput());
            await user.click(screen.getByText("Home Appliances"));
            expect(getParentInput()).toHaveValue("Home Appliances");

            await user.clear(getParentInput());
            await user.type(getParentInput(), "Home Applianc");

            // Selection was cleared, so submitting now with exact-ish partial text should
            // fall into the "no match" (not exact) validation branch on submit.
            fireEvent.change(getCodeInput(), { target: { value: "NEWX" } });
            fireEvent.change(getNameInput(), { target: { value: "Brand New" } });
            fireEvent.click(getSaveButton());

            expect(
                await screen.findByText(/no matching category — clear this field or pick one/i)
            ).toBeInTheDocument();
        });

        it("closes the dropdown when clicking outside the combobox", async () => {
            const user = userEvent.setup();
            setup();

            await user.click(getParentInput());
            expect(screen.getByText("Electronics")).toBeInTheDocument();

            await user.click(document.body);

            await waitFor(() => {
                expect(screen.queryByText("Electronics")).not.toBeInTheDocument();
            });
        });
    });

    describe("submit flow", () => {
        const fillValidForm = async (user) => {
            await user.type(getCodeInput(), "NEWX");
            await user.type(getNameInput(), "Brand New Category");
            await user.selectOptions(getCategoryTypeSelect(), "product");
            await user.selectOptions(getStatusSelect(), "active");
        };

        it("calls onSave with correctly mapped backend field names, parent omitted", async () => {
            const user = userEvent.setup();
            const { onSave } = setup();

            await fillValidForm(user);
            await user.click(getSaveButton());

            await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
            expect(onSave).toHaveBeenCalledWith({
                code: "NEWX",
                category_name: "Brand New Category",
                parent_category: "",
                category_type: "product",
                status: "active",
            });
        });

        it("includes the selected parent category id when one was chosen", async () => {
            const user = userEvent.setup();
            const { onSave } = setup();

            await fillValidForm(user);
            await user.click(getParentInput());
            await user.click(screen.getByText("Groceries"));
            await user.click(getSaveButton());

            await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
            expect(onSave.mock.calls[0][0]).toMatchObject({
                parent_category: 2,
            });
        });

        it("does not call onSave when validation fails", async () => {
            const { onSave } = setup();
            fireEvent.click(getSaveButton());

            await screen.findByText(/category code is required/i);
            expect(onSave).not.toHaveBeenCalled();
        });

        it("disables buttons and shows 'SAVING...' while the save is in flight", async () => {
            const user = userEvent.setup();
            let resolveSave;
            const onSave = jest.fn(
                () => new Promise((resolve) => { resolveSave = resolve; })
            );

            render(
                <CategoryModal
                    isOpen={true}
                    onClose={jest.fn()}
                    onSave={onSave}
                    categories={existingCategories}
                    parentCategories={parentCategories}
                />
            );

            await user.type(getCodeInput(), "NEWX");
            await user.type(getNameInput(), "Brand New Category");
            await user.selectOptions(getCategoryTypeSelect(), "product");
            await user.selectOptions(getStatusSelect(), "active");
            await user.click(getSaveButton());

            expect(await screen.findByText(/saving\.\.\./i)).toBeInTheDocument();
            expect(getSaveButton()).toBeDisabled();
            expect(getCancelButton()).toBeDisabled();

            resolveSave();

            await waitFor(() => {
                expect(screen.queryByText(/saving\.\.\./i)).not.toBeInTheDocument();
            });
        });

        it("re-enables the save button and shows an error message if onSave rejects", async () => {
            const user = userEvent.setup();
            const onSave = jest.fn().mockRejectedValue(new Error("network error"));

            render(
                <CategoryModal
                    isOpen={true}
                    onClose={jest.fn()}
                    onSave={onSave}
                    categories={existingCategories}
                    parentCategories={parentCategories}
                />
            );

            await user.type(getCodeInput(), "NEWX");
            await user.type(getNameInput(), "Brand New Category");
            await user.selectOptions(getCategoryTypeSelect(), "product");
            await user.selectOptions(getStatusSelect(), "active");

            await user.click(getSaveButton());

            expect(await screen.findByText(/network error/i)).toBeInTheDocument();
            expect(getSaveButton()).not.toBeDisabled();
        });
    });

    describe("cancel", () => {
        it("calls onClose when Cancel is clicked", async () => {
            const user = userEvent.setup();
            const { onClose } = setup();

            await user.click(getCancelButton());
            expect(onClose).toHaveBeenCalledTimes(1);
        });
    });
});