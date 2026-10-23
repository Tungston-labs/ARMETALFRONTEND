import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const RequireAuth = () => {
  const accessTokenFromRedux = useSelector((state) => state.auth.accessToken);

  // Check both localStorage and sessionStorage
  const accessTokenFromStorage =
    localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

  const isAuthenticated = accessTokenFromRedux || accessTokenFromStorage;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
