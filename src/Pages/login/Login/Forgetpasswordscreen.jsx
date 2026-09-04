import React, { useState } from "react";
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
    ForgotPassword as BackToLoginLink,
    LoginButton,
    ErrorText,
} from "./LoginScreen.styles";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../services/api";

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await axios.post(`${BASE_URL}/api/forgot-password/send-otp/`, {
                email,
            });

            setSuccess(true);
            sessionStorage.setItem("resetEmail", email);

            setTimeout(() => {
                navigate("/otp", { state: { email } });
            }, 1000);
        } catch (err) {
            setError(
                err.response?.data?.detail || "Failed to send OTP. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

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

                {/* ---------- RIGHT: forgot password form ---------- */}
                <RightPanel>
                    <FormCard onSubmit={handleSubmit}>
                        <Welcome>
                            <h2>Forgot password?</h2>
                            <p>
                                {success
                                    ? "Check your inbox for a reset link"
                                    : "Enter your email and we'll send you a reset link"}
                            </p>
                        </Welcome>

                        {error && <ErrorText>{error}</ErrorText>}

                        {!success && (
                            <>
                                <FieldGroup>
                                    <label htmlFor="email">Email</label>
                                    <InputWrapper>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            autoComplete="off"
                                            required
                                        />
                                    </InputWrapper>
                                </FieldGroup>

                                <LoginButton type="submit" disabled={isLoading}>
                                    {isLoading ? "SENDING..." : "SEND RESET LINK"}
                                </LoginButton>
                            </>
                        )}

                        <BackToLoginLink to="/log" style={{ textAlign: "center", marginTop: "1rem" }}>
                            Back to log in
                        </BackToLoginLink>
                    </FormCard>
                </RightPanel>
            </PageWrapper>
        </PageBackground>
    );
};

export default ForgotPasswordScreen;