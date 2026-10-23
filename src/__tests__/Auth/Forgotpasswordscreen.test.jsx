/**
 * src/__tests__/Auth/ForgotPasswordScreen.test.jsx
 *
 * Vitest + React Testing Library test suite for ForgotPasswordScreen.
 * Assumed component path: src/Pages/login/Login/ForgotPasswordScreen.jsx
 * (adjust the import below if the real filename/location differs)
 */

import React from "react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom"; // remove if already pulled in via a global setup file

// ---- Hoisted mock handles ---------------------------------------------
const { mockNavigate } = vi.hoisted(() => ({
    mockNavigate: vi.fn(),
}));

// ---- Mock static assets -------------------------------------------------
vi.mock("../../assets/login.svg", () => ({ default: "login-illustration.svg" }));
vi.mock("../../assets/logo3.svg", () => ({ default: "logo.svg" }));

// ---- Mock axios -----------------------------------------------------------
vi.mock("axios", () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
    },
}));

// ---- Mock react-router-dom's useNavigate (keep everything else real) ------
vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// ---- Mock BASE_URL ----------------------------------------------------------
vi.mock("../../services/api", () => ({
    BASE_URL: "http://localhost:8000",
}));

import axios from "axios";
import ForgotPasswordScreen from "../../Pages/login/Login/Forgetpasswordscreen";

// ---- Helpers ----------------------------------------------------------------
const renderComponent = () =>
    render(
        <MemoryRouter>
            <ForgotPasswordScreen />
        </MemoryRouter>
    );

beforeEach(() => {
    vi.clearAllMocks();
    window.sessionStorage.clear();
});

afterEach(() => {
    vi.useRealTimers();
});

// ------------------------------------------------------------------------------
describe("ForgotPasswordScreen", () => {
    test("renders the core UI elements", () => {
        renderComponent();

        expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();
        expect(
            screen.getByText(/enter your email and we'll send you a reset link/i)
        ).toBeInTheDocument();
        expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /send reset link/i })
        ).toBeInTheDocument();
        expect(screen.getByText(/back to log in/i)).toBeInTheDocument();
    });

    test("does not show an error message initially", () => {
        renderComponent();
        expect(screen.queryByText(/failed to send otp/i)).not.toBeInTheDocument();
    });

    test("lets the user type into the email field", async () => {
        renderComponent();
        const user = userEvent.setup();

        const emailInput = screen.getByLabelText(/^email$/i);
        await user.type(emailInput, "jane@example.com");

        expect(emailInput).toHaveValue("jane@example.com");
    });

    test("email field is required", () => {
        renderComponent();
        expect(screen.getByLabelText(/^email$/i)).toBeRequired();
    });

    test("shows a loading state while the request is in flight", async () => {
        let resolveRequest;
        axios.post.mockReturnValueOnce(
            new Promise((resolve) => {
                resolveRequest = resolve;
            })
        );

        renderComponent();
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/^email$/i), "jane@example.com");
        await user.click(screen.getByRole("button", { name: /send reset link/i }));

        expect(screen.getByRole("button", { name: /sending\.\.\./i })).toBeDisabled();

        resolveRequest({ data: {} });

        await waitFor(() =>
            expect(screen.queryByRole("button", { name: /sending\.\.\./i })).not.toBeInTheDocument()
        );
    });

    test("on success: calls the API, stores the email, shows the success message, and navigates to /otp after the delay", async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        const user = userEvent.setup({
            advanceTimers: vi.advanceTimersByTime,
        });

        axios.post.mockResolvedValueOnce({ data: {} });

        renderComponent();
        await user.type(screen.getByLabelText(/^email$/i), "jane@example.com");
        await user.click(screen.getByRole("button", { name: /send reset link/i }));

        await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
        expect(axios.post).toHaveBeenCalledWith(
            "http://localhost:8000/api/forgot-password/send-otp/",
            { email: "jane@example.com" }
        );

        // Success message replaces the form
        expect(
            await screen.findByText(/check your inbox for a reset link/i)
        ).toBeInTheDocument();
        expect(screen.queryByLabelText(/^email$/i)).not.toBeInTheDocument();

        expect(window.sessionStorage.getItem("resetEmail")).toBe("jane@example.com");

        // Navigation happens after a 1s timeout
        expect(mockNavigate).not.toHaveBeenCalled();

        await vi.advanceTimersByTimeAsync(1000);

        expect(mockNavigate).toHaveBeenCalledWith("/otp", {
            state: { email: "jane@example.com" },
        });
    });

    test("displays a server-provided error message on failure", async () => {
        axios.post.mockRejectedValueOnce({
            response: { data: { detail: "No account found with that email" } },
        });

        renderComponent();
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/^email$/i), "nobody@example.com");
        await user.click(screen.getByRole("button", { name: /send reset link/i }));

        expect(
            await screen.findByText(/no account found with that email/i)
        ).toBeInTheDocument();

        expect(mockNavigate).not.toHaveBeenCalled();
        expect(window.sessionStorage.getItem("resetEmail")).toBeNull();
        // Form should still be visible since success was never set
        expect(screen.getByLabelText(/^email$/i)).toBeInTheDocument();
    });

    test("falls back to a generic error message when the server gives no detail", async () => {
        axios.post.mockRejectedValueOnce(new Error("Network Error"));

        renderComponent();
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/^email$/i), "jane@example.com");
        await user.click(screen.getByRole("button", { name: /send reset link/i }));

        expect(
            await screen.findByText(/failed to send otp\. please try again\./i)
        ).toBeInTheDocument();
    });

    test("re-enables the submit button after a failed request", async () => {
        axios.post.mockRejectedValueOnce({
            response: { data: { detail: "Something went wrong" } },
        });

        renderComponent();
        const user = userEvent.setup();

        await user.type(screen.getByLabelText(/^email$/i), "jane@example.com");
        await user.click(screen.getByRole("button", { name: /send reset link/i }));

        await waitFor(() =>
            expect(
                screen.getByRole("button", { name: /^send reset link$/i })
            ).not.toBeDisabled()
        );
    });
});

