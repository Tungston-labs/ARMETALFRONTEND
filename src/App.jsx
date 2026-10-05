import { Route, Routes } from "react-router-dom";
import "./index.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { login } from "./Redux/authSlice";

import RequireAuth from "./Components/RequireAuth.jsx";
import Layout from "./Components/layout/Layout.jsx";

import Loder from "./Components/Loader/Loder.jsx";

import {
  ErrorBoundary,
  OfflineBanner,
  NotFound,
} from "./utils/Errorhandling/Errorhandling.jsx";

import AuthRoutes from "./routes/AuthRoutes.jsx";
import HRRoutes from "./routes/HRRoutes.jsx";
import FinanceRoutes from "./routes/FinanceRoutes.jsx";
import SuperAdminRoutes from "./routes/SuperAdminRoutes.jsx";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const user =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user"));

    const accessToken =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");

    if (user && accessToken) {
      dispatch(
        login({
          userName: user.username,
          accessToken,
          user,
        })
      );
    }
  }, [dispatch]);

  return (
    <ErrorBoundary>
      {/* Shows "You're offline" bar on every page */}
      <OfflineBanner />

      <Routes>

        {/* ================= AUTH ROUTES ================= */}
        {AuthRoutes()}

        {/* ================= LOADER ================= */}
        <Route path="/loader" element={<Loder />} />

        {/* ================= PROTECTED ROUTES ================= */}
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Layout />}>

            {/* ================= HR MODULE ================= */}
            {HRRoutes()}

            {/* ================= FINANCE MODULE ================= */}
            {FinanceRoutes()}

            {/* ================= SUPER ADMIN MODULE ================= */}
            {SuperAdminRoutes()}

          </Route>
        </Route>

        {/* ================= 404 (wrong URL) ================= */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </ErrorBoundary>
  );
}

export default App;