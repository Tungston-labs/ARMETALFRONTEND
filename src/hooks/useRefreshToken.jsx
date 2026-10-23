// src/hooks/useRefreshToken.js
import { useDispatch } from "react-redux";
import { setAccessToken, logout } from "../Redux/authSlice";
import API from "../services/api"; // your custom Axios instance

const useRefreshToken = () => {
  const dispatch = useDispatch();

  const refresh = async () => {
    try {
      const response = await API.post("/admin/auth/refresh", {}, { withCredentials: true });

      const accessToken = response?.data?.accessToken;
      if (accessToken) {
        dispatch(setAccessToken({ accessToken }));
        localStorage.setItem("accessToken", accessToken); // optional: keep for persistence
        return accessToken;
      }

      return null;
    } catch (error) {
      dispatch(logout()); // clear Redux state
      localStorage.removeItem("accessToken");
      return null;
    }
  };

  return refresh;
};

export default useRefreshToken;
