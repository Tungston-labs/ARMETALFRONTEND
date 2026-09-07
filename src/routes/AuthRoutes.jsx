import { Route } from "react-router-dom";

import LoginForm from "../Pages/login/Loginscreen.jsx";
import ForgetPasswordScreen from "../Pages/login/Login/Forgetpasswordscreen.jsx";
import OtpScreen from "../Pages/login/Login/Otpscreen.jsx";
import CreateNewPasswordScreen from "../Pages/login/Login/Createnewpasswordscreen.jsx";

const AuthRoutes = () => {
  return (
    <>
      <Route path="/login" element={<LoginForm />} />

      <Route
        path="/forget-screen"
        element={<ForgetPasswordScreen />}
      />

      <Route
        path="/otp"
        element={<OtpScreen />}
      />

      <Route
        path="/create-password"
        element={<CreateNewPasswordScreen />}
      />
    </>
  );
};

export default AuthRoutes;