/**
 * src/__tests__/Auth/OtpScreen.test.jsx
 *
 * Vitest + React Testing Library test suite for OtpScreen.
 * Assumed component path: src/Pages/login/Login/OtpScreen.jsx
 * (adjust the import below if the real filename/location differs)
 */

import React from "react";
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
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

// ---- Mock react-router-dom's useNavigate only; keep useLocation/MemoryRouter real ----
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
import OtpScreen from "../../Pages/login/Login/Otpscreen";

const SEND_OTP_URL = "http://localhost:8000/api/forgot-password/send-otp/";
const VERIFY_OTP_URL = "http://localhost:8000/api/forgot-password/verify-otp/";

// ---- Helpers ----------------------------------------------------------------
const renderComponent = (email = "jane@example.com") =>
    render(
        <MemoryRouter
            initialEntries={[
                { pathname: "/otp", state: email ? { email } : undefined },
            ]}
        >
            <OtpScreen />
        </MemoryRouter>
    );

// Clicks each OTP box explicitly before typing its single digit, rather than
// typing the whole string into box 0 and relying on user-event to follow the
// component's own auto-advance focus changes (that pairing is racy).
const typeCode = async (user, code) => {
    const inputs = screen.getAllByRole("textbox");
    for (let i = 0; i < code.length; i++) {
        await user.click(inputs[i]);
        await user.keyboard(code[i]);
    }
};

beforeEach(() => {
    vi.clearAllMocks();
    window.sessionStorage.clear();
});

afterEach(() => {
    vi.useRealTimers();
});

// ------------------------------------------------------------------------------
describe("OtpScreen", () => {
    test("renders the core UI and shows the target email", () => {
        renderComponent("jane@example.com");

        expect(screen.getByText(/verify your email/i)).toBeInTheDocument();
        expect(screen.getByText("jane@example.com")).toBeInTheDocument();
        expect(screen.getAllByRole("textbox")).toHaveLength(6);
        expect(screen.getByRole("button", { name: /^verify$/i })).toBeDisabled();
        expect(
            screen.getByRole("button", { name: /resend code in 30s/i })
        ).toBeDisabled();
    });

    test("shows an error when no email is available anywhere", () => {
        renderComponent(null); // no location.state, no sessionStorage entry
        expect(
            screen.getByText(/email not found\. please go back and try again\./i)
        ).toBeInTheDocument();
    });

    test("falls back to sessionStorage email when location state has none", () => {
        window.sessionStorage.setItem("resetEmail", "fallback@example.com");
        renderComponent(null);

        expect(screen.getByText("fallback@example.com")).toBeInTheDocument();
        expect(screen.queryByText(/email not found/i)).not.toBeInTheDocument();
    });

    test("auto-focuses the first OTP box on mount", () => {
        renderComponent();
        const inputs = screen.getAllByRole("textbox");
        expect(inputs[0]).toHaveFocus();
    });

    test("typing digits fills the boxes in order and enables the verify button once all 6 are entered", async () => {
        renderComponent();
        const user = userEvent.setup();

        await typeCode(user, "123");
        expect(screen.getByRole("button", { name: /^verify$/i })).toBeDisabled();

        const inputs = screen.getAllByRole("textbox");
        await user.click(inputs[3]);
        await user.keyboard("4");
        await user.click(inputs[4]);
        await user.keyboard("5");
        await user.click(inputs[5]);
        await user.keyboard("6");

        const filled = screen.getAllByRole("textbox").map((el) => el.value);
        expect(filled).toEqual(["1", "2", "3", "4", "5", "6"]);
        expect(screen.getByRole("button", { name: /^verify$/i })).not.toBeDisabled();
    });

    test("backspace on an empty box moves focus to the previous box", async () => {
        renderComponent();
        const user = userEvent.setup();

        await typeCode(user, "12");
        const inputs = screen.getAllByRole("textbox");
        // Focus is now on box index 2 (empty). Backspace should move focus to box 1.
        await user.keyboard("{Backspace}");
        expect(inputs[1]).toHaveFocus();
    });

    test("submits the code, calls the API, and navigates to /create-password with the response data", async () => {
        axios.post.mockResolvedValueOnce({ data: { resetToken: "abc123" } });

        renderComponent("jane@example.com");
        const user = userEvent.setup();

        await typeCode(user, "123456");
        await user.click(screen.getByRole("button", { name: /^verify$/i }));

        await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
        expect(axios.post).toHaveBeenCalledWith(VERIFY_OTP_URL, {
            email: "jane@example.com",
            otp: "123456",
        });

        await waitFor(() =>
            expect(mockNavigate).toHaveBeenCalledWith("/create-password", {
                state: { email: "jane@example.com", resetToken: "abc123" },
            })
        );
    });

    test("shows a server-provided error message on an invalid code", async () => {
        axios.post.mockRejectedValueOnce({
            response: { data: { detail: "Code expired" } },
        });

        renderComponent();
        const user = userEvent.setup();

        await typeCode(user, "999999");
        await user.click(screen.getByRole("button", { name: /^verify$/i }));

        expect(await screen.findByText(/code expired/i)).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    test("falls back to a generic error message when the server gives no detail", async () => {
        axios.post.mockRejectedValueOnce(new Error("Network Error"));

        renderComponent();
        const user = userEvent.setup();

        await typeCode(user, "111111");
        await user.click(screen.getByRole("button", { name: /^verify$/i }));

        expect(
            await screen.findByText(/invalid or expired code\. please try again\./i)
        ).toBeInTheDocument();
    });

    test("resend button becomes enabled once the countdown reaches zero", () => {
        vi.useFakeTimers();
        renderComponent();

        expect(
            screen.getByRole("button", { name: /resend code in 30s/i })
        ).toBeDisabled();

        act(() => {
            vi.advanceTimersByTime(30000);
        });

        expect(
            screen.getByRole("button", { name: /^resend code$/i })
        ).not.toBeDisabled();
    });

    test("clicking resend after the countdown calls the send-otp API and resets digits and timer", async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

        axios.post.mockResolvedValueOnce({ data: {} }); // resend call

        renderComponent("jane@example.com");

        await typeCode(user, "12");

        act(() => {
            vi.advanceTimersByTime(30000);
        });

        await user.click(screen.getByRole("button", { name: /^resend code$/i }));

        await waitFor(() =>
            expect(axios.post).toHaveBeenCalledWith(SEND_OTP_URL, {
                email: "jane@example.com",
            })
        );

        await waitFor(() => {
            const inputs = screen.getAllByRole("textbox");
            expect(inputs.map((el) => el.value)).toEqual(["", "", "", "", "", ""]);
        });

        expect(
            await screen.findByRole("button", { name: /resend code in 30s/i })
        ).toBeDisabled();
    });

    test("resend shows a server-provided error message on failure", async () => {
        vi.useFakeTimers({ shouldAdvanceTime: true });
        const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

        axios.post.mockRejectedValueOnce({
            response: { data: { detail: "Too many requests" } },
        });

        renderComponent("jane@example.com");

        act(() => {
            vi.advanceTimersByTime(30000);
        });

        await user.click(screen.getByRole("button", { name: /^resend code$/i }));

        expect(await screen.findByText(/too many requests/i)).toBeInTheDocument();
    });
});