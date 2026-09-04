import axios from "axios";
import {toast} from "react-toastify";

export const BASE_URL=import.meta.env.VITE_API_BASE_URL
console.log(BASE_URL);

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      (localStorage.getItem("refreshToken")|| sessionStorage.getItem("refreshToken"))
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken")|| sessionStorage.getItem("refreshToken");
        const res = await axios.post(`${BASE_URL}/api/token/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        const newRefreshToken = res.data.refresh; 

        if(localStorage.getItem("refreshToken")){
        localStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }
      }else{
        sessionStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken) {
          sessionStorage.setItem("refreshToken", newRefreshToken);
        }
      }
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshErr) {
        console.error("Refresh token failed:", refreshErr);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);


export default API;
