// services/categoryServices.js
import API from "../api";

// GET: /api/finance/category/
export const fetchCategories = async (params = {}) => {
  const response = await API.get("/finance/category/", { params });
  return response.data;
};

// POST: /api/finance/category/
export const createCategory = async (categoryData) => {
  const response = await API.post(
    "/finance/category/",
    categoryData
  );

  return response.data;
};

// GET: /api/finance/category/{id}/
export const fetchCategoryById = async (id) => {
  const response = await API.get(
    `/finance/category/${id}/`
  );

  return response.data;
};

// PUT: /api/finance/category/{id}/
export const updateCategory = async (id, categoryData) => {
  const response = await API.put(
    `/finance/category/${id}/`,
    categoryData
  );

  return response.data;
};

// PATCH: /api/finance/category/{id}/
export const patchCategory = async (id, categoryData) => {
  const response = await API.patch(
    `/finance/category/${id}/`,
    categoryData
  );

  return response.data;
};

// DELETE: /api/finance/category/{id}/
export const deleteCategory = async (id) => {
  const response = await API.delete(
    `/finance/category/${id}/`
  );

  return response.data;
};

// GET: /api/finance/category/parents/
export const fetchParentCategories = async (params = {}) => {
  const response = await API.get("/finance/category/parents/", { params });
  return response.data;
};