// services/dailyTaskServices.js
import API from "./api"; // Your Axios instance with baseURL & headers

// Fetch all employees with optional params
export const fetchEmployees = async (params = {}) => {
  const response = await API.get('/employeelist/', { params });
  return response.data || [];  // just return the array directly
};

// Fetch tasks for a specific employee and date
export const fetchTasksByEmployeeAndDate = async (employeeId, date = null) => {
  const response = await API.get(`/admin/tasks/employee/${employeeId}/`, {
    params: date ? { date } : {}   // only send date if selected
  });

  return response.data.results || [];
};

  
