import axios from "axios";
import { setupErrorInterceptor } from "../utils/Errorhandling/Errorhandling";

export const BASE_URL = String(
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
).replace(/\/+$/, "");

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Let the browser set multipart/form-data with the correct boundary itself
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 1) Token refresh handling (runs first)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      (localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken"))
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");
        const res = await axios.post(`${BASE_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        const newRefreshToken = res.data.refresh;

        if (localStorage.getItem("refreshToken")) {
          localStorage.setItem("accessToken", newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }
        } else {
          sessionStorage.setItem("accessToken", newAccessToken);
          if (newRefreshToken) {
            sessionStorage.setItem("refreshToken", newRefreshToken);
          }
        }

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshErr) {
        console.error("Refresh token failed:", refreshErr);

        // Only log the user out if the server actually rejected the refresh token.
        // If it was just a network problem, keep the session so they can retry.
        const status = refreshErr.response?.status;
        if (status === 400 || status === 401) {
          localStorage.clear();
          window.location.href = "/login";
        }
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

// 2) Friendly error popups (must be added AFTER the refresh interceptor)
setupErrorInterceptor(API);

export default API;