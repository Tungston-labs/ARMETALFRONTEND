// import React, { useState } from "react";
// import girlIllustrationUrl from "../../../assets/login.svg";
// import logo from "../../../assets/logo3.svg";
// import {
//     PageBackground,
//     PageWrapper,
//     LeftPanel,
//     Logo,
//     HeroText,
//     AccentDivider,
//     IllustrationArea,
//     RightPanel,
//     FormCard,
//     Welcome,
//     FieldGroup,
//     InputWrapper,
//     Input,
//     ToggleVisibility,
//     ForgotPassword,
//     RememberRow,
//     LoginButton,
//     ErrorText,
// } from "./LoginScreen.styles";
// import { PiEye, PiEyeSlash } from "react-icons/pi";

// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { login } from "../../../Redux/authSlice";
// import { BASE_URL } from "../../../services/api";

// const Loginscreen = () => {
//     const [username, setUsername] = useState("");
//     const [password, setPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const [rememberMe, setRememberMe] = useState(false);
//     const [error, setError] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);

//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(null);
//         setIsLoading(true);

//         try {
//             const response = await axios.post(`${BASE_URL}/api/token/`, {
//                 username,
//                 password,
//             });

//             const { access, refresh, user } = response.data;

//             localStorage.setItem("accessToken", access);
//             localStorage.setItem("refreshToken", refresh);
//             localStorage.setItem("user", JSON.stringify(user));

//             dispatch(
//                 login({
//                     userName: user.username,
//                     accessToken: access,
//                     user,
//                 })
//             );

//             if (user.is_superadmin) navigate("/dashboard");
//             else navigate("/");
//         } catch (err) {
//             console.log(err);
//             setError(
//                 err.response?.data?.detail || "Login failed. Check credentials."
//             );
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <PageBackground>
//             <PageWrapper>

//                 <LeftPanel>
//                     <Logo>
//                         <img src={logo} alt="Logo" />
//                     </Logo>

//                     <HeroText>
//                         <h1>
//                             Manage People.
//                             <br />
//                             Drive Productivity.
//                         </h1>

//                         <p>
//                             Make everyday HR management faster, easier, and more efficient.
//                         </p>
//                     </HeroText>

//                     <IllustrationArea>
//                         <div className="dot-grid" />
//                         <img
//                             src={girlIllustrationUrl}
//                             className="girl-illustration"
//                             alt=""
//                         />
//                     </IllustrationArea>
//                 </LeftPanel>

//                 {/* ---------- RIGHT: login form ---------- */}
//                 <RightPanel>
//                     <FormCard onSubmit={handleSubmit}>
//                         <Welcome>
//                             <h2>Welcome back!</h2>
//                             <p>Please log in to your account</p>
//                         </Welcome>

//                         {error && <ErrorText>{error}</ErrorText>}

//                         <FieldGroup>
//                             <label htmlFor="username">Username</label>
//                             <InputWrapper>
//                                 <Input
//                                     id="username"
//                                     type="text"
//                                     value={username}
//                                     onChange={(e) => setUsername(e.target.value)}
//                                     autoComplete="username"
//                                     required
//                                 />
//                             </InputWrapper>
//                         </FieldGroup>

//                         <FieldGroup>
//                             <label htmlFor="password">Password</label>
//                             <InputWrapper>
//                                 <Input
//                                     id="password"
//                                     type={showPassword ? "text" : "password"}
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     autoComplete="current-password"
//                                     required
//                                 />
//                                 <ToggleVisibility
//                                     type="button"
//                                     onClick={() => setShowPassword((s) => !s)}
//                                     aria-label={showPassword ? "Hide password" : "Show password"}
//                                 >
//                                     {showPassword ? <PiEyeSlash /> : <PiEye />}
//                                 </ToggleVisibility>
//                             </InputWrapper>
//                             <ForgotPassword to="/forget-screen">
//                                 Forgot password?
//                             </ForgotPassword>
//                         </FieldGroup>

//                         <RememberRow>
//                             <input
//                                 type="checkbox"
//                                 checked={rememberMe}
//                                 onChange={(e) => setRememberMe(e.target.checked)}
//                             />
//                             Remember me
//                         </RememberRow>

//                         <LoginButton type="submit" disabled={isLoading}>
//                             {isLoading ? "LOGGING IN..." : "LOG IN"}
//                         </LoginButton>
//                     </FormCard>
//                 </RightPanel>
//             </PageWrapper>
//         </PageBackground>
//     );
// };

// export default Loginscreen;