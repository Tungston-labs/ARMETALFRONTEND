import React, { useState, useRef, useEffect } from "react";
import girlIllustrationUrl from "../../../assets/login.svg";
import logo from "../../../assets/logo3.svg";
import {
    PageBackground,
    PageWrapper,
    LeftPanel,
    Logo,
    HeroText,
    AccentDivider,
    IllustrationArea,
    RightPanel,
    FormCard,
    Welcome,
    FieldGroup,
    InputWrapper,
    Input,
    ForgotPassword,
    LoginButton,
    ErrorText,
} from "./LoginScreen.styles";

import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../../../services/api";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

const OtpScreen = () => {
    const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
    const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const inputsRef = useRef([]);

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || sessionStorage.getItem("resetEmail");

    useEffect(() => {
        if (secondsLeft <= 0) return;
        const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
        return () => clearInterval(timer);
    }, [secondsLeft]);

    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    useEffect(() => {
        if (!email) {
            setError("Email not found. Please go back and try again.");
        }
    }, [email]);

    const focusInput = (index) => {
        inputsRef.current[index]?.focus();
    };

    const handleChange = (index, rawValue) => {
        const value = rawValue.replace(/[^0-9]/g, "");
        if (!value) {
            setDigits((prev) => {
                const next = [...prev];
                next[index] = "";
                return next;
            });
            return;
        }

        // Handle pasted multi-character strings gracefully.
        const chars = value.split("");
        setDigits((prev) => {
            const next = [...prev];
            chars.forEach((char, i) => {
                if (index + i < OTP_LENGTH) next[index + i] = char;
            });
            return next;
        });

        const nextIndex = Math.min(index + chars.length, OTP_LENGTH - 1);
        focusInput(nextIndex);
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            focusInput(index - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = digits.join("");
        if (code.length !== OTP_LENGTH) return;

        setError(null);
        setIsLoading(true);

        try {
            const response = await axios.post(
                `${BASE_URL}/api/forgot-password/verify-otp/`,
                {
                    email,
                    otp: code,
                }
            );

            // Pass along whatever the backend returns (if anything)
            // so the next screen (create new password) can use it.
            navigate("/create-password", {
                state: { email, ...response.data },
            });
        } catch (err) {
            console.log(err);
            setError(
                err.response?.data?.detail || "Invalid or expired code. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (secondsLeft > 0) return;

        setError(null);

        try {
            await axios.post(`${BASE_URL}/api/forgot-password/send-otp/`, {
                email,
            });

            setDigits(Array(OTP_LENGTH).fill(""));
            focusInput(0);
            setSecondsLeft(RESEND_SECONDS);
        } catch (err) {
            console.log(err);
            setError(
                err.response?.data?.detail || "Failed to resend code. Please try again."
            );
        }
    };

    const code = digits.join("");

    return (
        <PageBackground>
            <PageWrapper>

                <LeftPanel>
                    <Logo>
                        <img src={logo} alt="Logo" />
                    </Logo>

                    <HeroText>
                        <h1>
                            Manage People.
                            <br />
                            Drive Productivity.
                        </h1>

                        <p>
                            Make everyday HR management faster, easier, and more efficient.
                        </p>
                    </HeroText>

                    <IllustrationArea>
                        <div className="dot-grid" />
                        <img
                            src={girlIllustrationUrl}
                            className="girl-illustration"
                            alt=""
                        />
                    </IllustrationArea>
                </LeftPanel>

                {/* ---------- RIGHT: OTP verification form ---------- */}
                <RightPanel>
                    <FormCard onSubmit={handleSubmit}>
                        <Welcome>
                            <h2>Verify your email</h2>
                            <p>
                                Enter the {OTP_LENGTH}-digit code we sent to{" "}
                                <strong>{email || "your email"}</strong>.
                            </p>
                        </Welcome>

                        {error && <ErrorText>{error}</ErrorText>}

                        <FieldGroup>
                            <label htmlFor="otp-0">Verification code</label>
                            <InputWrapper
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    justifyContent: "space-between",
                                }}
                            >
                                {digits.map((digit, index) => (
                                    <Input
                                        key={index}
                                        id={`otp-${index}`}
                                        ref={(el) => (inputsRef.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete={index === 0 ? "one-time-code" : "off"}
                                        maxLength={OTP_LENGTH}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        style={{
                                            textAlign: "center",
                                            width: "44px",
                                            padding: "10px 0",
                                        }}
                                    />
                                ))}
                            </InputWrapper>
                        </FieldGroup>

                        <LoginButton
                            type="submit"
                            disabled={isLoading || code.length !== OTP_LENGTH}
                        >
                            {isLoading ? "VERIFYING..." : "VERIFY"}
                        </LoginButton>

                        <ForgotPassword
                            as="button"
                            type="button"
                            onClick={handleResend}
                            disabled={secondsLeft > 0}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: secondsLeft > 0 ? "default" : "pointer",
                                opacity: secondsLeft > 0 ? 0.6 : 1,
                            }}
                        >
                            {secondsLeft > 0
                                ? `Resend code in ${secondsLeft}s`
                                : "Resend code"}
                        </ForgotPassword>
                    </FormCard>
                </RightPanel>
            </PageWrapper>
        </PageBackground>
    );
};

export default OtpScreen;