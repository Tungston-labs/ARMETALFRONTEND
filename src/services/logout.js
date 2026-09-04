import API from "./api"; 
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      await API.post("/logout/", {
        refresh: refreshToken,
      });

      localStorage.clear();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data || error.message);
      localStorage.clear();
      navigate("/login");
    }
  };

  return handleLogout;
};
