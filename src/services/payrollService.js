// services/payrollService.js
import API from "./api"; // Axios instance

// 1. Fetch payroll data
export const fetchPayrollData = async (month, year, search = "", page = 1, department = "") => {
  try {
    const response = await API.get("/payroll/", {
      params: { month, year, search, page, department }, // 👈 include department
    });
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || error.message || "Something went wrong while fetching payroll!";
    throw new Error(msg);
  }
};

// 2. Create or update payroll records for selected employees
export const createOrUpdatePayroll = async ({ month, year, employee_ids, status }) => {
  try {
    const response = await API.post("/payroll/", {
      month,
      year,
      employee_ids,
      status,
    });
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || error.message || "Failed to create or update payroll!";
    throw new Error(msg);
  }
};
// 3. Verify payroll records by 2 HR admins
export const verifyPayroll = async ({ employeeId, month, year }) => {
  try {
    const token = localStorage.getItem("token"); // or wherever you store JWT
    const response = await API.post(
      `/payroll/${employeeId}/verify/`,
      { month, year },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // important!
        },
      }
    );
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || error.message || "Error verifying payroll!";
    throw new Error(msg);
  }
};


// 4. Update payroll status for a single employee
export const updateEmployeePayrollStatus = async ({ employeeId, month, year, status }) => {
  try {
    const response = await API.patch(`/payroll/${employeeId}/status/update/`, {
      month,
      year,
      status,
    });
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || error.message || "Error updating payroll status!";
    throw new Error(msg);
  }
};

// 5. Get payroll detail by record ID
export const getPayrollDetailById = async (id) => {
  try {
    const response = await API.get(`/payroll/record/${id}/`);
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || error.message || "Error fetching payroll detail!";
    throw new Error(msg);
  }
};

export const updateEmployeeIncentive = async ({ employeeId, month, year, incentive_amount, incentive_type, incentive_reason }) => {
  try {
 const response = await API.patch(`/payroll/incentive/${employeeId}/`, {  
      month,
      year,
      incentive_amount,
      incentive_type,
      incentive_reason,
    });
    return response.data;
  } catch (error) {
    const msg = error.response?.data?.error || error.message || "Error updating incentive!";
    throw new Error(msg);
  }
};



export const updateEmployeeDeduction = async ({
  employeeId,
  month,
  year,
  deduction_amount,
  deduction_type,
  deduction_reason,
}) => {
  try {
    const response = await API.patch(
      `/payroll/deduction/${employeeId}/`,
      {
        month,
        year,
        deduction_amount,
        deduction_type,
        deduction_reason,
      }
    );

    return response.data;
  } catch (error) {
    const msg =
      error.response?.data?.error ||
      error.message ||
      "Error updating deduction!";

    throw new Error(msg);
  }
};
export const fetchPayrollCounts = async () => {
  const response = await API.get("/payroll-counts/");
  return response.data;
};
