import { data } from "react-router-dom";
import API from "./api";

// 1. Create employee
export const createEmployee = async (formData) => {
  // console.log("submitting data", formData);
  console.log("📦 FormData being sent:");
for (let [key, value] of formData.entries()) {
  console.log(`${key}: ${value}`);
}


  try {
    const res = await API.post("/employees/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error creating employee:",
      error.response?.data || error.message
    );
    throw error;
  }
};



// 4. Get employees in my department
export const getMyDepartmentEmployees = async () => {
  const res = await API.get("/employees/my-department/");
  return res.data;
};


// 6. Update employee
export const updateEmployee = async (employeeId, data) => {
  try {
    const res = await API.patch(`/employees/${employeeId}/`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error updating employee:",
      error.response?.data || error.message
    );
    throw error;
  }
};
// services/employeeServices.js

export const deleteEmployee = async (employeeId) => {
  const response = await API.delete(`/employees/${employeeId}/`);
  return response.data;
};

// Service
export const fetchAllEmployees = async (
  page = 1,
  search = "",
  department_id = "",
  attendance_status = ""
) => {
  let url = `/employees/?page=${page}&search=${encodeURIComponent(search)}`;

  if (department_id) {
    url += `&department_id=${department_id}`;
  }

  if (attendance_status) {
    url += `&attendance_status=${attendance_status}`;
  }

  const response = await API.get(url);

  return response.data;
};

export const fetchUnpaginatedEmployees = async (
  search = "",
  department_id = ""
) => {
  let url = `/employeelist/?search=${search}`;
  if (department_id) {
    url += `&department_id=${department_id}`;
  }
  const response = await API.get(url);
  return response.data;
};

export const fetchEmployeeById = async (id) => {
  const res = await API.get(`/employees/${id}/`);
  return res.data;
};

export const fetchUpcomingExpiryEmployees = async (expiryType) => {
  const response = await API.get(
    `/employees/upcoming-expiry/?type=${expiryType}`
  );
  return response.data;
};


// 1. Get all bank payments for a specific employee
export const fetchBankPaymentsByEmployee = async (employeeId) => {
  try {
    const res = await API.get(`/employees/${employeeId}/bank-payments/`);
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error fetching bank payments:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ Create new bank payment
export const createBankPayment = async (employeeId, formData) => {
  return await API.post(`/employees/${employeeId}/bank-payments/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ✅ Update existing bank payment
export const updateBankPayment = async (employeeId, paymentId, formData) => {
  return await API.put(
    `/employees/${employeeId}/bank-payments/${paymentId}/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};


// 4. Delete a specific bank payment under a specific employee
export const deleteBankPayment = async (employeeId, paymentId) => {
  try {
    const res = await API.delete(
      `/employees/${employeeId}/bank-payments/${paymentId}/`
    );
    return res.data;
  } catch (error) {
    console.error(
      "❌ Error deleting bank payment:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const fetchAllBankPaymentsByEmployee = async (employeeId) => {
  const response = await API.get(`/employees/${employeeId}/bank-payments/`);
  return response.data;
};

export const uploadTempImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await API.post("/upload-image/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data; // { url: 'http://.../media/file.jpg' }
};

// 2. Save employee document URLs
export const saveEmployeeDocuments = async (employeeId, data) => {
  const res = await API.post(`/employees/${employeeId}/documents/`, data);
  console.log("object", res);
  return res.data;
};

// 3. Get employee documents
export const fetchEmployeeDocuments = async (employeeId) => {
  const res = await API.get(`/employees/${employeeId}/documents/`);
  return res.data;
};

// 4. Delete single document
export const deleteEmployeeDocument = async (docId) => {
  const res = await API.delete(`/documents/${docId}/`);
  return res.data;
};

// 5. Update single document (if needed)
export const updateEmployeeDocument = async (docId, data) => {
  const res = await API.put(`/documents/${docId}/`, data);
  return res.data;
};
export const updateEmployeeDocuments = async (id, formData) => {
  const response = await API.patch(`/employees/${id}/documents/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
export const listEmployeeDash = async (id) => {
  const response = await API.get(`/dashboard/employee/${id}/`);
  return response.data;
};


export const fetchEmployeeDashboard = async (id) => {
  const response = await API.get(`/dashboard/employee/${id}/`);
  return response.data;
};


export const sendEmail = async (data) => {
  const response = await API.post("/email/send/", data);
  return response.data;
};


export const fetchDeletedEmployees = async ({
  page = 1,
  search = "",
  department = "",
  deleted_date = "",
}) => {
  const params = {
    page,
  };

  if (search) {
    params.search = search;
  }

  if (department) {
    params.department = department;
  }

  if (deleted_date) {
    params.deleted_date = deleted_date;
  }

  const response = await API.get("/employees/deleted/", {
    params,
  });

  return response.data;
};


export const rehireEmployee = async (employeeId) => {
  const response = await API.post(
    `/employees/${employeeId}/rehire/`,
    {}
  );

  return response.data;
};

export const getDesignations = async () => {
  const response = await API.get("/employees/designations/");
  return response.data;
};

