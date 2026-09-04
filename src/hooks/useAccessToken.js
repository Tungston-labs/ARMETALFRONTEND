
export const getAccessToken = () => {
  try {
    const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
    return token;
  } catch (e) {
    return null;
  }
};
