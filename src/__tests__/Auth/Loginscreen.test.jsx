/**
 * src/__tests__/Auth/Loginscreen.test.jsx
 *
 * Vitest + React Testing Library test suite for Loginscreen.
 * Actual component: src/Pages/login/Loginscreen.jsx
 */

import React from "react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom"; // remove this line if already pulled in via a global setup file

// ---- Hoisted mock handles (needed because vi.mock factories run before
//      the rest of this file, so plain `const x = vi.fn()` below wouldn't
//      be initialized in time) ------------------------------------------
const { mockDispatch, mockNavigate, mockLogin } = vi.hoisted(() => ({
    mockDispatch: vi.fn(),
    mockNavigate: vi.fn(),
    mockLogin: vi.fn((payload) => ({ type: "auth/login", payload })),
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

// ---- Mock react-redux's useDispatch (keep everything else real) -----------
vi.mock("react-redux", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useDispatch: () => mockDispatch,
    };
});

// ---- Mock react-router-dom's useNavigate (keep everything else real) ------
vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// ---- Mock the authSlice login action ---------------------------------------
vi.mock("../../Redux/authSlice", () => ({
    login: mockLogin,
}));

// ---- Mock BASE_URL ----------------------------------------------------------
vi.mock("../../services/api", () => ({
    BASE_URL: "http://localhost:8000",
}));

import axios from "axios";
import Loginscreen from "../../Pages/login/Loginscreen";

// ---- Helpers ----------------------------------------------------------------
const renderComponent = () =>
    render(
        <MemoryRouter>
            <Loginscreen />
        </MemoryRouter>
    );

const fillAndSubmit = async (username, password) => {
    const user = userEvent.setup();
    if (username !== undefined) {
        await user.type(screen.getByLabelText(/username/i), username);
    }
    if (password !== undefined) {
        await user.type(screen.getByLabelText(/^password$/i), password);
    }
    await user.click(screen.getByRole("button", { name: /log in/i }));
    return user;
};

beforeEach(() => {
    vi.clearAllMocks();
    window.localStorage.clear();
});

// ------------------------------------------------------------------------------
describe("Loginscreen", () => {
    test("renders the core UI elements", () => {
        renderComponent();

        expect(screen.getByText(/welcome back!/i)).toBeInTheDocument();
        expect(screen.getByText(/please log in to your account/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
        expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();
    });

    test("does not show an error message initially", () => {
        renderComponent();
        expect(screen.queryByText(/login failed/i)).not.toBeInTheDocument();
    });

    test("lets the user type into username and password fields", async () => {
        renderComponent();
        const user = userEvent.setup();

        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/^password$/i);

        await user.type(usernameInput, "johndoe");
        await user.type(passwordInput, "secret123");

        expect(usernameInput).toHaveValue("johndoe");
        expect(passwordInput).toHaveValue("secret123");
    });

    test("password field defaults to type='password' and toggles visibility", async () => {
        renderComponent();
        const user = userEvent.setup();

        const passwordInput = screen.getByLabelText(/^password$/i);
        expect(passwordInput).toHaveAttribute("type", "password");

        const toggleButton = screen.getByRole("button", { name: /show password/i });
        await user.click(toggleButton);

        expect(passwordInput).toHaveAttribute("type", "text");
        expect(screen.getByRole("button", { name: /hide password/i })).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /hide password/i }));
        expect(passwordInput).toHaveAttribute("type", "password");
    });

    test("shows a loading state while the request is in flight", async () => {
        let resolveRequest;
        axios.post.mockReturnValueOnce(
            new Promise((resolve) => {
                resolveRequest = resolve;
            })
        );

        renderComponent();
        await fillAndSubmit("johndoe", "secret123");

        expect(
            screen.getByRole("button", { name: /logging in\.\.\./i })
        ).toBeDisabled();

        resolveRequest({
            data: {
                access: "access-token",
                refresh: "refresh-token",
                user: { username: "johndoe", is_superadmin: false },
            },
        });

        await waitFor(() =>
            expect(
                screen.getByRole("button", { name: /^log in$/i })
            ).not.toBeDisabled()
        );
    });

    test("submits credentials, stores tokens, dispatches login, and navigates non-admins to '/'", async () => {
        axios.post.mockResolvedValueOnce({
            data: {
                access: "access-token",
                refresh: "refresh-token",
                user: { username: "johndoe", is_superadmin: false },
            },
        });

        renderComponent();
        await fillAndSubmit("johndoe", "secret123");

        await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
        expect(axios.post).toHaveBeenCalledWith(
            "http://localhost:8000/api/token/",
            { username: "johndoe", password: "secret123" }
        );

        await waitFor(() => {
            expect(window.localStorage.getItem("accessToken")).toBe("access-token");
            expect(window.localStorage.getItem("refreshToken")).toBe("refresh-token");
            expect(window.localStorage.getItem("user")).toBe(
                JSON.stringify({ username: "johndoe", is_superadmin: false })
            );
        });

        expect(mockLogin).toHaveBeenCalledWith({
            userName: "johndoe",
            accessToken: "access-token",
            user: { username: "johndoe", is_superadmin: false },
        });
        expect(mockDispatch).toHaveBeenCalled();

        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
    });

    test("navigates superadmin users to '/dashboard'", async () => {
        axios.post.mockResolvedValueOnce({
            data: {
                access: "access-token",
                refresh: "refresh-token",
                user: { username: "admin", is_superadmin: true },
            },
        });

        renderComponent();
        await fillAndSubmit("admin", "adminpass");

        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith("/dashboard")
        );
    });

    test("displays a server-provided error message on failed login", async () => {
        axios.post.mockRejectedValueOnce({
            response: { data: { detail: "Invalid username or password" } },
        });

        renderComponent();
        await fillAndSubmit("wronguser", "wrongpass");

        expect(
            await screen.findByText(/invalid username or password/i)
        ).toBeInTheDocument();

        expect(mockNavigate).not.toHaveBeenCalled();
        expect(mockDispatch).not.toHaveBeenCalled();
        expect(window.localStorage.getItem("accessToken")).toBeNull();
    });

    test("falls back to a generic error message when the server gives no detail", async () => {
        axios.post.mockRejectedValueOnce(new Error("Network Error"));

        renderComponent();
        await fillAndSubmit("someone", "somepass");

        expect(
            await screen.findByText(/login failed\. check credentials\./i)
        ).toBeInTheDocument();
    });

    test("re-enables the submit button after a failed login attempt", async () => {
        axios.post.mockRejectedValueOnce({
            response: { data: { detail: "Invalid credentials" } },
        });

        renderComponent();
        await fillAndSubmit("someone", "somepass");

        await waitFor(() =>
            expect(
                screen.getByRole("button", { name: /^log in$/i })
            ).not.toBeDisabled()
        );
    });

    test("requires username and password before native form submission proceeds", () => {
        renderComponent();
        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/^password$/i);

        expect(usernameInput).toBeRequired();
        expect(passwordInput).toBeRequired();
    });
});
