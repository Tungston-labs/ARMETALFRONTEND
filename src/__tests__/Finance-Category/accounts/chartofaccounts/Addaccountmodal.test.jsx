import React from "react";
import { render, screen, fireEvent, within, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

// ---- PATHS ----
// Place this file 3 levels below src (same folder as ChartOfAccounts.test.jsx).
// Replace the placeholder "FinanceModule/ACCOUNTS/Chart of Accounts" the same way:
//   sed -i 's#FinanceModule/ACCOUNTS/Chart of Accounts#FinanceModule/ACCOUNTING/Chart-Of-Accounts#g' AddAccountModal.test.jsx
import AddAccountModal from "../../../../Pages/FinanceModule/ACCOUNTS/Chart of Accounts/modal/AddAccountModal";

import { useDispatch, useSelector } from "react-redux";
import {
    addAccount,
    editAccount,
    clearAccountError,
} from "../../../../Redux/finance/accounts/Accountingslice";

// ---- react-redux ----
vi.mock("react-redux", () => ({
    useDispatch: vi.fn(),
    useSelector: vi.fn(),
}));

// ---- Redux slice (actions are plain marker objects) ----
vi.mock("../../../../Redux/finance/accounts/Accountingslice", () => ({
    addAccount: vi.fn((payload) => ({ type: "addAccount", payload })),
    editAccount: vi.fn((arg) => ({ type: "editAccount", arg })),
    clearAccountError: vi.fn(() => ({ type: "clearAccountError" })),
}));

// ---- Styled-component mocks ----
vi.mock("../../../../Pages/FinanceModule/ACCOUNTS/Chart of Accounts/modal/AddAccountModal.styles", () => ({
    ModalOverlay: ({ children, onClick }) => (
        <div data-testid="overlay" onClick={onClick}>
            {children}
        </div>
    ),
    ModalContainer: ({ children, onClick }) => (
        <div data-testid="container" onClick={onClick}>
            {children}
        </div>
    ),
    Form: ({ children, onSubmit }) => (
        <form data-testid="account-form" onSubmit={onSubmit}>
            {children}
        </form>
    ),
    SectionTitle: ({ children }) => <h2>{children}</h2>,
    SectionDescription: ({ children }) => <p>{children}</p>,
    FormGrid: ({ children }) => <div>{children}</div>,
    FormGroup: ({ children }) => <div>{children}</div>,
    Label: ({ children }) => <label>{children}</label>,
    Input: (props) => <input {...props} />,
    Select: ({ children, ...props }) => <select {...props}>{children}</select>,
    ButtonGroup: ({ children }) => <div>{children}</div>,
    CancelButton: ({ children, ...props }) => <button {...props}>{children}</button>,
    SaveButton: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

// ---- Fixtures ----

const sections = {
    asset: [
        { id: 10, account_code: "1001", account_name: "Cash" },
        { id: 11, account_code: "1002", account_name: "Bank" },
    ],
    liability: [{ id: 20, account_code: "2001", account_name: "Payables" }],
    equity: [],
    revenue: [],
    expense: [],
};

const editingAccount = {
    id: 11,
    account_type: "asset",
    account_name: "Bank",
    account_code: "1002",
    parent_account: { id: 10 },
    category: "current_asset",
    opening_balance: "500.00",
    opening_balance_type: "debit",
    status: "active",
    description: "Main bank",
};

// ---- Helpers ----

const field = (name) => document.querySelector(`[name="${name}"]`);
const optionLabels = (name) =>
    within(field(name))
        .getAllByRole("option")
        .map((o) => o.textContent);
const change = (name, value) => fireEvent.change(field(name), { target: { value } });
const submitForm = () => fireEvent.submit(screen.getByTestId("account-form"));

describe("AddAccountModal", () => {
    let dispatchMock;
    let unwrapImpl;
    let onClose;

    const renderModal = (props = {}) =>
        render(<AddAccountModal isOpen onClose={onClose} {...props} />);

    beforeEach(() => {
        vi.clearAllMocks();

        onClose = vi.fn();
        unwrapImpl = () => Promise.resolve({});
        dispatchMock = vi.fn((action) => ({ unwrap: () => unwrapImpl(action) }));
        vi.mocked(useDispatch).mockReturnValue(dispatchMock);

        const state = { accounting: { sections } };
        vi.mocked(useSelector).mockImplementation((selector) => selector(state));
    });

    // ---- Visibility ----

    it("renders nothing when closed", () => {
        const { container } = render(<AddAccountModal isOpen={false} onClose={onClose} />);

        expect(container).toBeEmptyDOMElement();
    });

    // ---- Add mode ----

    describe("add mode", () => {
        it("shows the add title, description and save button", () => {
            renderModal();

            expect(screen.getByText("Add New Account")).toBeInTheDocument();
            expect(screen.getByText(/Record essential journal information/)).toBeInTheDocument();
            expect(screen.getByText("SAVE ACCOUNT")).toBeInTheDocument();
        });

        it("starts with the default empty form", () => {
            renderModal();

            expect(field("account_type").value).toBe("asset");
            expect(field("account_name").value).toBe("");
            expect(field("account_code").value).toBe("");
            expect(field("parent_account").value).toBe("");
            expect(field("category").value).toBe("current_asset");
            expect(field("opening_balance").value).toBe("0.00");
            expect(field("opening_balance_type").value).toBe("debit");
            expect(field("status").value).toBe("active");
            expect(field("description").value).toBe("");
        });

        it("offers the five account types", () => {
            renderModal();

            expect(optionLabels("account_type")).toEqual([
                "ASSET",
                "LIABILITY",
                "EQUITY",
                "INCOME",
                "EXPENSE",
            ]);
        });

        it("offers the asset categories by default", () => {
            renderModal();

            expect(optionLabels("category")).toEqual(["CURRENT ASSETS", "NON-CURRENT ASSETS"]);
        });

        it("offers NONE plus existing accounts of the chosen type as parents", () => {
            renderModal();

            expect(optionLabels("parent_account")).toEqual([
                "NONE",
                "1001 - Cash",
                "1002 - Bank",
            ]);
        });

        it("offers only NONE as parent when the store has no sections", () => {
            vi.mocked(useSelector).mockImplementation((selector) =>
                selector({ accounting: {} })
            );
            renderModal();

            expect(optionLabels("parent_account")).toEqual(["NONE"]);
        });

        it("updates fields as the user types", () => {
            renderModal();

            change("account_name", "Petty Cash");
            change("account_code", "1005");
            change("description", "Small expenses");
            change("status", "inactive");

            expect(field("account_name").value).toBe("Petty Cash");
            expect(field("account_code").value).toBe("1005");
            expect(field("description").value).toBe("Small expenses");
            expect(field("status").value).toBe("inactive");
        });
    });

    // ---- Account type change ----

    describe("changing the account type", () => {
        it.each([
            ["liability", "current_liability", "credit"],
            ["equity", "equity", "credit"],
            ["revenue", "operating_revenue", "credit"],
            ["expense", "cost_of_goods_sold", "debit"],
            ["asset", "current_asset", "debit"],
        ])("%s -> category '%s' and balance type '%s'", (type, category, balanceType) => {
            renderModal();

            // move away from the default first so 'asset' is a real change too
            change("account_type", type === "asset" ? "liability" : type);
            if (type === "asset") change("account_type", "asset");

            expect(field("account_type").value).toBe(type);
            expect(field("category").value).toBe(category);
            expect(field("opening_balance_type").value).toBe(balanceType);
        });

        it("resets the parent account", () => {
            renderModal();

            change("parent_account", "10");
            expect(field("parent_account").value).toBe("10");

            change("account_type", "liability");

            expect(field("parent_account").value).toBe("");
        });

        it("updates the parent options to accounts of the new type", () => {
            renderModal();

            change("account_type", "liability");

            expect(optionLabels("parent_account")).toEqual(["NONE", "2001 - Payables"]);
        });

        it("updates the category options to the new type's categories", () => {
            renderModal();

            change("account_type", "expense");

            expect(optionLabels("category")).toEqual([
                "COST OF GOODS SOLD",
                "OPERATING EXPENSE",
                "OTHER EXPENSE",
            ]);
        });

        it("keeps other entered values (name, code)", () => {
            renderModal();

            change("account_name", "Petty Cash");
            change("account_code", "1005");
            change("account_type", "liability");

            expect(field("account_name").value).toBe("Petty Cash");
            expect(field("account_code").value).toBe("1005");
        });
    });

    // ---- Edit mode ----

    describe("edit mode", () => {
        it("shows the edit title, description and update button", () => {
            renderModal({ account: editingAccount });

            expect(screen.getByText("Edit Account")).toBeInTheDocument();
            expect(screen.getByText(/Update the account details below/)).toBeInTheDocument();
            expect(screen.getByText("UPDATE ACCOUNT")).toBeInTheDocument();
        });

        it("prefills the form from the account", () => {
            renderModal({ account: editingAccount });

            expect(field("account_type").value).toBe("asset");
            expect(field("account_name").value).toBe("Bank");
            expect(field("account_code").value).toBe("1002");
            expect(field("parent_account").value).toBe("10"); // object parent -> id
            expect(field("category").value).toBe("current_asset");
            expect(field("opening_balance").value).toBe("500.00");
            expect(field("opening_balance_type").value).toBe("debit");
            expect(field("status").value).toBe("active");
            expect(field("description").value).toBe("Main bank");
        });

        it("accepts a plain id as the parent account", () => {
            renderModal({ account: { ...editingAccount, parent_account: 10 } });

            expect(field("parent_account").value).toBe("10");
        });

        it("uses an empty parent when the account has none", () => {
            renderModal({ account: { ...editingAccount, parent_account: null } });

            expect(field("parent_account").value).toBe("");
        });

        it("defaults missing optional fields", () => {
            renderModal({
                account: {
                    id: 11,
                    account_type: "asset",
                    category: "current_asset",
                    opening_balance: null,
                },
            });

            expect(field("account_name").value).toBe("");
            expect(field("account_code").value).toBe("");
            expect(field("opening_balance").value).toBe("0.00");
            expect(field("opening_balance_type").value).toBe("debit");
            expect(field("status").value).toBe("active");
            expect(field("description").value).toBe("");
        });

        it("excludes the account itself from the parent options", () => {
            renderModal({ account: editingAccount });

            expect(optionLabels("parent_account")).toEqual(["NONE", "1001 - Cash"]);
        });

        it("adds an unknown saved category to the options so it is kept", () => {
            renderModal({ account: { ...editingAccount, category: "custom_cat" } });

            expect(optionLabels("category")).toEqual([
                "CURRENT ASSETS",
                "NON-CURRENT ASSETS",
                "CUSTOM CAT",
            ]);
            expect(field("category").value).toBe("custom_cat");
        });
    });

    // ---- Reset on reopen ----

    it("resets the form when the modal is closed and reopened", () => {
        const { rerender } = renderModal();

        change("account_name", "Temp");
        expect(field("account_name").value).toBe("Temp");

        rerender(<AddAccountModal isOpen={false} onClose={onClose} />);
        rerender(<AddAccountModal isOpen onClose={onClose} />);

        expect(field("account_name").value).toBe("");
    });

    // ---- Closing ----

    describe("closing", () => {
        it("calls onClose when CANCEL is clicked", () => {
            renderModal();

            fireEvent.click(screen.getByText("CANCEL"));

            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it("calls onClose when the overlay is clicked", () => {
            renderModal();

            fireEvent.click(screen.getByTestId("overlay"));

            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it("does not close when clicking inside the modal container", () => {
            renderModal();

            fireEvent.click(screen.getByTestId("container"));

            expect(onClose).not.toHaveBeenCalled();
        });
    });

    // ---- Submitting: add ----

    describe("submitting a new account", () => {
        it("dispatches addAccount with a cleaned payload and closes on success", async () => {
            renderModal();

            change("account_name", "  Petty Cash  ");
            change("account_code", "  1005  ");
            change("parent_account", "10");
            change("opening_balance", "250.5");
            change("description", "Small expenses");
            submitForm();

            await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));

            expect(addAccount).toHaveBeenCalledWith({
                account_type: "asset",
                account_name: "Petty Cash",
                account_code: "1005",
                parent_account: 10,
                category: "current_asset",
                opening_balance: "250.50",
                opening_balance_type: "debit",
                status: "active",
                description: "Small expenses",
            });
            expect(editAccount).not.toHaveBeenCalled();
        });

        it("sends parent_account null when none is selected", async () => {
            renderModal();

            change("account_name", "Petty Cash");
            submitForm();

            await waitFor(() => expect(addAccount).toHaveBeenCalled());
            expect(addAccount.mock.calls[0][0].parent_account).toBeNull();
        });

        it("sends opening_balance '0.00' when the field is empty", async () => {
            renderModal();

            change("account_name", "Petty Cash");
            change("opening_balance", "");
            submitForm();

            await waitFor(() => expect(addAccount).toHaveBeenCalled());
            expect(addAccount.mock.calls[0][0].opening_balance).toBe("0.00");
        });

        it("uses the type-specific defaults when the type was changed", async () => {
            renderModal();

            change("account_type", "liability");
            change("account_name", "Loan");
            submitForm();

            await waitFor(() => expect(addAccount).toHaveBeenCalled());
            expect(addAccount).toHaveBeenCalledWith(
                expect.objectContaining({
                    account_type: "liability",
                    category: "current_liability",
                    opening_balance_type: "credit",
                })
            );
        });

        it("shows 'SAVING...' and disables the button while the request is pending", async () => {
            let resolveRequest;
            unwrapImpl = () =>
                new Promise((resolve) => {
                    resolveRequest = resolve;
                });
            renderModal();

            change("account_name", "Petty Cash");
            submitForm();

            const savingButton = (await screen.findByText("SAVING...")).closest("button");
            expect(savingButton).toBeDisabled();
            expect(onClose).not.toHaveBeenCalled();

            await act(async () => {
                resolveRequest({});
            });

            await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
            expect(screen.getByText("SAVE ACCOUNT").closest("button")).not.toBeDisabled();
        });
    });

    // ---- Submitting: edit ----

    describe("submitting an edited account", () => {
        it("dispatches editAccount with the id and payload and closes on success", async () => {
            renderModal({ account: editingAccount });

            change("account_name", "Main Bank");
            submitForm();

            await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));

            expect(editAccount).toHaveBeenCalledWith({
                id: 11,
                accountData: {
                    account_type: "asset",
                    account_name: "Main Bank",
                    account_code: "1002",
                    parent_account: 10,
                    category: "current_asset",
                    opening_balance: "500.00",
                    opening_balance_type: "debit",
                    status: "active",
                    description: "Main bank",
                },
            });
            expect(addAccount).not.toHaveBeenCalled();
        });
    });

    // ---- Submit errors ----

    describe("API errors", () => {
        const submitWithError = async (error) => {
            unwrapImpl = () => Promise.reject(error);
            renderModal();

            change("account_name", "Petty Cash");
            submitForm();

            await waitFor(() => expect(clearAccountError).toHaveBeenCalledTimes(1));
        };

        it("shows a string error", async () => {
            await submitWithError("Something broke");

            expect(screen.getByText("Something broke")).toBeInTheDocument();
        });

        it("shows error.detail", async () => {
            await submitWithError({ detail: "Not allowed" });

            expect(screen.getByText("Not allowed")).toBeInTheDocument();
        });

        it("formats field errors as 'field name: message'", async () => {
            await submitWithError({
                account_code: ["Already exists."],
                account_name: ["Required", "Too short"],
            });

            expect(screen.getByText("account code: Already exists.")).toBeInTheDocument();
            expect(screen.getByText("account name: Required Too short")).toBeInTheDocument();
        });

        it("keeps the modal open, clears the store error and stops saving", async () => {
            await submitWithError({ detail: "Not allowed" });

            expect(onClose).not.toHaveBeenCalled();
            expect(clearAccountError).toHaveBeenCalledTimes(1);
            expect(screen.getByText("SAVE ACCOUNT").closest("button")).not.toBeDisabled();
        });

        it("clears the previous errors on the next submit attempt", async () => {
            await submitWithError({ detail: "Not allowed" });
            expect(screen.getByText("Not allowed")).toBeInTheDocument();

            unwrapImpl = () => Promise.resolve({});
            submitForm();

            await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
            expect(screen.queryByText("Not allowed")).not.toBeInTheDocument();
        });

        it("shows no error block when there are no errors", () => {
            renderModal();

            expect(screen.queryByText(/Not allowed/)).not.toBeInTheDocument();
        });
    });
});