// services/companyServices.js
import API from "./api";

// GET company self
export const fetchCompanySelf = async () => {
  const response = await API.get("/company/self/");
  return response.data; // return object directly
};

// PATCH update company self (multipart/form-data)
export const updateCompanySelf = async (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const response = await API.patch("/company/self/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// POST: Create a Company (multipart/form-data)
export const createCompany = async (data) => {
  const response = await API.post("/create-company/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// GET: company detail by ID
export const fetchCompanyById = async (id) => {
  const response = await API.get(`/companies/${id}/`);
  return response.data;
};

// PATCH: Update company by ID (multipart/form-data)
export const updateCompany = async (id, data) => {
  const response = await API.patch(`/companies/${id}/`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

