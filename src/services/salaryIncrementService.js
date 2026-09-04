import API from "../services/api"; // adjust path if needed

// 🔹 List increments
export const listSalaryIncrementService = async (employeeId) => {
  const response = await API.get(
    `/salary-increment/${employeeId}/`
  );
  return response.data;
};

// 🔹 Add increment
export const addSalaryIncrementService = async (employeeId, data) => {
  const response = await API.post(
    `/salary-increment/${employeeId}/`,
    data
  );
  return response.data;
};